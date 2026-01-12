<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCoaAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('coa_accounts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('name', 255);
            $table->integer('code')->nullable();
            $table->integer('coa_group_id');
            $table->integer('coa_sub_group_id')->default(0);
            $table->bigInteger('person_id')->nullable();
            $table->string('type', 20)->nullable();
            $table->text('description')->nullable();
            $table->double('dep_percentage')->default(0);
            $table->tinyInteger('isActive')->default(1);
            $table->tinyInteger('isDefault')->default(0);
            $table->timestamps();

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
        Schema::dropIfExists('coa_accounts');
    }
}
