import moment from 'moment';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
// import Logo from '../../../../../assets/logos/logos/logo.jpeg';
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

const generatePDF = async (invoiceData, type) => {
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

	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let yPos = 40;

	doc.setFontSize(14);
	doc.setFont('Sans Serif');
	doc.setFont('Sans Serif', 'bold');
	doc.setTextColor('#000');
	doc.setFont('Helvetica', 'bold');
	doc.text('SALE INVOICE', pageWidth - 50, yPos + 10, { align: 'right' });
	doc.setTextColor('#000');
	const rightTableColumns = [''];
	const rightTableRows = [];

	// rightTableRows.push([`Invoice No.: ${invoiceData.parantData.invoice_no}`]);
	rightTableRows.push([`Invoice : ${invoiceData?.parentData?.invoice_no}`]);

	rightTableRows.push([
		`Date: ${invoiceData.parentData.date
			? moment(invoiceData.parentData.date).format('DD-MM-YYYY')
			: ''
		}`,
	]);

	// rightTableRows.push([`Time: ${invoiceData?.parentData?.created_at?.slice(11, 19)}`]);

	doc.autoTable(rightTableColumns, rightTableRows, {
		startY: yPos + 10,
		margin: { left: pageWidth / 2 + 150 },
		tableWidth: 100,
		willDrawCell: false,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		bodyStyles: {
			fontStyle: 'bold',
		},
	});
	yPos += 8;
	doc.setFontSize(28);
	doc.setFont('Sans Serif');
	doc.setFont('Sans Serif', 'bold');
	doc.setTextColor('#000');
	doc.setFont('Helvetica', 'bold');

	doc.setFontSize(14);
	doc.setFont('Sans Serif');

	doc.setTextColor('#000');

	yPos -= 30;
	const vendorTableColumns = [''];
	const vendorTableRows = [];

	vendorTableRows.push([`Shop: ${data?.user?.company_name}`]);
	vendorTableRows.push([`Address: ${data?.user?.address}`]);
	vendorTableRows.push([`Tel: ${data?.user?.phone}`]);
	vendorTableRows.push([`Email: ${data?.user?.email}`]);

	doc.autoTable(vendorTableColumns, vendorTableRows, {
		startY: yPos,
		startX: 50,
		tableWidth: 200,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		bodyStyles: {
			fontStyle: 'bold',
		},
		margin: {
			left: 140,
		},
	});
	yPos = doc.lastAutoTable.finalY + 10;

	const vendorTableColumns2 = ['Customer'];
	const vendorTableRows2 = [];

	vendorTableRows2.push([
		`Name: ${invoiceData?.parentData.sale_type === 1
			? invoiceData?.parentData.walk_in_customer_name
			: invoiceData?.parentData.customer?.name
		}`,
	]);
	vendorTableRows2.push([
		`Contact: ${invoiceData?.parentData.sale_type === 1
			? ''
			: invoiceData?.parentData.customer?.phone_no
		}`,
	]);

	doc.autoTable(vendorTableColumns2, vendorTableRows2, {
		startY: yPos,
		startX: 50,
		tableWidth: 200,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: { fillColor: '#808080', textColor: '#fff' },
		bodyStyles: {
			fontStyle: 'bold',
		},
	});

	yPos += 48;



	doc.addImage(LogoBase64, 'JPEG', 40, 28, 75, 60);

	const tableColumns = [
		'S.No.',
		'OEM/ Part No',
		'ITEM',
		'Brand',
		// 'Model',
		'Uom',
		'QTY',
		'PRICE',
		'SUB TOTAL',
	];
	const tableRows = [];
	let t = 0;

	invoiceData?.childData?.forEach((item, index) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		t += item?.quantity * item?.price;
		const itemsData = [
			index + 1,
			`${item.item.machine_part_oem_part.oem_part_number.number1}/ ${item.item.machine_part_oem_part.oem_part_number?.number2}`,

			// item.item.name,
			item.item.machine_part_oem_part.machine_part.name,
			item.item.brand.name,
			// item.item.machine_part_oem_part.machine_partmodel?.name,
			item.item.machine_part_oem_part.machine_part.unit.name,
			item.quantity.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			item.price.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			(item.price * item.quantity).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
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
	const subTotalColumns = [
		' Total',
		`PKR ${t?.toLocaleString(undefined, { maximumFractionDigits: 2 })}/-`,
	];
	const subTotalRows = [];

	subTotalRows.push(['Discount', `${invoiceData?.parentData?.discount}`]);

	doc.autoTable(subTotalColumns, subTotalRows, {
		startY: yPos,
		margin: { left: pageWidth / 2 + 130 },
		tableWidth: 150,
		theme: 'plain',
		styles: {
			cellPadding: 1,
			fontSize: 8,
		},
		headStyles: { fillColor: '#fff', textColor: '#000' },
	});
	doc.setTextColor('#000');
	doc.line(
		pageWidth - 170,
		(yPos = doc.lastAutoTable.finalY + 1),
		pageWidth - 45,
		(yPos = doc.lastAutoTable.finalY + 1),
	);
	doc.line(
		pageWidth - 170,
		(yPos = doc.lastAutoTable.finalY + 3),
		pageWidth - 45,
		(yPos = doc.lastAutoTable.finalY + 3),
	);

	yPos += 10;
	const strLength = `PKR ${invoiceData?.parentData?.total_after_discount?.toLocaleString(
		undefined,
		{
			maximumFractionDigits: 2,
		},
	)}/-`.length;
	doc.setFontSize(10);
	doc.setFont('Helvetica', 'bold');
	doc.text(`Total`, pageWidth - 50 - strLength * 5, yPos, { align: 'right' });

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(
		`PKR ${invoiceData?.parentData?.total_after_discount?.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}/-`,
		pageWidth - 50,
		yPos,
		{ align: 'right' },
	);

	yPos += 10;

	const gstValue = invoiceData?.parentData?.gst;

	if (gstValue && gstValue > 0) {
		const gstText = `PKR ${gstValue.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}/-`;
		const strLength1 = gstText.length;

		// Set font for GST label
		doc.setFontSize(8);
		doc.setFont('Helvetica', 'bold');
		doc.text('GST', pageWidth - 50 - strLength1 * 5, yPos, { align: 'right' });

		// Set font for GST value
		doc.setFontSize(8);
		doc.setFont('Sans Serif');
		doc.text(
			gstText,
			pageWidth - 50,
			yPos,
			{ align: 'right' },
		);
	}

	yPos += 10;
	const strLength2 = `PKR ${invoiceData?.parentData?.total_after_gst?.toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})}/-`.length;
	doc.setFontSize(8);
	doc.setFont('Helvetica', 'bold');
	doc.text(`Total After GST`, pageWidth - 50 - strLength2 * 5, yPos, { align: 'right' });

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(
		`PKR ${invoiceData?.parentData?.total_after_gst?.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}/-`,
		pageWidth - 50,
		yPos,
		{ align: 'right' },
	);

	yPos -= 40;
	//

	doc.setFontSize(9);
	doc.setFont('Helvetica', 'normal');
	doc.text(`Delivered To:`, pageWidth - 550, yPos, { align: 'left' });

	doc.setFontSize(9);
	doc.setFont('Sans Serif');
	doc.text(
		`${invoiceData?.parentData?.delivered_to ? invoiceData?.parentData?.delivered_to : ''}`,
		pageWidth - 480,
		yPos,
		{ align: 'left' },
	);
	yPos += 20;
	doc.setFontSize(10);
	doc.setFont('Helvetica', 'bold');
	doc.text(`NOTE:`, pageWidth - 550, yPos, { align: 'left' });
	// yPos += 20;
	doc.setFontSize(8);
	doc.setFont('Sans Serif', 'normal');
	doc.text(
		`All manufacturer's Names, Numbers, Symbols and Descriptions are used for reference.
Document invalid without authorised signature and stamp.
Goods once sold can not be taken back.`,
		pageWidth - 512,
		yPos,
		{ align: 'left' },
	);
	//
	yPos += 140;

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(`_________________________`, pageWidth - 57, yPos, { align: 'right' });
	yPos += 20;
	doc.setFontSize(10);
	doc.setFont('Helvetica', 'bold');

	doc.text(`Authorised Signature  `, pageWidth - 50, yPos, { align: 'right' });

	yPos = 290;

	yPos = 355;

	if (type === 1) {
		doc.save(`Sale Invoice Details ${moment()}`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default generatePDF;
