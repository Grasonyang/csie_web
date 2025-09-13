<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PostCategorySeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        $create = function (string $slug, string $name, string $nameEn, ?int $parentId = null, int $sort = 0) use ($now) {
            return DB::table('post_categories')->insertGetId([
                'parent_id' => $parentId,
                'slug' => $slug,
                'name' => $name,
                'name_en' => $nameEn,
                'sort_order' => $sort,
                'visible' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        };

        // Announcements tree
        $announcementsId = $create('announcements', '公告', 'Announcements');
        $children = [
            ['general', '全部資訊', 'General'],
            ['bachelor-admission', '大學部招生', 'Bachelor Admission'],
            ['graduate-admission', '研究所招生', 'Graduate Admission'],
            ['talks-events', '演講及活動資訊', 'Talks & Events'],
            ['awards', '獲獎資訊', 'Awards'],
            ['scholarships', '獎助學金', 'Scholarships'],
            ['jobs', '徵人資訊', 'Jobs'],
        ];
        foreach ($children as $i => [$slug, $name, $nameEn]) {
            $create($slug, $name, $nameEn, $announcementsId, $i);
        }

        // Admissions tree
        $admissionsId = $create('admissions', '招生專區', 'Admissions');
        $adChildren = [
            ['bachelor', '學士班', 'Bachelor'],
            ['master', '碩士班', 'Master'],
            ['ai-inservice', '人工智慧應用服務碩士在職專班', 'AI In‑Service Master'],
            ['pre-admitted', '碩士先修生', 'Pre‑Admitted'],
        ];
        foreach ($adChildren as $i => [$slug, $name, $nameEn]) {
            $create($slug, $name, $nameEn, $admissionsId, $i);
        }
    }
}

