import React, { useState } from 'react';

import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Chart from '../../../../components/extras/Chart';
// import CommonStoryBtn from '../../../../components/common/CommonStoryBtn';

const PieBasic = ({ data }) => {
	// eslint-disable-next-line no-unused-vars

	const [state] = useState({
		series: [data.total, data.total - data.received],
		options: {
			chart: {
				width: 380,
				type: 'pie',
			},
			labels: [`Received`, `Balance`],
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
						legend: {
							position: 'bottom',
						},
					},
				},
			],
		},
	});

	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='PieChart'>
						<CardTitle>
							Receivables <small>pie</small>
						</CardTitle>
						<CardSubTitle>Chart</CardSubTitle>
					</CardLabel>
					<CardActions>{/* <CommonStoryBtn to='/' /> */}</CardActions>
				</CardHeader>
				<CardBody>
					<Chart
						series={state.series}
						options={state.options}
						type={state.options.chart.type}
						width={state.options.chart.width}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default PieBasic;
