// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import { useFormik } from 'formik';

import moment from 'moment';
import classNames from 'classnames';

// eslint-disable-next-line import/order
import { ToWords } from 'to-words';
// eslint-disable-next-line import/order
import showNotification from '../../../../components/extras/showNotification';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import Spinner from '../../../../components/bootstrap/Spinner';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Icon from '../../../../components/icon/Icon';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import { _titleSuccess } from '../../../../baseURL/messages';

import apiClient from '../../../../baseURL/apiClient';

import ViewPayroll from './viewPayroll';
import GeneratePDFPayroll from './print/payroll';
import GeneratePDFSalarySlip from './print/salarySlip';
import GeneratePDFBankRequest from './print/BankRequest';

require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const validate = (values) => {
	const errors = {};
	if (values.totalAmount < 0) {
		errors.total_amount = 'Total Amount must be greater than 0';
	}
	return errors;
};

const TablePage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingReset, setIsLoadingReset] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [tableRecords, setTableRecords] = useState(null);
	const [tableRecordsDefault, setTableRecordsDefault] = useState(null);
	const [tableRecordsLoading, setTableRecordsLoading] = useState(false);
	const [refreshTableRecords, setRefreshTableRecords] = useState(0);
	const [dateForPayroll, setDateForPayroll] = useState(moment().format('MM/YY'));
	const [dateForPayroll2, setDateForPayroll2] = useState(moment());

	const [employeeOptions, setEmployeeOptions] = useState([]);
	const [employeeOptionsSelected, setEmployeeOptionSelected] = useState([]);
	const [employeeOptionsLoading, setDepartmentsOptionsLoading] = useState(true);

	const refreshTableRecordsHandler = (arg) => {
		setRefreshTableRecords(arg);
	};

	const resetRecordsToDefault = () => {
		setIsLoadingReset(true);
		setTableRecords(tableRecordsDefault);
		setIsLoadingReset(false);
	};

	const getDataForPayrole = () => {
		setTableRecordsLoading(true);
		formik.setFieldValue('totalAmount', 0);

		const data = {
			date: dateForPayroll,
			employees: employeeOptionsSelected,
			is_selected: employeeOptionsSelected.length > 0 ? 1 : 0,
			final_settlement: 0,
		};

		apiClient
			.post(`/getDataForPayrole`, data, {})
			.then((response) => {
				setIsLoading(false);

				showNotification(_titleSuccess, 'Default Payroll Generated', 'success');
				setTableRecords(response.data.data);
				setTableRecordsDefault(response.data.data);
				setTableRecordsLoading(false);
			})
			.catch((err) => {
				showNotification(_titleError, err.message, 'danger');
				setTableRecordsLoading(false);
			});
	};

	const setTableRecordsHandle = (data) => {
		setTableRecords(data);
	};
	useEffect(() => {
		setDepartmentsOptionsLoading(true);

		apiClient
			.get(`/getEmployeesWithPendingPayroles?date=${dateForPayroll}`)
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
	}, [dateForPayroll]);

	useEffect(() => {
		let totalAmountCalculation = 0;
		let totalLoan = 0;
		let totalAdvanceSalary = 0;
		let totalTax = 0;
		let totalPayable = 0;
		const calc =
			tableRecords &&
			tableRecords.forEach((item) => {
				totalAmountCalculation += Number(item.total_amount);
				totalLoan += Number(item.loan_adjust);
				totalAdvanceSalary += Number(item.advance_salary_adjust);
				totalTax += Number(item.tax);
				totalPayable += Number(item.total_payable);
			});
		formik.setFieldValue('totalAmount', totalAmountCalculation);
		formik.setFieldValue('totalLoan', totalLoan);
		formik.setFieldValue('totalAdvanceSalary', totalAdvanceSalary);
		formik.setFieldValue('totalTax', totalTax);
		formik.setFieldValue('totalpayable', totalPayable);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableRecords]);

	// jhjhjhk

	const _titleError = (
		<span className='d-flex align-items-center'>
			<Icon icon='Info' size='lg' className='me-1' />
			<span>Error </span>
		</span>
	);

	const submitForm = (myFormik) => {
		const data1 = {
			data: tableRecords,
			date: dateForPayroll,
		};

		apiClient.post(`/generatePayRole`, data1, {}).then((res) => {
			setIsLoading(false);

			setTableRecords(null);
			showNotification(_titleSuccess, res.data.message, 'success');

			myFormik.resetForm();
			setLastSave(moment());
		});
	};

	const formik = useFormik({
		initialValues: {
			totalAmount: 0,
			totalLoan: 0,
			totalAdvanceSalary: 0,
			totalTax: 0,
			totalpayable: 0,
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
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

	const printPayroll = (date, docType) => {
		console.log('tableRecords', tableRecords);

		GeneratePDFPayroll(tableRecords, date, 'Unapproved', docType);
	};
	const printSalarySlip = (date, docType) => {
		GeneratePDFSalarySlip(tableRecords, date, 'Unapproved', docType);
	};
	const printBankRequest = (date, docType) => {
		GeneratePDFBankRequest(tableRecords, date, 'Unapproved', 'ABC', '27872827', docType);
	};
	return (
		<PageWrapper>
			<Page>
				<Card>
					<CardHeader>
						<CardLabel icon='Money' iconColor='info'>
							<CardTitle>Generate Payroll</CardTitle>
						</CardLabel>
						<CardActions>
							<ButtonGroup>
								<Dropdown>
									<DropdownToggle hasIcon={false}>
										<Button
											color='danger'
											isLight
											hoverShadow='default'
											icon='MoreVert'
										/>
									</DropdownToggle>
									<DropdownMenu isAlignmentEnd>
										<DropdownItem isHeader>Other Actions</DropdownItem>
										<DropdownItem>
											<Button
												isOutline
												color='primary'
												// isLight={darkModeStatus}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Preview'
												onClick={() => printPayroll(dateForPayroll2, 2)}>
												View PayRoll PDF
											</Button>
										</DropdownItem>
										{/* <DropdownItem>
											<Button
												isOutline
												color='primary'
												// isLight={darkModeStatus}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Preview'
												onClick={() => printSalarySlip(dateForPayroll2, 2)}>
												View Salary Slip PDF
											</Button>
										</DropdownItem>
										<DropdownItem>
											<Button
												isOutline
												color='primary'
												// isLight={darkModeStatus}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Preview'
												onClick={() =>
													printBankRequest(dateForPayroll2, 2)
												}>
												View Bank Request PDF
											</Button>
										</DropdownItem> */}
									</DropdownMenu>
								</Dropdown>
							</ButtonGroup>
						</CardActions>
					</CardHeader>
					<CardBody>
						<>
							<div className='row'>
								<FormGroup label='Month' className='col-md-2'>
									<Flatpickr
										className='form-control'
										value={dateForPayroll}
										// eslint-disable-next-line react/jsx-boolean-value

										options={{
											minDate: '2022-09-1',
											maxDate: 'today',
											plugins: [
												// eslint-disable-next-line new-cap
												new monthSelectPlugin({
													shorthand: true,
													dateFormat: 'm/y',
													allowInput: true,
												}),
											],
										}}
										onChange={(date, dateStr) => {
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
											setEmployeeOptionSelected('');
										}}
										onClose={(date, dateStr) => {
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
											setEmployeeOptionSelected('');
										}}
										id='default-picker'
									/>
								</FormGroup>
								<FormGroup
									label='Employees (Optional)'
									className='col-md-4'
									id='khasra'>
									<InputGroup>
										<Select
											className='col-md-12'
											isClearable
											isMulti
											classNamePrefix='select'
											options={employeeOptions}
											isLoading={employeeOptionsLoading}
											value={employeeOptionsSelected}
											onChange={(val) => {
												setEmployeeOptionSelected(val);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.khasra}
											invalidFeedback={formik.errors.khasra}
											validFeedback='Looks good!'
										/>
									</InputGroup>
								</FormGroup>
								<FormGroup className='col-md-4'>
									<br />
									<Button
										className='col-md-12'
										color='info'
										isOutline
										isActive
										icon={tableRecordsLoading ? null : 'Add'}
										isDisable={tableRecordsLoading}
										hoverShadow='default'
										onClick={() => {
											getDataForPayrole();
										}}>
										{tableRecordsLoading && <Spinner isSmall inButton />}
										{tableRecordsLoading
											? 'Generating Payroll'
											: 'Generate Payroll'}
									</Button>
								</FormGroup>
							</div>
							{tableRecords && (
								<div className='row'>
									<div className='col-12'>
										<Card shadow='none'>
											<ViewPayroll
												refreshTableRecordsHandler={
													refreshTableRecordsHandler
												}
												refreshTableRecords={refreshTableRecords}
												tableRecordsLoading={tableRecordsLoading}
												tableRecords={tableRecords}
												setTableRecordsHandle={setTableRecordsHandle}
												totalAmount={formik.values.totalAmount}
												totalLoan={formik.values.totalLoan}
												totalAdvanceSalary={
													formik.values.totalAdvanceSalary
												}
												totalTax={formik.values.totalTax}
												totalpayable={formik.values.totalpayable}
											/>
										</Card>
									</div>
								</div>
							)}
							{tableRecords && (
								<>
									<div className='row g-4 '>
										<div className='col-md-2' />
										<div className='col-md-10'>
											<div className='d-flex justify-content-between'>
												<CardLabel>
													<CardTitle>
														<CardLabel>Total Amount:</CardLabel>
													</CardTitle>
												</CardLabel>
												<CardLabel>
													<CardTitle>
														<CardLabel>
															PKR{' '}
															{formik.values.totalAmount.toLocaleString(
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
												{formik.errors.total_amount && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: 'red',
														}}>
														{formik.errors.total_amount}
													</p>
												)}
											</div>

											<br />
										</div>
									</div>
									<div className='row g-4 '>
										<div className='col-md-2' />
										<div className='col-md-10'>
											<div className='d-flex justify-content-between'>
												<CardLabel>
													<CardTitle>
														<CardLabel>The Sum of</CardLabel>
													</CardTitle>
												</CardLabel>
												<CardLabel>
													<CardTitle>
														<CardLabel>
															{toWords?.convert(
																formik?.values?.totalAmount,
															)}
														</CardLabel>
													</CardTitle>
												</CardLabel>
											</div>
											<div className='d-flex justify-content-between'>
												{formik.errors.total_amount && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: 'red',
														}}>
														{formik.errors.total_amount}
													</p>
												)}
											</div>

											<br />
										</div>
									</div>
								</>
							)}
						</>
					</CardBody>
					<CardFooter>
						<CardFooterLeft>
							{tableRecords && (
								<Button
									icon={isLoadingReset ? null : 'Undo'}
									isLight
									color={lastSave ? 'danger' : 'danger'}
									isDisable={isLoadingReset}
									onClick={() => resetRecordsToDefault()}>
									{isLoadingReset && <Spinner isSmall inButton />}
									{isLoadingReset
										? (lastSave && 'Resetting') || 'Resetting'
										: (lastSave && 'Reset to default') || 'Reset to default'}
								</Button>
							)}
						</CardFooterLeft>
						<CardFooterRight>
							{tableRecords && (
								<Button
									icon={isLoading ? null : 'DoneAll'}
									isLight
									color={lastSave ? 'info' : 'info'}
									isDisable={isLoading}
									onClick={formik.handleSubmit}>
									{isLoading && <Spinner isSmall inButton />}
									{isLoading
										? (lastSave && 'Saving') || 'Saving'
										: (lastSave && 'Approve and Generate Voucher') ||
										  'Approve and Generate Voucher'}
								</Button>
							)}
						</CardFooterRight>
					</CardFooter>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
