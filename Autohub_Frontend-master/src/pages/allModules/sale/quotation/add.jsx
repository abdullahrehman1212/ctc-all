// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
// eslint-disable-next-line import/no-named-as-default
import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';
// import moment from 'moment';
// import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Checks from '../../../../components/bootstrap/forms/Checks';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import showNotification from '../../../../components/extras/showNotification';
import { _titleWarning } from '../../../../baseURL/messages';

const validate = (values) => {
	let errors = {};
	// if (!values.sales_rep_id) {
	// 	errors.sales_rep_id = 'Required';
	// }
	if (values.sale_type === 1) {
		if (!values.walk_in_customer_name) {
			errors.walk_in_customer_name = 'Required';
		}
		if (!values.walk_in_customer_phone) {
			errors.walk_in_customer_phone = 'Required';
		}
		if (!/^\d{11}$/.test(values.walk_in_customer_phone)) {
			errors.walk_in_customer_phone = 'Invalid phone number';
		}
	}

	if (values.sale_type === 2) {
		if (!values.customer_id) {
			errors.customer_id = 'Required';
		}
	}
	if (!values.childArray) {
		errors.childArray = 'Required';
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
const Add = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);
	const formatChars = {
		q: '[0123456789]',
	};

	const [isLoading, setIsLoading] = useState(false);
	/* const [saleRepDropDown, setSaleRepDropDownn] = useState([]);
	const [saleRepDropDownLoading, setSaleRepDropDownLoading] = useState([]); */
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState(true);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [itemOptions2, setItemOptions2] = useState([]);

	// const [rate, SetPrice] = useState('');
	// const [total, SetUnit] = useState('');

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;
	const expDate = getDatePlusMonths(2);
	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			walk_in_customer_name: '',
			walk_in_customer_phone: '',
			customer_id: '',
			ref_no: '',
			sale_type: 1,
			tax_type: 1,
			termcondition: 'Valid for 2 months.\nPayment terms (30 days).\n',
			remarks: '',
			gst: '',
			date: todayDate,
			end_date: expDate,

			childArray: [],
		},
		validate,
		onSubmit: () => {
			// eslint-disable-next-line no-console
			console.log('Quotation form onSubmit fired');
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
	};
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

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};

	const submitForm = (myFormik) => {
		// eslint-disable-next-line no-console
		console.log('Submitting /addQuotation payload:', myFormik?.values);
		apiClient
			.post(`/addQuotation`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refreshTableData();
					setIsLoading(false);
					getItemsDropDownQuotation();
				} else {
					setIsLoading(false);
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// eslint-disable-next-line no-console
				console.error('Add quotation failed:', err);
				setIsLoading(false);
			});
	};

	const handleSaveClick = async () => {
		// eslint-disable-next-line no-console
		console.log('Save button clicked');
		const errors = await formik.validateForm();
		// eslint-disable-next-line no-console
		console.log('Validation errors:', errors);
		if (errors && Object.keys(errors).length > 0) {
			showNotification(
				_titleWarning,
				'Please fill all required fields before saving.',
				'warning',
			);
			formik.setTouched({
				walk_in_customer_name: true,
				walk_in_customer_phone: true,
				customer_id: true,
			});
			return;
		}
		formik.handleSubmit();
	};

	useEffect(() => {
		/* apiClient.get(`/getPersonsDropDown?person_type=4`).then((response) => {
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
		getItemsDropDownQuotation();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const getItemsDropDownQuotation = () => {
		apiClient.get(`getMachinePartsModelsDropDown`).then((response) => {
			const rec = (response.data?.data || []).map((item) => {
				// Access nested fields safely
				const machinePartName = item.machine_part_oem_part?.machine_part?.name;
				const number1 = item.machine_part_oem_part?.oem_part_number?.number1;
				const number2 = item.machine_part_oem_part?.oem_part_number?.number2;
				const brandName = item.brand?.name;

				// Merge into label
				const label = [machinePartName, number1, brandName, number2]
					.filter(Boolean)
					.join(' / ');

				return {
					id: item.id,
					value: item.id,
					label,
					userID: item.user_id,
					retail: Number(item.sale_price) || 0,
				};
			});

			setItemOptions(rec);
			setItemOptions2(rec);
			setItemOptionsLoading(false);
		});
	};

	/* const getItemsDropDownQuotation = () => {
		apiClient.get(`getMachinePartsModelsDropDown`).then((response) => {
			const rec = (response.data?.data || []).map(({ id, name, user_id, sale_price }) => ({
				id,
				value: id,
				label: `${name}`,
				userID: user_id,
				retail: Number(sale_price) || 0,
			}));
			setItemOptions(rec);
			setItemOptions2(rec);
			setItemOptionsLoading(false);
		});
	}; */
	const refreshItemOptions = () => {
		const t = itemOptions2;

		const list = formik.values.childArray;
		const newArrayOptions = t.filter((option) => {
			return !list.some((child) => child.item_id === option.id);
		});
		setItemOptions(newArrayOptions);
	};
	useEffect(() => {
		refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='danger'
					isLight
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Add Quotation
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='xl'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Quotation</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2  d-flex justify-content-center align-items-top'>
									<div className='col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Type:</h3>
									</div>
									<div className='col-md-3'>
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
																	c.value ===
																	formik.values.sale_type,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sale_type',
														val ? val.id : '',
													);
													formik.setFieldValue('customer_id', '');
													formik.setFieldValue(
														'walk_in_customer_name',
														'',
													);
												}}
											/>
										</FormGroup>
									</div>
								</div>
								<div className='row g-2  d-flex justify-content-center'>
									{formik.values.sale_type === 2 ? (
										<div className='col-md-5'>
											<FormGroup
												id='customer_id'
												label='Customer'
												className='col-md-12'>
												<InputGroup>
													<ReactSelect
														className='col-md-12'
														isClearable
														isLoading={customerDropDownLoading}
														options={customerDropDown}
														value={
															formik.values.customer_id
																? customerDropDown?.find(
																		(c) =>
																			c.value ===
																			formik.values
																				.customer_id,
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
										<div className='col-md-5'>
											<div className='row g-2  d-flex justify-content-start'>
												<FormGroup
													id='walk_in_customer_name'
													label='Customer Name'
													className='col-md-8'>
													<Input
														type='text'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.walk_in_customer_name}
														isValid={formik.isValid}
														isTouched={
															formik.touched.walk_in_customer_name
														}
														invalidFeedback={
															formik.errors.walk_in_customer_name
														}
													/>
												</FormGroup>
												<FormGroup
													id='walk_in_customer_phone'
													label='Customer Phone No'
													className='col-md-4'>
													<Input
														formatChars={formatChars}
														placeholder='03111111111'
														mask='03qqqqqqqqq'
														onWheel={(e) => e.target.blur()}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.walk_in_customer_phone}
														isValid={formik.isValid}
														isTouched={
															formik.touched.walk_in_customer_phone
														}
														invalidFeedback={
															formik.errors.walk_in_customer_phone
														}
														validFeedback='Looks good!'
													/>
												</FormGroup>
											</div>
										</div>
									)}
									{/* <div className='col-md-3'>
										<FormGroup
											id='sales_rep_id'
											label='Sales Rep'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
												isLoading={saleRepDropDownLoading}
												options={saleRepDropDown}
												value={
													formik.values.sales_rep_id
														? saleRepDropDown?.find(
																(c) =>
																	c.value ===
																	formik.values.sales_rep_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sales_rep_id',
														val ? val.id : '',
													);
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
									<div className='col-md-2'>
										<FormGroup id='date' label=' Date'>
											<Input
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
								</div>

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-3'>Item </th>
											<th className='col-md-2'>Qty</th>

											<th className='col-md-2'> Rate</th>
											<th className='col-md-2'> Total</th>

											<th className='col-md-1'>.</th>
										</tr>
									</thead>
									<tbody>
										{formik.values.childArray.length > 0 &&
											formik.values.childArray.map((items, index) => (
												<tr className='row' key={items.index}>
													<td className='col-md-3'>
														<FormGroup
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect
																styles={customStyles}
																className='col-md-12'
																classNamePrefix='select'
																options={itemOptions}
																isLoading={itemOptionsLoading}
																value={
																	items.item_id
																		? itemOptions.find(
																				(c) =>
																					c.value ===
																					items.item_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].item_id`,
																		val ? val.id : '',
																	);

																	formik.setFieldValue(
																		`childArray[${index}].retail_price`,
																		val ? val.retail || '' : '',
																	);

																	formik
																		.setFieldValue(
																			`childArray[${index}].trade_price`,

																			val.retail -
																				(val.retail * 15) /
																					100,
																		)
																		.then(() => {
																			setTriggerRefreshItemOptions(
																				triggerRefreshItemOptions +
																					1,
																			);
																		});
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
															// <div className='invalid-feedback'>
															<p
																style={{
																	color: '#ef4444',
																	textAlign: 'left',
																	marginTop: '0.25rem',
																	fontSize: '0.875em',
																}}>
																{
																	formik.errors[
																		`childArray[${index}]item_id`
																	]
																}
															</p>
														)}
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<InputGroup>
																<Input
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`childArray[${index}].quantity`,
																			val.target.value,
																		);
																		setTriggerCalculateTotal(
																			triggerCalculateTotal +
																				1,
																		);
																	}}
																	value={items.quantity}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.quantity
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]quantity`
																		]
																	}
																/>
															</InputGroup>
														</FormGroup>
													</td>

													<td className='col-md-2'>
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
																		? formik.touched.childArray[
																				index
																		  ]?.quoted_price
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]quoted_price`
																	]
																}
															/>
														</FormGroup>
													</td>
													<td className='col-md-2'>
														<strong>
															{(
																items.quantity * items.quoted_price
															)?.toLocaleString(undefined, {
																maximumFractionDigits: 4,
															}) || 0}
														</strong>
													</td>

													<td className='col-md-1 mt-1'>
														<Button
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
								<div className='row g-4 d-flex align-items-center'>
									<div className='col-md-2'>
										<Button
											color='primary'
											icon='add'
											onClick={() => {
												formik.setFieldValue('childArray', [
													...formik.values.childArray,
													{
														item_id: '',
														quoted_price: '',
														retail_price: '',
														quantity: '',
														trade_price: '',
														gst_amount: '',
														gst: '',
													},
												]);
											}}>
											Add New Item
										</Button>
									</div>

									<div className='col-md-5'>
										<FormGroup id='remarks' label='Subject'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.remarks}
												isValid={formik.isValid}
												isTouched={formik.touched.remarks}
												invalidFeedback={formik.errors.remarks}
											/>
										</FormGroup>
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
								</div>
								<div className='row g-4 pt-2 d-flex align-items-center'>
									<div className='col-md-10 '>
										<FormGroup id='termcondition' label=' Terms & conditions'>
											<Textarea
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.termcondition}
												isValid={formik.isValid}
												isTouched={formik.touched.termcondition}
												invalidFeedback={formik.errors.termcondition}
											/>
										</FormGroup>
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
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
											formik.resetForm();
										}}>
										Reset
									</Button>
								</CardFooterLeft>
								<CardFooterRight>
									<Button
										type='button'
										className='me-3'
										icon={isLoading ? null : 'Save'}
										isLight
										color='success'
										isDisable={isLoading}
										onClick={handleSaveClick}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading ? 'Saving' : 'Save'}
									</Button>
								</CardFooterRight>
							</CardFooter>
						</Card>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setState(false)}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

Add.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Add;
