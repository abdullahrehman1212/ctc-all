<?php

namespace App\Models;

use App\Models\Rack;
use App\Models\Shelf;
use App\Models\ItemRack;
use App\Models\ItemShelf;
use App\Models\ItemRackShelf;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderChild;
use Illuminate\Support\Facades\DB;
use App\Models\AdjustInventoryChild;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemInventory extends Model
{
    use HasFactory;
    protected $table = 'item_inventory';

    protected $fillable = ['purchase_order_id','user_id', 'invoice_id', 'inventory_type_id', 'item_id', 'purchase_price', 'store_id', 'quantity_in', 'quantity_out'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'brand' ,'machineModel');
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id')->with('supplier');
    }

    public function purchaseOrderChild()
    {
        return $this->hasMany(PurchaseOrderChild::class, 'purchase_order_id', 'id')->with('item');
    }

    public function adjustInventoryChild()
    {
        return $this->hasMany(AdjustInventoryChild::class, 'adjust_inventory_id', 'id')->with('item');
    }


    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id')->with('storeType');
    }
    public function inventoryType()
    {
        return $this->belongsTo(InventoryType::class, 'inventory_type_id', 'id');
    }

    public function itemInventory()
    {
        return $this->hasOne(ItemInventory::class, 'item_id', 'id')->groupBy('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'), 'id', 'item_id', 'store_id');
    }
    public function kitchild()
    {
        return $this->belongsTo(kitChild::class, 'item_id', 'parent_id')->with('setsname');
    }
    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'invoice_id', 'id');
    }
    public static function getStockQuantity($storeId, $itemId)

    {
        $stock = ItemInventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
            ->where('store_id', $storeId)
            ->where('item_id', $itemId)
            ->first();

        return $stock ? $stock->quantity : 0;
    }
    public static function calculateTotalStockQty($itemId)
    {
        $stock = ItemInventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
            ->where('item_id', $itemId)
            ->first();

        return $stock ? $stock->quantity : 0;
    }
    public static function calculateTotalStockQtyWithPendingInvoices($itemId)
    {
        $stockQty = 0;
        $stock = ItemInventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
            ->where('item_id', $itemId)
            ->first();

        $Invoice = InvoiceChild::where('item_id', $itemId)
            ->where('invoices.is_pending', 1)
            ->orwhere('invoices.is_pending_neg_inventory', 1)
            ->join('invoices', 'invoices.id', '=', 'invoice_children.invoice_id')
            // ->get();
            ->sum('quantity');
        // return $Invoice;
        $stockQty = $stock->quantity + $Invoice;
        return $stockQty ?  $stockQty  : 0;
    }

    public function racks()
    {
        return $this->belongsTo(Rack::class, 'rack_id')->select('id', 'rack_number');
    }

    public function shelves()
    {
        return $this->belongsTo(Shelf::class, 'shelf_id')->select('id', 'shelf_number');
    }
}
