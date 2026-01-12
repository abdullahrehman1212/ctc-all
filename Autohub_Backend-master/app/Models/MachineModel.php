<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineModel extends Model
{
    use HasFactory;
    protected $fillable = ['name','user_id', 'make_id', 'machine_id'];

    public function machine()
    {
        return $this->belongsTo(Machine::class);
    }

    public function make()
    {
        return $this->belongsTo(Make::class);
    }
}
