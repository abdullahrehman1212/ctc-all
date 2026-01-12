<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\log;

use Illuminate\Support\Facades\Validator;
use App\Models\PurchaseOrderChild;
use App\Models\Quotation;
use App\Models\QuotationChild;
use App\Services\CustomErrorMessages;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use App\Models\Person;
use App\Models\Invoice;
use App\Models\InvoiceChild;
use App\Models\CoaAccount;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;

class QuotationController extends Controller
{
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
            $customer_id = $req->customer_id;
            $sales_rep_id = $req->sales_rep_id;
            $quotation_no = $req->quotation_no;
            $from = $req->from_date;
            $to = $req->to_date;
            // $searcField = $req->searcField;

            $quotationlist = Quotation::with('customer', 'salesrep')
                ->when($customer_id, function ($q, $customer_id) {
                    return $q->where('person_id', $customer_id);
                })
                ->when($sales_rep_id, function ($q, $sales_rep_id) {
                    return $q->where('sales_rep_id', $sales_rep_id);
                })
                ->when($quotation_no, function ($q, $quotation_no) {
                    return $q->where('quotation_no', $quotation_no);
                })
                ->when($from, function ($q, $from) {
                    return $q->where('date', '>=', $from);
                })
                ->when($to, function ($q, $to) {
                    return $q->where('date', '<=', $to);
                })
            // ->when($searcField, function ($q, $searcField) {
            //     return $q->where('remarks',  'LIKE', '%' . $searcField . '%');
            // })
            // ->get();
                ->where('user_id', $user_id)
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['quotationlist' => $quotationlist];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }




