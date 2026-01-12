<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Person extends Model
{
    use HasFactory;
    protected $table = 'people';
    protected $fillable = [
        'name',
        'user_id',
        'father_name',
        'phone_no',
        'email',
        'cnic',
        'address',
        'isActive',
    ];

    public function employeeProfile()
    {
        return $this->hasOne(EmployeeProfile::class)->with('designation', 'department', 'employeeType');
    }
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function receiveableBalance()
    {
        return $this->hasManyThrough(VoucherTransaction::class, CoaAccount::class)
            ->groupBy('coa_account_id')
            ->select(DB::raw('SUM(debit)-SUM(credit) as balance'), 'coa_account_id', 'voucher_id')
            ->whereHas('voucher', function ($qu) {
                return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
            })
            ->whereHas('coaAccount', function ($qu) {
                $qu->whereHas('coaGroup', function ($query) {
                    $query->where('parent', 'Assets');
                });
            });
    }

    public function payableBalance()
    {
        return $this->hasManyThrough(VoucherTransaction::class, CoaAccount::class)
            ->groupBy('coa_account_id')
            ->select(DB::raw('SUM(debit)-SUM(credit) as balance'), 'coa_account_id', 'voucher_id')
            ->whereHas('voucher', function ($qu) {
                return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
            })
            ->whereHas('coaAccount', function ($qu) {
                $qu->whereHas('coaGroup', function ($query) {
                    $query->where('parent', 'Liabilities');
                });
            });
    }
    public function balance()
    {
        return $this->hasOneThrough(VoucherTransaction::class, CoaAccount::class)
            ->groupBy('coa_account_id')
            ->select(DB::raw('SUM(debit)-SUM(credit) as balance'), 'coa_account_id', 'voucher_id')
            ->whereHas('voucher', function ($qu) {
                return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
            });
    }

    public function peoplePersonType()
    {
        return $this->hasMany(PeoplePersonType::class)->with('personType');
    }
    
    public function PersonType()
    {
        return $this->hasOne(PeoplePersonType::class)->with('personType');
    }
    public function coaAccount()
    {
        return $this->hasMany(CoaAccount::class);
    }
    // public function coaAccount2()
    // {
    //     return $this->hasMany(CoaAccount::class)->with('balance');
    // }
    public function coaAccount2()
    {

        // $rrr = $this->hasOne(CoaAccount::class)->where('coa_sub_group_id', 9)->select('id', 'coa_group_id', 'coa_sub_group_id', 'person_id');
        // return $rrr;
        // //  return  $rrr->id;
        // //return $id;
        return  $id = $this->hasOne(CoaAccount::class)
            ->where('coa_sub_group_id', 9)
            ->select('id', 'coa_group_id', 'coa_sub_group_id', 'person_id')->with('balance');


        // foreach ($rrr as $coaAccount) {
        //     $id = $coaAccount->id;
        //     // Do something with the id...
        // }
    }
    public function employeePayableAccount()
    {
        return $this->hasOne(CoaAccount::class)->where('coa_sub_group_id', 37)->with('balance')->select('id', 'coa_group_id', 'coa_sub_group_id', 'person_id');
    }
    public function invoice()
    {
        return $this->hasMany(Invoice::class, 'customer_id', 'id')->with('invoiceChild', 'store');
    }
}
