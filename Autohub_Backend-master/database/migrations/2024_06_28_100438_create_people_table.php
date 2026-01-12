<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeopleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->string('name', 255)->nullable();
            $table->string('father_name', 255)->nullable();
            $table->string('phone_no', 20)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('cnic', 20)->nullable();
            $table->text('address')->nullable();
            $table->tinyInteger('isActive')->default(1); // Default to active
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps

            // Foreign key for user_id
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
        Schema::dropIfExists('people');
    }
}
