// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

// import * as XLSX from 'xlsx';
import apiClient from '../../../../baseURL/apiClient';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** Axios Imports
// import Icon from '../../../../components/icon/Icon';

import Checks from '../../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/bootstrap/Dropdown';
import Edit from './Edit';
import quotationPdf from './printReport';
import Invoice from './invoice';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [perPage, setPerPage] = useState(
		Number(store.data.salesManagementModule.quotation.perPage),
	);

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [qutationNo, setqutationNo] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const [childModal, setChildModal] = useState(false);
	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/editQuotation?id=${idd}`).then((res) => {
			setEditingItem(res.data.data);
			setEditingItemLoading(false);
		});
	};
	const getItemForInitiate = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/getQuotationForIntiaite?id=${idd}`).then((res) => {
			const aa = res.data.data;

			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					item_discount_per: '',
					item_discount: '',
					item_total_after_discount: '',
				};
			});
			setEditingItem(aa);
			setEditingItemLoading(false);
		});
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
			.delete(`/deleteQuotation?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
					setStateDelete(false);
				}
				setDeleteLoading(false);
			})
			.catch(() => {
				setDeleteLoading(false);
			});
	};
	// Invoice

	const [stateReceive, setStateReceive] = useState(false);

	const [staticBackdropStatusReceive, setStaticBackdropStatusReceive] = useState(true);
	const [scrollableStatusReceive, setScrollableStatusReceive] = useState(false);
	const [centeredStatusReceive, setCenteredStatusReceive] = useState(false);
	const [fullScreenStatusReceive, setFullScreenStatusReceive] = useState(null);
	const [animationStatusReceive, setAnimationStatusReceive] = useState(true);

	const [headerCloseStatusReceive, setHeaderCloseStatusReceive] = useState(true);

	const initialStatusReceive = () => {
		setStaticBackdropStatusReceive(true);
		setScrollableStatusReceive(false);
		setCenteredStatusReceive(false);
		setFullScreenStatusReceive(false);
		setAnimationStatusReceive(true);
		setHeaderCloseStatusReceive(true);
	};

	const handleStateReceive = (status) => {
		refreshTableData();
		setStateReceive(status);
	};
	// status
	const [stateStatus, setStateStatus] = useState(false);

	const [staticBackdropStatusStatus, setStaticBackdropStatusStatus] = useState(false);
	const [scrollableStatusStatus, setScrollableStatusStatus] = useState(false);
	const [centeredStatusStatus, setCenteredStatusStatus] = useState(false);
	const [sizeStatusStatus, setSizeStatusStatus] = useState(null);
	const [fullScreenStatusStatus, setFullScreenStatusStatus] = useState(null);
	const [animationStatusStatus, setAnimationStatusStatus] = useState(true);
	const [progressLoading, setProgressLoading] = useState(false);
	const [headerCloseStatusStatus, setHeaderCloseStatusStatus] = useState(true);
	const initialStatusStatus = () => {
		setStaticBackdropStatusStatus(false);
		setScrollableStatusStatus(false);
		setCenteredStatusStatus(false);
		setSizeStatusStatus('md');
		setFullScreenStatusStatus(null);
		setAnimationStatusStatus(true);
		setHeaderCloseStatusStatus(true);
	};
	const statusItem = (id) => {
		apiClient
			.get(`/approveOrUnapproveQuotation?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
					setStateStatus(false);
				}
				setProgressLoading(false);
			})
			.catch(() => {
				setProgressLoading(false);
			});
	};
	const printReportAll = (docType, id) => {
		apiClient.get(`/ViewQuotationDetails?id=${id}`).then((response) => {
			quotationPdf(response.data, docType);
		});
	};
	// const printReport = (id) => {
	// 	return new Promise((resolve, reject) => {
	// 		apiClient
	// 			.get(`/ViewQuotationDetails?id=${id}`)
	// 			.then((response) => {
	// 				const sheetData = response.data.quotChild;
	//
	// 				resolve(sheetData);
	// 			})
	// 			.catch((err) => {
	//
	// 				reject(err);
	// 			});
	// 	});
	// };

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'salesManagementModule', 'quotation', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);
	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'salesManagementModule', 'quotation', 'pageNo']));
	};
	// const [sheetData, setSheetData] = useState(null);

	// const handleOnExport = (item) => {
	// 	const reportTitle = 'Title';
	// 	printReport(item.id)
	// 		.then((reportData) => {
	// 			const table1 = [
	// 				[
	// 					'S.No.',
	// 					'Item',
	// 					'Manufacturer',
	// 					'Pack Size',
	// 					'Retail Price',
	// 					'Trade Price',
	// 					'Quoted Price',
	// 				],
	// 			];

	// 			let count = 0;
	// 			reportData.forEach((row) => {
	// 				count += 1;
	// 				table1.push([
	// 					count,
	// 					row.item.name,
	// 					row.manufacture.name,
	// 					row.quantity,
	// 					row.retail_price,
	// 					row.trade_price,
	// 					row.quoted_price,
	// 				]);
	// 			});
	// 			const wb = XLSX.utils.book_new();
	// 			const ws = XLSX.utils.json_to_sheet(table1);
	// 			ws['!cols'] = [
	// 				{ width: 5 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 				{ width: 15 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 			];
	// 			ws.A1.s = { font: { bold: true }, alignment: { horizontal: 'center' } };
	// 			ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }];
	// 			// ws['!merges'] = [merge];
	// 			XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'A1' });

	// 			XLSX.utils.book_append_sheet(wb, ws, 'SHEET 1');
	// 			XLSX.writeFile(wb, 'MyExcel.xlsx');
	// 		})
	// 		.catch((err) => {
	// 			console.error('Error exporting report:', err);
	// 			// handle error
	// 		});
	// };

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Sr. No</th>
							<th>Quotation No</th>

							<th>Ref No</th>
							<th>Customer Name</th>
							<th>date </th>
							<th>Action</th>
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
							{(store.data.salesManagementModule.quotation.tableData?.data || []).map(
								(item, index) => (
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
										<td>{index + 1}</td>
										<td>{item.quotation_no}</td>
										<td>{item.ref_no}</td>
										<td>
											{item.sale_type === 2
												? item.customer?.name
												: item.walk_in_customer_name}
											<div className='small text-muted'>
												{item.sale_type === 1 ? 'Walk-in ' : 'Registered '}
											</div>
										</td>
										<td>{moment(item.date).format('DD-MM-YYYY')}</td>

										<td>
											<ButtonGroup>
												<Button
													color={
														item.is_approved === 1
															? 'success'
															: 'danger'
													}
													isDisable={item.is_inv_generated === 1}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													isOutline
													icon={
														item.is_approved === 1
															? 'DoneOutline'
															: 'PendingActions'
													}
													onClick={() => {
														setItemId(item.id);

														initialStatusStatus();

														setStateStatus(true);
														setStaticBackdropStatusStatus(false);
													}}>
													{item.is_approved === 1
														? 'Approved'
														: 'Pending'}
												</Button>
												<Button
													isDisable={
														item.is_approved === 0 ||
														item.is_inv_generated === 1
													}
													onClick={() => {
														getItemForInitiate(item.id);
														setItemId(item.id);

														initialStatusReceive();
														setStateReceive(true);
														setStaticBackdropStatusReceive(true);
													}}
													color={
														item.is_inv_generated === 1
															? 'success'
															: 'warning'
													}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon={
														item.is_inv_generated === 1
															? 'DoneOutline'
															: 'PendingActions'
													}>
													{item.is_inv_generated === 0
														? 'Initiate'
														: 'Initiated'}
												</Button>
												<Button
													isDisable={item.is_approved === 1}
													onClick={() => {
														getEditingItem(item.id);
														setItemId(item.id);
														setqutationNo(item.quotation_no);
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
													isDisable={item.is_approved === 1}
													isOutline
													color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Delete'
													onClick={() => {
														setItemId(item.id);
														setqutationNo(item.quotation_no);
														initialStatusDelete();
														setqutationNo(item.quotation_no);
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
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
																padding: '5px',
															}}>
															<Button
																color='primary'
																className={classNames(
																	'text-nowrap',
																	{
																		'col-md-6 border-light': true,
																	},
																)}
																onClick={() => {
																	printReportAll(2, item.id);
																}}
																isOutline
																icon='FilePdfFill'
																isActive>
																English Print
															</Button>
															{/* <Button
															color='primary'
															className={classNames('text-nowrap', {
																'col-md-6 border-light': true,
															})}
															onClick={() => {
																printReportUrdu(2, item.id);
															}}
															isOutline
															icon='FilePdfFill'
															isActive
														>
															<span className='urdu'> اردو پرنٹ</span>
														</Button> */}
															{/* <Button
															color='primary'
															className={classNames('text-nowrap', {
																'col-md-6 border-light': true,
															})}
															onClick={() => {
																handleOnExport({ id: item.id });
																setItemId(item.id);
															}}
															isOutline
															icon='FilePdfFill'
															isActive>
															Excel
														</Button> */}
														</div>
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
					label='Sales'
					from={store.data.salesManagementModule.quotation.tableData?.from ?? 1}
					to={store.data.salesManagementModule.quotation.tableData?.to ?? 1}
					total={store.data.salesManagementModule.quotation.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.salesManagementModule.quotation?.pageNo ?? 1}
							totalItemsCount={
								store.data.salesManagementModule.quotation?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.salesManagementModule.quotation?.perPage ?? 10,
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
									<small> Qutation No: {qutationNo}</small>
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
										Are you sure, you want to delete the selected Quotation
										Order?
										<br />
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
								<CardTitle>Editing Quotation </CardTitle>
								<small> Qutation No: {qutationNo}</small>
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
									Quotation <br />
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
			</Modal>
			{/* <Status /> */}
			<Modal
				isOpen={stateStatus}
				setIsOpen={setStateStatus}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusStatus}
				isScrollable={scrollableStatusStatus}
				isCentered={centeredStatusStatus}
				size={sizeStatusStatus}
				fullScreen={fullScreenStatusStatus}
				isAnimation={animationStatusStatus}>
				<ModalHeader setIsOpen={headerCloseStatusStatus ? setStateStatus : null}>
					<ModalTitle id='progressfile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Progress' iconColor='info'>
								<CardTitle>
									Progress Complete Confirmation
									<small> Qutation No: {qutationNo}</small>
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
										Are you sure, you want to approve?
										<br />
									</h5>
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateStatus(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon={progressLoading ? null : 'Progress'}
											color='danger'
											onClick={() => {
												setProgressLoading(true);
												statusItem(itemId);
											}}>
											{progressLoading && <Spinner isSmall inButton />}
											{progressLoading ? 'Progressing' : 'Yes, Approve!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			{/* <ModalInvoice  */}
			<Modal
				isOpen={stateReceive}
				setIsOpen={setStateReceive}
				titleId='ReceiveVoucher'
				isStaticBackdrop={staticBackdropStatusReceive}
				isScrollable={scrollableStatusReceive}
				isCentered={centeredStatusReceive}
				size='xl'
				fullScreen={fullScreenStatusReceive}
				isAnimation={animationStatusReceive}>
				<ModalHeader setIsOpen={headerCloseStatusReceive ? setStateReceive : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Receive' iconColor='info'>
								<CardTitle>Invoice </CardTitle>
								{/* <small> Qutation No: {}</small> */}
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
								<Invoice
									editingItem={editingItem}
									handleStateReceive={handleStateReceive}
								/>
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateReceive(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
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
