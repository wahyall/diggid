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
        Schema::create('my_course_progress', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->foreignId('my_course_id')->constrained('my_courses')->cascadeOnDelete();
            $table->foreignId('course_lesson_video_id')->constrained('course_lesson_videos')->cascadeOnDelete();
            $table->boolean('has_wacthed')->default(false)->comment('Wether the video has watched or not');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('my_course_progress');
    }
};
