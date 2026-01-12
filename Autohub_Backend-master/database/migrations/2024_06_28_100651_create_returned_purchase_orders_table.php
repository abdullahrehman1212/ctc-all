<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnedPurchaseOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('returned_purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Nullable unsigned big integer for user ID
            $table->bigInteger('purchase_order_id')->unsigned();
            $table->string('remarks', 155)->nullable();
            $table->double('total')->nullable();
            $table->double('discount')->default(0);
            $table->double('deduction')->default(0);
            $table->double('tax')->nullable();
            $table->double('total_after_tax')->nullable();
            $table->double('tax_in_figure')->nullable();
            $table->double('total_after_discount')->nullable();
            $table->date('return_date')->nullable();

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
        Schema::dropIfExists('returned_purchase_orders');
    }
}
