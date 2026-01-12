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
// import ViewInvoice from './viewInvoice';
import generatePDF from './pdfs/purchasePdf';
import generateInvoicePDF from './pdfs/invoicePdf';
import GenerateHistoryPDF from './pdfs/historyPDF';

const View = ({
	tableDataLoading,
	tableData,
	refreshTableData,
	setSelectedStore,
	setSelectedName,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(
		Number(store.data.purchaseOrderManagement.purchaseList.perPage),
	);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [poNo, setPoNo] = useState('');
	const [editingItem, setEditingItem] = useState({});

	const [itemId, setItemId] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [purchaseDetails, setPurchaseDetails] = useState();
	const [childDataLoading, setChildDataLoading] = useState(false);
	const [childModal, setChildModal] = useState(false);

	const [recievedItemLoading, setRecievedItemLoading] = useState(false);
	const [recievedItem, setRecievedItem] = useState({});
	const [stateRecieve, setStateReceive] = useState(false);
	const [fullScreenStatusReceive, setFullScreenStatusReceive] = useState('xxl');
	const [returnData, setReturnData] = useState({});
	const [stateReturn, setStateReturn] = useState(false);
	const [returnItemsLoading, setReturnItemsLoading] = useState(false);
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

	const [history, setHistory] = useState();
	const [historyDataLoading, setHistoryDataLoading] = useState(false);

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
		// setSizeStatusInitiate('md');
		setFullScreenStatusReceive('xxl');
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
	// const [isLoading, setIsLoading] = useState(false);
	// const [lastSave, setLastSave] = useState(null);

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
					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
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
				// console.log('Error:', err);
			});
	};

	const getEditingItem = (id) => {
		setEditingItemLoading(true);

		apiClient
			.get(`/editPurchaseOrder?id=${id}`)
			.then((res) => {
				setEditingItem(res.data);
				setEditingItemLoading(false);
			})
			.catch((err) => {
				// Handle errors
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const getReceivedFunc = (idd, itemId1) => {
		setRecievedItemLoading(true);
		apiClient
			.get(`/editPurchaseOrder?id=${idd}&item_id=${itemId1}`)
			.then((res) => {
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
				updateSingleState([perPage, 'purchaseOrderManagement', 'purchaseList', 'perPage']),
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchaseOrderManagement', 'purchaseList', 'pageNo']));
	};
	// For complete api
	const [completeModalLoading, setCompleteModalLoading] = useState(false);
	const [completeLoading, setCompleteLoading] = useState(false);
	const [lastCompleteSave, setLastCompleteSave] = useState(null);

	// Complete
	const [stateComplete, setStateComplete] = useState(false);

	const [staticBackdropStatusComplete, setStaticBackdropStatusComplete] = useState(false);
	const [scrollableStatusComplete, setScrollableStatusComplete] = useState(false);
	const [centeredStatusComplete, setCenteredStatusComplete] = useState(false);
	const [sizeStatusComplete, setSizeStatusComplete] = useState(null);
	const [fullScreenStatusComplete, setFullScreenStatusComplete] = useState(null);
	const [animationStatusComplete, setAnimationStatusComplete] = useState(true);
	const [headerCloseStatusComplete, setHeaderCloseStatusComplete] = useState(true);
	const getCompleteOrder = (id) => {
		setCompleteLoading(true);

		apiClient
			.post(`/receivePurchaseOrderComplete`, { id })
			.then((res) => {
				if (res.data.status === 'ok') {
					setStateComplete(false);
					setCompleteLoading(false);
					refreshTableData();
					setLastCompleteSave(moment());
				} else {
					setCompleteLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setCompleteLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setCompleteLoading(false);
			});
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
							<th>Suppliers</th>
							<th>Store</th>
							<th>Request Date</th>
							<th>Receive Date</th>

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
							{store.data.purchaseOrderManagement.purchaseList.tableData.data.map(
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
										<td>{item?.po_no}</td>
										<td>{item?.supplier?.name}</td>
										<td>{item?.store?.name}</td>
										<td>{moment(item?.request_date).format('DD/MM/YYYY')}</td>
										<td>
											{item?.received_date &&
												moment(item?.received_date).isValid() &&
												item?.received_date !== '1899-11-29T19:17:10.000Z'
												? moment(item?.received_date).format('DD/MM/YYYY')
												: 'Not Received'}
										</td>

										<td>{item?.total_after_discount}</td>
										<td>{item?.remarks}</td>
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
													onClick={() => {
														// Destructure the data object
														const { id, item_id: itemId1 } = item;

														// Call the getEditingItem function with both id and itemId1
														getEditingItem(id, itemId1);

														// Set the itemId state
														setItemId(id);
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
													// 	item.is_received === 0
													// 	// Cookies.get('role') !== 'Admin_'
													// }
													isOutline
													// color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													isDisable={item.is_received === 1}>
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
													isDisable={
														item.confirmed1 === 0 ||
														item.is_received === 1
														// Cookies.get('role') !== 'Admin_'
													}
													// icon='Delete'
													onClick={() => {
														setItemId(item.id);

														initialStatusDelete();

														setStateDelete(true);
														setStaticBackdropStatusDelete(false);
													}}>
													Delete
												</Button>

												<Button
													color={
														item.is_completed === 1
															? 'success'
															: 'warning'
													}
													isDisable={
														item.is_completed === 1
														// Cookies.get('role') !== 'Admin_'
													}
													// isLight={darkModeStatus}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon={
														item.is_completed === 1
															? 'DoneOutline'
															: 'PendingActions'
													}
													onClick={() => {
														const { id, childArray } = item;
														const itemId1 =
															childArray && childArray.length > 0
																? childArray[0].item_id
																: null;

														// console.log('id:', id);
														// console.log('itemId1:', itemId1);

														getReceivedFunc(id, itemId1);
														setItemId(item.id);

														setPoNo(item.po_no);
														// item.booking.plot.reg_no,
														// initialStatusEdit();
														// setStateEdit(true);
														// setStaticBackdropStatusEdit(true);
														// getReceivedFunc();
														initialStatusReceive();
														setStateReceive(true);
														setFullScreenStatusReceive('xxl');

														setStaticBackdropStatusReceive(false);
													}}>
													{item.is_completed === 1
														? 'Received'
														: 'Receive'}
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
														{item.is_received === 1 &&
															item.is_completed === 0 && (
																<DropdownItem>
																	<Button
																		isOutline
																		icon='DoneAll'
																		color='info'
																		isDisable={completeLoading}
																		onClick={() => {
																			setItemId(item.id);
																			setStateComplete(true);
																			setSelectedStore('');
																			setSelectedName('');
																		}}>
																		Complete Order
																	</Button>
																</DropdownItem>
															)}
														{item.is_received === 1 &&
															item.is_completed === 1 && (
																<DropdownItem
																	onClick={() => {
																		initialStatusReturn();
																		setStateReturn(true);
																		getReturnFunc(item.id);
																	}}>
																	Return
																</DropdownItem>
															)}

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
					from={store.data.purchaseOrderManagement.purchaseList.tableData?.from ?? 1}
					to={store.data.purchaseOrderManagement.purchaseList.tableData?.to ?? 1}
					total={store.data.purchaseOrderManagement.purchaseList.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={
								store.data.purchaseOrderManagement.purchaseList?.pageNo ?? 1
							}
							totalItemsCount={
								store.data.purchaseOrderManagement.purchaseList?.tableData?.total ??
								0
							}
							itemsCountPerPage={Number(
								store.data.purchaseOrderManagement.purchaseList?.perPage ?? 10,
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

			{/* Complete Starts */}
			<Modal
				isOpen={stateComplete}
				setIsOpen={setStateComplete}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusComplete}
				isScrollable={scrollableStatusComplete}
				isCentered={centeredStatusComplete}
				size={sizeStatusComplete}
				fullScreen={fullScreenStatusComplete}
				isAnimation={animationStatusComplete}>
				<ModalHeader setIsOpen={headerCloseStatusComplete ? setStateComplete : null}>
					<ModalTitle id='deltefile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Delete' iconColor='info'>
								<CardTitle>
									Completion Confirmation
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
										Are you sure, you want to Complete the selected Purchase
										Order? <br />
										The PO will be finalized, you will not be able to make
										further changes. <br />
										All related pending invoices will be initiated. <br />
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
											onClick={() => setStateComplete(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon={completeLoading ? null : 'DoneAll'}
											color='danger'
											onClick={() => {
												getCompleteOrder(itemId);
											}}
											disabled={completeLoading}>
											{completeLoading && <Spinner isSmall inButton />}
											{completeLoading ? 'Initiating' : 'Yes, Complete!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			{/* Complete Ends */}
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
								// eslint-disable-next-line no-undef
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
				// size='xl'
				isAnimation={animationStatusEdit}
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				fullScreen>
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
									setSelectedStore={setSelectedStore}
									setSelectedName={setSelectedName}
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
				titleId='ReTurnPurchaseOrder'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusReturn ? setStateReturn : null}>
					<ModalTitle id='ReturnPurchaseOrder'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Return Purchase Order {poNo}</CardTitle>
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
									Purchase Order Details <br />
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
