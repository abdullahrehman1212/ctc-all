import subDir from './baseDirectory/subDir';

// Dashboard
export const dashboardHome = {
	heading: {
		id: 'heading',
		text: 'Dashboard',
		icon: 'dashboard',
	},
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: `${subDir}`,
		icon: 'Dashboard',
		subMenu: null,
	},
};
export const rolesAdmin = {
	roles: {
		id: 'roles',
		text: 'System Users',
		icon: 'Extension',
	},
	adminRoles: {
		id: 'adminRoles',
		text: 'Manage',
		path: `${subDir}roleAdmin`,
		icon: 'Group',
		subMenu: {
			addAdmin: {
				id: 'addForm',
				text: 'List',
				path: `${subDir}roleAdmin/createRole`,
				icon: 'GroupAdd',
				notification: false,
			},
		},
	},
};
export const itemsManagementModule = {
	heading: {
		id: 'itemsManagementHeading',
		text: 'Items Management',
		icon: 'DirectionsCar',
	},
	itemsManagement: {
		id: 'itemsManagement',
		text: 'Parts Management',
		path: `${subDir}itemsManagement`,
		icon: 'AddBusiness',
		subMenu: {
			itemParts: {
				id: 'itemParts',
				text: 'Parts',
				path: `${subDir}itemsManagement/itemParts`,
				icon: 'Handyman',
			},
			heading: {
				id: 'itemsManagementHeading2',
				text: 'Items Management',
				icon: 'DirectionsCar',
			},
			category: {
				id: 'category',
				text: 'Category',
				path: `${subDir}itemsManagement/Category`,
				icon: 'Category',
			},
			subCategory: {
				id: 'subCategory',
				text: 'Sub Category',
				path: `${subDir}itemsManagement/subCategory`,
				icon: 'Category',
			},
			items: {
				id: 'items',
				text: 'Items',
				path: `${subDir}itemsManagement/Items`,
				icon: 'Basket3',
			},
			heading2: {
				id: 'itemsManagementHeading3',
				text: 'Models',
				icon: 'DirectionsCar',
			},
			partModel: {
				id: 'partModel',
				text: 'Part Models',
				path: `${subDir}itemsManagement/partModel`,
				icon: 'Category',
			},

			heading4: {
				id: 'itemsManagementHeading4',
				text: 'Vehicles',
				icon: 'DirectionsCar',
			},
			models: {
				id: 'models',
				text: 'models',
				path: `${subDir}itemsManagement/models`,
				icon: 'DevicesOther',
			},
			machines: {
				id: 'machines',
				text: 'vechiles',
				path: `${subDir}itemsManagement/machines`,
				icon: 'Construction',
			},

			make: {
				id: 'make',
				text: 'make',
				path: `${subDir}itemsManagement/make`,
				icon: 'ArrowBarUp',
			},

			heading3: {
				id: 'itemsManagementHeading5',
				text: 'Others',
				icon: 'DirectionsCar',
			},
			applications: {
				id: 'applications',
				text: 'Applications',
				path: `${subDir}itemsManagement/applications`,
				icon: 'Category',
			},
			dimensions: {
				id: 'dimensions',
				text: 'Dimensions',
				path: `${subDir}itemsManagement/dimensions`,
				icon: 'Category',
			},
			companies: {
				id: 'companies',
				text: 'Companies',
				path: `${subDir}itemsManagement/companies`,
				icon: 'Business',
			},
		},
	},
};
// export const kitModule = {
// 	heading: {
// 		id: 'kitModule',
// 		text: 'kit Management',
// 		icon: 'DirectionsCar',
// 	},
// 	kitManagementModule: {
// 		id: 'kitManagementModule',
// 		text: 'Kit Management',
// 		path: `${subDir}kitManagement`,
// 		icon: 'AddBusiness',
// 		subMenu: {
// 			defineKit: {
// 				id: 'defineKit',
// 				text: 'Define Kit',
// 				path: `${subDir}kitManagement/defineKit`,
// 				icon: 'Summarize',
// 			},
// 		},
// 	},
// };

