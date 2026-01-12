<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\People;
use App\Models\Person;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {

        $rules = array(
            'records' => 'required|int',
            'pageNo' => 'required|int',
            'colName' => 'required|string',
            'sort' => 'required|string',
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

        try {
            $customers = Person::where([['person_type_id', 2], ['is_active', 1], ['user_id', $user_id]])->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['customers' => $customers];;
            return ['status' => 'ok', 'customers' => $customers];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array(
            'name' => 'required|string|min:2|max:255',
            'phone_no' => 'required',

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
        $customer = Person::with(['Person_type' => function ($query) {
            $query->where('person_type_id', 2);
        }])
        ->where('user_id', $user_id)
        ->where('name', $name)
        ->where('phone_no', $phone_no)
        ->first();

        if ($customer) {
            return response()->json(['messages' => 'This user is already taken']);
        }

        try {
            DB::transaction(function () use ($request, $user_id) {
                $customer = new Person();
                $customer->name = $request->name;
                $customer->company = $request->company;
                $customer->type = $request->type;
                $customer->gst = $request->gst;
                $customer->ntn = $request->ntn;
                $customer->phone_no = $request->phone_no;
                $customer->email = $request->email;
                $customer->cnic = $request->cnic;
                $customer->address = $request->address;
                $customer->opening_balance = $request->opening_balance;
                $customer->date = $request->date;
                $customer->user_id = $user_id;
                $customer->person_type_id = 2;
                $customer->save();
            });
            return ['status' => "ok", 'message' => 'Customer stored successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
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
            $customer = Person::find($req->id);
            return ['status' => 'ok', 'customer' => $customer];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
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
                $customer = Person::find($request->id);
                $customer->name = $request->name;
                $customer->company = $request->company;
                $customer->type = $request->type;
                $customer->gst = $request->gst;
                $customer->ntn = $request->ntn;
                $customer->phone_no = $request->phone_no;
                $customer->email = $request->email;
                $customer->cnic = $request->cnic;
                $customer->address = $request->address;
                $customer->opening_balance = $request->opening_balance;
                $customer->date = $request->date;
                $customer->save();
            });
            return ['status' => "ok", 'message' => 'Customer updated successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $req)
    {

        $rules = array(
            'id' => 'required|int|exists:people,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Person::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Customer deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Customer is used somewhere in system: can not be Deleted'];
        }
    }
    public function getcustomerdropdown(Request $request)
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

        try {
            // $customers = People::where([['person_type_id',1],['is_active',1]])->orderBy('name')->get();
            $isActive = 1;

            $customers = Person::with('peoplePersonType.personType')
                ->where('user_id', $user_id)  // user_id
                ->when($isActive, function ($q, $isActive) {
                    return $q->where('isActive', $isActive);
                })
                ->whereHas('peoplePersonType', function ($query) use ($request) {
                    $query->when($request->person_type_id, function ($query) use ($request) {
                        return $query->where('person_type_id', $request->person_type_id);
                    });
                })
                ->orderBy('name')->get();
            return ['status' => 'ok', 'customers' => $customers];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
