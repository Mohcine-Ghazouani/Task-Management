<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class PasswordController extends Controller
{
    /**
     * Update the password for the authenticated user.
     */
    public function updatePassword(Request $request)
    {
        
        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|min:8|confirmed',
        ]);

        
        $user = $request->user();

        
        if (!Hash::check($request->currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'currentPassword' => ['The provided password does not match your current password.'],
            ]);
        }

        
        $user->forceFill([
            'password' => $request->newPassword,
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ], 200);
    }
}
