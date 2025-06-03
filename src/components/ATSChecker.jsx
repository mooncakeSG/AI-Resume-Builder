import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { optimizeKeywords, analyzeJobMatch } from '../lib/ai/contentGenerator';

export default function ATSChecker({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState(null);

  const analyzeResume = async () => {
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
          if (typeof data === 'object' && data !== null) {
            return Object.values(data).join(' ');
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');

      // Analyze job match
      const matchResult = await analyzeJobMatch(resumeText, jobDescription);
      setAnalysis(matchResult);

      // Get keyword optimization suggestions
      const optimizedContent = await optimizeKeywords(resumeText, jobDescription);
      setSuggestions(optimizedContent);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg font-semibold">ATS Compatibility Check</CardTitle>
      </CardHeader>

      <div className="space-y-4">
        <Textarea
          placeholder="Paste the job description here to analyze your resume's ATS compatibility..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[100px]"
        />

        <Button 
          onClick={analyzeResume}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="w-full sm:w-auto"
        >
          {isAnalyzing ? 'Analyzing...' : 'Check Compatibility'}
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
                    <span className="font-medium">Match Score</span>
                    <span className={`text-sm font-semibold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}%
                    </span>
                  </div>
                  <Progress 
                    value={analysis.score} 
                    className={`h-2 ${getScoreColor(analysis.score)}`}
                  />
                </div>
              </CardContent>
            </Card>

            {analysis.analysis && typeof analysis.analysis === 'object' && (
              <div className="space-y-4">
                {analysis.analysis.matched_keywords && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Matched Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.matched_keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.analysis.missing_keywords && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.analysis.missing_keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.analysis.strength_areas && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Strengths</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.strength_areas.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-1 text-green-500" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.analysis.improvement_areas && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.improvement_areas.map((area, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 mt-1 text-red-500" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {suggestions && (
              <div className="space-y-2">
                <h3 className="font-medium">Optimization Suggestions</h3>
                <div className="prose prose-sm max-w-none">
                  {suggestions.split('\n').map((line, index) => (
                    line.trim() && (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                        <span>{line}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 