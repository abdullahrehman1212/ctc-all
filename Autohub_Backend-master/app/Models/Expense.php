<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;
    protected $fillable = ['po_id','user_id', 'amount', 'description', 'expense_type_id', 'coa_account_id'];

    public function expenseType()
    {
        return $this->belongsTo(ExpenseType::class, 'expense_type_id', 'id');
    }
    public function coaAccount()
    {
        return $this->belongsTo(CoaAccount::class, 'coa_account_id', 'id');
    }
}
