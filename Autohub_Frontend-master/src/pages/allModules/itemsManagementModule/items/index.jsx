// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** ApiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import apiClient from '../../../../baseURL/apiClient';

import Button from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import Input from '../../../../components/bootstrap/forms/Input';
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

import { _titleError } from '../../../../notifyMessages/erroSuccess';

import View from './view';
import Add from './add';

export const searchByOptions = [{ value: 1, text: 'Id' }];
// export const categoryOptions = [
// 	{ value: 0, text: 'qqq' },
// 	{ value: 1, text: 'www' },
// 	{ value: 2, text: 'eee' },
// ];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [categoryOptions, setCategoryOptions] = useState([]);
	// const [itemOptions, setItemOptions] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSubCategory, setSelectedSubCategory] = useState('');
	const [selectedType, setSelectedType] = useState('');
	// const [selectedItem, setSelectedItem] = useState('');
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);
	const [catOptionsLoading, setCatOptionsLoading] = useState(false);

	const [typeOptions, setTypeOptions] = useState([]);
	const [typeOptionsLoading, setTypeOptionsLoading] = useState(false);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [oemNo2, setOemNo2] = useState('');

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
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getMachineParts?records=${
					store.data.itemsManagementModule.items.perPage
				}&pageNo=${
					store.data.itemsManagementModule.items.pageNo
				}&colName=id&sort=desc&category_id=${
					selectedCategory ? selectedCategory.id : ''
				}&sub_category_id=${selectedSubCategory ? selectedSubCategory.id : ''}&type_id=${
					selectedType ? selectedType.id : ''
				}
				&name2=${oemNo2}`,
			)
			.then((response) => {
				console.log('pp:', response.data);
				setTableData(response.data.machine_Parts.data);
				setTableData2(response.data.machine_Parts);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.machine_Parts,
						'itemsManagementModule',
						'items',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};
	useEffect(() => {
		setCatOptionsLoading(true);
		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				// console.log('ppp:', rec);
				setCategoryOptions(rec);
				setCatOptionsLoading(false);
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
		setSubOptionsLoading(true);

		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${
					selectedCategory ? selectedCategory.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubCategoryOptions(rec);
				setSubOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

	useEffect(() => {
		setTypeOptionsLoading(true);

		apiClient
			.get(
				`/getItemTypesDropdown?sub_category_id=${
					selectedSubCategory ? selectedSubCategory.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machinePartstypes?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setTypeOptions(rec);
				setTypeOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSubCategory]);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.itemsManagementModule.items.perPage,
		store.data.itemsManagementModule.items.pageNo,
	]);

	console.log('The reponse of item type is:', typeOptions, subCategoryOptions);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Item List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<br />
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-3'>
										<FormGroup label='Category' id='category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryOptions}
												isLoading={catOptionsLoading}
												isClearable
												value={selectedCategory}
												onChange={(val) => {
													setSelectedCategory(val);
													setSelectedSubCategory('');
													setSelectedType('');
													setOemNo2('');
												}}
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Sub Category' id='sub_category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subCategoryOptions}
												isLoading={subOptionsLoading}
												isClearable
												value={selectedSubCategory}
												onChange={(val) => {
													setSelectedSubCategory(val);
													setSelectedType('');
													setOemNo2('');
												}}
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Item Type' id='type_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={typeOptions}
												isLoading={typeOptionsLoading}
												isClearable
												value={selectedType}
												onChange={(val) => {
													setSelectedType(val);
													setOemNo2('');
												}}
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Item Name' id='oem_id2'>
											<Input
												id='oem2FileNo'
												type='text'
												onChange={(e) => {
													setOemNo2(e.target.value);
												}}
												value={oemNo2}
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
