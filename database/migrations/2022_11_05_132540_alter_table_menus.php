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
        Schema::table('menus', function (Blueprint $table) {
            $table->boolean('heading')->default(false)->comment('Determines whether the menu is a heading or not');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('menus', function (Blueprint $table) {
            //
        });
    }
};
