// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import moment from 'moment';
// import logos from '../../../../assets/logos/logo1.png';
import Logo from '../../../../components/logo/miniLogo.png';
// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument

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
const quotationPdf = async (data1, type) => {
	let data3 = 'Spareparts';
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : 'SpareParts';
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	const LogoSrc = data3?.user?.logo_url !== 'NA' ? data3?.user?.logo_url : Logo;
	let LogoBase64 = '';

	try {
		LogoBase64 = await loadImage(LogoSrc);
	} catch (error) {
		console.error('Error loading logo image:', error);
	}

	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	const tableColumns = ['S.No.', 'Item Name', 'Qty', 'Price', 'Total'];
	const tableRows = [];
	// eslint-disable-next-line no-unused-vars
	let totQty = 0;
	// eslint-disable-next-line no-unused-vars
	let grandTotal = 0;

	data1.quotChild?.forEach((item, index) => {
		// eslint-disable-next-line prettier/prettier
		totQty += item.quantity;
		const rowTotal = item.quantity * item.quoted_price;
		// eslint-disable-next-line prettier/prettier
		grandTotal += rowTotal;
		const itemsData = [index + 1, item.item?.name, item.quantity, item.quoted_price, rowTotal];

		tableRows.push(itemsData);
	});
	tableRows.push(['', 'Total', totQty, '', grandTotal]);

	// startY is basically margin-top

	let yPos = 100;

	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });

	if (LogoBase64) {
		doc.addImage(LogoBase64, 'JPEG', 40, 30, 50, 50);
	}
	yPos += 10;
	doc.setFontSize(14);
	doc.setFont(undefined, 'bold');
	doc.text(`${data3?.user?.company_name}`, 100, 45, { align: 'left' });

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`E-mail: ${data3?.user?.email}`, 100, 65, { align: 'left' });

	doc.text(`Cell: ${data3?.user?.phone}`, 100, 85, {
		align: 'left',
	});

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Address : ${data3?.user?.address}, ${data3?.user?.city}`, 100, 105, {
		align: 'left',
	});

	yPos += 70;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(18);
	doc.text('Quotation', pageWidth / 2, 140, { align: 'center' });

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('REF.    ________________', 40, 140, { align: 'left' });
	doc.text(data1?.quotation?.ref_no || '', 70, 140, {
		align: 'left',
	});
	yPos = 156;

	doc.setFont(undefined, 'normal');
	doc.text('To,', 40, yPos, { align: 'left' });
	doc.setFont(undefined, 'bold');
	yPos += 10;

	doc.text(
		data1?.quotation?.sale_type === 2
			? data1?.quotation?.customer?.name
			: data1?.quotation?.walk_in_customer_name,
		40,
		yPos,
		{
			align: 'left',
		},
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	yPos += 15;

	doc.text(
		data1?.quotation?.sale_type === 2 ? data1?.quotation?.customer?.address || '' : '',
		40,
		yPos,
		{ align: 'left' },
	);
	if (data1?.quotation?.sale_type === 2) {
		yPos += 15;
	}

	doc.setFontSize(10);
	doc.text(
		data1?.quotation?.sale_type === 2
			? data1?.quotation?.customer?.phone_no || ''
			: data1?.quotation?.walk_in_customer_phone || '',
		40,
		yPos,
		{
			align: 'left',
		},
	);
	yPos += 20;

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sub:-', 40, yPos, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(data1?.quotation?.remarks || '', 77, yPos, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('________', 77, yPos, { align: 'left' });
	doc.setFontSize(10);
	yPos += 5;

	// doc.setFont(undefined, 'bold');
	// doc.text(`Date Printed:`, pageWidth - 180, 140, {
	// 	align: 'right',
	// });
	// doc.text(`______________________`, pageWidth - 60, 140, {
	// 	align: 'right',
	// });
	// doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 60, 140, {
	// 	align: 'right',
	// });

	doc.autoTable({
		head: [tableColumns],
		body: tableRows,
		startY: yPos,
		headStyles: {
			fillColor: [217, 217, 214],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		styles: { fontSize: 10 },
		columnStyles: {
			0: { cellWidth: 40 },
		},
		bodyStyles: {
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
	});

	yPos = doc.lastAutoTable.finalY + 20;
	yPos += 30;

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Thanks and Regards.`, 40, yPos, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	yPos += 20;

	doc.text(`${data3?.user?.name ? data3?.user?.name : ''}`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');

	doc.text(`${data1?.quotation?.termcondition || ''}`, 40, yPos, {
		align: 'left',
	});

	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(10);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(10);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');

	// Footer Starts
	doc.page = 1;

	doc.page += 1;
	// Footer Ends
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
	// PageNumbering
	const pageCount = doc.internal.getNumberOfPages();
	for (let i = 1; i <= pageCount; i += 1) {
		doc.setPage(i); // nevigate to existing pages
		doc.text(
			`Page   ${i} of  ${pageCount}`,
			doc.internal.pageSize.width - 80,
			doc.internal.pageSize.height - 10,
		);
	}
	doc.setFontSize(10);

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default quotationPdf;
