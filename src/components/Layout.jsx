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
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

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

  const handleDataChange = (sectionId, data) => {
    updateCurrentProfile({
      ...currentProfile.data,
      [sectionId]: data
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
      <div className="relative">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <h1 className="text-xl font-bold">AI Resume Builder</h1>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <TemplateSwitcher 
                selectedTemplate={currentTemplate}
                onTemplateChange={changeTemplate}
              />
            </div>
          </div>
        </header>

        <main className="container py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <ProfileManager />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-0">
                  <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                    <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6 gap-px p-1">
                      {sections.map(({ id, label }) => (
                        <TabsTrigger key={id} value={id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {sections.map(({ id, component: Component }) => (
                      <TabsContent key={id} value={id} className="p-4">
                        <Component
                          data={currentProfile.data[id] || (id === 'education' || id === 'experience' || id === 'skills' || id === 'references' ? [] : {})}
                          onChange={(data) => handleDataChange(id, data)}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <AISuggestions />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <ATSChecker resumeData={currentProfile.data} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <JobMatcher resumeData={currentProfile.data} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:sticky lg:top-[5rem]">
              <Card>
                <CardContent className="p-4">
                  <Preview 
                    data={currentProfile.data} 
                    templateId={currentTemplate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {children}
      </div>
    </div>
  );
};

export default Layout; 