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
        Schema::create('dashboard_menus', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon');
            $table->string('component')->nullable();
            $table->integer('parent_id')->default(0);
            $table->boolean('shown')->default(true)->comment('Determines whether the menu is shown on dashboard or not');
            $table->string('role_accesses')->nullable()->comment('Comma separated middleware, e.g. user,admin,mentor')->default('admin');
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
