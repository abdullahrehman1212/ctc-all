<?php

namespace App\Http\Controllers;

use App\Models\AdjustInventoryChild;
use App\Models\CoaAccount;
use App\Models\Expense;
use App\Models\Invoice;
use App\Models\InvoiceChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\ItemRackShelf;
use App\Models\Land;
use App\Models\Person;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderChild;
use App\Models\ReturnedPurchaseOrder;
use App\Models\ReturnedPurchaseOrderChild;
use App\Models\ReturnedSale;
use App\Models\ReturnedSaleChild;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PurchaseOrderController extends Controller
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
     * Displaying latest po + 1.
     *
     * @return \Illuminate\Http\Response
     */
    public function getLatestpono()
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
            $po_no = PurchaseOrder::where('user_id', $user_id) // user_id
                ->orderBy('id', 'desc')->first();
            if ($po_no) {
                $po_no = $po_no->po_no + 1;
            } else {
                $po_no = 1;
            }

            return ['status' => 'ok', 'po_no' => $po_no];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * Displaying purchase orders list.
     *
     * @return \Illuminate\Http\Response
     */
    public function getPolist(Request $req)
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
            $toPackage = now();
            switch ($package_id) {
                case 1: // Trial Package (2 weeks)
                    $fromPackage = $toPackage->copy()->subWeeks(2);
                    break;

                case 2: // Basic Package (1 month)
                    $fromPackage = $toPackage->copy()->subMonth();
                    break;

                case 3: // Show Package (3 months)
                    $fromPackage = $toPackage->copy()->subMonths(3);
                    break;

                case 4: // Gold Package (1 year)
                    $fromPackage = $toPackage->copy()->subYear();
                    break;

                default:
                    return response()->json(['message' => 'Invalid package']);
            }
        }

        // Continue with the rest of your logic here

        try {
            $supplier_id = $req->supplier_id;
            $po_no = $req->po_no;
            // $store_id = $req->store_id;
            // $store_type_id = 2;
            $from = $req->from_date;
            $to = $req->to_date;
            $searcField = $req->searcField;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;
            // $category_id = 10;

            $machine_part_id = $req->item_id;
            $type_id = $req->type_id;
            // $store_name = $req->store_name;
            if ($req->po_type == 1) {
                $purchaseorderlist = PurchaseOrder::with('supplier', 'store', 'purchaseOrderChild')
                    ->where('person_id', '!=', null)
                    ->when($supplier_id, function ($q, $supplier_id) {
                        return $q->where('person_id', $supplier_id);
                    })
                    ->when($store_id, function ($q, $store_id) {
                        return $q->where('store_id', $store_id);
                    })
                // ->when($store_name, function ($query) use ($store_name) {
                //     $query->whereHas('store', fn ($q) => $q->where('name', 'LIKE', '%' . $store_name . '%'));
                // })
                // ->when($machine_part_id, function ($q, $machine_part_id) {
                //     return $q->where('item_id', $machine_part_id);
                // })
                    ->when($store_id, function ($q, $store_id) {
                        return $q->where('store_id', $store_id);
                    })
                    ->when($store_id, function ($q, $store_id) {
                        return $q->where('store_id', $store_id);
                    })
                    ->when($fromPackage, function ($q, $fromPackage) {
                        return $q->where('created_at', '>=', $fromPackage);
                    })
                    ->when($to, function ($q, $to) {
                        return $q->where('created_at', '<=', $to);
                    })
                // ->when($store_type_id, function ($query) use ($store_type_id) {
                //     $query->whereHas('store', fn ($q) => $q->where('store_type_id', '=', $store_type_id));
                // })
                    ->when($from, function ($q, $from) {
                        return $q->where('request_date', '>=', $from);
                    })
                    ->when($to, function ($q, $to) {
                        return $q->where('request_date', '<=', $to);
                    })
                    ->when($searcField, function ($q, $searcField) {
                        return $q->where('remarks', 'LIKE', '%' . $searcField . '%');
                    })
                    ->when($sub_category_id, function ($query, $sub_category_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id) {
                            $query->where('sub_category_id', $sub_category_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id) {
                            $query->where('sub_category_id', $sub_category_id);
                        });
                    })
                    ->when($type_id, function ($query, $type_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                            $query->where('type_id', $type_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                            $query->where('type_id', $type_id);
                        });
                    })
                    ->when($category_id, function ($query, $category_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                            $query->where('category_id', $category_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                            $query->where('category_id', $category_id);
                        });
                    })
                    ->when($machine_part_id, function ($query, $machine_part_id) {
                        $query->with('PurchaseOrderChild', function ($query) use ($machine_part_id) {
                            $query->where('item_id', $machine_part_id);
                            // $query->where('item_id', $machine_part_id); // moeed changes

                        });
                        $query->whereHas('PurchaseOrderChild', function ($query) use ($machine_part_id) {
                            $query->where('item_id', $machine_part_id);
                            // $query->where('item_id', $machine_part_id); // moeed changes

                        });
                    })
                    ->when($part_model_id, function ($query, $part_model_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart', function ($query) use ($part_model_id) {
                            $query->where('machine_part_model_id', $part_model_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart', function ($query) use ($part_model_id) {
                            $query->where('machine_part_model_id', $part_model_id);
                        });
                    })
                    ->when($po_no, function ($q, $po_no) {
                        return $q->where('po_no', $po_no);
                    })
                    ->where('user_id', $user_id) // user_id
                    ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            } elseif ($req->po_type == 2) {
                // dd($store_id);
                $purchaseorderlist = PurchaseOrder::with('supplier', 'store')->where('person_id', null)
                    ->when($po_no, function ($q, $po_no) {
                        return $q->where('po_no', $po_no);
                    })
                    ->when($store_id, function ($q, $store_id) {
                        return $q->where('store_id', $store_id);
                    })

                // ->when($store_name, function ($query) use ($store_name) {
                //     $query->whereHas('store', fn ($q) => $q->where('name', 'LIKE', '%' . $store_name . '%'));
                // })
                // ->when($store_type_id, function ($query) use ($store_type_id) {
                //     $query->whereHas('store', fn ($q) => $q->where('store_type_id', '=', $store_type_id));
                // })
                    ->when($fromPackage, function ($q, $fromPackage) {
                        return $q->where('created_at', '>=', $fromPackage);
                    })
                    ->when($toPackage, function ($q, $toPackage) {
                        return $q->where('created_at', '<=', $toPackage);
                    })

                    ->when($from, function ($q, $from) {
                        return $q->where('request_date', '>=', $from);
                    })
                    ->when($to, function ($q, $to) {
                        return $q->where('request_date', '<=', $to);
                    })
                    ->when($searcField, function ($q, $searcField) {
                        return $q->where('remarks', 'LIKE', '%' . $searcField . '%');
                    })

                    ->when($sub_category_id, function ($query, $sub_category_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id) {
                            $query->where('sub_category_id', $sub_category_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id) {
                            $query->where('sub_category_id', $sub_category_id);
                        });
                    })
                    ->when($type_id, function ($query, $type_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                            $query->where('type_id', $type_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                            $query->where('type_id', $type_id);
                        });
                    })
                    ->when($category_id, function ($query, $category_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                            $query->where('category_id', $category_id);
                        });
                        $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                            $query->where('category_id', $category_id);
                        });
                    })
                    ->when($machine_part_id, function ($query, $machine_part_id) {
                        $query->with('PurchaseOrderChild', function ($query) use ($machine_part_id) {
                            $query->where('item_id', $machine_part_id);
                            // $query->where('item_id', $machine_part_id); // moeed changes

                        });
                        $query->whereHas('PurchaseOrderChild', function ($query) use ($machine_part_id) {
                            $query->where('item_id', $machine_part_id);
                            // $query->where('item_id', $machine_part_id); // moeed changes

                        });
                    })
                    ->when($part_model_id, function ($query, $part_model_id) {
                        $query->with('PurchaseOrderChild.item.machinePartOemPart', function ($query) use ($part_model_id) {
                            $query->where('machine_part_model_id', $part_model_id);
                        });
                    })
                // ->when($type_id, function ($query, $type_id) {
                //     $query->with('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                //         $query->where('type_id', $type_id);
                //     });
                //     $query->whereHas('PurchaseOrderChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                //         $query->where('type_id', $type_id);
                //     });
                // })
                    ->where('user_id', $user_id) // user_id
                    ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            }

            return ['purchaseorderlist' => $purchaseorderlist];
            // return ['purchaseorderlist' => $category_id];

        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getPurchaseReport(Request $req)
    {
        $rules = [
            // Uncomment and add validation rules as needed
            // 'records' => 'required|int',
            // 'pageNo' => 'required|int',
            // 'colName' => 'required|string',
            // 'sort' => 'required|string',
        ];

        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user_id = ($user->role_id == 2) ? $user->id : $user->admin_id;

        try {
            $supplier_id = $req->supplier_id;
            $from = $req->from;
            $to = $req->to;
            $store_id = $req->store_id;
            $item_id = $req->item_id;
            $brand_id = $req->brand_id;

            $purchaseorderlist = PurchaseOrder::with([
                 'purchaseOrderReturn',
    'purchaseorderchild' => function ($q) use ($item_id, $brand_id) {
        if ($item_id) {
            $q->where('item_id', $item_id);
        }

        if ($brand_id) {
            $q->whereHas('item', function ($sub) use ($brand_id) {
                $sub->where('brand_id', $brand_id);
            });
        }
    },
    'store',
    'supplier',
    'purchaseExpenses',
])
->when($supplier_id, fn ($query) => $query->where('person_id', $supplier_id))
->when($from, fn ($query) => $query->where('request_date', '>=', $from))
->when($to, fn ($query) => $query->where('request_date', '<=', $to))
->when($store_id, fn ($query) => $query->where('store_id', $store_id))
->when($brand_id, function ($query) use ($brand_id) {
    $query->whereHas('purchaseorderchild.item', function ($q) use ($brand_id) {
        $q->where('brand_id', $brand_id);
    });
})
->where('user_id', $user_id)
->where('is_received', 1)

                ->get();

            // Add return totals directly to each PurchaseOrder instance
            $purchaseorderlist = $purchaseorderlist->map(function ($purchaseOrder) {
                $purchaseOrder->return_total = $purchaseOrder->purchaseOrderReturn->sum('total');
                $purchaseOrder->return_total_after_tax = $purchaseOrder->purchaseOrderReturn->sum('total_after_tax');
                $purchaseOrder->return_total_after_discount = $purchaseOrder->purchaseOrderReturn->sum('total_after_discount');

                return $purchaseOrder;
            });

            return response()->json([
                'purchaseorderlist' => $purchaseorderlist,
            ]);
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
     * @param  \Illuminate\Http\Request  $po_no
     * @param  \Illuminate\Http\Request  $supplier_id
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $request_date
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $quantity
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = array(
            'po_no' => 'required|int',
            'supplier_id' => 'required|int|exists:people,id',
            'request_date' => 'required',
            'childArray' => 'required|array',
            'childArray.*.item_id' => 'required|int',
            'childArray.*.quantity' => 'required|int',

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
        $store_id = DB::table('stores')->where('user_id', $user_id)->value('id');

        if (!$store_id) {
            return response()->json(['message' => 'Store not found']);
        }
        try {
            DB::transaction(function () use ($request, $user_id, $store_id) {

                $purchaseorder = new PurchaseOrder();
                $purchaseorder->person_id = $request->supplier_id;
                $purchaseorder->po_no = $request->po_no;
                $purchaseorder->remarks = $request->remarks;
                $purchaseorder->store_id = $store_id;
                $purchaseorder->is_pending = 0;
                $purchaseorder->request_date = $request->request_date;
                $purchaseorder->user_id = $user_id; //user id
                $purchaseorder->save();
                $purchase_id = $purchaseorder->id;

                foreach ($request->childArray as $row) {
                    $purchaseChilddata = new PurchaseOrderChild();
                    $purchaseChilddata->purchase_order_id = $purchase_id;
                    $purchaseChilddata->user_id = $user_id; //user id
                    $purchaseChilddata->item_id = $row['item_id'];
                    $purchaseChilddata->quantity = $row['quantity'];
                    $purchaseChilddata->remarks = $row['remarks'];
                    $purchaseChilddata->save();
                }
            });

            return ['status' => "ok", 'message' => 'Purchase order created successfully'];
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
     * Show the form for editing the Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $req)
    {

        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {

            $expenses = Expense::with('expenseType', 'coaAccount')->where('po_id', $req->id)->get();
            $latestdollarrate = PurchaseOrder::where('dollar_rate', '>', 0)->orderby('id', 'desc')->value('dollar_rate');
            $purchaseOrder = PurchaseOrder::with('supplier', 'store')->find($req->id);

            $poChild = PurchaseOrderChild::with(['item', 'rackShelf'])
                ->where('purchase_order_id', $req->id)
                ->get();

            foreach ($poChild as $child) {
                $returnpoid = ReturnedPurchaseOrder::where('purchase_order_id', $req->id)->get();
                $newQty = 0;
                $return_qty = 0;
                if ($returnpoid) {
                    foreach ($returnpoid as $childReturn) {

                        $return_qty = ReturnedPurchaseOrderChild::where('item_id', $child->item_id)
                            ->where('returned_purchase_order_id', $childReturn->id)
                            ->groupBy('item_id')
                            ->sum('returned_quantity');
                        $newQty += $return_qty;
                    }
                    $return_qty = $newQty;
                }

                $itemname[] = array(
                    'id' => $child->id,
                    'item_id' => $child->item_id,
                    'item_name' => $child->item->machinePartOemPart->machinePart->name,
                    'label' => $child->item->name,
                    'quantity' => $child->quantity,
                    // 'received_quantity' => $child->received_quantity - $child->returned_quantity > 0 ? $child->received_quantity - $child->returned_quantity : $child->quantity - $child->returned_quantity,
                    'received_quantity' => $child->received_quantity,
                    'purchase_price' => $child->purchase_price > 0 ? $child->purchase_price : '',
                    // 'purchase_price' => $child->item->purchase_price,
                    'sale_price' => $child->item->sale_price,
                    'amount' => $child->purchase_price * $child->quantity,
                    'remarks' => $child->remarks,
                    'Primary_oem' => $child->item->machinePartOemPart->oemPartNumber->number1,
                    'dollar_price' => $child->item->purchase_dollar_rate,
                    'po_quantity' => $child->received_quantity,
                    'purchased_qty' => $child->received_quantity,
                    'returned_qty' => $return_qty,
                    'returned_quantity' => $return_qty,
                    'remaining_quantity' => ($child->received_quantity) - ($return_qty),
                    'rackShelf' => $child->rackShelf,
                );
            }
            $data = array(
                "id" => $purchaseOrder->id,
                "supplier_id" => $purchaseOrder->person_id,
                "store_id" => $purchaseOrder->store_id,
                "po_no" => $purchaseOrder->po_no,
                "remarks" => $purchaseOrder->remarks,
                "is_received" => $purchaseOrder->is_received,
                "is_approve" => $purchaseOrder->is_approve,
                "is_cancel" => $purchaseOrder->is_cancel,
                "request_date" => $purchaseOrder->request_date,
                "received_date" => $purchaseOrder->received_date,
                "total" => $purchaseOrder->total,
                "discount" => $purchaseOrder->discount,
                "tax" => $purchaseOrder->tax,
                "total_after_tax" => $purchaseOrder->total_after_tax,
                "tax_in_figure" => $purchaseOrder->tax_in_figure,
                "total_after_discount" => $purchaseOrder->total_after_discount,
                "discount" => $purchaseOrder->discount,
                "dollar_rate" => 275,
                "supplier_name" => $purchaseOrder->supplier->name ?? null,
                "store_name" => $purchaseOrder->store->name ?? '',
                "expenseList" => $expenses,
                "dollar_rate" => $latestdollarrate ?? 275,
                "childArray" => $itemname,

            );
            return ['data' => $data];
        } catch (\Exception $e) {
            return $e;
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
            'id' => 'required|int|exists:purchase_orders,id',
            'supplier_id' => 'required|int|exists:people,id',
            'request_date' => 'required',
            'childArray' => 'required|array',
            'childArray.*.item_id' => 'required|int',
            'childArray.*.quantity' => 'required|int',
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

                $purchaseorder = PurchaseOrder::find($request->id);
                $purchaseorder->person_id = $request->supplier_id;
                $purchaseorder->remarks = $request->remarks;
                $purchaseorder->request_date = $request->request_date;
                $purchaseorder->save();

                $poChildIds = [];
                foreach ($request->childArray as $row) {

                    if (isset($row['id'])) {
                        $purchaseChilddata = PurchaseOrderChild::find($row['id']);
                    } else {
                        $purchaseChilddata = new PurchaseOrderChild();
                    }
                    $purchaseChilddata->purchase_order_id = $request->id;
                    $purchaseChilddata->item_id = $row['item_id'];
                    $purchaseChilddata->quantity = $row['quantity'];
                    $purchaseChilddata->remarks = $row['remarks'];
                    $purchaseChilddata->user_id = $user_id; //user id

                    $purchaseChilddata->save();
                    $purchaseChilddata->id;
                    //  return  $poChildIds[] = $row[$purchaseChilddata->id];
                    $poChildIds[] = $purchaseChilddata->id;
                }
                PurchaseOrderChild::where('purchase_order_id', $request->id)->whereNotIn('id', $poChildIds)->delete();
            });

            return ['status' => "ok", 'message' => 'Purchase Order Update successfully'];
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
            'id' => 'required|int|exists:purchase_orders,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($req) {
                PurchaseOrderChild::where('purchase_order_id', $req->id)->delete();
                ItemInventory::where('purchase_order_id', $req->id)->delete();

                $vouchers = Voucher::where('purchase_order_id', $req->id)->get();
                foreach ($vouchers as $voucher) {

                    VoucherTransaction::where('voucher_id', $voucher->id)->delete();

                    $voucher->delete();
                }

                PurchaseOrder::where('id', $req->id)->delete();
            });

            return ['status' => "ok", 'message' => 'Purchase Order deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'Selected Purchase Order is used somewhere in the system: cannot be deleted'];
        }
    }

    /**
     * receiving purchase order
     *
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $received_quantity
     * @param  \Illuminate\Http\Request  $purchase_price
     * @param  \Illuminate\Http\Request  $sale_price
     * @param  \Illuminate\Http\Request  $amount
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    public function receivePurchaseOrder(Request $request)
    {
        // dd("s");
        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
            'store_id' => 'required|int|exists:stores,id',
            'total' => 'required|numeric',
            'discount' => 'required|numeric',
            'tax' => 'required|numeric',
            'total_after_tax' => 'required|numeric',
            'tax_in_figure' => 'required|numeric',
            'total_after_discount' => 'required|numeric',
            'childArray' => 'required|array',
            'childArray.*.id' => 'required|int|exists:purchase_order_children,id',
            'childArray.*.purchase_price' => 'required',

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

        DB::beginTransaction();
        try {

            $groupedItems = [];

            // Group the items by item_id and accumulate quantity and total for each
            foreach ($request->childArray as $row) {
                $itemId = $row['item_id'];

                // Initialize grouped item if it does not exist
                if (!isset($groupedItems[$itemId])) {
                    $groupedItems[$itemId] = [
                        'quantity' => 0,
                        'total' => 0,
                    ];
                }

                $groupedItems[$itemId]['quantity'] += (float) $row['received_quantity'];
                $groupedItems[$itemId]['total'] += (float) $row['amount']  + (float) $row['cost'];
            }

            foreach ($groupedItems as $itemId => $data) {

                $totalSumPurchaseOrder = PurchaseOrderChild::join('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_children.purchase_order_id')
                    ->where('purchase_order_children.item_id', $itemId)
                    ->where('purchase_orders.id', $request->id)
                    ->where('purchase_orders.is_received', 1)
                    ->sum('purchase_order_children.amount');

                $totalQtyPurchaseOrder = PurchaseOrderChild::join('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_children.purchase_order_id')
                    ->where('purchase_order_children.item_id', $itemId)
                    ->where('purchase_orders.id', $request->id)
                    ->where('purchase_orders.is_received', 1)
                    ->sum('purchase_order_children.received_quantity');

                $quantityToAdd = $data['quantity'];
                $totalToAdd = $data['total'];

                $item = ItemOemPartModeles::find($itemId);

                $currentStock = ItemInventory::calculateTotalStockQty($itemId);
                $currentTotalAmount = $item->avg_cost * $currentStock;

                $newStockQty = $currentStock + $quantityToAdd - $totalQtyPurchaseOrder;
                $newTotalAmount = $currentTotalAmount + $totalToAdd - $totalSumPurchaseOrder;

                $newAvgCost = $newStockQty > 0
                ? $newTotalAmount / $newStockQty
                : 0;

                $item->avg_cost = $newAvgCost;
                $item->save();
            }
            // if ($request->is_pending == 0) {
            $purchaseorder = PurchaseOrder::find($request->id);
            $purchaseorder->store_id = $request->store_id;
            $purchaseorder->remarks = $request->remarks;
            $purchaseorder->is_received = 1;
            $purchaseorder->is_pending = 1;
            $purchaseorder->total = $request->total;
            $purchaseorder->discount = $request->discount;
            $purchaseorder->tax = $request->tax;
            $purchaseorder->received_date = $request->received_date;
            $purchaseorder->total_after_tax = $request->total_after_tax;
            $purchaseorder->tax_in_figure = $request->tax_in_figure;
            $purchaseorder->dollar_rate = $request->dollar_rate;
            $purchaseorder->total_after_discount = $request->total_after_discount;
            $purchaseorder->user_id = $user_id; //user id

            $purchaseorder->save();
            $purchaseorder->po_no;
            $po_id = $purchaseorder->id;
            //  Inserting Expenses
            if (!$request->expenseList) {
                $findexpenses = Expense::where('po_id', $request->id)->delete();
            }
            if ($request->expenseList) {
                $sumAmountofExpense = 0;
                $findexpenses = Expense::where('po_id', $request->id)->delete();
                foreach ($request->expenseList as $row) {
                    $expense = new Expense();
                    $expense->po_id = $request->id;
                    $expense->amount = $row['amount'];
                    $expense->description = $row['description'];
                    $expense->expense_type_id = $row['expense_type_id'];
                    $expense->coa_account_id = $row['coa_account_id'];
                    $expense->user_id = $user_id; //user id
                    $expense->save();
                }
            }

            ItemInventory::where('purchase_order_id', $request->id)->delete();

            foreach ($request->childArray as $row) {
                $purchaseChilddata = PurchaseOrderChild::find($row['id']);
                $purchaseChilddata->item_id = $row['item_id'];
                $purchaseChilddata->received_quantity = $row['received_quantity'];
                $purchaseChilddata->purchase_price = $row['purchase_price'];
                $purchaseChilddata->amount = $row['amount'];
                $purchaseChilddata->expense = $row['cost'] ?? 0;
                $purchaseChilddata->unit_expense = $row['costPerItem'] ?? 0;
                $purchaseChilddata->remarks = $row['remarks'];
                $purchaseChilddata->save();

                $purchaseChilddata->purchaseOrder()->associate($purchaseorder);
                $purchaseChilddata->save();

                if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {

                    ItemRackShelf::where('purchase_order_id', $request->id)->delete();

                    foreach ($request->childArray as $childRow) {
                        if (isset($childRow['rackShelf']) && is_array($childRow['rackShelf'])) {
                            foreach ($childRow['rackShelf'] as $rackNumberData) {
                                if (!empty($rackNumberData['rack_id']) && !empty($rackNumberData['shelf_id'])) {
                                    $newRack = new ItemRackShelf([
                                        'store_id' => $request->store_id,
                                        'item_id' => $childRow['item_id'],
                                        'rack_id' => $rackNumberData['rack_id'],
                                        'shelf_id' => $rackNumberData['shelf_id'],
                                        'purchase_order_id' => $request->id,
                                        'quantity' => $rackNumberData['quantity'],
                                        'purchase_order_child_id' => $childRow['id'],
                                        'user_id' => $user_id, //user id

                                    ]);
                                    $newRack->save();
                                    $racksData[] = $newRack;
                                }
                            }
                        }
                    }
                }

                if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {
                    foreach ($row['rackShelf'] as $rackNumberData) {
                        $itemInventory = new ItemInventory();
                        $itemInventory->purchase_order_id = $request->id;
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 1;
                        $itemInventory->quantity_in = $rackNumberData['quantity'];
                        $itemInventory->purchase_price = $row['purchase_price'];
                        $itemInventory->date = $request->received_date;
                        $itemInventory->rack_id = $rackNumberData['rack_id'];
                        $itemInventory->shelf_id = $rackNumberData['shelf_id'];
                        $itemInventory->user_id = $user_id; //user id
                        $itemInventory->save();
                    }
                } else {
                    $itemInventory = new ItemInventory();
                    $itemInventory->purchase_order_id = $request->id;
                    $itemInventory->store_id = $request->store_id;
                    $itemInventory->item_id = $row['item_id'];
                    $itemInventory->inventory_type_id = 1;
                    $itemInventory->quantity_in = $row['received_quantity'];
                    $itemInventory->purchase_price = $row['purchase_price'];
                    $itemInventory->date = $request->received_date;
                    $itemInventory->user_id = $user_id; //user id
                    $itemInventory->save();
                }

                if ($row['sale_price'] > 0) {
                    $itemoemmodels = ItemOemPartModeles::where('id', $row['item_id'])->first();
                    $itemoemmodels->sale_price = $row['sale_price'];
                    $itemoemmodels->save();
                }
                if ($row['purchase_price'] > 0) {
                    $itemoemmodels = ItemOemPartModeles::where('id', $row['item_id'])->first();
                    $itemoemmodels->purchase_price = $row['purchase_price'];
                    $itemoemmodels->purchase_dollar_rate = $row['dollar_price'];
                    $itemoemmodels->save();
                }

                $itemoemmodels = ItemOemPartModeles::find($row['item_id']);
                // $itemoemmodels->avg_price = PurchaseOrderChild::calculateAveragePriceAndStore($row['item_id'], $row['received_quantity'], $row['purchase_price']);
                // $itemoemmodels->avg_expense = PurchaseOrderChild::calculateAverageExpenseAndStore($row['item_id']);
                // $itemoemmodels->avg_cost = PurchaseOrderChild::calculateAverageCostAndStore($row['item_id']);
                $itemoemmodels->save();
            }

            $remarks = " PO: ";
            $supplier_coa_account_id = CoaAccount::where([['person_id', $request->supplier_id]])->value('id');
            $supplier_name = Person::where('id', $request->supplier_id)->value('name');
            $is_post_dated = isset($request->cheque_no) ? 1 : 0;
            $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucher = Voucher::where('purchase_order_id', $po_id)->where('type', 3)->first();
            if ($voucher) {
                $voucher_id = $voucher->id;
                VoucherTransaction::where('voucher_id', $voucher_id)->delete();
                Voucher::where('id', $voucher_id)->delete();
            }
            $voucher = new Voucher();
            $voucher->voucher_no = $newVoucherNo;
            $voucher->date = $request->received_date;
            $voucher->name = "Purchase Order Number: " . $purchaseorder->po_no;
            $voucher->type = 3;
            $voucher->isApproved = 1;
            $voucher->generated_at = $request->received_date;
            $voucher->total_amount = $request->total_after_discount;
            $voucher->purchase_order_id = $request->id;
            $voucher->cheque_no = $request->cheque_no;
            $voucher->user_id = $user_id; //user id
            $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
            $voucher->is_post_dated = $is_post_dated;
            $voucher->is_auto = 1;
            $voucher->save();
            $voucher_id = $voucher->id;
            $debitside = 0;
            $creditside = 0;
            //---------------------Debit Inventory  account ------------------
            foreach ($request->childArray as $row) {
                if ($row['received_quantity'] > 0) {
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = $request->received_date;
                    $voucherTransaction->coa_account_id = 1;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $row['amount'] + ($row['cost'] ?? 0);
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = $remarks . $purchaseorder->po_no . ' ' . "Inventory Added " . ',' . $row['label'] . ', ' . "Qty" . ' ' . $row['received_quantity'] . ' ' . ", Rate" . ' ' . $row['purchase_price'] . ", Cost: " . ' ' . ($row['cost'] ?? 0);
                    $voucherTransaction->save();
                    $debitside += $row['amount'] + ($row['cost'] ?? 0);
                }
            }
            //   --------------Crediting Supplier account --------------------
            $suppliername = CoaAccount::where('id', $supplier_coa_account_id)->value('name');
            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucher_id;
            $voucherTransaction->date = $request->received_date;
            $voucherTransaction->coa_account_id = $supplier_coa_account_id;
            $voucherTransaction->credit = $request->total;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->debit = 0;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->description = $remarks . $purchaseorder->po_no . '  ' . $suppliername . " Liability Created";
            $voucherTransaction->save();
            $creditside += $request->total;

            if ($request->discount > 0) {
                $sumAmountofdiscount = 0;
                //---------------------Crediting cost invenotry discount ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = $request->received_date;
                $voucherTransaction->coa_account_id = 27;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $request->discount;
                $voucherTransaction->description = 'Discount' . '';
                $voucherTransaction->save();
                $creditside += $request->discount;
                //---------------------Debiting supplier discount   ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = $request->received_date;
                $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->discount;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = 'Discount' . '';
                $voucherTransaction->save();
                $sumAmountofdiscount += $request->discount;
                $debitside += $request->discount;
                $updateVoucher = Voucher::find($voucher_id);
                $updateVoucher->total_amount = $debitside;
                $updateVoucher->save();
            }

            if ($request->tax_in_figure > 0) {
                //---------------------Crediting purchase tax payable  tax ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = $request->received_date;
                $voucherTransaction->coa_account_id = 31;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->tax_in_figure;
                $voucherTransaction->description = 'Tax' . '';
                $voucherTransaction->save();
                $creditside += $request->tax_in_figure;
                //---------------------Debiting purchase tax expenses    ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = $request->received_date;
                $voucherTransaction->coa_account_id = 30;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->tax_in_figure;
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = 'Tax' . '';
                $voucherTransaction->save();
                $debitside += $request->tax_in_figure;
            }
            //  Inserting Expenses Vouchers
            if ($request->expenseList) {
                $sumAmountofExpense = 0;
                foreach ($request->expenseList as $row) {
                    $sumAmountofExpense += $row['amount'];
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->date = $request->received_date;
                    $voucherTransaction->coa_account_id = $row['coa_account_id'];
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $row['amount'];
                    $voucherTransaction->description = $row['description'];
                    $voucherTransaction->save();
                    $creditside += $row['amount'];
                }

                if ($creditside != $debitside) {
                    throw new \Exception('debit and credit sides are not equal');
                }
                $updateVoucher = Voucher::find($voucher_id);
                $updateVoucher->total_amount += $sumAmountofExpense;
                $updateVoucher->save();
            }

            DB::commit();
            return ['status' => "ok", 'message' => 'Purchase Order Receive successfully'];
        } catch (\Exception $e) {
            DB::rollback();
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * receiving purchase order
     *
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $received_quantity
     * @param  \Illuminate\Http\Request  $purchase_price
     * @param  \Illuminate\Http\Request  $sale_price
     * @param  \Illuminate\Http\Request  $amount
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    public function receivePurchaseOrderComplete(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
            // 'store_id'     => 'required|int|exists:stores,id',
            // 'total'     => 'required|numeric',
            // 'discount'     => 'required|numeric',
            // 'tax'     => 'required|numeric',
            // 'total_after_tax'     => 'required|numeric',
            // 'tax_in_figure'     => 'required|numeric',
            // 'total_after_discount'     => 'required|numeric',
            // 'childArray'     => 'required|array',
            // 'childArray.*.id'   => 'required|int|exists:purchase_order_children,id',
            // 'childArray.*.received_quantity'  => 'required|int',
            // 'childArray.*.purchase_price'  => 'required',

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

        DB::beginTransaction();
        try {

            // if ($request->is_pending == 0) {
            $purchaseorder = PurchaseOrder::find($request->id);
            if ($purchaseorder->is_completed == 1) {
                throw new \Exception('Po is already initiated');
            }

            $purchaseorder->is_completed = 1;
            $purchaseorder->is_pending = 0;
            $purchaseorder->save();
            $purchaseorder->po_no;
            $po_id = $purchaseorder->id;

            //initating pending invoices
            $pendingpo = PurchaseOrder::where('is_pending', 1)
                ->where('user_id', $user_id) // user_id
                ->count();

            if ($pendingpo < 1) {
                $this->doVouchersForPendingInvoice($po_id);
            }

            DB::commit();
            return ['status' => "ok", 'message' => 'Purchase Order Receive successfully'];
        } catch (\Exception $e) {
            DB::rollback();
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    private function doVouchersForPendingReturnedInvoice($sale_type, $po_id, $invoice_id, $invoice_no, $customer_account_id)
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

        $returnpendinginvoices = ReturnedSale::where('inv_id', $invoice_id)->get();
        if ($returnpendinginvoices) {
            foreach ($returnpendinginvoices as $returnpendinginvoices) {
                $is_post_dated = 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                ///// cost jv voucher
                $voucherInventoryCost = new Voucher();
                $voucherInventoryCost->voucher_no = $newVoucherNo;
                $voucherInventoryCost->date = $returnpendinginvoices->return_date;
                $voucherInventoryCost->name = "Return Voucher Inventory Cost Reversed" . ", Invoice no: " . $invoice_no;
                $voucherInventoryCost->return_invoice_id
                = $returnpendinginvoices->id;
                $voucherInventoryCost->type = 3;
                $voucherInventoryCost->user_id = $user_id; //user id
                $voucherInventoryCost->isApproved = 1;
                $voucherInventoryCost->generated_at = $returnpendinginvoices->return_date;
                $voucherInventoryCost->total_amount = 0;

                $voucherInventoryCost->is_post_dated = $is_post_dated;
                $voucherInventoryCost->is_auto = 1;
                $voucherInventoryCost->save();
                $voucherInvCost_id = $voucherInventoryCost->id;
                $debitside = 0;
                $creditside = 0;
                $totalAvgPrice = 0;
                $price = 0;

                //  Start
                $returnchild = ReturnedSaleChild::where('returned_sales_id', $returnpendinginvoices->id)->get();
                foreach ($returnchild as $row) {

                    $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');

                    $totalAvgPrice += $row['cost'] * $row['quantity'];
                    //   --------------Inventory credit  --------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $returnpendinginvoices->return_date;
                    $voucherTransaction->coa_account_id = 1;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $row['cost'] * $row['quantity'];
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $row['item_id'] . '-' . $itemName . " Inventory Returned. " . '' . "Avg Cost:" . '' . round($row['cost']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $row['cost'] * $row['quantity'];

                    //   --------------Cost debiting --------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $returnpendinginvoices->return_date;
                    $voucherTransaction->coa_account_id = 3;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $row['cost'] * $row['quantity'];
                    $voucherTransaction->description = $row['item_id'] . '-' . $itemName . " Inventory Returned. " . '' . "Avg Cost:" . '' . round($row['cost']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $row['cost'] * $row['quantity'];
                }
                if ($sale_type == 2) {

                    foreach ($returnchild as $list) {

                        //   Unknown error
                        // $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');
                        $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $returnpendinginvoices->return_date;
                        $voucherTransaction->coa_account_id = 4;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->debit = $list['cost'] * $list['quantity'];
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = $list['item_id'] . '-' . $itemName . " Returned . " . '' . "Rate: " . '' . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $list['cost'] * $list['quantity'];

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $returnpendinginvoices->return_date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $list['cost'] * $list['quantity'];
                        $voucherTransaction->description = $list['item_id'] . '-' . $itemName . "Batch NO." . " Returned . " . '' . "Rate: " . '' . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $list['cost'] * $list['quantity'];
                    }
                    if ($returnpendinginvoices->gst > 0) {
                        // $totalCreditSaleVoucher += $request->gst;

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $returnpendinginvoices->return_date;
                        $voucherTransaction->coa_account_id = 23;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $returnpendinginvoices->gst;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = "Gst Reversed" . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $returnpendinginvoices->gst;
                        //---------------------Cash 1 Debit ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $returnpendinginvoices->return_date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = $returnpendinginvoices->gst;
                        $voucherTransaction->description = "Gst Reversed" . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $returnpendinginvoices->gst;
                    }
                }
                // End
                if ($creditside == $debitside) {
                    $updateVoucher = Voucher::find($voucherInvCost_id);
                    $updateVoucher->total_amount = $debitside;
                    $updateVoucher->save();
                    return $voucherInvCost_id;
                } else {
                    throw new \Exception('debit and credit sides are not equal' . $creditside . '/' . $debitside);
                }
            }
        }
    }
    private function vouchersForPendingPos($po_id)
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

        $pending_invoices = Invoice::where('is_pending', 1)->get();

        foreach ($pending_invoices as $invoices) {
            $invoice_id = $invoices->id;
            $sale_type = $invoices->sale_type;
            $invoices->is_pending = 0;
            $invoices->save();
            $invoice_no = 'INO-' . $invoice_id;
            $remarks = " Purchase Order ";
            $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucherInventoryCost = new Voucher();
            $voucherInventoryCost->voucher_no = $newVoucherNo;
            $voucherInventoryCost->date = $invoices->date;
            $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
            $voucherInventoryCost->invoice_id = $invoice_id;
            $voucherInventoryCost->type = 3;
            $voucherInventoryCost->isApproved = 1;
            $voucherInventoryCost->generated_at = $invoices->date;
            $voucherInventoryCost->total_amount = $invoices->total_after_discount;
            $voucherInventoryCost->is_auto = 1;
            $voucherInventoryCost->user_id = $user_id; //user id
            $voucherInventoryCost->save();
            $voucherInvCost_id = $voucherInventoryCost->id;
            $debitside = 0;
            $creditside = 0;
            $totalAvgPrice = 0;
            $price = 0;
            $totalCashSaleVoucher = 0;
            $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->get();
            foreach ($invoicechild as $invoicechild) {
                $item_id = $invoicechild->item_id;
                $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                $itemName = $PurchasePrice->item->name;
                $AvgPrice = PurchaseOrderChild::getStoredAverageCost($item_id);

                $unitexpense = PurchaseOrderChild::where('item_id', $item_id)->where('purchase_order_id', $po_id)->value('unit_expense');
                $updated_avg_price = $AvgPrice;
                // $updated_avg_price = $AvgPrice;
                $quantity = $invoicechild->quantity;
                $invoicechild->cost = $AvgPrice;
                //  $invoicechild->cost = $updated_avg_price;
                $invoicechild->save();

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $invoices->date;
                $voucherTransaction->coa_account_id = 1;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $AvgPrice * $quantity;
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($AvgPrice) . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $AvgPrice * $quantity;

                //   --------------Cost debiting --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $invoices->date;
                $voucherTransaction->coa_account_id = 3;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = $AvgPrice * $quantity;
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($AvgPrice) . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $AvgPrice * $quantity;
                $totalAvgPrice += $updated_avg_price * $quantity;
            }

            $updateVoucher = Voucher::find($voucherInvCost_id);
            $updateVoucher->total_amount = $totalAvgPrice;
            $updateVoucher->save();
            //// receipt voucher revenue
            $customer_account_id = 0;
            if ($invoices->sale_type == 1) {
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
            } else {
                ///////////////////
                $customer_account = CoaAccount::where('person_id', $invoices->customer_id)
                    ->where('coa_sub_group_id', 9)->first();
                $customer_account_id = $customer_account->id;
                $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->get();
                //////////
                foreach ($invoicechild as $invoicechild) {
                    $item_id = $invoicechild->item_id;
                    $price2 = $invoicechild->price;
                    $quantity = $invoicechild->quantity;
                    $price += $price2 * $quantity;
                    $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();

                    $itemName = $PurchasePrice->item->name;
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $price2 * $quantity;
                    $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $price2 * $quantity;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $price2 * $quantity;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $price2 * $quantity;
                }

                if ($invoices->discount > 0) {
                    // $totalCreditSaleVoucher += $request->discount;
                    //---------------------Crediting Customer Account Deu To discount ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $invoices->discount;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $invoices->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $invoices->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $invoices->discount;
                }

                ///////gst voucher
                if ($invoices->gst > 0) {
                    // $totalCreditSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $invoices->gst;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $invoices->gst;
                    //---------------------Cash 1 Debit ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $invoices->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $invoices->gst;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $invoices->gst;
                }
                if ($creditside != $debitside) {
                    throw new \Exception('debit and credit sides are not equal');
                }
                $voucher = Voucher::find($voucherInvCost_id);
                $voucher->total_amount = $invoices->gst + $totalAvgPrice + $price + $invoices->discount;
                $voucher->save();
            }
            //   doing vouchers for pending po's end
            $this->doVouchersForPendingReturnedInvoice($sale_type, $po_id, $invoice_id, $invoice_no, $customer_account_id);
        }
    }

    private function vouchersForPendingNegInventory($po_id)
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

        $pending_invoices2 = Invoice::where('is_pending_neg_inventory', 1)
            ->where('user_id', $user_id) // user_id
            ->get();
        if ($pending_invoices2) {
            foreach ($pending_invoices2 as $invoices) {
                $invoice_id = $invoices->id;
                $sale_type = $invoices->sale_type;
                $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->get();
                foreach ($invoicechild as $invoicechild) {
                    $store_id = $invoices->store_id;
                    $item_id = $invoicechild->item_id;
                    $quantity = $invoicechild->quantity;
                    $isnegativechild = $invoicechild->is_negative;
                    $stock = Iteminventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                        ->where('store_id', $store_id)->where('item_id', $item_id)->first();
                    $available_stock = $stock->quantity;
                    $check = true;
                    if ($isnegativechild == 1) {

                        if ($available_stock + $quantity >= $quantity) {
                            $check = true;
                        } else {
                            $check = false;
                            break;
                        }
                    }
                }

                //doing vouchers if stock is +
                if ($check == true) {
                    $invoice_id = $invoices->id;
                    $invoice_no = 'INO-' . $invoice_id;
                    $remarks = " Purchase Order ";
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucherInventoryCost = new Voucher();
                    $voucherInventoryCost->voucher_no = $newVoucherNo;
                    $voucherInventoryCost->date = $invoices->date;
                    $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
                    $voucherInventoryCost->invoice_id = $invoice_id;
                    $voucherInventoryCost->type = 3;
                    $voucherInventoryCost->isApproved = 1;
                    $voucherInventoryCost->generated_at = $invoices->date;
                    $voucherInventoryCost->total_amount = $invoices->total_after_discount;
                    $voucherInventoryCost->is_auto = 1;
                    $voucherInventoryCost->user_id = $user_id; //user id
                    $voucherInventoryCost->save();
                    $voucherInvCost_id = $voucherInventoryCost->id;
                    $debitside = 0;
                    $creditside = 0;
                    $totalAvgPrice = 0;
                    $price = 0;
                    $totalCashSaleVoucher = 0;
                    $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->get();
                    foreach ($invoicechild as $invoicechild) {
                        $item_id = $invoicechild->item_id;
                        $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                        $itemName = $PurchasePrice->item->name;

                        $AvgPrice = PurchaseOrderChild::getStoredAverageCost($item_id);

                        $updated_avg_price = $AvgPrice;
                        $quantity = $invoicechild->quantity;
                        $invoicechild->cost = $updated_avg_price;
                        $invoicechild->save();

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $invoices->date;
                        $voucherTransaction->coa_account_id = 1;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = $updated_avg_price * $quantity;
                        $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($updated_avg_price) . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $updated_avg_price * $quantity;

                        //   --------------Cost debiting --------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $invoices->date;
                        $voucherTransaction->coa_account_id = 3;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $updated_avg_price * $quantity;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($updated_avg_price) . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $updated_avg_price * $quantity;
                        $totalAvgPrice += $updated_avg_price * $quantity;
                    }

                    $updateVoucher = Voucher::find($voucherInvCost_id);
                    $updateVoucher->total_amount = $totalAvgPrice;
                    $updateVoucher->save();
                    //// receipt voucher revenue

                    if ($invoices->sale_type == 1) {
                    } else {
                        ///////////////////
                        $customer_account = CoaAccount::where('person_id', $invoices->customer_id)
                            ->where('coa_sub_group_id', 9)->first();
                        $customer_account_id = $customer_account->id;

                        //////////
                        //   $invoicechild->item_id;
                        $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->get();
                        foreach ($invoicechild as $invoicechild) {
                            $item_id = $invoicechild->item_id;
                            $price2 = $invoicechild->price;
                            $quantity = $invoicechild->quantity;
                            $price += $price2 * $quantity;
                            $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();

                            $itemName = $PurchasePrice->item->name;
                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = 4;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->credit = $price2 * $quantity;
                            $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $price2 * $quantity;

                            //---------------------Cash 1 Debit ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $price2 * $quantity;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $price2 * $quantity;
                            $invoicechild->is_negative = 0;
                            $invoicechild->save();
                        }

                        if ($invoices->discount > 0) {

                            //---------------------Crediting Customer Account Deu To discount ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->credit = $invoices->discount;
                            $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $invoices->discount;

                            //---------------------Debiting discount Expense   ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = 28;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $invoices->discount;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $invoices->discount;
                        }

                        ///////gst voucher
                        if ($invoices->gst > 0) {
                            // $totalCreditSaleVoucher += $request->gst;

                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = 23;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->credit = $invoices->gst;
                            $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $invoices->gst;
                            //---------------------Cash 1 Debit ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = $invoices->date;
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $invoices->gst;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $invoices->gst;
                        }
                        if ($creditside != $debitside) {
                            throw new \Exception('debit and credit sides are not equal');
                        }
                    }

                    $invoices->is_pending_neg_inventory = 0;

                    $invoices->save();
                }
                $this->doVouchersForPendingReturnedInvoice($sale_type, $po_id, $invoice_id, $invoice_no, $customer_account_id);
            }
        }
    }

    private function doVouchersForPendingInvoice($po_id)
    {
        //doing vouchers for pending po's start
        $this->vouchersForPendingPos($po_id);
        //initiang vouchers for pending invoices due to negative inventory start
        $this->vouchersForPendingNegInventory($po_id);

        //initiang vouchers for pending invoices due to negative inventory end

    }

    public function directPurchaseOrder(Request $request)
    {
        $rules = array(
            'store_id' => 'required|int|exists:stores,id',
            'total' => 'required|numeric',
            'childArray' => 'required|array',
            'childArray.*.received_quantity' => 'required|int',
            'childArray.*.purchase_price' => 'required|int',

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

                $purchaseorder = new PurchaseOrder();
                $purchaseorder->po_no = $request->po_no;
                $purchaseorder->request_date = $request->request_date;
                $purchaseorder->store_id = $request->store_id;
                $purchaseorder->remarks = $request->remarks;
                $purchaseorder->is_received = 1;
                $purchaseorder->is_completed = 1;
                $purchaseorder->is_pending = 0;
                $purchaseorder->user_id = $user_id; //user id
                $purchaseorder->total_after_discount = $request->total;
                $purchaseorder->total = $request->total;
                $purchaseorder->total_after_tax = $request->total;
                $purchaseorder->save();
                $purchase_id = $purchaseorder->id;

                $groupedItems = [];

                // Group the items by item_id and accumulate quantity and total for each
                foreach ($request->childArray as $row) {
                    $itemId = $row['item_id'];

                    // Initialize grouped item if it does not exist
                    if (!isset($groupedItems[$itemId])) {
                        $groupedItems[$itemId] = [
                            'quantity' => 0,
                            'total' => 0,
                        ];
                    }

                    $groupedItems[$itemId]['quantity'] += (float) $row['quantity'];
                    $groupedItems[$itemId]['total'] += (float) $row['amount'];
                }

                foreach ($groupedItems as $itemId => $data) {

                    $quantityToAdd = $data['quantity'];
                    $totalToAdd = $data['total'];

                    $item = ItemOemPartModeles::find($itemId);

                    $currentStock = ItemInventory::calculateTotalStockQty($itemId);
                    $currentTotalAmount = $item->avg_cost * $currentStock;

                    $newStockQty = $currentStock + $quantityToAdd;
                    $newTotalAmount = $currentTotalAmount + $totalToAdd;

                    $newAvgCost = $newStockQty > 0
                    ? $newTotalAmount / $newStockQty
                    : 0;

                    $item->avg_cost = $newAvgCost;
                    $item->save();
                }

                foreach ($request->childArray as $row) {
                    $purchaseChilddata = new PurchaseOrderChild();
                    $purchaseChilddata->purchase_order_id = $purchase_id;
                    $purchaseChilddata->item_id = $row['item_id'];
                    $purchaseChilddata->quantity = $row['quantity'];
                    $purchaseChilddata->remarks = $row['remarks'];
                    $purchaseChilddata->received_quantity = $row['quantity'];
                    $purchaseChilddata->purchase_price = $row['purchase_price'];
                    $purchaseChilddata->amount = $row['amount'];
                    $purchaseChilddata->user_id = $user_id; //user id
                    $purchaseChilddata->save();

                    if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {

                        ItemRackShelf::where('purchase_order_id', $request->id)->delete();

                        foreach ($request->childArray as $childRow) {
                            if (isset($childRow['rackShelf']) && is_array($childRow['rackShelf'])) {
                                foreach ($childRow['rackShelf'] as $rackNumberData) {
                                    if (!empty($rackNumberData['rack_id']) && !empty($rackNumberData['shelf_id'])) {
                                        $newRack = new ItemRackShelf([
                                            'store_id' => $request->store_id,
                                            'item_id' => $childRow['item_id'],
                                            'rack_id' => $rackNumberData['rack_id'],
                                            'shelf_id' => $rackNumberData['shelf_id'],
                                            'purchase_order_id' => $purchase_id,
                                            'quantity' => isset($rackNumberData['quantity']),
                                            'purchase_order_child_id' => $purchaseChilddata->id,
                                        ]);
                                        $newRack->save();
                                        $racksData[] = $newRack;
                                    }
                                }
                            }
                        }
                    }
                    if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {
                        foreach ($row['rackShelf'] as $rackNumberData) {
                            $itemInventory = new ItemInventory();
                            $itemInventory->purchase_order_id = $purchase_id;
                            $itemInventory->store_id = $request->store_id;
                            $itemInventory->item_id = $row['item_id'];
                            $itemInventory->inventory_type_id = 1;
                            $itemInventory->quantity_in = $rackNumberData['quantity'];
                            $itemInventory->purchase_price = $row['purchase_price'];
                            $itemInventory->date = $request->request_date;
                            $itemInventory->rack_id = $rackNumberData['rack_id'];
                            $itemInventory->shelf_id = $rackNumberData['shelf_id'];
                            $itemInventory->user_id = $user_id; //user id
                            $itemInventory->save();
                        }
                    } else {
                        $itemInventory = new ItemInventory();
                        $itemInventory->purchase_order_id = $purchase_id;
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 1;
                        $itemInventory->quantity_in = $row['quantity'];
                        $itemInventory->purchase_price = $row['purchase_price'];
                        $itemInventory->date = $request->request_date;
                        $itemInventory->user_id = $user_id; //user id
                        $itemInventory->save();
                    }

                    if ($row['purchase_price'] > 0) {
                        $itemoemmodels = ItemOemPartModeles::where('id', $row['item_id'])->first();
                        $itemoemmodels->purchase_price = $row['purchase_price'];
                        $itemoemmodels->purchase_dollar_rate = $row['purchase_price'];
                        $itemoemmodels->save();
                    }

                    $itemoemmodels = ItemOemPartModeles::find($row['item_id']);
                    // $itemoemmodels->avg_price = PurchaseOrderChild::calculateAveragePriceAndStore($row['item_id'], $row['received_quantity'], $row['purchase_price']);
                    // $itemoemmodels->avg_expense = PurchaseOrderChild::calculateAverageExpenseAndStore($row['item_id']);
                    // $itemoemmodels->avg_cost = PurchaseOrderChild::calculateAverageCostAndStore($row['item_id']);

                    $itemoemmodels->save();
                }

                $remarks = " Purchase Order ";
                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 1)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
                $voucher = new Voucher();
                $voucher->voucher_no = $newVoucherNo;
                $voucher->date = date('y-m-d');
                $voucher->name = "Direct Purchase PO no: " . $request->po_no;
                $voucher->type = 1;
                $voucher->generated_at = date('y-m-d');
                $voucher->total_amount = $request->total;
                $voucher->purchase_order_id = $purchase_id;
                $voucher->isApproved = 1;
                $voucher->cheque_no = $request->cheque_no;
                $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucher->is_post_dated = $is_post_dated;
                $voucher->is_auto = 1;
                $voucher->user_id = $user_id; //user id

                $voucher->save();
                $voucher_id = $voucher->id;

                //   --------------debiting Supplier account --------------------
                foreach ($request->childArray as $row) {
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 1;
                    $voucherTransaction->debit = $row['amount'];
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $remarks . ' ' . "Inventory Added ";
                    $voucherTransaction->save();
                }
                //---------------------Crediting cash account ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = date('y-m-d');
                $voucherTransaction->coa_account_id = $request->account_id;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->total;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Direct Purchase Order";
                $voucherTransaction->save();

                //initiang vouchers for pending invoices due to negative inventory start
                $po_id = $purchase_id;
                $this->vouchersForPendingNegInventory($po_id);
            });

            return ['status' => "ok", 'message' => 'Purchase Order Received successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getPoDetails(Request $req)
    {

        try {

            $po_id = $req->po_id;
            $purchaseorderlist = PurchaseOrder::with('supplier', 'store', 'purchaseorderchild', 'purchaseOrderReturn', 'purchaseExpenses', 'rackShelf')
                ->where('id', $po_id)
                ->first();
            // dd($purchaseorderlist);
            $coaSubGrouppurchase = 1;
            $coaSubGroupExpence = 7;

            $purchaseorderVoucher = Voucher::with('voucherTransactions', 'voucherType')
                ->where('purchase_order_id', $po_id)
                ->when($coaSubGrouppurchase, function ($query) use ($coaSubGrouppurchase) {
                    $query->whereHas('voucherTransactions', function ($query) use ($coaSubGrouppurchase) {
                        $query->whereHas('coaAccount', function ($query) use ($coaSubGrouppurchase) {
                            $query->whereHas('coaGroup', function ($query) use ($coaSubGrouppurchase) {
                                $query->whereHas('coaSubGroups', function ($query) use ($coaSubGrouppurchase) {
                                    $query->where('id', $coaSubGrouppurchase);
                                });
                            });
                        });
                    });
                })
                ->first();

            $purchaseExpenseVoucher = Voucher::with('voucherTransactions', 'voucherType')
                ->where('purchase_order_id', $po_id)
                ->when($coaSubGroupExpence, function ($query) use ($coaSubGroupExpence) {
                    $query->whereHas('voucherTransactions', function ($query) use ($coaSubGroupExpence) {
                        $query->whereHas('coaAccount', function ($query) use ($coaSubGroupExpence) {
                            $query->whereHas('coaGroup', function ($query) use ($coaSubGroupExpence) {
                                $query->whereHas('coaSubGroups', function ($query) use ($coaSubGroupExpence) {
                                    $query->where('id', $coaSubGroupExpence);
                                });
                            });
                        });
                    });
                })
                ->first();

            return ['purchaseorderlist' => $purchaseorderlist, 'purchaseorderVoucher' => $purchaseorderVoucher, 'purchaseExpenseVoucher' => $purchaseExpenseVoucher];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function AverageOfItemPrice(Request $req)
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
            $item_part_id = $req->item_part_id;
            // $machine_part_id = $req->machine_part_id;
            $sub_category_id = $req->sub_category_id;
            $category_id = $req->category_id;
            $machine_part_id = $req->item_id;
            $PurchasePrice = PurchaseOrderChild::with('item')
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->whereHas('item', function ($qu) use ($machine_part_id) {
                        // $qu->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                        $qu->where('id', $machine_part_id);
                        // });
                    });
                })

                ->when($item_part_id, function ($query, $item_part_id) {
                    $query->whereHas('item', function ($qu) use ($item_part_id) {
                        $qu->where('id', $item_part_id);
                    });
                })
            // ->when($machine_part_id, function ($query, $machine_part_id) {
            //     $query->with('item.machinePartOemPart', function ($query) use ($machine_part_id) {
            //         $query->where('oem_part_no_id', $machine_part_id);
            //     });
            //     $query->whereHas('item.machinePartOemPart', function ($query) use ($machine_part_id) {
            //         $query->where('oem_part_no_id', $machine_part_id);
            //     });
            // })
                ->when($item_part_id, function ($query, $item_part_id) {
                    $query->whereHas('item', function ($qu) use ($item_part_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($item_part_id) {
                            $qu->whereHas('machinePartmodel', function ($qu) use ($item_part_id) {
                                $qu->where('id', $item_part_id);
                            });
                        });
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {
                    $query->whereHas('item', function ($qu) use ($sub_category_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->where('sub_category_id', $sub_category_id);
                            });
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('item', function ($qu) use ($category_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })
            // ->whereNotNull('current_quantity') // moeed changes
            // ->groupby('item_id')->select(DB::raw('SUM(current_quantity_price) / SUM(current_quantity) as AvgPrice'), 'item_id', 'item_id as id', DB::raw('SUM(expense) / SUM(current_quantity) as AvgExpense'), DB::raw('SUM(expense) / SUM(current_quantity) + SUM(current_quantity_price) / SUM(current_quantity) as AvgCost')) // moeed changes
                ->groupby('item_id')
                ->where('user_id', $user_id) // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            // Fallback to AdjustInventoryChild if no results in PurchaseOrderChild
            if ($PurchasePrice->isEmpty()) {
                $PurchasePrice = AdjustInventoryChild::with('item')
                    ->when($item_part_id, function ($query, $item_id) {
                        $query->whereHas('item', function ($qu) use ($item_id) {
                            $qu->where('id', $item_id);
                        });
                    })
                    ->when($category_id, function ($query, $category_id) {
                        $query->whereHas('item', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                    $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                        $qu->where('category_id', $category_id);
                                    });
                                });
                            });
                        });
                    })
                    ->when($sub_category_id, function ($query, $sub_category_id) {
                        $query->whereHas('item', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                    $qu->where('sub_category_id', $sub_category_id);
                                });
                            });
                        });
                    })
                    ->where('user_id', $user_id)
                    ->groupby('item_id')
                    ->where('user_id', $user_id) // user_id
                    ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            }

            return ['PurchasePrice' => $PurchasePrice];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * Show the form for editing the Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editDirectPurchaseOrder(Request $req)
    {

        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
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
            $purchaseOrder = PurchaseOrder::with('store')->find($req->id);

            $poChild = PurchaseOrderChild::with('item')->where('purchase_order_id', $req->id)
                ->where('user_id', $user_id) // user_id
                ->get();
            $childItem = [];
            foreach ($poChild as $child) {
                $itemname[] = array(
                    'id' => $child->id,
                    'item_id' => $child->item_id,
                    'item_name' => $child->item->machinePartOemPart->machinePart->name,
                    'quantity' => $child->quantity,
                    'received_quantity' => $child->received_quantity - $child->returned_quantity > 0 ? $child->received_quantity - $child->returned_quantity : $child->quantity - $child->returned_quantity,
                    'purchase_price' => $child->purchase_price > 0 ? $child->purchase_price : '',
                    'amount' => $child->amount,
                    'returned_quantity' => 0,
                    'remarks' => $child->remarks,
                );
            }
            $data = array(
                "id" => $purchaseOrder->id,

                "store_id" => $purchaseOrder->store_id,
                "po_no" => $purchaseOrder->po_no,
                "remarks" => $purchaseOrder->remarks,
                "is_received" => $purchaseOrder->is_received,
                "is_approve" => $purchaseOrder->is_approve,
                "is_cancel" => $purchaseOrder->is_cancel,
                "request_date" => $purchaseOrder->request_date,
                "total" => $purchaseOrder->total,
                "discount" => $purchaseOrder->discount,
                "tax" => $purchaseOrder->tax,
                "total_after_tax" => $purchaseOrder->total_after_tax,
                "tax_in_figure" => $purchaseOrder->tax_in_figure,
                "total_after_discount" => $purchaseOrder->total_after_discount,
                "discount" => $purchaseOrder->discount,

                "store_name" => $purchaseOrder->store->name ?? '',
                "childArray" => $itemname,
            );
            return ['data' => $data];
        } catch (\Exception $e) {
            return $e;
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * Show the form for editing the Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function ViewPurchaseOrderDetails(Request $req)
    {

        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
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
            $purchaseOrder = PurchaseOrder::with('supplier', 'store', 'purchaseOrderReturn')->find($req->id);
            $purchaseorderreturndetails = $purchaseOrder->purchaseOrderReturn;
            $poChild = PurchaseOrderChild::with('item')->where('purchase_order_id', $req->id)
                ->where('user_id', $user_id) // user_id
                ->get();
            $childItem = [];
            foreach ($poChild as $child) {
                $itemname[] = array(
                    'id' => $child->id,
                    'item_id' => $child->item_id,
                    'item_name' => $child->item->machinePartOemPart->machinePart->name,
                    'quantity' => $child->quantity,
                    'received_quantity' => $child->received_quantity - $child->returned_quantity > 0 ? $child->received_quantity - $child->returned_quantity : $child->quantity - $child->returned_quantity,
                    // 'purchase_price' => $child->purchase_price > 0 ? $child->purchase_price : '',
                    'purchase_price' => $child->item->purchase_price,
                    'sale_price' => $child->item->sale_price,
                    'amount' => $child->amount,
                    'returned_quantity' => 0,
                    'remarks' => $child->remarks,
                );
            }
            $data = array(
                "id" => $purchaseOrder->id,
                "supplier_id" => $purchaseOrder->person_id,
                "store_id" => $purchaseOrder->store_id,
                "po_no" => $purchaseOrder->po_no,
                "remarks" => $purchaseOrder->remarks,
                "is_received" => $purchaseOrder->is_received,
                "is_approve" => $purchaseOrder->is_approve,
                "is_cancel" => $purchaseOrder->is_cancel,
                "request_date" => $purchaseOrder->request_date,
                "total" => $purchaseOrder->total,
                "discount" => $purchaseOrder->discount,
                "tax" => $purchaseOrder->tax,
                "total_after_tax" => $purchaseOrder->total_after_tax,
                "tax_in_figure" => $purchaseOrder->tax_in_figure,
                "total_after_discount" => $purchaseOrder->total_after_discount,
                "discount" => $purchaseOrder->discount,
                "supplier_name" => $purchaseOrder->supplier->name,
                "store_name" => $purchaseOrder->store->name ?? '',
                "childArray" => $itemname,
                "Return_details" => $purchaseorderreturndetails,
            );
            return ['data' => $data];
        } catch (\Exception $e) {
            return $e;
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function getPoChild(Request $req)
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

            $supplier_id = $req->supplier_id;
            $item_id = $req->item_id;
            $po_no = $req->po_no;
            $type_id = $req->type_id;
            $pochild = PurchaseOrderChild::with('PoNo', 'item')
                ->where('user_id', $user_id)
                ->when($supplier_id, function ($query, $supplier_id) {
                    $query->whereHas('PoNo', function ($q) use ($supplier_id) {
                        $q->where('person_id', $supplier_id);
                    });
                })

                ->when($item_id, function ($query, $item_id) {
                    $query->whereHas('item', function ($q) use ($item_id) {
                        $q->where('id', $item_id);
                    });
                })
                ->when($type_id, function ($query, $type_id) {
                    $query->with('item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                    $query->whereHas('item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                })
                ->when($po_no, function ($query, $po_no) {
                    $query->whereHas('PoNo', function ($q) use ($po_no) {
                        $q->where('po_no', $po_no);
                    });
                })
                ->get();

            return ['pochild' => $pochild];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function AverageOfItemPriceHistory(Request $req)
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
            $item_part_id = $req->item_part_id;
            $machine_part_id = $req->machine_part_id;
            $sub_category_id = $req->sub_category_id;
            $category_id = $req->category_id;
            $PurchasePrice = PurchaseOrderChild::with('item')
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->whereHas('item', function ($qu) use ($machine_part_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($machine_part_id) {
                            $qu->where('machine_part_id', $machine_part_id);
                        });
                    });
                })

                ->when($item_part_id, function ($query, $item_part_id) {
                    $query->whereHas('item', function ($qu) use ($item_part_id) {
                        $qu->where('id', $item_part_id);
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {
                    $query->whereHas('item', function ($qu) use ($sub_category_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                $qu->where('sub_category_id', $sub_category_id);
                            });
                        });
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('item', function ($qu) use ($category_id) {
                        $qu->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                            $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                    $qu->where('category_id', $category_id);
                                });
                            });
                        });
                    });
                })
                ->where('user_id', $user_id) // user_id
                ->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id', 'item_id as id', DB::raw('SUM(expense) / SUM(quantity) as AvgExpense'), DB::raw('SUM(expense) / SUM(quantity) + SUM(amount) / SUM(quantity) as AvgCost'))
            // ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
                ->get();
            return ['PurchasePrice' => $PurchasePrice];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function editPurcaseOrderExpense(Request $req)
    {

        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $purchaseOrder = PurchaseOrder::with('purchaseExpenses', 'purchaseorderchild')->where('id', $req->id)->first();

            //  $expenses = Expense::where('po_id', $req->id)->get();
            return ['purchaseOrder' => $purchaseOrder];
        } catch (\Exception $e) {
            return $e;
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function updatePurcaseOrderExpense(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',

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
                $po = PurchaseOrder::where('id', $request->id)->first();
                $pototal = $po->total;
                $exptotal = 0;
                if ($request->expenseList) {

                    foreach ($request->expenseList as $row) {
                        if (isset($row['id'])) {
                            $exp = Expense::find($row['id']);
                        } else {
                            $expense = new Expense();
                        }
                        // $expense = Expense::where('po_id', $request->id)->where('id', $row['id'])->first();
                        $expense->po_id = $request->id;
                        $expense->amount = $row['amount'];
                        $expense->description = $row['description'];
                        $expense->expense_type_id = $row['expense_type_id'];
                        $expense->coa_account_id = $row['account_id'];
                        $expense->save();
                        $exptotal += $row['amount'];
                    }
                    foreach ($request->poChild as $row) {
                        $pochild = PurchaseOrderChild::where('purchase_order_id', $request->id)->where('id', $row['id'])->first();
                        $pochildtotal = $pochild->amount;
                        $quantity = $pochild->received_quantity - $pochild->returned_quantity;
                        $pochild->expense = (((($pochildtotal * 100) / $pototal) * $exptotal) / 100);
                        $pochild->unit_expense = (((($pochildtotal * 100) / $pototal) * $exptotal) / 100) / $quantity;
                        $pochild->save();
                    }
                }
                $voucher = Voucher::where('purchase_order_id', $request->id)->where('type', 3)->first();
                $voucher_id = $voucher->id;
                VoucherTransaction::where('voucher_id', $voucher_id)->delete();
                Voucher::where('id', $voucher_id)->delete();

                $remarks = " PO: ";
                $supplier_coa_account_id = CoaAccount::where([['person_id', $request->supplier_id]])->value('id');
                $supplier_name = Person::where('id', $request->supplier_id)->value('name');
                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucher = new Voucher();
                $voucher->voucher_no = $newVoucherNo;
                $voucher->date = date('y-m-d');
                $voucher->name = "Purchase Order Number: " . $po->po_no;
                $voucher->type = 3;
                $voucher->isApproved = 1;
                $voucher->generated_at = date('y-m-d');
                $voucher->total_amount = $request->total_after_discount;
                $voucher->purchase_order_id = $request->id;
                $voucher->cheque_no = $request->cheque_no;
                $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucher->is_post_dated = $is_post_dated;
                $voucher->is_auto = 1;
                $voucher->user_id = $user_id; //user id

                $voucher->save();
                $voucher_id = $voucher->id;
                $debitside = 0;
                $creditside = 0;
                //---------------------Debit Inventory  account ------------------
                foreach ($request->childArray as $row) {

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 1;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $row['amount'] + $row['cost'] ?? 0;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $remarks . $po->po_no . ' ' . "Inventory Added " . ',' . $row['label'] . ', ' . "Qty" . ' ' . $row['received_quantity'] . ' ' . ", Rate" . ' ' . $row['purchase_price'] . ", Cost: " . ' ' . $row['cost'] ?? 0;
                    $voucherTransaction->save();
                    $debitside += $row['amount'] + $row['cost'] ?? 0;
                }
                //   --------------Crediting Supplier account --------------------
                $suppliername = CoaAccount::where('id', $supplier_coa_account_id)->value('name');
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucher_id;
                $voucherTransaction->date = date('y-m-d');
                $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                $voucherTransaction->credit = $request->total;
                $voucherTransaction->debit = 0;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = $remarks . $po->po_no . '  ' . $suppliername . " Liability Created";
                $voucherTransaction->save();
                $creditside += $request->total;

                if ($request->discount > 0) {
                    $sumAmountofdiscount = 0;
                    //---------------------Crediting cost invenotry discount ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 27;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->discount;
                    $voucherTransaction->description = 'Discount' . '';
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $creditside += $request->discount;
                    //---------------------Debiting supplier discount   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = 'Discount' . '';
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $sumAmountofdiscount += $request->discount;
                    $debitside += $request->discount;
                    $updateVoucher = Voucher::find($voucher_id);
                    $updateVoucher->total_amount = $debitside;
                    $updateVoucher->save();
                }

                if ($request->tax_in_figure > 0) {

                    //---------------------Crediting purchase tax payable  tax ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 31;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->tax_in_figure;
                    $voucherTransaction->description = 'Tax' . '';
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $creditside += $request->tax_in_figure;
                    //---------------------Debiting purchase tax expenses    ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 30;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->tax_in_figure;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = 'Tax' . '';
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $debitside += $request->tax_in_figure;
                }

                ///////    //////expense
                if ($request->expenseList) {

                    $sumAmountofExpense = 0;
                    //---------------------Crediting Expense liabilities Accounts ---------------

                    $sumAmountofExpense += $row['amount'];
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = $row['account_id'];
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $row['amount'];
                    $voucherTransaction->description = $row['description'];
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $creditside += $row['amount'];
                }
                if ($creditside != $debitside) {
                    throw new \Exception('debit and credit sides are not equal');
                }
                $updateVoucher = Voucher::find($voucher_id);
                $updateVoucher->total_amount += $sumAmountofExpense;
                $updateVoucher->save();
            });

            return ['status' => "ok", 'message' => 'Purchase Order expense Update successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function initiatePendingpo(Request $request)
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
                $pendingpo = PurchaseOrder::where('is_pending', 1)->get();
                foreach ($pendingpo as $pendingpo) {
                    $po_id = $pendingpo->id;
                    $remarks = " PO: ";
                    $supplier_coa_account_id = CoaAccount::where([['person_id', $pendingpo->person_id]])->value('id');
                    $supplier_name = Person::where('id', $request->supplier_id)->value('name');
                    $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucher = new Voucher();
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->date = date('y-m-d');
                    $voucher->name = "Purchase Order Number: " . $pendingpo->po_no;
                    $voucher->type = 3;
                    $voucher->isApproved = 1;
                    $voucher->generated_at = date('y-m-d');
                    $voucher->total_amount = $pendingpo->total_after_discount;
                    $voucher->purchase_order_id = $po_id;
                    $voucher->cheque_no = $request->cheque_no;
                    $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
                    $voucher->is_post_dated = $is_post_dated;
                    $voucher->is_auto = 1;
                    $voucher->user_id = $user_id; //user id
                    $voucher->save();
                    $voucher_id = $voucher->id;
                    $debitside = 0;
                    $creditside = 0;
                    $pochild = PurchaseOrderChild::where('purchase_order_id', $po_id)->get();
                    foreach ($pochild as $pochild) {
                        $item_id = $pochild->item_id;
                        $item = ItemOemPartModeles::where('id', $item_id)->first();
                        $label = $item->name;
                        //---------------------Debit Inventory  account ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 1;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $pochild->amount + $pochild->expense;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $remarks . $pendingpo->po_no . ' ' . "Inventory Added " . ',' . $label . ', ' . "Qty" . ' ' . $pochild->received_quantity . ' ' . ", Rate" . ' ' . $pochild->purchase_price . ", Cost: " . ' ' . $pochild->expense;
                        $voucherTransaction->save();
                        $debitside += $pochild->amount + $pochild->expense;
                    }
                    //   --------------Crediting Supplier account --------------------
                    $suppliername = CoaAccount::where('id', $supplier_coa_account_id)->value('name');
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                    $voucherTransaction->credit = $pendingpo->total;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $remarks . $pendingpo->po_no . '  ' . $suppliername . " Liability Created";
                    $voucherTransaction->save();
                    $creditside += $pendingpo->total;
                    if ($pendingpo->discount > 0) {
                        $sumAmountofdiscount = 0;
                        //---------------------Crediting cost invenotry discount ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 27;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $pendingpo->discount;
                        $voucherTransaction->description = 'Discount' . '';
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->save();
                        $creditside += $pendingpo->discount;
                        //---------------------Debiting supplier discount   ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $pendingpo->discount;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = 'Discount' . '';
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->save();
                        $sumAmountofdiscount += $pendingpo->discount;
                        $debitside += $pendingpo->discount;
                        $updateVoucher = Voucher::find($voucher_id);
                        $updateVoucher->total_amount = $debitside;
                        $updateVoucher->save();
                    }

                    if ($pendingpo->tax_in_figure > 0) {
                        //---------------------Crediting purchase tax payable  tax ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 31;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $pendingpo->tax_in_figure;
                        $voucherTransaction->description = 'Tax' . '';
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->save();
                        $creditside += $pendingpo->tax_in_figure;
                        //---------------------Debiting purchase tax expenses    ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 30;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $pendingpo->tax_in_figure;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = 'Tax' . '';
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->save();
                        $debitside += $pendingpo->tax_in_figure;
                    }

                    ///////    //////expense

                    $expense = Expense::where('po_id', $po_id)->get();
                    if ($expense) {
                        $sumAmountofExpense = 0;
                        foreach ($expense as $row) {

                            //---------------------Crediting Expense liabilities Accounts ---------------
                            $sumAmountofExpense += $row->amount;
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->voucher_id = $voucher_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $row->coa_account_id;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $row->amount;
                            $voucherTransaction->user_id = $user_id; //user id
                            $voucherTransaction->description = $row->description;
                            $voucherTransaction->save();
                            $creditside += $row->amount;
                        }
                        if ($creditside != $debitside) {
                            throw new \Exception('debit and credit sides are not equal');
                        }
                        $updateVoucher = Voucher::find($voucher_id);
                        $updateVoucher->total_amount += $sumAmountofExpense;
                        $updateVoucher->save();
                    }
                }
            });
            return ['status' => "ok", 'message' => 'Purchase Order Received successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getPoNoDropdown(Request $req)
    {
        $store_type_id = $req->store_type_id;
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
            $po_no_dropdown = PurchaseOrder::
                // when($store_type_id, function ($q, $store_type_id) {
                //     return $q->where('store_type_id', $store_type_id);
                // })
                where('user_id', $user_id) // user_id
                ->orderBy('id')->get();
            return ['status' => 'ok', 'po_no_dropdown' => $po_no_dropdown];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function hasNonEmptyRackNumbers($rackNumbers)
    {
        foreach ($rackNumbers as $rackNumber) {
            if (!empty($rackNumber['rack_number']) || !empty($rackNumber['quantity']) || !empty($rackNumber['shelf_number'])) {
                return true;
            }
        }
        return false;
    }
}
