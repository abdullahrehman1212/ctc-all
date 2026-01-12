import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { updateSingleState } from '../../redux/tableCrud/index';
import { useNavigate, demoPages, Cookies } from '../../../../baseURL/authMultiExport';
import Button from '../../../../components/bootstrap/Button';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Input from '../../../../components/bootstrap/forms/Input';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import View from './view';
import Add from './add';
import showNotification from '../../../../components/extras/showNotification';

import { _titleError } from '../../../../notifyMessages/erroSuccess';

const List = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const store = useSelector((state) => state.tableCrud);
	const [tableData, setTableData] = useState([]);
	const [supplierOptions, setSupplierOptions] = useState();
	const [supplierOptionsLoading, setSupplierOptionsLoading] = useState(false);
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [tableDataLoading, setTableDataLoading] = useState(false);
	const [selectedSupplier, setSelectedSupplier] = useState({
		id: `${0}`,
		label: '',
	});
	// const baseURL2 = 'http://localhost/MMH-Backend';
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getSupplierLedger?supplier_id=${selectedSupplier.id}&records=${
					store.data.suppliersManagementModule.ledger.perPage
				}&pageNo=${
					store.data.suppliersManagementModule.ledger.pageNo
				}&colName=id&sort=asc&from_date=${fromDate}&${
					toDate !== '' && `&to_date=${toDate}`
				}`,
			)
			.then((response) => {
				setTableDataLoading(false);
				setTableData(response.data.supplierledger.data);
				dispatch(
					updateSingleState([
						response.data.supplierledger.data,
						'suppliersManagementModule',
						'ledger',
						'tableData',
					]),
				);
				dispatch(
					updateSingleState([
						response.data.supplierledger,
						'suppliersManagementModule',
						'ledger',
						'others',
					]),
				);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, 'No Data Found, Please Select a Supplier', 'Danger');
				if (err.response.status === 401) {
					showNotification(
						_titleError,
						'No Data Found, Please Select a Supplier',
						'Danger',
					);

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
	};

	useEffect(() => {
		apiClient
			.get(`/getPersons?person_type_id=2`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setSupplierOptions(rec);
				setSupplierOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');

					Cookies.remove('userToken');
					navigate(`/${demoPages.login.path}`, { replace: true });
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Supplier Ledger</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label='Supplier' id='branch_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={supplierOptions}
												isLoading={supplierOptionsLoading}
												isClearable
												value={selectedSupplier?.label}
												onChange={(val) => {
													if (val !== null) {
														setSelectedSupplier({ id: val.id });
													} else {
														setSelectedSupplier({ id: '' });
													}
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup id='fromDate' label='From'>
											<Input
												id='fromDate'
												type='date'
												onChange={(e) => {
													setFromDate(e.target.value);
												}}
												value={fromDate}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup id='toDate' label='To'>
											<Input
												id='toDate'
												type='date'
												onChange={(e) => {
													setToDate(e.target.value);
												}}
												value={toDate}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<Button
											color='primary'
											onClick={() => refreshTableData()}
											isOutline
											// isDisable={landsViewLoading}
											isActive>
											Search
										</Button>
									</div>
								</div>
							</CardBody>
							<View
								tableData={tableData}
								refreshTableData={refreshTableData}
								tableDataLoading={tableDataLoading}
							/>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default List;
