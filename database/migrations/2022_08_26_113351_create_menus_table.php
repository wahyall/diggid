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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('url')->nullable();
            $table->string('route')->nullable()->comment('Route name');
            $table->string('component')->nullable()->comment('Relative on resources/js/pages');
            $table->integer('parent_id')->default(0);
            $table->boolean('shown')->default(true)->comment('Determines whether the menu is shown on dashboard or not');
            $table->string('middleware')->nullable()->comment('Pipe separated middleware, e.g. auth|verified');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('menus');
    }
};
