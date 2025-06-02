import { useState } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { useTemplate } from '../lib/templates/TemplateContext';
import Personal from './Personal';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import References from './References';
import CoverLetter from './CoverLetter';
import Preview from './Preview';
import TemplateSwitcher from './TemplateSwitcher';
import ProfileManager from './ProfileManager';
import AISuggestions from './AISuggestions';
import ATSChecker from './ATSChecker';
import JobMatcher from './JobMatcher';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const { currentProfile, updateCurrentProfile } = useResume();
  const { currentTemplate, changeTemplate } = useTemplate();

  const sections = [
    { id: 'personal', label: 'Personal Details', component: Personal },
    { id: 'education', label: 'Education', component: Education },
    { id: 'experience', label: 'Experience', component: Experience },
    { id: 'skills', label: 'Skills', component: Skills },
    { id: 'references', label: 'References', component: References },
    { id: 'coverLetter', label: 'Cover Letter', component: CoverLetter },
  ];

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleDataChange = (sectionId, data) => {
    updateCurrentProfile({
      ...currentProfile.data,
      [sectionId]: data
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI Resume Builder</h1>
            <div className="flex gap-4">
              <TemplateSwitcher 
                selectedTemplate={currentTemplate}
                onTemplateChange={changeTemplate}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProfileManager />
            
            <nav className="bg-white shadow rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 sm:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-gray-200">
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleSectionChange(id)}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeSection === id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="bg-white shadow rounded-lg">
              {sections.map(({ id, component: Component }) => (
                activeSection === id && (
                  <Component
                    key={id}
                    data={currentProfile.data[id] || (id === 'education' || id === 'experience' || id === 'skills' || id === 'references' ? [] : {})}
                    onChange={(data) => handleDataChange(id, data)}
                  />
                )
              ))}
            </div>

            <AISuggestions />
            
            <div className="grid grid-cols-1 gap-6">
              <ATSChecker resumeData={currentProfile.data} />
              <JobMatcher resumeData={currentProfile.data} />
            </div>
          </div>

          <div className="lg:sticky lg:top-8">
            <Preview 
              data={currentProfile.data} 
              templateId={currentTemplate}
            />
          </div>
        </div>
      </main>

      {children}
    </div>
  );
};

export default Layout; 