import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';

const FEEDBACK_STORAGE_KEY = 'resume-feedback-data';
const MAX_FEEDBACK_ENTRIES = 100;

// Structure to store feedback data
const feedbackStore = {
  contentEdits: [],
  suggestionAcceptance: {},
  templatePreferences: {},
};

// Load existing feedback data
const loadFeedbackData = () => {
  try {
    const savedData = loadFromLocalStorage(FEEDBACK_STORAGE_KEY);
    if (savedData) {
      Object.assign(feedbackStore, savedData);
    }
  } catch (error) {
    console.error('Error loading feedback data:', error);
  }
};

// Initialize feedback store
loadFeedbackData();

// Store content edit feedback
export const storeFeedback = (section, originalContent, userEdits) => {
  try {
    // Calculate difference between original and edited content
    const feedback = {
      section,
      timestamp: new Date().toISOString(),
      original: originalContent,
      edited: userEdits,
    };

    // Add to feedback store
    feedbackStore.contentEdits.push(feedback);

    // Maintain maximum size
    if (feedbackStore.contentEdits.length > MAX_FEEDBACK_ENTRIES) {
      feedbackStore.contentEdits.shift();
    }

    // Save updated feedback
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, feedbackStore);

    return true;
  } catch (error) {
    console.error('Error storing feedback:', error);
    return false;
  }
};

// Track suggestion acceptance
export const trackSuggestionAcceptance = (suggestionType, accepted) => {
  try {
    if (!feedbackStore.suggestionAcceptance[suggestionType]) {
      feedbackStore.suggestionAcceptance[suggestionType] = {
        accepted: 0,
        rejected: 0,
      };
    }

    if (accepted) {
      feedbackStore.suggestionAcceptance[suggestionType].accepted++;
    } else {
      feedbackStore.suggestionAcceptance[suggestionType].rejected++;
    }

    saveToLocalStorage(FEEDBACK_STORAGE_KEY, feedbackStore);
    return true;
  } catch (error) {
    console.error('Error tracking suggestion acceptance:', error);
    return false;
  }
};

// Store template preference
export const storeTemplatePreference = (templateId, industry) => {
  try {
    if (!feedbackStore.templatePreferences[industry]) {
      feedbackStore.templatePreferences[industry] = {};
    }

    if (!feedbackStore.templatePreferences[industry][templateId]) {
      feedbackStore.templatePreferences[industry][templateId] = 0;
    }

    feedbackStore.templatePreferences[industry][templateId]++;
    saveToLocalStorage(FEEDBACK_STORAGE_KEY, feedbackStore);
    return true;
  } catch (error) {
    console.error('Error storing template preference:', error);
    return false;
  }
};

// Get recommended template for industry
export const getRecommendedTemplate = (industry) => {
  try {
    const industryPreferences = feedbackStore.templatePreferences[industry];
    if (!industryPreferences) return null;

    // Find template with highest usage for industry
    return Object.entries(industryPreferences)
      .sort(([, a], [, b]) => b - a)
      [0]?.[0] || null;
  } catch (error) {
    console.error('Error getting template recommendation:', error);
    return null;
  }
};

// Analyze feedback to improve content suggestions
export const analyzeUserFeedback = () => {
  try {
    const analysis = {
      commonEdits: {},
      sectionPreferences: {},
      suggestionEffectiveness: {},
    };

    // Analyze content edits
    feedbackStore.contentEdits.forEach(edit => {
      if (!analysis.sectionPreferences[edit.section]) {
        analysis.sectionPreferences[edit.section] = {
          editCount: 0,
          averageEditSize: 0,
        };
      }

      analysis.sectionPreferences[edit.section].editCount++;
      // Add more detailed analysis as needed
    });

    // Analyze suggestion acceptance rates
    Object.entries(feedbackStore.suggestionAcceptance).forEach(([type, data]) => {
      const total = data.accepted + data.rejected;
      analysis.suggestionEffectiveness[type] = {
        acceptanceRate: total > 0 ? (data.accepted / total) * 100 : 0,
        totalSuggestions: total,
      };
    });

    return analysis;
  } catch (error) {
    console.error('Error analyzing feedback:', error);
    return null;
  }
};

// Use feedback to improve content suggestions
export const improveContentSuggestions = (section, currentSuggestions) => {
  try {
    const analysis = analyzeUserFeedback();
    if (!analysis) return currentSuggestions;

    // Apply feedback-based improvements
    const improved = currentSuggestions.map(suggestion => {
      // Add improvement logic based on feedback analysis
      return suggestion;
    });

    return improved;
  } catch (error) {
    console.error('Error improving suggestions:', error);
    return currentSuggestions;
  }
}; 