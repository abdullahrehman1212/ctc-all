// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports
import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Cookies from 'js-cookie';
import apiClient from '../../../../baseURL/apiClient';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';

import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const validate = (values) => {
	let errors = {};

	if (values.tax_type === 2 && values.sale_type === 1) {
		if (values.bank_amount_received + values.amount_received > values.total_after_gst) {
			errors.bank_amount_received = 'Amount exceeded';
			errors.amount_received = 'Amount exceeded';
		}
		if (values.bank_amount_received + values.amount_received < values.total_after_gst) {
			errors.bank_amount_received = 'Insufficent Amount';
			errors.amount_received = 'Insufficent Amount';
		}

		if (values.amount_received && !values.account_id) {
			errors.account_id = 'Required';
		}
		if (values.bank_amount_received && !values.bank_account_id) {
			errors.bank_account_id = 'Required';
		}
	} else if (values.tax_type === 1 && values.sale_type === 1) {
		if (values.bank_amount_received + values.amount_received > values.total_after_discount) {
			errors.bank_amount_received = 'Amount exceeded';
			errors.amount_received = 'Amount exceeded';
		}
		if (values.bank_amount_received + values.amount_received < values.total_after_discount) {
			errors.bank_amount_received = 'Insufficent Amount';
			errors.amount_received = 'Insufficent Amount';
		}
	}
	if (values.amount_received && !values.account_id) {
		errors.account_id = 'Required';
	}
	if (values.bank_amount_received && !values.bank_account_id) {
		errors.bank_account_id = 'Required';
	}

	if (values.sale_type === 1) {
		if (!values.walk_in_customer_name) {
			errors.walk_in_customer_name = 'Required';
		}
		if (!values.walk_in_customer_phone) {
			errors.walk_in_customer_phone = 'Required';
		}
		if (!values.walk_in_customer_phone === 11) {
			errors.walk_in_customer_phone = 'invalid Phone No';
		}
	}
	if (values.sale_type === 2) {
		if (!values.customer_id) {
			errors.customer_id = 'Required';
		}
	}
	if (!values.store_id) {
		errors.store_id = 'Required';
	}
	if (!values.date) {
		errors.date = 'Required';
	}
	if (values.total_after_discount < 0) {
		errors.total_after_discount = 'More Discount than actual Amount';
	}
	if (!values.childArray.length > 0) {
		errors.childArray = 'Add Items In List';
	}

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required',
			};
		}

		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
		if (!Number(data.rate) > 0) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'Required',
			};
		}
		if (data.quantity > data.qty_available) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Insufficient Qty',
			};
		}
	});
	return errors;
};

