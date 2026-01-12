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
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// startY is basically margin-top
	let yPos = 0;

	data1.forEach((data) => {
		yPos += 30;
		const totalDeductions =
			Number(data.tax) +
			Number(data.advance_salary_adjust) +
			Number(data.loan_adjust) +
			Number(data.deduction) +
			Number(data.late_fine) +
			Number(data.absent_fine);
		const totalEarnings =
			Number(data.other_allowance) +
			Number(data.medical_allowance) +
			Number(data.fuel_allowance) +
			Number(data.overtime_amount) +
			Number(data.bonus) +
			Number(data.basic_salary);

			doc.addImage(LogoBase64, 'JPEG', 40, 28, 75, 60);

		yPos += 15;

		// doc.addImage(kbdLogo, 'JPEG', 720, yPos, 110, 80);

		yPos += 15;
		doc.setFontSize(14);

		doc.setFont(undefined, 'bold');
		doc.text('REHBAR HOUSING SOCIETY', pageWidth / 2, yPos, { align: 'center' });
		yPos += 15;

		doc.setFontSize(12);
		doc.setFont(undefined, 'normal');

		doc.text('Salary Slip', pageWidth / 2, yPos, { align: 'center' });
		yPos += 15;

		doc.text(
			`For the month of ${moment(dateOfPayroll).format('MMMM, YYYY')}`,
			pageWidth / 2,
			yPos,
			{
				align: 'center',
			},
		);
		yPos += 15;

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

		doc.setFontSize(12);
		doc.setFont(undefined, 'normal');

		// doc.text('Salary Slip', pageWidth / 2, 55, { align: 'center' });

		yPos += 5;

		const rowsMain = [];
		const columnsMain = [' ', ' ', ' ', ' '];

		rowsMain.push(['Employee ID:', `${data.employee_id}`, 'Pay Date: ', '']);
		rowsMain.push([
			'Employee Name:',
			`${data.employee.name}`,
			'Date of Joining:: ',
			`${moment(data.employee.employee_profile.joining_date).format('DD-MM-YYYY')}`,
		]);
		rowsMain.push([
			'Designation:',
			`${data.employee.employee_profile.designation.name}`,
			'Days worked: ',
			`${data.working_days}`,
		]);
		rowsMain.push([
			'CNIC Number:',
			`${data.employee.cnic}`,
			'Payment Mode: ',
			`${data.payment_mode}`,
		]);
		rowsMain.push([
			'Mobile Number:',
			`${data.employee.phone_no}`,
			'Gender:',
			`${data.employee.employee_profile.gender}`,
		]);

		doc.autoTable(columnsMain, rowsMain, {
			theme: 'plain',
			headStyles: {
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				lineWidth: 0,
			},
			bodyStyles: {
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
			},
			styles: {
				halign: 'left',
				// fontStyle: 'bold',
				fontSize: 12,
				lineWidth: 0,
				lineColor: [0, 0, 0],
			},
			startY: yPos,
		});
		yPos = doc.lastAutoTable.finalY + 20;

		const rowsDetail = [];
		const columnDetail = ['Earnings ', 'Amount', 'Deductions', 'Amount'];

		rowsDetail.push([
			'Basic Salary:',
			`${data.basic_salary}`,
			'Advance Salary:',
			`${data.advance_salary_adjust}`,
		]);
		rowsDetail.push([
			'Medical Allowance :',
			`${data.medical_allowance}`,
			'Loan: ',
			`${data.loan_adjust}`,
		]);
		rowsDetail.push(['Fuel Allowance::', `${data.fuel_allowance}`, 'Tax: ', `${data.tax}`]);
		rowsDetail.push([
			'Other Allowance:',
			`${data.other_allowance}`,
			'Absent Fine:',
			`${data.absent_fine}`,
		]);
		rowsDetail.push([
			'Overtime Amount ::',
			`${data.overtime_amount}`,
			'Late Fine::',
			`${data.late_fine}`,
		]);
		rowsDetail.push(['Bonus:', `${data.bonus}`, 'Other Deductions:', `${data.deduction}`]);

		rowsDetail.push([
			{
				content: `Total Earnings`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
			},

			{
				content: `${totalEarnings.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Deductions`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `${totalDeductions.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
			},
		]);

		rowsDetail.push([
			{
				content: `Net Salary:`,
				colSpan: 2,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 10, lineWidth: 1 },
			},

			{
				content: `${(totalEarnings - totalDeductions).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 2,
				rowSpan: 1,
				styles: { halign: 'center', fontStyle: 'bold', fontSize: 10, lineWidth: 1 },
			},
		]);

		doc.autoTable(columnDetail, rowsDetail, {
			theme: 'plain',
			headStyles: {
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				lineWidth: 1,
			},
			bodyStyles: {
				fillColor: [255, 255, 255],
				textColor: [0, 0, 0],
				lineWidth: 1,
			},
			styles: {
				halign: 'left',
				// fontStyle: 'bold',
				fontSize: 12,
				lineWidth: 0,
				lineColor: [0, 0, 0],
			},
			startY: yPos,
		});
		yPos = doc.lastAutoTable.finalY + 50;
		doc.setFont(undefined, 'bold');
		doc.line(40, yPos, 260, yPos);
		doc.line(pageWidth / 2 + 40, yPos, pageWidth / 2 + 40 + 220, yPos);
		yPos += 10;
		doc.text(`Employee' Signature`, pageWidth / 2 / 2, yPos, {
			align: 'center',
		});
		doc.text(`Director' Signature`, pageWidth / 2 + pageWidth / 2 / 2, yPos, {
			align: 'center',
		});
		doc.setFont(undefined, 'normal');
		doc.addPage();
		yPos = 0;
	});

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
		doc.save(`Salary_Slip${moment(dateOfPayroll).format('MMMM_YYYY')}${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
