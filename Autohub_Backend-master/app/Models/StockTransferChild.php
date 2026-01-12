<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransferChild extends Model
{
    use HasFactory;

    protected $table = 'stock_transfer_children';
    protected $fillable = ['stock_transfer_id','user_id', 'item_id', 'transfer_quanitiy'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'itemInventory', 'brand');
    }
}
