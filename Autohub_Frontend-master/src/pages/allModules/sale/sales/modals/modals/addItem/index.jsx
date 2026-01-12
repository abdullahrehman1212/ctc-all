// eslint-disable-next-line eslint-comments/disable-enable-pair
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
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import { baseURL } from '../../../../../../../baseURL/authMultiExport';
import Spinner from '../../../../../../../components/bootstrap/Spinner';
import InputGroup from '../../../../../../../components/bootstrap/forms/InputGroup';

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../../../../components/bootstrap/Modal';
// import showNotification from '../../../../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../../../../components/bootstrap/Card';
import apiClient from '../../../../../../../baseURL/apiClient';
import FormGroup from '../../../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../../../components/bootstrap/forms/Input';
import Button from '../../../../../../../components/bootstrap/Button';
import Icon from '../../../../../../../components/icon/Icon';
import AddCategory from './addCategory';
import AddSubCategory from './addSubCategory';
import AddApplication from './addApplication';

const validate = (values) => {
	let errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}
	if (!values.sub_category_id) {
		errors.sub_category_id = 'Required';
	}
	// if (!values.application_id) {
	// 	errors.application_id = 'Required';
	// }
	if (!values.uom_id) {
		errors.uom_id = 'Required';
	}
	if (!values.type_id) {
		errors.type_id = 'Required';
	}
	values.kitchild.forEach((data, index) => {
		if (values.type_id === 2 && !data.item_id) {
			errors = {
				...errors,
				[`kitchild[${index}]item_id`]: 'Please Select Drop Down Item!',
			};
		}
		if (values.type_id === 2 && !data.quantity) {
			errors = {
				...errors,
				[`kitchild[${index}]quantity`]: 'Provide Quantity!',
			};
		}
	});

	return errors;
};

