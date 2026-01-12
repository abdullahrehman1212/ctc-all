// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import Select, { createFilter } from 'react-select';
import moment from 'moment';

import Flatpickr from 'react-flatpickr';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
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

import apiClient from '../../../../baseURL/apiClient';

import Input from '../../../../components/bootstrap/forms/Input';
import Add from './add';
import View from './View';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];
require('flatpickr/dist/flatpickr.css');

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState('');
	const [qoNo, setQoNo] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const [dateRange2, setDateRange2] = useState({ from: '', to: '', fulldate: '' });
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getQuotationlist?records=${store.data.salesManagementModule.quotation.perPage}&pageNo=${
					store.data.salesManagementModule.quotation.pageNo
				}&colName=id&sort=desc
				&customer_id=${selectedCustomer ? selectedCustomer.id : ''}&quotation_no=${qoNo}&from_date=${
					dateRange.from || ''
				}&to_date=${dateRange.to || ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data?.quotationlist?.data || []);
				setTableData2(response.data?.quotationlist || {});

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response?.data?.quotationlist,
						'salesManagementModule',
						'quotation',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
		apiClient.get(`getCustomersDropdown`).then((response) => {
			const rec = (response.data?.customers || []).map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.salesManagementModule.quotation.perPage, store.data.salesManagementModule.quotation.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Quotation Management List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label='Customer' id='customer_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={customerDropDown}
												isLoading={customerDropDownLoading}
												isClearable
												value={selectedCustomer}
												onChange={(val) => {
													setSelectedCustomer(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Quotation No' id='quotation_no'>
											<Input
												id='quotation_no'
												onChange={(e) => {
													setQoNo(e.target.value);
												}}
												value={qoNo}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup id='request' label='Request Date Range'>
											<Flatpickr
												className='form-control'
												value={dateRange.fullDate || ''}
												options={{
													mode: 'range',
													dateFormat: 'd-m-Y',
												}}
												onChange={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												onClose={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												id='default-picker'
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
								// lastRecord={lastRecord}
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
