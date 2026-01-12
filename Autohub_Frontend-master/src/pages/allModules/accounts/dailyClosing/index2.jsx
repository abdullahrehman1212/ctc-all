// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import Select from 'react-select';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import Spinner from '../../../../components/bootstrap/Spinner';
import { componentsMenu } from '../../../../menu';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardSubTitle,
	CardBody,
	CardCodeView,
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
// ** Reactstrap Imports
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import Input from '../../../../components/bootstrap/forms/Input';
// ** apiClient Imports
import baseURL from '../../../../baseURL/baseURL';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, { dataPagination } from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';

import showNotification from '../../../../components/extras/showNotification';
import GeneratePDF4 from './Report';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];

const DashboardPage = () => {
	const [searchNo, setSearchNo] = useState('');
	const [openingBalance, setOpeningBalance] = useState(0);
	let currentBalance = 0;

	const [dailyClosingDate, setDailyClosingDate] = useState(moment().format('DD/MM/YY'));
	const [dailyClosingDate2, setDailyClosingDate2] = useState(moment());
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);

	const [accountSelected, setAccountSelected] = useState(null);
	const [accountOptions, setAccountOptions] = useState('');
	const [accountOptionsLoading, setAccountOptionsLoading] = useState(true);

	useEffect(() => {
		setAccountSelected(null);
		setAccountOptionsLoading(true);
		setAccountOptions([]);
		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response?.data?.coaAccounts?.map(({ id, name, code }) => ({
					id,
					value: id,
					label: `${code}-${name}`,
				}));
				if (rec.length > 0) setAccountSelected(rec[0]);
				setAccountOptions(rec);
				setAccountOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	useEffect(() => {
		const getAllEntriesExtendedLedger = () => {
			setAccountLedgerLoading(true);
			// apiClient.get(`/getDailyClosingReport?date=${dailyClosingDate}`)
			apiClient
				.get(
					`/getAccountLedger?account_id=${accountSelected?.id}&from=${dailyClosingDate}&to=${dailyClosingDate}`,
				)
				.then((response) => {
					setOpeningBalance(
						response.data.opening_balance ? response.data.opening_balance : 0,
					);

					setAccountLedger(response.data.ledger);

					setAccountLedgerLoading(false);
				})
				.catch((err) => console.log(err));
		};

		getAllEntriesExtendedLedger();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dailyClosingDate, accountSelected]);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [accountLedger, setAccountLedger] = useState([]);
	const [accountLedgerLoading, setAccountLedgerLoading] = useState(false);
	const [printreport, setPrintreport] = useState([]);

	// const { items, requestSort, getClassNamesFor } = useSortableData(generalJournal);
	const { items, requestSort, getClassNamesFor } = useSortableData(accountLedger);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const printReportAll = (docType) => {
		setIsPrintAllReportLoading(true);

		GeneratePDF4(accountLedger, accountSelected, docType, dailyClosingDate2, openingBalance);
		showNotification('Printing Daily Closing', 'Printing  report Successfully', 'success');
		setIsPrintAllReportLoading(false);
	};
	return (
		<PageWrapper title={componentsMenu.components.subMenu.table.text}>
			<Page>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Daily Closing Report</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='col-12'>
										<div className='col-12'>
											<div className='row g-4'>
												<h4>Filter</h4>
												<div className='col-md-2'>
													<FormGroup label='Date' id='DateBalanceSheet'>
														<Flatpickr
															className='form-control'
															value={dailyClosingDate}
															// eslint-disable-next-line react/jsx-boolean-value

															options={{
																dateFormat: 'd/m/y',
																allowInput: true,
															}}
															onChange={(date, dateStr) => {
																setDailyClosingDate(dateStr);
																setDailyClosingDate2(date[0]);
															}}
															onClose={(date, dateStr) => {
																setDailyClosingDate(dateStr);
																setDailyClosingDate2(date[0]);
															}}
															id='default-picker'
														/>
													</FormGroup>
												</div>
												<div className='col-md-4'>
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
												<div className='col-md-2'>
													<br />
													<Button
														isOutline
														color='primary'
														// isLight={darkModeStatus}
														className={classNames('text-nowrap', {
															'border-light': true,
														})}
														icon={!isPrintAllReportLoading && 'Preview'}
														isDisable={isPrintAllReportLoading}
														onClick={() => printReportAll(2)}>
														{isPrintAllReportLoading && (
															<Spinner isSmall inButton />
														)}
														{isPrintAllReportLoading
															? 'Generating PDF...'
															: 'View  PDF'}
													</Button>
												</div>
											</div>
											<br />
											<table className='table table-modern'>
												<thead>
													<tr>
														<th style={{ width: 50 }}>
															{SelectAllCheck}
														</th>
														<th
															onClick={() => requestSort('id')}
															className='cursor-pointer text-decoration-underline'>
															T Id{' '}
															<Icon
																size='lg'
																className={getClassNamesFor(
																	'firstName',
																)}
																icon='FilterList'
															/>
														</th>

														<th>Voucher No </th>
														<th>Time Stamp </th>

														{accountLedger[0]?.land !== null && (
															<th>File No</th>
														)}

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
																	<Spinner
																		color='primary'
																		size='5rem'
																	/>
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
																{openingBalance.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
																)}
															</td>
														</tr>

														{onCurrentPageData?.map((item) => {
															currentBalance +=
																Number(item.debit) -
																Number(item.credit) +
																openingBalance;

															return (
																<tr key={item.id}>
																	<td>
																		<Checks
																			id={item.id.toString()}
																			name='selectedList'
																			value={item.id}
																			onChange={
																				selectTable.handleChange
																			}
																			checked={selectTable.values.selectedList.includes(
																				item.id.toString(),
																			)}
																		/>
																	</td>
																	<td>{item.id}</td>
																	<td>
																		{
																			item.voucher_number
																				.voucher_no
																		}
																	</td>
																	<td>
																		{moment(item?.date).format(
																			'DD/MM/YYYY',
																		)}
																	</td>
																	{/* {item.land.file_no && <td>{item.land.file_no} </td>} */}

																	{item?.land !== null && (
																		<td>
																			<div>
																				<div>
																					{
																						item.land
																							?.file_no
																					}
																					-
																					{
																						item.land
																							?.file_name
																					}
																				</div>
																				<div className='small text-muted'>
																					{
																						item
																							.land_payment_head
																							?.name
																					}
																				</div>
																			</div>
																		</td>
																	)}

																	<td>
																		{item.description}
																		{item.cheque_no !== null &&
																			item.cheque_date !==
																				null && (
																				<>
																					Cheque No:{' '}
																					{
																						item
																							.voucher_number
																							.cheque_no
																					}
																					<br />
																					Cheque Date:{' '}
																					{moment(
																						item
																							.voucher_number
																							.cheque_date,
																					).format(
																						'DD/MM/YYYY',
																					)}
																					<br />
																				</>
																			)}
																	</td>
																	<td>
																		{item.debit.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																		)}
																	</td>
																	<td>
																		{item.credit.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																		)}
																	</td>
																	<td>
																		{currentBalance.toLocaleString(
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
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
