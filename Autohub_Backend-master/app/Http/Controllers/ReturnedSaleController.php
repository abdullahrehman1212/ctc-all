<?php

namespace App\Http\Controllers;

use App\Models\CoaAccount;
use App\Models\Invoice;
use App\Models\InvoiceChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\Person;
use App\Models\ReturnedSale;
use App\Models\ReturnedSaleChild;
use App\Models\ReturnSaleRackShelf;
use App\Models\SaleHistory;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReturnedSaleController extends Controller
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
            $returnedsales = ReturnedSale::with('invoice', 'returnSaleChild')
                ->where('user_id', $user_id) // Filter by user_id
                ->when($machine_part_id, function ($query) use ($machine_part_id) {
                    // Ensure that 'returnSaleChild.item' exists and matches the given machine_part_id
                    $query->whereHas('returnSaleChild.item', function ($query) use ($machine_part_id) {
                        $query->where('id', $machine_part_id);
                    });
                })

                ->when($type_id, function ($query, $type_id) {
                    $query->with('returnSaleChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                    $query->whereHas('returnSaleChild.item.machinePartOemPart.machinePart', function ($query) use ($type_id) {
                        $query->where('type_id', $type_id);
                    });
                })
                ->when($store_id, function ($query) use ($store_id) {
                    $query->where('store_id', $store_id);
                })

                ->when($customer_id, function ($query, $customer_id) {
                    $query->with('invoice', function ($query) use ($customer_id) {
                        $query->where('customer_id', $customer_id);
                    });
                    $query->whereHas('invoice', function ($query) use ($customer_id) {
                        $query->where('customer_id', $customer_id);
                    });
                })
                ->when($walk_in_customer_name, function ($query, $walk_in_customer_name) {
                    $query->with('invoice', function ($query) use ($walk_in_customer_name) {
                        $query->where('walk_in_customer_name', $walk_in_customer_name);
                    });
                    $query->whereHas('invoice', function ($query) use ($walk_in_customer_name) {
                        $query->where('walk_in_customer_name', $walk_in_customer_name);
                    });
                })
                ->when($from, function ($q, $from) {
                    return $q->where('created_at', '>=', $from);
                })
                ->when($to, function ($q, $to) {
                    return $q->where('created_at', '<=', $to);
                })
                ->orderBy($req->colName, $req->sort)
                ->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['returnedsales' => $returnedsales];
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
     * returning sale
     *


     *@param \Illuminate\Http\Request customer_id
     *@param \Illuminate\Http\Request walk_in_customer_name
     *@param \Illuminate\Http\Request remarks
     *@param \Illuminate\Http\Request total_amount
     *@param \Illuminate\Http\Request discount
     *@param \Illuminate\Http\Request total_after_discount
     *@param \Illuminate\Http\Request amount_received
     *@param \Illuminate\Http\Request return_date
     *@param \Illuminate\Http\Request list
     *@param \Illuminate\Http\Request item_id
     *@param \Illuminate\Http\Request qty
     *@param  \Illuminate\Http\Request price
     *@return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
