import { useState, useEffect } from 'react'

const Education = ({ data, updateData }) => {
  const [educationList, setEducationList] = useState(data || [])
  const [errors, setErrors] = useState({})

  // Update local state when data prop changes
  useEffect(() => {
    setEducationList(data || [])
  }, [data])

  // Debounce the update to parent to prevent rapid re-renders
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const hasErrors = Object.values(errors).some(errorObj => 
        Object.values(errorObj).some(error => error !== '')
      )
      
      if (!hasErrors) {
        updateData(educationList)
      }
    }, 300) // 300ms debounce
    
    return () => clearTimeout(timeoutId)
  }, [educationList, updateData]) // Removed errors from dependency array

  const validateEducation = (edu) => {
    const newErrors = {}
    
    if (!edu.school?.trim()) {
      newErrors.school = 'School name is required'
    }
    if (!edu.degree?.trim()) {
      newErrors.degree = 'Degree is required'
    }
    if (!edu.fieldOfStudy?.trim()) {
      newErrors.fieldOfStudy = 'Field of study is required'
    }
    if (!edu.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!edu.endDate && !edu.currentlyStudying) {
      newErrors.endDate = 'End date is required unless currently studying'
    }
    if (edu.startDate && edu.endDate && edu.startDate > edu.endDate) {
      newErrors.endDate = 'End date must be after start date'
    }
    
    return newErrors
  }

  const addEducation = () => {
    setEducationList(prev => [...prev, {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      currentlyStudying: false,
      gpa: '',
      location: '',
      description: ''
    }])
  }

  const handleChange = (index, field, value) => {
    setEducationList(prev => {
      const newList = [...prev]
      newList[index] = {
        ...newList[index],
        [field]: value,
        // Reset end date if currently studying is checked
        ...(field === 'currentlyStudying' && value ? { endDate: '' } : {})
      }
      return newList
    })

    // Validate the updated education entry
    const updatedEducation = {
      ...educationList[index],
      [field]: value
    }
    const newErrors = validateEducation(updatedEducation)
    setErrors(prev => ({
      ...prev,
      [index]: newErrors
    }))
  }

  const removeEducation = (index) => {
    setEducationList(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, error }) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Education
        </button>
      </div>

      {educationList.map((edu, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Education #{index + 1}</h3>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="School/University"
              value={edu.school}
              onChange={(e) => handleChange(index, 'school', e.target.value)}
              placeholder="University Name"
              required
              error={errors[index]?.school}
            />
            <InputField
              label="Degree"
              value={edu.degree}
              onChange={(e) => handleChange(index, 'degree', e.target.value)}
              placeholder="Bachelor's, Master's, etc."
              required
              error={errors[index]?.degree}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Field of Study"
              value={edu.fieldOfStudy}
              onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
              placeholder="Computer Science"
              required
              error={errors[index]?.fieldOfStudy}
            />
            <InputField
              label="Location"
              value={edu.location}
              onChange={(e) => handleChange(index, 'location', e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <InputField
                label="Start Date"
                value={edu.startDate}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                type="month"
                required
                error={errors[index]?.startDate}
              />
              <InputField
                label="End Date"
                value={edu.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                type="month"
                required={!edu.currentlyStudying}
                error={errors[index]?.endDate}
                disabled={edu.currentlyStudying}
              />
            </div>
            <div className="flex items-center gap-4">
              <InputField
                label="GPA"
                value={edu.gpa}
                onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="3.8"
              />
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id={`currentlyStudying-${index}`}
                  checked={edu.currentlyStudying}
                  onChange={(e) => handleChange(index, 'currentlyStudying', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`currentlyStudying-${index}`} className="ml-2 text-sm text-gray-600">
                  Currently Studying
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={edu.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Describe your achievements, activities, relevant coursework, etc."
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Education 