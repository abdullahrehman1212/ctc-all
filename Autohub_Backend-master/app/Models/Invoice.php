<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $fillable = ['customer_id','user_id', 'invoice_no', 'walk_in_customer_name', 'date', 'remarks', 'store_id', 'total_amount', 'discount', 'total_after_discount', 'received_amount'];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($invoice) {
            // Retrieve the last invoice for the user with locking for consistency
            $lastInvoice = static::where('user_id', $invoice->user_id)
                ->lockForUpdate()
                ->latest('invoice_no')
                ->first();

            // Extract the numeric part of the last invoice number or start fresh
            $lastInvoiceNumber = $lastInvoice
                ? (int) str_replace('INO-', '', $lastInvoice->invoice_no)
                : 1000000;

            // Increment the last invoice number
            $newInvoiceNumber = 'INO-' . ($lastInvoiceNumber + 1);

            // Assign the new invoice number to the current invoice
            $invoice->invoice_no = $newInvoiceNumber;
        });
    }

    public function customer()
    {
        return $this->belongsTo(Person::class, 'customer_id', 'id')->with('coaAccount2');
    }
    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'quotation_id', 'id')->select('id', 'quotation_no', 'termcondition');
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id')->with('storeType');
    }
    public function invoiceChild()
    {
        return $this->hasMany(InvoiceChild::class, 'invoice_id', 'id')->with('item');
    }
    public function vouchers()
    {
        return $this->hasMany(Voucher::class, 'invoice_id', 'id');
    }
}
