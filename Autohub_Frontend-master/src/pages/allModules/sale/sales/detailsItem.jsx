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

const DetailsItems = ({ itemDetails }) => {
	return (
		<div className='col-12'>
			<div className='row g-4 '>
				<div className='col-md-6 border-end '>
					<CardSubTitle>
						<h4> Item Name: {itemDetails?.Salehistory?.name ?? 'none'}</h4>
					</CardSubTitle>
					<table className='table table-modern '>
						<thead>
							<tr>
								<th>Sr. No.</th>

								<th>Price</th>

								<th>Customer</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{itemDetails?.Salehistory?.invoice_child?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item?.price}</td>

									{item.invoice.sale_type === 2 ? (
										<td>{item?.invoice.customer.name}</td>
									) : (
										<td>{item?.invoice.walk_in_customer_name}</td>
									)}
									<td>{item?.invoice.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className='col-md-6 border-start '>
					<CardSubTitle>
						<h4> Item Name: {itemDetails?.customersalehistory?.name ?? 'none'}</h4>
					</CardSubTitle>
					<table className='table table-modern '>
						<thead>
							<tr>
								<th>Sr. No.</th>

								<th>Price</th>
								<th>Customer</th>
								<th>Date</th>
							</tr>
						</thead>
						<tbody>
							{itemDetails?.customersalehistory?.invoice_child?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item?.price}</td>

									{item.invoice.sale_type === 2 ? (
										<td>{item?.invoice.customer.name}</td>
									) : (
										<td>{item?.invoice.walk_in_customer_name}</td>
									)}
									<td>{item?.invoice.date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default DetailsItems;
