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
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
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
	if (!values.existing_person) {
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
	}
	if (!values.department_id) {
		errors.department_id = 'Required';
	}

	if (!values.address) {
		errors.address = 'Required';
	}
	if (!values.designation_id) {
		errors.designation_id = 'Required';
	}
	if (!values.employee_type_id) {
		errors.employee_type_id = 'Required';
	}
	if (!values.joining_date) {
		errors.joining_date = 'Required';
	}
	if (!values.gender) {
		errors.gender = 'Required';
	}
	if (values.basic_salary < 1) {
		errors.basic_salary = 'Required';
	}
	if (values.working_days < 1) {
		errors.working_days = 'Required';
	}
	if (values.bank_name) {
		if (!values.bank_account_number) {
			errors.bank_account_number = 'Required';
		}
	}
	console.log('errors:::', errors);
	console.log('values:::', values);
	return errors;
};

const AddCoeSubGroup = (props) => {
	// const [existingPersonsOptions, setExistingPersonsOptions] = useState([]);
	// const [existingPersonsOptionsLoading, setExistingPersonsOptionsLoading] = useState(true);

	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const genderOptions = [
		{ id: 1, value: 1, label: 'Male' },
		{ id: 2, value: 2, label: 'Female' },
	];
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	const formatChars = {
		q: '[0123456789]',
	};
	// eslint-disable-next-line no-unused-vars
	const submitForm = (myFormik) => {
		apiClient
			.post(`/addEmployee`, myFormik.values, {})

			.then((res) => {
				setIsLoading(false);

				props.refreshTableRecords();

				showNotification(_titleSuccess, res.data.message, 'success');

				setState(false);
				myFormik.resetForm();
				setLastSave(moment());
			});
	};

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setSizeStatus('xl');
		setFullScreenStatus(null);
		setAnimationStatus(true);
		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			department_id: null,
			phone_no: '',
			cnic: '',
			address: '',
			designation_id: null,
			joining_date: moment().format('DD/MM/YY'),
			gender: 'Male',
			employee_type_id: null,
			basic_salary: '',
			medical_allowance: '',
			fuel_allowance: '',
			overtime_percentage_per_hour: '',
			late_fine_percentage_per_hour: '',
			working_days: '',
			other_allowance: '',
			father_name: '',
			bank_iban: '',
			bank_account_number: '',
			bank_name: '',
			bank_branch: '',

			absentee_percentage: '',
			existing_person_id: '',
			existing_person: '',
			disableFields: false,
		},
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
	const [departmentsOptions, setDepartmentsOptions] = useState([]);
	const [departmentsOptionsLoading, setDepartmentsOptionsLoading] = useState(true);
	const [designationsOptions, setDesignationsOptions] = useState([]);
	const [designationsOptionsLoading, setDesignationsOptionsLoading] = useState(true);
	const [employeeTypesOptions, setEmployeeTypesOptions] = useState([]);
	const [employeeTypesOptionsLoading, setEmployeeTypesOptionsLoading] = useState(true);

	useEffect(() => {
		setDepartmentsOptionsLoading(true);
		setDesignationsOptionsLoading(true);
		setEmployeeTypesOptionsLoading(true);

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

		apiClient
			.get(`/getEmployeeTypes`)
			.then((response) => {
				console.log('::::::', response.data.employeeType);
				const rec = response.data.employeeType.map(({ id, type }) => ({
					id,
					value: id,
					label: type,
				}));
				setEmployeeTypesOptions(rec);
				setEmployeeTypesOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setDesignationsOptionsLoading(true);

		apiClient
			.get(
				`/getDesignations?department_id=${
					formik.values.department_id !== null ? formik.values.department_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.designations.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDesignationsOptions(rec);
				setDesignationsOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, [formik.values.department_id]);

	// useEffect(() => {
	// 	setExistingPersonsOptionsLoading(true);

	// 	apiClient
	// 		.get(`/getRequiredPersons?person_type_id=5`)
	// 		.then((response) => {
	// 			const rec = response.data.persons.map(({ id, name, phone_no, address, cnic }) => ({
	// 				id,
	// 				value: id,
	// 				label: `${id}-${name}`,
	// 				data: {
	// 					name,
	// 					phone_no,
	// 					cnic,
	// 					address,
	// 				},
	// 			}));
	// 			setExistingPersonsOptions(rec);
	// 			setExistingPersonsOptionsLoading(false);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);
	useEffect(() => {
		console.log('...', formik.values.existing_person);
		if (formik.values.existing_person) {
			formik.setFieldValue('name', formik.values.existing_person.data.name);
			formik.setFieldValue('phone_no', formik.values.existing_person.data.phone_no);
			formik.setFieldValue('cnic', formik.values.existing_person.data.cnic);
			formik.setFieldValue('address', formik.values.existing_person.data.address);
			formik.setFieldValue('disableFields', true);
		} else {
			formik.setFieldValue('name', '');
			formik.setFieldValue('phone_no', '');
			formik.setFieldValue('cnic', '');
			formik.setFieldValue('address', '');
			formik.setFieldValue('disableFields', false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.existing_person_id]);
	return (
		<>
			<Button
				color='danger'
				isLight
				icon='Add'
				hoverShadow='default'
				onClick={() => {
					initialStatus();

					setState(true);
					setStaticBackdropStatus(true);
				}}>
				Add New Employee
			</Button>

			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size={sizeStatus}
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='PersonAdd'>
						<ModalTitle id='exampleModalLabel'>Add New Employee</ModalTitle>
					</CardLabel>
				</ModalHeader>

				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<div className='row g-4'>
								<CardBody className='col-md-6 border-end'>
									{/* <div className='row g-4'>
										<div className='col-md-12'>
											<FormGroup
												id='existing_person_id'
												label='Existing Person (Choose only if the person already exist in system)'
												className='col-md-12'>
												<Select
													className='col-md-12'
													isClearable
													classNamePrefix='select'
													options={existingPersonsOptions}
													isLoading={existingPersonsOptionsLoading}
													value={
														formik.values.existing_person_id &&
														existingPersonsOptions.find(
															(c) =>
																c.value ===
																formik.values.existing_person_id,
														)
													}
													// value={formik.values.mouza_id}
													onChange={(val) => {
														formik.setFieldValue(
															'existing_person_id',
															val ? val.id : '',
														);
														formik.setFieldValue(
															'existing_person',
															val,
														);
													}}
													isValid={formik.isValid}
													isTouched={formik.touched.existing_person_id}
													invalidFeedback={
														formik.errors.existing_person_id
													}
													validFeedback='Looks good!'
												/>
											</FormGroup>
											{formik.errors.existing_person_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
													}}>
													{formik.errors.existing_person_id}
												</p>
											)}
										</div>
									</div> */}
									<div className='row g-4'>
										<div className='col-md-6'>
											<FormGroup
												id='department_id'
												label='Department'
												className='col-md-12'>
												<Select
													className='col-md-12'
													// isClearable
													classNamePrefix='select'
													options={departmentsOptions}
													isLoading={departmentsOptionsLoading}
													value={
														formik.values.department_id &&
														departmentsOptions.find(
															(c) =>
																c.value ===
																formik.values.department_id,
														)
													}
													// value={formik.values.mouza_id}
													onChange={(val) => {
														formik.setFieldValue(
															'department_id',
															val.id,
														);
														formik.setFieldValue('designation_id', '');
													}}
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

										<div className='col-md-6'>
											<FormGroup
												id='designation_id'
												label='Designation'
												className='col-md-12'>
												<Select
													className='col-md-12'
													// isClearable
													classNamePrefix='select'
													options={designationsOptions}
													isLoading={designationsOptionsLoading}
													value={
														formik.values.designation_id &&
														designationsOptions.find(
															(c) =>
																c.value ===
																formik.values.designation_id,
														)
													}
													// value={formik.values.mouza_id}
													onChange={(val) => {
														formik.setFieldValue(
															'designation_id',
															val.id,
														);
													}}
													isValid={formik.isValid}
													isTouched={formik.touched.designation_id}
													invalidFeedback={formik.errors.designation_id}
													validFeedback='Looks good!'
												/>
											</FormGroup>
											{formik.errors.designation_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
													}}>
													{formik.errors.designation_id}
												</p>
											)}
										</div>
										<FormGroup
											id='name'
											label='Employee Name  '
											className='col-md-6'>
											<Input
												disabled={formik.values.disableFields}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.name}
												isValid={formik.isValid}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<div className='col-md-6'>
											<FormGroup
												id='employee_type_id'
												label='Service Type'
												className='col-md-12'>
												<Select
													className='col-md-12'
													// isClearable
													isLoading={employeeTypesOptionsLoading}
													classNamePrefix='select'
													options={employeeTypesOptions}
													value={
														formik.values.employee_type_id !== null &&
														employeeTypesOptions.find(
															(c) =>
																c.value ===
																formik.values.employee_type_id,
														)
													}
													// value={formik.values.mouza_id}
													onChange={(val) => {
														formik.setFieldValue(
															'employee_type_id',
															val.id,
														);
													}}
													isValid={formik.isValid}
													isTouched={formik.touched.employee_type_id}
													invalidFeedback={formik.errors.employee_type_id}
													validFeedback='Looks good!'
												/>
											</FormGroup>
											{formik.errors.employee_type_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
													}}>
													{formik.errors.employee_type_id}
												</p>
											)}
										</div>
									</div>
									<br />
									<div className='row g-4'>
										<div className='col-md-6'>
											<FormGroup id='gender' label='Gender'>
												<Select
													className='col-md-12'
													classNamePrefix='select'
													options={genderOptions}
													value={
														formik.values.gender !== null &&
														genderOptions.find(
															(c) => c.label === formik.values.gender,
														)
													}
													// value={formik.values.mouza_id}
													onChange={(val) => {
														formik.setFieldValue('gender', val.label);
													}}
													isValid={formik.isValid}
													isTouched={formik.touched.gender}
													invalidFeedback={formik.errors.gender}
													validFeedback='Looks good!'
												/>
											</FormGroup>
											{formik.errors.gender && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
													}}>
													{formik.errors.gender}
												</p>
											)}
										</div>
										<FormGroup
											id='phone_no'
											label='Contact  '
											className='col-md-6'>
											<Input
												disabled={formik.values.disableFields}
												formatChars={formatChars}
												placeholder='03111111111'
												mask='03qqqqqqqqq'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.phone_no}
												isValid={formik.isValid}
												isTouched={formik.touched.phone_no}
												invalidFeedback={formik.errors.phone_no}
												validFeedback='Looks good!'
												// mask='+XXxx   *1-9'
											/>
										</FormGroup>
										<FormGroup id='cnic' label='CNIC' className='col-md-6'>
											<Input
												disabled={formik.values.disableFields}
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
												// mask='*****-*******-*'
											/>
										</FormGroup>
										<FormGroup
											id='address'
											label='Address  '
											className='col-md-6'>
											<Input
												disabled={formik.values.disableFields}
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
									<br />
									<div className='row g-4'>
										<FormGroup
											id='father_name'
											label='Father Name  '
											className='col-md-6'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.father_name}
												isValid={formik.isValid}
												isTouched={formik.touched.father_name}
												invalidFeedback={formik.errors.father_name}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<br />
									<div className='row g-4'>
										<div className='col-md-6'>
											<FormGroup label='Date of Joining'>
												<Flatpickr
													className='form-control'
													value={formik.values.joining_date}
													// eslint-disable-next-line react/jsx-boolean-value

													options={{
														dateFormat: 'd/m/y',
														allowInput: true,
													}}
													onChange={(date, dateStr) => {
														formik.setFieldValue(
															'joining_date',
															dateStr,
														);
													}}
													onClose={(date, dateStr) => {
														formik.setFieldValue(
															'joining_date',
															dateStr,
														);
													}}
													id='default-picker'
												/>
											</FormGroup>
											{formik.errors.joining_date && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
													}}>
													{formik.errors.joining_date}
												</p>
											)}
										</div>
									</div>
								</CardBody>

								<CardBody className='col-md-6 border-start'>
									<div className='row g-4'>
										<FormGroup
											id='basic_salary'
											label='Basic Salary  '
											className='col-md-6'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.basic_salary}
												isValid={formik.isValid}
												isTouched={formik.touched.basic_salary}
												invalidFeedback={formik.errors.basic_salary}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='working_days'
											label='Working Days  '
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
									</div>
									<br />
									<div className='row g-4'>
										<FormGroup
											id='medical_allowance'
											label='Medical Allowance '
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.medical_allowance}
												isValid={formik.isValid}
												isTouched={formik.touched.medical_allowance}
												invalidFeedback={formik.errors.medical_allowance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='fuel_allowance'
											label='Fuel Allowance  '
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.fuel_allowance}
												isValid={formik.isValid}
												isTouched={formik.touched.fuel_allowance}
												invalidFeedback={formik.errors.fuel_allowance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='other_allowance'
											label='Other Allowance  '
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.other_allowance}
												isValid={formik.isValid}
												isTouched={formik.touched.other_allowance}
												invalidFeedback={formik.errors.other_allowance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<br />
									<div className='row g-4'>
										<FormGroup
											id='absentee_percentage'
											label='Absentee Deduction % '
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.absentee_percentage}
												isValid={formik.isValid}
												isTouched={formik.touched.absentee_percentage}
												invalidFeedback={formik.errors.absentee_percentage}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='overtime_percentage_per_hour'
											label='Overtime %/Hr  '
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.overtime_percentage_per_hour}
												isValid={formik.isValid}
												isTouched={
													formik.touched.overtime_percentage_per_hour
												}
												invalidFeedback={
													formik.errors.overtime_percentage_per_hour
												}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='late_fine_percentage_per_hour'
											label='Late fine %/Hr'
											className='col-md-4'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.late_fine_percentage_per_hour}
												isValid={formik.isValid}
												isTouched={
													formik.touched.late_fine_percentage_per_hour
												}
												invalidFeedback={
													formik.errors.late_fine_percentage_per_hour
												}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<br />
									<hr />
									<CardLabel icon='Bank'>
										<ModalTitle id='exampleModalLabel'>Bank Details</ModalTitle>
									</CardLabel>
									<br />
									<div className='row g-4'>
										<FormGroup
											id='bank_name'
											label='Bank Name'
											className='col-md-6'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.bank_name}
												isValid={formik.isValid}
												isTouched
												invalidFeedback={formik.errors.bank_name}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='bank_branch'
											label='Bank Branch'
											className='col-md-6'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.bank_branch}
												isValid={formik.isValid}
												isTouched
												invalidFeedback={formik.errors.bank_branch}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<br />
									<div className='row g-4'>
										<FormGroup
											id='bank_account_number'
											label='Account Number  '
											className='col-md-6'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.bank_account_number}
												isValid={formik.isValid}
												isTouched
												invalidFeedback={formik.errors.bank_account_number}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup id='bank_iban' label='IBAN' className='col-md-6'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.bank_iban}
												isValid={formik.isValid}
												isTouched={formik.touched.bank_iban}
												invalidFeedback={formik.errors.bank_iban}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								</CardBody>
							</div>
							<CardFooter>
								<CardFooterLeft>
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={formik.resetForm}>
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
				</ModalBody>
				<ModalFooter>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setState(false)}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default AddCoeSubGroup;
