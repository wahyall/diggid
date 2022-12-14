<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CategoryGroupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CourseLessonController;
use App\Http\Controllers\CourseLessonVideoController;
use App\Http\Controllers\CourseProjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MyCourseController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
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
    // Dashboard
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

        Route::group(['prefix' => 'payment-method'], function () {
            Route::post('paginate', [PaymentMethodController::class, 'paginate']);
            Route::post('{uuid}/status', [PaymentMethodController::class, 'status']);
        });
    });
});

// Front
Route::group(['prefix' => 'catalog'], function () {
    Route::get('category', [CatalogController::class, 'category']);
    Route::post('course', [CatalogController::class, 'course']);
    Route::get('course/{uuid}', [CatalogController::class, 'detail']);
});

Route::group(['prefix' => 'course/{course_slug}'], function () {
    Route::group(['prefix' => 'video'], function () {
        Route::get('free', [CourseLessonVideoController::class, 'free']);
        Route::group(['prefix' => '{video_slug}'], function () {
            Route::get('', [CourseLessonVideoController::class, 'video']);
            Route::get('stream', [CourseLessonVideoController::class, 'stream'])->name('video.stream');
            Route::get('{video_file}', [CourseLessonVideoController::class, 'streamHls'])->name('video.stream.hls');
            // Route::get('secure/play', [CourseLessonVideoController::class, 'securePlay'])->name('video.secure.play')->middleware(['auth', 'signed']);
        });
    });
});

Route::group(['middleware' => 'auth'], function () {
    Route::prefix('me')->group(function () {
        Route::post('/', [UserController::class, 'update']);

        Route::prefix('cart')->group(function () {
            Route::get('/', [CartController::class, 'index']);
            Route::post('/', [CartController::class, 'store']);
            Route::delete('/{uuid}', [CartController::class, 'destroy']);
        });

        Route::prefix('transaction')->group(function () {
            Route::get('/', [TransactionController::class, 'index']);
            Route::get('/{uuid}', [TransactionController::class, 'detail']);
        });

        Route::prefix('course')->group(function () {
            Route::get('/', [MyCourseController::class, 'index']);
        });
    });

    Route::prefix('checkout')->group(function () {
        Route::get('payment-methods', [PaymentMethodController::class, 'show']);
        Route::post('charge', [TransactionController::class, 'charge']);
    });
});
