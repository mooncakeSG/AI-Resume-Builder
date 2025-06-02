import React from 'react';
import { useResume } from '../lib/data/ResumeContext';

const References = () => {
  const { currentProfile, updateCurrentProfile } = useResume();
  const references = currentProfile.data.references || [];

  const handleAddReference = () => {
    const newReference = {
      name: '',
      position: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    
    updateCurrentProfile({
      ...currentProfile.data,
      references: [...references, newReference]
    });
  };

  const handleUpdateReference = (index, field, value) => {
    const updatedReferences = [...references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value
    };
    
    updateCurrentProfile({
      ...currentProfile.data,
      references: updatedReferences
    });
  };

  const handleRemoveReference = (index) => {
    const updatedReferences = references.filter((_, i) => i !== index);
    updateCurrentProfile({
      ...currentProfile.data,
      references: updatedReferences
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">References</h2>
        <button
          onClick={handleAddReference}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Reference
        </button>
      </div>

      <div className="space-y-6">
        {references.map((reference, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">Reference #{index + 1}</h3>
              <button
                onClick={() => handleRemoveReference(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={reference.name || ''}
                  onChange={(e) => handleUpdateReference(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  value={reference.position || ''}
                  onChange={(e) => handleUpdateReference(index, 'position', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Senior Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={reference.company || ''}
                  onChange={(e) => handleUpdateReference(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={reference.email || ''}
                  onChange={(e) => handleUpdateReference(index, 'email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={reference.phone || ''}
                  onChange={(e) => handleUpdateReference(index, 'phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={reference.relationship || ''}
                  onChange={(e) => handleUpdateReference(index, 'relationship', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Former Manager"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default References; 