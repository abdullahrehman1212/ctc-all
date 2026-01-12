<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnedPurchaseOrderChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('returned_purchase_order_children', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Nullable unsigned big integer for user ID
            $table->bigInteger('returned_purchase_order_id')->unsigned();
            $table->bigInteger('item_id')->unsigned();
            $table->double('returned_quantity')->default(0);
            $table->double('purchase_price')->nullable();
            $table->double('amount')->nullable();
            $table->double('expense')->default(0);
            $table->double('unit_expense')->default(0);
            $table->string('remarks', 155)->nullable();

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
        Schema::dropIfExists('returned_purchase_order_children');
    }
}
