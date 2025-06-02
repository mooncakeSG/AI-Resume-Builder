import { useRef, useState, memo, useEffect } from 'react'
import { useToast } from './ui/ToastProvider'
import TemplateManager from '../lib/templates/TemplateManager'
import { generatePDF } from '../lib/utils/pdfGenerator'
import ExportButton from './ExportButton'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from './ui/button'

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

const Preview = memo(({ data, templateId }) => {
  const previewRef = useRef(null)
  const previewAreaRef = useRef(null)
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('resume') // 'resume' or 'coverLetter'
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let touchStartDistance = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        // Calculate initial distance between two fingers
        touchStartDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      } else if (e.touches.length === 1) {
        setIsDragging(true);
        setStartPos({
          x: e.touches[0].pageX - scrollPos.x,
          y: e.touches[0].pageY - scrollPos.y
        });
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        // Prevent default to stop page zooming
        e.preventDefault();

        // Calculate current distance between fingers
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );

        // Calculate zoom factor
        const delta = distance - touchStartDistance;
        const newScale = Math.min(Math.max(scale + delta * 0.01, 0.5), 2);
        setScale(newScale);
        touchStartDistance = distance;
      } else if (isDragging && e.touches.length === 1) {
        const x = e.touches[0].pageX - startPos.x;
        const y = e.touches[0].pageY - startPos.y;
        if (previewAreaRef.current) {
          previewAreaRef.current.scrollLeft = -x;
          previewAreaRef.current.scrollTop = -y;
          setScrollPos({ x: -x, y: -y });
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      touchStartDistance = 0;
    };

    const previewArea = previewAreaRef.current;
    if (previewArea) {
      previewArea.addEventListener('touchstart', handleTouchStart);
      previewArea.addEventListener('touchmove', handleTouchMove, { passive: false });
      previewArea.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (previewArea) {
        previewArea.removeEventListener('touchstart', handleTouchStart);
        previewArea.removeEventListener('touchmove', handleTouchMove);
        previewArea.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [scale, isDragging, startPos, scrollPos]);

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (direction) => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newScale, 0.5), 2); // Limit scale between 0.5 and 2
    });
  };

  const resetZoom = () => setScale(1);

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
        ? `${data.personal.firstName.toLowerCase()}_${data.personal.lastName.toLowerCase()}_${viewMode}.pdf`
        : `${viewMode}.pdf`;
      
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
      <div className="bg-white rounded-lg p-4 md:p-8">
        <div className="text-center text-muted-foreground">
          No resume data available. Start filling out the form to see the preview.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg overflow-hidden" ref={previewRef}>
      <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <h2 className="text-lg font-semibold">Preview</h2>
          <div className="flex rounded-md shadow-sm">
            <Button
              variant={viewMode === 'resume' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('resume')}
              className="rounded-r-none"
            >
              Resume
            </Button>
            <Button
              variant={viewMode === 'coverLetter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('coverLetter')}
              className="rounded-l-none"
            >
              Cover Letter
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('out')}
              disabled={scale <= 0.5}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetZoom}
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleZoom('in')}
              disabled={scale >= 2}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              disabled={isLoading}
            >
              Print
            </Button>
            <ExportButton 
              resumeData={data} 
              templateId={templateId}
              documentType={viewMode}
            />
          </div>
        </div>
      </div>
      
      <div 
        ref={previewAreaRef}
        className="flex justify-center p-3 md:p-6 print:p-0 overflow-auto touch-pan-x touch-pan-y"
        style={{
          maxHeight: 'calc(100vh - 16rem)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          className="print-area origin-top transition-transform duration-200 ease-out"
          style={{
            width: `${A4_DIMENSIONS.WIDTH - (MARGINS.LEFT + MARGINS.RIGHT)}mm`,
            minHeight: `${A4_DIMENSIONS.HEIGHT - (MARGINS.TOP + MARGINS.BOTTOM)}mm`,
            padding: `${MARGINS.TOP}mm ${MARGINS.RIGHT}mm ${MARGINS.BOTTOM}mm ${MARGINS.LEFT}mm`,
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            margin: '0 auto',
            transform: `scale(${scale})`,
            touchAction: 'none'
          }}
        >
          <TemplateManager 
            data={data} 
            type={viewMode}
          />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview; 