<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MachinePart extends Model
{
    use HasFactory;
    protected $fillable = ['id','user_id', 'name', 'sub_category_id', 'application_id', 'type_id', 'uom_id'];

    public function subcategories()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id', 'id')->with('categories');
    }
    public function applications()
    {
        return $this->belongsTo(Application::class, 'application_id', 'id');
    }
    public function type()
    {
        return $this->belongsTo(MachinePartType::class, 'type_id', 'id');
    }
    public function unit()
    {
        return $this->belongsTo(Uom::class, 'uom_id', 'id');
    }
    public function kitchild()
    {
        return $this->hasMany(kitChild::class, 'parent_id', 'id')->with('setsinventory', 'exisitingItemInventory', 'item', 'existingSetInventory');
    }
    public function kitchild2()
    {
        return $this->hasMany(kitChild::class, 'parent_id', 'id')->with('exisitingItemInventory', 'item', 'existingSetInventory');
    }
    public function existingkitInventory()
    {
        return $this->hasMany(ItemInventory::class,  'item_id', 'id');
    }
    public function machinePartOemPartNos()
    {
        return $this->hasOne(MachinePartOemPartNo::class,  'machine_part_id', 'id')->with('kitchild2', 'existingSetInventory', 'exisitingItemInventory', 'itemOemPartModels');
    }
    public function machinePartOemPartNos2()
    {
        return $this->hasOne(MachinePartOemPartNo::class,  'machine_part_id', 'id')->with('itemOemPartModels');
    }
}
