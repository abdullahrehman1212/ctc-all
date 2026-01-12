<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Category;
use App\Models\Company;
use App\Models\Dimension;
use App\Models\ItemOemPartModeles;
use App\Models\Machine;
use App\Models\MachineModel;
use App\Models\MachinePart;
use App\Models\MachinePartModel;
use App\Models\MachinePartType;
use App\Models\Make;
use App\Models\Origin;
use App\Models\Uom;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MachineController extends Controller
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
            $machines = Machine::where('user_id', $user_id)->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['machines' => $machines];
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
    public function getMachinesDropDown()
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
            $machines = Machine::orderBy('name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            return ['status' => 'ok', 'machines' => $machines];
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
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $rules = array(
            'name' => 'required|string|min:2|max:255|',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request, $user_id) {
                $Machine = new Machine();
                $Machine->name = $request->name;
                $Machine->user_id = $user_id; //user id

                $Machine->save();
            });
            return ['status' => "ok", 'message' => 'Machine stored successfully'];
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
            'id' => 'required|int|exists:machines,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $Machine = Machine::find($req->id);
            return ['status' => 'ok', 'machine' => $Machine];
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
            'id' => 'required|int|exists:machines,id',
            'name' => 'required|min:2|max:255' . $request->id
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $Machine = Machine::find($request->id);
                $Machine->name = $request->name;
                $Machine->save();
            });
            return ['status' => "ok", 'message' => 'Machine updated successfully'];
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
            'id' => 'required|int|exists:machines,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Machine::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Machine deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Machine is used somewhere in system: can not be Deleted'];
        }
    }
    // $array = array(
    //     'booking_id' => $booking->id,
    //     'booking_no' => $booking->booking_no,
    //     'reg_no' => $booking->plot->reg_no,
    //     'plot_no' => $booking->plot->plot_no,
    //     'block' => $booking->block->name ?? '',
    //     'size' => $size,
    //     'type' => $booking->plot->plot_type,
    //     'date' => $request->date,
    //     'clients' => $customers,
    // );
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getDropDownsOptionsForItemPartsIndex(Request $req)
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
            $machines = Machine::where('user_id', $user_id)
            ->orderBy('name')->select('id', 'name')->get();
            $machine_id = $req->machine_id;
            $make_id = $req->make_id;
            $machine_part_id = $req->machine_part_id;
            $machineModels = MachineModel::orderBy('name')
                ->when($machine_id, function ($q, $machine_id) {
                    return $q->where('machine_id', $machine_id);
                })
                ->when($make_id, function ($q, $make_id) {
                    return $q->where('make_id', $make_id);
                })
                ->where('user_id', $user_id)  // user_id
                ->get();
            $categories = Category::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $origin = Origin::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $machinepartmodel = MachinePartModel::when($machine_part_id, function ($query) use ($machine_part_id) {
                $query->where('machine_part_id', $machine_part_id);
            })
                ->where('user_id', $user_id)
                ->orderBy('name')->get();
            $companies = Company::where('user_id',$user_id)->orderBy('name')->select('id', 'name')->get();
            $subcategory_id = $req->sub_category_id;
            $type_id = $req->type_id1;
            $category_id = $req->category_id;

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

            $makes = Make::where('user_id', $user_id)
            ->orderBy('name')->select('id', 'name')->get();


            return ['status' => 'ok', 'machines' => $machines, 'companies' => $companies, 'machinepartmodel' => $machinepartmodel, 'origin' => $origin, 'categories' => $categories, 'machineModels' => $machineModels, 'machine_Parts' => $machineParts, 'makes' => $makes];
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
    public function getDropDownsOptionsForItemPartsAdd(Request $req)
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
            $machines = Machine::where('user_id', $user_id)->orderBy('name')->select('id', 'name')->get();
            $machine_id = $req->machine_id;
            $make_id = $req->make_id;
            $machine_part_id = $req->machine_part_id;
            $machineModels = MachineModel::orderBy('name')
                ->when($machine_id, function ($q, $machine_id) {
                    return $q->where('machine_id', $machine_id);
                })
                ->when($make_id, function ($q, $make_id) {
                    return $q->where('make_id', $make_id);
                })->select('id', 'name', 'machine_id', 'make_id')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $categories = Category::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $origin = Origin::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $machinepartmodel = MachinePartModel::when($machine_part_id, function ($query) use ($machine_part_id) {
                $query->where('machine_part_id', $machine_part_id);
            })->where('user_id', $user_id)
                ->orderBy('name')->get();
            $companies = Company::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $subcategory_id = $req->sub_category_id;
            $type_id = $req->type_id1;
            $category_id = $req->category_id;

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
            $makes = Make::orderBy('name')->select('id', 'name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            $dimensions = Dimension::where('user_id', $user_id)->select('id', 'name')->get();
            return ['status' => 'ok', 'machines' => $machines, 'companies' => $companies, 'machinepartmodel' => $machinepartmodel, 'origin' => $origin, 'categories' => $categories, 'machineModels' => $machineModels, 'machine_Parts' => $machineParts, 'makes' => $makes, 'dimensions' => $dimensions];
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
    public function getDropDownsOptionsForItemPartsAddMachinePart(Request $req)
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
            $categories = Category::orderBy('name')->select('id', 'name')->get();
            $applications = Application::orderBy('name')->select('id', 'name')->get();
            $Uom = Uom::orderBy('name')->select('id', 'name')->get();
            $machineparttypes = MachinePartType::orderBy('name')->select('id', 'name')->get();
            $category_id = $req->category_id;
            $type_id = 1;
            $subcategory_id = $req->subcategory_id;
            $item_id = $req->item_id;
            $part_model_id = $req->part_model_id;

            $data = ItemOemPartModeles::with('machinePartOemPart')
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                        $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                            $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                $qu->where('category_id', $category_id);
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {
                    return $query->whereHas('machinePartOemPart', function ($query) use ($part_model_id) {
                        return $query->where('machine_part_model_id', $part_model_id);
                    });
                })
                ->when($subcategory_id, function ($query) use ($subcategory_id) {
                    $query->whereHas('machinePartOemPart', fn ($query) =>

                    $query->whereHas('machinePart', fn ($query) =>
                    $query->where('sub_category_id', $subcategory_id)));
                })
                ->when($type_id, function ($query) use ($type_id) {
                    $query->whereHas('machinePartOemPart', fn ($query) =>

                    $query->whereHas('machinePart', fn ($query) =>
                    $query->where('type_id', $type_id)));
                })
                ->when($item_id, function ($query) use ($item_id) {
                    $query->whereHas('machinePartOemPart', fn ($query) =>

                    $query->whereHas('machinePart', fn ($query) =>
                    $query->where('id', $item_id)));
                })
                ->where('user_id', $user_id)  // user_id

                ->get();

            return ['status' => 'ok', 'categories' => $categories, 'applications' => $applications, 'Uom' => $Uom, 'machineparttypes' => $machineparttypes, 'data' => $data];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
