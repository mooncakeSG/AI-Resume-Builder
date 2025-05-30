import { Groq } from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

// AI prompts for different suggestion types
const PROMPTS = {
  ACHIEVEMENT: `Improve this achievement statement to be more impactful and quantifiable. Focus on results and specific metrics. Format: Original -> Improved`,
  DESCRIPTION: `Enhance this job description to highlight key responsibilities and accomplishments. Make it more professional and action-oriented. Format: Original -> Improved`,
  SKILLS: `Suggest relevant skills based on this job title and description. Return as a comma-separated list.`,
  JOB_ANALYSIS: `Analyze this job description and extract: 1) Key requirements 2) Required skills 3) Preferred qualifications 4) Suggested achievements. Format as JSON.`,
};

// Function to make API calls to Groq
async function callGroq(prompt, input) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant specialized in improving resumes and analyzing job descriptions. 
                   You provide concise, professional, and actionable suggestions.
                   Format your responses according to the specific prompt type.`
        },
        {
          role: 'user',
          content: `${prompt}\n\nInput: ${input}`
        }
      ],
      model: 'claude-3-opus-20240229',  // Updated to Claude-3 model
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

// Improve achievement statements
export async function improveAchievement(achievement) {
  const response = await callGroq(PROMPTS.ACHIEVEMENT, achievement);
  const [_, improved] = response.split('->').map(s => s.trim());
  return improved;
}

// Enhance job descriptions
export async function enhanceDescription(description) {
  const response = await callGroq(PROMPTS.DESCRIPTION, description);
  const [_, improved] = response.split('->').map(s => s.trim());
  return improved;
}

// Suggest relevant skills
export async function suggestSkills(jobInfo) {
  const response = await callGroq(PROMPTS.SKILLS, jobInfo);
  return response.split(',').map(skill => skill.trim());
}

// Analyze job description
export async function analyzeJobDescription(description) {
  const response = await callGroq(PROMPTS.JOB_ANALYSIS, description);
  try {
    return JSON.parse(response);
  } catch {
    console.error('Failed to parse job analysis response');
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
  const analysis = await analyzeJobDescription(jobDescription);
  
  // Calculate match scores for different sections
  const matches = {
    skills: calculateSkillsMatch(resumeData.skills, analysis.requiredSkills),
    experience: calculateExperienceMatch(resumeData.experience, analysis.requirements),
    education: calculateEducationMatch(resumeData.education, analysis.preferredQualifications),
    overall: 0,
  };

  // Calculate overall match score
  matches.overall = (matches.skills + matches.experience + matches.education) / 3;

  return {
    matches,
    suggestions: generateSuggestions(resumeData, analysis),
  };
}

// Helper function to calculate skills match
function calculateSkillsMatch(userSkills, requiredSkills) {
  if (!userSkills?.length || !requiredSkills?.length) return 0;
  
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  
  const matches = requiredSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => userSkill.includes(skill))
  );
  
  return (matches.length / requiredSkillsLower.length) * 100;
}

// Helper function to calculate experience match
function calculateExperienceMatch(userExperience, requirements) {
  if (!userExperience?.length || !requirements?.length) return 0;
  
  const experienceText = userExperience
    .map(exp => `${exp.position} ${exp.description} ${exp.achievements?.join(' ')}`)
    .join(' ')
    .toLowerCase();
  
  const matches = requirements.filter(req =>
    experienceText.includes(req.toLowerCase())
  );
  
  return (matches.length / requirements.length) * 100;
}

// Helper function to calculate education match
function calculateEducationMatch(userEducation, qualifications) {
  if (!userEducation?.length || !qualifications?.length) return 0;
  
  const educationText = userEducation
    .map(edu => `${edu.degree} ${edu.institution} ${edu.achievements?.join(' ')}`)
    .join(' ')
    .toLowerCase();
  
  const matches = qualifications.filter(qual =>
    educationText.includes(qual.toLowerCase())
  );
  
  return (matches.length / qualifications.length) * 100;
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