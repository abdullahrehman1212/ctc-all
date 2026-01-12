<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\Models\Supplier;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Services\CustomErrorMessages;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

        $supplier = Person::with(['Person_type' => function ($query) {
            $query->where('type', 1);
        }])
        ->where('user_id', $user_id)
        ->where('name', $name)
        ->where('phone_no', $phone_no)
        ->first();

        if ($supplier) {
            return response()->json(['messages' => 'This user is already taken']);
        }
        try {
            DB::transaction(function () use ($request, $user_id) {
                $supplier = new Person();
                $supplier->name = $request->name;
                $supplier->company = $request->company;
                $supplier->type = $request->type;
                $supplier->gst = $request->gst;
                $supplier->ntn = $request->ntn;
                $supplier->phone_no = $request->phone_no;
                $supplier->email = $request->email;
                $supplier->cnic = $request->cnic;
                $supplier->address = $request->address;
                $supplier->person_type_id = 1;
                $supplier->user_id = $user_id; //user id
                $supplier->opening_balance = $request->opening_balance;
                $supplier->date = $request->date;
                $supplier->save();
            });
            return ['status' => "ok", 'message' => 'Supplier stored successfully'];
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
            $supplier = Person::find($req->id);
            return ['status' => 'ok', 'supplier' => $supplier];
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
                $supplier = Person::find($request->id);
                $supplier->name = $request->name;
                $supplier->company = $request->company;
                $supplier->type = $request->type;
                $supplier->gst = $request->gst;
                $supplier->ntn = $request->ntn;
                $supplier->phone_no = $request->phone_no;
                $supplier->email = $request->email;
                $supplier->cnic = $request->cnic;
                $supplier->address = $request->address;
                $supplier->opening_balance = $request->opening_balance;
                $supplier->date = $request->date;
                $supplier->save();
            });
            return ['status' => "ok", 'message' => 'Supplier updated successfully'];
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
            return ['status' => "ok", 'message' => 'Supplier deleted successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getSupplierdropdown(Request $request)
    {
        try {
            // $suppliers = Person::where([['person_type_id',2],['is_active',1]])->orderBy('name')->get();
            $user = auth()->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized']);
            }
            if ($user->role_id == 2) {
                $user_id = $user->id;
            } else {
                $user_id = $user->admin_id;
            }
            $isActive = 1;

            $suppliers = Person::with('peoplePersonType.personType')
                ->when($isActive, function ($q, $isActive) {
                    return $q->where('isActive', $isActive);
                })
                ->whereHas('peoplePersonType', function ($query) use ($request) {
                    $query->when($request->person_type_id, function ($query) use ($request) {
                        return $query->where('person_type_id', $request->person_type_id);
                    });
                })
                ->where('user_id', $user_id) // user_id
                ->orderBy('name')->get();

            return ['status' => 'ok', 'suppliers' => $suppliers];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getSupplierslist(Request $req)
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
            $suppliers = Person::where([['person_type_id', 1], ['is_active', 1], ['user_id', $user_id]])->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['suppliers' => $suppliers];;
            return ['status' => 'ok', 'suppliers' => $suppliers];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
