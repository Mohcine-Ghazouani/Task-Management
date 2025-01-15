<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    /**
     * Create a notification.
     */
    public function createNotification($data)
    {
        return Notification::create($data);
    }

    /**
     * Fetch all notifications.
     */
    public function getAllNotifications()
    {
        return Notification::all();
    }

    /**
     * Fetch a notification by ID.
     */
    public function getNotificationById($id)
    {
        return Notification::find($id);
    }

    public function getNotificationsByUserId($userId)
    {
        return Notification::where('user_id', $userId)->get();
    }


    /**
     * Update a notification's status.
     */
    public function updateNotification($id, $data)
    {
        $notification = Notification::find($id);
        if ($notification) {
            $notification->update($data);
            return $notification;
        }

        return null;
    }

    /**
     * Delete a notification by ID.
     */
    public function deleteNotification($id)
    {
        $notification = Notification::find($id);
        if ($notification) {
            $notification->delete();
            return true;
        }

        return false;
    }
}
