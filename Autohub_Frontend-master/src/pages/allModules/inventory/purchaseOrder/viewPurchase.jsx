// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
// ** Axios Imports

// import moment from 'moment';
// eslint-disable-next-line import/no-unresolved

import {
	// CardSubTitle,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
	// CardTitle,
	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const ViewPurchase = ({ purchaseDetails }) => {
	// eslint-disable-next-line no-unused-vars
	const [totalExpense, setTotalExpense] = useState(0);
	const [newList, setNewList] = useState([]);
	useEffect(() => {
		calculateExpenses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const calculateExpenses = () => {
		// formik.values.expenseList.forEach((item) => {});
		const t =
			purchaseDetails?.purchaseorderlist?.purchase_expenses !== null
				? parseFloat(
						purchaseDetails?.purchaseorderlist?.purchase_expenses.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
							0,
						),
				  )
				: 0;
		setTotalExpense(t);
		const myArray = [];
		purchaseDetails?.purchaseorderlist?.purchaseorderchild.forEach((item) => {
			myArray.push({
				...item,
				percentAge: (item.amount * 100) / purchaseDetails.purchaseorderlist.total ?? 0,
				cost: (((item.amount * 100) / purchaseDetails.purchaseorderlist.total) * t) / 100,
				costPerItem:
					(((item.amount * 100) / purchaseDetails.purchaseorderlist.total) * t) /
						100 /
						item.received_quantity ?? 0,
				// costPerItem:
				// 	((item.amount * 100 ?? 0 / formik.values.total ?? 1) * t) /
				// 	100 /
				// 	item.received_quantity,
			});
		});

		setNewList(myArray);
	};

	console.log(
		'The purchase data of racka and shelf is:',
		purchaseDetails.purchaseorderlist.rack_shelf,
	);

	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<strong>
					{' '}
					Supplier: {purchaseDetails?.purchaseorderlist?.supplier?.name ?? 'none'}
				</strong>

				<strong> Store: {purchaseDetails?.purchaseorderlist?.store?.name ?? 'none'}</strong>
				<strong>Date: {purchaseDetails?.purchaseorderlist?.request_date}</strong>

				<strong>PO No: {purchaseDetails?.purchaseorderlist?.po_no}</strong>
				<strong>Remarks: {purchaseDetails?.purchaseorderlist?.remarks ?? 'none'}</strong>
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
								{/* <th>Model</th> */}
								<th>Uom</th>
								<th>Received Quantity</th>
								<th>Rack</th>
								<th>Shelf</th>
								<th>Purchase Price</th>
								<th>Amount</th>
								<th>Cost %</th>
								<th>Cost</th>
								<th>Cost/ Unit</th>
								<th>Remarks</th>
							</tr>
						</thead>
						<tbody>
							{newList?.map((item, index) => {
								return (
									<tr key={item.id}>
										<td>{index + 1}</td>

										<td>
											{
												item.item?.machine_part_oem_part.oem_part_number
													.number1
											}{' '}
											/
											{
												item.item?.machine_part_oem_part.oem_part_number
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
										{/* <td>
											{
												item.item?.machine_part_oem_part.machine_partmodel
													?.name
											}
										</td> */}
										<td>
											{
												item.item?.machine_part_oem_part.machine_part.unit
													.name
											}
										</td>
										<td>{item?.received_quantity}</td>
										<td>
											{/* {item?.racks?.map((rack, innerIndex) => (
												<span key={rack.id}>
													{rack.rack_number}
													{innerIndex < item.racks.length - 1 && ','}{' '}
												</span>
											))} */}
											{
												purchaseDetails?.purchaseorderlist?.rack_shelf[0]
													?.racks?.rack_number
											}
										</td>
										<td>
											{/* {item?.shelves?.map((shelf, innerIndex) => (
												<span key={shelf.id}>
													{shelf.shelf_number}
													{innerIndex < item.shelves.length - 1 &&
														','}{' '}
												</span>
											))} */}
											{
												purchaseDetails?.purchaseorderlist?.rack_shelf[0]
													?.shelves?.shelf_number
											}
										</td>
										<td>
											{item?.purchase_price?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>
										<td>
											{item?.amount?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>
										<td>
											{item.percentAge?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>
										<td>
											{item.cost?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>
										<td>
											{item.costPerItem?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>

										<td>{item?.remarks}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Amount: </strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.purchaseorderlist?.total.toLocaleString(
									undefined,
									{
										maximumFractionDigits: 2,
									},
								) ?? 0}
							</strong>
						</CardLabel>
					</div>
					{/* <div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong> Tax :</strong>
						</CardLabel>
						<CardLabel>
							<strong>{purchaseDetails?.purchaseorderlist?.tax ?? 0}%</strong>
						</CardLabel>
					</div> */}
					{/* <div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong>Tax in Figure :</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.purchaseorderlist?.tax_in_figure?.toLocaleString(
									undefined,
									{
										maximumFractionDigits: 2,
									},
								)}
							</strong>
						</CardLabel>
					</div> */}
					<div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong>Discount :</strong>
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
					</div>
					<div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Grand Total:</strong>
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
					</div>
				</div>
			</div>
			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Expenses</th>
								<th>Payable Account</th>
								<th>Description</th>

								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{purchaseDetails?.purchaseorderlist?.purchase_expenses?.map(
								(item, index) => (
									<tr key={item.id}>
										<td>{index + 1}</td>

										<td>{item?.expense_type?.name}</td>
										<td>
											{item?.coa_account?.code}-{item?.coa_account?.name}
										</td>
										<td>{item?.description}</td>
										<td>
											{item?.amount.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 'none'}
										</td>
									</tr>
								),
							)}
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Expenses=</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{totalExpense?.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								}) ?? 0}
							</strong>
						</CardLabel>
					</div>
				</div>
			</div>
			{/* <div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<div className='d-flex justify-content-between '>
						<CardLabel>
							<h5> Return Details</h5>
						</CardLabel>
					</div>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Name</th>
								<th>Returned Qty</th>

								<th>Purchase Price</th>
								<th>Amount</th>

								<th>Deduction</th>
								<th>Total Bill Amount</th>

							</tr>
						</thead>
						<tbody>
							{purchaseDetails?.purchaseorderlist?.purchase_order_return?.map(
								(item) => (
									<React.Fragment key={item.id}>
										{item.return_purchase_order_child?.map((item2, index) => {
											if (item2.returned_quantity > 0) {
												return (
													<tr key={item2.id}>
														<td>{index + 1}</td>
														<td>{item2?.item.name}</td>
														<td>{item2.returned_quantity}</td>

														<td>{item2.purchase_price}</td>
														<td>{item2.amount}</td>
														<td>{item?.discount}</td>
														<td>{item?.total}</td>

													</tr>
												);
											}
											return null;
										})}
									</React.Fragment>
								),
							)}
						</tbody>
					</table>
					
				</div>
			</div> */}
		</div>
	);
};

export default ViewPurchase;
