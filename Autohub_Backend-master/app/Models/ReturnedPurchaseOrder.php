<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnedPurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = ['purchase_order_id','user_id', 'remarks', 'total', 'discount', 'deduction', 'tax', 'total_after_tax', 'tax_in_figure', 'total_after_discount'];

    public function returnPurchaseOrderChild()
    {
        return $this->hasMany(ReturnedPurchaseOrderChild::class, 'returned_purchase_order_id', 'id')->with('item');
    }
    public function purchaseorder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'id')->with('store', 'supplier');
    }
}
