// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import { _titleError } from '../../../../notifyMessages/erroSuccess';
// import showNotification from '../../../../components/extras/showNotification';

import apiClient from '../../../../baseURL/apiClient';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';

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
} from '../../../../components/bootstrap/Card';

import TransferView from './TransferView';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(
		Number(store.data.transferManagementModule.list.perPage),
	);

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	const [view, setView] = useState({});
	const [stateView, setStateView] = useState(false);
	const [viewLoading, setViewLoading] = useState(false);
	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);

	const getViewFunc = (idd) => {
		setViewLoading(true);
		apiClient
			.get(`/getStockTransferDetails?id=${idd}`)
			.then((res) => {
				// console.log('recev state', res.data.data);
				setView(res.data.stocktransfer);
				setViewLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const initialStatusView = () => {
		setHeaderCloseStatusView(true);
	};

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'transferManagementModule', 'list', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'transferManagementModule', 'list', 'pageNo']));
	};

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Sr. No</th>
							<th>Date</th>
							<th>Transfer From</th>
							<th>Transfer To</th>
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
							{store.data.transferManagementModule.list.tableData?.data?.map(
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
										<td>{item.date}</td>
										<td>{item.storetransfer?.name}</td>
										<td>{item.storereceive?.name}</td>
										<td>
											{/* <Dropdown>
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
															initialStatusView();
															setStateView(true);
															getViewFunc(item.id);
														}}>
														View
													</DropdownItem>
												</DropdownMenu>
											</Dropdown> */}
											<Icon
												className='d-flex  justify-content-center'
												role='button'
												icon='EyeFill'
												size='2x'
												color='primary'
												onClick={() => {
													initialStatusView();
													setStateView(true);
													setItemId(item.id);
													getViewFunc(item.id);
												}}
											/>
										</td>
									</tr>
								),
							)}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='transfer'
					from={store.data.transferManagementModule.list.tableData?.from ?? 1}
					to={store.data.transferManagementModule.list.tableData?.to ?? 1}
					total={store.data.transferManagementModule.list.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.transferManagementModule.list?.pageNo ?? 1}
							totalItemsCount={
								store.data.transferManagementModule.list?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.transferManagementModule.list?.perPage ?? 10,
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

			{/* View Modal */}
			<Modal isOpen={stateView} setIsOpen={setStateView} titleId='ViewTransfer' size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='ViewTransfer'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Transfer View </CardTitle>
								<small> Item Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{viewLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<TransferView view={view} />
							)}
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
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
