import { useState, useEffect } from 'react';

const ATSChecker = ({ resumeData }) => {
  const [atsScore, setAtsScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [detailedResults, setDetailedResults] = useState([]);

  const checkATSCompatibility = () => {
    // Enhanced ATS checks
    const checks = [
      {
        test: () => resumeData.personal?.email?.includes('@'),
        message: 'Valid email format',
        suggestion: 'Add a valid email address',
        category: 'Contact',
        weight: 10
      },
      {
        test: () => resumeData.personal?.phone?.match(/^[\d\s\-\(\)]+$/),
        message: 'Valid phone format',
        suggestion: 'Add a properly formatted phone number',
        category: 'Contact',
        weight: 10
      },
      {
        test: () => resumeData.skills?.length >= 5,
        message: 'Sufficient skills listed',
        suggestion: 'Add at least 5 relevant skills',
        category: 'Skills',
        weight: 15
      },
      {
        test: () => resumeData.experience?.some(exp => exp.description?.length > 50),
        message: 'Detailed experience descriptions',
        suggestion: 'Provide more detailed descriptions of your work experience',
        category: 'Experience',
        weight: 25
      },
      {
        test: () => !resumeData.personal?.summary?.includes('objective'),
        message: 'Modern summary format',
        suggestion: 'Replace objective statement with a professional summary',
        category: 'Summary',
        weight: 10
      },
      {
        test: () => resumeData.education?.length > 0,
        message: 'Education section included',
        suggestion: 'Add your educational background',
        category: 'Education',
        weight: 15
      },
      {
        test: () => !resumeData.personal?.summary?.includes('responsible for'),
        message: 'Active voice in summary',
        suggestion: 'Use active voice instead of passive phrases like "responsible for"',
        category: 'Language',
        weight: 15
      },
      {
        test: () => resumeData.experience?.every(exp => exp.startDate && exp.endDate),
        message: 'Complete date information',
        suggestion: 'Add start and end dates for all experiences',
        category: 'Formatting',
        weight: 10
      },
      {
        test: () => resumeData.skills?.every(skill => skill.length < 30),
        message: 'Concise skill descriptions',
        suggestion: 'Keep skill descriptions brief and focused',
        category: 'Skills',
        weight: 10
      },
      {
        test: () => resumeData.experience?.every(exp => exp.company && exp.position),
        message: 'Complete job information',
        suggestion: 'Include both company name and position for all experiences',
        category: 'Experience',
        weight: 15
      }
    ];

    const results = checks.map(check => ({
      ...check,
      passed: check.test()
    }));

    const score = Math.round(
      (results.reduce((acc, result) => acc + (result.passed ? result.weight : 0), 0) /
        results.reduce((acc, result) => acc + result.weight, 0)) *
      100
    );

    const failedChecks = results.filter(result => !result.passed);
    
    setAtsScore(score);
    setSuggestions(failedChecks.map(check => check.suggestion));
    setDetailedResults(results);
  };

  // Run check automatically when resumeData changes
  useEffect(() => {
    checkATSCompatibility();
  }, [resumeData]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">ATS Compatibility Check</h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={atsScore >= 75 ? '#10B981' : atsScore >= 50 ? '#F59E0B' : '#EF4444'}
                strokeWidth="3"
                strokeDasharray={`${atsScore}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{atsScore}%</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold">ATS Compatibility Score</div>
            <div className="text-sm text-gray-600">
              {atsScore >= 75
                ? 'Excellent! Your resume is highly ATS-friendly.'
                : atsScore >= 50
                ? 'Good, but there\'s room for improvement.'
                : 'Needs improvement to pass ATS systems.'}
            </div>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Suggestions for Improvement:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Detailed Analysis:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {detailedResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                result.passed ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    result.passed ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">{result.category}</span>
              </div>
              <p className="text-sm mt-1">{result.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker; 