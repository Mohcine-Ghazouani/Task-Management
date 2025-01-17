<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\CommentService;

class CommentController extends Controller
{
    protected $commentService;

    public function __construct(CommentService $commentService)
    {
        $this->commentService = $commentService;
    }

    public function index()
    {
        $comments = $this->commentService->getAllComments();

        return response()->json([
            'success' => true,
            'comments' => $comments,
        ]);
    }

    public function show($id)
    {
        $comment = $this->commentService->getCommentById($id);

        if ($comment) {
            return response()->json([
                'success' => true,
                'comment' => $comment,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found.',
            ], 404);
        }
    }
    public function getCommentsByUserId($id)
    {
        $comments = $this->commentService->getCommentByUserId($id);

        if ($comments) {
            return response()->json([
                'success' => true,
                'comments' => $comments,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Comments not found.',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|max:500',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'required|exists:tasks,id',
        ]);

        $comment = $this->commentService->createComment($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully!',
            'comment' => $comment,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|max:500',
        ]);

        $comment = $this->commentService->updateComment($id, $request->all());

        if ($comment) {
            return response()->json([
                'success' => true,
                'message' => 'Comment updated successfully!',
                'comment' => $comment,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->commentService->deleteComment($id);

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Comment deleted successfully.',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found.',
            ], 404);
        }
    }
}
