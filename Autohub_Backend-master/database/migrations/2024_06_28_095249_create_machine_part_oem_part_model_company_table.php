<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMachinePartOemPartModelCompanyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('machine_part_oem_part_model_company', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('number3', 255)->nullable();
            $table->unsignedInteger('machine_part_oem_part_nos_machine_models_id');
            $table->unsignedInteger('brands_id');
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps

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
        Schema::dropIfExists('machine_part_oem_part_model_company');
    }
}
