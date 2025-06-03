import { useRef, useState, memo, useEffect } from 'react'
import { useToast } from './ui/ToastProvider'
import TemplateManager from '../lib/templates/TemplateManager'
import { generatePDF } from '../lib/utils/pdfGenerator'
import ExportButton from './ExportButton'
import { ZoomIn, ZoomOut, Maximize2, Printer, Download } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState('resume')
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(true)

  // Set initial scale based on screen width and maintain aspect ratio
  useEffect(() => {
    const setInitialScale = () => {
      if (previewAreaRef.current) {
        const containerWidth = previewAreaRef.current.clientWidth;
        const containerHeight = previewAreaRef.current.clientHeight;
        const documentWidth = A4_DIMENSIONS.WIDTH;
        const documentHeight = A4_DIMENSIONS.HEIGHT;
        
        // Calculate scale based on container width with some padding
        const widthScale = (containerWidth - 32) / documentWidth;
        const heightScale = (containerHeight - 32) / documentHeight;
        
        // Use the smaller scale to ensure document fits both dimensions
        const optimalScale = Math.min(widthScale, heightScale, 1);
        
        setScale(Math.max(optimalScale, 0.5));
      }
    };

    setInitialScale();
    window.addEventListener('resize', setInitialScale);
    return () => window.removeEventListener('resize', setInitialScale);
  }, []);

  useEffect(() => {
    let touchStartDistance = 0;
    let lastTouchTime = 0;

    const handleTouchStart = (e) => {
      const now = Date.now();
      if (e.touches.length === 2) {
        touchStartDistance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      } else if (e.touches.length === 1) {
        if (now - lastTouchTime < 300) {
          // Double tap
          setShowControls(!showControls);
        }
        setIsDragging(true);
        setStartPos({
          x: e.touches[0].pageX - scrollPos.x,
          y: e.touches[0].pageY - scrollPos.y
        });
      }
      lastTouchTime = now;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const delta = distance - touchStartDistance;
        const newScale = Math.min(Math.max(scale + delta * 0.005, 0.5), 2);
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
  }, [scale, isDragging, startPos, scrollPos, showControls]);

  const handlePrint = () => {
    window.print();
  };

  const handleZoom = (direction) => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newScale, 0.5), 2);
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
      const templateElement = previewRef.current.querySelector('.print-area');
      if (!templateElement) {
        throw new Error('Template element not found');
      }
      const pdf = await generatePDF(templateElement);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No resume data available. Start filling out the form to see the preview.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-gray-900 rounded-lg overflow-hidden relative flex flex-col h-[100dvh]" ref={previewRef}>
      {/* Top Controls */}
      <div className="bg-background dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="h-9 text-gray-700 dark:text-gray-200"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <ExportButton
            resumeData={data}
            templateId={templateId}
            documentType={viewMode}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md shadow-sm">
            <Button
              variant={viewMode === 'resume' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('resume')}
              className={`rounded-r-none h-9 ${
                viewMode !== 'resume' ? 'text-gray-700 dark:text-gray-200' : ''
              }`}
            >
              Resume
            </Button>
            <Button
              variant={viewMode === 'coverLetter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('coverLetter')}
              className={`rounded-l-none h-9 ${
                viewMode !== 'coverLetter' ? 'text-gray-700 dark:text-gray-200' : ''
              }`}
            >
              Cover Letter
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div
        ref={previewAreaRef}
        className="flex-1 overflow-auto touch-pan-x touch-pan-y bg-gray-100 dark:bg-gray-900 flex items-start justify-center p-6 print:p-0"
        style={{
          touchAction: 'none',
          height: 'calc(100dvh - 140px)',
          minWidth: '100%',
        }}
      >
        <div className="preview-wrapper w-full max-w-4xl print:w-full print:max-w-[794px] print:mx-auto">
          <div
            className="print-area relative bg-white dark:bg-gray-800 rounded-xl shadow-md print:shadow-none print:border print:border-gray-300 mx-auto"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center top',
              width: `${A4_DIMENSIONS.WIDTH}mm`,
              minHeight: `${A4_DIMENSIONS.HEIGHT}mm`,
              height: 'auto',
              padding: `${MARGINS.TOP}mm ${MARGINS.RIGHT}mm ${MARGINS.BOTTOM}mm ${MARGINS.LEFT}mm`,
              maxWidth: '100%',
              overflowX: 'visible',
              overflowY: 'visible'
            }}
          >
            <TemplateManager 
              data={{
                personal: data.personal || {},
                experience: data.experience || [],
                education: data.education || [],
                skills: data.skills || [],
                references: data.references || [],
                professionalLinks: data.personal?.links || {}
              }}
              type={viewMode}
            />
          </div>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background/95 dark:bg-gray-800/95 backdrop-blur-sm border-t p-2 transition-transform duration-300 ${
        showControls ? 'translate-y-0' : 'translate-y-full'
      } z-10`}>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('out')}
            disabled={scale <= 0.5}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom('in')}
            disabled={scale >= 2}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile hint */}
      <div 
        className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-xs pointer-events-none transition-opacity duration-300 md:hidden"
        style={{ opacity: isDragging ? 0 : 0.8 }}
      >
        Double tap to toggle controls
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview; 