import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import PersonalDetails from './components/PersonalDetails'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Preview from './components/Preview'
import { useToast } from './components/ui/ToastProvider'

function App() {
  const [formData, setFormData] = useState({
    personalDetails: {},
    education: [],
    experience: [],
    skills: []
  })
  const { showToast } = useToast()

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData')
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData))
        showToast('Resume data loaded successfully!', 'success')
      } catch (error) {
        console.error('Error loading saved data:', error)
        showToast('Failed to load saved data', 'error')
      }
    }
  }, [showToast])

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(formData))
  }, [formData])

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data? This cannot be undone.')) {
      setFormData({
        personalDetails: {},
        education: [],
        experience: [],
        skills: []
      })
      localStorage.removeItem('resumeData')
      showToast('Form data reset successfully', 'success')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center">AI Resume Builder</h1>
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Reset Form
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <PersonalDetails 
                data={formData.personalDetails}
                updateData={(data) => updateFormData('personalDetails', data)}
              />
            </TabsContent>
            
            <TabsContent value="education">
              <Education 
                data={formData.education}
                updateData={(data) => updateFormData('education', data)}
              />
            </TabsContent>
            
            <TabsContent value="experience">
              <Experience 
                data={formData.experience}
                updateData={(data) => updateFormData('experience', data)}
              />
            </TabsContent>
            
            <TabsContent value="skills">
              <Skills 
                data={formData.skills}
                updateData={(data) => updateFormData('skills', data)}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Preview formData={formData} />
        </div>
      </div>
    </div>
  )
}

export default App
