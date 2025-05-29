import { useState, useEffect } from 'react'

const Skills = ({ data, updateData }) => {
  const [skillsList, setSkillsList] = useState(data || [])
  const [errors, setErrors] = useState({})

  const validateSkill = (skill) => {
    const newErrors = {}
    if (!skill.category?.trim()) newErrors.category = 'Category is required'
    if (!skill.skills?.trim()) newErrors.skills = 'At least one skill is required'
    return newErrors
  }

  const addSkill = () => {
    setSkillsList(prev => [...prev, {
      category: '',
      skills: ''
    }])
  }

  const handleChange = (index, field, value) => {
    setSkillsList(prev => {
      const newList = [...prev]
      newList[index] = {
        ...newList[index],
        [field]: value
      }
      return newList
    })
    // Validate the updated skill entry
    const updatedSkill = {
      ...skillsList[index],
      [field]: value
    }
    const newErrors = validateSkill(updatedSkill)
    setErrors(prev => ({
      ...prev,
      [index]: newErrors
    }))
  }

  const removeSkill = (index) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[index]
      return newErrors
    })
  }

  useEffect(() => {
    const hasErrors = Object.values(errors).some(errorObj => 
      Object.values(errorObj).some(error => error !== '')
    )
    if (!hasErrors) {
      updateData(skillsList)
    }
  }, [skillsList, errors, updateData])

  const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, error, ...rest }) => (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Skill Category
        </button>
      </div>
      {skillsList.map((skill, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Skill Category #{index + 1}</h3>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Remove
            </button>
          </div>
          <InputField
            label="Category"
            value={skill.category}
            onChange={(e) => handleChange(index, 'category', e.target.value)}
            placeholder="e.g., Programming Languages, Soft Skills, etc."
            required
            error={errors[index]?.category}
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Skills
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={skill.skills}
              onChange={(e) => handleChange(index, 'skills', e.target.value)}
              className={`w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors[index]?.skills ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
              required
            />
            {errors[index]?.skills && <p className="text-red-500 text-sm mt-1">{errors[index]?.skills}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skills 