import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import PersonalDetails from './components/PersonalDetails'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Preview from './components/Preview'

function App() {
  const [formData, setFormData] = useState({
    personalDetails: {},
    education: [],
    experience: [],
    skills: []
  })

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">AI Resume Builder</h1>
      
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
