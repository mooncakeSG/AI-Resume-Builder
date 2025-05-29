import { useState } from 'react'
import { getTemplate } from './templates/TemplateRegistry'
import TemplateSelector from './templates/TemplateSelector'
import TemplateSettings from './templates/TemplateSettings'

const ResumePreview = ({ formData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(getTemplate('modern'))
  const [templateSettings, setTemplateSettings] = useState(
    selectedTemplate.defaultSettings || {}
  )
  const TemplateComponent = selectedTemplate.component

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template)
    setTemplateSettings(template.defaultSettings || {})
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-end gap-4">
          {selectedTemplate.hasSettings && (
            <TemplateSettings
              settings={templateSettings}
              onSettingsChange={setTemplateSettings}
            />
          )}
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateChange={handleTemplateChange}
          />
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <TemplateComponent
            formData={formData}
            settings={templateSettings}
          />
        </div>
      </div>
    </div>
  )
}

export default ResumePreview 