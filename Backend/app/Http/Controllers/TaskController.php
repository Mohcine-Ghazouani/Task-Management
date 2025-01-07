<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TaskService;

class TaskController extends Controller
{
    protected $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    public function index()
    {
        $tasks = $this->taskService->getAllTasks();

        return response()->json([
            'success' => true,
            'tasks' => $tasks,
        ]);
    }

    public function show($id)
    {
        $task = $this->taskService->getTaskById($id);

        if ($task) {
            return response()->json([
                'success' => true,
                'task' => $task,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required|max:1000',
            'status' => 'required|in:Not started,In progress,Completed',
            'priority' => 'required|in:Low,Normal,High',
            'due_date' => 'required|date',
            'user_id' => 'required|exists:users,id',
        ]);

        $task = $this->taskService->createTask($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully!',
            'task' => $task,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'nullable|max:255',
            'description' => 'nullable|max:1000',
            'status' => 'nullable|in:Not started,In progress,Completed',
            'priority' => 'nullable|in:Low,Normal,High',
            'due_date' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $task = $this->taskService->updateTask($id, $request->all());

        if ($task) {
            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully!',
                'task' => $task,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->taskService->deleteTask($id);

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        }
    }
}









// namespace App\Http\Controllers;

// use Illuminate\Http\Request;

// class TaskController extends TaskController
// {
//     public function valider(Request $request){
      
//         $request->validate([
         
//          'title' => 'required|max:255',
//          'description' => 'required',
//          'status' => 'required', 
//          'priority' => 'required', 
//          'due_date' => 'required', 
//      ]);
//         $title = $request->input('title');
//         $description = $request->input('description');
//         $status = $request->input('status');
//         $priority = $request->input('priority');
//         $due_date = $request->input('due_date');
//         DB::table('tasks')->insert([
//             'title' => $title,
//             'description' => $description,
//             'status' => $status,
//             'priority' => $priority,
//             'due_date' => $due_date,
//         ]);
//         return redirect('/list');
//     }
//     public function list(){
//         $tasks = DB::table('tasks')->get();
//         return view('list', ['tasks' => $tasks]);
        
    
     
   
//      }   
// }
