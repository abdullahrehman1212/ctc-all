<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\VerifyEmail;
use App\Models\Package;
use App\Models\Role;
use App\Models\Store;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JWTAuth;
use Log;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{

    public function verifyToken(Request $request)
    {
        try {
            // dd($request);
            // Check if the token is valid by checking the authenticated user
            $user = auth('api')->user();

            //  dd($user);
            if ($user) {
                return response()->json([
                    'message' => 'Token is valid.',
                    'user' => $user,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Token is invalid or expired.',
                ], 401);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while verifying the token.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $users = User::where('role_id', '!=', 1)->get();
        return response()->json(['users', $users]);
    }

    public function dashboard_stats()
    {
        $totalUsers = User::where('role_id', '!=', 1)->count();
        $totalActiveUsers = User::where('is_active', 1)->where('role_id', '!=', 1)->count();
        $totalInactiveUsers = User::where('is_active', 0)->where('role_id', '!=', 1)->count();
        $subscriptions = Subscription::with(['user', 'package'])
            ->whereHas('user', function ($query) {
                $query->where('role_id', '!=', 1);
            })
            ->get();

        $totalRevenue = $subscriptions->sum(function ($subscription) {
            return $subscription->package->price;
        });

        return response()->json([
            'total_users' => $totalUsers,
            'total_active_users' => $totalActiveUsers,
            'total_inactive_users' => $totalInactiveUsers,
            'total_revenue' => $totalRevenue,
        ]);
    }

    public function updateUserStatus(Request $request, User $user)
    {

        $request->validate([
            'status' => 'required|in:1,0',
        ]);

        // Update user status based on status
        if ($request->status === 1) {
            $user->is_active = true;
            $message = 'User activated successfully.';
        } else {
            $user->is_active = false;
            $message = 'User deactivated successfully.';
        }
        $user->save();

        return response()->json(['status' => 'success', 'message' => $message]);
    }

    public function sendResponse($data, $message, $status = 200)
    {
        $response = [
            'data' => $data,
            'message' => $message,
        ];

        return response()->json($response, $status);
    }

    public function sendError($errorData, $message, $status = 500)
    {
        $response = [];
        $response['message'] = $message;
        if (!empty($errorData)) {
            $response['data'] = $errorData;
        }

        return response()->json($response, $status);
    }

    /**
     * Registring user
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request email
     * @param \Illuminate\Http\Request password
     * @param \Illuminate\Http\Request role_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    public function register(Request $request)
    {
        $rules = array(
            'name' => 'required',
            'company_name' => 'required|unique:users',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users',
            'phone' => 'required',
            'city' => 'required',
            'address' => 'required',
            // 'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'required|min:5',
            'package_id' => 'required|exists:packages,id',
            'type' => 'required|in:monthly,6months,yearly,days,weeks',
            'days' => 'required_if:type,days|integer|min:1',
            'weeks' => 'required_if:type,weeks|integer|min:1',
            'duration' => 'required|integer|min:1',
            'role_id' => 'required',

        );

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        // // Check if the email is already registered
        // $existingUser = User::where('email', $request->email)->first();

        // if ($existingUser) {
        //     // Check if the email is verified
        //     if ($existingUser->email_verified_at) {
        //         return response()->json(['status' => 'error', 'message' => 'Email is already registered and verified.'], 422);
        //     }

        //     // Optionally, you can re-send the verification email if it's unverified
        //     Mail::to($existingUser->email)->send(new VerifyEmail($existingUser));
        //     return response()->json(['status' => 'error', 'message' => 'Email is already registered. A new verification email has been sent.'], 422);
        // }

        if ($request->logo) {
            $imageName = time() . '.' . $request->logo->extension();
            $request->logo->move(public_path('images/company'), $imageName);
        }

        // Generate OTP
        // $otp = rand(100000, 999999);

        $user = User::create([
            'name' => $request->name,
            'company_name' => $request->company_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'city' => $request->city,
            'address' => $request->address,
            'logo' => $imageName ?? null,
            'invoice_note' => $request->invoice_note,
            'ntn' => $request->ntn,
            'gst' => $request->gst,
            'company_id' => 1,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
            // 'otp' => $otp,
            // 'otp_expires_at' => false,
        ]);

        // $token = $user->createToken('SpareParts')->plainTextToken;

        $user_id = $user->id;
        $trial_days = $request->days ?? 0;
        $trial_weeks = $request->weeks ?? 0;

        $package = Package::findOrFail($request->package_id);
        if ($package->id == 1 && $user->trial_login_at === null) {
            $user->trial_login_at = Carbon::now();
            $user->save();
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
            'user_id' => $user_id,
            'package_id' => $package->id,
            'type' => $request->type,
            'duration' => $request->duration,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        Store::create([
            'name' => $request->company_name,
            'user_id' => $user_id,
            'store_type_id' => 2,
            'address' => $request->address,
        ]);

        // Mail::to(env('MAIL_USERNAME'))->send(new UserRegistered($user));

        // Send User Registered email
        // Mail::to($user->email)->send(new \App\Mail\VerifyEmail($user->name, $otp));

        return response()->json(['status' => 'ok', 'message' => 'Account created successfully']);
    }

    public function salesman_register(Request $request)
    {
        // Get the authenticated user
        $user = JWTAuth::parseToken()->authenticate();
        // Check if user is authenticated
        if (!$user) {
            return response()->json(['message' => 'Unauthorized', 'status' => 'Not Authenticated'], 401);
        }

        // Determine the user ID based on role
        $user_id = $user->role_id == 2 ? $user->id : $user->admin_id;

        // Fetch the user's subscription package
        $subscription = Subscription::where('user_id', $user_id)->first();
        if (!$subscription) {
            return response()->json(['status' => 'error', 'message' => 'Subscription not found'], 404);
        }

        $packageId = $subscription->package_id;
        $allowedLimits = [
            1 => 1,
            2 => 3,
            3 => 6,
            4 => 10,
        ];
        // Get the count of existing salesmen
        $salesmanCount = User::where('admin_id', $user_id)
            ->where('role_id', 3)
            ->count();
        // Check if the user has reached their limit
        if (isset($allowedLimits[$packageId]) && $salesmanCount >= $allowedLimits[$packageId]) {
            return ['status' => 'error', 'message' => 'Limit reached. Upgrade your package to add more salesmen.'];
        }

        // Validation rules
        $rules = [
            'name' => 'required',
            'username' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'required',
            'city' => 'required',
            'address' => 'required',
            'password' => 'required|min:5',
            'role_id' => 'required',
        ];

        // Validate the request
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        // Handle file upload if present
        if ($request->hasFile('logo')) {
            $imageName = time() . '.' . $request->logo->extension();
            $request->logo->move(public_path('images/company'), $imageName);
        } else {
            $imageName = null; // Set default or handle accordingly
        }

        // Create a new user
        $newUser = User::create([
            'name' => $request->name,
            'company_name' => $request->company_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->phone,
            'city' => $request->city,
            'address' => $request->address,
            'logo' => $imageName, // Save logo name if uploaded
            'admin_id' => $user_id, // Store authorized user's ID
            'company_id' => 1,
            'role_id' => $request->role_id,
            'password' => Hash::make($request->password),
        ]);

        // Uncomment to send a welcome email
        // Mail::to($newUser->email)->send(new WelcomeEmail($newUser));

        return response()->json(['status' => 'ok', 'message' => 'Account created successfully', 'user' => $newUser]);
    }

    /**
     *This is a login function
     * Return success or error message
     * @param  \Illuminate\Http\Request  $email
     * @param  \Illuminate\Http\Request  $password
     * @return string $result
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:5|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['status' => 'error', 'message' => 'Invalid login credentials'], 401);
            }
            $user = JWTAuth::user();
            // if (!$user) {
            //     return response()->json(['message' => 'User not authorized'], 403);
            // }

            // Assuming the logo is stored in the 'public/images/company' directory
            // Check if the user's email is verified
            // if (is_null($user->email_verified_at)) {
            //     return response()->json(['status' => 'error', 'message' => 'Your email address is not verified. Please check your email to verify your account.'], 403);
            // }

            if ($user->role_id == 2) {
                $user_id = $user->id;
                $trialLogin = $user->trial_login_at;
                $package_id = $user->subscription->package_id ?? '';
                $user->logo_url = $user->logo ? asset('public/images/company/' . $user->logo) : 'NA';
            } else {
                $user_id = $user->admin_id;
                $sale_user = User::where('id', $user_id)->first();

                if ($sale_user) {
                    $trialLogin = $sale_user->trial_login_at;
                    $package_id = $sale_user->subscription->package_id ?? '';
                    $user->logo_url = $sale_user->logo ? asset('public/images/company/' . $sale_user->logo) : 'NA';
                } else {

                    $trialLogin = null; // Or provide a default value
                    $package_id = ''; // Provide a default for package_id if needed
                    $user->logo_url = 'NA'; // Handle logo_url if $sale_user is null

                }
            }

            $now = Carbon::now();

            if ($user->role_id == '1') {
                return response()->json(['status' => 'error', 'message' => 'Invalid login credentials'], 401);
            }

            if ($user->is_active == 0) {
                return response()->json(['message' => 'Your account is deactivated. Contact your service provider for further details'], 403);
            }

            $subscription = Subscription::with('package')
                ->where('user_id', $user_id)
                ->where('package_id', $package_id)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($package_id == 1 && $subscription && $subscription->isExpired()) {
                return response()->json([
                    'message' => 'Free trial expired, please pay to continue',
                    'token' => $token,
                    'id' => $user->id,
                    'role' => $user->role->role,
                    'name' => $user->name,
                    'package_name' => $subscription->package->name,
                    'package_features' => $subscription->package->features,
                    'end_date' => $subscription->end_date,
                ], 403);
            }

            if ($subscription && $subscription->isExpired()) {
                return response()->json([
                    'message' => 'Your subscription is expired, please pay to continue',
                    'token' => $token,
                    'id' => $user->id,
                    'role' => $user->role->role,
                    'name' => $user->name,
                    'package_name' => $subscription->package->name,
                    'package_features' => $subscription->package->features,
                    'end_date' => $subscription->end_date,
                ], 403);
            }
            if ($subscription && $subscription->status == 0) {
                return response()->json([
                    'message' => 'Your subscription is not approved, Please wait for admin verification',
                    'token' => $token,
                    'id' => $user->id,
                    'role' => $user->role->role,
                    'name' => $user->name,
                    'package_name' => $subscription->package->name,
                    'package_features' => $subscription->package->features,
                    'end_date' => $subscription->end_date,
                ], 403);
            }
            // $user->trial_login_at = $now;
            // $user->save();

            return [
                'status' => 'ok',
                'token' => $token,
                'role' => [
                    'user' => $user,
                    'id' => $user->id,
                    'role' => $user->role->role,
                    'name' => $user->name,
                    'trial_login' => $trialLogin,
                    'package_name' => $subscription->package->name ?? 'NA',
                    'package_features' => $subscription->package->features ?? 'NA',
                    'end_date' => $subscription->end_date ?? 'NA',

                ],
            ];
        } catch (JWTException $e) {
            return response()->json(['status' => 'error', 'message' => 'Could not create token'], 500);
        }
    }

    public function admin_login(Request $request)
    {

        $credentials = $request->only('email', 'password');

        //valid credential
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:5|max:50',
        ]);

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        // dd($credentials);
        //Request is validated
        //Crean token
        try {
            // this authenticates the user details with the database and generates a token
            if (!$token = JWTAuth::attempt($credentials)) {
                return ['status' => 'error', 'message' => 'Invalid login credentials'];
            }
            // $usersdata = User::with('role')->where('email', $request->email)->first();
            // $users = ['id' => $usersdata->id, 'role_id' => $usersdata->role_id, 'role_name' => $usersdata->role->role, 'name' => $usersdata->name];
            $usersdata = User::with('role')->where('email', $request->email)->first();
            // dd($usersdata);
            if ($usersdata->role_id != '1') {
                return ['status' => 'error', 'message' => 'Invalid login credentials'];
            }
            if ($usersdata->is_active == 0) {
                return ['message' => 'Your account is deactivated contact your service provider for further detail'];
            }
            $user = ['id' => $usersdata->id, 'role' => $usersdata->role->role, 'name' => $usersdata->name, 'email' => $usersdata->email];
        } catch (JWTException $e) {
            return $this->sendError([], $e->getMessage(), 500);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }

        return ['status' => 'ok', 'token' => $token, 'user' => $user];
    }

    /**
     * getting users list
     * @param Illuminate\Http\Request records
     * @param Illuminate\Http\Request pageNo
     * @param Illuminate\Http\Request colName
     * @param Illuminate\Http\Request sort
     * @return string $users
     */
    public function getUsers(Request $req)
    {
        $users = User::leftJoin('subscriptions', 'users.id', '=', 'subscriptions.user_id')
            ->select('users.*', 'subscriptions.package_id')
            ->orderBy($req->colName, $req->sort)->with('role')->paginate($req->records, ['*'], 'page', $req->pageNo);
        return ['users' => $users];
    }

    /**
     * deleting user
     * @param Illuminate\Http\Request id
     * @return string result
     */
    public function deleteUser($id)
    {
        $deleteUser = User::find($id);
        if ($deleteUser->delete()) {
            $result = "User Deleted successfully";
        } else {
            $result = "There is some error";
        }

        return ['message' => $result];
    }

    public function getRoles()
    {
        $roles = Role::orderBy('role')->get();
        return ['roles' => $roles];
    }

    public function logout(Request $request)
    {
        $validator = Validator::make($request->only('token'), [
            'token' => 'required',
        ]);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        try {
            // JWTAuth::invalidate($request->token);
            JWTAuth::parseToken()->invalidate(true);

            return ['status' => 'ok', 'message' => 'You logged out successfully'];
        } catch (JWTException $e) {
            return ['status' => 'ok', 'message' => 'You logged out successfully'];
        }
    }
    /**
     * edit User
     * @param Illuminate\Http\Request id
     * @return string result
     */
    public function editUser(Request $req)
    {

        $result = User::with('role')->where('id', $req->id)->first();
        return ['status' => 'ok', 'user' => $result];
    }
    /**
     * edit User
     * @param Illuminate\Http\Request id
     * @return string result
     */
    public function updateUser(Request $req)
    {
        $rules = array(
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $req->id,
            'role_id' => 'required',
            'password' => 'nullable|min:8', // Optional but must be at least 8 characters
        );
        $validator = Validator::make($req->all(), $rules);

        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }

        $user = User::find($req->id);
        if (!$user) {
            return ['status' => 'error', 'message' => 'User not found'];
        }

        $user->name = $req->name;
        $user->email = $req->email;
        $user->role_id = $req->role_id;
        $user->company_name = $req->company_name;
        $user->address = $req->address;
        $user->phone = $req->phone;
        $user->city = $req->city;
        $user->invoice_note = $req->invoice_note;
        $user->ntn = $req->ntn;
        $user->gst = $req->gst;

        // Update the password if provided
        if ($req->filled('password')) {
            $user->password = bcrypt($req->password);
        }

        // Handle logo upload
        if ($req->hasFile('logo')) {
            $imageName = time() . '.' . $req->logo->extension();
            $req->logo->move(public_path('images/company'), $imageName);
            $user->logo = $imageName; // Assuming the User model has a 'logo' field to store the image name
        }

        $user->save();

        return ['status' => 'ok', 'message' => 'Account Update Successfully' , 'user' => $user];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $email
     * @param  int  $password
     * @return \Illuminate\Http\Response
     */
    public function changePassword(Request $request)
    {
        $rules = array(
            'id' => 'required|int|exists:users,id',
            'password' => 'required|min:5',
            'confirm_password' => 'required',
        );
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return ['status' => 'error', 'message' => $validator->errors()->first()];
        }
        $user = User::where('id', $request->id)->first();
        if ($request->password == $request->confirm_password) {
            $user->password = Hash::make($request->password);
            $user->save();
            return ['status' => 'ok', 'message' => 'Password changed successfully'];
        } else {
            return ['status' => 'error', 'message' => 'Password & Confirm Password Must be Equal'];
        }
    }
}
