// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import { componentsMenu } from '../../../../menu';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Spinner from '../../../../components/bootstrap/Spinner';
import 'flatpickr/dist/themes/light.css';
import Card, {
	CardBody,
	CardCodeView,
	CardHeader,
	CardLabel,
	CardTitle,
	CardActions,
} from '../../../../components/bootstrap/Card';
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
import PaginationButtons, {
	dataPagination,
} from '../../../../components/defaultPagination/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';
import GeneratePDF from './print/printBalanceSheet';

import showNotification from '../../../../components/extras/showNotification';

import Select from '../../../../components/bootstrap/forms/Select';

const DashboardPage = (props) => {
	const [balanceSheetdate, setBalanceSheetdate] = useState(moment().format('DD/MM/YY'));
	const [balanceSheetdate2, setBalanceSheetdate2] = useState(moment());
	// const [sumLevel1, setSumLevel1] = useState(0);
	// const [sumLevel2, setSumLevel2] = useState(0);
	// const [sumLevel3, setSumLevel3] = useState(0);
	let totalAssets = 0;
	let totalLiabilities = 0;
	let totalCapital = 0;

	let sum2 = 0;
	let sum3 = 0;

	const CalcluateTotalAssets = (amount) => {
		totalAssets += parseFloat(amount);
	};
	const CalcluateTotalLiabilities = (amount) => {
		totalLiabilities += parseFloat(amount);
	};
	const CalcluateTotalCapital = (amount) => {
		totalCapital += parseFloat(amount);
	};
	const CalcluateTotalSum2 = (amount) => {
		sum2 += parseFloat(amount);
	};
	const CalcluateTotalSum3 = (amount) => {
		console.log(sum3);
		sum3 += parseFloat(amount);
	};
	const [balanceSheetDefault, setBalanceSheetDefault] = useState('');
	const [balanceSheetDefaultLoading, setBalanceSheetDefaultLoading] = useState(true);

	const [searchBy, setSearchBy] = useState('1');
	useEffect(() => {
		setBalanceSheetDefaultLoading(true);
		// eslint-disable-next-line react/destructuring-assignment, react/prop-types
		setBalanceSheetDefault(props.balanceSheetDefault);
		setBalanceSheetDefaultLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		setBalanceSheetDefaultLoading(true);

		apiClient
			.get(`/getBalanceSheet?date=${balanceSheetdate}`)
			.then((response) => {
				setBalanceSheetDefault(response.data.data);
				setBalanceSheetDefaultLoading(false);

				console.log(':::::', response.data.data);
				//   setLoading(false)
			})
			.catch((err) => console.log(err));
	}, [balanceSheetdate]);

	const print = (docType) => {
		try {
			GeneratePDF(balanceSheetDefault, docType, balanceSheetdate2);
		} catch (e) {
			console.log('Error');
			showNotification('Error', e, 'danger');
		}

		showNotification(
			'Generating  Balance sheet',
			'Generating Balance   Generating sheet Successfully',
			'success',
		);
	};

	return (
		<>
			<CardHeader className='px-0 pt-0'>
				<CardLabel icon='Engineering' iconColor='danger'>
					<CardTitle>Balance Sheet</CardTitle>
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
								<DropdownItem isHeader>Print Options</DropdownItem>
								<DropdownItem>
									<Button
										isOutline
										color='dark'
										icon='Preview'
										onClick={() => print(2)}>
										View Balance Sheet
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
								<h4>Filter</h4>
								<div className='col-md-2'>
									<FormGroup label='Date' id='DateBalanceSheet'>
										<Flatpickr
											className='form-control'
											value={balanceSheetdate}
											// eslint-disable-next-line react/jsx-boolean-value

											options={{
												dateFormat: 'd/m/y',
												allowInput: true,
											}}
											onChange={(date, dateStr) => {
												setBalanceSheetdate(dateStr);
												setBalanceSheetdate2(date[0]);
											}}
											onClose={(date, dateStr) => {
												setBalanceSheetdate(dateStr);
												setBalanceSheetdate2(date[0]);
											}}
											id='default-picker'
										/>
									</FormGroup>
								</div>
							</div>
						</div>
						{balanceSheetDefaultLoading ? (
							<div className='d-flex justify-content-center'>
								<Spinner color='primary' size='5rem' />
							</div>
						) : (
							<div className='row g-4'>
								<Card shadow='none' className='col-6 border-end'>
									<CardBody className='px-2'>
										<h2 style={{ fontSize: 18 }}>Assets</h2>
										{/* ******* Level 1 Account Start ******************************************** */}
										{balanceSheetDefault.assets &&
											balanceSheetDefault.assets.map((item, index) => {
												sum2 = 0;
												return (
													<div className='border-bottom border-2'
														key={item.id}
														style={{
															marginLeft: '1rem',
														}}>
														<h3
															style={{
																fontSize: 16,
															}}>
															{item.code}-{item.name}
														</h3>
														{/* ******* Level 2 Account Start ******************************************** */}
														{item.non_depreciation_sub_groups &&
															item.non_depreciation_sub_groups.map(
																(itemSubGroups, indexSubGroups) => {
																	sum3 = 0;

																	return (
																		<div className='border-bottom border-2'
																			key={itemSubGroups.id}
																			style={{
																				marginLeft: '1rem',
																			}}>
																			<h4
																				style={{
																					fontSize: 14,
																				}}>
																				{itemSubGroups.code}
																				-
																				{itemSubGroups.name}
																			</h4>
																			{/* ******* Level 3 Account Start ******************************************** */}
																			{itemSubGroups.coa_accounts &&
																				itemSubGroups.coa_accounts.sort((a, b) =>
													a.name.localeCompare(b.name)
												).map(
																					(
																						itemAccounts,
																						indexAccounts,
																					) => {
																						if (
																							itemAccounts.balance !==
																							null
																						) {
																							CalcluateTotalAssets(
																								itemAccounts.balance &&
																									itemAccounts
																										.balance
																										.balance,
																							);
																							CalcluateTotalSum2(
																								itemAccounts.balance &&
																									itemAccounts
																										.balance
																										.balance,
																							);
																							CalcluateTotalSum3(
																								itemAccounts.balance &&
																									itemAccounts
																										.balance
																										.balance,
																							);
																						}
																						if (
																							itemAccounts.balance !==
																							null
																						)
																							if (
																								itemAccounts
																									.balance
																									.balance !==
																								0
																							)
																								return (
																									<div className='border-bottom border-2 p-1 '
																										key={
																											itemAccounts.id
																										}
																										style={{
																											marginLeft:
																												'1rem',
																										}}>
																										<div className='row ml-1 g-4'>
																											<h5
																												style={{
																													fontSize: 12,
																												}}
																												className='px-2 col-6'>
																												{
																													itemAccounts.code
																												}

																												-
																												{
																													itemAccounts.name
																												}
																											</h5>
																											<h5
																												style={{
																													fontSize: 12,
																												}}
																												className='d-flex justify-content-end col-6'>
																												{itemAccounts.balance !==
																													null &&
																													(itemAccounts
																														.balance
																														.balance >=
																													0
																														? itemAccounts.balance.balance.toLocaleString(
																																undefined,
																																{
																																	maximumFractionDigits: 2,
																																},
																														  )
																														: `(${Math.abs(
																																itemAccounts
																																	.balance
																																	.balance,
																														  ).toLocaleString(
																																undefined,
																																{
																																	maximumFractionDigits: 2,
																																},
																														  )})`)}
																											</h5>
																										</div>
																									</div>
																								);
																						return null;
																					},
																				)}
																			{/* ******* Level 3 Account End ******************************************** */}
																			<div className='border-bottom border-2 row g-4'>
																				<h4
																					style={{
																						fontSize: 14,
																					}}
																					className='px-2 col-6'>
																					Total
																					{` ${itemSubGroups.code}`}
																					-
																					{
																						itemSubGroups.name
																					}
																				</h4>
																				<h5
																					style={{
																						fontSize: 12,
																					}}
																					className='d-flex justify-content-end col-6'>
																					{sum3 !== null
																						? sum3 >= 0
																							? sum3.toLocaleString(
																									undefined,
																									{
																										maximumFractionDigits: 2,
																									},
																							  )
																							: `(${Math.abs(
																									sum3,
																							  ).toLocaleString(
																									undefined,
																									{
																										maximumFractionDigits: 2,
																									},
																							  )})`
																						: 0}
																				</h5>
																			</div>
																		</div>
																	);
																},
															)}
														{/* ******* Level 2 Account Ends ******************************************** */}

														<div className=' border-bottom border-2 row g-4'>
															<h3
																style={{
																	fontSize: 16,
																}}
																className='px-2 col-6'>
																Total {item.code}-{item.name}
															</h3>
															<h3
																style={{
																	fontSize: 16,
																}}
																className='d-flex justify-content-end col-6'>
																{sum2 !== null
																	? sum2 >= 0
																		? sum2.toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																		  )
																		: `(${Math.abs(
																				sum2,
																		  ).toLocaleString(
																				undefined,
																				{
																					maximumFractionDigits: 2,
																				},
																		  )})`
																	: 0}
															</h3>
														</div>
													</div>
												);
											})}
										{/* ******* Level 1 Account Ends ******************************************** */}

										<div className=' border-2 row g-4'>
											<h2 style={{ fontSize: 18 }} className='px-2 col-6'>
												Total Assets
											</h2>

											<h2
												style={{ fontSize: 18 }}
												className='d-flex justify-content-end col-6'>
												{totalAssets !== null
													? totalAssets >= 0
														? totalAssets.toLocaleString(undefined, {
																maximumFractionDigits: 2,
														  })
														: `(${Math.abs(totalAssets).toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
														  )})`
													: 0}{' '}
												<hr />
											</h2>
											<hr />
										</div>
									</CardBody>
								</Card>

								<Card shadow='none' className='border-2 col-6 border-start'>
									<CardBody className='px-2'>
										<div className='row'>
											<h2 style={{ fontSize: 18 }}> Liabilities</h2>
											{/* ******* Level 1 Account Start ******************************************** */}
											{balanceSheetDefault.liabilities &&
												balanceSheetDefault.liabilities.map(
													(item, index) => {
														sum2 = 0;
														return (
															<div
																key={item.id}
																style={{
																	marginLeft: '1rem',
																}}>
																<h3
																	style={{
																		fontSize: 16,
																	}}>
																	{item.code}-{item.name}
																</h3>
																{/* ******* Level 2 Account Start ******************************************** */}
																{item.coa_sub_groups &&
																	item.coa_sub_groups.map(
																		(
																			itemSubGroups,
																			indexSubGroups,
																		) => {
																			sum3 = 0;

																			return (
																				<div className='border-bottom border-2'
																					key={
																						itemSubGroups.id
																					}
																					style={{
																						marginLeft:
																							'1rem',
																					}}>
																					<h4
																						style={{
																							fontSize: 14,
																						}}>
																						{
																							itemSubGroups.code
																						}
																						-
																						{
																							itemSubGroups.name
																						}
																					</h4>
																					{/* ******* Level 3 Account Start ******************************************** */}
																					{itemSubGroups.coa_accounts &&
																						itemSubGroups.coa_accounts.sort((a, b) =>
													a.name.localeCompare(b.name)
																					).map(
																							(
																								itemAccounts,
																								indexAccounts,
																							) => {
																								if (
																									itemAccounts.balance !==
																									null
																								) {
																									CalcluateTotalLiabilities(
																										itemAccounts.balance &&
																											itemAccounts
																												.balance
																												.balance,
																									);
																									CalcluateTotalSum2(
																										itemAccounts.balance &&
																											itemAccounts
																												.balance
																												.balance,
																									);
																									CalcluateTotalSum3(
																										itemAccounts.balance &&
																											itemAccounts
																												.balance
																												.balance,
																									);
																								}
																								if (
																									itemAccounts.balance !==
																									null
																								)
																									if (
																										itemAccounts
																											.balance
																											.balance !==
																										0
																									)
																										return (
																											<div className='border-bottom p-1 '
																												key={
																													itemAccounts.id
																												}
																												style={{
																													marginLeft:
																														'1rem',
																												}}>
																												<div className='row g-4'>
																													<h5
																														style={{
																															fontSize: 12,
																														}}
																														className='px-2 col-6'>
																														{
																															itemAccounts.code
																														}

																														-
																														{
																															itemAccounts.name
																														}
																													</h5>
																													<h5
																														style={{
																															fontSize: 12,
																														}}
																														className='d-flex justify-content-end col-6'>
																														{itemAccounts.balance !==
																															null &&
																															(itemAccounts
																																.balance
																																.balance <=
																															0
																																? Math.abs(
																																		itemAccounts
																																			.balance
																																			.balance,
																																  ).toLocaleString(
																																		undefined,
																																		{
																																			maximumFractionDigits: 2,
																																		},
																																  )
																																: `(${itemAccounts.balance.balance.toLocaleString(
																																		undefined,
																																		{
																																			maximumFractionDigits: 2,
																																		},
																																  )})`)}
																													</h5>
																												</div>
																											</div>
																										);
																								return null;
																							},
																						)}
																					{/* ******* Level 3 Account End ******************************************** */}
																					<div className='border-bottom border-2 row g-4'>
																						<h4
																							style={{
																								fontSize: 14,
																							}}
																							className='px-2 col-6'>
																							Total
																							{` ${itemSubGroups.code}`}
																							-
																							{
																								itemSubGroups.name
																							}
																						</h4>
																						<h4
																							style={{
																								fontSize: 14,
																							}}
																							className='d-flex justify-content-end col-6'>
																							{sum3 !==
																							null
																								? sum3 <=
																								  0
																									? Math.abs(
																											sum3,
																									  ).toLocaleString(
																											undefined,
																											{
																												maximumFractionDigits: 2,
																											},
																									  )
																									: `(${sum3.toLocaleString(
																											undefined,
																											{
																												maximumFractionDigits: 2,
																											},
																									  )})`
																								: 0}
																						</h4>
																					</div>
																				</div>
																			);
																		},
																	)}
																{/* ******* Level 2 Account Ends ******************************************** */}

																<div className='border-bottom border-2 row g-4'>
																	<h3
																		style={{
																			fontSize: 16,
																		}}
																		className='px-2 col-6'>
																		Total {item.code}-
																		{item.name}
																	</h3>
																	<h3
																		style={{
																			fontSize: 16,
																		}}
																		className='d-flex justify-content-end col-6'>
																		{sum2 !== null
																			? sum2 <= 0
																				? Math.abs(
																						sum2,
																				  ).toLocaleString(
																						undefined,
																						{
																							maximumFractionDigits: 2,
																						},
																				  )
																				: `(${sum2.toLocaleString(
																						undefined,
																						{
																							maximumFractionDigits: 2,
																						},
																				  )})`
																			: 0}
																	</h3>
																</div>
															</div>
														);
													},
												)}
											{/* ******* Level 1 Account Ends ******************************************** */}

											<div className='row g-4'>
												<h2 style={{ fontSize: 18 }} className='px-2 col-6'>
													Total Liabilities
												</h2>
												<h2
													style={{ fontSize: 18 }}
													className='d-flex justify-content-end col-6'>
													{totalLiabilities !== null
														? totalLiabilities <= 0
															? Math.abs(
																	totalLiabilities,
															  ).toLocaleString(undefined, {
																	maximumFractionDigits: 2,
															  })
															: `(${totalLiabilities.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )})`
														: 0}
												</h2>
											</div>
											<hr />
										</div>
										<div className='row'>
											<h2 style={{ fontSize: 18 }}>Capital</h2>
											{/* ******* Level 1 Account Start ******************************************** */}
											{balanceSheetDefault.capital &&
												balanceSheetDefault.capital.map((item, index) => {
													sum2 = 0;
													return (
														<div className='border-bottom border-2'
															key={item.id}
															style={{
																marginLeft: '1rem',
															}}>
															<h3
																style={{
																	fontSize: 16,
																}}>
																{item.code}-{item.name}
															</h3>
															{/* ******* Level 2 Account Start ******************************************** */}
															{item.coa_sub_groups &&
																item.coa_sub_groups.map(
																	(
																		itemSubGroups,
																		indexSubGroups,
																	) => {
																		sum3 = 0;

																		return (
																			<div className='border-bottom border-2'
																				key={
																					itemSubGroups.id
																				}
																				style={{
																					marginLeft:
																						'1rem',
																				}}>
																				<h4
																					style={{
																						fontSize: 14,
																					}}>
																					{
																						itemSubGroups.code
																					}
																					-
																					{
																						itemSubGroups.name
																					}
																				</h4>
																				{/* ******* Level 3 Account Start ******************************************** */}
																				{itemSubGroups.coa_accounts &&
																					itemSubGroups.coa_accounts.sort((a, b) =>
													a.name.localeCompare(b.name)
																					).map(
																						(
																							itemAccounts,
																							indexAccounts,
																						) => {
																							if (
																								itemAccounts.balance !==
																								null
																							) {
																								CalcluateTotalCapital(
																									itemAccounts.balance &&
																										itemAccounts
																											.balance
																											.balance,
																								);
																								CalcluateTotalSum2(
																									itemAccounts.balance &&
																										itemAccounts
																											.balance
																											.balance,
																								);
																								CalcluateTotalSum3(
																									itemAccounts.balance &&
																										itemAccounts
																											.balance
																											.balance,
																								);
																							}
																							if (
																								itemAccounts.balance !==
																								null
																							)
																								if (
																									itemAccounts
																										.balance
																										.balance !==
																									0
																								)
																									return (
																										<div className='border-bottom border-2'
																											key={
																												itemAccounts.id
																											}
																											style={{
																												marginLeft:
																													'1rem',
																											}}>
																											<div className='border-bottom border-2 row g-4'>
																												<h5
																													style={{
																														fontSize: 12,
																													}}
																													className='px-2 col-6'>
																													{
																														itemAccounts.code
																													}

																													-
																													{
																														itemAccounts.name
																													}
																												</h5>
																												<h5
																													style={{
																														fontSize: 12,
																													}}
																													className='d-flex justify-content-end col-6'>
																													{itemAccounts.balance !==
																														null &&
																														(itemAccounts
																															.balance
																															.balance <=
																														0
																															? Math.abs(
																																	itemAccounts
																																		.balance
																																		.balance,
																															  ).toLocaleString(
																																	undefined,
																																	{
																																		maximumFractionDigits: 2,
																																	},
																															  )
																															: `(${itemAccounts.balance.balance.toLocaleString(
																																	undefined,
																																	{
																																		maximumFractionDigits: 2,
																																	},
																															  )})`)}
																												</h5>
																											</div>
																										</div>
																									);
																							return null;
																						},
																					)}
																				{/* ******* Level 3 Account End ******************************************** */}
																				<div className='border-bottom border-2 row g-4'>
																					<h4
																						style={{
																							fontSize: 14,
																						}}
																						className='px-2 col-6'>
																						Total
																						{` ${itemSubGroups.code}`}
																						-
																						{
																							itemSubGroups.name
																						}
																					</h4>
																					<h4
																						style={{
																							fontSize: 14,
																						}}
																						className='d-flex justify-content-end col-6'>
																						{sum3 !==
																						null
																							? sum3 <=
																							  0
																								? Math.abs(
																										sum3,
																								  ).toLocaleString(
																										undefined,
																										{
																											maximumFractionDigits: 2,
																										},
																								  )
																								: `(${sum3.toLocaleString(
																										undefined,
																										{
																											maximumFractionDigits: 2,
																										},
																								  )})`
																							: 0}
																					</h4>
																				</div>
																			</div>
																		);
																	},
																)}
															{/* ******* Level 2 Account Ends ******************************************** */}

															<div className='border-bottom border-2 row g-4'>
																<h3
																	style={{
																		fontSize: 16,
																	}}
																	className='px-2 col-6'>
																	Total {item.code}-{item.name}
																</h3>
																<h3
																	style={{
																		fontSize: 16,
																	}}
																	className='d-flex justify-content-end col-6'>
																	{sum2 !== null
																		? sum2 <= 0
																			? Math.abs(
																					sum2,
																			  ).toLocaleString(
																					undefined,
																					{
																						maximumFractionDigits: 2,
																					},
																			  )
																			: `(${sum2.toLocaleString(
																					undefined,
																					{
																						maximumFractionDigits: 2,
																					},
																			  )})`
																		: 0}
																</h3>
															</div>
														</div>
													);
												})}
											{/* ******* Level 1 Account Ends ******************************************** */}
											<div 
												key={balanceSheetDefault.revExp}
												style={{
													marginLeft: '1rem',
												}}>
												<div className='row g-4'>
													<h4
														style={{
															fontSize: 14,
														}}
														className='px-2 col-6'>
														Net Income
													</h4>
													<h4
														style={{
															fontSize: 14,
														}}
														className='d-flex justify-content-end col-6'>
														{balanceSheetDefault.revExp > 0
															? `(${balanceSheetDefault.revExp.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )})`
															: balanceSheetDefault.revExp.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )}
													</h4>
												</div>
											</div>
											<div className='row g-4'>
												<h2 style={{ fontSize: 18 }} className='px-2 col-6'>
													Total Capital
												</h2>
												<h2
													style={{ fontSize: 18 }}
													className='d-flex justify-content-end col-6'>
													{totalCapital +
														parseFloat(balanceSheetDefault.revExp) !==
													null
														? totalCapital +
																parseFloat(
																	balanceSheetDefault.revExp,
																) <=
														  0
															? Math.abs(
																	totalCapital +
																		parseFloat(
																			balanceSheetDefault.revExp,
																		),
															  )
															: `(${
																	totalCapital +
																	parseFloat(
																		balanceSheetDefault.revExp,
																	)
															  })`
														: 0}
												</h2>
											</div>
											<div className='border-bottom border-2 row g-4'>
												<h2 style={{ fontSize: 18 }} className='px-2 col-6'>
													Total Liabilities and Capital
												</h2>
												<h2
													style={{ fontSize: 18 }}
													className='d-flex justify-content-end col-6'>
													{totalCapital +
														parseFloat(balanceSheetDefault.revExp) +
														totalLiabilities !==
													null
														? totalCapital +
																parseFloat(
																	balanceSheetDefault.revExp,
																) +
																totalLiabilities <=
														  0
															? Math.abs(
																	totalCapital +
																		parseFloat(
																			balanceSheetDefault.revExp,
																		) +
																		totalLiabilities,
															  ).toLocaleString(undefined, {
																	maximumFractionDigits: 2,
															  })
															: `(${(
																	totalCapital +
																	parseFloat(
																		balanceSheetDefault.revExp,
																	) +
																	totalLiabilities
															  ).toLocaleString(undefined, {
																	maximumFractionDigits: 2,
															  })})`
														: 0}
												</h2>
											</div>
											<hr />
										</div>
									</CardBody>
								</Card>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default DashboardPage;
