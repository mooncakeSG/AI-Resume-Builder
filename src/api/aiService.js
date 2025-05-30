const API_BASE_URL = '/api/ai';

// Function to make API calls
async function callAPI(endpoint, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// Improve achievement statements
export async function improveAchievement(achievement) {
  const response = await callAPI('improve-achievement', { text: achievement });
  return response.improvement;
}

// Enhance job descriptions
export async function enhanceDescription(description) {
  const response = await callAPI('enhance-description', { text: description });
  return response.improvement;
}

// Suggest relevant skills
export async function suggestSkills(jobInfo) {
  const response = await callAPI('suggest-skills', { text: jobInfo });
  return response.skills;
}

// Analyze job description and match with resume
export async function matchResume(resumeData, jobDescription) {
  const response = await callAPI('match-resume', {
    resume: resumeData,
    jobDescription,
  });
  return response;
} 