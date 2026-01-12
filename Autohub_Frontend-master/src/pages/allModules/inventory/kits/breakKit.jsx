// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-undef */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
// eslint-disable-next-line import/no-unresolved
import apiClient from '../../../../baseURL/apiClient';
import showNotification from '../../../../components/extras/showNotification';
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
	const errors = {};
	if (!values.out_flow) {
		errors.out_flow = 'Required';
	}
	if (!values.kit_id) {
		errors.kit_id = 'Required';
	}
	if (!values.store_id) {
		errors.store_id = 'Required';
	}
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
	const [tableDataLoading, setTableDataLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeOptionsLoading, setStoreOptionsLoading] = useState(false);
	const [kitsAvailableOptions, setKitsAvailableOptions] = useState([]);
	const [kitsAvailableOptionsLoading, setKitsAvailableOptionsLoading] = useState(false);

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
			in_flow: 0,
			kit_id: '',
			out_flow: '',
			store_id: '',
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
			.post(`/breakKit`, myFormik.values, {
				headers: { Authorization: `Bearer ${0}` },
			})
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();
					showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
					showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				showNotification(_titleError, err.message, 'Danger');

				setIsLoading(false);
			});
	};
	// useEffect(() => {
	// 	if (formik.values.id && formik.values.store_id) {
	// 		apiClient
	// 			.get(
	// 				`/availableKits?id=${formik.values.id ? formik.values.id : ''}&store_id=${
	// 					formik.values.store_id
	// 				}`,
	// 				{},
	// 			)
	// 			.then((response) => {
	// 				console.log('avkit', response.data);
	// 				const rec = response.data.kits_available1.map(
	// 					({ id, quantity, item, setsname, kitchild }) => ({
	// 						id: kitchild?.setsname.id,
	// 						value: id,
	// 						// oem: `${item.machine_part_oem_part.oem_part_number.number1}`,
	// 						// name: `${item.machine_part_oem_part.machine_part.name}`,
	// 						// reqQty: quantity,
	// 						exisQty: quantity ?? 0,
	// 					}),
	// 				);
	// 				setTableData(rec);
	// 				setTableDataLoading(false);
	// 			})
	// 			.catch((err) => {
	// 				showNotification(_titleError, err.message, 'Danger');
	// 			});
	// 	}
	// }, [formik.values.id, formik.values.store_id]);
	useEffect(() => {
		if (formik.values.kit_id && formik.values.store_id) {
			apiClient
				.get(
					`/viewKits?id=${formik.values.kit_id ? formik.values.kit_id : ''}&store_id=${
						formik.values.store_id
					}`,
				)
				.then((response) => {
					// console.log('view::', response);
					const rec = response.data.kitRecipe.kitchild2.map(
						({ id, item, exisiting_item_inventory, quantity }) => ({
							id,
							value: id,
							name: item.machine_part_oem_part.machine_part?.name ?? 'null name',
							reqQty: quantity,
							existingQty: exisiting_item_inventory?.existing_quantity ?? 0,
						}),
					);
					// console.log('');
					setTableData(rec);
					setTableDataLoading(false);
				})
				.catch((err) => {
					showNotification(_titleError, err.message, 'Danger');
				});
		}
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
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);
	useEffect(() => {
		setKitsAvailableOptionsLoading(true);

		apiClient
			.get(`/availableKits`)
			.then((response) => {
				console.log('avkit22', response.data);

				setKitsAvailableOptions(response.data.kits_available ?? 0);
				setKitsAvailableOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);
	const getExistingKitDD = (idd) => {
		setKitOptionsLoading(true);
		apiClient
			.get(`/getkitsExistingQtyDropdown?store_id=${idd}`)
			.then((response) => {
				console.log('...', response.data);
				const rec = response.data.kitsDropdown.map(({ id, name, setsname, kitchild }) => ({
					id: kitchild.setsname.id,
					value: id,
					label: `${kitchild.setsname.name}`,
				}));
				setKitOptions(rec);
				setKitOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='danger'
					isLight
					icon='Break'
					hoverShadow='default'
					onClick={() => {
						initialStatus();

						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Break Kit
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
					<CardLabel icon='Minus'>
						<ModalTitle id='exampleModalLabel'>Break Kit</ModalTitle>
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
														setTableData(['']),
													);
													getExistingKitDD(val === null ? '' : val.id);
												}}
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
										<FormGroup label='Kit Name' id='id'>
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
																	c.value ===
																	formik.values.kit_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'kit_id',
														val !== null && val.id,
														setTableData(['']),
													);
												}}
												isValid={formik.isValid}
												isTouched={formik.touched.id}
												invalidFeedback={formik.errors.id}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										{formik.errors.id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.id}
											</p>
										)}

										<table className='table table-modern my-3'>
											<thead>
												<tr>
													<th>Oem</th>
													<th>Items</th>
													<th>Required Quantity</th>
													<th>Exisiting Quantity</th>
												</tr>
											</thead>
											{tableDataLoading ? (
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
													{tableData.map((item) => (
														<tr key={item.id}>
															<td>{item.oem}</td>
															<td>{item.name}</td>
															<td>{item.reqQty}</td>
															<td>{item.existingQty}</td>
														</tr>
													))}
												</tbody>
											)}
										</table>
										<div className='row '>
											<FormGroup label='' className='col-md-6 mt-2 ml-5 '>
												<Label> Kit Quantity(Break Kit)</Label>
											</FormGroup>

											<FormGroup id='out_flow' label='' className='col-md-5'>
												<Input
													type='number'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.out_flow}
													isValid={formik.isValid}
													isTouched={formik.touched.out_flow}
													invalidFeedback={formik.errors.out_flow}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
										<div className='row mt-2'>
											<FormGroup label='' className='col-md-6 mt-2 ml-5 '>
												<Label> Available Kits(Break Kit)</Label>
											</FormGroup>
											<FormGroup className='col-md-5'>
												<div>
													{kitsAvailableOptions.kits_available ?? 0}
												</div>
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
