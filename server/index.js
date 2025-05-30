import express from 'express';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 3001;

// Check for API key
const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  console.error('Error: GROQ_API_KEY or VITE_GROQ_API_KEY environment variable is required');
  process.exit(1);
}

// Initialize Groq client
const groq = new Groq({
  apiKey,
});

// Middleware
app.use(cors());
app.use(express.json());

// AI prompts
const PROMPTS = {
  ACHIEVEMENT: `Improve this achievement statement to be more impactful and quantifiable. Focus on results and specific metrics. Format: Original -> Improved`,
  DESCRIPTION: `Enhance this job description to highlight key responsibilities and accomplishments. Make it more professional and action-oriented. Format: Original -> Improved`,
  SKILLS: `Suggest relevant skills based on this job title and description. Return as a comma-separated list.`,
  JOB_ANALYSIS: `Analyze this job description and extract: 1) Key requirements 2) Required skills 3) Preferred qualifications 4) Suggested achievements. Format as JSON.`,
};

// Helper function to call Groq API
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
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}

// API endpoints
app.post('/api/ai/improve-achievement', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await callGroq(PROMPTS.ACHIEVEMENT, text);
    const [_, improved] = response.split('->').map(s => s.trim());
    res.json({ improvement: improved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to improve achievement' });
  }
});

app.post('/api/ai/enhance-description', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await callGroq(PROMPTS.DESCRIPTION, text);
    const [_, improved] = response.split('->').map(s => s.trim());
    res.json({ improvement: improved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enhance description' });
  }
});

app.post('/api/ai/suggest-skills', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await callGroq(PROMPTS.SKILLS, text);
    res.json({ skills: response.split(',').map(skill => skill.trim()) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to suggest skills' });
  }
});

app.post('/api/ai/match-resume', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;
    const analysis = await callGroq(PROMPTS.JOB_ANALYSIS, jobDescription);
    
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch {
      parsedAnalysis = {
        requirements: [],
        requiredSkills: [],
        preferredQualifications: [],
        suggestedAchievements: [],
      };
    }

    // Calculate match scores
    const matches = {
      skills: calculateSkillsMatch(resume.skills, parsedAnalysis.requiredSkills),
      experience: calculateExperienceMatch(resume.experience, parsedAnalysis.requirements),
      education: calculateEducationMatch(resume.education, parsedAnalysis.preferredQualifications),
    };

    matches.overall = (matches.skills + matches.experience + matches.education) / 3;

    res.json({
      matches,
      suggestions: generateSuggestions(resume, parsedAnalysis),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Helper functions for resume matching
function calculateSkillsMatch(userSkills, requiredSkills) {
  if (!userSkills?.length || !requiredSkills?.length) return 0;
  
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(s => s.toLowerCase());
  
  const matches = requiredSkillsLower.filter(skill => 
    userSkillsLower.some(userSkill => userSkill.includes(skill))
  );
  
  return (matches.length / requiredSkillsLower.length) * 100;
}

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

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 