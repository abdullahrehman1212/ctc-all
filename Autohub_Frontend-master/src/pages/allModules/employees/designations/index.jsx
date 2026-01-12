// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import AddKhasra from './AddKhasra';
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

import ViewKhasras from './ViewKhasras';

const TablePage = () => {
	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	const [departmentOptions, setDepartmentOptions] = useState(null);
	const [departmentOptionsLoading, setDepartmentOptionsLoading] = useState(null);
	const [departmentOptionSelected, setDepartmentOptionsSelected] = useState(null);

	useEffect(() => {
		setTableRecordsLoading(true);
		setDepartmentOptionsLoading(true);

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				const rec = response.data.departments.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setDepartmentOptions(rec);
				setDepartmentOptionsLoading(false);
			})
			.catch((err) => console.log(err));
		refreshTableRecords();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getDesignations?department_id=${
					departmentOptionSelected !== null ? departmentOptionSelected.id : ''
				}`,
			)
			.then((response) => {
				setTableRecords(response.data.designations);
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
							<CardTitle>Designations</CardTitle>
						</CardLabel>
						<CardActions>
							<AddKhasra
								refreshTableRecords={refreshTableRecords}
								tableRecordsLoading={tableRecordsLoading}
								tableRecords={tableRecords}
							/>
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
											isLoading={departmentOptionsLoading}
											classNamePrefix='select'
											options={departmentOptions}
											value={departmentOptionSelected}
											onChange={(val) => {
												console.log(':::', val);
												setDepartmentOptionsSelected(val);
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

										<ViewKhasras
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
