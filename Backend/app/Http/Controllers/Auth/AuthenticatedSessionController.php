<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();
        

        $user = Auth::guard('web')->user();
        // $user = null ;
        // $currentGuard = Auth::guard('web');
        // if ($currentGuard->check()) {
        //     $user = $currentGuard->user();
            
        // }
        


        $request->session()->regenerate();

        //return response()->noContent();

        return response()->json([
            // 'user' => $user,
            // 'role' => $user->role, 
            'user' => [   
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role, // Directly access the role field
            ],
        ]);
        // return response()->json([
        //     'user' => $user,
            
        // ]);  
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
