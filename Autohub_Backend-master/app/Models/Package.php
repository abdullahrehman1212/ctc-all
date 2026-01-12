<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'features',
        'user_id',
        'no_of_salesman',
        'discount'

    ];
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
