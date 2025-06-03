import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Sparkles, ArrowRight, Briefcase, Building2, PenLine, CheckCircle2, Lightbulb } from 'lucide-react';
import { generateContent } from '../lib/ai/contentGenerator';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Marketing',
  'Consulting',
  'Non-Profit',
  'Other'
];

const JOB_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Sales Representative',
  'Business Analyst',
  'Project Manager',
  'HR Manager',
  'Other'
];

export default function AISuggestions() {
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const generateSuggestions = async () => {
    if (!content.trim() || !industry || !jobRole) {
      setError('Please fill in all fields to get suggestions.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const improvedContent = await generateContent(jobRole, industry, content);
      setSuggestions(improvedContent);
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-purple-500 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 h-5 w-5 bg-purple-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
            AI Content Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Building2 className="h-4 w-4 text-purple-500 transition-transform group-hover:scale-110" />
                    Industry
                  </label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger className="bg-white transition-colors hover:border-purple-500/50">
                      <SelectValue placeholder="Select Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[300px] overflow-y-auto">
                        {INDUSTRIES.map(ind => (
                          <SelectItem 
                            key={ind} 
                            value={ind.toLowerCase()}
                            className="transition-colors hover:bg-purple-50"
                          >
                            {ind}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <Briefcase className="h-4 w-4 text-purple-500 transition-transform group-hover:scale-110" />
                    Job Role
                  </label>
                  <Select value={jobRole} onValueChange={setJobRole}>
                    <SelectTrigger className="bg-white transition-colors hover:border-purple-500/50">
                      <SelectValue placeholder="Select Job Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-[300px] overflow-y-auto">
                        {JOB_ROLES.map(role => (
                          <SelectItem 
                            key={role} 
                            value={role.toLowerCase()}
                            className="transition-colors hover:bg-purple-50"
                          >
                            {role}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
                  <PenLine className="h-4 w-4 text-purple-500 transition-transform group-hover:scale-110" />
                  Content to Enhance
                </label>
                <Textarea
                  placeholder="Enter the content you want to improve..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] bg-white resize-none transition-colors hover:border-purple-500/50 focus:border-purple-500"
                />
              </div>

              <Button 
                onClick={generateSuggestions}
                disabled={isGenerating || !content.trim() || !industry || !jobRole}
                className={cn(
                  "w-full sm:w-auto bg-purple-500 hover:bg-purple-600 transition-all duration-300",
                  "disabled:opacity-50 disabled:hover:bg-purple-500",
                  "relative overflow-hidden",
                  isGenerating && "animate-pulse"
                )}
              >
                <Sparkles className={cn(
                  "h-4 w-4 mr-2",
                  isGenerating && "animate-spin"
                )} />
                {isGenerating ? 'Generating Suggestions...' : 'Enhance Content'}
                {isGenerating && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                )}
              </Button>

              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg animate-slideIn">
                  <AlertCircle className="h-4 w-4 animate-bounce" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            {suggestions && (
              <>
                <Separator className="bg-purple-200" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-purple-500 animate-pulse" />
                      Enhanced Content Suggestions
                    </h3>
                    <Badge 
                      variant="outline" 
                      className="bg-purple-50 border-purple-200 text-purple-700"
                    >
                      AI Generated
                    </Badge>
                  </div>

                  <div className="grid gap-4">
                    {suggestions.split('\n').map((suggestion, index) => 
                      suggestion.trim() && (
                        <Card 
                          key={index} 
                          className={cn(
                            "bg-purple-50/50 transition-all duration-300",
                            "hover:shadow-md hover:bg-purple-50",
                            "animate-fadeIn",
                            "border border-purple-100"
                          )}
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 group">
                              <CheckCircle2 className="h-5 w-5 mt-0.5 text-purple-500 transition-transform group-hover:scale-110" />
                              <div className="space-y-1 flex-1">
                                <p className="text-sm text-gray-600 leading-relaxed">{suggestion}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 