// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import moment from 'moment';
import classNames from 'classnames';
import { useFormik } from 'formik';

// eslint-disable-next-line import/order
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import showNotification from '../../../../../components/extras/showNotification';
import Select2 from '../../../../../components/bootstrap/forms/Select';

import Page from '../../../../../layout/Page/Page';
import PageWrapper from '../../../../../layout/PageWrapper/PageWrapper';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../../components/bootstrap/Modal';
import Button from '../../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../../components/bootstrap/Card';
import Spinner from '../../../../../components/bootstrap/Spinner';
import Input from '../../../../../components/bootstrap/forms/Input';

import apiClient from '../../../../../baseURL/apiClient';
import ViewEmployees from './viewEmployees';
import GeneratePDFBankRequest from '../print2/BankRequest';
import GeneratePDFCashPayroll from '../print2/cashPayrolls';

const validate = (values) => {
	const errors = {};

	if (!values.coa_account_id) {
		errors.coa_account_id = 'Required';
	}
	if (!values.date) {
		errors.date = 'Required';
	}
	if (values.cheque_no) {
		if (!values.cheque_date) errors.cheque_date = 'Required';
	}
	console.log('errors', errors);
	return errors;
};
export const searchByOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Contact' },
	// { value: 3, text: 'CNIC' },
	// { value: 4, text: 'ID' },
];

