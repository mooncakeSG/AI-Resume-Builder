import React from 'react';

// Helper function to format dates
const formatDate = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } catch (error) {
    return date;
  }
};

const MinimalTemplate = ({ data }) => {
  const { personal, experience, education, skills, professionalLinks, certifications, languages, projects } = data || {};
  const fullName = personal ? `${personal.firstName} ${personal.lastName}` : '';

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-normal text-gray-900 mb-1">{fullName}</h1>
        <div className="text-sm text-gray-600 space-x-2">
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>• {personal.phone}</span>}
          {personal?.location && <span>• {personal.location}</span>}
        </div>
        {professionalLinks && (
          <div className="mt-2 text-sm text-gray-600 space-x-3">
            {professionalLinks.linkedin && (
              <a href={professionalLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                LinkedIn
              </a>
            )}
            {professionalLinks.github && (
              <>
                <span>•</span>
                <a href={professionalLinks.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                  GitHub
                </a>
              </>
            )}
            {professionalLinks.portfolio && (
              <>
                <span>•</span>
                <a href={professionalLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 transition-colors">
                  Portfolio
                </a>
              </>
            )}
            {professionalLinks.website && (
              <>
                <span>•</span>
                <a href={professionalLinks.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                  Website
                </a>
              </>
            )}
            {professionalLinks.twitter && (
              <>
                <span>•</span>
                <a href={professionalLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  Twitter
                </a>
              </>
            )}
            {professionalLinks.other && (
              <>
                <span>•</span>
                <a href={professionalLinks.other} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 transition-colors">
                  Other
                </a>
              </>
            )}
          </div>
        )}
      </header>

      {personal?.summary && (
        <section className="mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            {personal.summary}
          </p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{exp.company}</div>
                <p className="text-sm text-gray-600 mb-2">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{edu.school}</div>
                {edu.field && <div className="text-sm text-gray-600 mb-1">Field: {edu.field}</div>}
                {edu.description && <p className="text-sm text-gray-600 mb-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {languages?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Languages</h2>
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{lang.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{lang.proficiency}</span>
                  {lang.certification && (
                    <span className="text-xs text-gray-500">({lang.certification})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {certifications?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Certifications</h2>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{cert.name}</h3>
                  <span className="text-sm text-gray-500">
                    {cert.issueDate && `Issued: ${formatDate(cert.issueDate)}`}
                    {cert.expiryDate && ` - Expires: ${formatDate(cert.expiryDate)}`}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{cert.issuer}</div>
                {cert.credentialId && (
                  <div className="text-sm text-gray-600">ID: {cert.credentialId}</div>
                )}
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View Credential →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900">{project.name}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.achievements?.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {project.achievements.map((achievement, achieveIndex) => (
                      <li key={achieveIndex}>{achievement}</li>
                    ))}
                  </ul>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors block mt-1"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.references?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 mb-3">References</h2>
          <div className="space-y-4">
            {data.references.map((reference, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <h3 className="text-base font-medium text-gray-900">{reference.name}</h3>
                <p className="text-sm text-gray-700">{reference.position} at {reference.company}</p>
                <div className="text-sm text-gray-600 mt-1">
                  <p>{reference.email} • {reference.phone}</p>
                  <p className="text-sm text-gray-500 italic">{reference.relationship}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate; 