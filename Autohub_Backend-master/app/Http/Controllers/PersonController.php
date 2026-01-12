<?php

namespace App\Http\Controllers;

use no;
use App\Models\Person;
use App\Models\Invoice;
use App\Models\Voucher;
use App\Models\CoaAccount;
use App\Models\PersonType;
use App\Models\CoaSubGroup;
use Illuminate\Http\Request;
use App\Models\PeoplePersonType;
use App\Models\VoucherTransaction;
use Illuminate\Support\Facades\DB;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param  int  $person_type_id
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $cnic = $request->cnic;
        $id = $request->id;
        $phone_no = $request->phone_no;
        $name = $request->name;
        $isActive = $request->isActive;
        // if ($request->isActive == 0 && $request->isActive != null) {
        //     $isActive = '00';
        // } else if ($request->isActive == 1) {
        //     $isActive = 1;
        // } else {
        //     $isActive = '';
        // }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }
        $persons = Person::with('peoplePersonType.personType')

            ->whereHas('peoplePersonType', function ($query) use ($request) {
                $query->when($request->person_type_id, function ($query) use ($request) {
                    return $query->where('person_type_id', $request->person_type_id);
                });
            })
            ->when($isActive !== null, function ($q) use ($isActive) {
                return $q->where('isActive', '=', $isActive);
            })
            ->where('user_id', $user_id)  // user_id
            ->orderBy('name')->get();
        $walk_in_customer = Invoice::groupby('walk_in_customer_name')->where('walk_in_customer_name', '!=', null)->get();
        return ['persons' => $persons, 'walk_in_customer' => $walk_in_customer];
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $person_id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:people,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $person = Person::with('peoplePersonType')->find($req->id);
            return ['status' => 'ok', 'person' => $person];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
        return ['person' => $person];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $person_id
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request phone_no
     * @param \Illuminate\Http\Request email
     * @param \Illuminate\Http\Request cnic
     * @param \Illuminate\Http\Request address
     * @param \Illuminate\Http\Request personTypes(array)
     * @param \Illuminate\Http\Request person_type_id
     * @return \Illuminate\Http\Response message
     */
    public function update(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:people,id',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()]);
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
        }

        $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;

        try {
            DB::transaction(function () use ($request, $user_id) {

                $person = Person::findOrFail($request->id);
                $person->name = $request->name;
                $person->father_name = $request->father_name;
                $person->phone_no = $request->phone_no;
                $person->email = $request->email;
                $person->cnic = $request->cnic;
                $person->address = $request->address;
                $person->opening_balance = $request->opening_balance;
                $person->date = $request->date ?? '';
                $person->user_id = $user_id; // user id
                $person->save();
                $person_id = $person->id;

                foreach ($request->people_person_type as $people_person_type) {
                    if ($people_person_type['person_type_id'] == 2) {
                        $voucher = Voucher::where('person_id', $request->id)->first();
                        if ($voucher) {
                            $voucherId = $voucher->id;
                            VoucherTransaction::where('voucher_id', $voucherId)->delete();
                            Voucher::find($voucherId)->delete();
                        }

                        $coaAccount = CoaAccount::where('person_id', $request->id)
                            ->where('coa_group_id', 3)
                            ->where('coa_sub_group_id', 2)
                            ->first();

                        if ($coaAccount) {
                            $coaAccount->name = $request->name;
                            $coaAccount->description = $request->name;
                            $coaAccount->coa_group_id = 3;
                            $coaAccount->coa_sub_group_id = 2;
                            $coaAccount->person_id = $person->id;
                            $coaAccount->user_id = $user_id; // user id
                            $coaAccount->isDefault = 1;
                            $coaAccount->save();

                            $coa_account_id = $coaAccount->id;
                            if ($request->opening_balance > 0 && $request->date) {
                                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                                $voucher = new Voucher();
                                $voucher->voucher_no = $newVoucherNo;
                                $voucher->date = $request->date;
                                $voucher->name =  $request->name;
                                $voucher->type = 3;
                                $voucher->isApproved = 1;
                                $voucher->generated_at = $request->date;
                                $voucher->total_amount = $request->opening_balance;
                                $voucher->person_id = $person_id;
                                $voucher->cheque_no = $request->cheque_no;
                                $voucher->cheque_date = $request->cheque_date;
                                $voucher->user_id = $user_id; //user id
                                $voucher->is_auto = 1;
                                $voucher->save();

                                $voucher_id = $voucher->id;

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = $coa_account_id;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = 0;
                                $voucherTransaction->credit = $request->opening_balance;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Supplier  ' . ' Openning Balance : '   . $request->opening_balance;
                                $voucherTransaction->save();

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = 182;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = $request->opening_balance;
                                $voucherTransaction->credit = 0;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Supplier ' . ' Openning Balance : '  . $request->opening_balance;

                                $voucherTransaction->save();
                            } else if ($request->opening_balance < 0 && $request->date) {
                                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                                $voucher = new Voucher();
                                $voucher->voucher_no = $newVoucherNo;
                                $voucher->date = $request->date;
                                $voucher->name =  $request->name;
                                $voucher->type = 3;
                                $voucher->isApproved = 1;
                                $voucher->generated_at = $request->date;
                                $voucher->total_amount = abs($request->opening_balance);
                                $voucher->person_id = $person_id;
                                $voucher->cheque_no = $request->cheque_no;
                                $voucher->cheque_date = $request->cheque_date;
                                $voucher->user_id = $user_id; //user id
                                $voucher->is_auto = 1;
                                $voucher->save();

                                $voucher_id = $voucher->id;

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = $coa_account_id;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = abs($request->opening_balance);
                                $voucherTransaction->credit = 0;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Supplier  ' . ' Openning Balance : '   . abs($request->opening_balance);
                                $voucherTransaction->save();

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = 182;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = 0;
                                $voucherTransaction->credit = abs($request->opening_balance);
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Supplier ' . ' Openning Balance : '  . abs($request->opening_balance);

                                $voucherTransaction->save();
                            }
                        }
                    } elseif ($people_person_type['person_type_id'] == 1) {

                        $voucher = Voucher::where('person_id', $request->id)->first();
                        if ($voucher) {
                            $voucherId = $voucher->id;
                            VoucherTransaction::where('voucher_id', $voucherId)->delete();
                            Voucher::find($voucherId)->delete();
                        }
                        $coaAccount = CoaAccount::where('person_id', $request->id)
                            ->where('coa_group_id', 1)
                            ->where('coa_sub_group_id', 9)
                            ->first();

                        if ($coaAccount) {
                            $coaAccount->name = $request->name;
                            $coaAccount->description = $request->name;
                            $coaAccount->coa_group_id = 1;
                            $coaAccount->coa_sub_group_id = 9;
                            $coaAccount->person_id = $person->id;
                            $coaAccount->user_id = $user_id; // user id
                            $coaAccount->isDefault = 1;
                            $coaAccount->save();

                            $coa_account_id = $coaAccount->id;

                            if ($request->opening_balance > 0 && $request->date) {
                                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                                $voucher = new Voucher();
                                $voucher->voucher_no = $newVoucherNo;
                                $voucher->date = $request->date;
                                $voucher->name =  $request->name;
                                $voucher->type = 3;
                                $voucher->isApproved = 1;
                                $voucher->generated_at = $request->date;
                                $voucher->total_amount = $request->opening_balance;
                                $voucher->person_id = $person_id;
                                $voucher->cheque_no = $request->cheque_no;
                                $voucher->cheque_date = $request->cheque_date;
                                $voucher->is_auto = 1;
                                $voucher->user_id = $user_id; //user id
                                $voucher->save();
                                $voucher_id = $voucher->id;

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = $coa_account_id;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = $request->opening_balance;
                                $voucherTransaction->credit = 0;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Customer ' . ' Amount : ' . $request->opening_balance;
                                $voucherTransaction->save();

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = 182;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = 0;
                                $voucherTransaction->credit = $request->opening_balance;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Customer ' . ' Openning Balance : '   . $request->opening_balance;
                                $voucherTransaction->save();
                            } else if ($request->opening_balance < 0 && $request->date) {
                                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                                $voucher = new Voucher();
                                $voucher->voucher_no = $newVoucherNo;
                                $voucher->date = $request->date;
                                $voucher->name =  $request->name;
                                $voucher->type = 3;
                                $voucher->isApproved = 1;
                                $voucher->generated_at = $request->date;
                                $voucher->total_amount = abs($request->opening_balance);
                                $voucher->person_id = $person_id;
                                $voucher->cheque_no = $request->cheque_no;
                                $voucher->cheque_date = $request->cheque_date;
                                $voucher->is_auto = 1;
                                $voucher->user_id = $user_id; //user id
                                $voucher->save();
                                $voucher_id = $voucher->id;

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = $coa_account_id;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = 0;
                                $voucherTransaction->credit = abs($request->opening_balance);
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Customer ' . ' Amount : ' . abs($request->opening_balance);
                                $voucherTransaction->save();

                                $voucherTransaction = new VoucherTransaction();
                                $voucherTransaction->voucher_id = $voucher_id;
                                $voucherTransaction->date = $request->date;
                                $voucherTransaction->coa_account_id = 182;
                                $voucherTransaction->is_approved = 1;
                                $voucherTransaction->debit = abs($request->opening_balance);
                                $voucherTransaction->credit = 0;
                                $voucherTransaction->user_id = $user_id; //user id
                                $voucherTransaction->description = $request->name . ' Customer ' . ' Openning Balance : '   . abs($request->opening_balance);
                                $voucherTransaction->save();
                            }
                        }
                    }
                }
            });

            return response()->json(['status' => "ok", 'message' => 'Person updated successfully']);
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return response()->json(['status' => 'error', 'message' => $message]);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $person_id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $rules = array(
            'id' => 'required',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        $person = Person::find($request->id);
        if (!$person) {
            return ['status' => 'error', 'message' => 'Person not found'];
        }
        try {

            DB::transaction(function () use ($request) {
                $type = PeoplePersonType::where('person_id', $request->id)->value('person_type_id');
                if ($type == 1) {
                    CoaAccount::where('person_id', $request->id)
                        ->where('coa_group_id', 1)
                        ->where('coa_sub_group_id', 9)->delete();

                    PeoplePersonType::where('person_id', $request->id)->delete();
                    Person::find($request->id)->delete();
                } else {
                    CoaAccount::where('person_id', $request->id)
                        ->where('coa_group_id', 3)
                        ->where('coa_sub_group_id', 2)->delete();

                    PeoplePersonType::where('person_id', $request->id)->delete();
                    Person::find($request->id)->delete();
                }
            });
            return ['status' => 'ok', 'message' => 'Person deleted successfully'];
        } catch (\Exception $e) {
            $type = PeoplePersonType::where('person_id', $request->id)->value('person_type_id');
            if ($type == 2) {
                $coaaccount = CoaAccount::where('person_id', $request->id)
                    ->where('coa_group_id', 3)
                    ->where('coa_sub_group_id', 2)->first();
                $coaaccount->isActive = 0;
                $coaaccount->save();

                $person = person::find($request->id);
                $person->isActive = 0;
                $person->save();
                $message = CustomErrorMessages::getCustomMessage2($e);
                return ['status' => 'error', 'message' => $message];
            } else {
                $coaaccount = CoaAccount::where('person_id', $request->id)
                    ->where('coa_group_id', 1)
                    ->where('coa_sub_group_id', 9)->first();
                $coaaccount->isActive = 0;
                $coaaccount->save();

                $person = person::find($request->id);
                $person->isActive = 0;
                $person->save();
                $message = CustomErrorMessages::getCustomMessage2($e);
            }
        }
    }
    /**
     * @param \Illuminate\Http\Request person_type_id
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPersonsByPersonType(Request $req)
    {

        $rules = array(
            'person_type_id' => 'required',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $isActive = $req->isActive;
        $name = $req->name2;
        $phone_no = $req->phone_no;
        $cnic = $req->cnic;
        $persons = Person::with('peoplePersonType.personType')
            // ->when($isActive, function ($q, $isActive) {
            //     return $q->where('isActive', '=', $isActive);
            // })
            ->when($phone_no, function ($q, $phone_no) {
                return $q->where('phone_no', 'LIKE', '%' . $phone_no . '%');
            })
            ->when($cnic, function ($q, $cnic) {
                return $q->where('cnic', 'LIKE', '%' . $cnic . '%');
            })
            ->when($name, function ($q, $name) {
                return $q->where('name', 'LIKE', '%' . $name . '%');
            })

            ->whereHas('peoplePersonType', function ($query) use ($req) {
                $query->when($req->person_type_id, function ($query) use ($req) {
                    return $query->where('person_type_id', $req->person_type_id);
                });
            })
            ->when($isActive !== null, function ($q) use ($isActive) {
                return $q->where('isActive', '=', $isActive);
            })


            // ->where('isActive', '=', $isActive)
            // ->when($isActive, function ($q, $isActive) {
            //     return $q->where('isActive', '=', $isActive);
            // })
            // ->when($is_active, function ($q, $is_active) {
            //     return $q->where('isActive', $is_active);
            // })
            ->where('user_id', $user_id)  // user_id
            ->orderBy('name')->get();

        if (!$persons) {
            return ['status' => 'Record not found'];
        }

        return ['persons' => $persons];
    }
    //------------------------------------------------------------------------------
    /**
     * Store a newly created Person in storage.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request phone_no
     * @param \Illuminate\Http\Request email
     * @param \Illuminate\Http\Request cnic
     * @param \Illuminate\Http\Request address
     * @param \Illuminate\Http\Request personTypes(array)
     * @param \Illuminate\Http\Request person_type_id
     * @return \Illuminate\Http\Response message
     */
    public function store(Request $request)
    {
        $rules = array(
            'name'          => 'required',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }
        $name = $request->name;
        $phone_no = $request->phone_no;
        $person_type_id = $request->person_type_id;

        $user = Person::with(['PersonType' => function ($query) use ($person_type_id) {
            $query->where('person_type_id', $person_type_id);
        }])
            // ->whereHas('PersonType', function ($query) use ($person_type_id) {
            //     $query->where('id', $person_type_id);
            // })
            ->where('user_id', $user_id)
            ->where('name', $name)
            ->where('phone_no', $phone_no)
            ->first();

        if ($user) {
            return response()->json(['messages' => 'This user is already taken']);
        }

        try {
            DB::transaction(function () use ($request, $user_id) {
                // dd($user_id);
                $person = new Person();
                $person->name     = $request->name;
                $person->father_name     = $request->father_name;
                $person->phone_no     = $request->phone_no;
                $person->email     = $request->email;
                $person->cnic     = $request->cnic;
                $person->address     = $request->address;
                $person->opening_balance = $request->opening_balance;
                $person->date = $request->date ?? '';
                $person->user_id = $user_id; //user id
                $person->save();
                $person_id = $person->id;
                $person_person_type = new PeoplePersonType();
                $person_person_type->person_id      = $person_id;
                if ($request->person_type_id == 2) {

                    $person_person_type->person_type_id      = $request->person_type_id;
                    $person_person_type->user_id = $user_id; //user id
                    $person_person_type->save();

                    $subgroup = CoaSubGroup::find(2);

                    $lastCode = CoaAccount::where('coa_sub_group_id', $subgroup->id)->orderBy('id', 'desc')->first();
                    if (!$lastCode) {
                        $newCode = $subgroup->code . '001';
                    } else {
                        $newCode = $lastCode->code + 1;
                    }
                    // dd($lastCode);

                    $coaAccount = new CoaAccount();
                    $coaAccount->name     = $request->name;
                    $coaAccount->code     = $newCode;
                    $coaAccount->coa_group_id     = 3;
                    $coaAccount->coa_sub_group_id     = 2;
                    $coaAccount->person_id     = $person_id;
                    $coaAccount->description     = $request->name;
                    $coaAccount->user_id = $user_id; //user id
                    $coaAccount->isDefault     = 1;
                    $coaAccount->save();

                    $coa_account_id = $coaAccount->id;
                    if ($request->opening_balance > 0 && $request->date) {
                        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucher = new Voucher();
                        $voucher->voucher_no = $newVoucherNo;
                        $voucher->date = $request->date;
                        $voucher->name =  $request->name;
                        $voucher->type = 3;
                        $voucher->isApproved = 1;
                        $voucher->generated_at = $request->date;
                        $voucher->total_amount = $request->opening_balance;
                        $voucher->person_id = $person_id;
                        $voucher->cheque_no = $request->cheque_no;
                        $voucher->cheque_date = $request->cheque_date;
                        $voucher->user_id = $user_id; //user id
                        $voucher->is_auto = 1;
                        $voucher->save();

                        $voucher_id = $voucher->id;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $coa_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $request->opening_balance;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Supplier  ' . ' Openning Balance : '   . $request->opening_balance;
                        $voucherTransaction->save();

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 182;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->opening_balance;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Supplier ' . ' Openning Balance : '  . $request->opening_balance;

                        $voucherTransaction->save();
                    } else if ($request->opening_balance < 0 && $request->date) {
                        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucher = new Voucher();
                        $voucher->voucher_no = $newVoucherNo;
                        $voucher->date = $request->date;
                        $voucher->name =  $request->name;
                        $voucher->type = 3;
                        $voucher->isApproved = 1;
                        $voucher->generated_at = $request->date;
                        $voucher->total_amount = abs($request->opening_balance);
                        $voucher->person_id = $person_id;
                        $voucher->cheque_no = $request->cheque_no;
                        $voucher->cheque_date = $request->cheque_date;
                        $voucher->user_id = $user_id; //user id
                        $voucher->is_auto = 1;
                        $voucher->save();

                        $voucher_id = $voucher->id;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $coa_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = abs($request->opening_balance);
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Supplier  ' . ' Openning Balance : '   . abs($request->opening_balance);
                        $voucherTransaction->save();

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 182;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = abs($request->opening_balance);
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Supplier ' . ' Openning Balance : '  . abs($request->opening_balance);

                        $voucherTransaction->save();
                    }
                } elseif ($request->person_type_id == 1) {

                    $person_person_type->person_type_id      = $request->person_type_id;
                    $person_person_type->user_id = $user_id; //user id
                    $person_person_type->save();

                    $subgroup = CoaSubGroup::find(9);
                    $lastCode = CoaAccount::where('coa_sub_group_id', $subgroup->id)->orderBy('id', 'desc')->first();
                    if (!$lastCode) {
                        $newCode = $subgroup->code . '001';
                    } else {
                        $newCode = $lastCode->code + 1;
                    }
                    $coaAccount = new CoaAccount();
                    $coaAccount->name     = $request->name;
                    $coaAccount->code     = $newCode;
                    $coaAccount->coa_group_id     = 1;
                    $coaAccount->coa_sub_group_id     = 9;
                    $coaAccount->person_id     = $person_id;
                    $coaAccount->description     = $request->name;
                    $coaAccount->user_id = $user_id; //user id
                    $coaAccount->isDefault     = 1;
                    $coaAccount->save();
                    $coa_account_id = $coaAccount->id;

                    if ($request->opening_balance > 0 && $request->date) {
                        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucher = new Voucher();
                        $voucher->voucher_no = $newVoucherNo;
                        $voucher->date = $request->date;
                        $voucher->name =  $request->name;
                        $voucher->type = 3;
                        $voucher->isApproved = 1;
                        $voucher->generated_at = $request->date;
                        $voucher->total_amount = $request->opening_balance;
                        $voucher->person_id = $person_id;
                        $voucher->cheque_no = $request->cheque_no;
                        $voucher->cheque_date = $request->cheque_date;
                        $voucher->is_auto = 1;
                        $voucher->user_id = $user_id; //user id
                        $voucher->save();
                        $voucher_id = $voucher->id;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $coa_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->opening_balance;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Customer ' . ' Amount : ' . $request->opening_balance;
                        $voucherTransaction->save();

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 182;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $request->opening_balance;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Customer ' . ' Openning Balance : '   . $request->opening_balance;
                        $voucherTransaction->save();
                    } else if ($request->opening_balance < 0 && $request->date) {
                        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucher = new Voucher();
                        $voucher->voucher_no = $newVoucherNo;
                        $voucher->date = $request->date;
                        $voucher->name =  $request->name;
                        $voucher->type = 3;
                        $voucher->isApproved = 1;
                        $voucher->generated_at = $request->date;
                        $voucher->total_amount = abs($request->opening_balance);
                        $voucher->person_id = $person_id;
                        $voucher->cheque_no = $request->cheque_no;
                        $voucher->cheque_date = $request->cheque_date;
                        $voucher->is_auto = 1;
                        $voucher->user_id = $user_id; //user id
                        $voucher->save();
                        $voucher_id = $voucher->id;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $coa_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = abs($request->opening_balance);
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Customer ' . ' Amount : ' . abs($request->opening_balance);
                        $voucherTransaction->save();

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 182;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = abs($request->opening_balance);
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $request->name . ' Customer ' . ' Openning Balance : '   . abs($request->opening_balance);
                        $voucherTransaction->save();
                    }
                } else {
                    $person_person_type->person_type_id      = $request->person_type_id;
                    $person_person_type->save();
                }
            });

            return ['status' => "ok", 'message' => 'person Stored Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Gettng Person Types.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPersonTypes()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $personTypes = PersonType::orderBy('type')
            ->where('user_id', $user_id)  // user_id
            ->get();
        return ['personTypes' => $personTypes];
    }

    /**
     * Gettng files by person or mouza.
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    // public function getFilesByPersonOrMouza(Request $req, $id = 0)
    // {
    //     $user = auth()->user();
    //     if (!$user) {
    //         return response()->json(['message' => 'Unauthorized']);
    //     }
    //     if ($user->role_id == 2) {
    //         $user_id = $user->id;
    //     } else {
    //         $user_id = $user->admin_id;
    //     }

    //     if (isset($req->account_id)) {
    //         $account_id = $req->account_id;
    //     } else {
    //         $account_id = $id;
    //     }
    //     $coaAccount = CoaAccount::find($account_id);
    //     $files = [];
    //     if ($coaAccount) {
    //         //-------------------if loan aortizaion getting loan files--------------------
    //         if ($coaAccount->coa_sub_group_id == 29 || $coaAccount->coa_sub_group_id == 56) {
    //             if ($coaAccount->coa_sub_group_id == 56) {
    //                 $files = LoanAmortization::select('id', 'file_no', 'name as file_name')->get();
    //             } elseif ($coaAccount->coa_sub_group_id == 29) {
    //                 $files = LoanAmortization::where('investor_id', $coaAccount->person_id)->select('id', 'file_no', 'name as file_name')->get();
    //             }
    //         }
    //         //-------------------if block account getting plots--------------------
    //         elseif ($coaAccount->coa_sub_group_id == 20 || $coaAccount->coa_sub_group_id == 48 || $coaAccount->coa_sub_group_id == 49  || $coaAccount->coa_sub_group_id == 59) {
    //             if ($coaAccount->coa_sub_group_id == 59) {
    //                 $files = Plot::where('is_booked', 1)->select('id', 'reg_no as file_name', 'id as file_no')->get();
    //             } else {
    //                 if (($coaAccount->block_id == null || $coaAccount->block_id == 0) && $coaAccount->coa_sub_group_id != 20) {
    //                     $files = Plot::where([['is_booked', 1], ['block_id', null]])->select('id', 'reg_no as file_name', 'id as file_no')->get();
    //                 } else {
    //                     if ($coaAccount->coa_sub_group_id == 20) {
    //                         $block = Block::where('coa_account_id', $coaAccount->id)->first();
    //                         $files = Plot::where([['is_booked', 1], ['block_id', $block->id]])->select('id', 'reg_no as file_name', 'id as file_no')
    //                             ->where('user_id', $user_id)  // user_id
    //                             ->get();
    //                     } else {
    //                         $files = Plot::where([['is_booked', 1], ['block_id', $coaAccount->block_id]])->select('id', 'reg_no as file_name', 'id as file_no')
    //                             ->where('user_id', $user_id)  // user_id
    //                             ->get();
    //                     }
    //                 }
    //             }
    //         }
    //         //-------------------if land account land files--------------------
    //         elseif ($coaAccount->coa_sub_group_id == 1 || $coaAccount->coa_sub_group_id == 22) {
    //             if ($coaAccount->type == 'mouza') {
    //                 $getMouza = Mouza::where("coa_account_id", $account_id)->first();
    //                 $mouza_id = optional($getMouza)->id;
    //                 $files = Land::where('mouza_id', $mouza_id)->select('id', 'file_no', 'file_name')
    //                     ->where('user_id', $user_id)  // user_id
    //                     ->get();
    //             } else {
    //                 if ($coaAccount->person_id != null) {
    //                     $getFiles = LandPerson::where('person_id', $coaAccount->person_id)->with('land')
    //                         ->where('user_id', $user_id)  // user_id
    //                         ->get('land_id');
    //                     $files = [];
    //                     $i = 0;
    //                     foreach ($getFiles as $file) {
    //                         $files[$i] = $file->land;
    //                         $i++;
    //                     }
    //                     $getFiles = RegistryPerson::where('seller_id', $coaAccount->person_id)->with('land')
    //                         ->where('user_id', $user_id)  // user_id
    //                         ->get('land_id');

    //                     foreach ($getFiles as $file) {
    //                         $files[$i] = $file->land;
    //                         $i++;
    //                     }
    //                     $files = array_unique($files);
    //                     $files = array_values($files);
    //                 }
    //             }
    //         }
    //     }
    //     return ['files' => $files];
    // }

    /**
     * Getting person all accounts.
     * @param  int  $person_id
     *
     * @return \Illuminate\Http\Response
     */
    public function getPersonAllAccounts(Request $req)
    {
        $rules = array(
            'person_id' => 'required|int'
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $person_id = $req->person_id;
        $receiveableAccounts = CoaAccount::with('coaSubGroup', 'balance')
            ->when($person_id, function ($query) use ($person_id) {
                $query->where([['person_id', $person_id]]);
            })
            ->whereHas('coaGroup', function ($query) {
                $query->where('parent', 'Assets');
            })
            ->orderBy('name')->get();
        $payableAccounts = CoaAccount::with('coaSubGroup', 'balance')
            ->when($person_id, function ($query) use ($person_id) {
                $query->where([['person_id', $person_id]]);
            })
            ->whereHas('coaGroup', function ($query) {
                $query->where('parent', 'Liabilities');
            })
            ->where('user_id', $user_id)  // user_id
            ->whereNull('user_id')
            ->orderBy('name')->get();
        return ['receiveableAccounts' => $receiveableAccounts, 'payableAccounts' => $payableAccounts];
    }

    /**
     * Getting persons accounts balance.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPersonCoaAccountsBalance(Request $req)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $person_id = $req->person_id;
        $people = Person::with('peoplePersonType.personType', 'receiveableBalance', 'payableBalance')
            ->when($person_id, function ($query) use ($person_id) {
                $query->where([['id', $person_id]]);
            })->orderBy('name')
            ->select('name', 'id', 'isActive')
            ->where('user_id', $user_id)  // user_id
            ->get();
        return ['people' => $people];
    }

    /**
     * @param \Illuminate\Http\Request person_type_id
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getRequiredPersons(Request $req)
    {
        $rules = array(
            'person_type_id' => 'required',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $person_type_id = $req->person_type_id;
        $persons = Person::whereHas('peoplePersonType', function ($q) use ($person_type_id) {
            return $q->where('person_type_id', '!=', $person_type_id);
        })->where('isActive', '=', 1)
            ->orderBy('name')
            ->where('user_id', $user_id)  // user_id
            ->get();
        if (!$persons) {
            return ['status' => 'error', 'message' => 'Record not found'];
        }

        return ['persons' => $persons];
    }
    public function getActiveSuppliers(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $persons = Person::with('peoplePersonType')
            ->whereHas('peoplePersonType', fn($q) => $q->where('person_type_id', '=', 2))
            ->where('isActive', 1)
            ->orderBy('name')
            ->where('user_id', $user_id)  // user_id
            ->get();
        return ['persons' => $persons];
    }
    public function changePersonStatus(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:people,id',

        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $person = person::find($request->id);
                if ($person->isActive == 1) {
                    $person->isActive = 0;
                    $person->save();
                    $coaAccount = CoaAccount::where('person_id', $request->id)->first();
                    $coaAccount->isActive = 0;
                    $coaAccount->save();
                } else {
                    $person->isActive = 1;
                    $person->save();
                    $coaAccount = CoaAccount::where('person_id', $request->id)->first();
                    $coaAccount->isActive = 1;
                    $coaAccount->save();
                }
            });
            return ['status' => "ok", 'message' => 'Status changed successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
