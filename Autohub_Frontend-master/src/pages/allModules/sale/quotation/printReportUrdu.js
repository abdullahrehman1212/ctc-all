// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import Logo from '../../../../components/logo/miniLogo.png';

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

const quotationPdfUrdu = async (data1, type) => {
  let data3 = null;
  try {
    data3 = Cookies?.get('Data1') ? JSON.parse(Cookies?.get('Data1')) : null;
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

  // Determine how many items per page
  const itemsPerPage = 10;
  const totalItems = data1.quotChild.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Create PDF document
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('p', 'pt', 'a4');

  // eslint-disable-next-line no-plusplus
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    // Get items for current page
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = data1.quotChild.slice(startIndex, endIndex);

    // Create a hidden div with Urdu content for this page
    const quotationDiv = document.createElement('div');
    quotationDiv.style.position = 'absolute';
    quotationDiv.style.left = '-9999px';
    quotationDiv.style.width = '800px';
    quotationDiv.style.padding = '20px';
    quotationDiv.style.backgroundColor = 'white';
    quotationDiv.style.fontSize = '14px';

    // Generate Urdu HTML content for this page
    quotationDiv.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        ${pageNum === 1 ? `
          <!-- Header - Only on first page -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <div style="text-align: left;">
              <img src="${LogoBase64}" style="width: 50px; height: 50px;" />
            </div>
            <div style="text-align: center;">
              <h2 style="margin: 0; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-size: 24px;">کوٹیشن</h2>
              <p style="margin-bottom:10px; margin: 5px 0; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl;">${data3?.user?.company_name || ''}</p>
              <p style=" margin-bottom:10px; margin: 2px 0; font-size: 12px; direction: rtl;">پتہ: ${data3?.user?.address || ''}, ${data3?.user?.city || ''}</p>
              <p style=" margin-bottom:10px; margin: 2px 0; font-size: 12px; direction: rtl;">فون: ${data3?.user?.phone || ''}</p>
            </div>
            <div style="text-align: right; font-size: 12px;">
              <p style="margin: 2px 0;">E-mail: ${data3?.user?.email || ''}</p>
              <p style="margin: 2px 0;">Powered By Koncept Solutions</p>
            </div>
          </div>

          <!-- Reference Number -->
          <div style="margin-bottom: 15px;">
            <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0;">
              <strong>ریف:</strong> ${data1.quotation.ref_no || ''}
            </p>
          </div>

          <!-- Customer Info - Only on first page -->
          <div style="margin-bottom: 15px;">
            <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0; font-size: 16px;">
              <strong>حوالے:</strong> ${data1.quotation.sale_type === 2 ? data1.quotation.customer.name : data1.quotation.walk_in_customer_name}
            </p>
            <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0; font-size: 14px;">
              ${data1.quotation.sale_type === 2 ? data1.quotation.customer.address || '' : ''}
            </p>
            <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0; font-size: 14px;">
              ${data1.quotation.sale_type === 2 ? data1.quotation.customer.phone_no || '' : data1.quotation.walk_in_customer_phone || ''}
            </p>
          </div>

          <!-- Subject -->
          <div style="margin-bottom: 15px;">
            <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0;">
              <strong>ریمارکس:</strong> ${data1.quotation.remarks || ''}
            </p>
          </div>
        ` : ''}

        

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 16px;">
          <thead>
            <tr style="background-color: #d9d9d6;">
              <th style="border: 1px solid #000; padding: 8px; width: 80px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-weight: normal;">قیمت</th>
              <th style="border: 1px solid #000; padding: 8px; width: 60px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-weight: normal;">مقدار</th>
              <th style="border: 1px solid #000; padding: 8px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-weight: normal; text-align:right; ">آئٹم کا نام</th>
              <th style="border: 1px solid #000; padding: 8px; width: 50px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-weight: normal;">نمبر</th>
              </tr>
          </thead>
          <tbody>
            ${currentItems.map((item, idx) => {
      const itemNumber = startIndex + idx + 1;
      return `
                <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quoted_price || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${item.quantity || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl;">${item.item?.urdu_name || ''}</td>
                  <td style="border: 1px solid #000; padding: 8px; text-align: center;">${itemNumber}</td>
                  </tr>
              `;
    }).join('')}
          </tbody>
        </table>
        <!-- Page Info -->
        <div style="text-align: center; margin-bottom: 10px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-size: 14px;">
          صفحہ ${pageNum} از ${totalPages}
        </div>

        ${pageNum === totalPages ? `
          <!-- Footer - Only on last page -->
          <div style="margin-top: 30px;">
            <div style="margin-bottom: 20px;">
              <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0; font-weight: bold;">
                  آپ کے تعاون کا شکریہ
              </p>
              <p style="font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; margin: 5px 0;">
                ${data3?.user?.name || ''}
              </p>
            </div>

            <!-- Terms and Conditions -->
            <div style="margin-top: 20px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; font-size: 12px;">
              <p style="margin: 5px 0; font-weight: bold;">شرائط و ضوابط:</p>
              <p style="margin: 3px 0;">${data1.quotation.termcondition || ''}</p>
            </div>

            <!-- Generated Date -->
            <div style="margin-top: 30px; font-size: 12px;">
              <p>Generated on: ${moment().format('DD-MM-YYYY hh:mm:ss a')}</p>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(quotationDiv);

    try {
      // Use html2canvas to capture the content as an image
      // eslint-disable-next-line no-await-in-loop
      const canvas = await html2canvas(quotationDiv, {
        useCORS: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Remove the temporary div
      document.body.removeChild(quotationDiv);

      // Create image data
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgPDFWidth = imgWidth * ratio;
      const imgPDFHeight = imgHeight * ratio;

      // Add new page for all except the first page
      if (pageNum > 1) {
        pdf.addPage();
      }

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgPDFWidth, imgPDFHeight);

    } catch (error) {
      console.error('Error generating PDF page:', error);
      document.body.removeChild(quotationDiv);
    }
  }

  // Save or open the PDF
  if (type === 1) {
    const date = Date().split(' ');
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    pdf.save(`Quotation_${data1.quotation.ref_no || ''}_${dateStr}.pdf`);
  } else if (type === 2) {
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }
};

export default quotationPdfUrdu;