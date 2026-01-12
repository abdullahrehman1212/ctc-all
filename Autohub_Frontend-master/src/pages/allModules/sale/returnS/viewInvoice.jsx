// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
// ** Axios Imports

// eslint-disable-next-line import/no-unresolved

import {
	CardSubTitle,
	// eslint-disable-next-line no-unused-vars

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const ViewInvoice = ({ invoiceData }) => {
	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<CardSubTitle>
					<strong> Date: {invoiceData.parentData?.date ?? 'none'}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong> Shop: {invoiceData.parentData?.store?.name ?? 'none'}</strong>
				</CardSubTitle>

				<CardSubTitle>
					<strong>Invoice No: {invoiceData.parentData?.invoice_no ?? 'none'}</strong>
				</CardSubTitle>
				{invoiceData.parentData?.sale_type === 2 ? (
					<CardSubTitle>
						<strong>Sale Type : Registered Customer</strong>
					</CardSubTitle>
				) : (
					<CardSubTitle>
						<strong>Sale Type : Walk in Customer</strong>
					</CardSubTitle>
				)}
				{invoiceData.parentData?.sale_type === 2 ? (
					<CardSubTitle>
						<strong>Customer Name: {invoiceData.parentData.customer.name}</strong>
					</CardSubTitle>
				) : (
					<CardSubTitle>
						<strong>
							Customer Name: {invoiceData.parentData?.walk_in_customer_name}
						</strong>
					</CardSubTitle>
				)}

				<CardSubTitle>
					<strong>Remarks: {invoiceData.parentData?.remarks ?? 'none'}</strong>
				</CardSubTitle>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-12'>
					<table className='table table-modern'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>OEM/ Part No</th>
								<th>Item</th>
								<th>Brand</th>
								<th>Model</th>
								<th>Uom</th>
								<th>Quantity</th>
								{/* <th>Return Qty</th> */}
								<th>Price</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{invoiceData?.childData?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>
										{item.item.machine_part_oem_part.oem_part_number.number1} /
										{item.item.machine_part_oem_part.oem_part_number?.number2}
										{/* <div className='small text-muted'>
												{
													item.item?.machine_part_oem_part
														?.oem_part_number?.number2
												}
											</div> */}
									</td>

									<td>{item.item?.machine_part_oem_part?.machine_part?.name}</td>
									<td>{item.item.brand.name}</td>
									<td>
										{item.item.machine_part_oem_part.machine_partmodel?.name}
									</td>
									<td>
										{item.item.machine_part_oem_part.machine_part.unit.name}
									</td>

									<td>
										{item?.quantity.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
									{/* <td>
										{item?.returned_quantity.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td> */}

									<td>
										{item?.price.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
									<td>
										{(item.price * item.quantity).toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Amount:</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{invoiceData.parentData?.total_amount?.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}
							</strong>
						</CardLabel>
					</div>

					<div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Discount :</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{invoiceData?.parentData?.discount?.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}
							</strong>
						</CardLabel>
					</div>

					<div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong>Total After Discount :</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{invoiceData?.parentData?.total_after_discount?.toLocaleString(
									undefined,
									{
										maximumFractionDigits: 2,
									},
								)}
							</strong>
						</CardLabel>
					</div>

					{invoiceData?.parentData?.tax_type === 2 ? (
						<>
							<div className='d-flex justify-content-end mt-2'>
								<CardLabel>
									<strong>GST :</strong>
								</CardLabel>
								<CardLabel>
									<strong>
										PKR{' '}
										{invoiceData?.parentData?.gst?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</strong>
								</CardLabel>
							</div>
							<div className='d-flex justify-content-end mt-2'>
								<CardLabel>
									<strong> Total After GST :</strong>
								</CardLabel>
								<CardLabel>
									<strong>
										PKR{' '}
										{invoiceData?.parentData?.total_after_gst?.toLocaleString(
											undefined,
											{
												maximumFractionDigits: 2,
											},
										)}
									</strong>
								</CardLabel>
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ViewInvoice;
