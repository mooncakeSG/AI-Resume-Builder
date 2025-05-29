import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Experience = ({ data = [], updateData }) => {
  const [experienceList, setExperienceList] = useState(data)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    updateData(experienceList)
  }, [experienceList, updateData])

  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        website: '',
        technologies: ''
      }
    ])
  }

  const handleChange = (index, field, value) => {
    const newList = [...experienceList]
    newList[index] = { ...newList[index], [field]: value }
    setExperienceList(newList)
    validateExperience(newList[index], index)
  }

  const removeExperience = (index) => {
    const newList = experienceList.filter((_, i) => i !== index)
    setExperienceList(newList)
    const newErrors = { ...errors }
    delete newErrors[index]
    setErrors(newErrors)
  }

  const validateExperience = (experience, index) => {
    const newErrors = { ...errors }
    const experienceErrors = {}

    if (!experience.company.trim()) {
      experienceErrors.company = 'Company name is required'
    }
    if (!experience.position.trim()) {
      experienceErrors.position = 'Position is required'
    }
    if (!experience.startDate) {
      experienceErrors.startDate = 'Start date is required'
    }
    if (!experience.current && !experience.endDate) {
      experienceErrors.endDate = 'End date is required if not currently working'
    }
    if (experience.startDate && experience.endDate && !experience.current) {
      const start = new Date(experience.startDate)
      const end = new Date(experience.endDate)
      if (end < start) {
        experienceErrors.endDate = 'End date must be after start date'
      }
    }

    if (Object.keys(experienceErrors).length > 0) {
      newErrors[index] = experienceErrors
    } else {
      delete newErrors[index]
    }
    setErrors(newErrors)
  }

  const handleAISuggestion = (index, suggestion) => {
    const newList = [...experienceList]
    newList[index] = { ...newList[index], description: suggestion }
    setExperienceList(newList)
  }

  return (
    <div className="space-y-6">
      {experienceList.map((experience, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-900">Experience {index + 1}</h3>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={experience.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors[index]?.company ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[index]?.company && (
                <p className="mt-1 text-sm text-red-600">{errors[index].company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={experience.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors[index]?.position ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[index]?.position && (
                <p className="mt-1 text-sm text-red-600">{errors[index].position}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={experience.location}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                value={experience.website}
                onChange={(e) => handleChange(index, 'website', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="https://"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={experience.startDate}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors[index]?.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[index]?.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors[index].startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date {!experience.current && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                value={experience.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                disabled={experience.current}
                className={`w-full p-2 border rounded-md ${
                  errors[index]?.endDate ? 'border-red-500' : 'border-gray-300'
                } ${experience.current ? 'bg-gray-100' : ''}`}
              />
              {errors[index]?.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors[index].endDate}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={experience.current}
                  onChange={(e) => handleChange(index, 'current', e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <input
                type="text"
                value={experience.technologies}
                onChange={(e) => handleChange(index, 'technologies', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., React, Node.js, TypeScript"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <AISuggest
                  type="experience"
                  onSuggestionSelect={(suggestion) => handleAISuggestion(index, suggestion)}
                  context={experience}
                />
              </div>
              <textarea
                value={experience.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Experience
      </button>
    </div>
  )
}

export default Experience 