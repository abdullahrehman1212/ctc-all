<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MachineModel;
use Illuminate\Http\Request;
use App\Models\MachinePartModel;
use App\Services\SessionGlobals;
use App\Models\ItemOemPartModeles;
use Illuminate\Support\Facades\DB;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class MachinePartsModelsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        $category_id = $req->category_id;
        $subcategory_id = $req->sub_category_id;
        $machine_part_id = $req->machine_part_id;
        $part_model_id = $req->part_model_id;
        $item_id = $req->item_id;

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
            $machinepartmodel = MachinePartModel::with('machinePart')
                ->when($machine_part_id, function ($q, $machine_part_id) {
                    return $q->where('machine_part_id', $machine_part_id);
                })
                ->when($part_model_id, function ($q, $part_model_id) {
                    return $q->where('id', $part_model_id);
                })
                ->when($subcategory_id, function ($query) use ($subcategory_id) {
                    $query->whereHas('machinePart', fn ($q) => $q->where('sub_category_id', '=', $subcategory_id));
                })
                ->when($item_id, function ($query) use ($item_id) {
                    $query->whereHas('machinePart', fn ($q) => $q->where('id', '=', $item_id));
                })
                ->when($category_id, function ($query) use ($category_id) {
                    $query->whereHas('machinePart', fn ($query) =>
                    $query->whereHas('subcategories', fn ($query) =>
                    $query->where('category_id', $category_id)));
                })
                ->where('user_id', $user_id)  // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['status' => 'ok', 'machinepartmodel' => $machinepartmodel];
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
            'machine_part_id' => 'required',

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

                $machinepartmodel = new MachinePartModel();
                $machinepartmodel->name = $request->name;
                $machinepartmodel->machine_part_id = $request->machine_part_id;
                $machinepartmodel->description = $request->description;
                $machinepartmodel->user_id = $user_id; //user id
                $machinepartmodel->save();
            });

            return ['status' => "ok", 'message' => 'Machine part model Stored Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
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
            'id' => 'required|int|exists:machine_part_models,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $machinepartmodel = MachinePartModel::find($req->id);
            return ['status' => 'ok', 'machinepartmodel' => $machinepartmodel];
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
            'id' => 'required|int|exists:machine_part_models',

        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $machinepartmodel = MachinePartModel::find($request->id);
                $machinepartmodel->name = $request->name;
                $machinepartmodel->machine_part_id = $request->machine_part_id;
                $machinepartmodel->description = $request->description;
                $machinepartmodel->save();
            });
            return ['status' => "ok", 'message' => 'machine part model updated successfully'];
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
            'id' => 'required|int|exists:machine_part_models,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            MachinePartModel::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Machine Part Model deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Machine Part Model is used somewhere in system: can not be Deleted'];
        }
    }
    public function getMachinePartsModelsDropDown(Request $req)
    {
        $machine_part_id = $req->machine_part_id;
        $item_id = $req->item_id;
        $store = $req->store_id;
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }
        // dd($machine_part_id);

        try {
            // Restore original query 1: Machine part models with all relationships
            $machinepartmodel = ItemOemPartModeles::with(['brands_id', 'itemInventory2.racks', 'itemInventory2.shelves', 'items_id'])
                ->whereHas('machinePartOemPartNO', function ($query) use ($machine_part_id) {
                    $query->where('machine_part_id', $machine_part_id);
                })
                ->where('user_id', $user_id)
                ->get();

            // Restore original query 2: Single item with all relationships
            $item = ItemOemPartModeles::select('machine_part_oem_part_nos_machine_models.*')
                ->with(['brands_id', 'ItemRacks' => function ($query) use ($store) {
                    $query->where('store_id', $store);
                }])
                ->where('user_id', $user_id)
                ->where('machine_part_oem_part_nos_machine_models.id', $item_id)
                ->get();

            // Restore original query 3: Data with all relationships
            $data = ItemOemPartModeles::select('machine_part_oem_part_nos_machine_models.*')
                ->leftjoin('item_oem_part_model_item', 'machine_part_oem_part_nos_machine_models.id', '=', 'item_oem_part_model_item.machine_part_oem_part_nos_machine_models_id')
                ->leftjoin('make_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'make_item_parts.machine_part_oem_part_nos_machine_models_id')
                ->groupBy('machine_part_oem_part_nos_machine_models.id')
                ->with('machinePartOemPart', 'machineModels', 'origin', 'brand', 'dimension', 'machines', 'makes', 'machineModel', 'items_id', 'brands_id', 'itemInventory2')
                ->where('machine_part_oem_part_nos_machine_models.user_id', $user_id)
                ->get();

            return ['status' => 'ok', 'machinepartmodel' => $machinepartmodel, 'item' => $item, 'data' => $data];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
