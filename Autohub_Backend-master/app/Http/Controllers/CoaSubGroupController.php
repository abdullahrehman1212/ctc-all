<?php

namespace App\Http\Controllers;

use App\Models\CoaAccount;
use App\Models\CoaGroup;
use App\Models\CoaSubGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CoaSubGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $req)
    {
        if ($req->is_active == 0 && $req->is_active != null) {
            $is_active = '00';
        } else if ($req->is_active == 1) {
            $is_active = 1;
        } else {
            $is_active = $req->is_active;
        }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user_id = ($user->role_id == 2) ? $user->id : $user->admin_id;
        $coaSubGroups = CoaSubGroup::where('isActive', 1)
            ->where(function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->orWhereNull('user_id');
            })
            ->orderBy('code')
            ->with('coaGroup')
            ->when($is_active, function ($q, $is_active) {
                return $q->where('isActive', $is_active);
            })
            ->get();
        // $coaSubGroups = CoaSubGroup::orwhereNull('user_id')->where('user_id',$user_id)->orderBy('code')->with('coaGroup')->get();
        return ['coaSubGroups' => $coaSubGroups];
    }

    //------------------------------------------------------------------------------
    /**
     * Store a newly created CoaSubGroup in storage.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    public function store(Request $req)
    {
        $rules = array(
            'name' => 'required',
            'coa_group_id' => 'required',
        );

        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 401);
        }

        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user_id = ($user->role_id == 2) ? $user->id : $user->admin_id;

        DB::transaction(function () use ($req, $user_id) {
            $group = CoaGroup::find($req->coa_group_id);
            $lastCode = CoaSubGroup::where('coa_group_id', $group->id)->orderBy('id', 'desc')->first();

            $data = $req->all();
            $data['user_id'] = $user_id;

            $coaSubGroup = CoaSubGroup::create($data);

            if (!$lastCode) {
                $newCode = $group->code . '01';
            } else {
                $newCode = $lastCode->code + 1;
            }

            $coaSubGroup->update(['code' => $newCode]);
        });

        return response()->json(['status' => "ok", 'message' => 'CoaSubGroup stored successfully']);
    }

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request coa_group_id
     * @return \Illuminate\Http\Response
     */
    public function coaSubGroupsByGroup(Request $req)
    {
        $rules = array(
            'coa_group_id' => 'required',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 401);
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

        $coaSubGroups = CoaSubGroup::where([['user_id', $user_id], ['coa_group_id', $req->coa_group_id], ['isActive', 1]])
            ->orWhere([['user_id', null], ['coa_group_id', $req->coa_group_id], ['isActive', 1]])
            ->with('coaGroup')->orderBy('code')
            ->get();
        return ['coaSubGroups' => $coaSubGroups];
    }

    /**
     * Making sub group active or incactive
     *
     * @param \Illuminate\Http\Request sub_group_id
     * @return \Illuminate\Http\Response
     */
    public function makeSubGroupActiveOrInactive(Request $req)
    {
        $rules = array(
            'sub_group_id' => 'required|int',
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

        $CoaSubGroup = CoaSubGroup::find($req->sub_group_id);
        if (!$CoaSubGroup) {
            return ['status' => "error", 'message' => 'Sub Group Not found'];
        }
        $message = $CoaSubGroup->isActive == 1 ? 'Deactivated' : 'Activated';
        $CoaSubGroup->isActive = $CoaSubGroup->isActive == 1 ? 0 : 1;
        $CoaSubGroup->save();
        return ['status' => "ok", 'message' => 'CoaSubGroup ' . $message . ' successfully'];
    }

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request type
     * @return \Illuminate\Http\Response
     */
    public function getRequiredSubGroups(Request $req)
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

        $group_id = $req->group_id;
        if (isset($req->type)) {
            $coaSubGroups = CoaSubGroup::orderBy('code')
                ->with('coaGroup')
                ->whereNull('user_id') // user_id
                ->where('isActive', $req->type)
                ->when($group_id, function ($query, $group_id) {
                    return $query->where('coa_group_id', '=', $group_id);
                })
                ->get();

            $coaSubGroups1 = CoaSubGroup::orderBy('code')
                ->with('coaGroup')
                ->where('user_id', $user_id) // user_id
                ->where('isActive', $req->type)
                ->when($group_id, function ($query, $group_id) {
                    return $query->where('coa_group_id', '=', $group_id);
                })
                ->get();
            $coaSubGroups = $coaSubGroups->merge($coaSubGroups1);

        } else {
            $coaSubGroups = CoaSubGroup::orderBy('code')
                ->with('coaGroup')
                ->whereNull('user_id') // user_id
                ->when($group_id, function ($query, $group_id) {
                    return $query->where('coa_group_id', '=', $group_id);
                })
                ->get();

            $coaSubGroups1 = CoaSubGroup::orderBy('code')
                ->where('user_id', $user_id) // user_id
                ->with('coaGroup')
                ->when($group_id, function ($query, $group_id) {
                    return $query->where('coa_group_id', '=', $group_id);
                })
                ->get();
            $coaSubGroups = $coaSubGroups->merge($coaSubGroups1);
        }
        return ['coaSubGroups' => $coaSubGroups, 'coaSubGroups1' => $coaSubGroups1];
    }

    /**
     * editing coa sub group
     *
     * @param \Illuminate\Http\Request sub_group_id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $req)
    {
        $coaSubGroup = CoaSubGroup::with('coaGroup')->find($req->sub_group_id);
        if (!$coaSubGroup) {
            return ['status' => 'error', 'message' => 'Account not found'];
        }
        return ['coaSubGroup' => $coaSubGroup];
    }
    /**
     * Updating coa subgroup.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @param \Illuminate\Http\Request coa_sub_group_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    public function update(Request $req)
    {
        $rules = array(
            'name' => 'required',
            'coa_group_id' => 'required|int',
            'id' => 'required|int',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 401);
        }
        $CoaSubGroup = CoaSubGroup::find($req->id);
        if (!$CoaSubGroup) {
            return ['status' => 'error', 'message' => 'Account not found'];
        }
        if ($CoaSubGroup->is_default == 1) {
            return ['status' => 'error', 'message' => "This is a default subgroup you can't update it"];
        }
        // $coaAccounts = CoaAccount::where('coa_sub_group_id', $req->id)->count();
        // if ($coaAccounts > 0) {
        //     return ['status' => 'error', 'message' => "This subgroup has some accounts you can't update it"];
        // }
        $CoaSubGroup->coa_group_id = $req->coa_group_id;
        $CoaSubGroup->name = $req->name;
        $CoaSubGroup->save();
        return ['status' => 'ok', 'message' => 'Sub Group updated successfully'];
    }

    /**
     * Deleting coa sub group
     *
     * @param \Illuminate\Http\Request coa_sub_group_id
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $req)
    {
        $CoaSubGroup = CoaSubGroup::find($req->coa_sub_group_id);
        if (!$CoaSubGroup) {
            return ['status' => 'error', 'message' => 'Subgroup not found'];
        }
        if ($CoaSubGroup->is_default == 1) {
            return ['status' => 'error', 'message' => "This is a default subgroup you can't delete it"];
        }
        $coaAccounts = CoaAccount::where('coa_sub_group_id', $req->coa_sub_group_id)->count();
        if ($coaAccounts > 0) {
            return ['status' => 'error', 'message' => "This subgroup has some accounts you can't delete it"];
        }
        CoaSubGroup::find($req->coa_sub_group_id)->delete();
        return ['status' => 'ok', 'message' => 'Sub Group deleted successfully'];
    }
}
