import React from 'react';

export const MinimalTemplate = ({ data, settings }) => {
  const { personal, education, experience, skills } = data;
  const { colorScheme, typography, spacing } = settings;

  return (
    <div 
      className="minimal-template"
      style={{
        fontFamily: typography.fontFamily,
        color: colorScheme.secondary,
        '--section-gap': spacing.sectionGap,
        '--item-gap': spacing.itemGap,
      }}
    >
      {/* Header Section */}
      <header className="mb-8">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{ color: colorScheme.primary }}
        >
          {personal?.firstName} {personal?.lastName}
        </h1>
        <div className="space-y-1">
          {personal?.email && (
            <a href={`mailto:${personal.email}`} className="block text-sm hover:text-blue-600">
              {personal.email}
            </a>
          )}
          {personal?.phone && (
            <div className="text-sm">
              {personal.phone}
            </div>
          )}
          {personal?.location && (
            <div className="text-sm">
              {personal.location}
            </div>
          )}
        </div>
        {personal?.links && Object.entries(personal.links).length > 0 && (
          <div className="flex gap-4 mt-2">
            {Object.entries(personal.links).map(([platform, url]) => (
              url && (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-blue-600"
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
            className="text-lg font-medium mb-2 uppercase tracking-wide"
            style={{ color: colorScheme.primary }}
          >
            About
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
            className="text-lg font-medium mb-4 uppercase tracking-wide"
            style={{ color: colorScheme.primary }}
          >
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium">{exp.position}</h3>
                    <div className="text-sm opacity-75">{exp.company}</div>
                  </div>
                  <div className="text-right text-sm opacity-75">
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
                  <div className="text-sm opacity-75 mb-2">{exp.location}</div>
                )}
                {exp.description && (
                  <p className="mb-2 text-sm">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 opacity-90">
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
            className="text-lg font-medium mb-4 uppercase tracking-wide"
            style={{ color: colorScheme.primary }}
          >
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <div className="opacity-75">{edu.institution}</div>
                  </div>
                  <div className="text-right opacity-75">
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
                  <div className="text-sm opacity-75">{edu.location}</div>
                )}
                {edu.achievements?.length > 0 && (
                  <ul className="list-disc list-inside mt-2 space-y-1 opacity-90">
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
            className="text-lg font-medium mb-3 uppercase tracking-wide"
            style={{ color: colorScheme.primary }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-200 rounded-sm text-sm"
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