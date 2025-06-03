import { useState } from 'react'
import { useToast } from './ui/ToastProvider'
import { 
  improveEducationDescription,
  generateEducationAchievements,
  improveExperienceDescription,
  generateExperienceAchievements,
  suggestSkills,
  suggestSummary,
  suggestLinks
} from '../lib/ai/AIService'

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
}

const AISuggest = ({ type, data, context, onSuggestionSelect }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()

  const generateSuggestions = async () => {
    // Use either data or context, with data taking precedence
    const suggestionData = data || context;
    
    if (!suggestionData) {
      console.error('No data or context provided for suggestions');
      showToast('Failed to generate suggestions. Using fallback options.', 'error');
      onSuggestionSelect(FALLBACK_SUGGESTIONS[type.toLowerCase()] || []);
      return;
    }

    setIsLoading(true)
    try {
      let result;
      const lowerType = type.toLowerCase();
      
      switch (lowerType) {
        case 'summary':
          result = await suggestSummary({
            experience: suggestionData.experience || [],
            education: suggestionData.education || [],
            skills: suggestionData.skills || [],
            careerType: suggestionData.careerType || '',
            firstName: suggestionData.firstName || '',
            lastName: suggestionData.lastName || '',
            location: suggestionData.location || '',
            professionalLinks: suggestionData.professionalLinks || {}
          });
          // For summary, pass the string directly
          onSuggestionSelect(result);
          break;
        
        case 'experiencedescription':
          result = await improveExperienceDescription(suggestionData);
          onSuggestionSelect(result);
          break;
        
        case 'experienceachievements':
          result = await generateExperienceAchievements(suggestionData);
          onSuggestionSelect(result);
          break;
        
        case 'educationdescription':
          result = await improveEducationDescription(suggestionData);
          onSuggestionSelect(result);
          break;
        
        case 'educationachievements':
          result = await generateEducationAchievements(suggestionData);
          onSuggestionSelect(result);
          break;
        
        case 'skills':
          result = await suggestSkills({
            position: suggestionData.position || '',
            industry: suggestionData.industry || '',
            level: suggestionData.level || '',
            description: suggestionData.description || ''
          });
          onSuggestionSelect(result);
          break;

        case 'links':
          result = await suggestLinks(suggestionData);
          onSuggestionSelect(result);
          break;
        
        default:
          console.warn(`Unhandled suggestion type: ${type}`);
          throw new Error(`Invalid suggestion type: ${type}`);
      }

      if (result) {
        showToast('AI suggestions generated successfully!', 'success');
      } else {
        console.warn('No suggestions generated for type:', type);
        throw new Error('No suggestions generated');
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      showToast('Failed to generate suggestions. Using fallback options.', 'error');
      // Use fallback suggestions on error
      onSuggestionSelect(FALLBACK_SUGGESTIONS[type.toLowerCase()] || []);
    } finally {
      setIsLoading(false);
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