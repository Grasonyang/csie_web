<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Utility: list current DB tables and row counts
Artisan::command('db:counts', function () {
    try {
        $conn = DB::connection();
        $tables = collect($conn->select('SHOW TABLES'));
        if ($tables->isEmpty()) { $this->warn('No tables'); return 0; }
        $first = (array) $tables->first();
        $key = array_key_first($first);
        $rows = [];
        foreach ($tables as $t) {
            $name = $t->$key;
            try { $count = (int)($conn->table($name)->count()); }
            catch (\Throwable $e) { $count = -1; }
            $rows[] = [$name, $count];
        }
        usort($rows, fn($a,$b) => strcmp($a[0], $b[0]));
        $this->table(['TABLE_NAME','TABLE_ROWS'], $rows);
    } catch (\Throwable $e) {
        $this->error('Error: '.$e->getMessage());
        return 1;
    }
})->purpose('List current DB tables and row counts');

