// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// import Logo from '../../../../../assets/logos/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	// initialize jsPDF
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Item',
		'OEM',
		// 'Avg Price',
		// 'Avg Exp',
		'Avg Cost ',
		'Min Price',
		'Max Price',
		'Sale Price',
		'Last Sale Price',
		'Purchase Price',
		'Purchase Price($)',
	];

	const tableRows = [];

	data1?.data?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			item.item.name,
			item?.item?.machine_part_oem_part?.oem_part_number?.number1,
			// item?.AvgPrice?.toLocaleString(undefined, {
			// 	maximumFractionDigits: 2,
			// }),
			// item?.AvgExpense?.toLocaleString(undefined, {
			// 	maximumFractionDigits: 2,
			// }),
			item?.item?.avg_cost?.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			item.item.min_price === null
				? ''
				: item.item.min_price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
			item.item.max_price === null
				? ''
				: item.item.max_price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
			item.item.sale_price === null
				? ''
				: item.item.sale_price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
			item.item.last_sale_price === null
				? ''
				: item.item.last_sale_price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
			item.item.purchase_price === null
				? ''
				: item.item.purchase_price.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
			item.item.purchase_dollar_rate === null
				? ''
				: item.item.purchase_dollar_rate.toLocaleString(undefined, {
						maximumFractionDigits: 2,
				  }),
		];

		tableRows.push(itemsData);
	});

	// startY is basically margin-top

	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(data3?.user?.company_name, pageWidth / 2, 40, { align: 'center' });

	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Cost Report', pageWidth / 2, 55, { align: 'center' });

	yPos += 20;

	doc.text(`Cost:`, 45, yPos);
	yPos += 10;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		styles: { fontSize: 8, rowHeight: 10, cellPadding: 5 },
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

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
		doc.save(`Cost${dateStr}.pdf`);
	} else if (type === 2) {
		const pdfBlob = doc.output('blob');
		const pdfURL = URL.createObjectURL(pdfBlob);
		window.open(pdfURL, '_blank');
	}
};

export default GeneratePDF;
