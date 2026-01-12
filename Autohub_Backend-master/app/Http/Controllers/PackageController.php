<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PackageController extends Controller
{
    public function index()
    {
        $packages = Package::all();
        return response()->json(['status' => 'success', 'packages' => $packages], 200);
    }

    public function allPackages()
    {
        $packages = Package::all();
        return response()->json(['status' => 'success', 'packages' => $packages], 200);
    }



    public function updateStatus(Request $request, Package $package)
    {

        $request->validate([
            'status' => 'required|in:1,0',
        ]);

        // Update package status based on status
        if ($request->status === 1) {
            $package->status = true;
            $message = 'package activated successfully.';
        } else {
            $package->status = false;
            $message = 'package deactivated successfully.';
        }
        $package->save();

        return response()->json(['status' => 'success', 'message' => $message]);
    }
    public function store(Request $request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'features' => 'required',
            'discount' => 'nullable'
            // 'features.*' => 'string', // Ensure each feature is a string
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422); // HTTP status code 422 for unprocessable entity
        }

        // Create the package
        $package = Package::create([
            'name' => $request->input('name'),
            'price' => $request->input('price'),
            'features' => $request->input('features'),
            'discount' => $request->input('discount'),
        ]);

        // Return a success response
        return response()->json([
            'status' => 'success',
            'message' => 'Package created successfully',
            'package' => $package,
        ], 201); // HTTP status code 201 for created
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [

            'name' => 'required',
            'price' => 'required',
            'features' => 'required',
            'discount' => 'nullable'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }
        $package = Package::findOrfail($id);
        $package->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Package update sucessfully', 'package' => $package], 200);
    }
    public function destroy($id)
    {
        try {
            $package = Package::findOrFail($id);
            $package->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'package deleted successfully'
            ], 200); // HTTP status code 200 for success
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'packa$package not found'
            ], 404); // HTTP status code 404 for not found
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the package'
            ], 500); // HTTP status code 500 for server error
        }
    }
}
