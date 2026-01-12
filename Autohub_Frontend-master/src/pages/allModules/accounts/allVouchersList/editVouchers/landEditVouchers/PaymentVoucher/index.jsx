// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

// eslint-disable-next-line no-unused-vars
import moment from 'moment';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
// import baseURL from '../../../../../../../baseURL/baseURL';
import 'flatpickr/dist/themes/light.css';
// ** apiClient Imports
import apiClient from '../../../../../../../baseURL/apiClient';
import Button, { ButtonGroup } from '../../../../../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../../../components/bootstrap/Dropdown';

import validate from './helper/editPagesValidate';
import showNotification from '../../../../../../../components/extras/showNotification';
import Icon from '../../../../../../../components/icon/Icon';
import {
	CardBody,
	CardHeader,
	CardLabel,
	CardActions,
	CardSubTitle,
	CardTitle,
} from '../../../../../../../components/bootstrap/Card';

import useDarkMode from '../../../../../../../hooks/useDarkMode';
import Spinner from '../../../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../../../components/bootstrap/forms/Input';
import AddPersonAccount from '../../../../accountsHeadsSubgroups/modals/AddPersonAccount';

const EditModernPage = (props) => {
	const { themeStatus } = useDarkMode();
	// const [drAccountLoading, setDrAccountLoading] = useState(false);
	// const [crAccountLoading, setCrAccountLoading] = useState(false);
	const formik = useFormik({
		initialValues: props.editingVoucherData,
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

	const [landPaymentHeads, setLandPaymentHeads] = useState([]);
	const [personFilesOptions, setPersonFilesOptions] = useState([[]]);
	const [accountOptions, setAccountOptions] = useState([]);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);

	const [landPaymentHeadsLoading, setLandPaymentHeadsLoading] = useState(true);
	const [personFilesOptionsLoading, setPersonFilesOptionsLoading] = useState([]);
	const [accountOptionsLoading, setAccountOptionsLoading] = useState(true);
	const [cashAccountsOptionsLoading, setCashAccountsOptionsLoading] = useState(true);
	// const [drAccountOptions, setDrAccountOptions] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [refreshAccounts, setRefreshAccounts] = useState(0);

	useEffect(() => {
		apiClient
			.get(`/getPersonCoaAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				setAccountOptions(rec);
				setAccountOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				setCashAccountsOptions(rec);
				setCashAccountsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getLandPaymentHeads`)
			.then((response) => {
				const rec = response.data.landPaymentHead.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setLandPaymentHeads(rec);
				setLandPaymentHeadsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	}, []);

	const getFilesByPersonOMouza = (index, AccountId) => {
		formik.setFieldValue(`list[${index}].file_id`, null);
		setPersonFilesOptions([
			...personFilesOptions.slice(0, index),

			...personFilesOptions.slice(index + 1),
		]);
		if (AccountId !== null) {
			setPersonFilesOptionsLoading([
				...personFilesOptionsLoading.slice(0, index),
				true,
				...personFilesOptionsLoading.slice(index + 1),
			]);
			apiClient
				.get(`/getFilesByPersonOrMouza?account_id=${AccountId.id}`)
				.then((response) => {
					const rec = response.data.files.map(({ id, file_name, file_no }) => ({
						id,
						value: id,
						label: `${file_no}-${file_name}`,
					}));
					setPersonFilesOptions([
						...personFilesOptions.slice(0, index),
						rec,
						...personFilesOptions.slice(index + 1),
					]);
					setPersonFilesOptionsLoading([
						...personFilesOptionsLoading.slice(0, index),
						false,
						...personFilesOptionsLoading.slice(index + 1),
					]);
				})
				// eslint-disable-next-line no-console
				.catch((err) => console.log(err));
		}
		// eslint-disable-next-line no-console
		console.log('****', personFilesOptions);
	};
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
		apiClient
			.post(`/updateVoucher?voucher_id=${props.voucherId}`, data)
			.then((response) => {
				setIsLoading(false);

				if (response.data.status === 'ok') {
					formik.resetForm();
					props.handleStateEdit(false);
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Info' size='lg' className='me-1' />
							<span>Saved Successfully</span>
						</span>,
						`${response.data.message}`,
					);
				} else {
					showNotification('Error', response.data.message, 'danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);

				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};
	const handleSave = () => {
		// eslint-disable-next-line no-console

		submitForm(formik.values);
		setLastSave(moment());

		// showNotification(
		// 	<span className='d-flex align-items-center'>
		// 		<Icon icon='Info' size='lg' className='me-1' />
		// 		<span>Updated Successfully</span>
		// 	</span>,
		// 	"The user's account details have been successfully updated.",
		// );
	};
	const removeRow = (i) => {
		formik.setFieldValue('list', [
			...formik.values.list.slice(0, i),
			...formik.values.list.slice(i + 1),
		]);
		setPersonFilesOptions([
			...personFilesOptions.slice(0, i),
			...personFilesOptions.slice(i + 1),
		]);
		// eslint-disable-next-line no-console
	};

	return (
		<div className='row h-100 align-content-start'>
			<CardHeader>
				<CardLabel icon='Phonelink' iconColor='danger'>
					<CardTitle>Land Payment Voucher</CardTitle>
					<CardSubTitle>LPV</CardSubTitle>
				</CardLabel>
				<CardActions>
					<ButtonGroup>
						<AddPersonAccount
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
								isLoading={cashAccountsOptionsLoading}
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
				</div>
				<br />
				<br />
				<div className='row g-4'>
					<br />
					<hr />
					{formik.values.list.length > 0 &&
						formik.values.list.map((drListComponents, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div className='row' key={index}>
								<div className='col-md-2'>
									<FormGroup
										className='col-md-12'
										id={`list[${index}].file_id`}
										label='Account Dr'>
										<Select
											className='col-md-12'
											isDisabled={
												formik.values.list[0].land_payment_head_id.type !==
												1
											}
											isLoading={accountOptionsLoading}
											options={accountOptions}
											// isLoading={crAccountLoading}
											value={drListComponents.account}
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue(`list[${index}].account`, val);
												getFilesByPersonOMouza(index, val);
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
								<div className='col-md-2'>
									<FormGroup
										// id={`drListComponents${index}`}
										id={`list[${index}].kkk`}
										label='File no'>
										<Select
											className='col-md-12'
											isDisabled={
												formik.values.list[0].land_payment_head_id.type !==
												1
											}
											isLoading={personFilesOptionsLoading[index]}
											options={personFilesOptions[index]}
											// isLoading={crAccountLoading}
											value={drListComponents.file_id}
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue(`list[${index}].file_id`, val);
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

									{formik.errors[`list[${index}]file_id`] && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors[`list[${index}]file_id`]}
										</p>
									)}
								</div>
								<div className='col-md-2'>
									<FormGroup
										// id={`drListComponents${index}`}
										id={`list[${index}].kkk`}
										label='Details'>
										<Select
											isDisabled={
												formik.values.list[0].land_payment_head_id.type !==
												1
											}
											className='col-md-12'
											isClearable
											isLoading={landPaymentHeadsLoading}
											options={landPaymentHeads}
											// isLoading={crAccountLoading}
											value={drListComponents.land_payment_head_id}
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue(
													`list[${index}].land_payment_head_id`,
													val,
												);
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

									{formik.errors[`list[${index}]land_payment_head_id`] && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors[`list[${index}]land_payment_head_id`]}
										</p>
									)}
								</div>
								<div className='col-md-3'>
									<FormGroup
										id={`list[${index}].description`}
										label='Description'>
										<Input
											type='text'
											placeholder='Description'
											onBlur={formik.handleBlur}
											value={drListComponents.description}
											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.voucher_no}
											invalidFeedback={
												formik.errors[`list[${index}]description`]
											}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>

								<div className='col-md-2'>
									<FormGroup id={`list[${index}].dr`} label='Dr'>
										<Input
											type='number'
											min='0'
											onWheel={(e) => e.target.blur()}
											placeholder='amount'
											onBlur={formik.handleBlur}
											value={drListComponents.dr}
											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.voucher_no}
											invalidFeedback={formik.errors[`list[${index}]dr`]}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>

								<div className='col-md-1'>
									<br />
									<button
										type='button'
										className='secondary'
										onClick={() => removeRow(index)}>
										X
									</button>
								</div>
								<hr />
							</div>
						))}
				</div>
				<div className='row g-4'>
					<div className='col-md-1' />
					<div className='col-md-3'>
						<Button
							color='primary'
							onClick={() => {
								formik.setFieldValue('list', [
									...formik.values.list,
									{
										account: null,
										file_id: null,
										land_payment_head_id: landPaymentHeads
											? landPaymentHeads[0]
											: {
													id: 1,
													value: 1,
													label: 'Misc',
											  },
										description: '',
										dr: '',
										cr: 0,
									},
								]);
								setPersonFilesOptions([...personFilesOptions, []]);
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

				<div className='row g-4'>
					<div className='col-md-10' />
					<div className='col-auto'>
						<div className='row g-1'>
							<div className='col-auto'>
								<br />
								<Button
									className='me-3'
									icon={isLoading ? null : 'Update'}
									color={lastSave ? 'primary' : 'primary'}
									isDisable={isLoading}
									onClick={formik.handleSubmit}>
									{isLoading && <Spinner isSmall inButton />}
									{isLoading
										? (lastSave && 'Updating') || 'Updating'
										: (lastSave && 'Update') || 'Update'}
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
												Reset to original
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
