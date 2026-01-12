// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import { baseURL } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// eslint-disable-next-line import/no-unresolved
import apiClient from '../../../../baseURL/apiClient';
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
import Label from '../../../../components/bootstrap/forms/Label';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	let errors = {};
	if (!values.in_flow) {
		errors.in_flow = 'Required';
	}
	if (!values.kit_id) {
		errors.kit_id = 'Required';
	}
	if (!values.store_id) {
		errors.store_id = 'Required';
	}
	values.tableData.forEach((data, index) => {
		if (Number(data.existingQty) < Number(data.reqQty) * Number(values.in_flow)) {
			errors = {
				...errors,
				[`childArray[${index}]existingQty`]: 'Insufficient Qty!',
			};
		}
		// console.log(Number(data.existingQty), 'Number(data.existingQty)');
	});

	console.log(errors);
	return errors;
};

const Add = ({ refreshTableData }) => {
	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [kitOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	// const [kitOptions, setKitOptions] = useState([]);
	// const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [storeOptions, setStoreOptions] = useState('');
	const [storeOptionsLoading, setStoreOptionsLoading] = useState(false);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};
	// console.log('formik', formik.values);

	const customStyles = {
		option: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
		singleValue: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
	  };
	const formik = useFormik({
		initialValues: {
			in_flow: '',
			kit_id: '',
			out_flow: 0,
			store_id: '',
			inStockKits: '',
			tableData: [],
			tableDataLoading: false,
			inStockKitsLoading: false,
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
			.post(`/makeKit`, myFormik.values, {
				headers: { Authorization: `Bearer ${0}` },
			})
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
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
		if (formik.values.kit_id && formik.values.store_id) {
			formik.setFieldValue('inStockKitsLoading', true);

			apiClient
				.get(
					`/viewKits?id=${formik.values.kit_id ? formik.values.kit_id : ''}&store_id=${
						formik.values.store_id
					}`,
				)
				.then((response) => {
					// console.log('view::', response);
					const rec =
						response.data.kitRecipe.machine_part_oem_part.machine_part.kitchild.map(
							({ id, item, exisiting_item_inventory, quantity }) => ({
								id,
								value: id,
								name: item.machine_part_oem_part.machine_part?.name ?? 'None',
								reqQty: quantity,
								existingQty: exisiting_item_inventory?.existing_quantity ?? 0,
							}),
						);
					// console.log('');
					formik.setFieldValue('inStockKitsLoading', false);
					formik.setFieldValue('tableDataLoading', false);
					formik.setFieldValue(
						'inStockKits',
						response.data.kitRecipe.existing_set_inventory?.existing_set_quantity ?? 0,
					);
					formik.setFieldValue('tableData', rec);
				})
				.catch((err) => {
					// console.log(err.message);
					// showNotification(_titleError, err.message, 'Danger');
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.kit_id, formik.values.store_id]);
	useEffect(() => {
		setStoreOptionsLoading(true);

		apiClient
			.get(`/getStoredropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreOptions(rec);
				setStoreOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});

		apiClient
			.get(`/getItemOemDropDown?type_id=2`)
			.then((response) => {
				// console.log('bmk::', response.data);
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setKitOptions(rec);
				setKitOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// const getSetByStore = (idd) => {
	// 	setKitOptionsLoading(true);
	// 	apiClient
	// 		.get(`/getSetsByStore?store_id=${idd}`)
	// 		.then((response) => {
	// 			console.log('...', response.data);
	// 			const rec = response.data.machine_Parts.map(({ id, name }) => ({
	// 				id,
	// 				value: id,
	// 				label: name,
	// 			}));
	// 			setKitOptions(rec);
	// 			setKitOptionsLoading(false);
	// 		})
	// 		// eslint-disable-next-line no-console
	// 		.catch((err) => {});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// };

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='success'
					isLight
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();

						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Make New Kit
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='md'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Make New Kit</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
										<FormGroup label='Store' id='name'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={storeOptions}
												isLoading={storeOptionsLoading}
												isClearable
												value={
													formik.values.store_id
														? storeOptions.find(
																(c) =>
																	c.value ===
																	formik.values.store_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'store_id',
														val !== null && val.id,
														formik.setFieldValue('tableData', []),
													);
													// getSetByStore(val === null ? '' : val.id);
												}}
												styles={customStyles}
											/>
										</FormGroup>
										{formik.errors.store_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.store_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup label='Set Name' id='kit_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={kitOptions}
												isLoading={kitOptionsLoading}
												isClearable
												value={
													formik.values.kit_id
														? kitOptions.find(
																(c) =>
																	c.id === formik.values.kit_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'kit_id',
														val !== null && val.id,
														formik.setFieldValue('tableData', []),
													);
												}}
												isValid={formik.isValid}
												isTouched={formik.touched.kit_id}
												invalidFeedback={formik.errors.kit_id}
												validFeedback='Looks good!'
												styles={customStyles}
											/>
										</FormGroup>
										{formik.errors.kit_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.kit_id}
											</p>
										)}
										<table className='table table-modern my-3'>
											<thead>
												<tr>
													{/* <th>Oem</th> */}
													<th>Items</th>
													<th>Required Quantity</th>
													<th>Exisiting Quantity</th>
												</tr>
											</thead>
											{formik.values.tableDataLoading ? (
												<tbody>
													<tr>
														<td colSpan='12'>
															<div className='d-flex justify-content-center'>
																<Spinner
																	color='primary'
																	size='3rem'
																/>
															</div>
														</td>
													</tr>
												</tbody>
											) : (
												<tbody>
													{formik.values.tableData.map((item, index) => (
														<tr key={item.id}>
															{/* <td>{item.oem}</td> */}
															<td>{item.name}</td>
															<td>
																{item.reqQty}*{' '}
																{formik.values.in_flow}=
																{item.reqQty *
																	formik.values.in_flow ?? 0}
															</td>
															<td>
																{item.existingQty}
																{formik.errors[
																	`childArray[${index}]existingQty`
																] && (
																	// <div className='invalid-feedback'>
																	<p
																		style={{
																			color: 'red',
																			textAlign: 'left',
																			marginTop: 3,
																		}}>
																		{
																			formik.errors[
																				`childArray[${index}]existingQty`
																			]
																		}
																	</p>
																)}
															</td>
														</tr>
													))}
												</tbody>
											)}
										</table>
										<div className='row '>
											<FormGroup label='' className='col-md-6 mt-2 ml-6 '>
												<Label>In Stock</Label>
											</FormGroup>
											<FormGroup label='' className='col-md-6 mt-2 ml-6 '>
												<Label> Kit Quantity(Make Kit)</Label>
											</FormGroup>

											<FormGroup id='in_flow' label='' className='col-md-6'>
												<Label>
													{formik.values.inStockKitsLoading ? (
														<h3>...</h3>
													) : (
														<h3>{formik.values.inStockKits}</h3>
													)}
												</Label>
											</FormGroup>
											<FormGroup id='in_flow' label='' className='col-md-6'>
												<Input
													type='number'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.in_flow}
													isValid={formik.isValid}
													isTouched={formik.touched.in_flow}
													invalidFeedback={formik.errors.in_flow}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
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
										icon={isLoading ? null : 'Submit'}
										isLight
										color='success'
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading ? 'Submiting' : 'Submit'}
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
