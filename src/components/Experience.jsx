import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Experience = ({ data = [], onChange }) => {
  const [experienceList, setExperienceList] = useState(data.map(exp => ({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    links: {},
    ...exp
  })))
  const [errors, setErrors] = useState({})
  const [currentlyEditing, setCurrentlyEditing] = useState(null)

  useEffect(() => {
    setExperienceList(data.map(exp => ({
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      links: {},
      ...exp
    })))
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(experienceList)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [experienceList, onChange])

  const handleChange = (index, field, value) => {
    const newList = [...experienceList]
    newList[index] = { 
      ...newList[index], 
      [field]: value === undefined ? '' : value 
    }
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

  const handleDateChange = (index, field, value) => {
    const newList = [...experienceList]
    if (field === 'endDate' && value === 'Present') {
      newList[index] = {
        ...newList[index],
        [field]: '',
        current: true
      }
    } else {
      newList[index] = {
        ...newList[index],
        [field]: value,
        current: false
      }
    }
    setExperienceList(newList)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Experience</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your work experience</p>
        </div>
      </div>

      {experienceList.map((experience, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative border dark:border-gray-700">
          <button
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label 
                htmlFor={`position-${index}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Position <span className="text-red-500">*</span>
              </label>
              <input
                id={`position-${index}`}
                name={`position-${index}`}
                type="text"
                value={experience.position || ''}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  errors[`${index}-position`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                placeholder="e.g., Software Engineer"
              />
              {errors[`${index}-position`] && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-position`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`company-${index}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id={`company-${index}`}
                name={`company-${index}`}
                type="text"
                value={experience.company || ''}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  errors[`${index}-company`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                placeholder="e.g., Company Inc."
              />
              {errors[`${index}-company`] && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-company`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`location-${index}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Location
              </label>
              <input
                id={`location-${index}`}
                name={`location-${index}`}
                type="text"
                value={experience.location || ''}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor={`industry-${index}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Industry
              </label>
              <input
                id={`industry-${index}`}
                name={`industry-${index}`}
                type="text"
                value={experience.industry || ''}
                onChange={(e) => handleChange(index, 'industry', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                placeholder="e.g., Technology"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor={`startDate-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  id={`startDate-${index}`}
                  name={`startDate-${index}`}
                  type="month"
                  value={experience.startDate || ''}
                  onChange={(e) => handleDateChange(index, 'startDate', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor={`endDate-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  End Date
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={`endDate-${index}`}
                    name={`endDate-${index}`}
                    type="month"
                    value={experience.current ? '' : (experience.endDate || '')}
                    onChange={(e) => handleDateChange(index, 'endDate', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    disabled={experience.current}
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={experience.current || false}
                      onChange={(e) => handleDateChange(index, 'endDate', e.target.checked ? 'Present' : '')}
                      className="form-checkbox"
                    />
                    <span className="text-sm">Present</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description
              </label>
              <AISuggest
                type="experiencedescription"
                data={experience}
                onSuggestionSelect={(suggestion) => handleDescriptionSuggestion(index, suggestion)}
              />
            </div>
            <textarea
              value={experience.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              rows={4}
              placeholder="Describe your role, responsibilities, and key accomplishments"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Key Achievements
              </label>
              <AISuggest
                type="experienceachievements"
                data={experience}
                onSuggestionSelect={(suggestions) => {
                  if (Array.isArray(suggestions)) {
                    suggestions.forEach(suggestion => handleAchievementsSuggestion(index, suggestion));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              {experience.achievements?.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-start gap-2 group">
                  <textarea
                    value={achievement}
                    onChange={(e) => {
                      const newList = [...experienceList];
                      newList[index].achievements[achievementIndex] = e.target.value;
                      setExperienceList(newList);
                    }}
                    className="flex-grow p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                    rows={2}
                  />
                  <button
                    onClick={() => removeAchievement(index, achievementIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newList = [...experienceList];
                  newList[index].achievements = [...(newList[index].achievements || []), ''];
                  setExperienceList(newList);
                }}
                className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Achievement
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Professional Links
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor={`portfolio-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Project/Portfolio Link
                </label>
                <input
                  id={`portfolio-${index}`}
                  name={`portfolio-${index}`}
                  type="url"
                  value={experience.links?.portfolio || ''}
                  onChange={(e) => handleLinkChange(index, 'portfolio', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors[`${index}-portfolioLink`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                  placeholder="https://..."
                />
                {errors[`${index}-portfolioLink`] && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-portfolioLink`]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label 
                  htmlFor={`company-website-${index}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Company Website
                </label>
                <input
                  id={`company-website-${index}`}
                  name={`company-website-${index}`}
                  type="url"
                  value={experience.links?.company || ''}
                  onChange={(e) => handleLinkChange(index, 'company', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors[`${index}-companyLink`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                  placeholder="https://company.com"
                />
                {errors[`${index}-companyLink`] && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-companyLink`]}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  )
}

export default Experience 