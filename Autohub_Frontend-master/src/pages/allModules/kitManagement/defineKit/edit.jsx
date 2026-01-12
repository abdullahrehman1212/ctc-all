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
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [kitEditOptions, setKitEditOptions] = useState([]);
	const [editKitOptionsLoading, setEditKitOptionsLoading] = useState(true);

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
		apiClient
			.post(`/updateKit`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					showNotification(_titleSuccess, res.data.message, 'success');
					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					showNotification(_titleError, res.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
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
				setKitEditOptions(rec);
				setEditKitOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup id='name' label='Kit Name' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.name}
									isValid={formik.isValid}
									isTouched={formik.touched.name}
									invalidFeedback={formik.errors.name}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<table
								className='table text-center table-modern'
								style={{ overflow: 'scrollY' }}>
								<thead>
									<tr className='row mt-2' style={{ marginLeft: 2 }}>
										<th className='col-6 col-sm-5 col-md-6'>Items Name</th>
										<th className='col-4 col-sm-5 col-md-5'>
											Required Quantity
										</th>
									</tr>
								</thead>
								{formik.errors.childArray && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: 'red',
											textAlign: 'left',
											marginTop: 3,
										}}>
										{formik.errors.childArray}
									</p>
								)}
								<tbody>
									{formik.values.childArray.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr
												className='d-flex align-items-center'
												key={formik.values.childArray[index].item_id}>
												<td className='col-6 col-sm-6 col-md-7'>
													<FormGroup
														label=''
														id={`childArray[${index}].item_id`}>
														<ReactSelect
															className='col-md-12'
															classNamePrefix='select'
															options={kitEditOptions}
															isLoading={editKitOptionsLoading}
															isClearable
															value={
																formik.values.childArray[index]
																	.item_id
																	? kitEditOptions.find(
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
															validFeedback='Looks good!'
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
												<td
													className='col-4 col-sm-4 col-md-4'
													style={{ marginLeft: 3 }}>
													<FormGroup
														id={`childArray[${index}].quantity`}
														label=''
														className='col-md-12'>
														<Input
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={items.quantity}
															isValid={formik.isValid}
															isTouched={formik.touched.quantity}
															invalidFeedback={formik.errors.quantity}
															validFeedback='Looks good!'
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
							<div className='row g-4'>
								<div className='col-md-4'>
									<Button
										color='primary'
										icon='add'
										onClick={() => {
											formik.setFieldValue('childArray', [
												...formik.values.childArray,
												{
													name: '',
													quantity: '',
												},
											]);
										}}>
										Add Row
									</Button>
								</div>
							</div>
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