export const inventoryModule = {
	heading: {
		id: 'inventoryModule',
		text: 'Inventory',
		icon: 'Inventory',
	},
	inventoryModules: {
		id: 'inventory',
		text: 'Inventory',
		path: `${subDir}inventory`,
		icon: 'Inventory2',
		subMenu: {
			adjustInventory: {
				id: 'adjustInventory',
				text: 'Adjust Inventory ',
				path: `${subDir}inventory/adjustInventory`,
				icon: 'list',
			},
			parts: {
				id: 'parts',
				text: 'Stock',
				path: `${subDir}inventory/parts`,
				icon: 'Handyman',
			},
			purchaseOrder: {
				id: 'purchaseOrder',
				text: 'Purchase Order',
				path: `${subDir}inventory/purchaseOrder`,
				icon: 'ShoppingCart',
			},
			Racks: {
				id: 'racks',
				text: 'Racks',
				path: `${subDir}inventory/racks`,
				icon: 'Handyman',
			},
			shelves: {
				id: 'shelves',
				text: 'Shelves',
				path: `${subDir}inventory/shelves`,
				icon: 'Handyman',
			},
			returnPurchaseOrder: {
				id: 'rpurchaseOrder',
				text: 'Return Purchase Order',
				path: `${subDir}inventory/returnPurchaseOrder`,
				icon: 'ShoppingCart',
			},

			simplePurchase: {
				id: 'simplePurchase',
				text: 'Direct Purchase',
				path: `${subDir}inventory/simplePurchase`,
				icon: 'ShoppingCart',
			},
			history: {
				id: 'History',
				text: 'History',
				path: `${subDir}inventory/history`,
				icon: 'Window',
			},
			cost: {
				id: 'cost',
				text: 'Prices',
				path: `${subDir}inventory/cost`,
				icon: 'Money',
			},

			// kits: {
			// 	id: 'kits',
			// 	text: 'Kits',
			// 	path: `${subDir}inventory/kits`,
			// 	icon: 'ArrowBarUp',
			// },
		},
	},
};

export const salesModule = {
	heading: {
		id: 'salesModule',
		text: 'Sale',
		icon: 'Money',
	},
	saleModules: {
		id: 'sale',
		text: 'Sale',
		path: `${subDir}sale`,
		icon: 'Money',
		subMenu: {
			sales: {
				id: 'sales',
				text: 'Sales',
				path: `${subDir}sale/sales`,
				icon: 'ShoppingCart',
			},
			quotations:{
				id: 'quotation',
				text: 'Quotation',
				path: `${subDir}sale/quotation`,
				icon: 'ShoppingCart',
			},
			returnSale: {
				id: 'returnSales',
				text: 'Return Sales',
				path: `${subDir}sale/returnS`,
				icon: 'ImportExport',
			},
		},
	},
};

export const transferModule = {
	heading: {
		id: 'transferModule',
		text: 'Transfer',
		icon: 'ImportExport',
	},
	transferModules: {
		id: 'transfer',
		text: 'Transfer',
		path: `${subDir}transfer`,
		icon: 'ImportExport',
		subMenu: {
			listT: {
				id: 'listT',
				text: 'List',
				path: `${subDir}transfer/list`,
				icon: 'FilterList',
			},
		},
	},
};

export const suppliersModule = {
	heading: {
		id: 'suppliersModule',
		text: 'Suppliers',
		icon: 'PersonPinCircle',
	},
	suppliersModules: {
		id: 'supplier',
		text: 'Suppliers',
		path: `${subDir}suppliers`,
		icon: 'PersonPinCircle',
		subMenu: {
			manage: {
				id: 'manage',
				text: 'Manage Suppliers',
				path: `${subDir}suppliers/manageSupplier`,
				icon: 'ManageAccounts',
			},
		},
	},
};
export const customersModule = {
	heading: {
		id: 'customersModule',
		text: 'Customers',
		icon: 'PersonPinCircle',
	},
	customersModules: {
		id: 'customer',
		text: 'Customers',
		path: `${subDir}customers`,
		icon: 'PersonPinCircle',
		subMenu: {
			manage: {
				id: 'manage',
				text: 'Manage Customers',
				path: `${subDir}customers/manageCustomers`,
				icon: 'ManageAccounts',
			},
		},
	},
};

export const employeesModule = {
	employeesHeading: {
		id: 'employeesHeading',
		text: 'Employees',
		icon: 'Extension',
	},
	employees: {
		id: 'employees',
		text: 'Employees',
		path: `${subDir}employees/`,
		icon: 'EmojiPeople',
		subMenu: {
			manageEmployees: {
				id: 'employeesManage',
				text: 'Manage',
				path: `${subDir}employees/manage`,
				icon: 'Plumbing',
			},
			payrollEmployees: {
				id: 'employeesPayroll',
				text: 'Generate Payroll',
				path: `${subDir}employees/generatePayroll`,
				icon: 'GeneratingTokens',
			},
			viewPayrollsEmployees: {
				id: 'viewEmployeesPayroll',
				text: 'View Payrolls',
				path: `${subDir}employees/viewPayrolls`,
				icon: 'Pageview',
			},
			advanceSalaryEmployees: {
				id: 'advanceSalaryEmployees',
				text: 'Advance Salary',
				path: `${subDir}employees/advanceSalary`,
				icon: 'LocalAtm',
			},
			finalSettlement: {
				id: 'finalSettlement',
				text: 'Final Settlement',
				path: `${subDir}employees/finalSettlement`,
				icon: 'Pages',
			},
			departmentsEmployees: {
				id: 'departmentsEmployees',
				text: 'Departments',
				path: `${subDir}employees/departments`,
				icon: 'Place',
			},
			designationsEmployees: {
				id: 'designationsEmployees',
				text: 'Designations',
				path: `${subDir}employees/designations`,
				icon: 'DesignServices',
			},
		},
	},
};

