<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brands extends Model
{
    use HasFactory;

    protected $table = 'machine_part_oem_part_model_company';

    protected $fillable = [
        'id',
        'machine_part_oem_part_nos_machine_models_id',
        'brands_id',
        'number3',
    ];

    public function alternate_brands(){
        return $this->belongsTo(Company::class,'brands_id');
    }

}
