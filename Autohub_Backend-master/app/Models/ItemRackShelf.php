<?php

namespace App\Models;

use App\Models\Rack;
use App\Models\Shelf;
use App\Models\Store;
use App\Models\PurchaseOrder;
use App\Models\ItemOemPartModeles;
use App\Models\PurchaseOrderChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemRackShelf extends Model
{
    use HasFactory;

    protected $fillable = ['purchase_order_id','user_id', 'rack_id' , 'shelf_id' ,'quantity' ,'item_id' , 'store_id' , 'purchase_order_child_id'];


    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function purchaseOrderChild()
    {
        return $this->belongsTo(PurchaseOrderChild::class);
    }

    public function item_id()
    {
        return $this->belongsTo(ItemOemPartModeles::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function racks()
    {
        return $this->belongsTo(Rack::class , 'rack_id')->select('id' , 'rack_number');
    }

    public function shelves()
    {
        return $this->belongsTo(Shelf::class , 'shelf_id')->select('id' , 'shelf_number');
    }
}
