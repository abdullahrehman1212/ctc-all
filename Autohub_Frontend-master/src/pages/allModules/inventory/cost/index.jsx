// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { useFormik } from 'formik';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import classNames from 'classnames';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import Spinner from '../../../../components/bootstrap/Spinner';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import showNotification from '../../../../components/extras/showNotification';
import { customStyles2 } from '../../../customStyles/ReactSelectCustomStyle';
import { _titleError } from '../../../../notifyMessages/erroSuccess';
import apiClient from '../../../../baseURL/apiClient';
import View from './view';
import GeneratePDF from './Report';
import EditBulk from './editBulk';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataBulkEdit, setTableDataBulkEdit] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [editDataLoading, setEditDataLoading] = useState(true);

	const [editingItem, setEditingItem] = useState(false);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const [stateEdit, setStateEdit] = useState(false);
	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);
	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(false);
	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [categoryOption, setCategoryOptions] = useState();
	const [categoryLoading, setCategoryLoading] = useState(false);
	const [selectedCat, setSelectedCat] = useState('');
	const [selectedSub, setSelectedSub] = useState('');
	const [subOptions, setSubOptions] = useState();
	const [subLoading, setSubLoading] = useState(false);
	const [partsOptions, setPartsOptions] = useState();
	const [partLoading, setPartLoading] = useState(false);
	const [selectedParts, setSelectedParts] = useState('');
	const [selectedItems, setSelectedItems] = useState('');
	const [itemsOptions, setItemsOptions] = useState();
	const [itemsLoading, setItemsLoading] = useState(false);
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
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
	const printReportAll = (docType) => {
		setIsPrintAllReportLoading(true);
		apiClient
			.get(`/AverageOfItemPrice`)
			.then((response) => {
				setTableData2(response.data.PurchasePrice);
				setIsPrintAllReportLoading(false);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
		GeneratePDF(tableData2, docType);
		showNotification('Printing Cost Report', 'Printing  report Successfully', 'success');
		setIsPrintAllReportLoading(false);
	};

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/AverageOfItemPrice?records=${
					store.data.inventoryManagementModule.cost.perPage
				}&pageNo=${
					store.data.inventoryManagementModule.cost.pageNo
				}&colName=id&sort=desc&category_id=${selectedCat ? selectedCat.id : ''}
				&item_id=${formik.values.machine_part_id ? formik.values.machine_part_id : ''}
				&item_part_id=${selectedItems ? selectedItems.id : ''}&sub_category_id=${
					selectedSub ? selectedSub.id : ''
				}&machine_part_id=${selectedParts ? selectedParts.id : ''}`,
			)
			.then((response) => {
				setTableData(response.data.PurchasePrice.data);
				console.log('tableData', tableData);
				setTableData2(response.data.PurchasePrice);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.PurchasePrice,
						'inventoryManagementModule',
						'cost',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
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

	useEffect(() => {
		refreshTableData();
		setItemsLoading(true);
		apiClient
			.get(
				`/getMachinePartsModelsDropDown?machine_part_id=${
					selectedParts ? selectedParts.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.machinepartmodel?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setItemsOptions(rec);
				setItemsLoading(false);
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
		selectedParts,
		store.data.inventoryManagementModule.cost.perPage,
		store.data.inventoryManagementModule.cost.pageNo,
	]);
	useEffect(() => {
		setPartLoading(true);
		apiClient
			.get(`/getMachinePartsDropDown?sub_category_id=${selectedSub ? selectedSub.id : ''}`)
			.then((response) => {
				const rec = response.data.machine_Parts?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setPartsOptions(rec);
				setPartLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, [selectedSub]);

	const getDataforBulkEdit = async () => {
		const newArray = [];
		const promise = await store.data.inventoryManagementModule.cost?.tableData.data.forEach(
			(items) => {
				newArray.push(items.item);
			},
		);
		console.log('dtttt', newArray);
		const promise2 = await setTableDataBulkEdit(newArray);
		setStateEdit(true);
	};
	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
	};

	useEffect(() => {
		setCategoryLoading(true);
		apiClient
			.get(`/getCategoriesDropDown`)
			.then((response) => {
				const rec = response.data.categories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCategoryOptions(rec);
				setCategoryLoading(false);
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
		setSubLoading(true);
		apiClient
			.get(`/getSubCategoriesByCategory?category_id=${selectedCat ? selectedCat.id : ''}`)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
				setSubLoading(false);
			})

			// eslint-disable-next-line no-console
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
			});
	}, [selectedCat]);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.inventoryManagementModule.cost.perPage,
		store.data.inventoryManagementModule.cost.pageNo,
		formik.values.machine_part_id,
	]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Money'>
									<CardTitle>Parts Prices</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									{/* <div className='col-md-2'>
										<FormGroup label='Category' id='type_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryOption}
												isClearable
												value={selectedCat}
												onChange={(val) => {
													setSelectedCat(val);
													setSelectedSub('');
													setSelectedParts('');
													setSelectedItems('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Sub Category' id='name'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subOptions}
												isLoading={subLoading}
												isClearable
												value={selectedSub}
												onChange={(val) => {
													setSelectedSub(val);
													setSelectedParts('');
													setSelectedItems('');
												}}
											/>
										</FormGroup>
									</div> */}
									<div className='col-md-2'>
										<FormGroup label='Parts' id='name'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={partsOptions}
												isLoading={partLoading}
												isClearable
												value={selectedParts}
												onChange={(val) => {
													setSelectedParts(val);
													setSelectedItems('');
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
									{/* <div className='col-md-2'>
										<FormGroup label='Part Model' id='name'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={itemsOptions}
												isLoading={itemsLoading}
												isClearable
												value={selectedItems}
												onChange={(val) => {
													setSelectedItems(val);
												}}
											/>
										</FormGroup>
									</div> */}
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

								<FormGroup
									className='d-flex  align-items-end justify-content-end'
									label=''>
									<Button
										onClick={() => {
											getDataforBulkEdit();
										}}
										color='primary'
										className={classNames('text-nowrap', {
											'border-light': true,
										})}
										icon='Edit'>
										Edit All
									</Button>

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
								</FormGroup>
							</CardBody>

							<Modal
								isOpen={stateEdit}
								setIsOpen={setStateEdit}
								titleId='EditVoucher'
								size='lg'>
								<ModalHeader
									setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
									<ModalTitle id='editVoucher'>
										{' '}
										<CardHeader>
											<CardLabel icon='Edit' iconColor='info'>
												<CardTitle>Editing Prices</CardTitle>
												{/* <small> Item Id: {itemId}</small> */}
											</CardLabel>
										</CardHeader>
									</ModalTitle>
								</ModalHeader>
								<ModalBody>
									<div className='row g-4'>
										<div className='col-12'>
											{editingItemLoading ? (
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											) : (
												<EditBulk
													editData={tableDataBulkEdit}
													handleStateEdit={handleStateEdit}
													tableDataLoading={tableDataLoading}
												/>
											)}
											<CardFooter>
												<CardFooterRight>
													<Button
														color='info'
														icon='cancel'
														isOutline
														className='border-0'
														onClick={() => setStateEdit(false)}>
														Cancel
													</Button>
												</CardFooterRight>
											</CardFooter>
										</div>
									</div>
								</ModalBody>
								{/* <ModalFooter /> */}
							</Modal>

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
