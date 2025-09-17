<?php

namespace App\Services;

use DOMDocument;
use DOMNode;
use DOMXPath;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

class PostContentFetcher
{
    private Client $client;

    /**
     * 禁止直接輸出的 HTML 標籤，避免注入惡意內容。
     */
    private const DISALLOWED_TAGS = [
        'script',
        'iframe',
        'object',
        'embed',
        'form',
        'input',
        'button',
        'link',
        'meta',
        'style',
    ];

    public function __construct(?Client $client = null)
    {
        $this->client = $client ?? new Client([
            'timeout' => 10,
            'http_errors' => false,
            'allow_redirects' => true,
            'headers' => [
                'User-Agent' => 'CSIEWebContentFetcher/1.0 (+https://csie.example)',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            ],
        ]);
    }

    /**
     * 擷取遠端網頁並回傳整理後的資訊。
     */
    public function fetch(string $url): array
    {
        try {
            $response = $this->client->request('GET', $url);
        } catch (GuzzleException $exception) {
            throw new RuntimeException('無法連線至遠端來源，請稍後再試。', 0, $exception);
        }

        if ($response->getStatusCode() >= 400) {
            throw new RuntimeException('遠端來源回應異常（HTTP ' . $response->getStatusCode() . '）。');
        }

        $rawHtml = (string) $response->getBody();

        if (trim($rawHtml) === '') {
            throw new RuntimeException('遠端來源未提供可解析的內容。');
        }

        $document = $this->createDocument($rawHtml);
        $mainContent = $this->locateMainContent($document);

        if (trim($mainContent) === '') {
            $mainContent = $this->nodeToHtml($document->getElementsByTagName('body')->item(0));
        }

        $sanitized = $this->sanitizeHtml($mainContent);

        if (trim($sanitized) === '') {
            throw new RuntimeException('未能擷取到合適的主要內容，請改用手動輸入。');
        }

        return [
            'title' => $this->extractTitle($document),
            'description' => $this->extractDescription($document),
            'html' => $sanitized,
        ];
    }

    private function createDocument(string $html): DOMDocument
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        return $document;
    }

    private function locateMainContent(DOMDocument $document): string
    {
        $xpath = new DOMXPath($document);
        $queries = [
            '//article',
            '//main',
            '//*[@id="content"]',
            '//*[@id="main"]',
            '//*[contains(@class, "article")]',
            '//*[contains(@class, "content")]',
            '//*[contains(@class, "post")]',
        ];

        foreach ($queries as $query) {
            $nodes = $xpath->query($query);

            if (! $nodes instanceof \DOMNodeList || $nodes->length === 0) {
                continue;
            }

            foreach ($nodes as $node) {
                if ($this->textLength($node) >= 200) {
                    return $this->nodeToHtml($node);
                }
            }

            return $this->nodeToHtml($nodes->item(0));
        }

        return $this->nodeToHtml($document->getElementsByTagName('body')->item(0));
    }

    private function textLength(?DOMNode $node): int
    {
        return $node ? mb_strlen(trim($node->textContent ?? '')) : 0;
    }

    private function extractTitle(DOMDocument $document): ?string
    {
        $title = $document->getElementsByTagName('title')->item(0)?->textContent;

        return $title ? trim($title) : null;
    }

    private function extractDescription(DOMDocument $document): ?string
    {
        $xpath = new DOMXPath($document);
        $targets = [
            '//meta[@name="description"]/@content',
            '//meta[@property="og:description"]/@content',
            '//meta[@name="twitter:description"]/@content',
        ];

        foreach ($targets as $query) {
            $nodes = $xpath->query($query);

            if ($nodes instanceof \DOMNodeList && $nodes->length > 0) {
                $value = trim($nodes->item(0)?->nodeValue ?? '');

                if ($value !== '') {
                    return $value;
                }
            }
        }

        return null;
    }

    private function sanitizeHtml(string $html): string
    {
        $document = new DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        foreach (self::DISALLOWED_TAGS as $tag) {
            $nodes = $document->getElementsByTagName($tag);

            while ($nodes->length > 0) {
                $node = $nodes->item(0);
                $node?->parentNode?->removeChild($node);
            }
        }

        $xpath = new DOMXPath($document);

        foreach ($xpath->query('//@*') as $attribute) {
            $name = strtolower($attribute->nodeName);
            $value = trim($attribute->nodeValue ?? '');

            if (str_starts_with($name, 'on')) {
                $attribute->ownerElement?->removeAttribute($attribute->nodeName);
                continue;
            }

            if (in_array($name, ['src', 'href'], true) && preg_match('/^\s*javascript:/i', $value)) {
                $attribute->ownerElement?->removeAttribute($attribute->nodeName);
            }
        }

        $body = $document->getElementsByTagName('body')->item(0);

        return trim($this->nodeToHtml($body));
    }

    private function nodeToHtml(?DOMNode $node): string
    {
        if (! $node) {
            return '';
        }

        $document = new DOMDocument('1.0', 'UTF-8');
        $document->appendChild($document->importNode($node, true));

        return $document->saveHTML() ?: '';
    }
}
