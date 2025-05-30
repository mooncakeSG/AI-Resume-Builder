import { useEffect } from 'react';

const useKeyboardShortcuts = ({ onPrint, onDownloadPDF }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Ctrl/Cmd key is pressed
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            onPrint?.();
            break;
          case 'd':
            e.preventDefault();
            onDownloadPDF?.();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrint, onDownloadPDF]);
};

export default useKeyboardShortcuts; 