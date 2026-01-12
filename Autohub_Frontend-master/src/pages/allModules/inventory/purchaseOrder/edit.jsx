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
import ReactSelect, { createFilter } from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
import { _titleError, _titleSuccess } from '../../../../notifyMessages/erroSuccess';
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
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import AddSupplier from '../../suppliers/manageSupplier/add';

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
	if (values.childArray && values.childArray.length === 0) {
		errors.childArray = 'Choose Items In list';
	}
	if (values.childArray) {
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
		});
	}

	// if (values.purchase_expenses) {
	// 	values.purchase_expenses.forEach((data, index) => {
	// 		if (!data.coa_account_id) {
	// 			errors = {
	// 				...errors,
	// 				[`purchase_expenses[${index}].coa_account_id`]: 'Required!',
	// 			};
	// 		}
	// 		if (!data.expense_type_id) {
	// 			errors = {
	// 				...errors,
	// 				[`purchase_expenses[${index}].expense_type_id`]: 'Required!',
	// 			};
	// 		}
	// 		if (!data.amount) {
	// 			errors = {
	// 				...errors,
	// 				[`purchase_expenses[${index}].amount`]: 'Required!',
	// 			};
	// 		}
	// 	});
	// }
	// eslint-disable-next-line no-console
	console.log('errors', errors);
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit, refreshTableData }) => {
	const navigate = useNavigate();
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [kitEditOptions, setItemOptions] = useState([]);
	const [editItemOptionsLoading, setEditItemOptionsLoading] = useState(true);
	const [itemOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeLoading, setStoreLoading] = useState(false);
	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);
	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [expAccountsOptions, setExpAccountsOptions] = useState([]);
	const [expAccountOptionsLoading, setExpAccountOptionsLoading] = useState(true);
	const [expTypesOptions, setExpTypesOptions] = useState([]);
	const [expTypesOptionsLoading, setExpTypesOptionsLoading] = useState(true);
	const [counter1, setCounter1] = useState(0);

	const [racks, setRacks] = useState([]);
	const [shelves, setShelves] = useState([]);
	console.log('editingItem', editingItem);
	const getRacksAndShelves = (val) => {
		// Check if val is defined
		if (val) {
			apiClient
				.get(`/getItemOemDropDown?&item_id=${val?.id}`)
				.then((response) => {
					// console.log(response); // Log the entire response to inspect its structure

					if (response.data && Array.isArray(response.data.data)) {
						const itemData = response.data.data.find((item) => item.id === val?.id);

						if (itemData) {
							// Filter racks based on the selected item_id
							const filteredRacks = itemData.racks || [];

							// Filter shelves based on the selected item_id
							const filteredShelves = itemData.shelves || [];

							// Set the state or handle the filtered data as needed
							setRacks(filteredRacks);
							setShelves(filteredShelves);
						} else {
							// eslint-disable-next-line no-console
							console.error('Invalid response format: Unable to find item data');
						}
					} else {
						// eslint-disable-next-line no-console
						console.error('Invalid response format:', response);
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error('Error fetching data:', err);
				});
		} else {
			// If val is undefined, set racks and shelves to empty arrays
			setRacks([]);
			setShelves([]);
		}
	};

	const formik = useFormik({
		initialValues: {
			...editingItem.data,
			po_no: editingItem.data?.po_no || editingItem.data?.purchaseorder_no,
			request_date: editingItem.data?.request_date || editingItem.data?.purchaseorder_date,
			childArray:
				editingItem.data?.childArray || editingItem.data?.purchaseorderchild
					? (editingItem.data.childArray || editingItem.data.purchaseorderchild).map((item) => ({
						...item,
						items_options: item.item_id
							? [{ value: item.item_id, label: item.label }]
							: [], // Initialize with current item
						items_options_loading: false, // Initialize if needed
					}))
					: [],
		},
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
		// Map childArray back to purchaseorderchild if backend expects it
		const payload = {
			...data,
			purchaseorderchild: data.childArray
		};
		apiClient
			.post(`/updatePurchaseOrder`, payload)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateEdit(false);
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

		// eslint-disable-next-line no-console
		apiClient
			.get(`/getAccountsBySubGroup?coa_sub_group_id=8`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setExpAccountsOptions(rec);
				setExpAccountOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);

		apiClient
			.get(
				`/getItemOemDropDown?category_id=${formik.values?.category_id || ''
				}&sub_category_id=${formik.values?.sub_category_id || ''
				}&item_id=${formik.values?.machine_part_id || ''
				}&part_model_id=${formik.values?.part_model_id || ''}`,
			)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				formik.setFieldValue(`childArray[${index}].items_options`, rec);

				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
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
		// } else {
		// 	formik.setFieldValue(`childArray[${index}].items_options`, []);
		// 	formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
		// }
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
			.catch((err) => { });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		apiClient
			.get(`/getPersons?person_type_id=2&isActive=1`)
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
	}, [counter1]);

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
		// Safeguard against undefined formik.values or category_id
		if (formik.values && formik.values.category_id !== undefined) {
			formik.setFieldValue('sub_category_id', '');

			setSubOptionsLoading(true);

			apiClient
				.get(`/getSubCategoriesByCategory?category_id=${formik.values.category_id || ''}`)
				.then((response) => {
					const rec = response.data.subcategories?.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));
					setSubOptions(rec);
					setSubOptionsLoading(false);
				})
				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response && err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
					setSubOptionsLoading(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values?.category_id]);
	useEffect(() => {
		// Safeguard against undefined formik.values or sub_category_id
		if (formik.values && formik.values.sub_category_id !== undefined) {
			formik.setFieldValue('machine_part_id', '');

			setMachinePartsOptionsLoading(true);

			apiClient
				.get(`/getMachinePartsDropDown?sub_category_id=${formik.values.sub_category_id || ''}`)
				.then((response) => {
					const rec = response.data.machine_Parts?.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));
					setMachinePartsOptions(rec);
					setMachinePartsOptionsLoading(false);
				})
				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response && err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
					setMachinePartsOptionsLoading(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values?.sub_category_id]);
	useEffect(() => {
		formik.setFieldValue('part_model_id', '');

		setPartModelsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machinepartmodel?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setPartModelsOptions(rec);
				setPartModelsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);

	useEffect(() => {
		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoriesOptions(rec);
				setCategoriesOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

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
											onWheel={(e) => e.target.blur()}
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
								<div
									className='col-md-2'
									style={{
										display: 'flex',
										alignItems: 'center',
										paddingBottom: '15px',
									}}>
									<AddSupplier
										refreshTableData={refreshTableData}
										setCounter1={setCounter1}
										counter1={counter1}
									/>
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
								<div className='col-md-3'>
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
							<table className='table text-center table-modern'>
								<thead>
									<tr className='row'>
										<th className='col-md-3'>Item Parts</th>
										<th className='col-md-2'>Quantity</th>
										{/* <th className='col-md-2'>Rack</th>
											<th className='col-md-2'>Shelf</th> */}
										<th className='col-md-2'>Remarks</th>
										<th className='col-md-1'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray?.map((items, index) => (
											<tr className='row' key={items.index}>
												<td className='col-md-3'>
													<FormGroup
														label=''
														id={`childArray[${index}].item_id`}>
														<ReactSelect
															// maxMenuHeight={190}
															// eslint-disable-next-line no-undef
															styles={customStyles}
															// size='small'
															className='col-md-12'
															classNamePrefix='select'
															options={
																formik.values.childArray[index]
																	.items_options
															}
															isLoading={
																formik.values.childArray[index]
																	.items_options_loading
															}
															isClearable
															value={
																formik.values.childArray[index]
																	.item_id
																	? formik.values.childArray[
																		index
																	].items_options.find(
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
																getRacksAndShelves(val);
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
																	color: 'red',
																	textAlign: 'left',
																	marginTop: 3,
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
															onChange={formik.handleChange}
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
														id={`childArray[${index}].remarks`}
														label=''
														type='number'
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
														//
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
							<div className='row g-4 d-flex align-items-end'>
								<div className='col-md-3 d-flex align-items-center'>
									<br />
									<Button
										color='primary'
										icon='add'
										onClick={() => {
											formik
												.setFieldValue('childArray', [
													...formik.values.childArray,
													{
														items_options: [],
														items_options_loading: true,
														item_id: '',
														rack_number: racks.map(
															(rack) => rack.rack_number,
														),
														shelf_number: shelves.map(
															(shelf) => shelf.shelf_number,
														),
														quantity: '',
														received_quantity: 0,
														remarks: '',
													},
												])
												.then(
													getItemsBasedOnSubCategory(
														formik.values.childArray.length,
													),
												);
										}}>
										Add New Item
									</Button>
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
										// setReState(!reState);
										formik.resetForm();
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
		</div>
	);
};

export default Edit;
