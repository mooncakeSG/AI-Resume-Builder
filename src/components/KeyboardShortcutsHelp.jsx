import { useState } from 'react';

const KeyboardShortcutsHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl/⌘', 'S'], description: 'Save resume data' },
    { keys: ['Ctrl/⌘', 'P'], description: 'Print resume' },
    { keys: ['Ctrl/⌘', 'D'], description: 'Download PDF' },
    { keys: ['Ctrl/⌘', 'R'], description: 'Reset all fields' },
    { keys: ['?'], description: 'Show/hide keyboard shortcuts' },
  ];

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
        title="Keyboard Shortcuts"
        data-action="toggle-help"
      >
        ?
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <kbd
                          key={keyIndex}
                          className="px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded shadow-sm"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                    <span className="text-gray-600">{shortcut.description}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Press ? at any time to show this help dialog
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelp; 