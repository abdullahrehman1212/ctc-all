/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
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
import showNotification from '../../../../components/extras/showNotification';
import Add from '../Racks/add';
import AddShelf from '../Shelves/add';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const ReturnOrder = ({ returnData, handleStateReturn }) => {
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const [reload, setReload] = useState(0);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

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
		if (!values.return_date) {
			errors.return_date = 'Required';
		}
		// if (!values.deduction) {
		// 	errors.deduction = 'Required';
		// }
		if (!values.childArray.length > 0) {
			errors.childArray = 'Choose Items In list';
		}
		values.childArray.forEach((item, index) => {
			if (item.quantity <= 0) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]:
						'Returned Quantity cannot be less than equal to 0',
				};
			}
			if (item.quantity > item.po_quantity) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]:
						'Return Qty cannot be greater than Purchase Qty',
				};
			}

			if (item.quantity > item.current_quantity) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]:
						' Purchase Qty cannot be greater than remaining Qty',
				};
			}
		});
		return errors;
	};
	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;
	const formik = useFormik({
		initialValues: { ...returnData, deduction: '', return_date: todayDate },

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
			.post(`/returnPurchaseOrder`, data)
			.then((res) => {
				// console.log('received PO', res.data);
				if (res.data.status === 'ok') {
					// formik.resetForm();
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
				// console.log('suppliersdd', rec);
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
			t += item.amount;

			formik.setFieldValue('total', Number(t));
			formik.setFieldValue('total_after_tax', Number(t));
			formik.setFieldValue('total_after_discount', Number(t) - formik.values.discount);
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

	// useEffect(() => {
	// 	// Assign shelves for each rackShelf
	// 	setShelfOptionsLoading(true);
	// 	formik.values.childArray.forEach((child, index) => {
	// 		if (child.rackShelf && child.rackShelf.length > 0) {
	// 			child.rackShelf.forEach((rack, rackIndex) => {
	// 				const shelvesForRack = allShelves.filter((shelf) => shelf.id === rack.rack_id);
	// 				formik.setFieldValue(
	// 					`childArray[${index}].rackShelf[${rackIndex}].shelves`,
	// 					shelvesForRack,
	// 				);
	// 			});
	// 		}
	// 	});
	// }, [formik.values.childArray, allShelves]);

	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);

	function getRacks(storeId) {
		setRackOptionsLoading(true);

		// formik.setFieldValue('rackShelf', []);
		formik.setFieldValue('shelf_numbers', []); // Clear shelf_numbers field when new storeId is selected
		formik.setFieldValue('shelfOptions', []); // Clear shelf_numbers field when new storeId is selected

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
	}, []);

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
				console.log(formik.values);
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
									<FormGroup label='Store' id='store_id'>
										<ReactSelect
											isDisabled
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
								</div> */}

								<div className='col-md-2'>
									<FormGroup id='return_date' label='Return Date'>
										<Input
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.return_date}
											isValid={formik.isValid}
											isTouched={formik.touched.return_date}
											invalidFeedback={formik.errors.return_date}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='remarks' label='Remarks' className='col-md-12'>
										<Input
											readOnly
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
										<th className='col-md-3'>Items</th>
										<th className='col-md-2'>Price</th>
										<th className='col-md-2'>Qty</th>
										{/* <th className='col-md-2'>Returned Qty</th> */}
										<th className='col-md-2'>Updated Total</th>

										<th className='col-md-2'>Remarks</th>
										{/* <th className='col-md-1'>Remarks</th> */}
										<th className='col-md-1'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr className='row mt-2' key={items.index}>
												<td className='col-md-5'>
													<div className='row '>
														<div className='col-md-7'>
															<div>
																<FormGroup
																	label=''
																	id={`childArray[${index}].item_id`}>
																	<ReactSelect
																		className='col-md-12'
																		classNamePrefix='select'
																		isDisabled
																		options={itemOptions}
																		isLoading={
																			kitOptionsLoading
																		}
																		isClearable
																		value={
																			formik.values
																				.childArray[index]
																				.item_id
																				? itemOptions.find(
																						(c) =>
																							c.value ===
																							formik
																								.values
																								.childArray[
																								index
																							]
																								.item_id,
																				  )
																				: null
																		}
																		onChange={(val) => {
																			formik.setFieldValue(
																				`childArray[${index}].item_id`,
																				val !== null &&
																					val.id,
																			);
																		}}
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched.item_id
																		}
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
														</div>
														<div className='col-md-5'>
															<div>
																<FormGroup
																	id={`childArray[${index}].purchase_price`}
																	className='col-md-12'>
																	<Input
																		readOnly
																		onChange={
																			formik.handleChange
																		}
																		onBlur={formik.handleBlur}
																		value={items.purchase_price}
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched
																				.purchase_price
																		}
																		invalidFeedback={
																			formik.errors
																				.purchase_price
																		}
																	/>
																</FormGroup>
																{formik.errors[
																	`childArray[${index}]purchase_price`
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
																				`childArray[${index}]purchase_price`
																			]
																		}
																	</p>
																)}
															</div>
														</div>
													</div>
													<div className='row justify-content-between mt-5'>
														<div className='col'>
															<h4>Rack and Shelves</h4>
														</div>
														<div className='col-auto'>
															<div className='d-flex justify-content-end'>
																<Add
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
															formik.values.childArray[
																index
															].rackShelf?.map((rack, rackIndex) => (
																<tr
																	className='row mt-2 '
																	key={rackIndex}>
																	<td className='col-md-4 border-start border-end'>
																		<div>
																			<FormGroup
																				size='sm'
																				label='Rack'
																				id={`childArray[${index}].rackShelf[${rackIndex}].rack_id`}>
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
																						rack.rack_id
																							? rackOptions.find(
																									(
																										c,
																									) =>
																										c.value ===
																										rack.rack_id,
																							  )
																							: null
																					}
																					// onChange={(
																					// 	val,
																					// ) => {
																					// 	formik.setFieldValue(
																					// 		`childArray[${index}].rackShelf[${rackIndex}].rack_id`,
																					// 		val !==
																					// 			null
																					// 			? val.id
																					// 			: '',
																					// 	);
																					// 	getShelves(
																					// 		val?.id,
																					// 		index,
																					// 		rackIndex,
																					// 	);
																					// }}
																					isValid={
																						formik.isValid
																					}
																					isTouched={
																						formik
																							.touched[
																							`childArray[${index}].rackShelf[${rackIndex}].rack_id`
																						]
																					}
																					invalidFeedback={
																						formik
																							.errors[
																							`childArray[${index}].rackShelf[${rackIndex}].rack_id`
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
																				`childArray[${index}].rackShelf[${rackIndex}].rack_id`
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
																							`childArray[${index}].rackShelf[${rackIndex}].rack_id`
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
																				id={`childArray[${index}].rackShelf[${rackIndex}].shelf_id`}>
																				<ReactSelect
																					className='col-md-12'
																					// isMulti
																					styles={
																						customStyles
																					}
																					classNamePrefix='select'
																					// options={allShelves.map(
																					// 	(item) =>
																					// 		item.rack_id ===
																					// 		rack.rack_id,
																					// )}
																					options={allShelves
																						.filter(
																							(
																								item,
																							) =>
																								item.id ===
																								rack.rack_id,
																						)
																						.map(
																							(
																								item,
																							) => ({
																								value: item.id,
																								label: item.label,
																							}),
																						)}
																					// isLoading={
																					// 	shelfOptionsLoading
																					// }
																					value={
																						rack.shelf_id
																							? allShelves.find(
																									(
																										c,
																									) =>
																										c.value ===
																										rack.shelf_id,
																							  )
																							: null
																					}
																					// onChange={(
																					// 	val,
																					// ) => {
																					// 	formik.setFieldValue(
																					// 		`childArray[${index}].rackShelf[${rackIndex}].shelf_id`,
																					// 		val !==
																					// 			null
																					// 			? val.id
																					// 			: '',
																					// 	);
																					// 	// getShelves(
																					// 	// 	val?.id,
																					// 	// 	index,
																					// 	// 	rackIndex,
																					// 	// );
																					// }}
																					isValid={
																						formik.isValid
																					}
																					isTouched={
																						formik
																							.touched[
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																						]
																					}
																					invalidFeedback={
																						formik
																							.errors[
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
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
																				`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
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
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																						]
																					}
																				</div>
																			)}
																		</div>
																		{/* )} */}
																	</td>

																	<td className='col-md-3'>
																		<div className='col-md-12'>
																			<FormGroup
																				size='sm'
																				id={`childArray[${index}].rackShelf[${rackIndex}].quantity`}
																				label='Quantity'>
																				<Input
																					type='number'
																					onWheel={(e) =>
																						e.target.blur()
																					}
																					onChange={(
																						e,
																					) => {
																						formik.handleChange(
																							e,
																						); // Call formik.handleChange with the event
																					}}
																					onBlur={
																						formik.handleBlur
																					}
																					value={
																						rack.quantity
																					}
																					invalidFeedback={
																						formik
																							.errors[
																							`childArray[${index}].rackShelf[${rackIndex}].quantity`
																						]
																					}
																				/>
																			</FormGroup>
																			{formik.errors[
																				`childArray[${index}].rackShelf[${rackIndex}].quantity`
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
																							`childArray[${index}].rackShelf[${rackIndex}].quantity`
																						]
																					}
																				</div>
																			)}
																		</div>
																	</td>

																	<td className='col-md-1 mt-4'>
																		<Button
																			isDisable={
																				formik.values
																					.childArray
																					?.rackShelf
																					?.length === 1
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
															))}
													</table>
												</td>
												{/* <td className='col-md-2'>
													<div>
														<FormGroup
															id={`childArray[${index}].quantity`}
															className='col-md-12'>
															<Input
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
													<div className='fs-6 ms-2'>
														Purchased Qty:
														{items.quantity ?? 'None'}
													</div>
													<div className='fs-6 ms-2'>
														Returned Qty:
														{items.returned_quantity ?? 'None'}
													</div>
												</td> */}
												<td className='col-md-2'>
													<div>
														<FormGroup
															id={`childArray[${index}].quantity`}
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																min={0}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].quantity`,
																		val.target.value,
																	);
																	formik.setFieldValue(
																		`childArray[${index}].amount`,

																		formik.values.childArray[
																			index
																		].purchase_price *
																			val.target.value,
																	);
																	setReload(reload + 1);

																	if (val.target.value === 0) {
																		showNotification(
																			_titleError,
																			' Quanitity should not be 0',
																			'warning',
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={
																	formik.values.childArray[index]
																		.quantity
																}
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
													<div className='fs-6 ms-2'>
														Purchased Qty:
														{items.received_quantity ?? 'None'}
													</div>
													<div className='fs-6 ms-2'>
														Returned Qty:
														{items.returned_quantity ?? 'None'}
													</div>
													<div className='fs-6 ms-2'>
														Remaining Qty:
														{items.received_quantity - items.returned_quantity ?? 'None'}
													</div>
												</td>
												<td className='col-md-2'>
													<div>
														<FormGroup
															id={`childArray[${index}].amount`}
															className='col-md-12'>
															<Input
																readOnly
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={
																	items.amount.toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		},
																	) ?? 0
																}
																isValid={formik.isValid}
																isTouched={formik.touched.amount}
																invalidFeedback={
																	formik.errors.amount
																}
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
													</div>
												</td>

												<td className='col-md-2'>
													<div>
														<FormGroup
															id={`childArray[${index}].remarks`}
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

												<td className='col-md-1 mt-1'>
													<Button
														icon='cancel'
														color='danger'
														onClick={() => {
															removeRow(index);
															setReload(reload + 1);
														}}
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
								{/* <div className='col-md-2'>
									<FormGroup id='tax' label='Tax(%)' className='col-md-12'>
										<Input
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue('tax', val.target.value);
												formik.setFieldValue(
													'tax_in_figure',
													(val.target.value / 100) * formik.values.total,
												);
												formik.setFieldValue(
													'total_after_tax',
													(val.target.value / 100) * formik.values.total +
														formik.values.total,
												);
												formik.setFieldValue('discount', 0);
												formik.setFieldValue('total_after_discount', 0);
											}}
											onBlur={formik.handleBlur}
											value={formik.values.tax}
											isValid={formik.isValid}
											isTouched={formik.touched.tax}
											invalidFeedback={formik.errors.tax}
										/>
									</FormGroup>
								</div> */}
								{/* <div className='col-md-2'>
									<FormGroup
										id='tax_in_figure'
										label='Tax in figure'
										className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.tax_in_figure}
											isValid={formik.isValid}
											isTouched={formik.touched.tax_in_figure}
											invalidFeedback={formik.errors.tax_in_figure}
										/>
									</FormGroup>
								</div> */}
								{/* <div className='col-md-2'>
									<FormGroup
										id='total_after_tax'
										label='Total After Tax'
										className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total_after_tax}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_tax}
											invalidFeedback={formik.errors.total_after_tax}
										/>
									</FormGroup>
								</div> */}

								{/* <div className='col-md-2'>
									<FormGroup id='discount' label='Discount' className='col-md-12'>
										<Input
											// onChange={formik.handleChange}
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
								</div> */}
								<div className='col-md-2'>
									<FormGroup
										id='discount'
										label='Deduction'
										className='col-md-12'>
										<Input
											// readOnly
											onChange={(e) => {
												formik.setFieldValue('discount', e.target.value);
												formik.setFieldValue(
													'total_after_discount',
													formik.values.total - e.target.value,
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
										label='Total after Deduction'
										className='col-md-12'>
										<Input
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
