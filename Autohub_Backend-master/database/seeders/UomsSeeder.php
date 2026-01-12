<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UomsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('uoms')->insert([
            ['name' => 'KG'],
            ['name' => 'Piece'],
            ['name' => 'LIter'],
            ['name' => 'Carton'],
        ]);
    }
}
