<?php

namespace App\Http\Controllers;

use App\Models\Staff as StaffMember;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class StaffController extends Controller
{
    public function index(Request $request): Response
    {
        $roleFilter = $request->query('role');
        $keyword = $request->query('q');

        $teachers = Teacher::with(['labs:id,code,name,name_en'])
            ->where('visible', true)
            ->when($keyword, function ($query) use ($keyword) {
                $like = "%{$keyword}%";
                $query->where(function ($inner) use ($like) {
                    $inner->where('name', 'like', $like)
                        ->orWhere('name_en', 'like', $like)
                        ->orWhere('title', 'like', $like)
                        ->orWhere('title_en', 'like', $like);
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function (Teacher $teacher) {
                $slug = sprintf('teacher-%d-%s', $teacher->id, Str::slug($teacher->name_en ?? $teacher->name));

                return [
                    'id' => $teacher->id,
                    'slug' => $slug,
                    'role' => 'faculty',
                    'name' => [
                        'zh-TW' => $teacher->name,
                        'en' => $teacher->name_en,
                    ],
                    'title' => [
                        'zh-TW' => $teacher->title,
                        'en' => $teacher->title_en,
                    ],
                    'email' => $teacher->email,
                    'phone' => $teacher->phone,
                    'office' => $teacher->office,
                    'photo_url' => $teacher->photo_url
                        ? (Str::startsWith($teacher->photo_url, ['http://', 'https://', '/'])
                            ? $teacher->photo_url
                            : asset($teacher->photo_url))
                        : null,
                    'expertise' => [
                        'zh-TW' => $teacher->expertise,
                        'en' => $teacher->expertise_en,
                    ],
                    'labs' => $teacher->labs->map(fn ($lab) => [
                        'code' => $lab->code,
                        'name' => [
                            'zh-TW' => $lab->name,
                            'en' => $lab->name_en,
                        ],
                    ])->values(),
                ];
            });

        $staff = StaffMember::where('visible', true)
            ->when($keyword, function ($query) use ($keyword) {
                $like = "%{$keyword}%";
                $query->where(function ($inner) use ($like) {
                    $inner->where('name', 'like', $like)
                        ->orWhere('name_en', 'like', $like)
                        ->orWhere('position', 'like', $like)
                        ->orWhere('position_en', 'like', $like);
                });
            })
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function (StaffMember $staffMember) {
                $slug = sprintf('staff-%d-%s', $staffMember->id, Str::slug($staffMember->name_en ?? $staffMember->name));

                return [
                    'id' => $staffMember->id,
                    'slug' => $slug,
                    'role' => 'staff',
                    'name' => [
                        'zh-TW' => $staffMember->name,
                        'en' => $staffMember->name_en,
                    ],
                    'title' => [
                        'zh-TW' => $staffMember->position,
                        'en' => $staffMember->position_en,
                    ],
                    'email' => $staffMember->email,
                    'phone' => $staffMember->phone,
                    'photo_url' => $staffMember->photo_url
                        ? (Str::startsWith($staffMember->photo_url, ['http://', 'https://', '/'])
                            ? $staffMember->photo_url
                            : asset($staffMember->photo_url))
                        : null,
                    'bio' => [
                        'zh-TW' => $staffMember->bio,
                        'en' => $staffMember->bio_en,
                    ],
                ];
            });

        $people = match ($roleFilter) {
            'faculty' => $teachers,
            'staff' => $staff,
            default => $teachers->concat($staff)->values(),
        };

        return Inertia::render('people/index', [
            'people' => $people,
            'filters' => [
                'role' => $roleFilter,
                'q' => $keyword,
            ],
            'statistics' => [
                'faculty' => $teachers->count(),
                'staff' => $staff->count(),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        [$type, $id] = array_pad(explode('-', $slug, 3), 2, null);
        $id = (int) ($id ?? 0);

        if ($type === 'teacher') {
            $teacher = Teacher::with(['labs:id,code,name,name_en', 'links'])->where('visible', true)->findOrFail($id);

            $expertiseZh = $teacher->expertise ? preg_split('/[\n,]+/', $teacher->expertise) : [];
            $expertiseEn = $teacher->expertise_en ? preg_split('/[\n,]+/', $teacher->expertise_en) : [];

            return Inertia::render('people/show', [
                'person' => [
                    'id' => $teacher->id,
                    'role' => 'faculty',
                    'name' => [
                        'zh-TW' => $teacher->name,
                        'en' => $teacher->name_en,
                    ],
                    'title' => [
                        'zh-TW' => $teacher->title,
                        'en' => $teacher->title_en,
                    ],
                    'email' => $teacher->email,
                    'phone' => $teacher->phone,
                    'office' => $teacher->office,
                    'photo_url' => $teacher->photo_url
                        ? (Str::startsWith($teacher->photo_url, ['http://', 'https://', '/'])
                            ? $teacher->photo_url
                            : asset($teacher->photo_url))
                        : null,
                    'bio' => [
                        'zh-TW' => $teacher->bio,
                        'en' => $teacher->bio_en,
                    ],
                    'expertise' => [
                        'zh-TW' => $expertiseZh,
                        'en' => $expertiseEn,
                    ],
                    'education' => [
                        'zh-TW' => $teacher->education,
                        'en' => $teacher->education_en,
                    ],
                    'labs' => $teacher->labs->map(fn ($lab) => [
                        'code' => $lab->code,
                        'name' => [
                            'zh-TW' => $lab->name,
                            'en' => $lab->name_en,
                        ],
                    ])->values(),
                    'links' => $teacher->links->map(fn ($link) => [
                        'id' => $link->id,
                        'type' => $link->type,
                        'label' => $link->label,
                        'url' => $link->url,
                    ])->values(),
                ],
            ]);
        }

        $staff = StaffMember::where('visible', true)->findOrFail($id);

        return Inertia::render('people/show', [
            'person' => [
                'id' => $staff->id,
                'role' => 'staff',
                'name' => [
                    'zh-TW' => $staff->name,
                    'en' => $staff->name_en,
                ],
                'title' => [
                    'zh-TW' => $staff->position,
                    'en' => $staff->position_en,
                ],
                'email' => $staff->email,
                'phone' => $staff->phone,
                'photo_url' => $staff->photo_url
                    ? (Str::startsWith($staff->photo_url, ['http://', 'https://', '/'])
                        ? $staff->photo_url
                        : asset($staff->photo_url))
                    : null,
                'bio' => [
                    'zh-TW' => $staff->bio,
                    'en' => $staff->bio_en,
                ],
            ],
        ]);
    }
}
