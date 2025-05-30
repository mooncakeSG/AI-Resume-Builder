import { useRef, useState, memo } from 'react'
import { useToast } from './ui/ToastProvider'
import TemplateManager from '../lib/templates/TemplateManager'
import { generatePDF } from '../lib/utils/pdfGenerator'

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

const Preview = memo(({ data }) => {
  const previewRef = useRef(null)
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!previewRef.current) {
      showToast('Preview element not found', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // Get the template element
      const templateElement = previewRef.current.querySelector('.print-area');
      if (!templateElement) {
        throw new Error('Template element not found');
      }

      // Generate PDF using html2canvas
      const pdf = await generatePDF(templateElement);
      
      // Save the PDF with appropriate filename
      const fileName = data.personal?.firstName && data.personal?.lastName
        ? `${data.personal.firstName.toLowerCase()}_${data.personal.lastName.toLowerCase()}_resume.pdf`
        : 'resume.pdf';
      
      pdf.save(fileName);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!data || !data.personal) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="text-center text-gray-500">
          No resume data available. Start filling out the form to see the preview.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" ref={previewRef}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center no-print">
        <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Print
          </button>
          <button
            onClick={downloadPDF}
            disabled={isLoading}
            data-action="download-pdf"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Generating...
              </>
            ) : (
              'Download PDF'
            )}
          </button>
        </div>
      </div>
      
      <div className="flex justify-center p-6 print:p-0">
        <div 
          className="print-area"
          style={{
            width: `${A4_DIMENSIONS.WIDTH - (MARGINS.LEFT + MARGINS.RIGHT)}mm`,
            minHeight: `${A4_DIMENSIONS.HEIGHT - (MARGINS.TOP + MARGINS.BOTTOM)}mm`,
            padding: `${MARGINS.TOP}mm ${MARGINS.RIGHT}mm ${MARGINS.BOTTOM}mm ${MARGINS.LEFT}mm`,
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            margin: '0 auto',
          }}
        >
          <TemplateManager data={data} />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview; 