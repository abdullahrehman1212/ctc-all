<?php

namespace App\Models;

use App\Models\MachinePart;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MachinePartItem extends Model
{
    use HasFactory;

    protected $table = 'item_oem_part_model_item';

    protected $fillable = ['items_id' , 'name','user_id'];
}
