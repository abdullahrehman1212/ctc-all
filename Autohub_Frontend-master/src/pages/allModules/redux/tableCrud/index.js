// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit';

export const addProjectSlice = createSlice({
	name: 'tableCrud',
	initialState: {
		data: {
			level1: {
				level2: {
					parameter: 10,
				},
			},
			kitManagement: {
				defineKit: {
					tableData: [],
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// itemsManagementModule
			itemsManagementModule: {
				itemParts: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				items: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				category: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				subcategory: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				partModel: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				applications: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				dimensions: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				models: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				machines: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				companies: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				make: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// itemsManagementModule End

			// sales
			salesManagementModule: {
				sales: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				
				quotation: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},

			},
			// sales Ends
			// expense
			expenseManagementModule: {
				expense: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// expense Ends
			// transfer
			transferManagementModule: {
				list: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// transfer Ends

			// report
			reportManagementModule: {
				report1: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				report2: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				report3: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				report5: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				report6: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				report7: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// report Ends

			// inventory
			inventoryManagementModule: {
				inventory: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				parts: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				kits: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				purchase: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				racks: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				shelves: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},

				history: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				cost: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// inventory Ends

			// Suppliers
			suppliersManagementModule: {
				manage: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				// ledger: {
				// 	tableData: null,
				// 	tableDataLoading: false,
				// 	pageNo: 1,
				// 	perPage: 10,
				// 	searchNo: null,
				// 	others: null,
				// },
			},
			// suppliers Ends

			// Customers
			customersManagementModule: {
				manage: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				// ledger: {
				// 	tableData: null,
				// 	tableDataLoading: false,
				// 	pageNo: 1,
				// 	perPage: 10,
				// 	searchNo: null,
				// 	others: null,
				// },
			},
			// Customers Ends

			// Stores
			storesManagementModule: {
				manage: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			// stores Ends
			// purchase order
			purchaseOrderManagement: {
				purchaseList: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				returnPurchaseList: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				simplePurchase: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
		},
		cookies: {
			userRights: [],
			branchName: 'null',
		},
	},
	reducers: {
		updateSingleState: (state, action) => {
			return {
				...state,
				data: {
					...state.data,
					[action.payload[1]]: {
						...state.data[action.payload[1]],
						[action.payload[2]]: {
							...state.data[action.payload[1]][action.payload[2]],
							[action.payload[3]]: action.payload[0],
						},
					},
				},
			};
		},
		updateCookies: (state, action) => {
			return {
				...state,
				cookies: {
					...state.cookies,
					[action.payload[1]]: action.payload[0],
				},
			};
		},
		// eslint-disable-next-line no-unused-vars
		resetStore: (state, action) => {
			return {
				data: {
					inventory: {
						items: {
							tableData: null,
							tableDataLoading: false,
							pageNo: 1,
							perPage: 10,
						},
					},
				},
				cookies: {
					userRights: [],
					branchName: 'null',
				},
			};
		},
	},
});

export const { updateWholeObject, updateSingleState, resetStore, updateCookies } =
	addProjectSlice.actions;
export default addProjectSlice.reducer;
