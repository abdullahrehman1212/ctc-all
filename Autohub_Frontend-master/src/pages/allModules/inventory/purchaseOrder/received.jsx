// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/no-array-index-key */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/jsx-no-bind */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import moment from 'moment';
import { TagsInput } from 'react-tag-input-component';
// eslint-disable-next-line import/no-unresolved
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import ReactSelect, { createFilter } from 'react-select';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

import Spinner from '../../../../components/bootstrap/Spinner';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import AddRack from './AddRack';
import showNotification from '../../../../components/extras/showNotification';
import Add from '../Racks/add';
import AddShelf from '../Shelves/add';

const validate = (values) => {
	let errors = {};
	if (!values.po_no) {
		errors.po_no = 'Required';
	}
	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	// if (!values.description) {
	// 	errors.description = 'Required';
	// }
	if (!values.store_id) {
		errors.store_id = 'Required';
	}
	if (!values.received_date) {
		errors.received_date = 'Required';
	}
	if (!values.childArray?.length > 0) {
		errors.childArray = 'Choose Items In list';
	}
	if (!values.total) {
		errors.total = 'Required';
	}
	if (!values?.dollar_rate) {
		errors.total = 'Required';
	}

	if (!values.total_after_discount) {
		errors.total_after_discount = 'Required';
	}

	values.childArray?.forEach((data, index) => {
		if (data.rackShelf.length > 0) {
			values.received_quantity = undefined;
		}
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}

		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
		if (!Number(data.purchase_price) > 0) {
			errors = {
				...errors,
				[`childArray[${index}]purchase_price`]: 'Required',
			};
		}

		// if (!data.received_quantity) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]received_quantity`]: 'Required',
		// 	};
		// }

		if (Number(data.received_quantity) > Number(data.quantity)) {
			errors = {
				...errors,
				[`childArray[${index}]received_quantity`]: 'Exceeds limit',
			};
		}

		const totalRackShelfQuantity = data.rackShelf.reduce(
			(total, rack) => total + rack.quantity,
			0,
		);
		data.rackShelf.forEach((rack, rackIndex) => {
			if (totalRackShelfQuantity > Number(data.received_quantity)) {
				errors = {
					...errors,
					[`childArray[${index}].rackShelf[${rackIndex}].quantity`]:
						'Should not be greater then received quantity',
				};
			}
		});
		if (totalRackShelfQuantity > Number(data.received_quantity)) {
			// errors = {
			//     ...errors,
			//     [`childArray[${index}]rackShelf`]: 'Total quantity exceeds received quantity',
			// };
			// errors = {
			// 	...errors,
			// 	[`childArray[${index}]received_quantity`]: 'cannot be greater'
			// };
		}
	});
	values.expenseList?.forEach((data, index) => {
		if (!data.coa_account_id) {
			errors = {
				...errors,
				[`expenseList[${index}]coa_account_id`]: 'Required!',
			};
		}
		if (!data.expense_type_id) {
			errors = {
				...errors,
				[`expenseList[${index}]expense_type_id`]: 'Required!',
			};
		}
		if (!data.description) {
			errors = {
				...errors,
				[`expenseList[${index}]description`]: 'Required!',
			};
		}
		if (!data.amount) {
			errors = {
				...errors,
				[`expenseList[${index}]amount`]: 'Required!',
			};
		}
	});
	console.log(errors);
	return errors;
};

