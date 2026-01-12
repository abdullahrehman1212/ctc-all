<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemInventoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('item_inventory', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->bigInteger('purchase_order_id')->nullable();
            $table->integer('invoice_id')->nullable();
            $table->integer('inventory_type_id');
            $table->bigInteger('item_id');
            $table->double('purchase_price')->nullable();
            $table->integer('store_id');
            $table->string('quantity_in', 255)->nullable();
            $table->string('quantity_out', 255);
            $table->date('date')->nullable();
            $table->timestamps();
            $table->integer('return_child_invoice_id')->nullable();
            $table->integer('return_child_po_id')->nullable();
            $table->integer('rack_id')->nullable();
            $table->integer('shelf_id')->nullable();
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
        Schema::dropIfExists('item_inventory');
    }
}
