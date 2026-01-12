import Cookies from 'js-cookie';
import moment from 'moment';
import jsPDF from 'jspdf';
// import Logo from '../../../../../assets/logos/logo.png';
import autoTable from 'jspdf-autotable';

const generatePDF = (purchaseDetails, type) => {
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// eslint-disable-next-line no-console
	console.log('PDF', purchaseDetails);

	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let yPos = 40;
	// doc.addImage(Logo, 'PNG', 50, yPos, 50, 50);
	const headTableColumns = [data3?.user?.company_name || ''];
	const headTableRows = [];

	// headTableRows.push([
	// 	`Address: ${
	// 		purchaseDetails.parentData.branch.address === null
	// 			? ''
	// 			: purchaseDetails.parentData.branch.address
	// 	}`,
	// ]);
	// headTableRows.push([`Phone No.: ${purchaseDetails.parentData.branch.phone_no}`]);

	autoTable(doc, {
		head: [headTableColumns],
		body: headTableRows,
		startY: yPos,
		tableWidth: 250,
		theme: 'plain',
		margin: { left: 120 },
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: { fontSize: 14 },
	});

	doc.setFontSize(14);
	doc.setFont('Helvetica', 'bold');
	doc.setTextColor('#000');
	doc.text('PURCHASE ORDER', pageWidth - 50, yPos + 10, { align: 'right' });
	doc.setTextColor('#000');
	const rightTableColumns = [''];
	const rightTableRows = [];

	rightTableRows.push([
		`Date: ${moment(purchaseDetails?.purchaseorderlist?.request_date ?? 'none').format(
			'DD/MM/YYYY',
		)}`,
	]);
	rightTableRows.push([`PO No. : ${purchaseDetails?.purchaseorderlist?.po_no}`]);
	rightTableRows.push([
		`Status : ${
		// eslint-disable-next-line no-nested-ternary
		purchaseDetails?.purchaseorderlist?.is_approve === 0 &&
			purchaseDetails?.purchaseorderlist?.is_received === 0
			? 'Pending'
			: purchaseDetails?.purchaseorderlist?.is_approve === 1 &&
				purchaseDetails?.purchaseorderlist?.is_received === 0
				? 'Approved'
				: 'Received'
		}`,
	]);

	autoTable(doc, {
		head: [rightTableColumns],
		body: rightTableRows,
		startY: yPos + 10,
		margin: { left: pageWidth / 2 + 150 },
		tableWidth: 100,
		// willDrawCell: false, // deprecated or incorrect usage
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
	});
	yPos += 80;
	const vendorTableColumns = ['Supplier'];
	const vendorTableRows = [];

	vendorTableRows.push([`Name: ${purchaseDetails?.purchaseorderlist?.supplier?.name}`]);

	vendorTableRows.push([
		`Address: ${purchaseDetails?.purchaseorderlist?.supplier?.address === null
			? 'none'
			: purchaseDetails?.purchaseorderlist?.supplier?.address
		}`,
	]);
	vendorTableRows.push([`Phone No. : ${purchaseDetails?.purchaseorderlist?.supplier?.phone_no}`]);

	autoTable(doc, {
		head: [vendorTableColumns],
		body: vendorTableRows,
		startY: yPos,
		startX: 50,
		tableWidth: 200,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: { fillColor: '#808080', textColor: '#fff' },
	});
	yPos += 60;
	const vendorTableColumns1 = ['Store'];
	const vendorTableRows1 = [];

	vendorTableRows1.push([`Name: ${purchaseDetails?.purchaseorderlist?.store?.name ?? 'none'}`]);

	vendorTableRows1.push([
		`Address: ${purchaseDetails?.purchaseorderlist?.store?.address === null
			? 'none'
			: purchaseDetails?.purchaseorderlist?.store?.address
		}`,
	]);

	autoTable(doc, {
		head: [vendorTableColumns1],
		body: vendorTableRows1,
		startY: yPos,
		startX: 50,
		tableWidth: 200,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: { fillColor: '#808080', textColor: '#fff' },
	});

	doc.setFontSize(8);
	doc.setFont('Helvetica', 'bold');
	doc.text(
		`${purchaseDetails?.purchaseorderlist?.remarks === null ? 'Remarks' : ' Remarks'}`,
		pageWidth - 200,
		yPos + 10,
		{
			align: 'center',
		},
	);
	doc.setFont('Helvetica', 'normal');

	doc.text(
		`${purchaseDetails?.purchaseorderlist?.remarks === null
			? 'none'
			: purchaseDetails?.purchaseorderlist?.remarks
		}`,
		pageWidth - 120,
		yPos + 10,
		{
			align: 'center',
			maxWidth: 100,
		},
	);

	yPos += 50;

	const tableColumns = [
		'S.No.',
		'OEM/ PART NO',
		'ITEM',
		'BRAND',
		// 'MODEL',
		'UOM',
		'QUANTITY',
		'REMARKS',
	];
	const tableRows = [];

	purchaseDetails?.purchaseorderlist?.purchaseorderchild?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item.machine_part_oem_part.oem_part_number.number1}/ ${item.item.machine_part_oem_part.oem_part_number?.number2}`,
			item.item.machine_part_oem_part.machine_part.name,
			item.item.brand.name,
			// item.item.machine_part_oem_part.machine_partmodel?.name,
			item.item.machine_part_oem_part.machine_part.unit.name,

			item?.quantity,
			item?.remarks,
		];

		tableRows.push(itemsData);
	});

	autoTable(doc, {
		head: [tableColumns],
		body: tableRows,
		startY: yPos,
		theme: 'grid',
		columnStyles: { 4: { fillColor: '#f2f2f2' } },
		styles: { fontSize: 8, theme: 'grid' },
		headStyles: { fillColor: '#808080' },
	});

	// Sub Total Table
	// yPos = doc.lastAutoTable.finalY + 3;
	// const subTotalColumns = ['TOTAL', `${t}`];
	// const subTotalRows = [];

	// autoTable(doc, {
	//  head: [subTotalColumns],
	//  body: subTotalRows,
	// 	startY: yPos,
	// 	margin: { left: pageWidth / 2 + 180 },
	// 	tableWidth: 80,
	// 	theme: 'plain',
	// 	styles: {
	// 		cellPadding: 1,
	// 		fontSize: 8,
	// 	},
	// 	headStyles: { fillColor: '#fff', textColor: '#000' },
	// });
	// doc.setTextColor('#000');
	// yPos += 80;

	// const instructionsTableColumn = ['Comments or Special Instructions', '', '', '', ''];
	// const instructionTableRows = [];

	// const instructions = [
	// 	{
	// 		content: `${
	// 			purchaseDetails?.purchaseorderlist?.purchaseorderchild?.remarks === null
	// 				? 'none'
	// 				: purchaseDetails?.purchaseorderlist?.purchaseorderchild?.remarks
	// 		}`,
	// 		colSpan: 5,
	// 		rowSpan: 1,
	// 	},
	// ];

	// instructionTableRows.push(instructions);

	// autoTable(doc, {
	//  head: [instructionsTableColumn],
	//  body: instructionTableRows,
	// 	tableLineColor: [189, 195, 199],
	// 	tableLineWidth: 0.75,
	// 	startY: yPos,
	// 	startX: 50,
	// 	tableWidth: 200,
	// 	// willDrawCell: false,
	// 	theme: 'plain',
	// 	styles: { fontSize: 8 },
	// 	headStyles: { fillColor: '#BFBFBF', textColor: '#000' },
	// });

	if (type === 1) {
		doc.save(`Purchase Order Details ${moment()}`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default generatePDF;
