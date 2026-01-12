// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-lone-blocks */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports
import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import ReactSelect from 'react-select';
import apiClient from '../../../../baseURL/apiClient';
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
import Checks from '../../../../components/bootstrap/forms/Checks';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';


const validate = (values) => {
    let errors = {};
    const itemData = {}; // Stores cumulative quantities for each item_id

    if (!values.date) {
        errors.request_date = 'Required';
    }
	if (!values.store_id) {
		errors.store_id = 'Required';
	}

    // First pass: Initialize cumulative tracking
    values.adjust_inventory_child?.forEach((data, index) => {
        if (!data.item_id) {
            errors = {
                ...errors,
                [`adjust_inventory_child[${index}]item_id`]: 'Required!',
            };
        } 

        if (!data.purchase_price) {
            errors = {
                ...errors,
                [`adjust_inventory_child[${index}]purchase_price`]: 'Required!',
            };
        }

        if (!(data.quantity_in > 0) && values.adjust_type === 'add') {
            errors = {
                ...errors,
                [`adjust_inventory_child[${index}]quantity_in`]: 'Required',
            };
        }

        if (!(data.quantity_out > 0) && values.adjust_type === 'remove') {
            errors = {
                ...errors,
                [`adjust_inventory_child[${index}]quantity_out`]: 'Required',
            };
        }
    });



    return errors;
};


// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeLoading, setStoreLoading] = useState(false);
	const formik = useFormik({
		initialValues: editingItem,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	editingItem.adjust_inventory_child.forEach((child) => {
		child.original_quantity_out = child.quantity_out; 
	});
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('adjust_inventory_child', [
			...formik.values.adjust_inventory_child.slice(0, i),
			...formik.values.adjust_inventory_child.slice(i + 1),
		]);
	};
	const submitForm = (data) => {
		const updatedData = {
			...data,
			adjust_inventory_child: data.adjust_inventory_child.map((child) => ({
				...child,
				quantity_in: data.adjust_type === 'remove' ? 0 : child.quantity_in,
				quantity_out: data.adjust_type === 'add' ? 0 : child.quantity_out,
			})),
		};
		apiClient
			.post(`/updateAdjustInventory`, updatedData)
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
			.catch(() => {
				setIsLoading(false);
			});
	};

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

		apiClient.get(`/getItemOemDropDown`).then((response) => {
			const rec = response.data?.data?.map(({ id, name, machine_part_oem_part }) => ({
				id,
				value: id,
				label: `${machine_part_oem_part?.machine_part?.subcategories?.categories?.name}-${machine_part_oem_part?.machine_part?.subcategories?.name}-${name}`,
			}));
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});
	}, []);
	
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.adjust_inventory_child;
		{
			formik.values.adjust_type === 'add'
				? arr?.forEach((data) => {
						data.amount = data.quantity_in * data.purchase_price;
				  })
				: arr?.forEach((data) => {
						data.amount = data.quantity_out * data.purchase_price;
				  });
		}
		formik.setFieldValue(`adjust_inventory_child`, arr);

		const total =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => a + parseFloat(v !== undefined ? v.amount : 0),
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
				`adjust_inventory_child[${index}].avl_quantity`,
				response.data?.getLastPurchasePrice?.quantity,
			);
			formik.setFieldValue(
				`adjust_inventory_child[${index}].last_purchase_price`,
				response.data?.getRate,
			);
			formik.setFieldValue(
				`adjust_inventory_child[${index}].avg_cost`,
				response.data?.avg_cost,
			);
		});
	};

	useEffect(() => {
		formik.values.adjust_inventory_child.forEach((item, index) => {
			const itemId = item.item_id;
			if (itemId) {
				getItemLastPriceAvlQantity(itemId, index);
			}
		});

		
	}, [formik.values.adjust_inventory_child]);	

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
			.catch((err) => {});
	}, []);
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row '>
						<Checks
							type='switch'
							id='adjust_type'
							label={
								formik.values?.adjust_type === 'add'
									? 'Add Inventory'
									: 'Remove Inventory'
							}
							name='checkedCheck'
							onChange={(e) => {
								const newAdjustType = e.target.checked ? 'add' : 'remove';
								formik.setFieldValue('adjust_type', newAdjustType);
								setTriggerCalculateTotal(triggerCalculateTotal + 1);
							}}
							isValid={formik.isValid}
							checked={formik.values.adjust_type === 'add'} // Set checked based on adjust_type value
						/>
					</div>
					<div className='row g-2  d-flex justify-content-start'>
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
							<FormGroup id='remarks' label='Subject' className='col-md-12'>
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

					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-3'>Items</th>
								<th className='col-md-1'>Qty in Stock</th>

								<th className='col-md-4 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-6'>Rate</div>
										<div className='col-md-6'>Quantity</div>
									</div>
								</th>
								<th className='col-md-1'>Last Purhase Rate</th>

								<th className='col-md-3 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-9'>Total </div>
										<div className='col-md-3'> </div>
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.adjust_inventory_child?.length > 0 &&
								formik.values.adjust_inventory_child.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-3'>
											<FormGroup
												label=''
												id={`adjust_inventory_child[${index}].item_id`}>
												<Select
													isClearable
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
															`adjust_inventory_child[${index}].item_id`,
															val ? val.id : '',
														);
														getItemLastPriceAvlQantity(val.id, index);
													}}
													isValid={formik.isValid}
													isTouched={
														formik.touched.adjust_inventory_child
															? formik.touched.adjust_inventory_child[index]
																	?.item_id
															: ''
													}
													invalidFeedback={
														formik.errors[
															`adjust_inventory_child[${index}].item_id`
														]
													}
												/>
											</FormGroup>
											{formik.errors[`adjust_inventory_child[${index}]item_id`] && (
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
															`adjust_inventory_child[${index}]item_id`
														]
													}
												</p>
											)}
										</td>
										<td className='col-md-1'>
											{items?.avl_quantity 
												? items.avl_quantity.toFixed(2)
												: null}
												{/* {items?.adjust_inventory_child?.item_avaiable_inventory?.item_available} */}
										</td>

										<td className='col-md-4 align-items-center justify-content-center'>
											<div className='row'>
												<div className='col-md-6'>
													<FormGroup
														id={`adjust_inventory_child[${index}].purchase_price`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															onWheel={(e) => e.target.blur()}
															onChange={(val) => {
																formik.setFieldValue(
																	`adjust_inventory_child[${index}].purchase_price`,
																	val.target.value,
																);
																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
															onBlur={formik.handleBlur}
															value={
																formik.values.adjust_inventory_child[index]
																	.purchase_price
															}
															isValid={formik.isValid}
															isTouched={
																formik.touched.purchase_price
															}
															invalidFeedback={
																formik.errors.purchase_price
															}
														/>
													</FormGroup>
													{formik.errors[
														`adjust_inventory_child[${index}]purchase_price`
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
																	`adjust_inventory_child[${index}]purchase_price`
																]
															}
														</p>
													)}
												</div>

												{formik.values.adjust_type === 'add' && (
													<div className='col-md-6'>
														<FormGroup
															id={`adjust_inventory_child[${index}].quantity_in`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={(val) => {
																	const inputValue =
																		val.target.value;
																	if (inputValue === '0') {
																		formik.setFieldError(
																			`adjust_inventory_child[${index}].quantity_in`,
																			'quantity_in cannot be 0',
																		);
																	} else {
																		formik.setFieldValue(
																			`adjust_inventory_child[${index}].quantity_in`,
																			inputValue,
																		);
																		setTriggerCalculateTotal(
																			triggerCalculateTotal +
																				1,
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.quantity_in === 0 ? '' : items.quantity_in}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.adjust_inventory_child
																		? formik.touched
																				.adjust_inventory_child[
																				index
																		  ]?.quantity_in
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`adjust_inventory_child[${index}]quantity_in`
																	]
																}
															/>
														</FormGroup>

														{formik.errors[
															`adjust_inventory_child[${index}]quantity_in`
														] && (
															<p
																style={{
																	color: '#ef4444',
																	textAlign: 'left',
																	marginTop: '0.25rem',
																	fontSize: '0.875em',
																}}>
																{
																	formik.errors[
																		`adjust_inventory_child[${index}]quantity_in`
																	]
																}
															</p>
														)}
													</div>
												)}

												{formik.values.adjust_type === 'remove' && (
													<div className='col-md-6'>
														<FormGroup
															id={`adjust_inventory_child[${index}].quantity_out`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={(val) => {
																	const inputValue =
																		val.target.value;
																	if (inputValue === '0') {
																		formik.setFieldError(
																			`adjust_inventory_child[${index}].quantity_out`,
																			'quantity_out cannot be 0',
																		);
																	} else {
																		formik.setFieldValue(
																			`adjust_inventory_child[${index}].quantity_out`,
																			inputValue,
																		);
																		
																		setTriggerCalculateTotal(
																			triggerCalculateTotal +
																				1,
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.quantity_out === 0 ? '' : items.quantity_out}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.adjust_inventory_child
																		? formik.touched
																				.adjust_inventory_child[
																				index
																		  ]?.quantity_out
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`adjust_inventory_child[${index}]quantity_out`
																	]
																}
															/>
														</FormGroup>

														{formik.errors[
															`adjust_inventory_child[${index}]quantity`
														] && (
															<p
																style={{
																	color: '#ef4444',
																	textAlign: 'center',
																	marginTop: '1rem',
																	fontSize: '0.875em',
																}}>
																{
																	formik.errors[
																		`adjust_inventory_child[${index}]quantity`
																	]
																}
															</p>
														)}
													</div>
												)}
											</div>
										</td>
										<td className='col-md-1'>{items?.last_purchase_price}</td>

										<td className='col-md-3 align-items-center justify-content-center'>
											<div className='row'>
												<FormGroup
													className='col-md-9 mt-2'
													id={`adjust_inventory_child[${index}].amount`}
													label=''
													type='number'>
													<strong>
														{items.amount
															? items.amount.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )
															: 0}
													</strong>
												</FormGroup>
												<Button
													className='col-md-3 mt-1'
													isDisable={
														formik.values.adjust_inventory_child.length === 1
													}
													icon='cancel'
													color='danger'
													onClick={() => {
														removeRow(index);

														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
												/>
											</div>
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
													onClick={() => {
														formik.setFieldValue('adjust_inventory_child', [
															...formik.values.adjust_inventory_child,
															{
																item_id: '',
																purchase_price: '',
																quantity_in: 0,
																received_quantity: 0,
																cost: 0,

																amount: '',
															},
														]);
													}}>
													Add
												</Button>
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
											<FormGroup className='col-md-9 mt-4' label=''>
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
						</tbody>
					</table>
					<div className='row g-4'>
						<div className='col-md-4'>
							<Button
								color='primary'
								icon='add'
								onClick={() => {
									formik.setFieldValue('adjust_inventory_child', [
										...formik.values.adjust_inventory_child,
										{
											item_id: '',
											purchase_price: '',
											quantity: '',
											received_quantity: 0,
											cost: 0,

											amount: '',
										},
									]);
								}}>
								Add
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
