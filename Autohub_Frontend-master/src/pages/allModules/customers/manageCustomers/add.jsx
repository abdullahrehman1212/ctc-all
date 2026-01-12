// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports
// import Axios from 'axios';

// import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment';
// import { updateSingleState } from '../../redux/tableCrud/index';
// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';
// import Icon from '../../../../components/icon/Icon';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// import baseURL from '../../../../baseURL/baseURL';
import Card, {
	CardTitle,
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
import apiClient from '../../../../baseURL/apiClient';
import Button from '../../../../components/bootstrap/Button';
// import showNotification from '../../../../components/extras/showNotification';
// import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	
	// if (values.cnic.includes('_')) {
	// 	errors.cnic = 'CNIC must be 13 digits';
	// }
	// if (values.phone_no.includes('_')) {
	// 	errors.phone_no = 'phone number must be atleast 11 digits';
	// }
	// if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
	// 	errors.email = 'Invalid email address';
	// }


	return errors;
};

const AddSupplier = ({ refreshTableData }) => {
	// const dispatch = useDispatch();
	// const store = useSelector((state) => state.purchaseLand);
	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	// const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	// const _titleSuccess = (
	// 	<span className='d-flex align-items-center'>
	// 		<Icon icon='Info' size='lg' className='me-1' />
	// 		<span>Record Saved Successfully</span>
	// 	</span>
	// );
	// const _titleError = (
	// 	<span className='d-flex align-items-center'>
	// 		<Icon icon='Info' size='lg' className='me-1' />
	// 		<span>Error Saving Record </span>
	// 	</span>
	// );
	const formatChars = {
		q: '[0123456789]',
	};

	// eslint-disable-next-line no-unused-vars
	const submitForm = (myFormik) => {
		apiClient
			.post(`/addPerson`, myFormik.values)
			.then((res) => {
				// console.log('myformik', myFormik.values);
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			// eslint-disable-next-line no-unused-vars
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');

				setIsLoading(false);
			});
	};
	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			phone_no: '',
			cnic: '',
			email: '',
			address: '',
			// father_name: '',
			person_type_id: 1,
			date: '',
			opening_balance: '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		// eslint-disable-next-line no-console

		submitForm(formik);
		setLastSave(moment());
	};

	return (
		<div className='col-auto'>
			<div className='col-auto'>
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
					Add New
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='lg'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<ModalTitle id='exampleModalLabel'>Add Customer</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardHeader>
								<CardLabel icon='CheckBox' iconColor='info'>
									<CardTitle>Customer</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4'>
									<div className='col-md-12'>
										<FormGroup id='name' label=' Name' className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
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
									{/* <div className='col-md-6'>
										<FormGroup
											id='father_name'
											label='Company Name'
											className='col-lg-12'>
											<Input
												// disabled={formik.values.disableFields}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.father_name}
												isValid={formik.isValid}
												isTouched={formik.touched.father_name}
												invalidFeedback={formik.errors.father_name}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div> */}
								</div>

								<div className='row g-4'>
									<div className='col-md-6'>
										<FormGroup
											id='phone_no'
											label='Phone number'
											className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
												formatChars={formatChars}
												placeholder='03111111111'
												mask='03qqqqqqqqq'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.phone_no}
												isValid={formik.isValid}
												isTouched={formik.touched.phone_no}
												invalidFeedback={formik.errors.phone_no}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup id='email' label='Email' className='col-lg-12'>
											<Input
												// disabled={formik.values.disableFields}
												type='email'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.email}
												isValid={formik.isValid}
												isTouched={formik.touched.email}
												invalidFeedback={formik.errors.email}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								</div>
								<div className='row'>
									<div className='col-md-6'>
										<FormGroup id='cnic' label='CNIC' className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
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
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup
											id='address'
											label='Address'
											className='col-lg-12'>
											<Input
												// disabled={formik.values.disableFields}
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
								</div>
								<div className='row g-4'>
									<div className='col-md-6'>
										<FormGroup id='date' label='Date' className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
												type='date'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.date}
												isValid={formik.isValid}
												isTouched={formik.touched.date}
												invalidFeedback={formik.errors.date}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup
											id='opening_balance'
											label='Opening Balance'
											className='col-lg-12'>
											<Input
												// disabled={formik.values.disableFields}
												type='number'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.opening_balance}
												isValid={formik.isValid}
												isTouched={formik.touched.opening_balance}
												invalidFeedback={formik.errors.opening_balance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								</div>
							</CardBody>
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
		</div>
	);
};
AddSupplier.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};
export default AddSupplier;
