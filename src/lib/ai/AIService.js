import { Groq } from 'groq-sdk';

// Initialize Groq client with proper error handling
let groq = null;

try {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ API key not found. Please add VITE_GROQ_API_KEY to your .env file.');
  } else {
    groq = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true // Enable browser usage
    });
  }
} catch (error) {
  console.error('Error initializing Groq client:', error);
}

// AI prompts for different suggestion types
const PROMPTS = {
  ACHIEVEMENT: `Improve this achievement statement to be more impactful and quantifiable. Focus on results and specific metrics. Format: Original -> Improved`,
  
  EDUCATION_ACHIEVEMENT: `Generate specific academic achievements based on this education information. Return ONLY a JSON object with the following structure, with no additional text or explanation:
{
  "achievements": [
    "achievement1",
    "achievement2",
    "achievement3",
    "achievement4"
  ]
}`,

  EDUCATION_DESCRIPTION: `Improve the education description to highlight academic achievements and relevant coursework. Consider the degree, field of study, and institution. Return ONLY the improved description text, with no additional formatting or explanation.`,

  EXPERIENCE_ACHIEVEMENT: `Generate specific professional achievements based on this job experience. Return ONLY a JSON object with the following structure, with no additional text or explanation:
{
  "achievements": [
    "achievement1",
    "achievement2",
    "achievement3",
    "achievement4"
  ]
}`,

  EXPERIENCE_DESCRIPTION: `Improve the job description to highlight responsibilities and impact. Consider the position, company, and industry. Return ONLY the improved description text, with no additional formatting or explanation.`,

  DESCRIPTION: `Enhance this job description to highlight key responsibilities and accomplishments. Make it more professional and action-oriented. Format: Original -> Improved`,
  
  SKILLS: `Suggest relevant skills based on the position and industry. Return a JSON object with the following structure:
{
  "skills": [
    "Skill 1",
    "Skill 2",
    "Skill 3"
  ]
}`,
  
  JOB_ANALYSIS: `Analyze this job description and extract key information. Return ONLY a JSON object with the following structure, with no additional text or explanation:
{
  "requirements": ["requirement1", "requirement2"],
  "requiredSkills": ["skill1", "skill2"],
  "preferredQualifications": ["qualification1", "qualification2"],
  "suggestedAchievements": ["achievement1", "achievement2"]
}`,

  ATS_CHECK: `Analyze this resume content for ATS (Applicant Tracking System) compatibility. Return ONLY a JSON object with the following structure, with no additional text or explanation:
{
  "score": 85,
  "sectionScores": {
    "summary": 90,
    "skills": 80,
    "experience": 70,
    "education": 85
  },
  "issues": [
    {
      "section": "format",
      "problems": ["issue1", "issue2"]
    },
    {
      "section": "content",
      "problems": ["issue1", "issue2"]
    }
  ],
  "recommendations": [
    "recommendation1",
    "recommendation2"
  ],
  "keywords": {
    "present": [{ "word": "JavaScript", "count": 3 }],
    "missing": ["React", "Node.js"]
  },
  "formattingWarnings": ["Avoid using tables", "No images or graphics"]
}`,

  KEYWORD_OPTIMIZATION: `Analyze this job description and resume content to suggest keyword optimizations. Return ONLY a JSON object with the following structure, with no additional text or explanation:
{
  "industryKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "suggestedPhrases": [
    {
      "original": "current phrase",
      "optimized": "suggested phrase with keywords"
    }
  ]
}`,

  SUMMARY: `Create a compelling professional summary based on the provided information. Use all available information to create a tailored, specific summary.

Guidelines:
1. Career Field Focus:
   - Highlight skills and experiences relevant to the specified career field
   - Use industry-specific terminology
   - Align achievements with industry standards

2. Experience Level:
   - For 0-2 years: Focus on education, skills, and potential
   - For 3-5 years: Emphasize rapid growth and key achievements
   - For 5+ years: Highlight leadership and strategic impact

3. Content Integration:
   - Include relevant skills from the skills list
   - Reference significant education achievements
   - Mention notable work experiences
   - Incorporate location if relevant to the role

4. Style:
   - Keep it 2-4 sentences
   - Be specific and quantifiable
   - Focus on value and impact
   - Maintain professional tone
   - Avoid generic statements

Input context includes:
- careerType: Specific career field
- experience: Array of work experiences
- education: Array of education entries
- skills: Array of skills
- location: Geographic location
- firstName/lastName: Name information
- professionalLinks: Professional online presence

Return ONLY the generated summary text, with no additional formatting or explanation.`,

  LINKS: `Generate professional links based on the provided information. Return a JSON object with the following structure:
{
  "links": {
    "linkedin": "https://www.linkedin.com/in/yourname",
    "github": "https://github.com/yourusername",
    "portfolio": "https://yourusername.github.io",
    "company": "https://www.yourcompany.com"
  }
}`,

  COVER_LETTER: `Generate a professional cover letter based on the provided resume and job details. Follow these guidelines:

1. Structure:
   - Professional greeting using the hiring manager's name if provided
   - Opening paragraph introducing yourself and stating the position
   - 2-3 body paragraphs highlighting relevant experience and skills
   - Closing paragraph expressing interest and call to action
   - Professional closing

2. Content Integration:
   - Match resume experience with job requirements
   - Highlight relevant achievements and skills
   - Reference company name and position throughout
   - Demonstrate knowledge of the company/role

3. Style:
   - Professional and enthusiastic tone
   - Specific examples and metrics
   - Clear value proposition
   - Concise and impactful language
   - No generic templates

4. Customization:
   - Address specific job requirements
   - Connect past experience to future role
   - Show understanding of company needs
   - Explain why you're the ideal candidate

Return ONLY the complete cover letter text, properly formatted with paragraphs separated by newlines.`,
};

