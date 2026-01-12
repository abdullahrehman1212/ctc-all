import React from 'react';
import PropTypes from 'prop-types';

const Viewnew = ({ viewItem }) => {
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-2'>
					<h5> PO NO</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.po_no}</p>
				</div>
				<div className='col-md-2'>
					<h5> Supplier </h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.supplier?.name}</p>
				</div>
				<div className='col-md-2'>
					<h5> Total</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.total}</p>
				</div>
				<div className='col-md-2'>
					<h5> Discount</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.discount}</p>
				</div>
				<div className='col-md-2'>
					<h5> Tax</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.tax}</p>
				</div>
				<div className='col-md-2'>
					<h5> Remarks</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.remarks}</p>
				</div>
			</div>

			<br />
			<br />
			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Category</th>
								<th>Sub Category</th>
								<th>Quantity</th>

								<th>Rate</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.poChild?.map((item) => (
								<tr key={item.id}>
									<td>{item.item?.category?.name}</td>
									<td>{item.item?.subcategory?.name}</td>
									<td>{item.quantity}</td>
									<td>{item.rate}</td>

									<td>{item.total}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
Viewnew.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default Viewnew;