// eslint-disable-next-line react/prop-types
const Invoice = ({ editingItem, handleStateReceive }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [showStats, setShowStats] = useState(true);
	const [staterefresh, setStateRefresh] = useState(false);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState(true);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [storesOptions, setStoresOptions] = useState();
	const [storesOptionsLoading, setStoresOptionsLoading] = useState(false);
	const formatChars = {
		q: '[0123456789]',
	};
	const formik = useFormik({
		initialValues: {
			...editingItem,

			bank_amount_received: '',
			amount_received: '',
			account_id: '',
			bank_account_id: '',
		},

		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};

	const saleTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Walk in Customer',
		},
		{
			id: 2,
			value: 2,
			label: 'Registered Customer',
		},
	];
	// const taxTypesOptions = [
	// 	{
	// 		id: 1,
	// 		value: 1,
	// 		label: 'Without GST',
	// 	},
	// 	{
	// 		id: 2,
	// 		value: 2,
	// 		label: 'With GST',
	// 	},
	// ];
	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);

	todayDate = `${yyyy}-${mm}-${dd}`;
	const submitForm = (data) => {
		// Validate required fields before sending
		if (data.sale_type === 2 && !data.customer_id) {
			setIsLoading(false);
			return;
		}

		if (!data.store_id) {
			setIsLoading(false);
			return;
		}

		// Additional validation for registered customers
		if (data.sale_type === 2 && !data.customer_name) {
			setIsLoading(false);
			return;
		}

		// Validate child array items
		if (!data.childArray || data.childArray.length === 0) {
			setIsLoading(false);
			return;
		}

		// Check if any child item has null item_id
		const hasNullItemId = data.childArray.some((item) => !item.item_id);
		if (hasNullItemId) {
			setIsLoading(false);
			return;
		}

		apiClient
			.post(`/generateInvoiceQuotation`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					handleStateReceive(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
				}
			})
			.catch(() => {
				setIsLoading(false);
				// Error handled silently
			});
	};

	useEffect(() => {
		apiClient.get(`/getAccountsBySubGroup?coa_sub_group_id=5`).then((response) => {
			const rec = response.data.coaAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
				// manufacturerOptions,
			}));
			setCashAccountsOptions(rec);

			setCrAccountLoading(false);
		});

		// eslint-disable-next-line no-console

		apiClient.get(`/getAccountsBySubGroup?coa_sub_group_id=6`).then((response) => {
			const rec = response.data.coaAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
				// manufacturerOptions,
			}));
			setCashAccountsOptions1(rec);

			setCrAccountLoading1(false);
		});

		// eslint-disable-next-line no-console
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		/* 	apiClient.get(`/getPersonsDropDown?person_type=4`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSaleRepDropDownn(rec);
			setSaleRepDropDownLoading(false);
		}); */

		// eslint-disable-next-line no-console
		apiClient.get(`getCustomersDropdown`).then((response) => {
			const rec = (response.data?.customers || []).map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console

		apiClient.get(`getMachinePartsModelsDropDown`).then((response) => {
			const rec = (response.data?.data || []).map(({ id, name, sale_price }) => ({
				id,
				value: id,
				label: name,
				retail: Number(sale_price) || 0,
			}));
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
		// .catch((err) => {
		//
		// 	if (err.response.status === 401) {
		// 		showNotification(_titleError, err.response.data.message, 'Danger');
		// 	}
		// });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getExistingQty = (idx, val) => {
		if (val) {
			formik.setFieldValue(`childArray[${idx}].qty_available_loading`, true);

			apiClient.get(`/itemInventory?item_id=${val ? val.id : ''}`).then((response) => {
				formik.setFieldValue(`childArray[${idx}].qty_available_loading`, false);
				// formik.setFieldValue(`childArray[${idx}].rate`, response.data.data?.sale_price ?? 0);
				formik.setFieldValue(
					`childArray[${idx}].qty_available`,
					response.data.itemsInv.item_avaiable_inventory?.item_available ?? 0,
				);
				// formik.setFieldValue(
				// 	`childArray[${idx}].avg_price`,
				// 	response.data.AvgPrice?.AvgCost ?? 0,
				// );
				// formik.setFieldValue(
				// 	`childArray[${idx}].last_sale_price`,
				// 	response.data.data.last_sale_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`childArray[${idx}].min_price`,
				// 	response.data.data.min_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`childArray[${idx}].max_price`,
				// 	response.data.data.max_price ?? 0,
				// );
			});

			// eslint-disable-next-line no-console
		}
	};

	const calculateTotal = async () => {
		const arr = formik.values.childArray || [];
		const newChildArray = arr.map((data) => {
			const quantity = Number(data.quantity) || 0;
			const rate = Number(data.rate) || 0;
			const itemDiscountPer = Number(data.item_discount_per) || 0;

			const total = quantity * rate;
			const itemDiscount = (total * itemDiscountPer) / 100;
			const itemTotalAfterDiscount = total - itemDiscount;

			return {
				...data,
				total,
				item_discount: itemDiscount,
				item_total_after_discount: itemTotalAfterDiscount,
			};
		});

		const p = newChildArray.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
		const d = newChildArray.reduce((acc, v) => acc + (Number(v.item_discount) || 0), 0);

		const totalAfterDiscount = p - d;
		const gstPercentage = Number(formik.values.gst_percentage) || 0;
		const gst = totalAfterDiscount * (gstPercentage / 100);
		const totalAfterGst = totalAfterDiscount + gst;

		formik.setValues({
			...formik.values,
			childArray: newChildArray,
			discount: d,
			total_amount: p,
			total_after_discount: totalAfterDiscount,
			gst,
			total_after_tax: totalAfterGst,
			total_after_gst: totalAfterGst,
		});

		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 10));
	};

	useEffect(() => {
		setStoresOptionsLoading(true);

		// First, try to get user's store from cookie data
		try {
			const userData = Cookies.get('Data1') ? JSON.parse(Cookies.get('Data1')) : null;

			if (userData && userData.store_id) {
				// Set store_id from user data
				formik.setFieldValue('store_id', userData.store_id);
				formik.setFieldValue('store_name', userData.store_name || 'User Store');
				setStoresOptionsLoading(false);
				return;
			}
		} catch (error) {
			// Silent error handling - fallback to API call
		}

		// If no store_id in user data, fetch from API
		apiClient
			.get(`/getStoredropdown?store_type_id=2`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				// Only set store_id if it's not already set from editingItem
				if (!formik.values.store_id) {
					formik.setFieldValue('store_id', rec[0] !== null && rec[0].id);
					formik.setFieldValue('store_name', rec[0] !== null && rec[0].label);
				}
				setStoresOptions(rec);
				setStoresOptionsLoading(false);
			})
			.catch((err) => {
				setStoresOptionsLoading(false);
				if (err.response?.status === 401) {
					// Handle unauthorized access silently
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		if (formik.values.tax_type === 1) {
			formik.setFieldValue('gst_percentage', 0);
		} else {
			formik.setFieldValue('gst_percentage', 18);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.tax_type]);
	useEffect(() => {
		formik.setFieldValue(
			`gst`,
			(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
		formik.setFieldValue(
			`total_after_gst`,
			Number(formik.values.total_after_discount) +
				(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.gst_percentage]);
	useEffect(() => {
		const calculate = async () => {
			await calculateTotal();
			// code to run after the calculations are done
		};

		calculate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculateTotal]);

	// Ensure customer name is set when customer_id changes
	useEffect(() => {
		if (
			formik.values.sale_type === 2 &&
			formik.values.customer_id &&
			!formik.values.customer_name
		) {
			// Find the customer name from the dropdown options
			const selectedCustomer = customerDropDown.find(
				(customer) => customer.value === formik.values.customer_id,
			);
			if (selectedCustomer) {
				formik.setFieldValue('customer_name', selectedCustomer.label);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.customer_id, formik.values.sale_type, customerDropDown]);

	// Handle initial customer data from editingItem
	useEffect(() => {
		if (
			editingItem &&
			editingItem.sale_type === 2 &&
			editingItem.customer_id &&
			!formik.values.customer_name
		) {
			// If customer data exists in editingItem, use it
			if (editingItem.customer_name) {
				formik.setFieldValue('customer_name', editingItem.customer_name);
			} else if (editingItem.customer && editingItem.customer.name) {
				formik.setFieldValue('customer_name', editingItem.customer.name);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editingItem]);
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-start'>
						<div className='row g-2  d-flex justify-content-center align-items-top'>
							<div className='col-md-1 d-flex justify-content-center align-items-top'>
								<h3>Type:</h3>
							</div>
							<div className='col-md-3'>
								<FormGroup label='' id='name'>
									<Select
										className='col-md-12'
										classNamePrefix='select'
										menuIsOpen={false}
										isSearchable={false}
										options={saleTypesOptions}
										// isLoading={saleTypesOptionsLoading}
										value={
											formik.values.sale_type
												? saleTypesOptions?.find(
														(c) => c.value === formik.values.sale_type,
												  )
												: null
										}
										onChange={(val) => {
											formik.setFieldValue('sale_type', val ? val.id : '');
											formik.setFieldValue('customer_id', '');
											formik.setFieldValue('walk_in_customer_name', '');
										}}
									/>
								</FormGroup>
							</div>
							{/* <div className='col-md-1 d-flex justify-content-center align-items-top'>
								<h3>Tax:</h3>
							</div> */}
							{/* <div className='col-md-3'>
								<FormGroup label='' id='name'>
									<Select
										className='col-md-12'
										classNamePrefix='select'
										options={taxTypesOptions}
										// isLoading={saleTypesOptionsLoading}
										value={
											formik.values.tax_type
												? taxTypesOptions?.find(
														(c) => c.value === formik.values.tax_type,
												  )
												: null
										}
										onChange={(val) => {
											formik.setFieldValue('tax_type', val ? val.id : '');
										}}
									/>
								</FormGroup>
							</div> */}
						</div>
					</div>
					<hr />
					<div className='row g-2  d-flex justify-content-start'>
						{formik.values.sale_type === 2 ? (
							<div className='col-md-5'>
								<FormGroup label='Customer' id='customer_id'>
									<Select
										className='col-md-10'
										menuIsOpen={false}
										isSearchable={false}
										isLoading={customerDropDownLoading}
										options={customerDropDown}
										value={
											formik.values.customer_id
												? customerDropDown?.find(
														(c) =>
															c.value === formik.values.customer_id,
												  )
												: null
										}
										onChange={(val) => {
											formik.setFieldValue('customer_id', val ? val.id : '');
											formik.setFieldValue(
												'customer_name',
												val ? val.label : '',
											);
										}}
										invalidFeedback={formik.errors.customer_id}
									/>
								</FormGroup>
							</div>
						) : (
							<div className='col-md-4'>
								<div className='row g-2  d-flex justify-content-start'>
									<FormGroup
										id='walk_in_customer_name'
										label='Customer Name'
										className='col-md-6'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.walk_in_customer_name}
											isValid={formik.isValid}
											isTouched={formik.touched.walk_in_customer_name}
											invalidFeedback={formik.errors.walk_in_customer_name}
										/>
									</FormGroup>
									<FormGroup
										id='walk_in_customer_phone'
										label='Customer Phone No'
										className='col-md-6'>
										<Input
											readOnly
											formatChars={formatChars}
											placeholder='03111111111'
											mask='03qqqqqqqqq'
											onWheel={(e) => e.target.blur()}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.walk_in_customer_phone}
											isValid={formik.isValid}
											isTouched={formik.touched.walk_in_customer_phone}
											invalidFeedback={formik.errors.walk_in_customer_phone}
										/>
									</FormGroup>
								</div>
							</div>
						)}
						{/* <div className='col-md-4'>
							<FormGroup id='sales_rep_id' label='Sales Rep' className='col-md-12'>
								<Select
									className='col-md-12'
									isClearable
									isLoading={saleRepDropDownLoading}
									options={saleRepDropDown}
									value={
										formik.values.sales_rep_id
											? saleRepDropDown?.find(
													(c) => c.value === formik.values.sales_rep_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('sales_rep_id', val ? val.id : '');
									}}
									invalidFeedback={formik.errors.sales_rep_id}
								/>
							</FormGroup>
							{formik.errors.sales_rep_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#ef4444',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.sales_rep_id}
								</p>
							)}
						</div> */}
						<div className='col-md-3'>
							<FormGroup id='date' label='Date'>
								<Input
									type='date'
									readOnly
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.date}
									isValid={formik.isValid}
									isTouched={formik.touched.date}
									invalidFeedback={formik.errors.date}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='store_id' label='Store'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
									options={storesOptions}
									isLoading={storesOptionsLoading}
									value={
										formik.values.store_id
											? storesOptions?.find(
													(c) => c.value === formik.values.store_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('store_id', val ? val.id : '');
										formik.setFieldValue('store_name', val ? val.label : '');
									}}
									invalidFeedback={formik.errors.store_id}
								/>
							</FormGroup>
						</div>
						<div className='col-md-5'>
							<FormGroup id='remarks' label='Remarks' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.remarks}
									isValid={formik.isValid}
									isTouched={formik.touched.remarks}
									invalidFeedback={formik.errors.remarks}
								/>
							</FormGroup>
							{formik.errors.remarks && (
								<p
									style={{
										color: '#ef4444',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.remarks}
								</p>
							)}
						</div>
						<div className='col-md-2'>
							<FormGroup id='delivered_to' label='Delivered To' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.delivered_to}
									isValid={formik.isValid}
									isTouched={formik.touched.delivered_to}
									invalidFeedback={formik.errors.delivered_to}
								/>
							</FormGroup>
							{formik.errors.delivered_to && (
								<p
									style={{
										color: '#ef4444',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.delivered_to}
								</p>
							)}
						</div>
					</div>
					<hr />
					{/* <CardBody className='table-responsive'> */}
					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-4'>Product</th>
								<th className='col-md-1'>In Stock</th>
								<th className='col-md-2'>Qty</th>
								<th className='col-md-2'>Rate</th>
								<th className='col-md-2'>Total</th>
								<th
									className='col-md-1'
									// role='button'
									// tabIndex={0}
									onClick={() => {
										if (showStats === false) {
											setShowStats(true);
										} else {
											setShowStats(false);
										}
									}}>
									Remove
								</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.childArray.length > 0 &&
								formik.values.childArray.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-4 border-start border-end '>
											<FormGroup id={`childArray[${index}].item_id`}>
												<Select
													styles={customStyles}
													className='col-md-12'
													classNamePrefix='select'
													menuIsOpen={false}
													isSearchable={false}
													components={{
														DropdownIndicator: () => null,
														IndicatorSeparator: () => null,
													}}
													options={itemOptions}
													isLoading={itemOptionsLoading}
													value={
														formik.values.childArray[index].item_id
															? itemOptions.find(
																	(c) =>
																		c.value ===
																		formik.values.childArray[
																			index
																		].item_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_id`,
															val ? val.id : '',
														);

														formik.setFieldValue(
															`childArray[${index}].item_name`,
															val !== null && val.label,
														);

														getExistingQty(index, val);
													}}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																	?.item_id
															: ''
													}
													invalidFeedback={
														formik.errors[
															`childArray[${index}].item_id`
														]
													}
												/>
											</FormGroup>
											{formik.errors[`childArray[${index}]item_id`] && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#ef4444',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors[`childArray[${index}]item_id`]}
												</p>
											)}
										</td>

										<td className='col-md-1 border-start border-end '>
											<FormGroup
												id={`childArray[${index}].qty_available`}
												label=''
												className='col-md-12'>
												<h5>
													{items.qty_available_loading ? (
														<h5>...</h5>
													) : (
														<>
															<p className='fs-6'>
																{items.qty_available ?? 0}
															</p>

															<p>
																{showStats && (
																	<div className='small text-muted'>
																		Avg Cost:
																		<br />
																		{items.avg_price.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 4,
																			},
																		) ?? 0}
																	</div>
																)}
															</p>
														</>
													)}
												</h5>
											</FormGroup>
										</td>

										<td className='col-md-2 border-start border-end '>
											<FormGroup
												id={`childArray[${index}].quantity`}
												label=''>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													min='0'
													onChange={(val) => {
														const inputValue = val.target.value;
														if (inputValue === '0') {
															// Quantity cannot be 0
															formik.setFieldError(
																`childArray[${index}].quantity`,
																'Quantity cannot be 0',
															);
														} else {
															formik.setFieldValue(
																`childArray[${index}].quantity`,
																inputValue,
															);
															// Trigger any necessary calculations or updates
															setTriggerCalculateTotal(
																triggerCalculateTotal + 1,
															);
														}
													}}
													isTouched
													value={formik.values.childArray[index].quantity}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[
															`childArray[${index}]quantity`
														]
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-2 border-start border-end '>
											<FormGroup id={`childArray[${index}].rate`} label=''>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].rate`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
													isTouched
													value={formik.values.childArray[index].rate}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[`childArray[${index}]rate`]
													}
												/>
											</FormGroup>
											{/* <FormGroup
												id={`childArray[${index}].item_discount_per`}
												label='Discount%'>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_discount_per`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
													isTouched
													value={
														formik.values.childArray[index]
															.item_discount_per
													}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[
															`childArray[${index}]item_discount_per`
														]
													}
												/>
											</FormGroup> */}
										</td>
										<td className='col-md-2 mt-1 border-start border-end '>
											{items.total?.toLocaleString(undefined, {
												maximumFractionDigits: 4,
											}) ?? 0}
										</td>
										<td className='col-md-1  '>
											<Button
												// isDisable={
												// 	formik.values.childArray.length === 1
												// }
												icon='cancel'
												color='danger'
												onClick={() => {
													removeRow(index);

													setTriggerCalculateTotal(
														triggerCalculateTotal + 1,
													);
												}}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<hr />
					<div className='row g-4 d-flex align-items-top'>
						<div className='col-md-3'>
							<FormGroup id='total_amount' label='Total Amount' className='col-md-12'>
								<Input
									value={
										formik.values.total_amount
											? formik.values.total_amount.toLocaleString(undefined, {
													maximumFractionDigits: 4,
											  })
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.total_amount}
								/>
							</FormGroup>
						</div>
						{/* <div className='col-md-3'>
							<FormGroup id='discount' label='Discount' className='col-md-12'>
								<Input
									value={
										formik.values.discount
											? formik.values.discount.toLocaleString(undefined, {
													maximumFractionDigits: 4,
											  })
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.discount}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup
								id='total_after_discount'
								label='Amount After Discount'
								className='col-md-12'>
								<Input
									value={
										formik.values.total_after_discount
											? formik.values.total_after_discount.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 4,
													},
											  )
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.total_after_discount}
								/>
							</FormGroup>
						</div> */}
					</div>
					{/* <div className='row g-4 d-flex align-items-top'>
						{formik.values.tax_type === 2 && (
							<>
								<div className='col-md-3'>
									<FormGroup
										id='gst_percentage'
										label='GST in %'
										className='col-md-12'>
										<Input
											onChange={(val) => {
												formik.setFieldValue(
													`gst_percentage`,
													val.target.value,
												);
												// formik.setFieldValue(
												// 	`gst`,
												// 	(formik.values
												// 		.total_after_discount *
												// 		val.target.value) /
												// 		100,
												// );
												// formik.setFieldValue(
												// 	`total_after_gst`,
												// 	Number(
												// 		formik.values
												// 			.total_after_discount,
												// 	) +
												// 		(formik.values
												// 			.total_after_discount *
												// 			val.target.value) /
												// 			100,
												// );
											}}
											onBlur={formik.handleBlur}
											value={
												formik.values.gst_percentage
													? formik.values.gst_percentage.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 4,
															},
													  )
													: 0
											}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup readOnly id='GST' label='GST' className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.gst.toLocaleString(undefined, {
												maximumFractionDigits: 4,
											})}
											isValid={formik.isValid}
											isTouched={formik.touched.gst}
											invalidFeedback={formik.errors.gst}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup
										id='total_after_gst'
										label='Amount with GST'
										className='col-md-12'>
										<Input
											value={
												formik.values.total_after_gst
													? formik.values.total_after_gst.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 4,
															},
													  )
													: 0
											}
											disabled
											readOnly
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.total_after_gst}
										/>
									</FormGroup>
								</div>
							</>
						)}
					</div> */}
					<div className='row g-4 d-flex align-items-top mt-3'>
						<div className='col-md-3'>
							<FormGroup
								id='amount_received'
								label='Received Amount (Cash)'
								className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onBlur={formik.handleBlur}
									// readOnly={formik.values.sale_type === 1}
									onChange={formik.handleChange}
									value={formik.values.amount_received}
									isValid={formik.isValid}
									isTouched={formik.touched.amount_received}
									invalidFeedback={formik.errors.amount_received}
								/>
							</FormGroup>
						</div>
						<div className='col-md-4'>
							<FormGroup id='account_id' label='Cash Account'>
								<Select
									className='col-md-12 '
									classNamePrefix='select'
									options={cashAccountsOptions}
									isLoading={crAccountLoading}
									value={
										formik.values.account_id &&
										cashAccountsOptions.find(
											(c) => c.value === formik.values.account_id,
										)
									}
									onChange={(val) => {
										formik.setFieldValue('account_id', val.id);
										formik.setFieldValue(
											'coa_sub_group_id',
											val.coa_sub_group_id,
										);
										if (val.coa_sub_group_id !== 2) {
											formik.setFieldValue('cheque_no', '');
										}
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.account_id}
									invalidFeedback={formik.errors.account_id}
								/>
							</FormGroup>
							{formik.errors.account_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#ef4444',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.account_id}
								</p>
							)}
						</div>
					</div>
					<div className='row g-4 d-flex align-items-top'>
						<div className='col-md-3'>
							<FormGroup
								id='bank_amount_received'
								label='Received Amount (Bank)'
								className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onBlur={formik.handleBlur}
									// readOnly={formik.values.sale_type === 1}
									onChange={formik.handleChange}
									value={formik.values.bank_amount_received}
									isValid={formik.isValid}
									isTouched={formik.touched.bank_amount_received}
									invalidFeedback={formik.errors.bank_amount_received}
								/>
							</FormGroup>
						</div>
						<div className='col-md-4'>
							<FormGroup id='bank_account_id' label='Bank Account'>
								<Select
									className='col-md-12 '
									classNamePrefix='select'
									options={cashAccountsOptions1}
									isLoading={crAccountLoading1}
									value={
										formik.values.bank_account_id &&
										cashAccountsOptions1.find(
											(c) => c.value === formik.values.bank_account_id,
										)
									}
									onChange={(val) => {
										formik.setFieldValue('bank_account_id', val.id);
										formik.setFieldValue(
											'coa_sub_group_id',
											val.coa_sub_group_id,
										);
										if (val.coa_sub_group_id !== 2) {
											formik.setFieldValue('cheque_no', '');
										}
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.bank_account_id}
									invalidFeedback={formik.errors.bank_account_id}
								/>
							</FormGroup>
							{formik.errors.bank_account_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#ef4444',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.bank_account_id}
								</p>
							)}
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							isOutline
							onClick={() => {
								setStateRefresh(!staterefresh);
								formik.resetForm();
							}}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							className='me-3'
							icon={isLoading ? undefined : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading
								? (lastSave && 'Updating') || 'Updating'
								: (lastSave && 'Update') || 'Update'}
						</Button>
					</CardFooterRight>
				</CardFooter>
			</Card>
		</div>
	);
};
Invoice.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateReceive: PropTypes.function.isRequired,
};

export default Invoice;
