<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachinePartOemDimension extends Model
{
    use HasFactory;
    protected $fillable = ['machine_part_oem_part_nos_machine_models_id','user_id', 'dimension_id', 'value',];

    public function dimensionId()
    {
        return $this->belongsTo(Dimension::class,  'dimension_id', 'id');
    }
}
