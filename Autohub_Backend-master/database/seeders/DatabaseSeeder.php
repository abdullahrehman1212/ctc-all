<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            SuperAdminSeeder::class,
            // CoaAccountsTableSeeder::class,
            CompaniesTableSeeder::class,
            UomsSeeder::class,
            MachinePartTypesSeeder::class,
            // CategoriesTableSeeder::class,
            // SubCategoriesTableSeeder::class,
            CoaGroupSeeder::class,
            CoaSubGroupSeeder::class,
            PackagesSeeder::class,
            VoucherTypeSeeder::class,


        ]);
    }
}
