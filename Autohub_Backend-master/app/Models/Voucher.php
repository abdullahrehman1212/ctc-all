<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Voucher extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = ['voucher_type_id', 'user_id', 'name', 'voucher_no', 'purchase_order_id', 'date', 'total_amount', 'cheque_no', 'cheque_date', 'is_approved', 'is_post_dated', 'is_auto', 'generated_at'];

    public function voucherTransactions()
    {
        return $this->hasMany(VoucherTransaction::class)->withTrashed()->with('coaAccount');
    }

    public function voucherType()
    {
        return $this->belongsTo(VoucherType::class, 'type', 'id');
    }

    /**
     * getting voucher no
     *
     * @param  string  $value
     * @return string
     */
    public function getVoucherNoAttribute($value)
    {
        $voucherType = VoucherType::find($this->type);
        // dd($voucherType);

        if (strlen($value) == 1) {
            return $voucherType->name . '00' . $value;
        } elseif (strlen($value) == 2) {
            return $voucherType->name . '0' . $value;
        } else {
            return $voucherType->name . $value;
        }
    }
//     public function getVoucherNoAttribute($value)
// {
//     $voucherType = VoucherType::find($this->type);

//     // Handle the case where $voucherType might be null
//     if (!$voucherType) {
//         // You can either return a default value or throw an exception
//         return 'Invalid Voucher Type';
//     }

//     // Use str_pad to add leading zeros
//     $paddedValue = str_pad($value, 3, '0', STR_PAD_LEFT);

//     return $voucherType->name . $paddedValue;
// }


    public function editedVouchers()
    {
        return $this->hasMany(EditedVoucher::class);
    }
}
