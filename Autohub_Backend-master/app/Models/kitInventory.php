<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class kitInventory extends Model
{
    use HasFactory;

    protected $table = 'kit_inventory';
    protected $fillable = ['kit_id','user_id', 'store_id', 'in_flow', 'out_flow', 'description', 'date'];

    public function kitParent()
    {
        return $this->belongsTo(kitParent::class, 'kit_id', 'id')->with('kitchild');
    }
    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id')->with('storeType');
    }
}
