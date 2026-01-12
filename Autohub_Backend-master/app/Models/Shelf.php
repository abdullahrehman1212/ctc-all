<?php

namespace App\Models;

use App\Models\Rack;
use App\Models\Store;
use App\Models\ItemInventory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Shelf extends Model
{
    use HasFactory;

    protected $fillable = ['shelf_number','user_id', 'code', 'rack_id', 'store_id'];

    public function racks()
    {
        return $this->HasOne(Rack::class, 'id', 'rack_id');
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function itemInventoryShelves()
    {
        return $this->hasMany(ItemInventory::class);
    }
}
