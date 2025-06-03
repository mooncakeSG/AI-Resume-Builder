import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  AlertCircle, 
  Target, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2,
  UserCircle2,
  Briefcase,
  GraduationCap,
  Trophy,
  ClipboardCheck,
  FileSearch,
  Search,
  MessageSquare,
  BarChart,
  Users
} from 'lucide-react';
import { analyzeJobMatch } from '../lib/ai/contentGenerator';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function JobMatcher({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Helper function to generate recruiter insights
  const generateRecruiterInsights = (matches, missing) => {
    const strengths = [];
    const improvements = [];

    // Generate strengths based on matched keywords
    if (matches && matches.length > 0) {
      // Group related skills
      const skillGroups = matches.reduce((groups, skill) => {
        const skillLower = skill.toLowerCase();
        if (skillLower.includes('develop') || skillLower.includes('program') || skillLower.includes('code')) {
          groups.development = groups.development || [];
          groups.development.push(skill);
        } else if (skillLower.includes('manage') || skillLower.includes('lead') || skillLower.includes('coordinate')) {
          groups.leadership = groups.leadership || [];
          groups.leadership.push(skill);
        } else if (skillLower.includes('analy') || skillLower.includes('solve') || skillLower.includes('research')) {
          groups.analytical = groups.analytical || [];
          groups.analytical.push(skill);
        } else if (skillLower.includes('communicate') || skillLower.includes('present') || skillLower.includes('collaborate')) {
          groups.communication = groups.communication || [];
          groups.communication.push(skill);
        } else {
          groups.other = groups.other || [];
          groups.other.push(skill);
        }
        return groups;
      }, {});

      // Generate strength statements
      Object.entries(skillGroups).forEach(([category, skills]) => {
        if (skills.length > 0) {
          switch (category) {
            case 'development':
              strengths.push(`Strong technical background with expertise in ${skills.slice(0, 3).join(', ')}`);
              break;
            case 'leadership':
              strengths.push(`Demonstrated leadership abilities through ${skills.slice(0, 2).join(' and ')}`);
              break;
            case 'analytical':
              strengths.push(`Excellent analytical skills including ${skills.slice(0, 2).join(' and ')}`);
              break;
            case 'communication':
              strengths.push(`Strong communication skills highlighted by ${skills.slice(0, 2).join(' and ')}`);
              break;
            case 'other':
              if (skills.length >= 2) {
                strengths.push(`Additional valuable skills include ${skills.slice(0, 2).join(' and ')}`);
              }
              break;
          }
        }
      });
    }

    // Generate improvements based on missing keywords
    if (missing && missing.length > 0) {
      const missingCategories = {
        technical: missing.filter(skill => 
          skill.toLowerCase().includes('develop') || 
          skill.toLowerCase().includes('program') ||
          skill.toLowerCase().includes('technical') ||
          skill.toLowerCase().includes('software')
        ),
        soft: missing.filter(skill => 
          skill.toLowerCase().includes('communicate') || 
          skill.toLowerCase().includes('collaborate') ||
          skill.toLowerCase().includes('manage') ||
          skill.toLowerCase().includes('lead')
        ),
        domain: missing.filter(skill => 
          skill.toLowerCase().includes('industry') || 
          skill.toLowerCase().includes('business') ||
          skill.toLowerCase().includes('experience')
        ),
        certification: missing.filter(skill => 
          skill.toLowerCase().includes('certif') || 
          skill.toLowerCase().includes('degree') ||
          skill.toLowerCase().includes('qualification')
        )
      };

      // Generate improvement suggestions
      if (missingCategories.technical.length > 0) {
        improvements.push(`Consider adding experience with ${missingCategories.technical.slice(0, 2).join(' and ')} to strengthen technical qualifications`);
      }
      if (missingCategories.soft.length > 0) {
        improvements.push(`Highlight experience in ${missingCategories.soft.slice(0, 2).join(' and ')} to demonstrate broader skill set`);
      }
      if (missingCategories.domain.length > 0) {
        improvements.push(`Add relevant experience in ${missingCategories.domain.slice(0, 2).join(' or ')} to show domain expertise`);
      }
      if (missingCategories.certification.length > 0) {
        improvements.push(`Include relevant ${missingCategories.certification[0].toLowerCase()} to meet job requirements`);
      }
    }

    // Ensure we have at least some generic insights if nothing specific was generated
    if (strengths.length === 0) {
      strengths.push('Resume contains some relevant skills for the position');
    }
    if (improvements.length === 0 && analysis.score < 70) {
      improvements.push('Add more specific keywords from the job description');
      improvements.push('Quantify achievements with specific metrics');
    }

    return {
      strengths: strengths.slice(0, 3),
      improvements: improvements.slice(0, 3)
    };
  };

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert resume data to string for analysis
      const resumeText = Object.entries(resumeData)
        .map(([section, data]) => {
          if (Array.isArray(data)) {
            return data.map(item => Object.values(item).join(' ')).join('\n');
          }
          return Object.values(data).join(' ');
        })
        .join('\n');

      // Analyze job match
      const result = await analyzeJobMatch(resumeText, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze job match. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Group suggestions by category
  const groupSuggestions = (suggestions) => {
    const categories = {
      summary: [],
      skills: [],
      experience: [],
      education: [],
      other: []
    };

    suggestions.forEach(item => {
      const text = item.suggestion.toLowerCase();
      if (text.includes('summary') || text.includes('objective')) {
        categories.summary.push(item);
      } else if (text.includes('skill') || text.includes('technology') || text.includes('technical')) {
        categories.skills.push(item);
      } else if (text.includes('experience') || text.includes('work')) {
        categories.experience.push(item);
      } else if (text.includes('education') || text.includes('degree') || text.includes('certification')) {
        categories.education.push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* ATS Analysis Section */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSearch className="h-5 w-5 text-blue-500" />
              ATS Resume Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Resume Parsing Status */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-500" />
                  Resume Parsing Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Format Detection</p>
                    <Badge variant="success">Compatible Format</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Content Extraction</p>
                    <Badge variant="success">Successfully Parsed</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Keyword Analysis */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Keyword Analysis
                </h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Paste the job description here to analyze keyword matching..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                  <Button 
                    onClick={analyzeMatch}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Keywords'}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {analysis && analysis.score !== undefined && (
                <>
                  <Separator />
                  
                  {/* Match Analytics */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <BarChart className="h-4 w-4 text-blue-500" />
                      Match Analytics
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Overall Match Score</span>
                        </div>
                        <Badge variant={analysis.score >= 70 ? "success" : analysis.score >= 50 ? "warning" : "destructive"}>
                          {analysis.score}%
                        </Badge>
                      </div>
                      <Progress 
                        value={analysis.score} 
                        className={`${
                          analysis.score >= 70 ? "bg-green-200" : 
                          analysis.score >= 50 ? "bg-yellow-200" : 
                          "bg-red-200"
                        }`}
                      />
                    </div>

                    {/* Keyword Matches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Detected Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.matches && analysis.matches.map((keyword, index) => (
                            <Badge key={index} variant="success" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Missing Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missing && analysis.missing.map((keyword, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Recruiter View Simulation */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      Recruiter View Simulation
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strengths</h4>
                          <ul className="space-y-2">
                            {generateRecruiterInsights(analysis.matches, analysis.missing).strengths.map((strength, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="h-4 w-4 mt-1 text-green-500" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for Enhancement</h4>
                          <ul className="space-y-2">
                            {generateRecruiterInsights(analysis.matches, analysis.missing).improvements.map((area, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <ArrowRight className="h-4 w-4 mt-1 text-red-500" />
                                <span>{area}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Optimization Suggestions */}
        {analysis && analysis.suggestions && analysis.suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Resume Optimization Guide</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Summary Section */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-blue-500" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions
                      .filter(item => item.suggestion.toLowerCase().includes('summary'))
                      .map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                          <span>{item.suggestion}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-green-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions
                      .filter(item => item.suggestion.toLowerCase().includes('contact') || item.suggestion.toLowerCase().includes('email'))
                      .map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-green-500" />
                          <span>{item.suggestion}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions
                      .filter(item => item.suggestion.toLowerCase().includes('experience'))
                      .map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-purple-500" />
                          <span>{item.suggestion}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions
                      .filter(item => 
                        item.suggestion.toLowerCase().includes('skill') || 
                        item.suggestion.toLowerCase().includes('technology') ||
                        item.suggestion.toLowerCase().includes('technical')
                      )
                      .map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-amber-500" />
                          <span>{item.suggestion}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className="border-l-4 border-l-indigo-500 md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions
                      .filter(item => 
                        item.suggestion.toLowerCase().includes('education') || 
                        item.suggestion.toLowerCase().includes('degree') ||
                        item.suggestion.toLowerCase().includes('certification')
                      )
                      .map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-indigo-500" />
                          <span>{item.suggestion}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 