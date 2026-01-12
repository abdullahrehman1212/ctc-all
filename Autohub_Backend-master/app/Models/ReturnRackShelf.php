<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnRackShelf extends Model
{
    use HasFactory;

    protected $fillable = ['return_purchase_order_id', 'user_id','rack_id' , 'shelf_id' ,'quantity' ,'item_id' , 'store_id' , 'return_purchase_order_child_id'];
}
