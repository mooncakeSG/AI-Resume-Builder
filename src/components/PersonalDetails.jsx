import { useState } from 'react'
import AISuggest from './AISuggest'
import Summary from './Summary'
import { Input } from './ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'

const PersonalDetails = ({ data = {}, onChange }) => {
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    })
    validateField(field, value)
  }

  const handleSummaryChange = ({ summary }) => {
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
    
    onChange({
      ...data,
      summary: summaryText
    });
  }

  const handleLinksSuggestion = (links) => {
    onChange({
      ...data,
      links: {
        ...(data.links || {}),
        ...links
      }
    })
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors }
    switch (field) {
      case 'firstName':
        if (!value?.trim()) {
          newErrors.firstName = 'First Name is required'
        } else {
          delete newErrors.firstName
        }
        break
      case 'lastName':
        if (!value?.trim()) {
          newErrors.lastName = 'Last Name is required'
        } else {
          delete newErrors.lastName
        }
        break
      case 'title':
        if (!value?.trim()) {
          newErrors.title = 'Job Title is required'
        } else {
          delete newErrors.title
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
    if (!url) return true
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
      ...data,
      links: {
        ...(data.links || {}),
        [linkType]: value
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 border-b dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personal Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your contact information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              First Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={data.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              error={errors.firstName}
              placeholder="John"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Last Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={data.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              error={errors.lastName}
              placeholder="Doe"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Job Title
            </label>
            <Input
              type="text"
              value={data.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Software Engineer"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Phone Number
            </label>
            <Input
              type="tel"
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={errors.phone}
              placeholder="+1 (555) 123-4567"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Location
            </label>
            <Input
              type="text"
              value={data.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Industry
            </label>
            <Input
              type="text"
              value={data.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              placeholder="e.g., Technology, Healthcare"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Professional Links
            </label>
            <AISuggest
              type="links"
              data={data}
              onSuggestionSelect={handleLinksSuggestion}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                LinkedIn
              </label>
              <Input
                type="url"
                value={data.links?.linkedin || ''}
                onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                error={errors.linkedinLink}
                placeholder="https://linkedin.com/in/username"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              />
              {errors.linkedinLink && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.linkedinLink}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                GitHub
              </label>
              <Input
                type="url"
                value={data.links?.github || ''}
                onChange={(e) => handleLinkChange('github', e.target.value)}
                error={errors.githubLink}
                placeholder="https://github.com/username"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              />
              {errors.githubLink && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.githubLink}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Portfolio
              </label>
              <Input
                type="url"
                value={data.links?.portfolio || ''}
                onChange={(e) => handleLinkChange('portfolio', e.target.value)}
                error={errors.portfolioLink}
                placeholder="https://yourportfolio.com"
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              />
              {errors.portfolioLink && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.portfolioLink}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Summary
            value={data.summary || ''}
            onChange={handleSummaryChange}
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

export default PersonalDetails 