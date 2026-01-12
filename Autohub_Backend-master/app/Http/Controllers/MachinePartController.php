<?php

namespace App\Http\Controllers;

use App\Models\kitChild;
use App\Models\MachinePart;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use App\Models\MachinePartType;
use Illuminate\Support\Facades\DB;
use App\Models\MachinePartOemPartNo;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class MachinePartController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        $category_id = $req->category_id;
        $sub_category_id = $req->sub_category_id;
        $type = $req->type_id;
        $name2 = $req->name2;
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

            $machineParts = MachinePart::with('subcategories', 'applications', 'type')
                ->when($name2, function ($q, $name2) {
                    return $q->where('name', 'LIKE', '%' . $name2 . '%');
                })
                ->when($category_id, function ($query) use ($category_id) {
                    $query->whereHas('subcategories', fn ($q) => $q->where('category_id', '=', $category_id));
                })
                ->when($sub_category_id, function ($query) use ($sub_category_id) {
                    $query->whereHas('subcategories', fn ($q) => $q->where('id', '=', $sub_category_id));
                })
                ->when($type, function ($q, $type) {
                    return $q->where('type_id', $type);
                })
                ->where('user_id', $user_id)  // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['machine_Parts' => $machineParts];
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
    public function getMachinePartsDropDown(Request $req)
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

        $subcategory_id = $req->sub_category_id;
        $type_id = $req->type_id1;
        $category_id = $req->category_id;
        try {
            $machineParts = MachinePart::with('subcategories')
                ->when($subcategory_id, function ($query) use ($subcategory_id) {
                    $query->where('sub_category_id', $subcategory_id);
                })
                ->when($category_id, function ($query) use ($category_id) {
                    $query->whereHas('subcategories', fn ($q) => $q->where('category_id', '=', $category_id));
                })
                ->when($type_id, function ($query) use ($type_id) {
                    $query->where('type_id', $type_id);
                })
                ->where('user_id', $user_id)  // user_id
                ->orderBy('name')
                ->get();
            return ['status' => 'ok', 'machine_Parts' => $machineParts];
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
    public function getSetsDropDown()
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
            $machineParts = MachinePart::orderBy('name')->where('type_id', 2)
                ->where('user_id', $user_id)  // user_id
                ->get();
            return ['status' => 'ok', 'machine_Parts' => $machineParts];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $type = $request->type_id;
        $rules = array(
            'name' => 'required|string|min:2|max:255|',
            'sub_category_id' => 'required|int',
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
                if ($request->type_id == 1) {
                    $MachinePart = new MachinePart();
                    $MachinePart->name = $request->name;
                    $MachinePart->sub_category_id = $request->sub_category_id;
                    $MachinePart->application_id = $request->application_id;
                    $MachinePart->type_id = $request->type_id;
                    $MachinePart->user_id = $user_id; //user id

                    $MachinePart->uom_id = $request->uom_id;
                    $MachinePart->save();
                } else {
                    $MachinePart = new MachinePart();
                    $MachinePart->name = $request->name;
                    $MachinePart->sub_category_id = $request->sub_category_id;
                    $MachinePart->application_id = $request->application_id;
                    $MachinePart->type_id = $request->type_id;
                    $MachinePart->uom_id = $request->uom_id;
                    $MachinePart->user_id = $user_id; //user id
                    $MachinePart->save();
                    $MachinePartid = $MachinePart->id;

                    foreach ($request->kitchild as $row) {

                        $kitChilddata = new kitChild();
                        $kitChilddata->parent_id = $MachinePartid;
                        $kitChilddata->user_id = $user_id; //user id
                        $kitChilddata->item_id = $row['item_id'];
                        $kitChilddata->quantity = $row['quantity'];
                        $kitChilddata->save();
                    }
                }
            });
            return ['status' => "ok", 'message' => 'Machine Part stored successfully'];
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
            'id' => 'required|int|exists:machine_parts,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $MachinePart = MachinePart::with('kitchild', 'subcategories')->find($req->id);
            return ['status' => 'ok', 'Machine_Part' => $MachinePart];
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
            'id' => 'required|int|exists:machine_parts,id',
            'name' => 'required|min:2|max:255' . $request->id,

        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {
                if ($request->type_id == 1) {

                    $MachinePart = MachinePart::find($request->id);
                    $MachinePart->name = $request->name;
                    $MachinePart->sub_category_id = $request->sub_category_id;
                    $MachinePart->application_id = $request->application_id;
                    $MachinePart->type_id = $request->type_id;
                    $MachinePart->uom_id = $request->uom_id;
                    $MachinePart->save();
                } else {

                    $MachinePart = MachinePart::find($request->id);
                    $MachinePart->name = $request->name;
                    $MachinePart->sub_category_id = $request->sub_category_id;
                    $MachinePart->application_id = $request->application_id;
                    $MachinePart->type_id = $request->type_id;
                    $MachinePart->uom_id = $request->uom_id;
                    $MachinePart->save();
                    $MachinePartid = $MachinePart->id;

                    foreach ($request->kitchild as $row) {

                        $kitChilddata = kitChild::find($row['id']);
                        $kitChilddata->parent_id = $request->id;
                        $kitChilddata->item_id = $row['item_id'];
                        $kitChilddata->quantity = $row['quantity'];
                        $kitChilddata->save();
                    }
                }
            });
            return ['status' => "ok", 'message' => 'Machine Part updated successfully'];
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
        'id' => 'required|int|exists:machine_parts,id',
    );
    $validator = Validator::make($req->all(), $rules);
    if ($validator->fails()) {
        return ['status' => 'error', 'message' => $validator->errors()->first()];
    }

    try {
        // Check if the machine part ID exists in MachinePartOemPartNo
        $existsInOemPartNo = MachinePartOemPartNo::where('machine_part_id', $req->id)->exists();

        if ($existsInOemPartNo) {
            return [
                'status' => 'error',
                'message' => 'The selected Machine Part is associated with an OEM part number and cannot be deleted'
            ];
        }

        // Proceed with deletion if no association is found
        MachinePart::where('id', $req->id)->delete();

        return ['status' => "ok", 'message' => 'Machine Part deleted successfully'];
    } catch (\Exception $e) {
        return [
            'status' => "error",
            'message' => 'An error occurred: the selected Machine Part is used elsewhere in the system and cannot be deleted'
        ];
    }
}
    public function getSubCategoriesByCategory(Request $request)
    {
        $category_id = $request->category_id;
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
            $subcategories = SubCategory::when($category_id, function ($q, $category_id) {
                return $q->where('category_id', $category_id);
            })
                ->where('user_id', $user_id)  // user_id
                ->get();
            return ['status' => 'ok', 'subcategories' => $subcategories];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getSetsByStore(Request $req)
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
            $machineParts = MachinePart::with(['kitchild2.exisitingItemInventory' => function ($qu) use ($req) {
                $qu->where('store_id', $req->store_id);
            }])
                ->where('user_id', $user_id)  // user_id
                ->where('type_id', 2)->get();
            return ['status' => 'ok', 'machine_Parts' => $machineParts];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getItemTypesDropdown(Request $req)
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
            $machinePartstypes = MachinePartType::whereNull('user_id') // user_id
                ->get();

            return ['status' => 'ok', 'machinePartstypes' => $machinePartstypes];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
