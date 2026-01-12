// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */

import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import ReactSelect from 'react-select';
// import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { GenerateUniqueKey } from '../../../../baseURL/GenerateUniqueKey';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import Checks from '../../../../components/bootstrap/forms/Checks';

import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
// import AdjustInventory from './AdjustInvectory';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import Edit from './Edit';
// eslint-disable-next-line import/no-named-as-default
import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';
import Viewnew from './viewDetails';

const validate = (values) => {
	const errors = {};

	if (!values.date) {
		errors.request_date = 'Required';
	}

	if (Array.isArray(values.childArray)) {
		values.childArray.forEach((data, index) => {
			if (!data) return; // Skip invalid entries

			if (!data.item_id) {
				errors[`childArray[${index}]item_id`] = 'Required';
			}

			if (!(data.quantity > 0)) {
				errors[`childArray[${index}]quantity`] = 'Required';
			}

			if (!(Number(data.rate) > 0)) {
				errors[`childArray[${index}]rate`] = 'Required';
			}
		});
	}

	return errors;
};

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	const formik = useFormik({
		initialValues: {
			adjust_type: 'add',
			total: '',
			date: todayDate,
			quantity: '',
			rate: '',
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

	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.inventoryManagementModule.inventory.perPage));

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	useEffect(() => {
		dispatch(updateSingleState([perPage, 'inventoryManagementModule', 'inventory', 'perPage']));
	}, [perPage]);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'inventoryManagementModule', 'inventory', 'pageNo']));
	};

	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [itemId, setItemId] = useState('');
	const [item, setItem] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [disposalAccounts, setDisposalAccounts] = useState([]);
	const [disposalAccountsLoading, setDisposalAccountsLoading] = useState(false);

	const [lastRate, setLastRate] = useState('');
	const [lastRateLoading, setLastRateLoading] = useState(false);

	const [CapitalAccounts, setCapitalAccounts] = useState([]);
	const [CapitalAccountsLoading, setCapitalAccountsLoading] = useState([]);
	const [inventoryAccounts, setinventoryAccounts] = useState([]);
	const [inventoryAccountsLoading, setinventoryAccountsLoading] = useState([]);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	// Edit
	const [stateEdit, setStateEdit] = useState(false);
	const [editingItem, setEditingItem] = useState({});
	const [editingItemLoading, setEditingItemLoading] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);
	const [progressLoading, setProgressLoading] = useState(false);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};
	// const getEditingItem = (idd) => {
	// 	setEditingItemLoading(true);
	// 	apiClient.get(`/editAdjustItemInventory?id=${idd}`).then((res) => {
	// 		const aa = res.data.adjustInventory;
	// 		setEditingItem(aa);
	// 		setEditingItemLoading(false);
	// 	});
	// };

	// const handleStateEdit = (status) => {
	// 	refreshTableData();
	// 	setStateEdit(status);
	// };

	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/editAdjustItemInventory?id=${idd}`).then((res) => {
			setEditingItem(res.data.adjustInventory);
			setEditingItemLoading(false);
		});
	};
	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
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

	const [stateDelete, setStateDelete] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

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

	const deleteItem = (id) => {
		apiClient
			.delete(`/deleteAdjustItemInventory?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					setDeleteLoading(false);
					setStateDelete(false);
					refreshTableData();

				}
			})
			.catch(() => {
				setDeleteLoading(false);
			});
	};

	const [stateView, setStateView] = useState(false);

	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);
	const [scrollableStatusView, setScrollableStatusView] = useState(false);
	const [centeredStatusView, setCenteredStatusView] = useState(false);
	const [fullScreenStatusView, setFullScreenStatusView] = useState(null);
	const [animationStatusView, setAnimationStatusView] = useState(true);

	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);

	const initialStatusView = () => {
		setStaticBackdropStatusView(true);
		setScrollableStatusView(false);
		setCenteredStatusView(false);
		setFullScreenStatusView(false);
		setAnimationStatusView(true);
		setHeaderCloseStatusView(true);
	};
	const [viewItemLoading, setViewItemLoading] = useState(false);
	const [viewItem, setViewItem] = useState({});
	const getViewItem = (id) => {
		setViewItemLoading(true);
		apiClient.get(`/viewAdjustInventory?id=${id}`).then((res) => {
			setViewItem(res.data);
			setViewItemLoading(false);
		});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};

	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	const calculateTotal = () => {
		const total = formik.values.quantity * formik.values.rate;
		formik.setFieldValue('total', total);
	};

	useEffect(() => {
		calculateTotal();
	}, [triggerCalculateTotal]);

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addAdjustItemStock`, {
				adjust_type: formik.values.adjust_type,
				total: formik.values.total,
				date: formik.values.date,
				item_id: itemId,
				quantity: formik.values.quantity,
				rate: formik.values.rate,
				capital_account: formik.values.capital_account?.id,
				// inventory_account: formik.values.inventory_account?.id,
				dispose_account: formik.values.dispose_account?.id,
			})
			.then((res) => {
				formik.resetForm();
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refreshTableData();
					setIsLoading(false);
					// getItemsOptions();
				} else {
					setIsLoading(false);
				}
			})
			.catch(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		apiClient.get(`/getDisposeAccounts`).then((response) => {
			const rec = response.data.disposeAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setDisposalAccounts(rec);
			setDisposalAccountsLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoriesOptions(rec);
			setCategoriesOptionsLoading(false);
		});
	}, []);

	const getItemsBasedOnSubCategory = (index) => {
		formik.setFieldValue(`childArray[${index}].items_options_loading`, true);
		apiClient
			.get(
				`/getItemOemDropDown?category_id=${formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data?.data?.map(({ id, name, machine_part_oem_part }) => ({
					id,
					value: id,
					label: `${machine_part_oem_part?.machine_part?.subcategories?.categories?.name}-${machine_part_oem_part?.machine_part?.subcategories?.name}-${name}`,
				}));
				formik.setFieldValue(`childArray[${index}].items_options`, rec);

				formik.setFieldValue(`childArray[${index}].items_options_loading`, false);
			});
	};

	useEffect(() => {
		getItemsBasedOnSubCategory(1);
	}, []);

	useEffect(() => {
		apiClient.get(`/getCapitalAccounts`).then((response) => {
			const rec = response.data.capitalAccounts?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCapitalAccounts(rec);
			setCapitalAccountsLoading(false);
		});
	}, []);

	return (
		<div className='table-responsive'>
			<table className='table table-modern'>
				<thead>
					<tr>
						<th style={{ width: 50 }}>{SelectAllCheck}</th>
						<th>Id</th>
						<th>Total</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				{tableDataLoading ? (
					<tbody>
						<tr>
							<td colSpan='12'>
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='3rem' />
								</div>
							</td>
						</tr>
					</tbody>
				) : (
					<tbody>
						{store.data.inventoryManagementModule.inventory.tableData?.data?.map((item, index) => {
							const uniqueKey = GenerateUniqueKey();

							return (
								<tr key={uniqueKey}>
									<td>
										<Checks
											id={item.id?.toString()}
											name='selectedList'
											value={item.id}
											onChange={selectTable.handleChange}
											checked={selectTable.values.selectedList.includes(
												item.id?.toString(),
											)}
										/>
									</td>
									<td>{item.id}</td>

									<td>{item.total_amount}</td>
									<td>{item.date}</td>
									<td>
										<Button
											// isDisable={1}
											onClick={() => {
												getViewItem(item.id);
												setItemId(item.id);

												initialStatusView();
												setStateView(true);
												setStaticBackdropStatusView(true);
											}}
											isOutline
											color='primary'
											className={classNames('text-nowrap', {
												'border-light': true,
											})}
											icon='Preview'>
											View
										</Button>
										<Button
											isDisable={item.is_approved === 1}
											onClick={() => {
												getEditingItem(item.id);
												setItemId(item.id);

												initialStatusEdit();
												setStateEdit(true);
												setStaticBackdropStatusEdit(true);
											}}
											isOutline
											color='primary'
											className={classNames('text-nowrap', {
												'border-light': true,
											})}
											icon='Edit'>
											Edit
										</Button>
										<Button
											isOutline
											color='danger'
											className={classNames('text-nowrap', {
												'border-light': true,
											})}
											icon='Delete'
											isDisable={item.is_approved === 1}
											onClick={() => {
												setItemId(item.id);

												initialStatusDelete();

												setStateDelete(true);
												setStaticBackdropStatusDelete(false);
											}}>
											Delete
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				)}
			</table>

			<PaginationButtons
				label='inventory'
				from={store.data.inventoryManagementModule.inventory.tableData?.from ?? 1}
				to={store.data.inventoryManagementModule.inventory.tableData?.to ?? 1}
				total={store.data.inventoryManagementModule.inventory.tableData?.total ?? 0}
				perPage={Number(perPage ?? 10)}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-md-4'>
					<Pagination
						activePage={store.data.inventoryManagementModule.inventory?.pageNo ?? 1}
						totalItemsCount={store.data.inventoryManagementModule.inventory?.tableData?.total ?? 0}
						itemsCountPerPage={Number(store.data.inventoryManagementModule.inventory?.perPage ?? 10)}
						onChange={(e) => handlePageChange(e)}
						itemClass='page-item'
						linkClass='page-link'
						firstPageText='First'
						lastPageText='Last'
						nextPageText='Next'
						prevPageText='Prev'
					/>
				</div>
			</div>

			<Modal
				isOpen={stateView}
				setIsOpen={setStateView}
				titleId='ViewVoucher'
				isStaticBackdrop={staticBackdropStatusView}
				isScrollable={scrollableStatusView}
				isCentered={centeredStatusView}
				size='xl'
				fullScreen={fullScreenStatusView}
				isAnimation={animationStatusView}>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Adjust Inventory</CardTitle>
								<small> Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{viewItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Viewnew viewItem={viewItem} handleStateView={handleStateView} />
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateView(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
			</Modal>

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
									Deletion Confirmation
									<small> Item Id: {itemId}</small>
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
										Are you sure, you want to delete the selected Order? <br />
										This cannot be undone!
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
											icon={deleteLoading ? null : 'Delete'}
											color='danger'
											onClick={() => {
												setDeleteLoading(true);
												deleteItem(itemId);
											}}>
											{deleteLoading && <Spinner isSmall inButton />}
											{deleteLoading ? 'Deleting' : 'Yes, Delete!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>

			<Modal
				isOpen={stateEdit}
				setIsOpen={setStateEdit}
				titleId='EditVoucher'
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				size='xl'
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Adjust Inventory</CardTitle>
								<small> Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{editingItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Edit editingItem={editingItem} handleStateEdit={handleStateEdit} />
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateEdit(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
		</div>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
	refreshTableData: PropTypes.func.isRequired,
};

export default View;
