

import * as XLSX from 'xlsx';

const GenerateExcel = (data1) => {
  const tableColumns = [
    'S.No.', 'OEM/ Part No', 'Name', 'Brand', 'Model', 'Qty', 'Avg Cost','Avg Cost x Quantity', 'Purchase Price', 'Purchase Price x Quantity'
  ];

 	
  const tableRows = data1?.data?.map((item, index) => [
    
    index + 1,
    `${item.item?.machine_part_oem_part.oem_part_number.number1}/ ${item.item?.machine_part_oem_part.oem_part_number.number2}`,
    item.item?.machine_part_oem_part.machine_part.name,
    item.item?.brand.name,
    item.item?.machine_part_oem_part.machine_partmodel?.name,
    item?.quantity,
    item.item?.avg_cost,
    // eslint-disable-next-line no-unsafe-optional-chaining
    item.item?.avg_cost * item?.quantity,
    item.item?.purchase_price,
    // eslint-disable-next-line no-unsafe-optional-chaining
    item.item?.purchase_price * item?.quantity,

  ]);

  // Create a worksheet and add columns
  const worksheetData = [tableColumns, ...tableRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PartListReport');

  // Export the workbook as an Excel file
  XLSX.writeFile(workbook, `PartListReport_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export default GenerateExcel;
