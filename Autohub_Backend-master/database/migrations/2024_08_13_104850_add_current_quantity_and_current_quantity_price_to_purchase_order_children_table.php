<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCurrentQuantityAndCurrentQuantityPriceToPurchaseOrderChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('purchase_order_children', function (Blueprint $table) {
            $table->double('current_quantity')->after('unit_expense')->nullable();
            $table->double('current_quantity_price')->after('current_quantity')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('purchase_order_children', function (Blueprint $table) {
            //
        });
    }
}
