// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import { baseURL } from '../../../../baseURL/authMultiExport';

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
// import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	// if (!values.phone_no) {
	// 	errors.phone_no = 'Required';
	// }
	// if (!values.email) {
	// 	errors.email = 'Required';
	// }
	// if (!values.cnic) {
	// 	errors.cnic = 'Required';
	// }
	// if (!values.address) {
	// 	errors.address = 'Required';
	// }
	// if (!values.father_name) {
	// 	errors.father_name = 'Required';
	// }
	// if (!values.person_type_id) {
	// 	errors.person_type_id = 'Required';
	// }
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

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
	const formatChars = {
		q: '[0123456789]',
	};
	const submitForm = (data) => {
		apiClient
			.post(`/updateperson`, data)
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
		submitForm(formik.values);
		setLastSave(moment());
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup id='name' label='Name' className='col-md-12'>
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
							{/* <FormGroup id='father_name' label='Father Name' className='col-lg-12'>
								<Input
									// disabled={formik.values.disableFields}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.father_name}
									isValid={formik.isValid}
									isTouched={formik.touched.father_name}
									invalidFeedback={formik.errors.father_name}
									validFeedback='Looks good!'
								/>
							</FormGroup> */}

							<FormGroup id='phone_no' label='Phone number' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
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
							<FormGroup id='email' label='Email' className='col-lg-12'>
								<Input
									// disabled={formik.values.disableFields}
									type='email'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.email}
									isValid={formik.isValid}
									isTouched={formik.touched.email}
									invalidFeedback={formik.errors.email}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<FormGroup id='cnic' label='CNIC' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
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
									// disabled={formik.values.disableFields}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.address}
									isValid={formik.isValid}
									isTouched={formik.touched.address}
									invalidFeedback={formik.errors.address}
									validFeedback='Looks good!'
								/>
							</FormGroup>

							<FormGroup id='date' label='Date' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
									type='date'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.date}
									isValid={formik.isValid}
									isTouched={formik.touched.date}
									invalidFeedback={formik.errors.date}
									validFeedback='Looks good!'
								/>
							</FormGroup>

							<FormGroup
								id='opening_balance'
								label='Opening Balance'
								className='col-lg-12'>
								<Input
									// disabled={formik.values.disableFields}
									type='number'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.opening_balance}
									isValid={formik.isValid}
									isTouched={formik.touched.opening_balance}
									invalidFeedback={formik.errors.opening_balance}
									validFeedback='Looks good!'
								/>
							</FormGroup>
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
	