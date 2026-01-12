<?php

namespace App\Http\Controllers;

use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\kitInventory;
use App\Models\MachinePartOemPartNo;
use App\Models\kitChild;
use App\Models\MachinePart;
use App\Services\CustomErrorMessages;

class KitInventoryController extends Controller
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

        $store_id = $req->store_id;
        $store_type_id = $req->store_type_id;
        try {

            $kitInv = kitInventory::with('kitParent', 'store')
                ->where('user_id', $user_id)  // user_id
                ->when($store_id, function ($q, $store_id) {
                    return $q->where('store_id', $store_id);
                })
                ->when($store_type_id, function ($query) use ($store_type_id) {
                    $query->whereHas('store', fn ($query) =>
                    $query->where('store_type_id',  $store_type_id));
                })
                ->select(DB::raw("SUM(in_flow) - SUM(out_flow) as total_quantity"), 'id', 'kit_id', 'store_id')
                ->groupBy('kit_id')
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);


            return ['KitInventory' => $kitInv];
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

        $store_id = $request->store_id;
        $kit_id = $request->kit_id;
        $kitdata = ItemOemPartModeles::with('machinePartOemPartNO')->where('id', $kit_id)->first();
        $childdata = $kitdata->machinePartOemPartNO->kitchild2;
        $itemInv = [];
        foreach ($childdata as $rows) {

            $existing_quantity = ItemInventory::where('store_id', $store_id)->where('item_id', $rows['item_id'])->groupby('item_id', 'store_id')->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as quantity'))->value('quantity');
            $existing_quantity;
            if ($existing_quantity == null) {
                $existing_quantity = 0;
            }
            if (($rows['quantity'] * $request->in_flow) > $existing_quantity) {
                return ['status' => 'error', 'message' => 'item quantity exceeding than existing quantity'];
            }
        }
        try {
            DB::transaction(function () use ($request, $user_id) {

                $kitdata = ItemOemPartModeles::with('machinePartOemPartNO')->where('id', $request->kit_id)->first();

                $parent_id = $kitdata->id;
                $childdata = $kitdata->machinePartOemPartNO->kitchild2;

                $itemInv = [];
                foreach ($childdata as $rows) {
                    $itemInv[] = array(
                        'quantity' => $rows['quantity'],
                        'item_id' => $rows['item_id'],
                    );
                }

                foreach ($itemInv as $row) {
                    $kitChilddata = new ItemInventory();;
                    $kitChilddata->inventory_type_id = 2;
                    $kitChilddata->item_id = $row['item_id'];
                    $kitChilddata->quantity_in = $row['quantity'] * $request->out_flow;
                    $kitChilddata->quantity_out = $row['quantity'] * $request->in_flow;
                    $kitChilddata->store_id = $request->store_id;
                    $kitChilddata->user_id = $user_id; //user id
                    $kitChilddata->date = date('Y-m-d');
                    $kitChilddata->save();
                }

                $kitChilddata = new ItemInventory();;
                $kitChilddata->inventory_type_id = 2;
                $kitChilddata->item_id = $parent_id;
                $kitChilddata->quantity_in = $request->in_flow;
                $kitChilddata->quantity_out = $request->out_flow;
                $kitChilddata->store_id = $request->store_id;
                $kitChilddata->user_id = $user_id; //user id
                $kitChilddata->date = date('Y-m-d');
                $kitChilddata->save();
            });



            if ($request->in_flow > 0) {
                return ['status' => "ok", 'message' => 'Kit Make successfully'];
            }
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function breakKit(Request $request)
    {

        $store_id = $request->store_id;
        $kit_id = $request->kit_id;
        $kitdata = ItemOemPartModeles::with('machinePartOemPartNO')->where('id', $kit_id)->first();
        $childdata = $kitdata->machinePartOemPartNO->kitchild2;
        $kits_available = ItemInventory::where('store_id', $store_id)->where('item_id', $kit_id)->groupby('item_id', 'store_id')->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as kits_available'))->value('kits_available');
        $kits_available;
        if ($kits_available == null) {
            $kits_available = 0;
        }
        if (($request->out_flow) > $kits_available) {
            return ['status' => 'error', 'message' => 'Kits quantity exceeding than available kits'];
        }

        try {
            DB::transaction(function () use ($request) {
                $kitdata = ItemOemPartModeles::with('machinePartOemPartNO')->where('id', $request->kit_id)->first();
                $parent_id = $kitdata->id;
                $childdata = $kitdata->machinePartOemPartNO->kitchild2;
                $itemInv = [];
                foreach ($childdata as $rows) {
                    $itemInv[] = array(
                        'quantity' => $rows['quantity'],
                        'item_id' => $rows['item_id'],
                    );
                }
                foreach ($itemInv as $row) {
                    $kitChilddata = new ItemInventory();
                    $kitChilddata->inventory_type_id = 5;
                    $kitChilddata->item_id = $row['item_id'];
                    $kitChilddata->quantity_in = $row['quantity'] * $request->out_flow;
                    $kitChilddata->quantity_out = $row['quantity'] * $request->in_flow;
                    $kitChilddata->store_id = $request->store_id;
                    $kitChilddata->date = date('Y-m-d');
                    $kitChilddata->save();
                }

                $kitInv = new ItemInventory();
                $kitInv->inventory_type_id = 5;
                $kitInv->item_id = $parent_id;
                $kitInv->quantity_in  = 0;
                $kitInv->quantity_out = $request->out_flow;
                $kitInv->store_id = $request->store_id;
                $kitInv->date = date('Y-m-d');
                $kitInv->save();
            });
            if ($request->out_flow > 0) {
                return ['status' => "ok", 'message' => 'Kit Break successfully'];
            }
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
}
