<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditedVoucher extends Model
{
    use HasFactory;
    protected $fillable = ['voucher_id','user_id', 'type', 'name', 'voucher_no', 'total_amount', 'date', 'cheque_no', 'cheque_date', 'isApproved', 'user_id', 'is_post_dated', 'cleared_date', 'generated_at', 'booking_id'];

    public function voucherTransactions()
    {
        return $this->hasMany(EditedVoucherTransaction::class)->with('coaAccount');
    }

    public static function recordEditedVouchers($voucher_id, $user_id = null)
    {
        $voucher = Voucher::find($voucher_id);
        $editedVoucher = new EditedVoucher();
        $editedVoucher->voucher_id = $voucher->id;
        $editedVoucher->type = $voucher->type;
        $editedVoucher->name = $voucher->name;
        $editedVoucher->voucher_no = $voucher->voucher_no;
        $editedVoucher->total_amount = $voucher->total_amount;
        $editedVoucher->date = $voucher->date;
        $editedVoucher->cheque_no = $voucher->cheque_no;
        $editedVoucher->cheque_date = $voucher->cheque_date;
        $editedVoucher->isApproved = $voucher->isApproved;
        $editedVoucher->user_id = $user_id;
        $editedVoucher->is_post_dated = $voucher->is_post_dated;
        $editedVoucher->cleared_date = $voucher->cleared_date;
        $editedVoucher->generated_at = $voucher->generated_at;
        $editedVoucher->booking_id = $voucher->booking_id;
        $editedVoucher->save();

        $getVoucherTransactions = VoucherTransaction::where('voucher_id', $voucher_id)->get();

        foreach ($getVoucherTransactions as $oldVoucherTransaction) {

            $editedVoucherTransaction = new EditedVoucherTransaction();
            $editedVoucherTransaction->edited_voucher_id = $editedVoucher->id;
            $editedVoucherTransaction->coa_account_id = $oldVoucherTransaction->coa_account_id;
            $editedVoucherTransaction->debit = $oldVoucherTransaction->debit;
            $editedVoucherTransaction->credit = $oldVoucherTransaction->credit;
            $editedVoucherTransaction->balance = $oldVoucherTransaction->balance;
            $editedVoucherTransaction->description = $oldVoucherTransaction->description;
            $editedVoucherTransaction->land_id = $oldVoucherTransaction->land_id;
            $editedVoucherTransaction->land_payment_head_id = $oldVoucherTransaction->land_payment_head_id;
            $editedVoucherTransaction->is_post_dated = $oldVoucherTransaction->is_post_dated;
            $editedVoucherTransaction->date = $oldVoucherTransaction->date;
            $editedVoucherTransaction->salary_slip_id = $oldVoucherTransaction->salary_slip_id;
            $editedVoucherTransaction->plot_id = $oldVoucherTransaction->plot_id;
            $editedVoucherTransaction->loan_amortization_id = $oldVoucherTransaction->loan_amortization_id;
            $editedVoucherTransaction->save();
        }

        return true;
    }
}
