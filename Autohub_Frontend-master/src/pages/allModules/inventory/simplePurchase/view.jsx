/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import moment from 'moment';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports
import { useNavigate, demoPages, Cookies } from '../../../../baseURL/authMultiExport';
import { _titleError } from '../../../../notifyMessages/erroSuccess';
import showNotification from '../../../../components/extras/showNotification';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import apiClient from '../../../../baseURL/apiClient';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalFooter,
} from '../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Icon from '../../../../components/icon/Icon';
import Edit from './edit';
import Received from './received';
import ReturnOrder from './ReturnOrder';
import ViewPurchase from './viewPurchase';
import generatePDF from './pdfs/purchasePdf';
import generateInvoicePDF from './pdfs/invoicePdf';
import GenerateHistoryPDF from './pdfs/historyPDF';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(
		Number(store.data.purchaseOrderManagement.simplePurchase.perPage),
	);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [poNo, setPoNo] = useState('');
	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [recievedItemLoading, setRecievedItemLoading] = useState(false);
	const [recievedItem, setRecievedItem] = useState({});
	const [stateRecieve, setStateReceive] = useState(false);
	const [returnData, setReturnData] = useState({});
	const [stateReturn, setStateReturn] = useState(false);
	const [returnItemsLoading, setReturnItemsLoading] = useState(false);

	const [purchaseDetails, setPurchaseDetails] = useState();
	const [childDataLoading, setChildDataLoading] = useState(false);
	const [childModal, setChildModal] = useState(false);

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);
	const [headerCloseStatusReturn, setHeaderCloseStatusReturn] = useState(true);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
	};
	// delete
	const [stateDelete, setStateDelete] = useState(false);
	const [historyDataLoading, setHistoryDataLoading] = useState(false);
	const [staticBackdropStatusDelete, setStaticBackdropStatusDelete] = useState(false);
	const [scrollableStatusDelete, setScrollableStatusDelete] = useState(false);
	const [centeredStatusDelete, setCenteredStatusDelete] = useState(false);
	const [sizeStatusDelete, setSizeStatusDelete] = useState(null);
	const [fullScreenStatusDelete, setFullScreenStatusDelete] = useState(null);
	const [animationStatusDelete, setAnimationStatusDelete] = useState(true);
	const [headerCloseStatusDelete, setHeaderCloseStatusDelete] = useState(true);
	// initiate
	const [staticBackdropStatusInitiate, setStaticBackdropStatusReceive] = useState(false);
	const [scrollableStatusInitiate, setScrollableStatusInitiate] = useState(false);
	const [centeredStatusInitiate, setCenteredStatusInitiate] = useState(false);
	const [sizeStatusInitiate, setSizeStatusInitiate] = useState(null);
	const [fullScreenStatusInitiate, setFullScreenStatusInitiate] = useState(null);
	const [animationStatusInitiate, setAnimationStatusInitiate] = useState(true);

	const [headerCloseStatusInitiate, setHeaderCloseStatusInitiate] = useState(true);

	const initialStatusDelete = () => {
		setStaticBackdropStatusDelete(false);
		setScrollableStatusDelete(false);
		setCenteredStatusDelete(false);
		setSizeStatusDelete('md');
		setFullScreenStatusDelete(null);
		setAnimationStatusDelete(true);
		setHeaderCloseStatusInitiate(true);
	};
	const initialStatusReceive = () => {
		setStaticBackdropStatusReceive(false);
		setScrollableStatusInitiate(false);
		setCenteredStatusInitiate(false);
		setSizeStatusInitiate('md');
		setFullScreenStatusInitiate(null);
		setAnimationStatusInitiate(true);
		setHeaderCloseStatusInitiate(true);
	};
	const handleStateRecieved = (status) => {
		refreshTableData();
		setStateReceive(status);
	};

	const initialStatusReturn = () => {
		setHeaderCloseStatusReturn(true);
	};

	const handleStateReturn = (status) => {
		refreshTableData();
		setStateReturn(status);
	};
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient
			.get(`/editDirectPurchaseOrder?id=${idd}`)
			.then((res) => {
				setEditingItem(res.data.data);
				setEditingItemLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const getHistoryData = (id, docType) => {
		setHistoryDataLoading(true);
		apiClient
			.get(`getReturnPos?id=${id}`)
			.then((response) => {
				GenerateHistoryPDF(response.data, docType);
				setHistoryDataLoading(false);
			})
			.catch((err) => {
				console.log('Error:', err);
			});
	};

	const getReceivedFunc = (idd) => {
		setRecievedItemLoading(true);
		apiClient
			.get(`/editDirectPurchaseOrder?id=${idd}`)
			.then((res) => {
				// console.log('recev state', res.data.data);
				setRecievedItem(res.data.data);
				setRecievedItemLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};
	const getReturnFunc = (idd) => {
		setReturnItemsLoading(true);
		apiClient
			.get(`/editPurchaseOrder?id=${idd}`)
			.then((res) => {
				// console.log('recev state', res.data.data);
				setReturnData(res.data.data);
				setReturnItemsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};
	const getChildData = (id) => {
		setChildDataLoading(true);
		apiClient
			.get(`getPoDetails?po_id=${id}`)
			.then((response) => {
				setPurchaseDetails(response.data);
				setChildDataLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
					setChildDataLoading(false);
					// Cookies.remove('userToken');
					// navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
	};

	const deleteItem = (id) => {
		apiClient
			.delete(`/deletePurchaseOrder?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					// showNotification('Deleted', res.data.message, 'success');
					refreshTableData();
					setStateDelete(false);
					setDeleteLoading(false);
				} else if (res.data.status === 'error') {
					// showNotification('Error', res.data.message, 'danger');
					refreshTableData();
					setStateDelete(false);
					setDeleteLoading(false);
				}
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.res.status === 401) {
					// showNotification(_titleError, err.res.data.message, 'Danger');
				}
			});
	};

	useEffect(
		() => {
			dispatch(
				updateSingleState([
					perPage,
					'purchaseOrderManagement',
					'simplePurchase',
					'perPage',
				]),
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchaseOrderManagement', 'simplePurchase', 'pageNo']));
	};

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>S.NO</th>
							<th>PO.No</th>
							<th>Store</th>
							<th>Request Date</th>
							<th>Grand Total</th>
							<th>Remarks</th>
							<th colSpan='3'>Actions</th>
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
							{store.data.purchaseOrderManagement.simplePurchase.tableData?.data?.map(
								(item, index) => (
									<tr key={item.po_no}>
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
										<td>{index + 1}</td>
										<td>{item.po_no}</td>
										<td>{item?.store?.name}</td>
										<td>{moment(item.request_date).format('DD/MM/YYYY')}</td>
										<td>{item.total}</td>
										<td>{item.remarks}</td>
										<td>
											<Icon
												className='d-flex  justify-content-center'
												role='button'
												icon='EyeFill'
												size='2x'
												color='primary'
												onClick={() => {
													setChildModal(true);
													getChildData(item.id);
												}}
											/>
										</td>

										<td>
											<ButtonGroup>
												<Button
													isDisable
													onClick={() => {
														getEditingItem(item.id);
														setItemId(item.id);

														initialStatusEdit();
														setStateEdit(true);
														setStaticBackdropStatusEdit(true);
													}}
													color={
														item.is_received === 1
															? 'success'
															: 'success'
													}
													// isDisable={
													// 	item.confirmed1 === 0 ||
													// 	item.is_received === 1
													// 	// Cookies.get('role') !== 'Admin_'
													// }
													isOutline
													// color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}>
													Edit
												</Button>
												<Button
													isOutline
													// color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													color={
														item.is_received === 1 ? 'danger' : 'danger'
													}
													// isDisable={
													// 	item.confirmed1 === 0 ||
													// 	item.is_received === 1
													// 	// Cookies.get('role') !== 'Admin_'
													// }
													// icon='Delete'
													onClick={() => {
														setItemId(item.id);

														initialStatusDelete();

														setStateDelete(true);
														setStaticBackdropStatusDelete(false);
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
														<DropdownItem
															onClick={() => {
																initialStatusReturn();
																setStateReturn(true);
																getReturnFunc(item.id);
															}}>
															Return
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
																	getHistoryData(item.id, 2)
																}>
																Return History
															</Button>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</ButtonGroup>
										</td>
									</tr>
								),
							)}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='purchase'
					from={store.data.purchaseOrderManagement.simplePurchase.tableData?.from ?? 1}
					to={store.data.purchaseOrderManagement.simplePurchase.tableData?.to ?? 1}
					total={store.data.purchaseOrderManagement.simplePurchase.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={
								store.data.purchaseOrderManagement.simplePurchase?.pageNo ?? 1
							}
							totalItemsCount={
								store.data.purchaseOrderManagement.simplePurchase?.tableData
									?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.purchaseOrderManagement.simplePurchase?.perPage ?? 10,
							)}
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
			</CardBody>
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
										Are you sure, you want to delete the selected Purchase
										Order? <br />
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
											}}
											disabled={deleteLoading}>
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
								<CardTitle>Editing Purchase Order</CardTitle>
								<small> Item Id: {itemId}</small>
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
			{/* Recieved Modal */}
			<Modal
				isOpen={stateRecieve}
				setIsOpen={setStateReceive}
				titleId='ReceivedPurchaseOrder'
				size='xl'
				isAnimation={animationStatusEdit}
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateReceive : null}>
					<ModalTitle id='ReceivedPurchaseOrder'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Receive Order {poNo}</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{recievedItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Received
									recievedItem={recievedItem}
									handleStateRecieved={handleStateRecieved}
								/>
							)}
							<CardFooter>
								<CardFooterLeft>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateReceive(false)}>
										Cancel
									</Button>
								</CardFooterLeft>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
			</Modal>

			{/* Return Modal */}
			<Modal
				isOpen={stateReturn}
				setIsOpen={setStateReturn}
				titleId='ReturnPurchaseOrder'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusReturn ? setStateReturn : null}>
					<ModalTitle id='ReturnPurchaseOrder'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Simple Purchase Return Order {poNo}</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{returnItemsLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<ReturnOrder
									returnData={returnData}
									handleStateReturn={handleStateReturn}
								/>
							)}
							<CardFooter>
								<CardFooterLeft>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateReturn(false)}>
										Cancel
									</Button>
								</CardFooterLeft>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
			</Modal>
			<Modal
				isOpen={childModal}
				setIsOpen={setChildModal}
				titleId='exampleModalLabel'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setChildModal : null}>
					<ModalTitle id='editVoucher2'>
						{' '}
						<CardHeader>
							<CardLabel icon='Preview' iconColor='info'>
								<CardTitle>
									Simple Purchase Order Details <br />
									<small>
										{' '}
										PO No.: {purchaseDetails?.purchaseorderlist?.po_no}
									</small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Card className='p-5' stretch>
						{childDataLoading ? (
							<div className='d-flex justify-content-center'>
								<Spinner color='primary' size='5rem' />
							</div>
						) : (
							<ViewPurchase purchaseDetails={purchaseDetails} />
						)}
					</Card>
					<CardFooter>
						<CardFooterLeft>
							<Button
								color='info'
								icon='cancel'
								isOutline
								className='border-0'
								onClick={() => setChildModal(false)}>
								Close
							</Button>
						</CardFooterLeft>
						<CardFooterRight>
							<Button
								className='mr-0'
								color='primary'
								onClick={() => {
									generatePDF(purchaseDetails, 2);
								}}>
								PRINT PO
							</Button>
							<Button
								className='mr-0'
								color='primary'
								onClick={() => {
									generateInvoicePDF(purchaseDetails, 2);
								}}>
								PRINT INVOICE
							</Button>
						</CardFooterRight>
					</CardFooter>
				</ModalBody>
			</Modal>
		</>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
	refreshTableData: PropTypes.func.isRequired,
};

export default View;
