<?php

use App\Http\Controllers\AdjustInventoryController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BusinessReportsController;
use App\Http\Controllers\categoryController;
use App\Http\Controllers\CoaAccountController;
use App\Http\Controllers\CoaGroupController;
use App\Http\Controllers\CoaSubGroupController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DimensionController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemInventoryController;
use App\Http\Controllers\KitController;
use App\Http\Controllers\KitInventoryController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\MachineModelController;
use App\Http\Controllers\MachinePartController;
use App\Http\Controllers\MachinePartDetailsController;
use App\Http\Controllers\MachinePartsModelsController;
use App\Http\Controllers\MachinePartTypeController;
use App\Http\Controllers\MakeController;
use App\Http\Controllers\OriginController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\RackController;
use App\Http\Controllers\ReturnedPurchaseOrderController;
use App\Http\Controllers\ReturnedSaleController;
use App\Http\Controllers\ShelvesController;
use App\Http\Controllers\stockTransferController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UomController;
use App\Http\Controllers\UpdatePackageController;
use App\Http\Controllers\VoucherController;
use App\Models\ItemInventory;
use App\Models\MachinePartModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuotationController;






/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

//---------------------------------Auth Routes-------------------------------------------------------
/**
 * Registring user
 *
 * @param \Illuminate\Http\Request name
 * @param \Illuminate\Http\Request email
 * @param \Illuminate\Http\Request password
 * @param \Illuminate\Http\Request role_id
 * @param \Illuminate\Http\Request company_id
 * @return \Illuminate\Http\Response message
 * @return \Illuminate\Http\Response status
 */

// Route::post('/send-otp', [VerificationController::class, 'sendOtp']);
// Route::post('/verify-otp', [VerificationController::class, 'verifyOtp']);

// Route::post('/verify-email', [VerificationController::class, 'verifyOtp'])->name('verify.email');

Route::post('register', [AuthController::class, 'register']);
Route::post('salesman_register', [AuthController::class, 'salesman_register'])->middleware('auth:api');

Route::get('/verifyToken', [AuthController::class, 'verifyToken']);

Route::get('/allPackages', [PackageController::class, 'allPackages']);

/**
 *This is a login route
 * Return success or error message
 * @param  \Illuminate\Http\Request  $email
 * @param  \Illuminate\Http\Request  $password
 * @return string $result
 */
Route::post('login', [AuthController::class, 'login']);

/**
 *
 * @param  \Illuminate\Http\Request  $token
 * @return string $result
 */
// for super admin
Route::post('admin/login', [AuthController::class, 'admin_login']);

//

