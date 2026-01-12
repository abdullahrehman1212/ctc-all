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

const PieBasic = () => {
	const [state] = useState({
		// series: [44, 55, 13, 43, 22],
		// series: [data.CommerPlots, data.ResidPlots],
		options: {
			chart: {
				width: 380,
				type: 'pie',
			},
			// labels: [
			// 	`Commercial Plots ${data.CommerPlots}`,
			// 	`Residential Plots ${data.ResidPlots}`,
			// 	`Total Plots ${data.totalPlots}`,
			// ],
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200,
						},
						legend: {
							position: 'left',
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
							PLots Types <small>pie</small>
						</CardTitle>
						<CardSubTitle>Chart</CardSubTitle>
					</CardLabel>
					<CardActions>{/* <CommonStoryBtn to='/' /> */}</CardActions>
				</CardHeader>
				<CardBody>
					<Chart
						series={state?.series}
						options={state?.options}
						type={state?.options?.chart?.type}
						width={state?.options?.chart?.width}
					/>
				</CardBody>
			</Card>
		</div>
	);
};

export default PieBasic;
