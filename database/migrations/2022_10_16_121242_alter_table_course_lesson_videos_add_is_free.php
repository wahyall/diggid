<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('course_lesson_videos', function (Blueprint $table) {
            $table->boolean('is_free')->default(false)->after('order')->comment('Is free video (for highlight)');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('course_lesson_videos', function (Blueprint $table) {
            //
        });
    }
};
