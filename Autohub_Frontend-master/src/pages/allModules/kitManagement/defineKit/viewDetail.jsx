// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
// ** Axios Imports

// import moment from 'moment';
// eslint-disable-next-line import/no-unresolved

import {
	CardSubTitle,
	// eslint-disable-next-line no-unused-vars
	CardHeader,
	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const Return = ({ purchaseDetails }) => {
	return (
		<div className='col-12'>
			<div className='d-flex justify-content-between  '>
				<CardSubTitle>
					<strong> Supplier: {purchaseDetails?.parentData?.supplier.name}</strong>
				</CardSubTitle>
				<CardSubTitle>
					<strong>PO No: {purchaseDetails?.parentData?.po_no}</strong>
				</CardSubTitle>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Category</th>
								<th>Item</th>
								<th>Description</th>
								<th>Quantity</th>
								<th>Return Quantity</th>
							</tr>
						</thead>
						<tbody>
							{purchaseDetails?.childData?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item?.items?.category.name}</td>
									<td>{item?.items?.name}</td>
									<td>{item.packing_description}</td>
									<td>{item.quantity}</td>
									<td>
										{item.return_quantity !== null ? item.return_quantity : 0}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Return;
