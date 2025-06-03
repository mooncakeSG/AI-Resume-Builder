import React from 'react';

const ProfessionalTemplate = ({ data, settings }) => {
  const { personal, experience, education, skills, professionalLinks } = data || {};
  const fullName = personal ? `${personal.firstName} ${personal.lastName}` : '';

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
        <div className="text-gray-600">
          {personal?.email && personal.email}
          {personal?.phone && ` • ${personal.phone}`}
          {personal?.location && ` • ${personal.location}`}
        </div>
        {professionalLinks && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            {professionalLinks.linkedin && (
              <a 
                href={professionalLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {professionalLinks.github && (
              <a 
                href={professionalLinks.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {professionalLinks.portfolio && (
              <a 
                href={professionalLinks.portfolio} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
                </svg>
                Portfolio
              </a>
            )}
            {professionalLinks.website && (
              <a 
                href={professionalLinks.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                </svg>
                Website
              </a>
            )}
            {professionalLinks.twitter && (
              <a 
                href={professionalLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-blue-400 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                Twitter
              </a>
            )}
            {professionalLinks.other && (
              <a 
                href={professionalLinks.other} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z"/>
                </svg>
                Other
              </a>
            )}
          </div>
        )}
      </header>

      {personal?.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Professional Summary</h2>
          <p className="text-gray-700">
            {personal.summary}
          </p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-800">{exp.position}</h3>
                <span className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="text-gray-700 font-medium">{exp.company}</div>
              <p className="text-gray-600 mt-1">{exp.description}</p>
              {exp.achievements?.length > 0 && (
                <ul className="list-disc list-inside mt-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-gray-600">{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-lg font-medium text-gray-800">{edu.degree}</h3>
                <span className="text-gray-600 text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-gray-700 font-medium">{edu.school}</div>
              {edu.field && <div className="text-gray-600">Field: {edu.field}</div>}
              {edu.description && <p className="text-gray-600 mt-1">{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.references?.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">References</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.references.map((reference, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-medium text-gray-800">{reference.name}</h3>
                  <span className="text-gray-600">{reference.company}</span>
                </div>
                <p className="text-gray-700">{reference.position}</p>
                <div className="mt-2 text-gray-600">
                  <p>{reference.email} • {reference.phone}</p>
                  <p className="italic mt-1">{reference.relationship}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate; 