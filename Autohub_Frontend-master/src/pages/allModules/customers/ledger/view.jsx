// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair

import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
// eslint-disable-next-line import/no-unresolved
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CardBody } from '../../../../components/bootstrap/Card';
import { updateSingleState } from '../../redux/tableCrud/index';
import Checks from '../../../../components/bootstrap/forms/Checks';
import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Spinner from '../../../../components/bootstrap/Spinner';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(store.data.suppliersManagementModule.ledger.perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	useEffect(
		() => {
			dispatch(
				updateSingleState([perPage, 'suppliersManagementModule', 'ledger', 'perPage']),
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'suppliersManagementModule', 'ledger', 'pageNo']));
		refreshTableData();
	};

	return (
		<CardBody className='table-responsive'>
			<table className='table table-modern'>
				<thead>
					<tr>
						<th style={{ width: 50 }}>{SelectAllCheck}</th>
						<th>Sr. No</th>
						<th>Debit</th>
						<th>Credit</th>
						<th>Balance</th>
						<th>Date</th>
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
						{store.data.suppliersManagementModule.ledger.tableData?.length === 0 ||
						store.data.suppliersManagementModule.ledger.tableData === null ? (
							<tr className='justify-content-center'>
								<td colSpan={4}>No Record Found</td>
							</tr>
						) : (
							store.data.suppliersManagementModule.ledger.tableData?.map(
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
										<td>{item.debit}</td>
										<td>{item.credit}</td>
										<td>{item.balance}</td>
										<td>{moment(item.date).format('DD/MM/YYYY')}</td>
									</tr>
								),
							)
						)}
					</tbody>
				)}
			</table>

			<PaginationButtons
				label='items'
				from={store.data.suppliersManagementModule.ledger.others?.from}
				to={store.data.suppliersManagementModule.ledger.others?.to}
				total={store.data.suppliersManagementModule.ledger.others?.total}
				perPage={perPage}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-3'>
					<Pagination
						activePage={store.data.suppliersManagementModule.ledger.pageNo}
						totalItemsCount={store.data.suppliersManagementModule.ledger.others?.total}
						itemsCountPerPage={store.data.suppliersManagementModule.ledger.perPage}
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
	refreshTableData: PropTypes.func.isRequired,
};

export default View;
