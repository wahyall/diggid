<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryGroupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseLessonController;
use App\Http\Controllers\CourseLessonVideoController;
use App\Http\Controllers\CourseProjectController;
use App\Http\Controllers\DashboardController;
use App\Models\PaymentMethod;
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
    Route::group(['prefix' => 'admin', 'middleware' => 'role:admin'], function () {
        Route::prefix('dashboard')->group(function () {
            Route::get('menu', [DashboardController::class, 'menu']);
        });

        Route::group(['prefix' => 'category'], function () {
            Route::group(['prefix' => 'group'], function () {
                Route::get('show', [CategoryGroupController::class, 'show']);
                Route::post('paginate', [CategoryGroupController::class, 'paginate']);
                Route::post('store', [CategoryGroupController::class, 'store']);
                Route::get('{uuid}/edit', [CategoryGroupController::class, 'edit']);
                Route::get('{uuid}/detail', [CategoryGroupController::class, 'detail']);
                Route::post('{uuid}/update', [CategoryGroupController::class, 'update']);
                Route::delete('{uuid}/destroy', [CategoryGroupController::class, 'destroy']);
            });

            Route::post('sync', [CategoryController::class, 'sync']);
        });

        Route::group(['prefix' => 'course'], function () {
            Route::post('paginate', [CourseController::class, 'paginate']);
            Route::post('store', [CourseController::class, 'store']);
            Route::get('{uuid}', [CourseController::class, 'show']);
            Route::get('{uuid}/edit', [CourseController::class, 'edit']);
            Route::post('{uuid}/update', [CourseController::class, 'update']);
            Route::delete('{uuid}/destroy', [CourseController::class, 'destroy']);

            Route::prefix('{uuid}/project')->group(function () {
                Route::get('/', [CourseProjectController::class, 'index']);
                Route::post('store', [CourseProjectController::class, 'store']);
                Route::post('update', [CourseProjectController::class, 'update']);
                Route::delete('destroy', [CourseProjectController::class, 'destroy']);
            });

            Route::prefix('{course_uuid}/lesson')->group(function () {
                Route::post('/', [CourseLessonController::class, 'index']);
                Route::post('store', [CourseLessonController::class, 'store']);
                Route::get('{uuid}/edit', [CourseLessonController::class, 'edit']);
                Route::post('{uuid}/update', [CourseLessonController::class, 'update']);
                Route::delete('{uuid}/destroy', [CourseLessonController::class, 'destroy']);
                Route::post('reorder', [CourseLessonController::class, 'reorder']);
            });

            Route::prefix('lesson/{lesson_uuid}')->group(function () {
                Route::get('/', [CourseLessonController::class, 'show']);
                Route::prefix('video')->group(function () {
                    Route::post('/', [CourseLessonVideoController::class, 'index']);
                    Route::post('store', [CourseLessonVideoController::class, 'store']);
                    Route::get('{uuid}/edit', [CourseLessonVideoController::class, 'edit']);
                    Route::post('{uuid}/update', [CourseLessonVideoController::class, 'update']);
                    Route::post('{uuid}/upload', [CourseLessonVideoController::class, 'upload']);
                    Route::delete('{uuid}/destroy', [CourseLessonVideoController::class, 'destroy']);
                    Route::post('reorder', [CourseLessonVideoController::class, 'reorder']);
                });
            });

            Route::post('upload-image', [CourseController::class, 'uploadImage']);
        });
    });
});
