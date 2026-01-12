// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
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

const ViewInvoice = ({ purchaseDetails }) => {
	console.log('The invoice purchase is:', purchaseDetails);
	// eslint-disable-next-line no-unused-vars
	const [totalExpense, setTotalExpense] = useState(0);
	// const [newList, setNewList] = useState([]);
	// useEffect(() => {
	// 	calculateExpenses();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
	// const calculateExpenses = () => {
	// 	// formik.values.expenseList.forEach((item) => {});
	// 	const t =
	// 		purchaseDetails?.purchaseorderlist?.purchase_expenses !== null
	// 			? parseFloat(
	// 					purchaseDetails?.purchaseorderlist?.purchase_expenses.reduce(
	// 						// eslint-disable-next-line no-return-assign
	// 						(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
	// 						0,
	// 					),
	// 			  )
	// 			: 0;
	// 	setTotalExpense(t);
	// 	const myArray = [];
	// 	purchaseDetails?.childData.forEach((item) => {
	// 		myArray.push({
	// 			...item,
	// 			percentAge: (item.amount * 100) / purchaseDetails.parentData.total ?? 0,
	// 			cost: (((item.amount * 100) / purchaseDetails.parentData.total) * t) / 100,
	// 			costPerItem:
	// 				(((item.amount * 100) / purchaseDetails.parentData.total) * t) /
	// 					100 /
	// 					item.received_quantity ?? 0,
	// 			// costPerItem:
	// 			// 	((item.amount * 100 ?? 0 / formik.values.total ?? 1) * t) /
	// 			// 	100 /
	// 			// 	item.received_quantity,
	// 		});
	// 	});

	// 	setNewList(myArray);
	// };
	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<strong>
					{' '}
					Supplier: {purchaseDetails?.parentData?.purchaseorder.supplier?.name ?? 'none'}
				</strong>

				<strong>
					{' '}
					Store: {purchaseDetails?.parentData?.purchaseorder.store?.name ?? 'none'}
				</strong>
				<strong>Return Date: {purchaseDetails?.parentData?.return_date}</strong>
				<strong>PO No: {purchaseDetails?.parentData?.purchaseorder.po_no}</strong>

				<strong>
					Remarks: {purchaseDetails?.parentData?.purchaseorder.remarks ?? 'none'}
				</strong>
				<strong>{`Status : ${
					// eslint-disable-next-line no-nested-ternary
					purchaseDetails?.parentData?.purchaseorder.is_approve === 0 &&
					purchaseDetails?.parentData?.purchaseorder.is_received === 0
						? 'Pending'
						: purchaseDetails?.parentData?.purchaseorder.is_approve === 1 &&
						  purchaseDetails?.parentData?.purchaseorder.is_received === 0
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
								<th>Model</th>
								<th>Uom</th>
								<th>Returned Quantity</th>

								<th>Purchase Price</th>
								<th>Amount</th>
								{/* <th>Cost %</th>
								<th>Cost</th>
								<th>Cost/ Unit</th> */}
								<th>Remarks</th>
							</tr>
						</thead>
						<tbody>
							{purchaseDetails?.childData?.map((item, index) => (
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
									<td>{item?.returned_quantity}</td>
									<td>
										{item?.purchase_price?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td>
									<td>
										{(
											item.returned_quantity * item.purchase_price
										)?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td>
									{/* <td>
										{item.percentAge?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td>
									<td>
										{item.cost?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td> */}
									{/* <td>
										{item.costPerItem?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td> */}

									<td>{item?.remarks}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Amount: </strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.parentData?.total.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								}) ?? 0}
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
					{/* <div className='d-flex justify-content-end  mt-2'>
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
					</div> */}
					<div className='d-flex justify-content-end  mt-2'>
						<CardLabel>
							<strong> Deduction:</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								{purchaseDetails?.parentData?.discount?.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}
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
								{purchaseDetails?.parentData?.total_after_discount?.toLocaleString(
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
			{/* <div className='row g-4 mt-2'>
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
			</div> */}
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

								<th>Discount</th>
								<th>Deduction</th>
								<th>Tax</th>
								<th>Total Bill Amount</th>

								<th>Unit Expense</th>
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
														<td>{item?.deduction}</td>
														<td>{item?.tax}</td>
														<td>{item?.total}</td>

														<td>{item2.unit_expense}</td>
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

export default ViewInvoice;
