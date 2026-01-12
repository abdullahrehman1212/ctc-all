// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** ApiClient Imports

import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/apiClient';

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

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}
	if (!values.sub_category_id) {
		errors.sub_category_id = 'Required';
	}

	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);
	const [isSingleOptionsLoading, setIsSingleLoading] = useState(false);
	const [isSingleOptions, setIsSingleOptions] = useState([]);
	const [kitItemDropdownOptions, setKitItemDropDownOptions] = useState([]);
	const [kitItemDropDownLoading, setKitItemDropDownLoading] = useState(false);
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [subCategoryOptionsLoading, setSubCategoryOptionsLoading] = useState(false);
	const [applicationOptions, setApplicationOptions] = useState([]);
	const [applicationOptionsLoading, setApplicationOptionsLoading] = useState(false);
	const [uomOptions, setUomOptions] = useState([]);
	const [uomOptionsLoading, setUomOptionsLoading] = useState(false);

	const formik = useFormik({
		initialValues: { ...editingItem, category_id: editingItem.subcategories.category_id },
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const customStyles = {
		option: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
		singleValue: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
	  };
	const submitForm = (data) => {
		apiClient
			.post(`/updateMachinePart`, data)
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
	const removeRow = (i) => {
		formik.setFieldValue('kitchild', [
			...formik.values.kitchild.slice(0, i),
			...formik.values.kitchild.slice(i + 1),
		]);
	};
	useEffect(() => {
		setCategoryOptionsLoading(true);
		apiClient
			.get(`/getsubCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.subcategories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubCategoryOptions(rec);
				setSubCategoryOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
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
				if (err.response.status === 401) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
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
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
						<FormGroup label='Category' id='category_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={categoryOptions}
												isLoading={categoryOptionsLoading}
												isClearable
												value={
													formik.values.category_id
											? categoryOptions.find(
													(c) => c.value === formik.values.category_id,
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
												styles={customStyles}
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
						<div className='col-md-12'>
						<FormGroup label='Sub Category' id='sub_category_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={subCategoryOptions}
												isLoading={subCategoryOptionsLoading}
												isClearable
												value={
													formik.values.sub_category_id
														? subCategoryOptions.find(
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
														// setTableData(['']),
													);
												}}
												styles={customStyles}
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
						<div className='col-md-12'>
						<FormGroup label='Application' id='application_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={applicationOptions}
												isLoading={applicationOptionsLoading}
												isClearable
												value={
													formik.values.application_id
														? applicationOptions.find(
																(c) =>
																	c.value ===
																	formik.values.application_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'application_id',
														val !== null && val.id,
													);
												}}
												styles={customStyles}
											/>
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
											<ReactSelect
												className='col-md-12'
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
												styles={customStyles}
											/>
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
						<FormGroup label='Item Type' id='type_id'>
											<ReactSelect
												className='col-md-12'
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
												styles={customStyles}
											/>
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
						<FormGroup id='name' label='Name' className='col-md-12'>
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
																				styles={customStyles}
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
