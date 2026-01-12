<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVoucherTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('voucher_transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('voucher_id');
            $table->unsignedBigInteger('coa_account_id');
            $table->double('debit', 15, 2)->default(0);
            $table->double('credit', 15, 2)->default(0);
            $table->double('balance', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('land_id')->nullable();
            $table->unsignedInteger('land_payment_head_id')->nullable();
            $table->unsignedBigInteger('plot_id')->nullable();
            $table->unsignedBigInteger('person_id')->nullable();
            $table->tinyInteger('is_approved')->default(0);
            $table->tinyInteger('is_post_dated')->default(0);
            $table->unsignedBigInteger('salary_slip_id')->nullable();
            $table->unsignedBigInteger('loan_amortization_id')->nullable();
            $table->timestamp('date')->useCurrent();
            $table->timestamps();
            $table->softDeletes();
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
        Schema::dropIfExists('voucher_transactions');
    }
}
