// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';

import classNames from 'classnames';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import showNotification from '../../../../components/extras/showNotification';
// ** apiClient Imports

import apiClient from '../../../../baseURL/apiClient';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, { dataPagination } from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';
import EditLoan from './editLoan';

const SubGroups = (props) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [personData, setPersonData] = useState('');
	const [perPage, setPerPage] = useState(10);

	const { items, requestSort, getClassNamesFor } = useSortableData(props.tableRecords);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	// Edit/Update/Delete

	const handleStateEdit = (status) => {
		setStateEdit(status);
	};

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [sizeStatusEdit, setSizeStatusEdit] = useState(null);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setSizeStatusEdit('xl');
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const [editingLoanId, setEditingLoanId] = useState('');

	const [editingLoanData, setEditingLoanData] = useState([]);
	const [editingLoanDataLoading, setEditingLoanDataLoading] = useState(false);

	const getEditingLoan = (id) => {
		setEditingLoanDataLoading(true);
		setEditingLoanDataLoading(false);
		apiClient
			.get(`/getPersonAllAccounts?person_id=${id}`)
			.then((response) => {
				setEditingLoanData(response.data);
				// setRefreshLoans(refreshLoans + 1);
				setEditingLoanDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	return (
		<>
			<CardBody>
				<div className='table-responsive'>
					<table className='table table-striped table-bordered table-hover'>
						<thead className='table-light'>
							<tr>
								<th
									style={{
										width: 50,
									}}>
									{SelectAllCheck}
								</th>

								<th>ID</th>
								<th>Person</th>
								<th>Roles</th>
								<th
									onClick={() => requestSort('receiveable_balance')}
									className='cursor-pointer text-decoration-underline'>
									Account Receivable
									<Icon
										size='lg'
										className={getClassNamesFor('receiveable_balance')}
										icon='FilterList'
									/>
								</th>
								<th
									onClick={() => requestSort('payable_balance.balance')}
									className='cursor-pointer text-decoration-underline'>
									Account Payable
									<Icon
										size='lg'
										className={getClassNamesFor('payable_balance.balance')}
										icon='FilterList'
									/>
								</th>
								<th>Balance</th>

								<th className='cursor-pointer text-decoration-underline'>
									Actions{' '}
									<Icon
										size='lg'
										className={getClassNamesFor('Actions')}
										icon='FilterList'
									/>
								</th>
							</tr>
						</thead>
						{props.tableRecordsLoading ? (
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
								{onCurrentPageData.map((item) => (
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

										{/* <td>
										<div className='d-flex align-items-center'>
											<span
												className={classNames(
													'badge',
													'border border-2',
													[`border-${themeStatus}`],
													'rounded-circle',
													'bg-success',
													'p-2 me-2',
													`bg-${
														item.isActive === 0 ? `danger` : `success`
													}`,
												)}>
												<span className='visually-hidden'>
													{item.isActive}
												</span>
											</span>
										</div>
									</td> */}
										<td> {item.id}</td>
										<td> {item.name}</td>
										<td>
											{item.people_person_type &&
												item.people_person_type.map((item2) => (
													<>
														<br />
														<p>{item2.person_type.type}</p>
													</>
												))}
										</td>
										<td>
											{item.receiveable_balance !== null
												? parseFloat(
														item.receiveable_balance.reduce(
															// eslint-disable-next-line no-return-assign
															(a, v) =>
																(a += parseFloat(
																	v !== undefined ? v.balance : 0,
																)),
															0,
														),
												  ).toLocaleString(undefined, {
														maximumFractionDigits: 2,
												  })
												: 0}
										</td>
										<td>
											{' '}
											{item.payable_balance !== null
												? parseFloat(
														item.payable_balance.reduce(
															// eslint-disable-next-line no-return-assign
															(a, v) =>
																(a += parseFloat(
																	v !== undefined ? v.balance : 0,
																)),
															0,
														),
												  ).toLocaleString(undefined, {
														maximumFractionDigits: 2,
												  })
												: 0}
										</td>
										<td>
											{(
												(item.payable_balance
													? parseFloat(
															item.payable_balance.reduce(
																// eslint-disable-next-line no-return-assign
																(a, v) =>
																	(a += parseFloat(
																		v !== undefined
																			? v.balance
																			: 0,
																	)),
																0,
															),
													  )
													: 0) +
												(item.receiveable_balance
													? parseFloat(
															item.receiveable_balance.reduce(
																// eslint-disable-next-line no-return-assign
																(a, v) =>
																	(a += parseFloat(
																		v !== undefined
																			? v.balance
																			: 0,
																	)),
																0,
															),
													  )
													: 0)
											).toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</td>

										<td>
											<ButtonGroup>
												<Button
													isOutline
													color='primary'
													// isLight={darkModeStatus}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Edit'
													onClick={() => {
														setEditingLoanId(item.id);
														setPersonData({
															id: item.id,
															name: item.name,
														});
														getEditingLoan(item.id);

														initialStatusEdit();

														setStateEdit(true);
														setStaticBackdropStatusEdit(true);
													}}>
													Details
												</Button>

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
													<DropdownItem isHeader>Actions</DropdownItem>

													{Cookies.get('role_id1') === '1'   && (
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
																onClick={() => {
																	toggleStatus(item.id);
																}}>
																{item.isActive === 0
																	? `Activate`
																	: `Deactivate`}
															</Button>
														</DropdownItem>
													)}
												</DropdownMenu>
											</Dropdown> */}
											</ButtonGroup>
										</td>
									</tr>
								))}
							</tbody>
						)}
					</table>
				</div>
			</CardBody>
			<PaginationButtons
				data={items}
				label='items'
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				perPage={perPage}
				setPerPage={setPerPage}
			/>

			<Modal
				isOpen={stateEdit}
				setIsOpen={setStateEdit}
				titleId='EditVoucher'
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				size={sizeStatusEdit}
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>
									Person Accounts Details: {personData.name} <br />
									<small> Person Id: {personData.id}</small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								{editingLoanDataLoading ? (
									<div className='d-flex justify-content-center'>
										<Spinner color='primary' size='5rem' />
									</div>
								) : (
									<EditLoan
										editingLoanData={editingLoanData}
										handleStateEdit={handleStateEdit}
										refreshTableRecords={props.refreshTableRecords}
										editingLoanId={editingLoanId}
									/>
								)}

								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateEdit(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
			</Modal>
		</>
	);
};

export default SubGroups;
