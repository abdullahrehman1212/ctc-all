// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

// ** apiClient Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import useSortableData from '../../../../hooks/useSortableData';
import Icon from '../../../../components/icon/Icon';
import PaginationButtons, { dataPagination } from '../../../../components/PaginationButtons';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
import { _titleError, _titleSuccess } from '../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
// import showNotification from '../../../../components/extras/showNotification';

// eslint-disable-next-line react/prop-types
const Edit1 = ({ editData, handleStateEdit, tableDataLoading }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const { itemss, requestSort, getClassNamesFor } = useSortableData(editData);
	// const onCurrentPageData = dataPagination(itemss, 1, 10);

	const formik = useFormik({
		initialValues: { childArray: editData || [] },

		// validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const submitForm = (data) => {
		apiClient
			.post(`/updateItemPricesBulk`, data)
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
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setIsLoading(false);
			});
	};
	useEffect(() => {
		// console.log('formik values', formik.values);
	}, [formik.values]);
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<table className='table table-modern'>
							<thead>
								<tr>
									<th
										onClick={() => requestSort('id')}
										className='cursor-pointer text-decoration-underline'>
										ID{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('id')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('booking_no')}
										className='cursor-pointer text-decoration-underline'>
										Item{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('booking_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('booking_no')}
										className='cursor-pointer text-decoration-underline'>
										OEM{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('booking_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('booking_no')}
										className='cursor-pointer text-decoration-underline'>
										Part Model{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('booking_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('booking_no')}
										className='cursor-pointer text-decoration-underline'>
										Brand{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('booking_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('sale_price')}
										className='cursor-pointer text-decoration-underline'>
										Sale Price{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('sale_price')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('min_price')}
										className='cursor-pointer text-decoration-underline'>
										Min Price{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('min_price')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('max_price')}
										className='cursor-pointer text-decoration-underline'>
										Max Price{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('max_price')}
											icon='FilterList'
										/>
									</th>
								</tr>
							</thead>
							{tableDataLoading ? (
								<tbody>
									<tr>
										<td colSpan='12'>
											<div className='d-flex justify-content-center'>
												<Spinner color='primary' size='3rem' />
											</div>
										</td>
									</tr>
								</tbody>
							) : (
								<tbody>
									{formik.values.childArray.map((items, index) => (
										<tr key={items.id}>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`id`}
													label=''>
													<strong>{items.id}</strong>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`name`}
													label=''
													className='col-md-12'>
													<normal>
														{
															items.machine_part_oem_part.machine_part
																.name
														}
													</normal>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`name`}
													label=''
													className='col-md-12'>
													<normal>
														{
															items.machine_part_oem_part
																.oem_part_number.number1
														}
														/{' '}
														{
															items.machine_part_oem_part
																.oem_part_number.number2
														}
													</normal>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`name`}
													label=''
													className='col-md-12'>
													<normal>
														{
															items.machine_part_oem_part
																.machine_partmodel.name
														}
													</normal>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`name`}
													label=''
													className='col-md-12'>
													<normal>{items.brand.name}</normal>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													id={`childArray[${index}].sale_price`}
													// label='Sale Price'
													className='col-md-12'>
													<Input
														type='number'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={items.sale_price}
														isValid={formik.isValid}
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]
																		?.sale_price
																: ''
														}
														invalidFeedback={
															formik.errors[
																`childArray[${index}]sale_price`
															]
														}
													/>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`childArray[${index}].min_price`}
													// label='Min Price'
													className='col-md-12'>
													<Input
														type='number'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={items.min_price}
														isValid={formik.isValid}
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]
																		?.min_price
																: ''
														}
														invalidFeedback={
															formik.errors[
																`childArray[${index}]min_price`
															]
														}
													/>
												</FormGroup>
											</td>
											<td>
												<FormGroup
													// eslint-disable-next-line react/jsx-curly-brace-presence
													id={`childArray[${index}].max_price`}
													// label='Max Price'
													className='col-md-12'>
													<Input
														type='number'
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={items.max_price}
														isValid={formik.isValid}
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]
																		?.max_price
																: ''
														}
														invalidFeedback={
															formik.errors[
																`childArray[${index}]max_price`
															]
														}
													/>
												</FormGroup>
											</td>
										</tr>
									))}
								</tbody>
							)}
						</table>
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
Edit1.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editData: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit1;
