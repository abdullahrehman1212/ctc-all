// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import Cookies from 'js-cookie';
import classNames from 'classnames';
import moment from 'moment';
import 'flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
import Select from '../../../../../components/bootstrap/forms/Select';

import Spinner from '../../../../../components/bootstrap/Spinner';
import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';

import SubHeader, { SubHeaderLeft } from '../../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../../layout/Page/Page';
import PageWrapper from '../../../../../layout/PageWrapper/PageWrapper';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../../components/bootstrap/Modal';
import { _titleError, _titleSuccess } from '../../../../../baseURL/messages';

import Button, { ButtonGroup } from '../../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardCodeView,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../../../../components/bootstrap/Card';
import GeneratePDFSalarySlip from '../print2/salarySlip';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../../components/bootstrap/Dropdown';
import showNotification from '../../../../../components/extras/showNotification';
import apiClient from '../../../../../baseURL/apiClient';
import useSortableData from '../../../../../hooks/useSortableData';
import PaginationButtons, { dataPagination } from '../../../../../components/PaginationButtons';
import useSelectTable from '../../../../../hooks/useSelectTable';
import Checks from '../../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../../components/icon/Icon';
import { componentsMenu } from '../../../../../menu';
import useDarkMode from '../../../../../hooks/useDarkMode';
import GeneratePDFPayroll from '../print2/payroll';
import GeneratePDFBankRequest from '../print2/BankRequest';
import EditPayroll from './editPayroll';

