<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseOrderChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_order_children', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Nullable unsigned big integer for user ID
            $table->bigInteger('purchase_order_id')->unsigned();
            $table->bigInteger('item_id')->unsigned();
            $table->double('quantity', 30, 2); // Double with precision and scale
            $table->double('received_quantity')->default(0);
            $table->double('purchase_price')->default(0);
            $table->double('dollar_price')->default(0);
            $table->double('amount')->default(0);
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
        Schema::dropIfExists('purchase_order_children');
    }
}
