<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CoaAccount;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\InvoiceChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\Land;
use App\Models\MachinePart;
use App\Models\MachinePartModel;
use App\Models\Person;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderChild;
use App\Models\ReturnedSale;
use App\Models\ReturnedSaleChild;
use App\Models\SaleRackShelf;
use App\Models\Store;
use App\Models\StoreType;
use App\Models\Subcategory;
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
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

        try {
            $walk_in_customer_name = $req->walk_in_customer_name;
            // $store_id = $req->store_id;
            $machine_part_id = $req->item_id;
            // $store_type_id = $req->store_type_id;
            $sub_category_id = $req->sub_category_id;
            $category_id = $req->category_id;
            $part_model_id = $req->part_model_id;
            $customer_id = $req->customer_id;
            $invoice_no = $req->invoice_no;
            $type_id = $req->type_id;

            $invoices = Invoice::with('store', 'customer', 'invoiceChild')
                ->where('user_id', $user_id) // user_id
                ->when($sub_category_id, function ($query, $sub_category_id) use ($part_model_id) {
                    $query->with('invoiceChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id) {
                        $query->where('sub_category_id', $sub_category_id);
                    });
                    $query->whereHas('invoiceChild.item.machinePartOemPart.machinePart', function ($query) use ($sub_category_id, $part_model_id) {
                        $query->where('sub_category_id', $sub_category_id)
                            ->where('machine_part_model_id', $part_model_id);
                    });
                })
                ->when($type_id, function ($query, $type_id) {
                    $query->with('invoiceChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                    $query->whereHas('invoiceChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->with('invoiceChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                        $query->where('category_id', $category_id);
                    });
                    $query->whereHas('invoiceChild.item.machinePartOemPart.machinePart.subcategories', function ($query) use ($category_id) {
                        $query->where('category_id', $category_id);
                    });
                })
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->with('invoiceChild.item', function ($query) use ($machine_part_id) {
                        $query->where('id', $machine_part_id);
                    });
                    $query->whereHas('invoiceChild.item', function ($query) use ($machine_part_id) {
                        $query->where('id', $machine_part_id);
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {
                    $query->with('invoiceChild.item.machinePartOemPart', function ($query) use ($part_model_id) {
                        $query->where('machine_part_model_id', $part_model_id);
                    });
                    $query->whereHas('invoiceChild.item.machinePartOemPart', function ($query) use ($part_model_id) {
                        $query->where('machine_part_model_id', $part_model_id);
                    });
                })
                ->when($walk_in_customer_name, function ($q, $walk_in_customer_name) {
                    return $q->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
                })
                ->when($store_id, function ($q, $store_id) {
                    return $q->where('store_id', $store_id);
                })

                ->when($invoice_no, function ($q, $invoice_no) {
                    return $q->where('invoice_no', 'LIKE', '%' . $invoice_no . '%');
                })
                ->when($customer_id, function ($q, $customer_id) {
                    return $q->where('customer_id', $customer_id);
                })

                ->when($fromPackage, function ($q, $from) {
                    return $q->where('created_at', '>=', $from);
                })
                ->when($toPackage, function ($q, $to) {
                    return $q->where('created_at', '<=', $to);
                })

                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['invoices' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
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
    public function testing()
    {
        $itemId = 3;
        $store_id = 1;
        $PurchasePrice = PurchaseOrderChild::getAveragePriceByItemId($itemId, $store_id);
        return $PurchasePrice;
        $storeId = 1;
        $itemId = 4;
        return $stockQuantity = ItemInventory::getStockQuantity($storeId, $itemId);
    }
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Request customer_id
     *@param \Illuminate\Http\Request walk_in_customer_name
     *@param \Illuminate\Http\Request remarks
     *@param \Illuminate\Http\Request total_amount
     *@param \Illuminate\Http\Request discount
     *@param \Illuminate\Http\Request total_after_discount
     *@param \Illuminate\Http\Request amount_received
     *@param \Illuminate\Http\Request date
     *@param \Illuminate\Http\Request list
     *@param \Illuminate\Http\Request item_id
     *@param \Illuminate\Http\Request qty
     *@param  \Illuminate\Http\Request price
     *@return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
        // return response()->json($request->all());

        $rules = array(
            'date' => 'required',
            'store_id' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'total_after_discount' => 'required|numeric',
            'list' => 'required|array',
            'list.*.item_id' => 'required|numeric',
            'list.*.qty' => 'required|numeric',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->list as $row) {
                    $itemRacksChecked = false;

                    // Check if 'item_racks' is set and is an array
                    if (isset($row['item_racks']) && is_array($row['item_racks'])) {
                        // Loop through each rack in 'item_racks'
                        foreach ($row['item_racks'] as $rack) {
                            if (isset($rack['checked']) && $rack['checked']) {
                                $itemRacksChecked = true;
                                break; // Exit loop if a checked rack is found
                            }
                        }
                    }

                    // Check if 'no_rack_shelf' is set and if 'checked' is true
                    $noRackShelfChecked = isset($row['no_rack_shelf']['checked']) ? $row['no_rack_shelf']['checked'] : false;

                    // Apply condition: Show error if no racks are checked and no_rack_shelf is also not checked
                    if (!$itemRacksChecked && !$noRackShelfChecked) {
                        throw new \Exception('- Please select any one of stock.');
                    }
                }

                $check = 0;
                $itemName = '';

                // Checking if sale quantity is greater than stock quantity and if negative inventory is allowed
                foreach ($request->list as $row) {
                    $stock_quantity = ItemInventory::where('item_id', $row['item_id'])
                        ->where('store_id', $request->store_id)
                        ->groupBy('item_id', 'store_id')
                        ->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                        ->value('quantity');

                    if ($row['qty'] > $stock_quantity) {
                        $check = 1;
                        $itemName = $row['item_id'];
                    }
                }

                if ($request->isNegative == 0 && $check == 1) {
                    throw new \Exception($itemName . ' Item Qty Not available in stock');
                }

                // Invoice for negative inventory
                if ($request->isNegative == 1 && $check == 1) {
                    $this->negativeInventoryInvoice($request);
                } else if ($check == 0) {
                    // Handling pending POs
                    $pendingpo = PurchaseOrder::where('is_pending', 1)->count();
                    if ($pendingpo > 0) {
                        $this->considerPendingPosItemsforVouchers($request);
                    }

                    // Normal invoice if there are no pending POs
                    if ($pendingpo < 1) {
                        $this->normalInvoiceWithVouchers($request);
                    }
                }
            });

            return ['status' => "ok", 'message' => 'Invoice Stored Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    private function normalInvoiceWithVouchers($request)
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

        $totalCashSaleVoucher = 0;
        $invoice = new Invoice();
        if ($request->sale_type == 2) {
            $invoice->customer_id = $request->customer_id;
        }

        $invoice->delivered_to = $request->delivered_to;
        if ($request->sale_type == 1) {
            $invoice->walk_in_customer_name = $request->walk_in_customer_name;
        }

        $invoice->remarks = $request->remarks;
        $invoice->store_id = $request->store_id;
        $invoice->total_amount = $request->total_amount;
        $invoice->discount = $request->discount ?? 0;
        $invoice->total_after_discount = $request->total_after_discount;
        $invoice->received_amount = $request->amount_received;
        $invoice->bank_received_amount = $request->bank_received_amount;
        $invoice->date = $request->date;
        $invoice->tax_type = $request->tax_type;
        $invoice->sale_type = $request->sale_type;
        $invoice->account_id = $request->account_id;
        $invoice->bank_account_id = $request->bank_account_id;
        $invoice->gst = $request->gst;
        $invoice->user_id = $user_id; // userid

        $invoice->total_after_gst = $request->total_after_gst;
        $invoice->save();
        $invoice_id = $invoice->id;
        // $invoice_no = 'INO-' . $invoice_id;
        // Invoice::where('id', '=', $invoice_id)->where('user_id', $user_id)->update(['invoice_no' => $invoice_no]);
        $invoice_no = $invoice->invoice_no;

        $remarks = " Purchase Order ";
        $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
        $customer_id = Person::where('id', $request->customer_id)->value('name');
        $is_post_dated = isset($request->cheque_no) ? 1 : 0;
        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

        ///// cost jv voucher
        $voucherInventoryCost = new Voucher();
        $voucherInventoryCost->voucher_no = $newVoucherNo;
        $voucherInventoryCost->date = $request->date;
        $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
        $voucherInventoryCost->invoice_id = $invoice_id;
        $voucherInventoryCost->type = 3;
        $voucherInventoryCost->isApproved = 1;
        $voucherInventoryCost->generated_at = $request->date;
        $voucherInventoryCost->total_amount = $request->total_after_discount;
        $voucherInventoryCost->cheque_no = $request->cheque_no;
        $voucherInventoryCost->cheque_date = Land::changeDateFormat($request->cheque_date);
        $voucherInventoryCost->is_post_dated = $is_post_dated;
        $voucherInventoryCost->is_auto = 1;
        $voucherInventoryCost->user_id = $user_id; // userid

        $voucherInventoryCost->save();
        $voucherInvCost_id = $voucherInventoryCost->id;
        $debitside = 0;
        $creditside = 0;
        $totalAvgPrice = 0;
        $price = 0;

        foreach ($request->list as $row) {
            // $itemoem = ItemOemPartModeles::where('id', $row['item_id'])->first();
            // $itemoem->last_sale_price = $row['price'];
            // $itemoem->user_id = $user_id; // userid
            // $itemoem->save();

            $invoiceChild = new InvoiceChild();
            $invoiceChild->invoice_id = $invoice_id;
            $invoiceChild->item_id = $row['item_id'];
            $invoiceChild->quantity = $row['qty'];
            $invoiceChild->price = $row['price'];
            $invoiceChild->user_id = $user_id; //user_id
            $invoiceChild->cost = $row['avg_price'];
            $invoiceChild->save();

            $allRacksUnchecked = true;
            foreach ($row['item_racks'] as $rackData) {
                if ($rackData['checked'] == "true") {
                    $allRacksUnchecked = false;
                    break; // Exit loop early since at least one rack is checked
                }
            }

            $totalQty = $row['qty'];

            // Case 1: When all racks are unchecked
            if ($allRacksUnchecked) {
                // Store the entire quantity in ItemInventory
                $stockChildData = new ItemInventory();
                $stockChildData->inventory_type_id = 8;
                $stockChildData->item_id = $row['item_id'];
                $stockChildData->invoice_id = $invoice_id;
                $stockChildData->purchase_price = $row['price'];
                $stockChildData->store_id = $request->store_id;
                $stockChildData->quantity_out = $totalQty;
                $stockChildData->date = $request->date;
                $stockChildData->user_id = $user_id; // userid
                $stockChildData->save();
            } else {
                if (isset($row['no_rack_shelf']['checked']) && $row['no_rack_shelf']['checked'] == "true") {
                    $inventoryQty = ItemInventory::where('item_id', $row['item_id'])
                        ->where('store_id', $request->store_id)
                        ->whereNull('rack_id')
                        ->whereNull('shelf_id')
                        ->sum('quantity_in') -
                    ItemInventory::where('item_id', $row['item_id'])
                        ->where('store_id', $request->store_id)
                        ->whereNull('rack_id')
                        ->whereNull('shelf_id')
                        ->sum('quantity_out');

                    $quantityToAdd = min($totalQty, $inventoryQty);
                    $totalQty -= $quantityToAdd;

                    // Store the quantity in ItemInventory
                    $stockChildData = new ItemInventory();
                    $stockChildData->inventory_type_id = 8;
                    $stockChildData->item_id = $row['item_id'];
                    $stockChildData->purchase_price = $row['price'];
                    $stockChildData->invoice_id = $invoice_id;
                    $stockChildData->store_id = $request->store_id;
                    $stockChildData->quantity_out = $quantityToAdd;
                    $stockChildData->date = $request->date;
                    $stockChildData->user_id = $user_id; // userid
                    $stockChildData->save();
                }

                // Case 2: When at least one rack is checked
                SaleRackShelf::where('invoice_id', $request->id)->delete();

                foreach ($row['item_racks'] as $rackData) {
                    if ($rackData['checked'] == "true") {
                        if ($totalQty > 0) {
                            // Determine the quantity to subtract from the checked racks
                            $quantityToAdd = min($totalQty, $rackData['quantity']);
                            $totalQty -= $quantityToAdd;
                            $rackData['quantity'] -= $quantityToAdd;

                            // Store the quantity in SaleRackShelf
                            SaleRackShelf::create([
                                'invoice_id' => $invoice_id,
                                'user_id' => $user_id,
                                'store_id' => $request->store_id,
                                'item_id' => $row['item_id'],
                                'rack_id' => $rackData['rack_id'],
                                'shelf_id' => $rackData['shelf_id'],
                                'quantity' => $quantityToAdd,
                                'invoice_child_id' => $invoiceChild->id,
                                'checked' => $rackData['checked'],
                            ]);

                            // Subtract from ItemInventory after rackData
                            $stockChildData = new ItemInventory();
                            $stockChildData->inventory_type_id = 8;
                            $stockChildData->item_id = $row['item_id'];
                            $stockChildData->invoice_id = $invoice_id;
                            $stockChildData->purchase_price = $row['price'];
                            $stockChildData->rack_id = $rackData['rack_id'];
                            $stockChildData->shelf_id = $rackData['shelf_id'];
                            $stockChildData->store_id = $request->store_id;
                            $stockChildData->quantity_out = $quantityToAdd;
                            $stockChildData->date = $request->date;
                            $stockChildData->user_id = $user_id; // userid
                            $stockChildData->save();
                        }
                    }
                }
            }

            $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');

            $totalAvgPrice += $row['avg_price'] * $row['qty'];
            //   --------------Inventory credit  --------------------

            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherInvCost_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = 1;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->user_id = $user_id; //userid
            $voucherTransaction->credit = $row['avg_price'] * $row['qty'];
            $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['qty'] . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $creditside += $row['avg_price'] * $row['qty'];

            //   --------------Cost debiting --------------------

            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherInvCost_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = 3;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->user_id = $user_id; // userid
            $voucherTransaction->debit = $row['avg_price'] * $row['qty'];
            $voucherTransaction->credit = 0;
            $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['qty'] . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $debitside += $row['avg_price'] * $row['qty'];
        }

        $updateVoucher = Voucher::find($voucherInvCost_id);
        $updateVoucher->total_amount = $totalAvgPrice;
        $updateVoucher->user_id = $user_id; // userid

        $updateVoucher->save();

        //// receipt voucher revenue
        if ($request->sale_type == 1) {
            $is_post_dated = isset($request->cheque_no) ? 1 : 0;
            $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucherRevenueGen = new Voucher();
            $voucherRevenueGen->voucher_no = $newVoucherNo;
            $voucherRevenueGen->date = $request->date;
            $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
            $voucherRevenueGen->invoice_id = $invoice_id;
            $voucherRevenueGen->type = 2;
            $voucherRevenueGen->isApproved = 1;
            $voucherRevenueGen->generated_at = $request->date;
            $voucherRevenueGen->total_amount = $request->total_after_discount;
            $voucherRevenueGen->cheque_no = $request->cheque_no;
            $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
            $voucherRevenueGen->is_post_dated = $is_post_dated;
            $voucherRevenueGen->is_auto = 1;
            $voucherRevenueGen->user_id = $user_id; // userid
            $voucherRevenueGen->save();
            $voucherRevenueGenid = $voucherRevenueGen->id;
            $voucherRevGen_id = $voucherRevenueGen->id;
            foreach ($request->list as $list) {

                $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 4;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $list['price'] * $list['qty'];
                $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $list['price'] * $list['qty'];
            }
            $totalCashSaleVoucher += $request->amount_received;

            if ($request->account_id != '' && $request->amount_received > 0) {
                //---------------------Cash 1 Debit ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->amount_received;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                $voucherTransaction->save();
                $debitside += $request->amount_received;
            }
            if ($request->bank_amount_received > 0 && $request->bank_account_id != '') {
                //---------------------Bank Debit ------------------
                $totalCashSaleVoucher += $request->bank_amount_received;
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->bank_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->bank_amount_received;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received By bank";
                $voucherTransaction->save();
                $debitside += $request->bank_amount_received;
            }
            ///////gst voucher
            if ($request->gst > 0) {
                //   $totalCashSaleVoucher += $request->gst;

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 23;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $request->gst;
                $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->gst;
                //---------------------Cash 1 Debit ------------------
                // $voucherTransaction = new VoucherTransaction();
                // $voucherTransaction->voucher_id = $voucherRevGen_id;
                // $voucherTransaction->date = $request->date;
                // $voucherTransaction->coa_account_id = $request->account_id;
                // $voucherTransaction->is_approved = 1;
                // $voucherTransaction->debit = $request->gst;
                // $voucherTransaction->credit = 0;
                // $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                // $voucherTransaction->save();
            }
            if ($request->discount > 0) {
                $totalCashSaleVoucher += $request->discount;

                //---------------------Debiting discount Expense   ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 28;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->discount;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->discount;
            }
            $voucher = Voucher::find($voucherRevenueGenid);
            $voucher->total_amount = $totalCashSaleVoucher;

            $voucher->save();
        } else {
            ///////////////////
            $customer_account = CoaAccount::where('person_id', $request->customer_id)
                ->where('coa_sub_group_id', 9)
                ->first();
            $customer_account_id = $customer_account->id;

            //////////
            foreach ($request->list as $list) {
                $price += $list['price'] * $list['qty'];

                $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 4;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $list['price'] * $list['qty'];
                $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $list['price'] * $list['qty'];
            }
                //---------------------Cash 1 Debit ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->total_amount;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->total_amount;
            

            if ($request->discount > 0) {
                // $totalCreditSaleVoucher += $request->discount;
                //---------------------Crediting Customer Account Deu To discount ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $request->discount;
                $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->discount;

                //---------------------Debiting discount Expense   ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 28;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->discount;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->discount;
            }
            if (($request->amount_received) + ($request->bank_amount_received) > 0) {
                // $totalCashSaleVoucher += $request->amount_received;
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherRevenueGen = new Voucher();
                $voucherRevenueGen->voucher_no = $newVoucherNo;
                $voucherRevenueGen->date = $request->date;
                $voucherRevenueGen->name = "Customer Amount Received ";
                $voucherRevenueGen->invoice_id = $invoice_id;
                $voucherRevenueGen->type = 2;
                $voucherRevenueGen->isApproved = 1;
                $voucherRevenueGen->generated_at = $request->date;
                $voucherRevenueGen->total_amount = $request->amount_received + $request->bank_amount_received;
                $voucherRevenueGen->cheque_no = $request->cheque_no;
                $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucherRevenueGen->is_post_dated = $is_post_dated;
                $voucherRevenueGen->user_id = $user_id; //user id
                $voucherRevenueGen->is_auto = 1;
                $voucherRevenueGen->save();
                $voucherRevGen_id = $voucherRevenueGen->id;

                if ($request->amount_received > 0) {

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->amount_received;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->amount_received;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->amount_received;
                }
                ///bank
                if ($request->bank_amount_received > 0) {
                    // $totalCashSaleVoucher += $request->amount_received;
                    // $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                    // $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    // $voucherRevenueGen = new Voucher();
                    // $voucherRevenueGen->voucher_no = $newVoucherNo;
                    // $voucherRevenueGen->date = $request->date;
                    // $voucherRevenueGen->name =  "Customer Amount Received bank";
                    // $voucherRevenueGen->invoice_id = $invoice_id;
                    // $voucherRevenueGen->type = 2;
                    // $voucherRevenueGen->isApproved = 1;
                    // $voucherRevenueGen->generated_at = $request->date;
                    // $voucherRevenueGen->total_amount = $request->bank_amount_received;
                    // $voucherRevenueGen->cheque_no = $request->cheque_no;
                    // $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                    // $voucherRevenueGen->is_post_dated = $is_post_dated;
                    //$voucherRevenueGen->is_auto = 1;

                    // $voucherRevenueGen->save();
                    // $voucherRevGen_id = $voucherRevenueGen->id;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->bank_amount_received;
                    $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->bank_amount_received;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->bank_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->bank_amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->bank_amount_received;
                }
            }
            ///////gst voucher
            if ($request->gst > 0) {
                // $totalCreditSaleVoucher += $request->gst;

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 23;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->gst;
                $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->save();
                $creditside += $request->gst;
                //---------------------Cash 1 Debit ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->gst;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->gst;
            }
            if ($creditside != $debitside) {
                throw new \Exception('debit and credit sides are not equal');
            }
            $voucher = Voucher::find($voucherInvCost_id);
            $voucher->total_amount = $request->gst + $totalAvgPrice + $price + $request->discount;
            $voucher->save();
        }
    }
    private function considerPendingPosItemsforVouchers($request)
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

        $totalCashSaleVoucher = 0;
        $itemFound = 0;
        $pochild = PurchaseOrderChild::with(['PurchaseOrder' => function ($query) {
            $query->where('is_pending', 1);
        }])
            ->where('user_id', $user_id) // user_id
            ->whereHas('PurchaseOrder', function ($query) {
                $query->where('is_pending', 1);
            })
            ->select('item_id')
            ->get()
            ->pluck('item_id');

        $pendingpoarray = $pochild->toArray();
        //  $array = $pendingpoarray[];
        foreach ($request->list as $row) {
            if (in_array($row['item_id'], $pendingpoarray)) {
                $itemFound = 1;
            }
        }
        if ($itemFound == 1) {

            $totalCashSaleVoucher = 0;
            $invoice = new Invoice();
            $invoice->customer_id = $request->customer_id;
            $invoice->delivered_to = $request->delivered_to;
            $invoice->walk_in_customer_name = $request->walk_in_customer_name;
            $invoice->remarks = $request->remarks;
            $invoice->store_id = $request->store_id;
            $invoice->total_amount = $request->total_amount;
            $invoice->discount = $request->discount ?? 0;
            $invoice->total_after_discount = $request->total_after_discount;
            $invoice->received_amount = $request->amount_received;
            $invoice->bank_received_amount = $request->bank_received_amount;

            $invoice->date = $request->date;
            $invoice->tax_type = $request->tax_type;
            $invoice->sale_type = $request->sale_type;
            $invoice->account_id = $request->account_id;
            $invoice->bank_account_id = $request->bank_account_id;
            $invoice->gst = $request->gst;
            $invoice->total_after_gst = $request->total_after_gst;
            $invoice->is_pending = 1;
            $invoice->user_id = $user_id; //user id
            $invoice->save();
            $invoice_id = $invoice->id;
            // $invoice_no = 'INO-' . $invoice_id;
            // Invoice::where('id', '=', $invoice_id)->update(['invoice_no' => $invoice_no]);
            $invoice_no = $invoice->invoice_no;

            $remarks = " Purchase Order ";
            $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
            $customer_id = Person::where('id', $request->customer_id)->value('name');

            $debitside = 0;
            $creditside = 0;
            $totalAvgPrice = 0;
            $price = 0;

            foreach ($request->list as $row) {
                $itemoem = ItemOemPartModeles::where('id', $row['item_id'])->first();
                $itemoem->last_sale_price = $row['price'];
                $itemoem->save();

                $invoiceChild = new InvoiceChild();
                $invoiceChild->invoice_id = $invoice_id;
                $invoiceChild->user_id = $user_id; //user id

                $invoiceChild->item_id = $row['item_id'];
                $invoiceChild->quantity = $row['qty'];
                $invoiceChild->price = $row['price'];
                $invoiceChild->cost = $row['avg_price'];
                $invoiceChild->save();

                $invoiceChildId = $invoiceChild->id;

                $required_qty = $row['qty']; // Quantity to deduct for the current item_id

                $allRacksUnchecked = true;
                foreach ($row['item_racks'] as $rackData) {
                    if ($rackData['checked'] == "true") {
                        $allRacksUnchecked = false;
                        break; // Exit loop early since at least one rack is checked
                    }
                }

                $totalQty = $row['qty'];

                // Case 1: When all racks are unchecked
                if ($allRacksUnchecked) {
                    // Store the entire quantity in ItemInventory
                    $stockChildData = new ItemInventory();
                    $stockChildData->inventory_type_id = 8;
                    $stockChildData->item_id = $row['item_id'];
                    $stockChildData->purchase_price = $row['price'];
                    $stockChildData->invoice_id = $invoice_id;
                    $stockChildData->store_id = $request->store_id;
                    $stockChildData->quantity_out = $totalQty;
                    $stockChildData->date = $request->date;
                    $stockChildData->user_id = $user_id; // userid
                    $stockChildData->save();
                } else {
                    if (isset($row['no_rack_shelf']['checked']) && $row['no_rack_shelf']['checked'] == "true") {
                        $inventoryQty = ItemInventory::where('item_id', $row['item_id'])
                            ->where('store_id', $request->store_id)
                            ->whereNull('rack_id')
                            ->whereNull('shelf_id')
                            ->sum('quantity_in') -
                        ItemInventory::where('item_id', $row['item_id'])
                            ->where('store_id', $request->store_id)
                            ->whereNull('rack_id')
                            ->whereNull('shelf_id')
                            ->sum('quantity_out');

                        $quantityToAdd = min($totalQty, $inventoryQty);
                        $totalQty -= $quantityToAdd;

                        // Store the quantity in ItemInventory
                        $stockChildData = new ItemInventory();
                        $stockChildData->inventory_type_id = 8;
                        $stockChildData->item_id = $row['item_id'];
                        $stockChildData->purchase_price = $row['price'];
                        $stockChildData->invoice_id = $invoice_id;
                        $stockChildData->store_id = $request->store_id;
                        $stockChildData->quantity_out = $quantityToAdd;
                        $stockChildData->date = $request->date;
                        $stockChildData->user_id = $user_id; // userid
                        $stockChildData->save();
                    }

                    // Case 2: When at least one rack is checked
                    SaleRackShelf::where('invoice_id', $request->id)->delete();

                    foreach ($row['item_racks'] as $rackData) {
                        if ($rackData['checked'] == "true") {
                            if ($totalQty > 0) {
                                // Determine the quantity to subtract from the checked racks
                                $quantityToAdd = min($totalQty, $rackData['quantity']);
                                $totalQty -= $quantityToAdd;
                                $rackData['quantity'] -= $quantityToAdd;

                                // Store the quantity in SaleRackShelf
                                SaleRackShelf::create([
                                    'invoice_id' => $invoice_id,
                                    'user_id' => $user_id,
                                    'store_id' => $request->store_id,
                                    'item_id' => $row['item_id'],
                                    'rack_id' => $rackData['rack_id'],
                                    'shelf_id' => $rackData['shelf_id'],
                                    'quantity' => $quantityToAdd,
                                    'invoice_child_id' => $invoiceChild->id,
                                    'checked' => $rackData['checked'],
                                ]);

                                // Subtract from ItemInventory after rackData
                                $stockChildData = new ItemInventory();
                                $stockChildData->inventory_type_id = 8;
                                $stockChildData->item_id = $row['item_id'];
                                $stockChildData->purchase_price = $row['price'];
                                $stockChildData->invoice_id = $invoice_id;
                                $stockChildData->rack_id = $rackData['rack_id'];
                                $stockChildData->shelf_id = $rackData['shelf_id'];
                                $stockChildData->store_id = $request->store_id;
                                $stockChildData->quantity_out = $quantityToAdd;
                                $stockChildData->date = $request->date;
                                $stockChildData->user_id = $user_id; // userid
                                $stockChildData->save();
                            }
                        }
                    }
                }

                // $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $row['item_id'])->groupby('item_id')->select(DB::raw('SUM(current_quantity_price) / SUM(current_quantity) as AvgPrice'), 'item_id')->first();
                // $store_id = $request->store_id;
                $itemId = $row['item_id'];
                //  $PurchasePrice = PurchaseOrderChild::getAveragePriceByItemId($itemId, $store_id);
                $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');

                $totalAvgPrice += $row['avg_price'] * $row['qty'];
            }
            $this->revenueVoucher($request, $invoice_no, $invoice_id);
        } else {
            // if ($pendingpo < 1) {
            $invoice = new Invoice();
            if ($request->sale_type == 2) {
                $invoice->customer_id = $request->customer_id;
            }

            $invoice->delivered_to = $request->delivered_to;
            if ($request->sale_type == 1) {
                $invoice->walk_in_customer_name = $request->walk_in_customer_name;
            }

            $invoice->remarks = $request->remarks;
            $invoice->store_id = $request->store_id;
            $invoice->total_amount = $request->total_amount;
            $invoice->discount = $request->discount ?? 0;
            $invoice->total_after_discount = $request->total_after_discount;
            $invoice->received_amount = $request->amount_received;
            $invoice->bank_received_amount = $request->bank_received_amount;
            $invoice->date = $request->date;
            $invoice->tax_type = $request->tax_type;
            $invoice->sale_type = $request->sale_type;
            $invoice->account_id = $request->account_id;
            $invoice->bank_account_id = $request->bank_account_id;
            $invoice->gst = $request->gst;
            $invoice->total_after_gst = $request->total_after_gst;
            $invoice->user_id = $user_id; //user id

            $invoice->save();
            $invoice_id = $invoice->id;
            // $invoice_no = 'INO-' . $invoice_id;
            // Invoice::where('id', '=', $invoice_id)->update(['invoice_no' => $invoice_no]);
            $invoice_no = $invoice->invoice_no;

            $remarks = " Purchase Order ";
            $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
            $customer_id = Person::where('id', $request->customer_id)->value('name');
            $is_post_dated = isset($request->cheque_no) ? 1 : 0;
            $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
            ///// cost jv voucher
            $voucherInventoryCost = new Voucher();
            $voucherInventoryCost->voucher_no = $newVoucherNo;
            $voucherInventoryCost->date = $request->date;
            $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
            $voucherInventoryCost->invoice_id = $invoice_id;
            $voucherInventoryCost->type = 3;
            $voucherInventoryCost->isApproved = 1;
            $voucherInventoryCost->generated_at = $request->date;
            $voucherInventoryCost->total_amount = $request->total_after_discount;
            $voucherInventoryCost->cheque_no = $request->cheque_no;
            $voucherInventoryCost->cheque_date = Land::changeDateFormat($request->cheque_date);
            $voucherInventoryCost->is_post_dated = $is_post_dated;
            $voucherInventoryCost->is_auto = 1;
            $voucherInventoryCost->user_id = $user_id; //user id
            $voucherInventoryCost->save();
            $voucherInvCost_id = $voucherInventoryCost->id;
            $debitside = 0;
            $creditside = 0;
            $totalAvgPrice = 0;
            $price = 0;

            foreach ($request->list as $row) {
                $itemoem = ItemOemPartModeles::where('id', $row['item_id'])->first();
                $itemoem->last_sale_price = $row['price'];
                $itemoem->save();

                $invoiceChild = new InvoiceChild();
                $invoiceChild->invoice_id = $invoice_id;
                $invoiceChild->user_id = $user_id; //user id
                $invoiceChild->item_id = $row['item_id'];
                $invoiceChild->quantity = $row['qty'];
                $invoiceChild->price = $row['price'];
                $invoiceChild->cost = $row['avg_price'];
                $invoiceChild->save();
                $invoiceChildId = $invoiceChild->id;

                $allRacksUnchecked = true;
                foreach ($row['item_racks'] as $rackData) {
                    if ($rackData['checked'] == "true") {
                        $allRacksUnchecked = false;
                        break; // Exit loop early since at least one rack is checked
                    }
                }

                $totalQty = $row['qty'];

////////////////////////////////////////////////////////////////
                // Case 1: When all racks are unchecked
                if ($allRacksUnchecked) {
                    // Store the entire quantity in ItemInventory
                    $stockChildData = new ItemInventory();
                    $stockChildData->inventory_type_id = 8;
                    $stockChildData->item_id = $row['item_id'];
                    $stockChildData->purchase_price = $row['price'];
                    $stockChildData->invoice_id = $invoice_id;
                    $stockChildData->store_id = $request->store_id;
                    $stockChildData->quantity_out = $totalQty;
                    $stockChildData->date = $request->date;
                    $stockChildData->user_id = $user_id; // userid
                    $stockChildData->save();
                } else {
                    if (isset($row['no_rack_shelf']['checked']) && $row['no_rack_shelf']['checked'] == "true") {
                        $inventoryQty = ItemInventory::where('item_id', $row['item_id'])
                            ->where('store_id', $request->store_id)
                            ->whereNull('rack_id')
                            ->whereNull('shelf_id')
                            ->sum('quantity_in') -
                        ItemInventory::where('item_id', $row['item_id'])
                            ->where('store_id', $request->store_id)
                            ->whereNull('rack_id')
                            ->whereNull('shelf_id')
                            ->sum('quantity_out');

                        $quantityToAdd = min($totalQty, $inventoryQty);
                        $totalQty -= $quantityToAdd;

                        // Store the quantity in ItemInventory
                        $stockChildData = new ItemInventory();
                        $stockChildData->inventory_type_id = 8;
                        $stockChildData->item_id = $row['item_id'];
                        $stockChildData->purchase_price = $row['price'];
                        $stockChildData->invoice_id = $invoice_id;
                        $stockChildData->store_id = $request->store_id;
                        $stockChildData->quantity_out = $quantityToAdd;
                        $stockChildData->date = $request->date;
                        $stockChildData->user_id = $user_id; // userid
                        $stockChildData->save();
                    }

                    // Case 2: When at least one rack is checked
                    SaleRackShelf::where('invoice_id', $request->id)->delete();

                    foreach ($row['item_racks'] as $rackData) {
                        if ($rackData['checked'] == "true") {
                            if ($totalQty > 0) {
                                // Determine the quantity to subtract from the checked racks
                                $quantityToAdd = min($totalQty, $rackData['quantity']);
                                $totalQty -= $quantityToAdd;
                                $rackData['quantity'] -= $quantityToAdd;

                                // Store the quantity in SaleRackShelf
                                SaleRackShelf::create([
                                    'invoice_id' => $invoice_id,
                                    'user_id' => $user_id,
                                    'store_id' => $request->store_id,
                                    'item_id' => $row['item_id'],
                                    'rack_id' => $rackData['rack_id'],
                                    'shelf_id' => $rackData['shelf_id'],
                                    'quantity' => $quantityToAdd,
                                    'invoice_child_id' => $invoiceChild->id,
                                    'checked' => $rackData['checked'],
                                ]);

                                // Subtract from ItemInventory after rackData
                                $stockChildData = new ItemInventory();
                                $stockChildData->inventory_type_id = 8;
                                $stockChildData->item_id = $row['item_id'];
                                $stockChildData->invoice_id = $invoice_id;
                                $stockChildData->purchase_price = $row['price'];
                                $stockChildData->rack_id = $rackData['rack_id'];
                                $stockChildData->shelf_id = $rackData['shelf_id'];
                                $stockChildData->store_id = $request->store_id;
                                $stockChildData->quantity_out = $quantityToAdd;
                                $stockChildData->date = $request->date;
                                $stockChildData->user_id = $user_id; // userid
                                $stockChildData->save();
                            }
                        }
                    }
                }

                $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');

                $totalAvgPrice += $row['avg_price'] * $row['qty'];
                //   --------------Inventory credit  --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $row['avg_price'] * $row['qty'];
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $row['avg_price'] * $row['qty'];

                //   --------------Cost debiting --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 3;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = $row['avg_price'] * $row['qty'];
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $row['avg_price'] * $row['qty'];
            }

            $updateVoucher = Voucher::find($voucherInvCost_id);
            $updateVoucher->total_amount = $totalAvgPrice;
            $updateVoucher->save();

            //// receipt voucher revenue
            if ($request->sale_type == 1) {
                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherRevenueGen = new Voucher();
                $voucherRevenueGen->voucher_no = $newVoucherNo;
                $voucherRevenueGen->date = $request->date;
                $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
                $voucherRevenueGen->invoice_id = $invoice_id;
                $voucherRevenueGen->type = 2;
                $voucherRevenueGen->isApproved = 1;
                $voucherRevenueGen->user_id = $user_id; //user id
                $voucherRevenueGen->generated_at = $request->date;
                $voucherRevenueGen->total_amount = $request->total_after_discount;
                $voucherRevenueGen->cheque_no = $request->cheque_no;
                $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucherRevenueGen->is_post_dated = $is_post_dated;
                $voucherRevenueGen->is_auto = 1;

                $voucherRevenueGen->save();
                $voucherRevenueGenid = $voucherRevenueGen->id;
                $voucherRevGen_id = $voucherRevenueGen->id;
                foreach ($request->list as $list) {

                    $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $list['price'] * $list['qty'];
                    $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $list['price'] * $list['qty'];
                }
                $totalCashSaleVoucher += $request->amount_received;
                //---------------------Cash 1 Debit ------------------
                if ($request->account_id != '' && $request->amount_received > 0) {
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $request->amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                    $voucherTransaction->save();
                    $debitside += $request->amount_received;
                }
                if ($request->bank_amount_received > 0 && $request->bank_account_id != '') {
                    //---------------------Bank Debit ------------------
                    $totalCashSaleVoucher += $request->bank_amount_received;
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->bank_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $request->bank_amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received By bank";
                    $voucherTransaction->save();
                    $debitside += $request->bank_amount_received;
                }
                ///////gst voucher
                if ($request->gst > 0) {
                    //   $totalCashSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->gst;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->gst;
                }
                if ($request->discount > 0) {
                    $totalCashSaleVoucher += $request->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->discount;
                }
                $voucher = Voucher::find($voucherRevenueGenid);
                $voucher->total_amount = $totalCashSaleVoucher;
                $voucher->save();
            } else {
                ///////////////////
                $customer_account = CoaAccount::where('person_id', $request->customer_id)
                    ->where('coa_sub_group_id', 9)->first();
                $customer_account_id = $customer_account->id;

                //////////
                foreach ($request->list as $list) {
                    $price += $list['price'] * $list['qty'];

                    $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $list['price'] * $list['qty'];
                    $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $list['price'] * $list['qty'];

                    //---------------------Cash 1 Debit ------------------
                }
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $request->total_amount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = $request->customer_name . ' ' . "Recievable Amount Against ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->total_amount;
                

                if ($request->discount > 0) {
                    // $totalCreditSaleVoucher += $request->discount;
                    //---------------------Crediting Customer Account Deu To discount ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->discount;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $request->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->discount;
                }
                if (($request->amount_received + $request->bank_amount_received) > 0) {
                    $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucherRevenueGen = new Voucher();
                    $voucherRevenueGen->voucher_no = $newVoucherNo;
                    $voucherRevenueGen->date = $request->date;
                    $voucherRevenueGen->name = "Customer Amount Received ";
                    $voucherRevenueGen->invoice_id = $invoice_id;
                    $voucherRevenueGen->type = 2;
                    $voucherRevenueGen->user_id = $user_id; //user id
                    $voucherRevenueGen->isApproved = 1;
                    $voucherRevenueGen->generated_at = $request->date;
                    $voucherRevenueGen->total_amount = $request->amount_received + $request->bank_amount_received;
                    $voucherRevenueGen->cheque_no = $request->cheque_no;
                    $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                    $voucherRevenueGen->is_post_dated = $is_post_dated;
                    $voucherRevenueGen->is_auto = 1;
                    $voucherRevenueGen->save();
                    $voucherRevGen_id = $voucherRevenueGen->id;

                    if ($request->amount_received > 0) {
                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $request->amount_received;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $request->amount_received;

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $request->account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->amount_received;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $request->total_after_discount . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $request->amount_received;
                    }
                    ///bank
                    if ($request->bank_amount_received > 0 && $request->bank_account_id != '') {
                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = $request->bank_amount_received;
                        $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $request->bank_amount_received;

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $request->bank_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->bank_amount_received;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $request->bank_amount_received;
                    }
                }
                ///////gst voucher
                if ($request->gst > 0) {
                    // $totalCreditSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->gst;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->gst;
                    //---------------------Cash 1 Debit ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->gst;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->gst;
                }
                if ($creditside != $debitside) {
                    throw new \Exception('debit and credit sides are not equal' . $creditside . '---- ' . $debitside);
                }
                $voucher = Voucher::find($voucherInvCost_id);
                $voucher->total_amount = $request->gst + $totalAvgPrice + $price + $request->discount;
                $voucher->save();
            }
            // }
        }
    }
    private function negativeInventoryInvoice($request)
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

        $totalCashSaleVoucher = 0;
        $invoice = new Invoice();
        $invoice->customer_id = $request->customer_id;
        $invoice->delivered_to = $request->delivered_to;
        $invoice->walk_in_customer_name = $request->walk_in_customer_name;
        $invoice->remarks = $request->remarks;
        $invoice->store_id = $request->store_id;
        $invoice->total_amount = $request->total_amount;
        $invoice->discount = $request->discount ?? 0;
        $invoice->total_after_discount = $request->total_after_discount;
        $invoice->received_amount = $request->amount_received;
        $invoice->bank_received_amount = $request->bank_received_amount;
        $invoice->date = $request->date;
        $invoice->tax_type = $request->tax_type;
        $invoice->sale_type = $request->sale_type;
        $invoice->gst = $request->gst;
        $invoice->account_id = $request->account_id;
        $invoice->bank_account_id = $request->bank_account_id;
        $invoice->user_id = $user_id; //user id
        $invoice->total_after_gst = $request->total_after_gst;
        //$invoice->is_pending = 1;
        $invoice->is_pending_neg_inventory = 1;
        $invoice->save();
        $invoice_id = $invoice->id;
        // $invoice_no = 'INO-' . $invoice_id;
        // Invoice::where('id', '=', $invoice_id)->update(['invoice_no' => $invoice_no]);
        $invoice_no = $invoice->invoice_no;

        $remarks = " Purchase Order ";
        $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
        $customer_id = Person::where('id', $request->customer_id)->value('name');

        $debitside = 0;
        $creditside = 0;
        $totalAvgPrice = 0;
        $price = 0;

        foreach ($request->list as $row) {
            $itemoem = ItemOemPartModeles::where('id', $row['item_id'])->first();
            $itemoem->last_sale_price = $row['price'];
            $itemoem->save();

            $invoiceChild = new InvoiceChild();
            $invoiceChild->user_id = $user_id; //user id
            $invoiceChild->invoice_id = $invoice_id;
            $invoiceChild->item_id = $row['item_id'];
            $invoiceChild->quantity = $row['qty'];
            $invoiceChild->price = $row['price'];
            $invoiceChild->cost = $row['avg_price'];
            $invoiceChild->is_negative = 1;
            $invoiceChild->save();

            $allRacksUnchecked = true;
            foreach ($row['item_racks'] as $rackData) {
                if ($rackData['checked'] == "true") {
                    $allRacksUnchecked = false;
                    break; // Exit loop early since at least one rack is checked
                }
            }

            $totalQty = $row['qty'];

            // Case 1: When all racks are unchecked
            if ($allRacksUnchecked) {
                // Store the entire quantity in ItemInventory
                $stockChildData = new ItemInventory();
                $stockChildData->inventory_type_id = 8;
                $stockChildData->purchase_price = $row['price'];
                $stockChildData->item_id = $row['item_id'];
                $stockChildData->invoice_id = $invoice_id;
                $stockChildData->store_id = $request->store_id;
                $stockChildData->quantity_out = $totalQty;
                $stockChildData->date = $request->date;
                $stockChildData->user_id = $user_id; // userid
                $stockChildData->save();
            } else {
                if (isset($row['no_rack_shelf']['checked']) && $row['no_rack_shelf']['checked'] == "true") {
                    $inventoryQty = ItemInventory::where('item_id', $row['item_id'])
                        ->where('store_id', $request->store_id)
                        ->whereNull('rack_id')
                        ->whereNull('shelf_id')
                        ->sum('quantity_in') -
                    ItemInventory::where('item_id', $row['item_id'])
                        ->where('store_id', $request->store_id)
                        ->whereNull('rack_id')
                        ->whereNull('shelf_id')
                        ->sum('quantity_out');

                    $quantityToAdd = min($totalQty, $inventoryQty);
                    $totalQty -= $quantityToAdd;

                    // Store the quantity in ItemInventory
                    $stockChildData = new ItemInventory();
                    $stockChildData->inventory_type_id = 8;
                    $stockChildData->item_id = $row['item_id'];
                    $stockChildData->purchase_price = $row['price'];
                    $stockChildData->invoice_id = $invoice_id;
                    $stockChildData->store_id = $request->store_id;
                    $stockChildData->quantity_out = $quantityToAdd;
                    $stockChildData->date = $request->date;
                    $stockChildData->user_id = $user_id; // userid
                    $stockChildData->save();
                }

                // Case 2: When at least one rack is checked
                SaleRackShelf::where('invoice_id', $request->id)->delete();

                foreach ($row['item_racks'] as $rackData) {
                    if ($rackData['checked'] == "true") {
                        if ($totalQty > 0) {
                            // Determine the quantity to subtract from the checked racks
                            $quantityToAdd = min($totalQty, $rackData['quantity']);
                            $totalQty -= $quantityToAdd;
                            $rackData['quantity'] -= $quantityToAdd;

                            // Store the quantity in SaleRackShelf
                            SaleRackShelf::create([
                                'invoice_id' => $invoice_id,
                                'user_id' => $user_id,
                                'store_id' => $request->store_id,
                                'item_id' => $row['item_id'],
                                'rack_id' => $rackData['rack_id'],
                                'shelf_id' => $rackData['shelf_id'],
                                'quantity' => $quantityToAdd,
                                'invoice_child_id' => $invoiceChild->id,
                                'checked' => $rackData['checked'],
                            ]);

                            // Subtract from ItemInventory after rackData
                            $stockChildData = new ItemInventory();
                            $stockChildData->inventory_type_id = 8;
                            $stockChildData->item_id = $row['item_id'];
                            $stockChildData->purchase_price = $row['price'];
                            $stockChildData->invoice_id = $invoice_id;
                            $stockChildData->rack_id = $rackData['rack_id'];
                            $stockChildData->shelf_id = $rackData['shelf_id'];
                            $stockChildData->store_id = $request->store_id;
                            $stockChildData->quantity_out = $quantityToAdd;
                            $stockChildData->date = $request->date;
                            $stockChildData->user_id = $user_id; // userid
                            $stockChildData->save();
                        }
                    }
                }
            }
        }
        //// receipt voucher revenue
        $this->revenueVoucher($request, $invoice_no, $invoice_id);

        //invoice for negative inventory    ends
    }
    private function revenueVoucher($request, $invoice_no, $invoice_id)
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

        $debitside = 0;
        $creditside = 0;
        $price = 0;
        $totalCashSaleVoucher = 0;
        if ($request->sale_type == 1) {
            $is_post_dated = isset($request->cheque_no) ? 1 : 0;
            $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucherRevenueGen = new Voucher();
            $voucherRevenueGen->voucher_no = $newVoucherNo;
            $voucherRevenueGen->date = $request->date;
            $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
            $voucherRevenueGen->invoice_id = $invoice_id;
            $voucherRevenueGen->type = 2;
            $voucherRevenueGen->isApproved = 1;
            $voucherRevenueGen->user_id = $user_id; //user id
            $voucherRevenueGen->generated_at = $request->date;
            $voucherRevenueGen->total_amount = $request->total_after_discount;
            $voucherRevenueGen->cheque_no = $request->cheque_no;
            $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
            $voucherRevenueGen->is_post_dated = $is_post_dated;
            $voucherRevenueGen->is_auto = 1;
            $voucherRevenueGen->save();
            $voucherRevenueGenid = $voucherRevenueGen->id;
            $voucherRevGen_id = $voucherRevenueGen->id;
            foreach ($request->list as $list) {

                $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 4;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $request->total_amount;
                $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->total_amount;
            }
            $totalCashSaleVoucher += $request->amount_received;
            //---------------------Cash 1 Debit ------------------
            if ($request->account_id != '' && $request->amount_received > 0) {
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = $request->amount_received;
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                $voucherTransaction->save();
                $debitside += $request->amount_received;
            }
            if ($request->bank_amount_received > 0 && $request->bank_account_id != '') {
                //---------------------Bank Debit ------------------
                $totalCashSaleVoucher += $request->bank_amount_received;
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->bank_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->bank_amount_received;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received By bank";
                $voucherTransaction->save();
                $debitside += $request->bank_amount_received;
            }
            ///////gst voucher
            if ($request->gst > 0) {
                //   $totalCashSaleVoucher += $request->gst;

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 23;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->gst;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->gst;
            }
            if ($request->discount > 0) {
                $totalCashSaleVoucher += $request->discount;

                //---------------------Debiting discount Expense   ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 28;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->discount;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->discount;
            }
            $voucher = Voucher::find($voucherRevenueGenid);
            $voucher->total_amount = $totalCashSaleVoucher;
            $voucher->save();
        } else {
            ///////////////////
            $customer_account = CoaAccount::where('person_id', $request->customer_id)
                ->where('coa_sub_group_id', 9)->first();
            $customer_account_id = $customer_account->id;

            //////////
            // foreach ($request->list as $list) {
            //     $price += $list['price'] * $list['qty'];
            //     $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $list['item_id'])->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();

            //     $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
            //     //---------------------Crediting Reneve ------------------
            //     $voucherTransaction = new VoucherTransaction();
            //     $voucherTransaction->voucher_id = $voucherInvCost_id;
            //     $voucherTransaction->date = $request->date;
            //     $voucherTransaction->coa_account_id = 4;
            //     $voucherTransaction->is_approved = 1;
            //     $voucherTransaction->debit = 0;
            //     $voucherTransaction->credit =   $list['price'] * $list['qty'];
            //     $voucherTransaction->description = $itemName . " sold . "  . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
            //     $voucherTransaction->save();
            //     $creditside += $list['price'] * $list['qty'];

            //     //---------------------Cash 1 Debit ------------------

            //     $voucherTransaction = new VoucherTransaction();
            //     $voucherTransaction->voucher_id = $voucherInvCost_id;
            //     $voucherTransaction->date = $request->date;
            //     $voucherTransaction->coa_account_id = $customer_account_id;
            //     $voucherTransaction->is_approved = 1;
            //     $voucherTransaction->debit = $list['price'] * $list['qty'];
            //     $voucherTransaction->credit = 0;
            //     $voucherTransaction->description = $itemName . " sold . "  . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['qty'] . " ,Invoice no: " . $invoice_no;
            //     $voucherTransaction->save();
            //     $debitside += $list['price'] * $list['qty'];
            // }

            // if ($request->discount > 0) {
            //     // $totalCreditSaleVoucher += $request->discount;
            //     //---------------------Crediting Customer Account Deu To discount ------------------
            //     $voucherTransaction = new VoucherTransaction();
            //     $voucherTransaction->voucher_id = $voucherInvCost_id;
            //     $voucherTransaction->date = $request->date;
            //     $voucherTransaction->coa_account_id = $customer_account_id;
            //     $voucherTransaction->is_approved = 1;
            //     $voucherTransaction->debit = 0;
            //     $voucherTransaction->credit =  $request->discount;
            //     $voucherTransaction->description = 'Discount' . '' . $invoice_no;
            //     $voucherTransaction->save();
            //     $creditside += $request->discount;

            //     //---------------------Debiting discount Expense   ------------------

            //     $voucherTransaction = new VoucherTransaction();
            //     $voucherTransaction->voucher_id = $voucherInvCost_id;
            //     $voucherTransaction->date = $request->date;
            //     $voucherTransaction->coa_account_id = 28;
            //     $voucherTransaction->is_approved = 1;
            //     $voucherTransaction->debit = $request->discount;
            //     $voucherTransaction->credit = 0;
            //     $voucherTransaction->description = 'Discount' . '' . $invoice_no;
            //     $voucherTransaction->save();
            //     $debitside += $request->discount;
            // }
            if (($request->amount_received) + ($request->bank_amount_received) > 0) {
                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherRevenueGen = new Voucher();
                $voucherRevenueGen->voucher_no = $newVoucherNo;
                $voucherRevenueGen->date = $request->date;
                $voucherRevenueGen->name = "Customer Amount Received ";
                $voucherRevenueGen->invoice_id = $invoice_id;
                $voucherRevenueGen->type = 2;
                $voucherRevenueGen->isApproved = 1;
                $voucherRevenueGen->generated_at = $request->date;
                $voucherRevenueGen->total_amount = $request->amount_received + $request->bank_amount_received;
                $voucherRevenueGen->cheque_no = $request->cheque_no;
                $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucherRevenueGen->is_post_dated = $is_post_dated;
                $voucherRevenueGen->user_id = $user_id; //user id

                $voucherRevenueGen->is_auto = 1;
                $voucherRevenueGen->save();
                $voucherRevGen_id = $voucherRevenueGen->id;
                if ($request->amount_received > 0) {
                    // $totalCashSaleVoucher += $request->amount_received;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->amount_received;
                    $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->amount_received;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->amount_received;
                }
                ///bank
                if ($request->bank_amount_received > 0 && $request->bank_account_id != '') {

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->bank_amount_received;
                    $voucherTransaction->description = "Amount received against (bank)" . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->bank_amount_received;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->bank_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->bank_amount_received;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = "Amount received against (bank)" . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->bank_amount_received;
                }
            }
            ///////gst voucher

            if ($creditside != $debitside) {
                throw new \Exception('debit and credit sides are not equal'. $creditside . '---- ' . $debitside);
            }
        }
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:invoices,id',
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
            $parentData = Invoice::with('store', 'customer')->find($req->id);

            $childData = InvoiceChild::with('item')->where('invoice_id', $req->id)
                ->where('user_id', $user_id) // user_id
                ->get();

            return ['parentData' => $parentData, 'childData' => $childData];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
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
            'id' => 'required|int|exists:invoices,id',
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
            $parentData = Invoice::with('customer', 'store')->where(['id' => $req->id])->first();
            //  return $parentData->shop;
            if ($parentData->is_approved == 1) {
                return ['status' => "error", 'message' => "Approved Invoice Con't Edit"];
            } else {
                $childData = InvoiceChild::with('item', 'invoiceDeliveredTo')->where('invoice_id', $req->id)
                    ->where('user_id', $user_id) // user_id
                    ->get();
                $childData2 = ItemOemPartModeles::with('machinePartOemPart')
                    ->where('user_id', $user_id) // user_id
                    ->get();
                $childFinalData = [];

                foreach ($childData2 as $child) {
                    $childFinalData[] = array(
                        "id" => $child->id,
                        "value" => $child->id,
                        "label" => $child->machinePartOemPart->oemPartNumber->number1 ?? null . ' ' . $child->machinePartOemPart->machinePart->name ?? null,
                    );
                }
                $childDataList = [];
                for ($i = 0; $i < count($childData); $i++) {
                    $total = 0;

                    // Fetch racks and shelves
                    $rackShelfData = SaleRackShelf::with(['racks', 'shelves'])
                        ->where('item_id', $childData[$i]->item_id)
                        ->where('invoice_id', $req->id)
                        ->select('item_id', 'rack_id', 'shelf_id', 'quantity', 'checked')->get();

                    $childDataList[$i] = array(

                        "id" => $childData[$i]->id,
                        "invoice_id" => $childData[$i]->invoice_id,
                        "item_name" => $childData[$i]->item->machinePartOemPart->machinePart->name ?? null,
                        "item_id" => $childData[$i]->item_id,
                        "quantity" => $childData[$i]->quantity,
                        "returned_quantity" => $childData[$i]->returned_quantity,
                        "price" => $childData[$i]->price,
                        "cost" => $childData[$i]->cost,
                        "amount" => $childData[$i]->price * ($childData[$i]->quantity - $childData[$i]->returned_quantity),
                        "items_options" => $childFinalData,
                        // "delivered_to" => $childData[$i]->invoiceDeliveredTo->delivered_to,
                        'Primary_oem' => $childData[$i]->item->machinePartOemPart->oemPartNumber->number1,
                        "racks_shelves" => $rackShelfData,

                    );
                    $total += $childData[$i]->price * ($childData[$i]->quantity - $childData[$i]->returned_quantity);
                }
                $form = array(
                    "id" => $parentData->id,
                    "customer_id" => $parentData->customer_id,
                    "delivered_to" => $parentData->delivered_to,
                    "walk_in_customer_name" => $parentData->walk_in_customer_name,
                    "invoice_no" => $parentData->invoice_no,
                    "date" => $parentData->date,
                    "remarks" => $parentData->remarks,
                    "total_amount" => $parentData->total_amount,
                    "total_after_discount" => $parentData->total_after_discount,
                    "discount" => $parentData->discount,
                    "gst" => $parentData->gst,
                    "total_after_gst" => $parentData->total_after_gst,
                    "amount_received" => $parentData->received_amount,
                    "bank_received_amount" => $parentData->bank_received_amount,
                    "account_id" => $parentData->account_id,
                    "bank_account_id" => $parentData->bank_account_id,
                    "store" => $parentData->store->name,
                    "store_id" => $parentData->store->id,
                    "sale_type" => $parentData->sale_type,
                    "tax_type" => $parentData->tax_type,
                    "childArray" => $childDataList,
                );
                return $form;
            }
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function getDetailsForReturnSale(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:invoices,id',
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
            $parentData = Invoice::with('customer', 'store')->where(['id' => $req->id])->first();
            //  return $parentData->shop;
            if ($parentData->is_approved == 1) {
                return ['status' => "error", 'message' => "Approved Invoice Con't Edit"];
            } else {
                $childData = InvoiceChild::with('item', 'rackShelf')
                    ->where('user_id', $user_id) // user_id
                    ->where('invoice_id', $req->id)->get();
                $childData2 = ItemOemPartModeles::with('machinePartOemPart')
                    ->where('user_id', $user_id) // user_id
                    ->get();
                $childFinalData = [];

                foreach ($childData2 as $child) {
                    $childFinalData[] = array(
                        "id" => $child->id,
                        "value" => $child->id,
                        "label" => $child->machinePartOemPart->oemPartNumber->number1 ?? null . ' ' . $child->machinePartOemPart->machinePart->name ?? null,
                    );
                }
                $childDataList = [];
                for ($i = 0; $i < count($childData); $i++) {
                    $invoiceId = $req->id;
                    $itemId = $childData[$i]->item_id;
                    $newQty = 0;
                    $returninvoiceid = ReturnedSale::where('user_id', $user_id) // user_id
                        ->where('inv_id', $invoiceId)
                        ->get();
                    if ($returninvoiceid) {
                        foreach ($returninvoiceid as $childReturn) {
                            $item_id =
                            $return_qty = ReturnedSaleChild::where('returned_sales_id', $childReturn->id)
                                ->where('item_id', $itemId)
                                ->value('quantity');
                            $newQty += $return_qty;
                        }
                        $return_qty = $newQty;
                        if (empty($return_qty)) {
                            $totalReturnQuantity = 0;
                        } else {
                            $totalReturnQuantity = $return_qty;
                        }
                    } else {
                        $totalReturnQuantity = 0;
                    }
                    $total = 0;
                    $childDataList[$i] = array(

                        "id" => $childData[$i]->id,
                        "invoice_id" => $childData[$i]->invoice_id,
                        "item_name" => $childData[$i]->item->machinePartOemPart->machinePart->name ?? null,
                        "item_id" => $childData[$i]->item_id,
                        "quantity" => $childData[$i]->quantity,
                        "returned_quantity" => $childData[$i]->returned_quantity,
                        "price" => $childData[$i]->price,
                        "cost" => $childData[$i]->cost,
                        "amount" => $childData[$i]->price * ($childData[$i]->quantity - $childData[$i]->returned_quantity),
                        "items_options" => $childFinalData,
                        'Primary_oem' => $childData[$i]->item->machinePartOemPart->oemPartNumber->number1,
                        "current_quantity" => $childData[$i]->quantity,
                        "avg_price" => $childData[$i]->cost,
                        "sold_quantity" => $childData[$i]->quantity,
                        "returned_quantity_sum" => $totalReturnQuantity,
                        'rackShelf' => $childData[$i]->rackShelf,

                    );
                    $total += $childData[$i]->price * ($childData[$i]->quantity - $childData[$i]->returned_quantity);
                }
                $form = array(
                    "id" => $parentData->id,
                    "customer_id" => $parentData->customer_id,
                    "walk_in_customer_name" => $parentData->walk_in_customer_name,
                    "invoice_no" => $parentData->invoice_no,
                    "date" => $parentData->date,
                    "remarks" => $parentData->remarks,
                    "total_amount" => $parentData->total_amount,
                    "total_after_discount" => $parentData->total_after_discount,
                    "discount" => $parentData->discount,
                    "gst" => $parentData->gst,
                    "total_after_gst" => $parentData->total_after_gst,
                    "amount_received" => '',
                    "bank_amount_received" => '',
                    "store" => $parentData->store->name,
                    "store_id" => $parentData->store->id,
                    "sale_type" => $parentData->sale_type,
                    "tax_type" => $parentData->tax_type,
                    "childArray" => $childDataList,
                );
                return $form;
            }
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
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
        // Validation rules
        $rules = array(
            'id' => 'required|int|exists:invoices,id',
            'childArray' => 'required|array',
            'childArray.*.price' => 'required|numeric',
            'childArray.*.quantity' => 'required|numeric',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }

        $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;

        // try {
        DB::transaction(function () use ($request, $user_id) {
            $invoice = Invoice::find($request->id);
            $invoice->customer_id = $request->customer_id;
            $invoice->remarks = $request->remarks;
            $invoice->total_amount = $request->total_amount;
            $invoice->discount = $request->discount;
            $invoice->total_after_discount = $request->total_after_discount;
            $invoice->save();
            $invoice_id = $invoice->id;
            ItemInventory::where('invoice_id', $invoice->id)->delete();
            SaleRackShelf::where('invoice_id', $request->id)->delete();
            $vouchers = Voucher::where('invoice_id', $request->id)->get();
            if ($vouchers->isNotEmpty()) {
                foreach ($vouchers as $voucher) {
                    $voucherId = $voucher->id;
                    VoucherTransaction::where('voucher_id', $voucherId)->delete();
                    $voucher->delete();
                }
            }
            $invoice_no = 'INO-' . $invoice_id;
            Invoice::where('id', '=', $invoice_id)->update(['invoice_no' => $invoice_no]);

            $is_post_dated = isset($request->cheque_no) ? 1 : 0;
            $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            ///// cost jv voucher
            $voucherInventoryCost = new Voucher();
            $voucherInventoryCost->voucher_no = $newVoucherNo;
            $voucherInventoryCost->date = $request->date;
            $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
            $voucherInventoryCost->invoice_id = $invoice_id;
            $voucherInventoryCost->type = 3;
            $voucherInventoryCost->isApproved = 1;
            $voucherInventoryCost->generated_at = $request->date;
            $voucherInventoryCost->total_amount = $request->total_after_discount;
            $voucherInventoryCost->cheque_no = $request->cheque_no;
            $voucherInventoryCost->cheque_date = Land::changeDateFormat($request->cheque_date);
            $voucherInventoryCost->is_post_dated = $is_post_dated;
            $voucherInventoryCost->is_auto = 1;
            $voucherInventoryCost->user_id = $user_id; // userid

            $voucherInventoryCost->save();
            $voucherInvCost_id = $voucherInventoryCost->id;
            $debitside = 0;
            $creditside = 0;
            $totalAvgPrice = 0;
            $price = 0;
            $totalCashSaleVoucher = 0;

            foreach ($request->childArray as $childArray) {
                $invoiceChild = InvoiceChild::find($childArray['id']);
                $invoiceChild->item_id = $childArray['item_id'];
                $invoiceChild->quantity = $childArray['quantity'];
                $invoiceChild->price = $childArray['price'];
                $invoiceChild->save();

                $itemRacksChecked = false;
                if (isset($childArray['item_racks']) && is_array($childArray['item_racks'])) {
                    // Loop through each rack in 'item_racks'
                    foreach ($childArray['item_racks'] as $rack) {
                        if (isset($rack['checked']) && $rack['checked']) {
                            $itemRacksChecked = true;
                            break; // Exit loop if a checked rack is found
                        }
                    }
                }

                // Check if 'no_rack_shelf' is set and if 'checked' is true
                $noRackShelfChecked = isset($childArray['no_rack_shelf']['checked']) ? $childArray['no_rack_shelf']['checked'] : false;

                if (!$itemRacksChecked && !$noRackShelfChecked) {
                    throw new \Exception('- Please select any one of stock.');
                }

                if (isset($childArray['item_racks']) && is_array($childArray['item_racks'])) {
                    $allRacksUnchecked = true;
                    foreach ($childArray['item_racks'] as $rackData) {
                        if ($rackData['checked'] == "true") {
                            $allRacksUnchecked = false;
                            break; // Exit loop early since at least one rack is checked
                        }
                    }

                    $totalQty = $childArray['quantity'];

                    // Case 1: When all racks are unchecked
                    if ($allRacksUnchecked) {
                        // Store the entire quantity in ItemInventory
                        $stockChildData = new ItemInventory();
                        $stockChildData->inventory_type_id = 8;
                        $stockChildData->item_id = $childArray['item_id'];
                        $stockChildData->invoice_id = $invoice_id;
                        $stockChildData->purchase_price = $childArray['price'];
                        $stockChildData->store_id = $request->store_id;
                        $stockChildData->quantity_out = $totalQty;
                        $stockChildData->date = $request->date;
                        $stockChildData->user_id = $user_id; // userid
                        $stockChildData->save();
                    } else {
                        if (isset($childArray['no_rack_shelf']['checked']) && $childArray['no_rack_shelf']['checked'] == "true") {
                            $inventoryQty = ItemInventory::where('item_id', $childArray['item_id'])
                                ->where('store_id', $request->store_id)
                                ->whereNull('rack_id')
                                ->whereNull('shelf_id')
                                ->sum('quantity_in') -
                            ItemInventory::where('item_id', $childArray['item_id'])
                                ->where('store_id', $request->store_id)
                                ->whereNull('rack_id')
                                ->whereNull('shelf_id')
                                ->sum('quantity_out');

                            $quantityToAdd = min($totalQty, $inventoryQty);
                            $totalQty -= $quantityToAdd;

                            // Store the quantity in ItemInventory
                            $stockChildData = new ItemInventory();
                            $stockChildData->inventory_type_id = 8;
                            $stockChildData->item_id = $childArray['item_id'];
                            $stockChildData->purchase_price = $childArray['price'];
                            $stockChildData->invoice_id = $invoice_id;
                            $stockChildData->store_id = $request->store_id;
                            $stockChildData->quantity_out = $quantityToAdd;
                            $stockChildData->date = $request->date;
                            $stockChildData->user_id = $user_id; // userid
                            $stockChildData->save();
                        }
                    }
                    // Case 2: When at least one rack is checked
                    SaleRackShelf::where('invoice_id', $request->id)->delete();

                    foreach ($childArray['item_racks'] as $rackData) {
                        if ($rackData['checked'] == "true") {
                            if ($totalQty > 0) {
                                // Determine the quantity to subtract from the checked racks
                                $quantityToAdd = min($totalQty, $rackData['quantity']);
                                $totalQty -= $quantityToAdd;
                                $rackData['quantity'] -= $quantityToAdd;

                                // Store the quantity in SaleRackShelf
                                SaleRackShelf::create([
                                    'invoice_id' => $invoice_id,
                                    'user_id' => $user_id,
                                    'store_id' => $request->store_id,
                                    'item_id' => $childArray['item_id'],
                                    'rack_id' => $rackData['rack_id'],
                                    'shelf_id' => $rackData['shelf_id'],
                                    'quantity' => $quantityToAdd,
                                    'invoice_child_id' => $invoiceChild->id,
                                    'checked' => $rackData['checked'],
                                ]);

                                // Subtract from ItemInventory after rackData
                                $stockChildData = new ItemInventory();
                                $stockChildData->inventory_type_id = 8;
                                $stockChildData->item_id = $childArray['item_id'];
                                $stockChildData->invoice_id = $invoice_id;
                                $stockChildData->purchase_price = $childArray['price'];
                                $stockChildData->rack_id = $rackData['rack_id'];
                                $stockChildData->shelf_id = $rackData['shelf_id'];
                                $stockChildData->store_id = $request->store_id;
                                $stockChildData->quantity_out = $quantityToAdd;
                                $stockChildData->date = $request->date;
                                $stockChildData->user_id = $user_id; // userid
                                $stockChildData->save();
                            }
                        }
                    }
                }

                // $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $childArray['item_id'])->groupby('item_id')->select(DB::raw('SUM(current_quantity_price) / SUM(current_quantity) as AvgPrice'), 'item_id')->first();
                $itemName = ItemOemPartModeles::where('id', $childArray['item_id'])->value('name');

                $totalAvgPrice += $childArray['avg_price'] * $childArray['quantity'];
                //   --------------Inventory credit  --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 1;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //userid
                $voucherTransaction->credit = $childArray['avg_price'] * $childArray['quantity'];
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($childArray['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $childArray['quantity'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $childArray['avg_price'] * $childArray['quantity'];

                //   --------------Cost debiting --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 3;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; // userid
                $voucherTransaction->debit = $childArray['avg_price'] * $childArray['quantity'];
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($childArray['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $childArray['quantity'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $childArray['avg_price'] * $childArray['quantity'];
            }
            $updateVoucher = Voucher::find($voucherInvCost_id);
            $updateVoucher->total_amount = $totalAvgPrice;
            $updateVoucher->user_id = $user_id; // userid
            $updateVoucher->save();

            if ($request->sale_type == 1) {
                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherRevenueGen = new Voucher();
                $voucherRevenueGen->voucher_no = $newVoucherNo;
                $voucherRevenueGen->date = $request->date;
                $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
                $voucherRevenueGen->invoice_id = $invoice_id;
                $voucherRevenueGen->type = 2;
                $voucherRevenueGen->isApproved = 1;
                $voucherRevenueGen->generated_at = $request->date;
                $voucherRevenueGen->total_amount = $request->total_after_discount;
                $voucherRevenueGen->cheque_no = $request->cheque_no;
                $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                $voucherRevenueGen->is_post_dated = $is_post_dated;
                $voucherRevenueGen->is_auto = 1;
                $voucherRevenueGen->user_id = $user_id; // userid
                $voucherRevenueGen->save();
                $voucherRevenueGenid = $voucherRevenueGen->id;
                $voucherRevGen_id = $voucherRevenueGen->id;
                foreach ($request->childArray as $list) {
                    // $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $list['item_id'])->groupby('item_id')->select(DB::raw('SUM(current_quantity_price) / SUM(current_quantity) as AvgPrice'), 'item_id')->first();
                    $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $list['price'] * $list['quantity'];
                    $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $list['price'] * $list['quantity'];
                }
                $totalCashSaleVoucher += $request->amount_received;

                if ($request->account_id != '' & $request->amount_received > 0) {
                    //---------------------Cash 1 Debit ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->amount_received;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                    $voucherTransaction->save();
                    $debitside += $request->amount_received;
                }
                if ($request->bank_amount_received > 0) {
                    //---------------------Bank Debit ------------------
                    $totalCashSaleVoucher += $request->bank_amount_received;
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $request->bank_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->bank_amount_received;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received By bank";
                    $voucherTransaction->save();
                    $debitside += $request->bank_amount_received;
                }
                ///////gst voucher
                if ($request->gst > 0) {
                    //   $totalCashSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->gst;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->gst;
                    //---------------------Cash 1 Debit ------------------
                    // $voucherTransaction = new VoucherTransaction();
                    // $voucherTransaction->voucher_id = $voucherRevGen_id;
                    // $voucherTransaction->date = $request->date;
                    // $voucherTransaction->coa_account_id = $request->account_id;
                    // $voucherTransaction->is_approved = 1;
                    // $voucherTransaction->debit = $request->gst;
                    // $voucherTransaction->credit = 0;
                    // $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    // $voucherTransaction->save();
                }
                if ($request->discount > 0) {
                    $totalCashSaleVoucher += $request->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->discount;
                }
                $voucher = Voucher::find($voucherRevenueGenid);
                $voucher->total_amount = $totalCashSaleVoucher;

                $voucher->save();
            } else {
                ///////////////////
                $customer_account = CoaAccount::where('person_id', $request->customer_id)
                    ->where('coa_sub_group_id', 9)
                    ->where('user_id', $user_id)
                    ->first();
                $customer_account_id = $customer_account->id;

                //////////
                foreach ($request->childArray as $list) {
                    $price += $list['price'] * $list['quantity'];
                    // $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $list['item_id'])->groupby('item_id')->select(DB::raw('SUM(current_quantity_price) / SUM(current_quantity) as AvgPrice'), 'item_id')->first();
                    $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $list['price'] * $list['quantity'];
                    $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $list['price'] * $list['quantity'];

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $list['price'] * $list['quantity'];
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $list['price'] * $list['quantity'];
                }

                if ($request->discount > 0) {
                    // $totalCreditSaleVoucher += $request->discount;
                    //---------------------Crediting Customer Account Deu To discount ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $request->discount;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $request->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->discount;
                }
                if (($request->amount_received) + ($request->bank_amount_received) > 0) {
                    // $totalCashSaleVoucher += $request->amount_received;
                    $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucherRevenueGen = new Voucher();
                    $voucherRevenueGen->voucher_no = $newVoucherNo;
                    $voucherRevenueGen->date = $request->date;
                    $voucherRevenueGen->name = "Customer Amount Received ";
                    $voucherRevenueGen->invoice_id = $invoice_id;
                    $voucherRevenueGen->type = 2;
                    $voucherRevenueGen->isApproved = 1;
                    $voucherRevenueGen->generated_at = $request->date;
                    $voucherRevenueGen->total_amount = $request->amount_received + $request->bank_amount_received;
                    $voucherRevenueGen->cheque_no = $request->cheque_no;
                    $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                    $voucherRevenueGen->is_post_dated = $is_post_dated;
                    $voucherRevenueGen->user_id = $user_id; //user id
                    $voucherRevenueGen->is_auto = 1;
                    $voucherRevenueGen->save();
                    $voucherRevGen_id = $voucherRevenueGen->id;

                    if ($request->amount_received > 0) {

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $request->amount_received;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $request->amount_received;

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $request->account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->amount_received;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $request->amount_received;
                    }
                    ///bank
                    if ($request->bank_amount_received > 0) {
                        // $totalCashSaleVoucher += $request->amount_received;
                        // $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                        // $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        // $voucherRevenueGen = new Voucher();
                        // $voucherRevenueGen->voucher_no = $newVoucherNo;
                        // $voucherRevenueGen->date = $request->date;
                        // $voucherRevenueGen->name =  "Customer Amount Received bank";
                        // $voucherRevenueGen->invoice_id = $invoice_id;
                        // $voucherRevenueGen->type = 2;
                        // $voucherRevenueGen->isApproved = 1;
                        // $voucherRevenueGen->generated_at = $request->date;
                        // $voucherRevenueGen->total_amount = $request->bank_amount_received;
                        // $voucherRevenueGen->cheque_no = $request->cheque_no;
                        // $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                        // $voucherRevenueGen->is_post_dated = $is_post_dated;
                        //$voucherRevenueGen->is_auto = 1;

                        // $voucherRevenueGen->save();
                        // $voucherRevGen_id = $voucherRevenueGen->id;

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = $request->bank_amount_received;
                        $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $request->bank_amount_received;

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $request->bank_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->bank_amount_received;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $list['price'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $request->bank_amount_received;
                    }
                }
                ///////gst voucher
                if ($request->gst > 0) {
                    // $totalCreditSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->gst;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->save();
                    $creditside += $request->gst;
                    //---------------------Cash 1 Debit ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $request->gst;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $request->gst;
                }
                if ($creditside != $debitside) {
                    throw new \Exception('debit and credit sides are not equal'. $creditside . '---- ' . $debitside);
                }
                $voucher = Voucher::find($voucherInvCost_id);
                $voucher->total_amount = $request->gst + $totalAvgPrice + $price + $request->discount;
                $voucher->save();
            }
        });

        return ['status' => "ok", 'message' => 'Invoice updated successfully'];
        // } catch (\Exception $e) {
        //     return ['status' => 'error', 'message' => $e->getMessage()];
        // }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $invno = $request->id;
        $invoiceChildren = InvoiceChild::where('invoice_id', $invno)->get();

        $groupedItems = [];
        foreach ($invoiceChildren as $child) {
            $itemId = $child->item_id;

            if (!isset($groupedItems[$itemId])) {
                $groupedItems[$itemId] = [
                    'total_quantity' => 0,
                    'total_cost' => 0,
                ];
            }

            $groupedItems[$itemId]['total_quantity'] += $child->quantity;
            $groupedItems[$itemId]['total_cost'] += $child->quantity * $child->cost;
        }
        // dd($groupedItems);
        foreach ($groupedItems as $itemId => $data) {
            $quantity = $data['total_quantity'];
            $totalCostFromInvoice = $data['total_cost'];

            $item = ItemOemPartModeles::find($itemId);
            if ($item) {
                $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                $totalCost = ($item->avg_cost * $stockQty) + $totalCostFromInvoice;
                $totalQuantity = $stockQty + $quantity;

                $item->avg_cost = $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;
                $item->save();
            }
        }

        $rules = [
            'id' => 'required|int|exists:invoices,id',
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {
                ItemInventory::where('invoice_id', $request->id)->delete();

                $voucherTypes = [3, 2];
                foreach ($voucherTypes as $type) {
                    $voucher = Voucher::where('invoice_id', $request->id)->where('type', $type)->first();
                    if ($voucher) {
                        $voucher_id = $voucher->id;
                        VoucherTransaction::where('voucher_id', $voucher_id)->delete();
                        Voucher::where('id', $voucher_id)->delete();
                    }
                }

                InvoiceChild::where('invoice_id', $request->id)->delete();
                Invoice::where('id', $request->id)->delete();
            });
            return ['status' => "ok", 'message' => 'Sale deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'Selected sale is used somewhere in the system and cannot be deleted'];
        }
    }

    /**
     *  Invoice Details for table.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSalesDetails(Request $req)
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

        $store_id = $req->store_id;
        $sale_type = $req->sale_type;
        $customer_id = $req->customer_id;
        $walk_in_customer_name = $req->walk_in_customer_name;
        try {
            $invoices = InvoiceChild::with('invoiceNo', 'item')
                ->where('user_id', $user_id) // user_id
                ->when($store_id, function ($query, $store_id) {
                    $query->whereHas('invoiceNo', function ($qu) use ($store_id) {
                        $qu->where('store_id', $store_id);
                    });
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->whereHas('invoiceNo', function ($qu) use ($customer_id) {
                        $qu->where('customer_id', $customer_id);
                    });
                })

                ->when($sale_type, function ($query, $sale_type) {
                    $query->whereHas('invoiceNo', function ($qu) use ($sale_type) {
                        $qu->where('sale_type', $sale_type);
                    });
                })
                ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
                    $query->whereHas('invoiceNo', function ($qu) use ($walk_in_customer_name) {
                        $qu->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
                    });
                })

                ->get();
            return ['invoices_child' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    /**
     *  Invoice Details for table.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSalesReport(Request $req)
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

        $store_id = $req->store_id;
        $sale_type = $req->sale_type;
        $walk_in_customer_name = $req->walk_in_customer_name;
        $customer_id = $req->customer_id;
        $item_id = $req->item_id;
        $from = $req->from;
        $to = $req->to;
        $brand_id = $req->brand_id;
        try {
            
            $invoices = Invoice::with(['customer','store','invoiceChild' => function ($query) use ($brand_id) {
                // Apply the brand_id filter only if it's provided
    if ($brand_id) {
        $query->whereHas('item', function ($query) use ($brand_id) {
            $query->where('brand_id', $brand_id); // Filter invoice items to include only those with the specified brand_id
        });
    }
}])
    ->where('user_id', $user_id) // user_id
    ->when($sale_type, function ($query, $sale_type) {
        $query->where('sale_type', $sale_type);
    })
    ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
        $query->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
    })
    ->when($from && $to, function ($query) use ($from, $to) {
        $query->whereBetween('date', [$from, $to]);
    })
    ->when($store_id, function ($query, $store_id) {
        $query->where('store_id', $store_id);
    })
    ->when($customer_id, function ($query, $customer_id) {
        $query->where('customer_id', $customer_id);
    })
    ->when($item_id, function ($query) use ($item_id) {
        $query->with('invoiceChild', fn($q) => $q->where('item_id', '=', $item_id));
    })
    // Apply the brand_id filter only if it's provided
    ->when($brand_id, function ($query) use ($brand_id) {
        $query->whereHas('invoicechild.item', function ($query) use ($brand_id) {
            $query->where('brand_id', $brand_id);  // Ensure at least one item matches the brand_id
        });
    })

                ->get();

            return ['invoices' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    /**
     *  Invoice Details for table.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getSalesReportBySaleType(Request $req)
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

        $sale_type = $req->sale_type;
        $walk_in_customer_name = $req->walk_in_customer_name;
        $customer_id = $req->customer_id;
        $item_id = $req->item_id;
        $from = $req->from;
        $to = $req->to;
        try {
            $walkin = Invoice::with('invoiceChild', 'customer', 'store')
                ->where('user_id', $user_id) // user_id
                ->when($sale_type, function ($q, $sale_type) {
                    $q->whereHas('invoiceChild.invoice', function ($q) use ($sale_type) {
                        return $q->where('sale_type', $sale_type);
                    });
                })
            // ->where('sale_type', 1)
                ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
                    $query->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->where('customer_id', $customer_id);
                })
                ->when($item_id, function ($query) use ($item_id) {
                    $query->with('invoiceChild', fn($q) => $q->where('item_id', '=', $item_id));
                })
                ->when($from, function ($query, $from) use ($to) {
                    $query->whereBetween('date', [$from, $to]);
                })
                ->get();
            $registered = Invoice::with('invoiceChild', 'customer', 'store')
                ->where('user_id', $user_id) // user_id

                ->where('sale_type', 2)

            // ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
            //     $query->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
            // })
                ->when($from, function ($query, $from) use ($to) {
                    $query->whereBetween('date', [$from, $to]);
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->where('customer_id', $customer_id);
                })
                ->when($item_id, function ($query) use ($item_id) {
                    $query->with('invoiceChild', fn($q) => $q->where('item_id', '=', $item_id));
                })
                ->get();

            return ['walkin' => $walkin, 'registered' => $registered];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    /**
     * Display Sale history
     *
     * @param  int  $itemid
     * @param  int  $customerid
     * @return \Illuminate\Http\Response
     */
    public function getItemSaleHistory(Request $req)
    {
        $rules = array(
            'item_id' => 'required',
        );
        $id = $req->item_id;
        $customer_id = $req->customer_id;
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $Salehistory = ItemOemPartModeles::with('invoiceChild')
                ->where('id', $id)
                ->first() ?? [];

            // $Salehistory = ItemOemPartModeles::with(['invoiceChild.invoice' => function ($query) {
            //     $query
            //         ->orderBy('date', 'desc');
            // }])
            //     ->where('id', $id)
            //     ->first();
            // $Salehistory = ItemOemPartModeles::where('id', $id)->with('invoiceChild')
            //     // ->with(['invoiceChild' => function ($query) {
            //     //     $query->orderBy('id', 'DESC');
            //     // }])
            //     // ->with('invoiceChild.invoice')
            //     ->first();

            $customersalehistory = ItemOemPartModeles::with(['invoiceChild' => function ($query) use ($customer_id) {
                $query->whereHas('invoice', function ($query) use ($customer_id) {
                    $query->where([['customer_id', $customer_id], ['customer_id', '!=', null]]);
                    // ->orderBy('date', 'DESC');
                });
            }])->where('id', $id)
                ->first() ?? [];
            // return ['Salehistory' => $Salehistory];
            return ['Salehistory' => $Salehistory, 'customersalehistory' => $customersalehistory];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public function getSalesFiltersApis(Request $req)
    {
        $rules = array(
            //  'item_id' => 'required',
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

        $subcategory_id = $req->sub_category_id;
        $type_id = $req->type_id1;
        $category_id = $req->category_id;
        $store_type_id = $req->store_type_id;
        $machine_part_id = $req->machine_part_id;
        try {
            $machineParts = MachinePart::with('subcategories')
                ->where('user_id', $user_id) // user_id

                ->when($subcategory_id, function ($query) use ($subcategory_id) {
                    $query->where('sub_category_id', $subcategory_id);
                })
                ->when($category_id, function ($query) use ($category_id) {
                    $query->whereHas('subcategories', fn($q) => $q->where('category_id', '=', $category_id));
                })
                ->when($type_id, function ($query) use ($type_id) {
                    $query->where('type_id', $type_id);
                })
                ->orderBy('name')
                ->get();
            $categories = Category::orderBy('name')
                ->where('user_id', $user_id) // user_id
                ->get();
            $subcategories = SubCategory::when($category_id, function ($q, $category_id) {
                return $q->where('category_id', $category_id);
            })
                ->where('user_id', $user_id) // user_id
                ->get();
            if ($req->isActive == 0 && $req->isActive != null) {
                $isActive = '00';
            } elseif ($req->isActive == 1) {
                $isActive = 1;
            } else {
                $isActive = '';
            }

            $persons = Person::with('peoplePersonType.personType')
                ->where('user_id', $user_id)
                ->whereHas('peoplePersonType', function ($query) use ($req) {
                    $query->when($req->person_type_id, function ($query) use ($req) {
                        return $query->where('person_type_id', $req->person_type_id);
                    });
                })
                ->orderBy('name')->get();
            $storeType = StoreType::where('user_id', $user_id) // user_id
                ->orderBy('id')->get();
            $store = Store::when($store_type_id, function ($q, $store_type_id) {
                return $q->where('store_type_id', $store_type_id);
            })
                ->where('user_id', $user_id) // user_id
                ->orderBy('id')->get();
            $machinepartmodel = MachinePartModel::when($machine_part_id, function ($query) use ($machine_part_id) {
                $query->where('machine_part_id', $machine_part_id);
            })
                ->orderBy('name')->get();
            return ['status' => 'ok', 'machine_Parts' => $machineParts, 'categories' => $categories, 'subcategories' => $subcategories, 'persons' => $persons, 'storeType' => $storeType, 'store' => $store, 'machinepartmodel' => $machinepartmodel];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public function getSalesReportBrandwise(Request $req)
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

        $sale_type = $req->sale_type;
        $walk_in_customer_name = $req->walk_in_customer_name;
        $customer_id = $req->customer_id;
        $brand_id = $req->brand_id;
        $store_id = $req->store_id;
        $from = $req->from;
        $to = $req->to;
        try {
            $invoices = Company::with(['item' => function ($query) use ($sale_type, $from, $to) {
                if (!empty($sale_type)) {
                    $query->with(['invoiceChild' => function ($query) use ($sale_type) {
                        $query->whereHas('invoice', function ($query) use ($sale_type) {
                            $query->where('sale_type', $sale_type);
                        });
                    }]);
                }
                if (!empty($from)) {
                    $query->with(['invoiceChild' => function ($query) use ($from, $to) {
                        $query->whereHas('invoice', function ($query) use ($from, $to) {
                            $query->whereBetween('date', [$from, $to]);
                        });
                    }]);
                }
            }])

                ->when($store_id, function ($query, $store_id) {
                    $query->with('item.invoiceChild.invoice', function ($query) use ($store_id) {
                        $query->where('store_id', $store_id);
                    });
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->with('item.invoiceChild.invoice', function ($query) use ($customer_id) {
                        $query->where('customer_id', $customer_id);
                    });
                })
                ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
                    $query->with('item.invoiceChild.invoice', function ($query) use ($walk_in_customer_name) {
                        $query->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
                    });
                })
                ->when($brand_id, function ($query) use ($brand_id) {
                    $query->where('id', $brand_id);
                })
                ->where('user_id', $user_id) // user_id
                ->get();

            return ['invoices' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public function getSalesReportCustomerWise(Request $req)
    {
        $sale_type = $req->sale_type;
        $walk_in_customer_name = $req->walk_in_customer_name;
        $customer_id = $req->customer_id;
        $brand_id = $req->brand_id;
        $store_id = $req->store_id;
        $from = $req->from;
        $to = $req->to;
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
            $invoices = Person::with('invoice', 'peoplePersonType', 'coaAccount2')
                ->where('user_id', $user_id) // user_id

                ->when($from && $to, function ($query) use ($from, $to) {
                    $query->with('invoice', function ($query) use ($from, $to) {
                        $query->whereBetween('date', [$from, $to]);
                    });
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->where('id', $customer_id);
                })
                ->when($store_id, function ($query, $store_id) {
                    $query->wherehas('invoice', function ($query) use ($store_id) {
                        $query->where('store_id', $store_id);
                    });
                })
                ->when($sale_type, function ($query, $sale_type) {
                    $query->whereHas('invoice', function ($query) use ($sale_type) {
                        $query->where('sale_type', $sale_type);
                    });
                })
                ->when($brand_id, function ($query, $brand_id) {
                    $query->whereHas('invoice.invoiceChild.item', function ($query) use ($brand_id) {
                        $query->where('brand_id', $brand_id);
                    });
                })
                ->wherehas('peoplePersonType', function ($query) use ($store_id) {
                    $query->where('person_type_id', 1);
                })

                ->get();
            // $coa_id=CoaAccount::where('')
            // $coaAccountLedgerBal = CoaAccount::getCoaAccountBal($plot->coa_account_id);

            return ['invoices' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    public function initiatePendingInvoices(Request $request)
    {
        // $rules = array(
        //     'date'          => 'required',
        //     'store_id' => 'required|numeric',
        //     'total_amount' => 'required|numeric',
        //     // 'discount' => 'required|numeric',
        //     'total_after_discount' => 'required|numeric',
        //     'list'           => 'required|array',
        //     'list.*.item_id'     => 'required|numeric',
        //     'list.*.qty'  => 'required|numeric',
        // );
        // $validator = Validator::make($request->all(), $rules);
        // if ($validator->fails()) {
        //     return ['status' => 'error', 'message' => $validator->errors()->first()];
        // }
        // try {
        // DB::transaction(function () use ($request) {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $pending_invoices = Invoice::where('is_pending', 1)->where('user_id', $user_id)->get();
        foreach ($pending_invoices as $invoices) {
            $invoice_id = $invoices->id;
            $invoice_no = 'INO-' . $invoice_id;
            $remarks = " Purchase Order ";
            $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucherInventoryCost = new Voucher();
            $voucherInventoryCost->voucher_no = $newVoucherNo;
            $voucherInventoryCost->date = $request->date;
            $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
            $voucherInventoryCost->invoice_id = $invoice_id;
            $voucherInventoryCost->type = 3;
            $voucherInventoryCost->user_id = $user_id; //user id
            $voucherInventoryCost->isApproved = 1;
            $voucherInventoryCost->generated_at = $request->date;
            $voucherInventoryCost->total_amount = $invoices->total_after_discount;
            $voucherInventoryCost->is_auto = 1;
            $voucherInventoryCost->save();
            $voucherInvCost_id = $voucherInventoryCost->id;
            $debitside = 0;
            $creditside = 0;
            $totalAvgPrice = 0;
            $price = 0;
            $totalCashSaleVoucher = 0;
            $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->where('user_id', $user_id)->get();
            foreach ($invoicechild as $invoicechild) {
                $item_id = $invoicechild->item_id;
                $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                $AvgPrice = PurchaseOrderChild::getStoredAverageCost($item_id);
                $updated_avg_price = $AvgPrice;
                $quantity = $invoicechild->quantity;
                $invoicechild->cost = $updated_avg_price;
                $invoicechild->save();

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 1;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $updated_avg_price * $quantity;
                $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($updated_avg_price) . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $updated_avg_price * $quantity;

                //   --------------Cost debiting --------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
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
                $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherRevenueGen = new Voucher();
                $voucherRevenueGen->voucher_no = $newVoucherNo;
                $voucherRevenueGen->date = $request->date;
                $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
                $voucherRevenueGen->invoice_id = $invoice_id;
                $voucherRevenueGen->type = 2;
                $voucherRevenueGen->isApproved = 1;
                $voucherRevenueGen->generated_at = $request->date;
                $voucherRevenueGen->total_amount = $invoices->total_after_discount;
                $voucherRevenueGen->is_auto = 1;
                $voucherRevenueGen->user_id = $user_id; //user id

                $voucherRevenueGen->save();
                $voucherRevenueGenid = $voucherRevenueGen->id;
                $voucherRevGen_id = $voucherRevenueGen->id;
                $invoicechild = InvoiceChild::where('user_id', $user_id)->where('invoice_id', $invoice_id)->get();
                foreach ($invoicechild as $invoicechild) {
                    $item_id = $invoicechild->item_id;
                    $price = $invoicechild->price;
                    $quantity = $invoicechild->quantity;
                    $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();

                    $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 4;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $price * $quantity;
                    $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $price . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $price * $quantity;
                }

                $totalCashSaleVoucher += $invoices->received_amount;
                //---------------------Cash 1 Debit ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 5;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->debit = $invoices->received_amount;
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                $voucherTransaction->save();
                $debitside += $invoices->received_amount;
                ///////gst voucher
                if ($invoices->gst > 0) {
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 23;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $invoices->gst;
                    $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $invoices->gst;
                }
                if ($invoices->discount > 0) {
                    $totalCashSaleVoucher += $invoices->discount;

                    //---------------------Debiting discount Expense   ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $invoices->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $invoices->discount;
                }
                $voucher = Voucher::find($voucherRevenueGenid);
                $voucher->total_amount = $totalCashSaleVoucher;
                $voucher->save();
            } else {
                ///////////////////
                $customer_account = CoaAccount::where('person_id', $invoices->customer_id)
                    ->where('coa_sub_group_id', 9)->first();
                $customer_account_id = $customer_account->id;

                //////////
                foreach ($invoicechild as $invoicechild) {
                    $item_id = $invoicechild->item_id;
                    $price2 = $invoicechild->price;
                    $quantity = $invoicechild->quantity;
                    $price += $price2 * $quantity;
                    $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();

                    $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
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
                    $voucherTransaction->date = $request->date;
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
                    $voucherTransaction->date = $request->date;
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
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 28;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $invoices->discount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $invoices->discount;
                }
                if ($invoices->received_amount > 0) {
                    // $totalCashSaleVoucher += $request->amount_received;
                    $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucherRevenueGen = new Voucher();
                    $voucherRevenueGen->voucher_no = $newVoucherNo;
                    $voucherRevenueGen->date = $request->date;
                    $voucherRevenueGen->name = "Customer Amount Received ";
                    $voucherRevenueGen->invoice_id = $invoice_id;
                    $voucherRevenueGen->type = 2;
                    $voucherRevenueGen->isApproved = 1;
                    $voucherRevenueGen->generated_at = $request->date;
                    $voucherRevenueGen->user_id = $user_id; //user id
                    $voucherRevenueGen->total_amount = $invoices->received_amount;
                    $voucherRevenueGen->is_auto = 1;
                    $voucherRevenueGen->save();
                    $voucherRevGen_id = $voucherRevenueGen->id;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = $customer_account_id;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->credit = $invoices->received_amount;
                    $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $creditside += $invoices->received_amount;

                    //---------------------Cash 1 Debit ------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 5;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->debit = $invoices->received_amount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                    $voucherTransaction->save();
                    $debitside += $invoices->received_amount;
                    // $price2 * $quantity
                }
                ///////gst voucher
                if ($invoices->gst > 0) {
                    // $totalCreditSaleVoucher += $request->gst;

                    //---------------------Crediting Reneve ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
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
                    $voucherTransaction->date = $request->date;
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
                    throw new \Exception('debit and credit sides are not equal'. $creditside . '---- ' . $debitside);
                }
                // $voucher = voucher::find($voucherInvCost_id);
                // $voucher->total_amount = $request->gst + $totalAvgPrice + $price + $request->discount;
                // $voucher->save();
            }
        }
        // } catch (\Exception $e) {
        //     return ['status' => 'error', 'message' => $e->getMessage()];
        // }
    }
    public function initiateNegativeInventoryPendingInvoices(Request $request)
    {
        // $rules = array(
        //     'date'          => 'required',
        //     'store_id' => 'required|numeric',
        //     'total_amount' => 'required|numeric',
        //     // 'discount' => 'required|numeric',
        //     'total_after_discount' => 'required|numeric',
        //     'list'           => 'required|array',
        //     'list.*.item_id'     => 'required|numeric',
        //     'list.*.qty'  => 'required|numeric',
        // );
        // $validator = Validator::make($request->all(), $rules);
        // if ($validator->fails()) {
        //     return ['status' => 'error', 'message' => $validator->errors()->first()];
        // }
        // try {
        // DB::transaction(function () use ($request) {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $store_id = 1;
        $pending_invoices = Invoice::where('is_pending_neg_inventory', 1)->where('user_id', $user_id)->get();
        foreach ($pending_invoices as $invoices) {
            $invoice_id = $invoices->id;
            $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->where('user_id', $user_id)->get();
            foreach ($invoicechild as $invoicechild) {
                $item_id = $invoicechild->item_id;
                $quantity = $invoicechild->quantity;
                $stock = Iteminventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                    ->where('store_id', $store_id)->where('item_id', $item_id)->first();
                $available_stock = $stock->quantity;
                if ($available_stock >= $quantity) {
                    $check = true;
                } else {
                    $check = false;
                    break;
                }
            }
            // }

            // foreach ($pending_invoices as $invoices) {
            if ($check == true) {
                $invoice_id = $invoices->id;
                $invoice_no = 'INO-' . $invoice_id;
                $remarks = " Purchase Order ";
                $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                $voucherInventoryCost = new Voucher();
                $voucherInventoryCost->voucher_no = $newVoucherNo;
                $voucherInventoryCost->date = $request->date;
                $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
                $voucherInventoryCost->invoice_id = $invoice_id;
                $voucherInventoryCost->type = 3;
                $voucherInventoryCost->user_id = $user_id; //user id
                $voucherInventoryCost->isApproved = 1;
                $voucherInventoryCost->generated_at = $request->date;
                $voucherInventoryCost->total_amount = $invoices->total_after_discount;
                $voucherInventoryCost->is_auto = 1;
                $voucherInventoryCost->save();
                $voucherInvCost_id = $voucherInventoryCost->id;
                $debitside = 0;
                $creditside = 0;
                $totalAvgPrice = 0;
                $price = 0;
                $totalCashSaleVoucher = 0;
                $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->where('user_id', $user_id)->get();
                foreach ($invoicechild as $invoicechild) {
                    $item_id = $invoicechild->item_id;
                    $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                    $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                    $AvgPrice = PurchaseOrderChild::getStoredAverageCost($item_id);
                    $updated_avg_price = $AvgPrice;
                    $quantity = $invoicechild->quantity;
                    $invoicechild->cost = $updated_avg_price;
                    $invoicechild->save();

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherInvCost_id;
                    $voucherTransaction->date = $request->date;
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
                    $voucherTransaction->date = $request->date;
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
                    $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucherRevenueGen = new Voucher();
                    $voucherRevenueGen->voucher_no = $newVoucherNo;
                    $voucherRevenueGen->date = $request->date;
                    $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
                    $voucherRevenueGen->invoice_id = $invoice_id;
                    $voucherRevenueGen->type = 2;
                    $voucherRevenueGen->isApproved = 1;
                    $voucherRevenueGen->generated_at = $request->date;
                    $voucherRevenueGen->total_amount = $invoices->total_after_discount;
                    $voucherRevenueGen->is_auto = 1;
                    $voucherRevenueGen->user_id = $user_id; //user id
                    $voucherRevenueGen->save();
                    $voucherRevenueGenid = $voucherRevenueGen->id;
                    $voucherRevGen_id = $voucherRevenueGen->id;
                    $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->where('user_id', $user_id)->get();
                    foreach ($invoicechild as $invoicechild) {
                        $item_id = $invoicechild->item_id;
                        $price = $invoicechild->price;
                        $quantity = $invoicechild->quantity;
                        $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                        $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 4;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $price * $quantity;
                        $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $price . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $price * $quantity;
                    }

                    $totalCashSaleVoucher += $invoices->received_amount;
                    //---------------------Cash 1 Debit ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucherRevGen_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 5;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = $invoices->received_amount;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                    $voucherTransaction->save();
                    $debitside += $invoices->received_amount;
                    ///////gst voucher
                    if ($invoices->gst > 0) {
                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 23;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $invoices->gst;
                        $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $invoices->gst;
                    }
                    if ($invoices->discount > 0) {
                        $totalCashSaleVoucher += $invoices->discount;

                        //---------------------Debiting discount Expense   ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 28;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $invoices->discount;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $invoices->discount;
                    }
                    $voucher = Voucher::find($voucherRevenueGenid);
                    $voucher->total_amount = $totalCashSaleVoucher;
                    $voucher->save();
                } else {
                    ///////////////////
                    $customer_account = CoaAccount::where('person_id', $invoices->customer_id)
                        ->where('coa_sub_group_id', 9)->first();
                    $customer_account_id = $customer_account->id;

                    //////////
                    //   $invoicechild->item_id;
                    $invoicechild = InvoiceChild::where('invoice_id', $invoice_id)->where('user_id', $user_id)->get();
                    foreach ($invoicechild as $invoicechild) {
                        $item_id = $invoicechild->item_id;
                        $price2 = $invoicechild->price;
                        $quantity = $invoicechild->quantity;
                        $price += $price2 * $quantity;
                        $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $item_id)->groupby('item_id')->select(DB::raw('SUM(amount) / SUM(quantity) as AvgPrice'), 'item_id')->first();
                        $itemName = ItemOemPartModeles::where('id', $item_id)->value('name');
                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $request->date;
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
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $price2 * $quantity;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $price2 * $quantity;
                    }

                    if ($invoices->discount > 0) {
                        // $totalCreditSaleVoucher += $request->discount;
                        //---------------------Crediting Customer Account Deu To discount ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $request->date;
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
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 28;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $invoices->discount;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $invoices->discount;
                    }
                    if ($invoices->received_amount > 0) {
                        // $totalCashSaleVoucher += $request->amount_received;
                        $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucherRevenueGen = new Voucher();
                        $voucherRevenueGen->voucher_no = $newVoucherNo;
                        $voucherRevenueGen->date = $request->date;
                        $voucherRevenueGen->name = "Customer Amount Received ";
                        $voucherRevenueGen->invoice_id = $invoice_id;
                        $voucherRevenueGen->type = 2;
                        $voucherRevenueGen->isApproved = 1;
                        $voucherRevenueGen->user_id = $user_id; //user id
                        $voucherRevenueGen->generated_at = $request->date;
                        $voucherRevenueGen->total_amount = $invoices->received_amount;

                        $voucherRevenueGen->is_auto = 1;

                        $voucherRevenueGen->save();
                        $voucherRevGen_id = $voucherRevenueGen->id;

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherRevenueGen->user_id = $user_id; //user id
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $invoices->received_amount;
                        $voucherTransaction->description = "Amount received against " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $invoices->received_amount;

                        //---------------------Cash 1 Debit ------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = $request->date;
                        $voucherRevenueGen->user_id = $user_id; //user id
                        $voucherTransaction->coa_account_id = 5;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $invoices->received_amount;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = $itemName . " " . " sold . " . '' . "Rate: " . '' . $price2 . ' ' . "," . ' ' . "Qty" . " " . $quantity . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $invoices->received_amount;
                        // $price2 * $quantity
                    }
                    ///////gst voucher
                    if ($invoices->gst > 0) {
                        // $totalCreditSaleVoucher += $request->gst;

                        //---------------------Crediting Reneve ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->coa_account_id = 23;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $invoices->gst;
                        $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $invoices->gst;
                        //---------------------Cash 1 Debit ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = $customer_account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $invoices->gst;
                        $voucherTransaction->user_id = $user_id; //user id
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $invoices->gst;
                    }
                    if ($creditside != $debitside) {
                        throw new \Exception('debit and credit sides are not equal'. $creditside . '---- ' . $debitside);
                    }
                    // $voucher = voucher::find($voucherInvCost_id);
                    // $voucher->total_amount = $request->gst + $totalAvgPrice + $price + $request->discount;
                    // $voucher->save();
                }
                $invoices->is_pending = 0;
                $invoices->save();
            }
        }
        // } catch (\Exception $e) {
        //     return ['status' => 'error', 'message' => $e->getMessage()];
        // }
    }
    public function getSalesReportBrandwiseCount(Request $req)
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

        $sale_type = $req->sale_type;
        $walk_in_customer_name = $req->walk_in_customer_name;
        $customer_id = $req->customer_id;
        $brand_id = $req->brand_id;
        $store_id = $req->store_id;
        $from = $req->from;
        $to = $req->to;

        try {
            //  $invoices=ItemOemPartModeles::with('invoiceChildCount')->get();
            $invoices = Company::with('item2')
                ->where('user_id', $user_id) // user_id

                ->when($store_id, function ($query, $store_id) {
                    $query->whereHas('item.invoiceChild.invoice', function ($query) use ($store_id) {
                        $query->where('store_id', $store_id);
                    });
                })
                ->when($sale_type, function ($query, $sale_type) {
                    $query->whereHas('item.invoiceChild.invoice', function ($query) use ($sale_type) {
                        $query->where('sale_type', $sale_type);
                    });
                })
                ->when($from && $to, function ($query) use ($from, $to) {

                    $query->whereHas('item.invoiceChild.invoice', function ($query) use ($from, $to) {
                        return $query->whereBetween('date', [$from, $to]);
                    });
                })
                ->when($customer_id, function ($query, $customer_id) {
                    $query->whereHas('item.invoiceChild.invoice', function ($query) use ($customer_id) {
                        $query->where('customer_id', $customer_id);
                    });
                })
                ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
                    $query->whereHas('item.invoiceChild.invoice', function ($query) use ($walk_in_customer_name) {
                        $query->where('walk_in_customer_name', 'LIKE', '%' . $walk_in_customer_name . '%');
                    });
                })
                ->when($brand_id, function ($query) use ($brand_id) {
                    $query->where('id', $brand_id);
                })
                ->get();

            return ['invoices' => $invoices];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
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
