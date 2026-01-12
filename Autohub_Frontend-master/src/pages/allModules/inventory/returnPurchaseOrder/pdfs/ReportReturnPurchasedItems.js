// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'PO No',
		'Ret Date',
		'Supplier',
		'Store',
		'Total',
		'Deduction',
	
	];
	const tableRows = [];
	data1?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		const itemsData = [
			index + 1,
			item.purchaseorder?.po_no,
			item?.return_date,
			item.purchaseorder?.supplier ? item.purchaseorder.supplier?.name : 'Direct Purchase',
			item.purchaseorder?.store?.name,
			item.total,
			item.deduction,
		
		];

		tableRows.push(itemsData);
	});


	// startY is basically margin-top

	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Return Purchase Order Report', pageWidth / 2, 55, { align: 'center' });
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
		const pdfBlob = doc.output('blob');
		const pdfURL = URL.createObjectURL(pdfBlob);
		window.open(pdfURL, '_blank');
	}
};

export default GeneratePDF;
