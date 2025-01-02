<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['Not started','In progress','Completed']);
            $table->enum('priority', ['Low','Normal','High']);
            $table->date('due_date');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }
     // Function to update an existing task
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
 
     // Function to delete a task
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }

};
