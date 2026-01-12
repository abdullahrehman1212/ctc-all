<?php

namespace App\Models;

use App\Models\Make;
use App\Models\MachineModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MachinePartOemPartNo extends Model
{
    use HasFactory;
    protected $table = 'machine_part_oem_part_nos';
    protected $fillable = ['machine_part_id','user_id', 'machine_part_model_id', 'oem_part_no_id'];

    public function machinePart()
    {
        return $this->belongsTo(MachinePart::class, 'machine_part_id', 'id')->with('type', 'unit', 'subcategories');
    }
    public function machinePartmodel()
    {
        return $this->belongsTo(MachinePartModel::class, 'machine_part_model_id', 'id');
    }

    public function oemPartNumber()
    {
        return $this->belongsTo(OemPartNumber::class, 'oem_part_no_id', 'id');
    }
    // public function oemPartNumber()
    // {
    //     return $this->belongsTo(OemPartNumber::class, 'oem_part_no_id', 'id')->with('oemPartNumbercompany');
    // }
    public function oemPartNumbercompany2()
    {
        return $this->belongsTo(CompanyOemPartNo::class, 'oem_part_no_id', 'id');
    }
    public function kitchild2()
    {
        return $this->hasMany(kitChild::class, 'parent_id', 'machine_part_id')->with('exisitingItemInventory', 'item');
    }
    public function existingSetInventory()
    {
        return $this->hasOne(ItemInventory::class,  'item_id', 'id')->groupby('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as existing_set_quantity'), 'id', 'item_id', 'store_id');
    }
    public function exisitingItemInventory()
    {
        return $this->hasOne(ItemInventory::class, 'item_id', 'id')->groupby('item_id', 'store_id')
            ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as existing_quantity'), 'id', 'item_id', 'store_id');
    }
    public function itemOemPartModels()
    {
        return $this->hasOne(ItemOemPartModeles::class,  'machine_part_oem_part_no_id', 'id')->with('kitchild');
    }
    public function machineModels()
    {
        return $this->belongsTo(MachineModel::class)->with('machine', 'make');
    }
}