const TablePage = () => {
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const [searchNo, setSearchNo] = useState('');
	const [searchBy, setSearchBy] = useState('1');
	const [isLoading, setIsLoading] = useState(false);
	const [isLoading2, setIsLoading2] = useState(false);
	const [lastSave] = useState(null);
	const [dateForPayroll, setDateForPayroll] = useState(moment().format('MM/YY'));
	const [dateForPayroll2, setDateForPayroll2] = useState(moment());

	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	const [departmentsOptions, setDepartmentsOptions] = useState([]);
	const [departmentsOptionsLoading, setDepartmentsOptionsLoading] = useState(true);
	const [departmentSelected, setDepartmentSelected] = useState(null);

	useEffect(() => {
		setDepartmentsOptionsLoading(true);

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				const rec = response.data.departments.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDepartmentsOptions(rec);
				setDepartmentsOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);
	useEffect(() => {
		refreshTableRecords();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [departmentSelected, dateForPayroll]);

	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getPayRoles?month=${dateForPayroll}&department_id=${
					departmentSelected !== null ? departmentSelected.id : ''
				}&${searchBy === '1' ? `voucher_no=${searchNo}` : ''}${
					searchBy === '2' ? `phone_no=${searchNo}` : ''
				}${searchBy === '3' ? `cnic=${searchNo}` : ''}
			${searchBy === '4' ? `id=${searchNo}` : ''}`,
			)
			.then((response) => {
				let result = response.data.salarySlips;
				if (searchBy === '1' && searchNo) {
					result = response.data.salarySlips.filter(
						(item) =>
							item.voucher_transaction.voucher.voucher_no.toUpperCase() ===
							searchNo.toUpperCase(),
					);
				}
				setTableRecords(result);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	};

	const printBankRequest = (date, accountNo, chequeNo, docType) => {
		setIsLoading2(true);

		GeneratePDFBankRequest(tableRecords, date, 'Approved', accountNo, chequeNo, docType);
		setIsLoading2(false);
	};
	const printCashPayrollPdf = (date, accountNo, chequeNo, docType) => {
		setIsLoading2(true);

		GeneratePDFCashPayroll(tableRecords, date, 'Approved', accountNo, chequeNo, docType);
		setIsLoading2(false);
	};
	// postdated

	const updatePayEmpWithBankAccountsVoucher = (myFormik) => {
		setIsLoading(true);

		apiClient
			.post(
				`/payEmployeesHavingBankAccounts?payment_mode=${
					statePayEmpWithBankAccounts === true ? 'Account Transfer' : 'Cash Payment'
				}&coa_account_id=${myFormik.values.coa_account_id}&month=${
					myFormik.values.month
				}&date=${myFormik.values.date}&cheque_no=${formik.values.cheque_no}&cheque_date=${
					formik.values.cheque_date
				}`,
			)
			.then((response) => {
				setIsLoading(false);

				showNotification('Voucher Status Updated', response.data.message, 'success');
				refreshTableRecords();

				setStatePayEmpWithBankAccounts(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);

				setStatePayEmpWithBankAccounts(false);

				showNotification('Error', err.message, 'danger');
			});
	};
	const formik = useFormik({
		initialValues: {
			month: moment().format('MM/YY'),
			month2: moment(),
			coa_account_id: '',
			cheque_date: moment().format('DD/MM/YY'),
			cheque_no: '',
			coa_sub_group_id: '',
			accountNo: '0238098100056501',
			date: moment().format('DD/MM/YY'),
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		updatePayEmpWithBankAccountsVoucher(formik);
	};
	// eslint-disable-next-line no-unused-vars

	const [statePayEmpWithBankAccounts, setStatePayEmpWithBankAccounts] = useState(false);

	const [
		staticBackdropStatusPayEmpWithBankAccounts,
		setStaticBackdropStatusPayEmpWithBankAccounts,
	] = useState(true);
	const [scrollableStatusPayEmpWithBankAccounts, setScrollableStatusPayEmpWithBankAccounts] =
		useState(false);
	const [centeredStatusPayEmpWithBankAccounts, setCenteredStatusPayEmpWithBankAccounts] =
		useState(false);
	const [sizeStatusPayEmpWithBankAccounts, setSizeStatusPayEmpWithBankAccounts] = useState(null);
	const [fullScreenStatusPayEmpWithBankAccounts, setFullScreenStatusPayEmpWithBankAccounts] =
		useState(null);
	const [animationStatusPayEmpWithBankAccounts, setAnimationStatusPayEmpWithBankAccounts] =
		useState(true);

	const [headerCloseStatusPayEmpWithBankAccounts, setHeaderCloseStatusPayEmpWithBankAccounts] =
		useState(true);

	const initialStatusPayEmpWithBankAccounts = () => {
		setStaticBackdropStatusPayEmpWithBankAccounts(true);
		setScrollableStatusPayEmpWithBankAccounts(false);
		setCenteredStatusPayEmpWithBankAccounts(false);
		setSizeStatusPayEmpWithBankAccounts('md');
		setFullScreenStatusPayEmpWithBankAccounts(false);
		setAnimationStatusPayEmpWithBankAccounts(true);
		setHeaderCloseStatusPayEmpWithBankAccounts(true);
	};

	useEffect(() => {
		setCrAccountLoading(true);

		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
						coa_sub_group_id,
					}),
				);
				setCashAccountsOptions(rec);
				setCrAccountLoading(false);
			})
			.catch((err) => console.log(err));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [stateCashPayroll, setStateCashPayroll] = useState(false);

	const [staticBackdropStatusCashPayroll, setStaticBackdropStatusCashPayroll] = useState(true);
	const [scrollableStatusCashPayroll, setScrollableStatusCashPayroll] = useState(false);
	const [centeredStatusCashPayroll, setCenteredStatusCashPayroll] = useState(false);
	const [sizeStatusCashPayroll, setSizeStatusCashPayroll] = useState(null);
	const [fullScreenStatusCashPayroll, setFullScreenStatusCashPayroll] = useState(null);
	const [animationStatusCashPayroll, setAnimationStatusCashPayroll] = useState(true);

	const [headerCloseStatusCashPayroll, setHeaderCloseStatusCashPayroll] = useState(true);

	const initialStatusCashPayroll = () => {
		setStaticBackdropStatusCashPayroll(true);
		setScrollableStatusCashPayroll(false);
		setCenteredStatusCashPayroll(false);
		setSizeStatusCashPayroll('md');
		setFullScreenStatusCashPayroll(false);
		setAnimationStatusCashPayroll(true);
		setHeaderCloseStatusCashPayroll(true);
	};
	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='List' iconColor='danger'>
							<CardTitle>Payrolls</CardTitle>
						</CardLabel>
						<CardActions>
							<Button
								isOutline
								color='danger'
								// isLight={darkModeStatus}
								className={classNames('text-nowrap', {
									'border-light': true,
								})}
								icon='Preview'
								onClick={() => {
									setStatePayEmpWithBankAccounts(true);
									initialStatusPayEmpWithBankAccounts();
									// printBankRequest(dateForPayroll2, 2);
								}}>
								Pay Employees (Bank Transfer)
							</Button>
							<Button
								isOutline
								color='success'
								// isLight={darkModeStatus}
								className={classNames('text-nowrap', {
									'border-light': true,
								})}
								icon='Preview'
								onClick={() => {
									setStateCashPayroll(true);
									initialStatusCashPayroll();
									// printBankRequest(dateForPayroll2, 2);
								}}>
								Pay Employees (Cash Payment)
							</Button>
						</CardActions>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4'>
								<FormGroup label='Month' className='col-md-3'>
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
											formik.setFieldValue('month', dateStr);
											formik.setFieldValue('month2', date[0]);
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
										}}
										onClose={(date, dateStr) => {
											formik.setFieldValue('month', dateStr);
											formik.setFieldValue('month2', date[0]);
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
										}}
										id='default-picker'
									/>
								</FormGroup>
								<FormGroup label='Department' className='col-md-3' id='mainGroup'>
									<Select
										className='col-md-12'
										isClearable
										classNamePrefix='select'
										options={departmentsOptions}
										isLoading={departmentsOptionsLoading}
										value={departmentSelected}
										onChange={(val) => {
											console.log(':::', val);
											setDepartmentSelected(val);
										}}
									/>
								</FormGroup>
								<div className='col-md-2 pt-4'>
									<Select2
										ariaLabel='Default select example'
										placeholder='Open this select menu'
										onChange={(e) => {
											setSearchBy(e.target.value);
										}}
										value={searchBy}
										list={searchByOptions}
									/>
								</div>
								<div className='col-md-2 pt-4'>
									<Input
										id='searchFileNo'
										type='text'
										onChange={(e) => {
											setSearchNo(e.target.value);
										}}
										value={searchNo}
										validFeedback='Looks good!'
									/>
								</div>
								<div className='col-md-2 pt-4'>
									<Button
										color='primary'
										onClick={() => refreshTableRecords()}
										isOutline
										// isDisable={landsViewLoading}
										isActive>
										Search
									</Button>
								</div>
							</div>

							<div className='row'>
								<div className='col-12'>
									<Card>
										{/* <CardHeader>
																<CardLabel icon='Assignment'>
																	<CardTitle>
																		Accounts Subgroups
																	</CardTitle>
																</CardLabel>
															</CardHeader> */}

										<ViewEmployees
											refreshTableRecords={refreshTableRecords}
											tableRecordsLoading={tableRecordsLoading}
											tableRecords={tableRecords}
											dateForPayroll2={dateForPayroll2}
										/>
									</Card>
								</div>
							</div>
						</>
					</CardBody>
					<CardFooter className='px-0 pb-0'>
						<CardFooterLeft />
						<CardFooterRight />
					</CardFooter>
				</Card>
				<Modal
					isOpen={statePayEmpWithBankAccounts}
					setIsOpen={setStatePayEmpWithBankAccounts}
					titleId='PayEmpWithBankAccountsVoucher'
					isStaticBackdrop={staticBackdropStatusPayEmpWithBankAccounts}
					isScrollable={scrollableStatusPayEmpWithBankAccounts}
					isCentered={centeredStatusPayEmpWithBankAccounts}
					size={sizeStatusPayEmpWithBankAccounts}
					fullScreen={fullScreenStatusPayEmpWithBankAccounts}
					isAnimation={animationStatusPayEmpWithBankAccounts}>
					<ModalHeader
						setIsOpen={
							headerCloseStatusPayEmpWithBankAccounts
								? setStatePayEmpWithBankAccounts
								: null
						}>
						<ModalTitle id='editVoucher'>
							{' '}
							<CardHeader>
								<CardLabel icon='Bank' iconColor='success'>
									<CardTitle>
										Pay all Employees: Payment Mode: Bank Transfer{' '}
									</CardTitle>
								</CardLabel>
							</CardHeader>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className='row g-4'>
							<div className='col-12'>
								<Card>
									<CardBody>
										{/* <h5>Cheque no: {editingVoucherData.cheque_no}</h5> */}
										<br />
										{/* <h5>Cheque Date: {editingVoucherData.cheque_date}</h5> */}
										<div className='row g-4'>
											<FormGroup label='Month' className='col-md-6'>
												<Flatpickr
													className='form-control'
													value={formik.values.month}
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
														formik.setFieldValue('month', dateStr);
														formik.setFieldValue('month2', date[0]);
														setDateForPayroll(dateStr);
													}}
													onClose={(date, dateStr) => {
														formik.setFieldValue('month', dateStr);
														formik.setFieldValue('month2', date[0]);
														setDateForPayroll(dateStr);
													}}
													id='default-picker'
												/>
											</FormGroup>
											<FormGroup
												id='status_date'
												label='Voucher Date'
												className='col-md-6'>
												<Flatpickr
													className='form-control'
													value={formik.values.date}
													options={{
														dateFormat: 'd/m/y',
														allowInput: true,
														defaultDate: new Date(),
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
											<div>
												<div className='col-md-12'>
													<FormGroup
														id='coa_account_id'
														label='Cr Account'>
														<Select
															className='col-md-12 '
															classNamePrefix='select'
															options={cashAccountsOptions}
															isLoading={crAccountLoading}
															value={
																formik.values.coa_account_id !==
																	null &&
																cashAccountsOptions.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.coa_account_id,
																)
															}
															onChange={(val) => {
																formik.setFieldValue(
																	'coa_account_id',
																	val.id,
																);
																formik.setFieldValue(
																	'coa_sub_group_id',
																	val.coa_sub_group_id,
																);
															}}
															onBlur={formik.handleBlur}
															isValid={formik.isValid}
															isTouched={
																formik.touched.coa_account_id
															}
															invalidFeedback={
																formik.errors.coa_account_id
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
													{formik.errors.coa_account_id && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: 'red',
															}}>
															{formik.errors.coa_account_id}
														</p>
													)}
												</div>
											</div>

											{formik.values.coa_sub_group_id === 2 && (
												<>
													<div className='col-md-6'>
														<br />
														<FormGroup
															id='cheque_no'
															label='Cheque No'
															isFloating>
															<Input
																type='text'
																placeholder=''
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.cheque_no}
																isValid={formik.isValid}
																isTouched={formik.touched.cheque_no}
																invalidFeedback={
																	formik.errors.cheque_no
																}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<br />
														<FormGroup
															id='cheque_date'
															label='Cheque Date'
															isFloating>
															<Flatpickr
																className='form-control'
																value={formik.values.cheque_date}
																disabled={
																	!formik.values.cheque_no && true
																}
																options={{
																	dateFormat: 'd/m/y',
																	allowInput: true,
																	defaultDate: new Date(),
																}}
																onChange={(date, dateStr) => {
																	formik.setFieldValue(
																		'cheque_date',
																		dateStr,
																	);
																}}
																onClose={(date, dateStr) => {
																	formik.setFieldValue(
																		'cheque_date',
																		dateStr,
																	);
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
												</>
											)}
											<div className='col-md-6'>
												<FormGroup
													id='accountNo'
													label='Account No'
													isFloating>
													<Input
														type='text'
														placeholder=''
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.accountNo}
														isValid={formik.isValid}
														isTouched={formik.touched.accountNo}
														invalidFeedback={formik.errors.accountNo}
														validFeedback='Looks good!'
													/>
												</FormGroup>
											</div>
										</div>
										<div>
											<br />
											<Button
												className='me-3'
												icon={isLoading ? null : 'DoneAll'}
												color={lastSave ? 'success' : 'success'}
												isDisable={isLoading}
												onClick={formik.handleSubmit}>
												{isLoading && <Spinner isSmall inButton />}
												{isLoading
													? (lastSave && 'Generate Voucher') ||
													  'Generating Voucher'
													: (lastSave && 'Generate Voucher') ||
													  'Generate Voucher'}
											</Button>
											<Button
												className='me-3'
												icon={
													isLoading2 || tableRecordsLoading
														? null
														: 'Update'
												}
												color={lastSave ? 'primary' : 'primary'}
												isDisable={isLoading2 || tableRecordsLoading}
												onClick={() => {
													printBankRequest(
														formik.values.month2,
														formik.values.accountNo,
														formik.values.cheque_no,
														2,
													);
												}}>
												{isLoading2 ||
													(tableRecordsLoading && (
														<Spinner isSmall inButton />
													))}
												{isLoading2
													? (lastSave && 'View Bank Request PDF') ||
													  'Generating PDF'
													: (lastSave && 'View Bank Request PDF') ||
													  'View Bank Request PDF'}
											</Button>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterLeft>
											<Button
												color='info'
												icon='cancel'
												isOutline
												className='border-0'
												onClick={() =>
													setStatePayEmpWithBankAccounts(false)
												}>
												Cancel
											</Button>
										</CardFooterLeft>
									</CardFooter>
								</Card>
							</div>
						</div>
					</ModalBody>
					<ModalFooter />
				</Modal>
				<Modal
					isOpen={stateCashPayroll}
					setIsOpen={setStateCashPayroll}
					titleId='CashPayrollVoucher'
					isStaticBackdrop={staticBackdropStatusCashPayroll}
					isScrollable={scrollableStatusCashPayroll}
					isCentered={centeredStatusCashPayroll}
					size={sizeStatusCashPayroll}
					fullScreen={fullScreenStatusCashPayroll}
					isAnimation={animationStatusCashPayroll}>
					<ModalHeader
						setIsOpen={headerCloseStatusCashPayroll ? setStateCashPayroll : null}>
						<ModalTitle id='editVoucher'>
							{' '}
							<CardHeader>
								<CardLabel icon='Cash' iconColor='success'>
									<CardTitle>Pay all Employees: Payment Mode: Cash </CardTitle>
								</CardLabel>
							</CardHeader>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className='row g-4'>
							<div className='col-12'>
								<Card>
									<CardBody>
										{/* <h5>Cheque no: {editingVoucherData.cheque_no}</h5> */}
										<br />
										{/* <h5>Cheque Date: {editingVoucherData.cheque_date}</h5> */}
										<div className='row g-4'>
											<FormGroup label='Month' className='col-md-6'>
												<Flatpickr
													className='form-control'
													value={formik.values.month}
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
														formik.setFieldValue('month', dateStr);
														formik.setFieldValue('month2', date[0]);
														setDateForPayroll(dateStr);
													}}
													onClose={(date, dateStr) => {
														formik.setFieldValue('month', dateStr);
														formik.setFieldValue('month2', date[0]);
														setDateForPayroll(dateStr);
													}}
													id='default-picker'
												/>
											</FormGroup>
											<FormGroup
												id='status_date'
												label='Voucher Date'
												className='col-md-6'>
												<Flatpickr
													className='form-control'
													value={formik.values.date}
													options={{
														dateFormat: 'd/m/y',
														allowInput: true,
														defaultDate: new Date(),
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
											<div>
												<div className='col-md-12'>
													<FormGroup
														id='coa_account_id'
														label='Cr Account'>
														<Select
															className='col-md-12 '
															classNamePrefix='select'
															options={cashAccountsOptions}
															isLoading={crAccountLoading}
															value={
																formik.values.coa_account_id !==
																	null &&
																cashAccountsOptions.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.coa_account_id,
																)
															}
															onChange={(val) => {
																formik.setFieldValue(
																	'coa_account_id',
																	val.id,
																);
																formik.setFieldValue(
																	'coa_sub_group_id',
																	val.coa_sub_group_id,
																);
															}}
															onBlur={formik.handleBlur}
															isValid={formik.isValid}
															isTouched={
																formik.touched.coa_account_id
															}
															invalidFeedback={
																formik.errors.coa_account_id
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
													{formik.errors.coa_account_id && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: 'red',
															}}>
															{formik.errors.coa_account_id}
														</p>
													)}
												</div>
											</div>

											{formik.values.coa_sub_group_id === 2 && (
												<>
													<div className='col-md-6'>
														<br />
														<FormGroup
															id='cheque_no'
															label='Cheque No'
															isFloating>
															<Input
																type='text'
																placeholder=''
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={formik.values.cheque_no}
																isValid={formik.isValid}
																isTouched={formik.touched.cheque_no}
																invalidFeedback={
																	formik.errors.cheque_no
																}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</div>
													<div className='col-md-6'>
														<br />
														<FormGroup
															id='cheque_date'
															label='Cheque Date'
															isFloating>
															<Flatpickr
																className='form-control'
																value={formik.values.cheque_date}
																disabled={
																	!formik.values.cheque_no && true
																}
																options={{
																	dateFormat: 'd/m/y',
																	allowInput: true,
																	defaultDate: new Date(),
																}}
																onChange={(date, dateStr) => {
																	formik.setFieldValue(
																		'cheque_date',
																		dateStr,
																	);
																}}
																onClose={(date, dateStr) => {
																	formik.setFieldValue(
																		'cheque_date',
																		dateStr,
																	);
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
												</>
											)}
										</div>
										<div>
											<br />
											<Button
												className='me-3'
												icon={isLoading ? null : 'DoneAll'}
												color={lastSave ? 'success' : 'success'}
												isDisable={isLoading}
												onClick={formik.handleSubmit}>
												{isLoading && <Spinner isSmall inButton />}
												{isLoading
													? (lastSave && 'Generate Voucher') ||
													  'Generating Voucher'
													: (lastSave && 'Generate Voucher') ||
													  'Generate Voucher'}
											</Button>
											<Button
												className='me-3'
												icon={
													isLoading2 || tableRecordsLoading
														? null
														: 'Update'
												}
												color={lastSave ? 'primary' : 'primary'}
												isDisable={isLoading2 || tableRecordsLoading}
												onClick={() => {
													printCashPayrollPdf(
														formik.values.month2,
														formik.values.accountNo,
														formik.values.cheque_no,
														2,
													);
												}}>
												{isLoading2 ||
													(tableRecordsLoading && (
														<Spinner isSmall inButton />
													))}
												{isLoading2
													? (lastSave && 'View PDF') || 'Generating PDF'
													: (lastSave && 'View PDF') || 'View PDF'}
											</Button>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterLeft>
											<Button
												color='info'
												icon='cancel'
												isOutline
												className='border-0'
												onClick={() => setStateCashPayroll(false)}>
												Cancel
											</Button>
										</CardFooterLeft>
									</CardFooter>
								</Card>
							</div>
						</div>
					</ModalBody>
					<ModalFooter />
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
