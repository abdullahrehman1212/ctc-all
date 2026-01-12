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
const Viewnew = ({ viewItem }) => {
	// eslint-disable-next-line no-console
	console.log('The item is:', viewItem);
	return (
		<div className='col-md-12'>
			<div className='row p-1'>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							OEM Number:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.oem_part_number
								?.number1 ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Part Number:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.oem_part_number
								?.number2 ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
			</div>
			<hr />
			<div className='row p-1'>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Category:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.machine_part
								?.subcategories?.categories?.name ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Sub Category:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.machine_part
								?.subcategories?.name ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Item:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.machine_part?.name ??
								'none'}
						</strong>
					</CardSubTitle>
				</div>
			</div>
			<hr />
			<div className='row p-1'>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Item Type:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.machine_part?.type
								?.name ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Unit:{' '}
							{viewItem?.itemOemDetail?.machine_part_oem_part?.machine_part?.unit
								?.name ?? 'none'}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Part Model:{' '}
							{viewItem.itemOemDetail.machine_model?.machine_partmodel?.name ??
								'none'}
						</strong>
					</CardSubTitle>
				</div>
			</div>
			<hr />
			<div className='row p-1'>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							{' '}
							Machine:{' '}
							{viewItem?.itemOemDetail.machines &&
								viewItem.itemOemDetail.machines
									.map((machines) => machines?.name)
									.join(',')}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							{' '}
							Make:{' '}
							{viewItem?.itemOemDetail.makes &&
								viewItem.itemOemDetail.makes.map((makes) => makes?.name).join(',')}
						</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>
							Model:{' '}
							{viewItem?.itemOemDetail.machine_models &&
								viewItem.itemOemDetail.machine_models
									.map((machine_models) => machine_models?.name)
									.join(',')}
						</strong>
					</CardSubTitle>
				</div>
			</div>
			<hr />
			<div className='row p-1'>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>Brand: {viewItem?.itemOemDetail.brand?.name ?? 'none'}</strong>
					</CardSubTitle>
				</div>
				<div className='col-md-4'>
					<CardSubTitle>
						<strong>Origin: {viewItem?.itemOemDetail.origin?.name ?? 'none'}</strong>
					</CardSubTitle>
				</div>
			</div>
			<hr />

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Dimension</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.itemOemDetail.dimension?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item?.dimension_id?.name}</td>
									<td>{item?.value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr. No.</th>
								<th>Brand</th>
								{/* <th>Category</th> */}
								<th>OEM Number</th>
								<th>Part Number</th>
								<th>Origin</th>
								{/* <th>Part Model</th> */}
							</tr>
						</thead>
						<tbody>
							{viewItem?.alternate_brand?.map((item, index) => (
								<tr key={item?.brands_id}>
									<td>{index + 1}</td>
									<td>{item?.alternate_brands?.name}</td>

									<td>
										{viewItem?.itemOemDetail.machine_part_oem_part
											?.oem_part_number?.number1 ?? 'none'}
									</td>
									<td>{item?.number3}</td>
									<td>{viewItem?.itemOemDetail.origin?.name ?? 'none'}</td>
									{/* <td>{item.machine_part_oem_part.machine_partmodel?.name}</td> */}
								</tr>
							))}

							{/* {viewItem?.otherItemsWithSameOemNumber?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item?.brand?.name}</td>

									<td>{item.machine_part_oem_part.oem_part_number.number1}</td>
									<td>{item.machine_part_oem_part.oem_part_number?.number2}</td>
									<td>{item?.origin?.name}</td>
								</tr>
							))} */}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Viewnew;
