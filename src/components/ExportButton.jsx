import { useState } from 'react';
import { exportToPDF, exportToDOCX, exportToHTML } from '../utils/exportUtils';
import { Button } from './ui/button';
import { Download, ChevronDown } from 'lucide-react';

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
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="h-9 text-gray-700 dark:text-gray-200"
      >
        {isLoading ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            <span>Export {getDocumentTypeDisplay()}</span>
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </Button>

      {isOpen && !isLoading && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Export as PDF
            </button>
            <button
              onClick={() => handleExport('docx')}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Export as DOCX
            </button>
            <button
              onClick={() => handleExport('html')}
              className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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