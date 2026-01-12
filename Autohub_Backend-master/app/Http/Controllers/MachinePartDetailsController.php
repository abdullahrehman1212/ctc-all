<?php

namespace App\Http\Controllers;

use App\Models\Brands;
use App\Models\Company;
use App\Models\CompanyOemPartNo;
use App\Models\InvoiceChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\Machine;
use App\Models\MachineModel;
use App\Models\MachinePart;
use App\Models\MachinePartModel;
use App\Models\MachinePartOemDimension;
use App\Models\MachinePartOemPartNo;
use App\Models\Make;
use App\Models\OemPartNumber;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderChild;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MachinePartDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
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

        $machine_model_id = $req->machine_model_id;
        $machine_id = $req->machine_id;
        $makes_id = $req->makes_id;
        $make_id = $req->make_id;
        $item_id = $req->item_id;
        $machine_part_id = $req->machine_part_id;

        $oem_number = $req->oem_number;
        $company_id = $req->company_id;
        $company_oem_number = $req->company_oem_number;
        $type_id = $req->type;
        $category_id = $req->category_id;
        $subcategory_id = $req->sub_category_id;
        $application_id = $req->application_id;
        $origin_id = $req->origin_id;
        $brand_id = $req->brand_id;
        $from_year = $req->from_year;
        $to_year = $req->to_year;
        $part_model_id = $req->part_model_id;
        $machine_part_model_id = $req->machine_part_model_id;

        $data = ItemOemPartModeles::select('machine_part_oem_part_nos_machine_models.*')
        // ->leftjoin('machine_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'machine_item_parts.machine_part_oem_part_nos_machine_models_id')
            ->leftjoin('item_oem_part_model_item', 'machine_part_oem_part_nos_machine_models.id', '=', 'item_oem_part_model_item.machine_part_oem_part_nos_machine_models_id')
            ->leftjoin('make_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'make_item_parts.machine_part_oem_part_nos_machine_models_id')
        // ->join('model_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'model_item_parts.machine_part_oem_part_nos_machine_models_id')
            ->groupBy('machine_part_oem_part_nos_machine_models.id')
            ->with('machinePartOemPart', 'machineModels', 'origin', 'brand', 'dimension', 'machines', 'makes', 'machineModel', 'items_id')
            ->where('machine_part_oem_part_nos_machine_models.user_id', $user_id) // user_id
            ->when($machine_id, function ($query, $machine_id) {
                $machineIds = is_array($machine_id) ? $machine_id : [$machine_id];

                $query->whereHas('machines', function ($query) use ($machineIds) {
                    $query->whereIn('machine_id', $machineIds);
                })->orWhereHas('machineModel', function ($query) use ($machineIds) {
                    $query->whereIn('machine_id', $machineIds);
                });
            })
            ->when($makes_id, function ($query) use ($makes_id) {
                $makeIds = is_array($makes_id) ? $makes_id : [$makes_id];

                $query->where(function ($query) use ($makeIds) {
                    foreach ($makeIds as $makeId) {
                        $query->orWhereHas('machineModel', function ($query) use ($makeId) {
                            $query->where('make_id', $makeId);
                        });
                    }
                });
            })

            ->when($machine_model_id, function ($q, $machine_model_id) {
                return $q->where('machine_model_id', $machine_model_id);
            })
            ->when($origin_id, function ($q, $origin_id) {
                return $q->where('origin_id', $origin_id);
            })
            ->when($brand_id, function ($q, $brand_id) {
                return $q->where('brand_id', $brand_id);
            })
        // ->when($machine_part_model_id, function ($query) use ($machine_part_model_id) {
        //     $query->whereHas('machinePartOemPart', function ($q) use ($machine_part_model_id) {
        //         $q->where('machine_part_model_id', '=', $machine_part_model_id);
        //     });
        // })
        // ->when($machine_id, function ($query) use ($machine_id) {
        //     $query->whereHas('machineModel', fn ($q) => $q->where('machine_id', '=', $machine_id));
        // })

        // ->when($part_model_id, function ($query) use ($part_model_id) {
        //     $query->whereHas('machinePartOemPart', fn ($query) =>

        //     $query->whereHas('machinePartmodel', fn ($query) =>
        //     $query->where('id', $part_model_id)));
        // })
            ->when($category_id, function ($query, $category_id) {
                $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                    $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                        $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                            $qu->where('category_id', $category_id);
                        });
                    });
                });
            })
            ->when($subcategory_id, function ($query, $subcategory_id) {
                $query->whereHas('machinePartOemPart', function ($qu) use ($subcategory_id) {
                    $qu->whereHas('machinePart', function ($qu) use ($subcategory_id) {
                        $qu->where('sub_category_id', $subcategory_id);
                    });
                });
            })
            ->when($machine_part_id, function ($query, $machine_part_id) {
                $query->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                    $qu->where('oem_part_no_id', $machine_part_id);
                });
            })
            ->when($from_year, function ($q, $from_year) {
                return $q->where('from_year', '>=', $from_year);
            })
            ->when($to_year, function ($q, $to_year) {
                return $q->where('to_year', '<=', $to_year);
            })

        // ->when($subcategory_id, function ($query) use ($subcategory_id) {
        //     $query->whereHas('machinePartOemPart', fn ($query) =>

        //     $query->whereHas('machinePart', fn ($query) =>
        //     $query->where('sub_category_id', $subcategory_id)));
        // })
            ->when($application_id, function ($query) use ($application_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('application_id', $application_id)));
            })

            ->when($make_id, function ($query) use ($make_id) {
                $query->whereHas('machineModel', fn($q) => $q->where('make_id', '=', $make_id));
            })
        // ->when($machine_part_id, function ($query) use ($machine_part_id) {
        //     $query->whereHas('machinePartOemPart', fn ($q) =>
        //     $q->where('machine_part_id', $machine_part_id));
        // })
            ->when($oem_number, function ($query) use ($oem_number) {
                $query->whereHas('machinePartOemPart', function ($query) use ($oem_number) {
                    $query->whereHas('oemPartNumber', function ($query) use ($oem_number) {
                        $query->where(function ($query) use ($oem_number) {
                            $query->where('number1', '=', $oem_number)
                                ->orWhere('number2', '=', $oem_number)
                                ->orWhere('number3', '=', $oem_number)
                                ->orWhere('number4', '=', $oem_number);
                        });
                    });
                });
            })

            ->when($make_id, function ($query) use ($make_id) {
                $makeIds = is_array($make_id) ? $make_id : [$make_id];

                $query->where(function ($query) use ($makeIds) {
                    foreach ($makeIds as $makeId) {
                        $query->orWhereHas('machineModel', function ($query) use ($makeId) {
                            $query->where('make_id', $makeId);
                        });
                    }
                });
            })

            ->when($company_id, function ($query) use ($company_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('oemPartNumbercompany2', fn($query) =>
                        $query->where('company_id', $company_id)));
            })
            ->when($type_id, function ($query) use ($type_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>
                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('type_id', $type_id)));
            })
            ->when($company_oem_number, function ($query) use ($company_oem_number) {
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas(
                        'oemPartNumbercompany2',
                        fn($query) =>
                        $query->where('number1', 'LIKE', '%' . $company_oem_number . '%')
                            ->orWhere('number1', 'LIKE', '%' . $company_oem_number . '%')
                            ->orWhere('number2', 'LIKE', '%' . $company_oem_number . '%')
                            ->orWhere('number3', 'LIKE', '%' . $company_oem_number . '%')
                            ->orWhere('number4', 'LIKE', '%' . $company_oem_number . '%')

                    ));
            })
            ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

        return ['data' => $data];
    }

    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function kitItemDropdown(Request $request)
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

        $category_id = $request->category_id;
        $type_id = $request->type_id;
        $subcategory_id = $request->subcategory_id;
        $item_id = $request->item_id;
        $part_model_id = $request->part_model_id;

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
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('sub_category_id', $subcategory_id)));
            })
            ->when($type_id, function ($query) use ($type_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('type_id', $type_id)));
            })
            ->when($item_id, function ($query) use ($item_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('id', $item_id)));
            })
        // ->when($part_model_id, function ($query, $part_model_id) {
        //     return $query->whereHas('machinePartOemPart', function ($query) use ($part_model_id) {
        //                 return $query->where('machine_part_model_id', $part_model_id);
        //             });
        // })
        //   ->when($part_model_id, function ($query) use ($part_model_id) {
        //     $query->whereHas('machinePartOemPart', fn ($query) =>

        //     $query->whereHas('machinePartmodel', fn ($query) =>
        //     $query->where('id', $part_model_id)));
        // })
        // ->when($part_model_id, function ($query) use ($part_model_id) {
        //        return $query->whereHas('machinePartOemPart', fn ($query) =>

        //         $query->where('machine_part_model_id', $part_model_id));
        //     })
            ->where('user_id', $user_id) // user_id
            ->get();

        // $data = MachinePartOemPartNo::with('machinePart')->groupby('machine_part_id')->get();

        return ['data' => $data];
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
     * adding ItemModelOem
     * @param \Illuminate\Http\Response number1
     * @param \Illuminate\Http\Response number2
     * @param \Illuminate\Http\Response machine_model_id
     * @param \Illuminate\Http\Response machine_part_id
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response company_id
     * @return \Illuminate\Http\Response number1
     * @return \Illuminate\Http\Response number2
     * @return \Illuminate\Http\Response message
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

        DB::beginTransaction();

        $data = OemPartNumber::where('number1', '=', $request->number1)->exists();

        $OemPartNo = new OemPartNumber();
        $OemPartNo->number1 = $request->number1;
        $OemPartNo->number2 = $request->number2;
        $OemPartNo->number3 = $request->number3;
        $OemPartNo->number4 = $request->number4;
        $OemPartNo->user_id = $user_id;
        $OemPartNo->save();
        $OemPartNo_id = $OemPartNo->id;

        $MachinePartOem = new MachinePartOemPartNo();
        $MachinePartOem->oem_part_no_id = $OemPartNo_id;
        $MachinePartOem->machine_part_id = $request->machine_part_id;
        $MachinePartOem->machine_part_model_id = $request->machine_part_model_id;
        $MachinePartOem->user_id = $user_id;
        $MachinePartOem->save();
        $MachinePartOem_id = $MachinePartOem->id;

        $part_model = MachinePartModel::where('id', $request->machine_part_model_id)->value('name');
        $part_model = $part_model ? $part_model . "/" : '';

        $brand = Company::where('id', $request->brand_id)->value('name');
        $machinepartname = MachinePart::where('id', $request->machine_part_id)->value('name');

        $ItemOemPartModel = new ItemOemPartModeles();
        $ItemOemPartModel->name = $part_model . $machinepartname . "/" . $request->number1 . "/" . $brand . "/" . $request->number2;
        $ItemOemPartModel->primary_oem = $request->number1;
        $ItemOemPartModel->machine_part_oem_part_no_id = $MachinePartOem_id;

        $ItemOemPartModel->origin_id = $request->origin_id;
        $ItemOemPartModel->brand_id = $request->brand_id;
        $ItemOemPartModel->to_year = $request->to_year;
        $ItemOemPartModel->from_year = $request->from_year;
        $ItemOemPartModel->user_id = $user_id;

        if (!empty($request->machine_model_id)) {
            $ItemOemPartModel->machine_model_id = $request->machine_model_id[0];
        }

        $ItemOemPartModel->save();

        $ItemOemPartModel_id = $ItemOemPartModel->id;

        $ItemOemPartModel->brands_id()->sync($request->alternativeBrands);

        $ItemOemPartModel->makes()->sync($request->input('make_id', []));
        $ItemOemPartModel->machines()->sync($request->input('machine_id', []));
        $ItemOemPartModel->machineModels()->sync($request->input('machine_model_id', []));
        foreach ($request->input('alternateParts') as $item) {
            $itemId = $item['items_id'];
            $itemName = $item['name'];

            $ItemOemPartModel->items_id()->create([
                'items_id' => $itemId,
                'name' => $itemName,

            ]);
        }

        foreach ($request->dimensions as $row) {
            $oemdimension = new MachinePartOemDimension();
            $oemdimension->machine_part_oem_part_nos_machine_models_id = $ItemOemPartModel_id;
            $oemdimension->dimension_id = $row['dimension_id'];
            $oemdimension->value = $row['value'];
            $oemdimension->user_id = $user_id;
            $oemdimension->save();
        }

        DB::commit();
        return ['status' => "ok", 'message' => 'Item OEM stored successfully'];
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
        $rules = [
            'id' => 'required|int|exists:machine_part_oem_part_nos_machine_models,id',
        ];
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        $itemOemDetail = ItemOemPartModeles::find($req->id);

        $machineIds = $itemOemDetail->machines->pluck('id')->toArray();
        $machineModelsIds = $itemOemDetail->machineModels->pluck('id')->toArray();
        $makesIds = $itemOemDetail->makes->pluck('id')->toArray();

        $itemOemDetail->machine_id = $machineIds;
        $itemOemDetail->make_id = $makesIds;
        $itemOemDetail->machine_model = $machineModelsIds;

        unset($itemOemDetail->machines);
        unset($itemOemDetail->machineModels);
        unset($itemOemDetail->makes);

        $dimensions = [];
        foreach ($itemOemDetail->dimension as $child) {
            $dimensions[] = [
                'item_id' => $child->pivot->machine_part_oem_part_nos_machine_models_id,
                'dimension_id' => $child->pivot->dimension_id,
                'value' => $child->pivot->value,
            ];
        }

        $alternativeBrands = [];
        foreach ($itemOemDetail->brands_id as $child) {
            $alternativeBrands[] = [
                'item_id' => $child->pivot->machine_part_oem_part_nos_machine_models_id,
                'brands_id' => $child->pivot->brands_id,
                'number3' => $child->pivot->number3,
            ];
        }

        if ($itemOemDetail->machinePartOemPart) {
            $machinePartOemPart = [
                'machine_part_oem_part_no_id' => $itemOemDetail->machinePartOemPart->id,
                'machine_part_id' => $itemOemDetail->machinePartOemPart->machine_part_id,
                'oem_part_no_id' => $itemOemDetail->machinePartOemPart->oem_part_no_id,
                'number1' => $itemOemDetail->machinePartOemPart->oemPartNumber->number1 ?? null,
                'number2' => $itemOemDetail->machinePartOemPart->oemPartNumber->number2 ?? null,
            ];
        }

        $response = [
            'id' => $itemOemDetail->id,
            'name' => $itemOemDetail->name,
            'primary_oem' => $itemOemDetail->primary_oem,
            'machine_part_oem_part_no_id' => $itemOemDetail->machine_part_oem_part_no_id,
            'brand_id' => $itemOemDetail->brand_id,
            'origin_id' => $itemOemDetail->origin_id,
            'from_year' => $itemOemDetail->from_year,
            'to_year' => $itemOemDetail->to_year,
            'machine_id' => $machineIds,
            'make_id' => $makesIds,
            'machine_model' => $machineModelsIds,
            'machinePartOemPart' => $machinePartOemPart,
            'dimensions' => $dimensions,
            'alternativeBrands' => $alternativeBrands,
        ];

        return ['data' => $response];
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
        // Validation rules
        $rules = [
            'id' => 'required|int|exists:machine_part_oem_part_nos_machine_models,id',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
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
                // Handle machinePartOemPart data
                $machinePartOemPart = $request->machinePartOemPart;

                // Update OEM Part Number
                $OemPartNo = OemPartNumber::findOrFail($machinePartOemPart['oem_part_no_id']);
                $OemPartNo->number1 = $machinePartOemPart['number1'];
                $OemPartNo->number2 = $machinePartOemPart['number2'];
                $OemPartNo->number3 = $request->number3 ?? null;
                $OemPartNo->number4 = $request->number4 ?? null;
                $OemPartNo->save();

                // Update MachinePartOemPartNo
                $MachinePartOem = MachinePartOemPartNo::findOrFail($machinePartOemPart['machine_part_oem_part_no_id']);
                $MachinePartOem->oem_part_no_id = $machinePartOemPart['oem_part_no_id'];
                $MachinePartOem->machine_part_id = $machinePartOemPart['machine_part_id'];
                $MachinePartOem->machine_part_model_id = $request->machine_part_model_id;
                $MachinePartOem->save();

                // Update ItemOemPartModel
                $ItemOemPartModel = ItemOemPartModeles::findOrFail($request->id);
                $brand = Company::where('id', $request->brand_id)->value('name');
                $part_model = MachinePartModel::where('id', $request->machine_part_model_id)->value('name');
                $machinepartname = MachinePart::where('id', $machinePartOemPart['machine_part_id'])->value('name');

                $ItemOemPartModel->name = "{$machinepartname}/{$machinePartOemPart['number1']}/{$brand}/{$part_model}";
                $ItemOemPartModel->primary_oem = $machinePartOemPart['number1'];
                $ItemOemPartModel->machine_model_id = $request->machine_model_id;
                $ItemOemPartModel->origin_id = $request->origin_id;
                $ItemOemPartModel->brand_id = $request->brand_id;
                $ItemOemPartModel->to_year = $request->to_year;
                $ItemOemPartModel->from_year = $request->from_year;
                $ItemOemPartModel->user_id = $user_id;

                $ItemOemPartModel->save();

                // Sync relations
                $ItemOemPartModel->makes()->sync($request->make_id);
                $ItemOemPartModel->machines()->sync($request->machine_id);
                $ItemOemPartModel->machineModels()->sync($request->machine_model);

                // Handle dimensions
                if ($request->dimensions) {
                    $dimensionChildsId = [];

                    foreach ($request->dimensions as $row) {
                        $oemdimension = MachinePartOemDimension::updateOrCreate(
                            [
                                'machine_part_oem_part_nos_machine_models_id' => $ItemOemPartModel->id,
                                'dimension_id' => $row['dimension_id'],
                                'value' => $row['value'],
                                'user_id' => $user_id,
                            ]
                        );

                        $dimensionChildsId[] = $oemdimension->id;
                    }

                    // Delete dimensions that are no longer in the request
                    MachinePartOemDimension::where('machine_part_oem_part_nos_machine_models_id', $ItemOemPartModel->id)
                        ->whereNotIn('id', $dimensionChildsId)
                        ->delete();
                }

                // Handle alternative brands
                if ($request->alternativeBrands) {
                    $altBrandIds = [];
                    foreach ($request->alternativeBrands as $brand) {
                        $alternativeBrand = Brands::updateOrCreate(
                            ['id' => $brand['machine_part_oem_part_nos_machine_models_id'] ?? null],
                            [
                                'machine_part_oem_part_nos_machine_models_id' => $ItemOemPartModel->id,
                                'brands_id' => $brand['brands_id'],
                                'number3' => $brand['number3'],
                            ]
                        );
                        $altBrandIds[] = $alternativeBrand->id;
                    }

                    // Delete alternative brands that are no longer in the request
                    Brands::where('machine_part_oem_part_nos_machine_models_id', $ItemOemPartModel->id)
                        ->whereNotIn('id', $altBrandIds)
                        ->delete();
                }
            });

            return response()->json(['status' => 'ok', 'message' => 'Item Detail Updated successfully'], 200);
        } catch (\Exception $e) {
            // Custom error handling
            $message = CustomErrorMessages::getCustomMessage($e);
            return response()->json(['status' => 'error', 'message' => $message], 500);
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
            'id' => 'required|int',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            $itemOemDetail = ItemOemPartModeles::where('id', $req->id)->first();

            $existsInPurchaseOrder = PurchaseOrderChild::where('item_id', $itemOemDetail->id)->exists();
            $existsInInvoiceChild = InvoiceChild::where('item_id', $itemOemDetail->id)->exists();
            $existsInItemInventory = ItemInventory::where('item_id', $itemOemDetail->id)->exists();

            if ($existsInPurchaseOrder || $existsInInvoiceChild || $existsInItemInventory) {
                return [
                    'status' => 'error',
                    'message' => 'Selected part is used in stock and cannot be deleted',
                ];
            }

            ItemOemPartModeles::where('id', $req->id)->delete();
            $oempartno = MachinePartOemPartNo::where('id', $itemOemDetail->machine_part_oem_part_no_id)->first();
            MachinePartOemPartNo::where('id', $itemOemDetail->machine_part_oem_part_no_id)->delete();
            CompanyOemPartNo::where('oem_part_no_id', $oempartno->oem_part_no_id)->delete();
            OemPartNumber::where('id', $oempartno->oem_part_no_id)->delete();

            return ['status' => "ok", 'message' => 'Part deleted successfully'];
        } catch (\Exception $e) {
            return [
                'status' => "error",
                'message' => 'An error occurred: the selected part is used elsewhere in the system and cannot be deleted',
            ];
        }
    }

    public function storeExcelData(Request $request)
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
            DB::transaction(function () use ($request, $user_id) {
                // OEM numbers store in table oem_part_nos
                foreach ($request->data as $data) {

                    $machine_id = $data['Machine'];

                    $make_id = $data['Make'];

                    $MachineModel = MachineModel::where('name', $data['Model'])->first();
                    if (!$MachineModel) {
                        $MachineModel = new MachineModel();
                        $MachineModel->name = $data['Model'];
                        $MachineModel->machine_id = $machine_id;
                        $MachineModel->make_id = $make_id;
                        $MachineModel->user_id = $user_id; //user id
                        $MachineModel->save();
                    }
                    $machine_model_id = $MachineModel->id;

                    $MachinePart = MachinePart::where('name', $data['Description'])->first();
                    if (!$MachinePart) {
                        $MachinePart = new MachinePart();
                        $MachinePart->name = $data['Description'];
                        $MachinePart->user_id = $user_id; //user id
                        $MachinePart->save();
                    }
                    $machine_part_id = $MachinePart->id;

                    if (isset($data['OemPartNo'])) {
                        $getOemPartNos = explode('::', $data['OemPartNo']);
                        $OemPartNo = new OemPartNumber();
                        $OemPartNo->number1 = $getOemPartNos[0];
                        $OemPartNo->number2 = $getOemPartNos[1] ?? '';
                        $OemPartNo->number3 = $getOemPartNos[2] ?? '';
                        $OemPartNo->number4 = $getOemPartNos[3] ?? '';
                        $OemPartNo->user_id = $user_id; //user id
                        $OemPartNo->save();
                    } else {
                        $OemPartNo = new OemPartNumber();
                        $OemPartNo->number1 = 'xxxxxxxxx';
                        $OemPartNo->number2 = '';
                        $OemPartNo->number3 = '';
                        $OemPartNo->number4 = '';
                        $OemPartNo->user_id = $user_id; //user id
                        $OemPartNo->save();
                    }
                    $OemPartNo_id = $OemPartNo->id;

                    $MachinePartOem = MachinePartOemPartNo::where([['oem_part_no_id', $OemPartNo_id], ['machine_part_id', $machine_part_id]])->first();
                    if (!$MachinePartOem) {
                        $MachinePartOem = new MachinePartOemPartNo();
                        $MachinePartOem->oem_part_no_id = $OemPartNo_id;
                        $MachinePartOem->machine_part_id = $machine_part_id;
                        $MachinePartOem->user_id = $user_id; //user id

                        $MachinePartOem->save();
                    }
                    $MachinePartOem_id = $MachinePartOem->id;

                    $ItemOemPartModel = ItemOemPartModeles::where([['machine_part_oem_part_no_id', $MachinePartOem_id], ['machine_model_id', $machine_model_id]])->first();
                    if (!$ItemOemPartModel) {
                        $ItemOemPartModel = new ItemOemPartModeles();
                        $ItemOemPartModel->machine_part_oem_part_no_id = $MachinePartOem_id;
                        $ItemOemPartModel->machine_model_id = $machine_model_id;
                        $ItemOemPartModel->user_id = $user_id; //user id
                        $ItemOemPartModel->save();
                    }

                    if (isset($data['Donaldson'])) {
                        $getCompanyOemPartNos = explode('::', $data['Donaldson']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 1;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['Fleetguard'])) {
                        $getCompanyOemPartNos = explode('::', $data['Fleetguard']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 2;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['Baldwin'])) {
                        $getCompanyOemPartNos = explode('::', $data['Baldwin']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 3;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['Sakura'])) {
                        $getCompanyOemPartNos = explode('::', $data['Sakura']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 4;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['MANN'])) {
                        $getCompanyOemPartNos = explode('::', $data['MANN']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 5;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['Komai'])) {
                        $getCompanyOemPartNos = explode('::', $data['Komai']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 6;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['JESON'])) {
                        $getCompanyOemPartNos = explode('::', $data['JESON']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 7;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }

                    if (isset($data['Yaotai'])) {
                        $getCompanyOemPartNos = explode('::', $data['Yaotai']);
                        $CompaniesOemPartNumber = new CompanyOemPartNo();
                        $CompaniesOemPartNumber->oem_part_no_id = $OemPartNo_id;
                        $CompaniesOemPartNumber->company_id = 8;
                        $CompaniesOemPartNumber->user_id = $user_id; //user id
                        $CompaniesOemPartNumber->number1 = $getCompanyOemPartNos[0];
                        $CompaniesOemPartNumber->number2 = $getCompanyOemPartNos[1] ?? '';
                        $CompaniesOemPartNumber->number3 = $getCompanyOemPartNos[2] ?? '';
                        $CompaniesOemPartNumber->number4 = $getCompanyOemPartNos[3] ?? '';
                        $CompaniesOemPartNumber->save();
                    }
                }
            });
            return ['status' => "ok", 'message' => 'Item OEM stored successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getsetsOemApproved(Request $req)
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

        $type_id = $req->type;

        $data = MachinePartOemPartNo::with('machinePart')

            ->when($type_id, function ($query) use ($type_id) {
                // $query->whereHas('machinePartOemPart', fn ($query) =>
                $query->whereHas('machinePart', fn($query) =>
                    $query->where('type_id', $type_id));
            })
            ->groupby('machine_part_id')
            ->where('user_id', $user_id) // user_id
            ->get();

        return ['data' => $data];
    }
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function getItemPartsDropdowm(Request $request)
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
        $subcategory_id = $request->sub_category_id;
        $category_id = $request->category_id;
        $data = MachinePartOemPartNo::with('machinePart')
            ->when($subcategory_id, function ($query) use ($subcategory_id) {

                $query->whereHas('machinePart', fn($query) =>
                    $query->where('sub_category_id', $subcategory_id));
            })
            ->when($category_id, function ($query) use ($category_id) {

                $query->whereHas('machinePart', fn($query) =>
                    $query->whereHas('subcategories', fn($query) =>
                        $query->where('category_id', $category_id)));
            })
            ->where('user_id', $user_id) // user_id
            ->groupby('machine_part_id')->get();
        //   $data = ItemOemPartModeles::with('machinePartOemPart', 'machinePart')->get();
        return ['data' => $data];
    }

    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function getItemPartsOemQty(Request $req)
    {
        $store_id = $req->store_id;
        $id = $req->id;
        $from = $req->from;
        $to = $req->to;
        $data = ItemOemPartModeles::with(['ItemRacks', 'itemInventory2' => function ($query) use ($store_id) {
            $query->where('store_id', $store_id);
        }])
            ->where('id', $id)
            ->first();

        $AvgPrice = PurchaseOrderChild::getStoredAveragePriceCostExpense($id);
        $AvgPrice->AvgPrice2 = $AvgPrice;
        $AvgPrice = PurchaseOrderChild::where('item_id', $id)
            ->when($from, function ($query, $from) use ($to) {
                $query->whereBetween('created_at', [$from, $to]);
            })
            ->groupby('item_id')
            ->first();

        $last_purchase = PurchaseOrderChild::with('PurchaseOrder')

            ->with('item')
            ->where('item_id', $id)
            ->orderBy('id', 'desc')->first();
        $last_purchase_supplier[] = array(
            "supplier" => $last_purchase->PurchaseOrder->supplier->name ?? null,
            "item_name" => $last_purchase->item->name ?? null,
            "purchase_price" => $last_purchase->purchase_price ?? null,
            "dollar_price" => $last_purchase->dollar_price ?? null,
            "received_quantity" => $last_purchase->received_quantity ?? null,

        );

        $last_sale = InvoiceChild::with('invoiceNo')->with('item')
            ->where('item_id', $id)
            ->orderBy('id', 'desc')->first();

        $last_sold_customer[] = array(
            "customer" => $last_sale->invoiceNo->customer->name ?? null,
            "walk_in_customer_name" => $last_sale->invoiceNo->walk_in_customer_name ?? null,
            "item_name" => $last_sale->item->name ?? null,
            "quantity" => $last_sale->quantity ?? null,
            "price" => $last_sale->price ?? null,

        );
        return ['data' => $data, 'AvgPrice' => $AvgPrice, 'last_purchase_supplier' => $last_purchase_supplier, 'last_sold_customer' => $last_sold_customer];
    }

    public function getModelItemOemdetails(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:machine_part_oem_part_nos_machine_models,id',
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

        $itemOemDetail = ItemOemPartModeles::select('machine_part_oem_part_nos_machine_models.*')
            ->join('make_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'make_item_parts.machine_part_oem_part_nos_machine_models_id')
            ->join('machine_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'machine_item_parts.machine_part_oem_part_nos_machine_models_id')
            ->join('model_item_parts', 'machine_part_oem_part_nos_machine_models.id', '=', 'model_item_parts.machine_part_oem_part_nos_machine_models_id')
            ->with('machinePartOemPart', 'machineModels', 'origin', 'brand', 'dimension', 'machines', 'makes')
            ->where('machine_part_oem_part_nos_machine_models.id', $req->id) // Specify the table for 'id'
            ->first();
        $alternate_brand = Brands::with('alternate_brands')->where('machine_part_oem_part_nos_machine_models_id', $req->id)->get();
        $oem = $itemOemDetail->machinePartOemPart->oemPartNumber->number1;
        $id = $itemOemDetail->id;
        $otherItemsWithSameOemNumber = ItemOemPartModeles::with('machinePartOemPart', 'machineModel', 'origin', 'brand', 'dimension')->when($oem, function ($query) use ($oem) {
            $query->whereHas(
                'machinePartOemPart',
                fn($query) =>
                $query->whereHas(
                    'oemPartNumber',
                    fn($query) =>
                    $query->where('number1', 'LIKE', '%' . $oem . '%')
                        ->orWhere('number1', 'LIKE', '%' . $oem . '%')
                        ->orWhere('number2', 'LIKE', '%' . $oem . '%')
                        ->orWhere('number3', 'LIKE', '%' . $oem . '%')
                        ->orWhere('number4', 'LIKE', '%' . $oem . '%')
                )
            );
        })
        // ->where('user_id', $user_id)  // user_id
            ->where('id', '!=', $id)
            ->get();
        return ['itemOemDetail' => $itemOemDetail, 'otherItemsWithSameOemNumber' => $otherItemsWithSameOemNumber, 'alternate_brand' => $alternate_brand];
    }

    public function updateItemPrices(Request $request)
    {
        //eturn 1;
        // return $request->all();
        $rules = array(
            'id' => 'required|int|exists:machine_part_oem_part_nos_machine_models,id',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {

                $ItemOemPartModel = ItemOemPartModeles::find($request->id);
                $ItemOemPartModel->sale_price = $request->sale_price;
                $ItemOemPartModel->min_price = $request->min_price;
                $ItemOemPartModel->max_price = $request->max_price;
                $ItemOemPartModel->save();
            });
            return ['status' => "ok", 'message' => 'Item prices Updated successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function getOemProcessedParts(Request $request)
    {
        $id = $request->item_id;

        $data = ItemOemPartModeles::when($id, function ($q, $id) {
            return $q->where('id', $id);
        })->get();
        return ['data' => $data];
    }
    public function addLabelToOem(Request $request)
    {

        $rules = array(
            //  'name' => 'required|string|min:2|max:255|',
            //  'machine_id' => 'required|int|exists:machines,id',
            // 'make_id' => 'required|int|exists:makes,id'
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

        // OEM numbers store in table oem_part_nos
        $items = ItemOemPartModeles::get();
        $count = 0;
        $id2 = 3;
        foreach ($items as $items) {

            // $item = ItemOemPartModeles::where('id', $id2)->first();

            // if (!$item) {
            //     $id2++;
            // } else {
            $mpopni = $items->machine_part_oem_part_no_id;
            $id = $items->id;
            $brandid = $items->brand_id;
            $brand = Company::where('id', $brandid)->value('name');

            $MachinePartOemPartNo = MachinePartOemPartNo::where('id', $mpopni)->first();
            $oemnoid = $MachinePartOemPartNo->oem_part_no_id;
            $machine_part_model_id = $MachinePartOemPartNo->machine_part_model_id;
            $machinepartid = $MachinePartOemPartNo->machine_part_id;
            $number1 = OemPartNumber::where('id', $oemnoid)->value('number1');
            $number2 = OemPartNumber::where('id', $oemnoid)->value('number2');

            $macinepartmodel = MachinePartModel::where('id', $machine_part_model_id)->first();

            $name = MachinePart::where('id', $machinepartid)->value('name');

            $part_model = MachinePartModel::where('id', $machine_part_model_id)->value('name');
            if ($part_model) {
                $part_model = $part_model . "/";
            } else {
                $part_model = '';
            }
            //  $ItemOemPartModel = ItemOemPartModeles::where('id', $id);
            $ItemOemPartModel = ItemOemPartModeles::find($id);
            //$ItemOemPartModel->name = $name . "/" . $number1 . "/" . $brand . "/" . $part_model;
            $ItemOemPartModel->name = $part_model . $name . "/" . $number1 . "/" . $brand . "/" . $number2;
            $ItemOemPartModel->save();
            $id2++;
            $count++;
            // }
        }
        return $count;
    }
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response
     */
    public function getItemOemDropDown(Request $request)
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

        $category_id = $request->category_id;
        $type_id = $request->type_id;
        $subcategory_id = $request->subcategory_id;
        $item_id = $request->item_id;
        $part_model_id = $request->part_model_id;
        $data = ItemOemPartModeles::with('machinePartOemPart', 'machineModels', 'origin', 'brand', 'dimension', 'machines', 'makes', 'machineModel', 'items_id', 'brands_id', 'itemInventory2')
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
                $query->whereHas('machinePartOemPart', fn($query) =>

                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('sub_category_id', $subcategory_id)));
            })
            ->when($type_id, function ($query) use ($type_id) {
                $query->whereHas('machinePartOemPart', fn($query) =>
                    $query->whereHas('machinePart', fn($query) =>
                        $query->where('type_id', $type_id)));
            })
            ->where('user_id', $user_id) // user_id
            ->get();
        // return $data;

        return ['data' => $data];
    }
}
