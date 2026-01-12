<?php

// app/Http/Controllers/SubscriptionController.php
namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with(['user', 'package'])
            ->whereHas('user', function ($query) {
                $query->where('role_id', '!=', 1);
            })
            ->get();

        // Iterate over each subscription to check the end date
        foreach ($subscriptions as $subscription) {
            if ($subscription->end_date < now()) {
                $subscription->status = 0;
                $subscription->save();
            } else {
                $subscription->status = 1;
                $subscription->save();
            }
        }

        return response()->json(['status' => 'success', 'subscription' => $subscriptions]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required',
            'user_id' => 'required',
            'type' => 'required|in:monthly,6months,yearly,days,weeks',
        ]);

        $trial_days = $request->days;
        $trial_weeks = $request->weeks;

        $package = Package::findOrFail($request->package_id);
        if ($package->id == 1) {
            $user = User::findOrFail($request->user_id);

            if ($user && $user->trial_login_at == null) {
                $user->trial_login_at = Carbon::now();
                $user->save();
            }
        }

        $startDate = now();
        switch ($request->type) {

            case 'days':
                $endDate = $startDate->copy()->addDays($trial_days);
                break;
            case 'weeks':
                $endDate = $startDate->copy()->addWeeks($trial_weeks);
                break;
            case 'monthly':
                $endDate = $startDate->copy()->addMonth();
                break;
            case '6months':
                $endDate = $startDate->copy()->addMonths(6);
                break;
            case 'yearly':
                $endDate = $startDate->copy()->addYear();
                break;
            default:
                throw new \Exception("Invalid subscription type");
        }

        Subscription::create([
            'user_id' => $request->user_id,
            'package_id' => $package->id,
            'type' => $request->type,
            'duration' => $request->duration,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Package subscribed successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'package_id' => 'required',
            'user_id' => 'required',
            'type' => 'nullable|in:monthly,6months,yearly,days,weeks',
            'end_date' => 'nullable|date'
        ]);

        // Ensure that either 'type' or 'end_date' is provided, but not both
        if (empty($request->type) && empty($request->end_date)) {
            return response()->json(['status' => 'error', 'message' => 'Please provide either type or end_date.'], 400);
        }
        if (!empty($request->type) && !empty($request->end_date)) {
            return response()->json(['status' => 'error', 'message' => 'Only one of type or end_date should be provided.'], 400);
        }

        $package = Package::findOrFail($request->package_id);
        $subscription = Subscription::findOrFail($id);

        if ($package->id == 1) {
            $user = User::findOrFail($request->user_id);

            if ($user && $user->trial_login_at == null) {
                $user->trial_login_at = Carbon::now();
                $user->save();
            }
        }

        // Set startDate from subscription end_date if it exists; otherwise, use Carbon::now()
        $startDate = $subscription->end_date ? Carbon::parse($subscription->end_date) : Carbon::now();
        $endDate = null;

        // Calculate the new end date based on the type if 'type' is provided
        if (!empty($request->type)) {
            switch ($request->type) {
                case 'days':
                    $endDate = $startDate->copy()->addDays($request->days);
                    break;
                case 'weeks':
                    $endDate = $startDate->copy()->addWeeks($request->weeks);
                    break;
                case 'monthly':
                    $endDate = $startDate->copy()->addMonth();
                    break;
                case '6months':
                    $endDate = $startDate->copy()->addMonths(6);
                    break;
                case 'yearly':
                    $endDate = $startDate->copy()->addYear();
                    break;
                default:
                    throw new \Exception("Invalid subscription type");
            }
        } elseif (!empty($request->end_date)) {
            // Convert end_date to Carbon instance if provided
            $endDate = Carbon::parse($request->end_date)->format('Y-m-d');
        }

        // Update the subscription details
        $subscription->update([
            'user_id' => $request->user_id,
            'package_id' => $package->id,
            'type' => $request->type ?? null,  // Save as null if empty
            'start_date' => $startDate,
            'end_date' => $endDate, // Save as null if empty
        ]);

        return response()->json(['status' => 'success', 'message' => 'Subscription updated successfully'], 200);
    }

    public function destroy($id)
    {
        try {
            $subscription = Subscription::findOrFail($id);
            $subscription->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Subscription deleted successfully',
            ], 200); // HTTP status code 200 for success
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found',
            ], 404); // HTTP status code 404 for not found
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the subscription',
            ], 500); // HTTP status code 500 for server error
        }
    }
    public function approveSubscription(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:1,0',
        ]);

        $subscription = Subscription::where('user_id', $id)->firstOrFail(); // Fetch the subscription

        // Update user status based on status
        $status = (bool) $request->status;

        $subscription->status = $status;
        $subscription->save();

        $message = $status ? 'Subscription activated successfully.' : 'Subscription deactivated successfully.';

        return response()->json(['status' => 'success', 'message' => $message]);
    }
}
