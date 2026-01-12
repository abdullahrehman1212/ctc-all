<?php

namespace App\Models;

use App\Models\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AlternativeBrands extends Model
{
    use HasFactory;

    public function companies()
{
    return $this->belongsToMany(Company::class);
}

}
