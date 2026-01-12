<?php

namespace App\Models;

use App\Models\StoreType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Store extends Model
{
    use HasFactory;
    protected $fillable = ['store_type_id', 'name', 'address', 'user_id'];

    public function storeType()
    {
        return $this->belongsTo(StoreType::class, 'store_type_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
