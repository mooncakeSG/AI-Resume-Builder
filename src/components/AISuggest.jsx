import { useState } from 'react'

const GROQ_API_KEY = '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const AISuggest = ({ type, onSuggestionSelect, context }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)

  const generatePrompt = (type, context) => {
    switch (type) {
      case 'experience':
        return `Generate 3 achievement-based bullet points for a ${context.position} at ${context.company}. Focus on quantifiable results and technical achievements.`
      case 'summary':
        return `Generate a professional summary for a ${context.position || 'professional'} with expertise in ${context.technologies || 'relevant technologies'}. Focus on key strengths and career highlights.`
      default:
        return ''
    }
  }

  const generateSuggestions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const prompt = generatePrompt(type, context)
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer. Generate concise, impactful content that highlights achievements and skills.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      // Parse the response into separate suggestions
      const parsedSuggestions = content
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^[•\-\d.]+\s*/, '').trim())
        .slice(0, 3) // Take only the first 3 suggestions

      setSuggestions(parsedSuggestions)
    } catch (err) {
      setError('Failed to generate suggestions. Please try again.')
      console.error('AI suggestion error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={generateSuggestions}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            AI Suggest
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-md shadow-lg z-10">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">AI Suggestions</h3>
            <p className="text-sm text-gray-500">Click to use a suggestion</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <p className="text-sm text-gray-700">{suggestion}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AISuggest 