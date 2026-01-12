// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React from 'react';
// ** Axios Imports

// import moment from 'moment';
// eslint-disable-next-line import/no-unresolved

import { CardSubTitle } from '../../../../components/bootstrap/Card';

// eslint-disable-next-line react/prop-types
const TransferView = ({ view }) => {
	return (
		<div className='col-md-12'>
			<div className='d-flex justify-content-between  '>
				<CardSubTitle>
					<strong> Date: {view?.date ?? 'none'}</strong>
				</CardSubTitle>

				<CardSubTitle>
					<strong> Tranfer From: {view?.storetransfer?.name ?? 'none'}</strong>
				</CardSubTitle>

				<CardSubTitle>
					<strong>Transfer To: {view?.storereceive?.name ?? 'none'}</strong>
				</CardSubTitle>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Category</th>
								<th>Sub Category</th>
								<th>Item</th>
								<th>OEM</th>
								<th>Qty Transferred</th>
							</tr>
						</thead>
						<tbody>
							{view?.stockchildren?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>
										{
											item?.item?.machine_part_oem_part?.machine_part
												?.subcategories?.categories?.name
										}
									</td>
									<td>
										{
											item?.item?.machine_part_oem_part?.machine_part
												?.subcategories?.name
										}
									</td>
									<td>{item.item?.name}</td>
									<td>
										{item.item?.machine_part_oem_part?.oem_part_number?.number1}
										<div className='small text-muted'>
											{
												item.item?.machine_part_oem_part?.oem_part_number
													?.number2
											}
										</div>
									</td>

									<td>{item?.transfer_quanitiy}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default TransferView;
