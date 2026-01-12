// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */

import React, { useState } from 'react';
import { useFormik } from 'formik';

import classNames from 'classnames';

import Spinner from '../../../../components/bootstrap/Spinner';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';

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
	CardTitle,

	// eslint-disable-next-line no-unused-vars
	CardHeader,

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

import Ledger from './ledger';

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

	return errors;
};

const AddCoeSubGroup = (props) => {
	// eslint-disable-next-line no-unused-vars
	const [openingBalance, setOpeningBalance] = useState(0);
	// eslint-disable-next-line no-unused-vars
	const currentBalance = 0;

	const handleStateLedger = (status) => {
		setStateLedger(status);
	};

	const formik = useFormik({
		initialValues: props.editingLoanData,
		validate,
		onSubmit: (values) => {
			// eslint-disable-next-line no-alert
			alert(JSON.stringify(values, null, 2));
		},
	});

	// Ledger
	const [stateLedger, setStateLedger] = useState(false);

	const [staticBackdropStatusLedger, setStaticBackdropStatusLedger] = useState(true);
	const [scrollableStatusLedger, setScrollableStatusLedger] = useState(false);
	const [centeredStatusLedger, setCenteredStatusLedger] = useState(false);
	const [sizeStatusLedger, setSizeStatusLedger] = useState(null);
	const [fullScreenStatusLedger, setFullScreenStatusLedger] = useState(null);
	const [animationStatusLedger, setAnimationStatusLedger] = useState(true);

	const [headerCloseStatusLedger, setHeaderCloseStatusLedger] = useState(true);

	const initialStatusLedger = () => {
		setStaticBackdropStatusLedger(true);
		setScrollableStatusLedger(false);
		setCenteredStatusLedger(false);
		setSizeStatusLedger('xl');
		setFullScreenStatusLedger(false);
		setAnimationStatusLedger(true);
		setHeaderCloseStatusLedger(true);
	};

	// eslint-disable-next-line no-unused-vars
	const [accountSelected, setAccountSelected] = useState('');
	const [accountDetails, setAccountDetails] = useState('');

	return (
		<div className='col-12'>
			<Card stretch tag='form' shadow='none' onSubmit={formik.handleSubmit}>
				<div className='row g-4'>
					<CardBody className='col-md-6 border-end'>
						<div className='d-flex flex-column align-items-center justify-content-center'>
							<h2>Receivable</h2>
						</div>
						<div className='table-responsive'>
							<table className='table table-striped table-bordered table-hover'>
								<thead className='table-light'>
									<tr>
										<th>Subgroup</th>
										<th>Code</th>
										<th>Account</th>
										<th>Status</th>
										<th>Balance</th>

										<th className='cursor-pointer text-decoration-underline'>
											Actions
										</th>
									</tr>
								</thead>
								{props.tableRecordsLoading ? (
									<tbody>
										<tr>
											<td colSpan='11'>
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											</td>
										</tr>
									</tbody>
								) : (
									<tbody>
										{props.editingLoanData.receiveableAccounts &&
											props.editingLoanData.receiveableAccounts.map(
												(item) => (
													<tr key={item.id}>
														<td>{item.coa_sub_group.name}</td>
														<td>{item.code}</td>
														<td>{item.name}</td>
														<td>
															{item.isActive === 1
																? 'Active'
																: 'Inactive'}
														</td>
														<td>
															{item.balance !== null
																? item.balance.balance.toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		},
																  )
																: 0}
														</td>

														<td>
															<ButtonGroup>
																<Button
																	isOutline
																	color='primary'
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Edit'
																	onClick={() => {
																		setAccountSelected({
																			id: item.id,
																			value: item.id,
																			label: `${item.code}-${item.name}`,
																		});
																		setAccountDetails({
																			code: item.code,
																			name: item.name,
																			coa_sub_group:
																				item.coa_sub_group
																					.name,
																		});
																		initialStatusLedger();

																		// props.handleStateEdit(false);
																		setStateLedger(true);
																		setStaticBackdropStatusLedger(
																			true,
																		);
																	}}>
																	View
																</Button>
															</ButtonGroup>
														</td>
													</tr>
												),
											)}
									</tbody>
								)}
							</table>
						</div>
					</CardBody>
					<CardBody className='col-md-6 border-start'>
						<div className='d-flex flex-column align-items-center justify-content-center'>
							<h2>Payable</h2>
						</div>
						<div className='table-responsive'>
							<table className='table table-striped table-bordered table-hover'>
								<thead className='table-light'>
									<tr>
										<th>Subgroup</th>
										<th>Code</th>
										<th>Account</th>
										<th>Status</th>
										<th>Balance</th>

										<th className='cursor-pointer text-decoration-underline'>
											Actions
										</th>
									</tr>
								</thead>
								{props.tableRecordsLoading ? (
									<tbody>
										<tr>
											<td colSpan='11'>
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											</td>
										</tr>
									</tbody>
								) : (
									<tbody>
										{props.editingLoanData.payableAccounts &&
											props.editingLoanData.payableAccounts.map((item) => (
												<tr key={item.id}>
													<td>{item.coa_sub_group.name}</td>
													<td>{item.code}</td>
													<td>{item.name}</td>
													<td>
														{item.isActive === 1
															? 'Active'
															: 'Inactive'}
													</td>
													<td>
														{item.balance !== null
															? item.balance.balance.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )
															: 0}
													</td>

													<td>
														<ButtonGroup>
															<Button
																isOutline
																color='primary'
																// isLight={darkModeStatus}
																className={classNames(
																	'text-nowrap',
																	{
																		'border-light': true,
																	},
																)}
																icon='Edit'
																onClick={() => {
																	setAccountSelected({
																		id: item.id,
																		value: item.id,
																		label: `${item.code}-${item.name}`,
																	});
																	setAccountDetails({
																		code: item.code,
																		name: item.name,
																		coa_sub_group:
																			item.coa_sub_group.name,
																	});
																	initialStatusLedger();

																	// props.handleStateEdit(false);
																	setStateLedger(true);
																	setStaticBackdropStatusLedger(
																		true,
																	);
																}}>
																View
															</Button>
														</ButtonGroup>
													</td>
												</tr>
											))}
									</tbody>
								)}
							</table>
						</div>
					</CardBody>
				</div>

				<CardFooter>
					<CardFooterLeft />

					<CardFooterRight />
				</CardFooter>
			</Card>
			<Modal
				isOpen={stateLedger}
				setIsOpen={setStateLedger}
				titleId='LedgerVoucher'
				isStaticBackdrop={staticBackdropStatusLedger}
				isScrollable={scrollableStatusLedger}
				isCentered={centeredStatusLedger}
				size={sizeStatusLedger}
				fullScreen={fullScreenStatusLedger}
				isAnimation={animationStatusLedger}>
				<ModalHeader setIsOpen={headerCloseStatusLedger ? setStateLedger : null}>
					<ModalTitle id='LedgerVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>
									Account Ledger: {accountDetails.code}-{accountDetails.name}
									<br />
									<small> Subgroup : {accountDetails.coa_sub_group} </small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								<Card shadow='none' className='border-0'>
									<Ledger
										handleStateEdit={handleStateLedger}
										openingBalance={openingBalance}
										accountSelected={accountSelected}
									/>
								</Card>

								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateLedger(false)}>
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
		</div>
	);
};

export default AddCoeSubGroup;
