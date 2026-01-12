<?php

namespace App\Models;

use App\Models\Item;
use App\Models\ItemInventory;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdjustInventory extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($adjustInventory) {
            $lastAdjustInventory = static::withTrashed()
                ->where('user_id', $adjustInventory->user_id)
                ->latest('adjust_no')
                ->first();

            $lastAdjustNumber = $lastAdjustInventory
                ? $lastAdjustInventory->adjust_no
                : '3000000';

            $newAdjustNumber = (int)$lastAdjustNumber + 1;

            $adjustInventory->adjust_no = (string)$newAdjustNumber;
        });
    }


    protected $fillable = [
        'user_id',
        'remarks',
        'date',
        'adjust_type',
        'total_amount',
    ];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('subcategory', 'category', 'itemAvaiableInventory', 'strengthunit');
    }
    public function itemInventory()
    {
        return $this->hasMany(ItemInventory::class, 'adjust_inventory_id', 'id')->select('adjust_inventory_id', 'item_id', 'purchase_price', 'quantity_in', 'quantity_out', 'total')->with(['item' => function ($query) {
            $query->select('id', 'name', 'category_id', 'subcategory_id');
            $query->with(['category' => function ($categoryQuery) {
                $categoryQuery->select('id', 'name');
            }, 'subcategory' => function ($subcategoryQuery) {
                $subcategoryQuery->select('id', 'name');
            }]);
        }]);
    }

    public function voucher()
    {
        return $this->hasOne(Voucher::class, 'adjust_inventory_id');
    }

    public function adjustInventoryChild()
    {
        return $this->hasMany(AdjustInventoryChild::class, 'adjust_inventory_id', 'id')->with('item');
    }
}
