import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { generateContent } from '../lib/ai/contentGenerator';

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
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold">AI Content Suggestions</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(ind => (
                <SelectItem key={ind} value={ind.toLowerCase()}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobRole} onValueChange={setJobRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select Job Role" />
            </SelectTrigger>
            <SelectContent>
              {JOB_ROLES.map(role => (
                <SelectItem key={role} value={role.toLowerCase()}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Enter the content you want to improve..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />

        <Button 
          onClick={generateSuggestions}
          disabled={isGenerating || !content.trim() || !industry || !jobRole}
          className="w-full sm:w-auto"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate Suggestions'}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {suggestions && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Improved Content
                </h3>
                <div className="space-y-2">
                  {suggestions.split('\n').map((suggestion, index) => (
                    suggestion.trim() && (
                      <div key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 mt-1" />
                        <p>{suggestion}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 