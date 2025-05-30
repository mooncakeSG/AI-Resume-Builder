import { useRef, useEffect, memo } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useToast } from './ui/ToastProvider'

const Preview = memo(({ data }) => {
  const previewRef = useRef(null)
  const { showToast } = useToast()

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const downloadPDF = async () => {
    try {
      const element = previewRef.current
      if (!element) {
        showToast('Preview element not found', 'error')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

      // Generate filename from personal details or use default
      const fileName = data?.personal?.name 
        ? `${data.personal.name.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`
        : 'resume.pdf'

      pdf.save(fileName)
      showToast('PDF downloaded successfully!', 'success')
    } catch (error) {
      console.error('PDF generation error:', error)
      showToast('Failed to generate PDF. Please try again.', 'error')
    }
  }

  if (!data || !data.personal) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="text-center text-gray-500">
          No resume data available. Start filling out the form to see the preview.
        </div>
      </div>
    )
  }

  // Normalize data structure
  const normalizedData = {
    personal: data.personal || {},
    experience: Array.isArray(data.experience) ? data.experience : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : []
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Download PDF
        </button>
      </div>

      <div ref={previewRef} className="bg-white p-8 shadow-inner rounded-lg">
        {/* Personal Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{normalizedData.personal.name || 'Your Name'}</h1>
          <div className="text-gray-600 mb-4">
            {[
              normalizedData.personal.email,
              normalizedData.personal.phone,
              normalizedData.personal.location
            ].filter(Boolean).join(' • ')}
          </div>
          {normalizedData.personal.summary && (
            <p className="text-gray-700 whitespace-pre-line">{normalizedData.personal.summary}</p>
          )}
          {normalizedData.personal.links && Object.keys(normalizedData.personal.links).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {Object.entries(normalizedData.personal.links).map(([platform, url]) => (
                url && (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                )
              ))}
            </div>
          )}
        </div>

        {/* Experience Section */}
        {normalizedData.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
            {normalizedData.experience.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                    <div className="text-gray-600">{exp.company}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mb-2 whitespace-pre-line">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-700">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {normalizedData.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            {normalizedData.education.map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{edu.school}</h3>
                    <div className="text-gray-600">{edu.degree} in {edu.field}</div>
                  </div>
                  <div className="text-gray-500 text-sm">
                    {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-700 mb-2 whitespace-pre-line">{edu.description}</p>
                )}
                {edu.achievements?.length > 0 && (
                  <ul className="list-disc list-inside space-y-1">
                    {edu.achievements.map((achievement, i) => (
                      <li key={i} className="text-gray-700">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        {normalizedData.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {normalizedData.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{skill.name}</span>
                  <span className="text-gray-500 text-sm">{skill.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

Preview.displayName = 'Preview'

export default Preview 