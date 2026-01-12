// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import AddEmployee from './addEmployee';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Select2 from '../../../../components/bootstrap/forms/Select';

import Button from '../../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Input from '../../../../components/bootstrap/forms/Input';

// import Dropdown, {
// 	DropdownItem,
// 	DropdownMenu,
// 	DropdownToggle,
// } from '../../../../components/bootstrap/Dropdown';
import apiClient from '../../../../baseURL/apiClient';

import ViewEmployees from './viewEmployees';

export const searchByOptions = [
	{ value: 1, text: 'Name' },
	{ value: 2, text: 'Contact' },
	{ value: 3, text: 'CNIC' },
	{ value: 4, text: 'ID' },
];
const TablePage = () => {
	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	const [departmentsOptions, setDepartmentsOptions] = useState([]);
	const [departmentsOptionsLoading, setDepartmentsOptionsLoading] = useState(true);
	const [departmentSelected, setDepartmentSelected] = useState(null);

	const [activeInactiveOptionSelected, setActiveInactiveOptionSelected] = useState({
		id: 1,
		value: 1,
		label: 'Active',
	});

	const [searchNo, setSearchNo] = useState('');
	const [searchBy, setSearchBy] = useState('1');
	const activeInactiveOptions = [
		{
			id: 1,
			value: 1,
			label: 'Active',
		},
		{
			id: 0,
			value: 0,
			label: 'Inactive',
		},
		{
			id: 2,
			value: 2,
			label: 'All',
		},
	];
	useEffect(() => {
		setTableRecordsLoading(true);

		apiClient
			.get(`/getEmployees`)
			.then((response) => {
				setTableRecords(response.data.employees);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				const rec = response.data.departments.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDepartmentsOptions(rec);
				setDepartmentsOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);

	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getEmployees?
			department_id=${departmentSelected !== null ? departmentSelected.id : ''}
			&isActive=${activeInactiveOptionSelected !== 2 ? activeInactiveOptionSelected.id : ''}
			`,
			)
			.then((response) => {
				setTableRecords(response.data.employees);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		refreshTableRecords();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [departmentSelected, activeInactiveOptionSelected]);

	const searchFilterTrigger = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getEmployees?${searchBy === '1' ? `name=${searchNo}` : ''}${
					searchBy === '2' ? `phone_no=${searchNo}` : ''
				}${searchBy === '3' ? `cnic=${searchNo}` : ''}
			${searchBy === '4' ? `id=${searchNo}` : ''}`,
			)
			.then((response) => {
				setTableRecords(response.data.employees);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	};

	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='Person' iconColor='danger'>
							<CardTitle>Employees</CardTitle>
						</CardLabel>
						<CardActions>
							<AddEmployee
								refreshTableRecords={refreshTableRecords}
								tableRecordsLoading={tableRecordsLoading}
								tableRecords={tableRecords}
							/>

							{/* <ButtonGroup>
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
										<DropdownItem isHeader>Other Actions</DropdownItem>
										<DropdownItem>
											{/* <NavLink to='/components/popovers'>
																			<Icon icon='Send' />{' '}
																			Popover
																		</NavLink> */}
							{/* Other Actions 2
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</ButtonGroup>  */}
						</CardActions>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4'>
								<div className='col-md-3'>
									<FormGroup label='Department' id='mainGroup'>
										<Select
											className='col-md-12'
											isClearable
											classNamePrefix='select'
											options={departmentsOptions}
											isLoading={departmentsOptionsLoading}
											value={departmentSelected}
											onChange={(val) => {
												console.log(':::', val);
												setDepartmentSelected(val);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup label='Active/Inactive' id='filter'>
										<Select
											className='col-md-12'
											classNamePrefix='select'
											options={activeInactiveOptions}
											value={activeInactiveOptionSelected}
											onChange={(val) => {
												setActiveInactiveOptionSelected(val);
											}}
										/>
									</FormGroup>
								</div>
							</div>
							<br />
							<div className='row g-4'>
								<div className='col-md-3'>
									<Select2
										ariaLabel='Default select example'
										placeholder='Open this select menu'
										onChange={(e) => {
											setSearchBy(e.target.value);
										}}
										value={searchBy}
										list={searchByOptions}
									/>
								</div>
								<div className='col-md-3'>
									<Input
										id='searchFileNo'
										type='text'
										onChange={(e) => {
											setSearchNo(e.target.value);
										}}
										value={searchNo}
										validFeedback='Looks good!'
									/>
								</div>
								<div className='col-md-2'>
									<Button
										color='primary'
										onClick={() => searchFilterTrigger()}
										isOutline
										// isDisable={landsViewLoading}
										isActive>
										Search
									</Button>
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

										<ViewEmployees
											refreshTableRecords={refreshTableRecords}
											tableRecordsLoading={tableRecordsLoading}
											tableRecords={tableRecords}
										/>
									</Card>
								</div>
							</div>
						</>
					</CardBody>
					<CardFooter className='px-0 pb-0'>
						<CardFooterLeft />
						<CardFooterRight />
					</CardFooter>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
