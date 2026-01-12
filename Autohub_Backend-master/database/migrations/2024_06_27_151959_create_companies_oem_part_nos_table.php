<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesOemPartNosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies_oem_part_nos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->bigInteger('oem_part_no_id');
            $table->integer('company_id');
            $table->string('number1', 255)->nullable();
            $table->string('number2', 255)->nullable();
            $table->string('number3', 255)->nullable();
            $table->string('number4', 255)->nullable();
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
        Schema::dropIfExists('companies_oem_part_nos');
    }
}
