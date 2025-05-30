import { useState } from 'react'
import { useToast } from './ui/ToastProvider'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

// Add API configuration object
const API_CONFIG = {
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  max_tokens: 500,
  top_p: 0.9,
  frequency_penalty: 0.3,
  presence_penalty: 0.3
}

// Fallback suggestions
const FALLBACK_SUGGESTIONS = {
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "Git",
    "Agile Methodologies",
    "Problem Solving",
    "Communication",
    "Team Leadership"
  ],
  summary: "Experienced professional with a strong background in technology and a proven track record of delivering results. Skilled in problem-solving, team collaboration, and project management, with a focus on driving innovation and efficiency."
}

const getPromptForType = (type, context) => {
  switch (type) {
    case 'skills':
      return `Generate a list of 10 relevant professional skills. Return them as a simple JSON array of strings.
      Example: ["JavaScript", "React", "Node.js"]
      
      Context: ${context?.careerType || 'professional'}`
    
    case 'summary':
      return `Write a professional summary for a ${context?.careerType || ''} professional.
      Keep it concise (2-3 sentences) and highlight key strengths and career focus.
      Make it impactful and specific to their field.
      
      Context:
      Career Field: ${context?.careerType || 'Not specified'}
      Location: ${context?.location || 'Not specified'}
      
      Return just the summary text, no formatting or additional notes.`
    
    default:
      return ''
  }
}

const AISuggest = ({ type, onSuggestionSelect, context }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const parseResponse = (content, type) => {
    try {
      switch (type) {
        case 'skills':
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(content)
            return Array.isArray(parsed) ? parsed : [parsed]
          } catch {
            // If not JSON, split by newlines and clean up
            return content
              .split('\n')
              .map(line => line.replace(/^[-•*]\s*/, '').trim())
              .filter(line => line.length > 0)
              .map(skill => skill.split('(')[0].trim())
          }
        case 'summary':
          // Clean up the summary text
          return content
            .trim()
            .replace(/^["']|["']$/g, '') // Remove quotes if present
            .replace(/\n+/g, ' ') // Replace multiple newlines with space
            .trim()
        default:
          return content
      }
    } catch (error) {
      console.error('Error parsing response:', error)
      return null
    }
  }

  const generateSuggestions = async () => {
    if (!GROQ_API_KEY) {
      // Use fallback suggestions if no API key
      onSuggestionSelect(type === 'skills' ? 
        JSON.stringify(FALLBACK_SUGGESTIONS[type]) : 
        FALLBACK_SUGGESTIONS[type]
      )
      return
    }

    setIsLoading(true)
    try {
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
              content: 'You are a professional resume writer helping to generate content. Respond in a clear, professional format.'
            },
            {
              role: 'user',
              content: getPromptForType(type, context)
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      const suggestions = parseResponse(data.choices[0].message.content, type)
      
      if (suggestions) {
        onSuggestionSelect(type === 'skills' ? JSON.stringify(suggestions) : suggestions)
        showToast('AI suggestions generated successfully!', 'success')
      }
    } catch (error) {
      console.error('Error generating suggestions:', error)
      showToast('Failed to generate suggestions. Using fallback options.', 'error')
      // Use fallback suggestions on error
      onSuggestionSelect(type === 'skills' ? 
        JSON.stringify(FALLBACK_SUGGESTIONS[type]) : 
        FALLBACK_SUGGESTIONS[type]
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={generateSuggestions}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium
        ${isLoading ? 'bg-blue-100 text-blue-400' : 'bg-blue-500 text-white hover:bg-blue-600'}
        transition-colors flex items-center gap-2
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>AI Suggest</span>
        </>
      )}
    </button>
  )
}

export default AISuggest 