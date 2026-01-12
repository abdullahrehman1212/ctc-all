// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
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

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'PO No',
		'Supplier',
		'Date',
		'Part',
		'Unit',
		'Qty',
		'Rate',
		'Total',
		// 'Amount Received',
	];
	const tableRows = [];
	let total = 0;
	data1?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		total += item.amount;
		const itemsData = [
			index + 1,
			item.po_no?.po_no,
			item.po_no?.supplier ? item.po_no.supplier?.name : 'Direct Purchase',
			item.po_no?.request_date
				? moment(item.po_no.request_date).format('DD/MM/YYYY')
				: 'None',

			`${item.item.machine_part_oem_part.oem_part_number.number1}-${item.item.machine_part_oem_part.machine_part.name}`,
			item.item.machine_part_oem_part.machine_part.unit.name,
			item.received_quantity.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			item.purchase_price.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			item.amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			// item.walk_in_customer_name,
			// item.remarks,
			// item.total_amount ?? 0,
			// item.discount ?? 0,
			// item.total_after_discount ?? 0,
			// item.received_amount,
		];

		tableRows.push(itemsData);
	});

	tableRows.push([
		{
			content: `Total:`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: ` ${total.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;

	doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(data3?.user?.company_name, pageWidth / 2, 40, { align: 'center' });

	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Purchase Order Report', pageWidth / 2, 55, { align: 'center' });
	// doc.text(`${mouzaName}`, pageWidth / 2, 70, { align: 'center' });

	// doc.setFont(undefined, 'normal');

	yPos -= 20;

	doc.text(`Purchase Order:`, 45, yPos);
	yPos += 15;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		styles: { fontSize: 8 },
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	doc.text(`Date Printed:`, pageWidth - 180, yPos, {
		align: 'right',
	});
	doc.text(`__________________`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.text(`${moment().format('DD/MM/YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
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
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		// doc.output('dataurlnewwindow');
		doc.save(`TransferReport${dateStr}.pdf`);
	}
};

export default GeneratePDF;
