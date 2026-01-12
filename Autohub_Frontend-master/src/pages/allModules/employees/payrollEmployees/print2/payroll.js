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

const GeneratePDF = async (data1, dateOfPayroll, status, type) => {
	let data3 = null;
	try {
		data3 = Cookies.get('Data1') ? JSON.parse(Cookies.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	const LogoSrc = data3?.user?.logo_url !== 'NA' ? data3?.user?.logo_url : Logo1;
	let LogoBase64 = '';

	try {
		// Load the image and get the base64 representation
		LogoBase64 = await loadImage(LogoSrc);
	} catch (error) {
		console.error('Error loading logo image:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let totalAmountCalculation = 0;
	let totalLoan = 0;
	let totalAdvanceSalary = 0;
	let totalTax = 0;
	let totalPayable = 0;
	let totalOtherDeductions = 0;
	let totalOtherEarnings = 0;

	const tableColumnPayments = [
		'Sr No',
		'Employee Name',
		'Designation',
		'Salary',
		'Other Earnings',
		'Advance Salary',
		'Loan Borrowed',
		'Tax',
		'Other Deductions',
		'Salary Payable',
		'Payment Mode',
	];

	const tableRowsPayments = [];

	let count = 0;

	data1.forEach((data) => {
		count += 1;
		totalAmountCalculation += Number(data.basic_salary);
		totalLoan += Number(data.loan_adjust);
		totalAdvanceSalary += Number(data.advance_salary_adjust);
		totalTax += Number(data.tax);
		totalPayable += Number(data.total_payable);
		totalOtherEarnings += Number(
			data.other_allowance +
				data.medical_allowance +
				data.fuel_allowance +
				data.overtime_amount +
				data.bonus,
		);
		totalOtherDeductions += Number(data.deduction + data.late_fine + data.absent_fine);

		const TableData = [
			count,
			`${data.employee_id}-${data.employee.name}`,
			data.employee.employee_profile.designation.name,
			data.basic_salary.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			(
				data.other_allowance +
				data.medical_allowance +
				data.fuel_allowance +
				data.overtime_amount +
				data.bonus
			).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.advance_salary_adjust.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.loan_adjust.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.tax.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			(data.deduction + data.late_fine + data.absent_fine).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),

			data.total_payable.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.payment_mode,
		];

		tableRowsPayments.push(TableData);
	});

	tableRowsPayments.push([
		{
			content: `Total`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
		},

		{
			content: `${totalAmountCalculation.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalOtherEarnings.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalAdvanceSalary.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalLoan.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalTax.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${totalOtherDeductions.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},

		{
			content: `${totalPayable.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// startY is basically margin-top

	let yPos = 100;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 720, 20, 110, 80);
	doc.addImage(LogoBase64, 'JPEG', 40, 28, 75, 60);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(`${data3?.user?.company_name}`, pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Payroll', pageWidth / 2, 55, { align: 'center' });
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

	yPos += 5;
	doc.autoTable(tableColumnPayments, tableRowsPayments, {
		startY: yPos,
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
			5: {
				halign: 'right',
			},
			6: {
				halign: 'right',
			},
			7: {
				halign: 'right',
			},
			8: {
				halign: 'right',
			},
			9: {
				halign: 'right',
			},
			// 	// etc
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

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
		doc.save(`Payroll_${moment(dateOfPayroll).format('MMMM_YYYY')}${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
