// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import Logo1 from '../../../../../components/logo/Lucky_Hydraulic_Parts_Logo.png';

const loadImage = (src) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.src = src;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.fillStyle = '#FFFFFF';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);
			resolve(canvas.toDataURL('image/jpeg'));
		};
		img.onerror = (error) => reject(error);
	});
};

const GeneratePDF = async (data1, dateOfPayroll, status, Account, ChequeNo, type) => {
	
	let data = null;
	try {
		data = Cookies.get('Data1') ? JSON.parse(Cookies.get('Data1')) : null;
		console.log('The logo url is:', data);
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	const LogoSrc = data?.user?.logo_url !== 'NA' ? data?.user?.logo_url : Logo1;
	let LogoBase64 = '';

	try {
		// Load the image and get the base64 representation
		LogoBase64 = await loadImage(LogoSrc);
	} catch (error) {
		console.error('Error loading logo image:', error);
	}

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let totalPayable = 0;

	const tableColumnPayments = [
		'Sr No',
		'Employee id',
		'Employee Name',
		'Account Number',
		'Salary Payable',
	];

	const tableRowsPayments = [];

	let count = 0;

	data1.forEach((data) => {
		totalPayable += Number(data.total_payable);
		if (data.payment_mode === 'Account Transfer') {
			count += 1;
			const TableData = [
				count,
				`${data.employee_id}`,
				`${data.employee.name}`,
				data.employee.employee_profile.bank_account_number,

				data.total_payable.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}),
				data.payment_mode,
			];

			tableRowsPayments.push(TableData);
		}
	});

	tableRowsPayments.push([
		{
			content: `Total`,
			colSpan: 4,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
		},

		{
			content: `${totalPayable.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;
	doc.addImage(LogoBase64, 'JPEG', 40, 28, 75, 60);


	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('REHBAR HOUSING SOCIETY', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Bank Request Letter', pageWidth / 2, 55, { align: 'center' });
	doc.text(`For the month of ${moment(dateOfPayroll).format('MMMM, YYYY')}`, pageWidth / 2, 70, {
		align: 'center',
	});

	doc.setFont(undefined, 'normal');

	doc.text(`Status:`, pageWidth - 180, yPos, {
		align: 'right',
	});
	doc.text(`__________________`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.text(`${status}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	yPos += 20;

	doc.text(`Date Printed:`, pageWidth - 180, yPos, {
		align: 'right',
	});
	doc.text(`__________________`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	yPos += 20;
	doc.text(`The Manager`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.text(`Bank Al-Habib Ltd.,`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.text(`Chakri Road, Rawalpindi.`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;

	doc.text(
		`Subject:      Request for Staff Salaries Transfer from Company A/C to Staff A/Cs`,
		40,
		yPos,
		{
			align: 'left',
			fontStyle: 'bold',
		},
	);
	yPos += 30;
	doc.setFont(undefined, 'bold');

	doc.text(`Dear Sir,`, 40, yPos, {
		align: 'left',
	});
	doc.setFont(undefined, 'normal');

	yPos += 30;
	doc.text(
		`Our company A/C # ${Account} is being maintained into your branch. You are requested\nto please transfer the following given detailed salaries for month of ${moment(
			dateOfPayroll,
		).format('MMMM, YYYY')}\ninto the given account by the company CHQ #: ${ChequeNo}`,
		40,
		yPos,
		{
			align: 'left',
		},
	);
	yPos += 50;
	doc.autoTable(tableColumnPayments, tableRowsPayments, {
		startY: yPos,
		styles: { fontSize: 7 },
		// columnStyles: {
		// 	0: { cellWidth: 30 },
		// 	1: { cellWidth: 30 },
		// 	2: { cellWidth: 60 },
		// 	3: { cellWidth: 80 },
		// 	// etc
		// },
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos += 20;
	doc.text(`Thanks & regards,`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.text(`Kashmir Builders & Developers (Pvt) Ltd,`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.setFont(undefined, 'bold');

	doc.text(`Ashfaq Ahmed,`, 40, yPos, {
		align: 'left',
		fontStyle: 'bold',
	});
	yPos += 20;
	doc.text(`C.E.O,`, 40, yPos, {
		align: 'left',
		fontStyle: 'bold',
	});
	doc.setFont(undefined, 'normal');

	doc.setFontSize(12);

	
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('Kashmir Builders and Developers', 46, 20);
	doc.setFontSize(12);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	
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
	
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
	let str = `Page ${doc.internal.getNumberOfPages()}`;
	// Total page number plugin only available in jspdf v1.0+
	if (typeof doc.putTotalPages === 'function') {
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.setFontSize(10);

	// jsPDF 1.4+ uses getWidth, <1.4 uses .width
	// eslint-disable-next-line prefer-destructuring
	// const pageSize = doc.internal.pageSize;
	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Bank_Request_Letter${moment(dateOfPayroll).format('MMMM_YYYY')}${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