export const expenseModule = {
	heading: {
		id: 'expenseModule',
		text: 'Expense Type',
		icon: 'Money',
	},
	expenseModules: {
		id: 'expense',
		text: 'Expense Type',
		path: `${subDir}expenseType`,
		icon: 'Money',
		// subMenu: {
		// 	expense: {
		// 		id: 'expense',
		// 		text: 'Expense Type',
		// 		path: `${subDir}expenseType/expense`,
		// 		icon: 'Money',
		// 	},
		// },
	},
};

export const storesModule = {
	heading: {
		id: 'storesModule',
		text: 'Stores',
		icon: 'Storefront',
	},
	storesModules: {
		id: 'store',
		text: 'Stores',
		path: `${subDir}stores`,
		icon: 'Storefront',
		subMenu: {
			manage: {
				id: 'manageStore',
				text: 'Manage Stores',
				path: `${subDir}stores/manageStore`,
				icon: 'Build',
			},
		},
	},
};
// export const packagesModule = {
// 	heading: {
// 		id: 'packagesModuleHeading',
// 		text: 'Packages Module',
// 		icon: 'People',
// 	},
// 	packageManagement: {
// 		id: 'packagesModule',
// 		text: 'Packages',
// 		path: `${subDir}packages`,
// 		icon: 'Inventory',
// 		subMenu: {
// 			person: {
// 				id: 'person',
// 				text: 'View Packages',
// 				path: `${subDir}package`,
// 				icon: 'Visibility',
// 			},
// 		},
// 	},
// };
// Do comment the report 4 in the following for removing the transfer
export const reportModule = {
	heading: {
		id: 'reportModule',
		text: 'Reports',
		icon: 'Window',
	},
	reportModules: {
		id: 'report',
		text: 'Reports',
		path: `${subDir}report`,
		icon: 'Window',
		subMenu: {
			Report1: {
				id: 'report1',
				text: 'Purchases',
				path: `${subDir}report/report1`,
				icon: 'FilterList',
			},
			Report2: {
				id: 'report2',
				text: 'Sales',
				path: `${subDir}report/report2`,
				icon: 'FilterList',
			},
			Report3: {
				id: 'report3',
				text: 'Expenses',
				path: `${subDir}report/report3`,
				icon: 'FilterList',
			},
			// Report4: {
			// 	id: 'report4',
			// 	text: 'Transfer',
			// 	path: `${subDir}report/report4`,
			// 	icon: 'FilterList',
			// },
			Report5: {
				id: 'report5',
				text: 'Brand Wise',
				path: `${subDir}report/report5`,
				icon: 'FilterList',
			},
			Report6: {
				id: 'report6',
				text: 'Customer Wise',
				path: `${subDir}report/report6`,
				icon: 'FilterList',
			},
			Report7: {
				id: 'report7',
				text: 'Sales Type',
				path: `${subDir}report/report7`,
				icon: 'FilterList',
			},
		},
	},
};

export const accountsModule = {
	accountsHeading: {
		id: 'accountsHeading',
		text: 'Accounts',
		icon: 'Extension',
	},
	accounts: {
		id: 'accounts',
		text: 'Accounts',
		path: `${subDir}accounts`,
		icon: 'Dashboard',
		subMenu: {
			manageAccountsSubgroups: {
				id: 'accountsManageAccountsSubgroups',
				text: 'Manage Accounts',
				path: `${subDir}accounts/Subgroups`,
				icon: 'Window',
			},

			// postDated: {
			// 	id: 'accountsPostDated',
			// 	text: 'Bank Reconciliation',
			// 	path: `${subDir}accounts/postDatedCheques`,
			// 	icon: 'Dashboard',
			// },
			// individualAccounts: {
			// 	id: 'individualAccounts',
			// 	text: 'Individual Accounts',
			// 	path: `${subDir}accounts/individualAccounts`,
			// 	icon: 'Dashboard',
			// },
			dailyClosing: {
				id: 'dailyClosing',
				text: 'Daily Closing',
				path: `${subDir}accounts/dailyClosing`,
				icon: 'Dashboard',
			},
			// depreciation: {
			// 	id: 'depreciation',
			// 	text: 'Depreciation',
			// 	path: `${subDir}accounts/Depreciation`,
			// 	icon: 'Dashboard',
			// },
		},
	},
	vouchers: {
		id: 'vouchers',
		text: 'Vouchers',
		path: `${subDir}vouchers`,
		icon: 'Dashboard',
		subMenu: {
			newTransaction: {
				id: 'accountsNewTransaction',
				text: 'View Vouchers',
				path: `${subDir}vouchers/ViewAll`,
				icon: 'Dashboard',
			},
			simpleVouchers: {
				id: 'simpleVouchers',
				text: 'New Voucher',
				path: `${subDir}vouchers/newVoucher`,
				icon: 'Dashboard',
			},
		},
	},

	viewTransactions: {
		id: 'accountsViewTransactions',
		text: 'Financial Statements',
		path: `${subDir}accounts/transactions/view`,
		icon: 'Window',
		subMenu: null,
	},
};

