// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';

import apiClient from '../../../../baseURL/apiClient';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import AddCoeSubGroup from './modals/AddCoeSubGroup';
import AddAccount from './modals/AddAccount';
import AddPersonAccount from './modals/AddPersonAccount';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
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
// ** apiClient Imports

import showNotification from '../../../../components/extras/showNotification';

import Heads from './Heads';
import SubGroups from './SubGroups';
import MainAccounts from './MainAccounts';
import GeneratePDF from '../viewAccounts/print/printChartOfAccounts';

const TablePage = () => {
	const [activeFilterSubGroupsOptions, setActiveFilterSubGroupsOptions] = useState([
		{ id: 1, value: 1, label: 'All' },
		{ id: 2, value: 2, label: 'Active' },
		{ id: 3, value: 3, label: 'Inactive' },
	]);
	const [activeFilterSubGroupsSelected, setActiveFilterSubGroupsSelected] = useState({
		id: 2,
		value: 2,
		label: 'Active',
	});
	const [activeFilterAccountsSelected, setActiveFilterAccountsSelected] = useState({
		id: 2,
		value: 2,
		label: 'Active',
	});

	const [subGroupsOptions, setSubGroupsOptions] = useState('');
	const [subGroupsOptionsLoading, setSubGroupsOptionsLoading] = useState(true);
	const [subGroupsSelected, setSubGroupsSelected] = useState(null);

	const [mainAccountOptions, setMainAccountOptions] = useState('');
	const [mainAccountOptionsLoading, setMainAccountOptionsLoading] = useState(true);
	const [mainAccountSelected, setMainAccountSelected] = useState(null);

	const [mainAccountSelected2, setMainAccountSelected2] = useState(null);

	const [coSubGroupsView, setCoSubGroups] = useState([]);
	const [coaAccountsView, setCoaAccountsView] = useState([]);
	const [coaMainAccountsView, setCoaMainAccountsView] = useState([]);

	const [coSubGroupsViewLoading, setCoSubGroupsLoading] = useState([]);
	const [coaAccountsViewLoading, setCoaAccountsViewLoading] = useState([]);
	const [coaMainAccountsViewLoading, setCoaMainAccountsViewLoading] = useState([]);

	const [refreshSubgroupsView, setRefreshSubgroupsView] = useState(0);
	const [refreshAccountsView, setRefreshAccountsView] = useState(0);
	const refreshSubgroupsHandler = (arg) => {
		setRefreshSubgroupsView(arg);
	};
	const refreshAccountsHandler = (arg) => {
		setRefreshAccountsView(arg);
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
	}, []);
	useEffect(() => {
		setCoSubGroupsLoading(true);
		if (mainAccountSelected !== null) {
			apiClient
				.get(`/coaSubGroupsByGroup?coa_group_id=${mainAccountSelected.id}`)
				.then((response) => {
					setCoSubGroups(response.data.coaSubGroups);
					setCoSubGroupsLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, [mainAccountSelected]);
	useEffect(() => {
		setCoSubGroupsLoading(true);
		const getSubGroupsAll = () => {
			if (mainAccountSelected !== null) {
				apiClient
					.get(`/getRequiredCoaSubGroups?group_id=${mainAccountSelected.id}`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredCoaSubGroups`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		const getSubGroupsActive = () => {
			if (mainAccountSelected !== null) {
				apiClient
					.get(`/getRequiredCoaSubGroups?type=1&group_id=${mainAccountSelected.id}`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredCoaSubGroups?type=1`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		const getSubGroupsInactive = () => {
			if (mainAccountSelected !== null) {
				apiClient
					.get(`/getRequiredCoaSubGroups?type=0&group_id=${mainAccountSelected.id}`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredCoaSubGroups?type=0`)
					.then((response) => {
						setCoSubGroups(response.data.coaSubGroups);
						setCoSubGroupsLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		if (activeFilterSubGroupsSelected.id === 1) {
			getSubGroupsAll();
		} else if (activeFilterSubGroupsSelected.id === 2) {
			getSubGroupsActive();
		} else if (activeFilterSubGroupsSelected.id === 3) {
			getSubGroupsInactive();
		}
	}, [activeFilterSubGroupsSelected, mainAccountSelected, refreshSubgroupsView]);
	useEffect(() => {
		setSubGroupsSelected(null);
		setSubGroupsOptionsLoading(true);
		if (mainAccountSelected2 !== null) {
			apiClient
				.get(`/coaSubGroupsByGroup?coa_group_id=${mainAccountSelected2.id}`)
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
		} else {
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
		}
	}, [mainAccountSelected2]);
	useEffect(() => {
		setCoaAccountsViewLoading(true);
		const getAccountsAll = () => {
			if (subGroupsSelected !== null) {
				apiClient
					.get(`/getRequiredAccounts?sub_group_id=${subGroupsSelected.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else if (mainAccountSelected2 !== null) {
				apiClient
					.get(`/getRequiredAccounts?group_id=${mainAccountSelected2.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredAccounts`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		const getAccountsActive = () => {
			if (subGroupsSelected !== null) {
				apiClient
					.get(`/getRequiredAccounts?type=1&sub_group_id=${subGroupsSelected.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else if (mainAccountSelected2 !== null) {
				apiClient
					.get(`/getRequiredAccounts?type=1&group_id=${mainAccountSelected2.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredAccounts?type=1`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		const getAccountsInactive = () => {
			if (subGroupsSelected !== null) {
				apiClient
					.get(`/getRequiredAccounts?type=0&sub_group_id=${subGroupsSelected.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else if (mainAccountSelected2 !== null) {
				apiClient
					.get(`/getRequiredAccounts?type=-&group_id=${mainAccountSelected2.id}`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			} else {
				apiClient
					.get(`/getRequiredAccounts?type=0`)
					.then((response) => {
						setCoaAccountsView(response.data.coaAccounts);
						setCoaAccountsViewLoading(false);
					})
					.catch((err) => console.log(err));
			}
		};
		if (activeFilterAccountsSelected.id === 1) {
			getAccountsAll();
		} else if (activeFilterAccountsSelected.id === 2) {
			getAccountsActive();
		} else if (activeFilterAccountsSelected.id === 3) {
			getAccountsInactive();
		}
	}, [
		activeFilterAccountsSelected,
		subGroupsSelected,
		refreshAccountsView,
		mainAccountSelected2,
	]);
	useEffect(() => {
		setCoaMainAccountsViewLoading(true);
		setCoSubGroupsLoading(true);
		setCoaAccountsViewLoading(true);
		apiClient
			.get(`/getCoaSubGroups`)
			.then((response) => {
				setCoSubGroups(response.data.coaSubGroups);
				setCoSubGroupsLoading(false);
			})
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCoaAccounts`)
			.then((response) => {
				setCoaAccountsView(response.data.coaAccounts);
				setCoaAccountsViewLoading(false);
			})
			.catch((err) => console.log(err));
		apiClient
			.get(`/getCoaGroups`)
			.then((response) => {
				setCoaMainAccountsView(response.data.coaGroup);
				setCoaMainAccountsViewLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	const printChartOfAccounts = (docType) => {
		apiClient
			.get(`/getTrailBalance?from=01/09/22&to=26/09/22`)
			.then((response) => {
				try {
					GeneratePDF(response?.data?.data, docType);
				} catch (e) {
					console.log('Error');
					showNotification('Error', e, 'danger');
				}

				showNotification(
					'Generating Trial Balance',
					'Generating  Trial Balance Successfully',
					'success',
				);
			})
			.catch((err) => console.log(err));
	};
	return (
		<PageWrapper>
			<Page>
				<div className='row'>
					<div className='col-12'>
						{/* <div className='col-12 mt-5 mb-3'>
							<h3 id='card-hasTab' className='scroll-margin'>
								Manage Accounts subGroups
							</h3>
						</div> */}

						<Card stretch>
							<CardBody>
								<Card hasTab tabButtonColor='info'>
									<CardTabItem
										id='tab-item-1'
										title='Main Groups'
										icon='Architecture'>
										<Card shadow='none' className='border-0'>
											<CardHeader className='px-0 pt-0'>
												<CardLabel icon='Engineering' iconColor='danger'>
													<CardTitle>Main Groups</CardTitle>
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
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='Preview'
																		onClick={() =>
																			printChartOfAccounts(2)
																		}>
																		View Chart of Accounts
																	</Button>
																</DropdownItem>
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='FilePdfFill'
																		onClick={() =>
																			printChartOfAccounts(1)
																		}>
																		Save pdf Chart of Accounts
																	</Button>
																</DropdownItem>
															</DropdownMenu>
														</Dropdown>
													</ButtonGroup>
												</CardActions>
											</CardHeader>
											<CardBody className='px-0'>
												<div className='row'>
													<div className='col-12'>
														<Card>
															{/* <CardHeader>
																<CardLabel icon='Assignment'>
																	<CardTitle>
																		Main Groups
																	</CardTitle>
																</CardLabel>
															</CardHeader> */}
															<MainAccounts
																coaMainAccountsView={
																	coaMainAccountsView
																}
																coaMainAccountsViewLoading={
																	coaMainAccountsViewLoading
																}
															/>
														</Card>
													</div>
												</div>
											</CardBody>
											{/* <CardFooter className='px-0 pb-0'>
												<CardFooterLeft>
													<Button
														color='info'
														isOutline
														icon='DocumentScanner'>
														Action
													</Button>
												</CardFooterLeft>
												<CardFooterRight>
													<Button color='info' icon='CleaningServices'>
														Other Action
													</Button>
												</CardFooterRight>
											</CardFooter> */}
										</Card>
									</CardTabItem>

									<CardTabItem
										id='tab-item-2'
										title='Subgroups'
										icon='Architecture'>
										<Card shadow='none' className='border-0'>
											<CardHeader className='px-0 pt-0'>
												<CardLabel icon='Engineering' iconColor='danger'>
													<CardTitle>Subgroups</CardTitle>
												</CardLabel>
												<CardActions>
													<AddCoeSubGroup
														setRefreshSubgroupsView={
															refreshSubgroupsHandler
														}
													
														refreshSubgroupsView={refreshSubgroupsView}
													/>

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
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='Preview'
																		onClick={() =>
																			printChartOfAccounts(2)
																		}>
																		View Chart of Accounts
																	</Button>
																</DropdownItem>
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='FilePdfFill'
																		onClick={() =>
																			printChartOfAccounts(1)
																		}>
																		Save pdf Chart of Accounts
																	</Button>
																</DropdownItem>
															</DropdownMenu>
														</Dropdown>
													</ButtonGroup>
												</CardActions>
											</CardHeader>
											<CardBody className='px-0'>
												<>
													<div className='row g-4'>
														<div className='col-md-3'>
															<FormGroup
																label='Main Group'
																id='mainGroup'>
																<Select
																	className='col-md-11'
																	isClearable
																	classNamePrefix='select'
																	options={mainAccountOptions}
																	isLoading={
																		mainAccountOptionsLoading
																	}
																	value={mainAccountSelected}
																	onChange={(val) => {
																		setMainAccountSelected(val);
																	}}
																/>
															</FormGroup>
														</div>
														<div className='col-md-3'>
															<FormGroup label='Status' id='filter'>
																<Select
																	className='col-md-11'
																	classNamePrefix='select'
																	options={
																		activeFilterSubGroupsOptions
																	}
																	value={
																		activeFilterSubGroupsSelected
																	}
																	onChange={(val) => {
																		setActiveFilterSubGroupsSelected(
																			val,
																		);
																	}}
																/>
															</FormGroup>
														</div>
													</div>
													<div className='row'>
														<div className='col-12'>
															<Card>
																{/* <CardHeader>
																<CardLabel icon='Assignment'>
																	<CardTitle>
																		Accounts Subgroups
																	</CardTitle>
																</CardLabel>
															</CardHeader> */}

																<SubGroups
																	coSubGroupsView={
																		coSubGroupsView
																	}
																	setRefreshSubgroupsView={
																		refreshSubgroupsHandler
																	}
																	refreshSubgroupsView={
																		refreshSubgroupsView
																	}
																	coSubGroupsViewLoading={
																		coSubGroupsViewLoading
																	}
																/>
															</Card>
														</div>
													</div>
												</>
											</CardBody>
											{/* <CardFooter className='px-0 pb-0'>
												<CardFooterLeft>
													<Button
														color='info'
														isOutline
														icon='DocumentScanner'>
														Action
													</Button>
												</CardFooterLeft>
												<CardFooterRight>
													<Button color='info' icon='CleaningServices'>
														Other Action
													</Button>
												</CardFooterRight>
											</CardFooter> */}
										</Card>
									</CardTabItem>

									<CardTabItem
										id='tab-item-3'
										title='Accounts'
										icon='Architecture'>
										<Card shadow='none' className='border-0'>
											<CardHeader className='px-0 pt-0'>
												<CardLabel icon='Engineering' iconColor='danger'>
													<CardTitle>Accounts</CardTitle>
												</CardLabel>
												<CardActions>
													<AddAccount
														setRefreshAccountsView={
															refreshAccountsHandler
														}
														refreshAccountsView={refreshAccountsView}
													/>
													<AddPersonAccount
														setRefreshAccountsView={
															refreshAccountsHandler
														}
														refreshAccountsView={refreshAccountsView}
													/>

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
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='Preview'
																		onClick={() =>
																			printChartOfAccounts(2)
																		}>
																		View Chart of Accounts
																	</Button>
																</DropdownItem>
																<DropdownItem>
																	<Button
																		isOutline
																		color='dark'
																		icon='FilePdfFill'
																		onClick={() =>
																			printChartOfAccounts(1)
																		}>
																		Save pdf Chart of Accounts
																	</Button>
																</DropdownItem>
															</DropdownMenu>
														</Dropdown>
													</ButtonGroup>
												</CardActions>
											</CardHeader>
											<CardBody className='px-0'>
												<div className='row g-4'>
													<div className='col-md-3'>
														<FormGroup
															label='Main Group'
															id='mainGroup'>
															<Select
																className='col-md-11'
																isClearable
																classNamePrefix='select'
																options={mainAccountOptions}
																isLoading={
																	mainAccountOptionsLoading
																}
																value={mainAccountSelected2}
																onChange={(val) => {
																	setMainAccountSelected2(val);
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
													<div className='col-md-3'>
														<FormGroup label='Status' id='filter'>
															<Select
																className='col-md-11'
																classNamePrefix='select'
																options={
																	activeFilterSubGroupsOptions
																}
																value={activeFilterAccountsSelected}
																onChange={(val) => {
																	setActiveFilterAccountsSelected(
																		val,
																	);
																}}
															/>
														</FormGroup>
													</div>
												</div>
												<div className='row'>
													<div className='col-12'>
														<Card>
															{/* <CardHeader>
																<CardLabel icon='Assignment'>
																	<CardTitle>Accounts</CardTitle>
																</CardLabel>
															</CardHeader> */}
															<Heads
																coaAccountsView={coaAccountsView}
																setRefreshAccountsView={
																	refreshAccountsHandler
																}
																refreshAccountsView={
																	refreshAccountsView
																}
																coaAccountsViewLoading={
																	coaAccountsViewLoading
																}
															/>
														</Card>
													</div>
												</div>
											</CardBody>
										</Card>
									</CardTabItem>
								</Card>
							</CardBody>
							<CardFooter />
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
