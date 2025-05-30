import { useState, useEffect, useCallback } from 'react'
import AISuggest from './AISuggest'

const CAREER_TYPES = [
  'Software Development',
  'Data Science & Analytics',
  'Product Management',
  'Project Management',
  'Marketing & Communications',
  'Sales & Business Development',
  'Human Resources',
  'Finance & Accounting',
  'Design & Creative',
  'Operations & Administration',
  'Engineering',
  'Healthcare',
  'Education',
  'Legal',
  'Research & Development',
  'Consulting',
  'Customer Service',
  'Other'
]

const Personal = ({ data, onChange }) => {
  const [personalDetails, setPersonalDetails] = useState(data || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    careerType: '',
    yearsOfExperience: '',
    summary: '',
    links: {}
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(personalDetails)) {
      setPersonalDetails(data)
    }
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(data) !== JSON.stringify(personalDetails)) {
        onChange?.(personalDetails)
      }
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [personalDetails, onChange, data])

  const validateEmail = (email) => {
    if (!email) return true // Empty emails are allowed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    if (!phone) return true // Empty phone numbers are allowed
    const phoneRegex = /^\+?[\d\s-()]{10,}$/
    return phoneRegex.test(phone)
  }

  const handleChange = useCallback((field, value) => {
    let validationError = null

    if (field === 'email' && value && !validateEmail(value)) {
      validationError = 'Please enter a valid email address'
    } else if (field === 'phone' && value && !validatePhone(value)) {
      validationError = 'Please enter a valid phone number'
    }

    setErrors(prev => ({
      ...prev,
      [field]: validationError
    }))

    setPersonalDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleLinkChange = useCallback((platform, url) => {
    setPersonalDetails(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [platform]: url
      }
    }))
  }, [])

  const handleSummaryUpdate = (suggestion) => {
    handleChange('summary', suggestion)
  }

  const handleLinksUpdate = (suggestion) => {
    setPersonalDetails(prev => ({
      ...prev,
      links: {
        ...prev.links,
        ...suggestion
      }
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add your personal information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={personalDetails.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="John"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={personalDetails.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="Doe"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={personalDetails.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={personalDetails.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={personalDetails.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="careerType"
            className="block text-sm font-medium text-gray-700"
          >
            Career Field
          </label>
          <select
            id="careerType"
            name="careerType"
            value={personalDetails.careerType || ''}
            onChange={(e) => handleChange('careerType', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg"
          >
            <option value="">Select a career field</option>
            {CAREER_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <label 
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Professional Summary
          </label>
          <AISuggest
            type="summary"
            onSuggestionSelect={handleSummaryUpdate}
            context={personalDetails}
          />
        </div>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          value={personalDetails.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg"
          placeholder="Write a brief summary of your professional background and career goals..."
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Professional Links
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label 
              htmlFor="linkedinUrl"
              className="block text-sm font-medium text-gray-700"
            >
              LinkedIn
            </label>
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              type="url"
              value={personalDetails.links?.linkedin || ''}
              onChange={(e) => handleLinkChange('linkedin', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <label 
              htmlFor="githubUrl"
              className="block text-sm font-medium text-gray-700"
            >
              GitHub
            </label>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={personalDetails.links?.github || ''}
              onChange={(e) => handleLinkChange('github', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-2">
            <label 
              htmlFor="portfolioUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Portfolio Website
            </label>
            <input
              id="portfolioUrl"
              name="portfolioUrl"
              type="url"
              value={personalDetails.links?.website || ''}
              onChange={(e) => handleLinkChange('website', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personal 