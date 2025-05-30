import { createContext, useContext, useState, useCallback } from 'react';
import { TEMPLATE_TYPES, getTemplateSettings, isValidTemplate } from './templateConfig';

const TemplateContext = createContext();

export function TemplateProvider({ children }) {
  // Initialize template state
  const [currentTemplate, setCurrentTemplate] = useState(() => {
    const saved = localStorage.getItem('selectedTemplate');
    return saved && isValidTemplate(saved) ? saved : TEMPLATE_TYPES.MODERN;
  });

  // Initialize template settings
  const [templateSettings, setTemplateSettings] = useState(() => {
    const saved = localStorage.getItem('templateSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed[currentTemplate] || getTemplateSettings(currentTemplate);
      } catch {
        return getTemplateSettings(currentTemplate);
      }
    }
    return getTemplateSettings(currentTemplate);
  });

  // Change template and load its default settings
  const changeTemplate = useCallback((templateId) => {
    if (isValidTemplate(templateId)) {
      setCurrentTemplate(templateId);
      
      // Load saved settings for this template or use defaults
      const saved = localStorage.getItem('templateSettings');
      let newSettings;
      
      if (saved) {
        try {
          const allSettings = JSON.parse(saved);
          newSettings = allSettings[templateId] || getTemplateSettings(templateId);
        } catch {
          newSettings = getTemplateSettings(templateId);
        }
      } else {
        newSettings = getTemplateSettings(templateId);
      }
      
      setTemplateSettings(newSettings);
      
      // Save template preference
      localStorage.setItem('selectedTemplate', templateId);
    }
  }, []);

  // Update template settings
  const updateSettings = useCallback((newSettings) => {
    setTemplateSettings(newSettings);
    
    // Save settings to localStorage
    const saved = localStorage.getItem('templateSettings');
    let allSettings = {};
    
    if (saved) {
      try {
        allSettings = JSON.parse(saved);
      } catch {
        // If parse fails, start fresh
      }
    }
    
    allSettings[currentTemplate] = newSettings;
    localStorage.setItem('templateSettings', JSON.stringify(allSettings));
  }, [currentTemplate]);

  const value = {
    currentTemplate,
    changeTemplate,
    templateSettings,
    updateSettings,
    TEMPLATE_TYPES,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
} 