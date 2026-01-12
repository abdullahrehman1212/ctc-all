// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import Cookies from 'js-cookie';
import moment from 'moment';
import SelectReact from 'react-select';
import Flatpickr from 'react-flatpickr';

import { componentsMenu } from '../../../../menu';
import apiClient from '../../../../baseURL/apiClient';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Spinner from '../../../../components/bootstrap/Spinner';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Card, {
	CardBody,
	CardCodeView,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';

// ** Reactstrap Imports
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import Input from '../../../../components/bootstrap/forms/Input';
// ** apiClient Imports
import baseURL from '../../../../baseURL/baseURL';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, {
	dataPagination,
} from '../../../../components/defaultPagination/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';
import 'flatpickr/dist/themes/light.css';
import showNotification from '../../../../components/extras/showNotification';
import GeneratePVVoucherPDF from '../vouchers/printVouchers/GeneratePVVoucherPDF';
import GenerateRVVoucherPDF from '../vouchers/printVouchers/GenerateRVVoucherPDF';
import GenerateJVVoucherPDF from '../vouchers/printVouchers/GenerateJVVoucherPDF';
import GenerateCVVoucherPDF from '../vouchers/printVouchers/GenerateCVVoucherPDF';
import GenerateLPVVoucherPDF from '../filesVouchers/printVouchers/GenerateLPVVoucherPDF';
import GenerateLRVVoucherPDF from '../filesVouchers/printVouchers/GenerateLRVVoucherPDF';
import GenerateLJVVoucherPDF from '../filesVouchers/printVouchers/GenerateLJVVoucherPDF';
import Select from '../../../../components/bootstrap/forms/Select';

import useDarkMode from '../../../../hooks/useDarkMode';
import PaymentVoucher from './editVouchers/PaymentVoucher/index';
import ReceiptVoucher from './editVouchers/ReceiptVoucher/index';
import JVVoucher from './editVouchers/JVVoucher/index';
import CVVoucher from './editVouchers/CVVoucher/index';
import LPaymentVoucher from './editVouchers/landEditVouchers/PaymentVoucher/index';
import LReceiptVoucher from './editVouchers/landEditVouchers/ReceiptVoucher/index';
import LJVVoucher from './editVouchers/landEditVouchers/JVVoucher/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import VoucherHistory from './voucherHistory';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];
export const _postDatedStatusOptions = [
	{ value: 1, text: 'Pending' },
	{ value: 0, text: 'Cleared ' },
	{ value: 2, text: 'Returned ' },
];
export const _voucherOptions = [
	{ value: 0, text: 'All' },
	{ value: 1, text: 'PV' },
	{ value: 2, text: 'RV' },
	{ value: 3, text: 'JV' },
	{ value: 4, text: 'CV' },
	{ value: 5, text: 'LPV' },
	{ value: 6, text: 'LRV' },
	{ value: 7, text: 'LJV' },
];
export const _voucherCategories = [
	{ value: 0, text: 'Default' },
	{ value: 1, text: 'Approved' },
	{ value: 2, text: 'Pending' },
	{ value: 3, text: 'Edited' },
	{ value: 4, text: 'Deleted' },
];
export const _voucherPostDated = [
	{ value: 0, text: 'Default' },
	{ value: 1, text: 'Post Dated' },
	{ value: 2, text: 'Post Dated Cleared' },
	{ value: 3, text: 'Post Dated Returned' },
	{ value: 4, text: 'Post Dated Pending' },
];

const DashboardPage = () => {
	// const [startDate, setStartDate] = useState(moment().startOf('month').format('DD/MM/YY'));
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState(moment().format('DD/MM/YY'));

	const [startDate2, setStartDate2] = useState(moment().startOf('month'));
	const [endDate2, setEndDate2] = useState(moment());
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [searchNo, setSearchNo] = useState('');

	const [searchBy, setSearchBy] = useState('1');
	const [voucherType, setVoucherType] = useState('0');
	const [voucherCategory, setVoucherCategory] = useState('0');
	const [voucherPostDated, setVoucherPostDated] = useState('0');
	const [postDatedStatusOptionsSelected, setPostDatedStatusOptionsSelected] = useState();
	const [postDatedDateStatusOptionsSelected, setPostDatedDateStatusOptionsSelected] = useState(
		new Date(),
	);

	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [mainAccountOptions, setMainAccountOptions] = useState('');
	const [subGroupsOptions, setSubGroupsOptions] = useState('');
	const [accountOptions, setAccountOptions] = useState('');

	const [mainAccountOptionsLoading, setMainAccountOptionsLoading] = useState(true);
	const [subGroupsOptionsLoading, setSubGroupsOptionsLoading] = useState(true);
	const [accountOptionsLoading, setAccountOptionsLoading] = useState(true);

	const [mainAccountSelected, setMainAccountSelected] = useState(null);
	const [subGroupsSelected, setSubGroupsSelected] = useState(null);
	const [accountSelected, setAccountSelected] = useState(null);

	useEffect(() => {
		refreshVouchers();
		apiClient
			.get(`/getCoaGroups`)
			.then((response) => {
				const rec = response.data.coaGroup.map(({ id, name, code }) => ({
					id,
					value: id,

					label: `${code}-${name}`,
				}));
				setMainAccountOptions(rec);
				setMainAccountOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCoaSubGroups`)
			.then((response) => {
				const rec = response.data.coaSubGroups.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				setSubGroupsOptions(rec);
				setSubGroupsOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCoaAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				setAccountOptions(rec);
				setAccountOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setSubGroupsSelected(null);
		setSubGroupsOptions([]);
		setAccountSelected(null);
		setAccountOptions([]);
		setSubGroupsOptionsLoading(true);
		setAccountOptionsLoading(true);
		if (mainAccountSelected !== null) {
			apiClient
				.get(`/coaSubGroupsByGroup?coa_group_id=${mainAccountSelected.id}`)
				.then((response) => {
					const rec = response.data.coaSubGroups.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setSubGroupsOptions(rec);
					setSubGroupsOptionsLoading(false);
				})
				.catch((err) => console.log(err));
			apiClient
				.get(`/getAccountsByGroup?coa_group_id=${mainAccountSelected.id}`)
				.then((response) => {
					const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setAccountOptions(rec);
					setAccountOptionsLoading(false);
				})
				.catch((err) => console.log(err));
		} else {
			setAccountOptionsLoading(true);
			setSubGroupsOptionsLoading(true);
			apiClient
				.get(`/getCoaSubGroups`)
				.then((response) => {
					const rec = response.data.coaSubGroups.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setSubGroupsOptions(rec);
					setSubGroupsOptionsLoading(false);
				})
				.catch((err) => console.log(err));
			apiClient
				.get(`/getCoaAccounts`)
				.then((response) => {
					const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setAccountOptions(rec);
					setAccountOptionsLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, [mainAccountSelected]);
	useEffect(() => {
		setAccountSelected(null);
		if (subGroupsSelected !== null) {
			setAccountOptionsLoading(true);
			setAccountOptions([]);
			apiClient
				.get(`/getAccountsBySubGroup?coa_sub_group_id=${subGroupsSelected.id}`)
				.then((response) => {
					const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setAccountOptions(rec);
					setAccountOptionsLoading(false);
				})
				.catch((err) => console.log(err));
		} else {
			setAccountOptionsLoading(true);
			setAccountOptions([]);
			apiClient
				.get(`/getCoaAccounts`)
				.then((response) => {
					const rec = response.data.coaAccounts.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setAccountOptions(rec);
					setAccountOptionsLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, [subGroupsSelected]);
	// const refreshPage = () => {
	// 	setCurrentPage(1);
	// };
	const searchFilterTrigger = () => {
		setLandsViewLoading(true);
		if (searchNo !== '') {
			apiClient
				.get(`/getVouchers?voucher_no=${searchNo}`)
				.then((response) => {
					setLandsView(response.data.vouchers);
					setLandsViewLoading(false);
				})
				.catch((err) => console.log(err));
		} else {
			refreshVouchers();
		}
	};

	useEffect(
		() => {
			searchFilterTrigger();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage, currentPage],
	);

	const updatePostDatedVoucher = (id) => {
		setIsLoading(true);

		apiClient
			.post(
				`/clearPostDatedVoucher?voucher_id=${id}&is_post_dated=${postDatedStatusOptionsSelected}&date=${postDatedDateStatusOptionsSelected}`,
			)
			.then((response) => {
				showNotification('Voucher Status Updated', response.data.message, 'success');
				refreshVouchers();
				setIsLoading(false);

				setStatePostDated(false);
			})
			.catch((err) => {
				console.log(err);
				setEditingVoucherDataLoading(false);

				showNotification('Error', err.message, 'danger');
			});
	};

	const refreshVouchers = () => {
		setLandsViewLoading(true);

		const getVouchersByType = () => {
			apiClient
				.get(
					`/getVouchers?type=${voucherType === '0' ? '' : voucherType}
			&isApproved=${voucherCategory === '1' ? 1 : ''}${voucherCategory === '2' ? 0 : ''}

			&isEdited=${voucherCategory === '3' ? 1 : ''}
			&isDeleted=${voucherCategory === '4' ? 1 : ''}
			&coa_account_id=${accountSelected !== null ? accountSelected.id : ''}
			&coa_sub_group_id=${subGroupsSelected !== null ? subGroupsSelected.id : ''}
			&coa_group_id=${mainAccountSelected !== null ? mainAccountSelected.id : ''}
			&from=${startDate}&to=${endDate}
			${voucherPostDated === '1' ? '&is_post_dated=3' : ''}
			${voucherPostDated === '2' ? '&is_post_dated=0' : ''}
			${voucherPostDated === '3' ? '&is_post_dated=2' : ''}
			${voucherPostDated === '4' ? '&is_post_dated=1' : ''}
			`,
				)
				.then((response) => {
					setLandsView(response.data.vouchers);
					setLandsViewLoading(false);
				})
				.catch((err) => console.log(err));
		};
		if (searchNo !== '') {
			apiClient
				.get(`/getVouchers?voucher_no=${searchNo}`)
				.then((response) => {
					setLandsView(response.data.vouchers);
					setLandsViewLoading(false);
				})
				.catch((err) => console.log(err));
		} else {
			getVouchersByType();
		}
	};

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [landsView, setLandsView] = useState([]);
	const [landsViewLoading, setLandsViewLoading] = useState(true);
	const [printreport, setPrintreport] = useState([]);

	// const { items, requestSort, getClassNamesFor } = useSortableData(landsView);
	const { items, requestSort, getClassNamesFor } = useSortableData(landsView);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);
	const approveVoucher = (id) => {
		apiClient
			.get(`/approveOrUnapproveVoucher?voucher_id=${id}`)
			.then((response) => {
				showNotification('Voucher Approved', response.data.message, 'success');
				refreshVouchers();
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	const printVoucher = (id, VoucherType, docType) => {
		apiClient
			.get(`/getVoucherDetails?voucher_id=${id}`)
			.then((response) => {
				setPrintreport(response.data.voucher);
				//   setLoading(false)
				if (VoucherType === 1) {
					GeneratePVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 2) {
					GenerateRVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 3) {
					GenerateJVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 4) {
					GenerateCVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 5) {
					GenerateLPVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 6) {
					GenerateLRVVoucherPDF(response.data.voucher, docType);
				} else if (VoucherType === 7) {
					GenerateLJVVoucherPDF(response.data.voucher, docType);
				}

				showNotification('Printing Voucher', 'Printing  Voucher Successfully', 'success');

				// showNotification('Printing Reports', 'Printing 2 reports Successfully', 'success');
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	const handleStateEdit = (status) => {
		refreshVouchers();
		setStateEdit(status);
	};

	const [stateDelete, setStateDelete] = useState(false);

	const [staticBackdropStatusDelete, setStaticBackdropStatusDelete] = useState(false);
	const [scrollableStatusDelete, setScrollableStatusDelete] = useState(false);
	const [centeredStatusDelete, setCenteredStatusDelete] = useState(false);
	const [sizeStatusDelete, setSizeStatusDelete] = useState(null);
	const [fullScreenStatusDelete, setFullScreenStatusDelete] = useState(null);
	const [animationStatusDelete, setAnimationStatusDelete] = useState(true);

	const [headerCloseStatusDelete, setHeaderCloseStatusDelete] = useState(true);

	const initialStatusDelete = () => {
		setStaticBackdropStatusDelete(false);
		setScrollableStatusDelete(false);
		setCenteredStatusDelete(false);
		setSizeStatusDelete('md');
		setFullScreenStatusDelete(null);
		setAnimationStatusDelete(true);
		setHeaderCloseStatusDelete(true);
	};

	const [deletingVoucherId, setDeletingVoucherId] = useState('');

	const deleteFile = (id) => {
		apiClient
			.delete(`/deleteVoucher?voucher_id=${id}`)
			.then((response) => {
				showNotification('Success', response.data.message, 'success');
				refreshVouchers();
				setStateDelete(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [sizeStatusEdit, setSizeStatusEdit] = useState(null);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setSizeStatusEdit('xl');
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const [editingVoucherId, setEditingVoucherId] = useState('');
	const [editingVoucherType, setEditingVoucherType] = useState('');
	const [editingVoucherData, setEditingVoucherData] = useState([]);
	const [editingVoucherDataLoading, setEditingVoucherDataLoading] = useState(false);

	const getEditingVoucher = (id) => {
		setEditingVoucherDataLoading(true);
		apiClient
			.get(`/editVoucher?voucher_id=${id}`)
			.then((response) => {
				setEditingVoucherData(response.data.voucher);
				setPostDatedDateStatusOptionsSelected(
					response.data.voucher.cheque_date !== null
						? response.data.voucher.cheque_date
						: moment(new Date()).format('DD/MM/YY'),
				);
				setEditingVoucherDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	// History

	// Edit
	const [stateHistory, setStateHistory] = useState(false);

	const [staticBackdropStatusHistory, setStaticBackdropStatusHistory] = useState(true);
	const [scrollableStatusHistory, setScrollableStatusHistory] = useState(false);
	const [centeredStatusHistory, setCenteredStatusHistory] = useState(false);
	const [sizeStatusHistory, setSizeStatusHistory] = useState(null);
	const [fullScreenStatusHistory, setFullScreenStatusHistory] = useState(null);
	const [animationStatusHistory, setAnimationStatusHistory] = useState(true);

	const [headerCloseStatusHistory, setHeaderCloseStatusHistory] = useState(true);

	const initialStatusHistory = () => {
		setStaticBackdropStatusHistory(true);
		setScrollableStatusHistory(false);
		setCenteredStatusHistory(false);
		setSizeStatusHistory('xl');
		setFullScreenStatusHistory(false);
		setAnimationStatusHistory(true);
		setHeaderCloseStatusHistory(true);
	};
	const handleStateHistory = (status) => {
		setStateHistory(status);
	};

	const getVoucherHistory = (id) => {
		setEditingVoucherDataLoading(true);
		apiClient
			.get(`/getEditedVoucherDetails?voucher_id=${id}`)
			.then((response) => {
				setEditingVoucherData(response.data.voucher);

				setEditingVoucherDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	// postdated
	const [statePostDated, setStatePostDated] = useState(false);

	const [staticBackdropStatusPostDated, setStaticBackdropStatusPostDated] = useState(true);
	const [scrollableStatusPostDated, setScrollableStatusPostDated] = useState(false);
	const [centeredStatusPostDated, setCenteredStatusPostDated] = useState(false);
	const [sizeStatusPostDated, setSizeStatusPostDated] = useState(null);
	const [fullScreenStatusPostDated, setFullScreenStatusPostDated] = useState(null);
	const [animationStatusPostDated, setAnimationStatusPostDated] = useState(true);

	const [headerCloseStatusPostDated, setHeaderCloseStatusPostDated] = useState(true);

	const initialStatusPostDated = () => {
		setStaticBackdropStatusPostDated(true);
		setScrollableStatusPostDated(false);
		setCenteredStatusPostDated(false);
		setSizeStatusPostDated('md');
		setFullScreenStatusPostDated(false);
		setAnimationStatusPostDated(true);
		setHeaderCloseStatusPostDated(true);
	};
	const handleStatePostDated = (status) => {
		setStatePostDated(status);
	};
	return (
		<PageWrapper title={componentsMenu.components.subMenu.table.text}>
			<Page>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Vouchers</CardTitle>
								</CardLabel>
							</CardHeader>

							<CardBody>
								<div className='row g-4'>
									<FormGroup className='col-md-2' label='Type'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setVoucherType(e.target.value);
											}}
											value={voucherType}
											list={_voucherOptions}
										/>
									</FormGroup>

									<FormGroup className='col-md-2' label='Category'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setVoucherCategory(e.target.value);
											}}
											value={voucherCategory}
											list={_voucherCategories}
										/>
									</FormGroup>
									<FormGroup className='col-md-2' label='Post Dated'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setVoucherPostDated(e.target.value);
											}}
											value={voucherPostDated}
											list={_voucherPostDated}
										/>
									</FormGroup>
									<div className='col-md-2'>
										<FormGroup label='From' id='from'>
											<Flatpickr
												className='form-control'
												value={startDate}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													dateFormat: 'd/m/y',
													allowInput: true,
												}}
												onChange={(date, dateStr) => {
													setStartDate(dateStr);
													setStartDate2(date[0]);
												}}
												onClose={(date, dateStr) => {
													setStartDate(dateStr);
													setStartDate2(date[0]);
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='To' id='to'>
											<Flatpickr
												className='form-control'
												value={endDate}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													dateFormat: 'd/m/y',
													allowInput: true,
												}}
												onChange={(date, dateStr) => {
													setEndDate(dateStr);
													setEndDate2(date[0]);
												}}
												onClose={(date, dateStr) => {
													setEndDate(dateStr);
													setEndDate2(date[0]);
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>
								</div>
								<br />
								<div className='row g-4'>
									<div className='col-md-3'>
										<FormGroup label='Main Group' id='mainGroup'>
											<SelectReact
												className='col-md-11'
												isClearable
												classNamePrefix='select'
												options={mainAccountOptions}
												isLoading={mainAccountOptionsLoading}
												value={mainAccountSelected}
												onChange={(val) => {
													setMainAccountSelected(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Sub Group' id='subGroup'>
											<SelectReact
												className='col-md-11'
												isClearable
												classNamePrefix='select'
												options={subGroupsOptions}
												isLoading={subGroupsOptionsLoading}
												value={subGroupsSelected}
												onChange={(val) => {
													setSubGroupsSelected(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-4'>
										<FormGroup label='Account' id='account'>
											<SelectReact
												className='col-md-11'
												isClearable
												classNamePrefix='select'
												options={accountOptions}
												isLoading={accountOptionsLoading}
												value={accountSelected}
												onChange={(val) => {
													setAccountSelected(val);
												}}
											/>
										</FormGroup>
									</div>
								</div>
								<br />

								<div className='row g-4'>
									<FormGroup className='col-md-2' label='Search By'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setSearchBy(e.target.value);
											}}
											value={searchBy}
											list={_selectOptions}
										/>
									</FormGroup>

									<div className='col-md-2'>
										<br />
										<Input
											id='searchFileNo'
											type='text'
											onChange={(e) => {
												setSearchNo(e.target.value);
											}}
											value={searchNo}
											validFeedback='Looks good!'
										/>
									</div>
									<div className='col-md-2'>
										<br />
										<Button
											color='primary'
											onClick={() => {
												searchFilterTrigger();
												setCurrentPage(1);
											}}
											isOutline
											isDisable={landsViewLoading}
											isActive>
											Search
										</Button>
									</div>
								</div>
								<br />

								<div className='table-responsive'>
									<table className='table table-striped table-bordered table-hover table-modern'>
										<thead className='table-primary'>
											<tr>
												<th style={{ width: 50 }}>{SelectAllCheck}</th>
												<th
													onClick={() => requestSort('id')}
													className='cursor-pointer text-decoration-underline'>
													Sr No{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('firstName')}
														icon='FilterList'
													/>
												</th>
												<th
													onClick={() => requestSort('id')}
													className='cursor-pointer text-decoration-underline'>
													Voucher no{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('firstName')}
														icon='FilterList'
													/>
												</th>

												<th
													onClick={() => requestSort('file_no')}
													className='cursor-pointer text-decoration-underline'>
													Voucher Name{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('file_no')}
														icon='FilterList'
													/>
												</th>
												<th
													onClick={() => requestSort('file_no')}
													className='cursor-pointer text-decoration-underline'>
													Date{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('file_no')}
														icon='FilterList'
													/>
												</th>
												<th
													onClick={() => requestSort('file_no')}
													className='cursor-pointer text-decoration-underline'>
													Amount{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('file_no')}
														icon='FilterList'
													/>
												</th>
												<th className='cursor-pointer text-decoration-underline'>
													Status{' '}
												</th>

												<th className='cursor-pointer text-decoration-underline'>
													Actions{' '}
													<Icon
														size='lg'
														className={getClassNamesFor('Actions')}
														icon='FilterList'
													/>
												</th>
											</tr>
										</thead>
										{landsViewLoading ? (
											<tbody>
												<tr>
													<td colSpan='8'>
														<div className='d-flex justify-content-center'>
															<Spinner color='primary' size='5rem' />
														</div>
													</td>
												</tr>
											</tbody>
										) : (
											<tbody>
												{onCurrentPageData.map((item) => (
													<tr key={item.id}>
														<td>
															<Checks
																id={item.id.toString()}
																name='selectedList'
																value={item.id}
																onChange={selectTable.handleChange}
																checked={selectTable.values.selectedList.includes(
																	item.id.toString(),
																)}
															/>
														</td>
														<td>
															{item.id}
															<div className='d-flex align-items-center'>
																{item.is_post_dated === 0 &&
																	item.cheque_no !== null &&
																	item.cheque_no !== '' && (
																		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																		<div
																			role='button'
																			tabIndex={0}
																			className='small'
																			style={{
																				color: 'green',
																				fontStyle: 'italic',
																				textDecorationLine:
																					'underline',
																			}}
																			onClick={() => {
																				setEditingVoucherId(
																					item.voucher_no,
																				);

																				// getVoucherPostDated(item.id);
																				setPostDatedStatusOptionsSelected(
																					item.is_post_dated,
																				);

																				initialStatusPostDated();
																				getEditingVoucher(
																					item.id,
																				);
																				setStatePostDated(
																					true,
																				);
																				setStaticBackdropStatusPostDated(
																					true,
																				);
																			}}>
																			Cleared
																		</div>
																	)}
																{item.is_post_dated === 1 && (
																	// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																	<div
																		role='button'
																		tabIndex={0}
																		className='small'
																		style={{
																			color: 'red',
																			fontStyle: 'italic',
																			textDecorationLine:
																				'underline',
																		}}
																		onClick={() => {
																			if (
																				item.isApproved ===
																				1
																			) {
																				setEditingVoucherId(
																					item.voucher_no,
																				);

																				// getVoucherPostDated(item.id);
																				setPostDatedStatusOptionsSelected(
																					item.is_post_dated,
																				);

																				initialStatusPostDated();
																				getEditingVoucher(
																					item.id,
																				);
																				setStatePostDated(
																					true,
																				);
																				setStaticBackdropStatusPostDated(
																					true,
																				);
																			} else {
																				showNotification(
																					'Cannot be updated',
																					'Voucher is unapproved',
																					'warning',
																				);
																			}
																		}}>
																		{' '}
																		Update
																	</div>
																)}
																{item.is_post_dated === 2 && (
																	// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																	<div
																		role='button'
																		tabIndex={0}
																		className='small'
																		style={{
																			color: 'blue',
																			fontStyle: 'italic',
																			textDecorationLine:
																				'underline',
																		}}
																		onClick={() => {
																			setEditingVoucherId(
																				item.voucher_no,
																			);

																			// getVoucherPostDated(item.id);
																			setPostDatedStatusOptionsSelected(
																				item.is_post_dated,
																			);

																			initialStatusPostDated();
																			getEditingVoucher(
																				item.id,
																			);
																			setStatePostDated(true);
																			setStaticBackdropStatusPostDated(
																				true,
																			);
																		}}>
																		Returned
																	</div>
																)}
															</div>
														</td>
														<td>
															{item.voucher_no}
															{item.edited_vouchers_count > 0 && (
																// eslint-disable-next-line jsx-a11y/click-events-have-key-events
																<div
																	role='button'
																	tabIndex={0}
																	className='small'
																	style={{
																		color: 'orange',
																		fontStyle: 'italic',
																		textDecorationLine:
																			'underline',
																	}}
																	onClick={() => {
																		setEditingVoucherId(
																			item.voucher_no,
																		);

																		// getVoucherHistory(item.id);

																		initialStatusHistory();

																		setStateHistory(true);
																		setStaticBackdropStatusHistory(
																			false,
																		);
																	}}>
																	Edited
																</div>
															)}
														</td>

														<td>
															{item.name}
															{item.cheque_no !== null &&
																item.cheque_date !== null && (
																	<div className='small text-muted'>
																		{item.cheque_no}
																		<br />
																		{moment(
																			item.cheque_date,
																		).format('DD/MM/YYYY')}
																	</div>
																)}
														</td>

														<td>
															{item.cleared_date !== null
																? moment(item.generated_at).format(
																		'DD/MM/YYYY',
																  )
																: moment(item.date).format(
																		'DD/MM/YYYY',
																  )}
														</td>

														<td>
															{item.total_amount.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
															)}
														</td>
														<td>
															{Cookies.get('role_id1') === '2' &&
																item.deleted_at === null && (
																	<Dropdown>
																		<DropdownToggle
																			hasIcon={false}>
																			<Button
																				isLink
																				color={
																					item.isApproved ===
																					0
																						? `warning`
																						: `success`
																				}
																				icon='Circle'
																				className='text-nowrap'>
																				{item.isApproved ===
																				0
																					? `Pending`
																					: `Approved`}
																			</Button>
																		</DropdownToggle>

																		<DropdownMenu>
																			<DropdownItem key={1}>
																				<Button
																					onClick={() => {
																						approveVoucher(
																							item.id,
																						);
																					}}>
																					<Icon
																						icon='Circle'
																						color={
																							item.isApproved ===
																							1
																								? `warning`
																								: `success`
																						}
																					/>
																					{item.isApproved ===
																					1
																						? `Pending`
																						: `Approved`}
																				</Button>
																			</DropdownItem>
																		</DropdownMenu>
																	</Dropdown>
																)}
															{Cookies.get('role_id1') !== '2' &&
																item.deleted_at === null && (
																	<div className='d-flex align-items-center'>
																		<span
																			className={classNames(
																				'badge',
																				'border border-2',
																				[
																					`border-${themeStatus}`,
																				],
																				'rounded-circle',
																				'bg-success',
																				'p-2 me-2',
																				`bg-${
																					item.isApproved ===
																					0
																						? `warning`
																						: `success`
																				}`,
																			)}>
																			<span className='visually-hidden'>
																				{item.isApproved}
																			</span>
																		</span>
																		<span className='text-nowrap'>
																			{item.isApproved === 0
																				? `Pending`
																				: `Approved`}
																		</span>
																	</div>
																)}
															{item.deleted_at !== null && (
																<div className='d-flex align-items-center'>
																	<span
																		className={classNames(
																			'badge',
																			'border border-2',
																			[
																				`border-${themeStatus}`,
																			],
																			'rounded-circle',
																			'bg-danger',
																			'p-2 me-2',
																			`bg-danger'																	}`,
																		)}>
																		<span className='visually-hidden'>
																			{item.isDeleted}
																		</span>
																	</span>
																	<span className='text-nowrap'>
																		Deleted
																	</span>
																</div>
															)}
														</td>
														<td>
															<ButtonGroup>
																<Button
																	isOutline
																	color='primary'
																	isDisable={
																		item.isApproved === 1 ||
																		item.deleted_at !== null
																	}
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Edit'
																	onClick={() => {
																		setEditingVoucherId(
																			item.voucher_no,
																		);
																		setEditingVoucherType(
																			item.type,
																		);
																		getEditingVoucher(item.id);

																		initialStatusEdit();

																		setStateEdit(true);
																		setStaticBackdropStatusEdit(
																			true,
																		);
																	}}>
																	Edit
																</Button>
																<Button
																	isOutline
																	color='primary'
																	isDisable={
																		item.isApproved === 1 ||
																		item.deleted_at !== null
																	}
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Delete'
																	onClick={() => {
																		setDeletingVoucherId(
																			item.id,
																		);

																		initialStatusDelete();

																		setStateDelete(true);
																		setStaticBackdropStatusDelete(
																			false,
																		);
																	}}>
																	Delete
																</Button>
																<Dropdown>
																	<DropdownToggle hasIcon={false}>
																		<Button
																			color='primary'
																			isLight
																			hoverShadow='default'
																			icon='MoreVert'
																		/>
																	</DropdownToggle>
																	<DropdownMenu isAlignmentEnd>
																		<DropdownItem isHeader>
																			Actions
																		</DropdownItem>
																		<DropdownItem>
																			<Button
																				isOutline
																				color='info'
																				// isLight={darkModeStatus}
																				className={classNames(
																					'text-nowrap',
																					{
																						'border-light': true,
																					},
																				)}
																				icon='Preview'
																				onClick={() =>
																					printVoucher(
																						item.id,
																						item.type,
																						2,
																					)
																				}>
																				View
																			</Button>
																		</DropdownItem>
																		<DropdownItem>
																			<Button
																				isOutline
																				color='dark'
																				// isLight={darkModeStatus}

																				icon='FilePdfFill'
																				onClick={() =>
																					printVoucher(
																						item.id,
																						item.type,
																						1,
																					)
																				}>
																				Save to pdf
																			</Button>
																		</DropdownItem>
																	</DropdownMenu>
																</Dropdown>
															</ButtonGroup>
														</td>
													</tr>
												))}
											</tbody>
										)}
									</table>
								</div>
							</CardBody>
							<PaginationButtons
								data={items}
								label='items'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
					<Modal
						isOpen={stateDelete}
						setIsOpen={setStateDelete}
						titleId='exampleModalLabel'
						isStaticBackdrop={staticBackdropStatusDelete}
						isScrollable={scrollableStatusDelete}
						isCentered={centeredStatusDelete}
						size={sizeStatusDelete}
						fullScreen={fullScreenStatusDelete}
						isAnimation={animationStatusDelete}>
						<ModalHeader setIsOpen={headerCloseStatusDelete ? setStateDelete : null}>
							<ModalTitle id='deltefile'>
								{' '}
								<CardHeader>
									<CardLabel icon='Delete' iconColor='info'>
										<CardTitle>
											Deletion Confirmation Voucher Id {deletingVoucherId}
											<small> Voucher Id: {deletingVoucherId}</small>
										</CardTitle>
									</CardLabel>
								</CardHeader>
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<div className='row g-4'>
								<div className='col-12'>
									<Card>
										<CardBody>
											<h5>
												Are you sure you want to delete Voucher Id{' '}
												{deletingVoucherId}? This cannot be undone!
											</h5>
										</CardBody>
										<CardFooter>
											<CardFooterLeft>
												<Button
													color='info'
													icon='cancel'
													isOutline
													className='border-0'
													onClick={() => setStateDelete(false)}>
													Cancel
												</Button>
											</CardFooterLeft>
											<CardFooterRight>
												<Button
													icon='delete'
													color='danger'
													onClick={() => deleteFile(deletingVoucherId)}>
													Yes, Delete!
												</Button>
											</CardFooterRight>
										</CardFooter>
									</Card>
								</div>
							</div>
						</ModalBody>
						<ModalFooter />
					</Modal>
					<Modal
						isOpen={stateEdit}
						setIsOpen={setStateEdit}
						titleId='EditVoucher'
						isStaticBackdrop={staticBackdropStatusEdit}
						isScrollable={scrollableStatusEdit}
						isCentered={centeredStatusEdit}
						size={sizeStatusEdit}
						fullScreen={fullScreenStatusEdit}
						isAnimation={animationStatusEdit}>
						<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
							<ModalTitle id='editVoucher'>
								{' '}
								<CardHeader>
									<CardLabel icon='Edit' iconColor='info'>
										<CardTitle>
											Editing Voucher {editingVoucherId}
											<small> Voucher Id: {editingVoucherId}</small>
										</CardTitle>
									</CardLabel>
								</CardHeader>
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<div className='row g-4'>
								<div className='col-12'>
									<Card>
										<CardBody>
											{editingVoucherDataLoading ? (
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											) : (
												<>
													{editingVoucherType === 1 &&
														editingVoucherData !== null && (
															<PaymentVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 2 &&
														editingVoucherData !== null && (
															<ReceiptVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 3 &&
														editingVoucherData !== null && (
															<JVVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 4 &&
														editingVoucherData !== null && (
															<CVVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 5 &&
														editingVoucherData !== null && (
															<LPaymentVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 6 &&
														editingVoucherData !== null && (
															<LReceiptVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
													{editingVoucherType === 7 &&
														editingVoucherData !== null && (
															<LJVVoucher
																editingVoucherData={
																	editingVoucherData
																}
																voucherId={editingVoucherId}
																handleStateEdit={handleStateEdit}
															/>
														)}
												</>
											)}
										</CardBody>
										<CardFooter>
											<CardFooterLeft>
												<Button
													color='info'
													icon='cancel'
													isOutline
													className='border-0'
													onClick={() => setStateEdit(false)}>
													Cancel
												</Button>
											</CardFooterLeft>
										</CardFooter>
									</Card>
								</div>
							</div>
						</ModalBody>
						<ModalFooter />
					</Modal>
					<Modal
						isOpen={statePostDated}
						setIsOpen={setStatePostDated}
						titleId='PostDatedVoucher'
						isStaticBackdrop={staticBackdropStatusPostDated}
						isScrollable={scrollableStatusPostDated}
						isCentered={centeredStatusPostDated}
						size={sizeStatusPostDated}
						fullScreen={fullScreenStatusPostDated}
						isAnimation={animationStatusPostDated}>
						<ModalHeader
							setIsOpen={headerCloseStatusPostDated ? setStatePostDated : null}>
							<ModalTitle id='editVoucher'>
								{' '}
								<CardHeader>
									<CardLabel icon='Edit' iconColor='info'>
										<CardTitle>
											Voucher PostDated {editingVoucherId}
											<small> Voucher Id: {editingVoucherId}</small>
										</CardTitle>
									</CardLabel>
								</CardHeader>
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<div className='row g-4'>
								<div className='col-12'>
									<Card>
										<CardBody>
											{editingVoucherDataLoading ? (
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											) : (
												<>
													<h5>
														Cheque no: {editingVoucherData.cheque_no}
													</h5>
													<br />
													<h5>
														Cheque Date:{' '}
														{editingVoucherData.cheque_date}
													</h5>
													<div className='row g-4'>
														<FormGroup
															label='Status'
															className='col-md-6'>
															<Select
																ariaLabel='Default select example'
																placeholder='Open this select menu'
																onChange={(e) => {
																	setPostDatedStatusOptionsSelected(
																		e.target.value,
																	);
																}}
																value={
																	postDatedStatusOptionsSelected
																}
																list={_postDatedStatusOptions}
															/>
														</FormGroup>
														<FormGroup
															id='status_date'
															label='date'
															className='col-md-6'>
															<Flatpickr
																className='form-control'
																value={
																	postDatedDateStatusOptionsSelected
																}
																options={{
																	dateFormat: 'd/m/y',
																	allowInput: true,
																	defaultDate: new Date(),
																}}
																onChange={(date, dateStr) => {
																	setPostDatedDateStatusOptionsSelected(
																		dateStr,
																	);
																}}
																onClose={(date, dateStr) => {
																	setPostDatedDateStatusOptionsSelected(
																		dateStr,
																	);
																}}
																id='default-picker'
															/>
														</FormGroup>
													</div>
													<div>
														<br />
														<Button
															className='me-3'
															icon={isLoading ? null : 'Update'}
															color={lastSave ? 'primary' : 'primary'}
															isDisable={
																isLoading ||
																!postDatedDateStatusOptionsSelected
															}
															onClick={() =>
																updatePostDatedVoucher(
																	editingVoucherData.voucher_id,
																)
															}>
															{isLoading && (
																<Spinner isSmall inButton />
															)}
															{isLoading
																? (lastSave &&
																		'Updating Cheque Status') ||
																  'Updating'
																: (lastSave &&
																		'Update Cheque Status') ||
																  'Update Cheque Status'}
														</Button>
													</div>
												</>
											)}
										</CardBody>
										<CardFooter>
											<CardFooterLeft>
												<Button
													color='info'
													icon='cancel'
													isOutline
													className='border-0'
													onClick={() => setStatePostDated(false)}>
													Cancel
												</Button>
											</CardFooterLeft>
										</CardFooter>
									</Card>
								</div>
							</div>
						</ModalBody>
						<ModalFooter />
					</Modal>
					<Modal
						isOpen={stateHistory}
						setIsOpen={setStateHistory}
						titleId='HistoryVoucher'
						isStaticBackdrop={staticBackdropStatusHistory}
						isScrollable={scrollableStatusHistory}
						isCentered={centeredStatusHistory}
						size={sizeStatusHistory}
						fullScreen={fullScreenStatusHistory}
						isAnimation={animationStatusHistory}>
						<ModalHeader setIsOpen={headerCloseStatusHistory ? setStateHistory : null}>
							<ModalTitle id='editVoucher'>
								{' '}
								<CardHeader>
									<CardLabel icon='Edit' iconColor='info'>
										<CardTitle>
											Voucher History {editingVoucherId}
											<small> Voucher Id: {editingVoucherId}</small>
										</CardTitle>
									</CardLabel>
								</CardHeader>
							</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<div className='row g-4'>
								<div className='col-12'>
									<Card>
										<CardBody>
											{editingVoucherDataLoading ? (
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											) : (
												// editingVoucherData !== null && (
												// 	<VoucherHistory
												// 		editingVoucherData={editingVoucherData}
												// 		voucherId={editingVoucherId}
												// 		handleStateHistory={handleStateHistory}
												// 	/>
												<h1>In progress</h1>
											)}
										</CardBody>
										<CardFooter>
											<CardFooterLeft>
												<Button
													color='info'
													icon='cancel'
													isOutline
													className='border-0'
													onClick={() => setStateHistory(false)}>
													Cancel
												</Button>
											</CardFooterLeft>
										</CardFooter>
									</Card>
								</div>
							</div>
						</ModalBody>
						<ModalFooter />
					</Modal>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
