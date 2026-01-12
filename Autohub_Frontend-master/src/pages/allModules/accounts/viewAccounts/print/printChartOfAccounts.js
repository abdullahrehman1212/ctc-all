// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
// // import Logo from '../../../../../assets/logos/logos/logo.png';
//

const GeneratePDF = (data1, type) => {
	// initialize jsPDF
	let data3 = null;
	try {
		data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
	} catch (error) {
		console.error('Error parsing cookies data:', error.message);
	}

	const companyName = data3?.user?.company_name || 'Company Name Not Available';
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// Functions Starts
	let count = 0;

	// Functions Ends
	let yPos = 80;
	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 110, 80);
	// doc.addImage(kbdLogo, 'JPEG', 470, 20, 110, 80);
	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text(companyName, pageWidth / 2, 40,{ align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');
	doc.text('Chart of Accounts', pageWidth / 2, 55, { align: 'center' });

	// Start

	const rowsMain = [];
	const columnsMain = ['Code', 'Group', 'Sub Group', 'Account', 'status'];
	// Assets Starts
	if (data1.assets !== undefined ) {
		data1?.assets.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.non_depreciation_sub_groups !== undefined) {
				data.non_depreciation_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// Assets Ends
	// liabilities Starts
	if (data1?.liabilities !== undefined) {
		data1?.liabilities.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// liabilities Ends
	// capital Starts
	if (data1?.capital !== undefined) {
		data1?.capital.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// capital Ends
	// revenues Starts
	if (data1?.revenues !== undefined) {
		data1?.revenues.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// revenues Ends
	// expenses Starts
	if (data1?.expenses !== undefined) {
		data1?.expenses.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// expenses Ends
	// Cost Starts
	if (data1?.cost !== undefined) {
		data1?.cost.forEach((data) => {
			const TableData = [`${data.code}`, `${data.name}`, '-', '-'];
			rowsMain.push(TableData);
			if (data.coa_sub_groups !== undefined) {
				data.coa_sub_groups.forEach((itemSubGroups) => {
					const TableData2 = [`${itemSubGroups.code}`, '', `${itemSubGroups.name}`, ''];
					rowsMain.push(TableData2);
					if (itemSubGroups.coa_accounts !== undefined) {
						itemSubGroups.coa_accounts.forEach((itemAccounts) => {
							let TableData3 = [];
							TableData3 = [
								`${itemAccounts.code}`,
								'',
								'',
								`${itemAccounts.name}`,
								`${itemAccounts.isActive === 1 ? 'Active' : 'Inactive'}`,
							];

							rowsMain.push(TableData3);
							count += 1;
						});
					}
				});
			}
		});
	}
	// expenses Ends
	// End

	yPos += 15;
	doc.setFont(undefined, 'normal');

	// doc.text(`File no:`, 45, yPos);
	// doc.text(`${data1.form1.file_no}`, 90, yPos);
	// doc.text(`__________________`, 90, yPos);
	doc.setFontSize(10);

	doc.autoTable(columnsMain, rowsMain, {
		// theme: 'grid',
		headStyles: {
			// 	fillColor: [255, 255, 255],
			// textColor: [0, 0, 0],
			lineWidth: 1,
			lineColor: [0, 0, 0],
		},
		bodyStyles: {
			// fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0.2,
			lineColor: [0, 0, 0],
		},
		startY: yPos,
		styles: { fontSize: 12 },
	});
	yPos = doc.lastAutoTable.finalY + 20;
	// doc.text(`File name:`, 45, yPos);
	// doc.text(`${data1.form1.file_name}`, 105, yPos);
	// doc.text(`__________________`, 105, yPos);

	yPos += 5;
	doc.text(`Date Printed: ${moment().format('DD/MM/YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
	// ****************** Main Details
	// doc.autoTable(columnsMain, rowsMain, { startY: yPos, styles: { fontSize: 8 } });
	// yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Total Land', 47, yPos);
	// yPos += 10;
	// ****************** Land Details

	// ****************** Cleared Land Details

	// doc.text('Logo', 47, 26);
	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(12);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('ABC Near GT Road Rawalpindi', 47, 26);
	// doc.text('Report I', 47, 32);
	doc.setFontSize(12);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');
	// Footer Starts
	doc.page = 1;
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
	const pageSize = doc.internal.pageSize;

	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`TrialBalance${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
