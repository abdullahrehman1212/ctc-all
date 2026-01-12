/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import ReactSelect, { createFilter } from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';

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
	if (!values.childArray.length > 0) {
		errors.childArray = 'Choose Items In list';
	}
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
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
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

	const formik = useFormik({
		initialValues: editingItem,
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
		// console.log('helloo update');
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
			.get(`/getPersons?person_type_id=2`)
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
								{/* <div className='col-md-3'>
										<FormGroup label='Delivery Place' id='store_id'>
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
														val !== null && val.id,
													);
												}}
												isValid={formik.isValid}
												isTouched={formik.touched.store_id}
												invalidFeedback={formik.errors.store_id}
												
												
											/>
										</FormGroup>
									</div> */}
								{/* <div className='col-md-2'>
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
													val !== null && val.id,
												);
											}}
											isValid={formik.isValid}
											isTouched={formik.touched.store_id}
											invalidFeedback={formik.errors.store_id}
											
											
										/>
									</FormGroup>
								</div> */}
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
									{/* {formik.errors.childArray && (
											// <div className='invalid-feedback'>
											<tr>{formik.errors.childArray}</tr>
										)} */}
								</thead>
								<tbody>
									{formik.values.childArray.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr className='row' key={items.index}>
												<td className='col-md-4'>
													<FormGroup
														label=''
														id={`childArray[${index}].item_id`}>
														<ReactSelect
															className='col-md-12'
															classNamePrefix='select'
															options={itemOptions}
															isLoading={kitOptionsLoading}
															isClearable
															value={
																formik.values.childArray[index]
																	.item_id
																	? itemOptions.find(
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
															}}
															isValid={formik.isValid}
															isTouched={formik.touched.item_id}
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
												<td className='col-md-3'>
													<FormGroup
														id={`childArray[${index}].quantity`}
														label=''
														type='number'
														className='col-md-12'>
														<Input
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
												{/* <td className='col-md-1'>
														<FormGroup
															id={`childArray[${index}].received_quantity`}
															label=''
															type='number'
															className='col-md-12'>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={items.received_quantity}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.received_quantity
																}
																invalidFeedback={
																	formik.errors.received_quantity
																}
																
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]received_quantity`
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
																		`childArray[${index}]received_quantity`
																	]
																}
															</p>
														)}
													</td> */}
												{/* <td className='col-md-2'>
													<FormGroup
														id={`childArray[${index}].purchase_price`}
														label=''
														type='number'
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.purchase_price}
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
												</td>
												<td className='col-md-2'>
													<FormGroup
														id={`childArray[${index}].sale_price`}
														label=''
														type='number'
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.sale_price}
															isValid={formik.isValid}
															isTouched={formik.touched.sale_price}
															invalidFeedback={
																formik.errors.sale_price
															}
															
														/>
													</FormGroup>
													{formik.errors[
														`childArray[${index}]sale_price`
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
																	`childArray[${index}]sale_price`
																]
															}
														</p>
													)}
												</td>
												<td className='col-md-2'>
													<FormGroup
														id={`childArray[${index}].amount`}
														label=''
														type='number'
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.amount}
															isValid={formik.isValid}
															isTouched={formik.touched.amount}
															invalidFeedback={formik.errors.amount}
															
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
												</td> */}
												<td className='col-md-3'>
													<FormGroup
														id={`childArray[${index}].remarks`}
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
															formik.values.childArray.length === 1
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
													quantity: '',
													received_quantity: 0,
													purchase_price: '',
													sale_price: '',
													amount: '',
													remarks: '',
													id: null,
												},
											]);
										}}>
										Add
									</Button>
								</div>
							</div>
							<hr />
							{/* <div className='row g-2  d-flex justify-content-start mt-2'>
								<div className='col-md-2'>
									<FormGroup id='total' label='Total' className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total}
											isValid={formik.isValid}
											isTouched={formik.touched.total}
											invalidFeedback={formik.errors.total}
											
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='tax' label='Tax(%)' className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.tax}
											isValid={formik.isValid}
											isTouched={formik.touched.tax}
											invalidFeedback={formik.errors.tax}
											
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='total_after_tax'
										label='Total After Tax'
										className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total_after_tax}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_tax}
											invalidFeedback={formik.errors.total_after_tax}
											
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='tax_in_figure'
										label='Tax in figure'
										className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.tax_in_figure}
											isValid={formik.isValid}
											isTouched={formik.touched.tax_in_figure}
											invalidFeedback={formik.errors.tax_in_figure}
											
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='discount' label='Discount' className='col-md-12'>
										<Input
											onChange={formik.handleChange}
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
										label='Total after discount'
										className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total_after_discount}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_discount}
											invalidFeedback={formik.errors.total_after_discount}
											
										/>
									</FormGroup>
								</div>
							</div> */}
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
