<?php

namespace App\Models;

use App\Models\ItemInventory;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrderChild extends Model
{
    use HasFactory;
    protected $table = 'purchase_order_children';
    protected $fillable = ['purchase_order_id', 'user_id', 'item_id', 'quantity', 'received_quantity', 'purchase_price', 'amount', 'remarks', 'expense', 'unit_expense', 'current_quantity', 'current_quantity_price'];

    public function item()
    {
        return $this->belongsTo(ItemOemPartModeles::class, 'item_id', 'id')->with('machinePartOemPart', 'brand', 'origin');
    }
    public function PoNo()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'id')
            ->where('is_received', '=', 1)->select('id', 'po_no', 'request_date', 'is_received', 'person_id')->with('supplier');
    }
    public function PurchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class, 'purchase_order_id', 'id')
            ->with('supplier');
    }
    public static function getAveragePriceByItemId($itemId, $store_id)
    {
        $total_quantity = 0;
        $total_price = 0;
        $total_expense = 0;
        $purchasePrice = PurchaseOrder::with('purchaseorderchild')
            ->whereHas('purchaseorderchild', function ($qu) use ($itemId) {
                return $qu->where('item_id', $itemId);
            })
        // ->select('purchaseorderchild.item_id', 'purchaseorderchild.purchase_price', 'purchaseorderchild.received_quantity', 'purchaseorderchild.expense')
            ->orderBy('received_date', 'desc')
            ->get();
        $stockQuantity = ItemInventory::getStockQuantity($store_id, $itemId);
        $stock = $stockQuantity;
        return $purchasePrice->purchaseorderchild->received_quantity;
        foreach ($purchasePrice as $purchasePrice) {
            $total_quantity += $purchasePrice->received_quantity;
            $total_price += $purchasePrice->purchase_price;
            $total_expense += $purchasePrice->unit_expense;

            if ($total_quantity >= $stock) {
                $avg_price = ($total_price / $total_quantity) + ($total_expense / $total_quantity);
                return $avg_price;
            }
        }
    }
    public static function getStoredAveragePrice($itemId)
    {

        $item = ItemOemPartModeles::where('id', $itemId)->first();

        return $item->avg_price;
    }
    //  Average cost is sum of Average price and average Expense
    public static function getStoredAverageCost($itemId)
    {

        $item = ItemOemPartModeles::where('id', $itemId)->first();

        return $item->avg_cost;
    }
    public static function getStoredAveragePriceCostExpense($itemId)
    {

        $item = ItemOemPartModeles::where('id', $itemId)->select('avg_cost as AvgCost')->first();

        return $item;
    }
    public static function calculateAveragePriceAndStore($itemId)
    {
        // return $itemId;
        $totalQuantity = 0;
        $totalAmount = 0;
        $stockQty = ItemInventory::calculateTotalStockQtyWithPendingInvoices($itemId);
        $CQty = 0;

        $purchaseOrders = PurchaseOrderChild::select('item_id', 'purchase_orders.is_received', 'purchase_price', 'request_date', 'purchase_order_children.id')
            ->where('item_id', $itemId)
            ->where('purchase_orders.is_received', 1)
            ->orderBy('purchase_orders.request_date', 'desc')
            ->orderBy('purchase_orders.id', 'desc')
            ->join('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_children.purchase_order_id')
            ->get();
        $array = [];
        $i = 0;

        foreach ($purchaseOrders as $purchaseOrder2) {

            if ($totalQuantity < $stockQty) {
                if ($totalQuantity + $purchaseOrder2->current_quantity > $stockQty) {
                    $CQty = $stockQty - $totalQuantity;
                    $totalQuantity += $stockQty - $totalQuantity;
                    $totalAmount += (($CQty) * $purchaseOrder2->purchase_price);

                    $array[] = array(
                        'type' => 1,
                        'individualAvg' => (($CQty) * $purchaseOrder2->purchase_price) / $CQty,
                        'ptotal' => ($CQty) * $purchaseOrder2->purchase_price,
                        'prate' => $purchaseOrder2->purchase_price,

                        'pqty' => $CQty,
                        'pTotalqty' => $CQty,
                        'totalAmount' => $totalAmount,
                        '$totalQuantity' => $totalQuantity,
                        '$stockQty' => $stockQty,
                        'averagePrice' => $totalAmount / $totalQuantity,

                        ' $i' => $i,
                        ' id' => $purchaseOrder2->id,
                        '$CQty' => $CQty,
                        '$$totalQuantity - $stockQty' => $totalQuantity - $stockQty,

                    );
                } elseif ($totalQuantity + $purchaseOrder2->current_quantity <= $stockQty) {
                    $totalQuantity += $purchaseOrder2->current_quantity;
                    $totalAmount += ($purchaseOrder2->current_quantity * $purchaseOrder2->purchase_price);
                    if ($purchaseOrder2->current_quantity > 0) {
                        $totAvg = ($purchaseOrder2->current_quantity * $purchaseOrder2->purchase_price) / ($purchaseOrder2->current_quantity);
                    } else {
                        $totAvg = 0; // or handle it in a way that fits your logic
                    }

                    $array[] = array(
                        'type' => 2,
                        'individualAvg' => $purchaseOrder2->current_quantity > 0
                        ? ($purchaseOrder2->current_quantity * $purchaseOrder2->purchase_price) / $purchaseOrder2->current_quantity
                        : 0, // or handle it with a fallback value as needed

                        'ptotal*' => $purchaseOrder2->current_quantity * $purchaseOrder2->purchase_price,
                        'prate' => $purchaseOrder2->purchase_price,

                        'pqty' => $purchaseOrder2->current_quantity,
                        'pTotalqty*' => $purchaseOrder2->current_quantity,
                        'totalAmount' => $totalAmount,
                        '$totalQuantity' => $totalQuantity,
                        '$stockQty' => $stockQty,
                        'averagePrice' => $totalAmount / $totalQuantity,

                        ' $i' => $i,
                        ' id' => $purchaseOrder2->id,

                    );
                }
                $i += 1;
            } else {
                break;
            }
        }

        if ($totalQuantity > 0) {
            $averagePrice = $totalAmount / $totalQuantity;
            return $averagePrice;
        }
        return 0;
    }
    public static function calculateAverageExpenseAndStore($itemId)
    {
        $totalQuantity = 0;
        $totalAmount = 0;
        $stockQty = ItemInventory::calculateTotalStockQtyWithPendingInvoices($itemId);

        $CQty = 0;

        $purchaseOrders = PurchaseOrderChild::select('item_id', 'current_quantity', 'unit_expense', 'request_date', 'purchase_order_children.id')
            ->where('item_id', $itemId)
            ->where('purchase_orders.is_received', 1)
            ->orderBy('purchase_orders.request_date', 'desc')
            ->orderBy('purchase_orders.id', 'desc')
            ->join('purchase_orders', 'purchase_orders.id', '=', 'purchase_order_children.purchase_order_id')
            ->get();
        $array = [];
        $i = 0;

        foreach ($purchaseOrders as $purchaseOrder2) {

            if ($totalQuantity < $stockQty) {
                if ($totalQuantity + $purchaseOrder2->current_quantity > $stockQty) {
                    $CQty = $stockQty - $totalQuantity;
                    $totalQuantity += $stockQty - $totalQuantity;
                    $totalAmount += (($CQty) * $purchaseOrder2->unit_expense);
                } elseif ($totalQuantity + $purchaseOrder2->current_quantity <= $stockQty) {
                    $totalQuantity += $purchaseOrder2->current_quantity;
                    $totalAmount += ($purchaseOrder2->current_quantity * $purchaseOrder2->unit_expense);
                    $totAvg = $purchaseOrder2->current_quantity > 0
                    ? ($purchaseOrder2->current_quantity * $purchaseOrder2->unit_expense) / $purchaseOrder2->current_quantity
                    : 0; // Set to 0 or any fallback value

                }
                $i += 1;
            } else {
                break;
            }
        }

        if ($totalQuantity > 0) {
            $averagePrice = $totalAmount / $totalQuantity;
            return $averagePrice;
        }
        return 0;
    }
    public static function calculateAverageCostAndStore($itemId)
    {
        $AvgCost = PurchaseOrderChild::calculateAverageExpenseAndStore($itemId) + PurchaseOrderChild::calculateAveragePriceAndStore($itemId);

        return $AvgCost;
    }

    public function rackShelf()
    {
        return $this->hasMany(ItemRackShelf::class, 'purchase_order_child_id')->with('racks', 'shelves');
    }

}
