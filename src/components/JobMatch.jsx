import React, { useState, useCallback } from 'react';
import { analyzeJobMatch, optimizeForIndustry } from '../utils/jobMatch';
import ATSAnalysis from './ATSAnalysis';
import { checkATSCompatibility } from '../lib/ai/AIService';

const JobMatch = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState(null);
  const [industryMatch, setIndustryMatch] = useState(null);

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim()) {
      setAtsError('Please enter a job description first.');
      return;
    }

    // Reset states
    setAnalysis(null);
    setAtsAnalysis(null);
    setAtsError(null);
    setAtsLoading(true);

    try {
      // Convert resume data to text for analysis
      const resumeText = `
        ${resumeData.summary || ''}
        ${resumeData.experience?.map(job => `
          ${job.position || ''}
          ${job.company || ''}
          ${job.responsibilities?.join(' ') || ''}
        `).join(' ') || ''}
        ${resumeData.skills?.join(' ') || ''}
      `;

      // Run job match and ATS analysis in parallel
      const [matchResults, atsResults] = await Promise.all([
        analyzeJobMatch(resumeText, jobDescription),
        checkATSCompatibility(resumeData, jobDescription)
      ]);

      console.log('ATS Analysis Results:', atsResults); // Debug log
      
      setAnalysis(matchResults);
      setAtsAnalysis(atsResults);

      // Industry-specific analysis if industry is selected
      if (industry) {
        const industryResults = optimizeForIndustry(resumeText, industry);
        setIndustryMatch(industryResults);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setAtsError(error.message || 'Failed to analyze resume. Please check your API configuration and try again.');
    } finally {
      setAtsLoading(false);
    }
  }, [jobDescription, industry, resumeData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Job Match Analysis</h2>
      
      {/* Job Description Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          className="w-full h-32 p-3 border rounded-md"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      {/* Industry Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Industry
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="">Select an industry...</option>
          <option value="software">Software Development</option>
          <option value="marketing">Marketing</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
        </select>
      </div>

      {/* Analyze Button */}
      <button
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        onClick={handleAnalyze}
        disabled={!jobDescription}
      >
        Analyze Resume Match
      </button>

      {/* Results Section */}
      {analysis && (
        <div className="mt-8">
          {/* Match Score */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Match Score</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
              <span className="ml-3 font-medium">{analysis.score}%</span>
            </div>
          </div>

          {/* Matching Keywords */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Matching Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.matches.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missing.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Improvement Suggestions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">
                  {suggestion.suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ATS Analysis Section - always visible with heading */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">ATS Compatibility Analysis</h3>
        <ATSAnalysis
          analysisData={atsAnalysis}
          loading={atsLoading}
          error={atsError}
        />
        {!atsAnalysis && !atsLoading && !atsError && (
          <div className="text-gray-500 text-sm mt-2">Run an analysis to see ATS compatibility results here.</div>
        )}
      </div>

      {/* Industry Match */}
      {industryMatch && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Industry-Specific Analysis</h3>
          
          {/* Present Keywords */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Present Industry Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {industryMatch.presentKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Missing Industry Keywords:</h4>
            <div className="flex flex-wrap gap-2">
              {industryMatch.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Industry Suggestions */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">Industry-Specific Suggestions:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {industryMatch.suggestions.map((suggestion, index) => (
                <li key={index} className="text-blue-800">
                  {suggestion.suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatch; 