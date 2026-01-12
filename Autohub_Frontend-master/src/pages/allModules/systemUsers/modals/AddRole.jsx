/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import moment from 'moment';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Spinner from '../../../../components/bootstrap/Spinner';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
} from '../../../../components/bootstrap/Card';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import apiClient from '../../../../baseURL/apiClient';

import Select from '../../../../components/bootstrap/forms/Select';

const validate = (values) => {
	const errors = {};
	console.log('The validated values is:', values);
	if (!values.name) {
		errors.name = 'PLease provide name';
	}

	if (!values.Email) {
		errors.Email = 'PLease provide Email Address';
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)) {
		errors.Email = 'Invalid email address';
	}

	if (!values.password) {
		errors.password = 'Password required';
	}
	if (!values.phoneNumber) {
		errors.phoneNumber = 'PhoneNumber required';
	}
	if (!values.city) {
		errors.city = 'City is required';
	}
	if (!values.address) {
		errors.address = 'Address is required';
	}
	return errors;
};

const AddRole = ({ refreshTableRecords, setCounter, counter }) => {
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const handleSave = () => {
		submitForm(formik.values);
	};
	console.log('The data is:', data3);
	const submitForm = (data) => {
		apiClient
			.post(
				`/salesman_register`,
				{
					name: data.name,
					email: data.Email,
					password: data.password,
					role_id: 3,
					city: data.city,
					address: data.address,
					phone: data.phoneNumber,
					company_name: data3?.user?.company_name,
					username: 'Saleman',
					admin_id: data3?.user?.id,
				},
				{},
			)
			.then((res) => {
				setIsLoading(false);
				if (res.data.status === 'ok') {
					setCounter(counter + 1);
					setState(false);
					formik.resetForm();
					refreshTableRecords();
				}
				setLastSave(moment());
			})
			.catch((err) => {
				setIsLoading(false);
				console.log(err);
			});
	};

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setSizeStatus(null);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			Email: '',
			password: '',
			city: '',
			address: '',
			phoneNumber: '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const [GetRoles, setGetRoles] = useState([]);
	useEffect(() => {
		apiClient
			.get(`/getRoles`)
			.then((response) => {
				console.log('getRoles::::::::', response.data);
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

	const [GetAdminID, setGetAdminID] = useState(1);

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
				Add Salesman
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
					<ModalTitle id='exampleModalLabel'>Add Salesman</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
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
										id='Email'
										label='Email'
										className='col-md-12'
										type='email'
										placeholder='Email'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.Email}
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.Email}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='phoneNumber'
										label='phoneNumber'
										className='col-md-12'
										type='email'
										placeholder='phoneNumber'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.phoneNumber}
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.phoneNumber}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='password'
										label='Password'
										className='col-md-12'
										placeholder='Password'>
										<Input
											type='password'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.password}
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.password}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='city'
										label='City'
										className='col-md-12'
										placeholder='City'>
										<Input
											type='text'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.city}
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.city}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='address'
										label='Address'
										className='col-md-12'
										placeholder='Address'>
										<Input
											type='text'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.address}
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.address}
											validFeedback='Looks good!'
										/>
									</FormGroup>
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

export default AddRole;
