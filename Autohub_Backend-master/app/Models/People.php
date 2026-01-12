<?php

namespace App\Models;

use Faker\Provider\ar_EG\Person;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class People extends Model
{
    use HasFactory;
    protected $fillable = ['person_type_id', 'name','user_id', 'phone_no', 'email', 'cnic', 'address', 'isActive'];

    public function supplierType()
    {
        return $this->belongsTo(SupplierType::class);
    }

}
