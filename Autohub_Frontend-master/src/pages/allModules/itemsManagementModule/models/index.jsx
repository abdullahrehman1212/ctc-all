// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';

import Input from '../../../../components/bootstrap/forms/Input';

import apiClient from '../../../../baseURL/apiClient';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
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

// import showNotification from '../../../../components/extras/showNotification';
import Button from '../../../../components/bootstrap/Button';
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
	const [makeOptions, setMakeOptions] = useState();
	const [selectedMake, setSelectedMake] = useState('');
	const [machineOptions, setMachineOptions] = useState([]);
	const [selectedMachine, setSelectedMachine] = useState('');
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [selectedModelName, setSelectedModelName] = useState('');
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getMachineModels?records=${
					store.data.itemsManagementModule.models.perPage
				}&pageNo=${
					store.data.itemsManagementModule.models.pageNo
				}&colName=id&sort=asc&machine_id=${
					selectedMachine ? selectedMachine.id : ''
				}&make_id=${selectedMake ? selectedMake.id : ''}&model_name=${selectedModelName}`,
			)
			.then((response) => {
				setTableData(response.data.machineModels.data);
				setTableData2(response.data.machineModels);
				// console.log('bmk::tbdata::', response.data.machineModels.data);
				// console.log('bmk::tbdata2::', response.data.machineModels);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.machineModels,
						'itemsManagementModule',
						'models',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const customStyles = {
		option: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
		singleValue: (provided) => ({
		  ...provided,
		  color: 'black !important',
		}),
	  };
	useEffect(() => {
		apiClient
			.get(`/getMachinesDropDown`)
			.then((response) => {
				const rec = response.data.machines.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setMachineOptions(rec);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		apiClient
			.get(`/getMakesDropDown`)
			.then((response) => {
				const rec = response.data.makes.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setMakeOptions(rec);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.itemsManagementModule.models.perPage,
		store.data.itemsManagementModule.models.pageNo,
	]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Model List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								{/* <div className='row g-4'>
									<FormGroup className='col-md-2' label='Category'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setCategoryOptionsSelected({
													value: e.target.value,
												});
											}}
											value={categoryOptionsSelected.value}
											list={categoryOptions}
										/>
									</FormGroup>
								</div> */}
								<br />

								<br />
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-3'>
										<FormGroup label='Machine' id='machine'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={machineOptions}
												isClearable
												value={selectedMachine}
												onChange={(val) => {
													setSelectedMachine(val);
												}}
												styles={customStyles}
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup label='Make' id='make'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={makeOptions}
												isClearable
												value={selectedMake}
												onChange={(val) => {
													setSelectedMake(val);
												}}
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Model Name' id='oem_id2'>
											<Input
												id='selectedModelName'
												type='text'
												onChange={(e) => {
													setSelectedModelName(e.target.value);
												}}
												value={selectedModelName}
												// validFeedback='Looks good!'
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
