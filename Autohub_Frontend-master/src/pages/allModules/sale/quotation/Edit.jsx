/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import apiClient from '../../../../baseURL/apiClient';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
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

const validate = (values) => {
	const errors = {};

	if (values.sale_type === 2 && !values.customer_id) {
		errors.customer_id = 'Required';
	}

	if (Array.isArray(values.childArray)) {
		errors.childArray = [];

		values.childArray.forEach((row, index) => {
			const rowErrors = {};

			if (!row.item_id) rowErrors.item_id = 'Required';
			if (!row.quantity || Number(row.quantity) <= 0)
				rowErrors.quantity = 'Must be greater than 0';
			if (!row.quoted_price || Number(row.quoted_price) <= 0)
				rowErrors.quoted_price = 'Must be greater than 0';

			if (Object.keys(rowErrors).length > 0) {
				errors.childArray[index] = rowErrors;
			}
		});
	}

	return errors;
};

/* const validate = (values) => {
	let errors = {};

	// if (values.sale_type === 1) {
	// 	if (!values.walk_in_customer_name) {
	// 		errors.walk_in_customer_name = 'Required';
	// 	}
	// 	if (!values.walk_in_customer_phone) {
	// 		errors.walk_in_customer_phone = 'Required';
	// 	}
	// 	if (!/^\d{11}$/.test(values.walk_in_customer_phone)) {
	// 		errors.walk_in_customer_phone = 'Invalid phone number';
	// 	}
	// }
	if (values.sale_type === 2) {
		if (!values.customer_id) {
			errors.customer_id = 'Required';
		}
	}

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}
		if (!data.quoted_price) {
			errors = {
				...errors,
				[`childArray[${index}]quoted_price`]: 'Required!',
			};
		}
		if (!data.quantity) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required!',
			};
		}
		// Additional numeric validations
		if (data.quantity && Number(data.quantity) <= 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Must be greater than 0',
			};
		}
		if (data.quoted_price && Number(data.quoted_price) <= 0) {
			errors = {
				...errors,
				[`childArray[${index}]quoted_price`]: 'Must be greater than 0',
			};
		}
	});
	return errors;
}; */
// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState(true);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [saleRepDropDown, setSaleRepDropDownn] = useState([]);
	const [saleRepDropDownLoading, setSaleRepDropDownLoading] = useState([]);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [itemOptions2, setItemOptions2] = useState([]);

	const [staterefresh, setStateRefresh] = useState(false);
	const safeInitialValues = {
		sale_type: 1,
		customer_id: '',
		quotation_no: '',
		date: '',
		walk_in_customer_name: '',
		walk_in_customer_phone: '',
		childArray: Array.isArray(editingItem?.childArray) ? editingItem.childArray : [],
		...editingItem,
	};
	const formik = useFormik({
		initialValues: safeInitialValues,
		enableReinitialize: true,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		// eslint-disable-next-line no-console
		console.log('Edit form values:', formik.values);
		// eslint-disable-next-line no-console
		console.log('Edit form errors:', formik.errors);
		// eslint-disable-next-line no-console
		console.log('Edit form isValid:', formik.isValid);
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};
	const submitForm = (data) => {
		apiClient
			.post(`/updateQuotation`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
				}
			})
			.catch((err) => {
				setIsLoading(false);

				setIsLoading(false);
			});
	};

	useEffect(() => {
		apiClient.get(`/getLatestQuotationNo`).then((response) => {
			// eslint-disable-next-line no-console
			formik.setFieldValue('quotation_no', response.data.Quot_no);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [staterefresh]);
	useEffect(() => {
		/* 	apiClient.get(`/getPersonsDropDown?person_type=4`).then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSaleRepDropDownn(rec);
				setSaleRepDropDownLoading(false);
			});
	 */
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
			const rec = (response.data?.data || []).map(({ id, name, avg_cost }) => ({
				id,
				value: id,
				label: name,
				retail: avg_cost,
			}));
			setItemOptions(rec);
			setItemOptions2(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
	const formatChars = {
		q: '[0123456789]',
	};
	const refreshItemOptions = () => {
		const t = itemOptions2;
		const list = formik.values.childArray;

		// Keep all options, but remove those already selected EXCEPT the current one
		const newArrayOptions = t.filter(
			(option) =>
				!list.some((child) => child.item_id === option.id && child.item_id !== option.id),
		);

		setItemOptions(newArrayOptions);
	};

	/* const refreshItemOptions = () => {
		const t = itemOptions2;

		const list = formik.values.childArray;
		const newArrayOptions = t.filter((option) => {
			return !list.some((child) => child.item_id === option.id);
		});
		setItemOptions(newArrayOptions);
	}; */
	useEffect(() => {
		refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const [grandTotal, setGrandTotal] = useState(0);

	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		let total = 0;
		arr.forEach((data, index) => {
			formik.values.childArray[index].trade_price = data.retail_price * 0.85;
			total += (Number(data.quantity) || 0) * (Number(data.quoted_price) || 0);
		});
		setGrandTotal(total);
		formik.setFieldValue(`childArray`, arr);
	};
	useEffect(() => {
		calculateTotal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculateTotal]);
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-center align-items-top'>
						<div className='col-md-1 d-flex justify-content-center align-items-top'>
							<h3>Type:</h3>
						</div>
						<div className='col-md-3'>
							<FormGroup label='' id='sale_type'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
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
					</div>
					<div className='row g-2  d-flex justify-content-center'>
						<div className='col-md-3'>
							<FormGroup id='quotation_no' label='Quotation NO' className='col-md-12'>
								<Input
									readOnly
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.quotation_no}
									isValid={formik.isValid}
									isTouched={formik.touched.quotation_no}
									invalidFeedback={formik.errors.quotation_no}
								/>
							</FormGroup>
						</div>
						{formik.values.sale_type === 2 ? (
							<div className='col-md-3'>
								<FormGroup id='customer_id' label='Customer' className='col-md-12'>
									<InputGroup>
										<Select
											className='col-md-12'
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
													val ? val.id : '',
												);
												formik.setFieldValue(
													'customer_name',
													val !== null && val.label,
												);
											}}
											invalidFeedback={formik.errors.customer_id}
										/>
									</InputGroup>
								</FormGroup>
								{formik.errors.customer_id && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: '#ef4444',
											textAlign: 'left',
											marginTop: '0.25rem',
											fontSize: '0.875em',
										}}>
										{formik.errors.customer_id}
									</p>
								)}
							</div>
						) : (
							<div className='col-md-4'>
								<div className='row g-2  d-flex justify-content-start'>
									<FormGroup
										id='walk_in_customer_name'
										label='Customer Name'
										className='col-md-6'>
										<Input
											type='text'
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
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
							</div>
						)}
						{/* <div className='col-md-3'>
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
							<FormGroup id='date' label='Date' className='col-md-12'>
								<Input
									type='date'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.date}
									isValid={formik.isValid}
									isTouched={formik.touched.date}
									invalidFeedback={formik.errors.date}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
					</div>
					<hr />
					{/* <CardBody className='table-responsive'> */}
					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-3'>Item </th>

								<th className='col-md-2'>Quantity</th>

								<th className='col-md-2'>Retail price</th>
								<th className='col-md-1'>Trade price</th>
								<th className='col-md-1'>Quoted rate</th>
								<th className='col-md-2'>Total</th>

								<th className='col-md-1'>.</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.childArray.length > 0 &&
								formik.values.childArray.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-3'>
											<FormGroup label='' id={`childArray[${index}].item_id`}>
												{/* <Select
													isClearable
													styles={customStyles}
													className='col-md-12'
													classNamePrefix='select'
													options={itemOptions}
													isLoading={itemOptionsLoading}
													value={
														items.item_id
															? itemOptions.find(
																	(c) =>
																		c.value === items.item_id,
															  )
															: null
															
													}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_id`,
															val ? val.id : '',
														);

														formik.setFieldValue(
															`childArray[${index}].manufacture_id`,
															'',
														);

														formik.setFieldValue(
															`childArray[${index}].manufactureDetails`,
															'',
														);
														formik.setFieldValue(
															`childArray[${index}].manufactureOptions`,
															val ? val.manufactureOptions : '',
														);
														formik.setFieldValue(
															`childArray[${index}].retail_price`,
															val ? val.retail : '',
														);

														formik
															.setFieldValue(
																`childArray[${index}].trade_price`,

																val.retail -
																	(val.retail * 15) / 100,
															)
															.then(() => {
																setTriggerRefreshItemOptions(
																	triggerRefreshItemOptions + 1,
																);
															});
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
												/> */}
												<Select
													isClearable
													styles={customStyles}
													className='col-md-12'
													classNamePrefix='select'
													options={[
														// Ensure current item is always in the list
														...(items.item_id
															? itemOptions2.filter(
																(opt) =>
																	opt.value === items.item_id,
															)
															: []),
														// Add the rest of available items
														...itemOptions.filter(
															(opt) => opt.value !== items.item_id,
														),
													]}
													value={
														items.item_id
															? itemOptions2.find(
																(c) =>
																	c.value === items.item_id,
															)
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_id`,
															val ? val.id : '',
														);

														formik.setFieldValue(
															`childArray[${index}].manufacture_id`,
															'',
														);

														formik.setFieldValue(
															`childArray[${index}].manufactureDetails`,
															'',
														);
														formik.setFieldValue(
															`childArray[${index}].manufactureOptions`,
															val ? val.manufactureOptions : '',
														);
														formik.setFieldValue(
															`childArray[${index}].retail_price`,
															val ? val.retail : '',
														);

														formik
															.setFieldValue(
																`childArray[${index}].trade_price`,
																val.retail -
																(val.retail * 15) / 100,
															)
															.then(() => {
																setTriggerRefreshItemOptions(
																	triggerRefreshItemOptions + 1,
																);
															});
													}}
												/>
											</FormGroup>
											{formik.errors?.childArray?.[index]?.item_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#ef4444',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors?.childArray?.[index]?.item_id}
												</p>
											)}
										</td>

										<td className='col-md-2'>
											<FormGroup
												id={`childArray[${index}].quantity`}
												label=''
												className='col-md-12'>
												<Input
													type='number'
													onWheel={(e) => e.target.blur()}
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
													onBlur={formik.handleBlur}
													value={items.quantity}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																?.quantity
															: ''
													}
													invalidFeedback={
														formik.errors?.childArray?.[index]?.quantity
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-2'>
											<FormGroup
												id={`childArray[${index}].retail_price`}
												label=''
												type='number'
												onWheel={(e) => e.target.blur()}
												className='col-md-12'>
												<Input
													readOnly
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].retail_price`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
													onBlur={formik.handleBlur}
													value={items.retail_price}
													isValid={formik.isValid}
													isTouched={formik.touched?.childArray?.[index]?.retail_price}
													invalidFeedback={formik.errors?.childArray?.[index]?.retail_price}
												//
												/>
											</FormGroup>
											{formik.errors?.childArray?.[index]?.retail_price && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#ef4444',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{
														formik.errors?.childArray?.[index]?.retail_price
													}
												</p>
											)}
										</td>
										<td className='col-md-1'>
											<FormGroup
												id={`childArray[${index}].trade_price`}
												label=''
												className='col-md-12'>
												<Input
													readOnly
													type='number'
													onWheel={(e) => e.target.blur()}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={items.trade_price}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																?.trade_price
															: ''
													}
													invalidFeedback={
														formik.errors?.childArray?.[index]?.trade_price
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-1'>
											<FormGroup
												id={`childArray[${index}].quoted_price`}
												label=''
												className='col-md-12'>
												<Input
													type='number'
													onWheel={(e) => e.target.blur()}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].quoted_price`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
													onBlur={formik.handleBlur}
													value={items.quoted_price}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																?.quoted_price
															: ''
													}
													invalidFeedback={
														formik.errors?.childArray?.[index]?.quoted_price
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-2'>
											<strong className='text-success'>
												{(
													(Number(items.quantity) || 0) *
													(Number(items.quoted_price) || 0)
												).toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</strong>
										</td>

										{/* <td className='col-md-2'>
											<strong>
												{(
													items.quantity * items.quoted_price
												)?.toLocaleString(undefined, {
													maximumFractionDigits: 4,
												}) || 0}
											</strong>
										</td> */}
										<td className='col-md-1 mt-1'>
											<Button
												isDisable={formik.values.childArray.length === 1}
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
					<div className='row g-4'>
						<div className='col-md-4'>
							<Button
								color='primary'
								icon='add'
								onClick={() => {
									formik.setFieldValue('childArray', [
										...formik.values.childArray,
										{
											item_id: '',
											manufacture_id: '',
											retail_price: '',

											quantity: '',
											trade_price: '',
											quoted_price: '',
											gst_amount: '',
											gst: '',
										},
									]);
								}}>
								Add
							</Button>
						</div>
					</div>
					<div className='row mt-4'>
						<div className='col-md-12 d-flex justify-content-end'>
							<Card className='p-3 shadow-sm border-0 bg-light'>
								<h4 className='mb-0 text-muted'>Grand Total</h4>
								<h2 className='fw-bold text-primary'>
									{grandTotal.toLocaleString(undefined, {
										maximumFractionDigits: 2,
									})}
								</h2>
							</Card>
						</div>
					</div>

					<hr />
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							isOutline
							onClick={() => {
								setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
								formik.resetForm();
							}}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							className='me-3'
							icon={isLoading ? null : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={() => {
								// eslint-disable-next-line no-console
								console.log('Update button clicked');
								// eslint-disable-next-line no-console
								console.log('Form errors:', formik.errors);
								// eslint-disable-next-line no-console
								console.log('Form values:', formik.values);
								formik.handleSubmit();
							}}>
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
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit;
