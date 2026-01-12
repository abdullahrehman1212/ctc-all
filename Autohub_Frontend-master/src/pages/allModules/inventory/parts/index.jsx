// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-duplicates */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import ReactSelect from 'react-select';

import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Spinner from '../../../../components/bootstrap/Spinner';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import showNotification from '../../../../components/extras/showNotification';
import { useNavigate } from '../../../../baseURL/authMultiExport';
import { _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';

import View from './view';
import Add from './add';

import MakeKit from './makeKit';
import BreakKit from './breakKit';
import GeneratePDF from './Report';
import GenerateExcel from './ReportExcel';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [storeTypeOptions, setStoreTypeOptions] = useState();
	const [nameOptions, setNameOptions] = useState();
	const [nameLoading, setNameLoading] = useState(false);
	const [selectedName, setSelectedName] = useState('');
	const [selectedStore, setSelectedStore] = useState('');
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const [isPrintAllExcelLoading, setIsPrintAllExcelLoading] = useState(false);
	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);
	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);
	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			category_name: '',
			category_id: '',
			sub_category_id: '',
			machine_part_id: '',
			part_model_id: '',
		},
	});

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
	const printReportAll = (docType) => {
		setIsPrintAllReportLoading(true);
		apiClient
			.get(`/getItemsInventory?records=${
					store.data.inventoryManagementModule.parts.perPage
				}&pageNo=${
					store.data.inventoryManagementModule.parts.pageNo
				}&colName=id&sort=desc`)
			.then((response) => {
				setTableData2(response?.data?.itemsInventory);
				setIsPrintAllReportLoading(false);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
		GeneratePDF(tableData2, docType);
		showNotification(
			'Printing Part Stock List Report',
			'Printing  report Successfully',
			'success',
		);
		setIsPrintAllReportLoading(false);
	};


	const printExcelAll = () => {
		setIsPrintAllExcelLoading(true);
		apiClient
			.get(`/getItemsInventory?records=${
					store.data.inventoryManagementModule.parts.perPage
				}&pageNo=${
					store.data.inventoryManagementModule.parts.pageNo
				}&colName=id&sort=desc`)
			.then((response) => {
				setTableData2(response?.data?.itemsInventory);
				setIsPrintAllExcelLoading(false);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
		GenerateExcel(tableData2);
		showNotification(
			'Printing Part Stock List Excel',
			'Printing  Excel Successfully',
			'success',
		);
		setIsPrintAllExcelLoading(false);
	};
	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');

		setSubOptionsLoading(true);

		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
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
	}, [formik.values.category_id]);
	useEffect(() => {
		formik.setFieldValue('machine_part_id', '');

		setMachinePartsOptionsLoading(true);
		setBrandOptionsLoading(true);

		apiClient
			.get(`/getItemOemDropDown`)
			.then((response) => {
				const rec = response.data.data.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				// console.log('The response in stock is:', rec);
				setMachinePartsOptions(rec);
				setMachinePartsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.sub_category_id]);

	// useEffect(() => {
	// 	formik.setFieldValue('machine_part_id', '');

	// 	setMachinePartsOptionsLoading(true);

	// 	apiClient
	// 		.get(
	// 			`/getMachinePartsDropDown?sub_category_id=${
	// 				formik.values.sub_category_id ? formik.values.sub_category_id : ''
	// 			}`,
	// 		)
	// 		.then((response) => {
	// 			const rec = response.data.machine_Parts?.map(({ id, name }) => ({
	// 				id,
	// 				value: id,
	// 				label: name,
	// 			}));
	// 			setMachinePartsOptions(rec);
	// 			setMachinePartsOptionsLoading(false);
	// 		})
	// 		// eslint-disable-next-line no-console
	// 		.catch((err) => {
	// 			// showNotification(_titleError, err.message, 'Danger');
	// 			if (err.response.status === 401) {
	// 				// showNotification(_titleError, err.response.data.message, 'Danger');
	// 			}
	// 		});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [formik.values.sub_category_id]);
	useEffect(() => {
		formik.setFieldValue('part_model_id', '');

		setPartModelsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${
					formik?.values?.machine_part_id ? formik?.values?.machine_part_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data?.machinepartmodel?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setPartModelsOptions(rec);
				setPartModelsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);

	useEffect(() => {
		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoriesOptions(rec);
				setCategoriesOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, []);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getItemsInventory?records=${
					store.data.inventoryManagementModule.parts.perPage
				}&pageNo=${
					store.data.inventoryManagementModule.parts.pageNo
				}&colName=id&sort=desc&item_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}&store_id=${selectedName ? selectedName.id : ''} &store_type_id=${
					selectedStore ? selectedStore.id : ''
				}&category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}&part_model_id=${formik.values.part_model_id ? formik.values.part_model_id : ''}`,
			)
			.then((response) => {
				setTableData(response.data.itemsInventory.data);
				setTableData2(response.data.itemsInventory);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.itemsInventory,
						'inventoryManagementModule',
						'parts',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
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
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
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
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.inventoryManagementModule.parts.perPage,
		store.data.inventoryManagementModule.parts.pageNo,
	]);

	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');

		setSubOptionsLoading(true);

		apiClient
			.get(
				`/getSubCategoriesByCategory?category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
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
	}, [formik.values.category_id]);
	useEffect(() => {
		formik.setFieldValue('machine_part_id', '');

		setMachinePartsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsDropDown?sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machine_Parts?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				// setMachinePartsOptions(rec);
				// setMachinePartsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.sub_category_id]);
	useEffect(() => {
		formik.setFieldValue('part_model_id', '');

		setPartModelsOptionsLoading(true);

		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machinepartmodel?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setPartModelsOptions(rec);
				setPartModelsOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.machine_part_id]);

	useEffect(() => {
		apiClient
			.get(`/getCategoriesDropDown?store_id=${selectedName ? selectedName.id : ''}`)
			.then((response) => {
				const rec = response.data.categories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoriesOptions(rec);
				setCategoriesOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, [selectedName]);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.inventoryManagementModule.parts.perPage,
		store.data.inventoryManagementModule.parts.pageNo,
		formik.values.machine_part_id,
	]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Inventory Stock</CardTitle>
								</CardLabel>
								{/* <CardActions>
									<ButtonGroup>
										<div className='mx-3'>
											<MakeKit refreshTableData={refreshTableData} />
										</div>

										<BreakKit refreshTableData={refreshTableData} />
									</ButtonGroup>
								</CardActions> */}
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-center '>
									{/* <div className='col-md-3'>
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
									</div> */}

									<div className='col-md-3'>
										<FormGroup id='category_id' label='Category'>
											<ReactSelect
												isLoading={categoriesOptionsLoading}
												options={categoriesOptions}
												isClearable
												value={
													formik.values.category_id
														? categoriesOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.category_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'category_id',
														val !== null && val.id,
													);
													formik.setFieldValue(
														'category_name',
														val !== null && val.label,
													);

													// getSubCategoriesByCategory(val.id);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Looks good!'
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='sub_category_id' label='Sub Category'>
											<ReactSelect
												isLoading={subOptionsLoading}
												options={subOption}
												isClearable
												value={
													formik.values.sub_category_id
														? subOption?.find(
																(c) =>
																	c.value ===
																	formik.values.sub_category_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sub_category_id',
														val !== null && val.id,
													);

													// getSubCategoriesByCategory(val.id);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Looks good!'
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='machine_part_id' label='Item'>
											<ReactSelect
												isLoading={machinePartsOptionsLoading}
												options={machinePartsOptions}
												isClearable
												// styles={customStyles2}
												value={
													formik.values.machine_part_id
														? machinePartsOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.machine_part_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'machine_part_id',
														val ? val.id : '',
													);

													// getSubCategoriesByCategory(val.id);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Looks good!'
												styles={customStyles}
											/>
										</FormGroup>
									</div>
									{/* <div className='col-md-3'>
										<FormGroup id='part_model_id' label='Part Model'>
											<ReactSelect
												isLoading={partModelsOptionsLoading}
												options={partModelsOptions}
												isClearable
												value={
													formik.values.part_model_id
														? partModelsOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.part_model_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'part_model_id',
														val !== null && val.id,
													);

													// getSubCategoriesByCategory(val.id);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div> */}
									<div className='col-md-2 mt-5'>
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
								<FormGroup
									className='d-flex  align-items-end justify-content-end'
									label=''>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Print Report'}
									</Button>

									<Button
										color='success'
									
										className={classNames('text-nowrap', {
											'border-light': true,
										})}
										icon={!isPrintAllExcelLoading && 'FileExcelFill'}
										isDisable={isPrintAllExcelLoading}
										onClick={() => printExcelAll()}>
										{isPrintAllExcelLoading && <Spinner isSmall inButton />}
										{isPrintAllExcelLoading
											? 'Generating Excel...'
											: 'Print Excel'}
									</Button>
								</FormGroup>
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
