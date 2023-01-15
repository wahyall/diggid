<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('my_course_progress', function (Blueprint $table) {
      $table->renameColumn('has_wacthed', 'has_watched');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('my_course_progresses', function (Blueprint $table) {
      //
    });
  }
};
