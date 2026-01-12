<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AdjustInventory;
use App\Models\AdjustInventoryChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Models\Voucher;
use App\Models\VoucherTransaction;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdjustInventoryController extends Controller
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
            $itemsInventory = AdjustInventory::where('user_id', $user_id)
                ->orderBy($req->colName, $req->sort)
                ->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['itemsInventory' => $itemsInventory];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    public function view(Request $req)
    {

        try {

            $adjustInventory = AdjustInventory::with('adjustInventoryChild')->find($req->id);
            return ['adjustInventory' => $adjustInventory];
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
                if ($request->adjust_type == 'add') {

                    $groupedItems = [];

                    foreach ($request->childArray as $row) {
                        $itemId = $row['item_id'];
                        if (!isset($groupedItems[$itemId])) {
                            $groupedItems[$itemId] = [
                                'quantity' => 0,
                                'total' => 0,
                            ];
                        }
                        $groupedItems[$itemId]['quantity'] += (float) $row['quantity'];
                        $groupedItems[$itemId]['total'] += (float) $row['total'];
                    }

                    foreach ($groupedItems as $itemId => $data) {
                        $quantityToAdd = $data['quantity'];
                        $totalToAdd = $data['total'];

                        // Retrieve the current item
                        $item = ItemOemPartModeles::find($itemId);

                        $currentStock = ItemInventory::calculateTotalStockQty($itemId);
                        $currentTotalAmount = $item->avg_cost * $currentStock;

                        // Calculate new stock and total cost
                        $newStockQty = $currentStock + $quantityToAdd;
                        $newTotalAmount = $currentTotalAmount + $totalToAdd;

                        // Calculate new average cost
                        $newAvgCost = $newStockQty > 0
                        ? $newTotalAmount / $newStockQty
                        : 0;

                        // dd($newAvgCost);
                        // Update the item's stock and avg_cost
                        $item->avg_cost = $newAvgCost;
                        $item->save();
                    }
                    $adjust_inventory = new AdjustInventory();
                    $adjust_inventory->store_id = $request->store_id;
                    $adjust_inventory->user_id = $user_id;
                    $adjust_inventory->remarks = $request->remarks;
                    $adjust_inventory->adjust_type = $request->adjust_type;
                    $adjust_inventory->date = $request->date;
                    $adjust_inventory->total_amount = $request->total_amount;
                    $adjust_inventory->save();
                    $adjust_inventory_id = $adjust_inventory->id;

                    foreach ($request->childArray as $row) {

                        $adjust_inventory_child = new AdjustInventoryChild();
                        $adjust_inventory_child->user_id = $user_id;
                        $adjust_inventory_child->adjust_inventory_id = $adjust_inventory_id;
                        $adjust_inventory_child->item_id = $row['item_id'];
                        $adjust_inventory_child->quantity_in = $row['quantity'];
                        $adjust_inventory_child->quantity_out = 0;
                        $adjust_inventory_child->purchase_price = $row['rate'];
                        $adjust_inventory_child->total = $row['total'];
                        $adjust_inventory_child->cost = $row['avg_cost'];
                        $adjust_inventory_child->save();

                        $adjust_inventory_child = $adjust_inventory_child->id;

                        $itemInventory = new ItemInventory();
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->user_id = $user_id;
                        $itemInventory->adjust_inventory_id = $adjust_inventory_child;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 8;
                        $itemInventory->quantity_in = $row['quantity'];
                        $itemInventory->quantity_out = 0;
                        $itemInventory->purchase_price = $row['rate'];
                        $itemInventory->date = $request->date;
                        $itemInventory->save();

                        $itemUpdate = ItemOemPartModeles::find($row['item_id']);
                        $itemUpdate->purchase_price = $row['rate'];
                        // $avg_cost = PurchaseOrderChild::calculateAverageCostAndStore($row['item_id']);
                        // $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                    $debitside = 0;
                    $creditside = 0;
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucher = new Voucher();
                    $voucher->user_id = $user_id;
                    $voucher->name = "Add Adjust Inventory";
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->adjust_inventory_id = $adjust_inventory_id;
                    $voucher->date = $request->date;
                    $voucher->isApproved = 1;
                    $voucher->type = 3;
                    $voucher->generated_at = $request->date;
                    $voucher->total_amount = $request->total_amount;
                    $voucher->is_auto = 1;
                    $voucher->save();
                    $voucher_id = $voucher->id;

                    foreach ($request->childArray as $row) {
                        $PurchasePrice = ItemOemPartModeles::find($row['item_id']);
                        $itemName = $PurchasePrice->name;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->user_id = $user_id;
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 1;
                        $voucherTransaction->debit = $row['total'];
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->is_approved = 1;

                        $itemDescription = 'Item: ' . $itemName . ' is added from Adjust Inventory ' . ', Qty:' . $row['quantity'] . ', Rate: ' . $row['rate'];

                        $voucherTransaction->description = $itemDescription;
                        $voucherTransaction->save();
                        $debitside += $row['rate'];
                    }
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->user_id = $user_id;
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 182;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->total_amount;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->description = 'Add Adjust Inventory:';
                    $voucherTransaction->save();
                    $creditside += $row['rate'];
                } elseif ($request->adjust_type == 'remove') {

                    $groupedItems = [];
                    foreach ($request->childArray as $row) {
                        $itemId = $row['item_id'];
                        if (!isset($groupedItems[$itemId])) {
                            $groupedItems[$itemId] = ['quantity' => 0, 'total' => 0];
                        }
                        $groupedItems[$itemId]['quantity'] += $row['quantity'];
                        $groupedItems[$itemId]['total'] += $row['total'];
                    }

                    foreach ($groupedItems as $itemId => $values) {
                        $quantityToRemove = $values['quantity'];
                        $totalToRemove = $values['total'];

                        $item = ItemOemPartModeles::where('id', $itemId)->first();

                        $currentStockQty = ItemInventory::calculateTotalStockQty($itemId);
                        $currentTotalAmount = $currentStockQty * $item->avg_cost;

                        $newStockQty = $currentStockQty - $quantityToRemove;
                        $newTotalAmount = $currentTotalAmount - $totalToRemove;

                        $newAvgCost = $newStockQty > 0 ? $newTotalAmount / $newStockQty : 0;

                        $item->avg_cost = $newAvgCost;
                        $item->save();
                    }

                    $debitside = 0;
                    $creditside = 0;
                    $adjust_inventory = new AdjustInventory();
                    $adjust_inventory->store_id = $request->store_id;
                    $adjust_inventory->user_id = $user_id;
                    $adjust_inventory->remarks = $request->remarks;
                    $adjust_inventory->adjust_type = $request->adjust_type;
                    $adjust_inventory->date = $request->date;
                    $adjust_inventory->total_amount = $request->total_amount;
                    $adjust_inventory->save();
                    $adjust_inventory_id = $adjust_inventory->id;
                    foreach ($request->childArray as $row) {

                        $adjust_inventory_child = new AdjustInventoryChild();
                        $adjust_inventory_child->user_id = $user_id;
                        $adjust_inventory_child->cost = $request->avg_cost;
                        $adjust_inventory_child->adjust_inventory_id = $adjust_inventory_id;
                        $adjust_inventory_child->item_id = $row['item_id'];
                        $adjust_inventory_child->quantity_in = 0;
                        $adjust_inventory_child->quantity_out = $row['quantity'];
                        $adjust_inventory_child->purchase_price = $row['rate'];
                        $adjust_inventory_child->total = $row['total'];
                        $adjust_inventory_child->cost = $row['avg_cost'];
                        $adjust_inventory_child->save();

                        $adjust_inventory_child = $adjust_inventory_child->id;
                        $itemInventory = new ItemInventory();
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->user_id = $user_id;
                        $itemInventory->adjust_inventory_id = $adjust_inventory_child;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 9;
                        $itemInventory->quantity_in = 0;
                        $itemInventory->quantity_out = $row['quantity'];
                        $itemInventory->purchase_price = $row['rate'];
                        $itemInventory->date = $request->date;
                        $itemInventory->save();
                    }
                    $remarks = " PO: ";
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucher = new Voucher();
                    $voucher->user_id = $user_id;
                    $voucher->name = "Dispose Adjust Inventory";
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->adjust_inventory_id = $adjust_inventory_id;
                    $voucher->date = $request->date;
                    $voucher->isApproved = 1;
                    $voucher->type = 3;
                    $voucher->generated_at = $request->date;
                    $voucher->total_amount = $request->total_amount;
                    $voucher->is_auto = 1;
                    $voucher->save();
                    $voucher_id = $voucher->id;

                    foreach ($request->childArray as $row) {
                        $item = ItemOemPartModeles::find($row['item_id']);
                        if ($item) {
                            $itemName = $item->name;
                            $debitTransaction = new VoucherTransaction();
                            $debitTransaction->user_id = $user_id;
                            $debitTransaction->voucher_id = $voucher_id;
                            $debitTransaction->date = $request->date;
                            $debitTransaction->coa_account_id = 1;
                            $debitTransaction->debit = 0;
                            $debitTransaction->credit = $row['total'];
                            $debitTransaction->is_approved = 1;
                            $itemDescription = 'Item: ' . $itemName . ' is remove from Adjust Inventory ' . ', Qty:' . $row['quantity'] . ', Rate: ' . $row['rate'];
                            $debitTransaction->description = $itemDescription;
                            $debitTransaction->save();

                            $debitside += $row['total'];
                        }
                    }
                    $creditTransaction = new VoucherTransaction();
                    $creditTransaction->user_id = $user_id;
                    $creditTransaction->voucher_id = $voucher_id;
                    $creditTransaction->date = $request->date;
                    $creditTransaction->coa_account_id = 183;
                    $creditTransaction->debit = $request->total_amount;
                    $creditTransaction->credit = 0;
                    $creditTransaction->is_approved = 1;
                    $creditTransaction->description = 'Dispose Adjust Inventory:';
                    $creditTransaction->save();

                    $creditside += $row['total'];
                }
            });

            return ['status' => 'ok', 'message' => 'Adjust Item created successfully'];
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
        try {

            $adjustInventory = AdjustInventory::with('adjustInventoryChild')->find($req->id);

            return ['adjustInventory' => $adjustInventory];
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
                if ($request->adjust_type == 'add') {

                    $adjustInventory = AdjustInventory::find($request->id);
                    $adjustInventory->store_id = $request->store_id;
                    $adjustInventory->user_id = $user_id;
                    $adjustInventory->remarks = $request->remarks;
                    $adjustInventory->date = $request->date;
                    $adjustInventory->adjust_type = $request->adjust_type;
                    $adjustInventory->total_amount = $request->total_amount;
                    $adjustInventory->save();
                    $adjust_inventory_id = $adjustInventory->id;

                    $adjustInventoryChildIds = AdjustInventoryChild::where('adjust_inventory_id', $adjust_inventory_id)->pluck('id')->toArray();

                    $addAdjustInventory = AdjustInventory::where('adjust_type', 'add')->where('id', $request->id)->first();

                    $addAdjustInventoryId = $addAdjustInventory ? $addAdjustInventory->id : null;

                    $groupedItems = [];

                    // Grouping items and calculations
                    foreach ($request->adjust_inventory_child as $row) {
                        $itemId = $row['item_id'];
                        $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                        if (!isset($groupedItems[$itemId])) {
                            $groupedItems[$itemId] = ['quantity' => 0, 'total' => 0];
                        }

                        $groupedItems[$itemId]['quantity'] += $row['quantity_in'];
                        $groupedItems[$itemId]['total'] += $row['amount'];
                    }

                    if ($addAdjustInventoryId) {
                        foreach ($groupedItems as $itemId => $values) {
                            $quantityToAdd = $values['quantity'];
                            $totalToAdd = $values['total'];

                            // Get item details
                            $item = ItemOemPartModeles::where('id', $itemId)->first();

                            // Calculate remove totals
                            $removetotalQty = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_in', 0)
                                ->sum('adjust_inventory_children.quantity_out');

                            $removetotalsum = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_in', 0)
                                ->sum('adjust_inventory_children.total');

                            // Calculate add totals
                            $addtotalQty = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_out', 0)
                                ->sum('adjust_inventory_children.quantity_in');

                            $addtotalsum = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_out', 0)
                                ->sum('adjust_inventory_children.total');

                            // Calculate current totals
                            $currentStockQty = ItemInventory::calculateTotalStockQty($itemId);
                            $currentTotalAmount = $currentStockQty * $item->avg_cost;

                            // Update stock and cost

                            $newStockQty = $currentStockQty + $quantityToAdd - $addtotalQty + $removetotalQty;
                            $newTotalAmount = $currentTotalAmount + $totalToAdd - $addtotalsum + $removetotalsum;

                            $newAvgCost = $newStockQty > 0 ? $newTotalAmount / $newStockQty : 0;

                            // Update item details
                            $item->avg_cost = $newAvgCost;
                            $item->save();
                        }
                    }

                    AdjustInventoryChild::where('adjust_inventory_id', $adjust_inventory_id)->delete();
                    ItemInventory::whereIn('adjust_inventory_id', $adjustInventoryChildIds)->delete();

                    $voucher = Voucher::where('adjust_inventory_id', $request->id)->get();

                    if ($voucher) {
                        foreach ($voucher as $voucher) {
                            Voucher::where('id', $voucher->id)->delete();
                            VoucherTransaction::where('voucher_id', $voucher->id)->delete();
                        }
                    }

                    foreach ($request->adjust_inventory_child as $row) {

                        $adjust_inventory_child = new AdjustInventoryChild();
                        $adjust_inventory_child->user_id = $user_id;
                        $adjust_inventory_child->adjust_inventory_id = $adjust_inventory_id;
                        $adjust_inventory_child->item_id = $row['item_id'];
                        $adjust_inventory_child->quantity_in = $row['quantity_in'];
                        $adjust_inventory_child->quantity_out = 0;
                        $adjust_inventory_child->purchase_price = $row['purchase_price'];
                        $adjust_inventory_child->total = $row['amount'];
                        $adjust_inventory_child->cost = $row['avg_cost'];
                        $adjust_inventory_child->save();

                        $itemInventory = new ItemInventory();
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->user_id = $user_id;
                        $itemInventory->adjust_inventory_id = $adjust_inventory_child->id;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 8;
                        $itemInventory->quantity_in = $row['quantity_in'];
                        $itemInventory->quantity_out = 0;
                        $itemInventory->purchase_price = $row['purchase_price'];
                        $itemInventory->date = $request->date;
                        $itemInventory->save();

                    }

                    $debitside = 0;
                    $creditside = 0;
                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucher = new Voucher();
                    $voucher->user_id = $user_id;
                    $voucher->name = "Add Adjust Inventory";
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->adjust_inventory_id = $adjust_inventory_id;
                    $voucher->date = $request->date;
                    $voucher->isApproved = 1;
                    $voucher->type = 3;
                    $voucher->generated_at = $request->date;
                    $voucher->total_amount = $request->total_amount;
                    $voucher->is_auto = 1;
                    $voucher->save();
                    $voucher_id = $voucher->id;

                    foreach ($request->adjust_inventory_child as $row) {
                        $PurchasePrice = ItemOemPartModeles::find($row['item_id']);
                        $itemName = $PurchasePrice->name;

                        $voucherTransaction = new VoucherTransaction();
                        $voucherTransaction->user_id = $user_id;
                        $voucherTransaction->voucher_id = $voucher_id;
                        $voucherTransaction->date = $request->date;
                        $voucherTransaction->coa_account_id = 1;
                        $voucherTransaction->debit = $row['amount'];
                        $voucherTransaction->credit = 0;
                        $voucherTransaction->is_approved = 1;

                        $itemDescription = 'Item: ' . $itemName . ' is added from Adjust Inventory ' . ', Qty:' . $row['quantity_in'] . ', Rate: ' . $row['purchase_price'];

                        $voucherTransaction->description = $itemDescription;
                        $voucherTransaction->save();
                        $debitside += $row['purchase_price'];
                    }
                    $voucherTransaction = new VoucherTransaction();
                    $voucherTransaction->user_id = $user_id;
                    $voucherTransaction->voucher_id = $voucher_id;
                    $voucherTransaction->date = $request->date;
                    $voucherTransaction->coa_account_id = 182;
                    $voucherTransaction->debit = 0;
                    $voucherTransaction->credit = $request->total_amount;
                    $voucherTransaction->is_approved = 1;
                    $voucherTransaction->description = 'Add Adjust Inventory:';
                    $voucherTransaction->save();
                    $creditside += $row['purchase_price'];
                }
                if ($request->adjust_type == 'remove') {

                    $adjustInventory = AdjustInventory::find($request->id);
                    $adjustInventory->store_id = $request->store_id;
                    $adjustInventory->user_id = $user_id;
                    $adjustInventory->remarks = $request->remarks;
                    $adjustInventory->date = $request->date;
                    $adjustInventory->adjust_type = $request->adjust_type;
                    $adjustInventory->total_amount = $request->total_amount;
                    $adjustInventory->save();
                    $adjust_inventory_id = $adjustInventory->id;

                    $adjustInventoryChildIds = AdjustInventoryChild::where('adjust_inventory_id', $adjust_inventory_id)->pluck('id')->toArray();

                    $removeAdjustInventory = AdjustInventory::where('adjust_type', 'remove')
                        ->where('id', $request->id)
                        ->first();

                    $removeAdjustInventoryId = $removeAdjustInventory ? $removeAdjustInventory->id : null;

                    $groupedItems = [];
                    foreach ($request->adjust_inventory_child as $row) {
                        $itemId = $row['item_id'];
                        if (!isset($groupedItems[$itemId])) {
                            $groupedItems[$itemId] = ['quantity' => 0, 'total' => 0];
                        }
                        $groupedItems[$itemId]['quantity'] += $row['quantity_out'];
                        $groupedItems[$itemId]['total'] += $row['amount'];
                    }

                    if ($removeAdjustInventoryId) {
                        foreach ($groupedItems as $itemId => $values) {
                            $quantityToRemove = $values['quantity'];
                            $totalToRemove = $values['total'];

                            $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                            $removetotalQty = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_in', 0)
                                ->sum('adjust_inventory_children.quantity_out');

                            $removetotalsum = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_in', 0)
                                ->sum('adjust_inventory_children.total');

                            $addtotalQty = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_out', 0)
                                ->sum('adjust_inventory_children.quantity_in');

                            $addtotalsum = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                                ->where('adjust_inventory_children.item_id', $itemId)
                                ->where('adjust_inventories.id', $request->id)
                                ->where('quantity_out', 0)
                                ->sum('adjust_inventory_children.total');

                            $item = ItemOemPartModeles::where('id', $itemId)->first();

                            $currentStockQty = $stockQty;
                            $currentTotalAmount = $currentStockQty * $item->avg_cost;

                            $newStockQty = $currentStockQty - $quantityToRemove - $addtotalQty + $removetotalQty;

                            if ($newStockQty < 0) {
                                $availableStockQty = $currentStockQty - $addtotalQty;
                                throw new \Exception(
                                    "Quantity cannot be less than zero. New Available stock is $availableStockQty. Please adjust the input or check the available stock."
                                );
                            }

                            $newTotalAmount = $currentTotalAmount - $totalToRemove - $addtotalsum + $removetotalsum;

                            $newAvgCost = $newStockQty > 0 ? $newTotalAmount / $newStockQty : 0;

                            $item->avg_cost = $newAvgCost;
                            $item->save();
                        }
                    }

                    AdjustInventoryChild::where('adjust_inventory_id', $adjust_inventory_id)->delete();
                    ItemInventory::whereIn('adjust_inventory_id', $adjustInventoryChildIds)->delete();

                    $vouchers = Voucher::where('adjust_inventory_id', $request->id)->get();

                    if ($vouchers) {
                        foreach ($vouchers as $voucher) {
                            Voucher::where('id', $voucher->id)->delete();
                            VoucherTransaction::where('voucher_id', $voucher->id)->delete();
                        }
                    }

                    foreach ($request->adjust_inventory_child as $row) {

                        $adjust_inventory_child = new AdjustInventoryChild();
                        $adjust_inventory_child->user_id = $user_id;
                        $adjust_inventory_child->adjust_inventory_id = $adjust_inventory_id;
                        $adjust_inventory_child->item_id = $row['item_id'];
                        $adjust_inventory_child->quantity_in = 0;
                        $adjust_inventory_child->quantity_out = $row['quantity_out'];
                        $adjust_inventory_child->purchase_price = $row['purchase_price'];
                        $adjust_inventory_child->total = $row['amount'];
                        $adjust_inventory_child->cost = $row['avg_cost'];
                        $adjust_inventory_child->save();

                        $itemInventory = new ItemInventory();
                        $itemInventory->store_id = $request->store_id;
                        $itemInventory->user_id = $user_id;
                        $itemInventory->adjust_inventory_id = $adjust_inventory_child->id;
                        $itemInventory->item_id = $row['item_id'];
                        $itemInventory->inventory_type_id = 9;
                        $itemInventory->quantity_out = $row['quantity_out'];
                        $itemInventory->quantity_in = 0;
                        $itemInventory->purchase_price = $row['purchase_price'];
                        $itemInventory->date = $request->date;
                        $itemInventory->save();
                        $poChildIds[] = $itemInventory->id;
                    }

                    $getVoucherNo = DB::table('vouchers')->where('type', 3)->orderBy('id', 'desc')->first();
                    $newVoucherNo = $getVoucherNo ? $getVoucherNo->voucher_no + 1 : 1;

                    $voucher = new Voucher();
                    $voucher->user_id = $user_id;
                    $voucher->name = "Dispose Adjust Inventory";
                    $voucher->voucher_no = $newVoucherNo;
                    $voucher->adjust_inventory_id = $adjust_inventory_id;
                    $voucher->date = $request->date;
                    $voucher->isApproved = 1;
                    $voucher->type = 3;
                    $voucher->generated_at = $request->date;
                    $voucher->total_amount = $request->total_amount;
                    $voucher->is_auto = 1;
                    $voucher->save();

                    $voucher_id = $voucher->id;

                    foreach ($request->adjust_inventory_child as $row) {
                        $PurchasePrice = ItemOemPartModeles::find($row['item_id']);
                        $itemName = $PurchasePrice->name;

                        $debitTransaction = new VoucherTransaction();
                        $debitTransaction->user_id = $user_id;
                        $debitTransaction->voucher_id = $voucher_id;
                        $debitTransaction->date = $request->date;
                        $debitTransaction->coa_account_id = 1;
                        $debitTransaction->debit = 0;
                        $debitTransaction->credit = $row['amount'];
                        $debitTransaction->is_approved = 1;
                        $itemDescription = 'Item: ' . $itemName . ' is remove from Adjust Inventory ' . ', Qty:' . $row['quantity_out'] . ', Rate: ' . $row['purchase_price'];
                        $debitTransaction->description = $itemDescription;
                        $debitTransaction->save();
                    }
                    $creditTransaction = new VoucherTransaction();
                    $creditTransaction->user_id = $user_id;
                    $creditTransaction->voucher_id = $voucher_id;
                    $creditTransaction->date = $request->date;
                    $creditTransaction->coa_account_id = 183;
                    $creditTransaction->debit = $request->total_amount;
                    $creditTransaction->credit = 0;
                    $creditTransaction->is_approved = 1;
                    $creditTransaction->description = 'Dispose Adjust Inventory:';
                    $creditTransaction->save();
                }
            });
            return ['status' => 'ok', 'message' => 'Adjust Item Updated successfully'];
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

    public function destroy(Request $request)
    {
        $id = $request->id;

        // Start the transaction
        DB::beginTransaction();

        try {
            $adjustInventory = AdjustInventory::find($id);

            if (!$adjustInventory) {
                throw new \Exception('Adjust Inventory not found');
            }

            if ($adjustInventory->adjust_type === 'remove') {
                $adjustInventoryChildren = AdjustInventoryChild::where('adjust_inventory_id', $id)
                    ->where('quantity_in', 0)
                    ->get();

                foreach ($adjustInventoryChildren as $child) {
                    $itemId = $child->item_id;

                    $totalCostAdjustInventory = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                        ->where('adjust_inventories.id', $id)
                        ->where('adjust_inventory_children.item_id', $itemId)
                        ->sum('adjust_inventory_children.total');

                    $totalQtyAdjustInventory = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                        ->where('adjust_inventories.id', $id)
                        ->where('adjust_inventory_children.item_id', $itemId)
                        ->sum('adjust_inventory_children.quantity_out');

                    $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                    $itemUpdate = ItemOemPartModeles::find($itemId);

                    if ($itemUpdate) {
                        $itemAvgCost = $itemUpdate->avg_cost;

                        $totalCost = ($itemAvgCost * $stockQty) + $totalCostAdjustInventory;
                        $totalQuantity = $stockQty + $totalQtyAdjustInventory;

                        $averagePrice = $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;

                        $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                }
            }

            if ($adjustInventory->adjust_type === 'add') {
                $adjustInventoryChildren = AdjustInventoryChild::where('adjust_inventory_id', $id)
                    ->where('quantity_out', 0)
                    ->get()
                    ->groupBy('item_id');

                foreach ($adjustInventoryChildren as $itemId => $children) {
                    $totalCostAdjustInventory = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                        ->where('adjust_inventories.id', $id)
                        ->where('item_id', $itemId)
                        ->where('quantity_out', 0)
                        ->sum('adjust_inventory_children.total');

                    $totalQtyAdjustInventory = AdjustInventoryChild::join('adjust_inventories', 'adjust_inventories.id', '=', 'adjust_inventory_children.adjust_inventory_id')
                        ->where('adjust_inventories.id', $id)
                        ->where('item_id', $itemId)
                        ->where('quantity_out', 0)
                        ->sum('adjust_inventory_children.quantity_in');

                    $stockQty = ItemInventory::calculateTotalStockQty($itemId);

                    $itemUpdate = ItemOemPartModeles::find($itemId);

                    if ($itemUpdate) {
                        $itemAvgCost = $itemUpdate->avg_cost;

                        $totalCost = ($itemAvgCost * $stockQty) - $totalCostAdjustInventory;
                        $totalQuantity = $stockQty - $totalQtyAdjustInventory;

                        $averagePrice = $totalQuantity > 0 ? $totalCost / $totalQuantity : 0;

                        $itemUpdate->avg_cost = $averagePrice;
                        $itemUpdate->save();
                    }
                }
            }

            $voucher = Voucher::where('adjust_inventory_id', $id)->first();
            if ($voucher) {
                $voucherId = $voucher->id;
                VoucherTransaction::where('voucher_id', $voucherId)->delete();
                $voucher->delete();
            }

            $adjustInventoryChildIds = AdjustInventoryChild::where('adjust_inventory_id', $id)->pluck('id');

            ItemInventory::whereIn('adjust_inventory_id', $adjustInventoryChildIds)->delete();
            AdjustInventoryChild::where('adjust_inventory_id', $id)->delete();
            $adjustInventory->delete();

            // Commit the transaction
            DB::commit();

            return ['status' => 'ok', 'message' => 'Adjust Item Deleted successfully'];
        } catch (\Exception $e) {
            // Rollback the transaction
            DB::rollBack();

            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

}
