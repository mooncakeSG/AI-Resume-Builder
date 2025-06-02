import React from 'react';

const ProfessionalTemplate = ({ data }) => {
  const { personal, experience, education, skills } = data;
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