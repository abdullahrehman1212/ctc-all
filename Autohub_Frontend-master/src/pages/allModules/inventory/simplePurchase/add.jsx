/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import showNotification from '../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

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
import AddRack from '../Racks/add';
import AddShelf from '../Shelves/add';

const validate = (values) => {
	let errors = {};

	if (!values.po_no) {
		errors.po_no = 'Required';
	}
	if (!values.account_id) {
		errors.account_id = 'Required';
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
	if (!values.total > 0) {
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
		if (!Number(data.purchase_price) > 0) {
			errors = {
				...errors,
				[`childArray[${index}]purchase_price`]: 'Required',
			};
		}
	});
	return errors;
};
const Add = ({ refreshTableData }) => {
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const navigate = useNavigate();
	const [state, setState] = useState(false);

	const [reState, setReState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [reload, setReload] = useState(0);
	const [storeLoading, setStoreLoading] = useState(false);
	const [shelfs, setShelfs] = useState([]);
	const [selectedShelf, setSelectedShelf] = useState(null);
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);
	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);
	const [PONUMBER, SetPONUMBER] = useState('');

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const [storeOptions, setStoreOptions] = useState([]);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

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
			po_no: PONUMBER,
			category_name: '',
			category_id: '',
			sub_category_id: '',
			machine_part_id: '',
			account_id: '',
			part_model_id: '',
			store_id: '',
			is_cancel: 0,
			is_approve: 0,
			is_received: 0,
			request_date: todayDate,
			remarks: '',
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
				console.log('The store value is:', rec);
				formik.setFieldValue('store_id', rec.length > 0 ? rec[0].id : '');
				setStoreLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.message, 'Danger');
				}
			});
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);

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
				formik.setFieldValue(`childArray[${index}].items_options`, rec);

				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
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
		// 	formik.setFieldValue(`childArray[${index}].items_options`, []);
		// 	formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
		// }
	};
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		// console.log(formik.touched);
		// console.log(formik.errors);
	};
	const submitForm = (myFormik) => {
		apiClient
			.post(`/directPurchaseOrder`, myFormik.values)
			.then((res) => {
				// console.log('myformik', myFormik.values);
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');

				setIsLoading(false);
			});
	};
	useEffect(() => {
		apiClient
			.get(`/getLatestpono`)
			.then((response) => {
				// eslint-disable-next-line no-console
				console.log('po', response.data.po_no);
				formik.setFieldValue('po_no', response.data.po_no);
				SetPONUMBER(response.data.po_no);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reState]);

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

				// const rec1 = response.data.item
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
	useEffect(() => {
		let t = 0;
		formik?.values.childArray?.forEach((item) => {
			t += Number(item.quantity ?? 0) * Number(item.purchase_price);
			formik.setFieldValue('total', Number(t));
		});
	}, [reload]);

	const [allShelves, setAllShelves] = useState([]);

	useEffect(() => {
		// Fetch shelves data once
		apiClient
			.get(`/getShelvesDropdown`)
			.then((response) => {
				const shelves = response.data.shelves.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));
				setAllShelves(shelves);
				console.log(shelves);
			})
			.catch((error) => {
				console.error('Error fetching shelves data:', error);
			});
	}, []);

	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);
	const [rackIds, setRackIds] = useState(null);
	function getRacks(storeId) {
		setRackOptionsLoading(true);

		// formik.setFieldValue('rackShelf', []);
		formik.setFieldValue('shelf_numbers', []); // Clear shelf_numbers field when new storeId is selected
		formik.setFieldValue('shelfOptions', []); // Clear shelf_numbers field when new storeId is selected
		setRackOptions([]);

		apiClient
			.get(`/getRackDropDown`, { params: { store_id: storeId } })
			.then((response) => {
				const filteredRacks = response.data.racks.filter(
					(rack) => rack.store_id === storeId,
				);
				const rec = filteredRacks.map((rack) => ({
					id: rack.id,
					value: rack.id,
					label: rack.rack_number,
				}));
				setRackOptions(rec);
				setRackOptionsLoading(false);
			})
			.catch((error) => {
				// console.error('Error fetching rack data:', error);
				setRackOptions([]);
				setRackOptionsLoading(false);
			});
	}

	useEffect(() => {
		getRacks(formik.values?.store_id);
	}, [formik.values.store_id]);

	function getShelves(rackId, index, rackIndex) {
		formik.setFieldValue('shelfOptions', []);

		apiClient
			.get(`/getShelvesDropdown`, { params: { id: rackId } })
			.then((response) => {
				const shelves = response.data.shelves.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));

				// if (shelves.length > 0) {
				formik
					.setFieldValue(`childArray[${index}]rackShelf[${rackIndex}]shelves`, shelves)
					.then(() => {
						// console.log(formik.values);
					});
				// }
				formik.setFieldValue(`childArray[${index}]rackShelf[${rackIndex}]shelf_id`, '');
				setShelfs(shelves);
			})
			.catch((error) => {
				// console.error('Error fetching shelf data:', error);
			});
	}

	const removeRackRow = (childIndex, rackIndex) => {
		const updatedChildArray = formik.values.childArray.map((item, index) => {
			if (index === childIndex) {
				return {
					...item,
					rackShelf: item.rackShelf.filter((rack, idx) => idx !== rackIndex),
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};

	const addRow = (childIndex) => {
		const updatedChildArray = formik.values.childArray.map((item, index) => {
			if (index === childIndex) {
				const newRackNumbers = [
					...item.rackShelf,
					{ rack_id: '', shelf_id: '', quantity: 0 },
				];
				return {
					...item,
					rackShelf: newRackNumbers,
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};

	console.log('The selected rack is:', rackIds);

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
						setReState(!reState);
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Add Direct Purchase
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
						<ModalTitle id='exampleModalLabel'>Add Direct Purchase Order</ModalTitle>
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
																	c.value ===
																	formik.values.store_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'store_id',
														val !== null ? val.id : '',
													);
													getRacks(val.id);
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
									<div className='col-md-3'>
										<FormGroup
											id='remarks'
											label='Description'
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
											<th className='col-md-5'>Item Parts</th>
											<th className='col-md-2'>Quantity</th>
											<th className='col-md-2'>Rate</th>
											<th className='col-md-2'>Total</th>
											<th className='col-md-1'>Remove</th>
										</tr>
									</thead>
									<tbody>
										{formik?.values?.childArray?.length > 0 &&
											formik?.values?.childArray?.map((items, index) => (
												<tr className='row' key={items.index}>
													<td className='col-md-5'>
														<div>
															<FormGroup
																label=''
																id={`childArray[${index}].item_id`}>
																<ReactSelect
																	className='col-md-12'
																	classNamePrefix='select'
																	options={
																		formik.values.childArray[
																			index
																		].items_options
																	}
																	isLoading={
																		formik.values.childArray[
																			index
																		].items_options_loading
																	}
																	isClearable
																	value={
																		formik.values.childArray[
																			index
																		].item_id
																			? formik.values.childArray[
																					index
																			  ].items_options.find(
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
																		formik.setFieldValue(
																			`childArray[${index}].item_id`,
																			val !== null && val.id,
																		);
																		// assignRacks(index);
																	}}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
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
														</div>
														<div className='row justify-content-between mt-5'>
															<div className='col'>
																<h4>Rack and Shelves</h4>
															</div>
															<div className='col-auto'>
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
															</div>
														</div>
														<table>
															{1 &&
																formik?.values?.childArray[
																	index
																]?.rackShelf?.map(
																	(rack, rackIndex) => (
																		<tr
																			className='row mt-2 '
																			key={rackIndex}>
																			<td className='col-md-4 border-start border-end'>
																				<div>
																					<FormGroup
																						size='sm'
																						label='Rack'
																						id={`childArray[${index}].item_racks[${rackIndex}].rack_id`}>
																						<ReactSelect
																							className='col-md-12'
																							// menuIsOpen={false}
																							styles={
																								customStyles
																							}
																							classNamePrefix='select'
																							options={
																								rackOptions
																							}
																							isLoading={
																								rackOptionsLoading
																							}
																							value={
																								rackIds
																									? rackOptions.find(
																											(
																												c,
																											) =>
																												c.value ===
																												rackIds,
																									  )
																									: null
																							}
																							onChange={(
																								val,
																							) => {
																								formik.setFieldValue(
																									`childArray[${index}].item_racks[${rackIndex}].rack_id`,
																									val !==
																										null
																										? val.id
																										: '',
																								);
																								setRackIds(
																									val !==
																										null
																										? val.id
																										: '',
																								);
																								setSelectedShelf(
																									null,
																								);

																								getShelves(
																									val?.id,
																									index,
																									rackIndex,
																								);
																							}}
																							isValid={
																								formik.isValid
																							}
																							isTouched={
																								formik
																									.touched[
																									`childArray[${index}].item_racks[${rackIndex}].rack_id`
																								]
																							}
																							invalidFeedback={
																								formik
																									.errors[
																									`childArray[${index}].item_racks[${rackIndex}].rack_id`
																								]
																							}
																							filterOption={createFilter(
																								{
																									matchFrom:
																										'start',
																								},
																							)}
																						/>
																					</FormGroup>
																					{formik.errors[
																						`childArray[${index}].item_racks[${rackIndex}].rack_id`
																					] && (
																						<div
																							style={{
																								color: '#ef4444',
																								textAlign:
																									'center',
																								fontSize:
																									'0.875em',
																								marginTop:
																									'0.25rem',
																							}}>
																							{
																								formik
																									.errors[
																									`childArray[${index}].item_racks[${rackIndex}].rack_id`
																								]
																							}
																						</div>
																					)}
																				</div>
																			</td>
																			<td className='col-md-4 border-start border-end'>
																				{/* {1 && ( */}
																				<div>
																					<FormGroup
																						size='sm'
																						label='Shelf'
																						id={`childArray[${index}].item_racks[${rackIndex}].shelf_id`}>
																						<ReactSelect
																							className='col-md-12'
																							// isMulti
																							styles={
																								customStyles
																							}
																							classNamePrefix='select'
																							options={
																								// eslint-disable-next-line no-unneeded-ternary
																								shelfs
																							}
																							value={
																								// rack.shelf_id ?
																								shelfs.find(
																									(
																										c,
																									) =>
																										c.value ===
																										selectedShelf,
																								)
																								// : null
																							}
																							onChange={(
																								val,
																							) => {
																								formik.setFieldValue(
																									`childArray[${index}].item_racks[${rackIndex}].shelf_id`,
																									// val !==
																									// 	null
																									// 	? val.id
																									// 	: '',
																									val.value,
																								);
																								setSelectedShelf(
																									val.value,
																								);
																								// getShelves(
																								// 	val?.id,
																								// 	index,
																								// 	rackIndex,
																								// );
																							}}
																							isValid={
																								formik.isValid
																							}
																							isTouched={
																								formik
																									.touched[
																									`childArray[${index}].item_racks[${rackIndex}].shelf_id`
																								]
																							}
																							invalidFeedback={
																								formik
																									.errors[
																									`childArray[${index}].item_racks[${rackIndex}].shelf_id`
																								]
																							}
																							filterOption={createFilter(
																								{
																									matchFrom:
																										'start',
																								},
																							)}
																						/>
																					</FormGroup>

																					{formik.errors[
																						`childArray[${index}].item_racks[${rackIndex}].shelf_id`
																					] && (
																						<div
																							style={{
																								color: '#ef4444',
																								textAlign:
																									'center',
																								fontSize:
																									'0.875em',
																								marginTop:
																									'0.25rem',
																							}}>
																							{
																								formik
																									.errors[
																									`childArray[${index}].item_racks[${rackIndex}].shelf_id`
																								]
																							}
																						</div>
																					)}
																				</div>
																				{/* )} */}
																			</td>

																			<td className='col-md-3'>
																				<div className='col-md-12'>
																					{formik.values
																						.childArray &&
																					formik.values
																						.childArray[
																						index
																					] &&
																					formik.values
																						.childArray[
																						index
																					].item_racks &&
																					formik.values
																						.childArray[
																						index
																					].item_racks[
																						rackIndex
																					] ? (
																						<FormGroup
																							size='sm'
																							id={`childArray[${index}].item_racks[${rackIndex}].quantity`}
																							label='Quantity'>
																							<Input
																								type='number'
																								onWheel={(
																									e,
																								) =>
																									e.target.blur()
																								}
																								onChange={(
																									e,
																								) => {
																									formik.setFieldValue(
																										`childArray[${index}].item_racks[${rackIndex}].quantity`,
																										e
																											.target
																											.value,
																									); // Update formik state with the new value
																								}}
																								onBlur={
																									formik.handleBlur
																								}
																								value={
																									formik
																										.values
																										.childArray[
																										index
																									]
																										.item_racks[
																										rackIndex
																									]
																										.quantity ||
																									''
																								} // Ensure correct formik value is being used
																								invalidFeedback={
																									formik
																										.errors[
																										`childArray[${index}].item_racks[${rackIndex}].quantity`
																									]
																								}
																							/>
																						</FormGroup>
																					) : (
																						<FormGroup
																							size='sm'
																							id={`childArray[${index}].item_racks[${rackIndex}].quantity`}
																							label='Quantity'>
																							<Input
																								type='number'
																								onWheel={(
																									e,
																								) =>
																									e.target.blur()
																								}
																								onChange={(
																									e,
																								) => {
																									formik.setFieldValue(
																										`childArray[${index}].item_racks[${rackIndex}].quantity`,
																										e
																											.target
																											.value,
																									); // Update formik state with the new value
																								}}
																								onBlur={
																									formik.handleBlur
																								}
																								value={
																									rack.quantity
																								} // Ensure correct formik value is being used
																								invalidFeedback={
																									formik
																										.errors[
																										`childArray[${index}].item_racks[${rackIndex}].quantity`
																									]
																								}
																							/>
																						</FormGroup>
																					)}

																					{formik.errors[
																						`childArray[${index}].item_racks[${rackIndex}].quantity`
																					] && (
																						<div
																							style={{
																								color: '#ef4444',
																								textAlign:
																									'center',
																								fontSize:
																									'0.875em',
																								marginTop:
																									'0.25rem',
																							}}>
																							{
																								formik
																									.errors[
																									`childArray[${index}].item_racks[${rackIndex}].quantity`
																								]
																							}
																						</div>
																					)}
																				</div>
																			</td>

																			<td className='col-md-1 mt-4'>
																				<Button
																					isDisable={
																						formik
																							.values
																							.childArray
																							?.item_racks
																							?.length ===
																						1
																					}
																					icon='cancel'
																					color='danger'
																					onClick={() =>
																						removeRackRow(
																							index,
																							rackIndex,
																						)
																					}
																				/>
																			</td>
																		</tr>
																	),
																)}
														</table>
														<div className='col-m row  d-flex  justify-content-end  mt-1'>
															<Button
																className='col-md-2 '
																isDisable={
																	formik.values.childArray
																		?.item_racks?.length === 1
																}
																icon='add'
																color='success'
																onClick={() => addRow(index)}>
																Add
															</Button>
														</div>
													</td>
													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].quantity`,
																		val.target.value,
																	);
																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		val.target.value *
																			(formik.values
																				.childArray[index]
																				.purchase_price ??
																				0),
																	);

																	setReload(reload + 1);
																	// setReload2(reload2 + 1);
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
															id={`childArray[${index}].purchase_price`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].purchase_price`,
																		val.target.value,
																	);
																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		val.target.value *
																			(formik.values
																				.childArray[index]
																				.quantity ?? 0),
																	);

																	setReload(reload + 1);
																}}
																onBlur={formik.handleBlur}
																value={items.purchase_price}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
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
													</td>
													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].amount`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={items.amount}
																isValid={formik.isValid}
																readOnly
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																				index
																		  ]?.amount
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]amount`
																	]
																}
															/>
														</FormGroup>
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
									{/* <div className='col-md-3'>
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
									</div> */}
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
															rack_number: [],
															shelf_number: [],
															rackShelf: [],
															quantity: '',
															purchase_price: '',
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
								<div className='row g-2  d-flex justify-content-end mt-2'>
									<div className='col-md-3'>
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
											setReState(!reState);
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
