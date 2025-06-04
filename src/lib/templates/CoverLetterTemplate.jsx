import React from 'react';

const CoverLetterTemplate = ({ data, settings = {} }) => {
  const { coverLetter = {}, personal = {} } = data || {};
  const { jobDetails = {}, content = '' } = coverLetter;
  const { darkMode = false } = settings;

  if (!content) return null;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="print-area w-[210mm] min-h-[297mm] bg-white mx-auto shadow-lg transform-gpu" style={{ transform: 'scale(1)', transformOrigin: 'center top', padding: '10mm' }}>
      <div className={`h-full ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Header with personal info */}
        <div className="mb-8 text-right">
          <p className="font-medium text-lg">
            {personal?.firstName} {personal?.lastName}
          </p>
          {personal?.email && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{personal.email}</p>}
          {personal?.phone && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{personal.phone}</p>}
          {personal?.location && <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{personal.location}</p>}
        </div>

        {/* Date */}
        <div className="mb-6">
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {today}
          </p>
        </div>

        {/* Recipient Info */}
        <div className="mb-6">
          {jobDetails?.hiringManager && (
            <p className="text-lg">{jobDetails.hiringManager}</p>
          )}
          {jobDetails?.position && (
            <p>{jobDetails.position}</p>
          )}
          {jobDetails?.company && (
            <p>{jobDetails.company}</p>
          )}
        </div>

        {/* Greeting */}
        <div className="mb-6">
          <p className="text-lg">
            {jobDetails?.hiringManager ? `Dear ${jobDetails.hiringManager},` : 'Dear Hiring Manager,'}
          </p>
        </div>

        {/* Content */}
        <div className="mb-8">
          <div className={`whitespace-pre-line leading-relaxed`}>
            {content}
          </div>
        </div>

        {/* Closing */}
        <div>
          <p className="mb-8">Sincerely,</p>
          <p className="font-medium text-lg">
            {personal?.firstName} {personal?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTemplate; 