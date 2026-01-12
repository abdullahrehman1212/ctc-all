import React, { useState } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';
// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
// import Icon from '../../../../components/icon/Icon';
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
import { _titleSuccess } from '../../../../baseURL/messages';
import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	return errors;
};

const AddAgent = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const formik = useFormik({
		// eslint-disable-next-line react/destructuring-assignment
		initialValues: { ...props.editingPersonData, department_id: props.editingPersonData.id },
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
	const submitForm = (data) => {
		apiClient
			.post(`/updateDepartment`, data, {})

			.then((res) => {
				setIsLoading(false);

				formik.resetForm();
				showNotification(_titleSuccess, res.data.message, 'success');

				// eslint-disable-next-line react/destructuring-assignment
				props.refreshTableRecords();
				// eslint-disable-next-line react/destructuring-assignment
				props.handleStateEdit(false);
				setLastSave(moment());
			})
			.catch((err) => {
				setIsLoading(false);
				showNotification('Error', err.message, 'danger');
			});
	};

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-4'>
						<FormGroup id='name' label='Department Name' className='col-md-12'>
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
