// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import classNames from 'classnames';
import { componentsMenu } from '../../../../menu';
import Spinner from '../../../../components/bootstrap/Spinner';

import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import GeneratePDF from './print/printGeneralJournal';
import Card, {
	CardActions,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';

import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
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

import showNotification from '../../../../components/extras/showNotification';

import Select from '../../../../components/bootstrap/forms/Select';

export const _selectOptions = [
	{ value: 1, text: 'Voucher No' },
	// { value: 2, text: 'Mutation No' },
	// { value: 3, text: 'Khasra No' },
];

const DashboardPage = (props) => {
	const [searchNo, setSearchNo] = useState('');

	const [searchBy, setSearchBy] = useState('1');
	const [startDate, setStartDate] = useState(moment().startOf('month').format('DD/MM/YY'));
	const [startDate2, setStartDate2] = useState(moment().startOf('month'));
	const [endDate, setEndDate] = useState(moment().format('DD/MM/YY'));
	const [endDate2, setEndDate2] = useState(moment());

	let count = 0;

	const [drTotal, setDrTotal] = useState(0);
	const [crTotal, setCrTotal] = useState(0);

	useEffect(() => {
		setGeneralJournalLoading(true);

		// eslint-disable-next-line react/destructuring-assignment, react/prop-types
		setGeneralJournal(props.generalJournalDefault);
		let cr = 0;
		let dr = 0;
		// eslint-disable-next-line react/destructuring-assignment, react/prop-types
		const calc = props.generalJournalDefault.forEach((item, index) => {
			dr += item.debit;
			cr += item.credit;
		});
		console.log('default');
		console.log('dr', dr);
		console.log('cr', cr);
		setCrTotal(parseFloat(Math.abs(cr)));
		setDrTotal(parseFloat(Math.abs(dr)));
		setGeneralJournalLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		setGeneralJournalLoading(true);
		const getAllEntries = () => {
			apiClient
				.get(`/getGeneralJournal?from=${startDate}&to=${endDate}`)
				.then((response) => {
					setGeneralJournal(response.data.data);
					let cr = 0;
					let dr = 0;
					const calc = response.data.data.forEach((item, index) => {
						dr += item.debit;
						cr += item.credit;
					});
					console.log('2');
					console.log('dr', dr);
					console.log('cr', cr);
					setCrTotal(parseFloat(Math.abs(cr)));
					setDrTotal(parseFloat(Math.abs(dr)));
					setGeneralJournalLoading(false);
				})
				.catch((err) => console.log(err));
		};

		if (searchBy === '1') {
			getAllEntries();
			// getLandsbyFileNo();
		} else if (searchBy === '2') {
			// getLandsbyMutationNo();
		} else if (searchBy === '3') {
			// getLandsbyKhasraNo();
		}
	}, [endDate, searchBy, startDate]);

	const searchFilterTrigger = () => {
		setGeneralJournalLoading(true);

		apiClient
			.get(`/getGeneralJournal?voucher_no=${searchNo}`)
			.then((response) => {
				setGeneralJournal(response.data.data);
				let cr = 0;
				let dr = 0;
				const calc = response.data.data.forEach((item, index) => {
					dr += item.debit;
					cr += item.credit;
				});
				console.log('3');
				console.log('dr', dr);
				console.log('cr', cr);
				setCrTotal(parseFloat(Math.abs(cr)));
				setDrTotal(parseFloat(Math.abs(dr)));
				setGeneralJournalLoading(false);
			})
			.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [generalJournal, setGeneralJournal] = useState([]);
	const [generalJournalLoading, setGeneralJournalLoading] = useState(true);
	const [printreport, setPrintreport] = useState([]);

	// const { items, requestSort, getClassNamesFor } = useSortableData(generalJournal);
	const { items, requestSort, getClassNamesFor } = useSortableData(generalJournal);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const print = (docType) => {
		try {
			console.log('::::::***', generalJournal);
			GeneratePDF(generalJournal, docType, startDate2, endDate2);
		} catch (e) {
			console.log('Error');
			showNotification('Error', e, 'danger');
		}

		showNotification(
			'Generating General Journal',
			'Generating General Journal Successfully',
			'success',
		);
	};
	return (
		<>
			<CardHeader className='px-0 pt-0'>
				<CardLabel icon='Engineering' iconColor='danger'>
					<CardTitle>General Journal</CardTitle>
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
										View General Journal
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
					<div className='row g-4'>
						<div className='col-md-2'>
							<Select
								ariaLabel='Default select example'
								placeholder='Open this select menu'
								onChange={(e) => {
									setSearchBy(e.target.value);
								}}
								value={searchBy}
								list={_selectOptions}
							/>
						</div>
						<div className='col-md-3'>
							<Input
								id='searchFileNo'
								type='number'
								min='0'
								onWheel={(e) => e.target.blur()}
								onChange={(e) => {
									setSearchNo(e.target.value);
								}}
								value={searchNo}
								validFeedback='Looks good!'
							/>
						</div>

						<div className='col-auto'>
							<Button
								color='primary'
								onClick={() => searchFilterTrigger()}
								isOutline
								isDisable={generalJournalLoading}
								isActive>
								Search
							</Button>
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
										T id{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('firstName')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('voucher_id')}
										className='cursor-pointer text-decoration-underline'>
										voucher no{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('voucher_id')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('Date')}
										className='cursor-pointer text-decoration-underline'>
										Date{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('Date')}
											icon='FilterList'
										/>
									</th>

									<th
										onClick={() => requestSort('file_no')}
										className='cursor-pointer text-decoration-underline'>
										Account{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('file_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('file_no')}
										className='cursor-pointer text-decoration-underline'>
										Description{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('file_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('file_no')}
										className='cursor-pointer text-decoration-underline'>
										Debit{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('file_no')}
											icon='FilterList'
										/>
									</th>
									<th
										onClick={() => requestSort('file_no')}
										className='cursor-pointer text-decoration-underline'>
										Credit{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('file_no')}
											icon='FilterList'
										/>
									</th>
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

									{/* <th className='cursor-pointer text-decoration-underline'>
										Actions{' '}
										<Icon
											size='lg'
											className={getClassNamesFor('Actions')}
											icon='FilterList'
										/>
									</th> */}
								</tr>
							</thead>
							{generalJournalLoading ? (
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
									{onCurrentPageData.map((item, index) => {
										count += 1;
										// if (item.debit !== null) {
										// 	CalcluateTotalDr(item.debit);
										// }
										// if (item.credit !== null) {
										// 	CalcluateTotalCr(item.credit);
										// }
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

												<td>
													{item?.coa_account?.code}-
													{item?.coa_account?.name}
												</td>
												<td>{item.description}</td>
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
												{/* <td>{item.balance}</td> */}

												{/* <td>
													<ButtonGroup>
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
																<DropdownItem isHeader>
																	Actions
																</DropdownItem>
																<DropdownItem>
																	<Button
																		isOutline
																		color='primary'
																		// isLight={darkModeStatus}
																		className={classNames(
																			'text-nowrap',
																			{
																				'border-light': true,
																			},
																		)}
																		icon='Preview'
																		// onClick={handleUpcomingEdit}
																	>
																		View
																	</Button>
																</DropdownItem>
																<DropdownItem>
																	<Button
																		isOutline
																		color='primary'
																		// isLight={darkModeStatus}
																		className={classNames(
																			'text-nowrap',
																			{
																				'border-light': true,
																			},
																		)}
																		icon='Print'
																		// onClick={() => printReportI(item.id)}
																	>
																		Print
																	</Button>
																</DropdownItem>
															</DropdownMenu>
														</Dropdown>
													</ButtonGroup>
												</td> */}
											</tr>
										);
									})}
									<tr>
										<td />
										<td />
										<td />
										<td />
										<td />

										<td>
											<h3 className='d-flex justify-content-end px-4'>
												Total
											</h3>
										</td>
										<td>
											<h3 className='px-0'>
												{drTotal.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</h3>
										</td>
										<td>
											<h3 className='px-0'>
												{crTotal.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												})}
											</h3>
										</td>
									</tr>
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
		</>
	);
};

export default DashboardPage;
