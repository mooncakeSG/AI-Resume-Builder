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
import JobMatcher from './JobMatcher';
import ThemeToggle from './ui/theme-toggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, Edit2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="relative">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex flex-col sm:flex-row gap-3 sm:gap-0 py-3 sm:py-0 sm:h-14 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <h1 className="text-3xl font-bold font-poppins tracking-tight">
                JobReady<span className="text-blue-600 dark:text-blue-400">AI</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <ThemeToggle />
              <TemplateSwitcher 
                selectedTemplate={currentTemplate}
                onTemplateChange={changeTemplate}
                className="flex-1 sm:flex-none"
              />
              <Button
                variant="outline"
                size="sm"
                className="md:hidden flex items-center gap-2"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-3 sm:py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className={`space-y-3 sm:space-y-4 md:space-y-6 transition-all duration-300 ease-in-out ${
              showPreview ? 'hidden lg:block' : 'block'
            }`}>
              <Card className="border-2 border-primary/20 dark:border-primary/40">
                <CardContent className="p-3 sm:p-4">
                  <ProfileManager />
                </CardContent>
              </Card>
              
              <Card className="bg-card text-card-foreground">
                <CardContent className="p-0">
                  <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                    <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px p-1 overflow-x-auto bg-muted/50 dark:bg-muted/20">
                      {sections.map(({ id, label }) => (
                        <TabsTrigger 
                          key={id} 
                          value={id} 
                          className={cn(
                            "relative text-xs sm:text-sm whitespace-nowrap px-2 sm:px-4",
                            "text-foreground/70 dark:text-foreground/60",
                            "hover:text-foreground dark:hover:text-foreground",
                            "data-[state=active]:text-white dark:data-[state=active]:text-white",
                            "data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-500",
                            "transition-all duration-200"
                          )}
                        >
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {sections.map(({ id, component: Component }) => (
                      <TabsContent key={id} value={id} className="p-3 sm:p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground/90">{sections.find(s => s.id === id)?.label}</h2>
                          </div>
                          <Card className="bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-4 prose dark:prose-invert max-w-none">
                              <Component
                                data={currentProfile.data[id] || (id === 'education' || id === 'experience' || id === 'skills' || id === 'references' ? [] : {})}
                                onChange={(data) => handleDataChange(id, data)}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                <Card className="bg-card text-card-foreground">
                  <CardContent className="p-3 sm:p-4">
                    <AISuggestions />
                  </CardContent>
                </Card>
                
                <Card className="bg-card text-card-foreground">
                  <CardContent className="p-3 sm:p-4">
                    <JobMatcher resumeData={currentProfile.data} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className={`lg:sticky lg:top-[5rem] transition-all duration-300 ease-in-out ${
              !showPreview ? 'hidden lg:block' : 'block'
            }`}>
              <Card className="h-full bg-card text-card-foreground shadow-lg">
                <CardContent className="p-3 sm:p-4">
                  <div className="bg-white dark:bg-gray-900 rounded-md shadow-inner">
                    <Preview 
                      data={currentProfile.data} 
                      templateId={currentTemplate}
                    />
                  </div>
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