public function store(Request $request)
    {
        $rules = array(
            'date' => 'required',
            'childArray' => 'required|array',
            'childArray.*.item_id' => 'required|int',

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
            DB::transaction(function () use ($request , $user_id) {

                $Quot_no = Quotation::where('user_id', $user_id)->orderBy('id', 'desc')->first();
                if ($Quot_no) {
                    $Quot_no = $Quot_no->quotation_no + 1;
                } else {
                    $Quot_no = 1;
                }
                $date = date('y-m-d');

                $ref_no = 'ZT' . '/' . 'POF' . '/' . $date;
                $quotation = new Quotation();
                $quotation->user_id = $user_id;
                $quotation->person_id = $request->customer_id;
                $quotation->sales_rep_id = $request->sales_rep_id;
                $quotation->walk_in_customer_name = $request->walk_in_customer_name;
                $quotation->walk_in_customer_phone = $request->walk_in_customer_phone;
                $quotation->sale_type = $request->sale_type;
                $quotation->tax_type = $request->tax_type;
                $quotation->ref_no = $ref_no;
                $quotation->date = $request->date;
                $quotation->remarks = $request->remarks;
                $quotation->termcondition = $request->termcondition;
                $quotation->save();
                $quotation_id = $quotation->id;

                foreach ($request->childArray as $row) {
                    $quotationChilddata = new QuotationChild();
                    $quotationChilddata->user_id = $user_id;
                    $quotationChilddata->parent_id = $quotation_id;
                    $quotationChilddata->item_id = $row['item_id'];
                    $quotationChilddata->quantity = $row['quantity'];
                    $quotationChilddata->retail_price = $row['retail_price'];
                    $quotationChilddata->trade_price = $row['trade_price'];
                    $quotationChilddata->quoted_price = $row['quoted_price'];
                    $quotationChilddata->gst = $row['gst'];
                    $quotationChilddata->gst_amount = $row['gst_amount'];
                    $quotationChilddata->total = $row['quantity'] * $row['quoted_price'];
                    $quotationChilddata->save();

                    // $itemUpdate = Item::find($row['item_id']);
                    // $itemUpdate->rate = $row['quoted_price'];
                    // $itemUpdate->save();
                }
            });

            return ['status' => "ok", 'message' => 'Quotation created successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }




public function edit(Request $req)
{
    $rules = [
        'id' => 'required|int|exists:quotations,id',
    ];
    $validator = Validator::make($req->all(), $rules);

    if ($validator->fails()) {
        return ['status' => 'error', 'message' => $validator->errors()->first()];
    }

    try {
        $quotation = Quotation::with('customer')->find($req->id);
        $quotationChild = QuotationChild::where('parent_id', $req->id)->get();

        $itemname = [];

        foreach ($quotationChild as $child) {

            // Fetch the replacement "item" record from ItemOemPartModeles
            $itemModel = ItemOemPartModeles::with('itemInventory2')
                ->where('id', $child->item_id)
                ->first();

            // itemInventory2 relationship returns a select with
            // SUM(quantity_in) - SUM(quantity_out) AS quantity
            // so read ->quantity (not ->item_available)
            if ($itemModel && $itemModel->itemInventory2) {
                $qty_available = $itemModel->itemInventory2->quantity ?? 0;
            } else {
                $qty_available = 0;
            }

            $AvgPrice = PurchaseOrderChild::getStoredAveragePrice($child->item_id);

            $items = ItemOemPartModeles::with(['itemInventory2', 'brands_id'])
                ->where('id', $child->item_id)
                ->first();

            $itemname[] = [
                'id' => $child->id,
                'item_id' => $child->item_id,
                'item_name' => $itemModel->name ?? '',  // replaced $child->item->name
                'quantity' => $child->quantity ?? 0,
                'retail_price' => $child->retail_price,
                'trade_price' => $child->trade_price,
                'quoted_price' => $child->quoted_price,
                'rate' => $child->quoted_price,
                'avg_price' => $AvgPrice ?? 0,
                'gst' => $child->gst,
                'gst_amount' => $child->gst_amount,
                'total' => $child->total,
                'qty_available' => $qty_available,
                'items' => $items,
            ];
        }

        $data = [
            "id" => $quotation->id,
            "customer_id" => $quotation->person_id ?? '',
            "sales_rep_id" => $quotation->sales_rep_id ?? '',
            "walk_in_customer_name" => $quotation->walk_in_customer_name ?? '',
            "walk_in_customer_phone" => $quotation->walk_in_customer_phone ?? '',
            "ref_no" => $quotation->ref_no,
            "sale_type" => $quotation->sale_type,
            "tax_type" => $quotation->tax_type,
            "quotation_no" => $quotation->quotation_no,
            "remarks" => $quotation->remarks,
            "date" => $quotation->date,
            "total_amount" => $quotation->total_amount,
            "status" => $quotation->status,
            "remarks" => $quotation->remarks,
            "termcondition" => $quotation->termcondition,
            "supplier_name" => $quotation->customer->name ?? '',
            "store_name" => $quotation->store->name ?? '',
            "childArray" => $itemname,
        ];

        return ['data' => $data];

    } catch (\Exception $e) {
        $message = CustomErrorMessages::getCustomMessage($e);
        return ['status' => 'error', 'message' => $message];
    }
}







  public function update(Request $request)
{
    $rules = [
        'id' => 'required|int|exists:quotations,id',
        'date' => 'required|date',
        'childArray' => 'required|array',
        'childArray.*.item_id' => 'required|int',
        'childArray.*.quantity' => 'required|int',
    ];

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return ['status' => 'error', 'message' => $validator->errors()->first()];
    }

    try {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        $user_id = ($user->role_id == 2) ? $user->id : $user->admin_id;

        DB::transaction(function () use ($request, $user_id) {

            // --- Update master record ---
            $quotation = Quotation::find($request->id);
            $quotation->person_id = $request->customer_id ?? null;
            $quotation->sales_rep_id = $request->sales_rep_id ?? null;
            $quotation->ref_no = $request->ref_no ?? null;
            $quotation->date = $request->date;
            $quotation->remarks = $request->remarks ?? null;
            $quotation->termcondition = $request->termcondition ?? null;
            $quotation->save();

            // --- Update or create children ---
            $childIds = [];
            foreach ($request->childArray as $row) {

                if (!empty($row['id'])) {
                    $child = QuotationChild::find($row['id']);
                } else {
                    $child = new QuotationChild();
                }

                if (!$child) continue; // skip invalid rows

                // Ensure user_id is set for both new and existing children
                $child->user_id = $user_id;
                $child->parent_id = $quotation->id;
                $child->item_id = $row['item_id'];
                $child->retail_price = isset($row['retail_price']) ? $row['retail_price'] : 0;
                $child->trade_price = isset($row['trade_price']) ? $row['trade_price'] : 0;
                // force quantity to integer (prevents accidental null/empty)
                $child->quantity = isset($row['quantity']) ? (int) $row['quantity'] : 0;
                $child->quoted_price = isset($row['quoted_price']) ? $row['quoted_price'] : 0;
                $child->gst = isset($row['gst']) ? $row['gst'] : 0;
                $child->gst_amount = isset($row['gst_amount']) ? $row['gst_amount'] : 0;
                // Recalculate total for the child row
                $child->total = ($child->quantity ?? 0) * ($child->quoted_price ?? 0);
                $child->save();

                $childIds[] = $child->id;
            }

            // --- Delete removed child records ---
            QuotationChild::where('parent_id', $quotation->id)
                ->whereNotIn('id', $childIds)
                ->delete();
        });

        return ['status' => 'ok', 'message' => 'Quotation updated successfully'];

    } catch (\Exception $e) {
        $message = CustomErrorMessages::getCustomMessage($e);
        return ['status' => 'error', 'message' => $message];
    }
}





      public function approveOrUnapproveQuotation(Request $req)
    {
        $rules = array(
            'id' => 'required|int',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $quotation = Quotation::find($req->id);
        if (!$quotation) {
            return ['status' => "error", 'message' => 'Quotation Not found'];
        }
        $message = '';
        DB::transaction(function () use ($req, $quotation, &$message) {
            $isApproved = $quotation->is_approved == 1 ? 0 : 1;
            $message = $quotation->is_approved == 1 ? 'Unapproved' : 'Approved';
            $quotation->is_approved = $isApproved;
            $quotation->save();
        });
        return ['status' => "ok", 'message' => 'Quotation ' . $message . ' successfully'];
    }



public function getQuotationForIntiaite(Request $req)
{
        $rules = array(
            'id' => 'required|int|exists:quotations,id',
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
            $quotation = Quotation::with('customer')->find($req->id);

            $quotationChild = QuotationChild::with('item')->where('parent_id', $req->id)->get();
            $childItem = [];

            foreach ($quotationChild as $child) {

                // Calculate total stock quantity (physical stock only, not including pending invoices)
                $qty_available = ItemInventory::calculateTotalStockQty($child->item_id);

                // Get the average cost from the item record
                $item = ItemOemPartModeles::find($child->item_id);
                $AvgPrice = $item ? $item->avg_cost : 0;

                $items = ItemOemPartModeles::with('machinePartOemPart')->where('id', $child->item_id)->orderBy('id')->first();

                $itemname[] = array(
                    'id' => $child->id,
                    'item_id' => $child->item_id,
                    'item_name' => $child->item->name,
                    'quantity' => $child->quantity ?? 0,

                    'retail_price' => $child->retail_price,
                    'trade_price' => $child->trade_price,
                    'quoted_price' => $child->quoted_price,
                    'rate' => $child->quoted_price,
                    'avg_price' => $AvgPrice ?? 0,
                    'gst' => $child->gst,
                    'gst_amount' => $child->gst_amount,
                    'total' => $child->total,
                    'qty_available' => $qty_available,

                    'items' => $items,
                );
            }
            $data = array(
                "id" => $quotation->id,
                "customer_id" => $quotation->person_id ?? '',
                "sales_rep_id" => $quotation->sales_rep_id ?? '',
                "walk_in_customer_name" => $quotation->walk_in_customer_name ?? '',
                "walk_in_customer_phone" => $quotation->walk_in_customer_phone ?? '',
                "ref_no" => $quotation->ref_no,
                "sale_type" => $quotation->sale_type,
                "tax_type" => $quotation->tax_type,
                "quotation_no" => $quotation->quotation_no,
                "remarks" => $quotation->remarks,
                "date" => $quotation->date,
                "total_amount" => $quotation->total_amount,
                "status" => $quotation->status,
                "remarks" => $quotation->remarks,
                "termcondition" => $quotation->termcondition,
                "supplier_name" => $quotation->customer->name ?? '',
                "store_name" => $quotation->store->name ?? '',
                "childArray" => $itemname,
            );
            return ['data' => $data];
        } catch (\Exception $e) {
            return $e;
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }












     public function generateInvoiceQuotation(Request $request)
    {

        $rules = array(
            'date' => 'required',
            'childArray' => 'required|array',
            'childArray.*.item_id' => 'required|int',
            'childArray.*.quantity' => 'required|',

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
            $quotation = Quotation::find($request->id);
            if ($quotation->is_inv_generated == 0) {
                DB::transaction(function () use ($request , $user_id) {

                    if ($request->sale_type == 1) {
                        $walk_in_customer_name = $request->walk_in_customer_name;
                        $customer_id = null;
                    } elseif ($request->sale_type == 2) {
                        $customer_id = $request->customer_id;
                        $walk_in_customer_name = null;
                    }
                    $totalCashSaleVoucher = 0;
                    $invoice = new Invoice();
                    $invoice->user_id = $user_id;
                    $invoice->customer_id = $customer_id;
                    // $invoice->sales_rep_id = $request->sales_rep_id;
                    $invoice->walk_in_customer_name = $walk_in_customer_name;
                    // $invoice->walk_in_customer_phone = $request->walk_in_customer_phone;
                    $invoice->store_id = $request->store_id;
                    $invoice->sale_type = $request->sale_type;
                    $invoice->quotation_id = $request->id;
                    // Ensure required numeric fields are not null (DB has some NOT NULL columns)
                    $invoice->total_amount = isset($request->total_amount) ? $request->total_amount : 0;
                    $invoice->discount = isset($request->discount) ? $request->discount : 0;
                    $invoice->total_after_discount = isset($request->total_after_discount) ? $request->total_after_discount : $invoice->total_amount;
                    $invoice->received_amount = isset($request->amount_received) ? $request->amount_received : null;
                    $invoice->bank_received_amount = isset($request->bank_amount_received) ? $request->bank_amount_received : null;
                    $invoice->date = $request->date;
                    $invoice->account_id = $request->account_id ?? null;
                    $invoice->bank_account_id = $request->bank_account_id ?? null;
                    $invoice->remarks = $request->remarks ?? null;
                    $invoice->tax_type = $request->tax_type ?? null;
                    $invoice->gst = isset($request->gst) ? $request->gst : 0;
                    $invoice->total_after_gst = isset($request->total_after_gst) ? $request->total_after_gst : $invoice->total_after_discount;
                    $invoice->save();
                    $invoice_id = $invoice->id;
                    $invoice_no = $invoice->invoice_no;

                    $remarks = " Quotation ";
                    $supplier_coa_account_id = CoaAccount::where([['person_id', $request->customer_id]])->select('id', 'coa_group_id', 'coa_sub_group_id')->first();
                    if (!$supplier_coa_account_id) {
                        throw new \Exception('Customer account not found for the selected customer');
                    }
                    $customer_id = Person::where('id', $request->customer_id)->value('name');
                    $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
                    ///// cost jv voucher
                    $voucherInventoryCost = new Voucher();
                    $voucherInventoryCost->user_id = $user_id;
                    $voucherInventoryCost->voucher_no = $newVoucherNo;
                    $voucherInventoryCost->date = date('y-m-d');
                    $voucherInventoryCost->name = "Inventory Cost Out" . ", Invoice no: " . $invoice_no;
                    $voucherInventoryCost->invoice_id = $invoice_id;
                    $voucherInventoryCost->type = 3;
                    $voucherInventoryCost->isApproved = 1;
                    $voucherInventoryCost->generated_at = date('y-m-d');
                    $voucherInventoryCost->total_amount = 0;
                    $voucherInventoryCost->cheque_no = $request->cheque_no;
                    $voucherInventoryCost->cheque_date = $request->cheque_date;
                    $voucherInventoryCost->is_post_dated = $is_post_dated;
                    $voucherInventoryCost->is_auto = 1;
                    $voucherInventoryCost->save();
                    $voucherInvCost_id = $voucherInventoryCost->id;
                    $debitside = 0;
                    $creditside = 0;
                    $totalAvgPrice = 0;
                    $price = 0;

                    foreach ($request->childArray as $row) {

                        $invoiceChild = new InvoiceChild();
                        $invoiceChild->user_id = $user_id;
                        $invoiceChild->invoice_id = $invoice_id;
                        $invoiceChild->item_id = $row['item_id'];
                        $invoiceChild->quantity = $row['quantity'];
                        $invoiceChild->price = $row['rate'];
                        // $invoiceChild->sales_tax  = $row['sales_tax'];
                        // $invoiceChild->amount = $row['total'];
                        // $invoiceChild->discount = $row['item_discount'];
                        // $invoiceChild->item_discount_per = $row['item_discount_per'];
                        // $invoiceChild->total_amount = $row['rate'] * $row['quantity'];
                        $invoiceChild->save();

                        $invoiceChild_id = $invoiceChild->id;

                        // $itemUpdate = Item::find($row['item_id']);
                        // $itemUpdate->rate = $row['rate'];
                        // $itemUpdate->save();

                        $stockChilddata = new ItemInventory();
                        $stockChilddata->user_id = $user_id;
                        $stockChilddata->invoice_id = $invoiceChild_id;
                        $stockChilddata->inventory_type_id = 12;
                        $stockChilddata->item_id = $row['item_id'];

                        $stockChilddata->store_id = $request->store_id;
                        $stockChilddata->quantity_out = $row['quantity'];
                        $stockChilddata->date = $request->date;
                        $stockChilddata->save();

                        // Calculate average purchase price safely (avoid divide by zero) and fetch item name
                        $PurchasePrice = PurchaseOrderChild::where('item_id', $row['item_id'])
                            ->groupBy('item_id')
                            ->select(DB::raw('CASE WHEN SUM(quantity) = 0 THEN 0 ELSE SUM(purchase_price * quantity) / SUM(quantity) END as AvgPrice'), 'item_id')
                            ->first();
                        $itemName = ItemOemPartModeles::where('id', $row['item_id'])->value('name') ?? '';

                        $totalAvgPrice += $row['avg_price'] * $row['quantity'];
                        //   --------------Inventory credit  --------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->user_id = $user_id;
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 1;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = 0;
                        $voucherTransaction->credit = $row['avg_price'] * $row['quantity'];
                        $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $creditside += $row['avg_price'] * $row['quantity'];

                        //   --------------Cost debiting --------------------

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->user_id = $user_id;
                        $voucherTransaction->voucher_id = $voucherInvCost_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = 3;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $row['avg_price'] * $row['quantity'];
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = $itemName . " Inventory Sold. " . '' . "Avg Cost:" . '' . round($row['avg_price']) . ' ' . "," . ' ' . "Qty" . " " . $row['quantity'] . " ,Invoice no: " . $invoice_no;
                        $voucherTransaction->save();
                        $debitside += $row['avg_price'] * $row['quantity'];
                    }


                    $quotation_inv = Quotation::find($request->id);
                    $quotation_inv->is_inv_generated = 1;
                    $quotation_inv->save();

                    $updateVoucher = Voucher::find($voucherInvCost_id);
                    $updateVoucher->total_amount = $totalAvgPrice;
                    $updateVoucher->save();

                    //// receipt voucher revenue
                    if ($request->sale_type == 1) {
                        $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                        $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                        $voucherRevenueGen = new Voucher();
                        $voucherRevenueGen->user_id = $user_id;
                        $voucherRevenueGen->voucher_no = $newVoucherNo;
                        $voucherRevenueGen->date = date('y-m-d');
                        $voucherRevenueGen->name = "Revenue Generated" . " ,Invoice no: " . $invoice_no;
                        $voucherRevenueGen->invoice_id = $invoice_id;
                        $voucherRevenueGen->type = 2;
                        $voucherRevenueGen->isApproved = 1;
                        $voucherRevenueGen->generated_at = date('y-m-d');
                        $voucherRevenueGen->total_amount = $request->total_after_discount;
                        $voucherRevenueGen->cheque_no = $request->cheque_no;
                        $voucherRevenueGen->cheque_date = $request->cheque_date;
                        $voucherRevenueGen->is_post_dated = $is_post_dated;
                        $voucherRevenueGen->is_auto = 1;
                        $voucherRevenueGen->save();
                        $voucherRevenueGenid = $voucherRevenueGen->id;
                        $voucherRevGen_id = $voucherRevenueGen->id;
                        foreach ($request->childArray as $list) {
                            $PurchasePrice = PurchaseOrderChild::where('item_id', $list['item_id'])
                                ->groupBy('item_id')
                                ->select(DB::raw('CASE WHEN SUM(quantity) = 0 THEN 0 ELSE SUM(purchase_price * quantity) / SUM(quantity) END as AvgPrice'), 'item_id')
                                ->first();

                            $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name') ?? '';
                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 4;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $list['rate'] * $list['quantity'];
                            $voucherTransaction->description = $itemName . " revenue . " . '' . "Rate: " . '' . $list['rate'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $list['rate'] * $list['quantity'];
                        }
                        $totalCashSaleVoucher += $request->amount_received;
                        //---------------------Cash 1 Debit ------------------
                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->user_id = $user_id;
                        $voucherTransaction->voucher_id = $voucherRevGen_id;
                        $voucherTransaction->date = date('y-m-d');
                        $voucherTransaction->coa_account_id = $request->account_id;
                        $voucherTransaction->is_approved = 1;
                        $voucherTransaction->debit = $request->amount_received;
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->description = "Invoice no: " . $invoice_no . " Cash Received";
                        $voucherTransaction->save();
                        $debitside += $request->amount_received;
                        if ($request->bank_amount_received > 0) {
                            //---------------------Bank Debit ------------------
                            $totalCashSaleVoucher += $request->bank_amount_received;
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $request->bank_account_id;
                            $voucherTransaction->is_approved = 1;
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
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 23;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $request->gst;
                            $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $request->gst;
                            //---------------------Cash 1 Debit ------------------
                            // $voucherTransaction = new VoucherTransaction();
                            // $voucherTransaction->voucher_id = $voucherRevGen_id;
                            // $voucherTransaction->date = date('y-m-d');
                            // $voucherTransaction->coa_account_id = $request->account_id;
                            // $voucherTransaction->is_approved = 1;
                            // $voucherTransaction->debit = $request->gst;
                            // $voucherTransaction->credit = 0;
                            // $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            // $voucherTransaction->save();
                        }
                        if ($request->item_discount > 0) {
                            $totalCashSaleVoucher += $request->item_discount;

                            //---------------------Debiting item_discount Expense   ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 28;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $request->item_discount;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = 'Discount' . '' . ",Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $request->item_discount;
                        }
                        $voucher = voucher::find($voucherRevenueGenid);
                        $voucher->total_amount = $totalCashSaleVoucher;
                        $voucher->save();
                    } else {
                        
                        $customer_account = CoaAccount::where('person_id', $request->customer_id)
                            ->where('coa_sub_group_id', 9)->first();
                        if (!$customer_account) {
                            throw new \Exception('Customer account not found for the selected customer');
                        }
                        $customer_account_id = $customer_account->id;

                       
                        foreach ($request->childArray as $list) {
                            $price += $list['rate'] * $list['quantity'];
                            $PurchasePrice = PurchaseOrderChild::where('item_id', $list['item_id'])
                                ->groupBy('item_id')
                                ->select(DB::raw('CASE WHEN SUM(quantity) = 0 THEN 0 ELSE SUM(purchase_price * quantity) / SUM(quantity) END as AvgPrice'), 'item_id')
                                ->first();

                            $itemName = ItemOemPartModeles::where('id', $list['item_id'])->value('name') ?? '';
                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 4;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $list['rate'] * $list['quantity'];
                            $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['rate'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $list['rate'] * $list['quantity'];

                            //---------------------Cash 1 Debit ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $list['rate'] * $list['quantity'];
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = $itemName . " sold . " . '' . "Rate: " . '' . $list['rate'] . ' ' . "," . ' ' . "Qty" . " " . $list['quantity'] . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $list['rate'] * $list['quantity'];
                        }

                        if ($request->item_discount > 0) {
                            // $totalCreditSaleVoucher += $request->item_discount;
                            //---------------------Crediting Customer Account Deu To item_discount ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $request->item_discount;
                            $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $request->item_discount;

                            //---------------------Debiting discount Expense   ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 28;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $request->item_discount;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = 'Discount' . '' . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $request->item_discount;
                        }
                        if ($request->amount_received > 0) {
                            // $totalCashSaleVoucher += $request->amount_received;
                            $getVoucherNo = DB::table('vouchers')->where('type', 2)->orderBy('id', 'desc')->first();
                            $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                            $voucherRevenueGen = new Voucher();
                            $voucherRevenueGen->user_id = $user_id;
                            $voucherRevenueGen->voucher_no = $newVoucherNo;
                            $voucherRevenueGen->date = date('y-m-d');
                            $voucherRevenueGen->name = "Customer Amount Received ";
                            $voucherRevenueGen->invoice_id = $invoice_id;
                            $voucherRevenueGen->type = 2;
                            $voucherRevenueGen->isApproved = 1;
                            $voucherRevenueGen->generated_at = date('y-m-d');
                            $voucherRevenueGen->total_amount = $request->amount_received;
                            $voucherRevenueGen->cheque_no = $request->cheque_no;
                            $voucherRevenueGen->cheque_date = $request->cheque_date;
                            $voucherRevenueGen->is_post_dated = $is_post_dated;
                            $voucherRevenueGen->is_auto = 1;
                            $voucherRevenueGen->save();
                            $voucherRevGen_id = $voucherRevenueGen->id;

                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $request->amount_received;
                            $voucherTransaction->description = "Amount received (Cash) against " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $request->amount_received;

                            //---------------------Cash 1 Debit ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $request->account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $request->amount_received;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = "Amount received (Cash) against " . " ,Invoice no: " . $invoice_no;
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
                            // $voucherRevenueGen->date = date('y-m-d');
                            // $voucherRevenueGen->name =  "Customer Amount Received bank";
                            // $voucherRevenueGen->invoice_id = $invoice_id;
                            // $voucherRevenueGen->type = 2;
                            // $voucherRevenueGen->isApproved = 1;
                            // $voucherRevenueGen->generated_at = date('y-m-d');
                            // $voucherRevenueGen->total_amount = $request->bank_amount_received;
                            // $voucherRevenueGen->cheque_no = $request->cheque_no;
                            // $voucherRevenueGen->cheque_date = Land::changeDateFormat($request->cheque_date);
                            // $voucherRevenueGen->is_post_dated = $is_post_dated;
                            // $voucherRevenueGen->is_auto = 1;
                            // $voucherRevenueGen->save();
                            // $voucherRevGen_id = $voucherRevenueGen->id;

                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $request->bank_amount_received;
                            $voucherTransaction->description = "Amount received (Bank) against " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $request->bank_amount_received;

                            //---------------------Cash 1 Debit ------------------

                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherRevGen_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $request->bank_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $request->bank_amount_received;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = "Amount received (Bank) against " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $request->bank_amount_received;
                        }
                        ///////gst voucher
                        if ($request->gst > 0) {
                            // $totalCreditSaleVoucher += $request->gst;

                            //---------------------Crediting Reneve ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = 23;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = 0;
                            $voucherTransaction->credit = $request->gst;
                            $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $creditside += $request->gst;
                            //---------------------Cash 1 Debit ------------------
                            $voucherTransaction = new VoucherTransaction();
                            $voucherTransaction->user_id = $user_id;
                            $voucherTransaction->voucher_id = $voucherInvCost_id;
                            $voucherTransaction->date = date('y-m-d');
                            $voucherTransaction->coa_account_id = $customer_account_id;
                            $voucherTransaction->is_approved = 1;
                            $voucherTransaction->debit = $request->gst;
                            $voucherTransaction->credit = 0;
                            $voucherTransaction->description = "Gst " . " ,Invoice no: " . $invoice_no;
                            $voucherTransaction->save();
                            $debitside += $request->gst;
                        }
                    }

                    if ($creditside != $debitside) {
                        throw new \Exception('debit and credit sides are not equal');
                    }
                    $voucher = voucher::find($voucherInvCost_id);
                    $voucher->total_amount = $debitside;
                    $voucher->save();
                });
                return ['status' => "ok", 'message' => 'Invoice generated successfully from quotation'];
            } elseif ($quotation->is_approved == 0) {
                return ['status' => "error", 'message' => 'Approve The Quotation'];
            } elseif ($quotation->is_inv_generated == 1) {
                return ['status' => "error", 'message' => 'Quotation already initiated'];
            } else {
                return ['status' => "error", 'message' => 'Error Intiating'];
            }
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }





     public function destroy(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:quotations,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            $quotation = Quotation::find($req->id);
            $InvoiceParent = Invoice::where('quotation_id', $req->id)->first();
            if ($quotation->is_inv_generated == 1) {
                return ['status' => "error", 'message' => 'Quotation already Initiated, cannot be deleted'];
            }
            if ($InvoiceParent) {
                return ['status' => "error", 'message' => 'Quotation has Invoices, cannot be deleted'];
            }

            if ($quotation->is_approved == 0) {
                DB::transaction(function () use ($req) {
                    $deleteQuotation = Quotation::where('id', $req->id)->delete();
                    $deleteQuotChild = QuotationChild::where('parent_id', $req->id)->delete();
                });
                return ['status' => "ok", 'message' => 'Quotation Deleted successfully'];
            } else {
                return ['status' => "error", 'message' => 'Quotation is Approved Can not be Delete'];
            }
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }






   public function ViewQuotationDetails(Request $req)
{
    $rules = [
        'id' => 'required|int|exists:quotations,id',
    ];
    $validator = Validator::make($req->all(), $rules);

    if ($validator->fails()) {
        return ['status' => 'error', 'message' => $validator->errors()->first()];
    }

    try {
        $quotation = Quotation::with('customer')->find($req->id);

        // Get quotation children with related item name
        $quotChild = QuotationChild::with('item:id,name')
    ->where('parent_id', $req->id)
    ->get();


        return [
            'quotation' => $quotation,
            'quotChild' => $quotChild
        ];
    } catch (\Exception $e) {
        $message = CustomErrorMessages::getCustomMessage($e);
        return ['status' => 'error', 'message' => $message];
    }
}


   




     public function getLatestQuotationNo()
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
            $Quot_no = Quotation::where('user_id', $user_id)
                ->orderBy('id', 'desc')->first();
            if ($Quot_no) {
                $Quot_no = $Quot_no->quotation_no + 1;
            } else {
                $Quot_no = 1;
            }

            return ['status' => 'ok', 'Quot_no' => $Quot_no];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }




}
