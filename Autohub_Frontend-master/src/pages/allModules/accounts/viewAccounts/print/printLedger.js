// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// import Logo from '../../../../../assets/logos/logos/logo.png';

const GeneratePDF = (data1, accountSelected, type, startDate, endDate, openingBalance) => {
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
	// Functions Starts
	let count = 0;

	// Functions Ends
	let drTotal = 0;
	let crTotal = 0;
	let yPos = 100;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 470, 20, 110, 80);
	yPos -= 30;
	doc.setFont(undefined, 'bold');

	// doc.text(data3?.user?.company_name, 200, 40);
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');
	doc.text(`Ledger: ${accountSelected.label}`, pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate !== '' ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate !== '' ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	yPos += 20;

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
	// Start
	const rowsMain = [];
	const columnsMain = ['S no', 'V no', 'date', 'Desc', 'Dr', 'Cr', 'Balance'];

	// expenses Starts
	if (data1 !== undefined) {
		data1?.forEach((data) => {
			count += 1;
			openingBalance = openingBalance + data.debit - data.credit;
			crTotal += data.credit;
			drTotal += data.debit;
			const TableData = [
				count,

				data.voucher_number && `${data.voucher_number.voucher_no}`,
				moment(data?.date).format('DD/MM/YYYY'),
				// data.coa_account.name,
				`${data.description}`,
				`${data.debit.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				`${data.credit.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				`${openingBalance.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
			];
			rowsMain.push(TableData);
		});
	}

	rowsMain.push([
		'',
		'',
		'',
		`Total`,
		`${drTotal.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}`,
		`${crTotal.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}`,
	]);
	yPos += 15;
	doc.setFont(undefined, 'normal');

	// doc.text(`File no:`, 45, yPos);
	// doc.text(`${data1.form1.file_no}`, 90, yPos);
	// doc.text(`__________________`, 90, yPos);

	doc.autoTable(columnsMain, rowsMain, {
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
	// doc.text(`File name:`, 45, yPos);
	// doc.text(`${data1.form1.file_name}`, 105, yPos);
	// doc.text(`__________________`, 105, yPos);

	yPos += 5;
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
	doc.setFontSize(12);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');

	// Footer Starts
	doc.page = 1;
	// doc.text(150, yPos, `Print date: ${Date()}`);
	doc.page += 1;
	// Footer Ends
	const date = Date().split(' ');
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
		doc.save(`Ledger_${accountSelected.label}_${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
