<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\StoreType;
use App\Services\CustomErrorMessages;

class StoreController extends Controller
{
    /**
     * Display a listing of the stores.
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @return \Illuminate\Http\Response
     */

    public function index(Request $req)
    {
        $store_type_id = $req->store_type_id;
        $status = $req->status;
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
            $stores = Store::with('storeType')
                ->when($store_type_id, function ($q, $store_type_id) {
                    return $q->where('store_type_id', $store_type_id);
                })
                ->where('user_id', $user_id) // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['stores' => $stores];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }


    public function getStoreTypeDropDown()
    {
        try {
            $storeType = StoreType::where('id',2)->get();
            return ['status' => 'ok', 'storeType' => $storeType];
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
     * adding Store data
     * @param \Illuminate\Http\Response tpye_id
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response address
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array(
            'name' => 'required|string|min:2|max:255|',
            'address' => 'required|string|min:2|max:255',
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

        try {
            DB::transaction(function () use ($request, $user_id) {
                $store = new Store();
                $store->name = $request->name;
                $store->store_type_id = $request->store_type_id;
                $store->address = $request->address;
                $store->user_id = $user_id; //user id
                $store->save();
            });
            return ['status' => "ok", 'message' => 'Store added successfully'];
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
            'id' => 'required|int',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $store = store::find($req->id);
            return ['status' => 'ok', 'store' => $store];
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
            'id' => 'required|int',

        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $store = Store::find($request->id);
                $store->name = $request->name;
                $store->store_type_id = $request->store_type_id;
                $store->address = $request->address;

                $store->save();
            });
            return ['status' => "ok", 'message' => 'Store updated successfully'];
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
            'id' => 'required|int|exists:store,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Store::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Store deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected store is used somewhere in system: can not be Deleted'];
        }
    }
    public function getStoredropdown(Request $req)

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
        $store_type_id = $req->store_type_id;
        try {
            $store = Store::when($store_type_id, function ($q, $store_type_id) {
                return $q->where('store_type_id', $store_type_id);
            })
                // ->where('status', 1)
                ->where('user_id', $user_id) // user_id
                ->orderBy('id')->get();
            return ['status' => 'ok', 'store' => $store];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function getStore()
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
        $store = Store::where('user_id', $user_id) // user_id
            ->get();

        return ['status' => 'ok', 'store' => $store];
    }

    //Store Status
    public function changeStoreStatus(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:stores,id',

        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $store = Store::find($request->id);
                if ($store->status == 1) {
                    $store->status = 0;
                    $store->save();
                } else {
                    $store->status = 1;
                    $store->save();
                }
            });
            return ['status' => "ok", 'message' => 'Status changed successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
