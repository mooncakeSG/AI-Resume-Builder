import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Education = ({ data, onChange }) => {
  const [educationList, setEducationList] = useState(Array.isArray(data) ? data : [])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setEducationList(Array.isArray(data) ? data : [])
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(educationList)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [educationList, onChange])

  const handleChange = (index, field, value) => {
    const newList = [...educationList]
    newList[index] = { ...newList[index], [field]: value }
    setEducationList(newList)
    validateField(index, field, value)
  }

  const handleAchievementsSuggestion = (index, suggestion) => {
    const newList = [...educationList]
    const currentAchievements = newList[index].achievements || []
    newList[index] = {
      ...newList[index],
      achievements: [...currentAchievements, suggestion]
    }
    setEducationList(newList)
  }

  const handleDescriptionSuggestion = (index, suggestion) => {
    const newList = [...educationList]
    newList[index] = {
      ...newList[index],
      description: suggestion
    }
    setEducationList(newList)
  }

  const addEducation = () => {
    setEducationList(prev => [...prev, {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    }])
  }

  const removeEducation = (index) => {
    setEducationList(prev => prev.filter((_, i) => i !== index))
  }

  const removeAchievement = (eduIndex, achievementIndex) => {
    const newList = [...educationList]
    newList[eduIndex].achievements = newList[eduIndex].achievements.filter((_, i) => i !== achievementIndex)
    setEducationList(newList)
  }

  const validateField = (index, field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'school':
        if (!value?.trim()) {
          newErrors[`${index}-school`] = 'School name is required'
        } else {
          delete newErrors[`${index}-school`]
        }
        break
      
      case 'degree':
        if (!value?.trim()) {
          newErrors[`${index}-degree`] = 'Degree is required'
        } else {
          delete newErrors[`${index}-degree`]
        }
        break
      
      case 'field':
        if (!value?.trim()) {
          newErrors[`${index}-field`] = 'Field of study is required'
        } else {
          delete newErrors[`${index}-field`]
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Education</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your educational background</p>
        </div>
      </div>

      {educationList.map((education, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 relative border dark:border-gray-700">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                School/University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.school || ''}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  errors[`${index}-school`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                placeholder="University name"
              />
              {errors[`${index}-school`] && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-school`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.degree || ''}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  errors[`${index}-degree`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                placeholder="e.g., Bachelor's, Master's"
              />
              {errors[`${index}-degree`] && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-degree`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.field || ''}
                onChange={(e) => handleChange(index, 'field', e.target.value)}
                className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                  errors[`${index}-field`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                placeholder="e.g., Computer Science"
              />
              {errors[`${index}-field`] && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-field`]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={education.startDate || ''}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${
                    errors[`${index}-startDate`] ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200`}
                />
                {errors[`${index}-startDate`] && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors[`${index}-startDate`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  End Date
                </label>
                <input
                  type="month"
                  value={education.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={education.gpa || ''}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
                placeholder="e.g., 3.8"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Description
              </label>
              <AISuggest
                type="educationdescription"
                data={education}
                onSuggestionSelect={(suggestion) => handleDescriptionSuggestion(index, suggestion)}
              />
            </div>
            <textarea
              value={education.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              rows={4}
              placeholder="Describe your academic experience, relevant coursework, and key accomplishments"
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Key Achievements
              </label>
              <AISuggest
                type="educationachievements"
                data={education}
                onSuggestionSelect={(suggestions) => {
                  if (Array.isArray(suggestions)) {
                    suggestions.forEach(suggestion => handleAchievementsSuggestion(index, suggestion));
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              {education.achievements?.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-start gap-2 group">
                  <textarea
                    value={achievement}
                    onChange={(e) => {
                      const newList = [...educationList];
                      newList[index].achievements[achievementIndex] = e.target.value;
                      setEducationList(newList);
                    }}
                    className="flex-grow p-2 border border-gray-200 rounded-lg text-sm"
                    rows={2}
                  />
                  <button
                    onClick={() => removeAchievement(index, achievementIndex)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newList = [...educationList];
                  newList[index].achievements = [...(newList[index].achievements || []), ''];
                  setEducationList(newList);
                }}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Achievement
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        + Add Education
      </button>
    </div>
  )
}

export default Education 