<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePeoplePersonTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('people_person_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->bigInteger('person_id')->unsigned();
            $table->integer('person_type_id');
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps

            // Foreign key constraints

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Example foreign key for user_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('people_person_types');
    }
}
