import { useState } from 'react';
import { exportToPDF, exportToDOCX, exportToHTML } from '../utils/exportUtils';

const ExportButton = ({ resumeData, templateId, documentType = 'resume' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getFileName = (format) => {
    const name = resumeData.personal?.firstName && resumeData.personal?.lastName
      ? `${resumeData.personal.firstName.toLowerCase()}_${resumeData.personal.lastName.toLowerCase()}`
      : documentType;
    return `${name}_${documentType}.${format}`;
  };

  const handleExport = async (format) => {
    try {
      setIsLoading(true);
      // Convert documentType to match export function expectations
      const exportType = documentType === 'coverLetter' ? 'cover-letter' : documentType;
      
      switch (format) {
        case 'pdf':
          await exportToPDF(resumeData, templateId, exportType);
          break;
        case 'docx':
          await exportToDOCX(resumeData, templateId, exportType);
          break;
        case 'html':
          await exportToHTML(resumeData, templateId, exportType);
          break;
        default:
          console.error('Unsupported format:', format);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const getDocumentTypeDisplay = () => {
    switch (documentType) {
      case 'coverLetter':
        return 'Cover Letter';
      case 'references':
        return 'References';
      default:
        return 'Resume';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <span>Export {getDocumentTypeDisplay()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {isOpen && !isLoading && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as DOCX
            </button>
            <button
              onClick={() => handleExport('html')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Export as HTML
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton; 