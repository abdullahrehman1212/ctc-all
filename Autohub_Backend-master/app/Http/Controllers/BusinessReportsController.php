<?php

namespace App\Http\Controllers;

use App\Models\CoaAccount;
use App\Models\CoaGroup;
use App\Models\Land;
use App\Models\VoucherTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BusinessReportsController extends Controller
{
    /**
     * Balance sheet
     *
     * @param \Illuminate\Http\request date
     * @return \Illuminate\Http\Response
     */
    public function getBalanceSheet(Request $req)
    {
        $rules = array(
            'date' => 'required',
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

        $date = Land::changeDateFormat($req->date);

        $assets = CoaGroup::with([
            'nonDepreciationSubGroups' => function ($query) use ($user_id) {
                $query->where(function ($q) use ($user_id) {
                    $q->where('user_id', $user_id)
                        ->orWhereNull('user_id');
                });
            },
            'nonDepreciationSubGroups.coaAccounts' => function ($query) use ($user_id) {
                $query->where(function ($q) use ($user_id) {
                    $q->where('user_id', $user_id)
                        ->orWhereNull('user_id');
                });
            },
            'nonDepreciationSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id, $from, $to) {
                $query->whereDate('date', '<=', $date)
                    ->where(function ($q) use ($user_id) {
                        $q->where('user_id', $user_id)
                            ->orWhereNull('user_id');
                    });
                // Uncomment the next line if you need to filter by a date range
                // ->whereBetween('created_at', [$from, $to]);
            },
        ])
            ->where('parent', 'Assets')
            ->select('id', 'name', 'parent', 'code')
            ->get();
        $depreciation = CoaGroup::with([
            'depreciationSubGroups' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->orWhereNull('user_id');
            },
            'depreciationSubGroups.coaAccounts' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->orWhereNull('user_id');
            },
            'depreciationSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id, $from, $to) {
                $query->whereDate('date', '<=', $date)
                    ->where('user_id', $user_id)
                // Uncomment the line below if you need the `created_at` range filter
                // ->whereBetween('created_at', [$from, $to])
                    ->orWhereNull('user_id');
            },
        ])
            ->where('id', 2)
            ->select('id', 'name', 'parent', 'code')
            ->get();

        $count = count($assets[1]->nonDepreciationSubGroups);
        $assets[1]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ? $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];


        $liabilities = CoaGroup::with([
            'coaSubGroups' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->orWhereNull('user_id');
            },
            'coaSubGroups.coaAccounts' => function ($query) use ($user_id) {
                $query->where('user_id', $user_id)
                    ->orWhereNull('user_id');
            },
            'coaSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id) {
                $query->whereDate('date', '<=', $date)
                    ->where('user_id', $user_id)
                    ->orWhere(function ($q) {
                        $q->whereNull('user_id');
                    });
            },
        ])
            ->where('parent', 'Liabilities')
            ->select('id', 'name', 'parent', 'code')
            ->get();

            $capital = CoaGroup::with([
                'coaSubGroups' => function ($query) use ($user_id) {
                    $query->where('user_id', $user_id)
                        ->orWhereNull('user_id');
                },
                'coaSubGroups.coaAccounts' => function ($query) use ($user_id) {
                    $query->where('user_id', $user_id)
                        ->orWhereNull('user_id');
                },
                'coaSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id) {
                    $query->whereDate('date', '<=', $date)
                        ->where('user_id', $user_id)
                        ->orWhere(function ($q) {
                            $q->whereNull('user_id');
                        });
                },
            ])
                ->where('parent', 'Capital')
                ->select('id', 'name', 'parent', 'code')
                ->get();

                $revenue = CoaGroup::with([
                    'coaSubGroups' => function ($query) use ($user_id) {
                        $query->where('user_id', $user_id)
                            ->orWhereNull('user_id');
                    },
                    'coaSubGroups.coaAccounts' => function ($query) use ($user_id) {
                        $query->where('user_id', $user_id)
                            ->orWhereNull('user_id');
                    },
                    'coaSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id) {
                        $query->whereDate('date', '<=', $date)
                            ->where('user_id', $user_id)
                            ->orWhere(function ($q) {
                                $q->whereNull('user_id');
                            });
                    },
                ])
                    ->where('parent', 'Revenues')
                    ->select('id', 'name', 'parent', 'code')
                    ->get();
                    $expense = CoaGroup::with([
                        'coaSubGroups' => function ($query) use ($user_id) {
                            $query->where('user_id', $user_id)
                                ->orWhereNull('user_id');
                        },
                        'coaSubGroups.coaAccounts' => function ($query) use ($user_id) {
                            $query->where('user_id', $user_id)
                                ->orWhereNull('user_id');
                        },
                        'coaSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id) {
                            $query->whereDate('date', '<=', $date)
                                ->where('user_id', $user_id)
                                ->orWhere(function ($q) {
                                    $q->whereNull('user_id');
                                });
                        },
                    ])
                        ->where('parent', 'Expenses')
                        ->select('id', 'name', 'parent', 'code')
                        ->get();
                        $cost = CoaGroup::with([
                            'coaSubGroups' => function ($query) use ($user_id) {
                                $query->where('user_id', $user_id)
                                    ->orWhereNull('user_id');
                            },
                            'coaSubGroups.coaAccounts' => function ($query) use ($user_id) {
                                $query->where('user_id', $user_id)
                                    ->orWhereNull('user_id');
                            },
                            'coaSubGroups.coaAccounts.balance' => function ($query) use ($date, $user_id) {
                                $query->whereDate('date', '<=', $date)
                                    ->where('user_id', $user_id)
                                    ->orWhere(function ($q) {
                                        $q->whereNull('user_id');
                                    });
                                // Uncomment the next line if a date range is required
                                // ->whereBetween('created_at', [$from, $to]);
                            },
                        ])
                            ->where('parent', 'Cost')
                            ->select('id', 'name', 'parent', 'code')
                            ->get();

                          $revenueSum = 0;

