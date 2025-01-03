<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function index()
    {
        $teams = DB::table('teams')->get();
        return response()->json([
            'success' => true,
            'teams' => $teams,
        ]);
    }

    public function show($id)
    {
        $team = DB::table('teams')->where('id',$id)->first();
        if ($team){
            return response()->json([
                'success' => true,
                'team' => $team,
            ]);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'Team not found.',
            ],404);
        }
        
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
        ]);

        $team = DB::table('teams')->insertGetId([
            'name' => $request->name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Team created successfully!',
            'team_id' => $team,
        ], 201);
    }

    public function update(Request $request,$id)
    {
        $request->validate([
            'name' => 'required|max:255',
        ]);

        $updated = DB::table('teams')
            ->where('id',$id)
            ->update(array_filter([
                'name' => $request->name,
                'updated_at' => now(),
            ]));

        if ($updated) {
            return response()->json([
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
        $deleted = DB::table('teams')->where('id',$id)->delete();

        if ($deleted){
            return response()->json([
                'success' => true,
                'message' => 'team deleted'
            ]);
        }else{
            return response()->json([
                'success' => false,
                'message' => 'team not found.'
            ]);
        }
    }
    
}
