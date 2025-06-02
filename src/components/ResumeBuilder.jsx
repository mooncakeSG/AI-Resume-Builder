import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton
} from '@mui/material';
import ATSAnalysis from './ATSAnalysis';
import AISuggest from './AISuggest';
import { checkATSCompatibility } from '../lib/ai/AIService';
import PersonalDetails from './PersonalDetails';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';

// Default resume data structure
const DEFAULT_RESUME_DATA = {
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    industry: '',
    summary: '',
    links: {}
  },
  skills: [],
  experience: [
    {
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    }
  ],
  education: [
    {
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: []
    }
  ]
};

const ResumeBuilder = () => {
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME_DATA);
  const [activeTab, setActiveTab] = useState(0);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsError, setAtsError] = useState(null);
  const [summarySuggestions, setSummarySuggestions] = useState([]);

  const handlePersonalDetailsChange = (personalDetails) => {
    setResumeData(prev => {
      // Extract summary text from various possible formats
      let summaryText = '';
      const summaryData = personalDetails.summary;
      
      if (typeof summaryData === 'string') {
        summaryText = summaryData;
      } else if (typeof summaryData === 'object' && summaryData !== null) {
        summaryText = summaryData.text || summaryData.summary || '';
      } else if (Array.isArray(summaryData)) {
        summaryText = summaryData[0]?.text || summaryData[0] || '';
      } else {
        summaryText = String(summaryData || '');
      }

      return {
        ...prev,
        personal: {
          ...prev.personal,
          ...personalDetails,
          summary: summaryText
        }
      };
    });
  };

  const handleExperienceChange = (experience) => {
    setResumeData(prev => ({
      ...prev,
      experience
    }));
  };

  const handleEducationChange = (education) => {
    setResumeData(prev => ({
      ...prev,
      education
    }));
  };

  const handleSkillsChange = (skills) => {
    setResumeData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleATSCheck = async (jobDescription = '') => {
    setAtsLoading(true);
    setAtsError(null);
    try {
      const analysis = await checkATSCompatibility(resumeData, jobDescription);
      setAtsAnalysis(analysis);
    } catch (error) {
      setAtsError('Failed to analyze ATS compatibility. Please try again.');
      console.error('ATS analysis error:', error);
    } finally {
      setAtsLoading(false);
    }
  };

  const handleSummaryChange = (event) => {
    setResumeData(prev => ({
      ...prev,
      summary: event.target.value
    }));
  };

  const handleSummarySuggestion = (suggestions) => {
    setSummarySuggestions(suggestions);
  };

  const handleSummarySuggestionSelect = (suggestion) => {
    setResumeData(prev => ({
      ...prev,
      summary: suggestion.text
    }));
    setSummarySuggestions([]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    {
      label: 'Personal Details',
      content: (
        <Box sx={{ p: 2 }}>
          <PersonalDetails
            data={resumeData.personal}
            onChange={(updatedPersonal) =>
              setResumeData((prev) => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  ...updatedPersonal,
                  summary:
                    typeof updatedPersonal.summary === 'object' && updatedPersonal.summary !== null
                      ? updatedPersonal.summary.summary || updatedPersonal.summary.text || ''
                      : (updatedPersonal.summary !== undefined ? updatedPersonal.summary : prev.personal.summary)
                },
              }))
            }
          />
        </Box>
      )
    },
    {
      label: 'Experience',
      content: (
        <Box sx={{ p: 2 }}>
          <Experience
            data={resumeData.experience}
            onChange={handleExperienceChange}
          />
        </Box>
      )
    },
    {
      label: 'Education',
      content: (
        <Box sx={{ p: 2 }}>
          <Education
            data={resumeData.education}
            onChange={handleEducationChange}
          />
        </Box>
      )
    },
    {
      label: 'Skills',
      content: (
        <Box sx={{ p: 2 }}>
          <Skills
            data={resumeData.skills}
            onChange={handleSkillsChange}
          />
        </Box>
      )
    },
    {
      label: 'ATS Check',
      content: (
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleATSCheck()}
              disabled={atsLoading}
              sx={{ mr: 2 }}
            >
              Check ATS Compatibility
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                const jobDescription = prompt('Please paste the job description for targeted analysis:');
                if (jobDescription) {
                  handleATSCheck(jobDescription);
                }
              }}
              disabled={atsLoading}
            >
              Analyze with Job Description
            </Button>
          </Box>
          <ATSAnalysis
            analysisData={atsAnalysis}
            loading={atsLoading}
            error={atsError}
          />
        </Box>
      )
    }
  ];

  return (
    <Container maxWidth="lg">
      <Paper sx={{ mt: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>
        {tabs[activeTab].content}
      </Paper>
    </Container>
  );
};

export default ResumeBuilder; 