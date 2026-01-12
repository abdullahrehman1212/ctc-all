<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemInventory;
use App\Models\ItemRackShelf;
use PhpParser\Node\Stmt\Return_;
use App\Models\ItemOemPartModeles;
use Illuminate\Support\Facades\DB;
use App\Services\CustomErrorMessages;
use Illuminate\Support\Facades\Validator;

class ItemInventoryController extends Controller
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

        // Fetch admin ID from the user's record
        $adminId = $user->admin_id;

        if ($adminId) {
            // If adminId is present, skip store and subscription checks
            $store_id = null; // or any default value if needed
            $user_id = $adminId;
        } else {
            // Proceed with store and subscription checks if no adminId
            $store = $user->store;

            if (!$store) {
                return response()->json(['message' => 'Store not found']);
            }

            $store_id = $store->id;
            $user_id = $user->role_id == 2 ? $user->id : $adminId;

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
        }

        try {
            $machine_part_id = $req->item_id;
            // $store_id = $req->store_id;
            $store_type_id = $req->store_type_id;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;

            $itemsInventory = ItemInventory::with(['item',  'racks', 'shelves', 'purchaseOrder', 'store' ,'adjustInventoryChild'])
                ->where('user_id', $user_id)  // user_id
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->whereHas('item', function ($qu) use ($machine_part_id) {
                        // $qu->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                            $qu->where('id', $machine_part_id);
                        // });
                    });
                })
                ->when($store_id, function ($query) use ($store_id) {
                    $query->where('store_id', $store_id);
                })
                ->when($store_type_id, function ($query) use ($store_type_id) {
                    $query->whereHas('store', function ($query) use ($store_type_id) {
                        $query->where('store_type_id', $store_type_id);

                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {
                    $query->whereHas('item', function ($query) use ($sub_category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                    $qu->where('id', $sub_category_id);
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {
                    $query->whereHas('item', function ($qu) use ($part_model_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                            $qu->where('machine_part_model_id', $part_model_id);
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('item', function ($query) use ($category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })
                ->groupBy('item_id', 'store_id', DB::raw('COALESCE(rack_id, 0)'), DB::raw('COALESCE(shelf_id, 0)'))
                ->select('id', 'item_id', 'store_id', 'rack_id', 'shelf_id', DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['itemsInventory' => $itemsInventory];
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
        //
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
        $editItemInventory = ItemInventory::with('racks', 'shelves')->find($req->id);

        return ['status' => 'ok', 'editItemInventory' => $editItemInventory];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function getItemsInventoryLedger(Request $req)
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
        $store = $user->store;

        if (!$store) {
            return response()->json(['message' => 'Store not found']);
        }

        $store_id = $store->id;
        try {
            $machine_part_id = $req->item_id;
            $store_id = $req->store_id;
            $inventory_type_id = $req->inventory_type_id;
            $purchase_order_id = $req->purchase_order_id;
            $invoice_id = $req->invoice_id;
            $store_type_id = $req->store_type_id;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;
            $type_id = $req->type_id;
            $itemsInventory = ItemInventory::with('item', 'racks', 'shelves', 'store', 'inventoryType', 'invoice', 'purchaseOrder')
                ->where('user_id', $user_id)  // user_id

                // ->when($machine_part_id, function ($query, $machine_part_id) {
                //     $query->with('item.machinePartOemPart', function ($query) use ($machine_part_id) {
                //         $query->where('oem_part_no_id', $machine_part_id);
                //     });
                //     $query->whereHas('item.machinePartOemPart', function ($query) use ($machine_part_id) {
                //         $query->where('oem_part_no_id', $machine_part_id);
                //     });
                // })
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->whereHas('item', function ($query) use ($machine_part_id) {
                        $query->where('id', $machine_part_id);
                    });
                })

                // ->when($type_id, function ($query, $type_id) {
                //     $query->with('item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                //         $query->where('type_id', $type_id);
                //     });
                //     $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                //         $query->where('type_id', $type_id);
                //     });
                // })
                ->when($store_id, function ($query) use ($store_id) {
                    $query->where('store_id', $store_id);
                })
                ->when($inventory_type_id, function ($query) use ($inventory_type_id) {
                    $query->where('inventory_type_id', $inventory_type_id);
                })
                ->when($purchase_order_id, function ($query) use ($purchase_order_id) {
                    $query->where('purchase_order_id', $purchase_order_id);
                })
                ->when($invoice_id, function ($query) use ($invoice_id) {
                    $query->whereHas('invoice', function ($query) use ($invoice_id) {
                        $query->where('invoice_id', $invoice_id);
                    });
                })
                ->when($store_type_id, function ($query, $store_type_id) {
                    $query->whereHas('store', function ($qu) use ($store_type_id) {
                        $qu->where('store_type_id', $store_type_id);
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {

                    $query->whereHas('item', function ($query) use ($sub_category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                    $qu->where('id', $sub_category_id);
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {

                    $query->whereHas('item', function ($qu) use ($part_model_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                            $qu->where('machine_part_model_id', $part_model_id);
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {

                    $query->whereHas('item', function ($query) use ($category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })

                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['itemsInventory' => $itemsInventory];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getItemsInventoryLedgerHistory(Request $req)
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
            $machine_part_id = $req->item_id;
            $store_id = $req->store_id;
            $inventory_type_id = $req->inventory_type_id;
            $purchase_order_id = $req->purchase_order_id;
            $invoice_id = $req->invoice_id;
            $store_type_id = $req->store_type_id;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;
            $type = $req->type;
            $itemsInventory = ItemInventory::with('item', 'store', 'inventoryType', 'invoice', 'purchaseOrder')
                ->where('user_id', $user_id)  // user_id
                ->when($type, function ($query, $type) {
                    $query->whereHas('item', function ($query) use ($type) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($type) {
                            $qu->whereHas('machinePart', function ($qu) use ($type) {
                                $qu->where('type_id', $type);
                            });
                        });
                    });
                })
                ->when($machine_part_id, function ($query, $machine_part_id) {

                    $query->whereHas('item', function ($qu) use ($machine_part_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                            $qu->where('machine_part_id', $machine_part_id);
                        });
                    });
                })
                ->when($store_id, function ($query) use ($store_id) {
                    $query->where('store_id', $store_id);
                })
                ->when($inventory_type_id, function ($query) use ($inventory_type_id) {
                    $query->where('inventory_type_id', $inventory_type_id);
                })
                ->when($purchase_order_id, function ($query) use ($purchase_order_id) {
                    $query->where('purchase_order_id', $purchase_order_id);
                })
                ->when($invoice_id, function ($query) use ($invoice_id) {
                    $query->whereHas('invoice', function ($query) use ($invoice_id) {
                        $query->where('invoice_id', $invoice_id);
                    });
                })
                ->when($store_type_id, function ($query, $store_type_id) {
                    $query->whereHas('store', function ($qu) use ($store_type_id) {
                        $qu->where('store_type_id', $store_type_id);
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {

                    $query->whereHas('item', function ($query) use ($sub_category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                    $qu->where('id', $sub_category_id);
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {

                    $query->whereHas('item', function ($qu) use ($part_model_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                            $qu->where('machine_part_model_id', $part_model_id);
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {

                    $query->whereHas('item', function ($query) use ($category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })
                ->get();
            //->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['itemsInventory' => $itemsInventory];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getItemsInventoryHistory(Request $req)
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
            $machine_part_id = $req->item_id;
            $store_id = $req->store_id;
            $store_type_id = $req->store_type_id;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;
            $itemsInventory = ItemInventory::with(['item', 'purchaseOrder', 'store'])
                ->where('user_id', $user_id)  // user_id
                ->when($machine_part_id, function ($query, $machine_part_id) {

                    $query->whereHas('item', function ($qu) use ($machine_part_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                            $qu->where('machine_part_id', $machine_part_id);
                        });
                    });
                })
                ->when($store_id, function ($query) use ($store_id) {
                    $query->where('store_id', $store_id);
                })
                ->when($store_type_id, function ($query) use ($store_type_id) {
                    $query->whereHas('store', function ($query) use ($store_type_id) {
                        $query->where('store_type_id', $store_type_id);
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {

                    $query->whereHas('item', function ($query) use ($sub_category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                    $qu->where('id', $sub_category_id);
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {

                    $query->whereHas('item', function ($qu) use ($part_model_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                            $qu->where('machine_part_model_id', $part_model_id);
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {

                    $query->whereHas('item', function ($query) use ($category_id) {
                        $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })
                ->groupBy('item_id', 'store_id')
                ->select('id', 'item_id', 'store_id', 'purchase_order_id', DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                // ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
                ->get();
            return ['itemsInventory' => $itemsInventory];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function getAdjustItemId(Request $request)
    {

        $getLastPurchasePrice = ItemInventory::select(
            'item_id',
            DB::raw('(SUM(quantity_in) - SUM(quantity_out)) as quantity')
        )
            ->where('item_id', $request->item_id)
            ->groupBy('item_id')
            ->first();

        if (empty($getLastPurchasePrice)) {
            $getLastPurchasePrice = 0;
        }
        $getRate = ItemInventory::where('item_id', $request->item_id)
            ->whereNull('invoice_id')
            ->whereNull('return_child_po_id')
            ->whereNull('return_child_invoice_id')
            ->orderBy('created_at', 'desc')
            ->value('purchase_price');

        if (empty($getRate)) {
            $getRate = 0;
        }

        $avg_cost = ItemOemPartModeles::where('id', $request->item_id)->pluck('avg_cost')->first();

        return [
            'getLastPurchasePrice' => $getLastPurchasePrice,
            'getRate' => $getRate,
            'avg_cost' => $avg_cost,
        ];
    }
}
