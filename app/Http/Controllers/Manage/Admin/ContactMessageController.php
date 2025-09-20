<?php

namespace App\Http\Controllers\Manage\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ContactMessage::with(['processor']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = max(1, (int) $request->input('per_page', 20));

        $messages = $query
            ->orderBy('status', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('manage/admin/contact-messages/index', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status', 'per_page']),
            'statusOptions' => [
                'new' => 'new',
                'in_progress' => 'in_progress',
                'resolved' => 'resolved',
                'spam' => 'spam',
            ],
            'perPageOptions' => [10, 20, 50],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // 通常不需要手動建立聯絡訊息
        return redirect()->route('manage.admin.contact-messages.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 通常不需要手動建立聯絡訊息
        return redirect()->route('manage.admin.contact-messages.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactMessage $contactMessage)
    {
        return Inertia::render('manage/admin/contact-messages/show', [
            'message' => $contactMessage->load(['processedBy']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactMessage $contactMessage)
    {
        return Inertia::render('manage/admin/contact-messages/edit', [
            'message' => $contactMessage,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactMessage $contactMessage)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved,spam',
        ]);

        $validated['processed_by'] = auth()->id();
        $validated['processed_at'] = now();

        $contactMessage->update($validated);

        return redirect()->route('manage.admin.contact-messages.index')
            ->with('success', '聯絡訊息狀態更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('manage.admin.contact-messages.index')
            ->with('success', '聯絡訊息刪除成功');
    }

    /**
     * Mark message as spam
     */
    public function markAsSpam(ContactMessage $contactMessage)
    {
        $contactMessage->update([
            'status' => 'spam',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()->route('manage.admin.contact-messages.index')
            ->with('success', '已標記為垃圾訊息');
    }

    /**
     * Mark message as resolved
     */
    public function markAsResolved(ContactMessage $contactMessage)
    {
        $contactMessage->update([
            'status' => 'resolved',
            'processed_by' => auth()->id(),
            'processed_at' => now(),
        ]);

        return redirect()->route('manage.admin.contact-messages.index')
            ->with('success', '已標記為已處理');
    }
}