export const homeMenu = {
	intro: { id: 'intro', text: 'Intro', path: '#intro', icon: 'Vrpano', subMenu: null },

	bootstrap: {
		id: 'bootstrap',
		text: 'Bootstrap Components',
		path: '#bootstrap',
		icon: 'BootstrapFill',
		subMenu: null,
	},
	storybook: {
		id: 'storybook',
		text: 'Storybook',
		path: '#storybook',
		icon: 'CustomStorybook',
		subMenu: null,
	},
	formik: {
		id: 'formik',
		text: 'Formik',
		path: '#formik',
		icon: 'CheckBox',
		subMenu: null,
	},
	apex: {
		id: 'apex',
		text: 'Apex Charts',
		path: '#apex',
		icon: 'AreaChart',
		subMenu: null,
	},
};

export const dashboardMenu = {
	dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/dashboardMenu',
		icon: 'Dashboard',
		subMenu: null,
	},
	dashboardBooking: {
		id: 'dashboard-booking',
		text: 'Dashboard Booking',
		path: 'dashboard-booking',
		icon: 'emoji_transportation',
		subMenu: null,
	},
	crmDashboard: {
		id: 'crmDashboard',
		text: 'CRM Dashboard',
		path: 'crm/dashboard',
		icon: 'RecentActors',
	},
	summary: {
		id: 'summary',
		text: 'Summary',
		path: 'summary',
		icon: 'sticky_note_2',
		subMenu: null,
	},
};

