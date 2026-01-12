<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Subscription extends Model
{
    use HasFactory;

    protected $fillable = ['user_id','package_id', 'type', 'duration','start_date', 'end_date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
    public function isExpired()
    {
        return Carbon::now()->greaterThan($this->end_date);
    }
}
