// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import Spinner from '../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import GeneratePDF from '../viewAccounts/print/printLedger';
import { CardActions, CardHeader, CardBody } from '../../../../components/bootstrap/Card';
import 'flatpickr/dist/themes/light.css';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
// ** Reactstrap Imports
// ** apiClient Imports

import apiClient from '../../../../baseURL/apiClient';
import useSortableData from '../../../../hooks/useSortableData';
import { dataPagination } from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';

import showNotification from '../../../../components/extras/showNotification';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];

const DashboardPage = (props) => {
	const [openingBalance, setOpeningBalance] = useState(0);
	let currentBalance = 0;

	const [startDate, setStartDate] = useState('');
	const [startDate2, setStartDate2] = useState('');
	const [endDate, setEndDate] = useState('');
	const [endDate2, setEndDate2] = useState('');

	const [filesByAccountOptions, setFilesByAccountOptions] = useState('');
	const [filesByAccountOptionsLoading, setFilesByAccountOptionsLoading] = useState(false);
	const [filesByAccountSelected, setFilesByAccountSelected] = useState(null);

	const [paymentHeadsByFileAndAccountOptions, setPaymentHeadsByFileAndAccountOptions] =
		useState('');
	const [paymentHeadsByFileAndAccountLoading, setPaymentHeadsByFileAndAccountLoading] =
		useState(false);
	const [paymentHeadsByFileAndAccountSelected, setPaymentHeadsByFileAndAccountSelected] =
		useState(null);

	useEffect(() => {
		searchFilterTrigger();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		const getFilesByAccount = () => {
			apiClient
				// eslint-disable-next-line react/destructuring-assignment
				.get(`/getFilesByAccount?account_id=${props.accountSelected.id}`)
				.then((response) => {
					const rec = response.data.files.map(({ land }) => ({
						id: land.id,
						value: land.id,

						label: `${land.file_no}-${land.file_name}`,
					}));
					setFilesByAccountOptions(rec);
					setFilesByAccountOptionsLoading(false);
				})
				.catch((err) => console.log(err));
		};
		const getPaymentHeadsByFileAndAccount = () => {
			apiClient
				.get(
					// eslint-disable-next-line react/destructuring-assignment
					`/getPaymentHeadsByFileAndAccount?account_id=${props.accountSelected.id}`,
				)
				.then((response) => {
					const rec = response.data.paymentHeads.map(({ land_payment_head }) => ({
						id: land_payment_head.id,
						value: land_payment_head.id,

						label: land_payment_head.name,
					}));
					setPaymentHeadsByFileAndAccountOptions(rec);
					setPaymentHeadsByFileAndAccountLoading(false);
				})
				.catch((err) => console.log(err));
		};
		// eslint-disable-next-line react/destructuring-assignment
		if (props.accountSelected) {
			setFilesByAccountOptionsLoading(true);
			setPaymentHeadsByFileAndAccountLoading(true);
			getFilesByAccount();
			getPaymentHeadsByFileAndAccount();
		}
		// eslint-disable-next-line react/destructuring-assignment
	}, [props.accountSelected]);

	const searchFilterTrigger = () => {
		setFilesByAccountSelected(null);
		setPaymentHeadsByFileAndAccountSelected(null);
		const getAllEntries = () => {
			setAccountLedgerLoading(true);
			apiClient
				.get(
					// eslint-disable-next-line react/destructuring-assignment
					`/getAccountLedger?account_id=${props.accountSelected.id}&from=${startDate}&to=${endDate}`,
				)
				.then((response) => {
					setOpeningBalance(
						response.data.opening_balance ? response.data.opening_balance : 0,
					);

					setAccountLedger(response.data.ledger);
					setPerPage(response.data.ledger.length > 0 ? response.data.ledger.length : 10);
					setAccountLedgerLoading(false);
				})
				.catch((err) => console.log(err));
		};
		// eslint-disable-next-line react/destructuring-assignment

		getAllEntries();
	};

	const [currentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [accountLedger, setAccountLedger] = useState([]);
	const [accountLedgerLoading, setAccountLedgerLoading] = useState(false);

	// const { items, requestSort, getClassNamesFor } = useSortableData(generalJournal);
	const { items, requestSort, getClassNamesFor } = useSortableData(accountLedger);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const print = (docType) => {
		try {
			// eslint-disable-next-line react/destructuring-assignment
			if (accountLedger && props.accountSelected) {
				GeneratePDF(
					accountLedger,
					// eslint-disable-next-line react/destructuring-assignment
					props.accountSelected,
					docType,
					startDate2,
					endDate2,
					openingBalance,
				);
				showNotification('Success', 'Printing Ledger Successfully', 'success');
			}
		} catch (e) {
			showNotification('Error', e, 'danger');
		}
	};
	return (
		<CardBody>
			<CardHeader className='px-4 pt-0'>
				<div className='row g-4'>
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
									console.log('dddd', date[0]);
								}}
								onClose={(date, dateStr) => {
									setStartDate(dateStr);
									setStartDate2(date[0]);
								}}
								id='default-picker'
							/>
						</FormGroup>
					</div>

					<div className='col-md-2'>
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
					<div className='col-md-3'>
						<FormGroup label='File No' id='File_no'>
							<Select
								className='col-md-11'
								isClearable
								classNamePrefix='select'
								options={filesByAccountOptions}
								isLoading={filesByAccountOptionsLoading}
								value={filesByAccountSelected}
								onChange={(val) => {
									setFilesByAccountSelected(val);
								}}
							/>
						</FormGroup>
					</div>
					<div className='col-md-3'>
						<FormGroup label='Details' id='Details'>
							<Select
								className='col-md-11'
								isClearable
								classNamePrefix='select'
								options={paymentHeadsByFileAndAccountOptions}
								isLoading={paymentHeadsByFileAndAccountLoading}
								value={paymentHeadsByFileAndAccountSelected}
								onChange={(val) => {
									setPaymentHeadsByFileAndAccountSelected(val);
								}}
							/>
						</FormGroup>
					</div>
					<div className='col-md-2'>
						<br />

						<div className='col-auto'>
							<Button
								color='primary'
								onClick={() => searchFilterTrigger()}
								isOutline
								isDisable={accountLedgerLoading}
								isActive>
								Search
							</Button>
						</div>
					</div>
				</div>
				<CardActions>
					<ButtonGroup>
						<Dropdown>
							<DropdownToggle hasIcon={false}>
								<Button
									color='danger'
									isLight
									hoverShadow='default'
									icon='MoreVert'
								/>
							</DropdownToggle>
							<DropdownMenu isAlignmentEnd>
								<DropdownItem isHeader>Print Actions</DropdownItem>

								<DropdownItem>
									<Button
										isOutline
										color='dark'
										icon='Preview'
										onClick={() => print(2)}>
										View Ledger
									</Button>
								</DropdownItem>
								<DropdownItem>
									<Button
										isOutline
										color='dark'
										icon='FilePdfFill'
										onClick={() => print(1)}>
										Save to pdf
									</Button>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</ButtonGroup>
				</CardActions>
			</CardHeader>
			<br />
			<div className='table-responsive'>
				<table className='table table-striped table-bordered table-hover'>
					<thead className='table-light'>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th
								onClick={() => requestSort('id')}
								className='cursor-pointer text-decoration-underline'>
								T Id{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('firstName')}
									icon='FilterList'
								/>
							</th>

							<th>Voucher No </th>
							<th>Time Stamp </th>

							{accountLedger[0]?.land !== null && <th>File No</th>}

							<th>Description </th>
							<th>Dr </th>
							<th>Cr </th>
							<th>Balance </th>
							{/* <th
												onClick={() => requestSort('file_no')}
												className='cursor-pointer text-decoration-underline'>
												Balance{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('file_no')}
													icon='FilterList'
												/>
											</th> */}
						</tr>
					</thead>
					{accountLedgerLoading ? (
						<tbody>
							<tr>
								<td colSpan='11'>
									<div className='d-flex justify-content-center'>
										<Spinner color='primary' size='5rem' />
									</div>
								</td>
							</tr>
						</tbody>
					) : (
						<tbody>
							<tr>
								<td>-</td>
								<td>- </td>
								<td>-</td>
								<td>- </td>
								<td>Opening Balance</td>
								<td>-</td>
								<td>- </td>

								<td>
									{openingBalance.toLocaleString(undefined, {
										maximumFractionDigits: 2,
									})}
								</td>
							</tr>

							{onCurrentPageData.map((item) => {
								currentBalance +=
									Number(item.debit) - Number(item.credit) + openingBalance;

								return (
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
										<td>{item.id}</td>
										<td>{item.voucher_number.voucher_no}</td>
										<td>{moment(item?.date).format('DD/MM/YYYY')}</td>
										{/* {item.land.file_no && <td>{item.land.file_no} </td>} */}

										{item?.land !== null && (
											<td>
												<div>
													<div>
														{item.land?.file_no}-{item.land?.file_name}
													</div>
													<div className='small text-muted'>
														{item.land_payment_head?.name}
													</div>
												</div>
											</td>
										)}

										<td>
											{item.description}
											<br />
											{item.voucher_number.cheque_no !== null &&
											item.voucher_number.cheque_date !== null ? (
												<>
													Cheque No: {item.voucher_number.cheque_no}
													<br />
													Issue Date:{' '}
													{moment(
														item.voucher_number.generated_at,
													).format('DD/MM/YYYY')}
													<br />
												</>
											) : (
												''
											)}
										</td>
										<td>
											{item.debit.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</td>
										<td>
											{item.credit.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</td>
										<td>
											{currentBalance.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</td>
										{/* <td>{item.balance}</td> */}
									</tr>
								);
							})}
						</tbody>
					)}
				</table>
			</div>
		</CardBody>
	);
};

export default DashboardPage;
