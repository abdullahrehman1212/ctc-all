// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// import rehbarLogo from '../../../../assets/logos/reh_kbd/rehbar.png';
// import kbdLogo from '../../../../assets/logos/reh_kbd/kbd.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, balanceSheetdate2, postDatedVouchers, type) => {
	console.log(data1)
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	let doc = null;
	if (data1.coaAccounts.length < 6) {
		// eslint-disable-next-line new-cap
		doc = new jsPDF('l', 'pt', 'a4');
	} else {
		// eslint-disable-next-line new-cap
		doc = new jsPDF('l', 'pt', 'a4');
	}

	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumnPayments = ['S no', 'V no', 'Desc'];

	data1.coaAccounts.forEach((item) => {
		tableColumnPayments.push(item.name);
	});

	const tableRowsPayments = [];
	let tableRowsOpeneingBalances = [];
	let tableRowsTotalReceiptsAmounts = [];
	let tableRowsTotalPaymentsAmounts = [];
	let tableRowsTempHeading = [];
	const totalReceipts = [];
	const totalPayments = [];
	let count = 0;

	data1.coaAccounts.forEach(() => {
		totalReceipts.push(0);
		totalPayments.push(0);
	});

	// Heading for opening Balanaces
	tableRowsOpeneingBalances = [
		{
			content: `Opening Balances:`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 8 },
		},
	];
	data1.openingBalances.forEach((item2) => {
		tableRowsOpeneingBalances.push({
			content: `${
				item2.opening_bal !== null
					? item2.opening_bal.toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })
					: 0
			}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 8 },
		});
	});
	tableRowsPayments.push(tableRowsOpeneingBalances);
	// Heading for Receipts
	tableRowsTempHeading = [
		{
			content: `Receipts`,
			colSpan: Number(data1.openingBalances.length) + 3,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 },
		},
	];
	tableRowsPayments.push(tableRowsTempHeading);

	// data of Receipts

	data1.debitTransactions.forEach((data) => {
		count += 1;
		const TableData = [
			count,
			data.descriptionArray.voucher_no,
			data.descriptionArray.description,
		];
		data.transactions.forEach((data2, index) => {
			TableData.push(
				data2.amount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}),
			);
			totalReceipts[index] += data2.amount;
		});

		tableRowsPayments.push(TableData);
	});
	// Total for Receipts

	tableRowsTotalReceiptsAmounts = [
		{
			content: `Total Receipts:`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 8 },
		},
	];
	totalReceipts.forEach((item2) => {
		tableRowsTotalReceiptsAmounts.push({
			content: `${item2.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 8 },
		});
	});
	tableRowsPayments.push(tableRowsTotalReceiptsAmounts);

	// Heading for Payments
	count = 0;
	tableRowsTempHeading = [
		{
			content: `Payments`,
			colSpan: Number(data1.openingBalances.length) + 3,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 12 },
		},
	];
	tableRowsPayments.push(tableRowsTempHeading);
	// data of Payments
	data1.creditTransactions.forEach((data) => {
		count += 1;
		console.log('yyyy', data);
		// const concatenatedValue = `${data.descriptionArray.description}\n${data.descriptionArray.account}`;

		const TableData = [
			count,
			data.descriptionArray.voucher_no,
			data.descriptionArray.description,
			// concatenatedValue
		];
		data.transactions.forEach((data2, index) => {
			TableData.push(
				data2.amount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}),
			);
			totalPayments[index] += data2.amount;
		});

		tableRowsPayments.push(TableData);
	});
	// Total for Payments

	tableRowsTotalPaymentsAmounts = [
		{
			content: `Total Payments:`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 8 },
		},
	];
	totalPayments.forEach((item2) => {
		tableRowsTotalPaymentsAmounts.push({
			content: `${item2.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 8 },
		});
	});
	tableRowsPayments.push(tableRowsTotalPaymentsAmounts);
	// Closing Balances

	tableRowsTotalPaymentsAmounts = [
		{
			content: `Closing Balances:`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 8 },
		},
	];
	data1.openingBalances.forEach((item2, index) => {
		tableRowsTotalPaymentsAmounts.push({
			content: `${(
				(item2.opening_bal !== null ? item2.opening_bal : 0) -
				totalPayments[index] +
				totalReceipts[index]
			).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 8 },
		});
	});
	tableRowsPayments.push(tableRowsTotalPaymentsAmounts);

	const tableHedingsNotes = [
		'Sr No',
		'Voucher No',
		// 'Type',
		'Bank',
		'Name',

		'Date',
		'Total Amount',
		'Cheque No',
		'Cheque Date',
		'Approval Status',
		'Cheque Status',
	];

	const tableDataNotes = [];

	count = 0;

	postDatedVouchers.forEach((data) => {
		count += 1;

		const TableData = [
			count,

			data.voucher_no,
			// data.voucher_type.name,
			`${data.post_dated_vouchers_bank.coa_account.code}-${data.post_dated_vouchers_bank.coa_account.name}`,
			data.name,

			moment(data.date).format('DD/MM/YYYY'),
			data.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.cheque_no,
			moment(data.cheque_date).format('DD/MM/YYYY'),
			// eslint-disable-next-line no-nested-ternary
			data.deleted_at === null ? (data.isApproved === 0 ? `Pending` : `Approved`) : 'Deleted',
			(data.is_post_dated === 2 &&
				`Returned\n${data.cheque_date !== null ? data.cheque_date : ''}`) ||
				(data.is_post_dated === 1 && 'Pending') ||
				(data.is_post_dated === 0 &&
					data.cheque_no !== null &&
					data.cheque_no !== '' &&
					`Cleared\n${data.cleared_date !== null ? data.cleared_date : ''}`),
		];

		tableDataNotes.push(TableData);
	});

	let yPos = 100;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', pageWidth - 140, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text(`Daily Closing`, pageWidth / 2, 55, { align: 'center' });

	doc.text(`${moment(balanceSheetdate2).format('MMMM D, YYYY')}`, pageWidth / 2, 70, {
		align: 'center',
	});

	doc.setFont(undefined, 'normal');

	yPos += 20;

	// doc.text(`All Files Payments:`, 45, yPos);
	yPos += 5;

	doc.autoTable(tableColumnPayments, tableRowsPayments, {
		startY: yPos,
		styles: { fontSize: 8, halign: 'right', lineWidth: 1 },
		columnStyles: {
			0: { cellWidth: 30, halign: 'left' },
			1: { cellWidth: 40, halign: 'left' },
			2: { halign: 'left' },

			// etc
		},
		headStyles: {
			halign: 'center',
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos += 15;

	doc.text(`Notes: Post Dated Cheques issued`, pageWidth / 2, yPos, {
		align: 'center',
	});
	yPos += 15;
	doc.autoTable(tableHedingsNotes, tableDataNotes, {
		startY: yPos,
		styles: { fontSize: 8, lineWidth: 1 },
		columnStyles: {
			0: { cellWidth: 30 },

			// etc
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;
	doc.setFontSize(10);

	doc.text(`Date Printed:`, pageWidth - 180, yPos, {
		align: 'right',
	});
	doc.text(`____________________`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.text(`${moment().format('DD/MM/YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	yPos = doc.lastAutoTable.finalY + 20;

	doc.setFontSize(12);

	// doc.text('Logo', 47, 26);
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('Kashmir Builders and Developers', 46, 20);
	doc.setFontSize(12);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('ABC Near GT Road Rawalpindi', 47, 26);
	// doc.text('Report II', 47, 32);
	doc.setFontSize(12);
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
		doc.save(`Report_III${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
