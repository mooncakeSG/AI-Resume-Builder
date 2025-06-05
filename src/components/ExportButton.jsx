import { exportToDOCX, exportToHTML } from '../utils/exportUtils';
import { useState } from 'react';
import { useToast } from './ui/ToastProvider';

const ExportButton = ({ resumeData, templateId, exportType = 'resume' }) => {
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      switch (format) {
        case 'docx':
          await exportToDOCX(resumeData, templateId, exportType);
          showToast('DOCX file exported successfully!', 'success');
          break;
        case 'html':
          await exportToHTML(resumeData, templateId, exportType);
          showToast('HTML file exported successfully!', 'success');
          break;
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast(`Failed to export ${format.toUpperCase()} file. Please try again.`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('docx')}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        Export DOCX
      </button>
      <button
        onClick={() => handleExport('html')}
        disabled={isExporting}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Export HTML
      </button>
    </div>
  );
};

export default ExportButton; 