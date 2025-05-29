import { formatDate } from '../../utils/date'

const ModernTemplate = ({ formData }) => {
  const SocialLink = ({ href, children }) => (
    href ? (
      <a 
        href={href.startsWith('http') ? href : `https://${href}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        {children}
      </a>
    ) : null
  )

  return (
    <div className="bg-white p-8 min-h-[1000px] max-w-[800px] mx-auto">
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">{formData.personalDetails.fullName}</h1>
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span>{formData.personalDetails.email}</span>
            <span>•</span>
            <span>{formData.personalDetails.phone}</span>
          </p>
          <p>{formData.personalDetails.address}</p>
          <div className="flex items-center justify-center gap-4 mt-2">
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
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3 text-gray-800">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{formData.personalDetails.summary}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Work Experience</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-700">
                    {exp.company}
                    {exp.location && ` • ${exp.location}`}
                    {exp.website && (
                      <span className="ml-2">
                        (<a href={exp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Website</a>)
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </p>
              </div>
              {exp.technologies && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Technologies:</span> {exp.technologies}
                </p>
              )}
              <p className="text-gray-700 mt-2 whitespace-pre-line leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-gray-700">
                    {edu.school}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">
                  {formatDate(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}
                </p>
              </div>
              {edu.gpa && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">GPA:</span> {edu.gpa}
                </p>
              )}
              {edu.description && (
                <p className="text-gray-700 mt-2 whitespace-pre-line leading-relaxed">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {formData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold text-gray-800">{skill.category}</h3>
                <p className="text-gray-700">{skill.skills}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModernTemplate 