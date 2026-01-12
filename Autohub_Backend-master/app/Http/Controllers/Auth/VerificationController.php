<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class VerificationController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Generate OTP
        $otp = Str::random(6); // Generate a random 6-character string
        $user->otp = $otp; // Store OTP in the database
        $user->otp_expires_at = now()->addMinutes(5); // Set expiry time
        $user->save();

        // Send OTP via email
        Mail::raw("Your OTP is: $otp", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Your OTP Code');
        });

        return response()->json(['message' => 'OTP sent to your email.']);
    }

    public function verifyOtp(Request $request)
    {
        $rules = [
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ];

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->otp !== $request->otp) {
            return response()->json(['status' => 'error', 'message' => 'Invalid OTP or user does not exist.'], 422);
        }

        // Verify the OTP
        $user->otp_expires_at = true;
        $user->otp = null; // Clear the OTP
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'OTP verified successfully.']);
    }

}
