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
// import moment from 'moment';
// import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
// import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
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

const validate = (values) => {
	let errors = {};

	if (!values.po_no) {
		errors.po_no = 'Required';
	}
	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	if (!values.request_date) {
		errors.request_date = 'Required';
	}

	if (!values.childArray.length > 0) {
		errors.childArray = 'Required';
	}

	// if (data.rate < 0) {
	// 	errors = {
	// 		...errors,
	// 		[`childArray[${index}]purchase_price`]: 'Purchase price should not be negative',
	// 	};
	// }

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}

		if (data.rate < 0) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'rate should be greater or equal to 0',
			};
		}

		if (!data.rate) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'Required!',
			};
		}

		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
	});
	// eslint-disable-next-line no-console
	console.log(errors);
	return errors;
};
const AdjustInventory = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	// const [rate, SetPrice] = useState('');
	// const [total, SetUnit] = useState('');

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

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
			po_type: 1,
			po_no: '',
			supplier_id: '',
			total: '',
			is_cancel: 0,
			is_approved: 0,
			is_received: 0,
			request_date: todayDate,
			remarks: '',
			category_id: '',
			sub_category_id: '',
			childArray: [],
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
	};
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.total = data.quantity * data.rate;
		});
		formik.setFieldValue(`childArray`, arr);

		const total =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => a + parseFloat(v !== undefined ? v.total : 0),
							0,
						),
				  )
				: 0;
		formik.values.total = total;
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
		apiClient
			.post(`/addPurchaseOrder`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refreshTableData();
					setIsLoading(false);
					// getItemsOptions();
				} else {
					setIsLoading(false);
				}
			})
			.catch(() => {
				setIsLoading(false);
			});
	};
	const getLatestPoNo = () => {
		apiClient.get(`/getLatestpono`).then((response) => {
			formik.setFieldValue('po_no', response.data.po_no);
		});
	};
	useEffect(() => {
		if (state === true) {
			getLatestPoNo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);
	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');

		setSubOptionsLoading(true);

		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
				setSubOptionsLoading(false);
			});
		// eslint-disable-next-line no-console
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.category_id]);
	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoriesOptions(rec);
			setCategoriesOptionsLoading(false);
		});
		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(1);
	// const [itemOptions2, setItemOptions2] = useState([]);

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);

		apiClient
			.get(
				`/getItemOemDropDown?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data?.data?.map(({ id, name, machine_part_oem_part }) => ({
					id,
					value: id,
					label: `${machine_part_oem_part?.machine_part?.subcategories?.categories?.name}-${machine_part_oem_part?.machine_part?.subcategories?.name}-${name}`,
				}));
				formik.setFieldValue(`childArray[${index}].items_options`, rec);

				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
			});
		// eslint-disable-next-line no-console
		// } else {
		// 	formik.setFieldValue(`childArray[${index}].items_options`, []);
		// 	formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
		// }
	};

	useEffect(() => {
		// eslint-disable-next-line no-unused-expressions, no-undef
		adssapowqpiterqywip;
		// refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	// eslint-disable-next-line no-console
	console.log('lun khao');
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='primary'
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Adjust
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
						<ModalTitle id='exampleModalLabel'>Add Purchase Order</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2  d-flex justify-content-start'>
									<div className='col-md-2'>
										<FormGroup id='po_no' label='PO NO' className='col-md-12'>
											<Input
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

									<div className='col-md-3'>
										<FormGroup
											id='supplier_id'
											label='Supplier'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
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
														val ? val.id : '',
													);
												}}
												invalidFeedback={formik.errors.supplier_id}
											/>
										</FormGroup>
										{formik.errors.supplier_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#ef4444',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.supplier_id}
											</p>
										)}
									</div>

									<div className='col-md-2'>
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
										<FormGroup
											id='remarks'
											label='Subject'
											className='col-md-12'>
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
								</div>

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-3'>Item </th>
											<th className='col-md-2'>Quantity</th>
											<th className='col-md-2'>Rate</th>

											<th className='col-md-2'>Total</th>
											<th className='col-md-1'>Remove</th>
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
																isClearable
																styles={customStyles}
																className='col-md-12'
																classNamePrefix='select'
																options={items.items_options}
																isLoading={
																	items.items_options_loading
																}
																value={
																	items.item_id
																		? items.items_options.find(
																				(c) =>
																					c.value ===
																					items.item_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik
																		.setFieldValue(
																			`childArray[${index}].item_id`,
																			val ? val.id : '',
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
																	fontSize: '0.875em',
																	marginTop: '0.25rem',
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
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																size='sm'
																onChange={(val) => {
																	const inputValue =
																		val.target.value;
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
																			triggerCalculateTotal +
																				1,
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.quantity}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
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
														</FormGroup>
													</td>
													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].rate`}
															label=''
															className='col-md-12'>
															<Input
																onWheel={(e) => e.target.blur()}
																type='number'
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].rate`,
																		val.target.value,
																	);
																	setTriggerCalculateTotal(
																		triggerCalculateTotal + 1,
																	);
																}}
																onBlur={formik.handleBlur}
																value={items.rate}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																				index
																		  ]?.rate
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]rate`
																	]
																}
															/>
														</FormGroup>
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].total`}
															label=''
															type='number'
															className='col-md-12'>
															<strong>
																{items.total
																	? items.total.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																	  )
																	: 0}
															</strong>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]total`
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
																		`childArray[${index}]total`
																	]
																}
															</p>
														)}
													</td>
													<td className='col-md-1'>
														<Button
															icon='cancel'
															color='danger'
															onClick={() => {
																removeRow(index);

																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
														/>{' '}
													</td>
												</tr>
											))}
										<tr>
											<div className='row align-items-bottom justify-content-end'>
												<td className='col-md-2 align-items-center justify-content-start'>
													<div className='row g-4 d-flex align-items-start'>
														<div className='col-md-12 d-flex align-items-center mt-4'>
															<Button
																color='primary'
																icon='add'
																className='mt-4'
																onClick={() => {
																	formik
																		.setFieldValue(
																			'childArray',
																			[
																				...formik.values
																					.childArray,
																				{
																					item_id: '',
																					quantity: '',
																					rate: '',
																					total: 0,
																					items_options_loading: true,
																					items_options:
																						[],
																				},
																			],
																		)
																		.then(
																			getItemsBasedOnSubCategory(
																				formik.values
																					.childArray
																					.length,
																			),
																		);
																}}>
																Add
															</Button>
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<div>
															<FormGroup
																id='category_id'
																label='Category'>
																<ReactSelect
																	isLoading={
																		categoriesOptionsLoading
																	}
																	options={categoriesOptions}
																	value={
																		formik.values.category_id
																			? categoriesOptions?.find(
																					(c) =>
																						c.value ===
																						formik
																							.values
																							.category_id,
																			  )
																			: null
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			'category_id',
																			val !== null && val.id,
																		);
																		formik.setFieldValue(
																			'category_name',
																			val !== null &&
																				val.label,
																		);

																		// getSubCategoriesByCategory(val.id);
																	}}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
															{formik.errors.category_id && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																	}}>
																	{formik.errors.category_id}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<div>
															<FormGroup
																id='sub_category_id'
																label='Sub Category'>
																<ReactSelect
																	isLoading={subOptionsLoading}
																	options={subOption}
																	isClearable
																	value={
																		formik.values
																			.sub_category_id
																			? subOption?.find(
																					(c) =>
																						c.value ===
																						formik
																							.values
																							.sub_category_id,
																			  )
																			: null
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			'sub_category_id',
																			val !== null && val.id,
																		);

																		// getSubCategoriesByCategory(val.id);
																	}}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
															{formik.errors.sub_category_id && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																	}}>
																	{formik.errors.sub_category_id}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<p className='col-md-12 mt-4' label=''>
															<strong>Total</strong>
														</p>
													</div>
												</td>
												<td className='col-md-3 align-items-center justify-content-center'>
													<div className='row'>
														<FormGroup
															className='col-md-9 mt-4'
															label=''>
															<strong>
																{formik.values.total
																	? formik.values.total.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																	  )
																	: 0}
															</strong>
														</FormGroup>
													</div>
												</td>
											</div>
										</tr>
										<hr />
									</tbody>
								</table>
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
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
											getLatestPoNo();
										}}>
										Reset
									</Button>
								</CardFooterLeft>
								<CardFooterRight>
									<Button
										className='me-3'
										icon={isLoading ? null : 'Save'}
										isLight
										color='success'
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
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

AdjustInventory.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default AdjustInventory;
