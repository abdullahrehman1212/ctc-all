// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// import rehbarLogo from '../../../../assets/logos/reh_kbd/rehbar.png';
// import kbdLogo from '../../../../assets/logos/reh_kbd/kbd.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, accountSelected, type, balanceSheetdate2, openingBalance) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumnPayments = ['S no', 'T ID', 'V no', 'Desc', 'Dr', 'Cr', 'Balance'];
	const tableRowsPayments = [];
	let count = 0;
	let openingBalanceCalculate = openingBalance;

	data1?.forEach((data) => {
		count += 1;
		openingBalanceCalculate = openingBalanceCalculate + data.debit - data.credit;

		const TableData = [
			count,
			data.id,
			data.voucher_number && `${data.voucher_number.voucher_no}`,
			data.land !== null
				? `File: ${data.land?.file_no}-${data.land?.file_name}\n ${data.land_payment_head?.name}\n  ${data.description}`
				: `${data.description}\n${
						data.voucher_number.cheque_no !== null &&
						data.voucher_number.cheque_date !== null
							? `Cheque no: ${data.voucher_number.cheque_no}\nCheque Date: ${moment(
									data.voucher_number.cheque_date,
							  ).format('DD/MM/YYYY')}\nClear Date: ${
									data.voucher_number.cleared_date !== null
										? moment(data.voucher_number.cleared_date).format(
												'DD/MM/YYYY',
										  )
										: ''
							  }
						`
							: ''
				  }`,
			`${data.debit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			`${data.credit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			`${openingBalanceCalculate.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
		];

		tableRowsPayments.push(TableData);
	});

	tableRowsPayments.push([
		{
			content: `Closing Balance`,
			colSpan: 4,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
		},
		{
			content: `${openingBalanceCalculate.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 12 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text(`Daily Closing : ${accountSelected.label}`, pageWidth / 2, 55, { align: 'center' });

	doc.text(`${moment(balanceSheetdate2).format('MMMM D, YYYY')}`, pageWidth / 2, 70, {
		align: 'center',
	});

	doc.text(
		`Opening Balance: ${openingBalance.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}`,
		pageWidth - 40,
		yPos,
		{
			align: 'right',
		},
	);

	doc.setFont(undefined, 'normal');

	yPos += 20;

	// doc.text(`All Files Payments:`, 45, yPos);
	yPos += 5;
	doc.autoTable(tableColumnPayments, tableRowsPayments, {
		startY: yPos,
		styles: { fontSize: 8 },
		columnStyles: {
			0: { cellWidth: 30 },
			1: { cellWidth: 50 },
			2: { cellWidth: 50 },

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
