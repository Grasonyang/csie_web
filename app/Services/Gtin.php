<?php

namespace App\Services;

class Gtin{
    public __construct(){

    }
    public function validate(string $gtin): bool{
        return preg_match('/^[SM]\d{7}$/', $gtin) === 1;
    }
}
