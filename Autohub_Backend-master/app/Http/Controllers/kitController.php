<?php

namespace App\Http\Controllers;

use App\Models\ItemInventory;
use App\Models\ItemOemPartModeles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\kitParent;
use App\Models\kitChild;
use App\Models\kitInventory;
use App\Models\MachinePart;
use App\Services\CustomErrorMessages;

class KitController extends Controller
{
    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
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

        $id = $req->id;
        $data = kitParent::with('kitchild')
            ->where('user_id', $user_id)  // user_id
            ->when($id, function ($query) use ($id) {
                $query->where('id', $id);
            })
            ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

        return ['data' => $data];
    }

    public function getkitsDropdown(Request $req)
    {
        $kitsDropdown = kitParent::get();

        return ['kitsDropdown' => $kitsDropdown];
    }


    public function getkitsExistingQtyDropdown(Request $request)
    {

        $rules = array(
            'store_id' => 'required|int',
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

        $store_id = $request->store_id;
        // $kitsDropdown = MachinePart::with('existingkitInventory')
        $kitsDropdown = ItemInventory::with('kitchild')
            ->where('user_id', $user_id)  // user_id
            ->where('store_id', $store_id)
            ->whereHas('kitchild', fn ($query) =>

            $query->whereHas('setsname', fn ($query) =>
            $query->where('type_id', 2)))
            ->groupby('item_id')
            ->get();


        return ['kitsDropdown' => $kitsDropdown];
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
     * adding Kit data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response item_id
     * @return \Illuminate\Http\Response quantity
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
                // OEM numbers store in table oem_part_nos
                $kitParent = new kitParent();
                $kitParent->name = $request->name;
                $kitParent->user_id = $user_id; //user id
                $kitParent->save();
                $kitParent_id = $kitParent->id;

                foreach ($request->rows as $row) {

                    $kitChilddata = new kitChild();
                    $kitChilddata->parent_id = $kitParent_id;
                    $kitChilddata->user_id = $user_id; //user id
                    $kitChilddata->item_id = $row['item_id'];
                    $kitChilddata->quantity = $row['quantity'];
                    $kitChilddata->save();
                }
            });
            return ['status' => "ok", 'message' => 'Kit stored successfully'];
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
    public function show(Request $req)
    {
        $store_id = $req->store_id;
        $id = $req->id;
        $kitdata = ItemOemPartModeles::with('machinePartOemPart', 'itemInventory2', 'existingSetInventory')
            ->with(['itemInventory2' => function ($qu) use ($store_id) {
                $qu->where('store_id', $store_id);
            }])
            ->with(['existingSetInventory' => function ($qu) use ($store_id) {
                $qu->where('store_id', $store_id);
            }])
            ->with(['machinePartOemPart.machinePart.kitchild.exisitingItemInventory' => function ($qu) use ($store_id) {
                $qu->where('store_id', $store_id);
            }])
            ->where('id', $id)
            ->first();
        return ['kitRecipe' => $kitdata];
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
            'id' => 'required|int',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $kitParent = kitParent::find($req->id);

            $kitChild = kitChild::where('parent_id', $req->id)->get();
            // $itemname = [];
            foreach ($kitChild as $child) {

                // $item = ItemOemPartModeles::with('machinePartOemPart')->where('id', $child->item_id)->first();
                //  $itemname = $item->machinePartOemPart->machine_model_id;
                $itemname[] = array(
                    'id' => $child->id,
                    'item_id' => $child->item_id,
                    'quantity' => $child->quantity,
                    // 'value' => $item->id,
                    //  'name' => $item->machinePartOemPart->machinePart->name,
                );
            }
            $data = array(
                "id" => $kitParent->id,
                "name" => $kitParent->name,
                "childArray" =>  $itemname
            );
            // $data = 3;
            return ['data' => $data];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Update Kit data
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response kitchild_id
     * @return \Illuminate\Http\Response item_id
     * @return \Illuminate\Http\Response quantity
     */
    public function update(Request $request)
    {

        $rules = array(
            'id' => 'required|int|exists:kit_parent,id',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            DB::transaction(function () use ($request) {

                $kitParent = kitParent::find($request->id);
                $kitParent->name = $request->name;
                $kitParent->save();
                // $kitParent_id = $kitParent->id;

                foreach ($request->data['childArray'] as $row) {
                    if (isset($row['id'])) {
                        $child_id = $row['id'];
                        $kitchild = kitChild::find($child_id);
                    } else {
                        $kitchild = new kitChild();
                    }
                    $kitchild->parent_id = $request->id;
                    $kitchild->item_id     = $row['item_id'];
                    $kitchild->quantity     = $row['quantity'];
                    $kitchild->save();
                }
            });
            return ['status' => "ok", 'message' => 'Kit Updated successfully'];
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
            'id' => 'required|int|exists:kit_parent,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            $deleteKitChild = kitChild::where('parent_id', $req->id)->delete();
            $deleteKitParent = kitParent::where('id', $req->id)->delete();


            return ['status' => "ok", 'message' => 'Kit Delete successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Kit is used somewhere in system: can not be Deleted'];
        }
    }
    public function availableKits(Request $req)
    {

        $store_id = $req->store_id;
        $kit_id = $req->id;
        $kits_available = ItemInventory::where('store_id', $store_id)->where('item_id', $kit_id)->groupby('item_id', 'store_id')->select(DB::raw('SUM(quantity_in) - SUM(quantity_out) as kits_available'))->value('kits_available');
        return ['kits_available' => $kits_available];
    }
}
