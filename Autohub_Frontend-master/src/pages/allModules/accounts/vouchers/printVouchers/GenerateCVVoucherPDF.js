// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToWords } from 'to-words';
import Cookies from 'js-cookie';
import moment from 'moment';
// import Logo from '../../../../../assets/logos/logos/logo.png';
// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// ****************** Table Details Starts
	const rowsLand = [];
	const columnsLand = [
		// 'Sr No',
		'PARTICULARS',
		' ',
		'Folio No.',
		// 'Description',
		'Debitt',
		'Credit',
	];
	let count = 0;
	data1.voucher_transactions.forEach((data) => {
		count += 1;
		const dataLand = [
			// count,

			data.credit === 0 ? `${data.coa_account.code}` : `    ${data.coa_account.code}`,

			data.credit === 0
				? `${data.coa_account.name}\n${data.description}`
				: `    ${data.coa_account.name}\n    ${data.description}`,

			'',

			// data.description,
			data.debit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.credit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
		];
		rowsLand.push(dataLand);
	});

	const landTotal = [
		// {
		// 	content: `Cheque No:`,
		// 	colSpan: 1,
		// 	rowSpan: 1,
		// 	styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		// },
		// {
		// 	content: `${data1.cheque_no !== null ? data1.cheque_no : 'none'}`,
		// 	colSpan: 1,
		// 	rowSpan: 1,
		// 	styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		// },

		{
			content: `Total`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${data1.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})} `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${data1.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})} `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	];
	rowsLand.push(landTotal);
	const landTotal2 = [
		{
			content: `Cheque date:`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		},
		{
			content: `${data1.cheque_no !== null ? data1.cheque_date : 'none'}`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		},
	];
	// if (data1.cheque_no !== null) {
	// 	rowsLand.push(landTotal2);
	// }

	// const landTotal3 = [
	// 	{
	// 		content: `Amount in Words:`,
	// 		colSpan: 1,
	// 		rowSpan: 2,
	// 		styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
	// 	},
	// 	{
	// 		content: ``,
	// 		colSpan: 3,
	// 		rowSpan: 2,
	// 		styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
	// 	},
	// ];
	// rowsLand.push(landTotal3);

	// ****************** Land Details Ends
	// ****************** Get Land Details Starts
	// let debitAccountName = '';
	// data1.voucher_transactions.forEach((data) => {
	// 	if (data.debit !== 0) {
	// 		debitAccountName = data.coa_account.name;
	// 	}
	// });
	// ****************** Cleared Land Details Ends
	// ****************** Summary   Details Starts
	const tableRowsSummary = [];
	const tableColumnSummary = ['Signatures'];
	const TableDataSummary = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Prepared by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary);
	const TableDataSummary2 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Verified by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary2);
	const TableDataSummary3 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Approved by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary3);
	const TableDataSummary4 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Received by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary4);

	// ****************** Summary  Details Ends
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 80, 80);
	let yPos = 70;

	yPos += 5;
	doc.setFont(undefined, 'normal');
	doc.setFontSize(12);
	doc.setFont(undefined, 'bold');

	// doc.text('Phone No: 051 512622', 230, 55);
	doc.text('CONTRA VOUCHER', pageWidth / 2, 55, { align: 'center' });

	doc.setFont(undefined, 'normal');

	// yPos += 20;
	// doc.text(`Received From:`, 45, yPos);
	// doc.text(`${data1.name}`, 135, yPos);
	// doc.text(`______________________________`, 135, yPos);

	doc.text(`Voucher No.  `, 430, yPos);
	doc.text(`__________`, 500, yPos);
	doc.text(` ${data1.voucher_no}`, 500, yPos);
	yPos += 25;

	doc.text(`Date`, 460, yPos);
	doc.text(`_______________`, 460, yPos);
	doc.text(`${moment(data1.date).format('DD/MM/YYYY')}`, 490, yPos);
	yPos += 20;
	doc.text(`Project Name`, 45, yPos);
	doc.text(`_________________________`, 200, yPos);
	doc.text(`Head Office          |     100`, 200, yPos);
	yPos += 20;

	// doc.text(`Account (Dr):`, 45, yPos);
	// doc.text(`${debitAccountName}`, 135, yPos);
	// doc.text(`______________________________`, 135, yPos);

	// doc.text(`Account (Dr): ${debitAccountName}`, 47, yPos);
	// yPos += 20;

	// ****************** Main Details
	// doc.autoTable(['ddd', 'ddd', 'ddd'], rowsTopDetails, { startY: yPos, styles: { fontSize: 8 } });
	// yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Total Land', 47, yPos);
	// yPos += 10;
	// ****************** Land Details
	doc.autoTable(columnsLand, rowsLand, {
		theme: 'grid',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 1,
			lineColor: [0, 0, 0],
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 1,
			lineColor: [0, 0, 0],
		},

		startY: yPos,
		styles: { fontSize: 8 },
	});
	yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Cleared  Land', 47, yPos);
	// yPos += 10;
	// ****************** Cleared Land Details
	// ****************** Summary
	yPos += 40;

	doc.text(
		'____________________________                                    ____________________________',
		45,
		yPos,
	);
	yPos += 15;
	doc.text(
		`            Accounts Manager                                                                Director / CEO `,
		45,
		yPos,
	);
	yPos += 20;
	// doc.autoTable(tableColumnSummary, tableRowsSummary, {
	// 	startY: yPos,
	// 	styles: { fontSize: 8, height: 80 },
	// });
	// yPos = doc.lastAutoTable.finalY + 20;
	// ****************** Summary ends

	// doc.text('Logo', 47, 26);
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(12);
	doc.setFont('arial');

	doc.setFontSize(10);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');
	// Footer Starts
	doc.page = 1;
	// doc.text(150, yPos, `Print date: ${Date()}`);
	// doc.text(`Date Printed:`, 380, yPos);
	// doc.text(`____________________`, 440, yPos);
	// doc.text(`${moment().format('DD-MM-YY hh:mm:ss a')}`, 440, yPos);
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
		doc.save(`Voucher_${data1.voucher_no}_${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
