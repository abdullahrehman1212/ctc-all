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
	let grossProfit = 0;
	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Oem',
		'Item',
		'Brand',
		'Model',
		'Uom',
		'Type',
		'Qty',
		'Rate',
		'Amount',
		// 'Ret Qty',

		'Cost/Unit',

		'Profit',
	];
	const tableRows = [];
	let total = 0;
	let count = 0;
	let tAmount = 0;
	// let tReturned = 0;
	let tTotal = 0;
	let tDiscount = 0;
	let tAfterDiscount = 0;
	let tGst = 0;
	let tAfterGst = 0;
	let tGrossProfit = 0;

	data1.walkin.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		// total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		if (item.invoice_child && item.invoice_child.length > 0) {
			tableRows.push([
				{
					content: `Invoice No: ${item.invoice_no}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer:${item.walk_in_customer_name}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Store: ${item.store.name}`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date: ${moment(item.date).format('DD-MM-YYYY')}`,
					colSpan: 3,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: ``,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			grossProfit = 0;
			total = 0;
			count = 0;
			item.invoice_child.forEach((item2) => {
				count += 1;
				total += item2.price * item2.quantity;
				grossProfit += item2.price * item2.quantity - item2.cost * item2.quantity;

				const itemsData2 = [
					count,
					item2.item.machine_part_oem_part.oem_part_number.number1,
					item2.item.machine_part_oem_part.machine_part.name,
					item2.item.brand.name,
					item2.item.machine_part_oem_part.machine_partmodel?.name,
					item2.item.machine_part_oem_part.machine_part.unit.name,

					item2.item.machine_part_oem_part.machine_part.type.name,

					item2.quantity?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,

					item2.price?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(item2.price * item2.quantity)?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					// item2.returned_quantity?.toLocaleString(undefined, {
					// 	maximumFractionDigits: 2,
					// }) ?? 0,
					item2.cost?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(item2.price * item2.quantity - item2.cost * item2.quantity)?.toLocaleString(
						undefined,
						{
							maximumFractionDigits: 2,
						},
					) ?? 0,
				];

				tableRows.push(itemsData2);
			});
			// Summary Calculation Start
			// tReturned += total - item.total_amount;
			// Summary Calculation Ends
			// Summary Calculation Start
			tAmount += total;

			tTotal += item.total_amount;
			tDiscount += item.discount;
			tAfterDiscount += item.total_after_discount;
			tGst += item.gst;
			tAfterGst += item.total_after_gst;
			tGrossProfit += grossProfit;
			// Summary Calculation End
			if (!specificItem) {
				tableRows.push([
					{
						content: `Total:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					{
						content: `${total.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${grossProfit.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);

				if (total - item.total_amount !== 0) {
					// tableRows.push([
					// 	{
					// 		content: `Returned Amount:`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// 	},
					// 	{
					// 		content: `${(total - item.total_amount).toLocaleString(undefined, {
					// 			maximumFractionDigits: 2,
					// 		})}`,
					// 		colSpan: 4,
					// 		rowSpan: 1,
					// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// 	},
					// ]);
					tableRows.push([
						{
							content: `Total:`,
							colSpan: 6,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${item.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 4,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
				}
				tableRows.push([
					{
						content: `Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${(grossProfit - item.discount).toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total After Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `GST %:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${((item.gst / item.total_after_discount) * 100).toLocaleString(
							undefined,
							{
								maximumFractionDigits: 2,
							},
						)}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `GST Amount:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.gst.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total after Tax:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${
							item.total_after_gst
								? item.total_after_gst.toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })
								: 0
						}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
			}
		}
	});
	//  Summary

		tableRows.push([
			{
				content: `Summary`,
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
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Sale:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAmount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 6,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `Total Returned:`,
		// 		colSpan: 4,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tReturned.toLocaleString(undefined, {
		// 			maximumFractionDigits: 2,
		// 		})}`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total *:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tTotal.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total After Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `GST Amount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Amount After GST:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `***Gross Profit***:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGrossProfit.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Gross Profit After Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${(tGrossProfit - tDiscount).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
	//  Summary Ends

	
	yPos = 100;
	let grossProfit1 = 0;
	// define the columns we want and their titles
	const tableColumns1 = [
		'S.No.',
		'Oem',
		'Item',
		'Brand',
		'Model',
		'Uom',
		'Type',
		'Qty',
		'Rate',
		'Amount',
		// 'Ret Qty',

		'Cost/Unit',

		'Profit',
	];
	const tableRows1 = [];
	let total1 = 0;
	let count1 = 0;
	let tAmount1 = 0;
	// let tReturned1 = 0;
	let tTotal1 = 0;
	let tDiscount1 = 0;
	let tAfterDiscount1 = 0;
	let tGst1 = 0;
	let tAfterGst1 = 0;
	let tGrossProfit1 = 0;

	data1.registered.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		// total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		if (item.invoice_child && item.invoice_child.length > 0) {
			tableRows1.push([
				{
					content: `Invoice No: ${item.invoice_no}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer:${item.customer.name}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Store: ${item.store.name}`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date: ${moment(item.date).format('DD-MM-YYYY')}`,
					colSpan: 3,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: ``,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			grossProfit1 = 0;
			total1 = 0;
			count1 = 0;
			item.invoice_child.forEach((item2) => {
				count1 += 1;
				total1 += item2.price * item2.quantity;
				grossProfit1 += item2.price * item2.quantity - item2.cost * item2.quantity;

				const itemsData3 = [
					count1,
					item2.item.machine_part_oem_part.oem_part_number.number1,
					item2.item.machine_part_oem_part.machine_part.name,
					item2.item.brand.name,
					item2.item.machine_part_oem_part.machine_partmodel?.name,
					item2.item.machine_part_oem_part.machine_part.unit.name,

					item2.item.machine_part_oem_part.machine_part.type.name,

					item2.quantity?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,

					item2.price?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(item2.price * item2.quantity)?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					// item2.returned_quantity?.toLocaleString(undefined, {
					// 	maximumFractionDigits: 2,
					// }) ?? 0,
					item2.cost?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(item2.price * item2.quantity - item2.cost * item2.quantity)?.toLocaleString(
						undefined,
						{
							maximumFractionDigits: 2,
						},
					) ?? 0,
				];

				tableRows1.push(itemsData3);
			});
			// Summary Calculation Start
			// tReturned1 += total1 - item.total_amount;
			// Summary Calculation Ends
			// Summary Calculation Start
			tAmount1 += total1;

			tTotal1 += item.total_amount;
			tDiscount1 += item.discount;
			tAfterDiscount1 += item.total_after_discount;
			tGst1 += item.gst;
			tAfterGst1 += item.total_after_gst;
			tGrossProfit1 += grossProfit1;
			// Summary Calculation End
		
				tableRows1.push([
					{
						content: `Total:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					{
						content: `${total1.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${grossProfit1.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);

				if (total1 - item.total_amount !== 0) {
					// tableRows1.push([
					// 	{
					// 		content: `Returned Amount:`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// 	},
					// 	{
					// 		content: `${(total1 - item.total_amount).toLocaleString(undefined, {
					// 			maximumFractionDigits: 2,
					// 		})}`,
					// 		colSpan: 4,
					// 		rowSpan: 1,
					// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// 	},
					// ]);
					tableRows1.push([
						{
							content: `Total:`,
							colSpan: 6,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${item.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 4,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
				}
				tableRows1.push([
					{
						content: `Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${(grossProfit1 - item.discount).toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows1.push([
					{
						content: `Total After Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows1.push([
					{
						content: `GST %:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${((item.gst / item.total_after_discount) * 100).toLocaleString(
							undefined,
							{
								maximumFractionDigits: 2,
							},
						)}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `GST Amount:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.gst.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows1.push([
					{
						content: `Total after Tax:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${
							item.total_after_gst
								? item.total_after_gst.toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })
								: 0
						}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
		}
	});
	//  Summary
	
		tableRows1.push([
			{
				content: `Summary`,
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
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Sale:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAmount1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		// tableRows1.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 6,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `Total Returned:`,
		// 		colSpan: 4,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tReturned1.toLocaleString(undefined, {
		// 			maximumFractionDigits: 2,
		// 		})}`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total *:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tTotal1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tDiscount1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total After Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterDiscount1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `GST Amount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGst1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Amount After GST:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterGst1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `***Gross Profit***:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGrossProfit1.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows1.push([
			{
				content: ``,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Gross Profit After Discount:`,
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${(tGrossProfit1 - tDiscount1).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
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

	doc.text('Sales Type Report', pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate !== '' ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate !== '' ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	doc.text(`As on  ${moment().format('MMMM D, YYYY')}`, pageWidth / 2, 85, { align: 'center' });
	doc.setFontSize(14);
	doc.setFont(undefined, 'bold');
	doc.text('Walkin Customers', pageWidth / 2, 115, { align: 'center' });
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
	yPos = doc.lastAutoTable.finalY + 20;
	yPos += 30;
	doc.setFontSize(14);
	doc.setFont(undefined, 'bold');
	doc.text('Registered Customers', pageWidth / 2, yPos, { align: 'center' });
	yPos += 15;
	doc.autoTable(tableColumns1, tableRows1, {
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
		doc.save(`Report7${dateStr}.pdf`);
	} else if (type === 2) {
		const pdfBlob = doc.output('blob');
		const pdfURL = URL.createObjectURL(pdfBlob);
		window.open(pdfURL, '_blank');
	}
};

export default GeneratePDF;
