import React, { useState, useEffect } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import AISuggest from './AISuggest';

const CoverLetter = ({ data, onChange }) => {
  const { currentProfile, updateCurrentProfile } = useResume();
  const resumeData = currentProfile?.data;
  const [jobDetails, setJobDetails] = useState(resumeData?.coverLetter?.jobDetails || {
    company: '',
    position: '',
    jobDescription: '',
    requirements: '',
    hiringManager: ''
  });
  const [coverLetter, setCoverLetter] = useState(resumeData?.coverLetter?.content || '');

  // Update resume data when cover letter changes
  useEffect(() => {
    if (resumeData) {
      const updatedData = {
        ...resumeData,
        coverLetter: {
          jobDetails,
          content: coverLetter,
          personal: resumeData.personal // Include personal info for the template
        }
      };
      updateCurrentProfile(updatedData);
      if (onChange) {
        onChange(updatedData.coverLetter);
      }
    }
  }, [jobDetails, coverLetter, resumeData?.personal]);

  const handleJobDetailsChange = (field, value) => {
    setJobDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoverLetterSuggestion = (suggestion) => {
    setCoverLetter(suggestion);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6 border dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobDetails.company}
              onChange={(e) => handleJobDetailsChange('company', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Acme Corporation"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobDetails.position}
              onChange={(e) => handleJobDetailsChange('position', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Hiring Manager's Name
            </label>
            <input
              type="text"
              value={jobDetails.hiringManager}
              onChange={(e) => handleJobDetailsChange('hiringManager', e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={jobDetails.jobDescription}
            onChange={(e) => handleJobDetailsChange('jobDescription', e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Key Requirements
          </label>
          <textarea
            value={jobDetails.requirements}
            onChange={(e) => handleJobDetailsChange('requirements', e.target.value)}
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="List the key requirements or qualifications..."
          />
        </div>

        <div className="flex justify-end">
          <AISuggest
            type="coverletter"
            data={{
              jobDetails,
              resume: resumeData
            }}
            onSuggestionSelect={handleCoverLetterSuggestion}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4 border dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Generated Cover Letter</h3>
        </div>
        
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          rows={12}
          placeholder="Your cover letter will appear here after generation..."
        />
      </div>
    </div>
  );
};

export default CoverLetter; 