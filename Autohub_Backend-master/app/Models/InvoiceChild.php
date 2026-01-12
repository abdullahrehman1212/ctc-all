<?php

namespace App\Models;

use App\Models\SaleRackShelf;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class InvoiceChild extends Model
{
    use HasFactory;
    protected $fillable = ['invoice_id','user_id', 'item_id', 'quantity', 'price'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'brand');
    }
    public function item2()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id')->with('store', 'customer');
    }
    public function invoiceDeliveredTo()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id')->select('id', 'delivered_to');
    }

    public function invoiceCount()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id');
    }
    public function invoiceNo()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'id')
            ->select('id', 'invoice_no', 'date', 'walk_in_customer_name', 'store_id', 'sale_type', 'customer_id')->with('customer');
    }
    public function invoice2()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id')
            ->orderBy('date', 'desc');
    }

    public function rackShelf()
    {
        return $this->hasMany(SaleRackShelf::class , 'invoice_child_id')->with('racks' , 'shelves');
    }
}
