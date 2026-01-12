<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
class QuotationChild extends Model
{
    use HasFactory;

      protected $table = 'quotation_children';
    protected $fillable = ['parent_id', 'item_id', 'quantity', 'quoted_rate', 'retail_price', 'trade_price', 'quoted_price', 'total', 'remarks'];

    // public function item()
    // {
    //     return $this->belongsTo(Item::class, 'item_id', 'id')->with('category', 'subcategory');
    // }


public function itemInventory2()
{
    return $this->hasOne(ItemInventory::class, 'item_id', 'item_id')
        ->select(
            'item_id',
            'store_id',
            DB::raw('SUM(quantity_in) - SUM(quantity_out) AS quantity')
        )
        ->groupBy('item_id', 'store_id');
}

public function item()
{
    return $this->belongsTo(MachinePartOemPartNosMachineModel::class, 'item_id', 'id');
}





}
