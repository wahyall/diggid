<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('menu', [DashboardController::class, 'menu']);
    });

    Route::group(['prefix' => 'category', 'middleware' => 'role:admin'], function () {
        Route::post('paginate', [CategoryController::class, 'paginate']);
        Route::post('store', [CategoryController::class, 'store']);
        Route::get('{uuid}/edit', [CategoryController::class, 'edit']);
        Route::get('{uuid}/detail', [CategoryController::class, 'detail']);
        Route::post('{uuid}/update', [CategoryController::class, 'update']);
        Route::delete('{uuid}/destroy', [CategoryController::class, 'destroy']);
        Route::post('{uuid}/sub/store', [CategoryController::class, 'storeSub']);
    });
});
