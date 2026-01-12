<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchaseOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Nullable unsigned big integer for user ID
            $table->bigInteger('person_id')->nullable();
            $table->string('po_no', 255);
            $table->integer('store_id')->nullable();
            $table->string('remarks', 155)->nullable();
            $table->tinyInteger('is_received')->default(0); // Boolean-like column
            $table->integer('is_approve')->default(0);
            $table->integer('is_cancel')->default(0);
            $table->integer('is_pending')->default(1);
            $table->date('request_date');
            $table->double('total')->default(0);
            $table->double('discount')->default(0);
            $table->double('tax')->default(0);
            $table->double('total_after_tax')->default(0);
            $table->double('tax_in_figure')->default(0);
            $table->double('total_after_discount')->default(0);
            $table->double('dollar_rate')->default(0);
            $table->bigInteger('created_by'); // Assuming this references a user or creator
            $table->timestamps(); // Adds created_at and updated_at columns with default timestamps
            $table->integer('is_completed')->default(0);
            $table->date('received_date')->nullable();

            // Foreign key for user_id (created_by)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Example foreign key for user_id (created_by)
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchase_orders');
    }
}
