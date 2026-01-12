<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoaGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('coa_groups')->insert([
            'name' => 'Current Assets',
            'type'=>'BS',
            'parent'=>'Assets',
            'code'=>1,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Long Term Assets',
            'type'=>'BS',
            'parent'=>'Assets',
            'code'=>2,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Current Liabilities',
            'type'=>'BS',
            'parent'=>'Liabilities',
            'code'=>3,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Long Term Liabilities',
            'type'=>'BS',
            'parent'=>'Liabilities',
            'code'=>4,
        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Capital',
            'type'=>'BS',
            'parent'=>'Capital',
            'code'=>5,


        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Drawings',
            'type'=>'BS',
            'parent'=>'Capital',
            'code'=>6,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Revenues',
            'type'=>'IS',
            'parent'=>'Revenues',
            'code'=>7,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Expenses',
            'type'=>'IS',
            'parent'=>'Expenses',
            'code'=>8,

        ]);
        DB::table('coa_groups')->insert([
            'name' => 'Cost',
            'type'=>'IS',
            'parent'=>'Cost',
            'code'=>9,

        ]);
    }
}
