<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnedSale extends Model
{
    use HasFactory;
    protected $fillable = ['inv_id','user_id', 'return_date'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'inv_id', 'id')->with('customer', 'store');
    }
    public function returnSaleChild()
    {
        return $this->hasMany(ReturnedSaleChild::class, 'returned_sales_id', 'id')->with('item');
    }
}
