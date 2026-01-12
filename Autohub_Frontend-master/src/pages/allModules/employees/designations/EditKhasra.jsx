import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import Select from 'react-select';
import moment from 'moment';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
// import Icon from '../../../../components/icon/Icon';
import { _titleSuccess } from '../../../../baseURL/messages';
import apiClient from '../../../../baseURL/apiClient';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
	// eslint-disable-next-line no-unused-vars
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
	if (values.department_id.length === 0) {
		errors.department_id = 'Required';
	}

	return errors;
};

const AddAgent = (props) => {
	const [departmentOptionsLoading, setDepartmentOptionsLoading] = useState(null);

	const [departmentOptions, setDepartmentOptions] = useState([]);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	useEffect(() => {
		setDepartmentOptionsLoading(true);

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				const rec = response.data.departments.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDepartmentOptions(rec);
				setDepartmentOptionsLoading(false);
			}) // eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// eslint-disable-next-line no-unused-vars
	const submitForm = (data) => {
		apiClient
			.post(`/updateDesignation`, data, {})

			.then((res) => {
				setIsLoading(false);

				formik.resetForm();
				showNotification(_titleSuccess, res.data.message, 'success');

				// eslint-disable-next-line react/destructuring-assignment
				props.handleStateEdit(false);
				// eslint-disable-next-line react/destructuring-assignment
				props.refreshTableRecords();
				setLastSave(moment());
			})
			.catch((err) => {
				setIsLoading(false);
				showNotification('Error', err.message, 'danger');
			});
	};

	const formik = useFormik({
		// eslint-disable-next-line react/destructuring-assignment
		initialValues: { ...props.editingKhasraData, designation_id: props.editingKhasraData.id },
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		// eslint-disable-next-line no-console

		submitForm(formik.values);
		setLastSave(moment());
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-4'>
						<div className='col-md-12'>
							<FormGroup label='Department' id='department_id'>
								<Select
									className='col-md-12'
									isLoading={departmentOptionsLoading}
									classNamePrefix='select'
									options={departmentOptions}
									// isLoading={departmentOptionsLoading}
									value={
										formik.values.department_id !== null &&
										departmentOptions.find(
											(c) => c.value === formik.values.department_id,
										)
									}
									onChange={(val) => {
										formik.setFieldValue('department_id', val.id);
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.department_id}
									invalidFeedback={formik.errors.department_id}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							{formik.errors.department_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: 'red',
									}}>
									{formik.errors.department_id}
								</p>
							)}
						</div>

						<FormGroup id='name' label='Desigantion' className='col-md-12'>
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
							icon={isLoading ? null : 'Save'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading
								? (lastSave && 'Saving') || 'Saving'
								: (lastSave && 'Save') || 'Save'}
						</Button>
					</CardFooterRight>
				</CardFooter>
			</Card>
		</div>
	);
};

export default AddAgent;
