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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

import Select from 'react-select';
import Spinner from '../../../../components/bootstrap/Spinner';

import apiClient from '../../../../baseURL/apiClient';
// import Icon from '../../../../components/icon/Icon';
import { _titleSuccess } from '../../../../baseURL/messages';
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

	if (!values.employee) {
		errors.employee = 'Required';
	}
	if (!values.type) {
		errors.type = 'Required';
	}
	if (!values.date) {
		errors.date = 'Required';
	}
	if (!values.amount > 0) {
		errors.amount = 'Required';
	}
	if (!values.account) {
		errors.account = 'Required';
	}
	if (values.cheque_no) {
		if (!values.cheque_date) errors.cheque_date = 'Required';
	}
	return errors;
};

const AddCoeSubGroup = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const typeOptions = [
		{ id: 1, value: 1, label: 'Advance Salary' },
		{ id: 2, value: 2, label: 'Loan' },
	];
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const [employeeOptions, setEmployeeOptions] = useState([]);
	const [employeeOptionsLoading, setDepartmentsOptionsLoading] = useState(true);

	useEffect(() => {
		setDepartmentsOptionsLoading(true);
		setCrAccountLoading(true);

		apiClient
			.get(`/getEmployees`)
			.then((response) => {
				const rec = response.data.employees.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setEmployeeOptions(rec);
				setDepartmentsOptionsLoading(false);
			})
			.catch((err) => console.log(err));

		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						value: id,
						coa_sub_group_id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions(rec);
				setCrAccountLoading(false);
			})
			.catch((err) => console.log(err));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitForm = (myFormik) => {
		apiClient
			.post(`/updateAdvanceSalaryOrLoan`, myFormik.values, {})

			.then((res) => {
				setIsLoading(false);

				props.refreshTableRecordsHandler(props.refreshTableRecords + 1);
				showNotification(_titleSuccess, res.data.message, 'success');

				myFormik.resetForm();
				props.handleStateEdit(false);
				setLastSave(moment());
			});
	};

	const formik = useFormik({
		initialValues: props.editingEmployeeData,
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

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<div className='row g-4'>
					<CardBody className='col-md-6 border-end'>
						<div className='row g-4'>
							<div className='col-md-12'>
								<FormGroup id='employee' label='Employee' className='col-md-12'>
									<Select
										isDisabled
										className='col-md-12'
										// isClearable
										classNamePrefix='select'
										options={employeeOptions}
										isLoading={employeeOptionsLoading}
										value={formik.values.employee}
										// value={formik.values.mouza_id}
										onChange={(val) => {
											formik.setFieldValue('employee', val);
										}}
										isValid={formik.isValid}
										isTouched={formik.touched.employee}
										invalidFeedback={formik.errors.employee}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								{formik.errors.employee && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: 'red',
										}}>
										{formik.errors.employee}
									</p>
								)}
							</div>
							<div className='col-md-12'>
								<FormGroup id='type' label='Type' className='col-md-12'>
									<Select
										className='col-md-12'
										// isClearable
										isDisabled
										classNamePrefix='select'
										options={typeOptions}
										value={
											formik.values.type !== null &&
											typeOptions.find((c) => c.value === formik.values.type)
										}
										// value={formik.values.mouza_id}
										onChange={(val) => {
											formik.setFieldValue('type', val.id);
										}}
										isValid={formik.isValid}
										isTouched={formik.touched.type}
										invalidFeedback={formik.errors.type}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								{formik.errors.type && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: 'red',
										}}>
										{formik.errors.type}
									</p>
								)}
							</div>
							<div className='col-md-12'>
								<FormGroup id='account' label='Cr Account'>
									<Select
										className='col-md-12 '
										isClearable
										classNamePrefix='select'
										options={cashAccountsOptions}
										isLoading={crAccountLoading}
										value={formik.values.account}
										onChange={(val) => {
											formik.setFieldValue('account', val);
										}}
										onBlur={formik.handleBlur}
										isValid={formik.isValid}
										isTouched={formik.touched.account}
										invalidFeedback={formik.errors.account}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								{formik.errors.account && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: 'red',
										}}>
										{formik.errors.account}
									</p>
								)}
							</div>
						</div>
						{formik.values.account.coa_sub_group_id === 2 && (
							<div className='row g-4'>
								<div className='col-md-6'>
									<br />
									<FormGroup id='cheque_no' label='Cheque No' isFloating>
										<Input
											type='text'
											placeholder=''
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.cheque_no}
											isValid={formik.isValid}
											isTouched={formik.touched.cheque_no}
											invalidFeedback={formik.errors.cheque_no}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<br />
									<FormGroup id='cheque_date' label='Cheque Date' isFloating>
										<Flatpickr
											className='form-control'
											value={formik.values.cheque_date}
											disabled={!formik.values.cheque_no && true}
											options={{
												dateFormat: 'd/m/y',
												allowInput: true,
												defaultDate: new Date(),
											}}
											onChange={(date, dateStr) => {
												formik.setFieldValue('cheque_date', dateStr);
											}}
											onClose={(date, dateStr) => {
												formik.setFieldValue('cheque_date', dateStr);
											}}
											id='default-picker'
										/>
									</FormGroup>
									{formik.errors.cheque_date && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.cheque_date}
										</p>
									)}
								</div>
							</div>
						)}
						<div className='row g-4'>
							<div className='col-md-6'>
								<FormGroup id='amount' label='Amount'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.amount}
										isValid={formik.isValid}
										isTouched
										invalidFeedback={formik.errors.amount}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<br />
							</div>
							<div className='col-md-6'>
								<FormGroup label='Date'>
									<Flatpickr
										className='form-control'
										value={formik.values.date}
										// eslint-disable-next-line react/jsx-boolean-value

										options={{
											dateFormat: 'd/m/y',
											allowInput: true,
										}}
										onChange={(date, dateStr) => {
											formik.setFieldValue('date', dateStr);
										}}
										onClose={(date, dateStr) => {
											formik.setFieldValue('date', dateStr);
										}}
										id='default-picker'
									/>
								</FormGroup>
								{formik.errors.date && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: 'red',
										}}>
										{formik.errors.date}
									</p>
								)}
							</div>
						</div>
					</CardBody>
				</div>
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

export default AddCoeSubGroup;
