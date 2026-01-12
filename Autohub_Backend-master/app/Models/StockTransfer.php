<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockTransfer extends Model
{
    use HasFactory;

    protected $table = 'stock_transfer';
    protected $fillable = ['store_transfer_id','user_id', 'store_received_id', 'date'];

    public function stockchildren()
    {
        return $this->hasMany(StockTransferChild::class)->with('item');
    }

    public function storetransfer()
    {
        return $this->belongsTo(Store::class, 'store_transfer_id', 'id');
    }

    public function storereceive()
    {
        return $this->belongsTo(Store::class, 'store_received_id', 'id');
    }
}
