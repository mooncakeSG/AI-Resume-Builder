import { useState, useEffect } from 'react'

const Education = ({ data, updateData }) => {
  const [educationList, setEducationList] = useState(data || [])

  const addEducation = () => {
    setEducationList(prev => [...prev, {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    }])
  }

  const handleChange = (index, field, value) => {
    setEducationList(prev => {
      const newList = [...prev]
      newList[index] = {
        ...newList[index],
        [field]: value
      }
      return newList
    })
  }

  const removeEducation = (index) => {
    setEducationList(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    updateData(educationList)
  }, [educationList, updateData])

  return (
    <div className="space-y-6">
      {educationList.map((edu, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Education #{index + 1}</h3>
            <button
              onClick={() => removeEducation(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">School/University</label>
              <input
                type="text"
                value={edu.school}
                onChange={(e) => handleChange(index, 'school', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="University Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Computer Science"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={edu.description}
              onChange={(e) => handleChange(index, 'description', e.target.value)}
              className="w-full p-2 border rounded-md h-24"
              placeholder="Describe your achievements, activities, etc."
            />
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Education
      </button>
    </div>
  )
}

export default Education 