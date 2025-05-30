import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Education = ({ data = [], updateData }) => {
  const [educationList, setEducationList] = useState(data)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setEducationList(data)
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateData(educationList)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [educationList, updateData])

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
          <h2 className="text-xl font-semibold text-gray-800">Education</h2>
          <p className="text-sm text-gray-500 mt-1">Add your educational background</p>
        </div>
      </div>

      {educationList.map((education, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 relative">
          <button
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                School/University <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.school || ''}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-school`] ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="University name"
              />
              {errors[`${index}-school`] && (
                <p className="text-sm text-red-600">{errors[`${index}-school`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.degree || ''}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-degree`] ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="e.g., Bachelor's, Master's"
              />
              {errors[`${index}-degree`] && (
                <p className="text-sm text-red-600">{errors[`${index}-degree`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={education.field || ''}
                onChange={(e) => handleChange(index, 'field', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors[`${index}-field`] ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="e.g., Computer Science"
              />
              {errors[`${index}-field`] && (
                <p className="text-sm text-red-600">{errors[`${index}-field`]}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={education.startDate || ''}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className={`w-full p-3 border rounded-lg ${errors[`${index}-startDate`] ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors[`${index}-startDate`] && (
                  <p className="text-sm text-red-600">{errors[`${index}-startDate`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="month"
                  value={education.endDate || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg"
                  min={education.startDate}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <AISuggest
                type="education_description"
                onSuggestionSelect={(suggestion) => handleDescriptionSuggestion(index, suggestion)}
                context={{
                  school: education.school,
                  degree: education.degree,
                  field: education.field
                }}
              />
            </div>
            <textarea
              value={education.description || ''}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg min-h-[100px]"
              placeholder="Describe your educational experience..."
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Key Achievements
              </label>
              <AISuggest
                type="education_achievement"
                onSuggestionSelect={(suggestion) => handleAchievementsSuggestion(index, suggestion)}
                context={{
                  school: education.school,
                  degree: education.degree,
                  field: education.field
                }}
              />
            </div>
            <div className="space-y-2">
              {education.achievements?.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-center gap-2 group">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => {
                      const newList = [...educationList]
                      newList[index].achievements[achievementIndex] = e.target.value
                      setEducationList(newList)
                    }}
                    className="flex-1 p-3 border border-gray-200 rounded-lg"
                    placeholder="Enter achievement"
                  />
                  <button
                    onClick={() => removeAchievement(index, achievementIndex)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
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