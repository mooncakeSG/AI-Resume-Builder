import React, { useState } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { matchResume, improveAchievement, enhanceDescription, suggestSkills } from '../lib/ai/AIService';

export default function AISuggestions() {
  const { currentProfile } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('match'); // 'match' or 'improve'
  const [improving, setImproving] = useState({
    type: null, // 'achievement', 'description', or 'skills'
    text: '',
    isLoading: false,
    result: null,
  });

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await matchResume(currentProfile.data, jobDescription);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImprove = async (type, text) => {
    if (!text.trim()) return;

    setImproving(prev => ({ ...prev, type, text, isLoading: true, result: null }));
    try {
      let result;
      switch (type) {
        case 'achievement':
          result = await improveAchievement(text);
          break;
        case 'description':
          result = await enhanceDescription(text);
          break;
        case 'skills':
          result = await suggestSkills(text);
          break;
        default:
          throw new Error('Invalid improvement type');
      }
      setImproving(prev => ({ ...prev, isLoading: false, result }));
    } catch (error) {
      console.error('Failed to get improvement:', error);
      setImproving(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'match'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Job Match
          </button>
          <button
            onClick={() => setActiveTab('improve')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'improve'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Content Improvement
          </button>
        </div>
      </div>

      {activeTab === 'match' ? (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Match'}
          </button>

          {analysis && (
            <div className="mt-6 space-y-6">
              {/* Match Scores */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Match Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.matches).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 capitalize">
                        {key}
                      </div>
                      <div className="mt-1 flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {Math.round(value)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Suggestions</h3>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 capitalize mb-2">
                        {suggestion.type}
                      </div>
                      <div className="text-sm text-gray-700 mb-2">
                        {suggestion.message}
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {suggestion.items.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content to Improve
            </label>
            <textarea
              value={improving.text}
              onChange={(e) => setImproving(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter text to improve..."
              className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => handleImprove('achievement', improving.text)}
              disabled={improving.isLoading || !improving.text.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Improve Achievement
            </button>
            <button
              onClick={() => handleImprove('description', improving.text)}
              disabled={improving.isLoading || !improving.text.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enhance Description
            </button>
            <button
              onClick={() => handleImprove('skills', improving.text)}
              disabled={improving.isLoading || !improving.text.trim()}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suggest Skills
            </button>
          </div>

          {improving.isLoading && (
            <div className="text-center text-sm text-gray-600">
              Generating improvements...
            </div>
          )}

          {improving.result && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Improved Version</h3>
              {Array.isArray(improving.result) ? (
                <ul className="list-disc list-inside space-y-1">
                  {improving.result.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{improving.result}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 