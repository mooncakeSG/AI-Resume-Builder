import { useState } from 'react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'professional', name: 'Professional' },
  { id: 'classic', name: 'Classic' }
];

const TemplateSwitcher = ({ selectedTemplate, onTemplateChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateSelect = (templateId) => {
    onTemplateChange(templateId);
    setIsOpen(false);
  };

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
      >
        <span>{currentTemplate.name} Template</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="py-1">
            {TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedTemplate === template.id ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSwitcher; 