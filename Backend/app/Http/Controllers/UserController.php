<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:Admin,Membre',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $user = DB::table('users')->insertGetId([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'team_id' => $request->team_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully!',
            'user_id' => $user,
        ], 201);
    }

 
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'role' => 'nullable|in:Admin,Membre',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $data = array_filter([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? Hash::make($request->password) : null,
            'role' => $request->role,
            'team_id' => $request->team_id,
            'updated_at' => now(),
        ]);

        $updated = DB::table('users')->where('id', $id)->update($data);

        if ($updated) {
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found or no changes made.',
            ], 404);
        }
    }

    
    public function destroy($id)
    {
        $deleted = DB::table('users')->where('id', $id)->delete();

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }
    }
}
