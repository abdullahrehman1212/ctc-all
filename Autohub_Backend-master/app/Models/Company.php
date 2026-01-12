<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable = ['name','user_id'];
    public function item()
    {
        return $this->hasMany(ItemOemPartModeles::class, 'brand_id', 'id')->with('invoiceChild');
    }
    public function item2()
    {
        return $this->hasMany(ItemOemPartModeles::class, 'brand_id', 'id')->with('invoiceChildCount');
    }
    public function brands()
    {
        return $this->hasMany(Brands::class, 'brands_id',);
    }
}
