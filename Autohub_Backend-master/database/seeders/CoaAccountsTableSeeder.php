<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;



class CoaAccountsTableSeeder extends Seeder
{

    public function run()
    {
        $coa_accounts = [
            ['id' => 1, 'name' => 'Inventory', 'code' => 101001, 'coa_group_id' => 1, 'coa_sub_group_id' => 1, 'person_id' => NULL, 'type' => NULL, 'description' => 'Inventory', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 3, 'name' => 'Cost Inventory', 'code' => 901001, 'coa_group_id' => 9, 'coa_sub_group_id' => 3, 'person_id' => NULL, 'type' => NULL, 'description' => 'Cost Inventory', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 4, 'name' => 'Goods Sold', 'code' => 701001, 'coa_group_id' => 7, 'coa_sub_group_id' => 4, 'person_id' => NULL, 'type' => NULL, 'description' => 'Goods Sold', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 23, 'name' => 'GST', 'code' => 401001, 'coa_group_id' => 4, 'coa_sub_group_id' => 10, 'person_id' => NULL, 'type' => NULL, 'description' => 'GST', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 27, 'name' => 'Cost Inventory (Discounts)', 'code' => 901002, 'coa_group_id' => 9, 'coa_sub_group_id' => 3, 'person_id' => NULL, 'type' => NULL, 'description' => 'Cost Inventory (Discounts)', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 28, 'name' => 'Goods Sold (Discounts)', 'code' => 701002, 'coa_group_id' => 7, 'coa_sub_group_id' => 4, 'person_id' => NULL, 'type' => NULL, 'description' => 'Goods Sold (Discounts)', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 30, 'name' => 'Purchase Tax Expense', 'code' => 801002, 'coa_group_id' => 8, 'coa_sub_group_id' => 7, 'person_id' => NULL, 'type' => NULL, 'description' => 'Purchase Tax Expense', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
            ['id' => 31, 'name' => 'Purchase Tax Payable', 'code' => 401002, 'coa_group_id' => 4, 'coa_sub_group_id' => 10, 'person_id' => NULL, 'type' => NULL, 'description' => 'Purchase Tax Payable', 'dep_percentage' => 0, 'isActive' => 1, 'isDefault' => 1],
        ];

        $timestamp = Carbon::now();

        foreach ($coa_accounts as &$account) {
            $account['created_at'] = $timestamp;
            $account['updated_at'] = $timestamp;
        }

        DB::table('coa_accounts')->insert($coa_accounts);
    }
}
