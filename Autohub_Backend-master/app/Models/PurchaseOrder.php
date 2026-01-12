<?php

namespace App\Models;

use App\Models\ItemRackShelf;
use App\Models\PurchaseOrderChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PurchaseOrder extends Model
{
    use HasFactory;
    protected $table = 'purchase_orders';
    protected $fillable = ['person_id', 'user_id','po_no', 'store_id', 'remarks', 'is_received', 'is_pending', 'is_approve', 'is_cancel', 'request_date', 'received_date', 'total', 'discount', 'tax', 'total_after_tax', 'tax_in_figure', 'total_after_discount', 'created_by'];

    public function purchaseOrderChild()
    {
        return $this->hasMany(PurchaseOrderChild::class, 'purchase_order_id', 'id')->with('item');
    }

    public function purchasevoucher()
    {
        return $this->hasMany(Voucher::class, 'purchase_order_id', 'id')->with('voucherTransactions');
    }

    public function supplier()
    {
        return $this->belongsTo(People::class, 'person_id', 'id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }
    public function purchaseOrderReturn()
    {
        return $this->hasMany(ReturnedPurchaseOrder::class, 'purchase_order_id', 'id')->with('returnPurchaseOrderChild');
    }
    public function purchaseExpenses()
    {
        return $this->hasMany(Expense::class, 'po_id', 'id')->with('expenseType', 'coaAccount');
    }

    public function rackShelf()
    {
        return $this->hasMany(ItemRackShelf::class , 'purchase_order_id')->with('racks' , 'shelves');
    }


}
