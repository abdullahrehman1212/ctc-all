// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
// ** Axios Imports

// eslint-disable-next-line import/no-unresolved

import {
	CardSubTitle,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const ViewInvoice = ({ invoiceData }) => {
	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<CardSubTitle>
					<strong> Store: {invoiceData?.parentData?.store?.name}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong> Store Type: {invoiceData?.parentData?.store_type?.name}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong>Invoice No: {invoiceData?.parentData?.invoice_no}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong>Remarks: {invoiceData?.parentData?.remarks}</strong>
				</CardSubTitle>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-12'>
					<table className='table table-modern'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Item</th>
								<th>Quantity</th>
								<th>Price</th>
							</tr>
						</thead>
						<tbody>
							{invoiceData?.parentData?.childData?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item.item.name}</td>

									<td>{item.received_quantity}</td>
									<td>{item.price}</td>
								</tr>
							))}
						</tbody>
						<tr>
							<td colSpan='5'>
								<div className='d-flex justify-content-end h5'>Total</div>
							</td>
							<td>
								<div className='d-flex justify-content-center h5'>
									{invoiceData !== null
										? Number(
												invoiceData?.parentData?.total_amount?.reduce(
													// eslint-disable-next-line no-return-assign
													(a, v) =>
														(a += parseFloat(
															v !== undefined ? v.amount : 0,
														)),
													0,
												),
										  )
										: 0}
								</div>
							</td>
						</tr>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Amount:</strong>
						</CardLabel>
						<CardLabel>
							PKR{' '}
							{invoiceData?.parentData?.total_amount?.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</CardLabel>
					</div>

					{/* <div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Total After Discount :</strong>
						</CardLabel>
						<CardLabel>
							PKR{' '}
							{invoiceData?.parentData.total_after_discount?.toLocaleString(
								undefined,
								{
									maximumFractionDigits: 2,
								},
							)}
						</CardLabel>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default ViewInvoice;
