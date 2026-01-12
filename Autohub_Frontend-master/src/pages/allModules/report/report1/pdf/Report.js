// list/tablePDF.js
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// Define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type, specificItem, startDate, endDate) => {
	let data = null;
	try {
		data = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

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
		'Cost/unit',
	];
	const tableRows = [];
	let count = 0;
	let tTotal = 0;
	let tDiscount = 0;
	let tAfterDiscount = 0;
	let tTax = 0;
	let tAfterTax = 0;
	let rTotal = 0;
	let rAfterTax = 0;
	let rAfterDiscount = 0;
	let totalExpenseSum = 0;

	data1.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		if (item.purchaseorderchild && item.purchaseorderchild.length > 0) {
			const itemExpenses = item.purchase_expenses
				? item.purchase_expenses.reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0)
				: 0;

			totalExpenseSum += itemExpenses;
			tableRows.push([
				{
					content: `PO No: ${item.po_no}`,
					colSpan: 2,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Supplier: ${item.supplier ? item.supplier.name : 'Direct Purchase'}`,
					colSpan: 2,
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
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date: ${moment(item.request_date).format('DD-MM-YYYY')}`,
					colSpan: 2,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);

			let itemTotal = 0;
			let itemTotalAfterDiscount = 0;
			let itemTotalAfterTax = 0;
			item.purchaseorderchild?.forEach((item2) => {
				count += 1;
				const costPerItem =
					(((item2.amount * 100) / item.total) * itemExpenses) /
					100 /
					(item2.received_quantity || 1);
				itemTotal += item2.amount;
				itemTotalAfterDiscount = itemTotal - (item.discount || 0);
				itemTotalAfterTax = itemTotal - (item.tax || 0);
				const itemsData2 = [
					count,
					item2.item?.machine_part_oem_part.oem_part_number.number1,
					item2.item?.machine_part_oem_part.machine_part.name,
					item2.item?.brand.name,
					item2.item?.machine_part_oem_part.machine_partmodel?.name,
					item2.item?.machine_part_oem_part.machine_part.unit.name,
					item2.item?.machine_part_oem_part.machine_part.type.name,
					item2.quantity.toLocaleString(undefined, { maximumFractionDigits: 2 }),
					item2.purchase_price.toLocaleString(undefined, { maximumFractionDigits: 2 }),
					item2.amount.toLocaleString(undefined, { maximumFractionDigits: 2 }),
					costPerItem.toLocaleString(undefined, { maximumFractionDigits: 2 }),
				];
				tableRows.push(itemsData2);
			});

			tableRows.push([
				{
					content: `Total Expenses:`,
					colSpan: 2,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
				{
					content: `${itemExpenses.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 2,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
				{
					content: `Total:`,
					colSpan: 2,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
				{
					content: `${itemTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
					colSpan: 4,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
			]);

			tableRows.push([
				{
					content: `Discount:`,
					colSpan: 6,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
				{
					content: `${item.discount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 4,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
			]);
			tableRows.push([
				{
					content: `Total After Discount:`,
					colSpan: 6,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
				{
					content: `${itemTotalAfterDiscount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 4,
					styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				},
			]);

			tTotal += itemTotal;
			tAfterDiscount += itemTotalAfterDiscount;
			tAfterTax += itemTotalAfterTax;
			tDiscount += item.discount;
			tTax += item.tax;
			rTotal += item.return_total;
			rAfterDiscount += item.return_total_after_discount;
			rAfterTax += item.return_total_after_tax;
		}
	});

	const yPos = 120;

	tableRows.push([
		{
			content: `Summary`,
			colSpan: 13,
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
			content: `Total:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${tTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Discount:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${tDiscount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Total After Discount:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${tAfterDiscount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Tax:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${tTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Total After Tax:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${tAfterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// Return Summary
	tableRows.push([
		{
			content: `Return Summary`,
			colSpan: 13,
			styles: {
				halign: 'center',
				fontStyle: 'bold',
				fontSize: 12,
				fillColor: [225, 225, 225],
			},
		},
	]);
	tableRows.push([
		{
			content: `Return Total:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${rTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Return Total After Discount:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${rAfterDiscount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Return Total After Tax:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${rAfterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// Expense Summary
	tableRows.push([
		{
			content: `Expense Summary`,
			colSpan: 13,
			styles: {
				halign: 'center',
				fontStyle: 'bold',
				fontSize: 12,
				fillColor: [225, 225, 225],
			},
		},
	]);
	tableRows.push([
		{
			content: `Total Expense Amount:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalExpenseSum.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// Net Summary Expense Summary * (Main Summary - Return Summary)
	tableRows.push([
		{
			content: `Net Summary`,
			colSpan: 13,
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
			content: `Net Total:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${(totalExpenseSum + (tTotal - rTotal)).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Net Total After Discount:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${(totalExpenseSum + (tAfterDiscount - rAfterDiscount)).toLocaleString(
				undefined,
				{ maximumFractionDigits: 2 },
			)}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);
	tableRows.push([
		{
			content: `Net Total After Tax:`,
			colSpan: 6,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${(totalExpenseSum + (tAfterTax - rAfterTax)).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 4,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	doc.setFont(undefined, 'bold');
	doc.text(data?.user?.company_name || 'Company Name', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.text('Purchase Report', pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	doc.text(`As on  ${moment().format('MMMM D, YYYY')}`, pageWidth / 2, 85, { align: 'center' });

	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		theme: 'grid',
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		pageBreak: 'auto',
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

	const dateStr = moment().format('YYYY-MM-DD_HH-mm-ss');
	if (type === 1) {
		doc.save(`Report1_${dateStr}.pdf`);
	} else if (type === 2) {
		const pdfBlob = doc.output('blob');
		const pdfURL = URL.createObjectURL(pdfBlob);
		window.open(pdfURL, '_blank');
	}
};

export default GeneratePDF;
