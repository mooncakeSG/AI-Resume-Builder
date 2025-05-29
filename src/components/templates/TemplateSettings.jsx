import { useState } from 'react'

const TemplateSettings = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const colorPresets = {
    blue: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      textColor: '#1f2937',
      accentColor: '#e5e7eb'
    },
    green: {
      primaryColor: '#059669',
      secondaryColor: '#065f46',
      textColor: '#1f2937',
      accentColor: '#ecfdf5'
    },
    purple: {
      primaryColor: '#7c3aed',
      secondaryColor: '#5b21b6',
      textColor: '#1f2937',
      accentColor: '#f5f3ff'
    },
    slate: {
      primaryColor: '#475569',
      secondaryColor: '#334155',
      textColor: '#1f2937',
      accentColor: '#f8fafc'
    }
  }

  const handlePresetChange = (preset) => {
    onSettingsChange(colorPresets[preset])
  }

  const handleColorChange = (key, value) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>Customize Colors</span>
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
        <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Color Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(colorPresets).map(([name, colors]) => (
                  <button
                    key={name}
                    onClick={() => handlePresetChange(name)}
                    className="p-2 text-sm border rounded hover:bg-gray-50"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Custom Colors</h3>
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 w-24">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateSettings 