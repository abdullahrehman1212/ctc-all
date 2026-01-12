<?php

namespace App\Models;

use App\Models\PurchaseOrderChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReturnedPurchaseOrderChild extends Model
{
    use HasFactory;

    protected $fillable = ['returned_purchase_order_id','user_id', 'item_id', 'returned_quantity', 'purchase_price', 'amount', 'remarks'];
    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'brand', 'origin');
    }

    public function purchaseOrderChild()
    {
        return $this->hasMany(PurchaseOrderChild::class, 'purchase_order_id', 'id')->with('item');
    }
}
