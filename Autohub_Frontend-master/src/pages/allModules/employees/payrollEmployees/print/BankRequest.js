// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';



const GeneratePDF = (data1, dateOfPayroll, status, Account, ChequeNo, type) => {
	let data3 = null;
	try {
		data3 = Cookies.get('Data1') ? JSON.parse(Cookies.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// eslint-disable-next-line no-unused-vars
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	// eslint-disable-next-line no-unused-vars
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let totalPayable = 0;

	const tableColumnPayments = [
		'Sr No',
		// 'Employee id',
		'Employee Name',
		'Account Number',
		'Salary Payable',
	];

	const tableRowsPayments = [];

	let count = 0;

	data1.forEach((data) => {
		if (
			data.payment_mode === 'Account Transfer' &&
			Math.abs(data.employee.employee_payable_account.balance.balance) > 0
		) {
			totalPayable += Number(
				data.employee.employee_payable_account.balance
					? data.employee.employee_payable_account.balance.balance
					: 0,
			);

			count += 1;
			const TableData = [
				count,
				// `${data.employee_id}`,
				`${data.employee.name}`,
				data.employee.employee_profile.bank_account_number,

				data.employee.employee_payable_account.balance
					? Math.abs(
							data.employee.employee_payable_account.balance.balance,
					  ).toLocaleString(undefined, {
							maximumFractionDigits: 2,
					  })
					: 0,
				data.payment_mode,
			];

			tableRowsPayments.push(TableData);
		}
	});

	tableRowsPayments.push([
		{
			content: `Total`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},

		{
			content: `${Math.abs(totalPayable).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;
	// doc.addImage(kbdLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 720, 20, 110, 80);

	yPos += 60;
	doc.setFont(undefined, 'bold');
	// doc.text('REHBAR HOUSING SOCIETY', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	// doc.text('Bank Request Letter', pageWidth / 2, 55, { align: 'center' });
	// doc.text(`For the month of ${moment(dateOfPayroll).format('MMMM, YYYY')}`, pageWidth / 2, 70, {
	// 	align: 'center',
	// });

	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);

	// doc.text(`Status:`, pageWidth - 150, yPos, {
	// 	align: 'right',
	// });
	// doc.text(`___________________`, pageWidth - 40, yPos, {
	// 	align: 'right',
	// });
	// doc.text(`${status}`, pageWidth - 40, yPos, {
	// 	align: 'right',
	// });
	// yPos += 15;

	// doc.text(`Date Printed:`, pageWidth - 150, yPos, {
	// 	align: 'right',
	// });
	// doc.text(`___________________`, pageWidth - 40, yPos, {
	// 	align: 'right',
	// });
	// doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
	// 	align: 'right',
	// });
	yPos += 15;

	// doc.text(`Date:`, pageWidth - 100, yPos, {
	// 	align: 'right',
	// });
	// doc.text(`${moment().format('DD/MM/YYYY')}`, pageWidth - 40, yPos, {
	// 	align: 'right',
	// });
	doc.text(`The Manager`, 40, yPos, {
		align: 'left',
	});
	yPos += 10;
	doc.text(`Bank Al-Habib Ltd.,`, 40, yPos, {
		align: 'left',
	});
	yPos += 10;
	doc.text(`Chakri Road, Rawalpindi.`, 40, yPos, {
		align: 'left',
	});
	yPos += 10;

	doc.text(
		`Subject:      Request for Staff Salaries Transfer from Company A/C to Staff A/Cs`,
		40,
		yPos,
		{
			align: 'left',
			fontStyle: 'bold',
		},
	);
	yPos += 15;
	doc.setFont(undefined, 'bold');

	doc.text(`Dear Sir,`, 40, yPos, {
		align: 'left',
	});
	doc.setFont(undefined, 'normal');

	yPos += 10;
	doc.text(
		`Our company A/C # ${Account} is being maintained into your branch. You are requested\nto please transfer the following given detailed salaries for month of ${moment(
			dateOfPayroll,
		).format('MMMM, YYYY')}\ninto the given account by the company CHQ #: ${ChequeNo}.`,
		40,
		yPos,
		{
			align: 'left',
		},
	);
	yPos += 30;
	doc.autoTable(tableColumnPayments, tableRowsPayments, {
		startY: yPos,
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		headStyles: {
			fillColor: [225, 225, 225],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		theme: 'grid',
		columnStyles: {
			// 	0: { cellWidth: 30 },
			// 	1: { cellWidth: 30 },
			// 	2: { cellWidth: 60 },
			3: {
				halign: 'right',
			},
			4: {
				halign: 'right',
			},
			// 	// etc
		},
		// rowStyles: {
		// 	0: { rowHeight: 200 },
		// },
	});
	yPos = doc.lastAutoTable.finalY + 20;

	if (yPos > 800) {
		doc.addPage();
		yPos = 45;
	}

	doc.text(`Thanks & regards,`, 40, yPos, {
		align: 'left',
	});
	yPos += 10;
	if (yPos > 800) {
		doc.addPage();
		yPos = 45;
	}
	doc.text(`${data3?.user?.company_name},`, 40, yPos, {
		align: 'left',
	});
	yPos += 10;
	if (yPos > 800) {
		doc.addPage();
		yPos = 45;
	}
	doc.setFont(undefined, 'bold');

	doc.text(`${data3?.user?.name},`, 40, yPos, {
		align: 'left',
		fontStyle: 'bold',
	});
	yPos += 10;
	if (yPos > 800) {
		doc.addPage();
		yPos = 45;
	}
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
		// eslint-disable-next-line no-unused-vars
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.setFontSize(10);

	// jsPDF 1.4+ uses getWidth, <1.4 uses .width
	// eslint-disable-next-line prefer-destructuring
	// const pageSize = doc.internal.pageSize;
	// doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Bank_Request_Letter${moment(dateOfPayroll).format('MMMM_YYYY')}${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
