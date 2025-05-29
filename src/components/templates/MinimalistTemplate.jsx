import { formatDate } from '../../utils/date'

const MinimalistTemplate = ({ formData }) => {
  const SocialLink = ({ href, children }) => (
    href ? (
      <a 
        href={href.startsWith('http') ? href : `https://${href}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-800 transition-colors"
      >
        {children}
      </a>
    ) : null
  )

  return (
    <div className="bg-white p-8 min-h-[1000px] max-w-[800px] mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-light mb-4 text-gray-900">{formData.personalDetails.fullName}</h1>
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center gap-4">
            <span>{formData.personalDetails.email}</span>
            <span>•</span>
            <span>{formData.personalDetails.phone}</span>
          </p>
          <p className="text-sm">{formData.personalDetails.address}</p>
          <div className="flex items-center gap-4 mt-2">
            <SocialLink href={formData.personalDetails.linkedin}>
              LinkedIn
            </SocialLink>
            <SocialLink href={formData.personalDetails.github}>
              GitHub
            </SocialLink>
            <SocialLink href={formData.personalDetails.website}>
              Website
            </SocialLink>
          </div>
        </div>
      </div>

      {/* Summary */}
      {formData.personalDetails.summary && (
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-3 text-gray-900">Summary</h2>
          <p className="text-gray-600 leading-relaxed">{formData.personalDetails.summary}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-6 text-gray-900">Experience</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <p className="text-gray-600">
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
              {exp.technologies && (
                <p className="text-sm text-gray-500 mb-2">
                  {exp.technologies}
                </p>
              )}
              <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-6 text-gray-900">Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-gray-600">
                    {edu.school}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p className="text-sm text-gray-500">
                  GPA: {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-medium mb-6 text-gray-900">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.skills.map((skill, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-900 mb-1">{skill.category}</h3>
                <p className="text-gray-600 text-sm">{skill.skills}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MinimalistTemplate 