<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['id' => 1, 'name' => 'Filter'],
            ['id' => 4, 'name' => 'Injector Cleaner'],
            ['id' => 5, 'name' => 'Hydraulic'],
            ['id' => 6, 'name' => 'Crawler'],
            ['id' => 7, 'name' => 'Swing'],
            ['id' => 8, 'name' => 'Wheel'],
            ['id' => 9, 'name' => 'Transmission'],
            ['id' => 10, 'name' => 'Seal Kit'],
            ['id' => 11, 'name' => 'Seal Group'],
            ['id' => 12, 'name' => 'LUBRICANT'],
            ['id' => 13, 'name' => 'OIL'],
            ['id' => 14, 'name' => 'ELECTRICAL'],
            ['id' => 15, 'name' => 'Grease Gun'],
            ['id' => 16, 'name' => 'Undercarriage'],
            ['id' => 17, 'name' => 'Engine'],
            ['id' => 18, 'name' => 'Hardware'],
            ['id' => 19, 'name' => 'Tools'],
            ['id' => 20, 'name' => 'Blade'],
            ['id' => 21, 'name' => 'Transmission System'],
            ['id' => 22, 'name' => 'Mechanical'],
            ['id' => 25, 'name' => 'Chassis'],
            ['id' => 26, 'name' => 'Body'],
            ['id' => 27, 'name' => 'Shock Absorber'],
            ['id' => 28, 'name' => 'Cleaning'],
            ['id' => 29, 'name' => 'Assembly'],
            ['id' => 30, 'name' => 'Coolant1'],
        ];

        $timestamp = Carbon::now();

        foreach ($categories as &$category) {
            $category['created_at'] = $timestamp;
            $category['updated_at'] = $timestamp;
        }

        DB::table('categories')->insert($categories);
    }

}
