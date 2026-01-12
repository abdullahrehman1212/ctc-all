// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

import { useSelector } from 'react-redux';
import moment from 'moment';
import Select from 'react-select';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
import { _titleError, _titleSuccess } from '../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
// import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	let errors = {};
	if (!values.date) {
		errors.date = 'Required';
	}

	if (!values.transfer_from) {
		errors.transfer_from = 'Required';
	}
	if (!values.transfer_to) {
		errors.transfer_to = 'Required';
	}
	if (values.transfer_from && values.transfer_to) {
		if (values.transfer_from?.id === values.transfer_to?.id) {
			errors.transfer_from = 'Same stores selected';
			errors.transfer_to = 'Same stores selected';
		}
	}
	if (values.list.length === 0) {
		errors.list = 'Add an Item';
	}
	values.list.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`list[${index}]item_id`]: 'Required!',
			};
		}

		if (!data.qty_transferred > 0) {
			errors = {
				...errors,
				[`list[${index}]qty_transferred`]: 'Required',
			};
		}
		if (data.qty_transferred > data.qty_available) {
			errors = {
				...errors,
				[`list[${index}]qty_transferred`]: 'Insufficient Qty',
			};
		}
	});
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [storeTypeOptions, setStoreTypeOptions] = useState();
	const [storeTypeOptionsLoading, setStoreTypeOptionsLoading] = useState(false);
	const store = useSelector((state) => state.tableCrud);
	const navigate = useNavigate();

	const [state, setState] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [ReRender, setReRender] = useState(0);
	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const [transferToStoreOptions, setTransferToStoreOptions] = useState([]);
	const [transferToStoreOptionsLoading, setTransferToStoreOptionsLoading] = useState(false);

	const [transferFromStoreOptions, setTransferFromStoreOptions] = useState([]);
	const [transferFromStoreOptionsLoading, setTransferFromStoreOptionsLoading] = useState(false);
	// useEffect(() => {

	// }, [])

	const formik = useFormik({
		initialValues: editingItem,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (myFormik) => {
		apiClient
			.post(`/updateStore`, myFormik.values)
			.then((res) => {
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
		submitForm(formik);
		setLastSave(moment());
	};

	const removeRow = (i) => {
		formik.setFieldValue('list', [
			...formik.values.list.slice(0, i),
			...formik.values.list.slice(i + 1),
		]);
		// console.log(formik.touched);
		// console.log(formik.errors);
		setReRender(ReRender + 1);
	};

	const getExistingQty = (idx, val) => {
		if (formik.values.transfer_from && val) {
			formik.setFieldValue(`list[${idx}].qty_available_loading`, true);

			apiClient
				.get(
					`/getItemPartsOemQty?store_id=${
						formik.values.transfer_from ? formik.values.transfer_from.id : ''
					}&id=${val ? val.id : ''}`,
				)
				.then((response) => {
					formik.setFieldValue(`list[${idx}].qty_available_loading`, false);
					formik.setFieldValue(
						`list[${idx}].qty_available`,
						response.data.data.item_inventory2?.quantity ?? 0,
					);
				})

				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}
	};

	useEffect(() => {
		if (formik.values.transfer_from_store_type) {
			setTransferFromStoreOptionsLoading(true);

			apiClient
				.get(
					`/getStoredropdown?store_type_id=${
						formik.values.transfer_from_store_type
							? formik.values.transfer_from_store_type.id
							: ''
					}`,
				)
				.then((response) => {
					const rec = response.data.store.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));

					setTransferFromStoreOptionsLoading(false);
					setTransferFromStoreOptions(rec);
				})

				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.transfer_from_store_type]);

	useEffect(() => {
		if (formik.values.transfer_to_store_type) {
			setTransferToStoreOptionsLoading(true);

			apiClient
				.get(
					`/getStoredropdown?store_type_id=${
						formik.values.transfer_to_store_type
							? formik.values.transfer_to_store_type.id
							: ''
					}`,
				)
				.then((response) => {
					const rec = response.data.store.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));

					setTransferToStoreOptionsLoading(false);
					setTransferToStoreOptions(rec);
				})

				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.transfer_to_store_type]);
	// get Store types
	useEffect(() => {
		setStoreTypeOptionsLoading(true);

		apiClient
			.get(`/getStoreTypeDropDown`)
			.then((response) => {
				const rec = response.data.storeType.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreTypeOptionsLoading(false);
				setStoreTypeOptions(rec);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`list[${index}].items_options_loading`, true);

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
				formik.setFieldValue(`list[${index}].items_options`, rec);

				formik.setFieldValue(`list[${index}].items_options_loading`, false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
		// } else {
		// 	formik.setFieldValue(`list[${index}].items_options`, []);
		// 	formik.setFieldValue(`list[${index}].items_options_loading`, false);
		// }
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup label='Date'>
								<Flatpickr
									className='form-control'
									value={formik.values.date}
									// eslint-disable-next-line react/jsx-boolean-value

									options={{
										dateFormat: 'd/m/y',
										allowInput: true,
									}}
									onChange={(date, dateStr) => {
										formik.setFieldValue('date', dateStr);
									}}
									onClose={(date, dateStr) => {
										formik.setFieldValue('date', dateStr);
									}}
									id='default-picker'
								/>
							</FormGroup>
							{formik.errors.date && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.date}
								</p>
							)}
							<div className='row mt-1'>
								<div className='col-md-6  border-end'>
									<h5>Transfer From</h5>
									<FormGroup
										id='transfer_from_store_type'
										label='Store type'
										className='col-md-12'>
										<Select
											className='col-md-12'
											isLoading={storeTypeOptionsLoading}
											options={storeTypeOptions}
											value={formik.values.transfer_from_store_type}
											onChange={(val) => {
												formik.setFieldValue(
													'transfer_from_store_type',
													val,
												);
											}}
											invalidFeedback={formik.errors.transfer_from_store_type}
										/>
									</FormGroup>
									<FormGroup
										id='transfer_from'
										label='Store'
										className='col-md-12 mt-2'>
										<Select
											className='col-md-12'
											isClearable
											isLoading={transferFromStoreOptionsLoading}
											options={transferFromStoreOptions}
											value={formik.values.transfer_from}
											onChange={(val) => {
												formik.setFieldValue('transfer_from', val);
											}}
											invalidFeedback={formik.errors.transfer_from}
										/>
									</FormGroup>
									{formik.errors.transfer_from && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.transfer_from}
										</p>
									)}
								</div>
								<div className='col-md-6  border-start'>
									<h5>Transfer To</h5>
									<FormGroup
										id='transfer_to_store_type'
										label='Store type'
										className='col-md-12'>
										<Select
											className='col-md-12'
											isLoading={storeTypeOptionsLoading}
											options={storeTypeOptions}
											value={formik.values.transfer_to_store_type}
											onChange={(val) => {
												formik.setFieldValue('transfer_to_store_type', val);
											}}
											invalidFeedback={formik.errors.transfer_to_store_type}
										/>
									</FormGroup>

									<FormGroup
										id='transfer_to'
										label='Store'
										className='col-md-12 mt-2'>
										<Select
											className='col-md-12'
											isClearable
											isLoading={transferToStoreOptionsLoading}
											options={transferToStoreOptions}
											value={formik.values.transfer_to}
											onChange={(val) => {
												formik.setFieldValue('transfer_to', val);
											}}
											invalidFeedback={formik.errors.transfer_to}
										/>
									</FormGroup>
									{formik.errors.transfer_to && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.transfer_to}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-5'>Items</th>
								<th className='col-md-3'>Qty Available</th>
								<th className='col-md-3'>Qty Transferred</th>
								<th className='col-md-1'>Remove</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.list?.length > 0 &&
								formik.values.list?.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-5'>
											<FormGroup label='' id={`list[${index}].item_id`}>
												<Select
													className='col-md-12'
													classNamePrefix='select'
													options={
														formik.values.list[index].items_options
													}
													isLoading={
														formik.values.list[index]
															.items_options_loading
													}
													isClearable
													value={
														formik.values.list[index].item_id
															? formik.values.list[
																	index
															  ].items_options.find(
																	(c) =>
																		c.value ===
																		formik.values.list[index]
																			.item_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															`list[${index}].item_id`,
															val !== null && val.id,
														);
														getExistingQty(index, val);
													}}
													isValid={formik.isValid}
													isTouched={
														formik.touched.list
															? formik.touched.list[index]?.item_id
															: ''
													}
													invalidFeedback={
														formik.errors[`list[${index}].item_id`]
													}
												/>
											</FormGroup>
											{formik.errors[`list[${index}]item_id`] && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
														textAlign: 'left',
														marginTop: 3,
													}}>
													{formik.errors[`list[${index}]item_id`]}
												</p>
											)}
										</td>

										<td className='col-md-3'>
											<FormGroup
												id={`list[${index}].qty_available`}
												label=''
												className='col-md-12'>
												<h5>
													{items.qty_available_loading ? (
														<h5>...</h5>
													) : (
														items.qty_available ?? 0
													)}
												</h5>
											</FormGroup>
										</td>
										<td className='col-md-3'>
											<FormGroup
												id={`list[${index}].qty_transferred`}
												label=''
												className='col-md-12'>
												<Input
													type='number'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={items.qty_transferred}
													isValid={formik.isValid}
													isTouched={
														formik.touched.list
															? formik.touched.list[index]
																	?.qty_transferred
															: ''
													}
													invalidFeedback={
														formik.errors[
															`list[${index}]qty_transferred`
														]
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-1 '>
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
						<div className='col-md-3'>
							<FormGroup id='category_id' label='Category'>
								<Select
									isLoading={categoriesOptionsLoading}
									options={categoriesOptions}
									value={
										formik.values.category_id
											? categoriesOptions?.find(
													(c) => c.value === formik.values.category_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('category_id', val !== null && val.id);
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
								<Select
									isLoading={subOptionsLoading}
									options={subOption}
									isClearable
									value={
										formik.values.sub_category_id
											? subOption?.find(
													(c) =>
														c.value === formik.values.sub_category_id,
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
								<Select
									isLoading={machinePartsOptionsLoading}
									options={machinePartsOptions}
									isClearable
									value={
										formik.values.machine_part_id
											? machinePartsOptions?.find(
													(c) =>
														c.value === formik.values.machine_part_id,
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
								<Select
									isLoading={partModelsOptionsLoading}
									options={partModelsOptions}
									isClearable
									value={
										formik.values.part_model_id
											? partModelsOptions?.find(
													(c) => c.value === formik.values.part_model_id,
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
								isDisable={!formik.values.transfer_from}
								onClick={() => {
									formik
										.setFieldValue('list', [
											...formik.values.list,
											{
												items_options: [],
												items_options_loading: true,
												item_id: '',
												qty_transferred: '',
												qty_available: 0,
												qty_available_loading: false,
											},
										])
										.then(
											getItemsBasedOnSubCategory(formik.values.list?.length),
										);
								}}>
								Add New Item
							</Button>
						</div>
					</div>
				</CardBody>
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
