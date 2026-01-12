<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnedSaleChild extends Model
{
    use HasFactory;
    protected $fillable = ['returned_sales_id','user_id', 'item_id', 'quantity', 'price', 'cost'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'brand');
    }
}
