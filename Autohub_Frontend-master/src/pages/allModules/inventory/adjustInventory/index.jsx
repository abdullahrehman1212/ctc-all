// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import ReactSelect from 'react-select';

import { updateSingleState } from '../../redux/tableCrud/index';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	// CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/apiClient';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import View from './view';
import 'flatpickr/dist/themes/light.css';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Spinner from '../../../../components/bootstrap/Spinner';
import Input from '../../../../components/bootstrap/forms/Input';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const validationSchemaForAdjustInventory = (values) => {
	console.log("Running Robust Validation V4", values);
	const errors = {};

	if (!values) return errors;

	// Ensure childArray is valid
	const childArray = [];
	if (Array.isArray(values.childArray)) {
		for (let i = 0; i < values.childArray.length; i += 1) {
			const item = values.childArray[i];
			if (item && typeof item === 'object') {
				childArray.push({ data: item, index: i });
			}
		}
	}

	if (!values.date) {
		errors.request_date = 'Required';
	}

	if (childArray.length === 0) {
		errors.childArray = 'Required';
	}

	if (!values.store_id) {
		errors.store_id = 'Required';
	}

	// Safe loop using for...of
	// eslint-disable-next-line no-restricted-syntax
	for (const { data, index } of childArray) {
		// item_id check
		if (!data.item_id) {
			errors[`childArray[${index}]item_id`] = 'Required';
		}

		// Quantity check
		if (!data.quantity || Number(data.quantity) <= 0) {
			errors[`childArray[${index}]quantity`] = 'Required';
		} else {
			// Logic for remove type validation
			// eslint-disable-next-line no-lonely-if
			if (values.adjust_type === 'remove') {
				const avlQty = Number(data.avl_quantity || 0);
				const totalQty = Number(data.quantity || 0); // Note: Simple check per row, more complex aggregation logic can be added if item is duplicated
				if (totalQty > avlQty) {
					errors[`childArray[${index}]quantity`] = `Exceeds available quantity (${avlQty})`;
				}
			}
		}

		// Rate check
		if (!data.rate || Number(data.rate) <= 0) {
			errors[`childArray[${index}]rate`] = 'Required';
		}
	}

	return errors;
};

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];
// require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

	const formik = useFormik({
		initialValues: {
			adjust_type: 'add',
			total_amount: '',
			date: todayDate,
			// item_id: "",
			// quantity: '',
			// rate: '',
			childArray: [],
		},
		validate: validationSchemaForAdjustInventory,
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [selectedcategory, setSelectedCategory] = useState('');
	const [subcategoryDropDown, setSubcategoryDropDown] = useState([]);
	const [subcategoryDropDownLoading, setSubcategoryDropDownLoading] = useState([]);
	const [selectedsubcategory, setSelectedSubcategory] = useState('');
	const [itemDropDown, setItemDropDown] = useState([]);
	const [itemDropDownLoading, setItemDropDownLoading] = useState([]);
	const [selecteditem, setSelectedItem] = useState('');

	const [CapitalAccounts, setCapitalAccounts] = useState([]);
	const [CapitalAccountsLoading, setCapitalAccountsLoading] = useState([]);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [itemId, setItemId] = useState('');
	const [item, setItem] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	// states for accounts
	const [disposalAccounts, setDisposalAccounts] = useState([]);
	const [disposalAccountsLoading, setDisposalAccountsLoading] = useState(false);
	const [capitalAccountOptions, setCapitalAccountOptions] = useState([]);
	const [capitalAccountOptionsLoading, setCapitalAccountOptionsLoading] = useState(false);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeLoading, setStoreLoading] = useState(false);
	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');
		setSubOptionsLoading(true);
		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${formik.values.category_id ? formik.values.category_id : ''
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
	}, [formik.values.category_id]);
	useEffect(() => {
		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoriesOptions(rec);
			setCategoriesOptionsLoading(false);
		});
	}, []);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);
		setHeaderCloseStatus(true);
	};

	const handleSave = () => {
		submitForm(formik.values);
	};

	const submitForm = (myFormik) => {
		console.log(myFormik);
		apiClient
			.post(`/addAdjustItemStock`, myFormik)
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

	useEffect(() => {
		apiClient.get(`/getDisposeAccounts`).then((response) => {
			const rec = response.data.disposeAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setDisposalAccounts(rec);
			setDisposalAccountsLoading(false);
		});

		apiClient.get(`/getCapitalAccounts`).then((response) => {
			const rec = response.data.capitalAccounts?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCapitalAccountOptions(rec);
			setCapitalAccountOptionsLoading(false);
		});
	}, []);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getAdjustInventory?records=${store.data.inventoryManagementModule.inventory.perPage}&pageNo=${store.data.inventoryManagementModule.inventory.pageNo
				}&colName=id&sort=desc
				&subcategory_id=${selectedsubcategory ? selectedsubcategory.id : ''}&category_id=${selectedcategory ? selectedcategory.id : ''
				}&item_id=${selecteditem ? selecteditem.id : ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.itemsInventory?.data || []);
				setTableData2(response.data.itemsInventory);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.itemsInventory,
						'inventoryManagementModule',
						'inventory',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
		setCategoryDropDownLoading(true);

		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryDropDown(rec);
			setCategoryDropDownLoading(false);
		});
	}, []);

	useEffect(() => {
		setSubcategoryDropDownLoading(true);
		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${selectedcategory ? selectedcategory.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubcategoryDropDown(rec);
				setSubcategoryDropDownLoading(false);
			});
	}, [selectedcategory]);

	useEffect(() => {
		setItemDropDownLoading(true);

		// eslint-disable-next-line no-console
		apiClient
			.get(
				`/getItemOemDropDown?category_id=${selectedcategory ? selectedcategory.id : ''
				}&sub_category_id=${selectedsubcategory ? selectedsubcategory.id : ''}`,
			)
			.then((response) => {
				// eslint-disable-next-line camelcase
				const rec = response.data?.data?.map(({ id, name, machine_part_oem_part }) => ({
					id,
					value: id,
					label: `${machine_part_oem_part?.machine_part?.subcategories?.categories?.name}-${machine_part_oem_part?.machine_part?.subcategories?.name}-${name}`,
				}));
				setItemDropDown(rec);
				setItemDropDownLoading(false);
			});

		// eslint-disable-next-line no-console
	}, [selectedcategory, selectedsubcategory]);

	useEffect(() => {
		refreshTableData();
	}, [store.data.inventoryManagementModule.inventory.perPage, store.data.inventoryManagementModule.inventory.pageNo]);

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);

		apiClient
			.get(
				`/getItemOemDropDown`,
			)
			.then((response) => {
				console.log(response, "respodjdd")
				const rec = response.data?.data?.map(({ id, name, machine_part_oem_part }) => ({
					id,
					value: id,
					label: `${machine_part_oem_part?.machine_part?.subcategories?.categories?.name}-${machine_part_oem_part?.machine_part?.subcategories?.name}-${name}`,
				}));
				formik.setFieldValue(`childArray[${index}].items_options`, rec);
				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
			});
	};

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
		formik.values.total_amount = total;
	};

	useEffect(() => {
		calculateTotal();
	}, [triggerCalculateTotal]);

	const getItemLastPriceAvlQantity = (id, index) => {
		apiClient.get(`/getAdjustItemId?item_id=${id}`).then((response) => {
			formik.setFieldValue(
				`childArray[${index}].avl_quantity`,
				response.data?.getLastPurchasePrice?.quantity,
			);
			formik.setFieldValue(
				`childArray[${index}].last_purchase_price`,
				response.data?.getRate,
			);
			formik.setFieldValue(
				`childArray[${index}].avg_cost`,
				response.data?.avg_cost,
			);
		});
	};

	useEffect(() => {
		apiClient
			.get(`/getStoredropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));

				formik.setFieldValue('store_id', rec[0] !== null ? rec[0].id : '');
				setStoreOptions(rec);
				setStoreLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => { });
	}, []);

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};
	console.log(formik.values, "formik")
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Adjust Inventory</CardTitle>
								</CardLabel>
								<CardActions className='row g-4'>
									<ButtonGroup>
										<div className='col-auto'>
											<Button
												color='primary'
												icon='Add'
												hoverShadow='default'
												onClick={() => {
													initialStatus();
													setState(true);
													setStaticBackdropStatus(true);
													// setItem(
													// 	`${item?.item?.category.name}-${item?.item?.subcategory.name}-${item?.item?.name}`,
													// );
													setItemId(item?.id);
												}}>
												Adjust
											</Button>
										</div>
									</ButtonGroup>
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									{/* <div className='col-md-2'>
										<FormGroup label='Category' id='category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryDropDown}
												isLoading={categoryDropDownLoading}
												isClearable
												value={selectedcategory}
												onChange={(val) => {
													setSelectedCategory(val);
													setSelectedSubcategory('');
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Sub Category' id='subcategory_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subcategoryDropDown}
												isLoading={subcategoryDropDownLoading}
												isClearable
												value={selectedsubcategory}
												onChange={(val) => {
													setSelectedSubcategory(val);
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Item' id='item_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={itemDropDown}
												isLoading={itemDropDownLoading}
												isClearable
												value={selecteditem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
											/>
										</FormGroup>
									</div> */}

									{/* <div className='col-md-2'>
										<Button
											color='primary'
											onClick={() => refreshTableData()}
											isOutline
											// isDisable={landsViewLoading}
											isActive>
											Search
										</Button>
									</div> */}
								</div>
								<br />

								<View
									tableData={tableData}
									tableData2={tableData2}
									refreshTableData={refreshTableData}
									tableDataLoading={tableDataLoading}
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>

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
						<ModalTitle id='exampleModalLabel'>Adjust Item Stock</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row '>
									<Checks
										type='switch'
										id='adjust_type'
										label={
											formik.values.adjust_type === 'add'
												? 'Add Inventory'
												: 'Remove Inventory'
										}
										name='checkedCheck'
										onChange={(e) => {
											const newAdjustType = e.target.checked
												? 'add'
												: 'remove';
											formik.setFieldValue('adjust_type', newAdjustType);
										}}
										isValid={formik.isValid}
										checked={formik.values.adjust_type === 'add'} // Set checked based on adjust_type value
									/>
								</div>
								<div className='row g-2  d-flex justify-content-start'>
									{/* {formik.values.adjust_type === 'remove' && (
										<div className='col-md-3'>
											<FormGroup
												id='dispose_account_id'
												label='Dispose'
												className='col-md-12'>
												<ReactSelect
													className='col-md-12'
													isClearable
													isLoading={disposalAccountsLoading}
													options={disposalAccounts}
													value={
														formik.values.dispose_account_id
															? disposalAccounts?.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.dispose_account_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'dispose_account_id',
															val ? val.id : '',
														);
													}}
													invalidFeedback={
														formik.errors.dispose_account_id
													}
												/>
											</FormGroup>
											{formik.errors.dispose_account_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#ef4444',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors.dispose_account_id}
												</p>
											)}
										</div>
									)}

									{formik.values.adjust_type === 'add' && (
										<div className='col-md-3'>
											<FormGroup
												id='capital_account_id'
												label='Capital'
												className='col-md-12'>
												<ReactSelect
													className='col-md-12'
													isClearable
													isLoading={capitalAccountOptionsLoading}
													options={capitalAccountOptions}
													value={
														formik.values.capital_account_id
															? capitalAccountOptions?.find(
																	(c) =>
																		c ===
																		formik.values
																			.capital_account_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'capital_account_id',
															val ? val?.id : '',
														);
													}}
													invalidFeedback={
														formik.errors.capital_account_id
													}
												/>
											</FormGroup>
											{formik.errors.capital_account_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#ef4444',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors.capital_account_id}
												</p>
											)}
										</div>
									)} */}

									<div className='col-md-2'>
										<FormGroup id='date' label='Date'>
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

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-3'>Item </th>
											<th className='col-md-1'>Qty in Stock</th>
											<th className='col-md-2'>Quantity</th>
											<th className='col-md-1'>Last Purhase Rate</th>
											<th className='col-md-2'>Rate</th>
											<th className='col-md-2'>Total</th>
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

																	getItemLastPriceAvlQantity(
																		val.id,
																		index,
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
													<td className='col-md-1'>
														{items?.avl_quantity}
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																aria-label="Quantity"
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
													<td className='col-md-1'>
														{items?.last_purchase_price}
													</td>
													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].rate`}
															label=''
															className='col-md-12'>
															<Input
																aria-label="Rate"
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
															<strong>Total Amount</strong>
														</p>
													</div>
												</td>
												<td className='col-md-3 align-items-center justify-content-center'>
													<div className='row'>
														<FormGroup
															className='col-md-9 mt-4'
															label=''>
															<strong>
																{formik.values.total_amount
																	? formik.values.total_amount.toLocaleString(
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
											// getLatestPoNo();
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
		</PageWrapper>
	);
};

export default Categories;
