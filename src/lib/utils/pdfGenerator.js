import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A4 dimensions in mm
const A4_DIMENSIONS = {
  WIDTH: 210,
  HEIGHT: 297,
};

// Margins in mm
const MARGINS = {
  TOP: 10,
  BOTTOM: 10,
  LEFT: 10,
  RIGHT: 10,
};

export async function generatePDF(element) {
  try {
    // Calculate pixel ratio for better quality
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Calculate content width in pixels (1mm = 3.78px approximately)
    const contentWidthPx = (A4_DIMENSIONS.WIDTH - (MARGINS.LEFT + MARGINS.RIGHT)) * 3.78;
    const contentHeightPx = (A4_DIMENSIONS.HEIGHT - (MARGINS.TOP + MARGINS.BOTTOM)) * 3.78;

    // Set temporary styles for capturing
    const originalStyle = element.style.cssText;
    element.style.width = `${contentWidthPx}px`;
    element.style.height = 'auto';
    element.style.margin = '0';
    element.style.padding = '0';
    element.style.transform = 'scale(1)';
    element.style.transformOrigin = 'top left';

    // Configure html2canvas
    const canvas = await html2canvas(element, {
      scale: pixelRatio, // Use device pixel ratio
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: contentWidthPx,
      height: Math.max(contentHeightPx, element.offsetHeight * pixelRatio),
      windowWidth: contentWidthPx,
      windowHeight: contentHeightPx,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          @page { size: A4; margin: 0; }
          * { 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: inherit !important;
          }
          body { margin: 0; padding: 0; }
          .print-area {
            width: ${contentWidthPx}px !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      format: 'a4',
      unit: 'mm',
      orientation: 'portrait',
      hotfixes: ['px_scaling']
    });

    // Add the image with proper scaling
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      MARGINS.LEFT,
      MARGINS.TOP,
      A4_DIMENSIONS.WIDTH - (MARGINS.LEFT + MARGINS.RIGHT),
      (canvas.height * (A4_DIMENSIONS.WIDTH - (MARGINS.LEFT + MARGINS.RIGHT))) / canvas.width
    );

    // Restore original element style
    element.style.cssText = originalStyle;

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
} 