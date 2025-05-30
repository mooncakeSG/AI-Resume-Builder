import { useCallback } from 'react'
import { ToastProvider } from './components/ui/ToastProvider'
import { TemplateProvider } from './lib/templates/TemplateContext'
import { ResumeProvider } from './lib/data/ResumeContext'
import Layout from './components/Layout'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'

const App = () => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onPrint: () => {
      window.print();
    },
    onDownloadPDF: () => {
      // Trigger the download button in the Preview component
      document.querySelector('[data-action="download-pdf"]')?.click();
    },
  });

  return (
    <ToastProvider>
      <ResumeProvider>
        <TemplateProvider>
          <Layout>
            <KeyboardShortcutsHelp />
          </Layout>
        </TemplateProvider>
      </ResumeProvider>
    </ToastProvider>
  );
};

export default App;
