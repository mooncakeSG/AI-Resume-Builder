import { useEffect, useState } from 'react'
import AISuggest from './AISuggest'

const Summary = ({ data = {}, context = {}, onChange }) => {
  const [localSummary, setLocalSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const getInitialSummary = (summaryData) => {
    if (!summaryData) return '';
    if (typeof summaryData === 'string') return summaryData;
    if (Array.isArray(summaryData)) {
      // Handle array of suggestions
      return summaryData[0]?.text || summaryData[0] || '';
    }
    if (typeof summaryData === 'object') {
      // Handle object format
      if (summaryData.text) return summaryData.text;
      if (summaryData.summary) return summaryData.summary;
      // If it's a raw suggestion object
      if (summaryData.toString() === '[object Object]') return '';
      return String(summaryData);
    }
    return String(summaryData);
  }

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const initialSummary = getInitialSummary(data.summary);
    setLocalSummary(initialSummary);
    validateSummary(initialSummary);
  }, [data.summary]);

  const handleChange = (value) => {
    setLocalSummary(value);
    validateSummary(value);
    onChange?.({ summary: value });
  };

  const handleSummarySuggestion = (suggestions) => {
    setIsLoading(true);
    let selectedSummary = '';
    
    try {
      if (Array.isArray(suggestions)) {
        selectedSummary = suggestions[0]?.text || suggestions[0] || '';
      } else if (typeof suggestions === 'object') {
        selectedSummary = suggestions.text || suggestions.summary || '';
      } else if (typeof suggestions === 'string') {
        selectedSummary = suggestions;
      }

      if (selectedSummary) {
        setLocalSummary(selectedSummary);
        validateSummary(selectedSummary);
        onChange?.({ summary: selectedSummary });
        
        // Provide feedback on the generated summary
        analyzeSummaryQuality(selectedSummary);
      }
    } catch (error) {
      console.error('Error handling summary suggestion:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to process the AI suggestion. Please try again or write your summary manually.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSummaryQuality = (summary) => {
    const feedback = {
      type: 'info',
      message: 'Summary quality analysis:',
      points: []
    };

    // Length check
    if (summary.length < 100) {
      feedback.points.push('Consider making your summary longer (aim for 100-200 characters)');
    } else if (summary.length > 300) {
      feedback.points.push('Consider making your summary more concise (aim for 100-200 characters)');
    }

    // Quantifiable achievements
    const hasNumbers = /\d+/.test(summary);
    if (!hasNumbers) {
      feedback.points.push('Add specific numbers or metrics to make achievements more impactful');
    }

    // Industry keywords
    const industryTerms = context.industry?.split(/[,\s]+/) || [];
    const hasIndustryKeywords = industryTerms.some(term => 
      summary.toLowerCase().includes(term.toLowerCase())
    );
    if (!hasIndustryKeywords && context.industry) {
      feedback.points.push('Include relevant industry keywords to improve ATS compatibility');
    }

    // Action verbs
    const actionVerbs = /(developed|implemented|managed|led|created|improved|increased|decreased|achieved|delivered)/i;
    if (!actionVerbs.test(summary)) {
      feedback.points.push('Use more action verbs to demonstrate impact');
    }

    setFeedback(feedback);
  };

  const validateSummary = (value) => {
    const newErrors = {};
    if (value && value.length < 50) {
      newErrors.summary = 'Summary should be at least 50 characters';
    }
    if (value && value.length > 500) {
      newErrors.summary = 'Summary should not exceed 500 characters';
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
        <p className="text-sm text-gray-500 mt-1">
          Write a compelling summary of your professional background and achievements
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {localSummary.length}/500 characters
            </p>
          </div>
          <AISuggest
            type="summary"
            data={data}
            context={context}
            onSuggestionSelect={handleSummarySuggestion}
            isLoading={isLoading}
          />
        </div>
        
        <div className="space-y-4">
          <textarea
            value={localSummary}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full p-3 border rounded-lg min-h-[200px] ${
              errors.summary ? 'border-red-500' : 'border-gray-200'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
            placeholder="Write a brief summary of your professional background, key strengths, and career objectives..."
          />
          
          {errors.summary && (
            <p className="text-sm text-red-600">{errors.summary}</p>
          )}

          {feedback && (
            <div className={`mt-4 p-4 rounded-lg ${
              feedback.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <p className="font-medium text-sm mb-2">{feedback.message}</p>
              {feedback.points && feedback.points.length > 0 && (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {feedback.points.map((point, index) => (
                    <li key={index} className="text-gray-700">{point}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-2">
            <h3 className="font-medium">Tips for a great summary:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep it concise (100-200 characters)</li>
              <li>Include quantifiable achievements</li>
              <li>Use industry-relevant keywords</li>
              <li>Focus on your most impressive accomplishments</li>
              <li>Tailor it to your target position</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary; 