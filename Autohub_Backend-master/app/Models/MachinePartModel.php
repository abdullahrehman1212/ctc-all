<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachinePartModel extends Model
{
    use HasFactory;
    // protected $table = ['machine_parts_models'];
    protected $fillable = ['id', 'name','user_id', 'machine_part_id', 'description'];

    public function machinePart()
    {
        return $this->belongsTo(MachinePart::class, 'machine_part_id', 'id')->with('subcategories');
    }
}
