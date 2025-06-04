import { validateSection } from './validation';

export const parseResume = (resumeData) => {
  const formatStatus = validateResumeFormat(resumeData);
  const contentStatus = extractResumeContent(resumeData);

  return {
    formatStatus,
    contentStatus,
    isValid: formatStatus.isValid && contentStatus.isExtracted
  };
};

const validateResumeFormat = (resumeData) => {
  if (!resumeData) {
    return { isValid: false, issues: ['No resume data provided'] };
  }

  const issues = [];
  const requiredSections = ['personal', 'education', 'experience', 'skills'];
  const optionalSections = ['certifications', 'languages', 'projects'];

  // Check for required sections
  requiredSections.forEach(section => {
    if (!resumeData[section]) {
      issues.push(`Missing ${section} section`);
    }
  });

  // Validate optional sections if present
  optionalSections.forEach(section => {
    if (resumeData[section] && !Array.isArray(resumeData[section])) {
      issues.push(`Invalid ${section} format - must be an array`);
    }
  });

  // Validate personal section
  if (resumeData.personal) {
    const requiredPersonalFields = ['firstName', 'lastName', 'email'];
    requiredPersonalFields.forEach(field => {
      if (!resumeData.personal[field]) {
        issues.push(`Missing ${field} in personal section`);
      }
    });
  }

  // Validate experience entries
  if (Array.isArray(resumeData.experience)) {
    resumeData.experience.forEach((exp, index) => {
      if (!exp.position || !exp.company || !exp.startDate) {
        issues.push(`Incomplete experience entry at position ${index + 1}`);
      }
    });
  }

  // Validate education entries
  if (Array.isArray(resumeData.education)) {
    resumeData.education.forEach((edu, index) => {
      if (!edu.degree || !edu.school) {
        issues.push(`Incomplete education entry at position ${index + 1}`);
      }
    });
  }

  // Validate skills
  if (!Array.isArray(resumeData.skills) || resumeData.skills.length === 0) {
    issues.push('Skills section is empty or invalid');
  }

  // Validate certifications if present
  if (Array.isArray(resumeData.certifications)) {
    resumeData.certifications.forEach((cert, index) => {
      if (!cert.name || !cert.issuer) {
        issues.push(`Incomplete certification entry at position ${index + 1}`);
      }
    });
  }

  // Validate languages if present
  if (Array.isArray(resumeData.languages)) {
    resumeData.languages.forEach((lang, index) => {
      if (!lang.name || !lang.proficiency) {
        issues.push(`Incomplete language entry at position ${index + 1}`);
      }
    });
  }

  // Validate projects if present
  if (Array.isArray(resumeData.projects)) {
    resumeData.projects.forEach((proj, index) => {
      if (!proj.name || !proj.description) {
        issues.push(`Incomplete project entry at position ${index + 1}`);
      }
    });
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

const extractResumeContent = (resumeData) => {
  if (!resumeData) {
    return { isExtracted: false, sections: {}, issues: ['No resume data provided'] };
  }

  const sections = {};
  const issues = [];

  try {
    // Extract personal information
    if (resumeData.personal) {
      sections.personal = {
        name: `${resumeData.personal.firstName} ${resumeData.personal.lastName}`.trim(),
        contact: {
          email: resumeData.personal.email,
          phone: resumeData.personal.phone,
          location: resumeData.personal.location
        },
        summary: resumeData.personal.summary,
        links: resumeData.personal.professionalLinks
      };
    }

    // Extract and structure experience
    if (Array.isArray(resumeData.experience)) {
      sections.experience = resumeData.experience.map(exp => ({
        title: exp.position,
        company: exp.company,
        duration: {
          start: exp.startDate,
          end: exp.endDate || 'Present'
        },
        description: exp.description,
        achievements: exp.achievements
      }));
    }

    // Extract and structure education
    if (Array.isArray(resumeData.education)) {
      sections.education = resumeData.education.map(edu => ({
        degree: edu.degree,
        school: edu.school,
        field: edu.field,
        duration: {
          start: edu.startDate,
          end: edu.endDate
        },
        achievements: edu.achievements
      }));
    }

    // Extract skills
    if (Array.isArray(resumeData.skills)) {
      sections.skills = resumeData.skills;
    }

    // Extract certifications
    if (Array.isArray(resumeData.certifications)) {
      sections.certifications = resumeData.certifications.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        dates: {
          issued: cert.issueDate,
          expires: cert.expiryDate
        },
        credential: {
          id: cert.credentialId,
          url: cert.credentialUrl
        }
      }));
    }

    // Extract languages
    if (Array.isArray(resumeData.languages)) {
      sections.languages = resumeData.languages.map(lang => ({
        name: lang.name,
        proficiency: lang.proficiency,
        certification: lang.certification
      }));
    }

    // Extract projects
    if (Array.isArray(resumeData.projects)) {
      sections.projects = resumeData.projects.map(proj => ({
        name: proj.name,
        description: proj.description,
        url: proj.url,
        duration: {
          start: proj.startDate,
          end: proj.endDate
        },
        technologies: proj.technologies,
        achievements: proj.achievements
      }));
    }

  } catch (error) {
    issues.push('Error extracting resume content: ' + error.message);
  }

  return {
    isExtracted: issues.length === 0,
    sections,
    issues
  };
}; 