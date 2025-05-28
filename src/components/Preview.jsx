import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const Preview = ({ formData }) => {
  const resumeRef = useRef(null)

  const downloadPDF = async () => {
    const element = resumeRef.current
    const canvas = await html2canvas(element)
    const data = canvas.toDataURL('image/png')

    const pdf = new jsPDF()
    const imgProperties = pdf.getImageProperties(data)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('resume.pdf')
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div>
      <div ref={resumeRef} className="bg-white p-8 min-h-[1000px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{formData.personalDetails.fullName}</h1>
          <div className="text-gray-600">
            <p>{formData.personalDetails.email} • {formData.personalDetails.phone}</p>
            <p>{formData.personalDetails.address}</p>
          </div>
        </div>

        {/* Summary */}
        {formData.personalDetails.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3">Professional Summary</h2>
            <p className="text-gray-700">{formData.personalDetails.summary}</p>
          </div>
        )}

        {/* Experience */}
        {formData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3">Work Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-gray-700">{exp.company} - {exp.location}</p>
                  </div>
                  <p className="text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {formData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-gray-700">{edu.school}</p>
                  </div>
                  <p className="text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
                {edu.description && (
                  <p className="text-gray-700 mt-2 whitespace-pre-line">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {formData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 mb-3">Skills</h2>
            {formData.skills.map((skill, index) => (
              <div key={index} className="mb-3">
                <h3 className="font-bold">{skill.category}</h3>
                <p className="text-gray-700">{skill.skills}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={downloadPDF}
        className="mt-4 w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        Download PDF
      </button>
    </div>
  )
}

export default Preview 