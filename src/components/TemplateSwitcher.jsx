import { useTemplate } from '../lib/templates/TemplateContext';

export default function TemplateSwitcher() {
  const { currentTemplate, changeTemplate, TEMPLATE_TYPES } = useTemplate();

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Resume Template</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(TEMPLATE_TYPES).map((template) => (
          <button
            key={template}
            onClick={() => changeTemplate(template)}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200
              ${currentTemplate === template 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
              }
            `}
          >
            <div className="aspect-w-8 aspect-h-11 mb-2">
              {/* Template Preview Placeholder */}
              <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500 capitalize">{template}</span>
              </div>
            </div>
            <span className="block text-sm font-medium capitalize text-center">
              {template}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 