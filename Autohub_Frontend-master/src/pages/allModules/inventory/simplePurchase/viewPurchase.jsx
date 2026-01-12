// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
// ** Axios Imports

// import moment from 'moment';
// eslint-disable-next-line import/no-unresolved

import {
	CardSubTitle,
	// eslint-disable-next-line no-unused-vars

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const ViewPurchase = ({ purchaseDetails }) => {
	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<CardSubTitle>
					<strong>
						{' '}
						Date: {purchaseDetails?.purchaseorderlist?.request_date ?? 'none'}
					</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong>
						{' '}
						Store: {purchaseDetails?.purchaseorderlist?.store?.name ?? 'none'}
					</strong>
				</CardSubTitle>

				<CardSubTitle>
					<strong>PO No: {purchaseDetails?.purchaseorderlist?.po_no}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong>
						Remarks: {purchaseDetails?.purchaseorderlist?.remarks ?? 'none'}
					</strong>
				</CardSubTitle>
				{/* <CardSubTitle>
					<strong>{`Status : ${
						// eslint-disable-next-line no-nested-ternary
						purchaseDetails?.purchaseorderlist?.is_approve === 0 &&
						purchaseDetails?.purchaseorderlist?.is_received === 0
							? 'Pending'
							: purchaseDetails?.purchaseorderlist?.is_approve === 1 &&
							  purchaseDetails?.purchaseorderlist?.is_received === 0
							? 'Approved'
							: 'Received'
					}`}</strong>
				</CardSubTitle> */}
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>

								<th>OEM/ Part No</th>
								<th>Item</th>
								<th>Brand</th>
								<th>Model</th>
								<th>Uom</th>
								<th>Quantity</th>
								<th>Purchase Price</th>
								<th>Amount</th>
								<th>Remarks</th>
							</tr>
						</thead>
						<tbody>
							{purchaseDetails?.purchaseorderlist?.purchaseorderchild?.map(
								(item, index) => (
									<tr key={item.id}>
										<td>{index + 1}</td>
										<td>
											{
												item?.item?.machine_part_oem_part?.oem_part_number
													?.number1
											}{' '}
											/
											{
												item?.item?.machine_part_oem_part?.oem_part_number
													?.number2
											}
											{/* <div className='small text-muted'>
												{
													item.item?.machine_part_oem_part
														?.oem_part_number?.number2
												}
											</div> */}
										</td>

										<td>
											{item.item?.machine_part_oem_part?.machine_part?.name}
										</td>
										<td>{item.item?.brand.name}</td>
										<td>
											{
												item.item?.machine_part_oem_part.machine_partmodel
													?.name
											}
										</td>
										<td>
											{
												item.item?.machine_part_oem_part.machine_part.unit
													.name
											}
										</td>
										<td>{item?.quantity}</td>
										<td>{item?.purchase_price ?? 'none'}</td>
										<td>{item?.amount ?? 'none'}</td>
										<td>{item?.remarks}</td>
									</tr>
								),
							)}
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Amount=</strong>
						</CardLabel>
						<CardLabel>
							<strong>PKR {purchaseDetails?.purchaseorderlist?.total ?? 0}</strong>
						</CardLabel>
					</div>
					{/* <div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong> Tax =</strong>
						</CardLabel>
						<CardLabel>
							<strong>{purchaseDetails?.purchaseorderlist?.tax ?? 0}%</strong>
						</CardLabel>
					</div> */}
					{/* <div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong> Tax in Figure =</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR {purchaseDetails?.purchaseorderlist?.tax_in_figure ?? 0}
							</strong>
						</CardLabel>
					</div> */}
					{/* <div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Discount =</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.purchaseorderlist?.discount?.toLocaleString(
									undefined,
									{
										maximumFractionDigits: 2,
									},
								)}
							</strong>
						</CardLabel>
					</div> */}
					{/* <div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Grand Total=</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.purchaseorderlist?.total_after_discount?.toLocaleString(
									undefined,
									{
										maximumFractionDigits: 2,
									},
								)}
							</strong>
						</CardLabel>
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default ViewPurchase;
