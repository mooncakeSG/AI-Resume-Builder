import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Layout, Check } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'professional', name: 'Professional' },
  { id: 'classic', name: 'Classic' }
];

const TemplateSwitcher = ({ selectedTemplate, onTemplateChange, className }) => {
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium 
          ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
          border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2
          ${className}`}
      >
        <Layout className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">{currentTemplate.name} Template</span>
        <span className="sm:hidden">Template</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {TEMPLATES.map(template => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className="flex items-center justify-between"
          >
            <span>{template.name}</span>
            {selectedTemplate === template.id && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TemplateSwitcher; 