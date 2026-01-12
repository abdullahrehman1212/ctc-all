<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubCategoriesTableSeeder extends Seeder
{
    public function run()
    {
        $sub_categories = [
            ['id' => 1, 'name' => 'Fuel Filter', 'category_id' => 1],
            ['id' => 2, 'name' => 'Hydraulic Return Filter', 'category_id' => 1],
            ['id' => 3, 'name' => 'Oil Filter', 'category_id' => 1],
            ['id' => 4, 'name' => 'Pilot Filter', 'category_id' => 1],
            ['id' => 5, 'name' => 'Brake Filter', 'category_id' => 1],
            ['id' => 6, 'name' => 'Air Filter', 'category_id' => 1],
            ['id' => 7, 'name' => 'Fuel Water Seperator', 'category_id' => 1],
            ['id' => 9, 'name' => 'Diesel Injector Cleaner', 'category_id' => 4],
            ['id' => 10, 'name' => 'Diesel Injector Cleaner 500ml', 'category_id' => 4],
            ['id' => 11, 'name' => 'Suction Filter', 'category_id' => 1],
            ['id' => 12, 'name' => 'Hydraulic Pump', 'category_id' => 5],
            ['id' => 13, 'name' => 'Crawling Motor', 'category_id' => 6],
            ['id' => 14, 'name' => 'Swing Motor', 'category_id' => 7],
            ['id' => 15, 'name' => 'Jeck', 'category_id' => 5],
            ['id' => 16, 'name' => 'Hub', 'category_id' => 8],
            ['id' => 17, 'name' => 'Hub/Brake', 'category_id' => 8],
            ['id' => 18, 'name' => 'Seal', 'category_id' => 9],
            ['id' => 19, 'name' => 'Swing Device', 'category_id' => 7],
            ['id' => 20, 'name' => 'Lever', 'category_id' => 5],
            ['id' => 21, 'name' => 'Padel', 'category_id' => 5],
            ['id' => 22, 'name' => 'O-Ring', 'category_id' => 11],
            ['id' => 23, 'name' => 'DIESEL ENGINE OIL', 'category_id' => 12],
            ['id' => 24, 'name' => 'HYDRAULIC OIL', 'category_id' => 13],
            ['id' => 25, 'name' => 'ELECTRICALL', 'category_id' => 14],
            ['id' => 26, 'name' => 'Grease', 'category_id' => 12],
            ['id' => 27, 'name' => 'Nosel', 'category_id' => 15],
            ['id' => 28, 'name' => 'Hydraulic Cylinder', 'category_id' => 5],
            ['id' => 29, 'name' => 'Wheel Hub', 'category_id' => 16],
            ['id' => 30, 'name' => 'Throttle', 'category_id' => 17],
            ['id' => 31, 'name' => 'Assembly Kit', 'category_id' => 5],
            ['id' => 32, 'name' => 'Race Padel', 'category_id' => 9],
            ['id' => 33, 'name' => 'Fuel', 'category_id' => 17],
            ['id' => 34, 'name' => 'Hardware Tools', 'category_id' => 18],
            ['id' => 35, 'name' => 'General', 'category_id' => 19],
            ['id' => 36, 'name' => 'Tendum', 'category_id' => 16],
            ['id' => 37, 'name' => 'KNUCKLE', 'category_id' => 16],
            ['id' => 38, 'name' => 'Gear Oil', 'category_id' => 12],
            ['id' => 39, 'name' => 'Filter Set', 'category_id' => 1],
            ['id' => 40, 'name' => 'Blade Circle', 'category_id' => 20],
            ['id' => 41, 'name' => 'Cutting Edge', 'category_id' => 20],
            ['id' => 42, 'name' => 'Cabin', 'category_id' => 21],
            ['id' => 43, 'name' => 'Pulley', 'category_id' => 17],
            ['id' => 44, 'name' => 'Mirror', 'category_id' => 21],
            ['id' => 45, 'name' => 'Hydraulic Filter', 'category_id' => 5],
            ['id' => 46, 'name' => 'Shock Absorber', 'category_id' => 22],
            ['id' => 47, 'name' => 'Engine Mount', 'category_id' => 17],
            ['id' => 48, 'name' => 'Oil Pump', 'category_id' => 13],
            ['id' => 49, 'name' => 'Shock', 'category_id' => 8],
            ['id' => 50, 'name' => 'Control Arm', 'category_id' => 22],
            ['id' => 51, 'name' => 'Frame', 'category_id' => 25],
            ['id' => 52, 'name' => 'Bush', 'category_id' => 25],
            ['id' => 53, 'name' => 'Mount', 'category_id' => 17],
            ['id' => 54, 'name' => 'Cleaningg', 'category_id' => 28],
            ['id' => 55, 'name' => 'Petrol Engine Oil', 'category_id' => 12],
            ['id' => 56, 'name' => 'Control Valve', 'category_id' => 29],
            ['id' => 57, 'name' => 'Radiator', 'category_id' => 30],
            ['id' => 58, 'name' => 'Headlights', 'category_id' => 26],
            ['id' => 59, 'name' => 'HYD Filter', 'category_id' => 1],
        ];

        $timestamp = Carbon::now();

        foreach ($sub_categories as &$sub_category) {
            $sub_category['created_at'] = $timestamp;
            $sub_category['updated_at'] = $timestamp;
        }

        DB::table('sub_categories')->insert($sub_categories);
    }
}
