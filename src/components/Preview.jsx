import { useRef, useState, memo, useEffect, useCallback } from 'react'
import { useToast } from './ui/ToastProvider'
import TemplateManager from '../lib/templates/TemplateManager'
import { exportToDocx, exportToHTML } from '../lib/utils/exportUtils'
import { ZoomIn, ZoomOut, Maximize2, Printer, Download, FileText, Code } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

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

const Preview = memo(({ data, templateId, type = 'resume' }) => {
  const previewRef = useRef(null)
  const previewAreaRef = useRef(null)
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 })
  const [showControls, setShowControls] = useState(true)

  const resetZoom = useCallback(() => setScale(1), []);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault(); // Prevent browser refresh
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetZoom]);

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
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Please allow pop-ups to print', 'error');
      return;
    }

    // Get the content to print
    const contentToPrint = previewRef.current.querySelector('.print-area');
    if (!contentToPrint) {
      printWindow.close();
      showToast('No content to print', 'error');
      return;
    }

    // Write the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ${type === 'coverLetter' ? 'Cover Letter' : 'Resume'}</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .print-container {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              background: white;
              box-sizing: border-box;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
              }
              .print-container {
                page-break-after: always;
              }
            }
            ${Array.from(document.styleSheets)
              .filter(sheet => !sheet.href || sheet.href.startsWith(window.location.origin))
              .map(sheet => {
                try {
                  return Array.from(sheet.cssRules)
                    .map(rule => rule.cssText)
                    .join('\n');
                } catch (e) {
                  return '';
                }
              })
              .join('\n')}
          </style>
        </head>
        <body>
          <div class="print-container">
            ${contentToPrint.outerHTML}
          </div>
        </body>
      </html>
    `);

    // Wait for resources to load and print
    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    });
  };

  const handleZoom = (direction) => {
    const zoomFactor = direction === 'in' ? 0.1 : -0.1;
    const newScale = Math.min(Math.max(scale + zoomFactor, 0.5), 2);
    setScale(newScale);
  };

  return (
    <div className="relative h-full" ref={previewRef}>
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg rounded-lg border dark:border-gray-700">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom('in')}
            title="Zoom In (Ctrl/Cmd +)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom('out')}
            title="Zoom Out (Ctrl/Cmd -)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetZoom}
            title="Reset Zoom (Ctrl/Cmd R)"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="Download">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => exportToDocx(data, templateId, type)}
                className="dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:text-gray-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as DOCX
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => exportToHTML(data, templateId, type)}
                className="dark:hover:bg-gray-800 dark:focus:bg-gray-800 dark:text-gray-200"
              >
                <Code className="mr-2 h-4 w-4" />
                Export as HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      <div
        ref={previewAreaRef}
        className="h-full overflow-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div
          className="print-area w-[210mm] min-h-[297mm] bg-white mx-auto shadow-lg transform-gpu"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            padding: `${MARGINS.TOP}mm ${MARGINS.RIGHT}mm ${MARGINS.BOTTOM}mm ${MARGINS.LEFT}mm`,
          }}
        >
          <TemplateManager data={data} type={type} />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;