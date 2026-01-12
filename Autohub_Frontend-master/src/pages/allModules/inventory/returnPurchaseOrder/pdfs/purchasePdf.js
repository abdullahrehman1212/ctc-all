import Cookies from 'js-cookie';
import moment from 'moment';
import jsPDF from 'jspdf';
// import Logo from '../../../../../assets/logos/logo.png';
import 'jspdf-autotable';

const generatePDF1 = (purchaseDetails, type) => {
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error);
	}
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// eslint-disable-next-line no-console
	console.log('PDF purchaseDetails:', JSON.stringify(purchaseDetails, null, 2));
	
	// Check if data is nested under parentData (like in invoice PDF)
	const data = purchaseDetails?.parentData || purchaseDetails;

	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let yPos = 40;
	// doc.addImage(Logo, 'PNG', 50, yPos, 50, 50);
	const headTableColumns = [data3?.user?.company_name];
	const headTableRows = [];

	// headTableRows.push([
	// 	`Address: ${
	// 		purchaseDetails.parentData.branch.address === null
	// 			? ''
	// 			: purchaseDetails.parentData.branch.address
	// 	}`,
	// ]);
	// headTableRows.push([`Phone No.: ${purchaseDetails.parentData.branch.phone_no}`]);

	doc.autoTable({
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
	doc.text('RETURN PURCHASE ORDER', pageWidth - 50, yPos + 10, { align: 'right' });
	doc.setTextColor('#000');
	const rightTableColumns = [''];
	const rightTableRows = [];

	let returnDate = 'N/A';
	if (data?.return_date) {
		const dateMoment = moment(data.return_date);
		returnDate = dateMoment.isValid() ? dateMoment.format('DD/MM/YYYY') : 'N/A';
	}
	rightTableRows.push([`Return Date: ${returnDate}`]);
	rightTableRows.push([`PO No. : ${data?.purchaseorder?.po_no ?? 'N/A'}`]);
	rightTableRows.push([
		`Status : ${
			// eslint-disable-next-line no-nested-ternary
			data?.purchaseorder?.is_approve === 0 &&
			data?.purchaseorder?.is_received === 0
				? 'Pending'
				: data?.purchaseorder?.is_approve === 1 &&
				  data?.purchaseorder?.is_received === 0
				? 'Approved'
				: 'Received'
		}`,
	]);

	doc.autoTable({
		head: [rightTableColumns],
		body: rightTableRows,
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

	vendorTableRows.push([`Name: ${data?.purchaseorder?.supplier?.name ?? 'N/A'}`]);

	vendorTableRows.push([
		`Address: ${
			data?.purchaseorder?.supplier?.address === null
				? 'none'
				: data?.purchaseorder?.supplier?.address ?? 'N/A'
		}`,
	]);
	vendorTableRows.push([
		`Phone No. : ${data?.purchaseorder?.supplier?.phone_no ?? 'N/A'}`,
	]);

	doc.autoTable({
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

	vendorTableRows1.push([
		`Name: ${data?.purchaseorder?.store?.name ?? 'none'}`,
	]);

	vendorTableRows1.push([
		`Address: ${
			data?.purchaseorder?.store?.address === null
				? 'none'
				: data?.purchaseorder?.store?.address ?? 'N/A'
		}`,
	]);

	doc.autoTable({
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
		`${data?.purchaseorder?.remarks === null ? 'Remarks' : ' Remarks'}`,
		pageWidth - 200,
		yPos + 10,
		{
			align: 'center',
		},
	);
	doc.setFont('Helvetica', 'normal');

	doc.text(
		`${
			data?.purchaseorder?.remarks === null
				? 'none'
				: data?.purchaseorder?.remarks ?? 'N/A'
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
		'RETURNED QUANTITY',
		'REMARKS',
	];
	const tableRows = [];

	// Use childData from the root level, not from parentData
	const childData = purchaseDetails?.childData || [];
	
	if (childData && Array.isArray(childData) && childData.length > 0) {
		childData.forEach((item, index) => {
			try {
				const oemPart1 = item?.item?.machine_part_oem_part?.oem_part_number?.number1 ?? 'N/A';
				const oemPart2 = item?.item?.machine_part_oem_part?.oem_part_number?.number2;
				const oemPartNo = oemPart2 ? `${oemPart1}/${oemPart2}` : oemPart1;
				
				const itemsData = [
					index + 1,
					oemPartNo,
					item?.item?.machine_part_oem_part?.machine_part?.name ?? 'N/A',
					item?.item?.brand?.name ?? 'N/A',
					item?.item?.machine_part_oem_part?.machine_partmodel?.name ?? 'N/A',
					item?.item?.machine_part_oem_part?.machine_part?.unit?.name ?? 'N/A',
					item?.returned_quantity ?? 0,
					item?.remarks ?? 'N/A',
				];

				tableRows.push(itemsData);
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error processing item:', error, item);
			}
		});
	}

	doc.autoTable({
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

	// doc.autoTable(subTotalColumns, subTotalRows, {
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
		doc.save(`Purchase Order Details ${moment()}`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default generatePDF1;
