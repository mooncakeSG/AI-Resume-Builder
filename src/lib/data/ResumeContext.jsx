import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useToast } from '../../components/ui/ToastProvider';

const STORAGE_KEY = 'resumeProfiles';
const CURRENT_PROFILE_KEY = 'currentProfile';

const ResumeContext = createContext();

const defaultProfile = {
  id: 'default',
  name: 'Default Profile',
  lastModified: new Date().toISOString(),
  data: {
    personal: {},
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
    references: [],
    coverLetter: {
      jobDetails: {
        company: '',
        position: '',
        jobDescription: '',
        requirements: '',
        hiringManager: ''
      },
      content: ''
    }
  }
};

export function ResumeProvider({ children }) {
  const { showToast } = useToast();
  
  // Initialize profiles state
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem(STORAGE_KEY);
    if (savedProfiles) {
      try {
        const parsed = JSON.parse(savedProfiles);
        return parsed;
      } catch {
        return [defaultProfile];
      }
    }
    return [defaultProfile];
  });

  // Initialize current profile state
  const [currentProfileId, setCurrentProfileId] = useState(() => {
    const savedId = localStorage.getItem(CURRENT_PROFILE_KEY);
    return savedId || 'default';
  });

  // Get current profile data
  const currentProfile = profiles.find(p => p.id === currentProfileId) || defaultProfile;

  // Save profiles to localStorage
  const saveProfiles = useCallback((newProfiles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfiles));
    setProfiles(newProfiles);
  }, []);

  // Create a new profile
  const createProfile = useCallback((name) => {
    const newProfile = {
      id: `profile-${Date.now()}`,
      name,
      lastModified: new Date().toISOString(),
      data: {
        personal: {},
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        references: [],
        coverLetter: {
          jobDetails: {
            company: '',
            position: '',
            jobDescription: '',
            requirements: '',
            hiringManager: ''
          },
          content: ''
        }
      }
    };

    const newProfiles = [...profiles, newProfile];
    saveProfiles(newProfiles);
    setCurrentProfileId(newProfile.id);
    showToast('New profile created successfully', 'success');
    return newProfile;
  }, [profiles, saveProfiles, showToast]);

  // Update current profile data
  const updateCurrentProfile = useCallback((data) => {
    // Ensure all required sections exist when updating
    const safeData = {
      personal: {},
      education: [],
      experience: [],
      skills: [],
      certifications: [],
      languages: [],
      projects: [],
      references: [],
      coverLetter: {
        jobDetails: {
          company: '',
          position: '',
          jobDescription: '',
          requirements: '',
          hiringManager: ''
        },
        content: ''
      },
      ...data // Merge with provided data
    };

    const updatedProfiles = profiles.map(profile => 
      profile.id === currentProfileId
        ? {
            ...profile,
            lastModified: new Date().toISOString(),
            data: safeData
          }
        : profile
    );
    saveProfiles(updatedProfiles);
  }, [currentProfileId, profiles, saveProfiles]);

  // Switch to a different profile
  const switchProfile = useCallback((profileId) => {
    if (profiles.some(p => p.id === profileId)) {
      setCurrentProfileId(profileId);
      localStorage.setItem(CURRENT_PROFILE_KEY, profileId);
      showToast('Switched to different profile', 'success');
    }
  }, [profiles, showToast]);

  // Delete a profile
  const deleteProfile = useCallback((profileId) => {
    if (profiles.length === 1) {
      showToast('Cannot delete the last profile', 'error');
      return;
    }

    const newProfiles = profiles.filter(p => p.id !== profileId);
    saveProfiles(newProfiles);

    if (profileId === currentProfileId) {
      const newCurrentId = newProfiles[0].id;
      setCurrentProfileId(newCurrentId);
      localStorage.setItem(CURRENT_PROFILE_KEY, newCurrentId);
    }

    showToast('Profile deleted successfully', 'success');
  }, [profiles, currentProfileId, saveProfiles, showToast]);

  // Rename a profile
  const renameProfile = useCallback((profileId, newName) => {
    const updatedProfiles = profiles.map(profile =>
      profile.id === profileId
        ? { ...profile, name: newName }
        : profile
    );
    saveProfiles(updatedProfiles);
    showToast('Profile renamed successfully', 'success');
  }, [profiles, saveProfiles, showToast]);

  // Export profile data
  const exportProfile = useCallback((profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return null;

    const exportData = {
      ...profile,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.toLowerCase().replace(/\s+/g, '-')}-resume.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Profile exported successfully', 'success');
  }, [profiles, showToast]);

  // Import profile data
  const importProfile = useCallback((importedData) => {
    try {
      // Ensure all required sections exist in the imported data
      const safeData = {
        personal: {},
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        languages: [],
        projects: [],
        references: [],
        coverLetter: {
          jobDetails: {
            company: '',
            position: '',
            jobDescription: '',
            requirements: '',
            hiringManager: ''
          },
          content: ''
        },
        ...importedData.data // Merge with imported data if it exists
      };

      const profile = {
        id: `profile-${Date.now()}`,
        name: importedData.name || 'Imported Profile',
        lastModified: new Date().toISOString(),
        data: safeData
      };

      // Update profiles with the new imported profile
      const newProfiles = [...profiles, profile];
      saveProfiles(newProfiles);
      setCurrentProfileId(profile.id);
      showToast('Profile imported successfully', 'success');
    } catch (error) {
      console.error('Import error:', error);
      showToast('Failed to import profile. Please check the file format.', 'error');
    }
  }, [profiles, saveProfiles, showToast]);

  // Reset current profile to default state
  const resetCurrentProfile = useCallback(() => {
    const updatedProfiles = profiles.map(profile =>
      profile.id === currentProfileId
        ? {
            ...profile,
            lastModified: new Date().toISOString(),
            data: {
              personal: {},
              education: [],
              experience: [],
              skills: [],
              certifications: [],
              languages: [],
              projects: [],
              references: [],
              coverLetter: {
                jobDetails: {
                  company: '',
                  position: '',
                  jobDescription: '',
                  requirements: '',
                  hiringManager: ''
                },
                content: ''
              }
            }
          }
        : profile
    );
    saveProfiles(updatedProfiles);
    showToast('Profile reset successfully', 'success');
  }, [currentProfileId, profiles, saveProfiles, showToast]);

  const value = {
    profiles,
    currentProfile,
    currentProfileId,
    createProfile,
    updateCurrentProfile,
    switchProfile,
    deleteProfile,
    renameProfile,
    exportProfile,
    importProfile,
    resetCurrentProfile
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
} 