export const demoPages = {
	pages: {
		id: 'pages',
		text: 'Pages',
		icon: 'Extension',
	},
	singlePages: {
		id: 'singlePages',
		text: 'Single Pages',
		path: 'single-pages',
		icon: 'Article',
		subMenu: {
			boxedSingle: {
				id: 'boxedSingle',
				text: 'Boxed',
				path: 'single-pages/boxed',
				icon: 'ViewArray',
			},
			fluidSingle: {
				id: 'fluidSingle',
				text: 'Fluid',
				path: 'single-pages/fluid',
				icon: 'ViewDay',
			},
		},
	},
	listPages: {
		id: 'listPages',
		text: 'List Pages',
		path: 'list-pages',
		icon: 'Dvr',
		subMenu: {
			listBoxed: {
				id: 'listBoxed',
				text: 'Boxed List',
				path: 'list-pages/boxed-list',
				icon: 'ViewArray',
			},
			listFluid: {
				id: 'listFluid',
				text: 'Fluid List',
				path: 'list-pages/fluid-list',
				icon: 'ViewDay',
			},
		},
	},
	gridPages: {
		id: 'gridPages',
		text: 'Grid Pages',
		path: 'grid-pages',
		icon: 'Window',
		subMenu: {
			gridBoxed: {
				id: 'gridBoxed',
				text: 'Boxed Grid',
				path: 'grid-pages/boxed',
				icon: 'ViewArray',
			},
			gridFluid: {
				id: 'gridFluid',
				text: 'Fluid Grid',
				path: 'grid-pages/fluid',
				icon: 'ViewDay',
			},
		},
	},
	editPages: {
		id: 'editPages',
		text: 'Edit Pages',
		path: 'edit-pages',
		icon: 'drive_file_rename_outline ',
		subMenu: {
			editModern: {
				id: 'editModern',
				text: 'Modern Edit',
				path: 'edit-pages/modern',
				icon: 'AutoAwesomeMosaic',
				notification: 'primary',
			},
			editBoxed: {
				id: 'editBoxed',
				text: 'Boxed Edit',
				path: 'edit-pages/boxed',
				icon: 'ViewArray',
			},
			editFluid: {
				id: 'editFluid',
				text: 'Fluid Edit',
				path: 'edit-pages/fluid',
				icon: 'ViewDay',
			},
			editWizard: {
				id: 'editWizard',
				text: 'Wizard Edit',
				path: 'edit-pages/wizard',
				icon: 'LinearScale',
			},
			editInCanvas: {
				id: 'editInCanvas',
				text: 'In Canvas Edit',
				path: 'edit-pages/in-canvas',
				icon: 'VerticalSplit',
			},
			editInModal: {
				id: 'editInModal',
				text: 'In Modal Edit',
				path: 'edit-pages/in-modal',
				icon: 'PictureInPicture',
			},
		},
	},
	pricingTable: {
		id: 'pricingTable',
		text: 'Pricing Table',
		path: 'pricing-table',
		icon: 'Local Offer',
	},

	auth: {
		id: 'auth',
		text: 'Auth Pages',
		icon: 'Extension',
	},
	login: {
		id: 'login',
		text: 'Login',
		path: `${subDir}auth-pages/login`,
		icon: 'Login',
	},
	register: {
		id: 'register',
		text: 'Register',
		path: `${subDir}auth-pages/register`,
		icon: 'Login',
	},

	otp: {
		id: 'otp',
		text: 'Otp',
		path: `${subDir}auth-pages/otp-verification`,
		icon: 'Login',
	},
	getStarted: {
		id: 'getstarted',
		text: 'getstarted',
		path: `${subDir}auth-pages/get-started`,
		icon: 'Login',
	},
	getHome: {
		id: 'home',
		text: 'home',
		path: `${subDir}auth-pages/home`,
		icon: 'Login',
	},
	signUp: {
		id: 'signUp',
		text: 'Sign Up',
		path: 'auth-pages/sign-up',
		icon: 'PersonAdd',
	},

	page404: {
		id: 'Page404',
		text: '404 Page',
		path: 'auth-pages/404',
		icon: 'ReportGmailerrorred',
	},

	app: {
		id: 'app',
		text: 'Apps',
		icon: 'Extension',
	},
	projectManagement: {
		id: 'projectManagement',
		text: 'Project Management',
		path: 'project-management',
		icon: 'AutoStories',
		subMenu: {
			list: {
				id: 'list',
				text: 'Projects',
				path: 'project-management/list',
				icon: 'AutoStories',
			},
			itemID: {
				id: 'projectID',
				text: 'projectID',
				path: 'project-management/project',
				hide: true,
			},
			item: {
				id: 'item',
				text: 'Project',
				path: 'project-management/project/1',
				icon: 'Book',
			},
		},
	},
	knowledge: {
		id: 'knowledge',
		text: 'Knowledge',
		path: 'knowledge',
		icon: 'AutoStories',
		subMenu: {
			grid: {
				id: 'grid',
				text: 'Knowledge Grid',
				path: 'knowledge/grid',
				icon: 'AutoStories',
			},
			itemID: {
				id: 'itemID',
				text: 'itemID',
				path: 'knowledge/item',
				hide: true,
			},
			item: {
				id: 'item',
				text: 'Item',
				path: 'knowledge/item/1',
				icon: 'Book',
			},
		},
	},
	sales: {
		id: 'sales',
		text: 'Sales',
		path: 'sales',
		icon: 'Store',
		subMenu: {
			dashboard: dashboardMenu.dashboard,
			salesList: {
				id: 'products',
				text: 'Sales List',
				path: 'sales/sales-list',
				icon: 'FactCheck',
			},
			productsGrid: {
				id: 'productsGrid',
				text: 'Products Grid',
				path: 'sales/grid',
				icon: 'CalendarViewMonth',
			},
			productID: {
				id: 'productID',
				text: 'productID',
				path: 'sales/product',
				hide: true,
			},
			product: {
				id: 'product',
				text: 'Product',
				path: 'sales/product/1',
				icon: 'QrCode2',
			},
			transactions: {
				id: 'transactions',
				text: 'Transactions',
				path: 'sales/transactions',
				icon: 'PublishedWithChanges',
			},
		},
	},
	appointment: {
		id: 'appointment',
		text: 'Appointment',
		path: 'appointment',
		icon: 'Today',
		subMenu: {
			dashboard: dashboardMenu.dashboardBooking,
			calendar: {
				id: 'calendar',
				text: 'Calendar',
				path: 'appointment/calendar',
				icon: 'EditCalendar',
				notification: true,
			},
			employeeList: {
				id: 'employeeList',
				text: 'Employee List',
				path: 'appointment/employee-list',
				icon: 'PersonSearch',
			},
			employeeID: {
				id: 'employeeID',
				text: 'employeeID',
				path: 'appointment/employee',
				hide: true,
			},
			employee: {
				id: 'employee',
				text: 'Employee',
				path: 'appointment/employee/1',
				icon: 'QrCode2',
			},
			appointmentList: {
				id: 'appointmentList',
				text: 'Appointment List',
				path: 'appointment/appointment-list',
				icon: 'Event',
			},
		},
	},
	crm: {
		id: 'crm',
		text: 'CRM',
		path: 'crm',
		icon: 'Contacts',
		subMenu: {
			dashboard: {
				id: 'dashboard',
				text: 'CRM Dashboard',
				path: 'crm/dashboard',
				icon: 'RecentActors',
			},
			customersList: {
				id: 'customersList',
				text: 'Customers',
				path: 'crm/customers',
				icon: 'PersonSearch',
			},
			customerID: {
				id: 'customerID',
				text: 'customerID',
				path: 'crm/customer',
				hide: true,
			},
			customer: {
				id: 'customer',
				text: 'Customer',
				path: 'crm/customer/1',
				icon: 'Badge',
			},
			// sales: {
			// 	id: 'sales',
			// 	text: 'Sales',
			// 	path: 'crm/sales',
			// 	icon: 'Storefront',
			// },
			// invoiceID: {
			// 	id: 'invoiceID',
			// 	text: 'invoiceID',
			// 	path: 'crm/invoice',
			// 	hide: true,
			// },
			// invoice: {
			// 	id: 'invoice',
			// 	text: 'Invoice',
			// 	path: 'crm/invoice/1',
			// 	icon: 'Receipt',
			// },
		},
	},
	chat: {
		id: 'chat',
		text: 'Chat',
		path: 'chat',
		icon: 'Forum',
		subMenu: {
			withListChat: {
				id: 'withListChat',
				text: 'With List',
				path: 'chat/with-list',
				icon: 'Quickreply',
			},
			onlyListChat: {
				id: 'onlyListChat',
				text: 'Only List',
				path: 'chat/only-list',
				icon: 'Dns',
			},
		},
	},
};

