import { useState, useEffect } from 'react'

const Experience = ({ data, updateData }) => {
  const [experienceList, setExperienceList] = useState(data || [])

  const addExperience = () => {
    setExperienceList(prev => [...prev, {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }])
  }

  const handleChange = (index, field, value) => {
    setExperienceList(prev => {
      const newList = [...prev]
      newList[index] = {
        ...newList[index],
        [field]: value
      }
      return newList
    })
  }

  const removeExperience = (index) => {
    setExperienceList(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    updateData(experienceList)
  }, [experienceList, updateData])

  return (
    <div className="space-y-6">
      {experienceList.map((exp, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
            <button
              onClick={() => removeExperience(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Job Title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => handleChange(index, 'location', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="City, Country"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`current-${index}`}
              checked={exp.current}
              onChange={(e) => handleChange(index, 'current', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor={`current-${index}`} className="text-sm">
              I currently work here
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-2 border rounded-md h-32"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Experience
      </button>
    </div>
  )
}

export default Experience 