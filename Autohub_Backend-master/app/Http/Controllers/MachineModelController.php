<?php

namespace App\Http\Controllers;

use App\Models\MachineModel;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MachineModelController extends Controller
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
            $machine_id = $req->machine_id;
            $make_id = $req->make_id;
            $model_name = $req->model_name;

            $machineModels = MachineModel::with('machine', 'make')
                ->when($machine_id, function ($q, $machine_id) {
                    return $q->where('machine_id', $machine_id);
                })
                ->when($make_id, function ($q, $make_id) {
                    return $q->where('make_id', $make_id);
                })
                ->when($model_name, function ($q, $model_name) {
                    return $q->where('name',  'LIKE', '%' . $model_name . '%');
                })
                ->where('user_id',$user_id)  // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['machineModels' => $machineModels];
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
    public function getmachineModelsDropDown(Request $req)
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
            $machine_ids = $req->machine_id; // Assuming this is an array or comma-separated string
            $make_id = $req->make_id;

            $machineModels = MachineModel::where('user_id', $user_id)
                ->orderBy('name')
                ->when($machine_ids, function ($q, $machine_ids) {
                    // If machine_ids is a comma-separated string, convert it to an array
                    $machine_ids = is_string($machine_ids) ? explode(',', $machine_ids) : $machine_ids;
                    return $q->whereIn('machine_id', $machine_ids);
                })
                ->when($make_id, function ($q, $make_id) {
                    return $q->where('make_id', $make_id);
                })
                ->get();

            return ['status' => 'ok', 'machineModels' => $machineModels];

        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  name
     * * @param \Illuminate\Http\Response machine_id
     * @param \Illuminate\Http\Response make_id
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array(
            'name' => 'required|string|min:2|max:255|',
            'machine_id' => 'required|int|exists:machines,id',
            'make_id' => 'required|int|exists:makes,id'
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
            DB::transaction(function () use ($request,$user_id) {
                $MachineModel = new MachineModel();
                $MachineModel->name = $request->name;
                $MachineModel->machine_id = $request->machine_id;
                $MachineModel->make_id = $request->make_id;
                $MachineModel->user_id = $user_id; //user id
                $MachineModel->save();
            });
            return ['status' => "ok", 'message' => 'Model stored successfully'];
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
            'id' => 'required|int|exists:machine_models,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $MachineModel = MachineModel::with('machine', 'make')->find($req->id);
            return ['status' => 'ok', 'machine' => $MachineModel];
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
     * @param \Illuminate\Http\Response machine_id
     * @param \Illuminate\Http\Response make_id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    public function update(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:machine_models,id',
            'name' => 'required|min:2|max:255' . $request->id,
            'machine_id' => 'required|int|exists:machines,id',
            'make_id' => 'required|int|exists:makes,id'
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $MachineModel = MachineModel::find($request->id);
                $MachineModel->name = $request->name;
                $MachineModel->machine_id = $request->machine_id;
                $MachineModel->make_id = $request->make_id;
                $MachineModel->save();
            });
            return ['status' => "ok", 'message' => 'Model updated successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    public function destroy(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:machine_models,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            MachineModel::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Model deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Model is used somewhere in system: can not be Deleted'];
        }
    }
}
