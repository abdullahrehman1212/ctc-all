import React, { lazy } from 'react';
import {
	componentsMenu,
	dashboardMenu,
	demoPages,
	layoutMenu,
	dashboardHome,
	accountsModule,
	itemsManagementModule,
	// kitModule,
	inventoryModule,
	salesModule,
	transferModule,
	suppliersModule,
	customersModule,
	employeesModule,
	storesModule,
	reportModule,
	expenseModule,
	rolesAdmin,
	
} from '../menu';

const LANDING = {
	DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
	DASHBOARD_BOOKING: lazy(() => import('../pages/dashboard/DashboardBookingPage')),
	SUMMARY: lazy(() => import('../pages/SummaryPage')),
};
// const PACKAGECOMPONENT = {
// 	PACKAGE: lazy(() => import('../pages/allModules/packageManagement/person/index')),
// };

const ADMINROLES = {
	ADDADMIN: lazy(() => import('../pages/allModules/systemUsers/add')),
};

const ADMINPORTALLANDING = {
	// Accounts
	NEWTRANSACTION: lazy(() => import('../pages/allModules/accounts/allVouchersList/index')),
	VIEWTRANSACTIONS: lazy(() => import('../pages/allModules/accounts/viewAccounts/index')),
	DAILYCLOSING: lazy(() => import('../pages/allModules/accounts/dailyClosing/index')),
	INDIVIDUALACCOUNTS: lazy(() => import('../pages/allModules/accounts/individualAccounts/index')),
	ACCOUNTHEADSSUBGROUPS: lazy(() =>
		import('../pages/allModules/accounts/accountsHeadsSubgroups/index'),
	),
	VOUCHERS: lazy(() => import('../pages/allModules/accounts/vouchers/index')),
};
const SINGLE = {
	BOXED: lazy(() => import('../pages/presentation/single-pages/SingleBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/single-pages/SingleFluidPage')),
};
const LIST = {
	BOXED: lazy(() => import('../pages/presentation/demo-pages/ListBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/ListFluidPage')),
};

const GRID = {
	BOXED: lazy(() => import('../pages/presentation/demo-pages/GridBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/GridFluidPage')),
};