// dd("d");
        $rules = array(
            'childArray' => 'required|array',
            'childArray.*.item_id' => 'required|numeric',
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
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        try {
            if ($request->amount_received + $request->bank_amount_received != $request->total_after_gst && $request->sale_type == 1) {
                return ['status' => 'error', 'message' => "Total amount must be received"];
            }
            $return_invoice_id = $request->id;
            $check = "";
            foreach ($request->childArray as $row) {
                $itemId = $row['item_id'];

                $invoiceChild = InvoiceChild::where(['invoice_id' => $request->id, 'item_id' => $itemId])->sum('quantity');
                $returninvoiceid = ReturnedSale::where('inv_id', $request->id)->get();

                $return_qty = 0;
                $newQty = 0;
                if ($returninvoiceid) {
                    foreach ($returninvoiceid as $childReturn) {
                        $return_qty = ReturnedSaleChild::where('returned_sales_id', $childReturn->id)
                            ->where('item_id', $itemId)
                            ->value('quantity');
                        $newQty += $return_qty;
                    }
                    $return_qty = $newQty;
                    if (empty($return_qty)) {
                        $totalReturnQuantity = 0 + $row['quantity'];
                    } else {
                        $totalReturnQuantity = $return_qty + $row['quantity'];
                    }
                } else {
                    $totalReturnQuantity = 0;
                }
                if (!($totalReturnQuantity <= $invoiceChild)) {
                    $check = "less";
                }

            }
            // if ($row['quantity'] > $row['sold_quantity'] - $return_qty) {
            //     return ['status' => 'error', 'message' => "Return quantity is greater than qty available for return: " . $row['sold_quantity'] - $return_qty];
            // }

            // $invno = $request->id;
            $invoiceChildren = InvoiceChild::where('invoice_id', $return_invoice_id)->get();

            // Group the amounts and quantities for each item
            $groupedItems = [];

            foreach ($request->childArray as $row) {
                $itemId = $row['item_id'];

                if (!isset($groupedItems[$itemId])) {
                    $groupedItems[$itemId] = [
                        'total_amount' => 0,
                        'total_quantity' => 0,
                    ];
                }

                $groupedItems[$itemId]['total_quantity'] += $row['quantity'];
            }
// dd($groupedItems);
            foreach ($groupedItems as $itemId => $data) {
                $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                $totalAmountItem = 0;

                $item = ItemOemPartModeles::where('id', $itemId)->first();
                if ($item) {
                    $itemCost = $item->avg_cost;
                    $totalAmountItem = $stockQty * $itemCost;
                }

                $totalQuantity = $data['total_quantity'];
                $totalAmount = $row['avg_price'] * $totalQuantity;

                // dd($totalAmountItem + $totalAmount , $stockQty, $totalQuantity);
                $averagePrice = ($totalAmountItem + $totalAmount) / ($stockQty + $totalQuantity);

                // dd($averagePrice);
                // Update the item's average cost
                $itemUpdate = ItemOemPartModeles::where('id', $itemId)->first();
                if ($itemUpdate) {
                    $itemUpdate->avg_cost = $averagePrice;
                    $itemUpdate->save();
                }
            }
            DB::transaction(function () use ($request, $user_id) {
                $date = $request->date;
                $customer_account_id = 0;
                if ($request->sale_type == 2) {
                    $customer_account = CoaAccount::where('person_id', $request->customer_id)
                        ->where('coa_sub_group_id', 9)->first();
                    $customer_account_id = $customer_account->id;
                }
                $invoice = new ReturnedSale();
                $invoice->inv_id = $request->id;
                $invoice->return_date = $date;
                $invoice->total_amount = $request->total_amount;
                $invoice->store_id = $request->store_id;
                $invoice->deduction = $request->discount;
                $invoice->total_after_discount = $request->total_after_discount;
                $invoice->gst = $request->gst;
                $invoice->gst_percentage = $request->gst_percentage;
                $invoice->total_after_gst = $request->total_after_gst;
                $invoice->received_amount = $request->amount_received ?? 0;
                $invoice->bank_received_amount = $request->bank_amount_received ?? 0;
                $invoice->account_id = $request->account_id;
                $invoice->bank_account_id = $request->bank_account_id;
                $invoice->user_id = $user_id; //user id
                $invoice->save();
                $return_invoice_id = $invoice->id;
                $invoice_id = $request->id;
                $invoice_number = Invoice::select('invoice_no')->where('id', $request->id)->first();
                $invoice_no = $invoice_number->invoice_no;
                $remarks = " Purchase Order ";
                $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
                $customer_id = Person::where('id', $request->customer_id)->value('name');

                $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                foreach ($request->childArray as $row) {

                    $invoiceChild = new ReturnedSaleChild();
                    $invoiceChild->returned_sales_id = $return_invoice_id;
                    $invoiceChild->item_id = $row['item_id'];
                    $invoiceChild->quantity = $row['quantity'];
                    $invoiceChild->price = $row['price'];
                    $invoiceChild->user_id = $user_id;
                    $invoiceChild->cost = $row['avg_price'];
                    $invoiceChild->save();

                    foreach ($row['rackShelf'] as &$rackData) {

                        ReturnSaleRackShelf::create([
                            'return_inv_id' => $invoiceChild->id,
                            'store_id' => $request->store_id,
                            'item_id' => $row['item_id'],
                            'rack_id' => $rackData['rack_id'],
                            'shelf_id' => $rackData['shelf_id'],
                            'quantity' => $rackData['quantity'],
                            'returned_sales_id' => $return_invoice_id,
                            'checked' => $rackData['checked'],
                            'user_id' => $user_id,
                        ]);
                        $invoiceChildId = $invoiceChild->id;
                        $stockChildData = new ItemInventory();
                        $stockChildData->inventory_type_id = 4;
                        $stockChildData->item_id = $row['item_id'];
                        $stockChildData->invoice_id = $invoice_id;
                        $stockChildData->rack_id = $rackData['rack_id'];
                        $stockChildData->shelf_id = $rackData['shelf_id'];
                        $stockChildData->store_id = $request->store_id;
                        $stockChildData->quantity_in = $row['quantity'];
                        $stockChildData->date = $request->date;
                        $stockChildData->user_id = $user_id; //user id
                        $stockChildData->return_child_invoice_id = $invoiceChildId;
                        $stockChildData->save();
                    }

                    if (!isset($row['rackShelf']) || empty($row['rackShelf'])) {
                        $invoiceChildId = $invoiceChild->id;
                        $stockChilddata = new ItemInventory();
                        $stockChilddata->return_child_invoice_id = $invoiceChildId;
                        $stockChilddata->inventory_type_id = 4;
                        $stockChilddata->item_id = $row['item_id'];
                        $stockChilddata->store_id = $request->store_id;
                        $stockChilddata->quantity_in = $row['quantity'];
                        $stockChilddata->date = $request->date;
                        $stockChilddata->user_id = $user_id; //user id
                        $stockChilddata->save();
                    }
                }

                $invoiceOriginal = Invoice::where('id', $invoice_id)->first();

                // restricting cost voucher if invoice is pending (pending Negative inventory or pending po)
                if ($invoiceOriginal->is_pending_neg_inventory == 0 && $invoiceOriginal->is_pending == 0) {

                    $this->doCostVoucher($request, $return_invoice_id, $invoice_no, $customer_account_id);
                }

                //// receipt voucher revenue
                if ($request->sale_type == 1) {
                    $this->ReceiptVoucherForWalkinCustomer($request, $return_invoice_id, $invoice_no, $is_post_dated);
                } else {
                    $this->ReceiptVoucherForRegisteredCustomer($request, $return_invoice_id, $invoice_no, $is_post_dated, $customer_account_id);
                }
            });

            return ['status' => "ok", 'message' => 'Invoice Stored Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    private function ReceiptVoucherForRegisteredCustomer($request, $return_invoice_id, $invoice_no, $is_post_dated, $customer_account_id)
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
        $debitside = 0;
        $creditside = 0;
        if (($request->amount_received) + ($request->bank_amount_received) > 0) {
            $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

            $voucherRevenueGen = new Voucher();
            $voucherRevenueGen->voucher_no = $newVoucherNo;
            $voucherRevenueGen->date = $request->date;
            $voucherRevenueGen->name = "Return Invoice no: " . $invoice_no . " Amount Returned";
            $voucherRevenueGen->return_invoice_id
            = $return_invoice_id;
            $voucherRevenueGen->type = 2;
            $voucherRevenueGen->isApproved = 1;
            $voucherRevenueGen->generated_at = $request->date;
            $voucherRevenueGen->total_amount = $request->amount_received + $request->bank_amount_received;
            $voucherRevenueGen->cheque_no = $request->cheque_no;
            $voucherRevenueGen->cheque_date = $request->cheque_date;
            $voucherRevenueGen->is_post_dated = $is_post_dated;
            $voucherRevenueGen->is_auto = 1;
            $voucherRevenueGen->user_id = $user_id; //user id
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
                $voucherTransaction->debit = $request->amount_received;
                $voucherTransaction->credit = 0;
                $voucherTransaction->description = "Amount Paid against Returned " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->save();
                $debitside += $request->amount_received;

                //---------------------Cash 1 Debit ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->amount_received;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Amount Paid against Returned " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->amount_received;
            }
            ///bank
            if ($request->bank_amount_received > 0) {

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->bank_amount_received;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Amount Paid against Returned " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->bank_amount_received;

                //---------------------Cash 1 Debit ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherRevGen_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $request->bank_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->bank_amount_received;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Amount Paid against Returned " . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->bank_amount_received;
            }
        }
        ///////gst voucher

        if ($creditside == $debitside) {

            // $voucher = voucher::find($voucherInvCost_id);
            // $voucher->total_amount = $debitside;
            // $voucher->save();
        } else {
            throw new \Exception('debit and credit sides are not equal' . $creditside . '/' . $debitside);
        }
    }
    private function ReceiptVoucherForWalkinCustomer($request, $return_invoice_id, $invoice_no, $is_post_dated)
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
        $debitside = 0;
        $creditside = 0;

        $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

        $voucherRevenueGen = new Voucher();
        $voucherRevenueGen->voucher_no = $newVoucherNo;
        $voucherRevenueGen->date = $request->date;
        $voucherRevenueGen->name = "Revenue Reversed For Return Invoice" . " ,Invoice no: " . $invoice_no;
        $voucherRevenueGen->return_invoice_id
        = $return_invoice_id;
        $voucherRevenueGen->type = 2;
        $voucherRevenueGen->isApproved = 1;
        $voucherRevenueGen->generated_at = $request->date;
        $voucherRevenueGen->total_amount = $request->total_after_discount;
        $voucherRevenueGen->cheque_no = $request->cheque_no;
        $voucherRevenueGen->cheque_date = $request->cheque_date;
        $voucherRevenueGen->is_post_dated = $is_post_dated;
        $voucherRevenueGen->is_auto = 1;
        $voucherRevenueGen->user_id = $user_id; //user id
        $voucherRevenueGen->save();
        $voucherRevenueGenid = $voucherRevenueGen->id;
        $voucherRevGen_id = $voucherRevenueGen->id;
        foreach ($request->childArray as $list) {
            // $PurchasePrice = PurchaseOrderChild::with('item')->where('item_id', $list['item_id'])->groupby('item_id')->select(DB::raw('SUM(quantity) / (SUM(quantity )) as AvgPrice'), 'item_id')->first();

            $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');

            //---------------------Crediting Reneve ------------------
            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherRevGen_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = 4;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = $list['price'] * $list['quantity'];
            $voucherTransaction->credit = 0;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->description = $list['item_id'] . '-' . $itemName . "Batch NO." . " revenue reversed . " . '' . "Rate: " . '' . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $debitside += $list['price'] * $list['quantity'];
        }
        $totalCashSaleVoucher += $request->amount_received;
        if ($request->amount_received > 0) {
            //---------------------Cash 1 Debit ------------------
            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherRevGen_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = $request->account_id;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->credit = $request->amount_received;
            $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Paid ";
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->save();
            $creditside += $request->amount_received;
        }
        if ($request->bank_amount_received > 0) {
            //---------------------Bank Debit ------------------
            $totalCashSaleVoucher += $request->bank_amount_received;
            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherRevGen_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = $request->bank_account_id;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->credit = $request->bank_amount_received;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Paid By bank";
            $voucherTransaction->save();
            $creditside += $request->bank_amount_received;
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
            $voucherTransaction->debit = $request->gst;
            $voucherTransaction->credit = 0;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->description = "Gst Reversed " . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $debitside += $request->gst;
        }
    }
    private function doCostVoucher($request, $return_invoice_id, $invoice_no, $customer_account_id)
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

        $is_post_dated = isset($request->cheque_no) ? 1 : 0;
        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

        ///// cost jv voucher
        $voucherInventoryCost = new Voucher();
        $voucherInventoryCost->voucher_no = $newVoucherNo;
        $voucherInventoryCost->date = $request->date;
        $voucherInventoryCost->name = "Return Voucher Inventory Cost Reversed" . ", Invoice no: " . $invoice_no;
        $voucherInventoryCost->return_invoice_id
        = $return_invoice_id;
        $voucherInventoryCost->type = 3;
        $voucherInventoryCost->isApproved = 1;
        $voucherInventoryCost->generated_at = $request->date;
        $voucherInventoryCost->total_amount = 0;
        $voucherInventoryCost->cheque_no = $request->cheque_no;
        $voucherInventoryCost->cheque_date = $request->cheque_date;
        $voucherInventoryCost->is_post_dated = $is_post_dated;
        $voucherInventoryCost->is_auto = 1;
        $voucherInventoryCost->user_id = $user_id; //user id
        $voucherInventoryCost->save();
        $voucherInvCost_id = $voucherInventoryCost->id;
        $debitside = 0;
        $creditside = 0;
        $totalAvgPrice = 0;
        $price = 0;

        //  Start
        foreach ($request->childArray as $row) {

            $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');

            $totalAvgPrice += $row['avg_price'] * $row['quantity'];
            //   --------------Inventory credit  --------------------

            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherInvCost_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = 1;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = $row['avg_price'] * $row['quantity'];
            $voucherTransaction->credit = 0;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->description = $row['item_id'] . '-' . $itemName . " Inventory Returned. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $debitside += $row['avg_price'] * $row['quantity'];

            //   --------------Cost debiting --------------------

            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucherInvCost_id;
            $voucherTransaction->date = $request->date;
            $voucherTransaction->coa_account_id = 3;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->credit = $row['avg_price'] * $row['quantity'];
            $voucherTransaction->description = $row['item_id'] . '-' . $itemName . " Inventory Returned. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
            $voucherTransaction->save();
            $creditside += $row['avg_price'] * $row['quantity'];
        }
        if ($request->sale_type == 2) {

            foreach ($request->childArray as $list) {

                //   Unknown error
                // $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name');
                $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name');

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 4;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $list['price'] * $list['quantity'];
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = $list['item_id'] . '-' . $itemName . " Returned . " . '' . "Rate: " . '' . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $list['price'] * $list['quantity'];

                //---------------------Cash 1 Debit ------------------

                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->credit = $list['price'] * $list['quantity'];
                $voucherTransaction->description = $list['item_id'] . '-' . $itemName . "Batch NO." . " Returned . " . '' . "Rate: " . '' . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $list['price'] * $list['quantity'];
            }
            if ($request->gst > 0) {
                // $totalCreditSaleVoucher += $request->gst;

                //---------------------Crediting Reneve ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = 23;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = $request->gst;
                $voucherTransaction->credit = 0;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Gst Reversed" . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $debitside += $request->gst;
                //---------------------Cash 1 Debit ------------------
                $voucherTransaction = new VoucherTransaction();
                $voucherTransaction->voucher_id = $voucherInvCost_id;
                $voucherTransaction->date = $request->date;
                $voucherTransaction->coa_account_id = $customer_account_id;
                $voucherTransaction->is_approved = 1;
                $voucherTransaction->debit = 0;
                $voucherTransaction->credit = $request->gst;
                $voucherTransaction->user_id = $user_id; //user id
                $voucherTransaction->description = "Gst Reversed" . " ,Invoice no: " . $invoice_no;
                $voucherTransaction->save();
                $creditside += $request->gst;
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
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:returned_sales,id',
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
            $parentData = ReturnedSale::with('invoice')->find($req->id);

            $childData = ReturnedSaleChild::with('item')
            // ->where('user_id', $user_id)
                ->where('returned_sales_id', $req->id)->get();

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
    public function edit($id)
    {
        //
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
    // public function destroy(Request $request)
    // {

    //     $rules = array(
    //         'id' => 'required|int|exists:invoices_return,id',
    //     );

    //     $validator = Validator::make($request->all(), $rules);
    //     if ($validator->fails()) {
    //         return ['status' => 'error', 'message' => $validator->errors()->first()];
    //     }

    //     try {

    //         DB::transaction(function () use ($request) {
    //             $invno = $request->id;
    //             $ItemInventory = InvoiceChildReturn::where('invoice_id', $invno)->select('id')->get();

    //             if ($ItemInventory) {
    //                 foreach ($ItemInventory as  $ItemInventory) {
    //                     ItemInventory::where('return_invoice_id', $ItemInventory->id)->delete();
    //                 }
    //             }
    //         });
    //         InvoiceChildReturn::where(['invoice_id' => $request->id])->delete();
    //         $parentDelete = InvoiceReturn::where(['id' => $request->id])->delete();

    //         $voucher = voucher::where('return_invoice_id', $request->id)->select('id')->get();

    //         if (count($voucher) > 0) {

    //             foreach ($voucher as  $voucher) {
    //                 voucher::where('id', $voucher->id)->delete();
    //                 VoucherTransaction::where('voucher_id', $voucher->id)->delete();
    //             }
    //         } else {
    //             throw new \Exception('Voucher Not Found');
    //         }

    //         //  $ItemInventory = ItemInventory::with('invoicechild')->whereHas('invoicechild', function ($query) use ($invno) {
    //         //     $query->where('invoice_id', $invno);
    //         // })->get();

    //         return ['status' => 'ok', 'message' => 'Invoice Deleted Successfully'];
    //     } catch (\Exception $e) {
    //         return ['status' => 'error', 'message' => $e->getMessage()];
    //     }
    // }

    public function delete(Request $request)
    {
        $invno = $request->id;
        $returnSale = ReturnedSaleChild::where('returned_sales_id', $invno)->get();

        // Validate request input
        $rules = array(
            'id' => 'required|int',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {

            DB::transaction(function () use ($request) {
                $invno = $request->id;

                // Fetch all returned sale child items by returned_sales_id
                $returnedSaleChildren = ReturnedSaleChild::where('returned_sales_id', $invno)->get();

                // Group items by item_id
                $groupedItems = [];
                foreach ($returnedSaleChildren as $item) {
                    $itemId = $item->item_id;

                    if (!isset($groupedItems[$itemId])) {
                        $groupedItems[$itemId] = [
                            'total_quantity' => 0,
                            'total_cost' => 0,
                        ];
                    }

                    $groupedItems[$itemId]['total_quantity'] += $item->quantity;
                    $groupedItems[$itemId]['total_cost'] += $item->quantity * $item->cost;
                }
                // dd($groupedItems);
                // Process grouped items to update average cost
                foreach ($groupedItems as $itemId => $data) {
                    $quantity = $data['total_quantity'];
                    $returnTotalCost = $data['total_cost'];

                    // Get the current stock quantity and item details
                    $stockQty = ItemInventory::calculateTotalStockQty($itemId);
                    $itemUpdate = ItemOemPartModeles::find($itemId);

                    if ($itemUpdate) {
                        $itemAvgCost = $itemUpdate->avg_cost;

                        // Recalculate total cost and quantity
                        $totalCost = ($itemAvgCost * $stockQty) - $returnTotalCost;

                        $totalQuantity = $stockQty - $quantity;
                        // dd($totalCost , $totalQuantity);
                        // Prevent division by zero
                        $averagePrice = $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;

                        // Update the item's average cost
                        $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                }

                // Delete related ItemInventory records for each ReturnedSaleChild
                foreach ($returnedSaleChildren as $child) {
                    ItemInventory::where('return_child_invoice_id', $child->id)->delete();
                }

                // Delete ReturnedSaleChild records
                ReturnedSaleChild::where('returned_sales_id', $invno)->delete();

                // Delete the ReturnedSale parent record
                ReturnedSale::where('id', $invno)->delete();

                // Delete related vouchers and their transactions
                $vouchers = Voucher::where('return_invoice_id', $invno)->get();
                if ($vouchers->isNotEmpty()) {
                    foreach ($vouchers as $voucher) {
                        VoucherTransaction::where('voucher_id', $voucher->id)->delete();
                        $voucher->delete();
                    }
                } else {
                    throw new \Exception('Voucher Not Found');
                }
            });

            return ['status' => 'ok', 'message' => 'Returned Invoice Deleted Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    public function getReturnSaleInvoices(Request $req)
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

            $originalInvoice = Invoice::with('store', 'customer')->find($req->id);

            $originalInvoiceChild = InvoiceChild::with('item')
                ->where('user_id', $user_id) // user_id
                ->where('invoice_id', $req->id)->get();

            $parentData = ReturnedSale::with('invoice')
                ->whereHas('invoice', function ($query) use ($req) {
                    $query->where('id', $req->id);
                })
                ->get();

            $parentIds = $parentData->pluck('id');
            $childData = ReturnedSaleChild::with('item')
                ->where('user_id', $user_id) // user_id
                ->whereIn('returned_sales_id', $parentIds)
                ->get();

            $result = [];

            foreach ($parentData as $parent) {
                $parentRecord = ['parentData' => $parent->toArray()];
                $childRecords = $childData->where('returned_sales_id', $parent->id)->values()->toArray();
                $parentRecord['childData'] = $childRecords;
                $result[] = $parentRecord;
            }
            $originalInvoice->childData = $originalInvoiceChild;
            $originalInvoice->Salehistory = $result;

            return ['invoiceHistory' => $originalInvoice];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
}
