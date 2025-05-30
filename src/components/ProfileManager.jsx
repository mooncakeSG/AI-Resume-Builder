import React, { useState, useRef } from 'react';
import { useResume } from '../lib/data/ResumeContext';

export default function ProfileManager() {
  const {
    profiles,
    currentProfileId,
    createProfile,
    switchProfile,
    deleteProfile,
    renameProfile,
    exportProfile,
    importProfile
  } = useResume();

  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const fileInputRef = useRef();

  const handleCreateProfile = (e) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim());
      setNewProfileName('');
      setIsCreating(false);
    }
  };

  const handleStartRename = (profile) => {
    setEditingId(profile.id);
    setEditingName(profile.name);
  };

  const handleRename = (e) => {
    e.preventDefault();
    if (editingName.trim()) {
      renameProfile(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleDelete = (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      deleteProfile(profileId);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        importProfile(importedData);
      } catch (error) {
        console.error('Failed to parse imported file:', error);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset file input
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Resume Profiles</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Import
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            New Profile
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProfile} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Profile name"
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setNewProfileName('');
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {profiles.map(profile => (
          <div
            key={profile.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              profile.id === currentProfileId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {editingId === profile.id ? (
              <form onSubmit={handleRename} className="flex-1 flex gap-2 mr-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                  className="px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last modified: {new Date(profile.lastModified).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.id !== currentProfileId && (
                    <button
                      onClick={() => switchProfile(profile.id)}
                      className="px-2 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Switch
                    </button>
                  )}
                  <button
                    onClick={() => handleStartRename(profile)}
                    className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-700"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => exportProfile(profile.id)}
                    className="px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-700"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="px-2 py-1 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 