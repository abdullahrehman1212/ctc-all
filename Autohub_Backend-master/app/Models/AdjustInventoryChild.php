<?php

namespace App\Models;

use App\Models\Person;
use App\Models\ItemOemPartModeles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdjustInventoryChild extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'adjust_inventory_id',
        'item_id',
        'quantity_in',
        'quantity_out',
        'purchase_price',
        'total',
        'cost',
    ];
    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id');
    }

    public function manufacture()
    {
        return $this->belongsTo(Person::class, 'manufacture_id', 'id');
    }

}
