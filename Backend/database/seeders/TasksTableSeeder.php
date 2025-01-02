<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TasksTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('tasks')->insert([
            [
                'title' => 'Fix Bug #101',
                'description' => 'Resolve the bug reported in module X.',
                'status' => 'In progress',
                'priority' => 'High',
                'due_date' => '2025-01-15',
                'user_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Prepare Documentation',
                'description' => 'Write detailed documentation for the new feature.',
                'status' => 'Not started',
                'priority' => 'Normal',
                'due_date' => '2025-01-20',
                'user_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
