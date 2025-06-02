import { useEffect, useState } from 'react'
import AISuggest from './AISuggest'

const Summary = ({ data = {}, context = {}, onChange }) => {
  const [localSummary, setLocalSummary] = useState('');

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
    let selectedSummary = '';
    
    // Handle different suggestion formats
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
    }
  };

  const validateSummary = (value) => {
    const newErrors = {};
    if (value && value.length < 50) {
      newErrors.summary = 'Summary should be at least 50 characters';
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Professional Summary</h2>
        <p className="text-sm text-gray-500 mt-1">Write a compelling summary of your professional background</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Summary
          </label>
          <AISuggest
            type="summary"
            data={data}
            context={context}
            onSuggestionSelect={handleSummarySuggestion}
          />
        </div>
        <div className="space-y-2">
          <textarea
            value={localSummary}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full p-3 border rounded-lg min-h-[200px] ${errors.summary ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Write a brief summary of your professional background, key strengths, and career objectives..."
          />
          {errors.summary && (
            <p className="text-sm text-red-600">{errors.summary}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary; 