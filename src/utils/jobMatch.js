import natural from 'natural';
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// Common words to exclude from analysis
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'were', 'will', 'with'
]);

// Industry-specific keywords
const INDUSTRY_KEYWORDS = {
  'software': ['javascript', 'python', 'react', 'node', 'api', 'aws', 'cloud', 'agile'],
  'marketing': ['seo', 'social media', 'analytics', 'content', 'campaign', 'brand'],
  'finance': ['accounting', 'financial analysis', 'budget', 'forecasting', 'risk'],
  'healthcare': ['patient care', 'clinical', 'medical', 'healthcare', 'treatment'],
  // Add more industries as needed
};

export const analyzeJobMatch = (resumeText, jobDescription) => {
  const tfidf = new TfIdf();
  
  // Add documents to TF-IDF
  tfidf.addDocument(jobDescription);
  tfidf.addDocument(resumeText);

  // Extract important terms from job description
  const jobTerms = new Set();
  tfidf.listTerms(0).forEach(item => {
    if (!STOP_WORDS.has(item.term) && item.tfidf > 0.5) {
      jobTerms.add(item.term);
    }
  });

  // Find matching and missing keywords
  const resumeTokens = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
  const matches = new Set([...jobTerms].filter(term => resumeTokens.has(term)));
  const missing = new Set([...jobTerms].filter(term => !resumeTokens.has(term)));

  // Calculate match score (0-100)
  const matchScore = (matches.size / jobTerms.size) * 100;

  return {
    score: Math.round(matchScore),
    matches: Array.from(matches),
    missing: Array.from(missing),
    suggestions: generateSuggestions(Array.from(missing))
  };
};

export const getIndustryKeywords = (industry) => {
  return INDUSTRY_KEYWORDS[industry.toLowerCase()] || [];
};

export const optimizeForIndustry = (resumeText, industry) => {
  const industryKeywords = getIndustryKeywords(industry);
  const resumeTokens = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
  
  const missing = industryKeywords.filter(keyword => 
    !resumeText.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    presentKeywords: industryKeywords.filter(keyword => 
      resumeText.toLowerCase().includes(keyword.toLowerCase())
    ),
    missingKeywords: missing,
    suggestions: generateIndustrySuggestions(missing, industry)
  };
};

const generateSuggestions = (missingKeywords) => {
  return missingKeywords.map(keyword => ({
    keyword,
    suggestion: `Consider adding experience or skills related to "${keyword}"`
  }));
};

const generateIndustrySuggestions = (missingKeywords, industry) => {
  return missingKeywords.map(keyword => ({
    keyword,
    suggestion: `Add experience with ${keyword} to align better with ${industry} roles`
  }));
};

// ATS Compatibility Check
export const checkATSCompatibility = (resumeText) => {
  const issues = [];
  
  // Check for common ATS issues
  if (resumeText.includes('|')) {
    issues.push('Avoid using vertical bars (|) as they may not parse correctly in ATS systems');
  }
  
  if (resumeText.includes('•')) {
    issues.push('Consider using standard bullet points (-) instead of special characters');
  }
  
  // Check for section headers
  const commonHeaders = ['experience', 'education', 'skills', 'summary'];
  const foundHeaders = commonHeaders.filter(header => 
    resumeText.toLowerCase().includes(header)
  );
  
  if (foundHeaders.length < commonHeaders.length) {
    issues.push('Include all standard section headers: Experience, Education, Skills, and Summary');
  }
  
  return {
    score: Math.max(0, 100 - (issues.length * 15)), // Deduct 15 points per issue
    issues,
    suggestions: issues.map(issue => ({
      issue,
      fix: `Fix: ${issue}`
    }))
  };
}; 