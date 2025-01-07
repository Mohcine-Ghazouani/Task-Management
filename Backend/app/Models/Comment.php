<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'content',
        'user_id',
        'task_id',
    ];

    /**
     * Relationship: Comment belongs to a User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: Comment belongs to a Task.
     */
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
