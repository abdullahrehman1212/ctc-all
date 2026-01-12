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
import Icon from '../../../../components/icon/Icon';
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

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.department_id) {
		errors.department_id = 'Required';
	}
	if (!values.phone_no) {
		errors.phone_no = 'Required';
	}
	if (!values.cnic) {
		errors.cnic = 'Required';
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
	console.log('errors:::', errors);
	console.log('values:::', values);
	return errors;
};

const AddCoeSubGroup = (props) => {
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

	// eslint-disable-next-line no-unused-vars
	const submitForm = (myFormik) => {
		apiClient
			.post(`/addCoaSubGroups`, myFormik.values, {})

			.then((res) => {
				setIsLoading(false);

				props.setRefreshSubgroupsView(props.refreshSubgroupsView + 1);
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
			other_allowances: '',
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
			.get(`/getDesignations`)
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
		apiClient
			.get(`/getEmployeeTypes`)
			.then((response) => {
				const rec = response.data.employee_types.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setEmployeeTypesOptions(rec);
				setEmployeeTypesOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				Generate Payroll
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
														formik.values.department_id !== null &&
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

										<FormGroup
											id='name'
											label='Employee Name  '
											className='col-md-6'>
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
														formik.values.designation_id !== null &&
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
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.phone_no}
												isValid={formik.isValid}
												isTouched={formik.touched.phone_no}
												invalidFeedback={formik.errors.phone_no}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup id='cnic' label='Cnic  ' className='col-md-6'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.cnic}
												isValid={formik.isValid}
												isTouched={formik.touched.cnic}
												invalidFeedback={formik.errors.cnic}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<FormGroup
											id='address'
											label='Address  '
											className='col-md-6'>
											<Input
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
											label='Basic salary  '
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
											className='col-md-6'>
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
											className='col-md-6'>
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
									</div>
									<br />
									<div className='row g-4'>
										<FormGroup
											id='overtime_percentage_per_hour'
											label='Overtime %/Hr  '
											className='col-md-6'>
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
											className='col-md-6'>
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
