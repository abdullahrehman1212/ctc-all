<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'Superadmin ',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('admin123'),
            'role_id' => '1', // Assuming you have a 'role' column in your users table to distinguish user roles
        ]);
    }
}
