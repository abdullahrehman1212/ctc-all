<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeoplePersonType extends Model
{
    use HasFactory;
    protected $fillable = [
        'people_id',
        'person_type_id',
        'user_id'
    ];

    public function person()
    {
        return $this->belongsTo(Person::class);
    }
    public function personType()
    {
        return $this->belongsTo(PersonType::class, 'person_type_id', 'id');
    }
}
