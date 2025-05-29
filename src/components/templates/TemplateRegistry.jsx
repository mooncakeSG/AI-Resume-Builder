import ModernTemplate from './ModernTemplate'
import MinimalistTemplate from './MinimalistTemplate'
import ProfessionalTemplate from './ProfessionalTemplate'

const templates = {
  modern: {
    id: 'modern',
    name: 'Modern',
    component: ModernTemplate,
    description: 'A contemporary design with clear hierarchy and modern styling',
    thumbnail: '/templates/modern.png',
    hasSettings: false
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    component: MinimalistTemplate,
    description: 'A clean, simple design focusing on typography and whitespace',
    thumbnail: '/templates/minimalist.png',
    hasSettings: false
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    component: ProfessionalTemplate,
    description: 'A two-column layout with customizable color scheme',
    thumbnail: '/templates/professional.png',
    hasSettings: true,
    defaultSettings: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      textColor: '#1f2937',
      accentColor: '#e5e7eb'
    }
  }
}

export const getTemplate = (templateId) => {
  return templates[templateId] || templates.modern
}

export const getAllTemplates = () => {
  return Object.values(templates)
}

export default templates 