// import EditEmployee from './editEmployee';
require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const SubGroups = (props) => {
	const [refreshSubgroups, setRefreshSubgroups] = useState(0);
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const { items, requestSort, getClassNamesFor } = useSortableData(props.tableRecords);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);

	const toggleStatus = (id) => {
		apiClient
			.get(`/makeEmployeeActiveOrInactive?employee_id=${id}`)
			.then((response) => {
				showNotification(
					'Employee activated',
					'Employee activated Successfully',
					'success',
				);
				props.refreshTableRecords();
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	// Edit/Update/Delete

	const [stateDelete, setStateDelete] = useState(false);

	const handleStateDelete = (status) => {
		setStateDelete(status);
	};
	const handleStateEdit = (status) => {
		setStateEdit(status);
	};

	const [staticBackdropStatusDelete, setStaticBackdropStatusDelete] = useState(false);
	const [scrollableStatusDelete, setScrollableStatusDelete] = useState(false);
	const [centeredStatusDelete, setCenteredStatusDelete] = useState(false);
	const [sizeStatusDelete, setSizeStatusDelete] = useState(null);
	const [fullScreenStatusDelete, setFullScreenStatusDelete] = useState(null);
	const [animationStatusDelete, setAnimationStatusDelete] = useState(true);

	const [headerCloseStatusDelete, setHeaderCloseStatusDelete] = useState(true);

	const initialStatusDelete = () => {
		setStaticBackdropStatusDelete(false);
		setScrollableStatusDelete(false);
		setCenteredStatusDelete(false);
		setSizeStatusDelete('md');
		setFullScreenStatusDelete(null);
		setAnimationStatusDelete(true);
		setHeaderCloseStatusDelete(true);
	};

	const [deletingEmployeeId, setDeletingEmployeeId] = useState('');
	const [deletingEmployeeName, setDeletingEmployeeName] = useState('');

	const deleteEmployee = (id) => {
		apiClient
			.post(`/deleteSalarySlip?salary_slip_id=${id}`, {}, {})

			.then((res) => {
				setIsLoading(false);

				showNotification(_titleSuccess, res.data.message, 'success');

				props.refreshTableRecords();
				handleStateDelete(false);
			});
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

	const [editingEmployeeData, setEditingEmployeeData] = useState([]);
	const [editingEmployeeDataLoading, setEditingEmployeeDataLoading] = useState(false);

	const getEditingEmployee = (id) => {
		setEditingEmployeeDataLoading(true);
		apiClient
			.get(`/editSalarySlip?salary_slip_id=${id}`)
			.then((response) => {
				setEditingEmployeeData(response.data.data);

				// setRefreshSubgroups(refreshSubgroups + 1);
				setEditingEmployeeDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	const printSalarySlip = (data, date, docType) => {
		GeneratePDFSalarySlip(data, date, 'Approved', docType);
	};
	const printPayroll = (date, docType) => {
		setIsPrintAllReportLoading(true);

		console.log('tableRecords', props.tableRecords);
		GeneratePDFPayroll(props.tableRecords, date, 'Approved', docType);
		setIsPrintAllReportLoading(false);
	};
	const printSalarySlipAll = (date, docType) => {
		setIsPrintAllReportLoading(true);

		GeneratePDFSalarySlip(props.tableRecords, date, 'Approved', docType);
		setIsPrintAllReportLoading(false);
	};

	const printBankRequest = (date, accountNo, chequeNo, docType) => {
		GeneratePDFBankRequest(props.tableRecords, date, 'Approved', accountNo, chequeNo, docType);
	};
	return (
		<>
			<CardBody>
				<FormGroup
					className='d-flex flex-column-auto align-items-end justify-content-end'
					label=''>
					<Button
						color='primary'
						// isLight={darkModeStatus}
						className={classNames('text-nowrap mt-4', {
							'border-light': true,
						})}
						icon={!isPrintAllReportLoading && 'FilePdfFill'}
						isDisable={isPrintAllReportLoading}
						onClick={() => printPayroll(props.dateForPayroll2, 2)}>
						{isPrintAllReportLoading && <Spinner isSmall inButton />}
						{isPrintAllReportLoading ? 'Generating PDF...' : 'View PayRoll PDF '}
					</Button>
					<Button
						color='primary'
						// isLight={darkModeStatus}
						className={classNames('text-nowrap mt-4', {
							'border-light': true,
						})}
						icon={!isPrintAllReportLoading && 'FilePdfFill'}
						isDisable={isPrintAllReportLoading}
						onClick={() => printSalarySlipAll(props.dateForPayroll2, 2)}>
						{isPrintAllReportLoading && <Spinner isSmall inButton />}
						{isPrintAllReportLoading ? 'Generating PDF...' : 'View Salary Slip PDF'}
					</Button>
				</FormGroup>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th
								style={{
									width: 50,
								}}>
								{SelectAllCheck}
							</th>

							<th>ID</th>
							<th>Name</th>
							<th>Basic Salary</th>
							<th>Leaves</th>
							<th>Absentees</th>
							<th>Working Days</th>
							<th>Total Amount</th>
							<th>Date</th>

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
									<td>
										{' '}
										{item.employee.name}
										<br />
										<small>{item.voucher_transaction.voucher.voucher_no}</small>
									</td>
									<td>
										{' '}
										{item.basic_salary.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
									<td> {item.leaves}</td>
									<td> {item.absentees}</td>
									<td> {item.working_days}</td>
									<td>
										{' '}
										{item.total_payable.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
									<td> {moment(item.date).format('DD-MM-YYYY')}</td>

									<td>
										<ButtonGroup>
											{Cookies.get('roleId') === '1' && (
												<>
													<Button
														isOutline
														color='primary'
														isDisable={item.isApproved === 1}
														// isLight={darkModeStatus}
														className={classNames('text-nowrap', {
															'border-light': true,
														})}
														icon='Edit'
														onClick={() => {
															getEditingEmployee(item.id);
															setDeletingEmployeeId(item.id);
															setDeletingEmployeeName(
																item.employee.name,
															);

															initialStatusEdit();

															setStateEdit(true);
															setStaticBackdropStatusEdit(true);
														}}>
														Edit
													</Button>
													<Button
														isOutline
														color='primary'
														isDisable={item.isApproved === 1}
														// isLight={darkModeStatus}
														className={classNames('text-nowrap', {
															'border-light': true,
														})}
														icon='Delete'
														onClick={() => {
															setDeletingEmployeeId(item.id);
															setDeletingEmployeeName(
																item.employee.name,
															);

															initialStatusDelete();

															setStateDelete(true);
															setStaticBackdropStatusDelete(false);
														}}>
														Delete
													</Button>
												</>
											)}
											{Cookies.get('roleId') !== '1' &&
												item.voucher_transaction.voucher.isApproved ===
													0 && (
													<>
														<Button
															isOutline
															color='primary'
															isDisable={item.isApproved === 1}
															// isLight={darkModeStatus}
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Edit'
															onClick={() => {
																getEditingEmployee(item.id);
																setDeletingEmployeeId(item.id);
																setDeletingEmployeeName(
																	item.employee.name,
																);

																initialStatusEdit();

																setStateEdit(true);
																setStaticBackdropStatusEdit(true);
															}}>
															Edit
														</Button>
														<Button
															isOutline
															color='primary'
															isDisable={item.isApproved === 1}
															// isLight={darkModeStatus}
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Delete'
															onClick={() => {
																setDeletingEmployeeId(item.id);
																setDeletingEmployeeName(
																	item.employee.name,
																);

																initialStatusDelete();

																setStateDelete(true);
																setStaticBackdropStatusDelete(
																	false,
																);
															}}>
															Delete
														</Button>
													</>
												)}
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
													<DropdownItem isHeader>Actions</DropdownItem>

													<DropdownItem>
														<Button
															isOutline
															color='primary'
															// isLight={darkModeStatus}
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Preview'
															onClick={() =>
																printSalarySlip(
																	[item],
																	props.dateForPayroll2,
																	2,
																)
															}>
															View Salary Slip PDF
														</Button>
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
										</ButtonGroup>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
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
				isOpen={stateDelete}
				setIsOpen={setStateDelete}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusDelete}
				isScrollable={scrollableStatusDelete}
				isCentered={centeredStatusDelete}
				size={sizeStatusDelete}
				fullScreen={fullScreenStatusDelete}
				isAnimation={animationStatusDelete}>
				<ModalHeader setIsOpen={headerCloseStatusDelete ? setStateDelete : null}>
					<ModalTitle id='deltefile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Delete' iconColor='info'>
								Payroll Deletion Confirmation
								<br /> Employee Name: {deletingEmployeeName}
								<small> Employee ID: {deletingEmployeeId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								<CardBody>
									Are you sure you want to delete Payroll? <br />
									Employee ID: {deletingEmployeeId}
									<br />
									Employee Name: {deletingEmployeeName} <br />
									This cannot be undone!
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateDelete(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon='delete'
											color='danger'
											onClick={() => deleteEmployee(deletingEmployeeId)}>
											Yes, Delete!
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				<ModalFooter />
			</Modal>
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
									Editing Payroll: {deletingEmployeeName} <br />
									Employee ID: {deletingEmployeeId}
									<br />
									<small> Payroll Id: {editingEmployeeData?.id}</small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								{editingEmployeeDataLoading ? (
									<div className='d-flex justify-content-center'>
										<Spinner color='primary' size='5rem' />
									</div>
								) : (
									<EditPayroll
										editingPayrollData={editingEmployeeData}
										handleStateEdit={handleStateEdit}
										refreshTableRecords={props.refreshTableRecords}
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