const Received = ({ recievedItem, handleStateRecieved, setSelectedStore, setSelectedName }) => {
	const [counter, setCounter] = useState(0);
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const [reload, setReload] = useState(0);
	const [reLoadPrice, setReLoadPrice] = useState(0);
	const [reload2, setReload2] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [completeLoading, setCompleteLoading] = useState(false);
	const [lastCompleteSave, setLastCompleteSave] = useState(null);
	const [kitEditOptions, setItemOptions] = useState([]);
	const [editItemOptionsLoading, setEditItemOptionsLoading] = useState(true);
	const [itemOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [storeOptions, setStoreOptions] = useState([]);
	const [storeLoading, setStoreLoading] = useState(false);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [expAccountsOptions, setExpAccountsOptions] = useState([]);
	const [expAccountOptionsLoading, setExpAccountOptionsLoading] = useState(true);
	const [expTypesOptions, setExpTypesOptions] = useState([]);
	const [expTypesOptionsLoading, setExpTypesOptionsLoading] = useState(true);
	const [shelfOptionsLoading, setShelfOptionsLoading] = useState(false);
	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);
	const formik = useFormik({
		initialValues: { ...recievedItem, totalExpenses: 0 },

		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const removeRow = (i) => {
		formik
			.setFieldValue('childArray', [
				...formik.values.childArray.slice(0, i),
				...formik.values.childArray.slice(i + 1),
			])
			.then(setReload(reload + 1));
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};

	const addRow = (childIndex) => {
		const updatedChildArray = formik.values.childArray.map((item, index) => {
			if (index === childIndex) {
				const newRackNumbers = [
					...item.rackShelf,
					{ rack_id: '', shelf_id: '', quantity: 0 },
				];
				return {
					...item,
					rackShelf: newRackNumbers,
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};
	const removeRackRow = (childIndex, rackIndex) => {
		const updatedChildArray = formik.values.childArray.map((item, index) => {
			if (index === childIndex) {
				return {
					...item,
					rackShelf: item.rackShelf.filter((rack, idx) => idx !== rackIndex),
				};
			}
			return item;
		});

		formik.setFieldValue('childArray', updatedChildArray);
		setReload(reload + 1);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};

	const submitForm = (data) => {
		apiClient
			.post(`/receivePurchaseOrder`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					setSelectedStore('');
					setSelectedName('');
					formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateRecieved(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setIsLoading(false);
			});
	};
	const handleSave = () => {
		submitForm(formik.values);

		setLastSave(moment());
		setLastCompleteSave(moment());
	};

	const removeRowExpenses = (i) => {
		formik.setFieldValue('expenseList', [
			...formik.values.expenseList.slice(0, i),
			...formik.values.expenseList.slice(i + 1),
		]);
		setTriggerCalculateExpenses(triggerCalculateExpenses + 1);
	};
	useEffect(() => {
		apiClient
			.get(`/getAccountsBySubGroup?coa_sub_group_id=5`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions(rec);
				setCrAccountLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getExpenseTypesDropDown`)
			.then((response) => {
				const rec = response.data?.expensetypes?.map(({ id, name }) => ({
					id,
					value: id,
					label: `${name}`,
				}));
				setExpTypesOptions(rec);
				setExpTypesOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		apiClient
			.get(`/getAccountsBySubGroup?coa_sub_group_id=8`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setExpAccountsOptions(rec);
				setExpAccountOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refreshTableData = () => {
		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setItemOptions(rec);
				setEditItemOptionsLoading(false);
			})
			.catch((err) => {
				// Handle error
			});
	};

	useEffect(() => {
		refreshTableData();
	}, []);

	// person dropdown
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
				setSupplierDropDown(rec);
				setSupplierDropDownLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
					// Cookies.remove('userToken');
					// navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	// store dropdown
	useEffect(() => {
		apiClient
			.get(`/getStoredropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));

				formik.setFieldValue('store_id', rec[0] !== null ? rec[0].id : '');
				getRacks(rec[0].id);
				setStoreOptions(rec);
				setStoreLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [allShelves, setAllShelves] = useState([]);

	useEffect(() => {
		// Fetch shelves data once
		apiClient
			.get(`/getShelvesDropdown`)
			.then((response) => {
				const shelves = response.data.shelves.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));
				setAllShelves(shelves);
				console.log(shelves);
			})
			.catch((error) => {
				console.error('Error fetching shelves data:', error);
			});
	}, [counter]);
	function getRacks(storeId) {
		setRackOptionsLoading(true);

		// formik.setFieldValue('rackShelf', []);
		formik.setFieldValue('shelf_numbers', []); // Clear shelf_numbers field when new storeId is selected
		formik.setFieldValue('shelfOptions', []); // Clear shelf_numbers field when new storeId is selected

		apiClient
			.get(`/getRackDropDown`, { params: { store_id: storeId } })
			.then((response) => {
				const filteredRacks = response.data.racks.filter(
					(rack) => rack.store_id === storeId,
				);
				const rec = filteredRacks.map((rack) => ({
					id: rack.id,
					value: rack.id,
					label: rack.rack_number,
				}));
				setRackOptions(rec);
				setRackOptionsLoading(false);
			})
			.catch((error) => {
				// console.error('Error fetching rack data:', error);
				setRackOptions([]);
				setRackOptionsLoading(false);
			});
	}

	useEffect(() => {
		getRacks(formik.values?.store_id);
	}, [counter]);
	function getShelves(rackId, index, rackIndex) {
		formik.setFieldValue('shelfOptions', []);

		apiClient
			.get(`/getShelvesDropdown`, { params: { id: rackId } })
			.then((response) => {
				const shelves = response.data.shelves.map((shelf) => ({
					id: shelf.id,
					value: shelf.id,
					label: shelf.shelf_number,
				}));
				setAllShelves(shelves);
				// if (shelves.length > 0) {
				formik
					.setFieldValue(`childArray[${index}]rackShelf[${rackIndex}]shelves`, shelves)
					.then(() => {
						// console.log(formik.values);
					});
				// }
				// console.log(formik.values);
			})
			.catch((error) => {
				// console.error('Error fetching shelf data:', error);
			});
	}

	// items
	useEffect(() => {
		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setKitOptions(rec);
				setKitOptionsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	}, []);

	useEffect(() => {
		let t = 0;
		formik?.values.childArray?.forEach((item) => {
			t += Number(item.amount);
			formik.setFieldValue('total', Number(t));
			formik.setFieldValue('tax_in_figure', (formik.values.tax / 100) * Number(t));
			formik.setFieldValue(
				'total_after_discount',
				Number(t) +
					Number((formik.values.tax / 100) * Number(t)) -
					Number(formik.values.discount),
			);
			formik.setFieldValue(
				'total_after_tax',
				(formik.values.tax / 100) * Number(t) + Number(t),
			);
		});
	}, [reload]);

	useEffect(() => {
		calculateExpenses();
	}, [triggerCalculateExpenses]);
	useEffect(() => {
		calculateExpenses();
	}, [formik.values.totalExpenses]);
	useEffect(() => {
		calculateExpenses();
	}, [formik.values.total]);
	const calculateExpenses = () => {
		const t =
			formik.values.expenseList !== null
				? parseFloat(
						formik.values.expenseList?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
							0,
						),
				  )
				: 0;
		formik.setFieldValue('totalExpenses', t);
		const myArray = [];
		formik.values.childArray?.forEach((item, index) => {
			myArray.push({
				...item,
				percentAge: (item.amount * 100) / Number(formik.values.total) || 0,
				cost: (((item.amount * 100) / formik.values.total) * t) / 100 ?? 0,
				costPerItem:
					((((item.amount * 100) / formik.values.total) * t) /
						100 /
						item.received_quantity ??
						0) ||
					0,
				// costPerItem:
				// 	((item.amount * 100 ?? 0 / formik.values.total ?? 1) * t) /
				// 	100 /
				// 	item.received_quantity,
			});
		});
		formik.setFieldValue('childArray', myArray);
	};

	useEffect(() => {
		let arr = [];
		arr = formik.values.childArray;
		arr?.forEach((data) => {
			data.purchase_price = Number(data.dollar_price) * Number(formik.values.dollar_rate);
			data.amount =
				Number(data.received_quantity ?? 0) *
				Number(data.dollar_price) *
				Number(formik.values.dollar_rate);
		});
		formik.setFieldValue(`childArray`, arr);

		setReload(reload + 1);
	}, [reLoadPrice]);

	return (
		<div className='col-12'>
			<ModalBody>
				<div className='col-12'>
					<Card stretch tag='form' onSubmit={formik.handleSubmit}>
						<CardBody>
							<div className='row g-2  d-flex justify-content-start'>
								<div className='col-md-2'>
									<FormGroup id='po_no' label='PO NO' className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.po_no}
											isValid={formik.isValid}
											isTouched={formik.touched.po_no}
											invalidFeedback={formik.errors.po_no}
										/>
									</FormGroup>
								</div>
								<div className='col-md-4'>
									<FormGroup
										id='supplier_id'
										label='Supplier'
										className='col-md-12'>
										<ReactSelect
											className='col-md-12'
											isClearable
											isDisabled
											isLoading={supplierDropDownLoading}
											options={supplierDropDown}
											value={
												formik.values.supplier_id
													? supplierDropDown?.find(
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
											}}
											invalidFeedback={formik.errors.supplier_id}
										/>
									</FormGroup>
									{formik.errors.supplier_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.supplier_id}
										</p>
									)}
								</div>
								<div className='col-md-4'>
									<FormGroup label='Store' id='store_id'>
										<ReactSelect
											className='col-md-12'
											classNamePrefix='select'
											options={storeOptions}
											isLoading={storeLoading}
											isClearable
											value={
												formik.values.store_id
													? storeOptions.find(
															(c) =>
																c.value === formik.values.store_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'store_id',
													val !== null ? val.id : '',
												);
												getRacks(val.id);
											}}
											isValid={formik.isValid}
											isTouched={formik.touched.store_id}
											invalidFeedback={formik.errors.store_id}
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
							</div>

							<div className='row g-2 mt-2  d-flex justify-content-start'>
								<div className='col-md-2'>
									<FormGroup id='request_date' label='Request Date'>
										<Input
											readOnly
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.request_date}
											isValid={formik.isValid}
											isTouched={formik.touched.request_date}
											invalidFeedback={formik.errors.request_date}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='received_date' label='Received Date'>
										<Input
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.received_date}
											isValid={formik.isValid}
											isTouched={formik.touched.received_date}
											invalidFeedback={formik.errors.received_date}
										/>
									</FormGroup>
								</div>
								<div className='col-md-4'>
									<FormGroup id='remarks' label='Remarks' className='col-md-12'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.remarks}
											isValid={formik.isValid}
											isTouched={formik.touched.remarks}
											invalidFeedback={formik.errors.remarks}
										/>
									</FormGroup>
									{formik.errors.remarks && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.remarks}
										</p>
									)}
								</div>
								{formik.values.dollar_rate === null ? (
									<div className='col-md-4'>
										<FormGroup
											id='dollar_rate'
											label='Dollar Rate (PKR)'
											className='col-md-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onChange={(val) => {
													formik.setFieldValue(
														'dollar_rate',
														val.target.value,
													);
													setReLoadPrice(reLoadPrice + 1);
													setReload(reload + 1);
												}}
												onBlur={formik.handleBlur}
												value={formik.values.dollar_rate}
												isValid={formik.isValid}
												isTouched={formik.touched.dollar_rate}
												invalidFeedback={formik.errors.dollar_rate}
											/>
										</FormGroup>
										{formik.errors.dollar_rate && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.dollar_rate}
											</p>
										)}
									</div>
								) : (
									<div className='col-md-4'>
										<FormGroup
											id='dollar_rate'
											label='Dollar Rate (PKR)'
											className='col-md-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onChange={(val) => {
													formik.setFieldValue(
														'dollar_rate',
														val.target.value,
													);
													setReLoadPrice(reLoadPrice + 1);
													setReload(reload + 1);
												}}
												onBlur={formik.handleBlur}
												value={formik.values.dollar_rate}
												isValid={formik.isValid}
												isTouched={formik.touched.dollar_rate}
												invalidFeedback={formik.errors.dollar_rate}
											/>
										</FormGroup>
										{formik.errors.dollar_rate && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.dollar_rate}
											</p>
										)}
									</div>
								)}
							</div>
							<hr />
							{/* <CardBody className='table-responsive'> */}
							<table className='table text-center '>
								<thead>
									<tr className='row'>
										<th className='col-md-4'>Items</th>
										<th className='col-md-3'>
											<div className='d-flex justify-content-around'>
												<div>Price ($)</div>
												<div>Purchase Price(PKR)</div>
											</div>
										</th>
										<th className='col-md-2' style={{ paddingLeft: '90px' }}>
											Sale Price
										</th>
										<th className='col-md-1'>Cost(PKR)</th>
										<th className='col-md-1'>Amount</th>
										<th className='col-md-1'>Remove</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr className='row mt-2 ' key={items.index}>
												<td className='col-md-3  border-start border-end '>
													<div>
														<FormGroup
															size='sm'
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect
																className='col-md-12'
																menuIsOpen={false}
																styles={customStyles}
																classNamePrefix='select'
																options={itemOptions}
																isLoading={kitOptionsLoading}
																value={
																	formik.values.childArray[index]
																		.item_id
																		? itemOptions.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.childArray[
																						index
																					].item_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].item_id`,
																		val !== null && val.id,
																	);
																}}
																isValid={formik.isValid}
																isTouched={formik.touched.item_id}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}].item_id`
																	]
																}
																filterOption={createFilter({
																	matchFrom: 'start',
																})}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]item_id`
														] && (
															// <div className='invalid-feedback'>
															<div
																style={{
																	color: '#ef4444',
																	textAlign: 'center',
																	fontSize: '0.875em',
																	marginTop: '0.25rem',
																}}>
																{
																	formik.errors[
																		`childArray[${index}]item_id`
																	]
																}
															</div>
														)}
													</div>
													<div>
														<FormGroup
															id={`childArray[${index}].remarks`}
															label='Remarks'
															size='sm'
															className='col-md-12'>
															<Input
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={items.remarks}
																isValid={formik.isValid}
																isTouched={formik.touched.remarks}
																invalidFeedback={
																	formik.errors.remarks
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]remarks`
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
																		`childArray[${index}]remarks`
																	]
																}
															</p>
														)}
													</div>
												</td>
												<td className='col-md-5  border-start border-end '>
													<div className='row mt-1'>
														<div className='col-md-6'>
															<FormGroup
																size='sm'
																id={`childArray[${index}].dollar_price`}
																label=''
																className='col-md-12'>
																<Input
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onFocus={(e) =>
																		e.target.select()
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`childArray[${index}].dollar_price`,
																			val.target.value,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			val.target.value *
																				(formik.values
																					.dollar_rate ??
																					0) *
																				(formik.values
																					.childArray[
																					index
																				]
																					.received_quantity ??
																					0),
																		);
																		setReLoadPrice(
																			reLoadPrice + 1,
																		);
																	}}
																	onBlur={formik.handleBlur}
																	value={items.dollar_price}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.dollar_price
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]dollar_price`
																		]
																	}
																/>
															</FormGroup>
														</div>
														<div className='col-md-6'>
															<FormGroup
																size='sm'
																id={`childArray[${index}].purchase_price`}
																label=''
																className='col-md-12'>
																<Input
																	readOnly
																	type='number'
																	onFocus={(e) =>
																		e.target.select()
																	}
																	onWheel={(e) => e.target.blur()}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`childArray[${index}].purchase_price`,
																			val.target.value,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			val.target.value *
																				(formik.values
																					.childArray[
																					index
																				]
																					.received_quantity ??
																					0),
																		);

																		setReload(reload + 1);
																	}}
																	onBlur={formik.handleBlur}
																	value={
																		formik.values.childArray[
																			index
																		].purchase_price
																	}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.purchase_price
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]purchase_price`
																		]
																	}
																/>
															</FormGroup>
														</div>
													</div>
													<div className='row mt-1'>
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].quantity`}
																label='Qty'
																size='sm'
																className='col-md-12'>
																<Input
																	readOnly
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={items.quantity}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.quantity
																	}
																	invalidFeedback={
																		formik.errors.quantity
																	}
																/>
															</FormGroup>
															{formik.errors[
																`childArray[${index}]quantity`
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
																			`childArray[${index}]quantity`
																		]
																	}
																</p>
															)}
														</div>
														<div className='col-md-6'>
															<FormGroup
																id={`childArray[${index}].received_quantity`}
																label='Received Qty'
																size='sm'
																className='col-md-12'>
																<Input
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onFocus={(e) =>
																		e.target.select()
																	}
																	onChange={(val) => {
																		const receivedQuantity =
																			parseFloat(
																				val.target.value,
																			); // Parse value to number
																		formik.setFieldValue(
																			`childArray[${index}].received_quantity`,
																			receivedQuantity,
																		);
																		formik.setFieldValue(
																			`childArray[${index}].amount`,
																			receivedQuantity *
																				(formik.values
																					.childArray[
																					index
																				].purchase_price ??
																					0),
																		);

																		setReload(reload + 1);
																		// setReload2(reload2 + 1);
																	}}
																	onBlur={formik.handleBlur}
																	value={items.received_quantity}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
																					index
																			  ]?.received_quantity
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`childArray[${index}]received_quantity`
																		]
																	}
																/>
															</FormGroup>
														</div>
													</div>

													<div className='row justify-content-between mt-5'>
														<div className='col'>
															<h4>Rack and Shelves</h4>
														</div>
														<div className='col-auto'>
															<div className='d-flex justify-content-end'>
																<Add
																	setCounter={setCounter}
																	counter={counter}
																	getRacks={getRacks}
																	storeId={
																		formik.values?.store_id
																	}
																	show={1}
																/>
																<AddShelf
																	counter1={counter}
																	getShelves={getShelves}
																	storeId={
																		formik.values?.store_id
																	}
																	show={1}
																/>
															</div>
														</div>
													</div>
													<table>
														{formik.values.childArray[
															index
														].rackShelf?.map((rack, rackIndex) => (
															<tr
																className='row mt-2 '
																key={rackIndex}>
																<td className='col-md-4 border-start border-end'>
																	<div>
																		<FormGroup
																			size='sm'
																			label='Rack'
																			id={`childArray[${index}].rackShelf[${rackIndex}].rack_id`}>
																			<ReactSelect
																				className='col-md-12'
																				// menuIsOpen={false}
																				styles={
																					customStyles
																				}
																				classNamePrefix='select'
																				options={
																					rackOptions
																				}
																				isLoading={
																					rackOptionsLoading
																				}
																				value={
																					rack.rack_id
																						? rackOptions.find(
																								(
																									c,
																								) =>
																									c.value ===
																									rack.rack_id,
																						  )
																						: null
																				}
																				onChange={(val) => {
																					formik.setFieldValue(
																						`childArray[${index}].rackShelf[${rackIndex}].rack_id`,
																						val !== null
																							? val.id
																							: '',
																					);
																					getShelves(
																						val?.id,
																						index,
																						rackIndex,
																					);
																				}}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched[
																						`childArray[${index}].rackShelf[${rackIndex}].rack_id`
																					]
																				}
																				invalidFeedback={
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].rack_id`
																					]
																				}
																				filterOption={createFilter(
																					{
																						matchFrom:
																							'start',
																					},
																				)}
																			/>
																		</FormGroup>
																		{formik.errors[
																			`childArray[${index}].rackShelf[${rackIndex}].rack_id`
																		] && (
																			<div
																				style={{
																					color: '#ef4444',
																					textAlign:
																						'center',
																					fontSize:
																						'0.875em',
																					marginTop:
																						'0.25rem',
																				}}>
																				{
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].rack_id`
																					]
																				}
																			</div>
																		)}
																	</div>
																</td>
																<td className='col-md-4 border-start border-end'>
																	{/* {1 && ( */}
																	<div>
																		{/* <FormGroup
																				size='sm'
																				label='Shelf'
																				id={`childArray[${index}].rackShelf[${rackIndex}].shelf_id`}>
																				<ReactSelect
																					className='col-md-12'
																					// isMulti
																					styles={
																						customStyles
																					}
																					classNamePrefix='select'
																					// options={allShelves.map(
																					// 	(item) =>
																					// 		item.rack_id ===
																					// 		rack.rack_id,
																					// )}
																					options={allShelves
																						.filter(
																							(
																								item,
																							) =>
																								item.id ===
																								rack.rack_id,
																						)
																						.map(
																							(
																								item,
																							) => ({
																								value: item.id,
																								label: item.label,
																							}),
																						)}
																					isLoading={
																						shelfOptionsLoading
																					}
																					value={
																						rack.shelf_id
																							? allShelves
																									.filter(
																										(
																											item,
																										) =>
																											item.id ===
																											rack.rack_id,
																									)
																									.find(
																										(
																											c,
																										) =>
																											c.value ===
																											rack.shelf_id,
																									)
																							: null
																					}
																					onChange={(
																						val,
																					) => {
																						formik.setFieldValue(
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`,
																							val !==
																								null
																								? val.id
																								: '',
																						);
																						// getShelves(
																						// 	val?.id,
																						// 	index,
																						// 	rackIndex,
																						// );
																					}}
																					isValid={
																						formik.isValid
																					}
																					isTouched={
																						formik
																							.touched[
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																						]
																					}
																					invalidFeedback={
																						formik
																							.errors[
																							`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																						]
																					}
																					filterOption={createFilter(
																						{
																							matchFrom:
																								'start',
																						},
																					)}
																				/>
																			</FormGroup> */}

																		<FormGroup
																			size='sm'
																			label='Shelf'
																			id={`childArray[${index}].rackShelf[${rackIndex}].shelf_id`}>
																			<ReactSelect
																				className='col-md-12'
																				styles={
																					customStyles
																				}
																				classNamePrefix='select'
																				options={
																					allShelves

																					// 	.filter(
																					// 		(item) =>
																					// 			item.id ===
																					// 			rack.rack_id,
																					// 	)
																					// 	.map(
																					// 		(item) => ({
																					// 			value: item.id,
																					// 			label: item.label,
																					// 		}),
																					// )
																				}
																				isLoading={
																					shelfOptionsLoading
																				}
																				value={
																					rack.shelf_id
																						? allShelves.find(
																								(
																									item,
																								) =>
																									item.id ===
																									rack.shelf_id,
																						  )
																						: null
																				}
																				onChange={(val) => {
																					formik.setFieldValue(
																						`childArray[${index}].rackShelf[${rackIndex}].shelf_id`,
																						val !== null
																							? val.value
																							: '',
																					);
																				}}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched[
																						`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																					]
																				}
																				invalidFeedback={
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																					]
																				}
																				filterOption={createFilter(
																					{
																						matchFrom:
																							'start',
																					},
																				)}
																			/>
																		</FormGroup>

																		{formik.errors[
																			`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																		] && (
																			<div
																				style={{
																					color: '#ef4444',
																					textAlign:
																						'center',
																					fontSize:
																						'0.875em',
																					marginTop:
																						'0.25rem',
																				}}>
																				{
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].shelf_id`
																					]
																				}
																			</div>
																		)}
																	</div>
																	{/* )} */}
																</td>

																<td className='col-md-3'>
																	<div className='col-md-12'>
																		<FormGroup
																			size='sm'
																			id={`childArray[${index}].rackShelf[${rackIndex}].quantity`}
																			label='Quantity'>
																			<Input
																				type='number'
																				onWheel={(e) =>
																					e.target.blur()
																				}
																				onChange={(e) => {
																					formik.handleChange(
																						e,
																					); // Call formik.handleChange with the event
																				}}
																				onBlur={
																					formik.handleBlur
																				}
																				value={
																					rack.quantity
																				}
																				invalidFeedback={
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].quantity`
																					]
																				}
																			/>
																		</FormGroup>
																		{formik.errors[
																			`childArray[${index}].rackShelf[${rackIndex}].quantity`
																		] && (
																			<div
																				style={{
																					color: '#ef4444',
																					textAlign:
																						'center',
																					fontSize:
																						'0.875em',
																					marginTop:
																						'0.25rem',
																				}}>
																				{
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].quantity`
																					]
																				}
																			</div>
																		)}
																	</div>
																</td>

																<td className='col-md-1 mt-4'>
																	<Button
																		isDisable={
																			formik.values.childArray
																				?.rackShelf
																				?.length === 1
																		}
																		icon='cancel'
																		color='danger'
																		onClick={() =>
																			removeRackRow(
																				index,
																				rackIndex,
																			)
																		}
																	/>
																</td>
															</tr>
														))}
													</table>
													<div className='col-m row  d-flex  justify-content-end  mt-1'>
														<Button
															className='col-md-2 '
															isDisable={
																formik.values.childArray?.rackShelf
																	?.length === 1
															}
															icon='add'
															color='success'
															onClick={() => addRow(index)}>
															Add
														</Button>
													</div>
												</td>
												<td className='col-md-1'>
													<div className='col-md-12'>
														<FormGroup
															size='sm'
															id={`childArray[${index}].sale_price`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
																value={items.sale_price}
																// isValid={formik.isValid}
																// isTouched={
																// 	formik.touched.childArray
																// 		? formik.touched.childArray[
																// 				index
																// 		  ]?.sale_price
																// 		: ''
																// }
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]sale_price`
																	]
																}
															/>
														</FormGroup>
													</div>
												</td>
												<td className='col-md-1 border-start border-end p-0 m-0'>
													{items.cost?.toLocaleString(undefined, {
														maximumFractionDigits: 2,
													}) ?? 0}
													<hr />
													{items.costPerItem?.toLocaleString(undefined, {
														maximumFractionDigits: 2,
													}) ?? 0}
													/Part
													<hr />
													{items.percentAge?.toLocaleString(undefined, {
														maximumFractionDigits: 2,
													}) || 0}{' '}
													%
												</td>
												<td className='col-md-1 align-items-center border-start border-end '>
													<strong>
														{(items.amount ?? 0).toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
														)}
													</strong>

													{formik.errors[
														`childArray[${index}]amount`
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
																	`childArray[${index}]amount`
																]
															}
														</p>
													)}
												</td>

												<td className='col-md-1 mt-1'>
													<Button
														isDisable={
															formik.values.childArray.length === 1
														}
														icon='cancel'
														color='danger'
														onClick={() => removeRow(index)}
													/>
												</td>
											</tr>
										))}
								</tbody>
							</table>
							<hr />
							<div className='row g-2  d-flex justify-content-start mt-2'>
								<div className='col-md-2'>
									<FormGroup id='total' label='Total' className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.total}
											isValid={formik.isValid}
											isTouched={formik.touched.total}
											invalidFeedback={formik.errors.total}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup id='discount' label='Discount' className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												formik.setFieldValue('discount', e.target.value);
												formik.setFieldValue(
													'total_after_discount',
													formik.values.total_after_tax - e.target.value,
												);
											}}
											onBlur={formik.handleBlur}
											value={formik.values.discount}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2 justify-content-center'>
									<FormGroup
										id='total_after_discount'
										label='Total after discount'
										className='col-md-12'>
										<strong>
											<br />
											{(
												formik.values.total_after_discount ?? 0
											).toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</strong>
									</FormGroup>
								</div>
							</div>
							<div className='row g-2  d-flex justify-content-start mt-2'>
								<div className='col-md-2'>
									<FormGroup id='total' label='Total ($)' className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={
												formik.values.total / formik.values.dollar_rate ?? 0
											}
											isValid={formik.isValid}
											isTouched={formik.touched.total}
											invalidFeedback={formik.errors.total}
										/>
									</FormGroup>
								</div>

								<div className='col-md-2'>
									<FormGroup
										id='discount'
										label='Discount ($)'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											readOnly
											onFocus={(e) => e.target.select()}
											onChange={(e) => {
												formik.setFieldValue('discount', e.target.value);
												formik.setFieldValue(
													'total_after_discount',
													formik.values.total_after_tax - e.target.value,
												);
											}}
											onBlur={formik.handleBlur}
											value={(
												formik.values.discount /
													formik.values.dollar_rate ?? 0
											).toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2 justify-content-center'>
									<FormGroup
										id='total_after_discount'
										label='Total after discount ($)'
										className='col-md-12 justify-content-center'>
										<strong>
											<br />
											{(
												formik.values.total_after_discount /
													formik.values.dollar_rate ?? 0
											).toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</strong>
									</FormGroup>
								</div>
							</div>
							<div className='row d-flex justify-content-center mt-2'>
								<table className='table  text-center'>
									<thead>
										<tr>
											<th>Expense Type </th>
											<th>Payable Account </th>
											<th>Description</th>
											<th>Amount</th>
											<th> </th>
										</tr>
									</thead>

									<tbody>
										{formik.values.expenseList?.map((item, index) => (
											<tr key={item.id}>
												<td className='col-md-3'>
													<FormGroup
														label=''
														id={`expenseList[${index}].expense_type_id`}>
														<ReactSelect
															className='col-md-12'
															classNamePrefix='select'
															options={expTypesOptions}
															isLoading={expTypesOptionsLoading}
															isClearable
															value={
																formik.values.expenseList[index]
																	.expense_type_id
																	? expTypesOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.expenseList[
																					index
																				].expense_type_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`expenseList[${index}].expense_type_id`,
																	val !== null && val.id,
																);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched.expenseList
																	? formik.touched.expenseList[
																			index
																	  ]?.expense_type_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`expenseList[${index}].expense_type_id`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`expenseList[${index}]expense_type_id`
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
																	`expenseList[${index}]expense_type_id`
																]
															}
														</p>
													)}
												</td>
												<td className='col-md-3'>
													<FormGroup
														label=''
														id={`expenseList[${index}].coa_account_id`}>
														<ReactSelect
															className='col-md-12'
															classNamePrefix='select'
															options={expAccountsOptions}
															isLoading={expAccountOptionsLoading}
															isClearable
															value={
																formik.values.expenseList[index]
																	.coa_account_id
																	? expAccountsOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.expenseList[
																					index
																				].coa_account_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`expenseList[${index}].coa_account_id`,
																	val !== null && val.id,
																);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched.expenseList
																	? formik.touched.expenseList[
																			index
																	  ]?.coa_account_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`expenseList[${index}].coa_account_id`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`expenseList[${index}]coa_account_id`
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
																	`expenseList[${index}]coa_account_id`
																]
															}
														</p>
													)}
												</td>

												<td>
													<FormGroup
														id='description'
														className='col-md-12'>
														<Input
															type='text'
															onChange={(val) => {
																formik.setFieldValue(
																	`expenseList[${index}].description`,
																	val.target.value,
																);
															}}
															isTouched
															invalidFeedback={
																formik.errors[
																	`expenseList[${index}]description`
																]
															}
															value={item.description}
														/>
													</FormGroup>
												</td>
												<td>
													<FormGroup id='amount' className='col-md-12'>
														<Input
															type='number'
															onWheel={(e) => e.target.blur()}
															onChange={async (val) => {
																const t =
																	await formik.setFieldValue(
																		`expenseList[${index}].amount`,
																		val.target.value,
																	);
																if (t)
																	setTriggerCalculateExpenses(
																		triggerCalculateExpenses +
																			1,
																	);
															}}
															isTouched
															invalidFeedback={
																formik.errors[
																	`expenseList[${index}]amount`
																]
															}
															value={item.amount}
														/>
													</FormGroup>
												</td>
												<td className='col-md-1 mt-1'>
													<Button
														// isDisable={
														// 	formik.values.expenseList.length ===
														// 	1
														// }
														icon='cancel'
														color='danger'
														onClick={() => removeRowExpenses(index)}
													/>
												</td>
											</tr>
										))}
										<tr key={0}>
											<td colSpan={3}>
												<strong>Total Expenses</strong>
											</td>
											<td className='col-md-3'>
												<strong> {formik.values.totalExpenses}</strong>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className='col-md-3 d-flex align-items-center'>
								<br />
								<Button
									color='primary'
									icon='add'
									onClick={() => {
										formik.setFieldValue('expenseList', [
											...formik.values.expenseList,
											{
												amount: '',
												description: '',
												coa_account_id: '',
												expense_type_id: '',
											},
										]);
									}}>
									Add New Expense
								</Button>
							</div>
							<hr />
						</CardBody>
					</Card>
				</div>
			</ModalBody>
			<CardFooter>
				<CardFooterLeft>
					<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
						Reset
					</Button>
				</CardFooterLeft>
				<CardFooterRight>
					<Button
						className='me-3'
						icon={isLoading ? null : 'receive'}
						isLight
						color={lastSave ? 'info' : 'success'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Receiving') || 'Receiving'
							: (lastSave && 'Receive Order') || 'Receive Order'}
					</Button>
				</CardFooterRight>
			</CardFooter>
		</div>
	);
};
Received.propTypes = {
	recievedItem: PropTypes.string.isRequired,
};
export default Received;
