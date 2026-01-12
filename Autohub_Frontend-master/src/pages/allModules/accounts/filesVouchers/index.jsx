import React, { useMemo } from 'react';

import Card, { CardTabItem } from '../../../../components/bootstrap/Card';

import PaymentVoucher from './PaymentVoucher/index';
import ReceiptVoucher from './ReceiptVoucher/index';
import JVVoucher from './JVVoucher/index';

// eslint-disable-next-line no-unused-vars
const TablePage = () => {
	const temp = 1;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const value = useMemo(() => ({ temp }), [temp]);
	return (
		<Card hasTab tabButtonColor='info'>
			<CardTabItem id='tab-item-1' title='Land Payment Voucher' icon='Architecture'>
				<PaymentVoucher value={value} />
			</CardTabItem>

			<CardTabItem id='tab-item-2' title='Land Receipt Voucher' icon='Architecture'>
				<div className='row'>
					<div className='col-12'>
						<ReceiptVoucher value={value} />
					</div>
				</div>
			</CardTabItem>

			<CardTabItem id='tab-item-3' title='Land Journal Voucher' icon='Architecture'>
				<div className='row'>
					<div className='col-12'>
						<JVVoucher value={value} />
					</div>
				</div>
			</CardTabItem>
		</Card>
	);
};

export default TablePage;
