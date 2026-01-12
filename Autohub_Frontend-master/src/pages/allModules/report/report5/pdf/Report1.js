// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type, specificItem, startDate, endDate) => {
	// initialize jsPDF
	let data = null;
	try {
		data = Cookies.get('Data1') ? JSON.parse(Cookies.get('Data1')) : null;
		console.log('The logo url is:', data);
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Part',
		'Qty Sold',
		'Total Sales',
		// 'Returned Qty',
		// 'Total Returned',
		'Total Cost',
		'Total Profit',
	];
	const tableRows = [];

	let count = 0;
	let count2 = 0;
	// let count3 = 0;
	let totalSales = 0;
	// let totalRet = 0;
	let totalCost = 0;
	let totalProfit = 0;
	let totalProfitPercent = 0;
	data1?.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		if (item.item && item.item.length > 0 && item.item[0]?.invoice_child?.length > 0) {
			count += 1;

			tableRows.push([
				{
					content: `${count}`,
					colSpan: 1,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Brand: ${item.name}`,
					colSpan: 9,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			let totalSalesBrand = 0;
			// let totalRetBrand = 0;
			let totalCostBrand = 0;
			let totalProfitBrand = 0;
			let totalProfitPercentBrand = 0;
			item.item.forEach((item2) => {
				if (item2.invoice_child.length > 0) {
					let totalSalesPart = 0;
					let totalQtySold = 0;
					// let totalQtySoldRet = 0;
					// let totalRetPart = 0;
					let totalCostPart = 0;
					let totalProfitPart = 0;
					let totalProfitPartPercent = 0;
					item2.invoice_child.forEach((item3) => {
						if (item3.invoice) {
							// count3 += 1;
							// Calculate
							totalQtySold += item3.quantity;
							// totalQtySoldRet += item3.returned_quantity;
							totalSalesPart += item3.price * item3.quantity;
							// totalRetPart += item3.price * item3.returned_quantity;
							totalCostPart += item3.cost * item3.quantity;
							totalProfitPart +=
								item3.price * item3.quantity - item3.cost * item3.quantity;
							totalProfitPartPercent =
								(totalSalesPart - totalCostPart) / totalCostPart;
							// Calculate Ends
						}
					});

					count2 += 1;
					tableRows.push([
						{
							content: `${count2}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'center',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},

						{
							content: `${item2.name}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'left',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},
						{
							content: `${totalQtySold.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'left',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},
						{
							content: `${totalSalesPart.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'left',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},
						// {
						// 	content: `${totalQtySoldRet.toLocaleString(undefined, {
						// 		maximumFractionDigits: 2,
						// 	})}`,
						// 	colSpan: 1,
						// 	rowSpan: 1,
						// 	styles: {
						// 		halign: 'left',
						// 		fontStyle: 'normal',
						// 		fontSize: 10,
						// 		// fillColor: [222, 222, 222],
						// 	},
						// },
						// {
						// 	content: `${totalRetPart.toLocaleString(undefined, {
						// 		maximumFractionDigits: 2,
						// 	})}`,
						// 	colSpan: 1,
						// 	rowSpan: 1,
						// 	styles: {
						// 		halign: 'left',
						// 		fontStyle: 'normal',
						// 		fontSize: 10,
						// 		// fillColor: [222, 222, 222],
						// 	},
						// },
						{
							content: `${totalCostPart.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'left',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},
						{
							content: `${totalProfitPart.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 1,
							rowSpan: 1,
							styles: {
								halign: 'left',
								fontStyle: 'normal',
								fontSize: 10,
								// fillColor: [222, 222, 222],
							},
						},
						// {
						// 	content: `${totalProfitPartPercent.toLocaleString(undefined, {
						// 		maximumFractionDigits: 2,
						// 	})}`,
						// 	colSpan: 1,
						// 	rowSpan: 1,
						// 	styles: {
						// 		halign: 'left',
						// 		fontStyle: 'normal',
						// 		fontSize: 10,
						// 		// fillColor: [222, 222, 222],
						// 	},
						// },
					]);

					// count3 = 0;
					totalSalesBrand += totalSalesPart;
					// totalRetBrand += totalRetPart;
					totalCostBrand += totalCostPart;
					totalProfitBrand += totalProfitPart;
					totalProfitPercentBrand += totalProfitPartPercent;
				}
			});
			//  Here
			tableRows.push([
				{
					content: `Brand Summary: ${item.name}`,
					colSpan: 13,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			tableRows.push([
				{
					content: `Total Sales`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
				{
					content: `${totalSalesBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
			]);
			// tableRows.push([
			// 	{
			// 		content: `Total Returned`,
			// 		colSpan: 4,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// 	// {
			// 	// 	content: `${totalRetBrand.toLocaleString(undefined, {
			// 	// 		maximumFractionDigits: 2,
			// 	// 	})}`,
			// 	// 	colSpan: 6,
			// 	// 	rowSpan: 1,
			// 	// 	styles: {
			// 	// 		halign: 'right',
			// 	// 		fontStyle: 'bold',
			// 	// 		fontSize: 10,
			// 	// 		// fillColor: [175, 175, 175],
			// 	// 	},
			// 	// },
			// ]);
			tableRows.push([
				{
					content: `Total Cost`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
				{
					content: `${totalCostBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
			]);
			tableRows.push([
				{
					content: `Total Profit`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
				{
					content: `${totalProfitBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
			]);
			tableRows.push([
				{
					content: `Total Profit Percentage`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
				{
					content: `${totalProfitPercentBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
			]);
			count2 = 0;
			totalSales += totalSalesBrand;
			// totalRet += totalRetBrand;
			totalCost += totalCostBrand;
			totalProfit += totalProfitBrand;
			totalProfitPercent += totalProfitPercentBrand;
		}
	});

	//  Summary

	tableRows.push([
		{
			content: `Complete Report Summary`,
			colSpan: 13,
			rowSpan: 1,
			styles: {
				halign: 'center',
				fontStyle: 'bold',
				fontSize: 12,
				fillColor: [175, 175, 175],
			},
		},
	]);
	tableRows.push([
		{
			content: `Total Sales`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
		{
			content: `${totalSales.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
	]);
	// tableRows.push([
	// 	{
	// 		content: `Total Returned`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// 	{
	// 		content: `${totalRet.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		})}`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// ]);
	tableRows.push([
		{
			content: `Total Cost`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
		{
			content: `${totalCost.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
	]);
	tableRows.push([
		{
			content: `Total Profit`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
		{
			content: `${totalProfit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
	]);

	tableRows.push([
		{
			content: `Total Profit Percentage`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
		{
			content: `${totalProfitPercent.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
	]);

	//  Summary Ends
	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(`${data?.user?.company_name}`, pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Brand Wise Sales Summary Report', pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate !== '' ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate !== '' ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	doc.text(`As on  ${moment().format('MMMM D, YYYY')}`, pageWidth / 2, 85, { align: 'center' });
	yPos += 15;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		theme: 'grid',
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		headStyles: {
			fillColor: [225, 225, 225],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

	doc.setFontSize(12);

	// doc.text('Logo', 47, 26);
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('Kashmir Builders and Developers', 46, 20);
	doc.setFontSize(10);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('ABC Near GT Road Rawalpindi', 47, 26);
	// doc.text('Report II', 47, 32);
	doc.setFontSize(10);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');

	// Footer Starts
	doc.page = 1;
	// doc.text(150, 285, `page ${doc.page}`);
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
	// const pageSize = doc.internal.pageSize;
	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Report5${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
