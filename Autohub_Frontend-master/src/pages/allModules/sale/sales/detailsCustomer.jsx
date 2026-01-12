// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
// ** Axios Imports

// eslint-disable-next-line import/no-unresolved
import moment from 'moment';

import {
	CardSubTitle,
	// eslint-disable-next-line no-unused-vars
	CardHeader,

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../components/bootstrap/Card';

const DetailsCustomer = ({ customerDetails }) => {
	return (
		<div className='col-12'>
			<div className='row g-4 '>
				<div className='col-md-6 border-end '>
					<CardSubTitle>
						<strong> Sale Price History</strong>
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
							{customerDetails?.Salehistory.invoice_child?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>
										{item?.price?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</td>

									{item.invoice.sale_type === 2 ? (
										<td>{item?.invoice.customer.name}</td>
									) : (
										<td>{item?.invoice.walk_in_customer_name}</td>
									)}
									<td>{moment(item?.invoice.date).format('MM-DD-YYYY')}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className='col-md-6 border-start '>
					<CardSubTitle>
						<strong> Sale Price History Party</strong>
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
							{customerDetails?.customersalehistory.invoice_child?.map(
								(item, index) => (
									<tr key={item.id}>
										<td>{index + 1}</td>
										<td>
											{item?.price?.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											}) ?? 0}
										</td>

										{item.invoice.sale_type === 2 ? (
											<td>{item?.invoice.customer.name}</td>
										) : (
											<td>{item?.invoice.walk_in_customer_name}</td>
										)}
										<td>{moment(item?.invoice.date).format('MM-DD-YYYY')}</td>
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default DetailsCustomer;
