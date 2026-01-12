<?php

namespace App\Models;

use App\Models\Rack;
use App\Models\Shelf;
use App\Models\Store;
use App\Models\Invoice;
use App\Models\InvoiceChild;
use App\Models\ItemOemPartModeles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SaleRackShelf extends Model
{
    use HasFactory;

    protected $table = 'sale_rack_shelves';

    protected $fillable = ['invoice_id','user_id', 'rack_id' , 'shelf_id' ,'quantity' ,'item_id' , 'store_id' , 'invoice_child_id' ,'checked'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function invoiceChild()
    {
        return $this->belongsTo(InvoiceChild::class);
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
