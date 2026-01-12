// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports

import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

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

// import AddCustomer from './modals/addCustomer';
// import DetailsCustomer from './detailsCustomer';
// import DetailsItems from './detailsItem';
// import generatePDF1 from './pdf/addPDF';
// import Add1 from './itemPart';

const validate = (values) => {
	let errors = {};

	if (values.tax_type === 2 && values.sale_type === 1) {
		if (
			Number(values.amount_received) + Number(values.bank_amount_received) !==
			Number(values.total_after_gst)
		)
			errors.amount_received =
				'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount after Gst';
		errors.bank_amount_received =
			'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount after Gst';
	}

	if (values.tax_type === 1 && values.sale_type === 1) {
		if (
			Number(values.amount_received) + Number(values.bank_amount_received) !==
			Number(values.total_after_gst)
		)
			errors.amount_received =
				'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount ';
		errors.bank_amount_received =
			'Sum of Received Amount and Bank Received Amount Should be Equal to the Total amount ';
	}

	if (values.tax_type === 2 && values.sale_type === 1) {
		if (
			Number(values.amount_received) + Number(values.bank_amount_received) >
			values.total_after_discount
		)
			errors.amount_received =
				'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount after GST';
		errors.bank_amount_received =
			'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount after GST';
	}

	if (values.tax_type === 1 && values.sale_type === 1) {
		if (
			Number(values.amount_received) + Number(values.bank_amount_received) >
			values.total_after_discount
		)
			errors.amount_received =
				'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount';
		errors.bank_amount_received =
			'Sum of Received Amount and Bank Received Amount cannot be greater than Total amount';
	}
	if (values.amount_received === '') errors.amount_received = 'Required';
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
	if (!values.list.length > 0) {
		errors.list = 'Add Items In list';
	}
	if (!values.account_id) {
		errors.account_id = 'Required';
	}
	// if (!values.bank_account_id) {
	// 	errors.bank_account_id = 'Required';
	// }

	if (values.discount < 0) {
		errors.discount = 'Required';
	}
	if (values.total_after_discount < 0) {
		errors.total_after_discount = 'Required';
	}

	values.list.forEach((data, index) => {
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
		// if (data.qty > data.qty_available) {
		// 	errors = {
		// 		...errors,
		// 		[`list[${index}]qty`]: 'Insufficient Qty',
		// 	};
		// }
		if (data.price < data.min_price) {
			errors = {
				...errors,
				[`list[${index}]price`]: 'Low Rate',
			};
		}
	});
	return errors;
};
const Add = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);

	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);

	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [showStats, setShowStats] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [isLoading1, setIsLoading1] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [itemsOptions, setItemsOptions] = useState([]);
	const [itemsOptionsLoading, setItemsOptionsLoading] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);
	// const [storeLoading, setStoreLoading] = useState(false);

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
			delivered_to: '',
			list: [],
			sale_type: 1,
			tax_type: 1,
			gst: '',
			gst_percentage: 0,
			total_after_gst: '',
		},
		validate,
		onSubmit: () => {
			setTimeout(handleSave, handleNegative, 2000);
		},
	});
	const handleSave = () => {
		setIsLoading(true);
		submitForm(formik);
	};
	const handleNegative = () => {
		setIsLoading1(true);
		negativeInventoryForm(formik);
	};
	const removeRow = (i) => {
		formik.setFieldValue('list', [
			...formik.values.list.slice(0, i),
			...formik.values.list.slice(i + 1),
		]);
		// console.log(formik.touched);
		// console.log(formik.errors);
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
		// //  formik.setFieldValue('total', price);
		// console.log('amount', p);
	};

	useEffect(() => {
		if (formik.values.tax_type === 1) {
			formik.setFieldValue('gst_percentage', 0);
		} else {
			formik.setFieldValue('gst_percentage', 18);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.gst_percentage]);
	useEffect(() => {
		calculateTotal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.list]);

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
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		apiClient
			.get(`/getCashAccounts`)
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
			// eslint-disable-next-line no-console
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

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addNewSale`, myFormik.values)
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
	const negativeInventoryForm = (myFormik) => {
		apiClient
			.post(`/addNewSale?isNegative=1`, myFormik.values)
			.then((res) => {
				// console.log('myformik', myFormik.values);
				if (res.data.status === 'ok') {
					formik.resetForm();
					showNotification(_titleSuccess, res.data.message, 'success');
					setState(false);
					refreshTableData();
					setIsLoading1(false);
				} else {
					setIsLoading1(false);
					showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setIsLoading1(false);
				showNotification(_titleError, err.message, 'Danger');

				setIsLoading1(false);
			});
	};

	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	};
	const getItemsBasedOnSubCategory = (index) => {
		// if (formik.values.category_id) {
		formik.setFieldValue(`list[${index}].items_options_loading`, true);

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
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				formik.setFieldValue(`list[${index}].items_options`, rec);

				formik.setFieldValue(`list[${index}].items_options_loading`, false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// } else {
		// 	formik.setFieldValue(`list[${index}].items_options`, []);
		// 	formik.setFieldValue(`list[${index}].items_options_loading`, false);
		// }
	};
	const getExistingQty = (idx, val) => {
		if (formik.values.store_id && val) {
			formik.setFieldValue(`list[${idx}].qty_available_loading`, true);

			apiClient
				.get(
					`/getItemPartsOemQty?store_id=${
						formik.values.store_id ? formik.values.store_id : ''
					}&id=${val ? val.id : ''}`,
				)
				.then((response) => {
					formik.setFieldValue(`list[${idx}].qty_available_loading`, false);
					formik.setFieldValue(`list[${idx}].price`, response.data.data?.sale_price ?? 0);
					formik.setFieldValue(
						`list[${idx}].qty_available`,
						response.data.data.item_inventory2?.quantity ?? 0,
					);
					formik.setFieldValue(
						`list[${idx}].avg_price`,
						response.data.data?.avg_cost ?? 0,
					);
					formik.setFieldValue(
						`list[${idx}].last_sale_price`,
						response.data.data.last_sale_price ?? 0,
					);
					formik.setFieldValue(
						`list[${idx}].min_price`,
						response.data.data.min_price ?? 0,
					);
					formik.setFieldValue(
						`list[${idx}].max_price`,
						response.data.data.max_price ?? 0,
					);
					setReRender(ReRender + 1);
				})

				// eslint-disable-next-line no-console
				.catch((err) => {
					showNotification(_titleError, err.message, 'Danger');
					if (err.response.status === 401) {
						showNotification(_titleError, err.response.data.message, 'Danger');
					}
				});
		}
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
					showNotification(_titleError, err.message, 'Danger');
				});
		}
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
				setStoresOptions(rec);
				setStoresOptionsLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	// const Details = () => {
	// 	if (formik.values.sale_type === 2) {
	// 		setCustomerDetailsLoading(true);
	// 		apiClient
	// 			.get(
	// 				`/getItemSaleHistory?item_id=${
	// 					formik.values.list[index].item_id ? formik.values.list[index].item_id : ''
	// 				}&customer_id=${formik.values.customer_id ? formik.values.customer_id : ''}`,
	// 			)
	// 			.then((res) => {
	// 				// console.log('recev state', res.data.data);
	// 				setCustomerDetails(res.data.customersalehistory);
	// 				setCustomerDetailsLoading(false);
	// 			})
	// 			.catch((err) => {
	// 				showNotification(_titleError, err.message, 'Danger');
	// 			});
	// 	} else {
	// 		setItemDetailsLoading(true);
	// 		apiClient
	// 			.get(
	// 				`/getItemSaleHistory?item_id=${
	// 					formik.values.list[index].item_id ? formik.values.list[index].item_id : ''
	// 				}`,
	// 			)
	// 			.then((res) => {
	// 				// console.log('recev state', res.data.data);
	// 				setItemDetails(res.data.Salehistory);
	// 				setItemDetailsLoading(false);
	// 			})
	// 			.catch((err) => {
	// 				showNotification(_titleError, err.message, 'Danger');
	// 			});
	// 	}
	// };

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
						<ModalTitle id='exampleModalLabel'>Add Sale Order</ModalTitle>
					</CardLabel>
				</ModalHeader>
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
									<div className='col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Type:</h3>
									</div>
									<div className='col-md-3'>
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
									<div className='col-md-1 d-flex justify-content-center align-items-top'>
										<h3>Tax:</h3>
									</div>
									<div className='col-md-3'>
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
													{/* <AddCustomer
														refreshDropdowns={refreshDropdowns}
													/> */}
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
										<div className='col-md-3'>
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

									<div className='col-md-2'>
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
									<div className='col-md-2'>
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
									<div className='col-md-2'>
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
										{formik.errors.delivered_to && (
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.delivered_to}
											</p>
										)}
									</div>

									<div className='col-md-2  '>
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
										{formik.values.list.length > 0 &&
											formik.values.list.map((items, index) => (
												<tr className='row' key={items.index}>
													<td className='col-md-4 border-start border-end '>
														<FormGroup
															label=''
															id={`list[${index}].item_id`}>
															<ReactSelect
																styles={customStyles}
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
																// isClearable
																value={
																	formik.values.list[index]
																		.item_id
																		? formik.values.list[
																				index
																		  ].items_options.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.list[index]
																						.item_id,
																		  )
																		: null
																}
																onChange={(val) => {
																	formik.setFieldValue(
																		`list[${index}].item_id`,
																		val !== null && val.id,
																	);
																	formik.setFieldValue(
																		`list[${index}].item_name`,
																		val !== null && val.label,
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
																}}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.list
																		? formik.touched.list[index]
																				?.item_id
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`list[${index}].item_id`
																	]
																}
															/>
														</FormGroup>
														{formik.errors[`list[${index}]item_id`] && (
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
																		`list[${index}]item_id`
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
																	</p>
																)}
															</p>
														)}
													</td>

													<td className='col-md-1 border-start border-end '>
														<FormGroup
															id={`list[${index}].qty_available`}
															label=''
															className='col-md-12'>
															<h5>
																{items.qty_available_loading ? (
																	<h5>...</h5>
																) : (
																	<p className='fs-6'>
																		{items.qty_available ?? 0}
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
																	</p>
																)}
															</h5>
														</FormGroup>
													</td>
													<td className='col-md-2 border-start border-end '>
														<FormGroup
															id={`list[${index}].qty`}
															label=''>
															<Input
																size='sm'
																type='number'
																onWheel={(e) => e.target.blur()}
																onBlur={formik.handleBlur}
																min='0'
																onChange={(val) => {
																	formik.setFieldValue(
																		`list[${index}].qty`,
																		val.target.value,
																	);
																	formik.setFieldValue(
																		`list[${index}].total`,
																		Number(val.target.value) *
																			Number(
																				formik.values.list[
																					index
																				].price ?? 0,
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
																	formik.values.list[index].qty
																}
																isValid={formik.isValid}
																invalidFeedback={
																	formik.errors[
																		`list[${index}]qty`
																	]
																}
																validFeedback='Looks good!'
															/>
														</FormGroup>
													</td>
													<td className='col-md-2 border-start border-end '>
														<FormGroup
															id={`list[${index}].price`}
															label=''>
															<Input
																size='sm'
																type='number'
																onWheel={(e) => e.target.blur()}
																onBlur={formik.handleBlur}
																onChange={(val) => {
																	formik.setFieldValue(
																		`list[${index}].price`,
																		val.target.value,
																	);
																	formik.setFieldValue(
																		`list[${index}].total`,
																		Number(val.target.value) *
																			Number(
																				formik.values.list[
																					index
																				].qty ?? 0,
																			),
																	);
																	if (val.target.value < 0) {
																		showNotification(
																			_titleError,
																			'Price should not be negative!',
																			'warning',
																		);
																	}
																	setReRender(ReRender + 1);
																}}
																isTouched
																value={
																	formik.values.list[index].price
																}
																isValid={formik.isValid}
																invalidFeedback={
																	formik.errors[
																		`list[${index}]price`
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
																			: items?.min_price.toLocaleString(
																					undefined,
																					{
																						maximumFractionDigits: 2,
																					},
																			  ) ?? 0}
																		<br />
																		Max Price:
																		{items?.max_price === null
																			? ''
																			: items?.max_price.toLocaleString(
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
														{items.total?.toLocaleString(undefined, {
															maximumFractionDigits: 2,
														}) ?? 0}
													</td>
													<td className='col-md-1  '>
														<Button
															// isDisable={
															// 	formik.values.list.length === 1
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
									</div> */}
									<div className='col-md-3 d-flex align-items-center'>
										<br />
										<Button
											color='primary'
											icon='add'
											isDisable={!formik.values.store_id}
											onClick={() => {
												formik
													.setFieldValue('list', [
														...formik.values.list,
														{
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
															qty_available_loading: false,
														},
													])
													.then(
														getItemsBasedOnSubCategory(
															formik.values.list.length,
														),
													);
											}}>
											Add New Item
										</Button>
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
												readOnly
												isValid={formik.isValid}
												isTouched={formik.touched.total_amount}
												invalidFeedback={formik.errors.total_amount}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
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
									<div className='col-md-2'>
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
											<div className='col-md-2'>
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
											<div className='col-md-2'>
												<FormGroup
													id='total_after_gst'
													label='Amount with GST'
													className='col-md-12'>
													<Input
														value={formik.values.total_after_gst}
														disabled
														readOnly
														isValid={formik.isValid}
														isTouched
														invalidFeedback={
															formik.errors.total_after_gst
														}
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
										icon={isLoading1 ? null : 'Save'}
										isLight
										color='primary'
										isDisable={isLoading1}
										onClick={formik.handleSubmit}>
										{isLoading1 && <Spinner isSmall inButton />}
										{isLoading1 ? 'Sending' : 'Send with Negative Inventory'}
									</Button>
									<Button
										className='mr-0'
										color='primary'
										onClick={() => {
											// generatePDF1(formik, 2);
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
					<Card stretch>{/* <Add1 /> */}</Card>
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
							{/* {customerDetailsLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<DetailsCustomer
									customerDetails={customerDetails}
									// handleStateCustomer={handleStateCustomer}
								/>
							)} */}
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
