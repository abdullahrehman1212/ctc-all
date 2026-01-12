<?php

namespace App\Http\Controllers;

use App\Models\Rack;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class RackController extends Controller
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

        // Get user's subscription package
        $subscription = $user->subscription;

        if (!$subscription) {
            return response()->json(['message' => 'No subscription found']);
        }

        $package_id = $subscription->package_id;

        // Set date range based on package and the user's created_at date
        $to = now();
        switch ($package_id) {
            case 1: // Trial Package (2 weeks)
                $from = $to->copy()->subWeeks(2);
                break;

            case 2: // Basic Package (1 month)
                $from = $to->copy()->subMonth();
                break;

            case 3: // Show Package (3 months)
                $from = $to->copy()->subMonths(3);
                break;

            case 4: // Gold Package (1 year)
                $from = $to->copy()->subYear();
                break;

            default:
                return response()->json(['message' => 'Invalid package']);
        }


        $store = $user->store;
        if (!$store) {
            return response()->json(['message' => 'Store not found']);
        }

        $store_id = $store->id;
        $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;
        try {
            $rack = $req->rack_id;
            $racks = Rack::with('store')->when($rack, function ($q, $rack) {
                return $q->where('id', $rack);
            })
                ->where('user_id', $user_id) // user_id
                ->when($from, function ($q, $from) {
                    return $q->where('created_at', '>=', $from);
                })
                ->when($to, function ($q, $to) {
                    return $q->where('created_at', '<=', $to);
                })
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['racks' => $racks];
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
            'rack_number' => 'required|string',
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
            $rack = new Rack();
            $rack->store_id = $request->store_id;
            $rack->rack_number = $request->rack_number;
            $rack->user_id = $user_id; //user id
            $rack->save();

            $rackId = $rack->id;
            $rack->code = $rackId;
            $rack->save();

            return ['status' => "ok", 'message' => 'Rack stored successfully'];
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
            'id' => 'required|int|exists:racks,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $rack = Rack::with('store')->find($req->id);
            return ['status' => 'ok', 'rack' => $rack];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    public function update(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:racks,id',
            'rack_number' => 'required' . $request->id
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $rack = Rack::find($request->id);
                $rack->rack_number = $request->rack_number;
                $rack->save();
            });
            return ['status' => "ok", 'message' => 'Rack updated successfully'];
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
            'id' => 'required|int|exists:racks,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Rack::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Rack deleted successfully'];
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
    public function getRackDropDown(Request $request)
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
            $store = $request->store_id;
            $racks = Rack::where('store_id', $store)
                ->where('user_id', $user_id) // user_id
                ->get();
            return ['status' => 'ok', 'racks' => $racks];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
