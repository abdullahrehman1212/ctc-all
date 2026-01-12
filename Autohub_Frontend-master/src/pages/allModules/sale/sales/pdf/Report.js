// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Invoice No',
		'Date',
		'Customer Name',
		'Type',
		'Total Amount',
		'Discount',
		'Amount After Discount',
		'Gst',
		'Grand Total',
	];
	const tableRows = [];
	let total = 0;

	data1?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		console.log(item, 'llllll');
		const itemsData = [
			index + 1,
			item?.invoice_no,
			moment(item.date).format('DD/MM/YYYY'),
			item?.walk_in_customer_name,
			item.sale_type === 1 ? 'Cash' : 'Credit',
			item?.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}) ?? 0,
			item?.discount
				? item.discount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  })
				: 0,
			item?.total_after_discount ? item.total_after_discount : 0,
			item.gst
				? item.gst.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  })
				: 0,
			(item?.total_after_gst ?? 0).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
		];

		tableRows.push(itemsData);
	});

	tableRows.push([
		{
			content: `Total:`,
			colSpan: 8,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${total.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 2,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(data3?.user?.company_name || '', pageWidth / 2, 40, { align: 'center' });

	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Sale Invoice Report', pageWidth / 2, 55, { align: 'center' });

	yPos += 20;

	doc.text(`Sales:`, 45, yPos);
	yPos += 15;
	/* doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		styles: { fontSize: 10 },
		columnStyles: {
			0: { cellWidth: 40 },
		},
	}); */
	// eslint-disable-next-line no-undef
	autoTable(doc, {
		head: [tableColumns],
		body: tableRows,
		startY: yPos,
		styles: { fontSize: 8 },
	});

	yPos = doc.lastAutoTable.finalY + 20;

	// yPos = doc.lastAutoTable.finalY + 20;

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
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
