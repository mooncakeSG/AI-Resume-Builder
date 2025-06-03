import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Target, Lightbulb, ArrowRight } from 'lucide-react';
import { analyzeJobMatch } from '../lib/ai/contentGenerator';

export default function JobMatcher({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold">Job Match Analysis</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <Textarea
          placeholder="Paste the job description here to analyze how well your resume matches..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[100px]"
        />

        <Button 
          onClick={analyzeMatch}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full sm:w-auto"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Match Score</span>
                    </div>
                    <span className="text-sm">{analysis.score}%</span>
                  </div>
                  <Progress value={analysis.score} />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <h3 className="font-medium">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {analysis.suggestions.split('\n').map((suggestion, index) => (
                  suggestion.trim() && (
                    <li key={index} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1" />
                      <span>{suggestion}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 