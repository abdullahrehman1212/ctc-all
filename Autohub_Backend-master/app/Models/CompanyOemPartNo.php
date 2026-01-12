<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyOemPartNo extends Model
{
    use HasFactory;
    protected $table = 'companies_oem_part_nos';
    protected $fillable = ['oem_part_no_id','user_id', 'company_id', 'number1', 'number2'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }
    public function oemPartNumber()
    {
        return $this->belongsTo(OemPartNumber::class, 'oem_part_no_id', 'id');
    }
}
