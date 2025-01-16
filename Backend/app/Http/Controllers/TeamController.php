<?php

namespace App\Http\Controllers;

use App\Services\TeamService;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    protected $teamService;

    public function __construct(TeamService $teamService)
    {
        $this->teamService = $teamService;
    }

    public function index()
    {
        $teams = $this->teamService->getAllTeams();
        return response()->json([
            'success' => true,
            'teams' => $teams,
        ]);
    }

    public function show($id)
    {
        $team = $this->teamService->getTeamById($id);
        if ($team) {
            return response()->json([
                'success' => true,
                'team' => $team,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Team not found.',
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
        ]);

        $team = $this->teamService->createTeam(['name' => $request->name]);

        return response()->json([
            'success' => true,
            'message' => 'Team created successfully!',
            'team_id' => $team->id,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|max:255',
        ]);

        $updated = $this->teamService->updateTeam($id, ['name' => $request->name]);

        if ($updated) {
            return response()->json([
                'name' => $request->name,
                'success' => true,
                'message' => 'Team updated successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Team not found or no changes made.',
            ], 404);
        }
    }

    public function destroy($id)
    {
        $deleted = $this->teamService->deleteTeam($id);

        if ($deleted) {
            return response()->json([
                'success' => true,
                'message' => 'Team deleted successfully!',
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Team not found.',
            ], 404);
        }
    }
}
