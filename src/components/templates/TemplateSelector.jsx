import { useState } from 'react'
import { getAllTemplates } from './TemplateRegistry'

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const templates = getAllTemplates()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>Template: {selectedTemplate.name}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onTemplateChange(template)
                  setIsOpen(false)
                }}
                className={`w-full p-3 text-left rounded-md transition-colors ${
                  selectedTemplate.id === template.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-500 mt-1">{template.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateSelector 