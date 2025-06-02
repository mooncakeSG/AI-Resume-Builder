import { useState } from 'react';

const JobMatcher = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [keywordMatches, setKeywordMatches] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);

  const analyzeMatch = () => {
    // Common job-related keywords by category
    const keywordCategories = {
      skills: ['javascript', 'react', 'node', 'python', 'java', 'sql', 'aws', 'docker'],
      softSkills: ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical'],
      tools: ['git', 'jira', 'jenkins', 'kubernetes', 'azure', 'agile'],
      concepts: ['ci/cd', 'testing', 'architecture', 'design patterns', 'algorithms']
    };

    // Extract keywords from job description
    const jobKeywords = Object.values(keywordCategories)
      .flat()
      .filter(keyword => 
        jobDescription.toLowerCase().includes(keyword.toLowerCase())
      );

    // Check resume content for matches
    const matches = [];
    const missing = [];
    
    jobKeywords.forEach(keyword => {
      const isInResume = 
        resumeData.skills?.some(skill => 
          skill.toLowerCase().includes(keyword.toLowerCase())) ||
        resumeData.experience?.some(exp => 
          exp.description?.toLowerCase().includes(keyword.toLowerCase())) ||
        resumeData.personal?.summary?.toLowerCase().includes(keyword.toLowerCase());

      if (isInResume) {
        matches.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    // Calculate match score
    const score = jobKeywords.length > 0 
      ? Math.round((matches.length / jobKeywords.length) * 100)
      : 0;

    setMatchScore(score);
    setKeywordMatches(matches);
    setMissingKeywords(missing);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Job Description Matcher</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full h-32 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste the job description here..."
        />
      </div>

      <button
        onClick={analyzeMatch}
        disabled={!jobDescription}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze Match
      </button>

      {matchScore !== null && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl font-bold">{matchScore}%</div>
            <div className="text-gray-600">Match Score</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">Matching Keywords:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {keywordMatches.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-red-600">Missing Keywords:</h3>
              <ul className="list-disc list-inside text-gray-600">
                {missingKeywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatcher; 