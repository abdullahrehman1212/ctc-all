// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import showNotification from '../../../../components/extras/showNotification';

import { _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import View from './view';
import MakeKit from './makeKit';
import BreakKit from './breakKit';

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
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [storeTypeOptions, setStoreTypeOptions] = useState();
	const [nameOptions, setNameOptions] = useState();
	const [nameLoading, setNameLoading] = useState(false);
	const [selectedName, setSelectedName] = useState('');
	const [selectedStore, setSelectedStore] = useState('');
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getKitInventory?records=${
					store.data.inventoryManagementModule.kits.perPage
				}&pageNo=${
					store.data.inventoryManagementModule.kits.pageNo
				}&colName=id&sort=asc&store_type_id=${
					selectedStore ? selectedStore.id : ''
				}&store_id=${selectedName ? selectedName.id : ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.KitInventory.data);
				// setTableData2(response.data.KitInventory);
				// console.log('bmk::tbdata::', response.data.KitInventory.data);
				// console.log('bmk::tbdata2::', response.data.KitInventory);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.KitInventory,
						'inventoryManagementModule',
						'kits',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
			});
	};
	useEffect(() => {
		setNameLoading(true);
		apiClient
			.get(`/getStoredropdown?store_type_id=${selectedStore ? selectedStore.id : ''}`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setNameOptions(rec);
				setNameLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, [selectedStore]);
	useEffect(() => {
		refreshTableData();
		apiClient
			.get(`/getStoreTypeDropDown`)
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
				showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.inventoryManagementModule.kits.perPage,
		store.data.inventoryManagementModule.kits.pageNo,
	]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Inventory Kits</CardTitle>
								</CardLabel>
								<CardActions>
									<ButtonGroup>
										<div className='mx-3'>
											<MakeKit refreshTableData={refreshTableData} />
										</div>

										<BreakKit refreshTableData={refreshTableData} />
									</ButtonGroup>
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-3'>
										<FormGroup label='Store Type' id='type_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={storeTypeOptions}
												isClearable
												value={selectedStore}
												onChange={(val) => {
													setSelectedStore(val);
													setSelectedName('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Store Name' id='name'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={nameOptions}
												isLoading={nameLoading}
												isClearable
												value={selectedName}
												onChange={(val) => {
													setSelectedName(val);
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
