<?php

namespace App\Models;

use App\Models\Make;
use App\Models\Rack;
use App\Models\Shelf;
use App\Models\Origin;
use App\Models\Company;
use App\Models\Machine;
use App\Models\ItemRack;
use App\Models\MachinePart;
use App\Models\MachineModel;
use App\Models\ItemInventory;
use App\Models\ItemRackShelf;
use App\Models\MachinePartItem;
use Illuminate\Support\Facades\DB;
use App\Models\MachinePartOemPartNo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ItemOemPartModeles extends Model
{
    use HasFactory;
    protected $table = 'machine_part_oem_part_nos_machine_models';
    protected $fillable = ['name','user_id', 'sale_price', 'machine_part_oem_part_no_id', 'machine_model_id', 'brand_id', 'origin_id', 'to_year', 'from_year'];

    public function machinePartOemPart()
    {
        return $this->belongsTo(MachinePartOemPartNo::class, 'machine_part_oem_part_no_id', 'id')->with('oemPartNumber', 'machinePart');

    }

    public function machineModel()
    {
        return $this->belongsTo(MachineModel::class)->with('machine', 'make');
    }

    public function origin()
    {
        return $this->belongsTo(Origin::class);
    }

    public function brand()
    {
        return $this->belongsTo(Company::class);
    }

    public function itemInventory()
    {
        return $this->hasOne(ItemInventory::class, 'item_id', 'id')->groupBy('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'), 'id', 'item_id', 'store_id');
    }
    public function machinePart()
    {
        return $this->belongsTo(MachinePart::class, 'machine_part_oem_part_no_id', 'id');
    }
    public function itemInventory2()
    {
        return $this->hasOne(ItemInventory::class, 'item_id', 'id')->groupBy('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'), 'id', 'item_id', 'store_id');
    }
    public function kitchild()
    {
        return $this->hasMany(kitChild::class, 'item_id', 'id')->with('exisitingItemInventory', 'item');
    }
    public function existingSetInventory()
    {
        return $this->hasOne(ItemInventory::class,  'item_id', 'id')->groupby('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as existing_set_quantity'), 'id', 'item_id', 'store_id');
    }
    public function machinePartOemPartNO()
    {
        return $this->belongsTo(MachinePartOemPartNo::class, 'machine_part_oem_part_no_id', 'id')->with('kitchild2');
    }

    public function dimension()
    {
        return $this->belongsToMany(Dimension::class, 'machine_part_oem_dimensions', 'machine_part_oem_part_nos_machine_models_id', 'dimension_id')
            ->withPivot(['machine_part_oem_part_nos_machine_models_id', 'dimension_id' , 'value']);
    }
    public function purchaseOrderChild()
{
    return $this->hasMany(PurchaseOrderChild::class, 'item_id');
}



    public function machinePartOemPartNO2()
    {
        return $this->belongsTo(MachinePartOemPartNo::class, 'machine_part_oem_part_no_id', 'id')->with('oemPartNumber');
    }
    public function invoiceChild()
    {
        return $this->hasMany(InvoiceChild::class,  'item_id', 'id')->with('invoice');
    }
    public function invoiceChildCount()
    {
        return $this->hasMany(InvoiceChild::class,  'item_id', 'id')
            ->select('item_id', 'invoice_id')
            ->groupBy('item_id')
            ->selectRaw('sum(quantity) as quantity_sum')
            ->selectRaw('sum(price *quantity) as rate_sum')
            ->selectRaw('sum(cost) as cost_sum')
            ->with('invoiceCount');
    }

    public function makes()
    {
        return $this->belongsToMany(Make::class, 'make_item_parts', 'machine_part_oem_part_nos_machine_models_id', 'make_id');
    }

    public function machines()
    {
        return $this->belongsToMany(Machine::class, 'machine_item_parts', 'machine_part_oem_part_nos_machine_models_id', 'machine_id');
    }

    public function machineModels()
    {
        return $this->belongsToMany(MachineModel::class, 'model_item_parts', 'machine_part_oem_part_nos_machine_models_id', 'machine_model_id');
    }
    public function items_id()
    {
        return $this->hasMany(MachinePartItem::class, 'machine_part_oem_part_nos_machine_models_id', 'id');
    }
    public function brands_id()
    {
        return $this->belongsToMany(Company::class, 'machine_part_oem_part_model_company', 'machine_part_oem_part_nos_machine_models_id', 'brands_id')
            ->withPivot(['number3', 'machine_part_oem_part_nos_machine_models_id', 'brands_id']);
    }

    public function itemRacks()
    {
        return $this->hasMany(ItemInventory::class, 'item_id')
            ->selectRaw('store_id, rack_id, shelf_id, SUM(quantity_in) - SUM(quantity_out) as quantity, item_id')
            ->with('store', 'racks', 'shelves')
            ->whereNotNull('rack_id')
            ->whereNotNull('shelf_id')
            ->groupBy('store_id', 'rack_id', 'shelf_id', 'item_id');
    }

}
