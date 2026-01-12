/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import ReactSelect, { createFilter } from 'react-select';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Spinner from '../../../../components/bootstrap/Spinner';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';
import AddCustomer from './modals/addCustomer';
import Checks from '../../../../components/bootstrap/forms/Checks';

const Edit = ({ editingItem, handleStateEdit }) => {
	// eslint-disable-next-line no-console
	console.log(editingItem, "editingItem")
	const [reload, setReload] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [kitEditOptions, setItemOptions] = useState([]);
	const [editItemOptionsLoading, setEditItemOptionsLoading] = useState(true);
	const [itemOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const [storesOptions, setStoreOptions] = useState([]);
	const [storesOptionsLoading, setStoreLoading] = useState(false);

	const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility
	const [showStats, setShowStats] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen); // Toggle dropdown state
	};
	const validate = (values) => {
		let errors = {};

		if (values.tax_type === 2) {
			if (Number(values.amount_received) !== Number(values.total_after_gst))
				errors.amount_received =
					'Received amount Should be Equal to the Total amount after Gst';
		}

		// if (values.tax_type === 1) {
		// 	if (Number(values.amount_received) !== Number(values.total_after_discount))
		// 		errors.amount_received = 'Received amount Should be Equal to the Total amount ';
		// }

		if (values.tax_type === 2 && values.sale_type === 1) {
			if (values.amount_received > values.total_after_gst)
				errors.amount_received =
					'Received Amount cannot be greater than Total amount after GST';
		}

		if (values.tax_type === 1 && values.sale_type === 1) {
			if (values.amount_received > values.total_after_discount)
				errors.amount_received = 'Received Amount cannot be greater than Total amount';
		}

		if (!values.invoice_no) {
			errors.invoice_no = 'Required';
		}

		if (values.sale_type === 1) {
			if (!values.walk_in_customer_name) {
				errors.walk_in_customer_name = 'Required';
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
		// if (!values.account_id) {
		// 	errors.account_id = 'Required';
		// }

		if (values.amount_received === '') errors.amount_received = 'Required';
		if (!values.childArray.length > 0) {
			errors.childArray = 'Choose Items In list';
		}
		if (values.discount < 0) {
			errors.discount = 'Required';
		}
		if (values.total_after_discount < 0) {
			errors.total_after_discount = 'Required';
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
			// if (!data.returned_quantity > 0) {
			// 	errors = {
			// 		...errors,
			// 		[`childArray[${index}]returned_quantity`]: 'Required',
			// 	};
			// }
			if (!Number(data.price) > 0) {
				errors = {
					...errors,
					[`childArray[${index}]price`]: 'Required',
				};
			}
		});
		// console.log(errors);
		return errors;
	};
	const formik = useFormik({
		initialValues: {
			...editingItem,
			gst_percentage: (editingItem.gst / editingItem.total_after_discount) * 100,
			amount_returned: 0,
			bank_amount_received: 0,
		},
		deduction: 0,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const updateTotals = () => {
		const childArray = formik.values.childArray || [];

		// Calculate total amount
		const totalAmount = childArray.reduce((acc, curr) => {
			const amount = curr.amount || 0;
			return acc + Number(amount);
		}, 0);

		// Calculate total after discount
		const discount = formik.values.discount || 0;
		const totalAfterDiscount = totalAmount - Number(discount);

		formik.setValues({
			...formik.values,
			total_amount: totalAmount,
			total_after_discount: totalAfterDiscount,
		});
	};

	const removeRow = (index) => {
		const childArray = formik.values.childArray || [];

		// Remove row from childArray
		childArray.splice(index, 1);

		// Update formik values and trigger validation
		formik.setFieldValue('childArray', childArray);
		formik.validateForm();

		// Recalculate totals
		updateTotals();
	};
	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// eslint-disable-next-line no-console
	console.log(formik, "formik")
	const refreshDropdowns = (index) => {
		setCustomerDropDownLoading(true);
		setCrAccountLoading(true);

		apiClient
			.get(`/getAccountsBySubGroup?coa_sub_group_id=5`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions(rec);
				setCrAccountLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getPersons?person_type_id=1`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setCustomerDropDown(rec);
				setCustomerDropDownLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	};
	const submitForm = (data) => {
		// console.log('data:::', data);
		apiClient
			// .post(`/returnSale`, data)
			.post(`/updateSale`, data)

			.then((res) => {
				// console.log('received PO', res.data);
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setIsLoading(false);
			});
	};

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
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
	const taxTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Without GST',
		},
		{
			id: 2,
			value: 2,
			label: 'With GST',
		},
	];

	useEffect(() => {
		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				// console.log('bmmmmkkkk::', response.data);
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setItemOptions(rec);
				setEditItemOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => { });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStoreLoading(true);
		apiClient
			.get(`/getStoredropdown?store_type_id=2`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreOptions(rec);
				setStoreLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	useEffect(() => {
		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				// console.log(response)
				setKitOptions(rec);
				setKitOptionsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	}, []);

	const calculateTotal = () => {
		const p =
			formik.values.childArray !== null
				? Number(
					formik.values.childArray?.reduce(
						// eslint-disable-next-line no-return-assign
						(a, v) => (a += parseFloat(v ? v.total ?? 0 : 0)),
						0,
					),
				)
				: 0;
		formik.values.total_amount = p;
		formik.values.total_after_discount = Number(p ?? 0) - Number(formik.values.discount ?? 0);
		formik.values.gst =
			(Number(p ?? 0) - Number(formik.values.discount ?? 0)) *
			(Number(formik.values.gst_percentage ?? 0) / 100);
		formik.values.total_after_gst =
			Number(p ?? 0) - Number(formik.values.discount ?? 0) + Number(formik.values.gst ?? 0);
		// //  formik.setFieldValue('total', price);
		// console.log('amount', p);
	};

	useEffect(() => {
		if (editingItem && editingItem.childArray.length > 0 && itemOptions.length > 0) {
			editingItem.childArray.forEach((childItem, index) => {
				const filterOption = itemOptions.find((item) => item.id === childItem.item_id);

				if (filterOption) {
					getExistingQty(index, filterOption, true);
				}
			});
		}
	}, [editingItem, itemOptions]);

	useEffect(() => {
		// let t = 0;
		let gst = 0;
		let total_after_discount = 0;
		let total_after_gst = 0;
		let amount_returned = 0;
		const t = formik.values.childArray.reduce(
			// eslint-disable-next-line no-return-assign
			(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
			0,
		);
		// console.log(t, 'jjjj');
		formik.setFieldValue('total_amount', Number(t));

		total_after_discount = Number(t - formik.values.discount);

		gst =
			(Number(t ?? 0) - Number(formik.values.discount ?? 0)) *
			(Number(formik.values.gst_percentage ?? 0) / 100);
		total_after_gst = Number(t ?? 0) - Number(formik.values.discount ?? 0) + Number(gst ?? 0);
		amount_returned = editingItem.total_after_gst - total_after_gst;
		formik.setFieldValue('total_after_discount', total_after_discount);

		formik.setFieldValue('gst', gst);
		formik.setFieldValue('total_after_gst', total_after_gst);
		formik.setFieldValue('amount_returned', amount_returned);
	}, [reload]);

	// const CalculateTotalValues = () => {
	// const t = formik.values.childArray.reduce(
	// 	// eslint-disable-next-line no-return-assign
	// 	(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
	// 	0,
	// );

	// 	formik.setFieldValue(
	// 		'total_amount',
	// 		Number(t).toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),
	// 	);
	// 	formik.setFieldValue(
	// 		'total_after_discount',
	// 		Number(t) -
	// 			Number(formik.values.discount).toLocaleString(undefined, {
	// 				maximumFractionDigits: 2,
	// 			}),
	// 	);
	// };
	const getExistingQtyForArray = (array, idx, val, keepPrice = false) => {
		if (formik.values.store_id && val) {
			formik.setFieldValue(`${array}[${idx}].qty_available_loading`, true);

			apiClient
				.get(
					`/getItemPartsOemQty?store_id=${formik.values.store_id ? formik.values.store_id : ''
					}&id=${val ? val.id : ''}`,
				)
				.then((response) => {
					const data = response.data.data || {};
					const itemInventory2 = data.item_inventory2 || {};
					const itemRacks = data.item_racks || [];
					const totalRackQuantity = itemRacks.reduce(
						(sum, rack) => sum + (rack.quantity || 0),
						0,
					);

					const totalAvailableQuantity = itemInventory2.quantity || 0;
					const noRackQuantity = totalAvailableQuantity - totalRackQuantity;

					// Prepare noRackShelvesData array
					const noRackShelvesData =
						noRackQuantity >= 0
							? {
								quantity: noRackQuantity,
								checked: true,
							}
							: {};
					formik.setFieldValue(`${array}[${idx}].qty_available_loading`, false);
					if (!keepPrice) {
						formik.setFieldValue(
							`${array}[${idx}].price`,
							response.data.data?.sale_price ?? 0,
						);
					}
					formik.setFieldValue(
						`${array}[${idx}].qty_available`,
						response.data.data.item_inventory2?.quantity ?? 0,
					);
					/* formik.setFieldValue(
						`${array}[${idx}].avg_price`,
						response.data.AvgPrice?.AvgCost ?? 0,
					); */
					formik.setFieldValue(
						`${array}[${idx}].last_sale_price`,
						response.data.data.last_sale_price ?? 0,
					);
					formik.setFieldValue(
						`${array}[${idx}].min_price`,
						response.data.data.min_price ?? 0,
					);
					formik.setFieldValue(
						`${array}[${idx}].max_price`,
						response.data.data.max_price ?? 0,
					);
					formik.setFieldValue(
						`${array}[${idx}].purchase_price`,
						response.data.data.purchase_price ?? 0,
					);
					formik.setFieldValue(
						`${array}[${idx}].racks_shelves`,
						response.data.data.item_racks ?? 0,
					);
					formik.setFieldValue(`${array}[${idx}].no_rack_shelf`, noRackShelvesData);
					// const racks = [];

					// const rackShelfData = response.data.data.item_rack_shelf;
					// formik.setFieldValue(`${array}[${idx}].rackShelfData`, rackShelfData);

					// rackShelfData?.forEach((item) => {
					// 	if (!racks.find((rack) => rack.value === item.rack_id)) {
					// 		racks.push({ value: item.rack_id, label: `Rack ${item.rack_id}` });
					// 	}
					// });
					// formik.setFieldValue(`${array}[${idx}].rack_ids`, racks);

					// setRackOptions(racks);

					setReRender(ReRender + 1);
				})
				.catch((err) => {
					// Handle errors
					// eslint-disable-next-line no-console
					console.error(err);
				});
		}
	};
	const getExistingQty = (idx, val, keepPrice = false) => {
		getExistingQtyForArray('childArray', idx, val, keepPrice);
	};

	const getRacksAndShelfData = (val, index) => {
		const storeId = val && val.store_id ? val.store_id : formik.values.store_id;

		if (val && val.id && storeId) {
			// Check if both item_id and store_id are present

			// Initialize racksRec and shelvesRec as empty arrays
			const racksRec = [];
			const shelvesRec = [];
			const racksdata = [];

			apiClient
				.get(`/getMachinePartsModelsDropDown?item_id=${val.id}&store_id=${storeId}`)
				.then((response) => {
					// eslint-disable-next-line no-console
					console.log(response);

					if (response.data && Array.isArray(response.data.item)) {
						response.data.item.forEach((item) => {
							racksRec.push(
								...item.item_racks.map((rack) => ({
									id: rack?.rack_id,
									rack_number: rack?.racks?.rack_number,
								})),
							);

							shelvesRec.push(
								...item.item_racks.map((shelf) => ({
									id: shelf.shelf_id,
									shelf_number: shelf?.shelves?.shelf_number,
								})),
							);

							racksdata.push(
								...item.item_racks.map((data) => ({
									rack_id: data?.rack_id,
									shelf_id: data?.shelf_id,
									rack_number: data?.racks?.rack_number,
									shelf_number: data?.shelves?.shelf_number,
									quantity: data?.quantity,
									checked: false,
								})),
							);
						});
					} else {
						// eslint-disable-next-line no-console
						console.error('Invalid response format:', response);
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error('Error fetching racks and shelves data:', err);
				})
				.finally(() => {

					// formik.setFieldValue(`list[${index}].item_racks`, racksRec[0].rack_number);
					formik.setFieldValue(`childArray[${index}].item_racks`, racksdata);



				});
		}
	};

	// Fetch and set last sold price for the selected customer for a given row
	const updateLastSoldPriceForCustomer = (itemRowIndex, itemId) => {
		if (formik.values.sale_type !== 2 || !formik.values.customer_id || !itemId) {
			formik.setFieldValue(`childArray[${itemRowIndex}].last_sale_price_customer`, null);
			return;
		}

		apiClient
			.get(`/getItemSaleHistory?item_id=${itemId}&customer_id=${formik.values.customer_id}`)
			.then((res) => {
				const invoiceChildren = res?.data?.customersalehistory?.invoice_child || [];
				if (invoiceChildren.length === 0) {
					formik.setFieldValue(`childArray[${itemRowIndex}].last_sale_price_customer`, null);
					return;
				}
				// pick the record with the latest invoice date
				let latest = invoiceChildren[0];
				invoiceChildren.forEach((child) => {
					const d1 = new Date(latest?.invoice?.date || 0).getTime();
					const d2 = new Date(child?.invoice?.date || 0).getTime();
					if (d2 > d1) latest = child;
				});
				formik.setFieldValue(
					`childArray[${itemRowIndex}].last_sale_price_customer`,
					latest?.price ?? null,
				);
			})
			.catch(() => {
				formik.setFieldValue(`childArray[${itemRowIndex}].last_sale_price_customer`, null);
			});
	};

	return (
		<div className='col-12'>
			<ModalBody>
				<div className='col-12'>
					<Card stretch tag='form' onSubmit={formik.handleSubmit}>
						<CardBody>
							<div className='row g-2  d-flex justify-content-center align-items-top'>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Shop:</h3>
								</div>
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											className='col-md-12'
											classNamePrefix='select'
											options={storesOptions}
											isLoading={storesOptionsLoading}
											isClearable
											value={
												formik.values.store_id
													? storesOptions?.find(
														(c) =>
															c.value === formik.values.store_id,
													)
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'store_id',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
									{formik.errors.store_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
												textAlign: 'left',
												marginTop: 3,
											}}>
											{formik.errors.store_id}
										</p>
									)}
								</div>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Type:</h3>
								</div>
								<div className='col-md-2'>
									<FormGroup label='' id='name'>
										<ReactSelect
											className='col-md-12'
											classNamePrefix='select'
											options={saleTypesOptions}
											// isLoading={saleTypesOptionsLoading}
											value={
												formik.values.sale_type
													? saleTypesOptions?.find(
														(c) =>
															c.value === formik.values.sale_type,
													)
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'sale_type',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Tax:</h3>
								</div>
								<div className='col-md-2'>
									<FormGroup label='' id='name'>
										<ReactSelect
											className='col-md-12'
											classNamePrefix='select'
											options={taxTypesOptions}
											// isLoading={saleTypesOptionsLoading}
											value={
												formik.values.tax_type
													? taxTypesOptions?.find(
														(c) =>
															c.value === formik.values.tax_type,
													)
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'tax_type',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<Checks
										type='switch'
										id='isNegative'
										label={
											formik.values.isNegative === 1
												? 'Allow Negative Stock'
												: 'DO not allow Negative Stock'
										}
										name='checkedCheck'
										onChange={(e) => {
											formik.setFieldValue(
												'isNegative',
												e.target.checked === true ? 1 : 0,
											);
										}}
										isValid={formik.isValid}
										checked={formik.values.isNegative}
									/>
								</div>
							</div>
							<hr />
							<div className='row g-2  d-flex justify-content-start'>
								{formik.values.sale_type === 2 ? (
									<div className='col-md-5'>
										<FormGroup
											id='customer_id'
											label='Customer'
											className='col-md-12'>
											<InputGroup>
												<ReactSelect
													isDisabled
													className='col-md-10'
													isClearable
													isLoading={customerDropDownLoading}
													options={customerDropDown}
													value={
														formik.values.customer_id
															? customerDropDown?.find(
																(c) =>
																	c.value ===
																	formik.values.customer_id,
															)
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'customer_id',
															val !== null && val.id,
														);
													}}
													invalidFeedback={formik.errors.customer_id}
												/>
												<AddCustomer refreshDropdowns={refreshDropdowns} />
											</InputGroup>
										</FormGroup>
										{formik.errors.customer_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.customer_id}
											</p>
										)}
									</div>
								) : (
									<div className='col-md-3'>
										<FormGroup
											id='walk_in_customer_name'
											label='Customer Name'
											className='col-md-12'>
											<Input
												type='text'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												readOnly
												value={formik.values.walk_in_customer_name}
												isValid={formik.isValid}
												isTouched={formik.touched.walk_in_customer_name}
												invalidFeedback={
													formik.errors.walk_in_customer_name
												}
											/>
										</FormGroup>
									</div>
								)}

								<div className='col-md-2'>
									<FormGroup id='date' label='Date'>
										<Input
											isDisabled
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.date}
											isValid={formik.isValid}
											isTouched={formik.touched.date}
											invalidFeedback={formik.errors.date}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='remarks' label='Remarks' className='col-md-12'>
										<Input
											isDisabled
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
												color: 'red',
											}}>
											{formik.errors.remarks}
										</p>
									)}
								</div>

								<div className='col-md-2'>
									<FormGroup
										id='delivered_to'
										label='Delivered To'
										className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.delivered_to}
											isValid={formik.isValid}
											readOnly
											isTouched={formik.touched.delivered_to}
											invalidFeedback={formik.errors.delivered_to}
										/>
									</FormGroup>
									{/* {formik.errors.delivered_to && (
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.delivered_to}
											</p>
										)} */}
								</div>
							</div>
							<hr />
							{/* <CardBody className='table-responsive'> */}
							<table className='table text-center '>
								<thead>
									<tr className='row'>
										<th style={{
											padding: 0,
											flex: '0 0 40%',
											maxWidth: '40%',
										}}>Items</th>
										<th className='col-md-1'>In Stock</th>
										<th className='col-md-1'>Price</th>
										<th className='col-md-1'>Qty</th>
										{/* 	<th className='col-md-2'>Returned Qty</th> */}
										<th className='col-md-2'>Total</th>

										{/* <th className='col-md-2'>Remarks</th> */}
										{/* <th className='col-md-1'>Remarks</th> */}
										<th className='col-md-1'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray.map((items, index) => (

											<tr className='row mt-2' key={items.index}>
												<td
													className='new border-start border-end '
													style={{
														padding: 0,
														flex: '0 0 40%',
														maxWidth: '40%',
													}}>
													<FormGroup
														label=''
														id={`childArray[${index}].item_id`}>
														<ReactSelect
															styles={customStyles}
															className='col-md-12'
															classNamePrefix='select'
															options={itemOptions}
															isLoading={kitOptionsLoading}
															value={
																formik.values.childArray[index]
																	.item_id
																	? itemOptions.find(
																		(c) =>
																			c.value ===
																			formik
																				.values
																				.childArray[
																				index
																			].item_id,
																	)
																	: null
															}
															onChange={(val) => {
																formik
																	.setFieldValue(
																		`childArray[${index}].item_id`,
																		val !== null &&
																		val.id,
																	)
																	.then(() => { });
																// handleChange(index, val);

																// getBrands(val);
																getRacksAndShelfData(
																	val,
																	index,
																);

																formik.setFieldValue(
																	`childArray[${index}].item_name`,
																	val !== null &&
																	val.label,
																);
																formik.setFieldValue(
																	`childArray[${index}].qty`,
																	'',
																);
																formik.setFieldValue(
																	`childArray[${index}].total`,
																	0,
																);
																getExistingQty(index, val);
																updateLastSoldPriceForCustomer(
																	index,
																	val?.id,
																);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																		index
																	]?.item_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																`childArray[${index}].item_id`
																]
															}
														/>
													</FormGroup>

													{formik.errors[
														`childArray[${index}]item_id`
													] && (
															<p
																style={{
																	color: 'red',
																	textAlign: 'center',
																	marginTop: 2,
																	marginBottom: 0,
																}}>
																{
																	formik.errors[
																	`childArray[${index}]item_id`
																	]
																}
															</p>
														)}
													{showStats && (
														<div className='d-flex justify-content-center'>
															{items.qty_available_loading ? (
																<h5>...</h5>
															) : (
																// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																<div
																	className=' text-muted fs-6 '
																	// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
																	role='button'
																	style={{
																		color: 'orange',
																		fontStyle: 'italic',
																		marginBottom: 0,
																		textDecorationLine:
																			'underline',
																	}}
																	tabIndex={0}
																	onClick={(val) => {
																		if (items.item_id) {
																			// initialStatusItems();
																			// setStateCustomer(
																			// 	true,
																			// );
																			// getPartSoldHistory(
																			// 	items.item_id,
																			// );
																		}
																	}}>
																	Last Sold at:
																	{items?.last_sale_price ===
																		null
																		? ''
																		: items?.last_sale_price.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																		) ?? 0}
																	{formik.values
																		.sale_type === 2 &&
																		formik.values
																			.customer_id &&
																		(items?.last_sale_price_customer ??
																			null) !==
																		null && (
																			<span>{` | Last to this customer: ${Number(
																				items.last_sale_price_customer,
																			).toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																			)}`}</span>
																		)}
																</div>
															)}
														</div>
													)}
													<div className='row justify-content-between mt-2'>
														<div>
															<div className='col'>
																<p>
																	{isOpen
																		? 'Rack and Shelves'
																		: 'Rack and Shelves'}
																</p>
															</div>

															{/* Button to toggle dropdown */}
															<Button
																onClick={toggleDropdown}
																color='primary'
																className='mt-1'>
																{isOpen
																	? 'Hide Details'
																	: 'Show Details'}
															</Button>
															{/* Dropdown content */}
															{isOpen && (
																<>
																	<div className='mt-2'>
																		<div className='table-responsive'>
																			<table className=' col-md-12 mt-3'>
																				{(items.item_racks || items.racks_shelves) &&
																					(items.item_racks || items.racks_shelves).map(
																						(
																							rack,
																							rackIndex,
																						) => (
																							<tr className='row mt-2 mb-2 '>
																								<td className='col-md-1 mt-4'>
																									<Input
																										id={`childArray[${index}].item_racks[${rackIndex}].checked`}
																										class='form-check-input ml-2'
																										type='checkbox'
																										// onChange={(
																										// 	e,
																										// ) => {
																										// 	formik.setFieldValue(
																										// 		`billList[${index}].check_box`,
																										// 		e.target
																										// 			.checked,
																										// 	);
																										// }}
																										onChange={
																											formik.handleChange
																										}
																										checked={
																											rack.check_box
																										}
																									/>
																								</td>
																								<td className='col-md-4 border-bottom  border-start border-end'>
																									<div>
																										<FormGroup
																											size='sm'
																											label='Rack'
																											id={`childArray[${index}].item_racks[${rack}].rack_id`}>
																											<p className='col-md-12'>
																												{
																													rack?.rack_number || rack?.racks?.rack_number
																												}
																											</p>
																										</FormGroup>
																									</div>
																								</td>
																								<td className='col-md-4 border-bottom  border-start border-end'>
																									<div>
																										<FormGroup
																											size='sm'
																											label='Shelf'
																											id={`childArray[${index}].rackShelf[${rackIndex}].shelf_id`}>
																											<p>
																												{
																													rack?.shelf_number || rack?.shelves?.shelf_number
																												}
																											</p>
																										</FormGroup>
																									</div>
																								</td>

																								<td className='col-md-3 border-bottom '>
																									<FormGroup label='Quantity'>
																										<Input
																											type='number'
																											max={
																												rack.quantity
																											}
																											name={`childArray[${index}].item_racks[${rackIndex}].quantity`}
																											id={`childArray[${index}].item_racks[${rackIndex}].quantity`}
																											value={
																												rack.quantity
																											}
																											// onChange={
																											// 	formik.handleChange
																											// }
																											disabled
																										/>
																									</FormGroup>
																								</td>
																							</tr>
																						),
																					)}
																			</table>
																		</div>
																	</div>

																	<div className='col'>
																		<p>Other Stocks </p>

																		<div className='mt-2'>
																			<div className='table-responsive'>
																				<table className='col-md-12 mt-3'>
																					<tbody>
																						{items && (
																							<tr className='row mt-2 mb-2'>
																								<td className='col-md-1 mt-4 align-items-center'>
																									<Input
																										id={`childArray[${index}].no_rack_shelf.checked`}
																										className='form-check-input ml-2'
																										type='checkbox'
																										onChange={
																											formik.handleChange
																										}
																										defaultChecked
																										style={{
																											padding:
																												'0.475rem 0.25rem',
																										}}
																									/>
																								</td>
																								<td className='col-md-8 border-bottom border-start border-end'>
																									<div>
																										<p>
																											Stocks:{' '}
																											{formik
																												.values
																												.childArray[
																												index
																											]
																												?.no_rack_shelf
																												?.quantity ??
																												0}
																										</p>
																									</div>
																								</td>
																								{/* <td className="col-md-3 border-bottom">
																							<FormGroup label="Quantity">
																								<Input
																									type="number"
																									name={`childArray[${index}].no_rack_shelf.quantity`}
																									id={`childArray[${index}].no_rack_shelf.quantity`}
																									value={formik.values.childArray[index]?.no_rack_shelf?.quantity || 0}
																									disabled
																								/>
																							</FormGroup>
																						</td> */}
																							</tr>
																						)}
																					</tbody>
																				</table>
																			</div>
																		</div>
																	</div>
																</>
															)}
														</div>
														{/* <div className='col-auto'>
																<div className='d-flex justify-content-end'>
																	<AddRack
																		getRacks={getRacks}
																		storeId={
																			formik.values?.store_id
																		}
																		show={1}
																	/>
																	<AddShelf
																		getShelves={getShelves}
																		storeId={
																			formik.values?.store_id
																		}
																		show={1}
																	/>
																</div>
															</div> */}
													</div>
												</td>
												<td className='col-md-1 border-start border-end '>
													<FormGroup
														id={`list[${index}].qty_available`}
														label=''
														className='col-md-12'>
														<h5>
															{items.qty_available_loading ? (
																<h5>...</h5>
															) : (
																<div className='fs-6'>
																	{items.qty_available ?? 0}
																	{showStats && (
																		<div className='small text-muted'>
																			Avg Cost:
																			<br />
																			{items.avg_price.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																			) ?? 0}
																		</div>
																	)}
																</div>
															)}
														</h5>
													</FormGroup>
												</td>
												<td className='col-md-1 border-start border-end'>
													<div>
														<FormGroup
															id={`childArray[${index}].price`}
															className='col-md-12'>
															<Input
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].price`,
																		val.target.value,
																	);

																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		Number(
																			Number(
																				formik.values
																					.childArray[
																					index
																				].quantity,
																			) -
																			Number(
																				formik.values
																					.childArray[
																					index
																				]
																					.returned_quantity,
																			),
																		) * val.target.value,
																	);

																	setReload(reload + 1);
																}}
																onBlur={formik.handleBlur}
																value={items.price}
																isValid={formik.isValid}
																isTouched={formik.touched.price}
																invalidFeedback={
																	formik.errors.price
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]price`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																		textAlign: 'left',
																		marginTop: 3,
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]price`
																		]
																	}
																</p>
															)}
													</div>
												</td>
												<td className='col-md-1 border-start border-end'>
													<div>
														<FormGroup
															id={`childArray[${index}].quantity`}
															className='col-md-12'>
															<Input
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].quantity`,
																		val.target.value,
																	);

																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		Number(
																			Number(
																				val.target.value,
																			) -
																			Number(
																				formik.values
																					.childArray[
																					index
																				]
																					.returned_quantity,
																			),
																		) *
																		Number(
																			formik.values
																				.childArray[
																				index
																			].price,
																		),
																	);

																	setReload(reload + 1);

																	const quantity = Number(
																		val.target.value,
																	);
																	const returnedQuantity = Number(
																		formik.values.childArray[
																			index
																		].returned_quantity,
																	);

																	if (quantity <= 0) {
																		showNotification(
																			_titleError,
																			' Quantity must be greater than ZERO',
																			'warning',
																		);
																		formik.setFieldValue(
																			`childArray[${index}].quantity`,
																			'',
																		);
																	}

																	if (
																		quantity < returnedQuantity
																	) {
																		showNotification(
																			_titleError,
																			' Quantity must be greater than Returned Quantity',
																			'warning',
																		);
																		formik.setFieldValue(
																			`childArray[${index}].quantity`,
																			returnedQuantity,
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.quantity}
																isValid={formik.isValid}
																isTouched={formik.touched.quantity}
																invalidFeedback={
																	formik.errors.quantity
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]quantity`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																		textAlign: 'left',
																		marginTop: 3,
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]quantity`
																		]
																	}
																</p>
															)}
													</div>
												</td>
												{/* <td className='col-md-2 border-start border-end'>
													<div>
														<FormGroup
															id={`childArray[${index}].returned_quantity`}
															className='col-md-12'>
															<Input
																size='sm'
																type='number'
																readOnly
																onWheel={(e) => e.target.blur()}
																min={0}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].returned_quantity`,
																		val.target.value,
																	);

																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		Number(
																			Number(
																				formik.values
																					.childArray[
																					index
																				].quantity,
																			) -
																			Number(
																				val.target
																					.value,
																			),
																		) *
																		Number(
																			formik.values
																				.childArray[
																				index
																			].price,
																		),
																	);

																	setReload(reload + 1);
																	if (
																		val.target.value >
																		formik.values.childArray[
																			index
																		].quantity
																	) {
																		showNotification(
																			_titleError,
																			'Returned Quanitity should not be greater than Quantity',
																			'warning',
																		);
																		formik.setFieldValue(
																			`childArray[${index}].returned_quantity`,
																			0,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			Number(
																				Number(
																					formik.values
																						.childArray[
																						index
																					].quantity,
																				) -
																				Number(
																					formik
																						.values
																						.childArray[
																						index
																					]
																						.returned_quantity,
																				),
																			) *
																			Number(
																				formik.values
																					.childArray[
																					index
																				].price,
																			),
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.returned_quantity}
																isValid={formik.isValid}
																isTouched
																invalidFeedback={
																	formik.errors[
																	`childArray[${index}]returned_quantity`
																	]
																}
															/>
														</FormGroup>
													</div>
												</td> */}
												<td className='col-md-2 border-start border-end'>
													<div>
														{items.amount?.toLocaleString(undefined, {
															maximumFractionDigits: 2,
														}) ?? 0}

														{formik.errors[
															`childArray[${index}]amount`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																		textAlign: 'left',
																		marginTop: 3,
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]amount`
																		]
																	}
																</p>
															)}
													</div>
												</td>

												<td className='col-md-1 mt-1'>
													<Button
														icon='cancel'
														color='danger'
														onClick={() => removeRow(index)}
													/>
												</td>
											</tr>
										))}
								</tbody>
							</table>
							<hr />
							<div className='row g-4 d-flex align-items-top'>
								<div className='col-md-2'>
									<FormGroup
										id='total_amount'
										label='Total Amount'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											value={formik.values.total_amount}
											readOnly
											isValid={formik.isValid}
											isTouched={formik.touched.total_amount}
											invalidFeedback={formik.errors.total_amount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='discount' label='Discount' className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											onChange={(val) => {
												formik.setFieldValue(`discount`, val.target.value);
												formik.setFieldValue(
													`total_after_discount`,
													Number(formik.values.total_amount ?? 0) -
													Number(val.target.value ?? 0),
												);

												setReload(reload + 1);
											}}
											value={formik.values.discount}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='total_after_discount'
										label='Amount After Discount'
										className='col-md-12'>
										<Input
											value={formik.values.total_after_discount}
											disabled
											readOnly
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_discount}
											invalidFeedback={formik.errors.total_after_discount}
										/>
									</FormGroup>
								</div>

								{formik.values.tax_type === 2 && (
									<>
										<div className='col-md-2'>
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
														setReload(reload + 1);
													}}
													onBlur={formik.handleBlur}
													value={formik.values.gst_percentage}
													isValid={formik.isValid}
													isTouched={formik.touched.discount}
													invalidFeedback={formik.errors.discount}
												/>
											</FormGroup>
										</div>
										<div className='col-md-2'>
											<FormGroup
												readOnly
												id='GST'
												label='GST'
												className='col-md-12'>
												<Input
													readOnly
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.gst.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 2,
														},
													)}
													isValid={formik.isValid}
													isTouched={formik.touched.discount}
													invalidFeedback={formik.errors.discount}
												/>
											</FormGroup>
										</div>
										<div className='col-md-2'>
											<FormGroup
												id='total_after_gst'
												label='Amount with GST'
												className='col-md-12'>
												<Input
													value={formik.values.total_after_gst}
													disabled
													readOnly
													isValid={formik.isValid}
													isTouched
													invalidFeedback={formik.errors.total_after_gst}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='col-md-2'>
											<FormGroup
												id='amount_returned'
												label='Adjusted Amount'
												className='col-md-12'>
												<Input
													type='number'
													onWheel={(e) => e.target.blur()}
													readOnly
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.amount_returned}
													isValid={formik.isValid}
													isTouched={formik.touched.amount_returned}
													invalidFeedback={formik.errors.amount_returned}
												/>
											</FormGroup>
										</div>
									</>
								)}
							</div>
							<div className='row g-4 d-flex align-items-top'>
								<div className='col-md-2'>
									<FormGroup
										id='amount_received'
										label='Received Amount'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.amount_received}
											isValid={formik.isValid}
											isTouched={formik.touched.amount_received}
											invalidFeedback={formik.errors.amount_received}
										/>
									</FormGroup>
								</div>
								<div className='col-md-4'>
									<FormGroup id='account_id' label='Account Cash'>
										<ReactSelect
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
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.account_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.account_id}
										</p>
									)}
								</div>

								<div className='col-md-2'>
									<FormGroup
										id='bank_amount_received'
										label='Received Amount Bank'
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
								<div className='col-md-3'>
									<FormGroup id='bank_account_id' label='Account Bank'>
										<ReactSelect
											className='col-md-12 '
											classNamePrefix='select'
											options={cashAccountsOptions}
											isLoading={crAccountLoading}
											value={
												formik.values.bank_account_id &&
												cashAccountsOptions.find(
													(c) =>
														c.value === formik.values.bank_account_id,
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
										// validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.bank_account_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.bank_account_id}
										</p>
									)}
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</ModalBody>
			<CardFooter>
				<CardFooterLeft>
					<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
						Reset
					</Button>
				</CardFooterLeft>
				<CardFooterRight>
					<Button
						className='me-3'
						icon={isLoading ? null : 'arrow-back'}
						isLight
						color={lastSave ? 'info' : 'primary'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Updating') || 'Updating'
							: (lastSave && 'Update') || 'Update'}
					</Button>
				</CardFooterRight>
			</CardFooter>
		</div>
	);
};
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	handleStateEdit: PropTypes.func.isRequired,
};

export default Edit;
