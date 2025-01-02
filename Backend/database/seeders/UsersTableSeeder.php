<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => '12345678',
                'role' => 'Admin',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'membre',
                'email' => 'membre@gmail.com',
                'password' => '12341234',
                'role' => 'Membre',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
