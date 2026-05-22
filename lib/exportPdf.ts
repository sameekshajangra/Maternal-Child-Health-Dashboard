import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPdf(elementId: string, filename: string = 'export.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // Add a temporary class to ensure dark mode/glass backgrounds render well if needed
    // html2canvas sometimes struggles with backdrop-filter, but standard colors work.
    
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#0b1120', // Fallback to dark background color to match UI
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Maintain aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    // Center the image if it's smaller than A4
    const x = (pdfWidth - finalWidth) / 2;
    const y = 10; // 10mm top margin

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
  }
}
