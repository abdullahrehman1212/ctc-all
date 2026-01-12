<?php

namespace App\Models;

use App\Models\Store;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rack extends Model
{
    use HasFactory;

    protected $fillable = ['rack_number','user_id', 'code'];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function itemInventoryRacks()
    {
        return $this->hasMany(ItemInventory::class);
    }
}