export const layoutMenu = {
	layoutTypes: {
		id: 'layoutTypes',
		text: 'Page Layout Types',
	},
	blank: {
		id: 'blank',
		text: 'Blank',
		path: 'page-layouts/blank',
		icon: 'check_box_outline_blank ',
	},
	pageLayout: {
		id: 'pageLayout',
		text: 'Page Layout',
		path: 'page-layouts',
		icon: 'BackupTable',
		subMenu: {
			headerAndSubheader: {
				id: 'headerAndSubheader',
				text: 'Header & Subheader',
				path: 'page-layouts/header-and-subheader',
				icon: 'ViewAgenda',
			},
			onlyHeader: {
				id: 'onlyHeader',
				text: 'Only Header',
				path: 'page-layouts/only-header',
				icon: 'ViewStream',
			},
			onlySubheader: {
				id: 'onlySubheader',
				text: 'Only Subheader',
				path: 'page-layouts/only-subheader',
				icon: 'ViewStream',
			},
			onlyContent: {
				id: 'onlyContent',
				text: 'Only Content',
				path: 'page-layouts/only-content',
				icon: 'WebAsset',
			},
		},
	},
	asideTypes: {
		id: 'asideTypes',
		text: 'Aside Types',
		path: 'aside-types',
		icon: 'Vertical Split',
		subMenu: {
			defaultAside: {
				id: 'defaultAside',
				text: 'Default Aside',
				path: 'aside-types/default-aside',
				icon: 'ViewQuilt',
			},
			minimizeAside: {
				id: 'minimizeAside',
				text: 'Minimize Aside',
				path: 'aside-types/minimize-aside',
				icon: 'View Compact',
			},
		},
	},
};

