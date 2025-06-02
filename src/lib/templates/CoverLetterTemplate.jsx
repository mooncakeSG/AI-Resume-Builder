import React from 'react';

const CoverLetterTemplate = ({ data }) => {
  const { personal, coverLetter } = data;

  if (!coverLetter) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      {/* Header with personal info */}
      <div className="mb-8 text-right">
        <p className="font-medium text-gray-900">
          {personal?.firstName} {personal?.lastName}
        </p>
        {personal?.email && <p className="text-gray-700">{personal.email}</p>}
        {personal?.phone && <p className="text-gray-700">{personal.phone}</p>}
        {personal?.location && <p className="text-gray-700">{personal.location}</p>}
      </div>

      {/* Date */}
      <div className="mb-6">
        <p className="text-gray-700">
          {new Date(coverLetter.letterDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Recipient Info */}
      <div className="mb-6">
        {coverLetter.recipientName && (
          <p className="text-gray-900">{coverLetter.recipientName}</p>
        )}
        {coverLetter.recipientTitle && (
          <p className="text-gray-900">{coverLetter.recipientTitle}</p>
        )}
        {coverLetter.companyName && (
          <p className="text-gray-900">{coverLetter.companyName}</p>
        )}
        {coverLetter.companyAddress && (
          <p className="text-gray-900 whitespace-pre-line">
            {coverLetter.companyAddress}
          </p>
        )}
      </div>

      {/* Greeting */}
      <div className="mb-6">
        <p className="text-gray-900">{coverLetter.greeting || 'Dear Hiring Manager,'}</p>
      </div>

      {/* Content */}
      <div className="mb-8">
        <div className="text-gray-800 whitespace-pre-line leading-relaxed">
          {coverLetter.content}
        </div>
      </div>

      {/* Closing */}
      <div>
        <p className="text-gray-900 mb-8">{coverLetter.closing || 'Sincerely'},</p>
        <p className="text-gray-900 font-medium">
          {personal?.firstName} {personal?.lastName}
        </p>
      </div>
    </div>
  );
};

export default CoverLetterTemplate; 