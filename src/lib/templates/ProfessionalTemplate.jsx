import React from 'react';

export const ProfessionalTemplate = ({ data, settings }) => {
  const { personal, education, experience, skills } = data;
  const { colorScheme, typography, spacing } = settings;

  return (
    <div 
      className="professional-template"
      style={{
        fontFamily: typography.fontFamily,
        color: colorScheme.secondary,
        '--section-gap': spacing.sectionGap,
        '--item-gap': spacing.itemGap,
      }}
    >
      {/* Header Section */}
      <header className="border-b-2 pb-6 mb-8" style={{ borderColor: colorScheme.primary }}>
        <h1 
          className="text-4xl font-serif mb-2 text-center"
          style={{ color: colorScheme.primary }}
        >
          {personal?.firstName} {personal?.lastName}
        </h1>
        <div className="flex justify-center gap-6 text-sm">
          {personal?.email && (
            <a href={`mailto:${personal.email}`} className="hover:text-blue-600">
              {personal.email}
            </a>
          )}
          {personal?.phone && (
            <span>{personal.phone}</span>
          )}
          {personal?.location && (
            <span>{personal.location}</span>
          )}
        </div>
        {personal?.links && Object.entries(personal.links).length > 0 && (
          <div className="flex justify-center gap-6 mt-2 text-sm">
            {Object.entries(personal.links).map(([platform, url]) => (
              url && (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              )
            ))}
          </div>
        )}
      </header>

      {/* Summary Section */}
      {personal?.summary && (
        <section className="mb-8">
          <h2 
            className="text-xl font-serif mb-3 pb-1 border-b"
            style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
          >
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience Section */}
      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-xl font-serif mb-4 pb-1 border-b"
            style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
          >
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <h3 className="font-semibold text-base" style={{ color: colorScheme.primary }}>
                      {exp.position}
                    </h3>
                    <div className="font-medium">{exp.company}</div>
                  </div>
                  <div className="text-right">
                    {exp.startDate && (
                      <span>
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {exp.current ? 'Present' : exp.endDate ? 
                          new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    )}
                  </div>
                </div>
                {exp.location && (
                  <div className="text-sm italic mb-2">{exp.location}</div>
                )}
                {exp.description && (
                  <p className="mb-2 text-sm">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education?.length > 0 && (
        <section className="mb-8">
          <h2 
            className="text-xl font-serif mb-4 pb-1 border-b"
            style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-semibold text-base" style={{ color: colorScheme.primary }}>
                      {edu.degree}
                    </h3>
                    <div className="font-medium">{edu.institution}</div>
                  </div>
                  <div className="text-right">
                    {edu.startDate && (
                      <span>
                        {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {edu.current ? 'Present' : edu.endDate ? 
                          new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    )}
                  </div>
                </div>
                {edu.location && (
                  <div className="text-sm italic">{edu.location}</div>
                )}
                {edu.achievements?.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills?.length > 0 && (
        <section>
          <h2 
            className="text-xl font-serif mb-3 pb-1 border-b"
            style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
          >
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm"
                style={{ 
                  backgroundColor: `${colorScheme.primary}10`,
                  color: colorScheme.primary,
                  borderRadius: '2px'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}; 