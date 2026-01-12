<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BookingController extends Controller
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
    /**
     * getting booking report
     *
     * @return \Illuminate\Http\Response
     */
    public function getBookingReport(Request $req)
    {
        //     $date = date('Y-m-d');
        //     $block_id = $req->block_id;
        //     $plot_id = $req->plot_id;
        //     $plot_type = $req->plot_type;
        //     $is_open = $req->is_open;
        //     $payment_plan = $req->payment_plan_id;
        //     $customer_id = $req->customer_id;
        //     if ($req->is_open == 0 && $req->is_open != null) {
        //         $is_open = '00';
        //     } else if ($req->is_open == 1) {
        //         $is_open = 1;
        //     } else {
        //         $is_open = $req->is_open;
        //     }
        //     $bookings  = Booking::with(['bookingCustomers', 'plot.coaAccount.plotTotalReceived', 'installmentsAmountSum' => function ($query) use ($date) {
        //         $query->where('due_date', '<=', $date);
        //     }])->when($block_id, function ($q, $block_id) {
        //         return $q->where('block_id', $block_id);
        //     })
        //         ->when($plot_id, function ($q, $plot_id) {
        //             return $q->where('plot_id', $plot_id);
        //         })
        //         ->when($payment_plan, function ($q, $payment_plan) {
        //             return $q->where('payment_plan', $payment_plan);
        //         })
        //         ->when($customer_id, function ($query, $customer_id) {
        //             return $query->whereHas('bookingCustomers', function ($qu) use ($customer_id) {
        //                 $qu->where('customer_id', $customer_id);
        //             });
        //         })
        //         ->when($plot_type, function ($query, $plot_type) {
        //             return $query->whereHas('plot', function ($qu) use ($plot_type) {
        //                 $qu->where('plot_type', $plot_type);
        //             });
        //         })
        //         ->when($is_open, function ($query, $is_open) {
        //             return $query->whereHas('plot', function ($qu) use ($is_open) {
        //                 $qu->where('is_open', $is_open);
        //             });
        //         })
        //         ->where(['is_cancelled' => 0, 'is_repurchased' => 0])
        //         ->orderBy('id')
        //         ->select('id', 'plot_id', 'total_payable', 'booking_no')
        //         ->get();
        //     $data = [];
        //     foreach ($bookings as $booking) {
        //         $totalReceived = $booking->plot->coaAccount->plotTotalReceived->balance ?? 0;
        //         $totalToBePaid = $booking->installmentsAmountSum->totalToBePaid ?? 0;
        //         if (isset($req->outstanding)) {
        //             if ($req->outstanding == 1 && $totalToBePaid - $totalReceived > 0) {
        //                 $data[] = array(
        //                     'id' => $booking->id,
        //                     'total_payable' => $booking->total_payable,
        //                     'booking_no' => $booking->booking_no,
        //                     'reg_no' => $booking->plot->reg_no,
        //                     'received' => $totalReceived,
        //                     'outstanding' => $totalToBePaid - $totalReceived,
        //                     'balance' => $booking->total_payable - $totalReceived,
        //                     'customers' => $booking->bookingCustomers,
        //                 );
        //             } elseif ($req->outstanding == 2 && $totalToBePaid - $totalReceived == 0) {
        //                 $data[] = array(
        //                     'id' => $booking->id,
        //                     'total_payable' => $booking->total_payable,
        //                     'booking_no' => $booking->booking_no,
        //                     'reg_no' => $booking->plot->reg_no,
        //                     'received' => $totalReceived,
        //                     'outstanding' => $totalToBePaid - $totalReceived,
        //                     'balance' => $booking->total_payable - $totalReceived,
        //                     'customers' => $booking->bookingCustomers,
        //                 );
        //             } elseif ($req->outstanding == 3 && $totalToBePaid - $totalReceived < 0) {
        //                 $data[] = array(
        //                     'id' => $booking->id,
        //                     'total_payable' => $booking->total_payable,
        //                     'booking_no' => $booking->booking_no,
        //                     'reg_no' => $booking->plot->reg_no,
        //                     'received' => $totalReceived,
        //                     'outstanding' => $totalToBePaid - $totalReceived,
        //                     'balance' => $booking->total_payable - $totalReceived,
        //                     'customers' => $booking->bookingCustomers,
        //                 );
        //             }
        //         } else {
        //             $data[] = array(
        //                 'id' => $booking->id,
        //                 'total_payable' => $booking->total_payable,
        //                 'booking_no' => $booking->booking_no,
        //                 'reg_no' => $booking->plot->reg_no,
        //                 'received' => $totalReceived,
        //                 'outstanding' => $totalToBePaid - $totalReceived,
        //                 'balance' => $booking->total_payable - $totalReceived,
        //                 'customers' => $booking->bookingCustomers,
        //             );
        //         }
        //     }
        //     $data = collect($data)->sortBy('reg_no')->values();
        //     return ['status' => 'ok', 'data' => $data];
    }
}