if (!empty($revenue[0]->coaSubGroups)) {
    foreach ($revenue[0]->coaSubGroups as $revenueSubGroup) {
        if (!empty($revenueSubGroup->coaAccounts)) {
            foreach ($revenueSubGroup->coaAccounts as $revenueAccount) {
                $balance = abs(optional($revenueAccount->balance)->balance ?? 0);

                // Check if the account name matches "Goods Sold (Discounts)"
                if (!empty($revenueAccount->name) && $revenueAccount->name === "Goods Sold (Discounts)") {
                    $revenueSum -= $balance; // Subtract discount
                } else {
                    $revenueSum += $balance; // Add regular revenue
                }
            }
        }
    }
}



                            $expenseSum = 0;
                            if ($expense[0]->coaSubGroups != null) {
                                foreach ($expense[0]->coaSubGroups as $expenseSubGroup) {
                                    if ($expenseSubGroup->coaAccounts != null) {
                                        foreach ($expenseSubGroup->coaAccounts as $expenseAccount) {
                                            $expenseSum += abs(optional($expenseAccount->balance)->balance ?? 0);
                                        }
                                    }
                                }
                            }

                            $costSum = 0;
                            if ($cost[0]->coaSubGroups != null) {
                                foreach ($cost[0]->coaSubGroups as $costSubGroup) {
                                    if ($costSubGroup->coaAccounts != null) {
                                        foreach ($costSubGroup->coaAccounts as $costAccount) {
                                            $costSum += abs(optional($costAccount->balance)->balance ?? 0);
                                        }
                                    }
                                }
                            }

        $revExp = -$revenueSum + $expenseSum + $costSum;

        return ['data' => array(
            'assets' => $assets,
            'liabilities' => $liabilities,
            'capital' => $capital,
            'revExp' => $revExp,
            'revenue' => $revenueSum,
            'expense' => $expenseSum,
            'cost' => $costSum,
            
        )];
    }

    /**
     * Trail Balance
     *
     * @param \Illuminate\Http\request date
     * @return \Illuminate\Http\Response
     */
    public function getTrailBalance(Request $req)
    {
        // Validation rules
        $rules = [
            'from' => 'required',
            'to' => 'required',
        ];

        // Validator
        $validator = Validator::make($req->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()]);
        }

        // Authenticate user
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
                    return response()->json(['message' => 'Invalid package']);
            }
        }
        // Format dates
        $from = Land::changeDateFormat($req->from);
        $to = Land::changeDateFormat($req->to);

        $assets = CoaGroup::with([
            'nonDepreciationSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                $query->where(function ($q) use ($user_id) {
                    // Check for user's specific subgroups or global subgroups
                    $q->where('user_id', $user_id)->orWhereNull('user_id');
                })
                    ->with([
                        'coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            $query->where(function ($q) use ($user_id) {
                                // Check for user's specific accounts or global accounts
                                $q->where('user_id', $user_id)->orWhereNull('user_id');
                            })
                                ->with([
                                    'balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                                        // Filter by both the date range and package range
                                        $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                                        // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                            ->where('user_id', $user_id);
                                    },
                                ]);
                        },
                    ]);
            },
        ])
            ->where('parent', 'Assets')
            ->select('id', 'name', 'parent', 'code')
            ->get();

        $depreciation = CoaGroup::with(['depreciationSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            // Fetch depreciation sub-groups where user_id matches or is null
            $query->where(function ($q) use ($user_id) {
                $q->where('user_id', $user_id)->orWhereNull('user_id');
            })
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    // Fetch CoA accounts where user_id matches or is null
                    $query->where(function ($q) use ($user_id) {
                        $q->where('user_id', $user_id)->orWhereNull('user_id');
                    })
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            // Filter balances by date and created_at range
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('id', 2) // Filtering CoaGroup by ID
            ->select('id', 'name', 'parent', 'code') // Selecting specific columns
            ->get();

        // Combine assets and depreciation if both exist

        $count = count($assets[0]->nonDepreciationSubGroups);
        $assets[0]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ? $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];

        $liabilities = CoaGroup::with(['coaSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            // Fetch COA sub-groups where user_id matches or is null
            $query->where(function ($q) use ($user_id) {
                $q->where('user_id', $user_id)->orWhereNull('user_id');
            })
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    // Fetch COA accounts where user_id matches or is null
                    $query->where(function ($q) use ($user_id) {
                        $q->where('user_id', $user_id)->orWhereNull('user_id');
                    })
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            // Filter balance by date and created_at range (applying package constraints)
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('parent', 'Liabilities') // Filter by parent 'Liabilities'
            ->select('id', 'name', 'parent', 'code') // Select required columns
            ->get();

        $capital = CoaGroup::with(['coaSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            // Fetch COA sub-groups where user_id matches or is null
            $query->where(function ($q) use ($user_id) {
                $q->where('user_id', $user_id)->orWhereNull('user_id');
            })
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    // Fetch COA accounts where user_id matches or is null
                    $query->where(function ($q) use ($user_id) {
                        $q->where('user_id', $user_id)->orWhereNull('user_id');
                    })
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            // Filter balance by date and created_at range (applying package constraints)
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('parent', 'Capital') // Filter by parent 'Capital'
            ->select('id', 'name', 'parent', 'code') // Select the required columns
            ->get();

        $revenues = CoaGroup::with(['coaSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            $query->where('user_id', $user_id)
                ->orWhereNull('user_id')
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    $query->where('user_id', $user_id)
                        ->orWhereNull('user_id')
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('parent', 'Revenues')
            ->select('id', 'name', 'parent', 'code')
            ->get();

        $expenses = CoaGroup::with(['coaSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            $query->where('user_id', $user_id)
                ->orWhereNull('user_id')
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    $query->where('user_id', $user_id)
                        ->orWhereNull('user_id')
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('parent', 'Expenses')
            ->select('id', 'name', 'parent', 'code')
            ->get();

        $cost = CoaGroup::with(['coaSubGroups' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
            $query->where('user_id', $user_id)
                ->orWhereNull('user_id')
                ->with(['coaAccounts' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                    $query->where('user_id', $user_id)
                        ->orWhereNull('user_id')
                        ->with(['balance' => function ($query) use ($from, $to, $user_id, $fromPackage, $toPackage) {
                            $query->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"])
                            // ->whereBetween('created_at', [$fromPackage, $toPackage])
                                ->where('user_id', $user_id);
                        }]);
                }]);
        }])
            ->where('parent', 'Cost')
            ->select('id', 'name', 'parent', 'code')
            ->get();

        // Return data
        return response()->json([
            'data' => [
                'assets' => $assets,
                // 'assets1' => $assets1,
                'liabilities' => $liabilities,
                'capital' => $capital,
                'revenues' => $revenues,
                'expenses' => $expenses,
                'cost' => $cost,
            ],
        ]);
    }

    // public function getTrailBalance(Request $req)
    // {
    //     // Validation rules
    //     $rules = [
    //         'from' => 'required',
    //         'to' => 'required'
    //     ];

    //     // Validator
    //     $validator = Validator::make($req->all(), $rules);
    //     if ($validator->fails()) {
    //         return response()->json(['status' => 'error', 'message' => $validator->errors()->first()]);
    //     }

    //     // Authenticate user
    //     $user = auth()->user();
    //     if (!$user) {
    //         return response()->json(['status' => 'error', 'message' => 'Unauthorized']);
    //     }

    //     // Determine user ID
    //     $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;

    //     // Format dates
    //     $from = Land::changeDateFormat($req->from);
    //     $to = Land::changeDateFormat($req->to);

    //     // Fetch assets
    //     $assets = CoaGroup::with(['nonDepreciationSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Assets')->select('id', 'name', 'parent', 'code')->get();

    //     // Fetch depreciation
    //     $depreciation = CoaGroup::with(['depreciationSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('id', 2)->select('id', 'name', 'parent', 'code')->get();

    //     // Combine assets and depreciation if both exist
    //     if ($assets->isNotEmpty() && $depreciation->isNotEmpty()) {
    //         $count = count($assets[0]->nonDepreciationSubGroups);
    //         $assets[0]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ? $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];
    //     }

    //     // Fetch liabilities
    //     $liabilities = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Liabilities')->select('id', 'name', 'parent', 'code')->get();

    //     // Fetch capital
    //     $capital = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Capital')->select('id', 'name', 'parent', 'code')->get();

    //     // Fetch revenues
    //     $revenues = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Revenues')->select('id', 'name', 'parent', 'code')->get();

    //     // Fetch expenses
    //     $expenses = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Expenses')->select('id', 'name', 'parent', 'code')->get();

    //     // Fetch cost
    //     $cost = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
    //         $query->where('user_id', $user_id)

    //               ->whereBetween('date', ["$from 00:00:00", "$to 23:59:59"]);
    //     }])->where('parent', 'Cost')->select('id', 'name', 'parent', 'code')->get();

    //     // Return data
    //     return response()->json([
    //         'data' => [
    //             'assets' => $assets,
    //             'liabilities' => $liabilities,
    //             'capital' => $capital,
    //             'revenues' => $revenues,
    //             'expenses' => $expenses,
    //             'cost' => $cost,
    //         ]
    //     ]);
    // }

    public function getChartOfAccounts(Request $req)
    {
        // $rules = array(
        //     'from' => 'required',
        //     'to' => 'required'
        // );
        // $validator = Validator::make($req->all(), $rules);
        // if ($validator->fails()) {
        //     return ['status' => 'error', 'message' => $validator->errors()->first()];
        // }
        $from = Land::changeDateFormat($req->from);
        $to = Land::changeDateFormat($req->to);
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }
        if ($user->role_id == 2) {
            $user_id = $user->id;
        } else {
            $user_id = $user->admin_id;
        }
        $assets = CoaGroup::with('nonDepreciationSubGroups')
            ->where('parent', 'Assets')->select('id', 'name', 'parent', 'code')->get();

        $depreciation = CoaGroup::with(['depreciationSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('id', 2)->select('id', 'name', 'parent', 'code')->get();

        $count = count($assets[1]->nonDepreciationSubGroups);
        $assets[1]->nonDepreciationSubGroups[$count] = count($depreciation[0]->depreciationSubGroups) > 0 ? $depreciation[0]->depreciationSubGroups[0] : $depreciation[0];

        $liabilities = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('parent', 'Liabilities')->select('id', 'name', 'parent', 'code')->get();

        $capital = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('parent', 'Capital')->select('id', 'name', 'parent', 'code')->get();

        $revenues = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('parent', 'Revenues')->select('id', 'name', 'parent', 'code')->get();

        $expenses = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('parent', 'Expenses')->select('id', 'name', 'parent', 'code')->get();

        $cost = CoaGroup::with(['coaSubGroups.coaAccounts.balance' => function ($query) use ($from, $to, $user_id) {
            $query->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->where('user_id', $user_id)
                ->orWhereNull('user_id');
        }])->where('parent', 'Cost')->select('id', 'name', 'parent', 'code')->get();

        return ['data' => array(
            'assets' => $assets,
            // 'liabilities' => $liabilities,
            // 'capital' => $capital,
            // 'revenues' => $revenues,
            // 'expenses' => $expenses,
            // 'cost' => $cost,
        )];
    }

    /**
     * Displaying GeneralJournal
     *
     * @return \Illuminate\Http\Response
     */
    public function getGeneralJournal(Request $req)
    {

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
                    return response()->json(['message' => 'Invalid package']);
            }
        }
        if (isset($req->to) && isset($req->from)) {
            $to = Land::changeDateFormat($req->to);
            $from = Land::changeDateFormat($req->from);
            $data = VoucherTransaction::with('voucherNumber', 'coaAccount')
                ->whereBetween('date', [$from . " 00:00:00", $to . " 23:59:59"])
                ->whereHas('voucher', function ($qu) {
                    return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
                })
            // ->when($fromPackage, function ($q, $fromPackage) {
            //     return $q->where('created_at', '>=', $fromPackage);
            // })
            // ->when($toPackage, function ($q, $toPackage) {
            //     return $q->where('created_at', '<=', $toPackage);
            // })
                ->where('user_id', $user_id)
                ->get();
        } else {
            $data = VoucherTransaction::with('voucherNumber', 'coaAccount')
                ->whereHas('voucher', function ($qu) {
                    return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
                })
            // ->when($fromPackage, function ($q, $fromPackage) {
            //     return $q->where('created_at', '>=', $fromPackage);
            // })
            // ->when($toPackage, function ($q, $toPackage) {
            //     return $q->where('created_at', '<=', $toPackage);
            // })
                ->where('user_id', $user_id)
                ->get();
        }
        return ['data' => $data];
    }

    /**
     * Displaying daily closing report
     *
     * @param \Illuminate\Http\date
     * @return \Illuminate\Http\Response
     */
    public function getDailyClosingReport(Request $req)
    {

        // $rules = [
        //     'date' => 'required',
        // ];
        // $validator = Validator::make($req->all(), $rules);
        // if ($validator->fails()) {
        //     return ['status' => 'error', 'message' => $validator->errors()->first()];
        // }
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized']);
        }

        if ($user->role_id == 2) {
            $user_id = $user->id;
            $subscription = $user->subscription;

            if (!$subscription) {
                return response()->json(['message' => 'No subscription found']);
            }

            $package_id = $subscription->package_id;

            $dateInput = \Carbon\Carbon::createFromFormat('d/m/y', $req->date);

            switch ($package_id) {
                case 1: // Trial Package (2 weeks)
                    $freeTrial = \Carbon\Carbon::now()->subWeeks(2);
                    if ($dateInput <= $freeTrial) {
                        return response()->json(['status' => 'error', 'message' => 'You cannot select a date more than 2 weeks ago for the trial package.']);
                    }
                    break;

                case 2: // Basic Package (1 month)
                    $basicTrial = \Carbon\Carbon::now()->subMonth();
                    if ($dateInput <= $basicTrial) {
                        return response()->json(['status' => 'error', 'message' => 'You cannot select a date more than 1 month ago for the basic package.']);
                    }
                    break;

                case 3: // Silver Package (3 months)
                    $silverTrial = \Carbon\Carbon::now()->subMonths(3);
                    if ($dateInput <= $silverTrial) {
                        return response()->json(['status' => 'error', 'message' => 'You cannot select a date more than 3 months ago for the silver package. Please update your package.']);
                    }
                    break;

                case 4: // Gold Package (1 year)
                    $goldTrial = \Carbon\Carbon::now()->subYear();
                    if ($dateInput <= $goldTrial) {
                        return response()->json(['status' => 'error', 'message' => 'You cannot select a date more than 1 year ago for the gold package. If you want to see more data then buy our personalized software']);
                    }
                    break;

                default:
                    return response()->json(['status' => 'error', 'message' => 'Invalid package']);
            }

            $date = $dateInput->format('Y-m-d');

        } else {
            $user_id = $user->admin_id;
        }

        $coaAccounts = CoaAccount::where('user_id', $user_id)
            ->whereHas('coaSubGroup', function ($query) use ($user_id) {
                $query->whereIn('id', [5, 6]);
            })
            ->whereIn('coa_sub_group_id', [5, 6])
            ->select('id', 'name', 'coa_sub_group_id', 'user_id')
            ->get();
        // dd($coaAccounts);
        $openingBalances = [];

        $i = 0;
        $debitTransactions = [];
        $creditTransactions = [];
        if ($req->coaAccounts) {
            $coaAccounts = json_decode(json_encode($req->coaAccounts), false);
        }

        $count = count($coaAccounts);
        foreach ($coaAccounts as $coaAccount) {

            //--------------------getting opening balances-----------------
            $getOpeningBal = VoucherTransaction::whereDate('date', '<', $date)
                ->where('coa_account_id', $coaAccount->id)
                ->whereHas('voucher', function ($qu) {
                    return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
                })->select(DB::raw('SUM(debit) - SUM(credit) as balance'))
                ->where('user_id', $user_id)
                ->orderBy('id', 'desc')->first();
            $openingBal = 0;
            if ($getOpeningBal) {
                $openingBal = $getOpeningBal->balance;
            }

            $openingBalances[] = array(
                "account_id" => $coaAccount->id,
                "account_name" => $coaAccount->name,
                "opening_bal" => $openingBal,
            );

            //-------------------------getting credit transaactions---------------------

            $credit = VoucherTransaction::with('coaAccount', 'voucher')->whereDate('date', '=', $date)
                ->where([['coa_account_id', $coaAccount->id], ['credit', '>', 0]])
                ->whereHas('voucherNumber', function ($qu) {
                    return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
                })->select("id", "voucher_id", "coa_account_id", "credit", 'description')
                ->where('user_id', $user_id)
                ->get();
            // return response()->json($credit);
            $array = [];
            $descriptionArray = array();
            foreach ($credit as $credit) {
                for ($j = 0; $j < $count; $j++) {
                    $amount = 0;
                    if ($j == $i) {
                        $amount = $credit->credit;
                        $account = $credit->coaAccount->name;
                        $descriptionArray = array(
                            "account" => $account,
                            'description' => $credit->description,
                            'voucher_no' => $credit->voucher->voucher_no,
                        );
                    }
                    $array[$j] = array(
                        "amount" => $amount,
                    );
                }
                $creditTransactions[] = array(
                    'transactions' => $array,
                    'descriptionArray' => $descriptionArray,
                );
            }

            //-------------------------getting debit transaactions---------------------

            $debit = VoucherTransaction::with('coaAccount')->whereDate('date', '=', $date)
                ->where([['coa_account_id', $coaAccount->id], ['debit', '>', 0]])
                ->whereHas('voucherNumber', function ($qu) {
                    return $qu->where([['isApproved', 1], ['is_post_dated', 0]]);
                })->select("id", "voucher_id", "coa_account_id", "debit", 'description')
                ->where('user_id', $user_id)
                ->get();
            $array = [];
            $descriptionArray = array();
            foreach ($debit as $debit) {
                for ($j = 0; $j < $count; $j++) {
                    $amount = 0;
                    if ($j == $i) {
                        $amount = $debit->debit;
                        $account = $debit->coaAccount->name ?? '';
                        $descriptionArray = array(
                            'account' => $account,
                            'description' => $debit->description,
                            'voucher_no' => $debit->voucher->voucher_no,
                        );
                    }
                    $array[$j] = array(
                        "amount" => $amount,
                    );
                }
                $debitTransactions[] = array(
                    'transactions' => $array,
                    'descriptionArray' => $descriptionArray,
                );
            }

            $i++;
        }

        return ['status' => 'ok', 'coaAccounts' => $coaAccounts, 'openingBalances' => $openingBalances, 'debitTransactions' => $debitTransactions, 'creditTransactions' => $creditTransactions];
    }
}
