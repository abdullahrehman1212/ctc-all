<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachinePartOemPartNosMachineModel extends Model
{
    use HasFactory;

    protected $table = 'machine_part_oem_part_nos_machine_models';

    protected $fillable = [
        'user_id',
        'name',
        'primary_oem',
        'sale_price',
        'purchase_price',
        'purchase_dollar_rate',
        'min_price',
        'max_price',
        'last_sale_price',
        'machine_part_oem_part_no_id',
        'machine_model_id',
        'brand_id',
        'origin_id',
        'from_year',
        'to_year',
        'avg_cost'
    ];
}
