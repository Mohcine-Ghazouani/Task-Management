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
                'email' => 'admin@email.com',
                'password' => '$2y$12$WiYIARWNAkhX5dIlo/gHvuX6fFMVbRSjPvu2lhGv6164BxbKR1AYO', // password is '12345678'
                'role' => 'Admin',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'membre',
                'email' => 'membre@email.com',
                'password' => '$2y$12$WiYIARWNAkhX5dIlo/gHvuX6fFMVbRSjPvu2lhGv6164BxbKR1AYO', // password is '12345678'
                'role' => 'Member',
                'team_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