const EDIT = {
	MODERN: lazy(() => import('../pages/presentation/demo-pages/EditModernPage')),
	BOXED: lazy(() => import('../pages/presentation/demo-pages/EditBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/EditFluidPage')),
	WIZARD: lazy(() => import('../pages/presentation/demo-pages/EditWizardPage')),
	IN_CANVAS: lazy(() => import('../pages/presentation/demo-pages/EditInCanvasPage')),
	IN_MODAL: lazy(() => import('../pages/presentation/demo-pages/EditInModalPage')),
};
const PRICING = {
	PRICING_TABLE: lazy(() => import('../pages/presentation/pricing/PricingTablePage')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
	LOGIN: lazy(() => import('../pages/presentation/auth/Login')),
	GETTING_STARTED: lazy(() => import('../pages/presentation/auth/GettingStarted')),
	SIGNUP: lazy(() => import('../pages/presentation/auth/Signup')),
	OTP_VERIFICATION: lazy(() => import('../pages/presentation/auth/OtpVerification')),
};
const APP = {
	PROJECT_MANAGEMENT: {
		PROJECTS_LIST: lazy(() =>
			import('../pages/presentation/project-management/ProjectManagementsList'),
		),
		PROJECT: lazy(() =>
			import('../pages/presentation/project-management/ProjectManagementsProject'),
		),
	},
	KNOWLEDGE: {
		GRID: lazy(() => import('../pages/presentation/knowledge/KnowledgeGridPage')),
		VIEW: lazy(() => import('../pages/presentation/knowledge/KnowledgeViewPage')),
	},
	SALES: {
		TRANSACTIONS: lazy(() => import('../pages/presentation/sales/TransActionsPage')),
		PRODUCTS: lazy(() => import('../pages/presentation/sales/SalesListPage')),
		PRODUCTS_GRID: lazy(() => import('../pages/presentation/sales/ProductsGridPage')),
		PRODUCTS_VIEW: lazy(() => import('../pages/presentation/sales/ProductViewPage')),
	},
	APPOINTMENT: {
		CALENDAR: lazy(() => import('../pages/presentation/appointment/CalendarPage')),
		EMPLOYEE_LIST: lazy(() => import('../pages/presentation/appointment/EmployeeList')),
		EMPLOYEE_VIEW: lazy(() => import('../pages/presentation/appointment/EmployeePage')),
		APPOINTMENT_LIST: lazy(() => import('../pages/presentation/appointment/AppointmentList')),
	},
	CRM: {
		CRM_DASHBOARD: lazy(() => import('../pages/presentation/crm/CrmDashboard')),
		CUSTOMERS: lazy(() => import('../pages/presentation/crm/CustomersList')),
		CUSTOMER: lazy(() => import('../pages/presentation/crm/Customer')),
		SALES: lazy(() => import('../pages/presentation/crm/Sales')),
		INVOICE: lazy(() => import('../pages/presentation/crm/Invoice')),
	},
	CHAT: {
		WITH_LIST: lazy(() => import('../pages/presentation/chat/WithListChatPage')),
		ONLY_LIST: lazy(() => import('../pages/presentation/chat/OnlyListChatPage')),
	},
};
const PAGE_LAYOUTS = {
	HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
	HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
	SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
	CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
	BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};

const CONTENT = {
	CONTENTS: lazy(() => import('../pages/documentation/content/ContentListPage')),
	TYPOGRAPHY: lazy(() => import('../pages/documentation/content/TypographyPage')),
	IMAGES: lazy(() => import('../pages/documentation/content/ImagesPage')),
	TABLES: lazy(() => import('../pages/documentation/content/TablesPage')),
	FIGURES: lazy(() => import('../pages/documentation/content/FiguresPage')),
};
const FORMS_PAGE = {
	FORMS: lazy(() => import('../pages/documentation/forms/FormsListPage')),
	FORM_GROUP: lazy(() => import('../pages/documentation/forms/FormGroupPage')),
	FORM_CONTROLS: lazy(() => import('../pages/documentation/forms/FormControlsPage')),
	SELECT: lazy(() => import('../pages/documentation/forms/SelectPage')),
	CHECKS_AND_RADIO: lazy(() => import('../pages/documentation/forms/ChecksAndRadioPage')),
	RANGE: lazy(() => import('../pages/documentation/forms/RangePage')),
	INPUT_GROUP: lazy(() => import('../pages/documentation/forms/InputGroupPage')),
	VALIDATION: lazy(() => import('../pages/documentation/forms/ValidationPage')),
	WIZARD: lazy(() => import('../pages/documentation/forms/WizardPage')),
};
const COMPONENTS_PAGE = {
	COMPONENTS: lazy(() => import('../pages/documentation/components/ComponentsListPage')),
	ACCORDION: lazy(() => import('../pages/documentation/components/AccordionPage')),
	ALERT: lazy(() => import('../pages/documentation/components/AlertPage')),
	BADGE: lazy(() => import('../pages/documentation/components/BadgePage')),
	BREADCRUMB: lazy(() => import('../pages/documentation/components/BreadcrumbPage')),
	BUTTON: lazy(() => import('../pages/documentation/components/ButtonPage')),
	BUTTON_GROUP: lazy(() => import('../pages/documentation/components/ButtonGroupPage')),
	CARD: lazy(() => import('../pages/documentation/components/CardPage')),
	CAROUSEL: lazy(() => import('../pages/documentation/components/CarouselPage')),
	COLLAPSE: lazy(() => import('../pages/documentation/components/CollapsePage')),
	DROPDOWN: lazy(() => import('../pages/documentation/components/DropdownsPage')),
	LIST_GROUP: lazy(() => import('../pages/documentation/components/ListGroupPage')),
	MODAL: lazy(() => import('../pages/documentation/components/ModalPage')),
	NAVS_TABS: lazy(() => import('../pages/documentation/components/NavsTabsPage')),
	OFF_CANVAS: lazy(() => import('../pages/documentation/components/OffCanvasPage')),
	PAGINATION: lazy(() => import('../pages/documentation/components/PaginationPage')),
	POPOVERS: lazy(() => import('../pages/documentation/components/PopoversPage')),
	PROGRESS: lazy(() => import('../pages/documentation/components/ProgressPage')),
	SCROLLSPY: lazy(() => import('../pages/documentation/components/ScrollspyPage')),
	SPINNER: lazy(() => import('../pages/documentation/components/SpinnersPage')),
	TABLE: lazy(() => import('../pages/documentation/components/TablePage')),
	TOASTS: lazy(() => import('../pages/documentation/components/ToastsPage')),
	TOOLTIP: lazy(() => import('../pages/documentation/components/TooltipPage')),
};
const UTILITIES = {
	UTILITIES: lazy(() => import('../pages/documentation/utilities/UtilitiesListPage')),
	API: lazy(() => import('../pages/documentation/utilities/ApiPage')),
	BACKGROUND: lazy(() => import('../pages/documentation/utilities/BackgroundPage')),
	BORDERS: lazy(() => import('../pages/documentation/utilities/BordersPage')),
	COLORS: lazy(() => import('../pages/documentation/utilities/ColorsPage')),
	DISPLAY: lazy(() => import('../pages/documentation/utilities/DisplayPage')),
	FLEX: lazy(() => import('../pages/documentation/utilities/FlexPage')),
	FLOAT: lazy(() => import('../pages/documentation/utilities/FloatPage')),
	INTERACTIONS: lazy(() => import('../pages/documentation/utilities/InteractionsPage')),
	OVERFLOW: lazy(() => import('../pages/documentation/utilities/OverflowPage')),
	POSITION: lazy(() => import('../pages/documentation/utilities/PositionPage')),
	SHADOWS: lazy(() => import('../pages/documentation/utilities/ShadowsPage')),
	SIZING: lazy(() => import('../pages/documentation/utilities/SizingPage')),
	SPACING: lazy(() => import('../pages/documentation/utilities/SpacingPage')),
	TEXT: lazy(() => import('../pages/documentation/utilities/TextPage')),
	VERTICAL_ALIGN: lazy(() => import('../pages/documentation/utilities/VerticalAlignPage')),
	VISIBILITY: lazy(() => import('../pages/documentation/utilities/VisibilityPage')),
};
const ICONS = {
	ICONS_LIST: lazy(() => import('../pages/documentation/icons/IconsListPage')),
	ICON: lazy(() => import('../pages/documentation/icons/IconPage')),
	BOOTSTRAP: lazy(() => import('../pages/documentation/icons/BootstrapIconPage')),
	MATERIAL: lazy(() => import('../pages/documentation/icons/MaterialPage')),
};
const CHARTS_PAGE = {
	CHART_LIST: lazy(() => import('../pages/documentation/charts/ChartsListPage')),
	GENERAL_USAGE: lazy(() => import('../pages/documentation/charts/ChartGeneralUsagePage')),
	SPARKLINE: lazy(() => import('../pages/documentation/charts/ChartSparklinePage')),
	LINE: lazy(() => import('../pages/documentation/charts/ChartLinePage')),
	AREA: lazy(() => import('../pages/documentation/charts/ChartAreaPage')),
	COLUMN: lazy(() => import('../pages/documentation/charts/ChartColumnPage')),
	BAR: lazy(() => import('../pages/documentation/charts/ChartBarPage')),
	MIXED: lazy(() => import('../pages/documentation/charts/ChartMixedPage')),
	TIMELINE: lazy(() => import('../pages/documentation/charts/ChartTimelinePage')),
	CANDLESTICK: lazy(() => import('../pages/documentation/charts/ChartCandlestickPage')),
	BOX_WHISKER: lazy(() => import('../pages/documentation/charts/ChartBoxWhiskerPage')),
	PIE_DONUT: lazy(() => import('../pages/documentation/charts/ChartPieDonutPage')),
	RADAR: lazy(() => import('../pages/documentation/charts/ChartRadarPage')),
	POLAR: lazy(() => import('../pages/documentation/charts/ChartPolarPage')),
	RADIAL_BAR: lazy(() => import('../pages/documentation/charts/ChartRadialBarPage')),
	BUBBLE: lazy(() => import('../pages/documentation/charts/ChartBubblePage')),
	SCATTER: lazy(() => import('../pages/documentation/charts/ChartScatterPage')),
	HEAT_MAP: lazy(() => import('../pages/documentation/charts/ChartHeatMapPage')),
	TREE_MAP: lazy(() => import('../pages/documentation/charts/ChartTreeMapPage')),
};
const EXTRA = {
	NOTIFICATION: lazy(() => import('../pages/documentation/extras/NotificationPage')),
	HOOKS: lazy(() => import('../pages/documentation/extras/HooksPage')),
};
const DASHBOARD = {
	HOME: lazy(() => import('../pages/dashboardHome/dashboardC')),
};
const itemsManagementComponents = {
	ITEMPARTS: lazy(() => import('../pages/allModules/itemsManagementModule/itemParts/index')),
	ITEMPARTS_ITEMS_LIST: lazy(() =>
		import('../pages/allModules/itemsManagementModule/itemParts/itemsList'),
	),
	ITEMPARTS_ATTRIBUTES: lazy(() =>
		import('../pages/allModules/itemsManagementModule/itemParts/attributes'),
	),
	ITEMPARTS_MODELS: lazy(() =>
		import('../pages/allModules/itemsManagementModule/itemParts/models'),
	),
	ITEMS: lazy(() => import('../pages/allModules/itemsManagementModule/items/index')),
	CATEGORY: lazy(() => import('../pages/allModules/itemsManagementModule/category/index')),
	PARTMODELS: lazy(() => import('../pages/allModules/itemsManagementModule/partModel/index')),
	SUBCATEGORY: lazy(() => import('../pages/allModules/itemsManagementModule/subCategory/index')),
	MODELS: lazy(() => import('../pages/allModules/itemsManagementModule/models/index')),
	MACHINES: lazy(() => import('../pages/allModules/itemsManagementModule/machines/index')),
	MAKE: lazy(() => import('../pages/allModules/itemsManagementModule/make/index')),
	COMPANIES: lazy(() => import('../pages/allModules/itemsManagementModule/companies/index')),
	APPLICATIONS: lazy(() =>
		import('../pages/allModules/itemsManagementModule/applications/index'),
	),
	DIMENSIONS: lazy(() => import('../pages/allModules/itemsManagementModule/dimensions/index')),
};
// const KITMANAGEMENTCOMPONENTS = {
// 	DEFINEKIT: lazy(() => import('../pages/allModules/kitManagement/defineKit/index')),
// };
const INVENTORYCOMPONENTS = {
	ADJUSTINVENTORY : lazy(() => import('../pages/allModules/inventory/adjustInventory/index')),
	PARTS: lazy(() => import('../pages/allModules/inventory/parts/index')),
	KITS: lazy(() => import('../pages/allModules/inventory/kits/index')),
	PURCHASEORDER: lazy(() => import('../pages/allModules/inventory/purchaseOrder/index')),
	RACKS: lazy(() => import('../pages/allModules/inventory/Racks/index')),
	SHELVES: lazy(() => import('../pages/allModules/inventory/Shelves/index')),
	RETURNPURCHASEORDER: lazy(() =>
		import('../pages/allModules/inventory/returnPurchaseOrder/index'),
	),
	SIMPLEPURCHASE: lazy(() => import('../pages/allModules/inventory/simplePurchase/index')),
	HISTORY: lazy(() => import('../pages/allModules/inventory/history/index')),
	COST: lazy(() => import('../pages/allModules/inventory/cost/index')),
};

const EMPLOYEESCOMPONENTS = {
	MANAGEEMPLOYEES: lazy(() => import('../pages/allModules/employees/manageEmployees/index')),
	PAYROLLEMPLOYEES: lazy(() => import('../pages/allModules/employees/payrollEmployees/index')),
	FINALSETTLEMENT: lazy(() => import('../pages/allModules/employees/finalSettlement/index')),
	VIEWPAYROLLEMPLOYEES: lazy(() =>
		import('../pages/allModules/employees/payrollEmployees/viewPayrolls/index'),
	),
	ADVANCESALARY: lazy(() => import('../pages/allModules/employees/advanceSalary/index')),
	DEPARTMENTS: lazy(() => import('../pages/allModules/employees/departments/index')),
	DESIGNATIONS: lazy(() => import('../pages/allModules/employees/designations/index')),
};

const REPORTCOMPONENTS = {
	REPORT1: lazy(() => import('../pages/allModules/report/report1/index')),
	REPORT2: lazy(() => import('../pages/allModules/report/report2/index')),
	REPORT3: lazy(() => import('../pages/allModules/report/report3/index')),
	REPORT4: lazy(() => import('../pages/allModules/report/report4/index')),
	REPORT5: lazy(() => import('../pages/allModules/report/report5/index')),
	REPORT6: lazy(() => import('../pages/allModules/report/report6/index')),
	REPORT7: lazy(() => import('../pages/allModules/report/report7/index')),
};

const SALESCOMPONENTS = {
	SALES: lazy(() => import('../pages/allModules/sale/sales/index')),
	QUOTATIONS:lazy(() => import('../pages/allModules/sale/quotation/index')),
	RETURNSALES: lazy(() => import('../pages/allModules/sale/returnS/index')),
	
};

const TRANSFERCOMPONENTS = {
	TRANSFER: lazy(() => import('../pages/allModules/transfer/list/index')),
};

const SUPPLIERCOMPONENTS = {
	MANAGE: lazy(() => import('../pages/allModules/suppliers/manageSupplier/index')),
};
const CUSTOMERCOMPONENTS = {
	MANAGE: lazy(() => import('../pages/allModules/customers/manageCustomers/index')),
};


const STORECOMPONENTS = {
	MANAGESTORES: lazy(() => import('../pages/allModules/stores/manageStore/index')),
};
const EXPENSECOMPONENTS = {
	EXPENSETYPE: lazy(() => import('../pages/allModules/expenseType/index')),
};
const systemUsersRoutes = [
	{
		path: rolesAdmin.adminRoles.subMenu.addAdmin.path,
		element: <ADMINROLES.ADDADMIN />,
		exact: true,
	},
];

const dashboardRoutes = [
	/**
	 * Dashboard Home
	 */

	{
		path: dashboardHome.dashboard.path,
		element: <DASHBOARD.HOME />,
		exact: true,
	},
	{
		path: demoPages.login.path,
		element: <AUTH.LOGIN />,
		exact: true,
	},
	{
		path: demoPages.register.path,
		element: <AUTH.SIGNUP />,
		exact: true,
	},
	{
		path: demoPages.otp.path,
		element: <AUTH.OTP_VERIFICATION />,
		exact: true,
	},
	{
		path: demoPages.getStarted.path,
		element: <AUTH.GETTING_STARTED />,
		exact: true,
	},
];
const itemsManagementRoutes = [
	/**
	 * Dashboard Home
	 */

	{
		path: itemsManagementModule.itemsManagement.subMenu.itemParts.path,
		element: <itemsManagementComponents.ITEMPARTS />,
		exact: true,
	},
	{
		path: `${itemsManagementModule.itemsManagement.subMenu.itemParts.path}/items`,
		element: <itemsManagementComponents.ITEMPARTS_ITEMS_LIST />,
		exact: true,
	},
	{
		path: `${itemsManagementModule.itemsManagement.subMenu.itemParts.path}/attributes`,
		element: <itemsManagementComponents.ITEMPARTS_ATTRIBUTES />,
		exact: true,
	},
	{
		path: `${itemsManagementModule.itemsManagement.subMenu.itemParts.path}/models`,
		element: <itemsManagementComponents.ITEMPARTS_MODELS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.items.path,
		element: <itemsManagementComponents.ITEMS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.category.path,
		element: <itemsManagementComponents.CATEGORY />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.applications.path,
		element: <itemsManagementComponents.APPLICATIONS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.dimensions.path,
		element: <itemsManagementComponents.DIMENSIONS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.partModel.path,
		element: <itemsManagementComponents.PARTMODELS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.subCategory.path,
		element: <itemsManagementComponents.SUBCATEGORY />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.models.path,
		element: <itemsManagementComponents.MODELS />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.machines.path,
		element: <itemsManagementComponents.MACHINES />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.make.path,
		element: <itemsManagementComponents.MAKE />,
		exact: true,
	},
	{
		path: itemsManagementModule.itemsManagement.subMenu.companies.path,
		element: <itemsManagementComponents.COMPANIES />,
		exact: true,
	},
];
// const kitManagementRoutes = [
// 	/**
// 	 * kit management
// 	 */

// 	{
// 		path: kitModule.kitManagementModule.subMenu.defineKit.path,
// 		element: <KITMANAGEMENTCOMPONENTS.DEFINEKIT />,
// 		exact: true,
// 	},
// ];

const inventoryManagementRoutes = [
	/**
	 * Inventory
	 */

	{
		path: inventoryModule.inventoryModules.subMenu.adjustInventory.path,
		element: <INVENTORYCOMPONENTS.ADJUSTINVENTORY />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.parts.path,
		element: <INVENTORYCOMPONENTS.PARTS />,
		exact: true,
	},

	{
		path: inventoryModule.inventoryModules.subMenu.purchaseOrder.path,
		element: <INVENTORYCOMPONENTS.PURCHASEORDER />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.Racks.path,
		element: <INVENTORYCOMPONENTS.RACKS />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.shelves.path,
		element: <INVENTORYCOMPONENTS.SHELVES />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.returnPurchaseOrder.path,
		element: <INVENTORYCOMPONENTS.RETURNPURCHASEORDER />,
		exact: true,
	},

	{
		path: inventoryModule.inventoryModules.subMenu.simplePurchase.path,
		element: <INVENTORYCOMPONENTS.SIMPLEPURCHASE />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.history.path,
		element: <INVENTORYCOMPONENTS.HISTORY />,
		exact: true,
	},
	{
		path: inventoryModule.inventoryModules.subMenu.cost.path,
		element: <INVENTORYCOMPONENTS.COST />,
		exact: true,
	},
];

const reportManagementRoutes = [
	/**
	 * report
	 */

	{
		path: reportModule.reportModules.subMenu.Report1.path,
		element: <REPORTCOMPONENTS.REPORT1 />,
		exact: true,
	},

	{
		path: reportModule.reportModules.subMenu.Report2.path,
		element: <REPORTCOMPONENTS.REPORT2 />,
		exact: true,
	},
	{
		path: reportModule.reportModules.subMenu.Report3.path,
		element: <REPORTCOMPONENTS.REPORT3 />,
		exact: true,
	},
	// {
	// 	path: reportModule.reportModules.subMenu.Report4.path,
	// 	element: <REPORTCOMPONENTS.REPORT4 />,
	// 	exact: true,
	// },
	{
		path: reportModule.reportModules.subMenu.Report5.path,
		element: <REPORTCOMPONENTS.REPORT5 />,
		exact: true,
	},
	{
		path: reportModule.reportModules.subMenu.Report6.path,
		element: <REPORTCOMPONENTS.REPORT6 />,
		exact: true,
	},
	{
		path: reportModule.reportModules.subMenu.Report7.path,
		element: <REPORTCOMPONENTS.REPORT7 />,
		exact: true,
	},
];

// const packageRoutes = [
// 	{
// 		path: packagesModule.packageManagement.subMenu.person.path,
// 		element: <PACKAGECOMPONENT.PACKAGE />,
// 		exact: true,
// 	},
// ];

const salesManagementRoutes = [
	/**
	 * Sales
	 */
	{
		path: salesModule.saleModules.subMenu.sales.path,
		element: <SALESCOMPONENTS.SALES />,
		exact: true,
	},
	{
		path: salesModule.saleModules.subMenu.quotations.path,
		element: <SALESCOMPONENTS.QUOTATIONS />,
		exact: true,
	},
	{
		path: salesModule.saleModules.subMenu.returnSale.path,
		element: <SALESCOMPONENTS.RETURNSALES />,
		exact: true,
	},
];

const transferManagementRoutes = [
	/**
	 * transfer
	 */
	{
		path: transferModule.transferModules.subMenu.listT.path,
		element: <TRANSFERCOMPONENTS.TRANSFER />,
		exact: true,
	},
];

const suppliersManagementRoutes = [
	/**
	 * suppliers
	 */

	{
		path: suppliersModule.suppliersModules.subMenu.manage.path,
		element: <SUPPLIERCOMPONENTS.MANAGE />,
		exact: true,
	},
];

const customerManagementRoutes = [
	/**
	 * customers
	 */

	{
		path: customersModule.customersModules.subMenu.manage.path,
		element: <CUSTOMERCOMPONENTS.MANAGE />,
		exact: true,
	},
];

const employeeManagementRoutes = [
	/**
	 * employees
	 */

	{
		path: employeesModule.employees.subMenu.manageEmployees.path,
		element: <EMPLOYEESCOMPONENTS.MANAGEEMPLOYEES />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.payrollEmployees.path,
		element: <EMPLOYEESCOMPONENTS.PAYROLLEMPLOYEES />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.finalSettlement.path,
		element: <EMPLOYEESCOMPONENTS.FINALSETTLEMENT />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.viewPayrollsEmployees.path,
		element: <EMPLOYEESCOMPONENTS.VIEWPAYROLLEMPLOYEES />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.advanceSalaryEmployees.path,
		element: <EMPLOYEESCOMPONENTS.ADVANCESALARY />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.departmentsEmployees.path,
		element: <EMPLOYEESCOMPONENTS.DEPARTMENTS />,
		exact: true,
	},
	{
		path: employeesModule.employees.subMenu.designationsEmployees.path,
		element: <EMPLOYEESCOMPONENTS.DESIGNATIONS />,
		exact: true,
	},
];

const storesManagementRoutes = [
	/**
	 * stores
	 */

	{
		path: storesModule.storesModules.subMenu.manage.path,
		element: <STORECOMPONENTS.MANAGESTORES />,
		exact: true,
	},
];

const expenseManagementRoutes = [
	/**
	 * expense
	 */

	{
		path: expenseModule.expenseModules.path,
		element: <EXPENSECOMPONENTS.EXPENSETYPE />,
		exact: true,
	},
];

const accountRoutes = [
	// {
	// 	path: accountsModule.accounts.subMenu.individualAccounts.path,
	// 	element: <ADMINPORTALLANDING.INDIVIDUALACCOUNTS />,
	// 	exact: true,
	// },
	{
		path: accountsModule.viewTransactions.path,
		element: <ADMINPORTALLANDING.VIEWTRANSACTIONS />,
		exact: true,
	},

	{
		path: accountsModule.accounts.subMenu.dailyClosing.path,
		element: <ADMINPORTALLANDING.DAILYCLOSING />,
		exact: true,
	},

	{
		path: accountsModule.accounts.subMenu.manageAccountsSubgroups.path,
		element: <ADMINPORTALLANDING.ACCOUNTHEADSSUBGROUPS />,
		exact: true,
	},
	{
		path: accountsModule.vouchers.subMenu.newTransaction.path,
		element: <ADMINPORTALLANDING.NEWTRANSACTION />,
		exact: true,
	},
	{
		path: accountsModule.vouchers.subMenu.simpleVouchers.path,
		element: <ADMINPORTALLANDING.VOUCHERS />,
		exact: true,
	},
];
const presentation = [
	/**
	 * Landing
	 */
	{
		path: dashboardMenu.dashboard.path,
		element: <LANDING.DASHBOARD />,
		exact: true,
	},
	{
		path: dashboardMenu.dashboardBooking.path,
		element: <LANDING.DASHBOARD_BOOKING />,
		exact: true,
	},
	{
		path: dashboardMenu.summary.path,
		element: <LANDING.SUMMARY />,
		exact: true,
	},

	/** ************************************************** */

	/**
	 * Pages
	 */

	/**
	 * Single Pages
	 */
	{
		path: demoPages.singlePages.subMenu.boxedSingle.path,
		element: <SINGLE.BOXED />,
		exact: true,
	},
	{
		path: demoPages.singlePages.subMenu.fluidSingle.path,
		element: <SINGLE.FLUID />,
		exact: true,
	},

	/**
	 * List
	 */
	{
		path: demoPages.listPages.subMenu.listBoxed.path,
		element: <LIST.BOXED />,
		exact: true,
	},
	{
		path: demoPages.listPages.subMenu.listFluid.path,
		element: <LIST.FLUID />,
		exact: true,
	},

	/**
	 * Grid
	 */
	{
		path: demoPages.gridPages.subMenu.gridBoxed.path,
		element: <GRID.BOXED />,
		exact: true,
	},
	{
		path: demoPages.gridPages.subMenu.gridFluid.path,
		element: <GRID.FLUID />,
		exact: true,
	},

	/**
	 * Edit
	 */
	{
		path: demoPages.editPages.subMenu.editModern.path,
		element: <EDIT.MODERN />,
		exact: true,
	},
	{
		path: demoPages.editPages.subMenu.editBoxed.path,
		element: <EDIT.BOXED />,
		exact: true,
	},
	{
		path: demoPages.editPages.subMenu.editFluid.path,
		element: <EDIT.FLUID />,
		exact: true,
	},
	{
		path: demoPages.editPages.subMenu.editWizard.path,
		element: <EDIT.WIZARD />,
		exact: true,
	},
	{
		path: demoPages.editPages.subMenu.editInCanvas.path,
		element: <EDIT.IN_CANVAS />,
		exact: true,
	},
	{
		path: demoPages.editPages.subMenu.editInModal.path,
		element: <EDIT.IN_MODAL />,
		exact: true,
	},

	{
		path: demoPages.pricingTable.path,
		element: <PRICING.PRICING_TABLE />,
		exact: true,
	},

	/**
	 * END - Pages
	 */

	/**
	 * Auth Page
	 */
	{
		path: demoPages.page404.path,
		element: <AUTH.PAGE_404 />,
		exact: true,
	},
	{
		path: demoPages.login.path,
		element: <AUTH.LOGIN />,
		exact: true,
	},
	{
		path: demoPages.register.path,
		element: <AUTH.SIGNUP />,
		exact: true,
	},
	{
		path: demoPages.getStarted.path,
		element: <AUTH.GETTING_STARTED />,
		exact: true,
	},
	{
		path: demoPages.signUp.path,
		element: <AUTH.LOGIN isSignUp />,
		exact: true,
	},

	/**
	 * App
	 */

	/**
	 * App > Project Management
	 */
	{
		path: demoPages.projectManagement.subMenu.list.path,
		element: <APP.PROJECT_MANAGEMENT.PROJECTS_LIST />,
		exact: true,
	},
	{
		path: `${demoPages.projectManagement.subMenu.itemID.path}/:id`,
		element: <APP.PROJECT_MANAGEMENT.PROJECT />,
		exact: true,
	},

	/**
	 * App > Knowledge
	 */
	{
		path: demoPages.knowledge.subMenu.grid.path,
		element: <APP.KNOWLEDGE.GRID />,
		exact: true,
	},
	{
		path: `${demoPages.knowledge.subMenu.itemID.path}/:id`,
		element: <APP.KNOWLEDGE.VIEW />,
		exact: true,
	},

	/**
	 * App > Sales
	 */
	{
		path: demoPages.sales.subMenu.transactions.path,
		element: <APP.SALES.TRANSACTIONS />,
		exact: true,
	},
	{
		path: demoPages.sales.subMenu.salesList.path,
		element: <APP.SALES.PRODUCTS />,
		exact: true,
	},
	{
		path: demoPages.sales.subMenu.productsGrid.path,
		element: <APP.SALES.PRODUCTS_GRID />,
		exact: true,
	},
	{
		path: `${demoPages.sales.subMenu.productID.path}/:id`,
		element: <APP.SALES.PRODUCTS_VIEW />,
		exact: true,
	},

	/**
	 * App > Appointment
	 */
	{
		path: demoPages.appointment.subMenu.calendar.path,
		element: <APP.APPOINTMENT.CALENDAR />,
		exact: true,
	},
	{
		path: demoPages.appointment.subMenu.employeeList.path,
		element: <APP.APPOINTMENT.EMPLOYEE_LIST />,
		exact: true,
	},
	{
		path: `${demoPages.appointment.subMenu.employeeID.path}/:id`,
		element: <APP.APPOINTMENT.EMPLOYEE_VIEW />,
		exact: true,
	},
	{
		path: demoPages.appointment.subMenu.appointmentList.path,
		element: <APP.APPOINTMENT.APPOINTMENT_LIST />,
		exact: true,
	},

	/**
	 * App > CRM
	 */
	{
		path: demoPages.crm.subMenu.dashboard.path,
		element: <APP.CRM.CRM_DASHBOARD />,
		exact: true,
	},
	{
		path: demoPages.crm.subMenu.customersList.path,
		element: <APP.CRM.CUSTOMERS />,
		exact: true,
	},
	{
		path: `${demoPages.crm.subMenu.customerID.path}/:id`,
		element: <APP.CRM.CUSTOMER />,
		exact: true,
	},

	/**
	 * App > Chat
	 */
	{
		path: demoPages.chat.subMenu.withListChat.path,
		element: <APP.CHAT.WITH_LIST />,
		exact: true,
	},
	{
		path: demoPages.chat.subMenu.onlyListChat.path,
		element: <APP.CHAT.ONLY_LIST />,
		exact: true,
	},

	/**
	 * END - App
	 */

	/** ************************************************** */

	/**
	 * Page Layout Types
	 */
	{
		path: layoutMenu.blank.path,
		element: <PAGE_LAYOUTS.BLANK />,
		exact: true,
	},
	{
		path: layoutMenu.pageLayout.subMenu.headerAndSubheader.path,
		element: <PAGE_LAYOUTS.HEADER_SUBHEADER />,
		exact: true,
	},
	{
		path: layoutMenu.pageLayout.subMenu.onlyHeader.path,
		element: <PAGE_LAYOUTS.HEADER />,
		exact: true,
	},
	{
		path: layoutMenu.pageLayout.subMenu.onlySubheader.path,
		element: <PAGE_LAYOUTS.SUBHEADER />,
		exact: true,
	},
	{
		path: layoutMenu.pageLayout.subMenu.onlyContent.path,
		element: <PAGE_LAYOUTS.CONTENT />,
		exact: true,
	},
	{
		path: layoutMenu.asideTypes.subMenu.defaultAside.path,
		element: <PAGE_LAYOUTS.ASIDE />,
		exact: true,
	},
	{
		path: layoutMenu.asideTypes.subMenu.minimizeAside.path,
		element: <PAGE_LAYOUTS.MINIMIZE_ASIDE />,
		exact: true,
	},
];
const documentation = [
	/**
	 * Bootstrap
	 */

	/**
	 * Content
	 */
	{
		path: componentsMenu.content.path,
		element: <CONTENT.CONTENTS />,
		exact: true,
	},
	{
		path: componentsMenu.content.subMenu.typography.path,
		element: <CONTENT.TYPOGRAPHY />,
		exact: true,
	},
	{
		path: componentsMenu.content.subMenu.images.path,
		element: <CONTENT.IMAGES />,
		exact: true,
	},
	{
		path: componentsMenu.content.subMenu.tables.path,
		element: <CONTENT.TABLES />,
		exact: true,
	},
	{
		path: componentsMenu.content.subMenu.figures.path,
		element: <CONTENT.FIGURES />,
		exact: true,
	},

	/**
	 * Forms
	 */
	{
		path: componentsMenu.forms.path,
		element: <FORMS_PAGE.FORMS />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.formGroup.path,
		element: <FORMS_PAGE.FORM_GROUP />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.formControl.path,
		element: <FORMS_PAGE.FORM_CONTROLS />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.select.path,
		element: <FORMS_PAGE.SELECT />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.checksAndRadio.path,
		element: <FORMS_PAGE.CHECKS_AND_RADIO />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.range.path,
		element: <FORMS_PAGE.RANGE />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.inputGroup.path,
		element: <FORMS_PAGE.INPUT_GROUP />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.validation.path,
		element: <FORMS_PAGE.VALIDATION />,
		exact: true,
	},
	{
		path: componentsMenu.forms.subMenu.wizard.path,
		element: <FORMS_PAGE.WIZARD />,
		exact: true,
	},

	/**
	 * Components
	 */
	{
		path: componentsMenu.components.path,
		element: <COMPONENTS_PAGE.COMPONENTS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.tooltip.path,
		element: <COMPONENTS_PAGE.TOOLTIP />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.toasts.path,
		element: <COMPONENTS_PAGE.TOASTS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.scrollspy.path,
		element: <COMPONENTS_PAGE.SCROLLSPY />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.carousel.path,
		element: <COMPONENTS_PAGE.CAROUSEL />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.spinners.path,
		element: <COMPONENTS_PAGE.SPINNER />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.listGroup.path,
		element: <COMPONENTS_PAGE.LIST_GROUP />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.breadcrumb.path,
		element: <COMPONENTS_PAGE.BREADCRUMB />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.collapse.path,
		element: <COMPONENTS_PAGE.COLLAPSE />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.pagination.path,
		element: <COMPONENTS_PAGE.PAGINATION />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.progress.path,
		element: <COMPONENTS_PAGE.PROGRESS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.card.path,
		element: <COMPONENTS_PAGE.CARD />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.button.path,
		element: <COMPONENTS_PAGE.BUTTON />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.buttonGroup.path,
		element: <COMPONENTS_PAGE.BUTTON_GROUP />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.alert.path,
		element: <COMPONENTS_PAGE.ALERT />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.badge.path,
		element: <COMPONENTS_PAGE.BADGE />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.popovers.path,
		element: <COMPONENTS_PAGE.POPOVERS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.dropdowns.path,
		element: <COMPONENTS_PAGE.DROPDOWN />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.accordion.path,
		element: <COMPONENTS_PAGE.ACCORDION />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.modal.path,
		element: <COMPONENTS_PAGE.MODAL />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.navsTabs.path,
		element: <COMPONENTS_PAGE.NAVS_TABS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.offcanvas.path,
		element: <COMPONENTS_PAGE.OFF_CANVAS />,
		exact: true,
	},
	{
		path: componentsMenu.components.subMenu.table.path,
		element: <COMPONENTS_PAGE.TABLE />,
		exact: true,
	},

	/**
	 * Utilities
	 */
	{
		path: componentsMenu.utilities.path,
		element: <UTILITIES.UTILITIES />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.api.path,
		element: <UTILITIES.API />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.background.path,
		element: <UTILITIES.BACKGROUND />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.borders.path,
		element: <UTILITIES.BORDERS />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.colors.path,
		element: <UTILITIES.COLORS />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.display.path,
		element: <UTILITIES.DISPLAY />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.flex.path,
		element: <UTILITIES.FLEX />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.float.path,
		element: <UTILITIES.FLOAT />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.interactions.path,
		element: <UTILITIES.INTERACTIONS />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.overflow.path,
		element: <UTILITIES.OVERFLOW />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.position.path,
		element: <UTILITIES.POSITION />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.shadows.path,
		element: <UTILITIES.SHADOWS />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.sizing.path,
		element: <UTILITIES.SIZING />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.spacing.path,
		element: <UTILITIES.SPACING />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.text.path,
		element: <UTILITIES.TEXT />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.verticalAlign.path,
		element: <UTILITIES.VERTICAL_ALIGN />,
		exact: true,
	},
	{
		path: componentsMenu.utilities.subMenu.visibility.path,
		element: <UTILITIES.VISIBILITY />,
		exact: true,
	},

	/**
	 * Extra
	 */

	/**
	 * Icons
	 */
	{
		path: componentsMenu.icons.path,
		element: <ICONS.ICONS_LIST />,
		exact: true,
	},
	{
		path: componentsMenu.icons.subMenu.icon.path,
		element: <ICONS.ICON />,
		exact: true,
	},
	{
		path: componentsMenu.icons.subMenu.material.path,
		element: <ICONS.MATERIAL />,
		exact: true,
	},
	{
		path: componentsMenu.icons.subMenu.bootstrapIcon.path,
		element: <ICONS.BOOTSTRAP />,
		exact: true,
	},

	/**
	 * Charts
	 */
	{
		path: componentsMenu.charts.path,
		element: <CHARTS_PAGE.CHART_LIST />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsUsage.path,
		element: <CHARTS_PAGE.GENERAL_USAGE />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsSparkline.path,
		element: <CHARTS_PAGE.SPARKLINE />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsLine.path,
		element: <CHARTS_PAGE.LINE />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsArea.path,
		element: <CHARTS_PAGE.AREA />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsColumn.path,
		element: <CHARTS_PAGE.COLUMN />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsBar.path,
		element: <CHARTS_PAGE.BAR />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsMixed.path,
		element: <CHARTS_PAGE.MIXED />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsTimeline.path,
		element: <CHARTS_PAGE.TIMELINE />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsCandleStick.path,
		element: <CHARTS_PAGE.CANDLESTICK />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsBoxWhisker.path,
		element: <CHARTS_PAGE.BOX_WHISKER />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsPieDonut.path,
		element: <CHARTS_PAGE.PIE_DONUT />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsRadar.path,
		element: <CHARTS_PAGE.RADAR />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsPolar.path,
		element: <CHARTS_PAGE.POLAR />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsRadialBar.path,
		element: <CHARTS_PAGE.RADIAL_BAR />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsBubble.path,
		element: <CHARTS_PAGE.BUBBLE />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsScatter.path,
		element: <CHARTS_PAGE.SCATTER />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsHeatMap.path,
		element: <CHARTS_PAGE.HEAT_MAP />,
		exact: true,
	},
	{
		path: componentsMenu.charts.subMenu.chartsTreeMap.path,
		element: <CHARTS_PAGE.TREE_MAP />,
		exact: true,
	},

	{
		path: componentsMenu.notification.path,
		element: <EXTRA.NOTIFICATION />,
		exact: true,
	},
	{
		path: componentsMenu.hooks.path,
		element: <EXTRA.HOOKS />,
		exact: true,
	},
];
const contents = [...presentation, ...documentation];
const dashbord = [...dashboardRoutes];
const accounts = [...accountRoutes];
const itemsManagementR = [...itemsManagementRoutes];
// const kitManagementR = [...kitManagementRoutes];
const inventoryMangementR = [...inventoryManagementRoutes];
const reportMangementR = [...reportManagementRoutes];
const salesManagementR = [...salesManagementRoutes];
const transferManagementR = [...transferManagementRoutes];
const suppliersMangementR = [...suppliersManagementRoutes];
const storesMangementR = [...storesManagementRoutes];
const customersMangementR = [...customerManagementRoutes];
const employeesMangementR = [...employeeManagementRoutes];
const expenseMangementR = [...expenseManagementRoutes];
const systemUsersR = [...systemUsersRoutes];
export {
	dashbord,
	contents,
	accounts,
	itemsManagementR,
	// kitManagementR,
	inventoryMangementR,
	salesManagementR,
	reportMangementR,
	transferManagementR,
	customersMangementR,
	employeesMangementR,
	suppliersMangementR,
	storesMangementR,
	expenseMangementR,
	systemUsersR,
};
