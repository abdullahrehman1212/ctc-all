// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import AddPerson from './AddPerson';
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

import ViewPersons from './ViewPersons';

const TablePage = () => {
	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	useEffect(() => {
		setTableRecordsLoading(true);

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				setTableRecords(response.data.departments);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);
	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(`/getDepartments`)
			.then((response) => {
				setTableRecords(response.data.departments);
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
							<CardTitle>Departments</CardTitle>
						</CardLabel>
						<CardActions>
							<AddPerson
								refreshTableRecords={refreshTableRecords}
								tableRecordsLoading={tableRecordsLoading}
								tableRecords={tableRecords}
							/>
						</CardActions>
					</CardHeader>
					<CardBody className='px-0'>
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

									<ViewPersons
										refreshTableRecords={refreshTableRecords}
										tableRecordsLoading={tableRecordsLoading}
										tableRecords={tableRecords}
									/>
								</Card>
							</div>
						</div>
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
