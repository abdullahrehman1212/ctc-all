<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMachinePartOemPartNosMachineModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('machine_part_oem_part_nos_machine_models', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();

            $table->string('name', 255)->nullable();
            $table->string('primary_oem', 255)->nullable();
            $table->double('sale_price')->nullable();
            $table->double('purchase_price')->nullable();
            $table->double('purchase_dollar_rate')->default(0);
            $table->double('min_price')->default(0);
            $table->double('max_price')->default(0);
            $table->double('last_sale_price')->default(0);
            $table->bigInteger('machine_part_oem_part_no_id');
            $table->integer('machine_model_id');
            $table->integer('brand_id');
            $table->integer('origin_id')->nullable();
            $table->string('from_year', 255)->nullable();
            $table->string('to_year', 255)->nullable();
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps
            $table->double('avg_cost')->nullable();
            $table->double('avg_expense')->default(0);
            $table->double('avg_price')->default(0);

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
        Schema::dropIfExists('machine_part_oem_part_nos_machine_models');
    }
}
