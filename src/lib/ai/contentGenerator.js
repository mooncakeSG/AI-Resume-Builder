import { Groq } from 'groq-sdk';

const getGroqApiKey = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ API key not found. Please add VITE_GROQ_API_KEY to your .env file.');
    return null;
  }
  return apiKey;
};

let groq = null;

const initializeGroq = () => {
  try {
    const apiKey = getGroqApiKey();
    if (apiKey) {
      groq = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  } catch (error) {
    console.error('Error initializing Groq client:', error);
  }
};

initializeGroq();

const handleGroqError = (error) => {
  console.error('Groq API error:', error);
  if (!groq) {
    throw new Error('API client not initialized. Please check your API key configuration.');
  }
  throw new Error('An error occurred while generating content. Please try again.');
};

export async function generateContent(jobRole, industry, userInput) {
  if (!groq) {
    throw new Error('API client not initialized. Please check your API key configuration.');
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert resume writer specializing in ${industry} industry resumes.`
        },
        {
          role: "user",
          content: `Help improve this content for a ${jobRole} position:\n${userInput}`
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw handleGroqError(error);
  }
}

export async function optimizeKeywords(content, jobDescription) {
  if (!groq) {
    throw new Error('API client not initialized. Please check your API key configuration.');
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert ATS optimization system. Analyze resumes and provide structured feedback in the following format:

1. **Summary:** Brief overview of the match quality
2. **Contact Information:** Review of contact details format
3. **Professional Experience:** Analysis of experience descriptions
4. **Skills Match:** 
   - Present Keywords: List of important keywords found
   - Missing Keywords: List of important keywords not found
5. **Improvement Suggestions:**
   - Specific, actionable suggestions for each section
   - Format improvements
   - Content optimization tips

Return the analysis as a structured list with clear section headers and bullet points.`
        },
        {
          role: "user",
          content: `Optimize this resume content for ATS compatibility with the job description:\n\nResume Content:\n${content}\n\nJob Description:\n${jobDescription}`
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    return completion.choices[0].message.content;
  } catch (error) {
    throw handleGroqError(error);
  }
}

export async function analyzeJobMatch(resume, jobDescription) {
  if (!groq) {
    throw new Error('API client not initialized. Please check your API key configuration.');
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert ATS system and resume analyzer. Analyze resumes against job descriptions and provide:
1. A match score (0-100) based on:
   - Required skills match (40%)
   - Experience relevance (30%)
   - Education fit (15%)
   - Keywords match (15%)
2. Key findings in JSON format with:
   - matched_keywords: []
   - missing_keywords: []
   - strength_areas: []
   - improvement_areas: []
Return the response as a JSON string with score and analysis fields.`
        },
        {
          role: "user",
          content: `Analyze this resume against the job description and provide the match score and detailed analysis:\n\nResume:\n${resume}\n\nJob Description:\n${jobDescription}`
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    try {
      const result = JSON.parse(completion.choices[0].message.content);
      return {
        score: Math.min(100, Math.max(0, Math.round(result.score))), // Ensure score is between 0-100
        analysis: result.analysis
      };
    } catch (parseError) {
      // Fallback parsing for non-JSON responses
      const scoreMatch = completion.choices[0].message.content.match(/\d+/);
      return {
        score: scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[0]))) : 50,
        analysis: completion.choices[0].message.content
      };
    }
  } catch (error) {
    throw handleGroqError(error);
  }
} 