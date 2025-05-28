import { useState, useEffect } from 'react'

const Skills = ({ data, updateData }) => {
  const [skillsList, setSkillsList] = useState(data || [])

  const addSkill = () => {
    setSkillsList(prev => [...prev, {
      category: '',
      skills: ''
    }])
  }

  const handleChange = (index, field, value) => {
    setSkillsList(prev => {
      const newList = [...prev]
      newList[index] = {
        ...newList[index],
        [field]: value
      }
      return newList
    })
  }

  const removeSkill = (index) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    updateData(skillsList)
  }, [skillsList, updateData])

  return (
    <div className="space-y-6">
      {skillsList.map((skill, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Skill Category #{index + 1}</h3>
            <button
              onClick={() => removeSkill(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              value={skill.category}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g., Programming Languages, Soft Skills, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <textarea
              value={skill.skills}
              onChange={(e) => handleChange(index, 'skills', e.target.value)}
              className="w-full p-2 border rounded-md h-24"
              placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addSkill}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Add Skill Category
      </button>
    </div>
  )
}

export default Skills 