// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';

import Select from 'react-select';
import { useDispatch } from 'react-redux';
import Select2 from '../../../../components/bootstrap/forms/Select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import { updateSingleState } from '../../redux/tableCrud/index';
import AddSupplier from './add';

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

import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';

import ViewSupplier from './view';
import apiClient from '../../../../baseURL/apiClient';

export const searchByOptions = [
	{ value: 1, text: 'Name' },
	{ value: 2, text: 'Contact' },
	{ value: 3, text: 'CNIC' },
	{ value: 4, text: 'ID' },
];
const Index = () => {
	const dispatch = useDispatch();
	// const store = useSelector((state) => state.tableCrud);
	const [tableData, setTableData] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState([]);

	const [activeInactiveOptionSelected, setActiveInactiveOptionSelected] = useState({
		id: 1,
		value: 1,
		label: 'Active',
	});

	const [searchNo, setSearchNo] = useState('');
	const [searchBy, setSearchBy] = useState('1');

	const searchFilterTrigger = () => {
		setTableDataLoading(true);

		apiClient
			.get(
				`/getPersonsByPersonType?person_type_id=1&isActive=${
					activeInactiveOptionSelected.id !== 2 ? activeInactiveOptionSelected.id : ''
				}
				&${searchBy === '1' ? `name2=${searchNo}` : ''}${searchBy === '2' ? `phone_no=${searchNo}` : ''}${
					searchBy === '3' ? `cnic=${searchNo}` : ''
				}
			${searchBy === '4' ? `id=${searchNo}` : ''}`,
			)
			.then((response) => {
				setTableData(response.data.persons);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.persons,
						'customersManagementModule',
						'manage',
						'tableData',
					]),
				);
			})
			.catch((err) => console.log(err));
	};

	// const personTypesOptions = [
	// 	{ id: 1, person_type_id: 1, value: 1, label: 'Purchaser' },
	// 	{ id: 2, person_type_id: 2, value: 2, label: 'Seller' },
	// 	{ id: 3, person_type_id: 3, value: 3, label: 'Agent' },
	// 	{ id: 4, person_type_id: 4, value: 4, label: 'Client' },
	// 	{ id: 6, person_type_id: 6, value: 6, label: 'Invester' },
	// ];

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
	// useEffect(() => {
	// 	setTableDataLoading(true);

	// 	Axios.get(`${baseURL}/getPersons`)
	// 		.then((response) => {
	// 			setTableData(response.data.persons);
	// 			setTableDataLoading(false);
	// 		})
	// 		.catch((err) => console.log(err));
	// }, []);
	const refreshTableData = () => {
		setTableDataLoading(true);

		apiClient
			.get(
				`/getPersonsByPersonType?person_type_id=1&isActive=${
					activeInactiveOptionSelected.id !== 2 ? activeInactiveOptionSelected.id : ''
				}`,
			)
			.then((response) => {
				setTableData(response.data.persons);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.persons,
						'customersManagementModule',
						'manage',
						'tableData',
					]),
				);
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		// setTableDataLoading(true);
		refreshTableData();
		// Axios.get(
		// 	`${baseURL}/getPersons?person_type_id=${
		// 		personTypesOptionsSelected !== null ? personTypesOptionsSelected.id : ''
		// 	}	&isActive=${
		// 		activeInactiveOptionSelected !== 2 ? activeInactiveOptionSelected.id : ''
		// 	}`,
		// )
		// 	.then((response) => {
		// 		setTableRecords(response.data.persons);
		// 		setTableRecordsLoading(false);
		// 	})
		// 	.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<PageWrapper>
			<Page>
				<Card shadow='none' className='border-0'>
					<CardHeader className='px-0 pt-0'>
						<CardLabel icon='Group' iconColor='danger'>
							<CardTitle>Customers</CardTitle>
						</CardLabel>
						<CardActions>
							<AddSupplier
								refreshTableData={refreshTableData}
								tableDataLoading={tableDataLoading}
								tableData={tableData}
							/>
						</CardActions>
					</CardHeader>
					<CardBody className='px-0'>
						<>
							<div className='row g-4 d-flex align-items-end'>
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
							<br />

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

										<ViewSupplier
											tableDataLoading={tableDataLoading}
											tableData={tableData}
											refreshTableData={refreshTableData}
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

export default Index;
