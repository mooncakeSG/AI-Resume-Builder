import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import ATSChecker from './ATSChecker';
import { analyzeJobMatch, optimizeKeywords } from '../lib/ai/contentGenerator';

// Mock the AI functions
vi.mock('../lib/ai/contentGenerator', () => ({
  analyzeJobMatch: vi.fn(),
  optimizeKeywords: vi.fn()
}));

describe('ATSChecker', () => {
  const mockResumeData = {
    personalDetails: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York, NY'
    },
    experience: [
      {
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: 'Developed web applications using React and Node.js'
      }
    ]
  };

  const mockAnalysis = {
    score: 85,
    analysis: {
      matched_keywords: ['React', 'Node.js'],
      missing_keywords: ['Python', 'AWS'],
      strength_areas: ['Strong frontend experience'],
      improvement_areas: ['Add cloud experience']
    }
  };

  const mockSuggestions = 'Add more keywords\nImprove job descriptions';

  beforeEach(() => {
    // Reset mock functions
    vi.clearAllMocks();
    
    // Setup default mock implementations
    analyzeJobMatch.mockResolvedValue(mockAnalysis);
    optimizeKeywords.mockResolvedValue(mockSuggestions);
  });

  it('renders the ATS checker form', () => {
    render(<ATSChecker resumeData={mockResumeData} />);
    
    expect(screen.getByText('ATS Compatibility Check')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check compatibility/i })).toBeInTheDocument();
  });

  it('handles empty job description', async () => {
    render(<ATSChecker resumeData={mockResumeData} />);
    
    const button = screen.getByRole('button', { name: /check compatibility/i });
    expect(button).toBeDisabled();
  });

  it('performs ATS analysis when job description is provided', async () => {
    render(<ATSChecker resumeData={mockResumeData} />);
    
    // Enter job description
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Looking for a React developer' } });
    
    // Click analyze button
    const button = screen.getByRole('button', { name: /check compatibility/i });
    fireEvent.click(button);

    // Check loading state
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();

    // Wait for analysis results
    await waitFor(() => {
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('Match Score')).toBeInTheDocument();
    });

    // Verify API calls
    expect(analyzeJobMatch).toHaveBeenCalled();
    expect(optimizeKeywords).toHaveBeenCalled();
  });

  it('displays analysis results correctly', async () => {
    render(<ATSChecker resumeData={mockResumeData} />);
    
    // Trigger analysis
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Job description' } });
    fireEvent.click(screen.getByRole('button', { name: /check compatibility/i }));

    // Wait for and verify results
    await waitFor(() => {
      // Check score
      expect(screen.getByText('85%')).toBeInTheDocument();
      
      // Check keywords
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('AWS')).toBeInTheDocument();
      
      // Check analysis sections
      expect(screen.getByText('Strengths')).toBeInTheDocument();
      expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    analyzeJobMatch.mockRejectedValue(new Error('API Error'));
    optimizeKeywords.mockRejectedValue(new Error('API Error'));

    render(<ATSChecker resumeData={mockResumeData} />);
    
    // Trigger analysis
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Job description' } });
    fireEvent.click(screen.getByRole('button', { name: /check compatibility/i }));

    // Wait for and verify error message
    await waitFor(() => {
      expect(screen.getByText('Failed to analyze resume. Please try again.')).toBeInTheDocument();
    });
  });

  it('displays different score colors based on match percentage', async () => {
    const testScores = [
      { score: 85, expectedColor: 'text-green-600' },
      { score: 65, expectedColor: 'text-yellow-600' },
      { score: 45, expectedColor: 'text-red-600' }
    ];

    for (const { score, expectedColor } of testScores) {
      analyzeJobMatch.mockResolvedValue({
        ...mockAnalysis,
        score
      });

      render(<ATSChecker resumeData={mockResumeData} />);
      
      // Trigger analysis
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Job description' } });
      fireEvent.click(screen.getByRole('button', { name: /check compatibility/i }));

      // Wait for and verify score color
      await waitFor(() => {
        const scoreElement = screen.getByText(`${score}%`);
        expect(scoreElement).toHaveClass(expectedColor);
      });
    }
  });
}); 