const FALLBACK_SUGGESTIONS = {
  summary: [
    {
      text: "Experienced professional with a proven track record of delivering results. Strong analytical and problem-solving skills combined with excellent communication abilities.",
      focus: "General"
    },
    {
      text: "Results-driven professional who has consistently exceeded targets and implemented innovative solutions. Track record of leading successful projects and driving organizational growth.",
      focus: "Achievements"
    },
    {
      text: "Skilled professional with expertise in project management, team leadership, and strategic planning. Proven ability to optimize processes and deliver high-quality results.",
      focus: "Skills"
    }
  ],
  education: [
    "Maintained 3.8 GPA throughout academic career",
    "Completed senior thesis project on emerging technologies",
    "Participated in student leadership program"
  ],
  experience: [
    "Increased team productivity by 25% through process improvements",
    "Successfully delivered 3 major projects ahead of schedule",
    "Mentored 2 junior team members"
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Project Management",
    "Team Leadership"
  ]
};

// Function to make API calls to Groq
async function callGroq(prompt, input) {
  if (!groq) {
    throw new Error('Groq client not initialized. Please check your API key configuration.');
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in improving resumes and analyzing job descriptions. 
                   Return ONLY the exact format requested, with no additional text, explanations, or markdown formatting.
                   For JSON responses, ensure they are valid JSON with no trailing commas.
                   For text responses, return only the text with no quotes or formatting.`
        },
        {
          role: 'user',
          content: `${prompt}\n\nInput: ${input}`
        }
      ],
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

// Helper function to safely parse JSON
function safeJSONParse(str) {
  try {
    // Remove any potential markdown code block syntax and explanatory text
    const cleanStr = str.replace(/```json\n?|\n?```/g, '') // Remove markdown
                       .replace(/^[^{]*({.*})[^}]*$/s, '$1') // Extract JSON object
                       .trim();
    
    // Log the cleaned string for debugging
    console.debug('Cleaned JSON string:', cleanStr);
    
    return JSON.parse(cleanStr);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Attempted to parse:', str);
    return null;
  }
}

// Education-specific functions
export async function improveEducationDescription(education) {
  try {
    const context = {
      degree: education.degree || '',
      school: education.school || '',
      field: education.field || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      description: education.description || ''
    };

    const response = await callGroq(PROMPTS.EDUCATION_DESCRIPTION, JSON.stringify(context));
    return response || education.description || '';
  } catch (error) {
    console.error('Error improving education description:', error);
    return education.description || '';
  }
}

export async function generateEducationAchievements(education) {
  try {
    const context = {
      degree: education.degree || '',
      school: education.school || '',
      field: education.field || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      description: education.description || ''
    };

    const response = await callGroq(PROMPTS.EDUCATION_ACHIEVEMENT, JSON.stringify(context));
    const parsed = safeJSONParse(response);
    
    if (!parsed?.achievements) {
      console.error('Invalid achievements format:', response);
      return FALLBACK_SUGGESTIONS.education;
    }
    
    return parsed.achievements;
  } catch (error) {
    console.error('Error generating education achievements:', error);
    return FALLBACK_SUGGESTIONS.education;
  }
}

// Experience-specific functions
export async function improveExperienceDescription(experience) {
  try {
    const context = {
      position: experience.position || '',
      company: experience.company || '',
      industry: experience.industry || '',
      startDate: experience.startDate || '',
      endDate: experience.current ? 'Present' : (experience.endDate || ''),
      location: experience.location || '',
      description: experience.description || ''
    };

    const response = await callGroq(PROMPTS.EXPERIENCE_DESCRIPTION, JSON.stringify(context));
    return response || experience.description || '';
  } catch (error) {
    console.error('Error improving experience description:', error);
    return experience.description || '';
  }
}

export async function generateExperienceAchievements(experience) {
  try {
    const context = {
      position: experience.position || '',
      company: experience.company || '',
      industry: experience.industry || '',
      startDate: experience.startDate || '',
      endDate: experience.current ? 'Present' : (experience.endDate || ''),
      location: experience.location || '',
      description: experience.description || ''
    };

    const response = await callGroq(PROMPTS.EXPERIENCE_ACHIEVEMENT, JSON.stringify(context));
    const parsed = safeJSONParse(response);
    
    if (!parsed?.achievements) {
      console.error('Invalid achievements format:', response);
      return FALLBACK_SUGGESTIONS.experience;
    }
    
    return parsed.achievements;
  } catch (error) {
    console.error('Error generating experience achievements:', error);
    return FALLBACK_SUGGESTIONS.experience;
  }
}

// Original functions
export async function improveAchievement(achievement) {
  const response = await callGroq(PROMPTS.ACHIEVEMENT, achievement);
  const [_, improved] = response.split('->').map(s => s.trim());
  return improved;
}

export async function enhanceDescription(description) {
  const response = await callGroq(PROMPTS.DESCRIPTION, description);
  const [_, improved] = response.split('->').map(s => s.trim());
  return improved;
}

export async function suggestSkills(jobInfo) {
  try {
    const context = `Position: ${jobInfo.position || 'Not specified'}
Industry: ${jobInfo.industry || 'Not specified'}
Experience Level: ${jobInfo.level || 'Not specified'}
Description: ${jobInfo.description || 'Not specified'}`;

    const response = await callGroq(PROMPTS.SKILLS, context);
    const parsed = safeJSONParse(response);
    
    if (!parsed?.skills) {
      console.error('Invalid skills format:', response);
      return [];
    }
    
    return parsed.skills;
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return [];
  }
}

export async function analyzeJobDescription(description) {
  try {
    const response = await callGroq(PROMPTS.JOB_ANALYSIS, description);
    const parsedResponse = safeJSONParse(response);
    
    if (!parsedResponse) {
    console.error('Failed to parse job analysis response');
      return {
        requirements: [],
        requiredSkills: [],
        preferredQualifications: [],
        suggestedAchievements: [],
      };
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error in job analysis:', error);
    return {
      requirements: [],
      requiredSkills: [],
      preferredQualifications: [],
      suggestedAchievements: [],
    };
  }
}

// Match resume against job description
export async function matchResume(resumeData, jobDescription) {
  try {
    if (!jobDescription?.trim()) {
      console.warn('Empty job description provided');
      return {
        matches: {
          skills: 0,
          experience: 0,
          education: 0,
          overall: 0
        },
        suggestions: []
      };
    }

  const analysis = await analyzeJobDescription(jobDescription);
  
    if (!analysis || (!analysis.requirements?.length && !analysis.requiredSkills?.length)) {
      console.warn('Invalid or empty job analysis results');
      return {
        matches: {
          skills: 0,
          experience: 0,
          education: 0,
          overall: 0
        },
        suggestions: []
      };
    }

    // Calculate match scores for different sections with weights
    const weights = {
      skills: 0.4,      // 40% weight for skills
      experience: 0.4,  // 40% weight for experience
      education: 0.2    // 20% weight for education
    };

  const matches = {
    skills: calculateSkillsMatch(resumeData.skills, analysis.requiredSkills),
    experience: calculateExperienceMatch(resumeData.experience, analysis.requirements),
    education: calculateEducationMatch(resumeData.education, analysis.preferredQualifications),
      overall: 0
    };

    // Calculate weighted overall match score
    matches.overall = (
      matches.skills * weights.skills +
      matches.experience * weights.experience +
      matches.education * weights.education
    );

    // Round all scores to 2 decimal places
    Object.keys(matches).forEach(key => {
      matches[key] = Math.round(matches[key] * 100) / 100;
    });

  return {
    matches,
      suggestions: generateSuggestions(resumeData, analysis)
    };
  } catch (error) {
    console.error('Error in matchResume:', error);
    return {
      matches: {
        skills: 0,
        experience: 0,
        education: 0,
        overall: 0
      },
      suggestions: []
    };
  }
}

// Helper function to calculate skills match
function calculateSkillsMatch(userSkills, requiredSkills) {
  if (!userSkills?.length || !requiredSkills?.length) return 0;
  
  const userSkillsLower = userSkills.map(s => s.toLowerCase().trim());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase().trim());
  
  let totalScore = 0;
  let matchCount = 0;

  for (const requiredSkill of requiredSkillsLower) {
    const bestMatch = userSkillsLower.reduce((best, userSkill) => {
      const similarity = calculateSimilarity(requiredSkill, userSkill);
      return similarity > best ? similarity : best;
    }, 0);

    if (bestMatch > 0.5) { // Consider it a match if similarity is over 50%
      totalScore += bestMatch;
      matchCount++;
    }
  }

  return matchCount > 0 ? (totalScore / requiredSkillsLower.length) * 100 : 0;
}

// Helper function to calculate experience match
function calculateExperienceMatch(userExperience, requirements) {
  if (!userExperience?.length || !requirements?.length) return 0;
  
  const experienceText = userExperience
    .map(exp => `${exp.position || ''} ${exp.description || ''} ${exp.achievements?.join(' ') || ''}`)
    .join(' ')
    .toLowerCase();
  
  let totalScore = 0;

  for (const req of requirements) {
    const reqLower = req.toLowerCase().trim();
    const words = reqLower.split(/\s+/);
    
    // Calculate how many words from the requirement appear in the experience
    const matchedWords = words.filter(word => 
      word.length > 3 && experienceText.includes(word)
    ).length;
    
    const score = matchedWords / words.length;
    totalScore += score;
  }

  return (totalScore / requirements.length) * 100;
}

// Helper function to calculate education match
function calculateEducationMatch(userEducation, qualifications) {
  if (!userEducation?.length || !qualifications?.length) return 0;
  
  const educationText = userEducation
    .map(edu => `${edu.degree || ''} ${edu.school || ''} ${edu.field || ''} ${edu.description || ''} ${edu.achievements?.join(' ') || ''}`)
    .join(' ')
    .toLowerCase();
  
  let totalScore = 0;

  for (const qual of qualifications) {
    const qualLower = qual.toLowerCase().trim();
    const words = qualLower.split(/\s+/);
    
    // Calculate how many words from the qualification appear in the education
    const matchedWords = words.filter(word => 
      word.length > 3 && educationText.includes(word)
    ).length;
    
    const score = matchedWords / words.length;
    totalScore += score;
  }

  return (totalScore / qualifications.length) * 100;
}

// Helper function to calculate text similarity
function calculateSimilarity(str1, str2) {
  const set1 = new Set(str1.split(/\s+/));
  const set2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

// Helper function to generate improvement suggestions
function generateSuggestions(resumeData, analysis) {
  const suggestions = [];

  // Check for missing required skills
  const userSkillsLower = resumeData.skills?.map(s => s.toLowerCase()) || [];
  const missingSkills = analysis.requiredSkills.filter(skill => 
    !userSkillsLower.some(userSkill => userSkill.includes(skill.toLowerCase()))
  );
  
  if (missingSkills.length > 0) {
    suggestions.push({
      type: 'skills',
      message: 'Consider adding these relevant skills:',
      items: missingSkills,
    });
  }

  // Check for missing key requirements in experience
  const experienceText = resumeData.experience
    ?.map(exp => `${exp.position} ${exp.description} ${exp.achievements?.join(' ')}`)
    .join(' ')
    .toLowerCase() || '';
  
  const missingRequirements = analysis.requirements.filter(req =>
    !experienceText.includes(req.toLowerCase())
  );
  
  if (missingRequirements.length > 0) {
    suggestions.push({
      type: 'experience',
      message: 'Try to highlight these aspects in your experience:',
      items: missingRequirements,
    });
  }

  // Suggest achievements based on job requirements
  if (analysis.suggestedAchievements?.length > 0) {
    suggestions.push({
      type: 'achievements',
      message: 'Consider adding achievements like:',
      items: analysis.suggestedAchievements,
    });
  }

  return suggestions;
}

// ATS compatibility checking
export async function checkATSCompatibility(resumeData, jobDescription = '') {
  try {
    // Prepare resume content for analysis
    const resumeContent = {
      summary: resumeData.summary || '',
      skills: resumeData.skills || [],
      experience: (resumeData.experience || []).map(exp => ({
        title: exp.position,
        company: exp.company,
        description: exp.description,
        achievements: exp.achievements
      })),
      education: (resumeData.education || []).map(edu => ({
        degree: edu.degree,
        school: edu.school,
        field: edu.field,
        description: edu.description,
        achievements: edu.achievements
      }))
    };

    // Get ATS analysis
    const response = await callGroq(PROMPTS.ATS_CHECK, JSON.stringify(resumeContent));
    const atsAnalysis = safeJSONParse(response);

    if (!atsAnalysis) {
      throw new Error('Failed to analyze ATS compatibility');
    }

    // If job description is provided, get keyword optimization suggestions
    let keywordOptimization = null;
    if (jobDescription) {
      const optimizationResponse = await callGroq(
        PROMPTS.KEYWORD_OPTIMIZATION,
        JSON.stringify({ resume: resumeContent, jobDescription })
      );
      keywordOptimization = safeJSONParse(optimizationResponse);
    }

    return {
      ...atsAnalysis,
      keywordOptimization: keywordOptimization || null,
      overallScore: atsAnalysis.score,
      formattingScore: calculateFormattingScore(resumeData),
      contentScore: calculateContentScore(resumeData)
    };
  } catch (error) {
    console.error('Error checking ATS compatibility:', error);
    return {
      score: 0,
      issues: [],
      recommendations: [
        'Error analyzing ATS compatibility. Please try again.',
        'Ensure all sections are properly filled out.'
      ],
      keywords: {
        present: [],
        missing: []
      }
    };
  }
}

// Helper function to calculate formatting score
function calculateFormattingScore(resumeData) {
  let score = 100;
  const issues = [];

  // Check for proper section structure
  if (!resumeData.summary) {
    score -= 10;
    issues.push('Missing professional summary section');
  }

  // Check skills format
  if (!Array.isArray(resumeData.skills) || resumeData.skills.length === 0) {
    score -= 10;
    issues.push('Skills should be listed as bullet points');
  }

  // Check experience entries
  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach(exp => {
      if (!exp.position || !exp.company || !exp.description) {
        score -= 5;
        issues.push('Experience entries should have position, company, and description');
      }
      if (!exp.startDate || (!exp.endDate && !exp.current)) {
        score -= 5;
        issues.push('Experience entries should have complete dates');
      }
    });
  }

  // Check education entries
  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach(edu => {
      if (!edu.degree || !edu.school) {
        score -= 5;
        issues.push('Education entries should have degree and school name');
      }
    });
  }

  return {
    score: Math.max(0, score),
    issues
  };
}

// Helper function to calculate content score
function calculateContentScore(resumeData) {
  let score = 100;
  const issues = [];

  // Check for action verbs in experience
  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach(exp => {
      if (exp.description) {
        const hasActionVerbs = /\b(developed|implemented|managed|led|created|improved|increased|decreased|achieved|delivered)\b/i.test(exp.description);
        if (!hasActionVerbs) {
          score -= 5;
          issues.push('Use more action verbs in experience descriptions');
        }
      }
      
      // Check for measurable achievements
      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach(achievement => {
          const hasMeasurableResults = /\b(\d+%|\d+x|\$\d+|\d+ times|\d+ team members|\d+ projects)\b/i.test(achievement);
          if (!hasMeasurableResults) {
            score -= 2;
            issues.push('Include more measurable results in achievements');
          }
        });
      }
    });
  }

  // Check for technical skills if relevant
  if (Array.isArray(resumeData.skills)) {
    const technicalSkillsCount = resumeData.skills.filter(skill => 
      /\b(software|programming|development|engineering|technical|technology)\b/i.test(skill)
    ).length;
    
    if (technicalSkillsCount === 0) {
      score -= 5;
      issues.push('Consider adding relevant technical skills');
    }
  }

  return {
    score: Math.max(0, score),
    issues
  };
}

// Summary suggestion function
export const suggestSummary = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data provided to suggestSummary');
  }

  try {
    // Calculate years of experience safely
    const yearsOfExperience = (data.experience || []).reduce((total, exp) => {
      if (!exp.startDate) return total;
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
      return total + (isNaN(years) ? 0 : years);
    }, 0);

    // Get relevant skills based on career type
    const relevantSkills = (data.skills || [])
      .filter(skill => {
        if (!data.careerType) return true;
        const skillLower = skill.toLowerCase();
        const careerTypeLower = data.careerType.toLowerCase();
        return skillLower.includes(careerTypeLower) || 
               careerTypeLower.includes(skillLower) ||
               isRelevantSkill(skillLower, careerTypeLower);
      })
      .slice(0, 5);

    // Get education details
    const highestEducation = data.education?.[0] || {};
    const hasEducation = Boolean(highestEducation.degree);

    // Get latest experience
    const latestExperience = data.experience?.[0] || {};
    const hasExperience = Boolean(latestExperience.position);

    // Get key achievements
    const keyAchievements = data.experience?.reduce((achievements, exp) => {
      if (exp.achievements?.length) {
        achievements.push(...exp.achievements
          .filter(ach => /\b(\d+%|\d+x|\$\d+|\d+ times|\d+ team|\d+ project|\d+ million|\d+M|\d+K)\b/i.test(ach))
          .slice(0, 2)
        );
      }
      return achievements;
    }, []) || [];

    const formattedData = {
      personal: {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        summary: data.summary || '',
        title: data.title || '',
        industry: data.industry || '',
      },
      careerType: data.careerType || '',
      yearsOfExperience: Math.round(yearsOfExperience),
      hasExperience,
      hasEducation,
      currentRole: latestExperience.position || '',
      currentCompany: latestExperience.company || '',
      education: {
        degree: highestEducation.degree || '',
        field: highestEducation.field || '',
        school: highestEducation.school || ''
      },
      location: data.location || '',
      skills: relevantSkills,
      allSkills: data.skills || [],
      keyAchievements,
      experience: (data.experience || []).map(exp => ({
        position: exp.position || '',
        company: exp.company || '',
        duration: exp.endDate ? 
          `${exp.startDate} to ${exp.endDate}` : 
          `${exp.startDate} to Present`
      })),
      professionalLinks: Object.keys(data.professionalLinks || {}).filter(k => data.professionalLinks[k])
    };

    const response = await callGroq(PROMPTS.SUMMARY, JSON.stringify(formattedData));
    
    if (!response || response.includes('undefined') || response.includes('[object Object]')) {
      console.warn('Invalid summary generated, using fallback');
      return generateFallbackSummary(formattedData);
    }

    return response.trim();
  } catch (error) {
    console.error('Error in suggestSummary:', error);
    return generateFallbackSummary(data);
  }
};

// Helper function to check skill relevance
function isRelevantSkill(skill, careerType) {
  const careerSkillMap = {
    'software development': ['programming', 'coding', 'development', 'software', 'web', 'app', 'database', 'cloud'],
    'data science': ['data', 'analytics', 'machine learning', 'statistics', 'python', 'r', 'sql'],
    'project management': ['management', 'agile', 'scrum', 'leadership', 'coordination', 'planning'],
    'marketing': ['marketing', 'social media', 'content', 'seo', 'analytics', 'advertising'],
    'design': ['design', 'ui', 'ux', 'creative', 'visual', 'graphic'],
    'sales': ['sales', 'negotiation', 'client', 'business development', 'account management'],
    'finance': ['finance', 'accounting', 'analysis', 'budget', 'financial'],
    'human resources': ['hr', 'recruitment', 'talent', 'training', 'development', 'employee'],
    'operations': ['operations', 'process', 'optimization', 'management', 'logistics'],
    'customer service': ['customer', 'service', 'support', 'client', 'communication']
  };

  const relevantKeywords = careerSkillMap[careerType.toLowerCase()] || [];
  return relevantKeywords.some(keyword => skill.includes(keyword));
}

// Update the fallback summary generation
function generateFallbackSummary(context) {
  const {
    careerType,
    yearsOfExperience,
    hasExperience,
    hasEducation,
    currentRole,
    currentCompany,
    education,
    location,
    skills,
    keyAchievements
  } = context;

  if (!hasExperience) {
    // For entry-level or no experience
    const educationPhrase = hasEducation
      ? `${education.degree}${education.field ? ` in ${education.field}` : ''} graduate`
      : 'professional';

    const skillsPhrase = skills?.length
      ? ` with expertise in ${skills.slice(0, 3).join(', ')}`
      : '';

    const careerPhrase = careerType
      ? ` seeking opportunities in ${careerType}`
      : ' seeking to leverage my skills and knowledge';

    const locationPhrase = location ? ` based in ${location}` : '';

    return `Motivated and detail-oriented ${educationPhrase}${skillsPhrase}${careerPhrase}${locationPhrase}. Bringing fresh perspective, strong analytical abilities, and a passion for delivering high-quality results. Committed to continuous learning and professional growth while making meaningful contributions to organizational success.`;
  }

  // For experienced professionals
  const experiencePhrase = yearsOfExperience
    ? `${Math.round(yearsOfExperience)}+ years of experience`
    : 'proven experience';

  const rolePhrase = currentRole 
    ? `${currentRole}${currentCompany ? ` at ${currentCompany}` : ''}`
    : careerType || 'Professional';

  const skillsPhrase = skills?.length
    ? ` specializing in ${skills.slice(0, 3).join(', ')}`
    : '';

  const educationPhrase = hasEducation
    ? ` with ${education.degree}${education.field ? ` in ${education.field}` : ''}`
    : '';

  const achievementPhrase = keyAchievements?.length
    ? ` Key achievements include ${keyAchievements[0]}${keyAchievements[1] ? ` and ${keyAchievements[1]}` : ''}.`
    : '';

  const locationPhrase = location ? ` Based in ${location}.` : '';

  return `Experienced ${rolePhrase} with ${experiencePhrase}${skillsPhrase}${educationPhrase}. Demonstrated track record of delivering impactful solutions and driving organizational success${achievementPhrase}${locationPhrase} Committed to excellence, innovation, and continuous improvement in all professional endeavors.`;
}

// Links suggestion function
export async function suggestLinks(data) {
  // Return empty object since the feature is not needed
  return {
    linkedin: '',
    github: '',
    portfolio: '',
    company: ''
  };
}

export async function generateCoverLetter(data) {
  try {
    const { jobDetails, resume } = data || {};
    
    if (!resume) {
      throw new Error('Resume data is required to generate a cover letter');
    }
    
    // Extract relevant information from resume with default values
    const {
      personal = {},
      experience = [],
      education = [],
      skills = []
    } = resume;

    // Format the input for the AI
    const input = {
      position: jobDetails?.position || '',
      company: jobDetails?.company || '',
      hiringManager: jobDetails?.hiringManager || '',
      jobDescription: jobDetails?.jobDescription || '',
      requirements: jobDetails?.requirements || '',
      candidateName: `${personal?.firstName || ''} ${personal?.lastName || ''}`.trim(),
      candidateExperience: (experience || []).map(exp => ({
        position: exp?.position || '',
        company: exp?.company || '',
        description: exp?.description || '',
        achievements: exp?.achievements || []
      })),
      candidateEducation: education || [],
      candidateSkills: skills || [],
      candidateSummary: personal?.summary || ''
    };

    // Generate the cover letter
    const coverLetter = await callGroq(PROMPTS.COVER_LETTER, JSON.stringify(input));
    return coverLetter;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
} 