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
import Spinner from '../../../../components/bootstrap/Spinner';
import SubHeader, { SubHeaderLeft } from '../../../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../../../components/bootstrap/Breadcrumb';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardCodeView,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTabItem,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import showNotification from '../../../../components/extras/showNotification';
import apiClient from '../../../../baseURL/apiClient';
import useSortableData from '../../../../hooks/useSortableData';
import PaginationButtons, { dataPagination } from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Icon from '../../../../components/icon/Icon';
import { componentsMenu } from '../../../../menu';
import useDarkMode from '../../../../hooks/useDarkMode';
import EditEmployee from './editEmployee';

const SubGroups = (props) => {
	const [refreshSubgroups, setRefreshSubgroups] = useState(0);
	const { themeStatus, darkModeStatus } = useDarkMode();
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);

	const { items, requestSort, getClassNamesFor } = useSortableData(props.tableRecords);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

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
			.get(`/deleteEmployee?employee_id=${id}`)
			.then((response) => {
				showNotification('Success', response.message, 'success');

				setStateDelete(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(false);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [sizeStatusEdit, setSizeStatusEdit] = useState(null);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(false);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setSizeStatusEdit('xl');
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const [editingEmployeeData, setEditingEmployeeData] = useState([]);
	const [editingEmployeeName, setEditingEmployeeName] = useState([]);
	const [editingEmployeeId, setEditingEmployeeId] = useState([]);
	const [editingEmployeeDataLoading, setEditingEmployeeDataLoading] = useState(false);

	const getEditingEmployee = (id) => {
		setEditingEmployeeDataLoading(true);
		apiClient
			.get(`/editEmployee?employee_id=${id}`)
			.then((response) => {
				setEditingEmployeeData(response.data.employee);
				// setRefreshSubgroups(refreshSubgroups + 1);
				setEditingEmployeeDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};

	const approveEmployee = (id) => {
		apiClient
			.get(`/approveEmployee?employee_id=${id}`)
			.then((response) => {
				showNotification('Success', response.data.message, 'success');
				props.refreshTableRecords();
			})
			.catch((err) => {
				console.log(err);
				showNotification('Error', err.message, 'danger');
			});
	};
	return (
		<>
			<CardBody>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th
								style={{
									width: 50,
								}}>
								{SelectAllCheck}
							</th>
							<th
								onClick={() => requestSort('id')}
								className='cursor-pointer text-decoration-underline'>
								ID
								<Icon
									size='lg'
									className={getClassNamesFor('Serial_No')}
									icon='FilterList'
								/>
							</th>

							<th
								onClick={() => requestSort('name')}
								className='cursor-pointer text-decoration-underline'>
								Name{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('name')}
									icon='FilterList'
								/>
							</th>
							<th
								onClick={() => requestSort('name')}
								className='cursor-pointer text-decoration-underline'>
								Contact{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('name')}
									icon='FilterList'
								/>
							</th>
							<th
								onClick={() => requestSort('name')}
								className='cursor-pointer text-decoration-underline'>
								Department{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('name')}
									icon='FilterList'
								/>
							</th>
							<th
								onClick={() => requestSort('name')}
								className='cursor-pointer text-decoration-underline'>
								Designation{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('name')}
									icon='FilterList'
								/>
							</th>
							<th
								onClick={() => requestSort('name')}
								className='cursor-pointer text-decoration-underline'>
								Type{' '}
								<Icon
									size='lg'
									className={getClassNamesFor('name')}
									icon='FilterList'
								/>
							</th>
							<th>Status</th>

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
									<td>
										{' '}
										<div className='d-flex align-items-center'>
											<span
												className={classNames(
													'badge',
													'border border-2',
													[`border`],
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
											<span className='text-nowrap'>{item.id}</span>
										</div>
									</td>
									<td> {item?.name}</td>
									<td> {item?.phone_no}</td>

									<td> {item.employee_profile?.department?.name}</td>
									<td> {item.employee_profile?.designation?.name}</td>
									<td> {item.employee_profile?.employee_type?.type}</td>
									<td>
										{Cookies.get('roleId') === '1' && (
											<Dropdown>
												<DropdownToggle hasIcon={false}>
													<Button
														isLink
														color={
															item.employee_profile?.is_approved === 0
																? `warning`
																: `success`
														}
														icon='Circle'
														className='text-nowrap'>
														{item.employee_profile?.is_approved === 0
															? `Pending`
															: `Approved`}
													</Button>
												</DropdownToggle>

												<DropdownMenu>
													<DropdownItem key={1}>
														<Button
															onClick={() => {
																approveEmployee(item.id);
															}}>
															<Icon
																icon='Circle'
																color={
																	item.employee_profile
																		?.is_approved === 1
																		? `warning`
																		: `success`
																}
															/>
															{item.employee_profile?.is_approved === 1
																? `Pending`
																: `Approved`}
														</Button>
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
										)}
										{Cookies.get('roleId') !== '1' && (
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
															item.employee_profile?.is_approved === 0
																? `warning`
																: `success`
														}`,
													)}>
													<span className='visually-hidden'>
														{item.employee_profile?.is_approved}
													</span>
												</span>
												<span className='text-nowrap'>
													{item.employee_profile?.is_approved === 0
														? `Pending`
														: `Approved`}
												</span>
											</div>
										)}
									</td>

									<td>
										<ButtonGroup>
											<>
												<Button
													isOutline
													color='primary'
													isDisable={
														item.employee_profile?.is_approved === 1
													}
													// isLight={darkModeStatus}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Edit'
													onClick={() => {
														getEditingEmployee(item.id);
														setEditingEmployeeName(item.name);
														setEditingEmployeeId(item.id);
														initialStatusEdit();

														setStateEdit(true);
														setStaticBackdropStatusEdit(true);
													}}>
													Edit
												</Button>
												<Button
													isOutline
													color='primary'
													isDisable={
														item.employee_profile?.is_approved === 1
													}
													// isLight={darkModeStatus}
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Delete'
													onClick={() => {
														setDeletingEmployeeId(item.id);
														setDeletingEmployeeName(item.name);

														initialStatusDelete();

														setStateDelete(true);
														setStaticBackdropStatusDelete(false);
													}}>
													Delete
												</Button>
											</>

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

													{Cookies.get('roleId') === '1' && (
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
								Deletion Confirmation <br /> Employee Name: {deletingEmployeeName}
								<br /> <small> Employee ID: {deletingEmployeeId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								<CardBody>
									Are you sure you want to delete Employee? <br />
									ID: {deletingEmployeeId}
									<br />
									Name: {deletingEmployeeName} <br />
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
				titleId='EditVoucher2'
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				size={sizeStatusEdit}
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher2'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>
									Editing Employee: {editingEmployeeName} <br />
									<small> Employee ID: {editingEmployeeId}</small>
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
									<EditEmployee
										editingEmployeeData={editingEmployeeData}
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
