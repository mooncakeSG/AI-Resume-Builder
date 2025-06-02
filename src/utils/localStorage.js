const STORAGE_KEY = 'ai-resume-builder-data';

export const saveToLocalStorage = (data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serializedData);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Auto-save functionality with debounce
let saveTimeout = null;
export const debouncedSave = (data, delay = 1000) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    saveToLocalStorage(data);
  }, delay);
};

// Version control (for future migrations)
const CURRENT_VERSION = '1.0';

export const getStorageVersion = () => {
  return localStorage.getItem('ai-resume-builder-version') || '1.0';
};

export const setStorageVersion = () => {
  localStorage.setItem('ai-resume-builder-version', CURRENT_VERSION);
};

// Export history management
export const saveExportHistory = (exportData) => {
  try {
    const history = JSON.parse(localStorage.getItem('export-history') || '[]');
    history.push({
      ...exportData,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 10 exports
    const trimmedHistory = history.slice(-10);
    localStorage.setItem('export-history', JSON.stringify(trimmedHistory));
    return true;
  } catch (error) {
    console.error('Error saving export history:', error);
    return false;
  }
};

export const getExportHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('export-history') || '[]');
  } catch (error) {
    console.error('Error loading export history:', error);
    return [];
  }
}; 