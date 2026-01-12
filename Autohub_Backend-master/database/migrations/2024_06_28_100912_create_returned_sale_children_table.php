<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnedSaleChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('returned_sale_children', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->integer('returned_sales_id')->unsigned();
            $table->bigInteger('item_id')->unsigned();
            $table->double('quantity')->default(0);
            $table->double('returned_quantity')->default(0);
            $table->double('price')->default(0);
            $table->double('cost')->default(0);
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps
            // Foreign key constraints
            // Foreign key constraint for user_id referencing the 'id' column in the 'users' table
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
        Schema::dropIfExists('returned_sale_children');
    }
}
