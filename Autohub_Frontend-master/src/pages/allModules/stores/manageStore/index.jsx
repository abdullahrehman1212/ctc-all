// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import Button from '../../../../components/bootstrap/Button';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
// import showNotification from '../../../../components/extras/showNotification';
import apiClient from '../../../../baseURL/apiClient';
import { _titleError } from '../../../../notifyMessages/erroSuccess';

import View from './view';
import Add from './add';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [storeTypeOptions, setStoreTypeOptions] = useState();
	const [selectedStore, setSelectedStore] = useState('');
	const [tableDataLoading, setTableDataLoading] = useState(true);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getStores?records=${store.data.storesManagementModule.manage.perPage}&pageNo=${
					store.data.storesManagementModule.manage.pageNo
				}&colName=id&sort=asc&store_type_id=${selectedStore ? selectedStore.id : ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.stores.data);
				setTableData2(response.data.store);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.stores,
						'storesManagementModule',
						'manage',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	useEffect(() => {
		refreshTableData();
		apiClient
			.get(`/getStoreTypeDropDown?store_type_id=${selectedStore ? selectedStore.id : ''}`)
			.then((response) => {
				const rec = response.data.storeType.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setStoreTypeOptions(rec);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.storesManagementModule.manage.perPage,
		store.data.storesManagementModule.manage.pageNo,
	]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Stores List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-3'>
										<FormGroup label='Store Type' id='type'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={storeTypeOptions}
												isClearable
												value={selectedStore}
												onChange={(val) => {
													setSelectedStore(val);
												}}
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

								<br />

								<br />
							</CardBody>
							<View
								tableData={tableData}
								tableData2={tableData2}
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

export default Categories;
