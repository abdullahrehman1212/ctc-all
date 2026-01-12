// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import AddEmployee from './addEmployee';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';

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

import apiClient from '../../../../baseURL/apiClient';

import ViewEmployees from './viewEmployees';

const TablePage = () => {
	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);
	const [refreshTableRecords, setRefreshTableRecords] = useState(0);

	const [departmentsOptions, setDepartmentsOptions] = useState([]);
	const [departmentsOptionsLoading, setDepartmentsOptionsLoading] = useState(true);
	const [departmentSelected, setDepartmentSelected] = useState(null);

	const [typeOptionSelected, setTypeOptionSelected] = useState(null);
	const [employeeOptionSelected, setEmployeeOptionSelected] = useState([]);
	const [employeeOptions, setEmployeeOptions] = useState([]);
	const [employeeOptionsLoading, setEmployeeOptionsLoading] = useState(true);

	const refreshTableRecordsHandler = (arg) => {
		setRefreshTableRecords(arg);
	};

	const typeOptions = [
		{
			id: 1,
			value: 1,
			label: 'Advance Salary',
		},
		{
			id: 2,
			value: 2,
			label: 'Loan',
		},
	];
	useEffect(() => {
		setTableRecordsLoading(true);

		apiClient
			.get(`/getAdvanceSalaryAndLoan`)
			.then((response) => {
				setTableRecords(response.data.vouchers);
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
	useEffect(() => {
		setEmployeeOptionsLoading(true);

		apiClient
			.get(
				`/getEmployees?department_id=${
					departmentSelected !== null ? departmentSelected.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.employees.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setEmployeeOptions(rec);
				setEmployeeOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, [departmentSelected]);
	useEffect(() => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getAdvanceSalaryAndLoan?department_id=${
					departmentSelected !== null ? departmentSelected.id : ''
				}&type=${typeOptionSelected !== null ? typeOptionSelected.id : ''}&employee_id=${
					employeeOptionSelected !== null ? employeeOptionSelected.id : ''
				}`,
			)
			.then((response) => {
				setTableRecords(response.data.vouchers);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	}, [departmentSelected, typeOptionSelected, employeeOptionSelected, refreshTableRecords]);

	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='Person' iconColor='danger'>
							<CardTitle>Advance Salary/ Loan</CardTitle>
						</CardLabel>
						<CardActions>
							<AddEmployee
								refreshTableRecordsHandler={refreshTableRecordsHandler}
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
											
											Other Actions 2
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</ButtonGroup> */}
						</CardActions>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4'>
								<div className='col-md-3'>
									<FormGroup label='Department' id='mainGroup'>
										<Select
											className='col-md-11'
											isClearable
											classNamePrefix='select'
											options={departmentsOptions}
											isLoading={departmentsOptionsLoading}
											value={departmentSelected}
											onChange={(val) => {
												setDepartmentSelected(val);
												setEmployeeOptionSelected(null);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup
										id='employee_id'
										label='Employee'
										className='col-md-12'>
										<Select
											className='col-md-12'
											isClearable
											classNamePrefix='select'
											options={employeeOptions}
											isLoading={employeeOptionsLoading}
											value={employeeOptionSelected}
											// value={formik.values.mouza_id}
											onChange={(val) => {
												setEmployeeOptionSelected(val);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup label='Adv Salary/ Loan' id='filter'>
										<Select
											isClearable
											className='col-md-11'
											classNamePrefix='select'
											options={typeOptions}
											value={typeOptionSelected}
											onChange={(val) => {
												setTypeOptionSelected(val);
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

										<ViewEmployees
											refreshTableRecordsHandler={refreshTableRecordsHandler}
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
