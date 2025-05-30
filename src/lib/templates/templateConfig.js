export const TEMPLATE_TYPES = {
  MODERN: 'modern',
  MINIMAL: 'minimal',
  PROFESSIONAL: 'professional',
  CLASSIC: 'classic',
};

export const TEMPLATES = {
  [TEMPLATE_TYPES.MODERN]: {
    id: TEMPLATE_TYPES.MODERN,
    name: 'Modern',
    description: 'A clean and contemporary design with a focus on readability',
    thumbnail: '/templates/modern.png',
    settings: {
      colorScheme: {
        primary: '#2563eb',
        secondary: '#4b5563',
        accent: '#60a5fa',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontSize: {
          name: '24px',
          sectionTitle: '16px',
          jobTitle: '14px',
          normal: '12px',
        },
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      layout: {
        columns: 1,
        headerStyle: 'centered',
      },
    },
  },
  [TEMPLATE_TYPES.MINIMAL]: {
    id: TEMPLATE_TYPES.MINIMAL,
    name: 'Minimal',
    description: 'A minimalist design that puts content first',
    thumbnail: '/templates/minimal.png',
    settings: {
      colorScheme: {
        primary: '#18181b',
        secondary: '#71717a',
        accent: '#a1a1aa',
      },
      typography: {
        fontFamily: 'system-ui, sans-serif',
        fontSize: {
          name: '24px',
          sectionTitle: '16px',
          jobTitle: '14px',
          normal: '12px',
        },
      },
      spacing: {
        sectionGap: '1.25rem',
        itemGap: '0.75rem',
      },
      layout: {
        columns: 1,
        headerStyle: 'left-aligned',
      },
    },
  },
  [TEMPLATE_TYPES.PROFESSIONAL]: {
    id: TEMPLATE_TYPES.PROFESSIONAL,
    name: 'Professional',
    description: 'A traditional design perfect for conservative industries',
    thumbnail: '/templates/professional.png',
    settings: {
      colorScheme: {
        primary: '#1e3a8a',
        secondary: '#1f2937',
        accent: '#3b82f6',
      },
      typography: {
        fontFamily: 'Georgia, serif',
        fontSize: {
          name: '24px',
          sectionTitle: '16px',
          jobTitle: '14px',
          normal: '12px',
        },
      },
      spacing: {
        sectionGap: '1.75rem',
        itemGap: '1.25rem',
      },
      layout: {
        columns: 1,
        headerStyle: 'traditional',
      },
    },
  },
  [TEMPLATE_TYPES.CLASSIC]: {
    id: TEMPLATE_TYPES.CLASSIC,
    name: 'Classic',
    description: 'A timeless design with a two-column layout',
    thumbnail: '/templates/classic.png',
    settings: {
      colorScheme: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#9ca3af',
      },
      typography: {
        fontFamily: 'Times New Roman, serif',
        fontSize: {
          name: '24px',
          sectionTitle: '16px',
          jobTitle: '14px',
          normal: '12px',
        },
      },
      spacing: {
        sectionGap: '1.5rem',
        itemGap: '1rem',
      },
      layout: {
        columns: 2,
        headerStyle: 'centered',
      },
    },
  },
};

export const getTemplate = (templateId) => {
  return TEMPLATES[templateId] || TEMPLATES[TEMPLATE_TYPES.MODERN];
};

export const getAllTemplates = () => {
  return Object.values(TEMPLATES);
};

export const getTemplateSettings = (templateId) => {
  const template = getTemplate(templateId);
  return template.settings;
};

export const isValidTemplate = (templateId) => {
  return templateId in TEMPLATES;
}; 