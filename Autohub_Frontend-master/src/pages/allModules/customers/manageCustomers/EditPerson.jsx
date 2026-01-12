// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';
import 'flatpickr/dist/themes/light.css';

import Select from 'react-select';
import Spinner from '../../../../components/bootstrap/Spinner';

import baseURL from '../../../../baseURL/baseURL';
// import Icon from '../../../../components/icon/Icon';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	} else if (values.name.length > 50) {
		errors.name = 'Must be 50 characters or less';
	}
	if (!values.cnic) {
		errors.cnic = 'Required';
	} else if (values.cnic.includes('_')) {
		errors.cnic = 'CNIC must be 13 digits';
	}
	if (!values.phone_no) {
		errors.phone_no = 'Required';
	} else if (values.phone_no.includes('_')) {
		errors.phone_no = 'phone number must be atleast 11 digits';
	}

	// if (values.personTypes.length === 0) {
	// 	errors.personTypes = 'Please choose at least one person type';
	// }
	return errors;
};

const EditPerson = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	// const _titleSuccess = (
	// 	<span className='d-flex align-items-center'>
	// 		<Icon icon='Info' size='lg' className='me-1' />
	// 		<span>Record Saved Successfully</span>
	// 	</span>
	// );
	// const _titleError = (
	// 	<span className='d-flex align-items-center'>
	// 		<Icon icon='Info' size='lg' className='me-1' />
	// 		<span>Error Saving Record </span>
	// 	</span>
	// );
	const formatChars = {
		q: '[0123456789]',
	};

	const submitForm = (myFormik) => {
		const url = `${baseURL}/updateperson`;

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(myFormik.values),
		};
		fetch(url, options)
			.then((response) => response.json())
			.then((res) => {
				setIsLoading(false);

				if (res.status === 'ok') {
					props.refreshTableRecords();
					// showNotification(_titleSuccess, res.message, 'success');

					myFormik.resetForm();
					props.handleStateEdit(false);
					setLastSave(moment());
				} else {
					// showNotification(_titleError, res.message, 'danger');
					console.log('Error');
				}
			});
	};

	const formik = useFormik({
		initialValues: props.editingPersonData,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
		setLastSave(moment());
	};

	const personTypesOptions = [
		{ id: 1, person_type_id: 1, value: 1, label: 'Purchaser' },
		{ id: 2, person_type_id: 2, value: 2, label: 'Seller' },
		{ id: 3, person_type_id: 3, value: 3, label: 'Agent' },
	];

	return (
		<div className='col-12'>
			<Card stretch tag='form' shadow='none' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-4'>
						<CardBody>
							<div className='row g-4'>
								<div className='col-md-12'>
									<FormGroup label='personTypes' id='personTypes'>
										<Select
											className='col-md-12'
											isClearable
											isDisabled
											isMulti
											classNamePrefix='select'
											options={personTypesOptions}
											// isLoading={personTypesOptionsLoading}
											value={formik.values.personTypes}
											onChange={(val) => {
												formik.setFieldValue('personTypes', val);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.personTypes}
											invalidFeedback={formik.errors.personTypes}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.personTypes && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.personTypes}
										</p>
									)}
								</div>

								<FormGroup id='name' label=' Name' className='col-md-12'>
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

								<FormGroup id='phone_no' label='Phone number' className='col-md-12'>
									<Input
										formatChars={formatChars}
										placeholder='03111111111'
										mask='03qqqqqqqqq'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.phone_no}
										isValid={formik.isValid}
										isTouched={formik.touched.phone_no}
										invalidFeedback={formik.errors.phone_no}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='cnic' label='CNIC' className='col-md-12'>
									<Input
										formatChars={formatChars}
										placeholder='#####-#######-#'
										mask='qqqqq-qqqqqqq-q'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.cnic}
										isValid={formik.isValid}
										isTouched={formik.touched.cnic}
										invalidFeedback={formik.errors.cnic}
										validFeedback='Looks good!'
									/>
								</FormGroup>

								<FormGroup id='address' label='Address' className='col-lg-12'>
									<Input
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.address}
										isValid={formik.isValid}
										isTouched={formik.touched.address}
										invalidFeedback={formik.errors.address}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
						</CardBody>
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
							icon={isLoading ? null : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={() => {
								// eslint-disable-next-line no-plusplus
								if (formik.isValid) {
									setIsLoading(true);
									submitForm(formik);
								} else {
									showNotification(
										'Provide values',
										'Please Fill Form',
										'warning',
									);
								}
							}}>
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

export default EditPerson;
