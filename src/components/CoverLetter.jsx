import React, { useState } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { useToast } from './ui/ToastProvider';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { inputStyles } from "@/lib/utils/styles";
import { cn } from "@/lib/utils";

const CoverLetter = () => {
  const { currentProfile, updateCurrentProfile } = useResume();
  const { showToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const coverLetter = currentProfile.data.coverLetter || {
    recipientName: '',
    recipientTitle: '',
    companyName: '',
    companyAddress: '',
    letterDate: new Date().toISOString().split('T')[0],
    greeting: '',
    content: '',
    closing: 'Sincerely',
  };

  const handleUpdateField = (field, value) => {
    const updatedCoverLetter = {
      ...coverLetter,
      [field]: value
    };
    
    updateCurrentProfile({
      ...currentProfile.data,
      coverLetter: updatedCoverLetter
    });
  };

  const generateCoverLetterContent = (resumeData, coverLetterData) => {
    const { personal, experience, skills } = resumeData;
    const { companyName, recipientTitle } = coverLetterData;

    // Extract relevant experience and skills
    const latestExperience = experience?.[0];
    const relevantSkills = skills?.slice(0, 5).join(', ');
    const yearsOfExperience = experience?.length > 0 
      ? Math.max(...experience.map(exp => {
          const start = new Date(exp.startDate);
          const end = exp.current ? new Date() : new Date(exp.endDate);
          return Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 365));
        }))
      : 0;

    // Generate a professional cover letter
    const paragraphs = [];

    // Opening paragraph
    paragraphs.push(
      `I am writing to express my strong interest in joining ${companyName} as a potential team member. With ${yearsOfExperience}+ years of experience in ${latestExperience?.position || 'the industry'}, I am confident in my ability to contribute effectively to your organization.`
    );

    // Skills and experience paragraph
    if (latestExperience) {
      paragraphs.push(
        `In my current role as ${latestExperience.position} at ${latestExperience.company}, I have developed extensive expertise in ${latestExperience.description}. My key skills include ${relevantSkills}, which align perfectly with the requirements of this position.`
      );
    }

    // Professional background paragraph
    if (personal?.summary) {
      paragraphs.push(personal.summary);
    }

    // Closing paragraph
    paragraphs.push(
      `I am particularly drawn to ${companyName} because of its reputation for excellence and innovation. I am excited about the possibility of bringing my unique blend of skills and experience to your team. I would welcome the opportunity to discuss how I can contribute to your organization's continued success.`
    );

    // Thank you
    paragraphs.push(
      `Thank you for considering my application. I look forward to the possibility of discussing this opportunity with you in detail.`
    );

    return paragraphs.join('\n\n');
  };

  const handleGenerateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      // Validate required fields
      if (!coverLetter.companyName) {
        showToast('Please enter the company name', 'error');
        return;
      }

      // Generate the cover letter content
      const generatedContent = generateCoverLetterContent(currentProfile.data, coverLetter);

      // Update the greeting if not set
      if (!coverLetter.greeting) {
        const greeting = coverLetter.recipientName 
          ? `Dear ${coverLetter.recipientName},`
          : coverLetter.recipientTitle
            ? `Dear ${coverLetter.recipientTitle},`
            : 'Dear Hiring Manager,';
        handleUpdateField('greeting', greeting);
      }

      // Update the content
      handleUpdateField('content', generatedContent);
      showToast('Cover letter generated successfully!', 'success');
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      showToast('Failed to generate cover letter. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cover Letter</h2>
        <Button 
          variant="default" 
          className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          onClick={handleGenerateCoverLetter}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Recipient's Name</label>
          <Input
            type="text"
            placeholder="Dr. Jane Smith"
            value={coverLetter.recipientName || ''}
            onChange={(e) => handleUpdateField('recipientName', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Recipient's Title</label>
          <Input
            type="text"
            placeholder="Hiring Manager"
            value={coverLetter.recipientTitle || ''}
            onChange={(e) => handleUpdateField('recipientTitle', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Company Name</label>
          <Input
            type="text"
            placeholder="Acme Corporation"
            value={coverLetter.companyName || ''}
            onChange={(e) => handleUpdateField('companyName', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Date</label>
          <Input
            type="date"
            value={coverLetter.letterDate || ''}
            onChange={(e) => handleUpdateField('letterDate', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className={inputStyles.formGroup}>
        <label className={inputStyles.label}>Company Address</label>
        <Textarea
          placeholder="123 Business Ave, Suite 100, City, State 12345"
          value={coverLetter.companyAddress || ''}
          onChange={(e) => handleUpdateField('companyAddress', e.target.value)}
          className="dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Greeting</label>
          <Input
            type="text"
            placeholder="Dear Dr. Smith,"
            value={coverLetter.greeting || ''}
            onChange={(e) => handleUpdateField('greeting', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        <div className={inputStyles.formGroup}>
          <label className={inputStyles.label}>Closing</label>
          <Input
            type="text"
            placeholder="Sincerely"
            value={coverLetter.closing || ''}
            onChange={(e) => handleUpdateField('closing', e.target.value)}
            className="dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <div className={inputStyles.formGroup}>
        <label className={inputStyles.label}>Letter Content</label>
        <Textarea
          placeholder="Write your cover letter content here..."
          value={coverLetter.content || ''}
          onChange={(e) => handleUpdateField('content', e.target.value)}
          className="min-h-[200px] dark:bg-gray-800 dark:text-gray-100"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
        <div className="prose max-w-none">
          <div className="mb-8">
            <p>{new Date(coverLetter.letterDate).toLocaleDateString()}</p>
            <p>{coverLetter.companyName}</p>
            <p style={{ whiteSpace: 'pre-line' }}>{coverLetter.companyAddress}</p>
          </div>
          
          <p className="mb-4">{coverLetter.greeting}</p>
          
          <div style={{ whiteSpace: 'pre-line' }} className="mb-4">
            {coverLetter.content}
          </div>
          
          <p>{coverLetter.closing},</p>
          <p>{currentProfile.data.personal?.firstName} {currentProfile.data.personal?.lastName}</p>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter; 