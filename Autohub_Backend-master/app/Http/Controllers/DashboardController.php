<?php

namespace App\Http\Controllers;

use Carbon\Carbon;


use App\Models\Land;
use App\Models\Plot;
use App\Models\User;
use App\Models\Block;
use App\Models\Person;
use App\Models\Booking;
use App\Models\Invoice;
use App\Models\CoaGroup;
use App\Models\CoaAccount;
use Illuminate\Http\Request;
use App\Models\PurchaseOrder;
use App\Models\VoucherTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
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

        $total_sales = Invoice::where('user_id', $user_id)->count();
        $total_po = PurchaseOrder::where('user_id', $user_id)->count();
        $pending_po = PurchaseOrder::where('is_approve', 0)->where('user_id', $user_id)->count();
        $unreceived_po = PurchaseOrder::where('is_received', 0)->where('is_approve', 1)->where('user_id', $user_id)->count();;
        $formattedTotalPOPrice  = PurchaseOrder::where('is_received', 1)->where('user_id', $user_id)->sum('total_after_discount');

        $totalPOPrice =  number_format($formattedTotalPOPrice, 2);

        $totalSalePrice  = Invoice::where('user_id', $user_id)->sum('total_after_discount');

        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        // Count the number of POs created within the current month
        $numberOfPOs = PurchaseOrder::where('is_received', 1)
            ->where('user_id', $user_id)  // user_id
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();
        $isActive = 1;
        $isInActive = 0;

        $ActiveEmployees = Person::with('peoplePersonType.personType')
            ->where('user_id', $user_id)  // user_id
            ->where('isActive', $isActive)
            ->whereHas('peoplePersonType', function ($query) {
                $query->where('person_type_id', 2);
            })
            ->count();

        $inActiveEmployees = Person::with('peoplePersonType.personType')
            ->where('user_id', $user_id)  // user_id
            ->where('isActive', $isInActive)
            ->whereHas('peoplePersonType', function ($query) {
                $query->where('person_type_id', 2);
            })
            ->count();

        $totalReceivable = VoucherTransaction::where('user_id', $user_id)  // user_id
            ->whereHas('voucher', function ($qu) {
                $qu->where([
                    ['isApproved', 1],
                    ['is_post_dated', 0]
                ]);
            })
            ->whereHas('coaAccount', function ($query) {
                $query->where('coa_sub_group_id', 9);
            })
            ->select(DB::raw('FORMAT(SUM(debit) - SUM(credit),2) as balance'))
            ->get();

        $totalPayable = VoucherTransaction::where('user_id', $user_id)  // user_id
            ->whereHas('voucher', function ($qu) {
                $qu->where([
                    ['isApproved', 1],
                    ['is_post_dated', 0]
                ]);
            })
            ->whereHas('coaAccount', function ($query) {
                $query->where('coa_sub_group_id', 2);
            })
            ->select(DB::raw('FORMAT(SUM(debit) - SUM(credit), 2) as balance'))
            ->get();


        $data = [
            'total_sales' => $total_sales,
            'total_po' => $total_po,
            'pending_po' => $pending_po,
            'unreceived_po' => $unreceived_po,
            'totalPOPrice' => $totalPOPrice,
            'totalReceivable' => $totalReceivable,
            'numberOfPOs' => $numberOfPOs,
            'totalPayable' => $totalPayable,
            'totalSalePrice' => $totalSalePrice,
        ];

        $Employees = [
            'ActiveEmployees' => $ActiveEmployees,
            'inActiveEmployees' => $inActiveEmployees,
        ];

        return ['status' => 'ok', 'data' => $data, 'Employees' => $Employees];
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
        //
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
    //     public function getTrailBalanceForDash(Request $req)
    //     {
    //         $user = auth()->user();
    //         if (!$user) {
    //             return response()->json(['message' => 'Unauthorized']);
    //         }
    //         if ($user->role_id == 2) {
    //             $user_id = $user->id;
    //         } else {
    //             $user_id = $user->admin_id;
    //         }
    // // dd($user_id);
    //         $todayDate = date("Y-m-d");
    //         $firstDay = Carbon::now()->startOfMonth()->toDateString();

    //         $lastDay = Carbon::now()->endOfMonth()->toDateString();

    //         $collection = collect([]);
    //         $months = collect([]);
    //         for ($i = 1; $i < 13; $i++) {

    //             $from = Land::changeDateFormat($firstDay);
    //             $to = Land::changeDateFormat($lastDay);
    //             $assets = CoaGroup::with(['nonDepreciationSubGroups.coaAccounts.balance' => function ($query) use ($from, $to) {
    //                 $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
    //             }])
    //                 ->where('user_id', $user_id)  // user_id
    //                 ->orWhereNull('user_id')
    //                 ->where('parent', 'Assets')->select('id', 'name', 'parent', 'code')
    //                 ->get();
    //             $depreciation = CoaGroup::with(['depreciationSubGroups.coaAccounts.balance' => function ($query) use ($from, $to) {
    //                 $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
    //             }])
    //             // ->where('user_id', $user_id)  // user_id
    //                 ->where('id', 2)->select('id', 'name', 'parent', 'code')->get();
    //                 // dd($depreciation);

    //             $count =  count($assets[1]->nonDepreciationSubGroups);
    //             $assets[1]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ?  $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];



    //             $revenues[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to) {
    //                 $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
    //             }])->where('user_id', $user_id)  // user_id
    //                 ->where('parent', 'Revenues')->select('id', 'name', 'parent', 'code')->get();

    //             $expenses[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to) {
    //                 $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
    //             }])->where('user_id', $user_id)  // user_id
    //                 ->where('parent', 'Expenses')->select('id', 'name', 'parent', 'code')->get();


    //             $cost[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to) {
    //                 $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
    //             }])->where('user_id', $user_id)  // user_id
    //                 ->where('parent', 'Cost')->select('id', 'name', 'parent', 'code')->get();

    //             $getmonth = strtotime($firstDay);
    //             $month[$i] = date("F", $getmonth);
    //             $year[$i] = date("Y", $getmonth);

    //             $collection[] = array(
    //                 'revenues' => $revenues[$i],
    //                 'expenses' => $expenses[$i],
    //                 'cost' => $cost[$i],
    //             );
    //             $months[] = array(
    //                 'Month' => substr($month[$i], 0, 3) . ' ' . substr($year[$i], 2, 2)
    //             );

    //             $firstDay = Carbon::now()->startOfMonth()->modify(-$i . 'months')->toDateString();

    //             $lastDay = Carbon::now()->endOfMonth()->modify(-$i . 'months')->toDateString();
    //         }
    //         $collection = collect($collection);
    //         $month = collect($months);


    //         return ['status' => 'ok', 'Data' => $collection, 'months' => $months];
    //     }

    // faizan changes
    public function getTrailBalanceForDash(Request $req)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get user's subscription package
        $subscription = $user->subscription;
        if (!$subscription) {
            return response()->json(['message' => 'No subscription found'], 404);
        }

        $package_id = $subscription->package_id;

        // Set date range based on package and the user's created_at date
        $toPackage = now();
        switch ($package_id) {
            case 1: // Trial Package (2 weeks)
                $fromPackage = $toPackage->copy()->subWeeks(2);
                break;

            case 2: // Basic Package (1 month)
                $fromPackage = $toPackage->copy()->subMonth();
                break;

            case 3: // Show Package (3 months)
                $fromPackage = $toPackage->copy()->subMonths(3);
                break;

            case 4: // Gold Package (1 year)
                $fromPackage = $toPackage->copy()->subYear();
                break;

            default:
                return response()->json(['message' => 'Invalid package'], 400);
        }

        $store = $user->store;
        if (!$store) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $store_id = $store->id;
        $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;

        $todayDate = date("Y-m-d");
        $firstDay = Carbon::now()->startOfMonth()->toDateString();
        $lastDay = Carbon::now()->endOfMonth()->toDateString();

        $collection = collect([]);
        $months = collect([]);

        for ($i = 1; $i <= 12; $i++) {
            $from = Land::changeDateFormat($firstDay);
            $to = Land::changeDateFormat($lastDay);

            $assets = CoaGroup::with(['nonDepreciationSubGroups.coaAccounts.balance' => function ($query) use ($fromPackage, $toPackage, $from, $to, $user_id) {
                $query->where('user_id', $user_id)
                    ->whereBetween('created_at', [$fromPackage, $toPackage])
                    ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
            }])
                ->where(function ($query) use ($user_id) {
                    $query->where('user_id', $user_id)->orWhereNull('user_id');
                })
                ->where('parent', 'Assets')
                ->select('id', 'name', 'parent', 'code')
                ->get();

            $depreciation = CoaGroup::with(['depreciationSubGroups.coaAccounts.balance' => function ($query) use ($fromPackage, $toPackage, $from, $to, $user_id) {
                $query->where('user_id', $user_id)
                    ->whereBetween('created_at', [$fromPackage, $toPackage])
                    ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
            }])
                ->where('id', 2)
                ->select('id', 'name', 'parent', 'code')
                ->get();

            $count = count($assets[1]->nonDepreciationSubGroups);
            $assets[1]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ? $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];

            $revenues[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($fromPackage, $toPackage, $from, $to, $user_id) {
                $query->where('user_id', $user_id)
                    ->whereBetween('created_at', [$fromPackage, $toPackage])
                    ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
            }])
                ->where('parent', 'Revenues')
                ->select('id', 'name', 'parent', 'code')
                ->get();

            $expenses[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($fromPackage, $toPackage, $from, $to, $user_id) {
                $query->where('user_id', $user_id)
                    ->whereBetween('created_at', [$fromPackage, $toPackage])
                    ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
            }])
                ->where('parent', 'Expenses')
                ->select('id', 'name', 'parent', 'code')
                ->get();

            $cost[$i] = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($fromPackage, $toPackage, $from, $to, $user_id) {
                $query->where('user_id', $user_id)
                    ->whereBetween('created_at', [$fromPackage, $toPackage])
                    ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"]);
            }])
                ->where('parent', 'Cost')
                ->select('id', 'name', 'parent', 'code')
                ->get();

            $getmonth = strtotime($firstDay);
            $month[$i] = date("F", $getmonth);
            $year[$i] = date("Y", $getmonth);

            $collection[] = array(
                'revenues' => $revenues[$i],
                'expenses' => $expenses[$i],
                'cost' => $cost[$i],
            );
            $months[] = array(
                'Month' => substr($month[$i], 0, 3) . ' ' . substr($year[$i], 2, 2)
            );

            $firstDay = Carbon::now()->startOfMonth()->modify('-' . $i . ' months')->toDateString();
            $lastDay = Carbon::now()->endOfMonth()->modify('-' . $i . ' months')->toDateString();
        }

        $collection = collect($collection);
        $months = collect($months);

        return ['status' => 'ok', 'Data' => $collection, 'months' => $months];
    }
}
