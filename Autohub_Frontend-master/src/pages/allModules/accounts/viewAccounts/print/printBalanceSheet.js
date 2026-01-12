// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// import Logo from '../../../../../assets/logos/logos/logo.png';

const GeneratePDF = (data1, type, startDate) => {
	// initialize jsPDF
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// Functions Starts
	// Functions Starts
	let totalAssets = 0;
	let totalLiabilities = 0;
	let totalCapital = 0;

	let sum2 = 0;
	let sum3 = 0;

	const CalcluateTotalAssets = (amount) => {
		totalAssets += parseFloat(amount);
	};
	const CalcluateTotalLiabilities = (amount) => {
		totalLiabilities += parseFloat(amount);
	};
	const CalcluateTotalCapital = (amount) => {
		totalCapital += parseFloat(amount);
	};
	const CalcluateTotalSum2 = (amount) => {
		sum2 += parseFloat(amount);
	};
	const CalcluateTotalSum3 = (amount) => {
		sum3 += parseFloat(amount);
	};
	// Functions Ends
	let yPos = 60;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 470, 20, 110, 80);
	yPos -= 10;
	doc.setFont(undefined, 'bold');
	doc.text(data3?.user?.company_name, pageWidth / 2, 55, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.setFont(undefined, 'normal');
	doc.text('Balance Sheet', pageWidth / 2, 70, { align: 'center' });
	// Start

	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 470, 20, 110, 80);
	// yPos += 10;

	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text(`As on ${moment(startDate).format('MMMM D, YYYY')}`, pageWidth / 2, 85, {
		align: 'center',
	});
	// Start
	const rowsMain = [];
	const columnsMain = [' ', ' '];

	// Assets Starts
	yPos += 20;
	doc.setFontSize(16);

	yPos -= 10;
	if (data1.assets !== undefined) {
		const tableHeader = [
			{
				// content: `Total Land in marlas:   ${data1.form1.file_no}`,
				content: `Assets`,
				colSpan: 2,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 14 },
			},
		];
		rowsMain.push(tableHeader);
		data1.assets.forEach((data) => {
			sum2 = 0;
			const tableHeader2 = [
				{
					// content: `Total Land in marlas:   ${data1.form1.file_no}`,
					content: `${data.code}-${data.name}`,
					colSpan: 2,
					rowSpan: 1,
					styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
				},
			];
			rowsMain.push(tableHeader2);
			if (data.non_depreciation_sub_groups !== undefined) {
				data.non_depreciation_sub_groups.forEach((itemSubGroups) => {
					sum3 = 0;
					const tableHeader3 = [
						{
							content: `      ${itemSubGroups.code}-${itemSubGroups.name}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
						},
					];
					rowsMain.push(tableHeader3);

					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							if (itemAccounts.balance !== null) {
								let TableData3 = [];

								TableData3 = [
									`         ${itemAccounts.code}-${itemAccounts.name}`,
									itemAccounts.balance.balance >= 0
										? `${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )}`
										: `(${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )})`,
								];

								rowsMain.push(TableData3);

								CalcluateTotalAssets(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum2(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum3(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
							}
						});
						/* ******* Level 3 Account End ******************************************** */
						const TableData4 = [
							{
								content: `      Total ${itemSubGroups.code}-${itemSubGroups.name}`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
							{
								content:
									sum3 >= 0
										? `${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })}`
										: `(${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })})`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
						];
						rowsMain.push(TableData4);
					}
				});
				/* ******* Level 2 Account Ends ******************************************** */

				const TableData5 = [
					{
						content: `   Total ${data.code}-${data.name}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
					{
						content:
							sum2 >= 0
								? `${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })}`
								: `(${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })})`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
				];
				rowsMain.push(TableData5);
			}
		});
		/* ******* Level 1 Account Ends ******************************************** */
		const tableTotal = [
			{
				content: `Total Assets`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: `${totalAssets.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
					lineWidth: 1,
					lineColor: [0, 0, 0],
				},
			},
		];
		rowsMain.push(tableTotal);
	}
	// Assets Ends
	// Liabilities starts

	if (data1.liabilities !== undefined) {
		const tableHeader = [
			{
				// content: `Total Land in marlas:   ${data1.form1.file_no}`,
				content: `Liabilities`,
				colSpan: 2,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 14 },
			},
		];
		rowsMain.push(tableHeader);
		data1.liabilities.forEach((data) => {
			sum2 = 0;
			const tableHeader2 = [
				{
					// content: `Total Land in marlas:   ${data1.form1.file_no}`,
					content: `${data.code}-${data.name}`,
					colSpan: 2,
					rowSpan: 1,
					styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
				},
			];
			rowsMain.push(tableHeader2);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					sum3 = 0;
					const tableHeader3 = [
						{
							content: `      ${itemSubGroups.code}-${itemSubGroups.name}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
						},
					];
					rowsMain.push(tableHeader3);

					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							if (itemAccounts.balance !== null) {
								let TableData3 = [];

								TableData3 = [
									`         ${itemAccounts.code}-${itemAccounts.name}`,
									itemAccounts.balance.balance <= 0
										? `${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )}`
										: `(${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )})`,
								];

								rowsMain.push(TableData3);

								CalcluateTotalLiabilities(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum2(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum3(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
							}
						});
						/* ******* Level 3 Account End ******************************************** */
						const TableData4 = [
							{
								content: `      Total ${itemSubGroups.code}-${itemSubGroups.name}`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
							{
								content:
									sum3 <= 0
										? `${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })}`
										: `(${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })})`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
						];
						rowsMain.push(TableData4);
					}
				});
				/* ******* Level 2 Account Ends ******************************************** */

				const TableData5 = [
					{
						content: `   Total ${data.code}-${data.name}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
					{
						content:
							sum2 <= 0
								? `${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })}`
								: `(${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })})`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
				];
				rowsMain.push(TableData5);
			}
		});
		/* ******* Level 1 Account Ends ******************************************** */
		const tableTotal = [
			{
				content: `Total Liabilities`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: ` ${
					totalCapital <= 0
						? `${Math.abs(totalLiabilities).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })}`
						: `(${Math.abs(totalLiabilities).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })})`
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
					lineWidth: 1,
					lineColor: [0, 0, 0],
				},
			},
		];
		rowsMain.push(tableTotal);
	}
	// Liabilities Ends
	// Capital Starts
	if (data1.capital !== undefined) {
		const tableHeader = [
			{
				// content: `Total Land in marlas:   ${data1.form1.file_no}`,
				content: `Owner's Equity`,
				colSpan: 2,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 14 },
			},
		];
		rowsMain.push(tableHeader);
		data1.capital.forEach((data) => {
			sum2 = 0;
			const tableHeader2 = [
				{
					// content: `Total Land in marlas:   ${data1.form1.file_no}`,
					content: `${data.code}-${data.name}`,
					colSpan: 2,
					rowSpan: 1,
					styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
				},
			];
			rowsMain.push(tableHeader2);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					sum3 = 0;
					const tableHeader3 = [
						{
							content: `      ${itemSubGroups.code}-${itemSubGroups.name}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
						},
					];
					rowsMain.push(tableHeader3);

					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							if (itemAccounts.balance !== null) {
								let TableData3 = [];

								TableData3 = [
									`         ${itemAccounts.code}-${itemAccounts.name}`,
									itemAccounts.balance.balance <= 0
										? `${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )}`
										: `(${Math.abs(itemAccounts.balance.balance).toLocaleString(
												undefined,
												{
													maximumFractionDigits: 2,
												},
										  )})`,
								];

								rowsMain.push(TableData3);

								CalcluateTotalCapital(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum2(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
								CalcluateTotalSum3(
									itemAccounts.balance && itemAccounts.balance.balance,
								);
							}
						});
						/* ******* Level 3 Account End ******************************************** */
						const TableData4 = [
							{
								content: `      Total ${itemSubGroups.code}-${itemSubGroups.name}`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
							{
								content:
									sum3 <= 0
										? `${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })}`
										: `(${Math.abs(sum3).toLocaleString(undefined, {
												maximumFractionDigits: 2,
										  })})`,
								colSpan: 1,
								rowSpan: 1,
								styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
							},
						];
						rowsMain.push(TableData4);
					}
				});
				/* ******* Level 2 Account Ends ******************************************** */

				const TableData5 = [
					{
						content: `   Total ${data.code}-${data.name}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
					{
						content:
							sum2 <= 0
								? `${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })}`
								: `(${Math.abs(sum2).toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })})`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'left', fontStyle: 'bold', fontSize: 14 },
					},
				];
				rowsMain.push(TableData5);
			}
		});
		/* ******* Level 1 Account Ends ******************************************** */

		if (data1.revExp !== null) {
			CalcluateTotalCapital(data1.revExp);
			let dataNetIncome = [];

			dataNetIncome = [
				`         Net Income`,
				data1.revExp <= 0
					? `${Math.abs(data1.revExp).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })}`
					: `(${Math.abs(data1.revExp).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })})`,
			];

			rowsMain.push(dataNetIncome);
		} else {
			let dataNetIncome = [];

			dataNetIncome = [`         Net Income}`, '0'];

			rowsMain.push(dataNetIncome);
		}

		const tableTotal = [
			{
				content: `Total Owner's Equity`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: ` ${
					totalCapital <= 0
						? `${Math.abs(totalCapital).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })}`
						: `(${Math.abs(totalCapital).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })})`
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
					lineWidth: 1,
					lineColor: [0, 0, 0],
				},
			},
		];
		rowsMain.push(tableTotal);
	}
	// Capital Ends
	const totalCapitalandLiabilities = [
		{
			content: `Total Liabilities and Owner's Equity`,
			colSpan: 1,
			rowSpan: 1,
			styles: {
				halign: 'left',
				fontStyle: 'bold',
				fontSize: 14,
			},
		},
		{
			content: ` ${
				totalCapital <= 0
					? `${Math.abs(totalCapital + totalLiabilities).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })}`
					: `(${Math.abs(totalCapital + totalLiabilities).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })})`
			}`,
			colSpan: 1,
			rowSpan: 1,
			styles: {
				halign: 'left',
				fontStyle: 'bold',
				fontSize: 14,
				lineWidth: 1,
				lineColor: [0, 0, 0],
			},
		},
	];
	rowsMain.push(totalCapitalandLiabilities);
	// End

	yPos += 15;
	doc.setFont(undefined, 'normal');

	// doc.text(`File no:`, 45, yPos);
	// doc.text(`${data1.form1.file_no}`, 90, yPos);
	// doc.text(`__________________`, 90, yPos);
	doc.setFontSize(10);

	doc.autoTable(columnsMain, rowsMain, {
		theme: 'plain',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		startY: yPos,
		styles: { fontSize: 12 },
	});
	yPos = doc.lastAutoTable.finalY + 20;
	// doc.text(`File name:`, 45, yPos);
	// doc.text(`${data1.form1.file_name}`, 105, yPos);
	// doc.text(`__________________`, 105, yPos);

	yPos += 5;
	// ****************** Main Details
	// doc.autoTable(columnsMain, rowsMain, { startY: yPos, styles: { fontSize: 8 } });
	// yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Total Land', 47, yPos);
	// yPos += 10;
	// ****************** Land Details

	// ****************** Cleared Land Details

	// doc.text('Logo', 47, 26);
	doc.text(`Date Printed: ${moment().format('DD/MM/YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(12);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('ABC Near GT Road Rawalpindi', 47, 26);
	// doc.text('Report I', 47, 32);
	doc.setFontSize(12);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');
	// Footer Starts
	doc.page = 1;
	// doc.text(150, yPos, `Print date: ${Date()}`);
	doc.page += 1;
	// Footer Ends
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
	let str = `Page ${doc.internal.getNumberOfPages()}`;
	// Total page number plugin only available in jspdf v1.0+
	if (typeof doc.putTotalPages === 'function') {
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.setFontSize(10);

	// eslint-disable-next-line prefer-destructuring
	const pageSize = doc.internal.pageSize;

	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`BalanceSheet${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
