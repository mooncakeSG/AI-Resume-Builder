import { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Personal from './components/Personal'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Preview from './components/Preview'
import { ToastProvider, useToast } from './components/ui/ToastProvider'

const Layout = ({ children, resumeData, onReset }) => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">AI Resume Builder</h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-4">
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Personal
                </Link>
                <Link 
                  to="/experience" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/experience' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Experience
                </Link>
                <Link 
                  to="/education" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/education' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Education
                </Link>
                <Link 
                  to="/skills" 
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/skills' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Skills
                </Link>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <button
                onClick={onReset}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Reset all form data"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-8">
            {children}
          </div>
          
          {/* Preview Section */}
          <div className="sticky top-8 h-[calc(100vh-8rem)] overflow-auto">
            <Preview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}

const App = () => {
  const [resumeData, setResumeData] = useState(() => {
    try {
      const savedData = localStorage.getItem('resumeData')
      return savedData ? JSON.parse(savedData) : {
        personal: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          links: {}
        },
        experience: [],
        education: [],
        skills: []
      }
    } catch (error) {
      console.error('Error loading saved data:', error)
      return {
        personal: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          links: {}
        },
        experience: [],
        education: [],
        skills: []
      }
    }
  })

  const { showToast } = useToast()

  // Debounced localStorage update
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('resumeData', JSON.stringify(resumeData))
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [resumeData])

  const updateSection = useCallback((section, data) => {
    setResumeData(prev => {
      if (JSON.stringify(prev[section]) === JSON.stringify(data)) {
        return prev
      }
      return {
        ...prev,
        [section]: data
      }
    })
  }, [])

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data? This cannot be undone.')) {
      setResumeData({
        personal: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          links: {}
        },
        experience: [],
        education: [],
        skills: []
      })
      localStorage.removeItem('resumeData')
      showToast('Form data reset successfully', 'success')
    }
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout resumeData={resumeData} onReset={resetForm}>
                <Personal 
                  data={resumeData.personal} 
                  updateData={(data) => updateSection('personal', data)} 
                />
              </Layout>
            } 
          />
          <Route 
            path="/experience" 
            element={
              <Layout resumeData={resumeData} onReset={resetForm}>
                <Experience 
                  data={resumeData.experience} 
                  updateData={(data) => updateSection('experience', data)} 
                />
              </Layout>
            } 
          />
          <Route 
            path="/education" 
            element={
              <Layout resumeData={resumeData} onReset={resetForm}>
                <Education 
                  data={resumeData.education} 
                  updateData={(data) => updateSection('education', data)} 
                />
              </Layout>
            } 
          />
          <Route 
            path="/skills" 
            element={
              <Layout resumeData={resumeData} onReset={resetForm}>
                <Skills 
                  data={resumeData.skills} 
                  updateData={(data) => updateSection('skills', data)} 
                />
              </Layout>
            } 
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
