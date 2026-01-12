<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->string('company_name');
            $table->string('username');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('city');
            $table->string('address');
            $table->string('logo')->nullable();
            $table->text('invoice_note');
            $table->text('ntn')->nullable();
            $table->text('gst')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->tinyInteger('auto_logout')->default(1);
            $table->timestamp('trial_login_at')->nullable();
            $table->integer('is_active')->default(1);
            $table->integer('admin_id')->nullable();
            $table->integer('role_id');
            $table->integer('company_id');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
