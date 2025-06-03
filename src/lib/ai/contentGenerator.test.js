import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateContent, optimizeKeywords, analyzeJobMatch } from './contentGenerator';
import { Groq } from 'groq-sdk';

// Mock environment variables
vi.stubEnv('VITE_GROQ_API_KEY', 'mock-api-key');

// Mock Groq SDK
vi.mock('groq-sdk', () => {
  const mockCreate = vi.fn();
  return {
    Groq: vi.fn(() => ({
      chat: {
        completions: {
          create: mockCreate
        }
      }
    }))
  };
});

describe('Content Generator', () => {
  const mockGroqResponse = {
    choices: [{
      message: {
        content: 'Mock response content'
      }
    }]
  };

  const mockAnalysisResponse = {
    choices: [{
      message: {
        content: JSON.stringify({
          score: 85,
          analysis: {
            matched_keywords: ['React', 'Node.js'],
            missing_keywords: ['Python'],
            strength_areas: ['Frontend development'],
            improvement_areas: ['Add more backend skills']
          }
        })
      }
    }]
  };

  let mockGroqInstance;
  let createMock;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock environment variable
    vi.stubEnv('VITE_GROQ_API_KEY', 'mock-api-key');

    // Get the mock create function
    createMock = Groq().chat.completions.create;
  });

  describe('generateContent', () => {
    it('generates content successfully', async () => {
      // Setup mock response
      createMock.mockResolvedValueOnce(mockGroqResponse);

      // Test function
      const result = await generateContent('Software Engineer', 'Technology', 'Test input');

      // Verify result
      expect(result).toBe('Mock response content');
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('Technology')
          }),
          expect.objectContaining({
            role: 'user',
            content: expect.stringContaining('Test input')
          })
        ])
      }));
    });

    it('handles API errors gracefully', async () => {
      // Setup mock to throw error
      createMock.mockRejectedValueOnce(new Error('API Error'));

      // Test function and verify error handling
      await expect(generateContent('Software Engineer', 'Technology', 'Test input'))
        .rejects
        .toThrow('An error occurred while generating content');
    });
  });

  describe('analyzeJobMatch', () => {
    it('analyzes job match successfully', async () => {
      // Setup mock response
      createMock.mockResolvedValueOnce(mockAnalysisResponse);

      // Test function
      const result = await analyzeJobMatch('Resume content', 'Job description');

      // Verify result
      expect(result).toEqual({
        score: 85,
        analysis: {
          matched_keywords: ['React', 'Node.js'],
          missing_keywords: ['Python'],
          strength_areas: ['Frontend development'],
          improvement_areas: ['Add more backend skills']
        }
      });
    });

    it('handles non-JSON responses', async () => {
      // Setup mock with non-JSON response
      const nonJsonResponse = {
        choices: [{
          message: {
            content: 'Score: 75\nAnalysis: Good match'
          }
        }]
      };

      createMock.mockResolvedValueOnce(nonJsonResponse);

      // Test function
      const result = await analyzeJobMatch('Resume content', 'Job description');

      // Verify fallback parsing
      expect(result.score).toBe(75);
      expect(result.analysis).toBe('Score: 75\nAnalysis: Good match');
    });

    it('ensures score is between 0 and 100', async () => {
      // Test cases for score normalization
      const testCases = [
        { score: 150, expected: 100 },
        { score: -20, expected: 0 },
        { score: 85.7, expected: 86 }
      ];

      for (const { score, expected } of testCases) {
        const response = {
          choices: [{
            message: {
              content: JSON.stringify({
                score,
                analysis: {}
              })
            }
          }]
        };

        createMock.mockResolvedValueOnce(response);

        const result = await analyzeJobMatch('Resume content', 'Job description');
        expect(result.score).toBe(expected);
      }
    });

    it('handles API errors', async () => {
      // Setup mock to throw error
      createMock.mockRejectedValueOnce(new Error('API Error'));

      // Test function and verify error handling
      await expect(analyzeJobMatch('Resume content', 'Job description'))
        .rejects
        .toThrow('An error occurred while generating content');
    });
  });

  describe('optimizeKeywords', () => {
    it('optimizes keywords successfully', async () => {
      // Setup mock response
      createMock.mockResolvedValueOnce(mockGroqResponse);

      // Test function
      const result = await optimizeKeywords('Resume content', 'Job description');

      // Verify result
      expect(result).toBe('Mock response content');
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: expect.stringContaining('ATS optimization')
          })
        ])
      }));
    });

    it('handles missing API key', async () => {
      // Remove API key and reset modules
      vi.stubEnv('VITE_GROQ_API_KEY', '');
      vi.resetModules();

      // Re-import the module to get fresh instance
      const { optimizeKeywords: freshOptimizeKeywords } = await import('./contentGenerator');

      // Test function
      await expect(freshOptimizeKeywords('Resume content', 'Job description'))
        .rejects
        .toThrow('API client not initialized');
    });

    it('handles API errors', async () => {
      // Setup mock to throw error
      createMock.mockRejectedValueOnce(new Error('API Error'));

      // Test function and verify error handling
      await expect(optimizeKeywords('Resume content', 'Job description'))
        .rejects
        .toThrow('An error occurred while generating content');
    });
  });
}); 