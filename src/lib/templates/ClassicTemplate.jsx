import React from 'react';

export const ClassicTemplate = ({ data, settings }) => {
  const { personal, education, experience, skills, professionalLinks, certifications, languages, projects } = data || {};
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
      className="classic-template grid grid-cols-3 gap-6 min-h-full print:text-black print:bg-white"
      style={{
        fontFamily: typography.fontFamily,
        color: colorScheme.secondary,
        '--section-gap': spacing.sectionGap,
        '--item-gap': spacing.itemGap,
        '@media print': {
          color: '#000',
          backgroundColor: '#fff'
        }
      }}
    >
      {/* Left Column */}
      <div className="col-span-1 bg-gray-50 p-6 flex flex-col print:bg-white print:text-black">
        {/* Personal Info */}
        <div className="mb-8">
          <h1 
            className="text-2xl font-bold mb-4"
            style={{ color: colorScheme.primary }}
          >
            {personal?.firstName} {personal?.lastName}
          </h1>
          <div className="space-y-2 text-sm">
            {personal?.email && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href={`mailto:${personal.email}`} className="hover:text-blue-600 break-all">
                  {personal.email}
                </a>
              </div>
            )}
            {personal?.phone && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="break-all">{personal.phone}</span>
              </div>
            )}
            {personal?.location && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="break-all">{personal.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {skills?.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {languages?.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Languages
            </h2>
            <div className="space-y-3">
              {languages.map((lang, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs mt-1">
                    <span className="bg-gray-200 px-2 py-0.5 rounded">
                      {lang.proficiency}
                    </span>
                  </div>
                  {lang.certification && (
                    <div className="text-xs mt-1 text-gray-600">
                      {lang.certification}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Links */}
        {professionalLinks && Object.values(professionalLinks).some(link => link) && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Links
            </h2>
            <div className="space-y-2">
              {professionalLinks.linkedin && (
                <div>
                  <a
                    href={professionalLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              )}
              {professionalLinks.github && (
                <div>
                  <a
                    href={professionalLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-gray-900 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </div>
              )}
              {professionalLinks.portfolio && (
                <div>
                  <a
                    href={professionalLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-purple-600 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
                    </svg>
                    Portfolio
                  </a>
                </div>
              )}
              {professionalLinks.website && (
                <div>
                  <a
                    href={professionalLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-green-600 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                    </svg>
                    Website
                  </a>
                </div>
              )}
              {professionalLinks.twitter && (
                <div>
                  <a
                    href={professionalLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-400 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                  </a>
                </div>
              )}
              {professionalLinks.other && (
                <div>
                  <a
                    href={professionalLinks.other}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-gray-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z"/>
                    </svg>
                    Other
                  </a>
                </div>
              )}
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
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
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
                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-1" style={{ color: colorScheme.primary }}>Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects?.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-base font-semibold">{project.name}</h3>
                    <span className="text-sm text-gray-600">
                      {project.startDate && `${project.startDate}`}
                      {project.endDate ? ` - ${project.endDate}` : ' - Present'}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{project.description}</p>
                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs px-2 py-0.5 bg-gray-100 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.achievements?.length > 0 && (
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {project.achievements.map((achievement, achieveIndex) => (
                        <li key={achieveIndex} className="text-gray-700">{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      View Project →
                    </a>
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
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="text-sm bg-white p-3 rounded-md shadow-sm">
                  <h3 className="font-medium" style={{ color: colorScheme.primary }}>
                    {edu.degree}
                  </h3>
                  <div className="text-sm font-medium">{edu.school}</div>
                  {edu.location && (
                    <div className="text-sm opacity-75">{edu.location}</div>
                  )}
                  <div className="text-sm opacity-75 mt-1">
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
                        <li key={i} className="break-words">{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications?.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              Certifications
            </h2>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-base font-semibold">{cert.name}</h3>
                    <span className="text-sm text-gray-600">
                      {cert.issueDate && `Issued: ${cert.issueDate}`}
                      {cert.expiryDate && ` - Expires: ${cert.expiryDate}`}
                    </span>
                  </div>
                  <div className="text-sm font-medium mb-1">{cert.issuer}</div>
                  {cert.credentialId && (
                    <div className="text-xs text-gray-600">
                      Credential ID: {cert.credentialId}
                    </div>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      View Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References Section */}
        {data.references?.length > 0 && (
          <section className="mb-8">
            <h2 
              className="text-lg font-bold mb-4 pb-2 border-b"
              style={{ color: colorScheme.primary, borderColor: colorScheme.accent }}
            >
              References
            </h2>
            <div className="space-y-6">
              {data.references.map((reference, index) => (
                <div key={index} className="text-sm">
                  <h3 className="font-medium text-base" style={{ color: colorScheme.primary }}>
                    {reference.name}
                  </h3>
                  <div className="font-medium">{reference.position}</div>
                  <div className="text-sm opacity-75">{reference.company}</div>
                  {reference.email && (
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a href={`mailto:${reference.email}`} className="hover:text-blue-600">
                        {reference.email}
                      </a>
                    </div>
                  )}
                  {reference.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{reference.phone}</span>
                    </div>
                  )}
                  {reference.relationship && (
                    <div className="mt-1 text-sm opacity-75">
                      Relationship: {reference.relationship}
                    </div>
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