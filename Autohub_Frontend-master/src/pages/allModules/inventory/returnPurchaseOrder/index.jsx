/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line camelcase
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

// eslint-disable-next-line import/no-duplicates
import Select from 'react-select';
// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-duplicates
import ReactSelect from 'react-select';
import { useFormik } from 'formik';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
// eslint-disable-next-line import/no-unresolved
import Input from '../../../../components/bootstrap/forms/Input';
import { updateSingleState } from '../../redux/tableCrud/index';
import Modal, {
	ModalBody,
	ModalHeader,
	ModalTitle,
	ModalFooter,
} from '../../../../components/bootstrap/Modal';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
} from '../../../../components/bootstrap/Card';
import showNotification from '../../../../components/extras/showNotification';
import Spinner from '../../../../components/bootstrap/Spinner';

import apiClient from '../../../../baseURL/apiClient';
import { _titleError } from '../../../../notifyMessages/erroSuccess';

import View from './view';
import ReturnOrder from './ReturnOrder';
import ReportReturnPurchasedItems from './pdfs/ReportReturnPurchasedItems';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const [machinePartsOptions, setMachinePartsOptions] = useState([]);
	const [machinePartsOptionsLoading, setMachinePartsOptionsLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [kitOptions, setKitOptions] = useState([]);
	const [kitOptionsLoading, setKitOptionsLoading] = useState(false);
	const [selectedItem, setSelectedItem] = useState('');
	const [po, setPO] = useState('');
	const [selectedName, setSelectedName] = useState('');
	const [brandOptionsLoading, setBrandOptionsLoading] = useState(false);
	const [storeTypeOptions, setStoreTypeOptions] = useState();
	const [returnData, setReturnData] = useState({});
	const [stateReturn, setStateReturn] = useState(false);
	const [returnItemsLoading, setReturnItemsLoading] = useState(false);
	const [headerCloseStatusReturn, setHeaderCloseStatusReturn] = useState(true);
	const [selectedStore, setSelectedStore] = useState('');
	const [nameOptions, setNameOptions] = useState();
	const [nameLoading, setNameLoading] = useState(false);

	const refreshTableData = () => {
		setTableDataLoading(true);

		apiClient
			.get(
				`/getReturnedPolist?po_type=1&records=${
					store.data.purchaseOrderManagement.returnPurchaseList.perPage
				}&pageNo=${
					store.data.purchaseOrderManagement.returnPurchaseList.pageNo
				}&colName=id&sort=desc&supplier_id=${selectedItem ? selectedItem.id : ''}
				&item_id=${formik.values.machine_part_id ? formik.values.machine_part_id : ''}
				&po_no=${po}`,
			)
			.then((response) => {
				setTableData(response.data.returnedpurchaseorderlist.data);
				setTableData2(response.data.returnedpurchaseorderlist);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.returnedpurchaseorderlist,
						'purchaseOrderManagement',
						'returnPurchaseList',
						'tableData',
					]),
				);
			})

			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};
	useEffect(() => {
		apiClient
			.get(
				`/getPersons?person_type_id=2&part_model_id=${
					formik.values.part_model_id ? formik.values.part_model_id : ''
				}&isActive=`,
			)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: `${id}-${name}`,
					personName: name,
				}));
				setKitOptions(rec);
				setKitOptionsLoading(false);
			})
			// eslint-disable-next-line no-console
			.catch((err) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const formik = useFormik({
		initialValues: {
			name: '',
			kit_name: '',
			po_no: '',
			machine_part_id: '',
		},
	});
	const initialStatusReturn = () => {
		setHeaderCloseStatusReturn(true);
	};

	const handleStateReturn = (status) => {
		refreshTableData();
		setStateReturn(status);
	};
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		store.data.purchaseOrderManagement.returnPurchaseList.perPage,
		store.data.purchaseOrderManagement.returnPurchaseList.pageNo,
		formik.values.machine_part_id,
	]);

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
		setNameLoading(true);
		apiClient
			.get(`/getStoredropdown`)
			.then((response) => {
				const rec = response.data.store.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSelectedName(rec[0]);
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
	}, []);
	useEffect(() => {
		// refreshTableData();
		apiClient
			.get(`/getStoreTypeDropDown`)
			.then((response) => {
				const rec = response.data.storeType.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSelectedStore(rec[0]);
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
	}, []);
	const getReturnFunc = (idd) => {
		setReturnItemsLoading(true);
		apiClient
			.get(`/editPurchaseOrder?id=${idd}`)
			.then((res) => {
				// console.log('recev state', res.data.data);
				setReturnData(res.data.data);
				setReturnItemsLoading(false);
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});
	};

	const PrintReportPurchasedItems = (docType) => {
		// setIsPrintAllReportLoading(true);

		apiClient
			.get(`/getReturnedPolist?po_type=1&records=${
					store.data.purchaseOrderManagement.returnPurchaseList.perPage
				}&pageNo=${
					store.data.purchaseOrderManagement.returnPurchaseList.pageNo
				}&colName=id&sort=desc&supplier_id=${selectedItem ? selectedItem.id : ''}
				&item_id=${formik.values.machine_part_id ? formik.values.machine_part_id : ''}
				&po_no=${po}`)
			.then((response) => {
				ReportReturnPurchasedItems(response.data.returnedpurchaseorderlist.data, docType);
				// showNotification('Success', 'Printing  report Successfully', 'success');
			})
			.catch((err) => {
				// showNotification(_titleError, err.message, 'Danger');
			});

		setIsPrintAllReportLoading(false);
	};
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Return Purchase Orders </CardTitle>
								</CardLabel>
								<CardActions>
									{/* <Button
										color='danger'
										isLight
										icon='Add'
										hoverShadow='default'
										onClick={() => {
											initialStatusReturn();
											setStateReturn(true);
											getReturnFunc();
										}}>
										Return
									</Button> */}
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label='Suppliers' id='kit_name'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={kitOptions}
												isLoading={kitOptionsLoading}
												isClearable
												value={selectedItem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
											/>
										</FormGroup>
									</div>
									{/* <div className='col-md-2'>
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
									<div className='col-md-2'>
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
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='PO.No' id='po_no'>
											<Input
												id='name'
												type='text'
												onChange={(e) => {
													setPO(e.target.value);
												}}
												value={po}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
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
								<div className='row g-4 d-flex align-items-end justify-content-end'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-3 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => PrintReportPurchasedItems(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Print Return Purchase Order Report'}
									</Button>
								</div>
								<br />
							</CardBody>
							{/* Return Modal */}
							<Modal
								isOpen={stateReturn}
								setIsOpen={setStateReturn}
								titleId='ReTurnPurchaseOrder'
								size='xl'>
								<ModalHeader
									setIsOpen={headerCloseStatusReturn ? setStateReturn : null}>
									<ModalTitle id='ReturnPurchaseOrder'>
										{' '}
										<CardHeader>
											<CardLabel icon='Edit' iconColor='info'>
												<CardTitle>Return Purchase Order</CardTitle>
											</CardLabel>
										</CardHeader>
									</ModalTitle>
								</ModalHeader>
								<ModalBody>
									<div className='row g-4'>
										{/* <div className='col-12'>
											{returnItemsLoading ? (
												<div className='d-flex justify-content-center'>
													<Spinner color='primary' size='5rem' />
												</div>
											) : (
												<ReturnOrder
													returnData={returnData}
													handleStateReturn={handleStateReturn}
												/>
											)}
											<CardFooter>
												<CardFooterLeft>
													<Button
														color='info'
														icon='cancel'
														isOutline
														className='border-0'
														onClick={() => setStateReturn(false)}>
														Cancel
													</Button>
												</CardFooterLeft>
											</CardFooter>
										</div> */}
									</div>
								</ModalBody>
								<ModalFooter />
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
