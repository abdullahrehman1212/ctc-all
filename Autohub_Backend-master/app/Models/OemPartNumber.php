<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OemPartNumber extends Model
{
    use HasFactory;
    protected $table = 'oem_part_nos';
    protected $fillable = ['number1', 'number2','user_id'];

    public function oemPartNumberCompany()
    {
        return $this->hasMany(CompanyOemPartNo::class, 'oem_part_no_id', 'id')->with('company', 'oemPartNumber');
    }
}
