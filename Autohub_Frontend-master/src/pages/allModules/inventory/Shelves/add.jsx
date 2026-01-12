// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import Select from 'react-select';
import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/apiClient';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// import showNotification from '../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	const errors = {};
	if (!values.shelf_number) {
		errors.shelf_number = 'Required';
	}
	if (!values.rack_id) {
		errors.rack_id = 'Required';
	}
	return errors;
};

const Add = ({ refreshTableData, storeId, show, counter1 }) => {
	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeOptionsLoading, setStoreOptionsLoading] = useState(false);
	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);
	// console.log('racks here:', rackOptions);
	// console.log('racks Options here:', rackOptionsLoading);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	const [counter, setCounter] = useState(0);

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
			shelf_number: '',
			rack_id: '',
			store_id: storeId,
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
	};
	const submitForm = (myFormik) => {
		apiClient
			.post(`/addShelves`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.setFieldValue('shelf_number', '');
					formik.setFieldValue('rack_id', '');
					// formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					setCounter(counter + 1);
					refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');

				setIsLoading(false);
			});
	};

	useEffect(() => {
		setStoreOptionsLoading(true);
		apiClient
			/* eslint-disable camelcase */
			.get(`/storeDropdown`)
			.then((response) => {
				const rec = response.data.store.map((store) => ({
					id: store.id,
					value: store.id,
					label: store.name,
				}));
				formik.setFieldValue('store_id', rec[0] ? rec[0].id : null);
				setStoreOptions(rec);
				setStoreOptionsLoading(false);
			})
			/* eslint-enable camelcase */
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	useEffect(() => {
		getRacks(storeId);
	}, [storeId, counter1]);

	function getRacks(storeId) {
		setRackOptionsLoading(true);
		apiClient
			.get(`/getRackDropDown`, { params: { store_id: storeId } })
			.then((response) => {
				const filteredRacks = response.data.racks.filter(
					(rack) => rack.store_id === storeId,
				);
				const rec = filteredRacks.map((rack) => ({
					id: rack.id,
					value: rack.id,
					label: rack.rack_number,
				}));
				setRackOptions(rec);
				setRackOptionsLoading(false);
			})
			.catch((error) => {
				// console.error('Error fetching rack data:', error);
				setRackOptions([]);
				setRackOptionsLoading(false);
			});
	}

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
					Add New Shelf
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
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Shelves</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									{!show && (
										<div className='col-md-12'>
											<FormGroup label='Stores' id='store_id'>
												<Select
													className='col-md-10'
													classNamePrefix='select'
													options={storeOptions}
													isLoading={storeOptionsLoading}
													isClearable
													value={
														formik.values.store_id
															? storeOptions?.find(
																	(c) =>
																		c.value ===
																		formik.values.store_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'store_id',
															val ? val.id : null,
														);
														getRacks(val.id);
													}}
													onBlur={formik.handleBlur}
													isValid={formik.isValid}
													isTouched={formik.touched.store_id}
													invalidFeedback={formik.errors.store_id}
													validFeedback='Looks good!'
													// onFocus={() => {
													// 	console.log('Store Options:', storeOptions); // Log rackOptions
													// }}
												/>
											</FormGroup>
											{formik.errors.store_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: 'red',
														textAlign: 'left',
														marginTop: 3,
													}}>
													{formik.errors.store_id}
												</p>
											)}
										</div>
									)}
									<div className='col-md-12'>
										<FormGroup label='Racks' id='rack_number'>
											<Select
												className='col-md-10'
												classNamePrefix='select'
												options={rackOptions}
												isLoading={rackOptionsLoading}
												isClearable
												value={
													formik.values.rack_id
														? rackOptions.find(
																(rack) =>
																	rack.value ===
																	formik.values.rack_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'rack_id',
														val ? val.value : null,
													);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.rack_id}
												invalidFeedback={formik.errors.rack_id}
												validFeedback='Looks good!'
												onFocus={() => {
													// console.log('Rack Options:', rackOptions);
												}}
											/>
										</FormGroup>
										{formik.errors.category_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
													textAlign: 'left',
													marginTop: 3,
												}}>
												{formik.errors.rack_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup id='shelf' label='Shelf' className='col-md-12'>
											<Input
												type='text'
												id='shelf_number'
												name='shelf_number'
												placeholder='Enter Shelf'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.shelf_number}
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
										color='success'
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading ? 'Saving' : 'Save'}
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
Add.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Add;
