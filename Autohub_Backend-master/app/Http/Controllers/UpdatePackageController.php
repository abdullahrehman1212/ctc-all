<?php

namespace App\Http\Controllers;

use App\Mail\PackageUpgradeNotification;
use App\Models\Notification;
use App\Models\Package;
use App\Models\Subscription; // Import Notification model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UpdatePackageController extends Controller
{
    public function updatePackage(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'package_id' => 'required|integer|exists:packages,id',
        ]);

        // Fetch the package ID from the request
        $package_id = $request->input('package_id');

        // Fetch the currently authenticated user's ID
        $user_id = auth()->id(); // Assuming you're using Laravel's authentication

        // Check if there's a recent notification within the last hour
        $lastNotification = Notification::where('user_id', $user_id)
            ->where('created_at', '>=', now()->subHour()) // Check for notifications within the last hour
            ->first();

        if ($lastNotification) {
            // Error response if another notification was sent recently
            return response()->json(['message' => 'You have already sent a notification within the last hour. Please try again later.'], 400);
        }

        // Fetch the new package details
        $newPackage = Package::findOrFail($package_id);

        // Fetch the user's previous package details
        $previousPackage = Subscription::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->first()
            ->package; // Assuming this gives you the previous package

        // Fetch the user details
        $user = auth()->user(); // Get the authenticated user

        // Create the email notification message
        Mail::to(env('MAIL_USERNAME'))->send(new PackageUpgradeNotification($user, $newPackage, $previousPackage));

        // Create a notification for the super admin
        Notification::create([
            'user_id' => $user->id, // Use the authenticated user ID
            'message' => "{$user->name} ({$user->email}) has requested from {$previousPackage->name} to {$newPackage->name}.",
            'read_at' => 0,
        ]);

        return response()->json(['status' => 'ok', 'message' => 'Notification sent successfully'], 200);
    }

}
