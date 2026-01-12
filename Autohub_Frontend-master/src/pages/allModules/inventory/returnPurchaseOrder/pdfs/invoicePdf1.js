import Cookies from 'js-cookie';
import moment from 'moment';
import jsPDF from 'jspdf';
// import Logo from '../../../../../assets/logos/logo.png';
import 'jspdf-autotable';

const generateInvoicePDF = (invoiceData, type) => {
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// eslint-disable-next-line no-console

	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let yPos = 40;
	// doc.addImage(Logo, 'PNG', 50, yPos, 50, 50);
	const headTableColumns = [data3?.user?.company_name];
	const headTableRows = [];

	// headTableRows.push([
	// 	`Address: ${
	// 		invoiceData.parentData.branch.address === null
	// 			? ''
	// 			: invoiceData.parentData.branch.address
	// 	}`,
	// ]);
	// headTableRows.push([`Phone No.: ${invoiceData.parentData.branch.phone_no}`]);

	doc.autoTable(headTableColumns, headTableRows, {
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
	doc.text('PURCHASE ORDER INVOICE', pageWidth - 50, yPos + 10, { align: 'right' });
	doc.setTextColor('#000');
	const rightTableColumns = [''];
	const rightTableRows = [];

	rightTableRows.push([
		`Date: ${moment(invoiceData?.purchaseorderlist?.request_date ?? 'none').format(
			'DD/MM/YYYY',
		)}`,
	]);
	rightTableRows.push([`PO No. : ${invoiceData?.purchaseorderlist?.po_no ?? 'none'}`]);
	rightTableRows.push([
		`Status : ${
			// eslint-disable-next-line no-nested-ternary
			invoiceData?.purchaseorderlist?.is_approved === 0 &&
			invoiceData?.purchaseorderlist?.is_received === 0
				? 'Pending'
				: invoiceData?.purchaseorderlist?.is_approved === 1 &&
				  invoiceData?.purchaseorderlist?.is_received === 0
				? 'Approved'
				: 'Received'
		}`,
	]);

	doc.autoTable(rightTableColumns, rightTableRows, {
		startY: yPos + 10,
		margin: { left: pageWidth / 2 + 150 },
		tableWidth: 100,
		willDrawCell: false,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
	});
	yPos += 80;
	const vendorTableColumns = ['Supplier'];
	const vendorTableRows = [];

	vendorTableRows.push([`Name: ${invoiceData?.purchaseorderlist?.supplier?.name}`]);

	vendorTableRows.push([
		`Address: ${
			invoiceData?.purchaseorderlist?.supplier?.address === null
				? ''
				: invoiceData?.purchaseorderlist?.supplier?.address
		}`,
	]);
	vendorTableRows.push([`Phone No. : ${invoiceData?.purchaseorderlist?.supplier?.phone_no}`]);

	doc.autoTable(vendorTableColumns, vendorTableRows, {
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

	vendorTableRows1.push([`Name: ${invoiceData?.purchaseorderlist?.store?.name ?? 'none'}`]);

	vendorTableRows1.push([
		`Address: ${
			invoiceData?.purchaseorderlist?.store?.address === null
				? 'none'
				: invoiceData?.purchaseorderlist?.store?.address
		}`,
	]);

	doc.autoTable(vendorTableColumns1, vendorTableRows1, {
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
		`${invoiceData?.purchaseorderlist?.remarks === null ? 'Remarks' : ' Remarks'}`,
		pageWidth - 200,
		yPos + 10,
		{
			align: 'center',
		},
	);
	doc.setFont('Helvetica', 'normal');

	doc.text(
		`${
			invoiceData?.purchaseorderlist?.remarks === null
				? 'none'
				: invoiceData?.purchaseorderlist?.remarks
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
		'MODEL',
		'UOM',
		'QUANTITY',
		'PURCHASE PRICE',
		'AMOUNT',
		'REMARKS',
	];
	const tableRows = [];

	invoiceData?.purchaseorderlist?.purchaseorderchild?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item.machine_part_oem_part.oem_part_number.number1}/ ${item.item.machine_part_oem_part.oem_part_number?.number2}`,
			item.item.machine_part_oem_part.machine_part.name,
			item.item.brand.name,
			item.item.machine_part_oem_part.machine_partmodel?.name,
			item.item.machine_part_oem_part.machine_part.unit.name,

			item?.quantity,
			item?.purchase_price ?? 'none',
			item?.amount ?? 'none',
			item?.remarks,
		];

		tableRows.push(itemsData);
	});

	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		theme: 'grid',
		columnStyles: { 4: { fillColor: '#f2f2f2' } },
		styles: { fontSize: 8, theme: 'grid' },
		headStyles: { fillColor: '#808080' },
	});

	// Sub Total Table
	yPos = doc.lastAutoTable.finalY + 3;
	const subTotalColumns = ['TOTAL', `${invoiceData?.purchaseorderlist?.total ?? 0}`];
	const subTotalRows = [];

	doc.autoTable(subTotalColumns, subTotalRows, {
		startY: yPos,
		margin: { left: pageWidth / 2 + 180 },
		tableWidth: 80,
		theme: 'plain',
		styles: {
			cellPadding: 1,
			fontSize: 8,
		},
		headStyles: { fillColor: '#fff', textColor: '#000' },
	});

	// yPos = doc.lastAutoTable.finalY + 3;
	// const subTotalColumns1 = ['TAX %', `${invoiceData?.purchaseorderlist?.tax ?? 0}`];
	// const subTotalRows1 = [];

	// doc.autoTable(subTotalColumns1, subTotalRows1, {
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

	// yPos = doc.lastAutoTable.finalY + 3;
	// const subTotalColumn = [
	// 	'TAX in Figure',
	// 	`${invoiceData?.purchaseorderlist?.tax_in_figure ?? 0}`,
	// ];
	// const subTotalRow = [];

	// doc.autoTable(subTotalColumn, subTotalRow, {
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

	yPos = doc.lastAutoTable.finalY + 3;
	const subTotalColumns2 = ['DISCOUNT', `${invoiceData?.purchaseorderlist?.discount ?? 0}`];
	const subTotalRows2 = [];

	doc.autoTable(subTotalColumns2, subTotalRows2, {
		startY: yPos,
		margin: { left: pageWidth / 2 + 180 },
		tableWidth: 80,
		theme: 'plain',
		styles: {
			cellPadding: 1,
			fontSize: 8,
		},
		headStyles: { fillColor: '#fff', textColor: '#000' },
	});

	yPos = doc.lastAutoTable.finalY + 3;
	const subTotalColumns3 = [
		'GRAND TOTAL',
		`${invoiceData?.purchaseorderlist?.total_after_discount ?? 0}`,
	];
	const subTotalRows3 = [];

	doc.autoTable(subTotalColumns3, subTotalRows3, {
		startY: yPos,
		margin: { left: pageWidth / 2 + 180 },
		tableWidth: 80,
		theme: 'plain',
		styles: {
			cellPadding: 1,
			fontSize: 8,
		},
		headStyles: { fillColor: '#fff', textColor: '#000' },
	});

	// doc.setTextColor('#000');
	// yPos += 10;

	// const instructionsTableColumn = ['Comments or Special Instructions', '', '', '', ''];
	// const instructionTableRows = [];

	// const instructions = [
	// 	{
	// 		content: `${
	// 			invoiceData?.purchaseorderlist?.purchaseorderchild?.remarks === null
	// 				? 'none'
	// 				: invoiceData?.purchaseorderlist?.purchaseorderchild?.remarks
	// 		}`,
	// 		colSpan: 5,
	// 		rowSpan: 1,
	// 	},
	// ];

	// instructionTableRows.push(instructions);

	// doc.autoTable(instructionsTableColumn, instructionTableRows, {
	// 	tableLineColor: [189, 195, 199],
	// 	tableLineWidth: 0.75,
	// 	startY: yPos,
	// 	startX: 50,
	// 	tableWidth: 200,
	// 	willDrawCell: false,
	// 	theme: 'plain',
	// 	styles: { fontSize: 8 },
	// 	headStyles: { fillColor: '#BFBFBF', textColor: '#000' },
	// });

	if (type === 1) {
		doc.save(`Invoice Details ${moment()}`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default generateInvoicePDF;
