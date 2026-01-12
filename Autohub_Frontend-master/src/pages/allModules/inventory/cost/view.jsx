// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import classNames from 'classnames';
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports
import apiClient from '../../../../baseURL/apiClient';
import { _titleError } from '../../../../notifyMessages/erroSuccess';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import Checks from '../../../../components/bootstrap/forms/Checks';

import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
import showNotification from '../../../../components/extras/showNotification';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Edit from './edit';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(
		Number(store.data.inventoryManagementModule.cost.perPage),
	);

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	// Edit
	const [editingItem, setEditingItem] = useState(false);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const [stateEdit, setStateEdit] = useState(false);
	const [itemId, setItemId] = useState();
	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(false);

	const getEditingItem = (item) => {
		setEditingItemLoading(true);
		setEditingItem(item);
		console.log('editingItem', item);
		console.log('editing', editingItem);
		if (editingItem !== {}) {
			setEditingItemLoading(false);
		}
	};

	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
	};

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'inventoryManagementModule', 'cost', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'inventoryManagementModule', 'cost', 'pageNo']));
	};

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Sr. No</th>
							<th>Item</th>
							<th>OEM</th>
							<th>Avg Cost</th>
							<th>Min Price</th>
							<th>Max Price</th>
							<th>Sale Price</th>
							<th>Last Sale Price</th>
							<th>Purchase Price</th>
							<th>Purchase Price($)</th>
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
							{store.data.inventoryManagementModule.cost?.tableData?.data.map(
								(item, index) => (
									<tr key={item?.id}>
										<td>
											<Checks
												id={item?.id?.toString()}
												name='selectedList'
												value={item?.id}
												onChange={selectTable.handleChange}
												checked={selectTable.values.selectedList.includes(
													item?.id?.toString(),
												)}
											/>
										</td>
										<td>{index + 1}</td>
										<td>{item?.item?.name}</td>
										<td>
											{
												item?.item?.machine_part_oem_part?.oem_part_number
													?.number1
											}
											<div className='small text-muted'>
												{
													item?.item?.machine_part_oem_part
														?.oem_part_number?.number2
												}
											</div>
										</td>
								
										<td>
											{item?.item?.avg_cost?.toLocaleString(undefined, {
												maximumFractionDigits: 4,
											})}
										</td>
										<td>
											{item.item?.min_price === null
												? ''
												: item.item?.min_price.toLocaleString(undefined, {
														maximumFractionDigits: 4,
												  })}
										</td>
										<td>
											{item.item?.max_price === null
												? ''
												: item.item?.max_price.toLocaleString(undefined, {
														maximumFractionDigits: 4,
												  })}
										</td>
										<td>
											{item.item?.sale_price === null
												? ''
												: item.item?.sale_price.toLocaleString(undefined, {
														maximumFractionDigits: 4,
												  })}
										</td>
										<td>
											{item.item?.last_sale_price === null
												? ''
												: item.item?.last_sale_price.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 4,
														},
												  )}
										</td>
										<td>
											{item.item?.purchase_price === null
												? ''
												: item.item?.purchase_price.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 4,
														},
												  )}
										</td>
										<td>
											{item.item?.purchase_dollar_rate === null
												? ''
												: item.item?.purchase_dollar_rate.toLocaleString(
														undefined,
														{
															maximumFractionDigits: 4,
														},
												  )}
										</td>
										<td>
											<ButtonGroup>
												<Button
													// isDisable={item.isApproved === 1}
													onClick={() => {
														getEditingItem(item);
														setItemId(item.id);
														setStateEdit(true);
													}}
													isOutline
													color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Edit'>
													Edit
												</Button>
											</ButtonGroup>
										</td>
									</tr>
								),
							)}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='cost'
					from={store.data.inventoryManagementModule.cost.tableData?.from ?? 1}
					to={store.data.inventoryManagementModule.cost.tableData?.to ?? 1}
					total={store.data.inventoryManagementModule.cost.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.inventoryManagementModule.cost?.pageNo ?? 1}
							totalItemsCount={
								store.data.inventoryManagementModule.cost?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.inventoryManagementModule.cost?.perPage ?? 10,
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
			<Modal isOpen={stateEdit} setIsOpen={setStateEdit} titleId='EditVoucher' size='md'>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Cost</CardTitle>
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
		</>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
};

export default View;
