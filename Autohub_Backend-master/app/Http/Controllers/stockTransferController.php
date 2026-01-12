<?php

namespace App\Http\Controllers;

use App\Services\Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\StockTransfer;
use App\Models\StockTransferChild;
use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use App\Services\CustomErrorMessages;

class stockTransferController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        $transfer_store_id = $req->transfer_store_id;
        $receive_store_id = $req->receive_store_id;
        $item_id = $req->item_id;
        $category_id = $req->category_id;
        $sub_category_id = $req->sub_category_id;
        $part_model_id = $req->part_model_id;
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

            $stocTransfer = StockTransfer::with('stockchildren', 'storetransfer', 'storereceive')
                ->when($transfer_store_id, function ($q, $transfer_store_id) {
                    return $q->where('store_transfer_id', $transfer_store_id);
                })
                ->when($receive_store_id, function ($q, $receive_store_id) {
                    return $q->where('store_received_id', $receive_store_id);
                })
                ->when($item_id, function ($query, $item_id) {
                    $query->whereHas('stockchildren', function ($qu) use ($item_id) {
                        $qu->where('item_id', $item_id);
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('stockchildren', function ($query) use ($category_id) {
                        $query->whereHas('item', function ($query) use ($category_id) {
                            $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                    $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                        $qu->where('category_id', $category_id);
                                    });
                                });
                            });
                        });
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {
                    $query->whereHas('stockchildren', function ($query) use ($sub_category_id) {
                        $query->whereHas('item', function ($query) use ($sub_category_id) {
                            $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                    $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                        $qu->where('id', $sub_category_id);
                                    });
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {
                    $query->whereHas('stockchildren', function ($qu) use ($part_model_id) {
                        $qu->whereHas('item', function ($qu) use ($part_model_id) {
                            $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                                $qu->where('machine_part_model_id', $part_model_id);
                            });
                        });
                    });
                })
                ->where('user_id', $user_id) // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);


            return ['stocTransfer' => $stocTransfer];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getTransfersReport(Request $req)
    {
        $transfer_store_id = $req->transfer_store_id;
        $receive_store_id = $req->receive_store_id;
        $item_id = $req->item_id;
        $category_id = $req->category_id;
        $sub_category_id = $req->sub_category_id;
        $part_model_id = $req->part_model_id;
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

            $stocTransfer = StockTransfer::with('stockchildren', 'storetransfer', 'storereceive')

                ->when($from, function ($query, $from) {
                    $query->where('date', '>=', $from);
                })
                ->when($to, function ($query, $to) {
                    $query->where('date', '<=', $to);
                })

                ->when($transfer_store_id, function ($q, $transfer_store_id) {
                    return $q->where('store_transfer_id', $transfer_store_id);
                })
                ->when($receive_store_id, function ($q, $receive_store_id) {
                    return $q->where('store_received_id', $receive_store_id);
                })
                ->when($item_id, function ($query, $item_id) {
                    $query->whereHas('stockchildren', function ($qu) use ($item_id) {
                        $qu->where('item_id', $item_id);
                    });
                })
                ->when($category_id, function ($query, $category_id) {
                    $query->whereHas('stockchildren', function ($query) use ($category_id) {
                        $query->whereHas('item', function ($query) use ($category_id) {
                            $query->whereHas('machinePartOemPart', function ($qu) use ($category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($category_id) {
                                    $qu->whereHas('subcategories', function ($qu) use ($category_id) {
                                        $qu->where('category_id', $category_id);
                                    });
                                });
                            });
                        });
                    });
                })
                ->when($sub_category_id, function ($query, $sub_category_id) {
                    $query->whereHas('stockchildren', function ($query) use ($sub_category_id) {
                        $query->whereHas('item', function ($query) use ($sub_category_id) {
                            $query->whereHas('machinePartOemPart', function ($qu) use ($sub_category_id) {
                                $qu->whereHas('machinePart', function ($qu) use ($sub_category_id) {
                                    $qu->whereHas('subcategories', function ($qu) use ($sub_category_id) {
                                        $qu->where('id', $sub_category_id);
                                    });
                                });
                            });
                        });
                    });
                })
                ->when($part_model_id, function ($query, $part_model_id) {
                    $query->whereHas('stockchildren', function ($qu) use ($part_model_id) {
                        $qu->whereHas('item', function ($qu) use ($part_model_id) {
                            $qu->whereHas('machinePartOemPart', function ($qu) use ($part_model_id) {
                                $qu->where('machine_part_model_id', $part_model_id);
                            });
                        });
                    });
                })
                ->where('user_id', $user_id) // user_id
                ->get();


            return ['stocTransfer' => $stocTransfer];
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
     * @param \Illuminate\Http\Response transfer_from
     * @param \Illuminate\Http\Response transfer_to
     * @param \Illuminate\Http\Response date
     * @param \Illuminate\Http\Response rows
     * @param \Illuminate\Http\Response item_id
     * @param \Illuminate\Http\Response qty_transferred
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

        DB::beginTransaction();
        try {


            $StockTransfer = new StockTransfer();
            $StockTransfer->store_transfer_id = $request->transfer_from['id'];
            $StockTransfer->store_received_id = $request->transfer_to['id'];
            $StockTransfer->date = $request->date;
            $StockTransfer->user_id = $user_id; //user id
            $StockTransfer->save();
            $stockParent_id = $StockTransfer->id;

            foreach ($request->list as $row) {
                $store_id = $request->transfer_from['id'];
                $id = $row['item_id'];
                $data = Iteminventory::select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))
                    ->where('store_id', $store_id)->where('item_id', $id)->first();

                if ($data->quantity < $row['qty_transferred']) {
                    DB::rollback();
                    return ['status' => "error", 'message' => 'Transfer Quantity is greater than available quantity'];
                } else {
                    $stockChilddata = new StockTransferChild();
                    $stockChilddata->stock_transfer_id = $stockParent_id;
                    $stockChilddata->item_id = $row['item_id'];
                    $stockChilddata->transfer_quanitiy = $row['qty_transferred'];
                    $stockChilddata->user_id = $user_id; //user id

                    $stockChilddata->save();

                    $stockChilddata = new ItemInventory();
                    $stockChilddata->item_id = $row['item_id'];
                    $stockChilddata->store_id = $request->transfer_from['id'];
                    $stockChilddata->inventory_type_id = 10;
                    $stockChilddata->quantity_out = $row['qty_transferred'];
                    $stockChilddata->date = date('Y-m-d');
                    $stockChilddata->user_id = $user_id; //user id
                    $stockChilddata->save();

                    $stockChilddata = new ItemInventory();
                    $stockChilddata->item_id = $row['item_id'];
                    $stockChilddata->store_id = $request->transfer_to['id'];
                    $stockChilddata->inventory_type_id = 9;
                    $stockChilddata->quantity_in = $row['qty_transferred'];
                    $stockChilddata->date = date('Y-m-d');
                    $stockChilddata->user_id = $user_id; //user id
                    $stockChilddata->save();
                }
            }

            DB::commit();
            return ['status' => "ok", 'message' => 'Stock Transfer successfully'];
        } catch (\Exception $e) {
            DB::rollback();
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
    public function destroy($id)
    {
        //
    }
    /**

     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function getStockTransferDetails(Request $req)
    {

        try {

            $id = $req->id;
            $stocktransfer = StockTransfer::with('stockchildren', 'storetransfer', 'storereceive')
                ->when($id, function ($q, $id) {
                    return $q->where('id', $id);
                })
                ->first();
            return ['stocktransfer' => $stocktransfer];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
