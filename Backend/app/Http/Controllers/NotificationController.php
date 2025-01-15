<?php

namespace App\Http\Controllers;

use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        $notifications = $this->notificationService->getAllNotifications();

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
        ]);
    }

    public function show($id)
    {
        $notification = $this->notificationService->getNotificationById($id);

        if ($notification) {
            return response()->json([
                'success' => true,
                'notification' => $notification,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found.',
            ], 404);
        }
    }
    public function getUserNotifications(Request $request)
    {
        $userId = $request->user()->id; // Assuming you get the user's ID from the authenticated user
        $notifications = $this->notificationService->getNotificationsByUserId($userId); // Assuming you're using a service
        return response()->json([
            'notifications' => $notifications,
        ]);
    }


    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'message' => 'required|max:500',
    //         'user_id' => 'required|exists:users,id',
    //     ]);

    //     $notification = $this->notificationService->createNotification($request->all());

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Notification created successfully!',
    //         'notification' => $notification,
    //     ], 201);
    // }

    public function update(Request $request, $id)
    {
        $request->validate([
            'is_read' => 'boolean',
        ]);

        $notification = $this->notificationService->updateNotification($id, $request->all());

        if ($notification) {
            return response()->json([
                'success' => true,
                'message' => 'Notification updated successfully!',
                'notification' => $notification,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->notificationService->deleteNotification($id);

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully.',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found.',
            ], 404);
        }
    }
}
