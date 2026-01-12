<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\ExpenseType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Services\CustomErrorMessages;
use Illuminate\Http\Request;

class ExpenseController extends Controller
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

                $expense = new Expense();
                $expense->name = $request->name;
                $expense->description = $request->description;
                $expense->user_id = $user_id;
                $expense->expense_type_id = $request->expense_type_id;
                $expense->save();
            });

            return ['status' => "ok", 'message' => 'Expense Stored Successfully'];
        } catch (\Exception $e) {
            return ['status' => 'error', 'message' => $e->getMessage()];
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getExpenseTypes(Request $req)
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
            $expensetypes = ExpenseType::where('user_id', $user_id)  // user_id
                ->orderBy($req->colName, $req->sort)->paginate($req->records, ['*'], 'page', $req->pageNo);

            return ['status' => 'ok', 'expensetypes' => $expensetypes];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
    public function getExpenseTypesDropDown(Request $req)
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
            $expensetypes = ExpenseType::where('user_id', $user_id)  // user_id
                ->get();
            return ['status' => 'ok', 'expensetypes' => $expensetypes];
        } catch (\Exception $e) {
            $message = CustomErrorMessages::getCustomMessage($e);
            return ['status' => 'error', 'message' => $message];
        }
    }
}
