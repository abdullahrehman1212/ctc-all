<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'suppliers';
    protected $fillable = ['name','user_id', 'company', 'type', 'gst', 'ntn', 'phone_no', 'email', 'cnic', 'address'];
}
