// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import moment from 'moment';

// eslint-disable-next-line import/order
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';

import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';

import Card, {
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
	const [dateForPayroll, setDateForPayroll] = useState(moment().format('MM/YY'));
	const [dateForPayroll2, setDateForPayroll2] = useState(moment());

	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	const [departmentsOptions, setDepartmentsOptions] = useState([]);
	const [departmentsOptionsLoading, setDepartmentsOptionsLoading] = useState(true);
	const [departmentSelected, setDepartmentSelected] = useState(null);

	useEffect(() => {
		setDepartmentsOptionsLoading(true);

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
		refreshTableRecords();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [departmentSelected, dateForPayroll]);

	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getEmployeesRequestedForFinalSettlement?month=${dateForPayroll}&department_id=${
					departmentSelected !== null ? departmentSelected.id : ''
				}`,
			)
			.then((response) => {
				setTableRecords(response.data.employees);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	};

	// postdated

	useState(true);

	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='Person' iconColor='danger'>
							<CardTitle>Employees Final Settlement</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4'>
								<FormGroup label='Month' className='col-md-3'>
									<Flatpickr
										className='form-control'
										value={dateForPayroll}
										// eslint-disable-next-line react/jsx-boolean-value

										options={{
											minDate: '2022-09-1',
											maxDate: 'today',
											plugins: [
												// eslint-disable-next-line new-cap
												new monthSelectPlugin({
													shorthand: true,
													dateFormat: 'm/y',
													allowInput: true,
												}),
											],
										}}
										onChange={(date, dateStr) => {
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
										}}
										onClose={(date, dateStr) => {
											setDateForPayroll(dateStr);
											setDateForPayroll2(date[0]);
										}}
										id='default-picker'
									/>
								</FormGroup>
								<FormGroup label='Department' className='col-md-3' id='mainGroup'>
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
											dateForPayroll2={dateForPayroll2}
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