const Add = ({ refreshDropdowns }) => {
	const [isSingleOptionsLoading, setIsSingleLoading] = useState(false);
	const [isSingleOptions, setIsSingleOptions] = useState([]);
	const [kitItemDropdownOptions, setKitItemDropDownOptions] = useState([]);
	const [kitItemDropDownLoading, setKitItemDropDownLoading] = useState(false);
	const [state, setState] = useState(false);
	const [tableDataLoading, setTableDataLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [subCategoryOptionsLoading, setSubCategoryOptionsLoading] = useState(false);
	const [applicationOptions, setApplicationOptions] = useState('');
	const [applicationOptionsLoading, setApplicationOptionsLoading] = useState(false);
	const [uomOptions, setUomOptions] = useState([]);
	const [uomOptionsLoading, setUomOptionsLoading] = useState(false);
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

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
			name: '',
			category_id: '',
			application: '',
			uom: '',
			kitchild: [{ item_id: '', quantity: '' }],
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
	const removeRow = (i) => {
		formik.setFieldValue('kitchild', [
			...formik.values.kitchild.slice(0, i),
			...formik.values.kitchild.slice(i + 1),
		]);
	};
	useEffect(() => {
		refreshDropdownsInner();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const submitForm = (myFormik) => {
		apiClient
			.post(`/addMachinePart`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshDropdowns();
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
	const refreshDropdownsInner = () => {
		setCategoryOptionsLoading(true);

		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoryOptions(rec);
				setCategoryOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// apiClient
		// 	.get(`/getsubCategoriesDropDown`)
		// 	.then((response) => {
		// 		const rec = response.data.subcategories.map(({ id, name }) => ({
		// 			id,
		// 			value: id,
		// 			label: name,
		// 		}));
		// 		setSubCategoryOptions(rec);
		// 		setSubCategoryOptionsLoading(false);
		// 	})

		// 	// eslint-disable-next-line no-console
		// 	.catch((err) => {
		// 		showNotification(_titleError, err.message, 'Danger');
		// 		if (err.response.status === 401) {
		// 			showNotification(_titleError, err.response.data.message, 'Danger');
		// 		}
		// 	});
		apiClient
			.get(`/getApplicationsDropDown`)
			.then((response) => {
				const rec = response.data.applications.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setApplicationOptions(rec);
				setApplicationOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		apiClient
			.get(`/getUOmDropdown`)
			.then((response) => {
				const rec = response.data.Uom.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setUomOptions(rec);
				setUomOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response?.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		apiClient.get(`/getMachineparttypesDropDown`).then((response) => {
			const rec = response.data.machineparttypes.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setIsSingleOptions(rec);
			setIsSingleLoading(false);
		});

		apiClient
			.get(`/getItemOemDropDown?type_id=1`)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setKitItemDropDownOptions(rec);
				setKitItemDropDownLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		if (formik.values.category_id) {
			getSubcatByCat(formik.values.category_id);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};

	const getSubcatByCat = (idd) => {
		setSubCategoryOptionsLoading(true);
		apiClient
			.get(`/getSubCategoriesByCategory?category_id=${idd}`)
			.then((response) => {
				// console.log('...', response.data);
				const rec = response.data.subcategories.map(({ id, name }) => ({
					id,
					value: id,
					// label: `${name} - ${existingkit_inventory.kits_available}`,
					label: name,
				}));
				setSubCategoryOptions(rec);
				setSubCategoryOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Icon
					icon='ClipboardPlus'
					className='mb-0 text-info h3'
					onClick={() => {
						initialStatus(); // setStateRefresh(!staterefresh);
						// setStateRefresh(!staterefresh);
						setState(true);
						setStaticBackdropStatus(true);
					}}
				/>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='md'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Item</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
										<FormGroup label='Category' id='category_id'>
											<InputGroup>
												<ReactSelect
													className='col-md-11'
													classNamePrefix='select'
													options={categoryOptions}
													isLoading={categoryOptionsLoading}
													isClearable
													value={
														formik.values.category_id
															? categoryOptions.find(
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
														getSubcatByCat(val === null ? '' : val.id);
													}}
													filterOption={createFilter({
														matchFrom: 'start',
													})}
												/>
												<AddCategory
													refreshDropdownsInner={refreshDropdownsInner}
												/>
											</InputGroup>
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
									<div className='col-md-12'>
										<FormGroup label='Sub Category' id='sub_category_id'>
											<InputGroup>
												<ReactSelect
													className='col-md-11'
													classNamePrefix='select'
													options={subCategoryOptions}
													isLoading={subCategoryOptionsLoading}
													isClearable
													value={
														formik.values.sub_category_id
															? subCategoryOptions.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.sub_category_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'sub_category_id',
															val !== null && val.id,
															// setTableData(['']),
														);
													}}
													filterOption={createFilter({
														matchFrom: 'start',
													})}
												/>
												<AddSubCategory
													refreshDropdownsInner={refreshDropdownsInner}
													categoryOptions={categoryOptions}
												/>
											</InputGroup>
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
									<div className='col-md-12'>
										<FormGroup
											label='Application'
											className='col-md-12'
											id='application_id'>
											<InputGroup>
												<ReactSelect
													className='col-md-11'
													classNamePrefix='select'
													options={applicationOptions}
													isLoading={applicationOptionsLoading}
													isClearable
													value={
														formik.values.application_id
															? applicationOptions.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.application_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'application_id',
															val !== null && val.id,
														);
													}}
												/>
												<AddApplication
													refreshDropdownsInner={refreshDropdownsInner}
												/>
											</InputGroup>
										</FormGroup>
										{formik.errors.application_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.application_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup label='Unit Of Measurement' id='uom_id'>
											<InputGroup>
												<ReactSelect
													className='col-md-11'
													classNamePrefix='select'
													options={uomOptions}
													isLoading={uomOptionsLoading}
													isClearable
													value={
														formik.values.uom_id
															? uomOptions.find(
																	(c) =>
																		c.value ===
																		formik.values.uom_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'uom_id',
															val !== null && val.id,
														);
													}}
													filterOption={createFilter({
														matchFrom: 'start',
													})}
												/>
												{/* <AddCategory
													refreshDropdownsInner={refreshDropdownsInner}
												/> */}
											</InputGroup>
										</FormGroup>
										{formik.errors.uom_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.uom_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup label='Type' id='type_id'>
											<InputGroup>
												<ReactSelect
													className='col-md-11'
													classNamePrefix='select'
													options={isSingleOptions}
													isLoading={isSingleOptionsLoading}
													isClearable
													value={
														formik.values.type_id
															? isSingleOptions.find(
																	(c) =>
																		c.value ===
																		formik.values.type_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'type_id',
															val !== null && val.id,
															// setTableData(['']),
														);
													}}
													filterOption={createFilter({
														matchFrom: 'start',
													})}
												/>
											</InputGroup>
										</FormGroup>
										{formik.errors.type_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.type_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup id='name' label='Name' className='col-md-11'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.name}
												isValid={formik.isValid}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
											/>
										</FormGroup>
									</div>
									{/* table */}
									{formik.values.type_id === 2 ? (
										<div>
											<table
												className='table text-center table-modern'
												style={{ overflow: 'scrollY' }}>
												<thead>
													<tr
														className='row mt-2'
														style={{ marginLeft: 2 }}>
														<th className='col-6 col-sm-5 col-md-6'>
															Items Name
														</th>
														<th className='col-4 col-sm-5 col-md-5'>
															Required Quantity
														</th>
													</tr>
												</thead>
												{formik.errors.kitchild && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: 'red',
															textAlign: 'left',
															marginTop: 3,
														}}>
														{formik.errors.kitchild}
													</p>
												)}
												<tbody>
													{formik.values.kitchild.length > 0 &&
														formik.values.kitchild.map(
															(items, index) => (
																<tr
																	className='d-flex align-items-center'
																	key={
																		formik.values.kitchild[
																			index
																		].item_id
																	}>
																	<td className='col-6 col-sm-6 col-md-7'>
																		<FormGroup
																			label=''
																			id={`kitchild[${index}].item_id`}>
																			<ReactSelect
																				className='col-md-12'
																				classNamePrefix='select'
																				options={
																					kitItemDropdownOptions
																				}
																				isLoading={
																					kitItemDropDownLoading
																				}
																				isClearable
																				value={
																					formik.values
																						.kitchild[
																						index
																					].item_id
																						? kitItemDropdownOptions.find(
																								(
																									c,
																								) =>
																									c.value ===
																									formik
																										.values
																										.kitchild[
																										index
																									]
																										.item_id,
																						  )
																						: null
																				}
																				onChange={(val) => {
																					formik.setFieldValue(
																						`kitchild[${index}].item_id`,
																						val !==
																							null &&
																							val.id,
																					);
																				}}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched
																						.item_id
																				}
																				invalidFeedback={
																					formik.errors[
																						`kitchild[${index}].item_id`
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
																			`kitchild[${index}]item_id`
																		] && (
																			// <div className='invalid-feedback'>
																			<p
																				style={{
																					color: 'red',
																					textAlign:
																						'left',
																					marginTop: 3,
																				}}>
																				{
																					formik.errors[
																						`kitchild[${index}]item_id`
																					]
																				}
																			</p>
																		)}
																	</td>
																	<td
																		className='col-4 col-sm-4 col-md-4'
																		style={{ marginLeft: 3 }}>
																		<FormGroup
																			id={`kitchild[${index}].quantity`}
																			label=''
																			className='col-md-12'>
																			<Input
																				onChange={
																					formik.handleChange
																				}
																				onBlur={
																					formik.handleBlur
																				}
																				value={
																					items.quantity
																				}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched
																						.quantity
																				}
																				invalidFeedback={
																					formik.errors
																						.quantity
																				}
																				validFeedback='Looks good!'
																			/>
																		</FormGroup>
																		{formik.errors[
																			`kitchild[${index}]quantity`
																		] && (
																			// <div className='invalid-feedback'>
																			<p
																				style={{
																					color: 'red',
																					textAlign:
																						'left',
																					marginTop: 3,
																				}}>
																				{
																					formik.errors[
																						`kitchild[${index}]quantity`
																					]
																				}
																			</p>
																		)}
																	</td>
																	<td className='col-md-1 mt-1'>
																		<Button
																			icon='cancel'
																			color='danger'
																			onClick={() =>
																				removeRow(index)
																			}
																		/>
																	</td>
																</tr>
															),
														)}
												</tbody>
											</table>
											<div className='row g-4'>
												<div className='col-md-4'>
													<Button
														color='primary'
														icon='add'
														onClick={() => {
															formik.setFieldValue('kitchild', [
																...formik.values.kitchild,
																{
																	name: '',
																	quantity: '',
																},
															]);
														}}>
														Add
													</Button>
												</div>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</CardBody>
							<CardFooter>
								<CardFooterLeft>
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={formik.resetForm}>
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
	refreshDropdowns: PropTypes.func.isRequired,
};

export default Add;
