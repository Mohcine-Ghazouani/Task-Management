<?php


namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
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

        $task = DB::table('tasks')->insertGetId([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'user_id' => $request->user_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        
        return response()->json([
            'success' => true,
            'message' => 'Task created successfully!',
            'task_id' => $task,
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

        $updated = DB::table('tasks')
            ->where('id', $id)
            ->update(array_filter([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status,
                'priority' => $request->priority,
                'due_date' => $request->due_date,
                'user_id' => $request->user_id,
                'updated_at' => now(),
            ]));

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Task not found or no changes made.',
            ], 404);
        }
    }

   
    public function destroy($id)
    {
        $deleted = DB::table('tasks')->where('id', $id)->delete();

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
