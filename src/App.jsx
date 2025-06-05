import { useCallback } from 'react'
import { ToastProvider } from './components/ui/ToastProvider'
import { TemplateProvider } from './lib/templates/TemplateContext'
import { ResumeProvider } from './lib/data/ResumeContext'
import Layout from './components/Layout'
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp'

const App = () => {
  const keyboardShortcuts = {
    onPrint: () => {
      // Handle print functionality
      window.print();
    },
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <ToastProvider>
        <ResumeProvider>
          <TemplateProvider>
            <Layout>
              <KeyboardShortcutsHelp />
            </Layout>
          </TemplateProvider>
        </ResumeProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
