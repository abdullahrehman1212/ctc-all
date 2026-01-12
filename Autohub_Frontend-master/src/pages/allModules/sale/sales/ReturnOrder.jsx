/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
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

const ReturnOrder = ({ returnData, handleStateReturn }) => {
	console.log('editform', returnData, handleStateReturn);
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

	const validate = (values) => {
		let errors = {};

		if (values.tax_type === 2) {
			if (Number(values.amount_received) !== Number(values.total_after_gst))
				errors.amount_received =
					'Received amount Should be Equal to the Total amount after Gst';
		}

		if (values.tax_type === 1) {
			if (Number(values.amount_received) !== Number(values.total_after_discount))
				errors.amount_received = 'Received amount Should be Equal to the Total amount ';
		}

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
		if (!values.account_id) {
			errors.account_id = 'Required';
		}

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
		console.log(errors);
		return errors;
	};
	const formik = useFormik({
		initialValues: {
			...returnData,
			gst_percentage: (returnData.gst / returnData.total_after_discount) * 100,
			amount_returned: 0,
		},
		deduction: 0,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};
	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			.post(`/returnSale`, data)
			.then((res) => {
				// console.log('received PO', res.data);
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateReturn(false);
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
			.catch((err) => {});
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
		amount_returned = returnData.total_after_gst - total_after_gst;
		formik.setFieldValue('total_after_discount', total_after_discount);

		formik.setFieldValue('gst', gst);
		formik.setFieldValue('total_after_gst', total_after_gst);
		formik.setFieldValue('amount_returned', amount_returned);
	}, [reload]);

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
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											readOnly
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
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											readOnly
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
							</div>
							<hr />
							{/* <CardBody className='table-responsive'> */}
							<table className='table text-center '>
								<thead>
									<tr className='row'>
										<th className='col-md-5'>Items</th>
										<th className='col-md-1'>Price</th>
										<th className='col-md-1'>Qty</th>
										<th className='col-md-2'>Returned Qty</th>
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
												<td className='col-md-5 border-start border-end'>
													<div>
														<FormGroup
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect
																styles={customStyles}
																className='col-md-12'
																menuIsOpen={false}
																classNamePrefix='select'
																options={itemOptions}
																isLoading={kitOptionsLoading}
																// isClearable
																value={
																	formik.values.childArray[index]
																		.item_id
																		? itemOptions.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.childArray[
																						index
																					].item_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].item_id`,
																		val !== null && val.id,
																	);
																}}
																isValid={formik.isValid}
																isTouched={formik.touched.item_id}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}].item_id`
																	]
																}
																filterOption={createFilter({
																	matchFrom: 'start',
																})}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]item_id`
														] && (
															// <div className='invalid-feedback'>
															<div
																style={{
																	color: '#ef4444',
																	textAlign: 'center',
																	fontSize: '0.875em',
																	marginTop: '0.25rem',
																}}>
																{
																	formik.errors[
																		`childArray[${index}]item_id`
																	]
																}
															</div>
														)}
													</div>
												</td>
												<td className='col-md-1 border-start border-end'>
													<div>
														<FormGroup
															id={`childArray[${index}].price`}
															className='col-md-12'>
															<Input
																size='sm'
																readOnly
																onChange={formik.handleChange}
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
																readOnly
																onChange={formik.handleChange}
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
												<td className='col-md-2 border-start border-end'>
													<div>
														<FormGroup
															id={`childArray[${index}].returned_quantity`}
															className='col-md-12'>
															<Input
																size='sm'
																type='number'
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
												</td>
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
														isDisable
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
									</>
								)}
							</div>
							<div className='row g-4 d-flex align-items-top'>
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
									<FormGroup id='account_id' label='Account'>
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
							? (lastSave && 'Returning') || 'Returning'
							: (lastSave && 'Return') || 'Return'}
					</Button>
				</CardFooterRight>
			</CardFooter>
		</div>
	);
};
ReturnOrder.propTypes = {
	returnData: PropTypes.string.isRequired,
};
export default ReturnOrder;
