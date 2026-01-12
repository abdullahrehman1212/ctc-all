<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReturnRackShelvesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('return_rack_shelves', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // Nullable unsigned big integer for user ID
            $table->unsignedBigInteger('store_id')->nullable();
            $table->unsignedInteger('item_id')->nullable();
            $table->unsignedInteger('rack_id')->nullable();
            $table->unsignedInteger('shelf_id')->nullable();
            $table->integer('quantity')->nullable();
            $table->unsignedInteger('return_purchase_order_id')->nullable();
            $table->unsignedInteger('return_purchase_order_child_id')->nullable();
            $table->timestamps();

            // Adding user_id column as foreign key
        
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Indexes

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('return_rack_shelves');
    }
}
