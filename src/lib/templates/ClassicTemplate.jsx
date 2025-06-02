import React from 'react';

export const ClassicTemplate = ({ data, settings }) => {
  const { personal, education, experience, skills } = data;
  const { colorScheme, typography, spacing } = settings;

  // Helper function to safely get the summary text
  const getSummaryText = (summary) => {
    if (!summary) return '';
    if (typeof summary === 'string') return summary;
    if (typeof summary === 'object') {
      if (Array.isArray(summary)) {
        return summary[0]?.text || '';
      }
      return summary.text || summary.summary || '';
    }
    return '';
  };

  return (
    <div 
      className="classic-template grid grid-cols-3 gap-6"
      style={{
        fontFamily: typography.fontFamily,
        color: colorScheme.secondary,
        '--section-gap': spacing.sectionGap,
        '--item-gap': spacing.itemGap,
      }}
    >
      {/* Left Column */}
      <div className="col-span-1 bg-gray-50 p-6">
        {/* Personal Info */}
        <div className="mb-8">
          <h1 
            className="text-2xl font-bold mb-2"
            style={{ color: colorScheme.primary }}
          >
            {personal?.firstName}<br />{personal?.lastName}
          </h1>
          <div className="space-y-2 text-sm">
            {personal?.email && (
              <div>
                <a href={`mailto:${personal.email}`} className="hover:text-blue-600">
                  {personal.email}
                </a>
              </div>
            )}
            {personal?.phone && (
              <div>{personal.phone}</div>
            )}
            {personal?.location && (
              <div>{personal.location}</div>
            )}
          </div>
          {personal?.links && Object.entries(personal.links).length > 0 && (
            <div className="mt-4 space-y-2">
              {Object.entries(personal.links).map(([platform, url]) => (
                url && (
                  <div key={platform}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-blue-600"
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  </div>
                )
              ))}
            </div>
          )}
        </div>

        {/* Skills Section */}
        {skills?.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="text-sm py-1"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education?.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-medium" style={{ color: colorScheme.primary }}>
                    {edu.degree}
                  </h3>
                  <div className="text-sm">{edu.institution}</div>
                  {edu.location && (
                    <div className="text-sm opacity-75">{edu.location}</div>
                  )}
                  <div className="text-sm opacity-75">
                    {edu.startDate && (
                      <span>
                        {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {' - '}
                        {edu.current ? 'Present' : edu.endDate ? 
                          new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                      </span>
                    )}
                  </div>
                  {edu.achievements?.length > 0 && (
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      {edu.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="col-span-2 p-6">
        {/* Summary Section */}
        {personal?.summary && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-3 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed">
              {getSummaryText(personal.summary)}
            </p>
          </section>
        )}

        {/* Experience Section */}
        {experience?.length > 0 && (
          <section>
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <h3 className="font-medium text-base" style={{ color: colorScheme.primary }}>
                        {exp.position}
                      </h3>
                      <div className="font-medium">{exp.company}</div>
                    </div>
                    <div className="text-right opacity-75">
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
      </div>
    </div>
  );
}; 