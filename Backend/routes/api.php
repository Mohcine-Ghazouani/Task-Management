<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Models\User;


Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/users', [UserController::class, 'index']); 
Route::get('/users/{id}', [UserController::class, 'show']); 
Route::post('/users', [UserController::class, 'store']); 
Route::put('/users/{id}', [UserController::class, 'update']); 
Route::delete('/users/{id}', [UserController::class, 'destroy']); 


Route::get('/tasks', [TaskController::class, 'index']); 
Route::get('/tasks/{id}', [TaskController::class, 'show']); 
Route::post('/tasks', [TaskController::class, 'store']);
Route::put('/tasks/{id}', [TaskController::class, 'update']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']); 


Route::get('/teams', [TeamController::class, 'index']); 
Route::get('/teams/{id}', [TeamController::class, 'show']); 
Route::post('/teams', [TeamController::class, 'store']);
Route::put('/teams/{id}', [TeamController::class, 'update']);
Route::delete('/teams/{id}', [TeamController::class, 'destroy']);

