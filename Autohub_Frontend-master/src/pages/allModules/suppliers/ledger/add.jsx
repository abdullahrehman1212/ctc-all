import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import Select from 'react-select';
// eslint-disable-next-line import/no-unresolved
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { useNavigate, demoPages, Cookies } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
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
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
// import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

import Button from '../../../../components/bootstrap/Button';

// import showNotification from '../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};
	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	if (!values.debit) {
		errors.debit = 'Required';
	}
	return errors;
};

const Add = ({ refreshTableData }) => {
	const navigate = useNavigate();

	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [supplierOptions, setSupplierOptions] = useState();
	const [supplierOptionsLoading, setSupplierOptionsLoading] = useState(false);
	const [billLoading, setBillLoading] = useState(false);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const submitForm = (data) => {
		apiClient
			.get('/sanctum/csrf-cookie')
			.then(() => {
				apiClient
					.post(`/payToSupplier`, data)
					.then((response2) => {
						if (response2.data.status === 'ok') {
							formik.resetForm();
							// showNotification(_titleSuccess, response2.data.message, 'success');
							setState(false);
							refreshTableData();
							setIsLoading(false);
							setLastSave(moment());
						} else {
							setIsLoading(false);
							// showNotification(_titleError, response2.message, 'Danger');
						}
					})
					.catch((err) => {
						setIsLoading(false);
						// showNotification(_titleError, err.message, 'Danger');
						if (err.response.status === 401) {
							// showNotification(_titleError, err.response.data.message, 'Danger');
							// Cookies.remove('userToken');
							// navigate(`/${demoPages.login.path}`, { replace: true });
						}
						setIsLoading(false);
					});
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				setIsLoading(false);
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
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
			supplier_id: '',
			previous_balance: '',
			debit: '',
			remaining: '',
			billList: [],
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		// eslint-disable-next-line no-console

		submitForm(formik.values);
		setLastSave(moment());
	};

	useEffect(() => {
		apiClient
			.get(`/getPersons?person_type_id=2`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setSupplierOptions(rec);
				setSupplierOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPreviousBalance = (supplierId) => {
		apiClient
			.get(`/getSupplierBalance?supplier_id=${supplierId}`)
			.then((response) => {
				// eslint-disable-next-line no-console
				console.log('ddd', response.data);
				formik.setFieldValue('billList', response.data.supplierPOs);
				formik.setFieldValue('previous_balance', response.data.supplierbalance.balance);
				setBillLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
					// eslint-disable-next-line no-console
					console.log(err.data);

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
	};

	useEffect(() => {
		getPreviousBalance(formik.values.supplier_id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.supplier_id]);

	useEffect(() => {
		let t = 0;
		// eslint-disable-next-line no-unused-vars
		formik.values.billList?.forEach((data, index) => {
			if (formik.values.billList[index].check_box === true) {
				t += data.total_after_discount;
				formik.setFieldValue('debit', t);
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.billList]);

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='primary'
					isLight
					icon='Payment'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Pay To Supplier
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
					<ModalTitle id='exampleModalLabel'>Pay To Supplier</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-6'>
										<FormGroup label='Supplier' id='branch_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												isLoading={supplierOptionsLoading}
												options={supplierOptions}
												isClearable
												value={
													formik.values.supplier_id
														? supplierOptions.find(
																(c) =>
																	c.value ===
																	formik.values.supplier_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'supplier_id',
														val !== null && val.id,
													);
													setBillLoading(true);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup
											id='previous_balance'
											label='Previous Balance'
											className='col-md-12'>
											<Input
												readOnly
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.previous_balance}
												isValid={formik.isValid}
												isTouched={formik.touched.previous_balance}
												invalidFeedback={formik.errors.previous_balance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
								</div>
								<div className='row g-2 mt-2'>
									<div className='pt-3 h4'>Bill List</div>
									<table className='table table-modern'>
										<thead>
											<tr>
												<th>Sr. No.</th>
												<th>PO No</th>
												<th>Bill</th>
												<th>Pay</th>
											</tr>
										</thead>
										{billLoading ? (
											<tbody>
												<tr>
													<td colSpan='12'>
														<div className='d-flex justify-content-center'>
															<Spinner color='primary' size='3rem' />
														</div>
													</td>
												</tr>
											</tbody>
										) : (
											<tbody>
												{formik.values.billList &&
													formik.values.billList?.map((item, index) => (
														// eslint-disable-next-line react/no-array-index-key
														<tr key={index}>
															<td>{index + 1}</td>
															<td>{item.po_no}</td>
															<td>{item.total_after_discount}</td>
															<td>
																<Input
																	id={`billList[${index}].check_box`}
																	class='form-check-input ml-2'
																	type='checkbox'
																	onChange={(e) => {
																		formik.setFieldValue(
																			`billList[${index}].check_box`,
																			e.target.checked,
																		);
																	}}
																	checked={item.check_box}
																/>
															</td>
														</tr>
													))}
											</tbody>
										)}
									</table>
								</div>
								<div className='row g-2 mt-2'>
									<div className='col-md-6'>
										<FormGroup
											id='debit'
											label='Pay Amount'
											className='col-md-12'>
											<Input
												readOnly
												type='number'
												onWheel={(e) => e.target.blur()}
												onChange={(e) => {
													formik.setFieldValue('debit', e.target.value);
													formik.setFieldValue(
														'remaining',
														formik.values.previous_balance -
															-e.target.value,
													);
												}}
												value={formik.values.debit}
												isValid={formik.isValid}
												isTouched={formik.touched.debit}
												invalidFeedback={formik.errors.debit}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup
											id='remaining'
											label='Remaining'
											className='col-md-12'>
											<Input
												readOnly
												type='remaining'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												// value={formik.values.remaining}
												value={
													formik.values.previous_balance +
													formik.values.debit
												}
												isValid={formik.isValid}
												isTouched={formik.touched.remaining}
												invalidFeedback={formik.errors.remaining}
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
										icon={isLoading ? null : 'payment'}
										isLight
										color={lastSave ? 'info' : 'primary'}
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading
											? (lastSave && 'Processing') || 'Processing'
											: (lastSave && 'Pay') || 'Pay'}
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
