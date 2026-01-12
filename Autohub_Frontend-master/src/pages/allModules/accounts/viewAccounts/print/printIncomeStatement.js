// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// import Logo from '../../../../../assets/logos/logos/logo.png';

const GeneratePDF = (data1, type, startDate, endDate) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// Functions Starts
	let count = 0;
	// Expense
	let drTotalExpenses = 0;
	let crTotalExpenses = 0;
	const calculateTotalExpensesCr = (amount) => {
		crTotalExpenses += parseFloat(Math.abs(amount));
	};
	const calculateTotalExpensesDr = (amount) => {
		drTotalExpenses += parseFloat(Math.abs(amount));
	};
	// Cost
	let crTotalCost = 0;
	let drTotalCost = 0;
	const calculateTotalCostDr = (amount) => {
		drTotalCost += parseFloat(Math.abs(amount));
	};
	const calculateTotalCostCr = (amount) => {
		crTotalCost += parseFloat(Math.abs(amount));
	};
	// Revenue
	let drTotalRevenue = 0;
	let crTotalRevenue = 0;

	const calcluateTotalRevenueDr = (amount) => {
		drTotalRevenue += parseFloat(Math.abs(amount));
	};

	const calcluateTotalRevenueCr = (amount) => {
		crTotalRevenue += parseFloat(Math.abs(amount));
	};

	// Functions Ends
	let yPos = 80;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 470, 20, 110, 80);
	// yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('INCOME STATEMENT', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text(
		`From ${moment(startDate).format('MMMM D, YYYY')} To ${moment(endDate).format(
			'MMMM D, YYYY',
		)}`,
		pageWidth / 2,
		55,
		{ align: 'center' },
	);
	// Start
	const rowsMain = [];
	const columnsMain = [' ', ' '];

	// revenues Starts
	if (data1.revenues !== undefined) {
		data1.revenues.forEach((data) => {
			const TableData = [`${data.name}:`, ''];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							if (itemAccounts.balance !== null) {
								TableData3 = [
									`     ${itemAccounts.code}-${itemAccounts.name}`,
									itemAccounts.balance.balance < 0
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

								if (itemAccounts.balance.balance > 0) {
									calcluateTotalRevenueDr(itemAccounts.balance.balance);
								} else {
									calcluateTotalRevenueCr(itemAccounts.balance.balance);
								}
								rowsMain.push(TableData3);
							}

							count += 1;
						});
					}
				});
			}
		});
		const TableData4 = [
			{
				content: `Total Revenues`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: `${
					crTotalRevenue - drTotalRevenue >= 0
						? Math.abs(crTotalRevenue - drTotalRevenue).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })
						: `(${Math.abs(crTotalRevenue - drTotalRevenue).toLocaleString(undefined, {
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
		rowsMain.push(TableData4);
	}
	// revenues Ends

	// COst Starts
	if (data1.cost !== undefined) {
		data1.cost.forEach((data) => {
			const TableData = [`${data.name}:`, ''];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							if (itemAccounts.balance !== null) {
								if (itemAccounts.balance !== null) {
									TableData3 = [
										`     ${itemAccounts.code}-${itemAccounts.name}`,
										itemAccounts.balance.balance > 0
											? `${Math.abs(
													itemAccounts.balance.balance,
											  ).toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })}`
											: `(${Math.abs(
													itemAccounts.balance.balance,
											  ).toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })})`,
									];
									if (itemAccounts.balance.balance > 0) {
										calculateTotalCostDr(itemAccounts.balance.balance);
									} else {
										calculateTotalCostCr(itemAccounts.balance.balance);
									}
								}
								rowsMain.push(TableData3);
							}

							count += 1;
						});
					}
				});
			}
		});
		const TableData4 = [
			{
				content: `Total Cost`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: `${
					drTotalCost - crTotalCost >= 0
						? Math.abs(drTotalCost - crTotalCost).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })
						: `(${Math.abs(drTotalCost - crTotalCost).toLocaleString(undefined, {
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
		rowsMain.push(TableData4);
		const TableData5 = [
			{
				content: `${
					crTotalRevenue - drTotalRevenue - drTotalCost + crTotalCost > 0
						? 'Gross Profit'
						: 'Gross Loss'
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: `${
					crTotalRevenue - drTotalRevenue - drTotalCost + crTotalCost >= 0
						? Math.abs(
								crTotalRevenue - drTotalRevenue - drTotalCost + crTotalCost,
						  ).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })
						: `(${Math.abs(
								crTotalRevenue - drTotalRevenue - drTotalCost + crTotalCost,
						  ).toLocaleString(undefined, {
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
		rowsMain.push(TableData5);
	}
	// COst Ends
	// expenses Starts
	if (data1.expenses !== undefined) {
		data1.expenses.forEach((data) => {
			const TableData = [`${data.name}:`, ''];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							if (itemAccounts.balance !== null) {
								if (itemAccounts.balance !== null) {
									TableData3 = [
										`     ${itemAccounts.code}-${itemAccounts.name}`,
										itemAccounts.balance.balance > 0
											? `${Math.abs(
													itemAccounts.balance.balance,
											  ).toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })}`
											: `(${Math.abs(
													itemAccounts.balance.balance,
											  ).toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })})`,
									];
									if (itemAccounts.balance.balance > 0) {
										calculateTotalExpensesDr(itemAccounts.balance.balance);
									} else {
										calculateTotalExpensesCr(itemAccounts.balance.balance);
									}
									// calculateTotalExpensesDr(itemAccounts.balance.balance);
								}
								rowsMain.push(TableData3);
							}

							count += 1;
						});
					}
				});
			}
		});
		const TableData4 = [
			{
				content: `Total Expenses`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 14,
				},
			},
			{
				content: `${
					drTotalExpenses - crTotalExpenses >= 0
						? Math.abs(drTotalExpenses - crTotalExpenses).toLocaleString(undefined, {
								maximumFractionDigits: 2,
						  })
						: `(${Math.abs(drTotalExpenses - crTotalExpenses).toLocaleString(
								undefined,
								{
									maximumFractionDigits: 2,
								},
						  )})`
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
		rowsMain.push(TableData4);
	}

	// expenses Ends
	// End

	const TableDataTotal = [
		{
			content: `${
				crTotalRevenue -
					drTotalRevenue -
					drTotalCost +
					crTotalCost -
					drTotalExpenses +
					crTotalExpenses >
				0
					? `Net Profit`
					: `Net Loss`
			}`,
			colSpan: 1,
			rowSpan: 1,
			styles: {
				halign: 'left',
				fontStyle: 'bold',
				fontSize: 14,
			},
		},
		{
			content: `${
				crTotalRevenue -
					drTotalRevenue -
					drTotalCost +
					crTotalCost -
					drTotalExpenses +
					crTotalExpenses >=
				0
					? Math.abs(
							crTotalRevenue -
								drTotalRevenue -
								drTotalCost +
								crTotalCost -
								drTotalExpenses +
								crTotalExpenses,
					  ).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })
					: `(${Math.abs(
							crTotalRevenue -
								drTotalRevenue -
								drTotalCost +
								crTotalCost -
								drTotalExpenses +
								crTotalExpenses,
					  ).toLocaleString(undefined, {
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
	rowsMain.push(TableDataTotal);

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
	doc.text(`Date Printed: ${moment().format('DD/MM/YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	// ****************** Main Details
	// doc.autoTable(columnsMain, rowsMain, { startY: yPos, styles: { fontSize: 8 } });
	// yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Total Land', 47, yPos);
	// yPos += 10;
	// ****************** Land Details

	// ****************** Cleared Land Details

	// doc.text('Logo', 47, 26);
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
		doc.save(`IncomeStatement${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
