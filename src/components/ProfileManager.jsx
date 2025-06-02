import React, { useState, useRef } from 'react';
import { useResume } from '../lib/data/ResumeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resume Profiles</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <Button
            onClick={() => setIsCreating(true)}
          >
            New Profile
          </Button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateProfile} className="flex gap-2">
          <Input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Profile name"
            autoFocus
          />
          <Button type="submit">
            Create
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsCreating(false);
              setNewProfileName('');
            }}
          >
            Cancel
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {profiles.map(profile => (
          <Card
            key={profile.id}
            className={profile.id === currentProfileId ? 'border-primary' : ''}
          >
            <CardContent className="flex items-center justify-between p-4">
              {editingId === profile.id ? (
                <form onSubmit={handleRename} className="flex-1 flex gap-2">
                  <Input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(null);
                      setEditingName('');
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <>
                  <div className="flex-1">
                    <h3 className="font-medium">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last modified: {new Date(profile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {profile.id !== currentProfileId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => switchProfile(profile.id)}
                      >
                        Switch
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartRename(profile)}
                    >
                      Rename
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportProfile(profile.id)}
                    >
                      Export
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(profile.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 