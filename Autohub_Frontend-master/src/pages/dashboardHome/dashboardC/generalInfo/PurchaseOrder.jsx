
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

// import CommonStoryBtn from '../../../../components/common/CommonStoryBtn';

// eslint-disable-next-line no-unused-vars
const PurchaseOrder = ({ data }) => {
	const { darkModeStatus } = useDarkMode();
	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='People'>
						<CardTitle>Purchase Orders</CardTitle>
					</CardLabel>
					<CardActions>
						Current <strong>Status</strong>.
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className='row g-4 align-items-center'>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
									}-warning rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='PersonOutline' size='3x' color='warning' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.pending_po}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>
										Pending POs
									</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
									}-info rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='AllInclusive' size='3x' color='info' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.unreceived_po}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>
										Unreceived POs
									</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
									}-primary rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='PersonOff' size='3x' color='primary' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>{data?.data?.numberOfPOs}</div>
									<div className={`mt-n2 truncate-line-1 ${!darkModeStatus ? 'text-muted' : ''}`}>
										Total POs
									</div>
								</div>
							</div>
						</div>
						<div className='col-xl-6'>
							<div
								className={`d-flex align-items-center bg-l${darkModeStatus ? 'o25' : '10'
									}-success rounded-2 p-3`}>
								<div className='flex-shrink-0'>
									<Icon icon='Timer' size='3x' color='success' />
								</div>
								<div className='flex-grow-1 ms-3'>
									<div className='fw-bold fs-3 mb-0'>-</div>
									<div className={`mt-n2 ${!darkModeStatus ? 'text-muted' : ''}`}>Others</div>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default PurchaseOrder;
