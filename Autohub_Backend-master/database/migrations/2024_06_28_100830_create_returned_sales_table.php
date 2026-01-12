<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnedSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('returned_sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->unsignedBigInteger('inv_id');
            $table->date('return_date')->nullable();
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps
            $table->integer('store_id')->nullable();
            $table->string('remarks', 255)->nullable();
            $table->double('total_amount')->nullable();
            $table->double('received_amount')->nullable();
            $table->double('bank_received_amount')->nullable();
            $table->integer('account_id')->nullable();
            $table->integer('bank_account_id')->nullable();
            $table->double('discount')->nullable();
            $table->double('deduction')->nullable();
            $table->double('gst')->nullable();
            $table->double('gst_percentage')->nullable();
            $table->double('total_after_gst')->nullable();
            $table->double('total_after_discount')->nullable();

            // Foreign key constraints

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Example foreign key for user_id
            // Add more foreign keys as necessary
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('returned_sales');
    }
}
