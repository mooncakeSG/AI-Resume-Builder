import { useState, useEffect } from 'react';
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
  const [parsingStatus, setParsingStatus] = useState(null);

  // Validate resume data when component mounts or resumeData changes
  useEffect(() => {
    if (resumeData) {
      const status = validateResumeData(resumeData);
      setParsingStatus(status);
    }
  }, [resumeData]);

  // Helper function to validate resume data
  const validateResumeData = (data) => {
    const requiredSections = ['personal', 'experience', 'education', 'skills'];
    const contentStatus = {
      sections: {},
      isValid: true,
      messages: []
    };

    // Check if all required sections exist and have content
    requiredSections.forEach(section => {
      const sectionData = data[section];
      const hasContent = Array.isArray(sectionData) 
        ? sectionData.length > 0 
        : sectionData && Object.keys(sectionData).length > 0;

      contentStatus.sections[section] = {
        exists: Boolean(sectionData),
        hasContent
      };

      if (!hasContent) {
        contentStatus.isValid = false;
        contentStatus.messages.push(`${section.charAt(0).toUpperCase() + section.slice(1)} section is empty`);
      }
    });

    return {
      isValid: contentStatus.isValid,
      contentStatus
    };
  };

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

    if (!resumeData) {
      setError('Resume data is not available.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Format resume data for analysis
      const resumeText = formatResumeForAnalysis(resumeData);
      const result = await analyzeJobMatch(resumeText, jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze job match. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to format resume data for analysis
  const formatResumeForAnalysis = (data) => {
    const sections = [];

    // Add personal info
    if (data.personal) {
      const { firstName, lastName, title, summary } = data.personal;
      if (firstName || lastName) sections.push(`${firstName || ''} ${lastName || ''}`);
      if (title) sections.push(title);
      if (summary) sections.push(summary);
    }

    // Add experience
    if (Array.isArray(data.experience)) {
      data.experience.forEach(exp => {
        const { position, company, description, achievements } = exp;
        if (position) sections.push(position);
        if (company) sections.push(company);
        if (description) sections.push(description);
        if (Array.isArray(achievements)) {
          sections.push(achievements.join(' '));
        }
      });
    }

    // Add education
    if (Array.isArray(data.education)) {
      data.education.forEach(edu => {
        const { degree, school, field, description } = edu;
        if (degree) sections.push(degree);
        if (school) sections.push(school);
        if (field) sections.push(field);
        if (description) sections.push(description);
      });
    }

    // Add skills
    if (Array.isArray(data.skills)) {
      sections.push(data.skills.join(' '));
    }

    return sections.join('\n');
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-blue-500" />
            ATS Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Resume Parsing Status */}
            <div className="flex items-center gap-2 text-sm">
              <FileSearch className="h-4 w-4" />
              <span>Resume Parsing Status</span>
              {parsingStatus?.isValid ? (
                <Badge variant="success" className="ml-auto">
                  Successfully Parsed
                </Badge>
              ) : (
                <Badge variant="destructive" className="ml-auto">
                  Format Issues
                </Badge>
              )}
            </div>

            {/* Job Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Job Description
              </label>
              <Textarea
                placeholder="Paste the job description here to analyze match..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={analyzeMatch}
              disabled={isAnalyzing || !jobDescription.trim()}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Keywords'}
            </Button>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-6 space-y-6">
              {/* Match Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Match Score</span>
                  </div>
                  <span className="text-sm font-medium">{analysis.score}%</span>
                </div>
                <Progress value={analysis.score} className="h-2" />
              </div>

              <Separator />

              {/* Keyword Matches */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <h3 className="font-medium">Matching Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matches?.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <h3 className="font-medium">Missing Keywords</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing?.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Recruiter Insights */}
              {analysis.matches && analysis.missing && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <h3 className="font-medium">Recruiter Insights</h3>
                  </div>
                  
                  {(() => {
                    const insights = generateRecruiterInsights(analysis.matches, analysis.missing);
                    return (
                      <div className="space-y-4">
                        {/* Strengths */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            Key Strengths
                          </h4>
                          <ul className="space-y-1">
                            {insights.strengths.map((strength, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Improvements */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-blue-600 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Suggested Improvements
                          </h4>
                          <ul className="space-y-1">
                            {insights.improvements.map((improvement, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 