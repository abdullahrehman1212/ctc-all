<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOemPartNosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('oem_part_nos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->string('number1', 255)->nullable();
            $table->string('number2', 255)->nullable();
            $table->string('number3', 255)->nullable();
            $table->string('number4', 255)->nullable();
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps

            // Foreign key constraint
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
        Schema::dropIfExists('oem_part_nos');
    }
}
