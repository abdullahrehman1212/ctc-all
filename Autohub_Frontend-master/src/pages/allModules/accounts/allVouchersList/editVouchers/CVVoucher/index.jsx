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
import apiClient from '../../../../../../baseURL/apiClient';
// import baseURL from '../../../../../../baseURL/baseURL';

import 'flatpickr/dist/themes/light.css';
// ** apiClient Imports

import Button, { ButtonGroup } from '../../../../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../../components/bootstrap/Dropdown';

import validate from './helper/editPagesValidate';
import showNotification from '../../../../../../components/extras/showNotification';
import Icon from '../../../../../../components/icon/Icon';
import {
	CardBody,
	CardHeader,
	CardLabel,
	CardActions,
	CardSubTitle,
	CardTitle,
} from '../../../../../../components/bootstrap/Card';

import useDarkMode from '../../../../../../hooks/useDarkMode';
import Spinner from '../../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../../components/bootstrap/forms/Input';
import AddCoeSubGroup from '../../../accountsHeadsSubgroups/modals/AddCoeSubGroup';
import AddAccount from '../../../accountsHeadsSubgroups/modals/AddAccount';

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

	const [accountOptions, setAccountOptions] = useState([]);
	// const [drAccountOptions, setDrAccountOptions] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [refreshAccounts, setRefreshAccounts] = useState(0);

	useEffect(() => {
		apiClient
			.get(`/getCashAccounts`)
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
	}, []);

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
		// eslint-disable-next-line no-console
	};

	return (
		<div className='row h-100 align-content-start'>
			<div className='col-md-12'>
				<CardHeader>
					<CardLabel icon='Phonelink' iconColor='danger'>
						<CardTitle>Contra Voucher</CardTitle>
						<CardSubTitle>CV</CardSubTitle>
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
							<FormGroup id='name' label='Name' isFloating>
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
						</div>
					</div>
					<br />

					<div className='row g-4'>
						<div className='col-md-6' />

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
									options={{
										dateFormat: 'd/m/y',
										allowInput: true,
										defaultDate: new Date(),
									}}
									// eslint-disable-next-line react/jsx-boolean-value, camelcase
									disabled={!formik.values.cheque_no && true}
									onChange={(date, dateStr) => {
										formik.setFieldValue('cheque_date', dateStr);
									}}
									onClose={(date, dateStr) => {
										formik.setFieldValue('cheque_date', dateStr);
									}}
								/>
							</FormGroup>
						</div>

						<div className='row g-4'>
							<div className='col-md-3'>
								<h4>Account Dr/ Cr</h4>
							</div>
							<div className='col-md-4'>
								<h4>Description</h4>
							</div>
							<div className='col-md-2'>
								<h4>Dr</h4>
							</div>
							<div className='col-md-2'>
								<h4>Cr</h4>
							</div>

							<div className='col-md-1' />
						</div>
						{formik.values.list.length > 0 &&
							formik.values.list.map((drListComponents, index) => (
								// eslint-disable-next-line react/no-array-index-key
								<div className='row' key={index}>
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
													formik.setFieldValue(
														`list[${index}].account`,
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
									<div className='col-md-4'>
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
												isTouched={formik.touched.voucher_no}
												invalidFeedback={
													formik.errors[`list[${index}]description`]
												}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									<div className='col-md-2'>
										<FormGroup
											id={`list[${index}].dr`}
											label='amount'
											isFloating>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												placeholder='amount'
												readOnly={drListComponents.dr === 0}
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
									<div className='col-md-2'>
										<FormGroup
											id={`list[${index}].cr`}
											label='amount'
											isFloating>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												placeholder='amount'
												readOnly={drListComponents.cr === 0}
												onBlur={formik.handleBlur}
												value={drListComponents.cr}
												onChange={formik.handleChange}
												isValid={formik.isValid}
												isTouched={formik.touched.voucher_no}
												invalidFeedback={formik.errors[`list[${index}]cr`]}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									<div className='col-md-1'>
										<button
											type='button'
											className='secondary'
											onClick={() => removeRow(index)}>
											X
										</button>
									</div>
								</div>
							))}

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
									Add Dr
								</Button>
							</div>
							<div className='col-md-2'>
								<Button
									color='primary'
									onClick={() => {
										formik.setFieldValue('list', [
											...formik.values.list,
											{
												account: null,
												description: '',
												dr: 0,
												cr: '',
											},
										]);
									}}>
									Add Cr
								</Button>
							</div>
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
		</div>
	);
};

export default EditModernPage;
