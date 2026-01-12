<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class kitParent extends Model
{
    use HasFactory;
    protected $table = 'kit_parent';
    protected $fillable = ['name','user_id'];

    public function kitchild()
    {
        return $this->hasMany(kitChild::class, 'parent_id', 'id')->with('item', 'exisitingItemInventory');
    }
    public function kitInventory()
    {
        return $this->hasMany(kitInventory::class, 'kit_id', 'id')->with('itemInventory');
    }
    public function existingkitInventory()
    {
        return $this->hasOne(kitInventory::class, 'kit_id', 'id')->groupby('kit_id')
            ->select(DB::raw('SUM(in_flow) - SUM(out_flow) as kits_available'), 'id', 'kit_id', 'store_id');;
    }
}
