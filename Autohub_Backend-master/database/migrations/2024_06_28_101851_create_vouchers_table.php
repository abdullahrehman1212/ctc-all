<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVouchersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->tinyInteger('type')->comment('payment = 1, receipt = 2, JV = 3');
            $table->string('name', 255)->nullable();
            $table->bigInteger('voucher_no');
            $table->unsignedBigInteger('purchase_order_id')->nullable();
            $table->date('date')->default(now());
            $table->double('total_amount');
            $table->string('cheque_no', 255)->nullable();
            $table->date('cheque_date')->nullable();
            $table->tinyInteger('isApproved')->default(0);
            $table->tinyInteger('is_post_dated')->default(0);
            $table->timestamp('cleared_date')->nullable();
            $table->tinyInteger('is_auto')->default(0);
            $table->date('generated_at')->nullable();
            $table->bigInteger('booking_id')->nullable();
            $table->integer('invoice_id')->nullable();
            $table->integer('returned_sales_id')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->integer('return_invoice_id')->nullable();
            $table->integer('return_po_id')->nullable();
            // Adding user_id column as foreign key
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
        Schema::dropIfExists('vouchers');
    }
}
