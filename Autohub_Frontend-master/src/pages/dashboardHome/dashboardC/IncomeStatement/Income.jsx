import React, { useState, useEffect } from 'react';

import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Chart from '../../../../components/extras/Chart';

const AreaNegative = ({ dataMain, dataLoading }) => {
	// eslint-disable-next-line no-unused-vars
	const [graphDataRevenue, setGraphDataRevenue] = useState([]);
	const [graphDataCost, setGraphDataCost] = useState([]);
	const [graphDataExpense, setGraphDataExpense] = useState([]);
	const [graphDataIncome, setGraphDataIncome] = useState([]);
	const [graphCategories, setGraphCategories] = useState([]);
	const [state, setState] = useState();

	// eslint-disable-next-line no-unused-vars

	useEffect(() => {
		let cr = 0;
		let dr = 0;
		const dataListRevenue = [];
		const dataListExpense = [];
		const dataListCost = [];
		const dataListIncome = [];
		const dataMonths = [];
		if (dataMain.Data !== undefined) {
			dataMain.Data.forEach((dataStart) => {
				if (dataStart !== undefined) {
					dataStart.revenues.forEach((data) => {
						if (data.coa_sub_groups !== undefined) {
							data.coa_sub_groups.forEach((itemSubGroups) => {
								if (itemSubGroups.coa_accounts !== undefined) {
									itemSubGroups.coa_accounts.forEach((itemAccounts) => {
										if (itemAccounts.balance !== null) {
											if (itemAccounts.balance.balance > 0) {
												dr += itemAccounts.balance.balance;
											} else if (itemAccounts.balance.balance < 0) {
												cr += itemAccounts.balance.balance;
											}
										}
									});
								}
							});
						}
					});
				}
				dataListRevenue.push(Math.abs(cr - dr));
				cr = 0;
				dr = 0;
				if (dataStart !== undefined) {
					dataStart.expenses.forEach((data) => {
						if (data.coa_sub_groups !== undefined) {
							data.coa_sub_groups.forEach((itemSubGroups) => {
								if (itemSubGroups.coa_accounts !== undefined) {
									itemSubGroups.coa_accounts.forEach((itemAccounts) => {
										if (itemAccounts.balance !== null) {
											if (itemAccounts.balance.balance > 0) {
												dr += itemAccounts.balance.balance;
											} else if (itemAccounts.balance.balance < 0) {
												cr += itemAccounts.balance.balance;
											}
										}
									});
								}
							});
						}
					});
				}
				dataListExpense.push(Math.abs(cr - dr));
				cr = 0;
				dr = 0;
				if (dataStart !== undefined) {
					dataStart.cost.forEach((data) => {
						if (data.coa_sub_groups !== undefined) {
							data.coa_sub_groups.forEach((itemSubGroups) => {
								if (itemSubGroups.coa_accounts !== undefined) {
									itemSubGroups.coa_accounts.forEach((itemAccounts) => {
										if (itemAccounts.balance !== null) {
											if (itemAccounts.balance.balance > 0) {
												dr += itemAccounts.balance.balance;
											} else if (itemAccounts.balance.balance < 0) {
												cr += itemAccounts.balance.balance;
											}
										}
									});
								}
							});
						}
					});
				}
				dataListCost.push(Math.abs(cr - dr));
				cr = 0;
				dr = 0;
			});
		}
		if (dataMain.months !== undefined) {
			dataMain.months.forEach((dataStart) => {
				dataMonths.push(dataStart.Month);
			});
		}
		if (dataListCost) {
			dataListCost.forEach((data, index) => {
				dataListIncome.push(
					Number(dataListRevenue[index]) -
						(Number(dataListCost[index]) + Number(dataListExpense[index])),
				);
			});
		}
		setGraphCategories(dataMonths.reverse());
		setGraphDataRevenue(dataListRevenue.reverse());
		setGraphDataExpense(dataListExpense.reverse());
		setGraphDataCost(dataListCost.reverse());
		setGraphDataIncome(dataListIncome.reverse());
		// setGraphDataRevenue([...graphDataRevenue, Math.abs(cr - dr)]);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataMain]);

	useEffect(() => {
		setState({
			series: [
				// {
				// 	name: 'Revenue',
				// 	data: graphDataRevenue,
				// },
				// {
				// 	name: 'Expense',
				// 	data: graphDataExpense,
				// },
				// {
				// 	name: 'Cost',
				// 	data: graphDataCost,
				// },
				{
					name: 'Income',
					data: graphDataIncome,
				},
				// {
				// 	name: 'sede',
				// 	data: [130, 431, 335, 531, 49, 62, 69, 91, 148],
				// },
			],
			options: {
				chart: {
					type: 'area',
					height: 350,
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					curve: 'smooth',
				},

				title: {
					text: 'Net Income',
					align: 'left',
					style: {
						fontSize: '13px',
						fontWeight: 700,
					},
				},
				xaxis: {
					categories: graphCategories,
				},
				yaxis: {
					tickAmount: 5,
					floating: false,

					labels: {
						style: {
							colors: '#8e8da4',
						},
						offsetY: -7,
						offsetX: 0,
					},
					axisBorder: {
						show: true,
					},
					axisTicks: {
						show: true,
					},
				},
				fill: {
					opacity: 0.5,
				},
				tooltip: {
					x: {
						format: 'mm-yyyy',
					},
					fixed: {
						enabled: false,
						position: 'topRight',
					},
				},
				grid: {
					yaxis: {
						lines: {
							offsetX: -30,
							// width: 10,
						},
					},
					padding: {
						left: 20,
					},
				},
			},
		});
	}, [graphCategories, graphDataCost, graphDataExpense, graphDataIncome, graphDataRevenue]);

	return (
		<div className='col-lg-10'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='AreaChart'>
						<CardTitle>
							Net Income <small>area</small>
						</CardTitle>
						<CardSubTitle>Chart</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					{dataLoading === true ? (
						<h1>...</h1>
					) : (
						<Chart
							series={state?.series}
							options={state?.options}
							type='area'
							height={350}
						/>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default AreaNegative;
