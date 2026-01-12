// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import Spinner from '../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import GeneratePDF from './print/printLedger';
import {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import 'flatpickr/dist/themes/light.css';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import apiClient from '../../../../baseURL/apiClient';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, {
	dataPagination,
} from '../../../../components/defaultPagination/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';

import showNotification from '../../../../components/extras/showNotification';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];

const DashboardPage = () => {
	const [openingBalance, setOpeningBalance] = useState(0);
	const [currentBalance, setCurrentBalance] = useState([]);

	const [mainAccountOptions, setMainAccountOptions] = useState('');
	const [subGroupsOptions, setSubGroupsOptions] = useState('');
	const [accountOptions, setAccountOptions] = useState('');

	const [mainAccountOptionsLoading, setMainAccountOptionsLoading] = useState(true);
	const [subGroupsOptionsLoading, setSubGroupsOptionsLoading] = useState(true);
	const [accountOptionsLoading, setAccountOptionsLoading] = useState(true);

	const [mainAccountSelected, setMainAccountSelected] = useState(null);
	const [subGroupsSelected, setSubGroupsSelected] = useState(null);
	const [accountSelected, setAccountSelected] = useState(null);

	const [accountLedgerSelected, setAccountLedgerSelected] = useState(null);

	const [startDate, setStartDate] = useState(moment().startOf('month').format('DD/MM/YY'));
	const [startDate2, setStartDate2] = useState(moment().startOf('month'));
	const [endDate, setEndDate] = useState(moment().format('DD/MM/YY'));
	const [endDate2, setEndDate2] = useState(moment());

	const [searchLedger] = useState(1);

	useEffect(() => {
		const getAllEntriesExtendedLedger = () => {
			setAccountLedgerLoading(true);
			apiClient
				.get(
					`/getAccountLedger?account_id=${accountSelected.id}&from=${startDate}&to=${endDate}`,
				)
				.then((response) => {
					setOpeningBalance(
						response.data.opening_balance ? response.data.opening_balance : 0,
					);
					let r = response.data.opening_balance;
					const rr = [];
					response.data.ledger.forEach((record) => {
						r += Number(record.debit) - Number(record.credit);
						rr.push(r);
					});
					setCurrentBalance(rr);

					setAccountLedger(response.data.ledger);

					showNotification('Ledger Found', 'Ledger displayed', 'success');
					setAccountLedgerLoading(false);
				})
				.catch((err) => console.log(err));
		};
		if (accountLedgerSelected !== null) {
			getAllEntriesExtendedLedger();
		} else if (searchLedger > 1) {
			showNotification('Choose Account', 'Please choose account to search Ledger', 'warning');
			setAccountLedgerLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const searchFilterTrigger = () => {
		setAccountLedgerSelected(accountSelected);
		const getAllEntries = () => {
			setAccountLedgerLoading(true);
			apiClient
				.get(
					`/getAccountLedger?account_id=${accountSelected.id}&from=${startDate}&to=${endDate}`,
				)
				.then((response) => {
					setOpeningBalance(
						response.data.opening_balance ? response.data.opening_balance : 0,
					);
					let r = response.data.opening_balance;
					const rr = [];
					response.data.ledger.forEach((record) => {
						r += Number(record.debit) - Number(record.credit);
						rr.push(r);
					});
					setCurrentBalance(rr);
					setAccountLedger(response.data.ledger);
					setPerPage(response.data.ledger.length > 0 ? response.data.ledger.length : 10);
					showNotification('Ledger Found', 'Ledger displayed', 'success');
					setAccountLedgerLoading(false);
				})
				.catch((err) => console.log(err));
		};
		if (accountSelected !== null) {
			getAllEntries();
		} else if (searchLedger > 1) {
			showNotification('Choose Account', 'Please choose account to search Ledger', 'warning');
			setAccountLedgerLoading(false);
		}
	};

	useEffect(() => {
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
		}
	}, [subGroupsSelected]);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [accountLedger, setAccountLedger] = useState([]);
	const [accountLedgerLoading, setAccountLedgerLoading] = useState(false);

	// const { items, requestSort, getClassNamesFor } = useSortableData(generalJournal);
	const { items, requestSort, getClassNamesFor } = useSortableData(accountLedger);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const print = (docType) => {
		try {
			if (accountLedger && accountLedgerSelected) {
				GeneratePDF(
					accountLedger,
					accountLedgerSelected,
					docType,
					startDate2,
					endDate2,
					openingBalance,
				);
				showNotification('Success', 'Printing  Successfully', 'success');
			}
		} catch (e) {
			console.log('Error');
			showNotification('Error', e, 'danger');
		}
	};
	return (
		<>
			<CardHeader className='px-0 pt-0'>
				<CardLabel icon='Engineering' iconColor='danger'>
					<CardTitle>Ledgers </CardTitle>
				</CardLabel>
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

			<div className='row'>
				<div className='col-12'>
					<div className='col-12'>
						<div className='row g-4'>
							<div className='col-md-3'>
								<FormGroup label='Main Group' id='mainGroup'>
									<Select
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
									<Select
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
							<div className='col-md-6'>
								<FormGroup label='Account' id='account'>
									<Select
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

										<th>Description </th>
										<th>Dr </th>
										<th>Cr </th>
										<th>Balance </th>
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

										{onCurrentPageData.map((item, index) => {
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
													<td>
														{moment(item?.date).format('DD/MM/YYYY')}
													</td>

													<td>
														{item.description}
														<br />
														{item.voucher_number.cheque_no !== null &&
														item.voucher_number.cheque_date !== null ? (
															<>
																Cheque No:{' '}
																{item.voucher_number.cheque_no}
																<br />
																Issue Date:{' '}
																{moment(
																	item.voucher_number
																		.generated_at,
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
														{currentBalance[index]?.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
														)}
													</td>

													{/* <td>{item.balance}</td> */}
												</tr>
											);
										})}
									</tbody>
								)}
							</table>
						</div>

						<PaginationButtons
							data={items}
							label='items'
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
							perPage={perPage}
							setPerPage={setPerPage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
