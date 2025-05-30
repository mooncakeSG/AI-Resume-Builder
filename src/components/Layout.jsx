import { useState } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import Personal from './Personal';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import Preview from './Preview';
import TemplateSwitcher from './TemplateSwitcher';
import ProfileManager from './ProfileManager';
import AISuggestions from './AISuggestions';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const { currentProfile, updateCurrentProfile } = useResume();

  const sections = [
    { id: 'personal', label: 'Personal Details', component: Personal },
    { id: 'education', label: 'Education', component: Education },
    { id: 'experience', label: 'Experience', component: Experience },
    { id: 'skills', label: 'Skills', component: Skills },
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
              <TemplateSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ProfileManager />
            
            <nav className="bg-white shadow rounded-lg overflow-hidden">
              <div className="flex divide-x divide-gray-200">
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => handleSectionChange(id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
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

            <div className="bg-white shadow rounded-lg p-6">
              {sections.map(({ id, component: Component }) => (
                activeSection === id && (
                  <Component
                    key={id}
                    data={currentProfile.data[id] || (id === 'education' || id === 'experience' || id === 'skills' ? [] : {})}
                    onChange={(data) => handleDataChange(id, data)}
                  />
                )
              ))}
            </div>

            <AISuggestions />
          </div>

          <div className="lg:sticky lg:top-8">
            <Preview data={currentProfile.data} />
          </div>
        </div>
      </main>

      {children}
    </div>
  );
};

export default Layout; 