<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;
    protected $fillable = ['name','user_id', 'category_id'];


    public function categories()
    {
        return $this->HasOne(Category::class, 'id', 'category_id');
    }
}
