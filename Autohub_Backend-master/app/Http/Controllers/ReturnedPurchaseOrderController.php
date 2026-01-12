<?php

namespace App\Http\Controllers;

use App\Models\CoaAccount;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\Land;
use App\Models\Person;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderChild;
use App\Models\ReturnedPurchaseOrder;
use App\Models\ReturnedPurchaseOrderChild;
use App\Models\ReturnRackShelf;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ReturnedPurchaseOrderController extends Controller
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * returning purchase order
     *
     * @param  \Illuminate\Http\Request  $purchase_order_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $returned_quantity
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd("s");
        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
            'total' => 'required|numeric',
            // 'discount'     => 'required|numeric',
            // 'tax'     => 'required|numeric',
            'total_after_tax' => 'required|numeric',
            'tax_in_figure' => 'required|numeric',
            'total_after_discount' => 'required|numeric',
            'childArray' => 'required|array',
            'childArray.*.returned_quantity' => 'required',
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

            foreach ($request->childArray as $row) {
                $itemId = $row['item_id'];

                $newQty = 0;
                // checking if qty is not greater than qty available for return
                $returnpoid = ReturnedPurchaseOrder::where('purchase_order_id', $request->id)->get();
                if ($returnpoid) {
                    foreach ($returnpoid as $childReturn) {
                        $return_qty = ReturnedPurchaseOrderChild::where('returned_purchase_order_id', $childReturn->id)
                            ->where('item_id', $itemId)
                            ->value('returned_quantity');
                        $newQty += $return_qty;
                    }
                    $totalReturnQuantity = $newQty;
                } else {
                    $totalReturnQuantity = 0;
                }
                // checking if qty is not greater than qty available for return
                if ($row['quantity'] > $row['purchased_qty'] - $totalReturnQuantity) {
                    return ['status' => 'error', 'message' => "Return quantity is greater than qty available for return: " . $row['purchased_qty'] - $totalReturnQuantity];
                }
                // End
                // checking if qty is not greater than stock available
                $storeId = $request->store_id;
                $stockQuantity = ItemInventory::getStockQuantity($storeId, $itemId);

                if ($row['quantity'] > $stockQuantity) {
                    return ['status' => 'error', 'message' => "Return quantity is greater than available stock.Available stock: " . $stockQuantity];
                }
            }
            DB::transaction(function () use ($request, $user_id) {

                $purchaseorder = PurchaseOrder::find($request->id);
                $purchaseorder->is_received = 1;
                $purchaseorder->save();
                $returnPurchaseOrder = new ReturnedPurchaseOrder;
                $returnPurchaseOrder->purchase_order_id = $request->id;
                $returnPurchaseOrder->return_date = $request->return_date;
                $returnPurchaseOrder->remarks = $request->remarks;
                $returnPurchaseOrder->deduction = $request->deduction ?? 0;
                $returnPurchaseOrder->total = $request->total;
                $returnPurchaseOrder->discount = $request->discount;
                $returnPurchaseOrder->tax = $request->tax;
                $returnPurchaseOrder->total_after_tax = $request->total_after_tax;
                $returnPurchaseOrder->tax_in_figure = $request->tax_in_figure;
                $returnPurchaseOrder->user_id = $user_id; //user id
                $returnPurchaseOrder->total_after_discount = $request->total_after_discount;
                $returnPurchaseOrder->save();
                $return_purchase_order_id = $returnPurchaseOrder->id;

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

                    $groupedItems[$itemId]['total_amount'] += $row['amount'];
                    $groupedItems[$itemId]['total_quantity'] += $row['quantity'];
                }

                // Process each grouped item
                foreach ($groupedItems as $itemId => $data) {
                    $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                    // Current stock value (stock quantity multiplied by average cost)
                    $totalAmountItem = 0;

                    $item = ItemOemPartModeles::where('id', $itemId)->first();
                    if ($item) {
                        $itemCost = $item->avg_cost;
                        $totalAmountItem = $stockQty * $itemCost;
                    }

                    $totalAmount = $data['total_amount'];
                    $totalQuantity = $data['total_quantity'];

                    // Ensure no division by zero
                    $averagePrice = ($stockQty - $totalQuantity > 0)
                    ? ($totalAmountItem - $totalAmount) / ($stockQty - $totalQuantity)
                     : 0;

                    // Update the item's average cost
                    $itemUpdate = ItemOemPartModeles::where('id', $itemId)->first();
                    if ($itemUpdate) {
                        $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                }

                foreach ($request->childArray as $row) {
                    $purchaseorderchild = PurchaseOrderChild::where('purchase_order_id', $request->id)
                        ->where('item_id', $row['item_id'])->first();
                    // $purchaseorderchild->returned_quantity = $purchaseorderchild->returned_quantity + $row['returned_quantity'];
                    $purchaseorderchild->save();
                    $purchaseChilddata = new ReturnedPurchaseOrderChild();
                    $purchaseChilddata->returned_purchase_order_id = $return_purchase_order_id;
                    $purchaseChilddata->returned_quantity = $row['quantity'];
                    $purchaseChilddata->item_id = $row['item_id'];
                    $purchaseChilddata->purchase_price = $purchaseorderchild->purchase_price;
                    $purchaseChilddata->amount = $row['amount'];
                    $purchaseChilddata->remarks = $row['remarks'];
                    $purchaseChilddata->user_id = $user_id; //user id
                    $purchaseChilddata->save();
                    $returnpochildid = $purchaseChilddata->id;

                    if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {
                        foreach ($row['rackShelf'] as $rackNumberData) {
                            if (!empty($rackNumberData['rack_id']) && !empty($rackNumberData['shelf_id'])) {
                                $newRack = new ReturnRackShelf([
                                    'store_id' => $request->store_id,
                                    'item_id' => $row['item_id'],
                                    'rack_id' => $rackNumberData['rack_id'],
                                    'shelf_id' => $rackNumberData['shelf_id'],
                                    'return_purchase_order_id' => $return_purchase_order_id,
                                    'quantity' => $rackNumberData['quantity'],
                                    'return_purchase_order_child_id' => $returnpochildid,
                                    'user_id' => $user_id, //user id

                                ]);

                                $newRack->save();
                            }
                        }
                    }

                    if (isset($row['rackShelf']) && !empty($row['rackShelf']) && $this->hasNonEmptyRackNumbers($row['rackShelf'])) {
                        foreach ($row['rackShelf'] as $rackNumberData) {
                            $itemInventory = new ItemInventory();
                            $itemInventory->purchase_order_id = $request->id;
                            $itemInventory->return_child_po_id = $returnpochildid;
                            $itemInventory->store_id = $request->store_id;
                            $itemInventory->item_id = $row['item_id'];
                            $itemInventory->inventory_type_id = 4;
                            $itemInventory->quantity_out = $rackNumberData['quantity'];
                            $itemInventory->date = $request->return_date;
                            $itemInventory->rack_id = $rackNumberData['rack_id'];
                            $itemInventory->shelf_id = $rackNumberData['shelf_id'];
                            $itemInventory->user_id = $user_id; //user id
                            $itemInventory->save();
                        }
                    } else {
                        $itemInventory = new ItemInventory();
                        $itemInventory->purchase_order_id = $request->id;
                        $itemInventory->return_child_po_id = $returnpochildid;
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 4;
                        $itemInventory->quantity_out = $row['quantity'];
                        $itemInventory->date = $request->return_date;
                        $itemInventory->user_id = $user_id; //user id

                        $itemInventory->save();
                    }
                }

                //////////
                $po_no = $purchaseorder->po_no;
                if ($purchaseorder->person_id == null) {

                    $this->DirectPoVoucher($request, $po_no, $return_purchase_order_id);
                } else {
                    $this->SupplierPoVoucher($request, $po_no, $return_purchase_order_id);
                }
            });

            return ['status' => "ok", 'message' => 'Purchase Order returned successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    private function SupplierPoVoucher($request, $po_no, $return_purchase_order_id)
    {

        //   $total_amount = $row['purchase_price'] * $row['returned_quantity'];
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }

        $remarks = "Return Purchase Order Returned ";
        $supplier_coa_account_id = CoaAccount::where([['person_id', $request->supplier_id]])->value('id');
        $supplier_name = Person::where('id', $request->supplier_id)->value('name');
        $is_post_dated = isset($request->cheque_no) ? 1 : 0;
        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
        $voucher = new Voucher();
        $voucher->voucher_no = $newVoucherNo;
        $voucher->date = date('y-m-d');
        $voucher->name = "Purchase Order Number: " . $po_no;
        $voucher->type = 3;
        $voucher->isApproved = 1;
        $voucher->return_po_id = $return_purchase_order_id;
        $voucher->generated_at = date('y-m-d');
        $voucher->total_amount = $request->total;
        $voucher->purchase_order_id = $request->id;
        $voucher->user_id = $user_id; //user id
        $voucher->cheque_no = $request->cheque_no;
        $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
        $voucher->is_post_dated = $is_post_dated;
        $voucher->is_auto = 1;
        $voucher->save();
        $voucher_id = $voucher->id;
        $total = 0;
        $debitside = 0;
        $creditside = 0;
        //---------------------credit Inventory  account ------------------
        foreach ($request->childArray as $row) {
            $total += $row['purchase_price'] * $row['quantity'];
            $voucherTransaction = new VoucherTransaction();

            $voucherTransaction->voucher_id = $voucher_id;
            $voucherTransaction->date = date('y-m-d');
            $voucherTransaction->coa_account_id = 1;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->user_id = $user_id; //user id
            $voucherTransaction->credit = $row['purchase_price'] * $row['quantity'];
            $voucherTransaction->description = $remarks . ' ' . "Inventory Adjusted";
            $voucherTransaction->save();
            $creditside += $row['purchase_price'] * $row['quantity'];
        }
        //   --------------Crediting Supplier account --------------------

        $voucherTransaction = new VoucherTransaction();
        $voucherTransaction->voucher_id = $voucher_id;
        $voucherTransaction->date = date('y-m-d');
        $voucherTransaction->coa_account_id = $supplier_coa_account_id;
        $voucherTransaction->credit = 0;
        $voucherTransaction->debit = $total;
        $voucherTransaction->is_approved = 1;
        $voucherTransaction->user_id = $user_id; //user id
        $voucherTransaction->description = $remarks . ' ' . "Supplier Liability adjusted";
        $voucherTransaction->save();
        $voucher = Voucher::find($voucher_id);
        $voucher->total_amount = $total;
        $voucher->save();
        $debitside += $total;
        if ($creditside != $debitside) {
            throw new \Exception('debit and credit sides are not equal');
        }
    }
    private function DirectPoVoucher($request, $po_no, $return_purchase_order_id)
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

        $remarks = " Purchase Order Returned ";
        $supplier_coa_account_id = CoaAccount::where([['person_id', $request->supplier_id]])->value('id');
        $supplier_name = Person::where('id', $request->supplier_id)->value('name');
        $is_post_dated = isset($request->cheque_no) ? 1 : 0;
        $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
        $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
        $voucher = new Voucher();
        $voucher->voucher_no = $newVoucherNo;
        $voucher->date = date('y-m-d');
        $voucher->name = "Direct Return Purchase Order Number: " . $po_no;
        $voucher->type = 3;
        $voucher->isApproved = 1;
        $voucher->return_po_id = $return_purchase_order_id;
        $voucher->generated_at = date('y-m-d');
        $voucher->total_amount = $request->total;
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
        $total = 0;
        //---------------------Debit Inventory  account ------------------
        foreach ($request->childArray as $row) {
            $total += $row['purchase_price'] * $row['quantity'];
            $voucherTransaction = new VoucherTransaction();
            $voucherTransaction->voucher_id = $voucher_id;
            $voucherTransaction->date = date('y-m-d');
            $voucherTransaction->coa_account_id = 1;
            $voucherTransaction->is_approved = 1;
            $voucherTransaction->debit = 0;
            $voucherTransaction->user_id = $user_id; //user id

            $voucherTransaction->credit = $row['purchase_price'] * $row['quantity'];

            $voucherTransaction->description = $remarks . ' ' . "Inventory Adjusted";
            $voucherTransaction->save();
            $creditside += $row['purchase_price'] * $row['quantity'];
        }
        //   --------------Crediting Supplier account --------------------

        $voucherTransaction = new VoucherTransaction();
        $voucherTransaction->voucher_id = $voucher_id;
        $voucherTransaction->date = date('y-m-d');
        $voucherTransaction->coa_account_id = $request->account_id;
        $voucherTransaction->credit = 0;
        $voucherTransaction->debit = $total;
        $voucherTransaction->is_approved = 1;
        $voucherTransaction->description = $remarks . ' ' . "Supplier Liability adjusted";
        $voucherTransaction->user_id = $user_id; //user id
        $voucherTransaction->save();
        $debitside += $total;
        if ($creditside != $debitside) {
            throw new \Exception('debit and credit sides are not equal');
        }
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ReturnedPurchaseOrder  $returnPurchaseOrder
     * @return \Illuminate\Http\Response
     */
    public function show(ReturnedPurchaseOrder $returnPurchaseOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\ReturnedPurchaseOrder  $returnPurchaseOrder
     * @return \Illuminate\Http\Response
     */
    public function edit(ReturnedPurchaseOrder $returnPurchaseOrder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ReturnedPurchaseOrder  $returnPurchaseOrder
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ReturnedPurchaseOrder $returnPurchaseOrder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ReturnedPurchaseOrder  $returnPurchaseOrder
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $rules = array(
            'id' => 'required|int',
        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {
                $poid = $request->id;

                // Fetch all children and related data
                $returnPoChildren = ReturnedPurchaseOrderChild::where('returned_purchase_order_id', $poid)->get();

                // Group items for cost and stock updates
                $groupedItems = [];
                foreach ($returnPoChildren as $child) {
                    $itemId = $child->item_id;
                    if (!isset($groupedItems[$itemId])) {
                        $groupedItems[$itemId] = [
                            'total_quantity' => 0,
                            'total_cost' => 0,
                        ];
                    }
                    $groupedItems[$itemId]['total_quantity'] += $child->returned_quantity;
                    $groupedItems[$itemId]['total_cost'] += $child->amount;
                }

                // Update item average costs
                foreach ($groupedItems as $itemId => $data) {
                    $quantity = $data['total_quantity'];
                    $returnpoTotal = $data['total_cost'];

                    $stockQty = ItemInventory::calculateTotalStockQty($itemId);
                    $itemUpdate = ItemOemPartModeles::find($itemId);

                    if ($itemUpdate) {
                        $itemAvgCost = $itemUpdate->avg_cost;

                        $totalCost = ($itemAvgCost * $stockQty) + $returnpoTotal;
                        $totalQuantity = $stockQty + $quantity;

                        $averagePrice = $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;
                        $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                }

                // Delete ItemInventory records related to each Return PO Child
                foreach ($returnPoChildren as $child) {
                    ItemInventory::where('return_child_po_id', $child->id)->delete();
                }

                // Delete all children of the Returned Purchase Order
                ReturnedPurchaseOrderChild::where('returned_purchase_order_id', $poid)->delete();

                // Delete vouchers and their transactions
                $vouchers = Voucher::where('return_po_id', $poid)->get();
                foreach ($vouchers as $voucher) {
                    VoucherTransaction::where('voucher_id', $voucher->id)->delete();
                    $voucher->delete(); // Delete voucher
                }

                // Delete the parent Returned Purchase Order
                ReturnedPurchaseOrder::where('id', $poid)->delete();
            });

            return ['status' => 'ok', 'message' => 'Return PO deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * returning purchase order
     *
     * @param  \Illuminate\Http\Request  $purchase_order_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $returned_quantity
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    public function returnDirectPurchaseOrder(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:purchase_orders,id',
            'total' => 'required|numeric',
            // 'discount'     => 'required|numeric',
            // 'tax'     => 'required|numeric',
            'total_after_tax' => 'required|numeric',
            'tax_in_figure' => 'required|numeric',
            'total_after_discount' => 'required|numeric',
            'childArray' => 'required|array',
            'childArray.*.returned_quantity' => 'required|int',
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
            DB::transaction(function () use ($request, $user_id) {

                $purchaseorder = PurchaseOrder::find($request->id);
                $purchaseorder->is_received = 1;
                $purchaseorder->save();
                $returnPurchaseOrder = new ReturnedPurchaseOrder;
                $returnPurchaseOrder->purchase_order_id = $request->id;
                $returnPurchaseOrder->remarks = $request->remarks;
                $returnPurchaseOrder->deduction = $request->deduction ?? 0;
                $returnPurchaseOrder->total = $request->total;
                $returnPurchaseOrder->discount = $request->discount;
                $returnPurchaseOrder->tax = $request->tax;
                $returnPurchaseOrder->total_after_tax = $request->total_after_tax;
                $returnPurchaseOrder->tax_in_figure = $request->tax_in_figure;
                $returnPurchaseOrder->total_after_discount = $request->total_after_discount;
                $returnPurchaseOrder->save();
                $return_purchase_order_id = $returnPurchaseOrder->id;

                foreach ($request->childArray as $row) {

                    $purchaseorderchild = PurchaseOrderChild::where('purchase_order_id', $request->id)
                        ->where('item_id', $row['item_id'])->first();
                    $purchaseorderchild->returned_quantity = $purchaseorderchild->returned_quantity + $row['returned_quantity'];
                    $purchaseorderchild->save();
                    $purchaseChilddata = new ReturnedPurchaseOrderChild;
                    $purchaseChilddata->returned_purchase_order_id = $return_purchase_order_id;
                    $purchaseChilddata->returned_quantity = $row['returned_quantity'];
                    $purchaseChilddata->item_id = $row['item_id'];
                    $purchaseChilddata->amount = $row['amount'];
                    $purchaseChilddata->remarks = $row['remarks'];
                    $purchaseChilddata->user_id = $user_id; //user id
                    $purchaseChilddata->save();
                    $returnpochildid = $purchaseChilddata->id;
                    $itemInventory = new ItemInventory();
                    $itemInventory->purchase_order_id = $request->id;
                    $itemInventory->return_child_po_id = $returnpochildid;
                    $itemInventory->store_id = $request->store_id;
                    $itemInventory->inventory_type_id = 4;
                    $itemInventory->item_id = $row['item_id'];
                    $itemInventory->quantity_out = $row['returned_quantity'];
                    $itemInventory->date = date('Y-m-d');
                    $itemInventory->user_id = $user_id; //user id
                    $itemInventory->save();

                    $total_amount = $row['purchase_price'] * $row['returned_quantity'];
                    $remarks = " Purchase Order Returned ";
                    $supplier_coa_account_id = CoaAccount::where([['person_id', $request->supplier_id]])->value('id');
                    $supplier_name = Person::where('id', $request->supplier_id)->value('name');
                    $is_post_dated = isset($request->cheque_no) ? 1 : 0;
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;
                    $voucher = new Voucher();
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->date = date('y-m-d');
                    $voucher->name = "Purchase Order Number: " . $purchaseorder->po_no;
                    $voucher->type = 3;
                    $voucher->isApproved = 1;
                    $voucher->return_po_id = $return_purchase_order_id;
                    $voucher->generated_at = date('y-m-d');
                    $voucher->total_amount = $request->total;
                    $voucher->purchase_order_id = $request->id;
                    $voucher->cheque_no = $request->cheque_no;
                    $voucher->cheque_date = Land::changeDateFormat($request->cheque_date);
                    $voucher->is_post_dated = $is_post_dated;
                    $voucher->is_auto = 1;
                    $voucher->user_id = $user_id; //user id
                    $voucher->save();
                    $voucher_id = $voucher->id;

                    //---------------------Debit Inventory  account ------------------
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = 1;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->user_id = $user_id; //user id

                    $voucherTransaction->credit = $row['purchase_price'] * $row['returned_quantity'];

                    $voucherTransaction->description = $remarks . ' ' . "Inventory Adjusted";
                    $voucherTransaction->save();
                    //   --------------Crediting Supplier account --------------------

                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = date('y-m-d');
                    $voucherTransaction->coa_account_id = $supplier_coa_account_id;
                    $voucherTransaction->credit = 0;
                    $voucherTransaction->debit = $total_amount;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->user_id = $user_id; //user id
                    $voucherTransaction->description = $remarks . ' ' . "Supplier Liability adjusted";
                    $voucherTransaction->save();
                }
            });

            return ['status' => "ok", 'message' => 'Purchase Order returned successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getReturnedPoByID(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:returned_purchase_orders,id',
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
            $parentData = ReturnedPurchaseOrder::with('purchaseorder')->find($req->id);

            $childData = ReturnedPurchaseOrderChild::with('item', 'purchaseOrderChild')
                ->where('user_id', $user_id) // user_id
                ->where('returned_purchase_order_id', $req->id)->get();

            return ['parentData' => $parentData, 'childData' => $childData];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }
    /**
     * Displaying purchase orders list.
     *
     * @return \Illuminate\Http\Response
     */
    public function getReturnedPolist(Request $req)
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
            $supplier_id = $req->supplier_id;
            $po_no = $req->po_no;
            $store_id = $req->store_id;
            $store_type_id = $req->store_type_id;
            $from = $req->from_date;
            $to = $req->to_date;
            $searcField = $req->searcField;
            $sub_category_id = $req->sub_category_id;
            $part_model_id = $req->part_model_id;
            $category_id = $req->category_id;
            $machine_part_id = $req->item_id;

            $store_name = $req->store_name;
            $type_id = $req->type_id;

            $returnedpurchaseorderlist = ReturnedPurchaseOrder::with('returnPurchaseOrderChild', 'purchaseorder')
                ->where('user_id', $user_id) // user_id
            // ->when($supplier_id, function ($q, $supplier_id) {
            //     return $q->where('person_id', $supplier_id);
            // })
            // ->when($store_id, function ($q, $store_id) {
            //     return $q->where('store_id', $store_id);
            // })

            // ->when($po_no, function ($q, $po_no) {
            //     return $q->where('po_no', $po_no);
            // })
            // ->when($store_id, function ($q, $store_id) {
            //     return $q->where('store_id', $store_id);
            // })
                ->when($supplier_id, function ($query, $supplier_id) {
                    $query->with('purchaseorder', function ($query) use ($supplier_id) {
                        $query->where('person_id', $supplier_id);
                        // $query->where('item_id', $supplier_id); // moeed changes

                    });
                    $query->whereHas('purchaseorder', function ($query) use ($supplier_id) {
                        $query->where('person_id', $supplier_id);
                        // $query->where('item_id', $machine_part_id); // moeed changes

                    });
                })

                ->when($po_no, function ($query, $po_no) {
                    $query->with('purchaseorder', function ($query) use ($po_no) {
                        $query->where('po_no', $po_no);
                        // $query->where('item_id', $po_no); // moeed changes

                    });
                    $query->whereHas('purchaseorder', function ($query) use ($po_no) {
                        $query->where('po_no', $po_no);
                        // $query->where('item_id', $machine_part_id); // moeed changes

                    });
                })
                ->when($machine_part_id, function ($query, $machine_part_id) {
                    $query->with('returnPurchaseOrderChild', function ($query) use ($machine_part_id) {
                        $query->where('item_id', $machine_part_id);
                        // $query->where('item_id', $machine_part_id); // moeed changes

                    });
                    $query->whereHas('returnPurchaseOrderChild', function ($query) use ($machine_part_id) {
                        $query->where('item_id', $machine_part_id);
                        // $query->where('item_id', $machine_part_id); // moeed changes

                    });
                })
                ->when($from, function ($q, $from) {
                    return $q->where('created_at', '>=', $from);
                })
                ->when($to, function ($q, $to) {
                    return $q->where('created_at', '<=', $to);
                })
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['returnedpurchaseorderlist' => $returnedpurchaseorderlist];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getReturnedPoDetails(Request $req)
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

            $po_id = $req->po_id;
            $purchaseorderlist = ReturnedPurchaseOrder::with('purchaseorder', 'returnPurchaseOrderChild')
                ->where('id', $po_id)
                ->first();

            $coaSubGrouppurchase = 1;
            $coaSubGroupExpence = 7;

            // $purchaseorderVoucher = Voucher::with('voucherTransactions', 'voucherType')
            //     ->where('purchase_order_id', $po_id)
            //     ->when($coaSubGrouppurchase, function ($query) use ($coaSubGrouppurchase) {
            //         $query->whereHas('voucherTransactions', function ($query) use ($coaSubGrouppurchase) {
            //             $query->whereHas('coaAccount', function ($query) use ($coaSubGrouppurchase) {
            //                 $query->whereHas('coaGroup', function ($query) use ($coaSubGrouppurchase) {
            //                     $query->whereHas('coaSubGroups', function ($query) use ($coaSubGrouppurchase) {
            //                         $query->where('id', $coaSubGrouppurchase);
            //                     });
            //                 });
            //             });
            //         });
            //     })
            //     ->first();

            // $purchaseExpenseVoucher = Voucher::with('voucherTransactions', 'voucherType')
            //     ->where('purchase_order_id', $po_id)
            //     ->when($coaSubGroupExpence, function ($query) use ($coaSubGroupExpence) {
            //         $query->whereHas('voucherTransactions', function ($query) use ($coaSubGroupExpence) {
            //             $query->whereHas('coaAccount', function ($query) use ($coaSubGroupExpence) {
            //                 $query->whereHas('coaGroup', function ($query) use ($coaSubGroupExpence) {
            //                     $query->whereHas('coaSubGroups', function ($query) use ($coaSubGroupExpence) {
            //                         $query->where('id', $coaSubGroupExpence);
            //                     });
            //                 });
            //             });
            //         });
            //     })
            //     ->first();

            return [
                'purchaseorderlist' => $purchaseorderlist,
                // , 'purchaseorderVoucher' => $purchaseorderVoucher, 'purchaseExpenseVoucher' => $purchaseExpenseVoucher
            ];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function getReturnPos(Request $req)
    {
        $validator = Validator::make($req->all(), [
            'id' => 'required|int|exists:purchase_orders,id',
        ]);

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

            $originalPurchaseOrder = PurchaseOrder::with('supplier', 'store')->find($req->id);
            $originalPoChild = PurchaseOrderChild::with('item')
                ->where('user_id', $user_id) // user_id
                ->where('purchase_order_id', $req->id)->get();

            $purchase_order_id = $req->id;

            $returnedPoList = ReturnedPurchaseOrder::with('purchaseorder', 'returnPurchaseOrderChild')
                ->where('user_id', $user_id) // user_id
                ->where('purchase_order_id', $purchase_order_id)
                ->get();

            $originalPurchaseOrder->childData = $originalPoChild;
            $originalPurchaseOrder->poHistory = $returnedPoList;

            return ['originalPurchaseOrder' => $originalPurchaseOrder];
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
