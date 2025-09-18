<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttachmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Attachment::query()->with(['attachable']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('file_url', 'like', "%{$search}%")
                    ->orWhere('external_url', 'like', "%{$search}%")
                    ->orWhere('mime_type', 'like', "%{$search}%");
            });
        }

        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }

        if ($attachableType = $request->input('attachable_type')) {
            $query->where('attachable_type', $attachableType);
        }

        $trashed = $request->input('trashed');
        if ($trashed === 'with') {
            $query->withTrashed();
        } elseif ($trashed === 'only') {
            $query->onlyTrashed();
        }

        $perPage = max(1, (int) $request->input('per_page', 20));

        $attachments = $query
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $attachableTypes = Attachment::query()
            ->withTrashed()
            ->select('attachable_type')
            ->distinct()
            ->pluck('attachable_type')
            ->filter()
            ->values();

        return Inertia::render('admin/attachments/index', [
            'attachments' => $attachments,
            'filters' => $request->only(['search', 'type', 'attachable_type', 'trashed', 'per_page']),
            'typeOptions' => ['image', 'document', 'link'],
            'attachableTypeOptions' => $attachableTypes,
            'perPageOptions' => [10, 20, 50],
        ]);
    }

    public function destroy(Attachment $attachment)
    {
        $attachment->delete();

        return redirect()
            ->route('admin.attachments.index')
            ->with('success', '附件已移除');
    }

    public function restore(int $attachment)
    {
        $record = Attachment::withTrashed()->findOrFail($attachment);
        $record->restore();

        return redirect()
            ->route('admin.attachments.index')
            ->with('success', '附件已復原');
    }

    public function forceDelete(int $attachment)
    {
        $record = Attachment::withTrashed()->findOrFail($attachment);
        $record->forceDelete();

        return redirect()
            ->route('admin.attachments.index')
            ->with('success', '附件已永久刪除');
    }
}
