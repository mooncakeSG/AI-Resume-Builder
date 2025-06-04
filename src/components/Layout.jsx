import { useState, useEffect } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { useTemplate } from '../lib/templates/TemplateContext';
import Personal from './Personal';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';
import References from './References';
import CoverLetter from './CoverLetter';
import Certifications from './Certifications';
import Languages from './Languages';
import Projects from './Projects';
import Preview from './Preview';
import TemplateSwitcher from './TemplateSwitcher';
import ProfileManager from './ProfileManager';
import AISuggestions from './AISuggestions';
import JobMatcher from './JobMatcher';
import ThemeToggle from './ui/theme-toggle';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Eye, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentProfile, updateCurrentProfile } = useResume();
  const { currentTemplate, changeTemplate } = useTemplate();

  // Initialize data if it's undefined
  useEffect(() => {
    if (!currentProfile?.data) {
      updateCurrentProfile({
        personal: {},
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        references: []
      });
    }
  }, [currentProfile, updateCurrentProfile]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    { id: 'personal', label: 'Personal Details', component: Personal },
    { id: 'education', label: 'Education', component: Education },
    { id: 'experience', label: 'Experience', component: Experience },
    { id: 'skills', label: 'Skills', component: Skills },
    { id: 'certifications', label: 'Certifications', component: Certifications },
    { id: 'languages', label: 'Languages', component: Languages },
    { id: 'projects', label: 'Projects', component: Projects },
    { id: 'references', label: 'References', component: References },
    { id: 'coverLetter', label: 'Cover Letter', component: CoverLetter },
  ];

  const handleDataChange = (sectionId, data) => {
    const currentData = currentProfile?.data || {};
    updateCurrentProfile({
      ...currentData,
      [sectionId]: data
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    // Scroll to top when toggling preview on mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Ensure we have data before rendering
  const safeData = currentProfile?.data || {
    personal: {},
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    references: []
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent,black)]" />
      <div className="relative">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex flex-col sm:flex-row gap-2 py-2 sm:py-0 sm:h-14 items-center justify-between">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins tracking-tight">
                JobReady<span className="text-blue-600 dark:text-blue-400">AI</span>
              </h1>
              <div className="flex items-center gap-2 sm:hidden">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={togglePreview}
                >
                  {showPreview ? (
                    <>
                      <ChevronLeft className="h-4 w-4" />
                      <span>Edit</span>
                    </>
                  ) : (
                    <>
                      <span>Preview</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto justify-end">
              <ThemeToggle />
              <TemplateSwitcher 
                selectedTemplate={currentTemplate}
                onTemplateChange={changeTemplate}
                className="flex-1 sm:flex-none"
              />
            </div>
          </div>
        </header>

        <main className="container py-2 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
            <div className={cn(
              "space-y-2 sm:space-y-4 transition-all duration-300 ease-in-out",
              showPreview ? 'hidden lg:block' : 'block'
            )}>
              <Card className="border-2 border-primary/20 dark:border-primary/40">
                <CardContent className="p-2 sm:p-4">
                  <ProfileManager />
                </CardContent>
              </Card>
              
              <div className="block sm:hidden">
                <TemplateSwitcher 
                  selectedTemplate={currentTemplate}
                  onTemplateChange={changeTemplate}
                  className="w-full"
                />
              </div>

              <Card className="bg-card text-card-foreground">
                <CardContent className="p-0">
                  <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                    <TabsList className="w-full h-auto flex flex-wrap gap-1 p-1 bg-muted/50 dark:bg-muted/20">
                      {sections.map(({ id, label }) => (
                        <TabsTrigger 
                          key={id} 
                          value={id}
                          className={cn(
                            "flex-1 min-w-[120px] text-xs sm:text-sm py-1.5 px-2",
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
                      <TabsContent key={id} value={id} className="p-2 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground/90">{sections.find(s => s.id === id)?.label}</h2>
                          </div>
                          <Card className="bg-card/50 backdrop-blur-sm dark:bg-gray-900/50">
                            <CardContent className="p-3 sm:p-4 prose dark:prose-invert max-w-none">
                              <Component
                                data={safeData[id] || (
                                  ['education', 'experience', 'skills', 'references', 'certifications', 'languages', 'projects'].includes(id) 
                                    ? [] 
                                    : {}
                                )}
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

              <div className="grid grid-cols-1 gap-2 sm:gap-4">
                <Card className="bg-card text-card-foreground">
                  <CardContent className="p-2 sm:p-4">
                    <AISuggestions />
                  </CardContent>
                </Card>
                
                <Card className="bg-card text-card-foreground">
                  <CardContent className="p-2 sm:p-4">
                    <JobMatcher resumeData={safeData} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className={cn(
              "lg:sticky lg:top-[4.5rem] transition-all duration-300 ease-in-out h-[calc(100vh-5rem)]",
              !showPreview ? 'hidden lg:block' : 'block'
            )}>
              <Card className="h-full bg-card/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-2 sm:p-4 h-full">
                  <div className="bg-white dark:bg-gray-900 rounded-md shadow-inner h-full overflow-hidden">
                    <Preview 
                      data={safeData} 
                      templateId={currentTemplate}
                      type={activeSection === 'coverLetter' ? 'coverLetter' : 'resume'}
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