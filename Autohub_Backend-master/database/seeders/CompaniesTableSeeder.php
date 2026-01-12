<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompaniesTableSeeder extends Seeder
{
    public function run()
    {
        $companies = [
            ['name' => 'Donaldson'],
            ['name' => 'Fleetguard'],
            ['name' => 'Baldwin'],
            ['name' => 'Sakura'],
            ['name' => 'MANN'],
            ['name' => 'Komai'],
            ['name' => 'JESON'],
            ['name' => 'Yaotai'],
            ['name' => 'UNITRUCK'],
            ['name' => 'Doosan'],
            ['name' => 'Bullsoneshot'],
            ['name' => 'HDK'],
            ['name' => 'HANDOK'],
            ['name' => 'DSCO'],
            ['name' => 'FLUTEK'],
            ['name' => 'KJC'],
            ['name' => 'Caltex'],
            ['name' => 'GP'],
            ['name' => 'PTH'],
            ['name' => 'CHINA'],
            ['name' => 'BAOCH'],
            ['name' => 'Sinolon'],
            ['name' => 'Sinopec'],
            ['name' => 'HAFLON'],
            ['name' => 'Perfect'],
            ['name' => 'CTP'],
            ['name' => 'KYG'],
            ['name' => 'KOVAX'],
            ['name' => 'PakWin'],
            ['name' => 'HITACHI'],
            ['name' => 'Lipon'],
            ['name' => 'HLX'],
            ['name' => 'Local'],
            ['name' => 'BOSI TOOLS'],
            ['name' => 'YCYY'],
            ['name' => 'VOLVO'],
            ['name' => 'DENFOS'],
            ['name' => 'DIAMOND'],
            ['name' => 'ZONEX'],
            ['name' => 'Shell'],
            ['name' => 'Galaxy'],
            ['name' => 'Star'],
            ['name' => 'Original Used'],
            ['name' => 'DONGBO'],
            ['name' => 'DONGBU'],
            ['name' => 'CATERPILLAR'],
            ['name' => 'GERMAN'],
            ['name' => 'CINOPEC'],
            ['name' => 'CEEPEC'],
            ['name' => 'GAINUOPOWER'],
            ['name' => 'LEPPON'],
            ['name' => 'MICRO'],
            ['name' => 'LONGLIFE'],
            ['name' => 'WEILIDA'],
            ['name' => 'SHANGHAI DIESEL'],
            ['name' => 'BT KOREA'],
            ['name' => 'NTN'],
            ['name' => 'ZF'],
            ['name' => 'RKS KOREA'],
            ['name' => 'PERKINS'],
            ['name' => 'Rexroth'],
            ['name' => 'AMC'],
            ['name' => 'INK STYLE'],
            ['name' => 'CATERPILLAR CHINA'],
            ['name' => 'RUI LAN'],
            ['name' => 'DONGBU CHINA'],
            ['name' => 'SK'],
            ['name' => 'Fleetguard SP'],
            ['name' => 'DAEWOO'],
            ['name' => 'WIKA'],
            ['name' => 'ADVANCE'],
            ['name' => 'HH'],
            ['name' => 'GuaRD Filters'],
            ['name' => 'JOHN DEERE'],
            ['name' => 'PGT'],
            ['name' => 'POWERLIFT Rib-Ace'],
            ['name' => 'DENSO'],
            ['name' => 'MACHINERY'],
            ['name' => 'City 03-08, Jazz'],
            ['name' => 'DONALDSON SP'],
            ['name' => 'Civic 01-06'],
            ['name' => 'Civic 96-00'],
            ['name' => 'HG'],
            ['name' => 'WG'],
            ['name' => 'CATERPILLAR (USED)'],
            ['name' => 'PURE COMPONENT'],
            ['name' => 'DCEC'],
            ['name' => 'MACHINERY PARTS'],
            ['name' => 'VESLEE'],
            ['name' => 'SHENGYU'],
            ['name' => 'HBGLAND'],
            ['name' => 'GIANT'],
            ['name' => 'RWH'],
            ['name' => 'HYUNDAI'],
            ['name' => 'IMPORTED'],
        ];

        $timestamp = Carbon::now();

        foreach ($companies as &$company) {
            $company['created_at'] = $timestamp;
            $company['updated_at'] = $timestamp;
        }

        DB::table('companies')->insert($companies);
    }
}