Route::group(['middleware' => ['jwt.verify']], function () {

    Route::get('check_user', function () {
        return response()->json(['message' => 'Authorized']);
    })->middleware('check.package.expiry');

    Route::group(['middleware' => 'superadmin'], function () {
        Route::get('/notification', [AdminNotificationController::class, 'index']);
        Route::get('/notification/{id}/mark-as-read/', [AdminNotificationController::class, 'markAsRead']);
        Route::get('users', [AuthController::class, 'index']);
        Route::get('dashboard_stats', [AuthController::class, 'dashboard_stats']);
        Route::post('updateUserStatus/{user}', [AuthController::class, 'updateUserStatus']);
    });
    Route::prefix('subcriptions')->group(function () {
        Route::get('/', [SubscriptionController::class, 'index']);
        Route::post('create', [SubscriptionController::class, 'store']);
        Route::post('update/{id}', [SubscriptionController::class, 'update']);
        Route::delete('destroy/{id}', [SubscriptionController::class, 'destroy']);
        Route::post('approveSubscription/{id}', [SubscriptionController::class, 'approveSubscription'])->middleware('superadmin');
    });
    Route::prefix('packages')->group(function () {
        Route::get('/', [PackageController::class, 'index']);
        Route::post('updateStatus/{package}', [PackageController::class, 'updateStatus'])->middleware('superadmin');
        Route::post('create', [PackageController::class, 'store']);
        Route::post('update/{id}', [PackageController::class, 'update']);
        Route::delete('destroy/{id}', [PackageController::class, 'destroy']);
    });
    Route::post('logout', [AuthController::class, 'logout']);

    Route::post('updatePackage', [UpdatePackageController::class, 'updatePackage']);

    // Route::group(['middleware' => ['jwt.verify']], function () {

    /**
     * getting users list
     * @param Illuminate\Http\Request records
     * @param Illuminate\Http\Request pageNo
     * @param Illuminate\Http\Request colName
     * @param Illuminate\Http\Request sort
     * @return string $users
     */
    Route::get('getUsers', [AuthController::class, 'getUsers']);
    /**
     * edit user
     * @param Illuminate\Http\Request id

     */
    Route::get('editUser', [AuthController::class, 'editUser']);
    /**
     * deleting user
     * @param Illuminate\Http\Request id
     * @return string result
     */
    /**
     * update user
     * @param Illuminate\Http\Request id
     * @return string result
     */
    Route::post('updateUser', [AuthController::class, 'updateUser']);
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $email
     * @param  int  $password
     * @return \Illuminate\Http\Response
     */

    Route::post('changePassword', [AuthController::class, 'changePassword']);
    Route::delete('deleteUser/{id}', [AuthController::class, 'deleteUser']);

    Route::get('getRoles', [AuthController::class, 'getRoles']);

    /**
     * check autologout for user
     * @param Illuminate\Http\Request user_id
     * @return string result
     */
    Route::get('checkUserAutoLogout', [AuthController::class, 'checkUserAutoLogout']);

    //---------------------------------Multiple Drop Down Api--------------------------------------------------
    Route::get('getDropDownsOptionsForItemPartsIndex', [MachineController::class, 'getDropDownsOptionsForItemPartsIndex']);

    Route::get('getDropDownsOptionsForItemPartsAdd', [MachineController::class, 'getDropDownsOptionsForItemPartsAdd']);

    Route::get('getDropDownsOptionsForItemPartsAddMachinePart', [MachineController::class, 'getDropDownsOptionsForItemPartsAddMachinePart']);
    //---------------------------------Multiple Drop Down Api End--------------------------------------------------
    //---------------------------------Person Routes--------------------------------------------------
    /**
     * Store a newly created person in storage.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request phone_no
     * @param \Illuminate\Http\Request email
     * @param \Illuminate\Http\Request cnic
     * @param \Illuminate\Http\Request address
     * @param \Illuminate\Http\Request father_name
     * @param \Illuminate\Http\Request person_type_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('addPerson', [PersonController::class, 'store']);
    /**
     * Gettng active suppliers.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getActiveSuppliers', [PersonController::class, 'getActiveSuppliers']);
    /**
     * Gettng Person Types.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonTypes', [PersonController::class, 'getPersonTypes']);

    Route::post('changePersonStatus', [PersonController::class, 'changePersonStatus']);

    /**
     * Gettng Persons.
     *
     * @param \Illuminate\Http\Request person_type_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersons', [PersonController::class, 'index']);
    /**
     * Edit Persons.
     * @param \Illuminate\Http\Request person_id
     * @return \Illuminate\Http\Response
     */
    Route::get('editPerson', [PersonController::class, 'edit']);

    /**
     * Update Persons
     *
     * @param \Illuminate\Http\Request person_id
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request phone_no
     * @param \Illuminate\Http\Request cnic
     * @param \Illuminate\Http\Request email
     * @param \Illuminate\Http\Request address
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */

    Route::post('updateperson', [PersonController::class, 'update']);

    /**
     * deleting person
     * @param \Illuminate\Http\Request person_id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deletePerson', [PersonController::class, 'destroy']);
    /**
     * Gettng Persons By Person Type.
     * @param \Illuminate\Http\Request person_type_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonsByPersonType', [PersonController::class, 'getPersonsByPersonType']);
    /**
     * Gettng Person files.
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getFilesByPersonOrMouza', [PersonController::class, 'getFilesByPersonOrMouza']);

    /**
     * Getting person all accounts.
     * @param  int  $person_id
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonAllAccounts', [PersonController::class, 'getPersonAllAccounts']);

    /**
     * Getting persons accounts balance.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonCoaAccountsBalance', [PersonController::class, 'getPersonCoaAccountsBalance']);

    /**
     * @param \Illuminate\Http\Request person_type_id
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getRequiredPersons', [PersonController::class, 'getRequiredPersons']);

    //----------------------------------------Chart of accounts routes-----------------------------------
    //----------------------------------------coa sub group routes-----------------------------------

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getCoaSubGroups', [CoaSubGroupController::class, 'index']);

    /**
     * Store a newly created CoaSubGroup in storage.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('addCoaSubGroups', [CoaSubGroupController::class, 'store']);

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request coa_group_id
     * @return \Illuminate\Http\Response
     */
    Route::get('coaSubGroupsByGroup', [CoaSubGroupController::class, 'coaSubGroupsByGroup']);

    /**
     * Making sub group active or incactive
     *
     * @param \Illuminate\Http\Request sub_group_id
     * @return \Illuminate\Http\Response
     */
    Route::get('makeSubGroupActiveOrInactive', [CoaSubGroupController::class, 'makeSubGroupActiveOrInactive']);

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request type(optional)
     * @return \Illuminate\Http\Response
     */
    Route::get('getRequiredCoaSubGroups', [CoaSubGroupController::class, 'getRequiredSubGroups']);

    /**
     * editing coa sub group
     *
     * @param \Illuminate\Http\Request sub_group_id
     * @return \Illuminate\Http\Response
     */
    Route::get('editCoaSubGroup', [CoaSubGroupController::class, 'edit']);

    /**
     * Updating coa subgroup.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @param \Illuminate\Http\Request coa_sub_group_id
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('updateCoaSubGroup', [CoaSubGroupController::class, 'update']);

    /**
     * deleting coa sub group
     *
     * @param \Illuminate\Http\Request coa_sub_group_id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteCoaSubGroup', [CoaSubGroupController::class, 'delete']);

    //----------------------------------------coa accounts routes-----------------------------------

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getCoaAccounts', [CoaAccountController::class, 'index']);

    /**
     * Store a newly created CoaAccount in storage.
     *
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @param \Illuminate\Http\Request person_id (optional)
     * @param \Illuminate\Http\Request coa_sub_group_id (optional)
     * @param \Illuminate\Http\Request description (optional)
     * @param \Illuminate\Http\Request code
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('addCoaAccount', [CoaAccountController::class, 'store']);

    /**
     * Getting coaAccounts by coaGroup.
     * @param \Illuminate\Http\Request coa_group_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getAccountsByGroup', [CoaAccountController::class, 'getAccountsByGroup']);

    /**
     * Getting coaAccounts by coaSubGroup.
     * @param \Illuminate\Http\Request coa_sub_group_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getAccountsBySubGroup', [CoaAccountController::class, 'getAccountsBySubGroup']);

    Route::get('getBankAccountsBySubGroup', [CoaAccountController::class, 'getBankAccountsBySubGroup']);

    /**
     * Getting coaAccount ledger
     ** @param \Illuminate\Http\Request account_id
     ** @param \Illuminate\Http\Request from
     ** @param \Illuminate\Http\Request to
     * @return \Illuminate\Http\Response
     */
    Route::get('getAccountLedger', [CoaAccountController::class, 'getAccountLedger']);

    /**
     * Getting accounts related to cash and bank .
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getCashAccounts', [CoaAccountController::class, 'getCashAccounts']);

    /**
     * Getting accounts except  cash and bank .
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getAccountsExceptCash', [CoaAccountController::class, 'getAccountsExceptCash']);

    /**
     * Getting mouza accounts.
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getMouzaAccounts', [CoaAccountController::class, 'getMouzaAccounts']);

    /**
     * Getting person accounts
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonCoaAccounts', [CoaAccountController::class, 'getPersonCoaAccounts']);

    /**
     * Getting person and mouza accounts
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getPersonAndMouzaAccounts', [CoaAccountController::class, 'getPersonAndMouzaAccounts']);

    /**
     * Making account active or incactive
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    Route::get('makeAccountActiveOrInactive', [CoaAccountController::class, 'makeAccountActiveOrInactive']);

    /**
     * Display a listing of the resource.
     * @param \Illuminate\Http\Request group_id(optional)
     * @param \Illuminate\Http\Request sub_group_id(optional)
     * @param \Illuminate\Http\Request type(optional)
     * @return \Illuminate\Http\Response
     */
    Route::get('getRequiredAccounts', [CoaAccountController::class, 'getRequiredAccounts']);

    /**
     * editing coa account
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    Route::get('editCoaAccount', [CoaAccountController::class, 'edit']);

    /**
     * Updating coa account.
     *
     * @param \Illuminate\Http\Request account_id
     * @param \Illuminate\Http\Request name
     * @param \Illuminate\Http\Request coa_group_id
     * @param \Illuminate\Http\Request person_id (optional)
     * @param \Illuminate\Http\Request coa_sub_group_id (optional)
     * @param \Illuminate\Http\Request description (optional)
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('updateCoaAccount', [CoaAccountController::class, 'update']);

    /**
     * Deleting coa account
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteCoaAccount', [CoaAccountController::class, 'delete']);

    /**
     * Getting files and payment heads by coaaccount
     *
     * @param \Illuminate\Http\Request account_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getFilesByAccount', [CoaAccountController::class, 'getFilesByAccount']);

    /**
     * Getting files and payment heads by coaaccount
     *
     * @param \Illuminate\Http\Request account_id
     * @param \Illuminate\Http\Request file_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getPaymentHeadsByFileAndAccount', [CoaAccountController::class, 'getPaymentHeads']);

    /**
     * Getting accounts except cash and bank .
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getAccountsExceptCashAndBank', [CoaAccountController::class, 'getAccountsExceptCashAndBank']);

    //---------------------------------------------------Coa Group Routes---------------------------
    Route::get('getCoaGroups', [CoaGroupController::class, 'index']);
    //--------------------------------------------Accounting Routes--------------------------

    /**
     * Balance sheet
     *
     * @param \Illuminate\Http\Request date
     * @return \Illuminate\Http\Response
     */
    Route::get('getBalanceSheet', [BusinessReportsController::class, 'getBalanceSheet']);

    /**
     * Trail Balance
     *
     * @param \Illuminate\Http\request from
     * @param \Illuminate\Http\request to
     * @return \Illuminate\Http\Response
     */
    Route::get('getTrailBalance', [BusinessReportsController::class, 'getTrailBalance']);
    Route::get('getChartOfAccounts', [BusinessReportsController::class, 'getChartOfAccounts']);
    /**
     * Displaying GeneralJournal
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getGeneralJournal', [BusinessReportsController::class, 'getGeneralJournal']);

    /**
     *  daily closing report
     *
     * @param \Illuminate\Http\date
     * @return \Illuminate\Http\Response
     */
    Route::post('getDailyClosingReport', [BusinessReportsController::class, 'getDailyClosingReport']);
    //-----------------------------------------------Companies routes--------------------------------------
    /**
     * getting Companies list
     * @return \Illuminate\Http\Response Companies
     */
    Route::get('getCompanies', [CompanyController::class, 'index']);

    /**
     * getting Companies list
     * @return \Illuminate\Http\Response Companies
     */
    Route::get('getCompaniesDropDown', [CompanyController::class, 'getCompaniesDropDown']);
    /**
     * adding Company
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addCompany', [CompanyController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editCompany', [CompanyController::class, 'edit']);

    /**
     * updating Company
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateCompany', [CompanyController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteCompany', [CompanyController::class, 'destroy']);

    //-----------------------------------------------Machines routes--------------------------------------
    /**
     * getting Machines list
     * @return \Illuminate\Http\Response Machines
     */
    Route::get('getMachines', [MachineController::class, 'index']);

    /**
     * getting Machines list
     * @return \Illuminate\Http\Response Machines
     */
    Route::get('getMachinesDropDown', [MachineController::class, 'getMachinesDropDown']);
    /**
     * adding Machine
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addMachine', [MachineController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editMachine', [MachineController::class, 'edit']);

    /**
     * updating Machine
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateMachine', [MachineController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteMachine', [MachineController::class, 'destroy']);

    //-----------------------------------------------Makes routes--------------------------------------
    /**
     * getting Makes list
     * @return \Illuminate\Http\Response Makes
     */
    Route::get('getMakes', [MakeController::class, 'index']);

    /**
     * getting Makes list
     * @return \Illuminate\Http\Response Makes
     */
    Route::get('getMakesDropDown', [MakeController::class, 'getMakesDropDown']);
    /**
     * adding Make
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addMake', [MakeController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editMake', [MakeController::class, 'edit']);

    /**
     * updating Make
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateMake', [MakeController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteMake', [MakeController::class, 'destroy']);

    //-----------------------------------------------MachineModels routes--------------------------------------
    /**
     * getting MachineModels list
     * @param  int  machine_id
     * @param  int  make_id
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @return \Illuminate\Http\Response MachineModels
     */
    Route::get('getMachineModels', [MachineModelController::class, 'index']);

    /**
     * getting Dropdown of MachineModels list
     * @param \Illuminate\Http\Response machine_id
     * @param \Illuminate\Http\Response make_id
     * @return \Illuminate\Http\Response MachineModels
     */
    Route::get('getMachineModelsDropDown', [MachineModelController::class, 'getMachineModelsDropDown']);
    /**
     * adding MachineModel
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response machine_id
     * @param \Illuminate\Http\Response make_id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addMachineModel', [MachineModelController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editMachineModel', [MachineModelController::class, 'edit']);

    /**
     * updating MachineModel
     * @param \Illuminate\Http\Response  id
     * @param \Illuminate\Http\Response  name
     * @param \Illuminate\Http\Response  machine_id
     * @param \Illuminate\Http\Response  make_id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateMachineModel', [MachineModelController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteMachineModel', [MachineModelController::class, 'destroy']);

    //-----------------------------------------------Machine Parts routes--------------------------------------
    /**
     * getting MachineParts list
     * @return \Illuminate\Http\Response MachineParts
     */
    Route::get('getMachineParts', [MachinePartController::class, 'index']);

    Route::get('getItemTypesDropdown', [MachinePartController::class, 'getItemTypesDropdown']);
    /**
     * getting MachineParts list
     * @return \Illuminate\Http\Response MachineParts
     */
    Route::get('getMachinePartsDropDown', [MachinePartController::class, 'getMachinePartsDropDown']);
    /**
     * adding MachinePart
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addMachinePart', [MachinePartController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editMachinePart', [MachinePartController::class, 'edit']);

    /**
     * updating MachinePart
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateMachinePart', [MachinePartController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteMachinePart', [MachinePartController::class, 'destroy']);
    /**
     * getting subcategories list
     * @return \Illuminate\Http\Response subcategories
     */
    Route::get('getSubCategoriesByCategory', [MachinePartController::class, 'getSubCategoriesByCategory']);
    /**
     * getting sets list
     * @return \Illuminate\Http\Response sets
     */
    Route::get('getSetsDropDown', [MachinePartController::class, 'getSetsDropDown']);
    /**
     * getting sets list
     * @return \Illuminate\Http\Response sets
     */
    Route::get('getSetsByStore', [MachinePartController::class, 'getSetsByStore']);

    // --------------------Item Details Routes --------------------

    /**
     * adding ItemModelOem
     * @param \Illuminate\Http\Response number1
     * @param \Illuminate\Http\Response number2
     * @param \Illuminate\Http\Response machine_model_id
     * @param \Illuminate\Http\Response machine_part_id
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response company_id
     * @return \Illuminate\Http\Response number1
     * @return \Illuminate\Http\Response number2
     * @return \Illuminate\Http\Response message
     */
    Route::post('addModelItemOem', [MachinePartDetailsController::class, 'store']);

    Route::post('addLabelToOem', [MachinePartDetailsController::class, 'addLabelToOem']);

    //filters
    /*
     * get ItemModelOem
     * @param \Illuminate\Http\Response model_id
     * @param \Illuminate\Http\Response make_id
     * @param \Illuminate\Http\Response item_id
     * @param \Illuminate\Http\Response machine_id
     * @param \Illuminate\Http\Response primary
     *@param \Illuminate\Http\Response company_id
     *@param \Illuminate\Http\Response company_primary
     *@return \Illuminate\Http\Response data

     */
    Route::get('getModelItemOem', [MachinePartDetailsController::class, 'index']);
    /**
     * getting itemparts details
     * @param  \Illuminate\Http\Request  id
     * @return \Illuminate\Http\Response itemparts details
     */
    Route::get('getModelItemOemdetails', [MachinePartDetailsController::class, 'getModelItemOemdetails']);
    /**
     * getting oem approved sets list
     * @return \Illuminate\Http\Response oemapprovedsets
     */
    Route::get('getsetsOemApproved', [MachinePartDetailsController::class, 'getsetsOemApproved']);
    /**
     * edit machine part details oem approved sets list
     * @return \Illuminate\Http\Response id
     */
    Route::get('editMachinePartDetails', [MachinePartDetailsController::class, 'edit']);
    /**
     * Edit Model Item OEM
     * @param  int id
     * @return \Illuminate\Http\Response data
     */
    Route::get('editModelItemOem', [MachinePartDetailsController::class, 'edit']);

    Route::post('updateModelItemOem', [MachinePartDetailsController::class, 'update']);

    Route::delete('deleteModelItemOem', [MachinePartDetailsController::class, 'destroy']);
    //deleteModelItemOem
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response data
     */
    Route::get('kitItemDropdown', [MachinePartDetailsController::class, 'kitItemDropdown']);

    Route::get('getItemOemDropDown', [MachinePartDetailsController::class, 'getItemOemDropDown']);
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response data
     */
    Route::get('getOemProcessedParts', [MachinePartDetailsController::class, 'getOemProcessedParts']);
    /**
     * Display a Dropdown of the items.
     *
     * @return \Illuminate\Http\Response data
     */
    Route::get('getItemPartsDropdowm', [MachinePartDetailsController::class, 'getItemPartsDropdowm']);

    Route::post('storeExcelData', [MachinePartDetailsController::class, 'storeExcelData']);

    /**
     * update Item Prices
     * @param  int id
     * @param  int sale_price
     * @param  int min_price
     * @param  int max_price
     * @return \Illuminate\Http\Response data
     */
    Route::post('updateItemPrices', [MachinePartDetailsController::class, 'updateItemPrices']);

    // --------------------Kit Routes --------------------

    /**
     * adding Kit data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response item_id
     * @return \Illuminate\Http\Response quantity
     */

    Route::post('addKit', [KitController::class, 'store']);

    /**
     * Display a listing of the kits.
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @return \Illuminate\Http\Response
     */
    Route::get('getKits', [KitController::class, 'index']);

    Route::get('getkitsDropdown', [KitController::class, 'getkitsDropdown']);
    Route::get('getkitsExistingQtyDropdown', [KitController::class, 'getkitsExistingQtyDropdown']);
    Route::get('availableKits', [KitController::class, 'availableKits']);
    /**
     * Edit kits.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */

    Route::get('editKit', [KitController::class, 'edit']);
    /**
     * Update Kit data
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response rows
     * @return \Illuminate\Http\Response kitchild_id
     * @return \Illuminate\Http\Response item_id
     * @return \Illuminate\Http\Response quantity
     */
    Route::post('updateKit', [KitController::class, 'update']);

    /**
     * Display a kits.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('viewKits', [KitController::class, 'show']);

    /**
     * Delete a kits.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deletKits', [KitController::class, 'destroy']);

    // --------------------Item Inventory Routes --------------------

    //  --------------Listing of Item Inventory---------------

    Route::get('getItemsInventory', [ItemInventoryController::class, 'index']);

    Route::get('getItemsInventoryHistory', [ItemInventoryController::class, 'getItemsInventoryHistory']);
    //filters
    /**
     * get Iteminventory
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param \Illuminate\Http\Response item_id
     * @param \Illuminate\Http\Response store_id
     * @param \Illuminate\Http\Response inventory_type_id
     * @param \Illuminate\Http\Response store_id
     * @param \Illuminate\Http\Response purchase_order_id
     * @return \Illuminate\Http\Response invoice_id
     */
    Route::get('getItemsInventoryLedger', [ItemInventoryController::class, 'getItemsInventoryLedger']);
    /**
     * get Iteminventory
     * @param \Illuminate\Http\Response item_id
     * @param \Illuminate\Http\Response store_id
     * @param \Illuminate\Http\Response inventory_type_id
     * @param \Illuminate\Http\Response store_id
     * @param \Illuminate\Http\Response purchase_order_id
     * @return \Illuminate\Http\Response invoice_id
     */
    Route::get('getItemsInventoryLedgerHistory', [ItemInventoryController::class, 'getItemsInventoryLedgerHistory']);

    Route::get('getAdjustItemId', [ItemInventoryController::class, 'getAdjustItemId']);

    // --------------------Kit-Inventory Routes --------------------

    /**
     * Kit Making
     * adding Kit Inventory data
     * @param \Illuminate\Http\Response kit_id
     * @param \Illuminate\Http\Response in_flow mean quantity in make kit
     * @return \Illuminate\Http\Response out_flow mean quantity in break kit
     * @return \Illuminate\Http\Response
     */

    Route::post('makeKit', [KitInventoryController::class, 'store']);
    /**
     * Kit breaking
     * adding Kit Inventory data
     * @param \Illuminate\Http\Response kit_id
     * @param \Illuminate\Http\Response in_flow mean quantity in make kit
     * @return \Illuminate\Http\Response out_flow mean quantity in break kit
     * @return \Illuminate\Http\Response
     */
    Route::post('breakKit', [KitInventoryController::class, 'breakKit']);
    /**
     * Kit Making
     * Listing of Kit Inventory data
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @return \Illuminate\Http\Response KitInventory
     */
    Route::get('getKitInventory', [KitInventoryController::class, 'index']);

    //-----------------------Store API Start ---------------------
    /**
     * Dropdown of store type.
     * @return \Illuminate\Http\Response
     */
    Route::get('getStoreTypeDropDown', [StoreController::class, 'getStoreTypeDropDown']);

    /**
     * adding Stores data
     * @param \Illuminate\Http\Response tpye_id
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response address
     * @return \Illuminate\Http\Response
     */

    Route::post('addStore', [StoreController::class, 'store']);

    /**
     * Display a listing of the stores.
     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @return \Illuminate\Http\Response
     */
    Route::get('getStores', [StoreController::class, 'index']);
    /**
     * Delete a Store.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteStore', [StoreController::class, 'destroy']);
    /**
     * Edit Suppplier.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */

    //--------------Purchase Order API start------------------------

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  po_no
     * @param  \Illuminate\Http\Request  supplier_id
     * @param  \Illuminate\Http\Request  store_id
     * @param  \Illuminate\Http\Request  status
     * @param  \Illuminate\Http\Request  is_received
     * @param  \Illuminate\Http\Request  request_date
     * @param  \Illuminate\Http\Request  total
     * @param  \Illuminate\Http\Request  tax
     * @param  \Illuminate\Http\Request  total_after_text
     * @param  \Illuminate\Http\Request  tax_in_figure
     * @param  \Illuminate\Http\Request  discount
     * @param  \Illuminate\Http\Request  total_after_discount
     * @param  \Illuminate\Http\Request  remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  item_id
     * @param  \Illuminate\Http\Request  quantity
     * @param  \Illuminate\Http\Request  received_quantity
     * @param  \Illuminate\Http\Request  purchase_price
     * @param  \Illuminate\Http\Request  sale_price
     * @param  \Illuminate\Http\Request  amount
     * @param  \Illuminate\Http\Request  remarks
     * @return \Illuminate\Http\Response
     */
    Route::post('addPurchaseOrder', [PurchaseOrderController::class, 'store']);

    Route::post('directPurchaseOrder', [PurchaseOrderController::class, 'directPurchaseOrder']);
    /**
     * Show the form for editing  Purchase Oder Expense.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    Route::get('editPurcaseOrderExpense', [PurchaseOrderController::class, 'editPurcaseOrderExpense']);

    Route::post('updatePurcaseOrderExpense', [PurchaseOrderController::class, 'updatePurcaseOrderExpense']);
    /**
     * Show the form for editing direct Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    Route::get('editDirectPurchaseOrder', [PurchaseOrderController::class, 'editDirectPurchaseOrder']);
    /*
     * get latest po number.
     * @return \Illuminate\Http\Response
     */

    Route::get('getLatestpono', [PurchaseOrderController::class, 'getLatestpono']);
    /*
     * get purchase orders list.
    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param  \Illuminate\Http\Request  supplier_id
     * @param  \Illuminate\Http\Request  po_no
     * @param  \Illuminate\Http\Request  store_id
     * @return \Illuminate\Http\Response purchaseorderlist
     */

    Route::get('getPolist', [PurchaseOrderController::class, 'getPolist']);
    /*
     * get return purchase orders list.
    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param  \Illuminate\Http\Request  supplier_id
     * @param  \Illuminate\Http\Request  po_no

     * @return \Illuminate\Http\Response purchaseorderlist
     */
    Route::get('getReturnedPoByID', [ReturnedPurchaseOrderController::class, 'getReturnedPoByID']);

    Route::delete('deletereturnedpo', [ReturnedPurchaseOrderController::class, 'destroy']);

    Route::get('getReturnedPolist', [ReturnedPurchaseOrderController::class, 'getReturnedPolist']);
    /*

     * get purchase orders list.
    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param  \Illuminate\Http\Request  po_type
     * @param  \Illuminate\Http\Request  item_id
     * @param  \Illuminate\Http\Request  supplier_id
     * @return \Illuminate\Http\Response purchaseorderlist
     */
    Route::get('getPurchaseReport', [PurchaseOrderController::class, 'getPurchaseReport']);

    /**
     * getting po details
     * @param  \Illuminate\Http\Request  po_id
     * @return \Illuminate\Http\Response po details
     */
    Route::get('getPoDetails', [PurchaseOrderController::class, 'getPoDetails']);

    Route::get('getPoNoDropdown', [PurchaseOrderController::class, 'getPoNoDropdown']);
    /**
     * getting return po details
     * @param  \Illuminate\Http\Request return po_id
     * @return \Illuminate\Http\Response po details
     */
    Route::get('getReturnedPoDetails', [ReturnedPurchaseOrderController::class, 'getReturnedPoDetails']);

    Route::get('getReturnPos', [ReturnedPurchaseOrderController::class, 'getReturnPos']);

    /**
     * Show the form for editing the Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    Route::get('editPurchaseOrder', [PurchaseOrderController::class, 'edit']);
    /**
     * Purchase Oder children.
     *

     * @return \Illuminate\Http\Response po child
     */
    Route::get('getPoChild', [PurchaseOrderController::class, 'getPoChild']);
    /**
     *  Purchase Oder Complete Details.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    Route::get('ViewPurchaseOrderDetails', [PurchaseOrderController::class, 'ViewPurchaseOrderDetails']);

    Route::post('updatePurchaseOrder', [PurchaseOrderController::class, 'update']);

    /**
     * Delete the Purchase Oder.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deletePurchaseOrder', [PurchaseOrderController::class, 'destroy']);

    /**
     * average of item price.
     *
     * @param  int  machine_part_id
     * @param  int  item_part_id
     * @param  int  sub_category_id
     * @param  int  category_id
     * @return \Illuminate\Http\Response average of item price
     */
    Route::get('AverageOfItemPrice', [PurchaseOrderController::class, 'AverageOfItemPrice']);

    Route::get('AverageOfItemPriceHistory', [PurchaseOrderController::class, 'AverageOfItemPriceHistory']);

    /**
     * receiving purchase order
     *
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $received_quantity
     * @param  \Illuminate\Http\Request  $purchase_priceret
     * @param  \Illuminate\Http\Request  $sale_price
     * @param  \Illuminate\Http\Request  $amount
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    Route::post('receivePurchaseOrder', [PurchaseOrderController::class, 'receivePurchaseOrder']);

    /**
     * completing purchase order
     *
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $id
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $received_quantity
     * @param  \Illuminate\Http\Request  $purchase_priceret
     * @param  \Illuminate\Http\Request  $sale_price
     * @param  \Illuminate\Http\Request  $amount
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    Route::post('receivePurchaseOrderComplete', [PurchaseOrderController::class, 'receivePurchaseOrderComplete']);

    Route::post('initiatePendingpo', [PurchaseOrderController::class, 'initiatePendingpo']);

    //--------------------------------------------return purchase order routes-----------------------------------------

    /**
     * returning purchase order
     *
     * @param  \Illuminate\Http\Request  $purchase_order_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $deduction
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $returned_quantity
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    Route::post('returnPurchaseOrder', [ReturnedPurchaseOrderController::class, 'store']);
    //--------------------------------------------return purchase order routes-----------------------------------------

    /**
     * returning direct purchase order
     *
     * @param  \Illuminate\Http\Request  $purchase_order_id
     * @param  \Illuminate\Http\Request  $total
     * @param  \Illuminate\Http\Request  $store_id
     * @param  \Illuminate\Http\Request  $deduction
     * @param  \Illuminate\Http\Request  $discount
     * @param  \Illuminate\Http\Request  $tax
     * @param  \Illuminate\Http\Request  $tax_in_figure
     * @param  \Illuminate\Http\Request  $total_after_discount
     * @param  \Illuminate\Http\Request  $remarks
     * -------------------childArray
     * @param  \Illuminate\Http\Request  $item_id
     * @param  \Illuminate\Http\Request  $returned_quantity
     * @param  \Illuminate\Http\Request  $remarks
     * @return \Illuminate\Http\Response
     */
    // Route::post('returnDirectPurchaseOrder', [ReturnedPurchaseOrderController::class, 'returnDirectPurchaseOrder']);
    //--------------------------------------------return salesroutes-----------------------------------------

    /**
     * returning sale order
     *
     *@param \Illuminate\Http\Request customer_id
     *@param \Illuminate\Http\Request walk_in_customer_name
     *@param \Illuminate\Http\Request remarks
     *@param \Illuminate\Http\Request total_amount
     *@param \Illuminate\Http\Request deduction
     *@param \Illuminate\Http\Request total_after_discount
     *@param \Illuminate\Http\Request amount_paid
     *@param \Illuminate\Http\Request return_date
     *@param \Illuminate\Http\Request list
     *@param \Illuminate\Http\Request item_id
     *@param \Illuminate\Http\Request qty
     *@param \Illuminate\Http\Request price
     *@return\Illuminate\Http\Response
     */
    Route::post('returnSale', [ReturnedSaleController::class, 'store']);
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request colName
     * @param \Illuminate\Http\Request sort
     * @param \Illuminate\Http\Request records
     * @param \Illuminate\Http\Request pageNo
     * @return \Illuminate\Http\Response
     */

    Route::get('getReturnedSales', [ReturnedSaleController::class, 'index']);

    Route::get('getReturnedSalesByid', [ReturnedSaleController::class, 'show']);

    Route::get('getReturnSaleInvoices', [ReturnedSaleController::class, 'getReturnSaleInvoices']);
    /**
     * Delete voucher
     *
     * @param \Illuminate\Http\Request voucher_id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deletereturnedsale', [ReturnedSaleController::class, 'delete']);
    //--------------------------------------------store routes-----------------------------------------

    Route::get('editStore', [StoreController::class, 'edit']);
    /**
     * Update Store data
     *@param \Illuminate\Http\Response tpye_id
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response address
     * @return \Illuminate\Http\Response
     */
    Route::post('updateStore', [StoreController::class, 'update']);
    /*
     * Dropdown of store type.
     * @return \Illuminate\Http\Response
     */

    Route::get('getStoredropdown', [StoreController::class, 'getStoredropdown']);

    Route::get('storeDropdown', [StoreController::class, 'getStore']);

    //Status
    Route::post('changeStoreStatus', [StoreController::class, 'changeStoreStatus']);

    //----------------------------------------------Vouchers Routes---------------------------
    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request type
     * @return \Illuminate\Http\Response
     */
    Route::get('getVouchers', [VoucherController::class, 'index']);

    /**
     * Display a listing of the resource.
     *
     * @param \Illuminate\Http\Request colName
     * @param \Illuminate\Http\Request sort
     * @param \Illuminate\Http\Request records
     * @param \Illuminate\Http\Request pageNo
     * @return \Illuminate\Http\Response
     */
    Route::get('getVouchers2', [VoucherController::class, 'index2']);

    /**
     * Store a newly created voucher in storage.
     *
     * @param \Illuminate\Http\Request type
     * @param \Illuminate\Http\Request voucher_no
     * @param \Illuminate\Http\Request date
     * @param \Illuminate\Http\Request total_amount
     * @param \Illuminate\Http\Request cheque_no
     * @param \Illuminate\Http\Request list
     * @param \Illuminate\Http\Request debit_account_id
     * @param \Illuminate\Http\Request credit_account_id
     * @param \Illuminate\Http\Request amount
     * @param \Illuminate\Http\Request description
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('addVoucher', [VoucherController::class, 'store']);

    //------------------------------------------------------------------------------
    /**
     * Store a newly created voucher in storage.
     *
     * @param \Illuminate\Http\Request type
     * @param \Illuminate\Http\Request voucher_no
     * @param \Illuminate\Http\Request date
     * @param \Illuminate\Http\Request total_amount
     * @param \Illuminate\Http\Request cheque_no
     * @param \Illuminate\Http\Request file_id(optional)
     * @param \Illuminate\Http\Request stage_id(optional)
     * @param \Illuminate\Http\Request transaction_array
     * @param \Illuminate\Http\Request debit_account_id
     * @param \Illuminate\Http\Request credit_account_id
     * @param \Illuminate\Http\Request amount
     * @param \Illuminate\Http\Request description
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('storeExtendedJv', [VoucherController::class, 'storeExtendedJv']);

    /**
     * Displaying voucher details
     *
     * @param \Illuminate\Http\Request voucher_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getVoucherDetails', [VoucherController::class, 'getVoucherDetails']);

    /**
     * Approve or unapprove voucher
     *
     * @param \Illuminate\Http\Request voucher_id
     * @return \Illuminate\Http\Response
     */
    Route::get('approveOrUnapproveVoucher', [VoucherController::class, 'approveOrUnapproveVoucher']);

    /**
     * Delete voucher
     *
     * @param \Illuminate\Http\Request voucher_id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteVoucher', [VoucherController::class, 'delete']);

    /**
     * Edit voucher
     *
     * @param \Illuminate\Http\Request voucher_id
     * @return \Illuminate\Http\Response
     */
    Route::get('editVoucher', [VoucherController::class, 'edit']);

    /**
     * updating voucher
     *
     * @param \Illuminate\Http\Request voucher_id
     * @param \Illuminate\Http\Request type
     * @param \Illuminate\Http\Request type
     * @param \Illuminate\Http\Request voucher_no
     * @param \Illuminate\Http\Request date
     * @param \Illuminate\Http\Request total_amount
     * @param \Illuminate\Http\Request cheque_no
     * @param \Illuminate\Http\Request list
     * @param \Illuminate\Http\Request debit_account_id
     * @param \Illuminate\Http\Request credit_account_id
     * @param \Illuminate\Http\Request amount
     * @param \Illuminate\Http\Request description
     * @return \Illuminate\Http\Response message
     * @return \Illuminate\Http\Response status
     */
    Route::post('updateVoucher', [VoucherController::class, 'update']);

    /**
     * Getting land transactions
     *
     * @param \Illuminate\Http\Request land_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getLandTransactions', [VoucherController::class, 'getLandTransactions']);
    /**
     * Getting land Payment Schedule
     *
     * @param \Illuminate\Http\Request date
     * @return \Illuminate\Http\Response
     */
    Route::get('getPayableSchedule', [VoucherController::class, 'getPaymentSchedule']);
    /**
     * Getting plot Receivable Schedule
     *
     * @param \Illuminate\Http\Request date
     * @return \Illuminate\Http\Response
     */
    Route::get('getReceivableSchedule', [VoucherController::class, 'getReceivableSchedule']);

    /**
     * Clearing or rejecting post dated vouchers
     *
     * @param \Illuminate\Http\Request voucher_id
     * @param \Illuminate\Http\Request is_post_dated
     * @return \Illuminate\Http\Response
     */
    Route::post('clearPostDatedVoucher', [VoucherController::class, 'clearPostDatedVoucher']);

    Route::delete('deleteSubGroupAccounts', [VoucherController::class, 'deleteSubGroupAccounts']);
    //--------------------------------------------Edited Vouchers Routes--------------------------
    // --------------------Supplier Routes --------------------

    /**
     *
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response company
     * @param \Illuminate\Http\Response type
     * @param \Illuminate\Http\Response gst
     * @param \Illuminate\Http\Response ntn
     * @param \Illuminate\Http\Response phone_no
     * @param \Illuminate\Http\Response email
     * @param \Illuminate\Http\Response cnic
     * @param \Illuminate\Http\Response address

     */

    Route::post('addSupplier', [SupplierController::class, 'store']);
    /*
     * Dropdown of suppliers.
     * @return \Illuminate\Http\Response
     */

    Route::get('getSupplierdropdown', [SupplierController::class, 'getSupplierdropdown']);

    /**
     * Edit Suppplier.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */

    Route::get('editSupplier', [SupplierController::class, 'edit']);
    /**
     * Update Supplier data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response company
     * @param \Illuminate\Http\Response type
     * @param \Illuminate\Http\Response gst
     * @param \Illuminate\Http\Response ntn
     * @param \Illuminate\Http\Response phone_no
     * @param \Illuminate\Http\Response email
     * @param \Illuminate\Http\Response cnic
     * @param \Illuminate\Http\Response address
     */
    Route::post('updateSupplier', [SupplierController::class, 'update']);
    /**
     * Delete a Supplier.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteSupplier', [SupplierController::class, 'destroy']);
    /*
     * suppliers listing.

    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo

     */
    Route::get('getSupplierslist', [SupplierController::class, 'getSupplierslist']);
    //-----------------------------------------------Category routes--------------------------------------
    /**
     * getting Categories list
     * @return \Illuminate\Http\Response Categories
     */
    Route::get('getCategories', [categoryController::class, 'index']);

    /**
     * getting Categories list
     * @return \Illuminate\Http\Response Categories
     */
    Route::get('getCategoriesDropDown', [categoryController::class, 'getCategoriesDropDown']);
    /**
     * adding Category
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addCategory', [categoryController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editCategory', [categoryController::class, 'edit']);

    /**
     * updating catgory
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateCategory', [categoryController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteCategory', [categoryController::class, 'destroy']);

    //-----------------------------------------------Rack routes--------------------------------------
    /**
     * getting Categories list
     * @return \Illuminate\Http\Response Categories
     */
    Route::get('getRacks', [RackController::class, 'index']);

    /**
     * getting Categories list
     * @return \Illuminate\Http\Response Categories
     */
    Route::get('getRackDropDown', [RackController::class, 'getRackDropDown']);
    /**
     * adding Category
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('addRack', [RackController::class, 'store']);

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('editRack', [RackController::class, 'edit']);

    /**
     * updating catgory
     * @param \Illuminate\Http\Response id
     * @param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::post('updateRack', [RackController::class, 'update']);

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  id
     * @return \Illuminate\Http\Response status
     * @return \Illuminate\Http\Response message
     */
    Route::delete('deleteRack', [RackController::class, 'destroy']);

    //-----------------------------------------------Shelves routes--------------------------------------
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response category_id
     * @return \Illuminate\Http\Response
     */
    Route::post('addShelves', [ShelvesController::class, 'store']);
    /**
     * Subcategories listing.

     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     */
    Route::get('getShelves', [ShelvesController::class, 'index']);
    /**
     * Edit subcategories
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editShelves', [ShelvesController::class, 'edit']);
    /**
     * Update machinepartsmodels data
     *  *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response category_id

     */
    Route::post('updateShelves', [ShelvesController::class, 'update']);
    /**
     * Delete subcategory.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteShelves', [ShelvesController::class, 'destroy']);
    /**
     * getting subCategories list
     * @return \Illuminate\Http\Response subCategories
     */
    Route::get('getShelvesDropdown', [ShelvesController::class, 'getShelvesDropdown']);

    // --------------------Customer Routes --------------------

    /**
     *
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response company
     * @param \Illuminate\Http\Response type
     * @param \Illuminate\Http\Response gst
     * @param \Illuminate\Http\Response ntn
     * @param \Illuminate\Http\Response phone_no
     * @param \Illuminate\Http\Response email
     * @param \Illuminate\Http\Response cnic
     * @param \Illuminate\Http\Response address

     */

    Route::post('addCustomer', [CustomerController::class, 'store']);

    /*
     * Customers listing.

    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo

     */
    Route::get('getCustomers', [CustomerController::class, 'index']);

    /*
     * Dropdown of Customers.
     * @return \Illuminate\Http\Response
     */

    Route::get('getCustomersDropdown', [CustomerController::class, 'getcustomerdropdown']);

    /**
     * Edit Suppplier.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */

    Route::get('editCustomer', [CustomerController::class, 'edit']);
    /**
     * Update Customer data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response company
     * @param \Illuminate\Http\Response type
     * @param \Illuminate\Http\Response gst
     * @param \Illuminate\Http\Response ntn
     * @param \Illuminate\Http\Response phone_no
     * @param \Illuminate\Http\Response email
     * @param \Illuminate\Http\Response cnic
     * @param \Illuminate\Http\Response address
     */
    Route::post('updateCustomer', [CustomerController::class, 'update']);
    /**
     * Delete a Customer.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteCustomer', [CustomerController::class, 'destroy']);

    //-----------------------------------------------application routes--------------------------------------
    /**
     * getting applications list
     * @return \Illuminate\Http\Response applications
     */
    Route::get('getApplicationsDropDown', [ApplicationController::class, 'getApplicationsDropDown']);
    /*
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     * @return \Illuminate\Http\Response
     */
    Route::post('addApplication', [ApplicationController::class, 'store']);
    /**
     * Applications listing.

     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo

     */
    Route::get('getApplications', [ApplicationController::class, 'index']);
    /**
     * Edit Application.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editApplication', [ApplicationController::class, 'edit']);
    /**
     * Update Application
     * @param \Illuminate\Http\Response name

     */
    Route::post('updateApplication', [ApplicationController::class, 'update']);
    /**
     * Delete  Application.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteApplication', [ApplicationController::class, 'destroy']);

    //-----------------------------------------------machineparttype routes--------------------------------------
    /**
     * getting machineparttypes list
     * @return \Illuminate\Http\Response MachinePartType
     */
    Route::get('getMachineparttypesDropDown', [MachinePartTypeController::class, 'getMachineparttypesDropDown']);
    //-----------------------------------------------subcategory routes--------------------------------------
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response category_id
     * @return \Illuminate\Http\Response
     */
    Route::post('addSubCategories', [SubCategoryController::class, 'store']);
    /**
     * Subcategories listing.

     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     */
    Route::get('getSubCategories', [SubCategoryController::class, 'index']);
    /**
     * Edit subcategories
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editSubCategories', [SubCategoryController::class, 'edit']);
    /**
     * Update machinepartsmodels data
     *  *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response category_id

     */
    Route::post('updateSubCategories', [SubCategoryController::class, 'update']);
    /**
     * Delete subcategory.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteSubCategories', [SubCategoryController::class, 'destroy']);
    /**
     * getting subCategories list
     * @return \Illuminate\Http\Response subCategories
     */
    Route::get('getsubCategoriesDropDown', [SubCategoryController::class, 'getsubCategoriesDropDown']);
    //-----------------------------------------------Uom routes--------------------------------------
    /**
     * getting Uom list
     * @return \Illuminate\Http\Response Uom
     */
    Route::get('getUOmDropdown', [UomController::class, 'getUOmDropdown']);

    // --------------------Stock Transfer Routes --------------------

    /**
     *
     * @param \Illuminate\Http\Response transfer_from
     * @param \Illuminate\Http\Response transfer_to
     * @param \Illuminate\Http\Response date
     * @param \Illuminate\Http\Response rows
     * @param \Illuminate\Http\Response item_id
     * @param \Illuminate\Http\Response qty_transferredty
     * @return \Illuminate\Http\Response
     */
    Route::post('addNewTransfer', [stockTransferController::class, 'store']);

    Route::get('getNewTransfer', [stockTransferController::class, 'index']);

    Route::get('getTransfersReport', [stockTransferController::class, 'getTransfersReport']);

    /**
     * getting stock transfer details
     * @param  \Illuminate\Http\Request  id
     * @return \Illuminate\Http\Response Stock Transfer  details
     */
    Route::get('getStockTransferDetails', [stockTransferController::class, 'getStockTransferDetails']);

    // --------------------Invoice Routes --------------------

    /**
     * Store a Invoice or addNewsale.
     *@param \Illuminate\Http\Request customer_id
     *@param \Illuminate\Http\Request walk_in_customer_name
     *@param \Illuminate\Http\Request remarks
     *@param \Illuminate\Http\Request total_amount
     *@param \Illuminate\Http\Request discount
     *@param \Illuminate\Http\Request total_after_discount
     *@param \Illuminate\Http\Request amount_received
     *@param \Illuminate\Http\Request date
     *@param \Illuminate\Http\Request list
     *@param \Illuminate\Http\Request item_id
     *@param \Illuminate\Http\Request qty
     *@param \Illuminate\Http\Request price
     *@return\Illuminate\Http\Response
     */

    Route::post('addNewSale', [InvoiceController::class, 'store']);

    Route::post('initiatePendingInvoices', [InvoiceController::class, 'initiatePendingInvoices']);

    Route::post('initiateNegativeInventoryPendingInvoices', [InvoiceController::class, 'initiateNegativeInventoryPendingInvoices']);
    /**
     * Display the specified resource.
     *
     * @param  int  walk_in_customer_name
     * @param  int  store_id
     * @param  int  item_id
     * @return \Illuminate\Http\Response
     */
    Route::get('testing', [InvoiceController::class, 'testing']);

    Route::get('getSales', [InvoiceController::class, 'index']);

    Route::get('getSalesDetails', [InvoiceController::class, 'getSalesDetails']);

    /*
     * get sales list.
    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param  \Illuminate\Http\Request  sale_type
     * @param  \Illuminate\Http\Request  walk_in_customer_name
     * @param  \Illuminate\Http\Request  customer_id
     * @param  \Illuminate\Http\Request  item_id
     * @return \Illuminate\Http\Response sales list
     */

    Route::get('getSalesReport', [InvoiceController::class, 'getSalesReport']);
    /*
     * get sales list.
    @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo
     * @param  \Illuminate\Http\Request  sale_type
     * @param  \Illuminate\Http\Request  walk_in_customer_name
     * @param  \Illuminate\Http\Request  customer_id
     * @param  \Illuminate\Http\Request  item_id
     * @return \Illuminate\Http\Response sales list
     */

    Route::get('getSalesReportBySaleType', [InvoiceController::class, 'getSalesReportBySaleType']);
    /*
     * get brand wise sales list.

     * @param  \Illuminate\Http\Request  sale_type
     * @param  \Illuminate\Http\Request  walk_in_customer_name
     * @param  \Illuminate\Http\Request  customer_id
     * @param  \Illuminate\Http\Request  store_id
     * @param  \Illuminate\Http\Request  from
     * @param  \Illuminate\Http\Request  to
     * @param  \Illuminate\Http\Request  brand_id
     * @return \Illuminate\Http\Response sales list
     */
    Route::get('getSalesReportBrandwise', [InvoiceController::class, 'getSalesReportBrandwise']);

    Route::get('getSalesReportBrandwiseCount', [InvoiceController::class, 'getSalesReportBrandwiseCount']);
    /*
     * get customer wise sales list.

     * @param  \Illuminate\Http\Request  sale_type
     * @param  \Illuminate\Http\Request  walk_in_customer_name
     * @param  \Illuminate\Http\Request  customer_id
     * @param  \Illuminate\Http\Request  store_id
     * @param  \Illuminate\Http\Request  from
     * @param  \Illuminate\Http\Request  to
     * @param  \Illuminate\Http\Request  brand_id
     * @return \Illuminate\Http\Response sales list
     */
    Route::get('getSalesReportCustomerWise', [InvoiceController::class, 'getSalesReportCustomerWise']);
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    Route::get('getInvoiceByid', [InvoiceController::class, 'show']);

    Route::get('editSale', [InvoiceController::class, 'edit']);

    Route::get('getDetailsForReturnSale', [InvoiceController::class, 'getDetailsForReturnSale']);
    /**
     * Delete a sale.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteSale', [InvoiceController::class, 'destroy']);
    Route::post('updateSale', [InvoiceController::class, 'update']);
    /**
     * Display Sale history
     *
     * @param  int  $itemid
     * @param  int  $customerid
     * @return \Illuminate\Http\Response
     */
    Route::get('getItemSaleHistory', [InvoiceController::class, 'getItemSaleHistory']);
    Route::get('getSalesFiltersApis', [InvoiceController::class, 'getSalesFiltersApis']);

    // --------------------dimensions Routes --------------------
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response description
     * @return \Illuminate\Http\Response
     */
    Route::post('addDimension', [DimensionController::class, 'store']);
    /**
     * Dimensions listing.

     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo

     */
    Route::get('getDimensions', [DimensionController::class, 'index']);
    /**
     * Edit dimension.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editDimension', [DimensionController::class, 'edit']);
    /**
     * Update dimensions data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response description
     */
    Route::post('updateDimension', [DimensionController::class, 'update']);
    /**
     * Delete a dimension.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteDimension', [DimensionController::class, 'destroy']);
    /**
     * Dimensions dropdown.

     *@return \Illuminate\Http\Response Dimensions

     */
    Route::get('getDimensionsDropdown', [DimensionController::class, 'getDimensionsDropdown']);

    // --------------------origin Routes --------------------
    /**
     * getting origins list
     * @return \Illuminate\Http\Response origin
     */
    Route::get('getOriginsDropdown', [OriginController::class, 'getOriginsDropdown']);

    Route::post('addOrigin', [OriginController::class, 'store']);

    /**
     * get item parts oem quantity
     * @param \Illuminate\Http\Response id
     *  * @param \Illuminate\Http\Response store_id
     * @return \Illuminate\Http\Response
     */
    Route::get('getItemPartsOemQty', [MachinePartDetailsController::class, 'getItemPartsOemQty']);

    // --------------------machine parts models Routes --------------------
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response machine_part_id
     *@param \Illuminate\Http\Response description
     * @return \Illuminate\Http\Response
     */
    Route::post('addMachinePartModel', [MachinePartsModelsController::class, 'store']);
    /**
     * machine part models listing.

     * @param \Illuminate\Http\Response colName
     * @param \Illuminate\Http\Response sort
     * @param \Illuminate\Http\Response records
     * @param \Illuminate\Http\Response pageNo

     */
    Route::get('getMachinePartModels', [MachinePartsModelsController::class, 'index']);
    /**
     * Edit machinepartmodels.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editmachinepartmodels', [MachinePartsModelsController::class, 'edit']);
    /**
     * Update machinepartsmodels data
     *  *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response machine_part_id
     *@param \Illuminate\Http\Response description
     */
    Route::post('updateMachinePartModels', [MachinePartsModelsController::class, 'update']);
    /**
     * Delete a machine part model.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteMachinePartModel', [MachinePartsModelsController::class, 'destroy']);

    Route::get('getMachinePartsModelsDropDown', [MachinePartsModelsController::class, 'getMachinePartsModelsDropDown']);

    // --------------------Expense Routes --------------------
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name
     *@param \Illuminate\Http\Response description
     *@param \Illuminate\Http\Response expense_type_id
     *@return \Illuminate\Http\Response
     */
    Route::post('addexpense', [ExpenseController::class, 'store']);

    // --------------------Expense type Routes --------------------

    /*
     * Expense types.
     * @return \Illuminate\Http\Response
     */

    Route::get('getExpenseTypes', [ExpenseController::class, 'getExpenseTypes']);

    Route::get('getExpenseTypesDropDown', [ExpenseController::class, 'getExpenseTypesDropDown']);
    /**
     * Store a newly created resource in storage.
     *@param \Illuminate\Http\Response name

     * @return \Illuminate\Http\Response
     */
    Route::post('addExpenseType', [ExpenseTypeController::class, 'store']);

    /**
     * Edit Expense type.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::get('editExpenseType', [ExpenseTypeController::class, 'edit']);
    /**
     * Update expense type  data
     * @param \Illuminate\Http\Response name
     * @param \Illuminate\Http\Response description
     */
    Route::post('updateExpenseType', [ExpenseTypeController::class, 'update']);
    /**
     * Delete a expense type.
     * @param \Illuminate\Http\Response id
     * @return \Illuminate\Http\Response
     */
    Route::delete('deleteExpenseType', [ExpenseTypeController::class, 'destroy']);
    // --------------------dashboard Routes --------------------

    Route::get('getDashboardData', [DashboardController::class, 'index']);

    Route::get('getTrailBalanceForDash', [DashboardController::class, 'getTrailBalanceForDash']);
    /**
     * getting booking report
     *
     * @return \Illuminate\Http\Response
     */
    Route::get('getBookingReport', [BookingController::class, 'getBookingReport']);

    Route::get('editItemInventory', [ItemInventoryController::class, 'edit']);

    // });

    Route::get('getCapitalAccounts', [CoaAccountController::class, 'getCapitalAccounts']);

    Route::get('getInventoryAccounts', [CoaAccountController::class, 'getInventoryAccounts']);

    Route::get('getDisposeAccounts', [CoaAccountController::class, 'getDisposeAccounts']);

    //Adjust Inventory

    Route::get('getAdjustInventory', [AdjustInventoryController::class, 'index']);

    Route::get('viewAdjustInventory', [AdjustInventoryController::class, 'view']);

    Route::post('addAdjustItemStock', [AdjustInventoryController::class, 'store']);

    Route::get('editAdjustItemInventory', [AdjustInventoryController::class, 'edit']);

    Route::post('updateAdjustInventory', [AdjustInventoryController::class, 'update']);

    Route::delete('deleteAdjustItemInventory', [AdjustInventoryController::class, 'destroy']);

    Route::get('getQuotationlist', [QuotationController::class, 'index']);
    Route::post('addQuotation', [QuotationController::class, 'store']);
    Route::get('editQuotation', [QuotationController::class, 'edit']);
    Route::post('updateQuotation', [QuotationController::class, 'update']);
    Route::get('approveOrUnapproveQuotation', [QuotationController::class, 'approveOrUnapproveQuotation']);
    Route::get('getQuotationForIntiaite', [QuotationController::class, 'getQuotationForIntiaite']);
    Route::post('generateInvoiceQuotation', [QuotationController::class, 'generateInvoiceQuotation']);
    Route::delete('deleteQuotation', [QuotationController::class, 'destroy']);
    Route::get('ViewQuotationDetails', [QuotationController::class, 'ViewQuotationDetails']);
    Route::get('getLatestQuotationNo', [QuotationController::class, 'getLatestQuotationNo']);
});
