import React from 'react';

const CreativeTemplate = ({ data }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="mb-10 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -z-10 opacity-50" />
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
          {data.fullName}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center hover:text-purple-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {data.email}
            </a>
          )}
          {data.phone && (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {data.location}
            </span>
          )}
        </div>
      </header>

      {data.summary && (
        <section className="mb-10 relative">
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -z-10 opacity-30" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {typeof data.summary === 'object' ? data.summary.text : data.summary}
          </p>
        </section>
      )}

      {data.experience?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
            Experience
          </h2>
          <div className="space-y-8">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-300 before:to-blue-300">
                <div className="absolute left-0 top-2 w-2 h-2 bg-purple-400 rounded-full -translate-x-[3px]" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                  <span className="text-purple-600 text-sm font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-blue-600 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600 mb-3">{exp.description}</p>
                {exp.achievements?.length > 0 && (
                  <ul className="list-none space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-600 flex items-start">
                        <span className="text-purple-400 mr-2">›</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
            Education
          </h2>
          <div className="space-y-6">
            {data.education.map((edu, index) => (
              <div key={index} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-purple-300 before:to-blue-300">
                <div className="absolute left-0 top-2 w-2 h-2 bg-purple-400 rounded-full -translate-x-[3px]" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{edu.degree}</h3>
                  <span className="text-purple-600 text-sm font-medium">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-blue-600 font-medium mb-1">{edu.school}</div>
                {edu.field && <div className="text-gray-600 mb-2">Field: {edu.field}</div>}
                {edu.description && <p className="text-gray-600 mb-3">{edu.description}</p>}
                {edu.achievements?.length > 0 && (
                  <ul className="list-none space-y-2">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-600 flex items-start">
                        <span className="text-purple-400 mr-2">›</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 rounded-full text-sm font-medium hover:from-purple-200 hover:to-blue-200 transition-colors"
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

export default CreativeTemplate; 