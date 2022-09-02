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
        Schema::create('course_discussion_comments', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->longText('body');
            $table->foreignId('course_discussion_id')->constrained('course_discussions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->integer('upvote');
            $table->boolean('is_verified')->default(false)->comment('Whether the comment is verified by the creator of the discussion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('course_discussion_comments');
    }
};
