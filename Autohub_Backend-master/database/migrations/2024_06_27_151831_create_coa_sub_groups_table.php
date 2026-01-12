<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoaSubGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coa_sub_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->string('name', 255);
            $table->integer('code')->nullable();
            $table->integer('coa_group_id');
            $table->tinyInteger('is_default')->default(0);
            $table->string('type', 20)->nullable();
            $table->tinyInteger('isActive')->default(1);
            $table->timestamps();

            // Adding the user_id foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('coa_sub_groups');
    }
}
