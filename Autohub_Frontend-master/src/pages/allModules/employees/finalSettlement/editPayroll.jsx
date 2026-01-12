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

import { ToWords } from 'to-words';

import Select from 'react-select';
import Checks, { ChecksGroup } from '../../../../components/bootstrap/forms/Checks';
import apiClient from '../../../../baseURL/apiClient';
import Spinner from '../../../../components/bootstrap/Spinner';

// import apiClient from '../../../../baseURL/apiClient';
// import Icon from '../../../../components/icon/Icon';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
	CardTitle,
	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import { _titleSuccess } from '../../../../baseURL/messages';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.working_days) {
		errors.working_days = 'Required';
	}
	if (values.total_payable < 0) {
		errors.total_payable = 'Total Amount must not be negative';
	}

	if (values.absentees > values.employee_details.employee_profile.working_days) {
		errors.absentees = 'Must be less than Total Working Days';
	}
	if (values.leaves > values.employee_details.employee_profile.working_days) {
		errors.leaves = 'Must be less than Total Working Days';
	}
	if (values.working_days < 0) {
		errors.working_days = 'Must be greater than 0';
	}
	if (values.final_settlement === true) {
		if (!values.leaving_date) {
			errors.leaving_date = 'Required';
		}
	}
	// if (values.advance_salary_adjust > values.advance_salary) {
	// 	errors.advance_salary_adjust = 'Exceeds Limit';
	// }
	// if (values.loan_adjust > values.loan) {
	// 	errors.loan_adjust = 'Exceeds Limit';
	// }

	return errors;
};

