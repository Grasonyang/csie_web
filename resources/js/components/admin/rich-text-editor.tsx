import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { isRichTextEmpty, sanitizeRichText } from '@/lib/rich-text';
import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

function applyCommand(command: string, value?: string) {
    if (typeof document === 'undefined') {
        return;
    }

    document.execCommand(command, false, value);
}

function normalizeHtml(html: string): string {
    const sanitized = sanitizeRichText(html);
    return sanitized;
}

export default function RichTextEditor({
    id,
    value,
    onChange,
    placeholder = '請輸入內容...',
    className,
    disabled = false,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const lastValueRef = useRef('');

    useEffect(() => {
        const editor = editorRef.current;
        if (!editor) return;

        const normalized = value ?? '';

        if (isFocused) {
            lastValueRef.current = normalized;
            return;
        }

        if (lastValueRef.current !== normalized) {
            editor.innerHTML = normalized;
            lastValueRef.current = normalized;
        }
    }, [value, isFocused]);

    const emitChange = (html: string) => {
        const normalized = normalizeHtml(html);
        lastValueRef.current = normalized;
        onChange(normalized);
    };

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        emitChange(event.currentTarget.innerHTML);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        emitChange(event.currentTarget.innerHTML);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        if (typeof document !== 'undefined') {
            document.execCommand('insertText', false, text);
        }
    };

    const handleToolbar = (command: 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'createLink') => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();

        if (command === 'createLink') {
            const selection = window.getSelection()?.toString();
            const defaultValue = selection || 'https://';
            const url = prompt('輸入連結網址', defaultValue);
            if (!url) {
                return;
            }
            applyCommand('createLink', url);
            return;
        }

        applyCommand(command);
    };

    const isEmpty = isRichTextEmpty(value);

    return (
        <div className={cn('space-y-2', className)}>
            <div className="flex flex-wrap gap-1 rounded border bg-muted/40 p-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbar('bold')}
                >
                    <strong>B</strong>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbar('italic')}
                >
                    <em>I</em>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbar('underline')}
                >
                    <u>U</u>
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbar('insertUnorderedList')}
                >
                    •
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    disabled={disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleToolbar('createLink')}
                >
                    🔗
                </Button>
            </div>
            <div className="relative">
                {!isFocused && isEmpty && (
                    <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                        {placeholder}
                    </span>
                )}
                <div
                    id={id}
                    ref={editorRef}
                    className={cn(
                        'min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30',
                        'prose prose-sm max-w-none text-muted-foreground [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-5 [&_a]:text-primary [&_a]:underline',
                        disabled && 'pointer-events-none opacity-70'
                    )}
                    contentEditable={!disabled}
                    role="textbox"
                    aria-multiline="true"
                    data-placeholder={placeholder}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onPaste={handlePaste}
                />
            </div>
        </div>
    );
}
