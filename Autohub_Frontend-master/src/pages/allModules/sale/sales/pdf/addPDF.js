import moment from 'moment';
import jsPDF from 'jspdf';
import Cookies from 'js-cookie';
import Logo1 from '../../../../../components/logo/Koncept-logo.png';

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

const generatePDF1 = async (data1, type) => {
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
	console.log('formik', data1);

	// Find the "items_options" array within the single array in "list"
	const itemsOptionsArray = data1.list1 && data1.list1[0] ? data1.list1[0].items_options : [];
	console.log(itemsOptionsArray);

	// Find the object within "items_options" where "id" matches "item_id"
	// const matchingItem = itemsOptionsArray.find((item) => item.id === data1.list[0].item_id);

	// if (matchingItem) {
	// 	// matchingItem contains the object with the matching "id"
	// 	console.log(matchingItem);
	// } else {
	// 	// No match found or data structure not as expected
	// 	console.log('No matching item found or data structure is not as expected.');
	// }

	// console.log(data1?.item)
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

	rightTableRows.push([`Date: ${data1.date ? moment(data1.date).format('DD-MM-YYYY') : ''}`]);

	// rightTableRows.push([`Time: ${invoiceData?.parentData?.created_at?.slice(11, 19)}`]);

	doc.autoTable(rightTableColumns, rightTableRows, {
		startY: yPos + 10,
		margin: { left: pageWidth / 2 + 150 },
		tableWidth: 100,
		willDrawCell: false,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
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
	doc.addImage(LogoBase64, 'JPEG', 40, 28, 65, 40);

	vendorTableRows.push([`Shop: ${data1.store_name}`]);
	// vendorTableRows.push([`Address: ${invoiceData?.parentData?.store?.address}`]);
	vendorTableRows.push([`Cell: ${data?.user?.phone}`]);
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
		margin: {
			left: 140,
		},
	});
	yPos = doc.lastAutoTable.finalY + 10;

	const vendorTableColumns2 = ['Customer'];
	const vendorTableRows2 = [];

	vendorTableRows2.push([
		`Name: ${data1.sale_type === 1 ? data1.walk_in_customer_name : data1.customer_name}`,
	]);

	doc.autoTable(vendorTableColumns2, vendorTableRows2, {
		startY: yPos,
		startX: 50,
		tableWidth: 200,
		theme: 'plain',
		styles: { fontSize: 8, cellPadding: 2 },
		headStyles: { fillColor: '#808080', textColor: '#fff' },
	});

	yPos += 40;

// 	const itemsOptionsArray = data1.list1 && data1.list1[0] ? data1.list1[0].items_options : [];
// console.log(itemsOptionsArray);

// Find all objects within "items_options" where "id" matches any "item_id" in the list
const matchingItems = data1.list.map(listItem =>
  itemsOptionsArray.filter(item => item.id === listItem.item_id)
);

if (matchingItems.length > 0) {
  // matchingItems contains an array of objects with matching "id"
  console.log(matchingItems);
} else {
  // No match found or data structure not as expected
  console.log('No matching items found or data structure is not as expected.');
}

const tableColumns = [
  'S.No.',
  'OEM/ Part No',
  'ITEM',
  'Brand',
//   'Model',
  'Uom',
  'QTY',
  'PRICE',
  'SUB TOTAL',
];
const tableRows = [];
	const t = 0;

// Assuming you want to iterate over matchingItems and create rows for each matching item
matchingItems.forEach((matchingItem, index) => {
//   const rowData = [
//     index + 1, // You can adjust the S.No. as needed
//     `${matchingItem[0]?.machine_part_oem_part.oem_part_number.number1}/${matchingItem[0]?.machine_part_oem_part.oem_part_number.number2}`,
//     // matchingItem[0]?.name,
// 	matchingItem[0]?.machine_part_oem_part.machine_part.name,
//     matchingItem[0]?.brand?.name,
//     matchingItem[0]?.machine_part_oem_part.machine_partmodel?.name,
//     matchingItem[0]?.machine_part_oem_part.machine_part.unit.name,
//     data1?.list[index]?.qty?.toLocaleString(undefined, {
//       maximumFractionDigits: 2,
//     }),
//     data1?.list[index]?.price.toLocaleString(undefined, {
//       maximumFractionDigits: 2,
//     }),
//     (data1?.list[index]?.price * data1?.list[index]?.qty).toLocaleString(undefined, {
//       maximumFractionDigits: 2,
//     }),
//   ];

const itemQty = data1?.list[index]?.qty;
const itemPrice = data1?.list[index]?.price;

const formattedQty = itemQty ? itemQty.toLocaleString(undefined, {
  maximumFractionDigits: 2,
}) : 'N/A';

const formattedPrice = itemPrice ? itemPrice.toLocaleString(undefined, {
  maximumFractionDigits: 2,
}) : 'N/A';

const subtotal = itemQty && itemPrice ? (itemPrice * itemQty).toLocaleString(undefined, {
  maximumFractionDigits: 2,
}) : 'N/A';

const rowData = [
  index + 1, // You can adjust the S.No. as needed
  `${matchingItem[0]?.machine_part_oem_part.oem_part_number.number1}/${matchingItem[0]?.machine_part_oem_part.oem_part_number.number2}`,
//   matchingItem[0]?.name,
matchingItem[0]?.machine_part_oem_part.machine_part.name,
  matchingItem[0]?.brand?.name,
//   matchingItem[0]?.machine_part_oem_part.machine_partmodel?.name,
  matchingItem[0]?.machine_part_oem_part.machine_part.unit.name,
  formattedQty,
  formattedPrice,
  subtotal,
];

// Push the data row into the tableRows array
tableRows.push(rowData);


  // Push the data row into the tableRows array
//   tableRows.push(rowData);
});

// Now, tableRows will contain rows for all matching items in matchingItems


	// const tableColumns = [
	// 	'S.No.',
	// 	'OEM/ Part No',
	// 	'ITEM',
	// 	'Brand',
	// 	'Model',
	// 	'Uom',
	// 	'QTY',
	// 	'PRICE',
	// 	'SUB TOTAL',
	// ];
	// const tableRows = [];
	// const t = 0;

	// const oem1 = matchingItem?.machine_part_oem_part.oem_part_number.Number1;
	// const oem2 = matchingItem?.machine_part_oem_part.oem_part_number.Number2;

	// // Create a data row based on the extracted properties
	// const rowData = [
	// 	1, // You can adjust the S.No. as needed
	// 	`${matchingItem?.machine_part_oem_part.oem_part_number.number1}/${matchingItem?.machine_part_oem_part.oem_part_number.number2}`,
	// 	matchingItem.name,
	// 	matchingItem.brand?.name,
	// 	matchingItem.machine_part_oem_part.machine_partmodel?.name,
	// 	matchingItem.machine_part_oem_part.machine_part.unit.name,
	// 	data1?.list[0]?.qty?.toLocaleString(undefined, {
	// 		maximumFractionDigits: 2,
	// 	}),
	// 	data1?.list[0]?.price.toLocaleString(undefined, {
	// 		maximumFractionDigits: 2,
	// 	}),
	// 	(data1?.list[0]?.price * data1?.list[0]?.qty).toLocaleString(undefined, {
	// 		maximumFractionDigits: 2,
	// 	}),
	// ];

	// // Push the data row into the tableRows array
	// tableRows.push(rowData);

	// matchingItem?.forEach((item, index) => {
	// 	// eslint-disable-next-line no-unsafe-optional-chaining
	// 	t += item.qty * item.price;
	// 	const itemsData = [
	// 		index + 1,
	// 		// `${item.item?.machine_part_oem_part.oem_part_number.number1}/ ${
	// 		// 	item.item?.machine_part_oem_part?.oem_part_number?.number2
	// 		// 		? item.item?.machine_part_oem_part.oem_part_number?.number2
	// 		// 		: ''
	// 		// }`,
	// 		`${item.machine_part_oem_part.oem_part_number.Number1}/${item.machine_part_oem_part.oem_part_number.Number1}`,

	// 		// item.item.name,
	// 		// item.item?.machine_part_oem_part.machine_part.name,
	// 		item.name,
	// 		item?.brand?.name,
	// 		item.machine_part_oem_part.machine_partmodel?.name,
	// 		item?.machine_part_oem_part.machine_part.unit.name,
	// 		item.qty?.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),
	// 		item.price?.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),
	// 		(item.price * item.qty).toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),
	// 	];
	// 	tableRows.push(itemsData);
	// });

	// const qty = itemsOptionsArray.find((item) => item.id === data1.list[0].item_id);

	

	// const tableRows = Object.values(matchingItem || {}).map((item, index) => {
	// 	const subTotal = (item.qty * item.price).toLocaleString(undefined, { maximumFractionDigits: 2 });
	// 	return [
	// 	  index + 1,
	// 	  `${item?.machine_part_oem_part?.oem_part_number?.Number1}/${item?.machine_part_oem_part?.oem_part_number?.Number2}`,
	// 	  item.name,
	// 	  item?.brand?.name,
	// 	  item?.machine_part_oem_part?.machine_partmodel?.name,
	// 	  item?.machine_part_oem_part?.machine_part?.unit.name,
	// 	  item?.qty?.toLocaleString(undefined, { maximumFractionDigits: 2 }),
	// 	  item?.price?.toLocaleString(undefined, { maximumFractionDigits: 2 }),
	// 	  subTotal,
	// 	];
	//   });

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

	subTotalRows.push(['Discount', `${data1.discount}`]);

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
	const strLength = `PKR ${data1.total_after_discount?.toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})}/-`.length;
	doc.setFontSize(10);
	doc.setFont('Helvetica', 'bold');
	doc.text(`Total`, pageWidth - 50 - strLength * 5, yPos, { align: 'right' });

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(
		`PKR ${data1.total_after_discount?.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}/-`,
		pageWidth - 50,
		yPos,
		{ align: 'right' },
	);

	yPos += 10;
	const strLength1 = `PKR ${data1.gst?.toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})}/-`.length;
	doc.setFontSize(8);
	doc.setFont('Helvetica', 'bold');
	doc.text(`GST`, pageWidth - 50 - strLength1 * 5, yPos, { align: 'right' });

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(
		`PKR ${data1.gst?.toLocaleString(undefined, {
			maximumFractionDigits: 2,
		})}/-`,
		pageWidth - 50,
		yPos,
		{ align: 'right' },
	);

	yPos += 10;
	const strLength2 = `PKR ${data1.total_after_gst?.toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})}/-`.length;
	doc.setFontSize(8);
	doc.setFont('Helvetica', 'bold');
	doc.text(`Total After GST`, pageWidth - 50 - strLength2 * 5, yPos, { align: 'right' });

	doc.setFontSize(8);
	doc.setFont('Sans Serif');
	doc.text(
		`PKR ${data1.total_after_gst?.toLocaleString(undefined, {
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
	doc.text(`${data1.delivered_to ? data1.delivered_to : ''}`, pageWidth - 480, yPos, {
		align: 'left',
	});
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
		doc.save(`Sale Add Invoice Details ${moment()}`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default generatePDF1;
