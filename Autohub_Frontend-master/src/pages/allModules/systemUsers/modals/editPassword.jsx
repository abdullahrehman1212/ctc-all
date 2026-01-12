// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable operator-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-return-assign */
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

// import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/themes/light.css';
// import PMT from 'formula-pmt';
import Spinner from '../../../../components/bootstrap/Spinner';

import apiClient from '../../../../baseURL/apiClient';

// import { _titleSuccess } from '../../../../baseURL/messages';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.password) {
		errors.password = 'Required';
	}
	if (!values.confirm_password) {
		errors.confirm_password = 'Required';
	}
	if (!(values.confirm_password === values.password)) {
		errors.confirm_password = 'Mismatch Password';
	}

	return errors;
};

const AddCoeSubGroup = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	// eslint-disable-next-line no-unused-vars
	const submitForm = (myFormik) => {
		apiClient
			.post(`/changePassword`, myFormik, {})

			// eslint-disable-next-line no-unused-vars
			.then((res) => {
				setIsLoading(false);

				props.refreshTableRecords();
				// showNotification(_titleSuccess, res.data.message, 'success');
				props.handleStatePassword(false);
				myFormik.resetForm();
				setLastSave(moment());
			});
	};

	const formik = useFormik({
		initialValues: { ...props.editingUserData, confirm_password: '', password: '' },
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
	// const [calculatedPMT, setCalculatedPMT] = useState(0);

	// const [GetRoles, setGetRoles] = useState([]);

	// eslint-disable-next-line no-unused-vars
	const [GetAdminID, setGetAdminID] = useState(2);
	return (
		<Card stretch tag='form' onSubmit={formik.handleSubmit}>
			<CardBody>
				<div className='row g-4'>
					<FormGroup id='password' label='Password' className='col-md-12'>
						<Input
							type='password'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.password}
							isValid={formik.isValid}
							isTouched
							invalidFeedback={formik.errors.password}
							validFeedback='Looks good!'
						/>
					</FormGroup>
					<FormGroup id='confirm_password' label='Confirm Password' className='col-md-12'>
						<Input
							type='password'
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.confirm_password}
							isValid={formik.isValid}
							isTouched
							invalidFeedback={formik.errors.confirm_password}
							validFeedback='Looks good!'
						/>
					</FormGroup>
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
						icon={isLoading ? null : 'Save'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={() => {
							// eslint-disable-next-line no-plusplus
							if (formik.isValid) {
								setIsLoading(true);
								submitForm(formik.values);
							} else {
								showNotification(
									'Pease Provide values!',
									'Please Fill Form!',
									'warning',
								);
							}
						}}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Saving') || 'Saving'
							: (lastSave && 'Save') || 'Save'}
					</Button>
				</CardFooterRight>
			</CardFooter>
		</Card>
	);
};

export default AddCoeSubGroup;
