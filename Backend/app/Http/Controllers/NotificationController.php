<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = DB::table('notifications')->get();

        return response()->json([
            'success' => true,
            'notifications' => $notifications,
        ]);
    }


    public function show($id)
    {
        $notification = DB::table('notifications')->where('id', $id)->first();

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

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|max:500',
            'user_id' => 'required|exists:users,id',
        ]);

        $notification = DB::table('notifications')->insertGetId([
            'message' => $request->message,
            'user_id' => $request->user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notification created successfully!',
            'notification_id' => $notification,
        ], 201);
    }

    
    public function update(Request $request, $id)
    {
        $request->validate([
            'is_read' => 'boolean',
        ]);

        $updated = DB::table('notifications')
            ->where('id', $id)
            ->update([
                'is_read' => $request->is_read,
                'updated_at' => now(),
            ]);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Notification updated successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found or no changes made.',
            ], 404);
        }
    }


    public function destroy($id)
    {
        $deleted = DB::table('notifications')->where('id',$id)->delete();

        if ($deleted){
            return response()->json([
                'success' => true,
                'message' => 'notification deleted'
            ]);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'notification not found.'
            ]);
        }
    }


    
}
