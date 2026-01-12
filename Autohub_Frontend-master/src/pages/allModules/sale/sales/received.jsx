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
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
// import showNotification from '../../../../components/extras/showNotification';

const Received = ({ recievedItem, handleStateRecieved }) => {
	// console.log('editform', recievedItem, handleStateRecieved);
	const [reload, setReload] = useState(0);
	const [reload2, setReload2] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [kitEditOptions, setItemOptions] = useState([]);
	const [editItemOptionsLoading, setEditItemOptionsLoading] = useState(true);
	const [itemOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeLoading, setStoreLoading] = useState(false);

	const validate = (values) => {
		let errors = {};
		if (!values.po_no) {
			errors.po_no = 'Required';
		}
		if (!values.supplier_id) {
			errors.supplier_id = 'Required';
		}
		if (!values.store_id) {
			errors.store_id = 'Required';
		}
		if (!values.request_date) {
			errors.request_date = 'Required';
		}
		if (!values.childArray.length > 0) {
			errors.childArray = 'Choose Items In list';
		}
		if (!values.total) {
			errors.total = 'Required';
		}
		// if (!values.tax) {
		// 	errors.tax = 'Required';
		// }
		// if (!values.tax_in_figure) {
		// 	errors.tax_in_figure = 'Required';
		// }
		// if (!values.total_after_tax) {
		// 	errors.total_after_tax = 'Required';
		// }
		// if (!values.discount) {
		// 	errors.discount = 'Required';
		// }
		if (!values.total_after_discount) {
			errors.total_after_discount = 'Required';
		}
		values.childArray.forEach((data, index) => {
			if (!data.item_id) {
				errors = {
					...errors,
					[`childArray[${index}]item_id`]: 'Required!',
				};
			}

			if (!data.quantity > 0) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]: 'Required',
				};
			}
			if (!data.purchase_price) {
				errors = {
					...errors,
					[`childArray[${index}]purchase_price`]: 'Required',
				};
			}
			if (!data.sale_price) {
				errors = {
					...errors,
					[`childArray[${index}]sale_price`]: 'Required',
				};
			}
			if (!data.received_quantity > 0) {
				errors = {
					...errors,
					[`childArray[${index}]received_quantity`]: 'Required',
				};
			}
		});
		console.log(errors, 'errors');
		return errors;
	};
	const formik = useFormik({
		initialValues: recievedItem,

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
	const submitForm = (data) => {
		// console.log('data:::', data);
		apiClient
			.post(`/receivePurchaseOrder`, data)
			.then((res) => {
				// console.log('received PO', res.data);
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateRecieved(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.message, 'Danger');
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
		apiClient
			.get(`/getPersons?person_type_id=2`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setSupplierDropDown(rec);
				setSupplierDropDownLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
					// Cookies.remove('userToken');
					// navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.supplier_id]);
	useEffect(() => {
		apiClient
			.get(`/getStoredropdown`)
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
					// showNotification(_titleError, err.response.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.supplier_id]);

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

	useEffect(() => {
		let t = 0;
		formik?.values.childArray?.forEach((item) => {
			t += Number(item.received_quantity ?? 0) * Number(item.purchase_price);
			formik.setFieldValue('total', Number(t));
			formik.setFieldValue('tax_in_figure', (formik.values.tax / 100) * Number(t));
			formik.setFieldValue(
				'total_after_discount',
				Number(t) +
					Number((formik.values.tax / 100) * Number(t)) -
					Number(formik.values.discount),
			);
			formik.setFieldValue(
				'total_after_tax',
				(formik.values.tax / 100) * Number(t) + Number(t),
			);
		});
	}, [reload]);

	return (
		<div className='col-12'>
			<ModalBody>
				<div className='col-12'>
					<Card stretch tag='form' onSubmit={formik.handleSubmit}>
						<CardBody>
							<div className='row g-2  d-flex justify-content-start'>
								<div className='col-md-2'>
									<FormGroup id='po_no' label='PO NO' className='col-md-12'>
										<Input
											type='number'
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.po_no}
											isValid={formik.isValid}
											isTouched={formik.touched.po_no}
											invalidFeedback={formik.errors.po_no}
										/>
									</FormGroup>
								</div>
								<div className='col-md-4'>
									<FormGroup
										id='supplier_id'
										label='Supplier'
										className='col-md-12'>
										<ReactSelect
											className='col-md-12'
											isClearable
											isDisabled
											isLoading={supplierDropDownLoading}
											options={supplierDropDown}
											value={
												formik.values.supplier_id
													? supplierDropDown?.find(
															(c) =>
																c.value ===
																formik.values.supplier_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'supplier_id',
													val !== null && val.id,
												);
											}}
											invalidFeedback={formik.errors.supplier_id}
										/>
									</FormGroup>
									{formik.errors.supplier_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.supplier_id}
										</p>
									)}
								</div>
								{/* <div className='col-md-3'>
									<FormGroup label='Delivery Place' id='store_id'>
										<ReactSelect
											className='col-md-12'
											classNamePrefix='select'
											options={storeOptions}
											isLoading={storeLoading}
											isClearable
											value={
												formik.values.store_id
													? storeOptions.find(
															(c) =>
																c.value ===
																formik.values.store_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'store_id',
													val !== null && val.id,
												);
											}}
											isValid={formik.isValid}
											isTouched={formik.touched.store_id}
											invalidFeedback={formik.errors.store_id}
											
											
										/>
									</FormGroup>
								</div> */}
								<div className='col-md-4'>
									<FormGroup label='Store' id='store_id'>
										<ReactSelect
											className='col-md-12'
											classNamePrefix='select'
											options={storeOptions}
											isLoading={storeLoading}
											isClearable
											value={
												formik.values.store_id
													? storeOptions.find(
															(c) =>
																c.value === formik.values.store_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'store_id',
													val !== null ? val.id : '',
												);
											}}
											isValid={formik.isValid}
											isTouched={formik.touched.store_id}
											invalidFeedback={formik.errors.store_id}
										/>
									</FormGroup>
									{formik.errors.store_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.store_id}
										</p>
									)}
								</div>
							</div>

							<div className='row g-2 mt-2  d-flex justify-content-start'>
								<div className='col-md-4'>
									<FormGroup id='request_date' label='Request Date'>
										<Input
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.request_date}
											isValid={formik.isValid}
											isTouched={formik.touched.request_date}
											invalidFeedback={formik.errors.request_date}
										/>
									</FormGroup>
								</div>
								<div className='col-md-4'>
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
										// <div className='invalid-feedback'>
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
										<th className='col-md-4'>Items</th>
										{/* <th className='col-md-1'>Quantity</th>
										<th className='col-md-1'>Received Qty</th> */}
										<th className='col-md-4'>
											<div className='d-flex justify-content-around'>
												<div>Purchase Price</div>
												<div>Sale Price</div>
											</div>
										</th>
										{/* <th className='col-md-2'>Sale Price</th> */}
										<th className='col-md-2'>Amount</th>
										{/* <th className='col-md-1'>Remarks</th> */}
										<th className='col-md-1'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr className='row mt-2' key={items.index}>
												<td className='col-md-4'>
													<div>
														<FormGroup
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect
																className='col-md-12'
																isDisabled
																classNamePrefix='select'
																options={itemOptions}
																isLoading={kitOptionsLoading}
																isClearable
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

													<div className='row mt-1'>
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].quantity`}
																label='Qty'
																type='number'
																className='col-md-12'>
																<Input
																	readOnly
																	type='number'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={items.quantity}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.quantity
																	}
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
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].received_quantity`}
																label='Received Qty'
																className='col-md-12'>
																<Input
																	type='number'
																	onFocus={(e) =>
																		e.target.select()
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`childArray[${index}].received_quantity`,
																			val.target.value,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			val.target.value *
																				(formik.values
																					.childArray[
																					index
																				].purchase_price ??
																					0),
																		);

																		setReload(reload + 1);
																		// setReload2(reload2 + 1);
																	}}
																	onBlur={formik.handleBlur}
																	value={items.received_quantity}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.received_quantity
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]received_quantity`
																		]
																	}
																/>
															</FormGroup>
														</div>
													</div>
												</td>
												<td className='col-md-4'>
													<div className='row mt-1'>
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].purchase_price`}
																label=''
																className='col-md-12'>
																<Input
																	type='number'
																	onFocus={(e) =>
																		e.target.select()
																	}
																	onWheel={(e) => e.target.blur()}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`childArray[${index}].purchase_price`,
																			val.target.value,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			val.target.value *
																				(formik.values
																					.childArray[
																					index
																				]
																					.received_quantity ??
																					0),
																		);

																		setReload(reload + 1);
																	}}
																	onBlur={formik.handleBlur}
																	value={items.purchase_price}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.purchase_price
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]purchase_price`
																		]
																	}
																/>
															</FormGroup>
														</div>
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].sale_price`}
																label=''
																className='col-md-12'>
																<Input
																	type='number'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={items.sale_price}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.sale_price
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]sale_price`
																		]
																	}
																/>
															</FormGroup>
															{/* {formik.errors[
																`childArray[${index}]sale_price`
															] && (
																<p
																	style={{
																		color: 'red',
																		textAlign: 'left',
																		marginTop: 3,
																	}}>
																	{
																		formik.errors[
																			`childArray[${index}]sale_price`
																		]
																	}
																</p>
															)} */}
														</div>
													</div>
													<div>
														<FormGroup
															id={`childArray[${index}].remarks`}
															label='Remarks'
															className='col-md-12'>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={items.remarks}
																isValid={formik.isValid}
																isTouched={formik.touched.remarks}
																invalidFeedback={
																	formik.errors.remarks
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]remarks`
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
																		`childArray[${index}]remarks`
																	]
																}
															</p>
														)}
													</div>
												</td>
												<td className='col-md-2'>
													<FormGroup
														id={`childArray[${index}].amount`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															readOnly
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.amount}
															isValid={formik.isValid}
															isTouched={formik.touched.amount}
															invalidFeedback={formik.errors.amount}
														/>
													</FormGroup>
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
												</td>

												<td className='col-md-1 mt-1'>
													<Button
														isDisable={
															formik.values.childArray.length === 1
														}
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
							<div className='row g-2  d-flex justify-content-start mt-2'>
								<div className='col-md-2'>
									<FormGroup id='total' label='Total' className='col-md-12'>
										<Input
											type='number'
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total}
											isValid={formik.isValid}
											isTouched={formik.touched.total}
											invalidFeedback={formik.errors.total}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='tax' label='Tax(%)' className='col-md-12'>
										<Input
											type='number'
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												formik.setFieldValue('tax', e.target.value);
												// formik.setFieldValue(
												// 	'tax_in_figure',
												// 	(val.target.value / 100) * formik.values.total,
												// );
												// formik.setFieldValue(
												// 	'total_after_tax',
												// 	(val.target.value / 100) * formik.values.total +
												// 		formik.values.total,
												// );
												// formik.setFieldValue(
												// 	'total_after_discount',
												// 	formik.values.total_after_tax -
												// 		formik.values.discount,
												// );
												setReload(reload + 1);
												// setReload2(reload2 + 1);
												// formik.setFieldValue('discount', 0);
											}}
											onBlur={formik.handleBlur}
											value={formik.values.tax}
											isValid={formik.isValid}
											isTouched={formik.touched.tax}
											invalidFeedback={formik.errors.tax}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='tax_in_figure'
										label='Tax in figure'
										className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.tax_in_figure.toLocaleString(
												undefined,
												{ maximumFractionDigits: 2 },
											)}
											isValid={formik.isValid}
											isTouched={formik.touched.tax_in_figure}
											invalidFeedback={formik.errors.tax_in_figure}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='total_after_tax'
										label='Total After Tax'
										className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total_after_tax.toLocaleString(
												undefined,
												{ maximumFractionDigits: 2 },
											)}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_tax}
											invalidFeedback={formik.errors.total_after_tax}
										/>
									</FormGroup>
								</div>

								<div className='col-md-2'>
									<FormGroup id='discount' label='Discount' className='col-md-12'>
										<Input
											type='number'
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												formik.setFieldValue('discount', e.target.value);
												formik.setFieldValue(
													'total_after_discount',
													formik.values.total_after_tax - e.target.value,
												);
											}}
											onBlur={formik.handleBlur}
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
										label='Total after discount'
										className='col-md-12'>
										<Input
											type='number'
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total_after_discount}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_discount}
											invalidFeedback={formik.errors.total_after_discount}
										/>
									</FormGroup>
								</div>
							</div>
							{/* <div className='row g-4'>
								<div className='col-md-4'>
									<Button
										color='primary'
										icon='add'
										onClick={() => {
											formik.setFieldValue('childArray', [
												...formik.values.childArray,
												{
													name: '',
													quantity: '',
												},
											]);
										}}>
										Add
									</Button>
								</div>
							</div> */}
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
						icon={isLoading ? null : 'receive'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'receiving') || 'receiving'
							: (lastSave && 'receive') || 'receive'}
					</Button>
				</CardFooterRight>
			</CardFooter>
		</div>
	);
};
Received.propTypes = {
	recievedItem: PropTypes.string.isRequired,
};
export default Received;
