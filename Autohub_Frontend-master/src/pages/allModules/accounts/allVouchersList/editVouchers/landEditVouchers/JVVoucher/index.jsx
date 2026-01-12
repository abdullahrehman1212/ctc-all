// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
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
import AddCoeSubGroup from '../../../../accountsHeadsSubgroups/modals/AddCoeSubGroup';
import AddAccount from '../../../../accountsHeadsSubgroups/modals/AddAccount';

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

	// const [drAccountOptions, setDrAccountOptions] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [lastSave, setLastSave] = useState(null);
	const [refreshAccounts, setRefreshAccounts] = useState(0);

	const refreshAccounts2 = () => {
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
		refreshAccounts2();
	}, []);

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

	// useEffect(() => {
	// 	formik.values.list.forEach(() => {
	// 		setPersonFilesOptionsLoading([...personFilesOptionsLoading, false]);
	// 		setLandPaymentHeadsLoading([...landPaymentHeadsLoading, false]);
	// 		// setLandPaymentHeads([...landPaymentHeads, []]);
	// 		// setPersonFilesOptions([...personFilesOptions, []]);
	// 	});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	// async function printFiles() {
	// 	// eslint-disable-next-line no-restricted-syntax
	// 	for (const data of formik.values.list) {
	// 		console.log(1);
	// 		// eslint-disable-next-line no-await-in-loop
	// 		await getFilesByPersonOMouza(data.index, data.account);
	// 		console.log(3);
	// 		// eslint-disable-next-line no-await-in-loop
	// 		await getPaymentHeadsSubGroup(data.index, data.account);
	// 		console.log(5);
	// 	}
	// }
	// async function printFiles() {
	// 	// eslint-disable-next-line array-callback-return
	// 	const promises = await formik.values.list.map((el) => {
	// 		getFilesByPersonOMouza(el.index, el.account);
	// 	});
	// 	console.log('promises', promises);
	// }

	// async function printFiles1() {
	// 	await Promise.all(
	// 		formik.values.list.map(async (file) => {
	// 			const context = getFilesByPersonOMouza(file.index, file.account);
	// 		}),
	// 	);
	// }
	// const printFiles = async () => {
	// 	formik.values.list.map((el) => {
	// 		console.log('indexone', el.index, el.account);
	// 		return getFilesByPersonOMouza(el.index, el.account);
	// 	});
	// 	console.log('Before For Each Loop');

	// for (const element of myPromiseArray) {
	// 	const result = await element;
	// 	console.log('result', result);
	// }

	// console.log('After For Each Loop');
	// };

	const printFiles = async () => {
		const promises = formik.values.list.map(async (el) => {
			console.log('index1', el.index, el.account);
			const data = await getFilesByPersonOMouza(el.index, el.account);

			return { el, data };
		});
		await promises;
		console.log('promises', promises);
	};
	// async function printFiles() {
	// 	for (const data of formik.values.list) {
	// 		console.log('indexone', data.index, data.account);
	// 		await Promise.all(getFilesByPersonOMouza(data.index, data.account));
	// 	}
	// }

	useEffect(() => {
		printFiles();
		// Promise.all(
		// 	formik.values.list.map(async (el) => {
		// 		await getFilesByPersonOMouza(el.index, el.account);
		// 	}),
		// );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refreshAccounts1 = () => {
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
		refreshAccounts1();
	}, []);

	const getFilesByPersonOMouza = (index, AccountId) => {
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
						console.log(2);
						console.log('indexTwo', index, AccountId);

						console.log('kkkk', response.data.files);
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
							} else if (id === 10) {
								isDisabled = true;
							} else {
								isDisabled = false;
							}

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
						console.log(4);
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
	};

	useEffect(() => {
		formik.values.total_amount_dr = 0;
		formik.values.total_amount_cr = 0;

		formik.values.list.forEach((data) => {
			formik.values.total_amount_dr += Number(data.dr);
			formik.values.total_amount_cr += Number(data.cr);
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
			<div className='col-md-12'>
				<CardHeader>
					<CardLabel icon='Phonelink' iconColor='danger'>
						<CardTitle>Journal Voucher</CardTitle>
						<CardSubTitle>JV</CardSubTitle>
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
					<div className='row h-100 align-content-start'>
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
															formik.setFieldValue(
																`list[${index}].account`,
																val,
															);
															getFilesByPersonOMouza(index, val);
															getPaymentHeadsSubGroup(index, val);
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
															formik.setFieldValue(
																`list[${index}].file_id`,
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
														isOptionDisabled={(option) =>
															option.disabled
														}
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

												{formik.errors[
													`list[${index}]land_payment_head_id`
												] && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: 'red',
														}}>
														{
															formik.errors[
																`list[${index}]land_payment_head_id`
															]
														}
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
															formik.errors[
																`list[${index}]description`
															]
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
														readOnly={
															drListComponents.row_type === 'cr'
														}
														onBlur={formik.handleBlur}
														value={drListComponents.dr}
														onChange={formik.handleChange}
														isValid={formik.isValid}
														isTouched={formik.touched.name}
														invalidFeedback={
															formik.errors[`list[${index}]dr`]
														}
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
														readOnly={
															drListComponents.row_type === 'dr'
														}
														onBlur={formik.handleBlur}
														value={drListComponents.cr}
														onChange={formik.handleChange}
														isValid={formik.isValid}
														isTouched={formik.touched.name}
														invalidFeedback={
															formik.errors[`list[${index}]cr`]
														}
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
											setPersonFilesOptionsLoading([
												...personFilesOptionsLoading,
												false,
											]);
											setLandPaymentHeadsLoading([
												...landPaymentHeadsLoading,
												false,
											]);
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
											setPersonFilesOptionsLoading([
												...personFilesOptionsLoading,
												false,
											]);
											setLandPaymentHeadsLoading([
												...landPaymentHeadsLoading,
												false,
											]);
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
				</CardBody>
			</div>
		</div>
	);
};

export default EditModernPage;
