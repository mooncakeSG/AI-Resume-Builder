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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">References</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your professional references</p>
        </div>
        <button
          onClick={handleAddReference}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add Reference
        </button>
      </div>

      <div className="space-y-6">
        {references.map((reference, index) => (
          <div key={index} className="border dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Reference #{index + 1}</h3>
              <button
                onClick={() => handleRemoveReference(index)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Name
                </label>
                <input
                  type="text"
                  value={reference.name || ''}
                  onChange={(e) => handleUpdateReference(index, 'name', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Position
                </label>
                <input
                  type="text"
                  value={reference.position || ''}
                  onChange={(e) => handleUpdateReference(index, 'position', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  placeholder="Senior Manager"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Company
                </label>
                <input
                  type="text"
                  value={reference.company || ''}
                  onChange={(e) => handleUpdateReference(index, 'company', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  placeholder="Company Name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  value={reference.email || ''}
                  onChange={(e) => handleUpdateReference(index, 'email', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Phone
                </label>
                <input
                  type="tel"
                  value={reference.phone || ''}
                  onChange={(e) => handleUpdateReference(index, 'phone', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Relationship
                </label>
                <input
                  type="text"
                  value={reference.relationship || ''}
                  onChange={(e) => handleUpdateReference(index, 'relationship', e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
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