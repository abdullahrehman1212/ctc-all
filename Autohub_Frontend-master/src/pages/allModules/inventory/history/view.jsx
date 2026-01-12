// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import moment from 'moment';

import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import { _titleError } from '../../../../notifyMessages/erroSuccess';

import Checks from '../../../../components/bootstrap/forms/Checks';

import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';

import { CardBody } from '../../../../components/bootstrap/Card';

const View = ({ tableDataLoading, tableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(
		Number(store.data.inventoryManagementModule.history.perPage),
	);

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	// console.log('history', tableData);

	// Edit

	useEffect(
		() => {
			dispatch(
				updateSingleState([perPage, 'inventoryManagementModule', 'history', 'perPage']),
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'inventoryManagementModule', 'history', 'pageNo']));
	};

	return (
		<CardBody className='table-responsive'>
			<table className='table table-modern'>
				<thead>
					<tr>
						<th style={{ width: 50 }}>{SelectAllCheck}</th>
						<th>Sr. No</th>
						<th>Item</th>
						<th>Date</th>
						<th>Description</th>
						<th>Store</th>
						<th>Qty In</th>
						<th>Qty Out</th>
						<th>Rack</th>
						<th>Self</th>
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
						{store.data.inventoryManagementModule.history.tableData?.data?.map(
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
									<td>
										{item.item?.machine_part_oem_part?.oem_part_number?.number1}
										-{item.item?.machine_part_oem_part?.machine_part?.name}
										<div className='small text-muted'>
											{
												item.item?.machine_part_oem_part?.oem_part_number
													?.number2
											}
										</div>
									</td>
									<td>{moment(item.date).format('DD/MM/YYYY')}</td>
									<td>
										{item?.inventory_type?.name ?? 'none'}
										<div className='small text-muted'>
											{item.purchase_order &&
												item.purchase_order.supplier &&
												`Supplier: ${
													item.purchase_order?.supplier?.name ?? ''
												}`}
										</div>
									</td>
									<td>
										{item?.store?.name}
										<div className='small text-muted'>
											{item?.store?.store_type?.name}
										</div>
									</td>
									<td>{item?.quantity_in}</td>
									<td>{item?.quantity_out}</td>
									<td>{item?.racks?.rack_number}</td>
									<td>{item?.shelves?.shelf_number}</td>
								</tr>
							),
						)}
					</tbody>
				)}
			</table>

			<PaginationButtons
				label='history'
				from={store.data.inventoryManagementModule.history.tableData?.from ?? 1}
				to={store.data.inventoryManagementModule.history.tableData?.to ?? 1}
				total={store.data.inventoryManagementModule.history.tableData?.total ?? 0}
				perPage={Number(perPage ?? 10)}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-md-4'>
					<Pagination
						activePage={store.data.inventoryManagementModule.history?.pageNo ?? 1}
						totalItemsCount={
							store.data.inventoryManagementModule.history?.tableData?.total ?? 0
						}
						itemsCountPerPage={Number(
							store.data.inventoryManagementModule.history?.perPage ?? 10,
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
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
};

export default View;
