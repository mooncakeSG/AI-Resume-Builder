import React from 'react';
import { useTemplate } from './TemplateContext';
import ProfessionalTemplate from './ProfessionalTemplate';
import ModernTemplate from './ModernTemplate';
import CreativeTemplate from './CreativeTemplate';
import MinimalTemplate from './MinimalTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import CoverLetterTemplate from './CoverLetterTemplate';

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
};

export default function TemplateManager({ data, type = 'resume' }) {
  const { currentTemplate, templateSettings } = useTemplate();
  
  if (type === 'coverLetter') {
    return <CoverLetterTemplate data={data} settings={templateSettings} />;
  }

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