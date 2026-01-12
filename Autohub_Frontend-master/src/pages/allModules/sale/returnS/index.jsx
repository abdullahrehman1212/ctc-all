/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */

/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import ReactSelect from 'react-select';
import { useFormik } from 'formik';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import Input from '../../../../components/bootstrap/forms/Input';
import Spinner from '../../../../components/bootstrap/Spinner';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import { customStyles2 } from '../../../customStyles/ReactSelectCustomStyle';

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
import apiClient from '../../../../baseURL/apiClient';
import { _titleError } from '../../../../notifyMessages/erroSuccess';

import View from './view';
// import Add from './add';
// import GeneratePDF from './pdf/Report';
// import ReportSoldItems from './pdf/ReportSoldItems';

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

	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);

	const [nameOptions, setNameOptions] = useState();
	const [nameLoading, setNameLoading] = useState(false);

	const [selectedName, setSelectedName] = useState('');

	const [typeOptions, setTypeOptions] = useState([]);
	const [typeLoading, setTypeLoading] = useState(false);
	const [selectedType, setSelectedType] = useState('');

	const [selectedStore, setSelectedStore] = useState('');

	const [customer, setCustomer] = useState('');
	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState(false);

	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);
	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);

	const [partModelsOptions, setPartModelsOptions] = useState([]);
	const [partModelsOptionsLoading, setPartModelsOptionsLoading] = useState(false);

	const refreshTableData = () => {
		setTableDataLoading(true);
		// apiClient.get(
		// 	`/getKits?records=${store.data.kitManagement.defineKit.perPage}&pageNo=${store.data.kitManagement.defineKit.pageNo}&colName=id&sort=asc&id=${selectedItem.id}`,
		// )
		apiClient
			.get(
				`/getReturnedSales?records=${
					store.data.salesManagementModule.sales.perPage
				}&pageNo=${
					store.data.salesManagementModule.sales.pageNo
				}&colName=id&sort=desc&&sort=desc&item_id=${
					formik.values.machine_part_id ? formik.values.machine_part_id : ''
				}&store_id=${selectedName ? selectedName.id : ''} &store_type_id=${
					selectedStore ? selectedStore.id : ''
				}&category_id=${
					formik.values.category_id ? formik.values.category_id : ''
				}&sub_category_id=${
					formik.values.sub_category_id ? formik.values.sub_category_id : ''
				}&part_model_id=${formik.values.part_model_id ? formik.values.part_model_id : ''}
				&walk_in_customer_name=${customer}&customer_id=${
					formik.values.customer_id ? formik.values.customer_id : ''
				}&type_id=${selectedType ? selectedType?.id : ''}`,
			)
			.then((response) => {
				// console.log('myres::', response.data.purchaseorderlist);
				setTableData(response.data.returnedsales.data);
				// setTableData2(response.data.purchaseorderlist);
				// console.log('bmk::tbdata::', response.data.data.data);
				// console.log('bmk::tbdata2::', response.data.data);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.returnedsales,
						'salesManagementModule',
						'sales',
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
			.get(`/getStoredropdown?store_type_id=2`)
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
		formik.setFieldValue('type_id', '');

		setTypeLoading(true);

		apiClient
			.get(`/getItemTypesDropdown`)
			.then((response) => {
				const rec = response.data.machinePartstypes?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setTypeOptions(rec);
				setTypeLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const printReportAll = (docType) => {
		setIsPrintAllReportLoading(true);

		// GeneratePDF(tableData, docType);
		showNotification(
			'Printing Transactions Report',
			'Printing  report Successfully',
			'success',
		);
		setIsPrintAllReportLoading(false);
	};
	const PrintReportSoldItems = (docType) => {
		// setIsPrintAllReportLoading(true);

		apiClient
			.get(`/getSalesDetails?store_id=${selectedName ? selectedName.id : ''}`)
			.then((response) => {
				// ReportSoldItems(response.data.invoices_child, docType);
				// showNotification('Success', 'Printing  report Successfully', 'success');
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});

		setIsPrintAllReportLoading(false);
	};

	const formik = useFormik({
		initialValues: {
			name: '',
			kit_name: '',
			customer_id: '',
			category_name: '',
			category_id: '',
			sub_category_id: '',
			machine_part_id: '',
			part_model_id: '',
		},
		// onSubmit: () => {
		// 	setIsLoading(true);
		// 	setTimeout(handleSave, 2000);
		// },
	});

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.salesManagementModule.sales.perPage,
		store.data.salesManagementModule.sales.pageNo,
		formik.values.machine_part_id,
	]);

	useEffect(() => {
		refreshDropdowns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const refreshDropdowns = (index) => {
		setCustomerDropDownLoading(true);
		apiClient
			.get(
				`/getPersons?person_type_id=1&part_model_id=${
					formik.values.part_model_id ? formik.values.part_model_id : ''
				}&isActive=`,
			)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name, phone_no }) => ({
					id,
					value: id,
					label: `${id}-${name}-${phone_no ?? ''}`,
					personName: name,
				}));
				setCustomerDropDown(rec);
				setCustomerDropDownLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	};
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

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Return Sale Orders </CardTitle>
								</CardLabel>
								{/* <CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions> */}
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									{/* <div className='col-md-3'>
										<FormGroup label='Shop' id='name'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={nameOptions}
												isLoading={nameLoading}
												isClearable
												value={selectedName}
												onChange={(val) => {
													setSelectedName(val);
													// setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div> */}

									<div className='col-md-3'>
										<FormGroup label='Item Type' id='type_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={typeOptions}
												isLoading={typeLoading}
												isClearable
												value={selectedType}
												onChange={(val) => {
													setSelectedType(val);
													// setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup id='machine_part_id' label='Item'>
											<ReactSelect
												isLoading={machinePartsOptionsLoading}
												options={machinePartsOptions}
												isClearable
												styles={customStyles2}
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

									<div className='col-md-3'>
										<FormGroup
											id='customer_id'
											label='Customer'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
												isLoading={customerDropDownLoading}
												options={customerDropDown}
												value={
													formik.values.customer_id
														? customerDropDown?.find(
																(c) =>
																	c.value ===
																	formik.values.customer_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'customer_id',
														val !== null && val.id,
													);
												}}
												invalidFeedback={formik.errors.customer_id}
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup label='Customer Name' id='customer'>
											<Input
												id='name'
												type='text'
												onChange={(e) => {
													setCustomer(e.target.value);
												}}
												value={customer}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-1'>
										<Button
											color='primary'
											onClick={() => refreshTableData()}
											isOutline
											isActive>
											Search
										</Button>
									</div>
								</div>
								<br />
								{/* <div className='row g-4 d-flex align-items-end justify-content-end'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Print Invoices Report'}
									</Button>

									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => PrintReportSoldItems(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Print Sold Parts Report'}
									</Button>
								</div> */}
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
