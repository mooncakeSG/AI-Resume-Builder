import React from 'react';

const ModernTemplate = ({ data }) => {
  const { personal, experience, education, skills } = data;
  const fullName = personal ? `${personal.firstName} ${personal.lastName}` : '';

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{fullName}</h1>
        <div className="text-gray-600 flex justify-center items-center gap-4">
          {personal?.email && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {personal.email}
            </span>
          )}
          {personal?.phone && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {personal.phone}
            </span>
          )}
          {personal?.location && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {personal.location}
            </span>
          )}
        </div>
      </header>

      {personal?.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personal.summary}
          </p>
        </section>
      )}

      {experience?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-gray-600 text-sm">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-gray-800 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600 mb-3">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-600">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                  <span className="text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-gray-800 font-medium mb-1">{edu.school}</div>
                {edu.field && <div className="text-gray-600 mb-2">Field: {edu.field}</div>}
                {edu.description && <p className="text-gray-600 mb-3">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {data.references?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
            References
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.references.map((reference, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{reference.name}</h3>
                <p className="text-gray-700 font-medium">{reference.position}</p>
                <p className="text-gray-600">{reference.company}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">{reference.email}</p>
                  <p className="text-gray-600">{reference.phone}</p>
                  <p className="text-gray-600 italic">"{reference.relationship}"</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModernTemplate; 