// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
// import { priceFormat } from '../../../../helpers/helpers';

import Icon from '../../../../components/icon/Icon';
import useDarkMode from '../../../../hooks/useDarkMode';

// eslint-disable-next-line no-unused-vars
const SalesInvoice = ({ data }) => {
	// console.log("po+data:",data)

	const { darkModeStatus } = useDarkMode();
	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='People'>
						<CardTitle>Sales Invoice</CardTitle>
					</CardLabel>
					<CardActions>
						Current <strong>Status</strong>.
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className='row g-4 align-items-center'>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${
									darkModeStatus ? 'o25' : '10'
								}-warning rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='PersonOutline' size='3x' color='warning' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.total_sales}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>Number of Sales</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${
									darkModeStatus ? 'o25' : '10'
								}-info rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='AllInclusive' size='3x' color='info' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.totalSalePrice}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>Total Price of Sales</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${
									darkModeStatus ? 'o25' : '10'
								}-info rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='AllInclusive' size='3x' color='info' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.totalPayable[0]?.balance}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>Total Payable</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${
									darkModeStatus ? 'o25' : '10'
								}-info rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='AllInclusive' size='3x' color='info' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.totalReceivable[0]?.balance}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>Total Recievable</div>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default SalesInvoice;
