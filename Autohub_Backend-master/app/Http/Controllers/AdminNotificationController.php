<?php

namespace App\Http\Controllers;

use App\Models\Notification;

class AdminNotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::with('user')
            ->latest()
            ->where('read_at' ,0)
            ->paginate(10);

        return response()->json($notifications);
    }

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['read_at' => 1]);

        return response()->json(['message' => 'Notification marked as read']);
    }
}
