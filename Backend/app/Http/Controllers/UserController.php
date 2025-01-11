<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $users = $this->userService->getAllUsersWithTeams();

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    public function show($id)
    {
        $user = $this->userService->getUserById($id);

        if ($user) {
            return response()->json([
                'success' => true,
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'in:Admin,Member',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $user = $this->userService->createUser($request->all());

        return response()->json([
            'success' => true,
            'message' => 'User created successfully!',
            'user' => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'nullable|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|min:6',
            'role' => 'nullable|in:Admin,Member',
            'team_id' => 'nullable|exists:teams,id',
        ]);

        $user = $this->userService->updateUser($id, $request->all());

        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully!',
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->userService->deleteUser($id);

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
