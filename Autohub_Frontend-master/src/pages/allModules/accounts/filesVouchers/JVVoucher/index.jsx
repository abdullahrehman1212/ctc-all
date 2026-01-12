// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import apiClient from '../../../../../baseURL/apiClient';
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

import useDarkMode from '../../../../../hooks/useDarkMode';
import Spinner from '../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';
import AddPersonAccount from '../modals/AddPersonAccount';

// eslint-disable-next-line no-unused-vars
const EditModernPage = React.memo((value) => {
	const { themeStatus } = useDarkMode();

	const formik = useFormik({
		initialValues: {
			list: [
				{
					account: null,
					file_id: null,
					land_payment_head_id: null,
					description: '',
					cr: 0,
					dr: '',
					row_type: 'dr',
				},
			],
			name: '',
			account: null,

			date: new Date(),
			total_amount_dr: '',
			total_amount_cr: '',
			total_amount: '',

			cheque_no: '',
			cheque_date: new Date(),
			type: 7,
			is_post_dated: 0,
		},
		errors: {},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const fileRequiredWithSubGroups = [1, 20, 22, 29, 48, 49, 59, 56];
	const paymentHeadRequiredWithSubGroups = [1, 22, 53, 58, 56, 29];
	/**
	 * Common
	 */

	const [landPaymentHeads, setLandPaymentHeads] = useState([]);
	const [personFilesOptions, setPersonFilesOptions] = useState([[]]);
	const [accountOptions, setAccountOptions] = useState([]);

	const [landPaymentHeadsLoading, setLandPaymentHeadsLoading] = useState([]);
	const [personFilesOptionsLoading, setPersonFilesOptionsLoading] = useState([]);
	const [accountOptionsLoading, setAccountOptionsLoading] = useState(true);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const refreshAccounts = () => {
		apiClient
			.get(`/getAccountsExceptCashAndBank`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						value: id,
						coa_sub_group_id,
						label: `${code}-${name}`,
					}),
				);
				setAccountOptions(rec);
				setAccountOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		refreshAccounts();
	}, [value]);

	const getFilesByPersonOMouza = (index, AccountId) => {
		console.log('index22', personFilesOptionsLoading);

		formik.setFieldValue(`list[${index}].file_id`, null);

		if (AccountId !== null) {
			if (fileRequiredWithSubGroups.find((val) => val === AccountId.coa_sub_group_id)) {
				setPersonFilesOptions([
					...personFilesOptions.slice(0, index),
					{},
					...personFilesOptions.slice(index + 1),
				]);

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
			} else {
				setPersonFilesOptions([
					...personFilesOptions.slice(0, index),
					[],
					...personFilesOptions.slice(index + 1),
				]);
			}
		} else {
			setPersonFilesOptions([
				...personFilesOptions.slice(0, index),
				[],
				...personFilesOptions.slice(index + 1),
			]);
		}
		// eslint-disable-next-line no-console
		console.log('****', personFilesOptions);
	};
	const getPaymentHeadsSubGroup = (index, AccountId) => {
		formik.setFieldValue(`list[${index}].land_payment_head_id`, null);
		let type = 0;
		if (AccountId !== null) {
			if (
				paymentHeadRequiredWithSubGroups.find((val) => val === AccountId.coa_sub_group_id)
			) {
				setLandPaymentHeads([
					...landPaymentHeads.slice(0, index),
					{},
					...landPaymentHeads.slice(index + 1),
				]);

				setLandPaymentHeadsLoading([
					...landPaymentHeadsLoading.slice(0, index),
					true,
					...landPaymentHeadsLoading.slice(index + 1),
				]);
				if (AccountId.coa_sub_group_id === 1 || AccountId.coa_sub_group_id === 22) {
					type = 1;
				} else if (AccountId.coa_sub_group_id === 53 || AccountId.coa_sub_group_id === 58) {
					type = 2;
				} else if (AccountId.coa_sub_group_id === 29) {
					type = 3;
				} else if (AccountId.coa_sub_group_id === 56) {
					type = 3;
				}
				apiClient
					.get(`/getLandPaymentHeads?type=${type}`)
					.then((response) => {
						const rec = response.data.landPaymentHead.map(({ id, name }) => {
							let isDisabled = true;
							if (type === 3) {
								if (
									AccountId.coa_sub_group_id === 29 &&
									formik.values.list[index].row_type === 'dr' &&
									id === 21
								) {
									isDisabled = false;
								} else if (
									AccountId.coa_sub_group_id === 29 &&
									formik.values.list[index].row_type === 'cr' &&
									id === 19
								) {
									isDisabled = false;
								} else if (
									AccountId.coa_sub_group_id === 56 &&
									formik.values.list[index].row_type === 'dr' &&
									id === 20
								) {
									isDisabled = false;
								} else if (id === 10) {
									isDisabled = true;
								} else {
									isDisabled = true;
								}
							} else if (type === 2) {
								if (
									(AccountId.coa_sub_group_id === 53 ||
										AccountId.coa_sub_group_id === 58) &&
									formik.values.list[index].row_type === 'cr'
								) {
									isDisabled = false;
								} else {
									isDisabled = true;
								}
							} else {
								isDisabled = false;
							}

							console.log(
								',,,,,,,',
								type,
								AccountId.coa_sub_group_id,
								formik.values.list[index].row_type,
								id,
							);
							return {
								id,
								value: id,
								label: name,
								disabled: isDisabled,
							};
						});
						setLandPaymentHeads([
							...landPaymentHeads.slice(0, index),
							rec,
							...landPaymentHeads.slice(index + 1),
						]);
						setLandPaymentHeadsLoading([
							...landPaymentHeadsLoading.slice(0, index),
							false,
							...landPaymentHeadsLoading.slice(index + 1),
						]);
					})
					// eslint-disable-next-line no-console
					.catch((err) => console.log(err));
			} else {
				setLandPaymentHeads([
					...landPaymentHeads.slice(0, index),
					[],
					...landPaymentHeads.slice(index + 1),
				]);
			}
		} else {
			setLandPaymentHeads([
				...landPaymentHeads.slice(0, index),
				[],
				...landPaymentHeads.slice(index + 1),
			]);
		}
		// eslint-disable-next-line no-console
		console.log('****', landPaymentHeads);
	};

	useEffect(() => {
		formik.values.total_amount_dr = 0;
		formik.values.total_amount_cr = 0;

		formik.values.list.forEach((data) => {
			formik.values.total_amount_dr += Number(data.dr);
			formik.values.total_amount_cr += Number(data.cr);
		});
	}, [formik.values]);

	const submitForm = (data) => {
		const url = `${baseURL}/storeExtendedJv`;
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
		setPersonFilesOptionsLoading([
			...personFilesOptionsLoading.slice(0, i),
			...personFilesOptionsLoading.slice(i + 1),
		]);
		setLandPaymentHeadsLoading([
			...landPaymentHeadsLoading.slice(0, i),
			...landPaymentHeadsLoading.slice(i + 1),
		]);

		// eslint-disable-next-line no-console
	};

	return (
		<div className='row h-100 align-content-start'>
			<CardHeader>
				<CardLabel icon='Phonelink' iconColor='danger'>
					<CardTitle>Land Journal Voucher</CardTitle>
					<CardSubTitle>LJV</CardSubTitle>
				</CardLabel>
				<CardActions>
					<ButtonGroup>
						<AddPersonAccount refreshAccounts={refreshAccounts} />
					</ButtonGroup>
				</CardActions>
			</CardHeader>
			<CardBody>
				<div className='row g-4'>
					<div className='col-md-6'>
						<FormGroup id='name' label='Name' isFloating>
							<Input
								type='text'
								placeholder='Name'
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
									// eslint-disable-next-line no-console
									console.log('1', formik.values.date);

									formik.setFieldValue('date', dateStr);
								}}
								onClose={(date, dateStr) => {
									formik.setFieldValue('date', dateStr);
								}}
								id='default-picker'
							/>
						</FormGroup>
						{formik.errors.date && (
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
				<br />
				<div className='row g-4'>
					<br />
					<hr />
					{formik.values.list.length > 0 &&
						formik.values.list.map((drListComponents, index) => (
							// eslint-disable-next-line react/no-array-index-key
							<div className='row' key={index}>
								<div className='col-md-3'>
									<FormGroup
										// id={`drListComponents${index}`}
										id={`list[${index}].kkk`}
										label={
											drListComponents.row_type === 'cr'
												? 'Account Cr'
												: 'Account Dr'
										}>
										<Select
											className='col-md-11'
											isClearable
											isLoading={accountOptionsLoading}
											options={accountOptions}
											// isLoading={crAccountLoading}
											value={drListComponents.account}
											// onChange={formik.handleChange}
											onChange={(val) => {
												formik.setFieldValue(`list[${index}].account`, val);
												getFilesByPersonOMouza(index, val);
												getPaymentHeadsSubGroup(index, val);
												console.log('index', index);
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

									<FormGroup
										// id={`drListComponents${index}`}
										id={`list[${index}].kkk`}
										label='File no'>
										<Select
											className='col-md-11'
											isClearable
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
											className='col-md-11'
											isLoading={landPaymentHeadsLoading[index]}
											options={landPaymentHeads[index]}
											// isLoading={crAccountLoading}
											value={
												// eslint-disable-next-line no-nested-ternary
												drListComponents.land_payment_head_id
											}
											isOptionDisabled={(option) => option.disabled}
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
								<div className='col-md-2'>
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
											isTouched={formik.touched.name}
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
											readOnly={drListComponents.row_type === 'cr'}
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
								<div className='col-md-2'>
									<FormGroup id={`list[${index}].cr`} label='Cr'>
										<Input
											type='number'
											min='0'
											onWheel={(e) => e.target.blur()}
											placeholder='amount'
											readOnly={drListComponents.row_type === 'dr'}
											onBlur={formik.handleBlur}
											value={drListComponents.cr}
											onChange={formik.handleChange}
											isValid={formik.isValid}
											isTouched={formik.touched.name}
											invalidFeedback={formik.errors[`list[${index}]cr`]}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>

								<div className='col-md-1'>
									<br />
									<Button
										icon='cancel'
										color='danger'
										onClick={() => removeRow(index)}
									/>
								</div>
								<hr />
							</div>
						))}
				</div>{' '}
				<div className='row g-4'>
					<div className='col-md-5' />
					<div className='col-md-2'>
						<br />
						<h4>Total Amount</h4>
					</div>
					<div className='col-md-2'>
						<FormGroup id='total_amount_dr' label='Total Amount' isFloating>
							<Input
								type='text'
								readOnly
								placeholder='PKR 0'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.total_amount_dr}
								isValid={formik.isValid}
								isTouched={formik.touched.total_amount_dr}
								invalidFeedback={formik.errors.total_amount_dr}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					</div>
					<div className='col-md-2'>
						<FormGroup id='total_amount_cr' label='Total Amount' isFloating>
							<Input
								type='text'
								readOnly
								placeholder='PKR 0'
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.total_amount_cr}
								isValid={formik.isValid}
								isTouched={formik.touched.total_amount_cr}
								invalidFeedback={formik.errors.total_amount_cr}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					</div>
				</div>
				<div className='row g-4'>
					<div className='col-md-7' />
					<div className='col-md-2'>
						<Button
							color='primary'
							icon='add'
							onClick={() => {
								formik.setFieldValue('list', [
									...formik.values.list,
									{
										account: null,
										file_id: null,
										land_payment_head_id: null,
										description: '',
										dr: '',
										cr: 0,
										row_type: 'dr',
									},
								]);
								setPersonFilesOptionsLoading([...personFilesOptionsLoading, false]);
								setLandPaymentHeadsLoading([...landPaymentHeadsLoading, false]);
							}}>
							Add Dr
						</Button>
					</div>
					<div className='col-md-2'>
						<Button
							color='primary'
							icon='add'
							onClick={() => {
								formik.setFieldValue('list', [
									...formik.values.list,
									{
										account: null,
										file_id: null,
										land_payment_head_id: null,
										description: '',
										dr: 0,
										cr: '',
										row_type: 'cr',
									},
								]);
								setPersonFilesOptionsLoading([...personFilesOptionsLoading, false]);
								setLandPaymentHeadsLoading([...landPaymentHeadsLoading, false]);
							}}>
							Add Cr
						</Button>
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
});

export default EditModernPage;
