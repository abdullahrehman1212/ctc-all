// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Icon from '../../../../../../../components/icon/Icon';

import apiClient from '../../../../../../../baseURL/apiClient';
import Spinner from '../../../../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../../../../components/bootstrap/Modal';
import showNotification from '../../../../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../../../../notifyMessages/erroSuccess';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../../../../components/bootstrap/Card';

import FormGroup from '../../../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../../../components/bootstrap/forms/Input';

import Button from '../../../../../../../components/bootstrap/Button';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}
	return errors;
};

const Add = ({ refreshDropdownsInner, categoryOptions }) => {
	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

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
			category_id: '',
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
			.post(`/addSubCategories`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshDropdownsInner();
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

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Icon
					icon='ClipboardPlus'
					className='mb-0 text-info h3'
					onClick={() => {
						initialStatus(); // setStateRefresh(!staterefresh);
						setState(true);
						setStaticBackdropStatus(true);
					}}
				/>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='sm'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add SubCategory</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
										<FormGroup label='Categories' id='category_id'>
											<Select
												className='col-md-10'
												classNamePrefix='select'
												options={categoryOptions}
												isLoading={categoryOptionsLoading}
												isClearable
												value={
													formik.values.category_id
														? categoryOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.category_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'category_id',
														val !== null && val.id,
													);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.category_id}
												invalidFeedback={formik.errors.category_id}
												validFeedback='Looks good!'
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
												{formik.errors.category_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup id='name' label='Name' className='col-md-12'>
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
	refreshDropdownsInner: PropTypes.func.isRequired,
};

export default Add;
