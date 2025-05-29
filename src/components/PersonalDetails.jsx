import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const PersonalDetails = ({ data = {}, updateData }) => {
  const [formData, setFormData] = useState(data)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(data)
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateData(formData)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [formData, updateData])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          newErrors.email = 'Email is required'
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format'
        } else {
          delete newErrors.email
        }
        break
      
      case 'phone':
        const phoneRegex = /^\+?[\d\s-]{10,}$/
        if (!value) {
          newErrors.phone = 'Phone number is required'
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = 'Invalid phone number format'
        } else {
          delete newErrors.phone
        }
        break
      
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required'
        } else {
          delete newErrors.fullName
        }
        break
      
      case 'summary':
        if (value && value.length < 50) {
          newErrors.summary = 'Summary should be at least 50 characters'
        } else {
          delete newErrors.summary
        }
        break
      
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const handleAISuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, summary: suggestion }))
    validateField('summary', suggestion)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className={`w-full p-2 border rounded-md ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full p-2 border rounded-md ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full p-2 border rounded-md ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input
            type="url"
            value={formData.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={formData.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <AISuggest
            type="summary"
            onSuggestionSelect={handleAISuggestion}
            context={formData}
          />
        </div>
        <textarea
          value={formData.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className={`w-full p-2 border rounded-md ${
            errors.summary ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write a brief summary of your professional background and key strengths..."
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
        )}
      </div>
    </div>
  )
}

export default PersonalDetails 