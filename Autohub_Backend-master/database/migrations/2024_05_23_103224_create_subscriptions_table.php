<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('package_id')->nullable()->constrained('packages')->onDelete('set null');
            $table->enum('type', ['monthly','6months', 'yearly','days','weeks']);
            $table->text('duration');
            $table->integer('status')->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
        
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
