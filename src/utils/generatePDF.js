import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ISTE from '../../public/images/ISTE.png';
import { Divider } from '@nextui-org/react';
import Image from 'next/image';
import React, { forwardRef, useImperativeHandle } from 'react';

const PDFGenerator = forwardRef(({ data }, ref) => {
  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const elements = document.querySelectorAll('.pdf-page');
    for (let i = 0; i < elements.length; i++) {
      try {
        const canvas = await html2canvas(elements[i], { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      } catch (error) {
        console.error('Error generating image from canvas:', error);
      }
    }

    const date = new Date();
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    const fileName = `Etiquetas_${formattedDate}.pdf`;

    pdf.save(fileName);
  };

  useImperativeHandle(ref, () => ({
    generatePDF,
  }));

  const getPages = (data, itemsPerPage) => {
    const pages = [];
    for (let i = 0; i < data.length; i += itemsPerPage) {
      pages.push(data.slice(i, i + itemsPerPage));
    }
    return pages;
  };

  const pages = getPages(data, 4);

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div key={pageIndex} className="pdf-page" style={{ width: '297mm', height: '210mm', padding: '10mm', boxSizing: 'border-box', pageBreakAfter: 'always', fontFamily:'Times New Roman, serif' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '0mm', height: '100%' }}>
            {page.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid black',
                  boxSizing: 'border-box',
                  position: 'relative',
                  height: '100%',
                  width: '100%',
                  fontFamily:'Times New Roman, serif'
                }}
              >
                <div style={{ position: 'absolute', top: '10mm', left: '10mm' }}>
                  <Image src={ISTE} alt="Logo" width={200} height={50} />
                </div>
                <div style={{ position: 'absolute', top: '10mm', right: '10mm', fontSize: '3em', fontWeight: 'bold', fontFamily:'Times New Roman, serif' }}>
                  {item.code}
                </div>
                <Divider style={{ position: 'absolute', top: '50%', left: '10%', width: '80%', height: '15px', backgroundColor: '#203764', transform: 'translateY(-50%)' }} />
                <div style={{ position: 'absolute', top: 'calc(50% + 10mm)', left: '10mm', right: '10mm', textAlign: 'center', fontSize: '2em', fontWeight: 'bold', fontFamily:'Times New Roman, serif' }}>
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
});

export default PDFGenerator;
