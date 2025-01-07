<?php

namespace App\Services;

use App\Models\Comment;

class CommentService
{
    /**
     * Fetch all comments.
     */
    public function getAllComments()
    {
        return Comment::all();
    }

    /**
     * Fetch a comment by ID.
     */
    public function getCommentById($id)
    {
        return Comment::find($id);
    }

    /**
     * Create a new comment.
     */
    public function createComment($data)
    {
        return Comment::create($data);
    }

    /**
     * Update a comment by ID.
     */
    public function updateComment($id, $data)
    {
        $comment = Comment::find($id);

        if ($comment) {
            $comment->update($data);
            return $comment;
        }

        return null;
    }

    /**
     * Delete a comment by ID.
     */
    public function deleteComment($id)
    {
        $comment = Comment::find($id);

        if ($comment) {
            $comment->delete();
            return true;
        }

        return false;
    }
}
