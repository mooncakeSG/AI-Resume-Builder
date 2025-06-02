import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'
import Summary from './Summary'

const PersonalDetails = ({ data = {}, onChange }) => {
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    onChange({ [field]: value })
    validateField(field, value)
  }

  const handleSummaryChange = ({ summary }) => {
    // Ensure we're always storing a string value
    let summaryText = '';
    
    if (typeof summary === 'string') {
      summaryText = summary;
    } else if (typeof summary === 'object' && summary !== null) {
      summaryText = summary.text || summary.summary || String(summary);
    } else if (Array.isArray(summary)) {
      summaryText = summary[0]?.text || summary[0] || '';
    } else {
      summaryText = String(summary || '');
    }
    
    onChange({ summary: summaryText });
  }

  const handleLinksSuggestion = (links) => {
    onChange({
      links: {
        ...(data.links || {}),
        ...links
      }
    })
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    switch (field) {
      case 'name':
        if (!value?.trim()) {
          newErrors.name = 'Name is required'
        } else {
          delete newErrors.name
        }
        break
      case 'email':
        if (!value?.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format'
        } else {
          delete newErrors.email
        }
        break
      case 'phone':
        if (value && !/^\+?[\d\s-()]+$/.test(value)) {
          newErrors.phone = 'Invalid phone number format'
        } else {
          delete newErrors.phone
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

  const handleLinkChange = (linkType, value) => {
    if (value && !validateUrl(value)) {
      setErrors(prev => ({
        ...prev,
        [`${linkType}Link`]: 'Please enter a valid URL'
      }))
      return
    }
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[`${linkType}Link`]
      return newErrors
    })
    onChange({
      links: {
        ...(data.links || {}),
        [linkType]: value
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
        <p className="text-sm text-gray-500 mt-1">Add your contact information</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="City, Country"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              value={data.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg"
              placeholder="e.g., Technology, Healthcare"
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Professional Links
            </label>
            <AISuggest
              type="links"
              data={data}
              onSuggestionSelect={handleLinksSuggestion}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={data.links?.linkedin || ''}
                onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.linkedinLink ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="https://linkedin.com/in/..."
              />
              {errors.linkedinLink && (
                <p className="text-sm text-red-600">{errors.linkedinLink}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                GitHub Profile
              </label>
              <input
                type="url"
                value={data.links?.github || ''}
                onChange={(e) => handleLinkChange('github', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.githubLink ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="https://github.com/..."
              />
              {errors.githubLink && (
                <p className="text-sm text-red-600">{errors.githubLink}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Portfolio Website
              </label>
              <input
                type="url"
                value={data.links?.portfolio || ''}
                onChange={(e) => handleLinkChange('portfolio', e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.portfolioLink ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="https://..."
              />
              {errors.portfolioLink && (
                <p className="text-sm text-red-600">{errors.portfolioLink}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Summary
        data={{
          summary: data.summary || ''
        }}
        context={{
          industry: data.industry,
          title: data.title
        }}
        onChange={handleSummaryChange}
      />
    </div>
  )
}

export default PersonalDetails 