export const componentsMenu = {
	bootstrap: {
		id: 'bootstrap',
		text: 'Bootstrap',
		icon: 'Extension',
	},
	content: {
		id: 'content',
		text: 'Content',
		path: 'content',
		icon: 'format_size',
		subMenu: {
			typography: {
				id: 'typography',
				text: 'Typography',
				path: 'content/typography',
				icon: 'text_fields',
			},
			images: {
				id: 'images',
				text: 'Images',
				path: 'content/images',
				icon: 'Image ',
			},
			tables: {
				id: 'tables',
				text: 'Tables',
				path: 'content/tables',
				icon: 'table_chart',
			},
			figures: {
				id: 'figures',
				text: 'Figures',
				path: 'content/figures',
				icon: 'Photo Library ',
			},
		},
	},
	forms: {
		id: 'forms',
		text: 'Forms',
		path: 'forms',
		icon: 'CheckBox',
		notification: 'success',
		subMenu: {
			formGroup: {
				id: 'formGroup',
				text: 'Form Group',
				path: 'forms/form-group',
				icon: 'Source',
			},
			formControl: {
				id: 'formControl',
				text: 'Form Controls',
				path: 'forms/form-controls',
				icon: 'Create',
			},
			select: {
				id: 'select',
				text: 'Select',
				path: 'forms/select',
				icon: 'Checklist',
			},
			checksAndRadio: {
				id: 'checksAndRadio',
				text: 'Checks & Radio',
				path: 'forms/checks-and-radio',
				icon: 'CheckBox',
			},
			range: {
				id: 'range',
				text: 'Range',
				path: 'forms/range',
				icon: 'HdrStrong',
			},
			inputGroup: {
				id: 'inputGroup',
				text: 'Input Group',
				path: 'forms/input-group',
				icon: 'PowerInput',
			},
			validation: {
				id: 'validation',
				text: 'Validation',
				path: 'forms/validation',
				icon: 'VerifiedUser',
			},
			wizard: {
				id: 'wizard',
				text: 'Wizard',
				path: 'forms/wizard',
				icon: 'LinearScale',
			},
		},
	},
	components: {
		id: 'components',
		text: 'Component',
		path: 'components',
		icon: 'Extension',
		notification: 'success',
		subMenu: {
			accordion: {
				id: 'accordion',
				text: 'Accordion',
				path: 'components/accordion',
				icon: 'ViewDay',
			},
			alert: {
				id: 'alert',
				text: 'Alert',
				path: 'components/alert',
				icon: 'Announcement',
			},
			badge: {
				id: 'badge',
				text: 'Badge',
				path: 'components/badge',
				icon: 'Vibration',
			},
			breadcrumb: {
				id: 'breadcrumb',
				text: 'Breadcrumb',
				path: 'components/breadcrumb',
				icon: 'AddRoad',
			},
			button: {
				id: 'button',
				text: 'Button',
				path: 'components/button',
				icon: 'SmartButton',
			},
			buttonGroup: {
				id: 'buttonGroup',
				text: 'Button Group',
				path: 'components/button-group',
				icon: 'Splitscreen',
			},
			card: {
				id: 'card',
				text: 'Card',
				path: 'components/card',
				icon: 'Crop32',
			},
			carousel: {
				id: 'carousel',
				text: 'Carousel',
				path: 'components/carousel',
				icon: 'RecentActors',
			},
			// Close
			collapse: {
				id: 'collapse',
				text: 'Collapse',
				path: 'components/collapse',
				icon: 'UnfoldLess',
			},
			dropdowns: {
				id: 'dropdowns',
				text: 'Dropdowns',
				path: 'components/dropdowns',
				icon: 'Inventory',
			},
			listGroup: {
				id: 'listGroup',
				text: 'List Group',
				path: 'components/list-group',
				icon: 'ListAlt',
			},
			modal: {
				id: 'modal',
				text: 'Modal',
				path: 'components/modal',
				icon: 'PictureInPicture',
			},
			navsTabs: {
				id: 'navsTabs',
				text: 'Navs & Tabs',
				path: 'components/navs-and-tabs',
				icon: 'PivotTableChart',
			},
			// Navbar
			offcanvas: {
				id: 'offcanvas',
				text: 'Offcanvas',
				path: 'components/offcanvas',
				icon: 'VerticalSplit',
			},
			pagination: {
				id: 'pagination',
				text: 'Pagination',
				path: 'components/pagination',
				icon: 'Money',
			},
			popovers: {
				id: 'popovers',
				text: 'Popovers',
				path: 'components/popovers',
				icon: 'Assistant',
			},
			progress: {
				id: 'progress',
				text: 'Progress',
				path: 'components/progress',
				icon: 'HourglassTop',
			},
			scrollspy: {
				id: 'scrollspy',
				text: 'Scrollspy',
				path: 'components/scrollspy',
				icon: 'KeyboardHide',
			},
			spinners: {
				id: 'spinners',
				text: 'Spinners',
				path: 'components/spinners',
				icon: 'RotateRight',
			},
			table: {
				id: 'table',
				text: 'Table',
				path: 'components/table',
				icon: 'TableChart',
			},
			toasts: {
				id: 'toasts',
				text: 'Toasts',
				path: 'components/toasts',
				icon: 'RotateRight',
			},
			tooltip: {
				id: 'tooltip',
				text: 'Tooltip',
				path: 'components/tooltip',
				icon: 'Assistant',
			},
		},
	},
	utilities: {
		id: 'utilities',
		text: 'Utilities',
		path: 'utilities',
		icon: 'Support',
		subMenu: {
			api: {
				id: 'api',
				text: 'API',
				path: 'utilities/api',
				icon: 'Api',
			},
			background: {
				id: 'background',
				text: 'Background',
				path: 'utilities/background',
				icon: 'FormatColorFill',
			},
			borders: {
				id: 'borders',
				text: 'Borders',
				path: 'utilities/borders',
				icon: 'BorderStyle',
			},
			colors: {
				id: 'colors',
				text: 'Colors',
				path: 'utilities/colors',
				icon: 'InvertColors',
			},
			display: {
				id: 'display',
				text: 'Display',
				path: 'utilities/display',
				icon: 'LaptopMac',
			},
			flex: {
				id: 'flex',
				text: 'Flex',
				path: 'utilities/flex',
				icon: 'SettingsOverscan',
			},
			float: {
				id: 'float',
				text: 'Float',
				path: 'utilities/float',
				icon: 'ViewArray',
			},
			interactions: {
				id: 'interactions',
				text: 'Interactions',
				path: 'utilities/interactions',
				icon: 'Mouse',
			},
			overflow: {
				id: 'overflow',
				text: 'Overflow',
				path: 'utilities/overflow',
				icon: 'TableRows',
			},
			position: {
				id: 'position',
				text: 'Position',
				path: 'utilities/position',
				icon: 'Adjust',
			},
			shadows: {
				id: 'shadows',
				text: 'Shadows',
				path: 'utilities/shadows',
				icon: 'ContentCopy',
			},
			sizing: {
				id: 'sizing',
				text: 'Sizing',
				path: 'utilities/sizing',
				icon: 'Straighten',
			},
			spacing: {
				id: 'spacing',
				text: 'Spacing',
				path: 'utilities/spacing',
				icon: 'SpaceBar',
			},
			text: {
				id: 'text',
				text: 'Text',
				path: 'utilities/text',
				icon: 'TextFields',
			},
			verticalAlign: {
				id: 'vertical-align',
				text: 'Vertical Align',
				path: 'utilities/vertical-align',
				icon: 'VerticalAlignCenter',
			},
			visibility: {
				id: 'visibility',
				text: 'Visibility',
				path: 'utilities/visibility',
				icon: 'Visibility',
			},
		},
	},
	extra: {
		id: 'extra',
		text: 'Extra Library',
		icon: 'Extension',
	},
	icons: {
		id: 'icons',
		text: 'Icons',
		path: 'icons',
		icon: 'Grain',
		notification: 'success',
		subMenu: {
			icon: {
				id: 'icon',
				text: 'Icon',
				path: 'icons/icon',
				icon: 'Lightbulb',
			},
			material: {
				id: 'material',
				text: 'Material',
				path: 'icons/material',
				icon: 'Verified',
			},
			bootstrapIcon: {
				id: 'bootstrapIcon',
				text: 'Bootstrap Icon',
				path: 'icons/bootstrap-icon',
				icon: 'BootstrapFill',
			},
		},
	},
	charts: {
		id: 'charts',
		text: 'Charts',
		path: 'charts',
		icon: 'AreaChart',
		notification: 'success',
		subMenu: {
			chartsUsage: {
				id: 'chartsUsage',
				text: 'General Usage',
				path: 'charts/general-usage',
				icon: 'Description',
			},
			chartsSparkline: {
				id: 'chartsSparkline',
				text: 'Sparkline',
				path: 'charts/sparkline',
				icon: 'AddChart',
			},
			chartsLine: {
				id: 'chartsLine',
				text: 'Line',
				path: 'charts/line',
				icon: 'ShowChart',
			},
			chartsArea: {
				id: 'chartsArea',
				text: 'Area',
				path: 'charts/area',
				icon: 'AreaChart',
			},
			chartsColumn: {
				id: 'chartsColumn',
				text: 'Column',
				path: 'charts/column',
				icon: 'BarChart',
			},
			chartsBar: {
				id: 'chartsBar',
				text: 'Bar',
				path: 'charts/bar',
				icon: 'StackedBarChart',
			},
			chartsMixed: {
				id: 'chartsMixed',
				text: 'Mixed',
				path: 'charts/mixed',
				icon: 'MultilineChart',
			},
			chartsTimeline: {
				id: 'chartsTimeline',
				text: 'Timeline',
				path: 'charts/timeline',
				icon: 'WaterfallChart',
			},
			chartsCandleStick: {
				id: 'chartsCandleStick',
				text: 'Candlestick',
				path: 'charts/candlestick',
				icon: 'Cake',
			},
			chartsBoxWhisker: {
				id: 'chartsBoxWhisker',
				text: 'Box Whisker',
				path: 'charts/box-whisker',
				icon: 'SportsMma',
			},
			chartsPieDonut: {
				id: 'chartsPieDonut',
				text: 'Pie & Donut',
				path: 'charts/pie-donut',
				icon: 'PieChart',
			},
			chartsRadar: {
				id: 'chartsRadar',
				text: 'Radar',
				path: 'charts/radar',
				icon: 'BrightnessLow',
			},
			chartsPolar: {
				id: 'chartsPolar',
				text: 'Polar',
				path: 'charts/polar',
				icon: 'TrackChanges',
			},
			chartsRadialBar: {
				id: 'chartsRadialBar',
				text: 'Radial Bar',
				path: 'charts/radial-bar',
				icon: 'DonutLarge',
			},
			chartsBubble: {
				id: 'chartsBubble',
				text: 'Bubble',
				path: 'charts/bubble',
				icon: 'BubbleChart',
			},
			chartsScatter: {
				id: 'chartsScatter',
				text: 'Scatter',
				path: 'charts/scatter',
				icon: 'ScatterPlot',
			},
			chartsHeatMap: {
				id: 'chartsHeatMap',
				text: 'Heat Map',
				path: 'charts/heat-map',
				icon: 'GridOn',
			},
			chartsTreeMap: {
				id: 'chartsTreeMap',
				text: 'Tree Map',
				path: 'charts/tree-map',
				icon: 'AccountTree',
			},
		},
	},
	notification: {
		id: 'notification',
		text: 'Notification',
		path: 'notifications',
		icon: 'NotificationsNone',
	},
	hooks: {
		id: 'hooks',
		text: 'Hooks',
		path: 'hooks',
		icon: 'Anchor',
	},
};

export const productsMenu = {
	companyA: { id: 'companyA', text: 'Company A', path: 'grid-pages/products', subMenu: null },
	companyB: { id: 'companyB', text: 'Company B', path: '/', subMenu: null },
	companyC: { id: 'companyC', text: 'Company C', path: '/', subMenu: null },
	companyD: { id: 'companyD', text: 'Company D', path: '/', subMenu: null },
};
