// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
// eslint-disable-next-line no-unused-vars
import moment from 'moment';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import baseURL from '../../../../../baseURL/baseURL';
import 'flatpickr/dist/themes/light.css';

import Button, { ButtonGroup } from '../../../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../components/bootstrap/Dropdown';

import validate from './helper/editPagesValidate';
import showNotification from '../../../../../components/extras/showNotification';
import Icon from '../../../../../components/icon/Icon';
import {
	CardBody,
	CardHeader,
	CardLabel,
	CardActions,
	CardSubTitle,
	CardTitle,
} from '../../../../../components/bootstrap/Card';
import apiClient from '../../../../../baseURL/apiClient';
import useDarkMode from '../../../../../hooks/useDarkMode';
import Spinner from '../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';
import AddCoeSubGroup from '../modals/AddCoeSubGroup';
import AddAccount from '../modals/AddAccount';

const EditModernPage = () => {
	const token = Cookies.get('userToken1');
	const { themeStatus } = useDarkMode();
	// const [drAccountLoading, setDrAccountLoading] = useState(false);
	// const [crAccountLoading, setCrAccountLoading] = useState(false);
	const formik = useFormik({
		initialValues: {
			list: [
				{
					account: null,
					description: '',
					cr: 0,
					dr: '',
				},
			],
			name: '',
			account: null,

			date: new Date(),
			total_amount: '',

			cheque_no: '',
			cheque_date: new Date(),
			type: 1,
			is_post_dated: 0,
			// list: [{ account: null, description: '', amount: '' }],
		},
		errors: {},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	/**
	 * Common
	 */

	const [accountOptions, setAccountOptions] = useState([]);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	// const [drAccountOptions, setDrAccountOptions] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [refreshAccounts, setRefreshAccounts] = useState(0);

	useEffect(() => {
		apiClient
			.get(`/getAccountsExceptCash`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				setAccountOptions(rec);
				// setPurchaserOptionsLoading(false)
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						value: id,
						coa_sub_group_id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions(rec);
				// setPurchaserOptionsLoading(false)
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	}, [refreshAccounts]);

	useEffect(() => {
		formik.values.total_amount = 0;

		formik.values.list.forEach((data) => {
			formik.values.total_amount += Number(data.dr);
		});
	}, [formik.values]);

	const refreshAccountsHandler = (arg) => {
		setRefreshAccounts(arg);
	};
	const submitForm = (data) => {
		const url = `${baseURL}/addVoucher`;

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		};
		fetch(url, options)
			.then((response) => response.json())
			.then((res) => {
				setIsLoading(false);
				if (res.status === 'ok') {
					// showNotification('Success', res.message, 'success');
					formik.resetForm();
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Info' size='lg' className='me-1' />
							<span>Saved Successfully</span>
						</span>,
						`${res.message}`,
					);
				} else {
					showNotification('Error', res.message, 'danger');
				}
			})
			.catch((err) => showNotification('Error', err.message, 'danger'));
	};
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('list', [
			...formik.values.list.slice(0, i),
			...formik.values.list.slice(i + 1),
		]);
		// eslint-disable-next-line no-console
	};

	return (
		<div className='row h-100 align-content-start'>
			<CardHeader>
				<CardLabel icon='Phonelink' iconColor='danger'>
					<CardTitle>Payment Voucher</CardTitle>
					<CardSubTitle>PV</CardSubTitle>
				</CardLabel>
				<CardActions>
					<ButtonGroup>
						<AddCoeSubGroup
							setRefreshAccounts={refreshAccountsHandler}
							refreshAccounts={refreshAccounts}
						/>
						<AddAccount
							setRefreshAccounts={refreshAccountsHandler}
							refreshAccounts={refreshAccounts}
						/>
					</ButtonGroup>
				</CardActions>
			</CardHeader>
			<CardBody>
				<div className='row g-4'>
					<div className='col-md-6'>
						<FormGroup id='name' label='Paid To' isFloating>
							<Input
								type='text'
								placeholder='Paid To'
								autoComplete='email'
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

					<div className='col-md-3' />
					<div className='col-md-3'>
						<FormGroup id='date' label='Date' isFloating>
							<Flatpickr
								className='form-control'
								value={formik.values.date}
								options={{
									dateFormat: 'd/m/y',
									allowInput: true,
									defaultDate: new Date(),
								}}
								onChange={(date, dateStr) => {
									formik.setFieldValue('date', dateStr);
									// eslint-disable-next-line no-console
									console.log('::::', dateStr);
								}}
								onClose={(date, dateStr) => {
									formik.setFieldValue('date', dateStr);
								}}
								id='default-picker'
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.date}
								invalidFeedback={formik.errors.date}
								validFeedback='Looks good!'
							/>
						</FormGroup>
						{formik.errors.date && (
							// <div className={classNames( "invalid-feedback")}>
							<p
								style={{
									color: 'red',
								}}>
								{formik.errors.date}
							</p>
						)}
					</div>
				</div>
				<br />

				<div className='row g-4'>
					<div className='col-md-6'>
						<FormGroup id='account' label='Cr Account'>
							<Select
								className='col-md-11 '
								isClearable
								classNamePrefix='select'
								options={cashAccountsOptions}
								// isLoading={crAccountLoading}
								value={formik.values.account}
								onChange={(val) => {
									formik.setFieldValue('account', val);
								}}
								onBlur={formik.handleBlur}
								isValid={formik.isValid}
								isTouched={formik.touched.account}
								invalidFeedback={formik.errors.account}
								validFeedback='Looks good!'
							/>
						</FormGroup>
						{formik.errors.account && (
							// <div className='invalid-feedback'>
							<p
								style={{
									color: 'red',
								}}>
								{formik.errors.account}
							</p>
						)}
					</div>

					{formik.values.account?.coa_sub_group_id === 2 && (
						<>
							<div className='col-md-3'>
								<br />
								<FormGroup id='cheque_no' label='cheque_no' isFloating>
									<Input
										type='text'
										placeholder=''
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.cheque_no}
										isValid={formik.isValid}
										isTouched={formik.touched.cheque_no}
										invalidFeedback={formik.errors.cheque_no}
										validFeedback='Looks good!'
									/>
								</FormGroup>
							</div>
							<div className='col-md-3'>
								<br />
								<FormGroup id='cheque_date' label='cheque_date' isFloating>
									<Flatpickr
										className='form-control'
										value={formik.values.cheque_date}
										disabled={!formik.values.cheque_no && true}
										options={{
											dateFormat: 'd/m/y',
											allowInput: true,
											defaultDate: new Date(),
										}}
										onChange={(date, dateStr) => {
											formik.setFieldValue('cheque_date', dateStr);
										}}
										onClose={(date, dateStr) => {
											formik.setFieldValue('cheque_date', dateStr);
										}}
										id='default-picker'
									/>
								</FormGroup>
							</div>
						</>
					)}

					<div className='row g-4'>
						<div className='col-md-1' />
						<div className='col-md-3'>
							<h4>Account Dr</h4>
						</div>
						<div className='col-md-5'>
							<h4>Description</h4>
						</div>
						<div className='col-md-2'>
							<h4>Dr</h4>
						</div>

						<div className='col-md-1' />
					</div>
					{formik.values.list.length > 0 &&
						formik.values.list.map((drListComponents, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div className='row' key={index}>
								<div className='col-md-1' />
								<div className='col-md-3'>
									<FormGroup
										// id={`drListComponents${index}`}
										id={`list[${index}].kkk`}
										label=''>
										<Select
											className='col-md-11'
											isClearable
											options={accountOptions}
											// isLoading={crAccountLoading}
											value={drListComponents.account}
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue(`list[${index}].account`, val);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											// isTouched={
											// 	formik.touched.list[index].account
											// }
											// invalidFeedback={
											// 	formik.errors.list[index].account
											// }
											validFeedback='Looks good!'
										/>
									</FormGroup>

									{formik.errors[`list[${index}]account`] && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors[`list[${index}]account`]}
										</p>
									)}
								</div>
								<div className='col-md-5'>
									<FormGroup
										id={`list[${index}].description`}
										label='Description'
										isFloating>
										<Input
											type='text'
											placeholder='Description'
											onBlur={formik.handleBlur}
											value={drListComponents.description}
											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.name}
											invalidFeedback={
												formik.errors[`list[${index}]description`]
											}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>

								<div className='col-md-2'>
									<FormGroup id={`list[${index}].dr`} label='amount' isFloating>
										<Input
											type='number'
											min='0'
											onWheel={(e) => e.target.blur()}
											placeholder='amount'
											onBlur={formik.handleBlur}
											value={drListComponents.dr}
											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.name}
											invalidFeedback={formik.errors[`list[${index}]dr`]}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>

								<div className='col-md-1'>
									<Button
										icon='cancel'
										color='danger'
										onClick={() => removeRow(index)}
									/>
								</div>
							</div>
						))}

					<div className='row g-4'>
						<div className='col-md-1' />
						<div className='col-md-3'>
							<Button
								color='primary'
								icon='add'
								onClick={() => {
									formik.setFieldValue('list', [
										...formik.values.list,
										{
											account: null,
											description: '',
											dr: '',
											cr: 0,
										},
									]);
								}}>
								Add
							</Button>
						</div>
						<div className='col-md-3' />
						<div className='col-md-2'>
							<br />
							<h4>Total Amount</h4>
						</div>
						<div className='col-md-2'>
							<FormGroup id='total_amount' label='Total Amount' isFloating>
								<Input
									type='text'
									readOnly
									placeholder='PKR 0'
									onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									value={formik.values.total_amount}
									// isValid={formik.isValid}
									// isTouched={formik.touched.total_amount}
									invalidFeedback={formik.errors.total_amount}
									// validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-1' />
					</div>
				</div>
				<div className='row g-4'>
					<div className='col-md-10' />
					<div className='col-auto'>
						<div className='row g-1'>
							<div className='col-auto'>
								<br />
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
							</div>

							<div className='col-auto'>
								<br />
								<Dropdown direction='up'>
									<DropdownToggle hasIcon={false}>
										<Button color={themeStatus} icon='MoreVert' />
									</DropdownToggle>
									<DropdownMenu isAlignmentEnd>
										<DropdownItem>
											<Button
												className='me-3'
												icon='Save'
												isLight
												isDisable={isLoading}
												onClick={formik.resetForm}>
												Reset
											</Button>
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</div>
						</div>
					</div>
				</div>
			</CardBody>
		</div>
	);
};

export default EditModernPage;
