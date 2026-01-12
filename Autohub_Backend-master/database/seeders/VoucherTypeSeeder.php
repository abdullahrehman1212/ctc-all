<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoucherTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('voucher_types')->insert([
            ['name' => 'PV'],
            ['name' => 'RV'],
            ['name' => 'JV'],
            ['name' => 'CV'],
        ]);

    }
}
