<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnSaleRackShelf extends Model
{
    use HasFactory;

    protected $fillable = [
        'return_inv_id',
        'store_id',
        'item_id',
        'rack_id',
        'shelf_id',
        'quantity',
        'returned_sales_id',
        'checked',
        'user_id'
    ];
}
