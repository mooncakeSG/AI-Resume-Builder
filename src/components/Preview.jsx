import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useToast } from './ui/ToastProvider'

const Preview = ({ formData }) => {
  const resumeRef = useRef(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const { showToast } = useToast()

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const element = resumeRef.current
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      const data = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgProperties = pdf.getImageProperties(data)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${formData.personalDetails.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
      showToast('PDF downloaded successfully!', 'success')
    } catch (error) {
      console.error('PDF generation error:', error)
      showToast('Failed to generate PDF. Please try again.', 'error')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const SocialLink = ({ href, children }) => (
    href ? (
      <a 
        href={href.startsWith('http') ? href : `https://${href}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        {children}
      </a>
    ) : null
  )

  return (
    <div className="relative">
      <div 
        ref={resumeRef} 
        className="bg-white p-8 min-h-[1000px] shadow-lg max-w-[800px] mx-auto print:shadow-none print:p-0"
      >
        {/* Header */}
        <div className="text-center mb-8 border-b pb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{formData.personalDetails.fullName}</h1>
          <div className="text-gray-600 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <span>{formData.personalDetails.email}</span>
              <span>•</span>
              <span>{formData.personalDetails.phone}</span>
            </p>
            <p>{formData.personalDetails.address}</p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <SocialLink href={formData.personalDetails.linkedin}>
                LinkedIn
              </SocialLink>
              <SocialLink href={formData.personalDetails.github}>
                GitHub
              </SocialLink>
              <SocialLink href={formData.personalDetails.website}>
                Website
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Summary */}
        {formData.personalDetails.summary && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3 text-gray-800">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{formData.personalDetails.summary}</p>
          </div>
        )}

        {/* Experience */}
        {formData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{exp.position}</h3>
                    <p className="text-gray-700">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                      {exp.website && (
                        <span className="ml-2">
                          (<a href={exp.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Website</a>)
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                {exp.technologies && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Technologies:</span> {exp.technologies}
                  </p>
                )}
                <p className="text-gray-700 mt-2 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {formData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-gray-700">
                      {edu.school}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {formatDate(edu.startDate)} - {edu.currentlyStudying ? 'Present' : formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.gpa && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">GPA:</span> {edu.gpa}
                  </p>
                )}
                {edu.description && (
                  <p className="text-gray-700 mt-2 whitespace-pre-line leading-relaxed">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {formData.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-4 text-gray-800">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.skills.map((skill, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-bold text-gray-800">{skill.category}</h3>
                  <p className="text-gray-700">{skill.skills}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 left-0 right-0 flex justify-center gap-4 print:hidden">
        <button
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingPDF ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating PDF...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </>
          )}
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
          </svg>
          Print
        </button>
      </div>
    </div>
  )
}

export default Preview 