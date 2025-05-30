import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Experience = ({ data = [], updateData }) => {
  const [experienceList, setExperienceList] = useState(data)
  const [errors, setErrors] = useState({})
  const [currentlyEditing, setCurrentlyEditing] = useState(null)

  useEffect(() => {
    setExperienceList(data)
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateData(experienceList)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [experienceList, updateData])

  const handleChange = (index, field, value) => {
    const newList = [...experienceList]
    newList[index] = { ...newList[index], [field]: value }
    setExperienceList(newList)
    validateField(index, field, value)
  }

  const handleAchievementsSuggestion = (index, suggestion) => {
    const newList = [...experienceList]
    const currentAchievements = newList[index].achievements || []
    newList[index] = {
      ...newList[index],
      achievements: [...currentAchievements, suggestion]
    }
    setExperienceList(newList)
  }

  const handleDescriptionSuggestion = (index, suggestion) => {
    const newList = [...experienceList]
    newList[index] = {
      ...newList[index],
      description: suggestion
    }
    setExperienceList(newList)
  }

  const handleLinksSuggestion = (index, suggestion) => {
    const newList = [...experienceList]
    newList[index] = {
      ...newList[index],
      links: {
        ...(newList[index].links || {}),
        ...suggestion
      }
    }
    setExperienceList(newList)
  }

  const addExperience = () => {
    setExperienceList(prev => [...prev, {
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      links: {}
    }])
  }

  const removeExperience = (index) => {
    setExperienceList(prev => prev.filter((_, i) => i !== index))
  }

  const removeAchievement = (expIndex, achievementIndex) => {
    const newList = [...experienceList]
    newList[expIndex].achievements = newList[expIndex].achievements.filter((_, i) => i !== achievementIndex)
    setExperienceList(newList)
  }

  const validateField = (index, field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'position':
        if (!value?.trim()) {
          newErrors[`${index}-position`] = 'Position is required'
        } else {
          delete newErrors[`${index}-position`]
        }
        break
      
      case 'company':
        if (!value?.trim()) {
          newErrors[`${index}-company`] = 'Company is required'
        } else {
          delete newErrors[`${index}-company`]
        }
        break
      
      case 'startDate':
        if (!value) {
          newErrors[`${index}-startDate`] = 'Start date is required'
        } else {
          delete newErrors[`${index}-startDate`]
        }
        break
      
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const validateUrl = (url) => {
    if (!url) return true // Empty URLs are allowed
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleLinkChange = (index, linkType, value) => {
    if (value && !validateUrl(value)) {
      setErrors(prev => ({
        ...prev,
        [`${index}-${linkType}Link`]: 'Please enter a valid URL'
      }))
      return
    }
    
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${index}-${linkType}Link`]
      return newErrors
    })

    const newList = [...experienceList]
    newList[index] = {
      ...newList[index],
      links: {
        ...(newList[index].links || {}),
        [linkType]: value
      }
    }
    setExperienceList(newList)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
          <p className="text-sm text-gray-500 mt-1">Add your work experience</p>
        </div>
      </div>

      {experienceList.map((experience, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 relative">
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label 
                htmlFor={`position-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Position <span className="text-red-500">*</span>
              </label>
              <input
                id={`position-${index}`}
                name={`position-${index}`}
                type="text"
                value={experience.position || ''}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-position`] ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="e.g., Software Engineer"
              />
              {errors[`${index}-position`] && (
                <p className="text-sm text-red-600">{errors[`${index}-position`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`company-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id={`company-${index}`}
                name={`company-${index}`}
                type="text"
                value={experience.company || ''}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-company`] ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Company name"
              />
              {errors[`${index}-company`] && (
                <p className="text-sm text-red-600">{errors[`${index}-company`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`location-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id={`location-${index}`}
                name={`location-${index}`}
                type="text"
                value={experience.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`industry-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Industry
              </label>
              <input
                id={`industry-${index}`}
                name={`industry-${index}`}
                type="text"
                value={experience.industry || ''}
                onChange={(e) => handleChange(index, 'industry', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="e.g., Technology, Healthcare"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`startDate-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                id={`startDate-${index}`}
                name={`startDate-${index}`}
                type="month"
                value={experience.startDate || ''}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-startDate`] ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors[`${index}-startDate`] && (
                <p className="text-sm text-red-600">{errors[`${index}-startDate`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`endDate-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <div className="flex items-center gap-4">
                <input
                  id={`endDate-${index}`}
                  name={`endDate-${index}`}
                  type="month"
                  value={experience.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  disabled={experience.current}
                  className="flex-1 p-3 border border-gray-200 rounded-lg disabled:bg-gray-100"
                  min={experience.startDate}
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    id={`current-${index}`}
                    name={`current-${index}`}
                    type="checkbox"
                    checked={experience.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Current
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label 
                htmlFor={`description-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <AISuggest
                type="experience"
                onSuggestionSelect={(suggestion) => handleDescriptionSuggestion(index, suggestion)}
                context={{
                  position: experience.position,
                  company: experience.company,
                  industry: experience.industry,
                  technologies: experience.technologies
                }}
              />
            </div>
            <textarea
              id={`description-${index}`}
              name={`description-${index}`}
              value={experience.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Key Achievements
              </label>
              <AISuggest
                type="experience"
                onSuggestionSelect={(suggestion) => handleAchievementsSuggestion(index, suggestion)}
                context={{
                  position: experience.position,
                  company: experience.company,
                  industry: experience.industry,
                  technologies: experience.technologies
                }}
              />
            </div>
            <div className="space-y-2">
              {experience.achievements?.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-center gap-2 group">
                  <input
                    id={`achievement-${index}-${achievementIndex}`}
                    name={`achievement-${index}-${achievementIndex}`}
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const newList = [...experienceList]
                      newList[index].achievements[achievementIndex] = e.target.value
                      setExperienceList(newList)
                    }}
                    className="flex-1 p-3 border border-gray-200 rounded-lg"
                    placeholder="Enter achievement"
                  />
                  <button
                    onClick={() => removeAchievement(index, achievementIndex)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove achievement"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Professional Links
              </label>
              <AISuggest
                type="links"
                onSuggestionSelect={(suggestion) => handleLinksSuggestion(index, suggestion)}
                context={{
                  position: experience.position,
                  company: experience.company,
                  industry: experience.industry
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor={`portfolio-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Project/Portfolio Link
                </label>
                <input
                  id={`portfolio-${index}`}
                  name={`portfolio-${index}`}
                  type="url"
                  value={experience.links?.portfolio || ''}
                  onChange={(e) => handleLinkChange(index, 'portfolio', e.target.value)}
                  className={`w-full p-3 border rounded-lg ${errors[`${index}-portfolioLink`] ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="https://..."
                />
                {errors[`${index}-portfolioLink`] && (
                  <p className="text-sm text-red-600">{errors[`${index}-portfolioLink`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor={`company-website-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Website
                </label>
                <input
                  id={`company-website-${index}`}
                  name={`company-website-${index}`}
                  type="url"
                  value={experience.links?.company || ''}
                  onChange={(e) => handleLinkChange(index, 'company', e.target.value)}
                  className={`w-full p-3 border rounded-lg ${errors[`${index}-companyLink`] ? 'border-red-500' : 'border-gray-200'}`}
                  placeholder="https://company.com"
                />
                {errors[`${index}-companyLink`] && (
                  <p className="text-sm text-red-600">{errors[`${index}-companyLink`]}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  )
}

export default Experience 