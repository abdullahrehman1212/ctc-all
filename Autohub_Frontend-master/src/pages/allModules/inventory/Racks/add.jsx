// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/no-unused-prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
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
	if (!values.rack_number) {
		errors.rack_number = 'Required';
	}
	return errors;
};

const RacksAdd = ({ getRacks, storeId, show, setCounter, counter }) => {
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	const [storeOptions, setStoreOptions] = useState([]);
	const [storeOptionsLoading, setStoreOptionsLoading] = useState(false);

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
			rack_number: '',
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

	// useEffect(() => {
	// 	formik.setFieldValue('store_id', storeId)
	// }, [])

	useEffect(() => {
		// console.log(storeId);

		setStoreOptionsLoading(true);
		apiClient
			/* eslint-disable camelcase */
			.get(`/storeDropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
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

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addRack`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.setFieldValue('rack_number', '');
					// formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					getRacks(storeId);
					setIsLoading(false);
					setCounter(counter + 1);
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
					Add New Rack
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
						<ModalTitle id='exampleModalLabel'>Add Rack</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
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
														}}
														onBlur={formik.handleBlur}
														isValid={formik.isValid}
														isTouched={formik.touched.store_id}
														invalidFeedback={formik.errors.store_id}
														validFeedback='Looks good!'
														// onFocus={() => {
														// 	console.log(
														// 		'Store Options:',
														// 		storeOptions,
														// 	); // Log rackOptions
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
										<FormGroup id='rack' label='Rack' className='col-md-12'>
											<Input
												type='text'
												id='rack_number'
												name='rack_number'
												placeholder='Enter Rack Number'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.rack_number}
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
RacksAdd.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default RacksAdd;
