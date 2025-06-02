import React, { useState } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { matchResume, improveAchievement, enhanceDescription, suggestSkills } from '../lib/ai/AIService';

const AISuggestions = ({ resumeData }) => {
  const { currentProfile } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
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
      <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded ${
            activeTab === 'content'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Content Improvement
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'content' && (
          <div>
            <p className="text-gray-600 mb-4">
              Get AI-powered suggestions to improve your resume content.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                // TODO: Implement AI suggestions
                alert('AI suggestions coming soon!');
              }}
            >
              Get Suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISuggestions; 