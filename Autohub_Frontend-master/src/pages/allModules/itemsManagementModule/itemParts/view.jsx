import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

// import { _titleError } from '../../../../notifyMessages/erroSuccess';
// import showNotification from '../../../../components/extras/showNotification';

import Dropdown, { DropdownMenu, DropdownToggle } from '../../../../components/bootstrap/Dropdown';
import apiClient from '../../../../baseURL/apiClient';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import PaginationButtons from '../../../../components/PaginationButtons';
// import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Edit from './edit';
import Viewnew from './viewnew';
// eslint-disable-next-line no-unused-vars
const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	// eslint-disable-next-line no-console
	console.log(store?.data?.itemsManagementModule?.itemParts?.tableData?.data);
	const [perPage, setPerPage] = useState(
		Number(store.data.itemsManagementModule.itemParts.perPage),
	);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	// const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');

	const [deleteLoading, setDeleteLoading] = useState(false);
	const [viewItem, setViewItem] = useState(false);
	const [viewItemLoading, setViewItemLoading] = useState(false);
	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const [stateView, setStateView] = useState(false);

	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);
	const [scrollableStatusView, setScrollableStatusView] = useState(false);
	const [centeredStatusView, setCenteredStatusView] = useState(false);
	const [fullScreenStatusView, setFullScreenStatusView] = useState(null);
	const [animationStatusView, setAnimationStatusView] = useState(true);

	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);
	const initialStatusView = () => {
		setStaticBackdropStatusView(true);
		setScrollableStatusView(false);
		setCenteredStatusView(false);
		setFullScreenStatusView(false);
		setAnimationStatusView(true);
		setHeaderCloseStatusView(true);
	};

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient
			.get(`/editModelItemOem?id=${idd}`)
			.then((res) => {
				setEditingItem(res.data.data);

				setEditingItemLoading(false);
			})
			// eslint-disable-next-line no-unused-vars
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const getViewItem = (idd) => {
		setViewItemLoading(true);
		apiClient
			.get(`/getModelItemOemdetails?id=${idd}`)
			.then((res) => {
				setViewItem(res.data);

				setViewItemLoading(false);
			})
			// eslint-disable-next-line no-unused-vars
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
	};
	// delete
	const [stateDelete, setStateDelete] = useState(false);

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

	const deleteItem = (id) => {
		apiClient
			.delete(`/deleteModelItemOem?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					// showNotification('Deleted', res.data.message, 'success');
					refreshTableData();
					setStateDelete(false);
					setDeleteLoading(false);
				} else if (res.data.status === 'error') {
					// showNotification('Error', res.data.message, 'danger');
					refreshTableData();
					setStateDelete(false);
					setDeleteLoading(false);
				}
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.res.status === 401) {
					// showNotification(_titleError, err.res.data.message, 'Danger');
				}
			});
	};

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'itemsManagementModule', 'itemParts', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'itemsManagementModule', 'itemParts', 'pageNo']));
	};

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							{/* <th style={{ width: 50 }}>{SelectAllCheck}</th> */}
							<th style={{ width: 50 }}>{}</th>
							<th>Sr. No</th>
							<th>Machine</th>
							<th>Make</th>
							<th>Model</th>
							<th>Category</th>

							<th>Name</th>
							<th>OEM Number</th>
							<th>Part Number</th>
							<th>Actions</th>
						</tr>
					</thead>
					{tableDataLoading ? (
						<tbody>
							<tr>
								<td colSpan='12'>
									<div className='d-flex justify-content-center'>
										<Spinner color='primary' size='3rem' />
									</div>
								</td>
							</tr>
						</tbody>
					) : (
						<tbody>
							{store?.data?.itemsManagementModule?.itemParts?.tableData?.data?.map(
								(item, index) => (
									<tr key={item.id}>
										<td>
											<Checks
												id={item.id.toString()}
												name='selectedList'
												value={item.id}
												// onChange={selectTable.handleChange}
												// checked={selectTable.values.selectedList.includes(
												// 	item.id.toString(),
												// )}
											/>
										</td>
										<td>{index + 1}</td>

										<td>
											{item.machine_model?.machine?.name ||
												item.machines?.[0]?.name}
										</td>
										<td>
											{item.machine_model?.make?.name ||
												item.makes?.[0]?.name}
										</td>
										<td>
											{item?.machine_model?.name ||
												item?.machine_models?.[0]?.name}
										</td>
										<td>
											{
												item?.machine_part_oem_part?.machine_part
													?.subcategories?.categories?.name
											}

											<div className='small text-muted'>
												{
													item.machine_part_oem_part?.machine_part
														?.subcategories?.name
												}
											</div>
										</td>
										<td>
											{item.name}
											<div className='small text-muted'>
												{
													item.machine_part_oem_part?.machine_part?.type
														?.name
												}
											</div>
										</td>

										<td>
											{item.machine_part_oem_part.oem_part_number.number1}
										</td>
										<td>
											{item.machine_part_oem_part.oem_part_number?.number2}
										</td>
										<td>
											<ButtonGroup>
												<Button
													// isDisable={item.isApproved === 1}
													onClick={() => {
														getEditingItem(item.id);
														setItemId(item.id);

														initialStatusEdit();
														setStateEdit(true);
														setStaticBackdropStatusEdit(true);
													}}
													isOutline
													color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Edit'>
													Edit
												</Button>
												<Button
													isOutline
													color='primary'
													className={classNames('text-nowrap', {
														'border-light': true,
													})}
													icon='Delete'
													onClick={() => {
														setItemId(item.id);

														initialStatusDelete();

														setStateDelete(true);
														setStaticBackdropStatusDelete(false);
													}}>
													Delete
												</Button>

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
														<Button
															// isDisable={item.isApproved === 1}
															onClick={() => {
																getViewItem(item.id);
																setItemId(item.id);
																setViewItem(item);
																initialStatusView();
																setStateView(true);
																setStaticBackdropStatusView(true);
															}}
															isOutline
															color='primary'
															className={classNames(
																'text-nowrap',
																'col-md-12',
																{
																	'border-light': true,
																},
															)}
															icon='Preview'>
															View
														</Button>
													</DropdownMenu>
												</Dropdown>
											</ButtonGroup>
										</td>
									</tr>
								),
							)}

							{/* {console.log(
								'Data structure:',
								store?.data?.itemsManagementModule?.itemParts?.tableData?.data,
							)} */}

							{/* {store.data.itemsManagementModule?.itemParts?.tableData?.map(
								(item, index) => {
									const maxArrayLength = Math.max(
										item.machines?.length || 0,
										item.makes?.length || 0,
										item.machine_models?.length || 0,
									);

									return Array.from(
										{ length: maxArrayLength },
										(_, arrayIndex) => (
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
												<td>{index + 1}</td>

												<td>
													{item.machine_model?.machine?.name ||
														(item.machines &&
															item.machines.length > 0 &&
															item.machines[arrayIndex]?.name)}
												</td>
												<td>
													{item.machine_model?.make?.name ||
														(item.makes &&
															item.makes.length > 0 &&
															item.makes[arrayIndex]?.name)}
												</td>
												<td>{item.machine_model?.name}</td>

												<td>
													{
														item.machine_part_oem_part?.machine_part
															?.subcategories.categories.name
													}
													<div className='small text-muted'>
														{
															item.machine_part_oem_part?.machine_part
																?.subcategories.name
														}
													</div>
												</td>
												<td>
													{item.name}
													<div className='small text-muted'>
														{
															item.machine_part_oem_part?.machine_part
																?.type?.name
														}
													</div>
												</td>

												<td>
													{
														item.machine_part_oem_part.oem_part_number
															.number1
													}
												</td>
												<td>
													{
														item.machine_part_oem_part.oem_part_number
															?.number2
													}
												</td>
												<td>
													<ButtonGroup>
														<Button
															onClick={() => {
																getEditingItem(item.id);
																setItemId(item.id);
																initialStatusEdit();
																setStateEdit(true);
																setStaticBackdropStatusEdit(true);
															}}
															isOutline
															color='primary'
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Edit'>
															Edit
														</Button>
														<Button
															isOutline
															color='primary'
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Delete'
															onClick={() => {
																setItemId(item.id);
																initialStatusDelete();
																setStateDelete(true);
																setStaticBackdropStatusDelete(
																	false,
																);
															}}>
															Delete
														</Button>
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
																<Button
																	onClick={() => {
																		getViewItem(item.id);
																		setItemId(item.id);
																		setViewItem(item);
																		initialStatusView();
																		setStateView(true);
																		setStaticBackdropStatusView(
																			true,
																		);
																	}}
																	isOutline
																	color='primary'
																	className={classNames(
																		'text-nowrap',
																		'col-md-12',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Preview'>
																	View
																</Button>
															</DropdownMenu>
														</Dropdown>
													</ButtonGroup>
												</td>
											</tr>
										),
									);
								},
							)} */}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='itemParts'
					from={store.data.itemsManagementModule.itemParts.tableData?.from ?? 1}
					to={store.data.itemsManagementModule.itemParts.tableData?.to ?? 1}
					total={store.data.itemsManagementModule.itemParts.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.itemsManagementModule.itemParts?.pageNo ?? 1}
							totalItemsCount={
								store.data.itemsManagementModule.itemParts?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.itemsManagementModule.itemParts?.perPage ?? 10,
							)}
							onChange={(e) => handlePageChange(e)}
							itemClass='page-item'
							linkClass='page-link'
							firstPageText='First'
							lastPageText='Last'
							nextPageText='Next'
							prevPageText='Prev'
						/>
					</div>
				</div>
			</CardBody>
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
								<CardTitle>
									Deletion Confirmation
									<small> Item Id: {itemId}</small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								<CardBody>
									<h5>
										Are you sure, you want to delete the selected Item Part?{' '}
										<br />
										This cannot be undone!
									</h5>
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
											icon={deleteLoading ? null : 'Delete'}
											color='danger'
											onClick={() => {
												setDeleteLoading(true);
												deleteItem(itemId);
											}}
											disabled={deleteLoading}>
											{deleteLoading && <Spinner isSmall inButton />}
											{deleteLoading ? 'Deleting' : 'Yes, Delete!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			<Modal
				isOpen={stateEdit}
				setIsOpen={setStateEdit}
				titleId='EditVoucher'
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				size='xl'
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Item</CardTitle>
								<small> Item Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{editingItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Edit editingItem={editingItem} handleStateEdit={handleStateEdit} />
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateEdit(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>

			<Modal
				isOpen={stateView}
				setIsOpen={setStateView}
				titleId='ViewVoucher'
				isStaticBackdrop={staticBackdropStatusView}
				isScrollable={scrollableStatusView}
				isCentered={centeredStatusView}
				size='lg'
				fullScreen={fullScreenStatusView}
				isAnimation={animationStatusView}>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Preview' iconColor='info'>
								<CardTitle>View Item Part</CardTitle>
								<small> Item Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{viewItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Viewnew viewItem={viewItem} />
							)}
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
		</>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
	refreshTableData: PropTypes.func.isRequired,
};

export default View;
