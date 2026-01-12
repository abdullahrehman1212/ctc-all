<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditedVoucherTransaction extends Model
{
    use HasFactory;
    protected $fillable = ['edited_voucher_id', 'user_id','coa_account_id', 'debit', 'credit', 'balance', 'description', 'land_id', 'land_payment_head_id', 'is_post_dated', 'date', 'salary_slip_id', 'plot_id', 'loan_amortization_id'];

    public function coaAccount()
    {
        return $this->belongsTo(CoaAccount::class)->select('id', 'name', 'code');
    }

    public function voucherNumber()
    {
        return $this->belongsTo(EditedVoucher::class, 'voucher_id')->select('id', 'voucher_no', 'isApproved', 'type');
    }

    public function voucher()
    {
        return $this->belongsTo(EditedVoucher::class);
    }
}
