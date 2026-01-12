<?php

namespace App\Http\Controllers;

use App\Models\Rack;
use App\Models\Shelf;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class ShelvesController extends Controller
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
            $rack = $req->rack_id;
            $shelves = Shelf::with('racks', 'store')
                ->when($rack, function ($q, $rack) {
                    return $q->where('id', $rack);
                })
                ->where('user_id', $user_id) // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['status' => 'ok', 'shelves' => $shelves];
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
    public function store(Request $req)
    {
        $rules = array(
            'shelf_number' => 'required',
            'rack_id' => 'required',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 401);
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

        DB::transaction(function () use ($req, $user_id) {
            $group = Rack::find($req->rack_id);
            $lastCode = Shelf::where('rack_id', $group->id)->orderBy('id', 'desc')->first();
            // $shelve = Shelf::create($req->all());
            $data = array_merge($req->all(), ['user_id' => $user_id]);
            $shelve = Shelf::create($data);

            if (!$lastCode) {
                $newCode = $group->code . '01';
            } else {
                $newCode = $lastCode->code + 1;
            }
            Shelf::where('id', $shelve->id)->update(['code' => $newCode]);
        });
        return ['status' => "ok", 'message' => 'Shelf stored successfully'];
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
            'id' => 'required|int|exists:shelves,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $shelves = Shelf::with('racks', 'store')->find($req->id);
            return ['status' => 'ok', 'shelves' => $shelves];
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
            'id' => 'required|int|exists:shelves',

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
            DB::transaction(function () use ($request) {
                $shelve = Shelf::find($request->id);
                $shelve->shelf_number = $request->shelf_number;
                $shelve->rack_id = $request->rack_id;
                $shelve->save();
            });
            return ['status' => "ok", 'message' => 'Shelf updated successfully'];
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
            'id' => 'required|int|exists:shelves,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Shelf::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Shelf deleted successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getShelvesDropDown(Request $req)
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
            $rack = $req->id;
            $shelves = Shelf::when($rack, function ($q, $rack) {
                return $q->where('rack_id', $rack);
            })
                ->where('user_id', $user_id) // user_id
                ->orderBy('shelf_number')->get();
            return ['status' => 'ok', 'shelves' => $shelves];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
