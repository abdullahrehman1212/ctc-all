import React from 'react';
import PropTypes from 'prop-types';

const Viewnew = ({ viewItem }) => {
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-2'>
					<h5>Id</h5>
					<p className='text-primary fw-bold'>{viewItem.adjustInventory.id}</p>
				</div>

				<div className='col-md-2'>
					<h5>Remarks</h5>
					<p className='text-primary fw-bold'>{viewItem.adjustInventory.remarks}</p>
				</div>
				<div className='col-md-2'>
					<h5>Date</h5>
					<p className='text-primary fw-bold'>{viewItem.adjustInventory.date}</p>
				</div>
				<div className='col-md-2'>
					<h5>Adjustment</h5>
					<p className='text-primary fw-bold'>{viewItem.adjustInventory.adjust_type} from Inventory</p>
				</div>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Category</th>
								<th>Sub Category</th>

								<th>Item</th>
								<th>Quantity</th>

								<th>Rate</th>

								<th>Amount</th>
							</tr>
						</thead>

						<tbody>
							{viewItem?.adjustInventory?.adjust_inventory_child?.map((item) => (
								<tr key={item.id}>
									<td>{item.item?.category?.name}</td>
									<td>{item.item?.subcategory?.name}</td>
									<td>{item.item?.name}</td>
									{/* <td>{item.quantity_in > 0 ? item.quantity_in : quantity_out}</td> */}
									<td>
										{Number(item.quantity_in) > 0
											? Number(item.quantity_in)
											: Number(item?.quantity_out)}
									</td>

									<td>{item.purchase_price}</td>
									<td>
										{item.total.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<br />
			<br />
			<div className='row justify-content-end mt-3'>
				<div className='col-md-4 border border-5 px-3 py-2 me-3'>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total:</div>
						<div className='col-6 text-end'>
							{viewItem.adjustInventory.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
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
							<tr>
								<td>{index}</td>

								<td>{viewItem?.adjustInventory?.expense_acount?.name}</td>
								<td>{viewItem?.adjustInventory?.vendor?.name}</td>
								<td>{viewItem?.adjustInventory?.expense_description}</td>
								<td>
									{viewItem?.adjustInventory?.expense_amount?.toLocaleString(
										undefined,
										{
											maximumFractionDigits: 2,
										},
									) ?? 'none'}
								</td>
							</tr>
							<tr>
								<td>{index}</td>

								<td>{viewItem?.adjustInventory?.unloading?.name}</td>
								<td />
								<td>{viewItem?.adjustInventory?.unloading_expense_description}</td>
								<td>
									{viewItem?.adjustInventory?.unloading_expense?.toLocaleString(
										undefined,
										{
											maximumFractionDigits: 2,
										},
									) ?? 'none'}
								</td>
							</tr>
							
						</tbody>
					</table>
					<div className='d-flex justify-content-end mt-2'>
						<CardLabel>
							<strong>Total Expenses=</strong>
						</CardLabel>
						<CardLabel>
							<strong>
								PKR{' '}
								
								{result}
							</strong>
						</CardLabel>
					</div>
				</div>
			</div> */}
		</div>
	);
};

Viewnew.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default Viewnew;
