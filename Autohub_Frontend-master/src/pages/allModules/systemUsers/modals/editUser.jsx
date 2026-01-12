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
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';

// import Flatpickr from 'react-flatpickr';

import 'flatpickr/dist/themes/light.css';
// import PMT from 'formula-pmt';
// eslint-disable-next-line no-unused-vars
import Select from 'react-select';
import Spinner from '../../../../components/bootstrap/Spinner';

import apiClient from '../../../../baseURL/apiClient';

// import Icon from '../../../../components/icon/Icon';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,

	// eslint-disable-next-line no-unused-vars
	// CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
// import { _titleSuccess } from '../../../../baseURL/messages';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.role_id) {
		errors.role_id = 'Required';
	}
	if (!values.email) {
		errors.email = 'Required';
	}

	return errors;
};

const AddCoeSubGroup = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	// eslint-disable-next-line no-unused-vars
	const submitForm = (myFormik) => {
		apiClient
			.post(`/updateUser`, myFormik, {})

			// eslint-disable-next-line no-unused-vars
			.then((res) => {
				setIsLoading(false);

				props.refreshTableRecords();
				// showNotification(_titleSuccess, res.data.message, 'success');

				props.handleStateEdit(false);
				myFormik.resetForm();
				setLastSave(moment());
			});
	};

	const formik = useFormik({
		initialValues: props.editingUserData,
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
// eslint-disable-next-line no-unused-vars
	const [GetRoles, setGetRoles] = useState([]);
	useEffect(() => {
		apiClient
			.get(`/getRoles`)
			.then((response) => {
				const rec = response.data.roles.map(({ id, role }) => ({
					id,
					value: id,
					label: role,
				}));
				setGetRoles(rec);

				console.log('getRoles Array::::::::', rec);
			})
			.catch((err) => console.log(err));
	}, []);

	// eslint-disable-next-line no-unused-vars
	const [GetAdminID, setGetAdminID] = useState(2);
	return (
		<Card stretch tag='form' onSubmit={formik.handleSubmit}>
			<CardBody>
				<div className='row g-4'>
					<FormGroup id='name' label='Name' className='col-md-12'>
						<Input
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.name}
							isValid={formik.isValid}
							isTouched
							invalidFeedback={formik.errors.name}
							validFeedback='Looks good!'
						/>
					</FormGroup>

					<FormGroup
						id='email'
						label='email'
						className='col-md-12'
						type='email'
						placeholder='email'
						disabled>
						<Input
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							value={formik.values.email}
							isValid={formik.isValid}
							isTouched
							invalidFeedback={formik.errors.email}
							validFeedback='Looks good!'
							disabled
						/>
					</FormGroup>
{/* 
					<FormGroup id='roleID' label='Select Role' className='col-md-12'>
						<Select
							className='col-md-12'
							options={GetRoles}
							// isLoading={crAccountLoading}
							value={
								formik.values.role_id !== null &&
								GetRoles.find((c) => c.value === formik.values.role_id)
							}
							onChange={(e) => {
								formik.setFieldValue(`role_id`, e.id);
							}}
							onBlur={formik.handleBlur}
							isValid={formik.isValid}
							isTouched
							invalidFeedback={formik.errors.plot_type}
							validFeedback='Looks good!'
						/>
					</FormGroup> */}
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
