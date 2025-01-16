<?php

namespace App\Services;

use App\Models\Task;
use App\Services\NotificationService;

class TaskService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function getAllTasks()
    {
        return Task::with('user')->get();
    }

    public function getTaskById($id)
    {
        return Task::with('user')->find($id);
    }

    public function getTasksByUserId($userId)
    {
        return Task::where('user_id', $userId) ->with('user')->get();
    }

    public function createTask($data)
    {
        $task = Task::create($data);

        $this->notificationService->createNotification([
            'message' => "A new task has been assigned: {$task->title}",
            'user_id' => $task->user_id,
        ]);

        return $task;
    }

    public function updateTask($id, $data)
    {
        $task = Task::find($id);

        if ($task) {
            $task->update($data);

            $this->notificationService->createNotification([
                'message' => "Task updated: {$task->title}",
                'user_id' => $task->user_id,
            ]);

            return $task;
        }

        return null;
    }

    public function deleteTask($id)
    {
        $task = Task::find($id);

        if ($task) {
            $task->delete();

            $this->notificationService->createNotification([
                'message' => "Task deleted: {$task->title}",
                'user_id' => $task->user_id,
            ]);

            return true;
        }

        return false;
    }
}
