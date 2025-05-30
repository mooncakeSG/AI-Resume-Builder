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

  const handleSummarySuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, summary: suggestion }))
    validateField('summary', suggestion)
  }

  const handleLinksSuggestion = (suggestion) => {
    try {
      const links = JSON.parse(suggestion)
      setFormData(prev => ({
        ...prev,
        linkedin: links.linkedin || prev.linkedin,
        github: links.github || prev.github,
        website: links.website || prev.website
      }))
    } catch (err) {
      console.error('Failed to parse links suggestion:', err)
    }
  }

  return (
    <div className="space-y-8 bg-white rounded-lg shadow-sm p-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        <p className="text-sm text-gray-500 mt-1">Enter your basic contact information</p>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main St, City, Country"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Professional Links</h3>
            <AISuggest
              type="links"
              onSuggestionSelect={handleLinksSuggestion}
              context={{
                name: formData.fullName,
                position: formData.title
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                GitHub
              </label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => handleChange('github', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="border-t pt-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Professional Summary</h3>
            <AISuggest
              type="summary"
              onSuggestionSelect={handleSummarySuggestion}
              context={{
                position: formData.title,
                technologies: formData.skills
              }}
            />
          </div>
          <div className="space-y-2">
            <textarea
              value={formData.summary || ''}
              onChange={(e) => handleChange('summary', e.target.value)}
              className={`w-full p-3 border rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] ${
                errors.summary ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Write a brief summary of your professional background and key strengths..."
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails 