import { useEffect } from 'react';

const useKeyboardShortcuts = ({ onPrint }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Print shortcut (Ctrl/Cmd + P)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onPrint?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPrint]);
};

export default useKeyboardShortcuts; 