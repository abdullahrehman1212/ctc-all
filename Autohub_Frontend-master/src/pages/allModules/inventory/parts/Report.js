// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// import Logo from '../../../../../assets/logos/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	// initialize jsPDF
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumns = ['S.No.', 'OEM/ Part No', 'Name', 'Brand', 'Model', 'Uom', 'Qty', 'Store'];

	const tableRows = [];

	data1?.data?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item?.machine_part_oem_part.oem_part_number.number1}/ ${item.item?.machine_part_oem_part.oem_part_number?.number2}`,
			item.item?.machine_part_oem_part.machine_part.name,
			item.item?.brand.name,
			item.item?.machine_part_oem_part.machine_partmodel?.name,
			item.item?.machine_part_oem_part.machine_part.unit.name,
			item.quantity,
			item.store?.name,
		];

		tableRows.push(itemsData);
	});

	// startY is basically margin-top

	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(20);
	doc.setFont(undefined, 'normal');

	doc.text('Part Stock List Report', pageWidth / 2, 55, { align: 'center' });

	yPos += 20;
doc.setFontSize(10);
	doc.text(`Part Stock List:`, 45, yPos);
	yPos += 5;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		styles: { fontSize: 8 },
		columnStyles: {
			0: { cellWidth: 50 },
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
		doc.save(`PartListReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
