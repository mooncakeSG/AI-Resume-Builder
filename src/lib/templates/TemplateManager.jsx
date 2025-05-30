import React from 'react';
import { useTemplate } from './TemplateContext';
import { ModernTemplate } from './ModernTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { ClassicTemplate } from './ClassicTemplate';

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  classic: ClassicTemplate,
};

export default function TemplateManager({ data }) {
  const { currentTemplate, templateSettings } = useTemplate();
  
  // Get the template component from the current template
  const TemplateComponent = TEMPLATE_COMPONENTS[currentTemplate];

  if (!TemplateComponent) {
    console.error(`Template component not found for template: ${currentTemplate}`);
    return null;
  }

  return (
    <TemplateComponent 
      data={data} 
      settings={templateSettings}
    />
  );
} 