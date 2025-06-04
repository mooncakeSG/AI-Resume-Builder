import React, { useState, useRef } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Import, Plus, ArrowRightLeft, Edit2, Download, Trash2, RotateCcw } from 'lucide-react';

export default function ProfileManager() {
  const {
    profiles,
    currentProfileId,
    createProfile,
    switchProfile,
    deleteProfile,
    renameProfile,
    exportProfile,
    importProfile,
    resetCurrentProfile
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
        
        // Validate the imported data structure
        if (!importedData || typeof importedData !== 'object') {
          throw new Error('Invalid file format: Expected an object');
        }

        // Check if it's a profile export or just resume data
        const dataToImport = importedData.data ? importedData : { data: importedData };

        // Validate required sections exist
        const requiredSections = ['personal', 'education', 'experience', 'skills'];
        const missingRequiredSections = requiredSections.filter(section => 
          !dataToImport.data || !dataToImport.data[section]
        );

        if (missingRequiredSections.length > 0) {
          throw new Error(`Missing required sections: ${missingRequiredSections.join(', ')}`);
        }

        // Import the profile
        importProfile(dataToImport);
      } catch (error) {
        console.error('Failed to parse imported file:', error);
        alert(`Import failed: ${error.message || 'Invalid file format'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset file input
  };

  const handleReset = (profileId) => {
    if (window.confirm('Are you sure you want to reset this profile? This will clear all data and cannot be undone.')) {
      resetCurrentProfile();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold">Resume Profiles</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => fileInputRef.current?.click()}
          >
            <Import className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button
            size="sm"
            className="flex-1 sm:flex-none"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Profile
          </Button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProfile} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Profile name"
            autoFocus
            className="flex-1"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="flex-1 sm:flex-none">
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => {
                setIsCreating(false);
                setNewProfileName('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {profiles.map(profile => (
          <Card
            key={profile.id}
            className={profile.id === currentProfileId ? 'border-primary' : ''}
          >
            <CardContent className="p-3">
              {editingId === profile.id ? (
                <form onSubmit={handleRename} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="flex-1 sm:flex-none">
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        setEditingId(null);
                        setEditingName('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last modified: {new Date(profile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {profile.id !== currentProfileId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => switchProfile(profile.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Switch
                      </Button>
                    )}
                    {profile.id === currentProfileId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReset(profile.id)}
                        className="flex-1 sm:flex-none"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartRename(profile)}
                      className="flex-1 sm:flex-none"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Rename
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportProfile(profile.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(profile.id)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 