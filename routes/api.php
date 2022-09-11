<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryGroupController;
use App\Http\Controllers\CategoryController;

use App\Http\Controllers\DashboardController;
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
        Route::group(['prefix' => 'group'], function () {
            Route::get('show', [CategoryGroupController::class, 'show']);
            Route::post('paginate', [CategoryGroupController::class, 'paginate']);
            Route::post('store', [CategoryGroupController::class, 'store']);
            Route::get('{uuid}/edit', [CategoryGroupController::class, 'edit']);
            Route::get('{uuid}/detail', [CategoryGroupController::class, 'detail']);
            Route::post('{uuid}/update', [CategoryGroupController::class, 'update']);
            Route::delete('{uuid}/destroy', [CategoryGroupController::class, 'destroy']);
        });

        Route::post('mass-store', [CategoryController::class, 'massStore']);
    });

    Route::group(['prefix' => 'course', 'middleware' => 'role:admin'], function () {
        Route::post('paginate', [CourseController::class, 'paginate']);
        Route::post('store', [CourseController::class, 'store']);
        Route::get('{uuid}/edit', [CourseController::class, 'edit']);
        Route::get('{uuid}/detail', [CourseController::class, 'detail']);
        Route::post('{uuid}/update', [CourseController::class, 'update']);
        Route::delete('{uuid}/destroy', [CourseController::class, 'destroy']);

        Route::post('upload-image', [CourseController::class, 'uploadImage']);
        Route::post('delete-image', [CourseController::class, 'deleteImage']);
    });
});
