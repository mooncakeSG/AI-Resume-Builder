import { formatDate } from '../../utils/date'

const ProfessionalTemplate = ({ formData, settings = {} }) => {
  const {
    primaryColor = '#2563eb', // blue-600
    secondaryColor = '#1e40af', // blue-800
    textColor = '#1f2937', // gray-800
    accentColor = '#e5e7eb', // gray-200
  } = settings

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
    <div className="bg-white min-h-[1000px] max-w-[800px] mx-auto">
      {/* Left Column */}
      <div className="grid grid-cols-3">
        <div className="col-span-1 bg-gray-50 p-6" style={{ backgroundColor: accentColor }}>
          {/* Contact Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>Contact</h2>
            <div className="space-y-2 text-sm">
              <p>{formData.personalDetails.email}</p>
              <p>{formData.personalDetails.phone}</p>
              <p>{formData.personalDetails.address}</p>
              <div className="pt-2 space-y-1">
                <SocialLink href={formData.personalDetails.linkedin}>LinkedIn</SocialLink>
                <SocialLink href={formData.personalDetails.github}>GitHub</SocialLink>
                <SocialLink href={formData.personalDetails.website}>Website</SocialLink>
              </div>
            </div>
          </div>

          {/* Skills */}
          {formData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4" style={{ color: primaryColor }}>Skills</h2>
              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-sm" style={{ color: secondaryColor }}>{skill.category}</h3>
                    <p className="text-sm text-gray-600">{skill.skills}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-2 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: textColor }}>{formData.personalDetails.fullName}</h1>
            {formData.personalDetails.summary && (
              <p className="text-gray-600 leading-relaxed">{formData.personalDetails.summary}</p>
            )}
          </div>

          {/* Experience */}
          {formData.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ color: primaryColor }}>Experience</h2>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ color: textColor }}>{exp.position}</h3>
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
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ color: primaryColor }}>Education</h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ color: textColor }}>{edu.degree} in {edu.fieldOfStudy}</h3>
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
        </div>
      </div>
    </div>
  )
}

export default ProfessionalTemplate 