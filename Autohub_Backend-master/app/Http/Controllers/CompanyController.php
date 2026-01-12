<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
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
            $companies = Company::where('user_id', $user_id)  // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);
            return ['companies' => $companies];
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
    public function getCompaniesDropDown()
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
            $companies = Company::orderBy('name')
                ->where('user_id', $user_id)  // user_id
                ->get();
            return ['status' => 'ok', 'companies' => $companies];
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
    public function store(Request $request)
    {
        $rules = array(
            'name' => 'required|string|min:2|max:255|',
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
                $Company = new Company();
                $Company->name = $request->name;
                $Company->user_id = $user_id;

                $Company->save();
            });
            return ['status' => "ok", 'message' => 'Company stored successfully'];
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
        $rules = array(
            'id' => 'required|int|exists:companies,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            $Company = Company::find($req->id);
            return ['status' => 'ok', 'company' => $Company];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    public function update(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:companies,id',
            'name' => 'required|min:2|max:255' . $request->id
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            DB::transaction(function () use ($request) {
                $Company = Company::find($request->id);
                $Company->name = $request->name;
                $Company->save();
            });
            return ['status' => "ok", 'message' => 'Company updated successfully'];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    public function destroy(Request $req)
    {
        $rules = array(
            'id' => 'required|int|exists:companies,id',
        );
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        try {
            Company::where('id', $req->id)->delete();
            return ['status' => "ok", 'message' => 'Company deleted successfully'];
        } catch (\Exception $e) {
            return ['status' => "error", 'message' => 'selected Company is used somewhere in system: can not be Deleted'];
        }
    }
}
