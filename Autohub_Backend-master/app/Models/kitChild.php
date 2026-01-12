<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class kitChild extends Model
{
    use HasFactory;
    protected $table = 'kit_child';
    protected $fillable = ['parent_id','user_id', 'item_id', 'quantity'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'itemInventory');
    }
    public function exisitingItemInventory()
    {
        return $this->hasOne(ItemInventory::class, 'item_id', 'item_id')->groupby('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as existing_quantity'), 'id', 'item_id', 'store_id');
    }
    public function setsname()
    {
        return $this->hasOne(MachinePart::class,  'id', 'parent_id');
    }
    public function setsinventory()
    {
        return $this->hasMany(ItemInventory::class,  'item_id', 'item_id');
    }
    public function existingSetInventory()
    {
        return $this->hasOne(ItemInventory::class,  'item_id', 'parent_id')->groupby('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as existing_set_quantity'), 'id', 'item_id', 'store_id');
    }
}
