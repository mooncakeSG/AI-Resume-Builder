import { useState, useEffect } from 'react'
import AISuggest from './AISuggest'

const Skills = ({ data = [], updateData }) => {
  const [skills, setSkills] = useState(data)

  useEffect(() => {
    setSkills(data)
  }, [data])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateData(skills)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [skills, updateData])

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setSkills(newSkills)
  }

  const handleSkillsSuggestion = (suggestion) => {
    try {
      const suggestedSkills = JSON.parse(suggestion)
      setSkills(prev => {
        const newSkills = [...prev]
        suggestedSkills.forEach(skill => {
          if (!newSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase())) {
            newSkills.push(skill)
          }
        })
        return newSkills
      })
    } catch (err) {
      console.error('Failed to parse skills suggestion:', err)
    }
  }

  const addSkill = () => {
    setSkills(prev => [...prev, { name: '', proficiency: 'Intermediate' }])
  }

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8 bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          <p className="text-sm text-gray-500 mt-1">Add your technical and professional skills</p>
        </div>
        <AISuggest
          type="skills"
          onSuggestionSelect={handleSkillsSuggestion}
          context={{
            title: data.title,
            experience: data.experience
          }}
        />
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-4 group">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter skill (e.g., JavaScript, Project Management)"
              />
            </div>
            <select
              value={skill.proficiency}
              onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)}
              className="w-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              onClick={() => removeSkill(index)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSkill}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
      >
        + Add Skill
      </button>
    </div>
  )
}

export default Skills 