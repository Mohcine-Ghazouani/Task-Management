<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Fetch all users.
     */
    // public function getAllUsers()
    // {
    //     return User::all();
    // }
    public function getAllUsersWithTeams()
    {
        // return DB::table('users')
        //     ->leftJoin('teams', 'users.team_id', '=', 'teams.id')
        //     ->select('users.*', 'teams.name as team_name')
        //     ->get();
        return User::with('team')->get();
    }

    /**
     * Fetch a user by ID.
     */
    public function getUserById($id)
    {
        return User::find($id);
    }

    /**
     * Create a new user.
     */
    public function createUser($data)
    {
        return User::create($data);
    }

    /**
     * Update a user by ID.
     */
    public function updateUser($id, $data)
    {
        $user = User::find($id);

        if ($user) {
            $user->update($data);
            return $user;
        }

        return null;
    }

    /**
     * Delete a user by ID.
     */
    public function deleteUser($id)
    {
        $user = User::find($id);

        if ($user) {
            $user->delete();
            return true;
        }

        return false;
    }
}