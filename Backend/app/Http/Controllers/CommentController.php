<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function index()
    {
        $comments = DB::table('comments')->get();
        return response()->json([
            'success' => true,
            'comments' => $comments,
        ]);
    }
    public function show($id)
    {
        $comment = DB::table('comments')->where('id',$id)->first();
        if($comment){
            return response()->json([
                'success' => true,
                'comments' => $comment,
            ]);
        }else{
            return response()->json([
                'success' => false,
                'comments' => 'Comment not found',
            ]);
        }
    }
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|max:500',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'required|exists:tasks,id',
        ]);
        $comment = DB::table('comments')->insertGetId([
            'content' => $request->content,
            'user_id' => $request->user_id,
            'task_id' => $request->task_id,
            'created_at' => now(),
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully!',
            'comment_id' => $comment,
        ], 201);
    }

    public function update(Request $request,$id)
    {
        $request->validate([
            'content' => 'required|max:500',
        ]);
        $updated = DB::table('comments')
            ->where('id',$id)
            ->update(array_filter([
                'content' => $request->content,
                'updated_at' => now(),
            ]));
        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'comment updated successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'comment not found or no changes made.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = DB::table('comments')->where('id',$id)->delete();

        if ($deleted){
            return response()->json([
                'success' => true,
                'message' => 'comment deleted'
            ]);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'comment not found.'
            ]);
        }
    }

}
