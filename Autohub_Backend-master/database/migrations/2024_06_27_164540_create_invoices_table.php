<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->integer('store_id')->nullable();
            $table->bigInteger('customer_id')->nullable();
            $table->string('delivered_to', 255)->default('NA');
            $table->string('invoice_no', 255)->nullable();
            $table->string('walk_in_customer_name', 255)->nullable();
            $table->date('date');
            $table->string('remarks', 155)->nullable();
            $table->double('total_amount');
            $table->double('discount')->default(0);
            $table->double('total_after_discount');
            $table->double('received_amount')->nullable();
            $table->double('bank_received_amount')->nullable();
            $table->integer('is_pending_neg_inventory')->default(0);
            $table->integer('tax_type')->nullable();
            $table->integer('sale_type')->nullable();
            $table->double('gst')->default(0);
            $table->double('total_after_gst')->nullable();
            $table->integer('is_pending')->default(0);
            $table->timestamps();
            $table->double('gst_percentage')->nullable();
            $table->integer('account_id')->nullable();
            $table->integer('bank_account_id')->nullable();

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
        Schema::dropIfExists('invoices');
    }
}
