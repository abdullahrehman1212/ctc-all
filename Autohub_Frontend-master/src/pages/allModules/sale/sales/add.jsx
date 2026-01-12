// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/jsx-no-bind */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';

import Popovers from '../../../../components/bootstrap/Popovers';

import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import Checks from '../../../../components/bootstrap/forms/Checks';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import showNotification from '../../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../../notifyMessages/erroSuccess';

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

import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import AddCustomer from './modals/addCustomer';
import DetailsCustomer from './detailsCustomer';
import DetailsItems from './detailsItem';
import generatePDF1 from './pdf/addPDF';
import Add1 from './itemPart';
import AlternatePartsModal from './modals/modals/AlternateParts';
import AlternateBrandsModal from './modals/modals/Alternate Brands';
// import AddRack from '../../inventory/Racks/add';
// import AddShelf from '../../inventory/Shelves/add';

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
	if (values.sale_type === 1) {
		if (!values.walk_in_customer_name) {
			errors.walk_in_customer_name = 'Required';
		}
	}
	if (Number(values.bank_amount_received) > 0) {
		if (!values.bank_account_id) {
			errors.bank_account_id = 'Required';
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
	if (!values.delivered_to) {
		errors.delivered_to = 'Required';
	}
	if (!values.total_after_discount) {
		errors.total_after_discount = 'Required';
	}
	if (!values.list || !values.list.length || values.list.length === 0) {
		errors.list = 'Add Items In list';
	}
	if (values.amount_received && !values.account_id) {
		errors.account_id = 'Required';
	}
	if (values.discount < 0) {
		errors.discount = 'Required';
	}
	if (values.total_after_discount < 0) {
		errors.total_after_discount = 'Required';
	}

	// Only validate items if list exists and has items
	if (values.list && Array.isArray(values.list) && values.list.length > 0) {
		values.list.forEach((data, index) => {
			const checkedItems = data?.item_racks?.filter((item) => item.checked === true);
			const totalQuantity =
				checkedItems?.length > 0
					? checkedItems.reduce((sum, item) => sum + item.quantity, 0)
					: 0;

			const checkedItemsStocks = data?.no_rack_shelf;
			const totalQuantityStocks =
				checkedItemsStocks?.checked === true ? checkedItemsStocks.quantity : 0;

			if (checkedItems?.length > 0 && checkedItemsStocks?.checked === true) {
				const combinedTotal = totalQuantity + totalQuantityStocks;
				if (Number(data?.qty) > Number(combinedTotal)) {
					errors = {
						...errors,
						[`list[${index}]qty`]:
							'Should not be greater than the quantities of Racks, Shelves, and Stocks without Rack',
					};
				}
			} else if (checkedItems?.length > 0) {
				if (Number(data?.qty) > Number(totalQuantity)) {
					errors = {
						...errors,
						[`list[${index}]qty`]:
							'Should not be greater than the quantities of Racks and Shelves',
					};
				}
			} else if (checkedItemsStocks?.checked === true) {
				// Only checkedItemsStocks are selected
				if (Number(data?.qty) > Number(totalQuantityStocks)) {
					errors = {
						...errors,
						[`list[${index}]qty`]:
							'Should not be greater than the quantities of Stocks without Rack and Shelves',
					};
				}
			}

			if (!data.item_id) {
				errors = {
					...errors,
					[`list[${index}]item_id`]: 'Required',
				};
			}

			if (!data.qty > 0) {
				errors = {
					...errors,
					[`list[${index}]qty`]: 'Required',
				};
			}
			if (!Number(data.price) > 0) {
				errors = {
					...errors,
					[`list[${index}]price`]: 'Required',
				};
			}
			if (data.qty > data.qty_available && values.isNegative === 0) {
				errors = {
					...errors,
					[`list[${index}]qty`]: 'Insufficient Qty',
				};
			}
			if (data.price < data.min_price) {
				errors = {
					...errors,
					[`list[${index}]price`]: 'Low Rate',
				};
			}
		});
	}
	return errors;
};
const Add = ({ refreshTableData, rowIndex }) => {
	const [triggerCalculateExpenses, setTriggerCalculateExpenses] = useState(0);
	const [reload, setReload] = useState(0);

	const [state, setState] = useState(false);
	const [labelItem, setLabelItem] = useState('');
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);

	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);

	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [showStats, setShowStats] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const [storesOptions, setStoresOptions] = useState();
	const [storesOptionsLoading, setStoresOptionsLoading] = useState(false);

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalOpen1, setIsModalOpen1] = useState(false);
	const [alternatePartsData, setAlternatePartsData] = useState([]);
	const [alternateBrandsData, setAlternateBrandsData] = useState([]);

	const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility

	const toggleDropdown = () => {
		setIsOpen(!isOpen); // Toggle dropdown state
	};

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const initialStatusCustomer = () => {
		setHeaderCloseStatusCustomer(true);
		setStaticBackdropStatusCustomer(false);
		setScrollableStatusCustomer(false);
		setCenteredStatusCustomer(false);
		setSizeStatusCustomer('xl');
		setFullScreenStatusCustomer(null);
		setAnimationStatusCustomer(true);
	};

	const initialStatusInvoice = () => {
		setHeaderCloseStatusInvoice(true);
		setStaticBackdropStatusInvoice(false);
		setScrollableStatusInvoice(false);
		setCenteredStatusInvoice(false);
		setSizeStatusInvoice('xl');
		setFullScreenStatusInvoice(null);
		setAnimationStatusInvoice(true);
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

	// temporary...
	const [alternate_things, setalternate_things] = useState([]);
	const [rackNumber, setRackNumber] = useState([]);
	const [shelfNumber, setShelfNumber] = useState([]);
	const [racksAndShelfDataLoading, setRacksAndShelfDataLoading] = useState([]);

	const formik = useFormik({
		initialValues: {
			walk_in_customer_name: '',
			customer_id: '',
			customer_name: '',
			// date: moment().format('MM/DD/YYYY'),
			date: todayDate,
			store_id: '',
			store_name: '',
			total_amount: 0,
			total: 0,
			discount: '',
			total_after_discount: 0,

			amount_received: '',
			bank_amount_received: '',
			account_id: '',
			bank_account_id: '',

			delivered_to: '',
			list: [],
			list1: [],
			childArray: [],
			sale_type: 1,
			tax_type: 1,
			gst: '',
			gst_percentage: 0,
			total_after_gst: '',
			isNegative: 0,
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

	const reversedList = React.useMemo(() => {
		return [...(formik.values.list || [])].reverse();
	}, [formik.values.list]);

	const removeRow = (i) => {
		formik.setFieldValue('list', [
			...formik.values.list.slice(0, i),
			...formik.values.list.slice(i + 1),
		]);
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
	const calculateTotal = () => {
		const p =
			formik.values.list !== null
				? Number(
						formik.values.list?.reduce(
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

		if (formik.values.sale_type === 1 && formik.values.tax_type === 1) {
			// formik.values.amount_received = formik.values.total_after_discount;
		} else if (formik.values.sale_type === 2 && formik.values.tax_type === 2) {
			formik.values.amount_received = formik.values.total_after_gst;
		}

		// //  formik.setFieldValue('total', price);
		// console.log('amount', p);
	};

	useEffect(() => {
		if (formik.values.tax_type === 1) {
			formik.setFieldValue('gst_percentage', 0);
		} else {
			formik.setFieldValue('gst_percentage', 18);
		}
	}, [formik.values.tax_type]);
	useEffect(() => {
		formik.setFieldValue(
			`gst`,
			(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
		formik.setFieldValue(
			`total_after_gst`,
			Number(formik.values.total_after_discount) +
				(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
	}, [formik.values.gst_percentage]);
	useEffect(() => {
		calculateTotal();
	}, [formik.values.list]);

	// When customer changes, refresh last sold price per item for that customer
	useEffect(() => {
		if (formik.values.sale_type === 2 && formik.values.customer_id) {
			formik.values.list.forEach((row, idx) => {
				if (row?.item_id) updateLastSoldPriceForCustomer(idx, row.item_id);
			});
		} else {
			// clear customer-specific prices if no customer selected
			formik.values.list.forEach((_, idx) => {
				formik.setFieldValue(`list[${idx}].last_sale_price_customer`, null);
			});
		}
	}, [formik.values.customer_id, formik.values.sale_type]);

	useEffect(() => {
		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoriesOptions(rec);
				setCategoriesOptionsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
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
			.catch((err) => console.log(err));
	}, []);

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
			.catch((err) => console.log(err));
	}, []);

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
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
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
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
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
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, [formik.values.machine_part_id]);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const toggleModal1 = () => {
		setIsModalOpen1(!isModalOpen1);
	};

	const submitForm = (myFormik) => {
		// Ensure backend-required keys exist on each item
		const sanitizedList = (myFormik.values.list || []).map((item) => ({
			...item,
			item_racks: Array.isArray(item?.item_racks) ? item.item_racks : [],
			no_rack_shelf:
				item?.no_rack_shelf && typeof item.no_rack_shelf === 'object'
					? item.no_rack_shelf
					: { quantity: 0, checked: false },
		}));

		const payload = {
			...myFormik.values,
			list: sanitizedList,
		};

		apiClient
			.post(`/addNewSale`, payload)
			.then((res) => {
				// console.log('myformik', myFormik.values);
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
		refreshDropdowns();
	}, []);

	const refreshDropdowns = (index) => {
		setCustomerDropDownLoading(true);
		apiClient
			.get(`/getPersons?person_type_id=1&isActive=1`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name, phone_no }) => ({
					id,
					value: id,
					label: `${id}-${name}-${phone_no ?? ''}`,
					personName: name,
				}));
				setCustomerDropDown(rec);
				setCustomerDropDownLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	};

	// Cache for items dropdown to avoid repeated API calls
	const [itemsDropdownCache, setItemsDropdownCache] = useState(null);
	const [itemsDropdownCacheLoading, setItemsDropdownCacheLoading] = useState(false);
	const [cachedMachinePartId, setCachedMachinePartId] = useState(null);
	const pendingIndicesRef = useRef(new Set());

	// Clear cache when machine_part_id changes
	useEffect(() => {
		if (formik.values.machine_part_id !== cachedMachinePartId) {
			setItemsDropdownCache(null);
			setCachedMachinePartId(formik.values.machine_part_id);
			pendingIndicesRef.current = new Set();
		}
	}, [formik.values.machine_part_id]);
	const getItemsBasedOnSubCategory = (index) => {
		// Use cached data if available
		if (itemsDropdownCache && !itemsDropdownCacheLoading) {
			const cachedOptions = itemsDropdownCache.options;
			const cachedData = itemsDropdownCache.data;

			formik.setFieldValue(`list[${index}].items_options`, cachedOptions);
			if (formik.values.list1 && formik.values.list1[index]) {
				formik.setFieldValue(`list1[${index}].items_options`, cachedData);
			}

			const rec = cachedData.map((item) => ({
				id: item.id,
				name: item.machine_part_oem_part?.machine_part?.name,
				quantity: item?.item_inventory2?.quantity,
				sale_price: item?.sale_price,
				label: [
					item.machine_part_oem_part?.machine_part?.name,
					item.machine_part_oem_part?.oem_part_number?.number1,
					item.brand?.name,
					item.machine_part_oem_part?.oem_part_number?.number2,
				]
					.filter(Boolean)
					.join(' / '),
			}));
			setAlternatePartsData(rec);

			formik.setFieldValue(`list[${index}].items_options_loading`, false);
			return;
		}

		// Mark this index as pending
		pendingIndicesRef.current.add(index);
		formik.setFieldValue(`list[${index}].items_options_loading`, true);

		// Prevent multiple API calls
		if (itemsDropdownCacheLoading) return;
		setItemsDropdownCacheLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?&machine_part_id=${
					formik.values.machine_part_id || ''
				}`,
			)
			.then((response) => {
				let rec1;

				if (formik.values.machine_part_id) {
					// Map from machinepartmodel if machine_part_id exists
					rec1 = response.data.machinepartmodel.map(({ id, name, number2 }) => ({
						id,
						value: id,
						label: name,
						number2: number2 || '',
					}));
				} else {
					// Map from full data if no machine_part_id
					rec1 = response.data.data.map((item) => {
						const machinePartName = item.machine_part_oem_part?.machine_part?.name;
						const number1 = item.machine_part_oem_part?.oem_part_number?.number1;
						const number2 = item.machine_part_oem_part?.oem_part_number?.number2;
						const brandName = item.brand?.name;

						return {
							id: item.id,
							value: item.id,
							label: [machinePartName, number1, brandName, number2]
								.filter(Boolean)
								.join(' / '),
							number2: number2 || '',
							machine_part: machinePartName,
						};
					});
				}

				// Cache the response
				setItemsDropdownCache({
					options: rec1,
					data: response.data.data,
				});

				// Update all pending indices
				const currentPending = Array.from(pendingIndicesRef.current);
				currentPending.forEach((idx) => {
					formik.setFieldValue(`list[${idx}].items_options`, rec1);
					formik.setFieldValue(`list[${idx}].items_options_loading`, false);
					if (formik.values.list1 && formik.values.list1[idx]) {
						formik.setFieldValue(`list1[${idx}].items_options`, response.data.data);
					}
				});

				// Fallback: update any remaining loading indices
				formik.values.list.forEach((item, idx) => {
					if (item.items_options_loading) {
						formik.setFieldValue(`list[${idx}].items_options`, rec1);
						formik.setFieldValue(`list[${idx}].items_options_loading`, false);
						if (formik.values.list1 && formik.values.list1[idx]) {
							formik.setFieldValue(`list1[${idx}].items_options`, response.data.data);
						}
					}
				});

				pendingIndicesRef.current.clear();

				// Populate alternatePartsData
				const rec = response.data.data.map((item) => ({
					id: item.id,
					name: item.machine_part_oem_part?.machine_part?.name,
					quantity: item?.item_inventory2?.quantity,
					sale_price: item?.sale_price,
					label: [
						item.machine_part_oem_part?.machine_part?.name,
						item.machine_part_oem_part?.oem_part_number?.number1,
						item.brand?.name,
						item.machine_part_oem_part?.oem_part_number?.number2,
					]
						.filter(Boolean)
						.join(' / '),
				}));

				setAlternatePartsData(rec);
				setItemsDropdownCacheLoading(false);
			})
			.catch((err) => {
				const currentPending = Array.from(pendingIndicesRef.current);
				currentPending.forEach((idx) => {
					formik.setFieldValue(`list[${idx}].items_options_loading`, false);
				});
				pendingIndicesRef.current.clear();
				setItemsDropdownCacheLoading(false);
			});
	};

	/* const getItemsBasedOnSubCategory = (index) => {
		// Check if we have cached data
		if (itemsDropdownCache && !itemsDropdownCacheLoading) {
			// Use cached data immediately
			const cachedOptions = itemsDropdownCache.options;
			const cachedData = itemsDropdownCache.data;

			formik.setFieldValue(`list[${index}].items_options`, cachedOptions);
			if (formik.values.list1 && formik.values.list1[index]) {
				formik.setFieldValue(`list1[${index}].items_options`, cachedData);
			}

			// Populate alternatePartsData from cache
			const rec = cachedData.map((item) => ({
				id: item.id,
				name: item.name,
				quantity: item?.item_inventory2?.quantity,
				sale_price: item?.sale_price,
			}));
			setAlternatePartsData(rec);

			formik.setFieldValue(`list[${index}].items_options_loading`, false);
			return;
		}

		// Mark this index as pending
		pendingIndicesRef.current.add(index);

		// If cache is being loaded or doesn't exist, start loading
		formik.setFieldValue(`list[${index}].items_options_loading`, true);

		// Prevent multiple concurrent API calls
		if (itemsDropdownCacheLoading) {
			return;
		}

		setItemsDropdownCacheLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?&machine_part_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}`,
			)
			.then((response) => {
				let rec1;

				if (formik.values.machine_part_id) {
					// If machine_part_id is defined, map from machinepartmodel
					rec1 = response.data.machinepartmodel.map(({ id, name, number2 }) => ({
						id,
						value: id,
						label: name,
						number2: number2 || '',
					}));
				} else {
					// If machine_part_id is not defined, map from the entire data object
					rec1 = response.data.data.map(
						({ id, name, number2, machine_part_oem_part }) => ({
							id,
							value: id,
							label: name,
							number2: number2 || '',
							machine_part: machine_part_oem_part?.machine_part?.name,
						}),
					);
				}

				// Cache the response
				setItemsDropdownCache({
					options: rec1,
					data: response.data.data,
				});

				// Update all pending indices using ref (which has the latest state)
				const currentPending = Array.from(pendingIndicesRef.current);
				currentPending.forEach((idx) => {
					formik.setFieldValue(`list[${idx}].items_options`, rec1);
					formik.setFieldValue(`list[${idx}].items_options_loading`, false);
					if (formik.values.list1 && formik.values.list1[idx]) {
						formik.setFieldValue(`list1[${idx}].items_options`, response.data.data);
					}
				});

				// Also update using current formik values as fallback (in case indices changed)
				formik.values.list.forEach((item, idx) => {
					if (item.items_options_loading) {
						formik.setFieldValue(`list[${idx}].items_options`, rec1);
						formik.setFieldValue(`list[${idx}].items_options_loading`, false);
						if (formik.values.list1 && formik.values.list1[idx]) {
							formik.setFieldValue(`list1[${idx}].items_options`, response.data.data);
						}
					}
				});

				// Clear all pending indices
				pendingIndicesRef.current.clear();

				// Populate alternatePartsData based on the response data
				const rec = response.data.data.map((item) => ({
					id: item.id,
					name: item.name,
					quantity: item?.item_inventory2?.quantity,
					sale_price: item?.sale_price,
				}));

				// Set the state or use it as needed
				setAlternatePartsData(rec);

				setItemsDropdownCacheLoading(false);
			})
			.catch((err) => {
				// Update pending indices to clear loading state
				const currentPending = Array.from(pendingIndicesRef.current);
				currentPending.forEach((idx) => {
					formik.setFieldValue(`list[${idx}].items_options_loading`, false);
				});
				pendingIndicesRef.current.clear();
				setItemsDropdownCacheLoading(false);
			});
	};
 */
	const getBrands = (val) => {
		apiClient
			.get(`/getMachinePartsModelsDropDown?item_id=${val?.id}`)
			.then((response) => {
				if (response.data && Array.isArray(response.data.item)) {
					const rec = response.data.item.flatMap((item) =>
						item.brands_id.map((brand) => ({
							id: brand.id,
							name: brand.name,
							number3: brand.pivot?.number3,
						})),
					);
					// console.log('rec:', rec);
					setAlternateBrandsData(rec);
				} else {
					console.error('Invalid response format:', response);
				}
			})
			.catch((err) => {
				console.error('Error fetching data:', err);
			});
	};

	const getExistingQtyForArray = (array, idx, val) => {
		if (formik.values.store_id && val) {
			formik.setFieldValue(`${array}[${idx}].qty_available_loading`, true);

			apiClient
				.get(
					`/getItemPartsOemQty?store_id=${
						formik.values.store_id ? formik.values.store_id : ''
					}&id=${val ? val.id : ''}`,
				)
				.then((response) => {
					console.log(response);

					// Destructure the response data
					const data = response.data.data || {};
					const itemInventory2 = data.item_inventory2 || {};
					const itemRacks = data.item_racks || [];

					// Calculate total rack quantity
					const totalRackQuantity = itemRacks.reduce(
						(sum, rack) => sum + (rack.quantity || 0),
						0,
					);

					// Calculate noRackShelvesData
					const totalAvailableQuantity = itemInventory2.quantity || 0;
					const noRackQuantity = totalAvailableQuantity - totalRackQuantity;

					// Prepare noRackShelvesData array
					const noRackShelvesData =
						noRackQuantity >= 0
							? {
									quantity: noRackQuantity,
									checked: true,
							  }
							: {};

					formik.setFieldValue(`${array}[${idx}].qty_available_loading`, false);
					formik.setFieldValue(`${array}[${idx}].price`, data.sale_price ?? 0);
					formik.setFieldValue(`${array}[${idx}].qty_available`, totalAvailableQuantity);
					formik.setFieldValue(
						`${array}[${idx}].avg_price`,
						response.data.data?.avg_cost ?? 0,
					);
					formik.setFieldValue(
						`${array}[${idx}].last_sale_price`,
						data.last_sale_price ?? 0,
					);
					formik.setFieldValue(`${array}[${idx}].min_price`, data.min_price ?? 0);
					formik.setFieldValue(`${array}[${idx}].max_price`, data.max_price ?? 0);
					formik.setFieldValue(
						`${array}[${idx}].purchase_price`,
						data.purchase_price ?? 0,
					);
					formik.setFieldValue(`${array}[${idx}].no_rack_shelf`, noRackShelvesData);

					// Optional: If you want to process rack IDs as well
					// const racks = [];
					// itemRacks.forEach((item) => {
					//     if (!racks.find((rack) => rack.value === item.rack_id)) {
					//         racks.push({ value: item.rack_id, label: `Rack ${item.rack_id}` });
					//     }
					// });
					// formik.setFieldValue(`${array}[${idx}].rack_ids`, racks);
					// setRackOptions(racks);

					setReRender(ReRender + 1);
				})
				.catch((err) => {
					// Handle errors
					console.error(err);
				});
		}
	};

	// Use the function for both list and childArray
	const getExistingQty = (idx, val) => {
		getExistingQtyForArray('list', idx, val);
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

	// Fetch and set last sold price for the selected customer for a given row
	const updateLastSoldPriceForCustomer = (itemRowIndex, itemId) => {
		if (formik.values.sale_type !== 2 || !formik.values.customer_id || !itemId) {
			formik.setFieldValue(`list[${itemRowIndex}].last_sale_price_customer`, null);
			return;
		}

		apiClient
			.get(`/getItemSaleHistory?item_id=${itemId}&customer_id=${formik.values.customer_id}`)
			.then((res) => {
				const invoiceChildren = res?.data?.customersalehistory?.invoice_child || [];
				if (invoiceChildren.length === 0) {
					formik.setFieldValue(`list[${itemRowIndex}].last_sale_price_customer`, null);
					return;
				}
				// pick the record with the latest invoice date
				let latest = invoiceChildren[0];
				invoiceChildren.forEach((child) => {
					const d1 = new Date(latest?.invoice?.date || 0).getTime();
					const d2 = new Date(child?.invoice?.date || 0).getTime();
					if (d2 > d1) latest = child;
				});
				formik.setFieldValue(
					`list[${itemRowIndex}].last_sale_price_customer`,
					latest?.price ?? null,
				);
			})
			.catch(() => {
				formik.setFieldValue(`list[${itemRowIndex}].last_sale_price_customer`, null);
			});
	};
	useEffect(() => {
		setStoresOptionsLoading(true);
		apiClient
			.get(`/getStoredropdown?store_type_id=2`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				formik.setFieldValue('store_id', rec[0] !== null && rec[0].id);
				// getRacksAndShelfData(rec[0]);
				getRacks(rec[0].id);
				formik.setFieldValue('store_name', rec[0] !== null && rec[0].label);
				setStoresOptions(rec);
				setStoresOptionsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	const handleChange = (index, val) => {
		// const index = selectedOption.value;
		// setalternate_things(formik.values.list[index].items_options);
		handleInputChange(val, index);
	};

	const handleInputChange = (inputValue, index, response) => {
		console.log(inputValue);
		// Filter the options based on inputValue and update alternate_things
		const filteredOptions = formik.values?.list[index]?.items_options?.filter(
			(option) =>
				option?.machine_part.toLowerCase().includes(inputValue?.machine_part.toLowerCase()),
			// option.label,
			// 	.toLowerCase()
			// 	.slice(0, 9)
			// 	.includes(inputValue?.label.toLowerCase().slice(0, 9)),
		);
		console.log(filteredOptions);
		setalternate_things(filteredOptions);
	};

	useEffect(() => {
		console.log('Updated alternate_things:', alternate_things);

		// Assuming rackNumbers is a state variable that contains the rack numbers

		// Additional code here if needed
	}, [alternate_things]);

	useEffect(() => {
		getRacks(formik.values?.store_id);
	}, []);

	const getRacksAndShelfData = (val, index) => {
		const storeId = val && val.store_id ? val.store_id : formik.values.store_id;

		if (val && val.id && storeId) {
			// Check if both item_id and store_id are present
			setRacksAndShelfDataLoading(true);

			// Initialize racksRec and shelvesRec as empty arrays
			const racksRec = [];
			const shelvesRec = [];
			const racksdata = [];

			apiClient
				.get(`/getMachinePartsModelsDropDown?item_id=${val.id}&store_id=${storeId}`)
				.then((response) => {
					console.log(response);

					if (response.data && Array.isArray(response.data.item)) {
						response.data.item.forEach((item) => {
							racksRec.push(
								...item.item_racks.map((rack) => ({
									id: rack?.rack_id,
									rack_number: rack?.racks?.rack_number,
								})),
							);

							shelvesRec.push(
								...item.item_racks.map((shelf) => ({
									id: shelf.shelf_id,
									shelf_number: shelf?.shelves?.shelf_number,
								})),
							);

							racksdata.push(
								...item.item_racks.map((data) => ({
									rack_id: data?.rack_id,
									shelf_id: data?.shelf_id,
									rack_number: data?.racks?.rack_number,
									shelf_number: data?.shelves?.shelf_number,
									quantity: data?.quantity,
									checked: false,
								})),
							);
						});
					} else {
						console.error('Invalid response format:', response);
					}
				})
				.catch((err) => {
					console.error('Error fetching racks and shelves data:', err);
				})
				.finally(() => {
					// Set the state only when data is received
					setRackNumber(racksRec);
					setShelfNumber(shelvesRec);

					// formik.setFieldValue(`list[${index}].item_racks`, racksRec[0].rack_number);
					formik.setFieldValue(`list[${index}].item_racks`, racksdata);

					console.log(racksdata);

					// Clear loading state
					setRacksAndShelfDataLoading(false);
				});
		}
	};

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
	}, []);

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
	}, []);

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

	console.log('The qty available:', formik.values.list);

	// Ensure all list and childArray items have uniqueId for React keys
	useEffect(() => {
		if (formik.values.list && formik.values.list.length > 0) {
			const updatedList = formik.values.list.map((item) => {
				if (!item.uniqueId && !item.item_id) {
					return {
						...item,
						uniqueId: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					};
				}
				return item;
			});
			// Only update if any item was missing uniqueId
			const needsUpdate = updatedList.some(
				(item, index) => item.uniqueId !== formik.values.list[index]?.uniqueId,
			);
			if (needsUpdate) {
				formik.setFieldValue('list', updatedList);
			}
		}
		if (formik.values.childArray && formik.values.childArray.length > 0) {
			const updatedChildArray = formik.values.childArray.map((item) => {
				if (!item.uniqueId && !item.item_id) {
					return {
						...item,
						uniqueId: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					};
				}
				return item;
			});
			// Only update if any item was missing uniqueId
			const needsUpdate = updatedChildArray.some(
				(item, index) => item.uniqueId !== formik.values.childArray[index]?.uniqueId,
			);
			if (needsUpdate) {
				formik.setFieldValue('childArray', updatedChildArray);
			}
		}
	}, [formik.values.list, formik.values.childArray]);

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='danger'
					isLight
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					New Sale
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='xl'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Sale Order </ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2  d-flex justify-content-center align-items-top'>
									<div className='col-12 col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Shop:</h3>
									</div>
									<div className='col-12 col-md-3'>
										<FormGroup label='' id='name'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={storesOptions}
												isLoading={storesOptionsLoading}
												isClearable
												value={
													formik.values.store_id
														? storesOptions?.find(
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
													);
													// getRacksAndShelfData(val);
													getRacks(val.id);
													formik.setFieldValue(
														'store_name',
														val !== null && val.label,
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
									<div className='col-12 col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Type:</h3>
									</div>
									<div className='col-12 col-md-2'>
										<FormGroup label='' id='name'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={saleTypesOptions}
												// isLoading={saleTypesOptionsLoading}
												value={
													formik.values.sale_type
														? saleTypesOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.sale_type,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sale_type',
														val ? val.id : '',
													);
													formik.setFieldValue('customer_id', '');
													formik.setFieldValue(
														'walk_in_customer_name',
														'',
													);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-12 col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Tax:</h3>
									</div>
									<div className='col-12 col-md-2'>
										<FormGroup label='' id='name'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={taxTypesOptions}
												// isLoading={saleTypesOptionsLoading}
												value={
													formik.values.tax_type
														? taxTypesOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.tax_type,
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
									{/* <div className='col-md-2'>
										<Checks
											type='switch'
											id='isNegative'
											label={
												formik.values.isNegative === 1
													? 'Allow Negative Stock'
													: 'DO not allow Negative Stock'
											}
											name='checkedCheck'
											onChange={(e) => {
												formik.setFieldValue(
													'isNegative',
													e.target.checked === true ? 1 : 0,
												);
											}}
											isValid={formik.isValid}
											checked={formik.values.isNegative}
										/>
									</div> */}
								</div>
								<hr />
								<div className='row g-2  d-flex justify-content-start'>
									{formik.values.sale_type === 2 ? (
										<div className='col-12 col-md-5'>
											<FormGroup
												id='customer_id'
												label='Customer'
												className='col-md-12'>
												<InputGroup>
													<ReactSelect
														className='col-md-10'
														isClearable
														isLoading={customerDropDownLoading}
														options={customerDropDown}
														value={
															formik.values.customer_id
																? customerDropDown?.find(
																		(c) =>
																			c.value ===
																			formik.values
																				.customer_id,
																  )
																: null
														}
														onChange={(val) => {
															formik.setFieldValue(
																'customer_id',
																val !== null && val.id,
															);
															formik.setFieldValue(
																'customer_name',
																val !== null && val.label,
															);
														}}
														invalidFeedback={formik.errors.customer_id}
													/>
													<AddCustomer
														refreshDropdowns={refreshDropdowns}
													/>
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
											{/* <div>
												<h4>
													<Button
														className='btn btn-link'
														onClick={() => {
															initialStatusCustomer();
															setStateCustomer(true);
															Details();
														}}>
														Details
													</Button>
												</h4>
											</div> */}
										</div>
									) : (
										<div className='col-12 col-md-3'>
											<FormGroup
												id='walk_in_customer_name'
												label='Customer Name'
												className='col-md-12'>
												<Input
													type='text'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
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

									<div className='col-12 col-md-2'>
										<FormGroup id='date' label='Date'>
											<Input
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
									<div className='col-12 col-md-2'>
										<FormGroup
											id='remarks'
											label='Remarks'
											className='col-md-12'>
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
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.remarks}
											</p>
										)}
									</div>
									<div className='col-12 col-md-2'>
										<FormGroup
											id='delivered_to'
											label='Delivered To'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.delivered_to}
												isValid={formik.isValid}
												isTouched={formik.touched.delivered_to}
												invalidFeedback={formik.errors.delivered_to}
											/>
										</FormGroup>
										{/* {formik.errors.delivered_to && (
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.delivered_to}
											</p>
										)} */}
									</div>

									{/* <div className='col-md-2  '>
										<br />
										<Button
											color='primary'
											icon='add'
											// isDisable={!formik.values.store_id}
											onClick={() => {
												setInvoiceModal(true);
												initialStatusInvoice();
											}}>
											Add New Item Part
										</Button>
									</div> */}
								</div>
								<div>
									<div
										style={{ marginTop: '32px' }}
										className='col-12 col-md-5 d-flex align-items-center'>
										<Button
											color='primary'
											icon='add'
											isDisable={!formik.values.store_id}
											onClick={() => {
												const newItem = {
													uniqueId: `item-${Date.now()}-${Math.random()
														.toString(36)
														.substr(2, 9)}`,
													items_options: [],
													items_options_loading: true,

													item_id: '',
													qty_available: 0,
													total: 0,
													qty: '',
													avg_price: 0,
													last_sale_price: 0,
													max_price: 0,
													min_price: 0,
													purchase_price: 0,
													qty_available_loading: false,
													rack_number: [],
													shelf_number: [],
													rackShelf: [],
													item_racks: [],
													no_rack_shelf: { quantity: 0, checked: false },
												};

												// Add the new item to the 'list' array
												formik.setFieldValue('list', [
													newItem,
													...formik.values.list,
												]);

												// Add the new item to the 'childArray' (replace 'childArray' with your actual array name)
												formik.setFieldValue('childArray', [
													newItem,
													...formik.values.childArray,
												]);

												// Perform any additional actions here, such as fetching data based on the new item
												// Always use index 0 since new item is added at the beginning
												getItemsBasedOnSubCategory(0);
											}}>
											Add New Item
										</Button>
									</div>{' '}
								</div>
								<hr />
								{/* <CardBody className='table-responsive'> */}

								<div className='table-responsive' style={{ overflowX: 'hidden' }}>
									<table className='table text-center mb-2'>
										<thead>
											<tr className='row' style={{ flexWrap: 'nowrap' }}>
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 36.5%',
														maxWidth: '36.5%',
														minWidth: '150px',
													}}>
													Item Parts
												</th>
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 5%',
														maxWidth: '5%',
														minWidth: '80px',
													}}>
													In Stock
												</th>
												{/* <th className='col-md-1'>Rack</th>
											<th className='col-md-1'>Shelf</th> */}
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 9%',
														maxWidth: '9%',
														minWidth: '90px',
													}}>
													Qty
												</th>
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 8%',
														maxWidth: '8%',
														minWidth: '100px',
													}}>
													Rate
												</th>
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 10%',
														maxWidth: '10%',
														minWidth: '100px',
													}}>
													Total
												</th>
												<th
													className='new text-nowrap'
													style={{
														flex: '0 0 10%',
														maxWidth: '10%',
														minWidth: '90px',
													}}
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
												{/* <th className='col-md-1'> Total </th>
											<th className='col-md-1'> Total </th> */}
											</tr>
										</thead>
										<tbody>
											{formik.values.list.length > 0 &&
												formik.values.list?.map((items, index) => (
													<tr
														className='row'
														style={{ flexWrap: 'nowrap' }}
														key={items.uniqueId || items.item_id}>
														<td
															className='new border-start border-end '
															style={{
																padding: 0,
																flex: '0 0 36.5%',
																maxWidth: '36.5%',
															}}>
															<FormGroup
																label=''
																id={`list[${index}].item_id`}>
																<ReactSelect
																	menuPortalTarget={document.body}
																	styles={{
																		...customStyles,
																		menuPortal: (base) => ({
																			...base,
																			zIndex: 9999,
																		}),
																	}}
																	className='col-md-12'
																	classNamePrefix='select'
																	options={
																		formik.values.list[index]
																			.items_options
																	}
																	isLoading={
																		formik.values.list[index]
																			.items_options_loading
																	}
																	value={
																		formik.values.list[index]
																			.item_id
																			? formik.values.list[
																					index
																			  ].items_options.find(
																					(c) =>
																						c.value ===
																						formik
																							.values
																							.list[
																							index
																						].item_id,
																			  )
																			: null
																	}
																	onChange={(val) => {
																		formik
																			.setFieldValue(
																				`list[${index}].item_id`,
																				val !== null &&
																					val.id,
																			)
																			.then(() => {});
																		handleChange(index, val);

																		getBrands(val);
																		getRacksAndShelfData(
																			val,
																			index,
																		);

																		formik.setFieldValue(
																			`list[${index}].item_name`,
																			val !== null &&
																				val.label,
																		);
																		formik.setFieldValue(
																			`list[${index}].qty`,
																			'',
																		);
																		formik.setFieldValue(
																			`list[${index}].total`,
																			0,
																		);
																		getExistingQty(index, val);
																		updateLastSoldPriceForCustomer(
																			index,
																			val?.id,
																		);
																	}}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.list
																			? formik.touched.list[
																					index
																			  ]?.item_id
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																			`list[${index}].item_id`
																		]
																	}
																/>
															</FormGroup>

															{formik.errors[
																`list[${index}]item_id`
															] && (
																<p
																	style={{
																		color: 'red',
																		textAlign: 'center',
																		marginTop: 2,
																		marginBottom: 0,
																	}}>
																	{
																		formik.errors[
																			`list[${index}]item_id`
																		]
																	}
																</p>
															)}
															{showStats && (
																<div className='d-flex justify-content-center'>
																	{items.qty_available_loading ? (
																		<h5>...</h5>
																	) : (
																		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																		<div
																			className=' text-muted fs-6 '
																			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
																			role='button'
																			style={{
																				color: 'orange',
																				fontStyle: 'italic',
																				marginBottom: 0,
																				textDecorationLine:
																					'underline',
																			}}
																			tabIndex={0}
																			onClick={(val) => {
																				if (items.item_id) {
																					initialStatusItems();
																					setStateCustomer(
																						true,
																					);
																					getPartSoldHistory(
																						items.item_id,
																					);
																				}
																			}}>
																			Last Sold at:
																			{items?.last_sale_price ===
																			null
																				? ''
																				: items?.last_sale_price.toLocaleString(
																						undefined,
																						{
																							maximumFractionDigits: 2,
																						},
																				  ) ?? 0}
																			{formik.values
																				.sale_type === 2 &&
																				formik.values
																					.customer_id &&
																				(items?.last_sale_price_customer ??
																					null) !==
																					null && (
																					<span>{` | Last to this customer: ${Number(
																						items.last_sale_price_customer,
																					).toLocaleString(
																						undefined,
																						{
																							maximumFractionDigits: 2,
																						},
																					)}`}</span>
																				)}
																		</div>
																	)}
																</div>
															)}
															<div className='row justify-content-between mt-2'>
																<div>
																	<div className='col'>
																		<p>
																			{isOpen
																				? 'Rack and Shelves'
																				: 'Rack and Shelves'}
																		</p>
																	</div>

																	{/* Button to toggle dropdown */}
																	<Button
																		onClick={toggleDropdown}
																		color='primary'
																		className='mt-1'>
																		{isOpen
																			? 'Hide Details'
																			: 'Show Details'}
																	</Button>
																	{/* Dropdown content */}
																	{isOpen && (
																		<>
																			<div className='mt-2'>
																				<div className='table-responsive'>
																					<table className=' col-md-12 mt-3'>
																						{items.item_racks &&
																							items.item_racks.map(
																								(
																									rack,
																									rackIndex,
																								) => (
																									<tr className='row mt-2 mb-2 '>
																										<td className='col-md-1 mt-4'>
																											<Input
																												id={`list[${index}].item_racks[${rackIndex}].checked`}
																												class='form-check-input ml-2'
																												type='checkbox'
																												// onChange={(
																												// 	e,
																												// ) => {
																												// 	formik.setFieldValue(
																												// 		`billList[${index}].check_box`,
																												// 		e.target
																												// 			.checked,
																												// 	);
																												// }}
																												onChange={
																													formik.handleChange
																												}
																												checked={
																													rack.check_box
																												}
																											/>
																										</td>
																										<td className='col-md-4 border-bottom  border-start border-end'>
																											<div>
																												<FormGroup
																													size='sm'
																													label='Rack'
																													id={`list[${index}].item_racks[${rack}].rack_id`}>
																													<p className='col-md-12'>
																														{
																															rack?.rack_number
																														}
																													</p>
																												</FormGroup>
																											</div>
																										</td>
																										<td className='col-md-4 border-bottom  border-start border-end'>
																											<div>
																												<FormGroup
																													size='sm'
																													label='Shelf'
																													id={`list[${index}].rackShelf[${rackIndex}].shelf_id`}>
																													<p>
																														{
																															rack?.shelf_number
																														}
																													</p>
																												</FormGroup>
																											</div>
																										</td>

																										<td className='col-md-3 border-bottom '>
																											<FormGroup label='Quantity'>
																												<Input
																													type='number'
																													max={
																														rack.quantity
																													}
																													name={`list[${index}].item_racks[${rackIndex}].quantity`}
																													id={`list[${index}].item_racks[${rackIndex}].quantity`}
																													value={
																														rack.quantity
																													}
																													// onChange={
																													// 	formik.handleChange
																													// }
																													disabled
																												/>
																											</FormGroup>
																										</td>
																									</tr>
																								),
																							)}
																					</table>
																				</div>
																			</div>

																			<div className='col'>
																				<p>Other Stocks </p>

																				<div className='mt-2'>
																					<div className='table-responsive'>
																						<table className='col-md-12 mt-3'>
																							<tbody>
																								{items && (
																									<tr className='row mt-2 mb-2'>
																										<td className='col-md-1 mt-4 align-items-center'>
																											<Input
																												id={`list[${index}].no_rack_shelf.checked`}
																												className='form-check-input ml-2'
																												type='checkbox'
																												onChange={
																													formik.handleChange
																												}
																												defaultChecked
																												style={{
																													padding:
																														'0.475rem 0.25rem',
																												}}
																											/>
																										</td>
																										<td className='col-md-8 border-bottom border-start border-end'>
																											<div>
																												<p>
																													Stocks:{' '}
																													{formik
																														.values
																														.list[
																														index
																													]
																														?.no_rack_shelf
																														?.quantity ??
																														0}
																												</p>
																											</div>
																										</td>
																										{/* <td className="col-md-3 border-bottom">
																							<FormGroup label="Quantity">
																								<Input
																									type="number"
																									name={`list[${index}].no_rack_shelf.quantity`}
																									id={`list[${index}].no_rack_shelf.quantity`}
																									value={formik.values.list[index]?.no_rack_shelf?.quantity || 0}
																									disabled
																								/>
																							</FormGroup>
																						</td> */}
																									</tr>
																								)}
																							</tbody>
																						</table>
																					</div>
																				</div>
																			</div>
																		</>
																	)}
																</div>
																{/* <div className='col-auto'>
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
															</div> */}
															</div>
														</td>

														<td
															className='border-start border-end '
															style={{
																flex: '0 0 5%',
																maxWidth: '5%',
																minWidth: '80px',
															}}>
															<FormGroup
																id={`list[${index}].qty_available`}
																label=''
																className='col-md-12'>
																<h5>
																	{items.qty_available_loading ? (
																		<h5>...</h5>
																	) : (
																		<div className='fs-6'>
																			{items.qty_available ??
																				0}
																			{showStats && (
																				<div className='small text-muted'>
																					Avg Cost:
																					<br />
																					{items.avg_price.toLocaleString(
																						undefined,
																						{
																							maximumFractionDigits: 2,
																						},
																					) ?? 0}
																				</div>
																			)}
																		</div>
																	)}
																</h5>
															</FormGroup>
														</td>

														{/* <td className='col-md-1 border-start border-end '>
														<FormGroup
															id={`list[${rowIndex}].rack_number`}
															label=''
															className='col-md-12'>
															{racksAndShelfDataLoading ? (
																<h5>...</h5> // Display loading message while data is being fetched
															) : (
																<h5>
																	<div className='fs-6'>
																		{console.log(formik.values)}
																		{Array.isArray(
																			rackNumber,
																		) && rackNumber.length > 0
																			? rackNumber
																					.map(
																						(rack) =>
																							rack.rack_number,
																					)
																					.join(', ')
																			: '0'}
																	</div>
																</h5>
															)}
														</FormGroup>
													</td>

													<td className='col-md-1 border-start border-end '>
														<FormGroup
															id={`list[${rowIndex}].shelf_number`}
															label=''
															className='col-md-12'>
															{racksAndShelfDataLoading ? (
																<h5>...</h5>
															) : (
																<h5>
																	<div className='fs-6'>
																		{Array.isArray(
																			shelfNumber,
																		) && shelfNumber.length > 0
																			? shelfNumber
																					.map(
																						(shelf) =>
																							shelf.shelf_number,
																					)
																					.join(', ')
																			: '0'}
																	</div>
																</h5>
															)}
														</FormGroup>
													</td> */}

														<td
															className='new border-start border-end '
															style={{
																flex: '0 0 9%',
																maxWidth: '9%',
																minWidth: '90px',
															}}>
															<FormGroup
																id={`list[${index}].qty`}
																label=''>
																<Input
																	size='sm'
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onBlur={formik.handleBlur}
																	min={0}
																	onChange={(val) => {
																		formik.setFieldValue(
																			`list[${index}].qty`,
																			val.target.value,
																		);
																		formik.setFieldValue(
																			`list[${index}].total`,
																			Number(
																				val.target.value,
																			) *
																				Number(
																					formik.values
																						.list[index]
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
																				`list[${index}].qty`,
																				0,
																			);
																			formik.setFieldValue(
																				`list[${index}].total`,
																				formik.values.list[
																					index
																				].price * 0,
																			);
																		}
																		setReRender(ReRender + 1);
																	}}
																	isTouched
																	value={
																		formik.values.list[index]
																			.qty
																	}
																	isValid={formik.isValid}
																	invalidFeedback={
																		formik.errors[
																			`list[${index}]qty`
																		]
																	}
																	// validFeedback='Looks good!'
																/>
															</FormGroup>
														</td>
														<td
															className='new border-start border-end '
															style={{
																flex: '0 0 8%',
																maxWidth: '8%',
																minWidth: '100px',
															}}>
															<FormGroup
																id={`list[${index}].price`}
																label=''>
																<Popovers
																	desc={
																		<div>
																			{items.qty_available_loading ? (
																				<h5>...</h5>
																			) : (
																				<div className='fs-6'>
																					<div className='small text-bold'>
																						Min Price:{' '}
																						{items?.min_price ===
																						null
																							? ''
																							: items?.min_price.toLocaleString(
																									undefined,
																									{
																										maximumFractionDigits: 2,
																									},
																							  ) ??
																							  0}
																						<br />
																						Max Price:{' '}
																						{items?.max_price ===
																						null
																							? ''
																							: items?.max_price.toLocaleString(
																									undefined,
																									{
																										maximumFractionDigits: 2,
																									},
																							  ) ??
																							  0}
																						<br />
																						Purchase
																						Price:{' '}
																						{items?.purchase_price ===
																						null
																							? ''
																							: items?.purchase_price?.toLocaleString(
																									undefined,
																									{
																										maximumFractionDigits: 2,
																									},
																							  ) ??
																							  0}
																					</div>
																				</div>
																			)}
																		</div>
																	}
																	trigger='hover'>
																	<Input
																		size='sm'
																		type='number'
																		onWheel={(e) =>
																			e.target.blur()
																		}
																		onBlur={formik.handleBlur}
																		onChange={(val) => {
																			formik.setFieldValue(
																				`list[${index}].price`,
																				val.target.value,
																			);
																			formik.setFieldValue(
																				`list[${index}].total`,
																				Number(
																					val.target
																						.value,
																				) *
																					Number(
																						formik
																							.values
																							.list[
																							index
																						].qty ?? 0,
																					),
																			);
																			if (
																				val.target.value < 0
																			) {
																				showNotification(
																					_titleError,
																					'Price should not be negative!',
																					'warning',
																				);
																			}
																			setReRender(
																				ReRender + 1,
																			);
																		}}
																		isTouched
																		value={
																			formik.values.list[
																				index
																			].price
																		}
																		isValid={formik.isValid}
																		invalidFeedback={
																			formik.errors[
																				`list[${index}]price`
																			]
																		}
																		// validFeedback='Looks good!'
																	/>
																</Popovers>
															</FormGroup>
														</td>

														<td
															className='new mt-1 border-start border-end text-nowrap'
															style={{
																flex: '0 0 10%',
																maxWidth: '10%',
																minWidth: '100px',
															}}>
															{items.total?.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
															) ?? 0}
														</td>
														<td
															className='new text-nowrap'
															style={{
																flex: '0 0 10%',
																maxWidth: '10%',
																minWidth: '90px',
															}}>
															<Button
																// isDisable={
																// 	formik.values.list.length === 1
																// }
																icon='cancel'
																color='danger'
																onClick={() => removeRow(index)}
															/>
														</td>
														<td className='col-md-1  '>
															<div>
																{/* Button to trigger the modal */}
																<Button
																	color='primary'
																	onClick={toggleModal}>
																	Alternate Parts
																</Button>

																{/* Use the AlternatePartsModal component */}
																<AlternatePartsModal
																	isOpen={isModalOpen}
																	setIsOpen={setIsModalOpen}
																	toggle={toggleModal}
																	data={alternatePartsData}
																	data2={alternate_things}
																	formik={formik}
																/>
															</div>
														</td>
														<td className='col-md-1  '>
															<div>
																{/* Button to trigger the modal */}
																<Button
																	color='primary'
																	onClick={toggleModal1}>
																	Alternate Brands
																</Button>

																{/* Use the AlternatePartsModal component */}
																<AlternateBrandsModal
																	isOpen={isModalOpen1}
																	setIsOpen={setIsModalOpen1}
																	toggle={toggleModal1}
																	data={alternateBrandsData}
																	formik={formik}
																/>
															</div>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>

								<hr />
								<div className='row g-4 d-flex align-items-end'>
									{/* <div className='col-md-3'>
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
												// validFeedback='Looks good!'
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
									</div> */}
									{/* <div className='col-md-3'>
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
												// validFeedback='Looks good!'
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
									</div> */}
									{/* <div className='col-md-3'>
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
													setLabelItem(val.id);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
											/>
										</FormGroup>
										{formik.errors.machine_part_id && (
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.machine_part_id}
											</p>
										)}
									</div> */}
									{/* <div className='col-md-3'>
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
												// validFeedback='Looks good!'
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
									</div> */}
									{/* <div className='row g-4 d-flex align-items-end'>
										<table className='table text-center'>
											<thead>
												<tr className='row'>
													<th className='col-md-4'>Alternate Parts</th>
													<th className='col-md-1'>In Stock</th>
												</tr>
											</thead>
											<tbody>
												{formik.values.childArray.length > 0 &&
													formik.values.childArray.map((items, index) => (
														<tr className='row' key={items.uniqueId || items.item_id}>
															<td
																className='col-md-4 border-start border-end '
																style={{
																	padding: 0,
																}}>
																<FormGroup
																	label=''
																	id={`childArray[${index}].items_id`}>
																	<ReactSelect
																		styles={customStyles}
																		className='col-md-12'
																		classNamePrefix='select'
																		options={
																			formik.values
																				.childArray[index]
																				.items_options
																		}
																		isLoading={
																			formik.values
																				.childArray[index]
																				.items_options_loading
																		}
																		value={
																			formik.values
																				.childArray[index]
																				.items_id
																				? formik.values.childArray[
																						index
																				  ].items_options.find(
																						(c) =>
																							c.value ===
																							formik
																								.values
																								.childArray[
																								index
																							]
																								.items_id,
																				  )
																				: null
																		}
																		onChange={(val) => {
																			formik.setFieldValue(
																				`childArray[${index}].items_id`,
																				val !== null
																					? val.id
																					: null,
																			);
																			formik.setFieldValue(
																				`childArray[${index}].items_name`,
																				val !== null
																					? val.label
																					: '',
																			);
																			formik.setFieldValue(
																				`childArray[${index}].qty`,
																				'',
																			);
																			formik.setFieldValue(
																				`list[${index}].total`,
																				0,
																			);
																			getExistingQty1(
																				index,
																				val,
																			);
																		}}
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched
																				.childArray
																				? formik.touched
																						.childArray[
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
																	<div className='d-flex justify-content-center'>
																		{formik.values.childArray[
																			index
																		].qty_available_loading ? (
																			<h5>...</h5>
																		) : (
																			// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																			<div
																				className=' text-muted fs-6 '
																				// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
																				role='button'
																				style={{
																					color: 'orange',
																					fontStyle:
																						'italic',
																					marginBottom: 0,
																					textDecorationLine:
																						'underline',
																				}}
																				tabIndex={0}
																				onClick={(val) => {
																					if (
																						items.item_id
																					) {
																						initialStatusItems();
																						setStateCustomer(
																							true,
																						);
																						getPartSoldHistory(
																							items.item_id,
																						);
																					}
																				}}>
																				Last Sold at:
																				{items?.last_sale_price ===
																				null
																					? ''
																					: items?.last_sale_price.toLocaleString(
																							undefined,
																							{
																								maximumFractionDigits: 2,
																							},
																					  ) ?? 0}
																			</div>
																		)}
																	</div>
																)}
															</td> */}
									{/* <td className='col-md-1 border-start border-end '>
																<FormGroup
																	id={`childArray[${index}].qty_available`}
																	label=''
																	className='col-md-12'>
																	<h5>
																		{formik.values.childArray[
																			index
																		].qty_available_loading ? (
																			<h5>...</h5>
																		) : (
																			<div className='fs-6'>
																				{formik.values
																					.childArray[
																					index
																				].qty_available ??
																					0}
																				{showStats && (
																					<div className='small text-muted'>
																						Avg Cost:
																						<br />
																						{formik.values.childArray[
																							index
																						].avg_price.toLocaleString(
																							undefined,
																							{
																								maximumFractionDigits: 2,
																							},
																						) ?? 0}
																					</div>
																				)}
																			</div>
																		)}
																	</h5>
																</FormGroup>
															</td> */}
								</div>

								<div className='row g-4 d-flex align-items-top mt-2'>
									<div className='col-12 col-md-2'>
										<FormGroup
											id='total_amount'
											label='Total Amount'
											className='col-md-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onBlur={formik.handleBlur}
												value={formik.values.total_amount}
												readOnly
												isValid={formik.isValid}
												isTouched={formik.touched.total_amount}
												invalidFeedback={formik.errors.total_amount}
											/>
										</FormGroup>
									</div>
									<div className='col-12 col-md-2'>
										<FormGroup
											id='discount'
											label='Discount'
											className='col-md-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onBlur={formik.handleBlur}
												onChange={(val) => {
													formik.setFieldValue(
														`discount`,
														val.target.value,
													);
													formik.setFieldValue(
														`total_after_discount`,
														Number(formik.values.total_amount ?? 0) -
															Number(val.target.value ?? 0),
													);
													if (
														formik.values.sale_type === 1 &&
														formik.values.tax_type === 1
													) {
														formik.values.amount_received =
															Number(
																formik.values.total_amount ?? 0,
															) - Number(val.target.value ?? 0);
													} else if (
														formik.values.sale_type === 2 &&
														formik.values.tax_type === 2
													) {
														formik.values.amount_received =
															Number(
																Number(
																	formik.values.total_amount ?? 0,
																) - Number(val.target.value ?? 0),
															) +
															Number(
																((Number(
																	formik.values.total_amount ?? 0,
																) -
																	Number(val.target.value ?? 0)) *
																	formik.values.gst_percentage) /
																	100,
															);
													}

													formik.setFieldValue(
														`gst`,
														((Number(formik.values.total_amount ?? 0) -
															Number(val.target.value ?? 0)) *
															formik.values.gst_percentage) /
															100,
													);
													formik.setFieldValue(
														`total_after_gst`,
														Number(
															Number(
																formik.values.total_amount ?? 0,
															) - Number(val.target.value ?? 0),
														) +
															Number(
																((Number(
																	formik.values.total_amount ?? 0,
																) -
																	Number(val.target.value ?? 0)) *
																	formik.values.gst_percentage) /
																	100,
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
									<div className='col-12 col-md-2'>
										<FormGroup
											id='total_after_discount'
											label='Amount After Discount'
											className='col-md-12'>
											<Input
												value={formik.values.total_after_discount}
												disabled
												readOnly
												isValid={formik.isValid}
												isTouched={formik.touched.total_after_discount}
												invalidFeedback={formik.errors.total_after_discount}
											/>
										</FormGroup>
									</div>

									{formik.values.tax_type === 2 && (
										<>
											<div className='col-12 col-md-2'>
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
															// formik.setFieldValue(
															// 	`gst`,
															// 	(formik.values
															// 		.total_after_discount *
															// 		val.target.value) /
															// 		100,
															// );
															// formik.setFieldValue(
															// 	`total_after_gst`,
															// 	Number(
															// 		formik.values
															// 			.total_after_discount,
															// 	) +
															// 		(formik.values
															// 			.total_after_discount *
															// 			val.target.value) /
															// 			100,
															// );

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
											<div className='col-12 col-md-2'>
												<FormGroup
													readOnly
													id='GST'
													label='GST'
													className='col-md-12'>
													<Input
														readOnly
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.gst.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
														)}
														isValid={formik.isValid}
														isTouched={formik.touched.discount}
														invalidFeedback={formik.errors.discount}
													/>
												</FormGroup>
											</div>
											<div className='col-12 col-md-2'>
												<FormGroup
													id='total_after_gst'
													label='Amount with GST'
													className='col-md-12'>
													<Input
														value={formik.values.total_after_gst.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
														)}
														disabled
														readOnly
														isValid={formik.isValid}
														isTouched
														invalidFeedback={
															formik.errors.total_after_gst
														}
														// validFeedback='Looks good!'
													/>
												</FormGroup>
											</div>
										</>
									)}
								</div>
								<div className='row g-4 d-flex align-items-top'>
									<div className='col-12 col-md-2'>
										<FormGroup
											id='amount_received'
											label='Received Amount Cash'
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
									<div className='col-12 col-md-3'>
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
												// validFeedback='Looks good!'
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
									<div className='col-12 col-md-2'>
										<FormGroup
											id='bank_amount_received'
											label='Received Amount Bank'
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
									<div className='col-12 col-md-3'>
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
															c.value ===
															formik.values.bank_account_id,
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
												// validFeedback='Looks good!'
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
										className='mr-0'
										color='primary'
										onClick={() => {
											generatePDF1(formik.values, 2);
										}}>
										Print
									</Button>
									<Button
										className='me-3'
										icon={isLoading ? null : 'Save'}
										isLight
										color='success'
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading ? 'Saving' : 'Save'}
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
Add.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Add;
