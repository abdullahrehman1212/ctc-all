// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

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
// ** apiClient Import
import apiClient from '../../../../baseURL/apiClient';

import ViewAllAccounts from './ViewAllAccounts';

const TablePage = () => {
	const [tableRecords, setTableRecords] = useState([]);
	const [tableRecordsLoading, setTableRecordsLoading] = useState([]);

	const [investorsOptions, setInvestorsOptions] = useState([]);
	const [investorsOptionsLoading, setInvestorsOptionsLoading] = useState(true);
	const [investorSelected, setInvestorSelected] = useState(null);

	useEffect(() => {
		setTableRecordsLoading(true);

		apiClient
			.get(`/getPersons`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
				}));
				setInvestorsOptions(rec);
				setInvestorsOptionsLoading(false);
			})
			.catch((err) => console.log(err));
	}, []);
	const refreshTableRecords = () => {
		setTableRecordsLoading(true);

		apiClient
			.get(
				`/getPersonCoaAccountsBalance?person_id=${
					investorSelected !== null ? investorSelected.id : ''
				}`,
			)
			.then((response) => {
				setTableRecords(response.data.people);
				setTableRecordsLoading(false);
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		refreshTableRecords();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [investorSelected]);

	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='Person' iconColor='danger'>
							<CardTitle>Individual Persons Accounts</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4'>
								<div className='col-md-3'>
									<FormGroup label='Persons' id='mainGroup'>
										<Select
											className='col-md-11'
											isClearable
											classNamePrefix='select'
											options={investorsOptions}
											isLoading={investorsOptionsLoading}
											value={investorSelected}
											onChange={(val) => {
												setInvestorSelected(val);
											}}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup label='FIlter' id='filter'>
										<Select
											className='col-md-11'
											classNamePrefix='select'
											// options={activeFilterSubGroupsOptions}
											// value={activeFilterSubGroupsSelected}
											// onChange={(val) => {
											// 	setActiveFilterSubGroupsSelected(val);
											// }}
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

										<ViewAllAccounts
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
