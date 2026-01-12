/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-console */
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
// eslint-disable-next-line import/no-unresolved
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import ReactSelect, { createFilter } from 'react-select';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Spinner from '../../../../components/bootstrap/Spinner';

import Card, {
	CardHeader,
	CardTitle,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';
import AddCustomer from './modals/addCustomer';
import Add1 from './itemPart';
import DetailsCustomer from './detailsCustomer';
import AddRack from '../../inventory/Racks/add';
import AddShelf from '../../inventory/Shelves/add';

const ReturnTo = ({ returnData1, handleStateReturn1 }) => {
	console.log(returnData1);
	const [reload, setReload] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [kitEditOptions, setItemOptions] = useState([]);
	const [editItemOptionsLoading, setEditItemOptionsLoading] = useState(true);
	const [itemOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);

	const [storesOptions, setStoreOptions] = useState([]);
	const [storesOptionsLoading, setStoreLoading] = useState(false);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const [showStats, setShowStats] = useState(false);

	const [stateCustomer, setStateCustomer] = useState(false);
	const [customerDetails, setCustomerDetails] = useState([]);
	const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
	const [staticBackdropStatusCustomer, setStaticBackdropStatusCustomer] = useState(true);
	const [scrollableStatusCustomer, setScrollableStatusCustomer] = useState(false);
	const [centeredStatusCustomer, setCenteredStatusCustomer] = useState(false);
	const [fullScreenStatusCustomer, setFullScreenStatusCustomer] = useState(null);
	const [animationStatusCustomer, setAnimationStatusCustomer] = useState(true);
	const [headerCloseStatusCustomer, setHeaderCloseStatusCustomer] = useState(true);
	const [sizeStatusCustomer, setSizeStatusCustomer] = useState(null);

	const [stateItems, setStateItems] = useState(false);
	const [itemDetails, setItemDetails] = useState([]);
	const [itemDetailsLoading, setItemDetailsLoading] = useState(false);
	const [staticBackdropStatusItems, setStaticBackdropStatusItems] = useState(true);
	const [scrollableStatusItems, setScrollableStatusItems] = useState(false);
	const [centeredStatusItems, setCenteredStatusItems] = useState(false);
	const [fullScreenStatusItems, setFullScreenStatusItems] = useState(null);
	const [animationStatusItems, setAnimationStatusItems] = useState(true);
	const [headerCloseStatusItems, setHeaderCloseStatusItems] = useState(true);
	const [sizeStatusItems, setSizeStatusItems] = useState(null);

	const [centeredStatusInvoice, setCenteredStatusInvoice] = useState(false);
	const [invoiceModal, setInvoiceModal] = useState(false);
	const [headerCloseStatusInvoice, setHeaderCloseStatusInvoice] = useState(true);
	const [staticBackdropStatusInvoice, setStaticBackdropStatusInvoice] = useState(true);
	const [scrollableStatusInvoice, setScrollableStatusInvoice] = useState(false);

	const [fullScreenStatusInvoice, setFullScreenStatusInvoice] = useState(null);
	const [animationStatusInvoice, setAnimationStatusInvoice] = useState(true);

	const [sizeStatusInvoice, setSizeStatusInvoice] = useState(null);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);

	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);

	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const validate = (values) => {
		let errors = {};

		if (values.tax_type === 2 && values.sale_type === 1) {
			if (
				Number(values.amount_received) + Number(values.bank_amount_received) !==
				Number(values.total_after_gst)
			) {
				errors.amount_received =
					'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount after Gst';
				errors.bank_amount_received =
					'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount after Gst';
			}
		}

		if (values.tax_type === 1 && values.sale_type === 1) {
			if (
				Number(values.amount_received) + Number(values.bank_amount_received) !==
				Number(values.total_after_discount)
			) {
				errors.amount_received =
					'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount After Discount ';
				errors.bank_amount_received =
					'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount After Discount ';
			}
		}

		if (values.tax_type === 2 && values.sale_type === 1) {
			if (
				Number(values.amount_received) + Number(values.bank_amount_received) >
				values.total_after_gst
			) {
				errors.amount_received =
					'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount after GST';
				errors.bank_amount_received =
					'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount after GST';
			}
		}

		if (values.tax_type === 1 && values.sale_type === 1) {
			if (
				Number(values.amount_received) + Number(values.bank_amount_received) >
				values.total_after_discount
			) {
				errors.amount_received =
					'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount After Discount';
				errors.bank_amount_received =
					'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount After Discount';
			}
		}
		if (values.amount_received === '' && values.sale_type !== 2) errors.amount_received = 'Required';
		// if (values.bank_amount_received === '') errors.bank_amount_received = 'Required';
		if (values.sale_type === 1) {
			if (!values.walk_in_customer_name) {
				errors.walk_in_customer_name = 'Required';
			}
		}
		if (values.sale_type === 2) {
			if (!values.customer_id) {
				errors.customer_id = 'Required';
			}
		}
		if (!values.store_id) {
			errors.store_id = 'Required';
		}
		if (!values.date) {
			errors.date = 'Required';
		}

		if (!values.total_amount) {
			errors.total_amount = 'Required';
		}

		if (!values.total_after_discount) {
			errors.total_after_discount = 'Required';
		}
		if (!values.childArray.length > 0) {
			errors.childArray = 'Add Items In childArray';
		}

		if (Number(values.amount_received) > 0) {
			if (!values.account_id) {
				errors.account_id = 'Required';
			}
		}
		if (Number(values.bank_amount_received) > 0) {
			if (!values.bank_account_id) {
				errors.bank_account_id = 'Required';
			}
		}

		if (values.discount < 0) {
			errors.discount = 'Discount cannot be Negative';
		}
		if (values.total_after_discount < 0) {
			errors.total_after_discount = 'Required';
		}

		values.childArray.forEach((data, index) => {
			if (!data.item_id) {
				errors = {
					...errors,
					[`childArray[${index}]item_id`]: 'Required',
				};
			}

			if (data.quantity <= 0) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]:
						'Returned Quantity cannot be less than equal to 0',
				};
			}
			if (!Number(data.price) > 0) {
				errors = {
					...errors,
					[`childArray[${index}]price`]: 'Required',
				};
			}
			if (data.quantity > data.qty_available) {
				errors = {
					...errors,
					[`childArray[${index}]quantity`]: 'Insufficient Qty',
				};
			}
			if (data.price < data.min_price) {
				errors = {
					...errors,
					[`childArray[${index}]price`]: 'Low Rate',
				};
			}
		});
		return errors;
	};
	const formik = useFormik({
		initialValues: {
			...returnData1,
			gst_percentage: (returnData1.gst / returnData1.total_after_discount) * 100,
			// amount_returned: 0,
		},
		deduction: 0,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const updateTotals = () => {
		const childArray = formik.values.childArray || [];

		// Calculate total amount
		const totalAmount = childArray.reduce((acc, curr) => {
			const amount = curr.amount || 0;
			return acc + Number(amount);
		}, 0);

		// Calculate total after discount
		const discount = formik.values.discount || 0;
		const totalAfterDiscount = totalAmount - Number(discount);

		formik.setValues({
			...formik.values,
			total_amount: totalAmount,
			total_after_discount: totalAfterDiscount,
		});
	};

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);

		setReRender(ReRender + 1);
		// Recalculate totals
		// calculateTotal();
	};
	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refreshDropdowns = (index) => {
		setCustomerDropDownLoading(true);
		setCrAccountLoading(true);

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
			.get(`/getPersons?person_type_id=1`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setCustomerDropDown(rec);
				setCustomerDropDownLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	};

	useEffect(() => {
		setCrAccountLoading1(true);
		apiClient
			.get(`/getBankAccountsBySubGroup?coa_sub_group_id=6`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions1(rec);
				setCrAccountLoading1(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => console.log(err));
	}, []);

	const getExistingQty = (idx, val) => {
		if (formik.values.store_id && val) {
			formik.setFieldValue(`childArray[${idx}].qty_available_loading`, true);

			apiClient
				.get(
					`/getItemPartsOemQty?store_id=${
						formik.values.store_id ? formik.values.store_id : ''
					}&id=${val ? val.id : ''}`,
				)
				.then((response) => {
					formik.setFieldValue(`childArray[${idx}].qty_available_loading`, false);
					formik.setFieldValue(
						`childArray[${idx}].price`,
						response.data.data?.sale_price ?? 0,
					);
					formik.setFieldValue(
						`childArray[${idx}].qty_available`,
						response.data.data.item_inventory2?.quantity ?? 0,
					);
					formik.setFieldValue(
						`childArray[${idx}].avg_price`,
						response.data.data?.avg_cost ?? 0,
					);
					formik.setFieldValue(
						`childArray[${idx}].last_sale_price`,
						response.data.data.last_sale_price ?? 0,
					);
					formik.setFieldValue(
						`childArray[${idx}].min_price`,
						response.data.data.min_price ?? 0,
					);
					formik.setFieldValue(
						`childArray[${idx}].max_price`,
						response.data.data.max_price ?? 0,
					);
					setReRender(ReRender + 1);
				})

				// eslint-disable-next-line no-console
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						// showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}
	};

	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);

		apiClient
			.get(
				`/getItemOemDropDown?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}&item_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}&part_model_id=${formik.values.part_model_id ? formik.values.part_model_id : ''}`,
			)
			.then((response) => {
				console.log('The response of itemoemdropdown is:', response);
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				formik.setFieldValue(`childArray[${index}].items_options`, rec);

				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// } else {
		// 	formik.setFieldValue(`childArray[${index}].items_options`, []);
		// 	formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
		// }
	};

	const initialStatusItems = () => {
		setHeaderCloseStatusItems(true);
		setStaticBackdropStatusItems(false);
		setScrollableStatusItems(false);
		setCenteredStatusItems(false);
		setSizeStatusItems('xl');
		setFullScreenStatusItems(null);
		setAnimationStatusItems(true);
	};

	const getPartSoldHistory = (item_id) => {
		if (formik.values.store_id && item_id) {
			setCustomerDetailsLoading(true);
			apiClient
				.get(
					`/getItemSaleHistory?item_id=${item_id}&customer_id=${
						formik.values.sale_type === 2 && formik.values.customer_id
							? formik.values.customer_id
							: ''
					}`,
				)
				.then((res) => {
					setCustomerDetails(res.data);
					setCustomerDetailsLoading(false);
				})
				.catch((err) => {
					// showNotification(_titleError, err.message, 'Danger');
				});
		}
	};

	const submitForm = (data) => {
		// console.log('data:::', data);
		apiClient
			.post(`/returnSale`, data)
			.then((res) => {
				// console.log('received PO', res.data);
				if (res.data.status === 'ok') {
					// formik.resetForm();
					// showNotification(_titleSuccess, res.data.message, 'success');
					handleStateReturn1(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
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
	};
	const saleTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Walk in Customer',
		},
		{
			id: 2,
			value: 2,
			label: 'Registered Customer',
		},
	];
	const taxTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Without GST',
		},
		{
			id: 2,
			value: 2,
			label: 'With GST',
		},
	];

	useEffect(() => {
		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				// console.log('bmmmmkkkk::', response.data);
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setItemOptions(rec);
				setEditItemOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setStoreLoading(true);
		apiClient
			.get(`/getStoredropdown?store_type_id=2`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreOptions(rec);
				setStoreLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {});
	}, []);

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

	const calculateTotal = () => {
		const p =
			formik.values.childArray !== null
				? Number(
						formik.values.childArray?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v ? v.total ?? 0 : 0)),
							0,
						),
				  )
				: 0;
		formik.values.total_amount = p;
		formik.values.total_after_discount = Number(p ?? 0) - Number(formik.values.discount ?? 0);
		formik.values.gst =
			(Number(p ?? 0) - Number(formik.values.discount ?? 0)) *
			(Number(formik.values.gst_percentage ?? 0) / 100);
		formik.values.total_after_gst =
			Number(p ?? 0) - Number(formik.values.discount ?? 0) + Number(formik.values.gst ?? 0);
		// //  formik.setFieldValue('total', price);
		// console.log('amount', p);
	};

	useEffect(() => {
		// let t = 0;
		let gst = 0;
		let total_after_discount = 0;
		let total_after_gst = 0;
		// let amount_returned = 0;
		const t = formik.values.childArray.reduce(
			// eslint-disable-next-line no-return-assign
			(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
			0,
		);
		// console.log(t, 'jjjj');
		formik.setFieldValue('total_amount', Number(t));

		total_after_discount = Number(t - formik.values.discount);

		gst =
			(Number(t ?? 0) - Number(formik.values.discount ?? 0)) *
			(Number(formik.values.gst_percentage ?? 0) / 100);
		total_after_gst = Number(t ?? 0) - Number(formik.values.discount ?? 0) + Number(gst ?? 0);
		formik.setFieldValue('total_after_discount', total_after_discount);

		formik.setFieldValue('gst', gst);
		formik.setFieldValue('total_after_gst', total_after_gst);
		// formik.setFieldValue('amount_returned', amount_returned);
	}, [ReRender]);

	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');

		setSubOptionsLoading(true);

		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
				setSubOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.category_id]);
	useEffect(() => {
		formik.setFieldValue('machine_part_id', '');

		setMachinePartsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsDropDown?sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machine_Parts?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setMachinePartsOptions(rec);
				setMachinePartsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.sub_category_id]);
	useEffect(() => {
		formik.setFieldValue('part_model_id', '');

		setPartModelsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machinepartmodel?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setPartModelsOptions(rec);
				setPartModelsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);

	const [rackOptions, setRackOptions] = useState([]);
	const [rackOptionsLoading, setRackOptionsLoading] = useState(false);

	function getRacks(storeId) {
		setRackOptionsLoading(true);

		// formik.setFieldValue('rackShelf', []);
		formik.setFieldValue('shelf_numbers', []); // Clear shelf_numbers field when new storeId is selected
		formik.setFieldValue('shelfOptions', []); // Clear shelf_numbers field when new storeId is selected
		setRackOptions([]);

		apiClient
			.get(`/getRackDropDown`, { params: { store_id: storeId } })
			.then((response) => {
				const filteredRacks = response.data?.racks.filter(
					(rack) => rack.store_id === storeId,
				);
				const rec = filteredRacks?.map((rack) => ({
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

	// useEffect(() => {
	// 	getRacks(formik.values?.store_id);
	// }, []);

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

				// if (shelves.length > 0) {
				formik
					.setFieldValue(`childArray[${index}]rackShelf[${rackIndex}]shelves`, shelves)
					.then(() => {
						// console.log(formik.values);
					});
				// }
				formik.setFieldValue(`childArray[${index}]rackShelf[${rackIndex}]shelf_id`, '');
			})
			.catch((error) => {
				// console.error('Error fetching shelf data:', error);
			});
	}
	return (
		<div className='col-12'>
			<ModalBody>
				<div className='col-12'>
					<Card stretch tag='form' onSubmit={formik.handleSubmit}>
						<CardBody>
							<div className='row g-2  d-flex justify-content-center align-items-top'>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Shop:</h3>
								</div>
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											className='col-md-12'
											classNamePrefix='select'
											options={storesOptions}
											isLoading={storesOptionsLoading}
											isClearable
											value={
												formik.values.store_id
													? storesOptions?.find(
															(c) =>
																c.value === formik.values.store_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'store_id',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
									{formik.errors.store_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
												textAlign: 'left',
												marginTop: 3,
											}}>
											{formik.errors.store_id}
										</p>
									)}
								</div>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Type:</h3>
								</div>
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											className='col-md-12'
											isClearable
											classNamePrefix='select'
											options={saleTypesOptions}
											// isLoading={saleTypesOptionsLoading}
											value={
												formik.values.sale_type
													? saleTypesOptions?.find(
															(c) =>
																c.value === formik.values.sale_type,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'sale_type',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-1 d-flex justify-content-center align-items-top'>
									<h3>Tax:</h3>
								</div>
								<div className='col-md-3'>
									<FormGroup label='' id='name'>
										<ReactSelect
											isDisabled
											className='col-md-12'
											classNamePrefix='select'
											isClearable
											options={taxTypesOptions}
											// isLoading={saleTypesOptionsLoading}
											value={
												formik.values.tax_type
													? taxTypesOptions?.find(
															(c) =>
																c.value === formik.values.tax_type,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'tax_type',
													val !== null && val.id,
												);
											}}
										/>
									</FormGroup>
								</div>
							</div>
							<hr />
							<div className='row g-2  d-flex justify-content-start'>
								{formik.values.sale_type === 2 ? (
									<div className='col-md-5'>
										<FormGroup
											id='customer_id'
											label='Customer'
											className='col-md-12'>
											<InputGroup>
												<ReactSelect
													isDisabled
													className='col-md-10'
													isClearable
													isLoading={customerDropDownLoading}
													options={customerDropDown}
													value={
														formik.values.customer_id
															? customerDropDown?.find(
																	(c) =>
																		c.value ===
																		formik.values.customer_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'customer_id',
															val !== null && val.id,
														);
													}}
													invalidFeedback={formik.errors.customer_id}
												/>
												<AddCustomer refreshDropdowns={refreshDropdowns} />
											</InputGroup>
										</FormGroup>
										{formik.errors.customer_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.customer_id}
											</p>
										)}
									</div>
								) : (
									<div className='col-md-3'>
										<FormGroup
											id='walk_in_customer_name'
											label='Customer Name'
											className='col-md-12'>
											<Input
												isDisabled
												type='text'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												readOnly
												value={formik.values.walk_in_customer_name}
												isValid={formik.isValid}
												isTouched={formik.touched.walk_in_customer_name}
												invalidFeedback={
													formik.errors.walk_in_customer_name
												}
											/>
										</FormGroup>
									</div>
								)}

								<div className='col-md-2'>
									<FormGroup id='date' label='Return Date'>
										<Input
											isDisabled
											type='date'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.date}
											isValid={formik.isValid}
											isTouched={formik.touched.date}
											invalidFeedback={formik.errors.date}
										/>
									</FormGroup>
								</div>
							</div>
							<hr />
							{/* <CardBody className='table-responsive'> */}
							<table className='table text-center'>
								<thead>
									<tr className='row'>
										<th className='col-md-4'>Item Parts</th>
										<th className='col-md-1'>In Stock</th>
										<th className='col-md-2'>Qty</th>
										<th className='col-md-2'> Rate</th>
										<th className='col-md-2'> Total</th>
										<th
											className='col-md-1'
											// role='button'
											// tabIndex={0}
											onClick={(val) => {
												if (showStats === false) {
													setShowStats(true);
												} else {
													setShowStats(false);
												}
											}}>
											Remove
										</th>
									</tr>
								</thead>
								<tbody>
									{formik.values.childArray?.length > 0 &&
										formik.values.childArray.map((items, index) => (
											<tr className='row' key={items.index}>
												<td className='col-md-4 border-start border-end '>
													<FormGroup
														label=''
														id={`childArray[${index}].item_id`}>
														<ReactSelect
															styles={customStyles}
															className='col-md-12'
															classNamePrefix='select'
															options={
																formik.values.childArray[index]
																	.items_options
															}
															isLoading={
																formik.values.childArray[index]
																	.items_options_loading
															}
															isClearable
															value={
																formik.values.childArray[index]
																	.item_id
																	? formik.values.childArray[
																			index
																	  ].items_options.find(
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
																formik.setFieldValue(
																	`childArray[${index}].item_name`,
																	val !== null && val.label,
																);
																formik.setFieldValue(
																	`childArray[${index}].qty`,
																	'',
																);
																formik.setFieldValue(
																	`childArray[${index}].total`,
																	0,
																);
																getExistingQty(index, val);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																			index
																	  ]?.item_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}].item_id`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`childArray[${index}]item_id`
													] && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: 'red',
																textAlign: 'center',
																marginTop: 2,
																marginBottom: 0,
															}}>
															{
																formik.errors[
																	`childArray[${index}]item_id`
																]
															}
														</p>
													)}
													{showStats && (
														<p className='d-flex justify-content-center'>
															{items.qty_available_loading ? (
																<h5>...</h5>
															) : (
																// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																<p
																	className=' text-muted fs-6 '
																	// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
																	role='button'
																	style={{
																		color: 'orange',
																		fontStyle: 'italic',
																		textDecorationLine:
																			'underline',
																	}}
																	tabIndex={0}
																	onClick={(val) => {
																		if (items.item_id) {
																			initialStatusItems();
																			setStateCustomer(true);
																			getPartSoldHistory(
																				items.item_id,
																			);
																		}
																	}}>
																	Last Sold at:
																	{items?.last_sale_price === null
																		? ''
																		: items?.last_sale_price?.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																		  ) ?? 0}
																</p>
															)}
														</p>
													)}

													<div className='row justify-content-between mt-5'>
														<div className='col'>
															<h4>Rack and Shelves</h4>
														</div>
														<div className='col-auto'>
															<div className='d-flex justify-content-end'>
																<AddRack
																	getRacks={getRacks}
																	storeId={
																		formik.values?.store_id
																	}
																	show={1}
																/>
																<AddShelf
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
																className='row mt-2'
																key={`${rack.racks?.rack_number}-${rack.shelves?.shelf_number}`}>
																<td className='col-md-4 border-start border-end'>
																	<div>
																		<FormGroup
																			size='sm'
																			label='Rack'
																			id={`childArray[${index}].rackShelf[${rackIndex}].rack_id`}>
																			<h5 className='col-md-12'>
																				{
																					rack.racks
																						?.rack_number
																				}
																			</h5>
																		</FormGroup>
																	</div>
																</td>
																<td className='col-md-4 border-start border-end'>
																	<div>
																		<FormGroup
																			size='sm'
																			label='Shelf'
																			id={`childArray[${index}].rackShelf[${rackIndex}].shelf_id`}>
																			<h5>
																				{
																					rack.shelves
																						?.shelf_number
																				}
																			</h5>
																		</FormGroup>
																	</div>
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
																					formik.setFieldValue(
																						`childArray[${index}].rackShelf[${rackIndex}].quantity`,
																						e.target
																							.value,
																					);
																					console.log(
																						e.target
																							.value,
																					);
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
																<td className='col-md-3'>
																	<div className='col-md-12'>
																		<FormGroup
																			size='sm'
																			id={`childArray[${index}].rackShelf[${rackIndex}].qty_sale`}
																			label='Quantity'>
																			<Input
																				type='number'
																				onWheel={(e) =>
																					e.target.blur()
																				}
																				onChange={(e) => {
																					formik.setFieldValue(
																						`childArray[${index}].rackShelf[${rackIndex}].qty_sale`,
																						e.target
																							.value,
																					);
																					formik.setFieldValue(
																						`childArray[${index}].rackShelf[${rackIndex}].qty`,
																						e.target
																							.value,
																					);
																					console.log(
																						e.target
																							.value,
																					);
																				}}
																				onBlur={
																					formik.handleBlur
																				}
																				value={
																					rack.qty_sale
																				}
																				invalidFeedback={
																					formik.errors[
																						`childArray[${index}].rackShelf[${rackIndex}].qty_sale`
																					]
																				}
																			/>
																		</FormGroup>
																		{formik.errors[
																			`childArray[${index}].rackShelf[${rackIndex}].qty_sale`
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
																						`childArray[${index}].rackShelf[${rackIndex}].qty_sale`
																					]
																				}
																			</div>
																		)}
																	</div>
																</td>
															</tr>
														))}
													</table>
												</td>

												<td className='col-md-1 border-start border-end '>
													<FormGroup
														id={`childArray[${index}].qty_available`}
														label=''
														className='col-md-12'>
														<h5>
															{items.qty_available_loading ? (
																<h5>...</h5>
															) : (
																<p className='fs-6'>
																	{items.qty_available ?? 0}
																	{showStats && (
																		<div className='small text-muted mt-2'>
																			Available Quantity:
																			<br />
																			{items.current_quantity?.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																			) ?? 0}
																		</div>
																	)}
																</p>
															)}
														</h5>
													</FormGroup>
												</td>
												<td className='col-md-2 border-start border-end '>
													<FormGroup
														id={`childArray[${index}].quantity`}
														label=''>
														<Input
															size='sm'
															type='number'
															onWheel={(e) => e.target.blur()}
															onBlur={formik.handleBlur}
															min='0'
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].quantity`,
																	val.target.value,
																);
																formik.setFieldValue(
																	`childArray[${index}].amount`,
																	Number(val.target.value) *
																		Number(
																			formik.values
																				.childArray[index]
																				.price ?? 0,
																		),
																);
																if (val.target.value < 0) {
																	showNotification(
																		_titleError,
																		'Enter a Postive Value',
																		'warning',
																	);
																	formik.setFieldValue(
																		`childArray[${index}].quantity`,
																		0,
																	);
																	formik.setFieldValue(
																		`childArray[${index}].amount`,
																		formik.values.childArray[
																			index
																		].price * 0,
																	);
																}
																setReRender(ReRender + 1);
															}}
															isTouched
															value={
																formik.values.childArray[index]
																	.quantity
															}
															isValid={formik.isValid}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}]quantity`
																]
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>
													<div className='fs-6'>
														Sold Qty {items.sold_quantity ?? 'None'}
													</div>
													<div className='fs-6'>
														Ret Qty{' '}
														{items.returned_quantity_sum ?? 'None'}
													</div>
												</td>
												<td className='col-md-2 border-start border-end '>
													<FormGroup
														id={`childArray[${index}].price`}
														label=''>
														<Input
															size='sm'
															type='number'
															onWheel={(e) => e.target.blur()}
															onBlur={formik.handleBlur}
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].price`,
																	val.target.value,
																);
																formik.setFieldValue(
																	`childArray[${index}].amount`,
																	Number(val.target.value) *
																		Number(
																			formik.values
																				.childArray[index]
																				.quantity ?? 0,
																		),
																);
																if (val.target.value < 0) {
																	showNotification(
																		_titleError,
																		'Price should not be negative!',
																		'warning',
																	);
																}
																// updateTotals();
																// setReload(reload + 1);

																setReRender(ReRender + 1);
															}}
															isTouched
															value={
																formik.values.childArray[index]
																	.price
															}
															isValid={formik.isValid}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}]price`
																]
															}
															validFeedback='Looks good!'
														/>
													</FormGroup>

													<p>
														{items.qty_available_loading ? (
															<h5>...</h5>
														) : (
															<p className='fs-6'>
																<div className='small text-muted'>
																	Min Price:
																	{items?.min_price === null
																		? ''
																		: items?.min_price?.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																		  ) ?? 0}
																	<br />
																	Max Price:
																	{items?.max_price === null
																		? ''
																		: items?.max_price?.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																		  ) ?? 0}
																</div>
															</p>
														)}
													</p>
												</td>
												<td className='col-md-2 mt-1 border-start border-end '>
													{items.amount?.toLocaleString(undefined, {
														maximumFractionDigits: 2,
													}) ?? 0}
												</td>
												<td className='col-md-1  '>
													<Button
														// isDisable={
														// 	formik.values.childArray.length === 1
														// }
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

							<div className='row g-4 d-flex align-items-end'>
								<div className='col-md-3'>
									<FormGroup id='category_id' label='Category'>
										<ReactSelect
											isLoading={categoriesOptionsLoading}
											options={categoriesOptions}
											value={
												formik.values.category_id
													? categoriesOptions?.find(
															(c) =>
																c.value ===
																formik.values.category_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'category_id',
													val !== null && val.id,
												);
												formik.setFieldValue(
													'category_name',
													val !== null && val.label,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.category_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.category_id}
										</p>
									)}
								</div>
								<div className='col-md-3'>
									<FormGroup id='sub_category_id' label='Sub Category'>
										<ReactSelect
											isLoading={subOptionsLoading}
											options={subOption}
											isClearable
											value={
												formik.values.sub_category_id
													? subOption?.find(
															(c) =>
																c.value ===
																formik.values.sub_category_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'sub_category_id',
													val !== null && val.id,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.sub_category_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.sub_category_id}
										</p>
									)}
								</div>
								<div className='col-md-3'>
									<FormGroup id='machine_part_id' label='Item'>
										<ReactSelect
											isLoading={machinePartsOptionsLoading}
											options={machinePartsOptions}
											isClearable
											value={
												formik.values.machine_part_id
													? machinePartsOptions?.find(
															(c) =>
																c.value ===
																formik.values.machine_part_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'machine_part_id',
													val !== null && val.id,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.machine_part_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.machine_part_id}
										</p>
									)}
								</div>
								<div className='col-md-3'>
									<FormGroup id='part_model_id' label='Part Model'>
										<ReactSelect
											isLoading={partModelsOptionsLoading}
											options={partModelsOptions}
											isClearable
											value={
												formik.values.part_model_id
													? partModelsOptions?.find(
															(c) =>
																c.value ===
																formik.values.part_model_id,
													  )
													: null
											}
											onChange={(val) => {
												formik.setFieldValue(
													'part_model_id',
													val !== null && val.id,
												);

												// getSubCategoriesByCategory(val.id);
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.part_model_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.part_model_id}
										</p>
									)}
								</div>
							</div>

							<div className='row g-4 d-flex align-items-top'>
								<div className='col-md-2'>
									<FormGroup
										id='total_amount'
										label='Total Amount'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											value={formik.values.total_amount}
											isValid={formik.isValid}
											isTouched={formik.touched.total_amount}
											invalidFeedback={formik.errors.total_amount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='discount'
										label='Deduction'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											onChange={(val) => {
												formik.setFieldValue(`discount`, val.target.value);
												formik.setFieldValue(
													`total_after_discount`,
													Number(formik.values.total_amount ?? 0) -
														Number(val.target.value ?? 0),
												);
												formik.setFieldValue(
													`total_after_gst`,
													Number(
														Number(
															formik.values.total_after_discount ?? 0,
														) + Number(formik.values.gst),
													),
												);

												setReRender(ReRender + 1);
											}}
											value={formik.values.discount}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='total_after_discount'
										label='Amount After Deduction'
										className='col-md-12'>
										<Input
											value={formik.values.total_after_discount}
											isValid={formik.isValid}
											isTouched={formik.touched.total_after_discount}
											invalidFeedback={formik.errors.total_after_discount}
										/>
									</FormGroup>
								</div>

								{formik.values.tax_type === 2 && (
									<>
										<div className='col-md-2'>
											<FormGroup
												id='gst_percentage'
												label='GST in %'
												className='col-md-12'>
												<Input
													onChange={(val) => {
														formik.setFieldValue(
															`gst_percentage`,
															val.target.value,
														);
														setReRender(ReRender + 1);
													}}
													onBlur={formik.handleBlur}
													value={formik.values.gst_percentage}
													isValid={formik.isValid}
													isTouched={formik.touched.discount}
													invalidFeedback={formik.errors.discount}
												/>
											</FormGroup>
										</div>
										<div className='col-md-2'>
											<FormGroup id='GST' label='GST' className='col-md-12'>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.gst.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 2,
														},
													)}
													isValid={formik.isValid}
													isTouched={formik.touched.gst}
													invalidFeedback={formik.errors.gst}
												/>
											</FormGroup>
										</div>
										<div className='col-md-2'>
											<FormGroup
												id='total_after_gst'
												label='Amount with GST'
												className='col-md-12'>
												<Input
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.total_after_gst.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 2,
														},
													)}
													isValid={formik.isValid}
													isTouched
													invalidFeedback={formik.errors.total_after_gst}
													validFeedback='Looks good!'
												/>
											</FormGroup>
										</div>
									</>
								)}
							</div>
							<div className='row g-4 d-flex align-items-top'>
								<div className='col-md-2'>
									<FormGroup
										id='amount_received'
										label='Paid Amount Cash'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											// readOnly={formik.values.sale_type === 1}
											onChange={formik.handleChange}
											value={formik.values.amount_received}
											isValid={formik.isValid}
											isTouched={formik.touched.amount_received}
											invalidFeedback={formik.errors.amount_received}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup id='account_id' label='Account Cash'>
										<ReactSelect
											className='col-md-12 '
											classNamePrefix='select'
											options={cashAccountsOptions}
											isLoading={crAccountLoading}
											value={
												formik.values.account_id &&
												cashAccountsOptions.find(
													(c) => c.value === formik.values.account_id,
												)
											}
											onChange={(val) => {
												formik.setFieldValue('account_id', val.id);
												formik.setFieldValue(
													'coa_sub_group_id',
													val.coa_sub_group_id,
												);
												if (val.coa_sub_group_id !== 2) {
													formik.setFieldValue('cheque_no', '');
												}
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.account_id}
											invalidFeedback={formik.errors.account_id}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.account_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.account_id}
										</p>
									)}
								</div>
								<div className='col-md-2'>
									<FormGroup
										id='bank_amount_received'
										label='Paid Amount Bank'
										className='col-md-12'>
										<Input
											type='number'
											onWheel={(e) => e.target.blur()}
											onBlur={formik.handleBlur}
											// readOnly={formik.values.sale_type === 1}
											onChange={formik.handleChange}
											value={formik.values.bank_amount_received}
											isValid={formik.isValid}
											isTouched={formik.touched.bank_amount_received}
											invalidFeedback={formik.errors.bank_amount_received}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup id='bank_account_id' label='Account Bank'>
										<ReactSelect
											className='col-md-12 '
											classNamePrefix='select'
											options={cashAccountsOptions1}
											isLoading={crAccountLoading1}
											value={
												formik.values.bank_account_id &&
												cashAccountsOptions1.find(
													(c) =>
														c.value === formik.values.bank_account_id,
												)
											}
											onChange={(val) => {
												formik.setFieldValue('bank_account_id', val.id);
												formik.setFieldValue(
													'coa_sub_group_id',
													val.coa_sub_group_id,
												);
												if (val.coa_sub_group_id !== 2) {
													formik.setFieldValue('cheque_no', '');
												}
											}}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.bank_account_id}
											invalidFeedback={formik.errors.bank_account_id}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.bank_account_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.bank_account_id}
										</p>
									)}
								</div>
							</div>
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
						icon={isLoading ? null : 'arrow-back'}
						isLight
						color={lastSave ? 'info' : 'primary'}
						isDisable={isLoading}
						onClick={formik.handleSubmit}>
						{isLoading && <Spinner isSmall inButton />}
						{isLoading
							? (lastSave && 'Returning') || 'Returning'
							: (lastSave && 'Return') || 'Return'}
					</Button>
				</CardFooterRight>
			</CardFooter>

			<Modal
				isOpen={invoiceModal}
				setIsOpen={setInvoiceModal}
				isCentered={centeredStatusInvoice}
				titleId='exampleModalLabel'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusInvoice ? setInvoiceModal : null}>
					<ModalTitle id='editVoucher2'> </ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Card stretch>
						<Add1 />
					</Card>
				</ModalBody>
			</Modal>

			<Modal
				isOpen={stateCustomer}
				setIsOpen={setStateCustomer}
				titleId='DetailCustomers'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusCustomer ? setStateCustomer : null}>
					<ModalTitle id='DetailCustomers'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>{customerDetails?.customersalehistory?.name}</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{customerDetailsLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<DetailsCustomer
									customerDetails={customerDetails}
									// handleStateCustomer={handleStateCustomer}
								/>
							)}
							<CardFooter>
								<CardFooterLeft>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateCustomer(false)}>
										Cancel
									</Button>
								</CardFooterLeft>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
			</Modal>
		</div>
	);
};
ReturnTo.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	returnData1: PropTypes.object.isRequired,
	// handleStateReturnTo: PropTypes.function.isRequired,
};

export default ReturnTo;
