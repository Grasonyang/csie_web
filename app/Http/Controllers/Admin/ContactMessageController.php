<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = ContactMessage::with(['processedBy'])
            ->orderBy('status', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/contact-messages/index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // 通常不需要手動建立聯絡訊息
        return redirect()->route('admin.contact-messages.index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 通常不需要手動建立聯絡訊息
        return redirect()->route('admin.contact-messages.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactMessage $contactMessage)
    {
        return Inertia::render('admin/contact-messages/show', [
            'message' => $contactMessage->load(['processedBy']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactMessage $contactMessage)
    {
        return Inertia::render('admin/contact-messages/edit', [
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

        return redirect()->route('admin.contact-messages.index')
            ->with('success', '聯絡訊息狀態更新成功');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')
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

        return redirect()->route('admin.contact-messages.index')
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

        return redirect()->route('admin.contact-messages.index')
            ->with('success', '已標記為已處理');
    }
}
