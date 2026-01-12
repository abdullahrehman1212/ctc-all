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
// ** apiClient Imports
import apiClient from '../../../../../baseURL/apiClient';
import Select from 'react-select';
import Spinner from '../../../../../components/bootstrap/Spinner';

import baseURL from '../../../../../baseURL/baseURL';
import Icon from '../../../../../components/icon/Icon';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
	CardHeader,

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../../components/bootstrap/Card';

import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';

import Button from '../../../../../components/bootstrap/Button';
import showNotification from '../../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.coa_group_id) {
		errors.coa_group_id = 'Required';
	}
	if (!values.coa_sub_group_id) {
		errors.coa_sub_group_id = 'Required';
	}

	if (!values.name) {
		errors.name = 'PLease provide name';
	}

	return errors;
};

const AddAccount = (props) => {
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const _titleSuccess = (
		<span className='d-flex align-items-center'>
			<Icon icon='Info' size='lg' className='me-1' />
			<span>Record Saved Successfully</span>
		</span>
	);
	const _titleError = (
		<span className='d-flex align-items-center'>
			<Icon icon='Info' size='lg' className='me-1' />
			<span>Error Saving Record </span>
		</span>
	);

	const submitForm = (data) => {
		const url = `${baseURL}/addCoaAccount`;

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
			.then((response) => response.json())
			.then((res) => {
				setIsLoading(false);

				if (res.status === 'ok') {
					props.setRefreshAccounts(props.refreshAccounts + 1);
					showNotification(_titleSuccess, res.message, 'success');
					setState(false);
					setLastSave(moment());
				} else {
					showNotification(_titleError, res.message, 'danger');
					console.log('Error');
				}
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

	const formikAddPurchaser = useFormik({
		initialValues: {
			name: '',
			code: '',
			description: '',
			coa_group_id: null,
			coa_sub_group_id: null,
		},
		validate,
		onSubmit: (values) => {
			// eslint-disable-next-line no-alert
			alert(JSON.stringify(values, null, 2));
		},
	});
	const [coeSubGroupOptions, setCoeSubGroupOptions] = useState([]);
	const [coaGroups, setCoaGroups] = useState([]);
	useEffect(() => {
		apiClient
			.get(`/getCoaGroups`)
			.then((response) => {
				const rec = response.data.coaGroup.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCoaGroups(rec);
				//   setLoading(false)
			})
			.catch((err) => console.log(err));
	}, []);
	useEffect(() => {
		if (formikAddPurchaser.values.coa_group_id !== null) {
			apiClient
				.get(`/coaSubGroupsByGroup?coa_group_id=${formikAddPurchaser.values.coa_group_id}`)
				.then((response) => {
					const rec = response.data.coaSubGroups.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setCoeSubGroupOptions(rec);
					//   setLoading(false)
				})
				.catch((err) => console.log(err));
		}
	}, [formikAddPurchaser.values.coa_group_id]);

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
				Add New Account
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
					<ModalTitle id='exampleModalLabel'>Add New Account</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formikAddPurchaser.handleSubmit}>
							<CardBody>
								<div className='row g-4'>
									<FormGroup
										id='coa_group_id'
										label='Main group '
										className='col-md-12'>
										<Select
											className='col-md-11'
											isClearable
											classNamePrefix='select'
											options={coaGroups}
											value={coaGroups.find(
												(c) =>
													c.value ===
													formikAddPurchaser.values.coa_group_id,
											)}
											// value={formikAddPurchaser.values.mouza_id}
											onChange={(val) => {
												formikAddPurchaser.setFieldValue(
													'coa_group_id',
													val.id,
												);
											}}
											isValid={formikAddPurchaser.isValid}
											isTouched={formikAddPurchaser.touched.coa_group_id}
											invalidFeedback={formikAddPurchaser.errors.coa_group_id}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='coa_sub_group_id'
										label='Sub group'
										className='col-md-12'>
										<Select
											className='col-md-11'
											classNamePrefix='select'
											options={coeSubGroupOptions}
											value={coeSubGroupOptions.find(
												(c) =>
													c.value ===
													formikAddPurchaser.values.coa_sub_group_id,
											)}
											// value={formikAddPurchaser.values.mouza_id}
											onChange={(val) => {
												formikAddPurchaser.setFieldValue(
													'coa_sub_group_id',
													val.id,
												);
											}}
										/>
									</FormGroup>

									<FormGroup
										id='name'
										label='Account Name  '
										className='col-md-12'>
										<Input
											onChange={formikAddPurchaser.handleChange}
											onBlur={formikAddPurchaser.handleBlur}
											value={formikAddPurchaser.values.name}
											isValid={formikAddPurchaser.isValid}
											isTouched={formikAddPurchaser.touched.name}
											invalidFeedback={formikAddPurchaser.errors.name}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									<FormGroup
										id='description'
										label='description  '
										className='col-md-12'>
										<Input
											onChange={formikAddPurchaser.handleChange}
											onBlur={formikAddPurchaser.handleBlur}
											value={formikAddPurchaser.values.description}
											isValid={formikAddPurchaser.isValid}
											isTouched={formikAddPurchaser.touched.description}
											invalidFeedback={formikAddPurchaser.errors.description}
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
										onClick={formikAddPurchaser.resetForm}>
										Reset
									</Button>
								</CardFooterLeft>
								<CardFooterRight>
									<Button
										icon={isLoading ? null : 'Save'}
										isLight
										color={lastSave ? 'info' : 'success'}
										isDisable={isLoading}
										onClick={() => {
											// eslint-disable-next-line no-plusplus
											if (formikAddPurchaser.isValid) {
												setIsLoading(true);
												submitForm(formikAddPurchaser.values);
											} else {
												showNotification(
													'Provide values',
													'Please Fill Form',
													'warning',
												);
											}
										}}>
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

export default AddAccount;
