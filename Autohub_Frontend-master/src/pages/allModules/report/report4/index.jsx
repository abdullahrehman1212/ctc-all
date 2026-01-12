/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable prettier/prettier */

/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

import Select from 'react-select';
import { useFormik } from 'formik';
import Spinner from '../../../../components/bootstrap/Spinner';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import showNotification from '../../../../components/extras/showNotification';
import apiClient from '../../../../baseURL/apiClient';
// import { _titleError } from '../../../../notifyMessages/erroSuccess';

// import View from './view';
import GeneratePDF from './pdf/Report';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [nameOptions, setNameOptions] = useState();
	const [nameLoading, setNameLoading] = useState(false);

	// const [kitOptions, setKitOptions] = useState([]);
	// const [kitOptionsLoading, setKitOptionsLoading] = useState(false);

	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);

	const [startDate, setStartDate] = useState('');
	const [startDate2, setStartDate2] = useState('');
	const [startDate3, setStartDate3] = useState('');
	const [endDate, setEndDate] = useState('');
	const [endDate2, setEndDate2] = useState('');
	const [endDate3, setEndDate3] = useState('');

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

	// useEffect(() => {
	// 	apiClient
	// 		.get(`/getActiveSuppliers`)

	// 		.then((response) => {
	// 			// console.log('bnnn::', response.data);
	// 			const rec = response.data.persons.map(({ id, name }) => ({
	// 				id,
	// 				value: id,
	// 				label: name,
	// 			}));
	// 			setKitOptions(rec);
	// 			setKitOptionsLoading(false);
	// 		})
	// 		// eslint-disable-next-line no-console
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const printReportAll = (docType) => {
		setIsPrintAllReportLoading(true);

		apiClient
			.get(
				`/getTransfersReport?records=${store.data.reportManagementModule.report1.perPage}&pageNo=${store.data.reportManagementModule.report1.pageNo}&colName=id&sort=desc&po_type=1&transfer_store_id=${formik.values.transfer_store_id}&from=${startDate3}&to=${endDate3}&receive_store_id=${formik.values.receive_store_id}`,
			)
			.then((response) => {
				GeneratePDF(response.data.stocTransfer, docType, startDate2, endDate2);
				showNotification(
					'Printing Transactions Report',
					'Printing  Report Successfully',
					'success',
				);
				setIsPrintAllReportLoading(false);

				dispatch(
					updateSingleState([
						response.data.purchaseorderlist,
						'reportManagementModule',
						'report1',
						'tableData',
					]),
				);
			});
	};

	const formik = useFormik({
		initialValues: {
			supplier_id: '',
			transfer_store_id: '',
			receive_store_id: '',
			machine_part_id: '',
			po_type: 1,
		},
	});

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Transfer report </CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup
											label='Transfer From Store'
											id='transfer_store_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={nameOptions}
												isLoading={nameLoading}
												isClearable
												value={
													formik.values.transfer_store_id
														? nameOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.transfer_store_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'transfer_store_id',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div>

									<div className='col-md-2'>
										<FormGroup label='Transfer To Store' id='receive_store_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={nameOptions}
												isLoading={nameLoading}
												isClearable
												value={
													formik.values.receive_store_id
														? nameOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.receive_store_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'receive_store_id',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div>

									{/* <div className='col-md-2'>
										<FormGroup label='Suppliers' id='supplier_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={kitOptions}
												isLoading={kitOptionsLoading}
												isClearable
												value={
													formik.values.supplier_id
														? kitOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.supplier_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'supplier_id',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div> */}
									<div className='col-md-2'>
										<FormGroup label='From' id='from'>
											<Flatpickr
												className='form-control'
												value={startDate}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													dateFormat: 'd/m/y',
													allowInput: true,
												}}
												onChange={(date, dateStr) => {
													setStartDate(dateStr);
													setStartDate2(date[0]);
													setStartDate3(
														date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
													);
												}}
												onClose={(date, dateStr) => {
													setStartDate(dateStr);
													setStartDate2(date[0]);
													setStartDate3(
														date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
													);
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>

									<div className='col-md-2'>
										<FormGroup label='To' id='to'>
											<Flatpickr
												className='form-control'
												value={endDate}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													dateFormat: 'd/m/y',
													allowInput: true,
												}}
												onChange={(date, dateStr) => {
													setEndDate(dateStr);
													setEndDate2(date[0]);
													setEndDate3(
														date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
													);
												}}
												onClose={(date, dateStr) => {
													setEndDate(dateStr);
													setEndDate2(date[0]);
													setEndDate3(
														date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
													);
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<Button
											// isDisable
											color='primary'
											// isLight={darkModeStatus}
											className={classNames('text-nowrap mt-4', {
												'border-light': true,
											})}
											icon={!isPrintAllReportLoading && 'FilePdfFill'}
											isDisable={isPrintAllReportLoading}
											onClick={() => printReportAll(2)}>
											{isPrintAllReportLoading && (
												<Spinner isSmall inButton />
											)}
											{isPrintAllReportLoading
												? 'Generating PDF...'
												: 'Print Report'}
										</Button>
									</div>
								</div>
								<br />
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Categories;
