/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */

import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import Cookies from 'js-cookie';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import apiClient from '../../../baseURL/apiClient';

import Icon from '../../../components/icon/Icon';
import Checks from '../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import PaginationButtons, { dataPagination } from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useSelectTable from '../../../hooks/useSelectTable';
// import showNotification from '../../../components/extras/showNotification';
import AddRole from './modals/AddRole';
// import GeneratePDF2 from './print/ReportII'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Spinner from '../../../components/bootstrap/Spinner';

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardActions,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../components/bootstrap/Card';
import EditUser from './modals/editUser';
import EditPassword from './modals/editPassword';
import Cropper from '../../presentation/auth/Cropper';

export const _selectOptions = [
	{ value: 1, text: 'File No' },
	{ value: 2, text: 'Mutation No' },
	{ value: 3, text: 'Khasra No' },
];

const TablePage = () => {
	// eslint-disable-next-line no-unused-vars
	const [refreshLands, setRefreshLands] = useState(0);

	useEffect(() => {
		refreshTableRecords();
	}, [counter]);

	const [currentPage, setCurrentPage] = useState(1);
	const [counter, setCounter] = useState(0);
	const [perPage, setPerPage] = useState(1000);
	const [landsView, setLandsView] = useState([]);
	const [landsViewLoading, setLandsViewLoading] = useState(true);
	console.log('The role id is:', Cookies.get('role_id1'));
	// const { items, requestSort, getClassNamesFor } = useSortableData(landsView);
	const { items, requestSort, getClassNamesFor } = useSortableData(landsView);
	const onCurrentPageData = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

	const refreshTableRecords = () => {
		setLandsViewLoading(true);
		apiClient
			.get(`/getUsers?pageNo=1&&records=1000&&sort=asc&&colName=id`)
			.then((response) => {
				setLandsView(response?.data?.users?.data);
				setLandsViewLoading(false);
			})
			.catch((err) => console.log(err));
	};
	const approveFile = (id) => {
		console.log(id);
		apiClient
			.get(`/togalSystemUser?user_id=${id}`)
			// eslint-disable-next-line no-unused-vars
			.then((response) => {
				// showNotification('Success', response.data.message, 'success');
				refreshTableRecords();
			})
			.catch((err) => {
				console.log(err);
				// showNotification('Error', err.message, 'danger');
			});
	};

	// Edit/Update/Delete
	// eslint-disable-next-line no-unused-vars
	const [deletingItemId, setDeletingItemId] = useState('');

	const [editingItemId, setEditingItemId] = useState('');

	const [stateDelete, setStateDelete] = useState(false);

	const handleStateEdit = (status) => {
		setStateEdit(status);
	};
	const handleStatePassword = (status) => {
		setStatePassword(status);
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

	const deleteLoan = (id) => {
		apiClient
			.delete(`/deleteUser?id=${id}`)
			.then(() => {
				refreshTableRecords();

				setStateDelete(false);
			})
			.catch((err) => {
				console.log(err);
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
	const userId = Number(Cookies.get('id1'));
	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setSizeStatusEdit('md');
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};
	// Edit
	const [statePassword, setStatePassword] = useState(false);

	const [staticBackdropStatusPassword, setStaticBackdropStatusPassword] = useState(true);
	const [scrollableStatusPassword, setScrollableStatusPassword] = useState(false);
	const [centeredStatusPassword, setCenteredStatusPassword] = useState(false);
	const [sizeStatusPassword, setSizeStatusPassword] = useState(null);
	const [fullScreenStatusPassword, setFullScreenStatusPassword] = useState(null);
	const [animationStatusPassword, setAnimationStatusPassword] = useState(true);

	const [headerCloseStatusPassword, setHeaderCloseStatusPassword] = useState(true);
	const [companyLogo, setCompanyLogo] = useState('');
	const [showCropper, setShowCropper] = useState(false);
	const initialStatusPassword = () => {
		setStaticBackdropStatusPassword(true);
		setScrollableStatusPassword(false);
		setCenteredStatusPassword(false);
		setSizeStatusPassword('md');
		setFullScreenStatusPassword(false);
		setAnimationStatusPassword(true);
		setHeaderCloseStatusPassword(true);
	};

	const [editingUserData, setEditingUserData] = useState([]);
	const [editingUserDataLoading, setEditingUserDataLoading] = useState(false);


	const handleUploadClick = () => {
	  setShowCropper(true);
	};
	const getEditingLoan = (id) => {
		setEditingUserDataLoading(true);
		apiClient
			.get(`/editUser?id=${id}`)
			.then((response) => {
				setEditingUserData(response.data.user);
				console.log(response.data.user, 'lll');
				// setRefreshLoans(refreshLoans + 1);
				setEditingUserDataLoading(false);
			})
			.catch((err) => {
				console.log(err);
				// showNotification('Error', err.message, 'danger');
			});
	};


	useEffect(() => {
		const updateUser = async () => {
		  if (companyLogo !== '') {
			try {
			  const response = await apiClient.get(`/editUser?id=${userId}`);
			  const userData = response.data.user;
	  
			  // Remove the logo attribute from userData if it exists
			  delete userData.logo;
	  
			  // Create FormData and append user data and companyLogo
			  const formData = new FormData();
			  Object.entries(userData).forEach(([key, value]) => {
				if (value !== null && value !== undefined) {
				  formData.append(key, value);
				}
			  });
	  
			  formData.append('logo', companyLogo);
			  	  // Call the updateUser API
					const updateResponse = await apiClient.post('/updateUser', formData);
					const updatedUser = updateResponse.data.user;
		  
					// Get the Data1 cookie and parse it
					const data1 = JSON.parse(Cookies.get('Data1'));
		  
					data1.user.logo = updatedUser.logo;
					data1.user.logo_url = `http://192.168.18.15/Autohub_Backend/public/images/company/${updatedUser.logo}`;
		  
					Cookies.set('Data1', JSON.stringify(data1));
			  
			  setShowCropper(false);
			  setCompanyLogo('');
			} catch (error) {
			  console.error('Error updating user:', error);
			}
		  }
		};
	  
		// Call the updateUser function only if userId and companyLogo are available
		if (userId && companyLogo) {
		  updateUser();
		}
	  }, [userId, companyLogo]);
	  
	
	  
	  


	return (
		<PageWrapper>
			{/* title={componentsMenu.components.subMenu.table.text} */}
			{/* <SubHeader>
				<SubHeaderLeft>
					<Breadcrumb
						list={[
							{
								title: componentsMenu.components.text,
								to: `/${componentsMenu.components.path}`,
							},
							{
								title: componentsMenu.components.subMenu.table.text,
								to: `/${componentsMenu.components.subMenu.table.path}`,
							},
						]}
					/>
				</SubHeaderLeft>
			</SubHeader> */}

			<Page>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>System Users List</CardTitle>
								</CardLabel>
								<CardActions>
									<AddRole
										setCounter={setCounter}
										counter={counter}
										refreshTableRecords={refreshTableRecords}
									/>
									    <Button variant="contained" color="primary" onClick={handleUploadClick}>
											Upload Image
										</Button>

										{showCropper && (
											<Cropper 
											setCompanyLogo={setCompanyLogo}
											imageUpload= {showCropper}
											setShowCropper={setShowCropper}
											showCropper={showCropper}
											/>
										)}
								</CardActions>
							</CardHeader>

							<CardBody>
								<br />
								<table className='table table-modern'>
									<thead>
										<tr>
											<th style={{ width: 50 }}>{SelectAllCheck}</th>
											<th
												onClick={() => requestSort('id')}
												className='cursor-pointer text-decoration-underline'>
												ID{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('firstName')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('FileNo')}
												className='cursor-pointer text-decoration-underline'>
												Name{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('FileNo')}
													icon='FilterList'
												/>
											</th>

											<th
												onClick={() => requestSort('mouza_id')}
												className='cursor-pointer text-decoration-underline'>
												Email{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('mouza_id')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('mouza_id')}
												className='cursor-pointer text-decoration-underline'>
												Role{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('mouza_id')}
													icon='FilterList'
												/>
											</th>
											<th>Status</th>

											{/* <th className='cursor-pointer text-decoration-underline'>
												Status{' '}
											</th> */}
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

									{landsViewLoading ? (
										<tbody>
											<tr>
												<td colSpan='8'>
													<div className='d-flex justify-content-center'>
														<Spinner color='primary' size='5rem' />
													</div>
												</td>
											</tr>
										</tbody>
									) : (
										<tbody>
											{onCurrentPageData
												.filter(
													(data) =>
														Number(Cookies.get('id1')) === data.id ||
														Number(Cookies.get('id1')) ===
															data.admin_id,
												)
												.map((item) => (
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
														<td>{item.name}</td>

														<td> {item.email}</td>

														<td>{item?.role?.role}</td>

														<td>
															{Cookies.get('roleId1') === '1' && (
																<Dropdown>
																	<DropdownToggle hasIcon={false}>
																		<Button
																			isLink
																			color={
																				item.is_active === 0
																					? `warning`
																					: `success`
																			}
																			icon='Circle'
																			className='text-nowrap'>
																			{item.is_active === 0
																				? `Inactive`
																				: `Active`}
																		</Button>
																	</DropdownToggle>

																	<DropdownMenu>
																		<DropdownItem key={1}>
																			<Button
																				onClick={() => {
																					approveFile(
																						item.id,
																					);
																				}}>
																				<Icon
																					icon='Circle'
																					color={
																						item.is_active ===
																						1
																							? `warning`
																							: `success`
																					}
																				/>
																				{item.is_active ===
																				1
																					? `Inactive`
																					: `Active`}
																			</Button>
																		</DropdownItem>
																	</DropdownMenu>
																</Dropdown>
															)}
															{Cookies.get('roleId1') !== '1' && (
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
																				item.is_active === 0
																					? `warning`
																					: `success`
																			}`,
																		)}>
																		<span className='visually-hidden'>
																			{item.is_active}
																		</span>
																	</span>
																	<span className='text-nowrap'>
																		{item.is_active === 0
																			? `Inactive`
																			: `Active`}
																	</span>
																</div>
															)}
														</td>
														<td>
															<ButtonGroup>
																<Button
																	isOutline
																	color='primary'
																	// isDisable={item.is_active === 1}
																	// isDisable
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Edit'
																	onClick={() => {
																		setEditingItemId(
																			item.voucher_no,
																		);
																		getEditingLoan(item.id);
																		initialStatusPassword();
																		setStatePassword(true);
																		setStaticBackdropStatusPassword(
																			true,
																		);
																	}}>
																	Change Password
																</Button>
																<Button
																	isOutline
																	color='primary'
																	// isDisable={item.is_active === 1}
																	// isDisable
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Edit'
																	onClick={() => {
																		setEditingItemId(
																			item.voucher_no,
																		);
																		getEditingLoan(item.id);
																		initialStatusEdit();
																		setStateEdit(true);
																		setStaticBackdropStatusEdit(
																			true,
																		);
																	}}>
																	Edit
																</Button>
																{/* <Button
																isOutline
																color='primary'
																// isDisable={item.is_active === 1}
																// isDisable
																// isLight={darkModeStatus}
																className={classNames(
																	'text-nowrap',
																	{
																		'border-light': true,
																	},
																)}
																icon='Edit'
																onClick={() => {
																	setDeletingItemId(item.id);

																	// getEditingLoan(item.id);

																	initialStatusDelete();

																	setStateDelete(true);
																	setStaticBackdropStatusDelete(
																		true,
																	);
																}}>
																Delete
															</Button> */}
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
						</Card>
					</div>
				</div>
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
									Deleting User : {editingUserData?.name}
									<small>User Id: {editingItemId}</small>
								</CardLabel>
							</CardHeader>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className='row g-4'>
							<div className='col-12'>
								<Card>
									<CardBody>
										Are you sure you want to delete User? <br />
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
												onClick={() => deleteLoan(deletingItemId)}>
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
										Editing User Details: {editingUserData?.name}
										<small>User Id: {editingItemId}</small>
									</CardTitle>
								</CardLabel>
							</CardHeader>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className='row g-4'>
							<div className='col-12'>
								<Card>
									{editingUserDataLoading ? (
										<div className='d-flex justify-content-center'>
											<Spinner color='primary' size='5rem' />
										</div>
									) : (
										<EditUser
											editingUserData={editingUserData}
											handleStateEdit={handleStateEdit}
											refreshTableRecords={refreshTableRecords}
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
				<Modal
					isOpen={statePassword}
					setIsOpen={setStatePassword}
					titleId='PasswordVoucher'
					isStaticBackdrop={staticBackdropStatusPassword}
					isScrollable={scrollableStatusPassword}
					isCentered={centeredStatusPassword}
					size={sizeStatusPassword}
					fullScreen={fullScreenStatusPassword}
					isAnimation={animationStatusPassword}>
					<ModalHeader setIsOpen={headerCloseStatusPassword ? setStatePassword : null}>
						<ModalTitle id='PasswordVoucher'>
							{' '}
							<CardHeader>
								<CardLabel icon='Password' iconColor='info'>
									<CardTitle>
										Change User Password: {editingUserData?.name}
										<small>User Id: {editingItemId}</small>
									</CardTitle>
								</CardLabel>
							</CardHeader>
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<div className='row g-4'>
							<div className='col-12'>
								<Card>
									{editingUserDataLoading ? (
										<div className='d-flex justify-content-center'>
											<Spinner color='primary' size='5rem' />
										</div>
									) : (
										<EditPassword
											editingUserData={editingUserData}
											handleStatePassword={handleStatePassword}
											refreshTableRecords={refreshTableRecords}
										/>
									)}

									<CardFooter>
										<CardFooterLeft>
											<Button
												color='info'
												icon='cancel'
												isOutline
												className='border-0'
												onClick={() => setStatePassword(false)}>
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
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
