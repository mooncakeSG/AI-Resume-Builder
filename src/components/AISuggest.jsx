import { useState } from 'react'
import { useToast } from './ui/ToastProvider'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

// Add API configuration object
const API_CONFIG = {
  model: 'llama-3.3-70b-versatile',  // Updated to use production model
  temperature: 0.7,
  max_tokens: 500,
  top_p: 0.9,
  frequency_penalty: 0.3,
  presence_penalty: 0.3
}

const AISuggest = ({ type, onSuggestionSelect, context }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const { showToast } = useToast()

  const getCareerContext = (context) => {
    const details = []
    if (context.careerType) details.push(`career field: ${context.careerType}`)
    if (context.yearsOfExperience) details.push(`${context.yearsOfExperience} years of experience`)
    if (context.position) details.push(`current role: ${context.position}`)
    if (context.industry) details.push(`industry: ${context.industry}`)
    return details.length > 0 ? details.join(', ') : ''
  }

  const getPersonalContext = (context) => {
    const details = []
    if (context.name) details.push(`name: ${context.name}`)
    if (context.location) details.push(`location: ${context.location}`)
    if (context.skills?.length > 0) details.push(`skills: ${context.skills.map(s => s.name).join(', ')}`)
    if (context.experience?.length > 0) {
      const latestExp = context.experience[0]
      details.push(`current/latest role: ${latestExp.position} at ${latestExp.company}`)
    }
    
    const careerContext = getCareerContext(context)
    if (careerContext) details.push(careerContext)
    
    return details.length > 0 ? details.join(', ') : 'a professional'
  }

  const getSkillsByCareerType = (careerType) => {
    const commonSkills = {
      'Software Development': [
        'Programming Languages',
        'Web Development',
        'Software Architecture',
        'DevOps',
        'Testing',
        'Version Control'
      ],
      'Data Science & Analytics': [
        'Machine Learning',
        'Statistical Analysis',
        'Data Visualization',
        'Big Data',
        'Python',
        'SQL'
      ],
      'Product Management': [
        'Product Strategy',
        'User Research',
        'Agile Methodologies',
        'Roadmapping',
        'Stakeholder Management',
        'Market Analysis'
      ],
      'Marketing & Communications': [
        'Digital Marketing',
        'Content Strategy',
        'Social Media',
        'Analytics',
        'Brand Management',
        'SEO/SEM'
      ]
    }
    return commonSkills[careerType] || []
  }

  const generatePrompt = (type, context) => {
    const personalContext = getPersonalContext(context)
    const careerContext = getCareerContext(context)
    const relevantSkills = context.careerType ? getSkillsByCareerType(context.careerType) : []
    
    switch (type) {
      case 'summary':
        const expLevel = context.yearsOfExperience ? 
          parseInt(context.yearsOfExperience) <= 3 ? 'entry-level' :
          parseInt(context.yearsOfExperience) <= 7 ? 'mid-level' :
          'senior-level' : ''

        return `As a professional resume writer, create a compelling ${expLevel} professional summary for a ${context.careerType || 'professional'}.
        
        Personal Context: ${personalContext}
        ${careerContext ? `Career Details: ${careerContext}` : ''}
        ${relevantSkills.length > 0 ? `Key Areas: ${relevantSkills.join(', ')}` : ''}
        
        Focus on:
        - Key strengths and expertise that set them apart
        - Career highlights and measurable impact
        - Unique value proposition and career goals
        ${context.careerType ? `- Specific achievements relevant to ${context.careerType}` : ''}
        
        Keep it between 2-3 sentences, making it powerful and memorable.
        Avoid clichés and focus on specific, demonstrable qualities.
        Use active voice and impactful language.`

      case 'experience':
        return `As a professional resume writer, generate 3 impactful bullet points for a ${context.position || context.careerType || 'professional'} role ${context.company ? `at ${context.company}` : ''}.
        
        Personal Context: ${personalContext}
        ${careerContext ? `Career Details: ${careerContext}` : ''}
        ${relevantSkills.length > 0 ? `Key Areas: ${relevantSkills.join(', ')}` : ''}
        ${context.technologies ? `\nTechnologies: ${context.technologies}` : ''}
        
        Focus on:
        - Quantifiable achievements with specific metrics (%, $, time saved, etc.)
        - Leadership and impact on team/company
        - Technical skills and innovations used
        ${context.careerType ? `- Specific achievements relevant to ${context.careerType}` : ''}
        
        Format each point to start with a strong action verb.
        Keep each bullet point concise (max 20 words) and impactful.`

      case 'skills':
        return `Generate a list of 5-7 relevant skills for a ${context.careerType || 'professional'} professional.
        
        Personal Context: ${personalContext}
        ${careerContext ? `Career Details: ${careerContext}` : ''}
        ${relevantSkills.length > 0 ? `Common skills in this field include: ${relevantSkills.join(', ')}` : ''}
        
        Include a balanced mix of:
        - Technical skills specific to ${context.careerType || 'the role'}
        - Industry-specific knowledge
        - Soft skills and leadership abilities
        
        Format each skill as a bullet point with proficiency level (Beginner/Intermediate/Advanced/Expert).
        Example format:
        - JavaScript (Advanced)
        - Project Management (Expert)
        - Team Leadership (Advanced)
        
        Ensure skills align with their career level and trajectory.`

      case 'education_description':
        const eduContext = [
          context.degree && `pursuing/completed ${context.degree}`,
          context.field && `in ${context.field}`,
          context.school && `at ${context.school}`,
          context.gpa && `with a GPA of ${context.gpa}`,
          context.graduationYear && `(${context.graduationYear})`
        ].filter(Boolean).join(' ')

        return `As a professional resume writer, create a compelling description for ${eduContext || 'the educational experience'}.
        Consider this context: ${personalContext}
        
        Focus on:
        - Academic achievements and honors
        - Relevant coursework aligned with career goals
        - Research projects or thesis work
        - Leadership roles in student organizations
        
        Keep it concise (2-3 sentences) and focused on academic excellence.
        Highlight aspects that demonstrate skills relevant to their career path.`

      case 'education_achievement':
        return `As a professional resume writer, generate an achievement for ${context.degree || 'degree'} in ${context.field || 'field'} from ${context.school || 'school'}.
        Consider this context: ${personalContext}
        
        Focus on:
        - Academic honors or awards
        - Notable projects or research contributions
        - Leadership roles or extracurricular activities
        - Relevant technical or soft skills demonstrated
        
        Format as a single bullet point starting with a strong action verb.
        Make it specific and quantifiable where possible.`

      case 'links':
        const nameForLinks = context.name?.toLowerCase().replace(/\s+/g, '') || 'professional'
        const roleForLinks = context.position?.toLowerCase().replace(/\s+/g, '-') || 'developer'

        return `As a professional resume writer, suggest professional online presence links for ${personalContext}.
        
        Generate in JSON format with these fields:
        - linkedin (LinkedIn URL format)
        - github (if tech-related)
        - website (professional portfolio)
        
        Example: {
          "linkedin": "linkedin.com/in/${nameForLinks}",
          "github": "github.com/${nameForLinks}",
          "website": "${nameForLinks}.dev"
        }
        
        Use consistent and professional usernames based on their name and role.
        Ensure URLs follow standard format for each platform.`

      default:
        return ''
    }
  }

  const parseResponse = (content, type) => {
    if (type === 'links') {
      try {
        return [JSON.parse(content)]
      } catch (err) {
        console.error('Failed to parse links response:', err)
        showToast('Failed to parse links suggestion', 'error')
        return []
      }
    }

    if (type === 'skills') {
      // Parse skills format: "- JavaScript (Advanced)"
      return content
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => {
          const match = line.trim().slice(2).match(/^(.*?)\s*\((.*?)\)$/)
          if (match) {
            return {
              name: match[1].trim(),
              proficiency: match[2].trim()
            }
          }
          return null
        })
        .filter(Boolean)
    }

    // For other types, split by newlines and clean up
    return content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[•\-\d.]+\s*/, '').trim())
      .filter(line => line.length > 20)
      .slice(0, 3)
  }

  const generateSuggestions = async () => {
    setIsLoading(true)
    setSuggestions([]) // Clear previous suggestions
    
    if (!GROQ_API_KEY) {
      showToast('API key not configured. Please check your environment variables.', 'error')
      setIsLoading(false)
      return
    }
    
    try {
      const prompt = generatePrompt(type, context)
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          ...API_CONFIG,
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume writer with years of experience helping professionals showcase their achievements. Focus on creating content that is specific, measurable, and impactful. Always provide concrete examples and metrics when possible.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.status}`)
      }

      const data = await response.json()
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from API')
      }

      const content = data.choices[0].message.content
      const parsedSuggestions = parseResponse(content, type)

      if (parsedSuggestions.length === 0) {
        showToast('No valid suggestions generated. Please try again.', 'error')
      } else {
        setSuggestions(parsedSuggestions)
        showToast('Suggestions generated successfully!', 'success')
      }
    } catch (err) {
      console.error('AI suggestion error:', err)
      showToast(err.message || 'Failed to generate suggestions. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={generateSuggestions}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span>AI Suggest</span>
          </>
        )}
      </button>

      {suggestions.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-[32rem] bg-white rounded-xl shadow-xl z-50 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
            <p className="text-sm text-gray-500 mt-1">Click any suggestion to use it</p>
          </div>
          <div className="max-h-[24rem] overflow-y-auto p-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onSuggestionSelect(suggestion)
                  setSuggestions([])
                  showToast('Suggestion applied successfully!', 'success')
                }}
                className="w-full p-4 text-left hover:bg-blue-50 transition-colors duration-150 rounded-lg my-1 group"
              >
                <p className="text-sm text-gray-700 group-hover:text-blue-700 whitespace-pre-line">
                  {typeof suggestion === 'object' ? JSON.stringify(suggestion, null, 2) : suggestion}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AISuggest 