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
// import showNotification from '../../../../components/extras/showNotification';

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
	if (!values.purchaseorderchild.length > 0) {
		errors.purchaseorderchild = 'Choose Items In list';
	}
	values.purchaseorderchild.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`purchaseorderchild[${index}]item_id`]: 'Required!',
			};
		}

		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`purchaseorderchild[${index}]quantity`]: 'Required',
			};
		}
	});

	// if (!values.purchase_expenses.length > 0) {
	// 	errors.purchase_expenses = 'Choose Items In list';
	// }

	values.purchase_expenses.forEach((data, index) => {
		if (!data.coa_account_id) {
			errors = {
				...errors,
				[`purchase_expenses[${index}].coa_account_id`]: 'Required!',
			};
		}
		if (!data.expense_type_id) {
			errors = {
				...errors,
				[`purchase_expenses[${index}].expense_type_id`]: 'Required!',
			};
		}
		if (!data.amount) {
			errors = {
				...errors,
				[`purchase_expenses[${index}].amount`]: 'Required!',
			};
		}
	});
	// console.log('errors', errors);
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const navigate = useNavigate();
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
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

	const formik = useFormik({
		initialValues: editingItem,
		totalExpenses: 0,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const removeRowExpenses = (i) => {
		formik.setFieldValue('purchase_expenses', [
			...formik.values.purchase_expenses.slice(0, i),
			...formik.values.purchase_expenses.slice(i + 1),
		]);

		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};

	const removeRow = (i) => {
		formik.setFieldValue('purchaseorderchild', [
			...formik.values.purchaseorderchild.slice(0, i),
			...formik.values.purchaseorderchild.slice(i + 1),
		]);
	};
	const submitForm = (data) => {
		apiClient
			.post(`/updatePurchaseOrder`, data)
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
		apiClient
			.get(`/getExpenseTypesDropDown`)
			.then((response) => {
				const rec = response.data.expensetypes.map(({ id, name }) => ({
					id,
					value: id,
					label: `${name}`,
				}));
				setExpTypesOptions(rec);
				setExpTypesOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
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
		formik.setFieldValue(`purchaseorderchild[${index}].items_options_loading`, true);

		apiClient
			.get(
				`/getItemOemDropDown?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}&item_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}&part_model_id=${formik.values.part_model_id ? formik.values.part_model_id : ''}`,
			)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				formik.setFieldValue(`purchaseorderchild[${index}].items_options`, rec);

				formik.setFieldValue(`purchaseorderchild[${index}].items_options_loading`, false);
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
		// 	formik.setFieldValue(`purchaseorderchild[${index}].items_options`, []);
		// 	formik.setFieldValue(`purchaseorderchild[${index}].items_options_loading`, false);
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
			.catch((err) => {});
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
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.category_id]);
	useEffect(() => {
		formik.setFieldValue('machine_part_id', '');

		setMachinePartsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsDropDown?sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}`,
			)
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
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.sub_category_id]);
	useEffect(() => {
		formik.setFieldValue('part_model_id', '');

		setPartModelsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
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
		// console.log('arrayexpense', formik.values.purchase_expenses);
	}, []);

	useEffect(() => {
		calculateExpenses();
	}, [triggerCalculateExpenses]);

	const calculateExpenses = () => {
		// formik.values.expenseList.forEach((item) => {});
		const t =
			formik.values.purchase_expenses !== null
				? parseFloat(
						formik.values.purchase_expenses?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
							0,
						),
				  )
				: 0;
		formik.setFieldValue('totalExpenses', t);
	};

	return (
		<div className='col-12'>
			<ModalBody>
				<div className='col-12'>
					<Card stretch tag='form' onSubmit={formik.handleSubmit}>
						<CardBody>
							<div className='row g-2  d-flex justify-content-start'>
								<div className='col-md-3'>
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
								<div className='col-md-4'>
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
								</div>
								<div className='col-md-3'>
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
							<table className='table text-center table-modern'>
								<thead>
									<tr className='row'>
										<th className='col-md-4'>Item Parts</th>
										<th className='col-md-3'>Quantity</th>
										<th className='col-md-3'>Remarks</th>
										<th className='col-md-2'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.purchaseorderchild?.length > 0 &&
										formik.values.purchaseorderchild?.map((items, index) => (
											<tr className='row' key={items.index}>
												<td className='col-md-4'>
													<FormGroup
														label=''
														id={`purchaseorderchild[${index}].item_id`}>
														<ReactSelect
															className='col-md-12'
															classNamePrefix='select'
															options={itemOptions}
															isLoading={kitOptionsLoading}
															isClearable
															value={
																formik.values.purchaseorderchild[
																	index
																].item_id
																	? itemOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.purchaseorderchild[
																					index
																				].item_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`purchaseorderchild[${index}].item_id`,
																	val !== null && val.id,
																);
															}}
															isValid={formik.isValid}
															isTouched={formik.touched.item_id}
															invalidFeedback={
																formik.errors[
																	`purchaseorderchild[${index}].item_id`
																]
															}
															filterOption={createFilter({
																matchFrom: 'start',
															})}
														/>
													</FormGroup>
													{formik.errors[
														`purchaseorderchild[${index}]item_id`
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
																	`purchaseorderchild[${index}]item_id`
																]
															}
														</p>
													)}
												</td>
												<td className='col-md-3'>
													<FormGroup
														id={`purchaseorderchild[${index}].quantity`}
														label=''
														type='number'
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.quantity}
															isValid={formik.isValid}
															isTouched={
																formik.touched.purchaseorderchild
																	? formik.touched
																			.purchaseorderchild[
																			index
																	  ]?.quantity
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`purchaseorderchild[${index}]quantity`
																]
															}
														/>
													</FormGroup>
												</td>

												<td className='col-md-3'>
													<FormGroup
														id={`purchaseorderchild[${index}].remarks`}
														label=''
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.remarks}
															isValid={formik.isValid}
															isTouched={formik.touched.remarks}
															invalidFeedback={formik.errors.remarks}
														/>
													</FormGroup>
												</td>

												<td className='col-md-2 mt-1'>
													<Button
														isDisable={
															formik.values.purchaseorderchild
																.length === 1
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
							<div className='row g-4 d-flex align-items-end'>
								<div className='col-md-3'>
									<FormGroup id='category_id' label='Category'>
										<ReactSelect
											isLoading={categoriesOptionsLoading}
											options={categoriesOptions}
											value={
												formik.values.category_id
													? categoriesOptions?.find(
															(c) =>
																c.value ===
																formik.values.category_id,
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
													val !== null && val.label,
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
								<div className='col-md-3'>
									<FormGroup id='sub_category_id' label='Sub Category'>
										<ReactSelect
											isLoading={subOptionsLoading}
											options={subOption}
											isClearable
											value={
												formik.values.sub_category_id
													? subOption?.find(
															(c) =>
																c.value ===
																formik.values.sub_category_id,
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
								<div className='col-md-3'>
									<FormGroup id='machine_part_id' label='Item'>
										<ReactSelect
											isLoading={machinePartsOptionsLoading}
											options={machinePartsOptions}
											isClearable
											value={
												formik.values.machine_part_id
													? machinePartsOptions?.find(
															(c) =>
																c.value ===
																formik.values.machine_part_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'machine_part_id',
													val !== null && val.id,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.machine_part_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.machine_part_id}
										</p>
									)}
								</div>
								<div className='col-md-3'>
									<FormGroup id='part_model_id' label='Part Model'>
										<ReactSelect
											isLoading={partModelsOptionsLoading}
											options={partModelsOptions}
											isClearable
											value={
												formik.values.part_model_id
													? partModelsOptions?.find(
															(c) =>
																c.value ===
																formik.values.part_model_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'part_model_id',
													val !== null && val.id,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.part_model_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.part_model_id}
										</p>
									)}
								</div>
								<div className='col-md-3 d-flex align-items-center'>
									<br />
									<Button
										color='primary'
										icon='add'
										onClick={() => {
											formik
												.setFieldValue('purchaseorderchild', [
													...formik.values.purchaseorderchild,
													{
														items_options: [],
														items_options_loading: true,
														item_id: '',
														quantity: '',
														received_quantity: 0,
														remarks: '',
													},
												])
												.then(
													getItemsBasedOnSubCategory(
														formik.values.purchaseorderchild.length,
													),
												);
										}}>
										Add New Item
									</Button>
								</div>
							</div>

							<div className='row d-flex justify-content-center mt-2'>
								<table className='table  text-center'>
									<thead>
										<tr>
											<th>Expense Account </th>
											<th>Payable Account </th>
											<th>Description</th>
											<th>Amount</th>
											<th> </th>
										</tr>
									</thead>

									<tbody>
										{formik.values.purchase_expenses?.length > 0 &&
											formik.values.purchase_expenses?.map((item, index) => (
												<tr key={item.id}>
													<td className='col-md-3'>
														<FormGroup
															label=''
															id={`purchase_expenses[${index}].expense_type_id`}>
															<ReactSelect
																className='col-md-12'
																classNamePrefix='select'
																options={expTypesOptions}
																isLoading={expTypesOptionsLoading}
																isClearable
																value={
																	formik.values.purchase_expenses[
																		index
																	].expense_type_id
																		? expTypesOptions.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.purchase_expenses[
																						index
																					]
																						.expense_type_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`purchase_expenses[${index}].expense_type_id`,
																		val !== null && val.id,
																	);
																}}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.purchase_expenses
																		? formik.touched
																				.purchase_expenses[
																				index
																		  ]?.expense_type_id
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`purchase_expenses[${index}].expense_type_id`
																	]
																}
															/>
														</FormGroup>
														{formik.errors[
															`purchase_expenses[${index}]expense_type_id`
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
																		`purchase_expenses[${index}]expense_type_id`
																	]
																}
															</p>
														)}
													</td>
													<td className='col-md-3'>
														<FormGroup
															label=''
															id={`purchase_expenses[${index}].coa_account_id`}>
															<ReactSelect
																className='col-md-12'
																classNamePrefix='select'
																options={expAccountsOptions}
																isLoading={expAccountOptionsLoading}
																isClearable
																value={
																	formik.values.purchase_expenses[
																		index
																	].coa_account_id
																		? expAccountsOptions.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.purchase_expenses[
																						index
																					]
																						.coa_account_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`purchase_expenses[${index}].coa_account_id`,
																		val !== null && val.id,
																	);
																}}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.expenseList
																		? formik.touched
																				.expenseList[index]
																				?.coa_account_id
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`purchase_expenses[${index}].coa_account_id`
																	]
																}
															/>
														</FormGroup>
														{formik.errors[
															`purchase_expenses[${index}].coa_account_id`
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
																		`purchase_expenses[${index}].coa_account_id`
																	]
																}
															</p>
														)}
													</td>

													<td>
														<FormGroup
															id={`purchase_expenses[${index}].description`}
															className='col-md-12'>
															<Input
																type='text'
																onChange={(val) => {
																	formik.setFieldValue(
																		`purchase_expenses[${index}].description`,
																		val.target.value,
																	);
																}}
																isTouched
																invalidFeedback={
																	formik.errors[
																		`purchase_expenses[${index}].description`
																	]
																}
																value={item.description}
															/>
														</FormGroup>
													</td>
													<td>
														<FormGroup
															id={`purchase_expenses[${index}].amount`}
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={async (val) => {
																	const t =
																		await formik.setFieldValue(
																			`purchase_expenses[${index}].amount`,
																			val.target.value,
																		);
																	if (t)
																		setTriggerCalculateExpenses(
																			triggerCalculateExpenses +
																				1,
																		);
																}}
																isTouched
																invalidFeedback={
																	formik.errors[
																		`purchase_expenses[${index}].amount`
																	]
																}
																value={item.amount}
															/>
														</FormGroup>
													</td>
													<td className='col-md-1 mt-1'>
														<Button
															// isDisable={
															// 	formik.values.expenseList.length ===
															// 	1
															// }
															icon='cancel'
															color='danger'
															onClick={() => removeRowExpenses(index)}
														/>
													</td>
												</tr>
											))}
										<tr key={0}>
											<td colSpan={3}>
												<strong>Total Expenses</strong>
											</td>
											<td className='col-md-3'>
												<strong> {formik.values.totalExpenses}</strong>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className='col-md-3 d-flex align-items-center'>
								<br />
								<Button
									color='primary'
									icon='add'
									onClick={() => {
										formik.setFieldValue('purchase_expenses', [
											...formik.values.purchase_expenses,
											{
												amount: '',
												description: '',
												coa_account_id: '',
												expense_type_id: '',
											},
										]);
									}}>
									Add New Expense
								</Button>
							</div>
							<hr />
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
						icon={isLoading ? null : 'Update'}
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
		</div>
	);
};
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit;
