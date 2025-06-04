// Validation rules for different section types
const validationRules = {
  personal: {
    required: ['firstName', 'lastName', 'email'],
    optional: ['phone', 'location', 'summary', 'professionalLinks']
  },
  experience: {
    required: ['position', 'company', 'startDate'],
    optional: ['endDate', 'description', 'achievements']
  },
  education: {
    required: ['degree', 'school'],
    optional: ['field', 'startDate', 'endDate', 'description', 'achievements']
  },
  skills: {
    arrayRequired: true,
    minItems: 1
  },
  certifications: {
    arrayRequired: true,
    minItems: 0,
    itemFields: {
      required: ['name', 'issuer'],
      optional: ['issueDate', 'expiryDate', 'credentialId', 'credentialUrl']
    }
  },
  languages: {
    arrayRequired: true,
    minItems: 0,
    itemFields: {
      required: ['name', 'proficiency'],
      optional: ['certification']
    }
  },
  projects: {
    arrayRequired: true,
    minItems: 0,
    itemFields: {
      required: ['name', 'description'],
      optional: ['url', 'startDate', 'endDate', 'technologies', 'achievements']
    }
  }
};

/**
 * Validates a section of the resume against its validation rules
 * @param {string} sectionType - The type of section being validated
 * @param {object|array} sectionData - The data to validate
 * @returns {object} - Validation result with isValid and issues
 */
export const validateSection = (sectionType, sectionData) => {
  const rules = validationRules[sectionType];
  if (!rules) {
    return { isValid: true, issues: [] }; // No validation rules defined
  }

  const issues = [];

  if (rules.arrayRequired) {
    if (!Array.isArray(sectionData)) {
      issues.push(`${sectionType} must be an array`);
    } else if (sectionData.length < (rules.minItems || 0)) {
      issues.push(`${sectionType} must have at least ${rules.minItems} item(s)`);
    }
    return { isValid: issues.length === 0, issues };
  }

  if (Array.isArray(sectionData)) {
    sectionData.forEach((item, index) => {
      rules.required.forEach(field => {
        if (!item[field]) {
          issues.push(`Missing required field '${field}' in ${sectionType} entry ${index + 1}`);
        }
      });
    });
  } else if (typeof sectionData === 'object' && sectionData !== null) {
    rules.required.forEach(field => {
      if (!sectionData[field]) {
        issues.push(`Missing required field '${field}' in ${sectionType}`);
      }
    });
  } else {
    issues.push(`Invalid ${sectionType} data format`);
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 