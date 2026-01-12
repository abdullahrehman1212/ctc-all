// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import moment from 'moment';
import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
import Spinner from '../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import { componentsMenu } from '../../../../menu';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import showNotification from '../../../../components/extras/showNotification';

import Card, {
	CardActions,
	CardSubTitle,
	CardBody,
	CardCodeView,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
// ** Reactstrap Imports
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import Input from '../../../../components/bootstrap/forms/Input';
// ** apiClient Imports

import apiClient from '../../../../baseURL/apiClient';
import baseURL from '../../../../baseURL/baseURL';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, {
	dataPagination,
} from '../../../../components/defaultPagination/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';

import Select from '../../../../components/bootstrap/forms/Select';
import 'flatpickr/dist/themes/light.css';
import GeneratePDF from './print/printIncomeStatement';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];

const DashboardPage = (props) => {
	const [startDate, setStartDate] = useState(moment().startOf('month').format('DD/MM/YY'));
	const [endDate, setEndDate] = useState(moment().format('DD/MM/YY'));

	const [startDate2, setStartDate2] = useState(moment().startOf('month'));
	const [endDate2, setEndDate2] = useState(moment());

	const [countSNo, setCountSNo] = useState(0);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const [incomeStatement, setIncomeStatement] = useState([]);
	const [incomeStatementLoading, setIncomeStatementLoading] = useState(true);
	const [printreport, setPrintreport] = useState([]);

	const [searchBy, setSearchBy] = useState('1');
	useEffect(() => {
		setIncomeStatementLoading(true);
		setIncomeStatement(props.incomeStatementDefault);
		setIncomeStatementLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let count = 0;

	// Expense
	let drTotalExpenses = 0;
	let crTotalExpenses = 0;
	const calculateTotalExpensesCr = (amount) => {
		crTotalExpenses += parseFloat(Math.abs(amount));
	};
	const calculateTotalExpensesDr = (amount) => {
		drTotalExpenses += parseFloat(Math.abs(amount));
	};
	// Cost
	let crTotalCost = 0;
	let drTotalCost = 0;
	const calculateTotalCostDr = (amount) => {
		drTotalCost += parseFloat(Math.abs(amount));
	};
	const calculateTotalCostCr = (amount) => {
		crTotalCost += parseFloat(Math.abs(amount));
	};
	// Revenue
	let drTotalRevenue = 0;
	let crTotalRevenue = 0;

	const calcluateTotalRevenueDr = (amount) => {
		drTotalRevenue += parseFloat(Math.abs(amount));
	};

	const calcluateTotalRevenueCr = (amount) => {
		crTotalRevenue += parseFloat(Math.abs(amount));
	};

	useEffect(() => {
		setIncomeStatementLoading(true);

		const getAllEntries = () => {
			apiClient
				.get(`/getTrailBalance?from=${startDate}&to=${endDate}`)
				.then((response) => {
					setIncomeStatement(response.data.data);
					setIncomeStatementLoading(false);
				})
				.catch((err) => console.log(err));
		};

		getAllEntries();
	}, [startDate, endDate]);

	const print = (docType) => {
		try {
			GeneratePDF(incomeStatement, docType, startDate2, endDate2);
		} catch (e) {
			console.log('Error');
		}

		showNotification(
			'Generating Income Statement ',
			'Generating  Income Statement Successfully',
			'success',
		);
	};

	return (
		<>
			<CardHeader className='px-0 pt-0'>
				<CardLabel icon='Engineering' iconColor='danger'>
					<CardTitle>Income Statement</CardTitle>
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
								{/* <DropdownItem isHeader>Other Actions</DropdownItem> */}
								<DropdownItem>
									<Button
										isOutline
										color='dark'
										icon='Preview'
										onClick={() => print(2)}>
										View Income Statement
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
							<div className='row g-4'>
								<h4 style={{ fontSize: 16 }}> Filter</h4>
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
								<div className='col-md-3'>
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
							</div>
						</div>
						<br />
						<div className='table-responsive'>
							<table className='table table-striped table-bordered table-hover'>
								<thead className='table-light'>
									<tr>
										<th className='cursor-pointer text-decoration-underline'>
											Account
										</th>
										<th className='cursor-pointer text-decoration-underline'>
											Amount
										</th>
									</tr>
								</thead>
								{incomeStatementLoading ? (
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
										{/* cost */}
										{incomeStatement.revenues &&
											incomeStatement.revenues.map((item, index) => {
												return (
													// eslint-disable-next-line react/jsx-no-useless-fragment
													<>
														{item.coa_sub_groups &&
															item.coa_sub_groups.map(
																(item2, index2) => {
																	return (
																		// eslint-disable-next-line react/jsx-no-useless-fragment
																		<>
																			{item2.coa_accounts &&
																				item2.coa_accounts.map(
																					(
																						item3,
																						index3,
																					) => {
																						if (
																							item3.balance !==
																							null
																						) {
																							if (
																								item3
																									.balance
																									.balance >
																								0
																							) {
																								calcluateTotalRevenueDr(
																									item3
																										.balance
																										.balance,
																								);
																							} else if (
																								item3
																									.balance
																									.balance <
																								0
																							) {
																								calcluateTotalRevenueCr(
																									item3
																										.balance
																										.balance,
																								);
																							}
																						}
																						count += 1;
																						return (
																							<tr
																								key={
																									count
																								}>
																								<td className='px-5'>
																									{
																										item3.code
																									}

																									-
																									{
																										item3.name
																									}
																								</td>
																								<td>
																									{/* starts */}
																									{item3.balance
																										? item3
																											.balance
																											.balance <=
																											0
																											? Math.abs(
																												item3
																													.balance
																													.balance,
																											).toLocaleString(
																												undefined,
																												{
																													maximumFractionDigits: 2,
																												},
																											)
																											: `(${Math.abs(
																												item3
																													.balance
																													?.balance ||
																												0,
																											).toLocaleString(
																												undefined,
																												{
																													maximumFractionDigits: 2,
																												},
																											)})`
																										: 0}
																									{/* Ends */}
																								</td>
																							</tr>
																						);
																					},
																				)}
																		</>
																	);
																},
															)}
													</>
												);
											})}

										<tr key={count}>
											<td>
												<h4 className='d-flex justify-content-end px-4'>
													Total Revenue
												</h4>
											</td>
											<td>
												<h4 className='px-0'>
													{crTotalRevenue - drTotalRevenue >= 0
														? Math.abs(
															crTotalRevenue - drTotalRevenue,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})
														: `(${Math.abs(
															crTotalRevenue - drTotalRevenue,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})})`}
												</h4>
											</td>
										</tr>

										{incomeStatement.cost &&
											incomeStatement.cost.map((item, index) => {
												return (
													// eslint-disable-next-line react/jsx-no-useless-fragment
													<>
														{item.coa_sub_groups &&
															item.coa_sub_groups.map(
																(item2, index2) => {
																	return (
																		// eslint-disable-next-line react/jsx-no-useless-fragment
																		<>
																			{item2.coa_accounts &&
																				item2.coa_accounts.map(
																					(
																						item3,
																						index3,
																					) => {
																						if (
																							item3.balance !==
																							null
																						) {
																							if (
																								item3
																									.balance
																									.balance >
																								0
																							) {
																								calculateTotalCostDr(
																									item3
																										.balance
																										.balance,
																								);
																							} else if (
																								item3
																									.balance
																									.balance <
																								0
																							) {
																								calculateTotalCostCr(
																									item3
																										.balance
																										.balance,
																								);
																							}
																						}
																						count += 1;
																						return (
																							<tr
																								key={
																									count
																								}>
																								<td className='px-5'>
																									{
																										item3.code
																									}

																									-
																									{
																										item3.name
																									}
																								</td>
																								<td>
																									{item3.balance
																										? item3
																											.balance
																											.balance >=
																											0
																											? Math.abs(
																												item3
																													.balance
																													.balance,
																											).toLocaleString(
																												undefined,
																												{
																													maximumFractionDigits: 2,
																												},
																											)
																											: `(${Math.abs(
																												item3
																													.balance
																													?.balance,
																											).toLocaleString(
																												undefined,
																												{
																													maximumFractionDigits: 2,
																												},
																											)})`
																										: 0}
																								</td>
																							</tr>
																						);
																					},
																				)}
																		</>
																	);
																},
															)}
													</>
												);
											})}

										<tr key={count}>
											<td>
												<h4 className='d-flex justify-content-end px-4'>
													Total Cost
												</h4>
											</td>
											<td>
												<h4 className='px-0'>
													{drTotalCost - crTotalCost >= 0
														? Math.abs(
															drTotalCost - crTotalCost,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})
														: `(${Math.abs(
															drTotalCost - crTotalCost,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})})`}
												</h4>
											</td>
										</tr>
										<tr key={count + 1}>
											<td>
												<h4 className='d-flex justify-content-end px-4'>
													{crTotalRevenue -
														drTotalRevenue -
														drTotalCost +
														crTotalCost >
														0 && <h4>Gross Profit </h4>}
													{crTotalRevenue -
														drTotalRevenue -
														drTotalCost +
														crTotalCost <=
														0 && <h4>Gross Loss </h4>}

													<br />
												</h4>
											</td>
											<td>
												<h4 className='px-0'>
													<h4>
														{crTotalRevenue -
															drTotalRevenue -
															drTotalCost +
															crTotalCost >=
															0
															? Math.abs(
																crTotalRevenue -
																drTotalRevenue -
																drTotalCost +
																crTotalCost,
															).toLocaleString(undefined, {
																maximumFractionDigits: 2,
															})
															: `(${Math.abs(
																crTotalRevenue -
																drTotalRevenue -
																drTotalCost +
																crTotalCost,
															).toLocaleString(undefined, {
																maximumFractionDigits: 2,
															})})`}
													</h4>
												</h4>
											</td>
										</tr>
										{/* expenses */}
										{/* {incomeStatement.expenses &&
											incomeStatement.expenses.map((item, index) => {
												return (
													// eslint-disable-next-line react/jsx-no-useless-fragment
													<>
														{item.coa_sub_groups &&
															item.coa_sub_groups.map(
																(item2, index2) => {
																	return (
																		// eslint-disable-next-line react/jsx-no-useless-fragment
																		<>
																			{item2.coa_accounts &&
																				item2.coa_accounts.map(
																					(
																						item3,
																						index3,
																					) => {
																						if (
																							item3.balance !==
																							null
																						) {
																							if (
																								item3
																									.balance
																									.balance >
																								0
																							) {
																								calculateTotalExpensesDr(
																									item3
																										.balance
																										.balance,
																								);
																							} else if (
																								item3
																									.balance
																									.balance <
																								0
																							) {
																								calculateTotalExpensesCr(
																									item3
																										.balance
																										.balance,
																								);
																							}
																						}
																						count += 1;
																						return (
																							<tr
																								key={
																									count
																								}>
																								<td className='px-5'>
																									{
																										item3.code
																									}

																									-
																									{
																										item3.name
																									}
																								</td>
																								<td>
																									{item3.balance
																										? item3
																												.balance
																												.balance >=
																										  0
																											? Math.abs(
																													item3
																														.balance
																														.balance,
																											  ).toLocaleString(
																													undefined,
																													{
																														maximumFractionDigits: 2,
																													},
																											  )
																											: `(${Math.abs(
																													item3
																														.balance
																														?.balance,
																											  ).toLocaleString(
																													undefined,
																													{
																														maximumFractionDigits: 2,
																													},
																											  )})`
																										: 0}
																								</td>
																							</tr>
																						);
																					},
																				)}
																		</>
																	);
																},
															)}
													</>
												);
											})} */}

										{
											incomeStatement.expenses &&
											(() => {
												const allExpenses = [];

												// Extract all item3 entries
												incomeStatement.expenses.forEach(item => {
													item.coa_sub_groups?.forEach(item2 => {
														item2.coa_accounts?.forEach(item3 => {
															allExpenses.push(item3);
														});
													});
												});

												// Sort globally by name
												const sortedExpenses = allExpenses.sort((a, b) =>
													a.name.localeCompare(b.name)
												);

												// Render sorted entries
												return sortedExpenses.map((item3, index) => {
													if (item3.balance !== null) {
														if (item3.balance.balance > 0) {
															calculateTotalExpensesDr(item3.balance.balance);
														} else if (item3.balance.balance < 0) {
															calculateTotalExpensesCr(item3.balance.balance);
														}
													}

													return (
														<tr key={`expense-${item3.code || ''}-${item3.name || ''}`}>
															<td className="px-5">
																{item3.code} - {item3.name}
															</td>

															<td>
																{item3.balance
																	? item3.balance.balance >= 0
																		? Math.abs(item3.balance.balance).toLocaleString(
																			undefined,
																			{ maximumFractionDigits: 4 }
																		)
																		: `(${Math.abs(item3.balance.balance).toLocaleString(
																			undefined,
																			{ maximumFractionDigits: 4 }
																		)})`
																	: 0}
															</td>
														</tr>
													);
												});
											})()
										}
										{/* expenses */}
										<tr key={count}>
											<td>
												<h4 className='d-flex justify-content-end px-4'>
													Total Expenses
												</h4>
											</td>
											<td>
												<h4 className='px-0'>
													{drTotalExpenses - crTotalExpenses >= 0
														? Math.abs(
															drTotalExpenses - crTotalExpenses,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})
														: `(${Math.abs(
															drTotalExpenses - crTotalExpenses,
														).toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})})`}
												</h4>
											</td>
										</tr>

										<tr key={count + 1}>
											<td>
												<h4 className='d-flex justify-content-end px-4'>
													{/* Revenue crTotalRevenue - drTotalRevenue */}
													{/* Cost drTotalCost - crTotalCost */}
													{/* Expenses drTotalExpenses - crTotalExpenses */}
													{crTotalRevenue -
														drTotalRevenue -
														drTotalCost +
														crTotalCost -
														drTotalExpenses +
														crTotalExpenses >
														0 && <h4>Net Profit </h4>}
													{crTotalRevenue -
														drTotalRevenue -
														drTotalCost +
														crTotalCost -
														drTotalExpenses +
														crTotalExpenses <=
														0 && <h4>Net Loss </h4>}

													<br />
												</h4>
											</td>
											<td>
												<h4 className='px-0'>
													<h4>
														{crTotalRevenue -
															drTotalRevenue -
															drTotalCost +
															crTotalCost -
															drTotalExpenses +
															crTotalExpenses >=
															0
															? Math.abs(
																crTotalRevenue -
																drTotalRevenue -
																drTotalCost +
																crTotalCost -
																drTotalExpenses +
																crTotalExpenses,
															).toLocaleString(undefined, {
																maximumFractionDigits: 2,
															})
															: `(${Math.abs(
																crTotalRevenue -
																drTotalRevenue -
																drTotalCost +
																crTotalCost -
																drTotalExpenses +
																crTotalExpenses,
															).toLocaleString(undefined, {
																maximumFractionDigits: 2,
															})})`}
													</h4>
												</h4>
											</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
