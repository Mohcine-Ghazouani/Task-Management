<?php

namespace App\Services;

use App\Models\Team;

class TeamService
{
    public function getAllTeams()
    {
        return Team::all();
    }

    public function getTeamById($id)
    {
        return Team::find($id);
    }

    public function createTeam($data)
    {
        return Team::create($data);
    }

    public function updateTeam($id, $data)
    {
        $team = Team::find($id);
        return $team ? $team->update($data) : false;
    }

    public function deleteTeam($id)
    {
        $team = Team::find($id);
        return $team ? $team->delete() : false;
    }
}
