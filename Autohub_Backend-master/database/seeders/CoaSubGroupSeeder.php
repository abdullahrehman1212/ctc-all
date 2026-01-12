<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoaSubGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         DB::table('coa_sub_groups')->insert([
        ['id' => 1, 'name' => 'Inventory', 'code' => 101, 'coa_group_id' => 1, 'is_default' => 1, 'type' => null, 'isActive' => 1 ],
        ['id' => 2, 'name' => 'Purchase Orders Payables', 'code' => 301, 'coa_group_id' => 3, 'is_default' => 1, 'type' => null, 'isActive' => 1],
        ['id' => 3, 'name' => 'Goods Purchased Cost', 'code' => 901, 'coa_group_id' => 9, 'is_default' => 1, 'type' => null, 'isActive' => 1],
        ['id' => 4, 'name' => 'Goods Revenue', 'code' => 701, 'coa_group_id' => 7, 'is_default' => 1, 'type' => null, 'isActive' => 1],
        ['id' => 5, 'name' => 'Cash', 'code' => 102, 'coa_group_id' => 1, 'is_default' => 1, 'type' => 'cash', 'isActive' => 1],
        ['id' => 6, 'name' => 'Bank', 'code' => 103, 'coa_group_id' => 1, 'is_default' => 1, 'type' => 'cash', 'isActive' => 1],
        ['id' => 7, 'name' => 'Purchase Expenses', 'code' => 801, 'coa_group_id' => 8, 'is_default' => 1, 'type' => null, 'isActive' => 1],
        ['id' => 8, 'name' => 'Purchase expenses Payables', 'code' => 302, 'coa_group_id' => 3, 'is_default' => 1, 'type' => null, 'isActive' => 1],
        ['id' => 9, 'name' => 'Sales Customer Receivables', 'code' => 104, 'coa_group_id' => 1, 'is_default' => 0, 'type' => null, 'isActive' => 1],
        ['id' => 12,'name' => 'Owner Equity', 'code' => 501, 'coa_group_id' => 5, 'is_default' => 0, 'type' => null, 'isActive' => 1],
        ['id' => 29,'name' => 'Other Payables', 'code' => 304, 'coa_group_id' => 4, 'is_default' => 0, 'type' => null, 'isActive' => 1],

    ]);
    }
}