const AddCoeSubGroup = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const paymentModeOptions = [
		{ id: 1, value: 1, label: 'Account Transfer' },
		{ id: 2, value: 2, label: 'Cash Payment' },
	];

	const toWords = new ToWords({
		localeCode: 'en-US',
		converterOptions: {
			currency: true,
			ignoreDecimal: false,
			ignoreZeroCurrency: false,
			doNotAddOnly: false,
			currencyOptions: {
				// can be used to override defaults for the selected locale
				name: 'Rupee',
				plural: 'Rupees',
				symbol: 'PKR',
				fractionalUnit: {
					name: 'Paisa',
					plural: 'Paise',
					symbol: '',
				},
			},
		},
	});
	const formik = useFormik({
		initialValues: props.editingPayrollData,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const submitForm = (myFormik) => {
		apiClient
			.post(`/updateSalarySlip`, myFormik.values, {})

			.then((res) => {
				setIsLoading(false);

				showNotification(_titleSuccess, res.data.message, 'success');

				props.refreshTableRecords();
				myFormik.resetForm();
				props.handleStateEdit(false);
				setLastSave(moment());
			});
	};

	const handleSave = () => {
		submitForm(formik);
		setLastSave(moment());
	};
	// eslint-disable-next-line no-unused-vars

	useEffect(() => {
		formik.setFieldValue(
			'overtime_amount',
			formik.values.extra_hours *
				((formik.values.employee_details.employee_profile.overtime_percentage_per_hour /
					100) *
					formik.values.employee_details.employee_profile.basic_salary),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.extra_hours]);

	useEffect(() => {
		formik.setFieldValue(
			'late_fine',
			formik.values.late_hours *
				((formik.values.employee_details.employee_profile.late_fine_percentage_per_hour /
					100) *
					formik.values.employee_details.employee_profile.basic_salary),
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.late_hours]);
	useEffect(() => {
		formik.setFieldValue(
			'absent_fine',
			formik.values.absentees *
				((formik.values.employee_details.employee_profile.absentee_percentage / 100) *
					formik.values.employee_details.employee_profile.basic_salary),
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.absentees]);

	useEffect(() => {
		if (formik.values.bonus !== '') {
			calculateTotalAmount();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.bonus]);
	useEffect(() => {
		if (formik.values.deduction !== '') {
			calculateTotalAmount();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.deduction]);
	useEffect(() => {
		calculateTotalAmount();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		formik.values.absent_fine,
		formik.values.late_fine,
		formik.values.overtime_amount,
		formik.values.loan_adjust,
		formik.values.advance_salary_adjust,
		formik.values.tax,
	]);

	const calculateTotalAmount = () => {
		formik.setFieldValue(
			'total_payable',

			Number(
				formik.values.basic_salary +
					formik.values.bonus +
					formik.values.overtime_amount +
					formik.values.fuel_allowance +
					formik.values.medical_allowance +
					formik.values.other_allowance,
			) -
				Number(formik.values.deduction) -
				Number(formik.values.late_fine) -
				Number(formik.values.loan_adjust) -
				Number(formik.values.advance_salary_adjust) -
				Number(formik.values.tax) -
				Number(formik.values.absent_fine),
		);
		formik.setFieldValue(
			'total_amount',

			Number(
				formik.values.basic_salary +
					formik.values.bonus +
					formik.values.overtime_amount +
					formik.values.fuel_allowance +
					formik.values.medical_allowance +
					formik.values.other_allowance,
			) -
				Number(formik.values.deduction) -
				Number(formik.values.late_fine) -
				Number(formik.values.absent_fine),
		);
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit} shadow='none'>
				<CardBody>
					<div className='row g-4'>
						<CardBody className='col-md-6 border-end'>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Basic Salary:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{formik.values.basic_salary.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel>Total Working Days:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{
												formik.values.employee_details.employee_profile
													.working_days
											}
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Medical Allowance:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{formik.values.medical_allowance.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)}
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Fuel Allowance:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{formik.values.fuel_allowance.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)}
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Other Allowance:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{formik.values.other_allowance.toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
											)}
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Absentee Percentage :</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{
												formik.values.employee_details.employee_profile
													.absentee_percentage
											}
											%
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Overtime %/Hr:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{
												formik.values.employee_details.employee_profile
													.overtime_percentage_per_hour
											}
											%
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Late fine %/Hr:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<CardLabel>
											{
												formik.values.employee_details.employee_profile
													.late_fine_percentage_per_hour
											}
											%
										</CardLabel>
									</CardTitle>
								</CardLabel>
							</div>
							<br />
							<div className='row g-4'>
								<CardLabel className='col-md-6' icon='Task' iconColor='danger'>
									<CardTitle>
										<CardLabel> Final Settlement:</CardLabel>
									</CardTitle>
								</CardLabel>
								<CardLabel className='col-md-6'>
									<CardTitle>
										<div className='d-flex justify-content-between'>
											<FormGroup
												className='col-md-4'
												label={
													formik.values.final_settlement === true
														? `Yes`
														: `No`
												}>
												<ChecksGroup
													isValid={formik.isValid}
													isTouched={formik.touched.final_settlement}
													invalidFeedback={
														formik.errors.final_settlement
													}>
													<Checks
														type='switch'
														id='final_settlement'
														name='checkedCheck'
														onChange={(e) => {
															formik.setFieldValue(
																'final_settlement',
																e.target.checked,
															);
														}}
														checked={formik.values.final_settlement}
													/>
												</ChecksGroup>
											</FormGroup>
											<div className='col-md-8'>
												<FormGroup label='Leaving Date'>
													<Flatpickr
														className='form-control'
														value={formik.values.leaving_date}
														disabled={
															!formik.values.final_settlement && true
														}
														options={{
															dateFormat: 'd/m/y',
															allowInput: true,
														}}
														onChange={(date, dateStr) => {
															formik.setFieldValue(
																'leaving_date',
																dateStr,
															);
														}}
														onClose={(date, dateStr) => {
															formik.setFieldValue(
																'leaving_date',
																dateStr,
															);
														}}
														id='default-picker'
													/>
												</FormGroup>
												{formik.errors.leaving_date && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: 'red',
														}}>
														{formik.errors.leaving_date}
													</p>
												)}
											</div>
										</div>
									</CardTitle>
								</CardLabel>
							</div>
							<br />
						</CardBody>

						<CardBody className='col-md-6 border-start'>
							<FormGroup
								id='working_days'
								label='Attended Working Days'
								className='col-md-6'>
								<Input
									type='number'
									min='0'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.working_days}
									isValid={formik.isValid}
									isTouched={formik.touched.working_days}
									invalidFeedback={formik.errors.working_days}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							<div className='row g-4'>
								<FormGroup
									id='extra_hours'
									label='Extra Hours   '
									className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.extra_hours}
										isValid={formik.isValid}
										isTouched={formik.touched.extra_hours}
										invalidFeedback={formik.errors.extra_hours}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup
									id='late_hours'
									label='Late Hours   '
									className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.late_hours}
										isValid={formik.isValid}
										isTouched={formik.touched.late_hours}
										invalidFeedback={formik.errors.late_hours}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>

							<div className='row g-4'>
								<FormGroup id='leaves' label='Leaves   ' className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.leaves}
										isValid={formik.isValid}
										isTouched={formik.touched.leaves}
										invalidFeedback={formik.errors.leaves}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='absentees' label='absentees   ' className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.absentees}
										isValid={formik.isValid}
										isTouched={formik.touched.absentees}
										invalidFeedback={formik.errors.absentees}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
							<div className='row g-4'>
								<FormGroup id='bonus' label='Bonus   ' className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.bonus}
										isValid={formik.isValid}
										isTouched={formik.touched.bonus}
										invalidFeedback={formik.errors.bonus}
										validFeedback='Looks good!'
									/>
								</FormGroup>
								<FormGroup id='deduction' label='Deduction   ' className='col-md-6'>
									<Input
										type='number'
										min='0'
										onWheel={(e) => e.target.blur()}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.deduction}
										isValid={formik.isValid}
										isTouched={formik.touched.deduction}
										invalidFeedback={formik.errors.deduction}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
							<div className='row g-4'>
								<FormGroup id='payment_mode' label='Payment Mode'>
									<Select
										className='col-md-12'
										classNamePrefix='select'
										options={paymentModeOptions}
										value={
											formik.values.payment_mode !== null &&
											paymentModeOptions.find(
												(c) => c.label === formik.values.payment_mode,
											)
										}
										// value={formik.values.mouza_id}
										onChange={(val) => {
											formik.setFieldValue('payment_mode', val.label);
										}}
										isValid={formik.isValid}
										isTouched={formik.touched.gender}
										invalidFeedback={formik.errors.gender}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
						</CardBody>
					</div>
					<hr />

					<CardBody>
						<div className='row g-4 '>
							<div className='col-md-3' />
							<div className='col-md-6'>
								<div className='d-flex justify-content-evenly'>
									<CardLabel icon='Calculate' iconColor='danger'>
										<CardTitle>
											<CardLabel>Total Salary Calculation:</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel>Basic Salary:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.basic_salary.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>

								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel>Medical Allowance:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.medical_allowance.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Fuel Allowance:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.fuel_allowance.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Other Allowance:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.other_allowance.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Bonus:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.bonus.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Overtime Amount:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.overtime_amount.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<hr />
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Total (Add):</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{(
													Number(formik.values.basic_salary) +
													Number(formik.values.bonus) +
													Number(formik.values.overtime_amount) +
													Number(formik.values.medical_allowance) +
													Number(formik.values.other_allowance) +
													Number(formik.values.fuel_allowance)
												).toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<hr />
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Absent Fine:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.absent_fine.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Late Fine:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.late_fine.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Deduction:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{formik.values.deduction.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>

								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												<div className='row g-4'>
													<div
														className={`col-md-10 ${
															formik.values.advance_salary_adjust <= 0
																? 'text-muted'
																: ''
														}`}>
														Advance Salary:
													</div>
												</div>
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel
												className={`${
													formik.values.advance_salary_adjust <= 0
														? 'text-muted'
														: ''
												}`}>
												{formik.values.advance_salary.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel
												className={`${
													formik.values.advance_salary_adjust <= 0
														? 'text-muted'
														: ''
												}`}>
												<FormGroup id='advance_salary_adjust'>
													<Input
														type='number'
														min='0'
														disabled
														onWheel={(e) => e.target.blur()}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.advance_salary_adjust}
														isValid={formik.isValid}
														isTouched
														invalidFeedback={
															formik.errors.advance_salary_adjust
														}
													/>
												</FormGroup>
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												<div className='row g-4'>
													<div
														className={`col-md-10 ${
															formik.values.loan_adjust <= 0
																? 'text-muted'
																: ''
														}`}>
														Loan Borrowed:
													</div>
												</div>
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel
												className={`${
													formik.values.loan_adjust <= 0
														? 'text-muted'
														: ''
												}`}>
												{formik.values.loan.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel
												className={`${
													formik.values.loan_adjust <= 0
														? 'text-muted'
														: ''
												}`}>
												<FormGroup id='loan_adjust'>
													<Input
														type='number'
														min='0'
														disabled
														onWheel={(e) => e.target.blur()}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.loan_adjust}
														isValid={formik.isValid}
														isTouched
														invalidFeedback={formik.errors.loan_adjust}
													/>
												</FormGroup>
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												<div className='row g-4'>
													<div
														className={`col-md-10 ${
															formik.values.tax <= 0
																? 'text-muted'
																: ''
														}`}>
														Salary Tax:
													</div>
												</div>
											</CardLabel>
										</CardTitle>
									</CardLabel>

									<CardLabel>
										<CardTitle>
											<CardLabel
												className={`${
													formik.values.tax <= 0 ? 'text-muted' : ''
												}`}>
												<FormGroup id='tax'>
													<Input
														type='number'
														min='0'
														disabled
														onWheel={(e) => e.target.blur()}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.tax}
														isValid={formik.isValid}
														isTouched
														invalidFeedback={formik.errors.tax}
													/>
												</FormGroup>
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<hr />
								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Total (Less):</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{(
													Number(formik.values.absent_fine) +
													Number(formik.values.late_fine) +
													Number(formik.values.deduction) +
													Number(formik.values.loan_adjust) +
													Number(formik.values.advance_salary_adjust) +
													Number(formik.values.tax)
												).toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<hr />

								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Total Salary Amount (Credit):</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												PKR{' '}
												{formik.values.total_amount.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<hr />

								<div className='d-flex justify-content-between'>
									<CardLabel>
										<CardTitle>
											<CardLabel> Total Salary Payable:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												PKR{' '}
												{formik.values.total_payable.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<br />
								<div className='d-flex justify-content-center'>
									<CardLabel>
										<CardTitle>
											<CardLabel>In words:</CardLabel>
										</CardTitle>
									</CardLabel>
									<CardLabel>
										<CardTitle>
											<CardLabel>
												{toWords.convert(formik.values.total_payable)}
											</CardLabel>
										</CardTitle>
									</CardLabel>
								</div>
								<div className='d-flex justify-content-between'>
									{formik.errors.total_payable && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.total_payable}
										</p>
									)}
								</div>
								<hr />
								<hr />
								<br />
							</div>
						</div>{' '}
					</CardBody>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
							Reset to Default
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
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

export default AddCoeSubGroup;
