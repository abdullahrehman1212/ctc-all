<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;
class PackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Package::create( ['name' => 'Free Trial','price'=> '0','features'=>'Dashboard stats, Parts Management, Inventory','no_of_salesman'=>0]);
        Package::create( ['name' => 'Basic','price'=> '1000','features'=>'Dashboard stats, Parts Management, Inventory','no_of_salesman'=>2]);
        Package::create( ['name' => 'Silver','price'=> '2000','features'=>'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores','no_of_salesman'=>4]);
        Package::create( ['name' => 'Gold','price'=> '3000','features'=>'Dashboard stats, Parts Management, Inventory, Sale, Transfer, Supplier, Customer, Stores, Reports, Expense Type, Accounts, Vouchers, Financial Statements, Manage','no_of_salesman'=>10]);
    }
}
