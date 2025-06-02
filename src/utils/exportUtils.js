import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Packer } from 'docx';
import { getTemplateSettings } from '../lib/templates/templateConfig';

// Convert resume data to DOCX format
export const exportToDocx = async (resumeData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Header with contact info
        new Paragraph({
          text: resumeData.personalInfo.name,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun(resumeData.personalInfo.email),
            new TextRun(' | '),
            new TextRun(resumeData.personalInfo.phone),
            new TextRun(' | '),
            new TextRun(resumeData.personalInfo.location)
          ]
        }),
        
        // Professional Summary
        new Paragraph({
          text: 'Professional Summary',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: resumeData.summary,
          spacing: { after: 200 }
        }),
        
        // Work Experience
        new Paragraph({
          text: 'Work Experience',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        ...generateWorkExperience(resumeData.experience),
        
        // Education
        new Paragraph({
          text: 'Education',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        ...generateEducation(resumeData.education),
        
        // Skills
        new Paragraph({
          text: 'Skills',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 }
        }),
        ...generateSkills(resumeData.skills)
      ]
    }]
  });

  const buffer = await doc.save();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.docx`);
};

// Helper functions for DOCX generation
const generateWorkExperience = (experience) => {
  return experience.map(job => [
    new Paragraph({
      children: [
        new TextRun({
          text: job.company,
          bold: true
        }),
        new TextRun(' | '),
        new TextRun({
          text: job.position,
          italics: true
        })
      ],
      spacing: { before: 200 }
    }),
    new Paragraph({
      text: `${job.startDate} - ${job.endDate}`,
      spacing: { before: 100 }
    }),
    ...job.responsibilities.map(resp => 
      new Paragraph({
        text: `• ${resp}`,
        spacing: { before: 100 }
      })
    )
  ]).flat();
};

const generateEducation = (education) => {
  return education.map(edu => [
    new Paragraph({
      children: [
        new TextRun({
          text: edu.institution,
          bold: true
        }),
        new TextRun(' | '),
        new TextRun({
          text: edu.degree,
          italics: true
        })
      ],
      spacing: { before: 200 }
    }),
    new Paragraph({
      text: `${edu.startDate} - ${edu.endDate}`,
      spacing: { before: 100 }
    })
  ]).flat();
};

const generateSkills = (skills) => {
  const skillsTable = new Table({
    rows: [
      new TableRow({
        children: skills.map(skill => 
          new TableCell({
            children: [new Paragraph(skill)],
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE }
            }
          })
        )
      })
    ]
  });
  
  return [skillsTable];
};

// Export to HTML
export const exportToHtml = (resumeData) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${resumeData.personalInfo.name} - Resume</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 { color: #2c3e50; }
        h2 { 
          color: #34495e;
          border-bottom: 2px solid #eee;
          padding-bottom: 5px;
        }
        .contact-info {
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
        }
        .company, .institution {
          font-weight: bold;
        }
        .position, .degree {
          font-style: italic;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .skill {
          background: #f0f2f5;
          padding: 5px 10px;
          border-radius: 3px;
        }
      </style>
    </head>
    <body>
      <h1>${resumeData.personalInfo.name}</h1>
      <div class="contact-info">
        ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}
      </div>
      
      <h2>Professional Summary</h2>
      <p>${resumeData.summary}</p>
      
      <h2>Work Experience</h2>
      ${resumeData.experience.map(job => `
        <div class="experience-item">
          <div><span class="company">${job.company}</span> | <span class="position">${job.position}</span></div>
          <div>${job.startDate} - ${job.endDate}</div>
          <ul>
            ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
      
      <h2>Education</h2>
      ${resumeData.education.map(edu => `
        <div class="education-item">
          <div><span class="institution">${edu.institution}</span> | <span class="degree">${edu.degree}</span></div>
          <div>${edu.startDate} - ${edu.endDate}</div>
        </div>
      `).join('')}
      
      <h2>Skills</h2>
      <div class="skills">
        ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.html`);
};

// Export HTML to DOCX
export const htmlToDocx = (html) => {
  const converted = htmlDocx.asBlob(html);
  saveAs(converted, 'resume.docx');
};

// Helper function to format date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Helper to create section content
const createSectionContent = (data) => {
  let content = '';
  if (data.summary) content += `\nSummary:\n${data.summary}\n`;
  
  if (data.experience?.length) {
    content += '\nExperience:\n';
    data.experience.forEach(exp => {
      content += `${exp.position} at ${exp.company}\n`;
      content += `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}\n`;
      if (exp.responsibilities) {
        exp.responsibilities.forEach(resp => content += `• ${resp}\n`);
      }
      content += '\n';
    });
  }

  if (data.education?.length) {
    content += '\nEducation:\n';
    data.education.forEach(edu => {
      content += `${edu.degree} in ${edu.field}\n`;
      content += `${edu.school}\n`;
      content += `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}\n\n`;
    });
  }

  if (data.skills?.length) {
    content += '\nSkills:\n';
    content += data.skills.join(', ') + '\n';
  }

  return content;
};

// Export to PDF
export const exportToPDF = async (resumeData, templateId) => {
  try {
    const doc = new jsPDF();
    const templateSettings = getTemplateSettings(templateId);
    
    // Add content to PDF
    doc.setFont(templateSettings.font || 'helvetica');
    doc.setFontSize(templateSettings.fontSize || 12);
    
    // Add personal info
    doc.setFontSize(18);
    doc.text(`${resumeData.personal.firstName} ${resumeData.personal.lastName}`, 20, 20);
    doc.setFontSize(12);
    doc.text(resumeData.personal.email || '', 20, 30);
    doc.text(resumeData.personal.phone || '', 20, 35);
    doc.text(resumeData.personal.location || '', 20, 40);
    
    // Add summary
    doc.setFontSize(14);
    doc.text('Professional Summary', 20, 50);
    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(resumeData.personal.summary || '', 170);
    doc.text(summaryLines, 20, 60);

    // Add skills
    let yPos = 80;
    if (resumeData.skills && resumeData.skills.length > 0) {
      doc.setFontSize(14);
      doc.text('Skills', 20, yPos);
      doc.setFontSize(12);
      yPos += 10;
      const skillsText = resumeData.skills.join(', ');
      const skillsLines = doc.splitTextToSize(skillsText, 170);
      doc.text(skillsLines, 20, yPos);
      yPos += skillsLines.length * 7;
    }

    // Add experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Experience', 20, yPos);
      doc.setFontSize(12);
      yPos += 10;

      resumeData.experience.forEach(exp => {
        doc.setFontSize(12);
        doc.text(`${exp.company} - ${exp.position}`, 20, yPos);
        yPos += 7;
        doc.text(`${exp.startDate} - ${exp.endDate}`, 20, yPos);
        yPos += 7;
        const descLines = doc.splitTextToSize(exp.description || '', 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 7 + 7;
      });
    }

    // Add education
    if (resumeData.education && resumeData.education.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.text('Education', 20, yPos);
      doc.setFontSize(12);
      yPos += 10;

      resumeData.education.forEach(edu => {
        doc.text(`${edu.school} - ${edu.degree}`, 20, yPos);
        yPos += 7;
        doc.text(`${edu.startDate} - ${edu.endDate}`, 20, yPos);
        yPos += 7;
        if (edu.description) {
          const descLines = doc.splitTextToSize(edu.description, 170);
          doc.text(descLines, 20, yPos);
          yPos += descLines.length * 7 + 7;
        }
      });
    }
    
    // Save the PDF
    const fileName = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Export to DOCX
export const exportToDOCX = async (resumeData, templateId) => {
  try {
    const templateSettings = getTemplateSettings(templateId);
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with contact info
          new Paragraph({
            text: `${resumeData.personal.firstName} ${resumeData.personal.lastName}`,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun(resumeData.personal.email || ''),
              new TextRun(' | '),
              new TextRun(resumeData.personal.phone || ''),
              new TextRun(' | '),
              new TextRun(resumeData.personal.location || '')
            ]
          }),
          
          // Professional Summary
          new Paragraph({
            text: 'Professional Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            text: resumeData.personal.summary || '',
            spacing: { after: 200 }
          }),
          
          // Skills
          ...(resumeData.skills?.length ? [
            new Paragraph({
              text: 'Skills',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            new Table({
              rows: [
                new TableRow({
                  children: resumeData.skills.map(skill => 
                    new TableCell({
                      children: [new Paragraph(skill)],
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      }
                    })
                  )
                })
              ]
            })
          ] : []),
          
          // Experience
          ...(resumeData.experience?.length ? [
            new Paragraph({
              text: 'Experience',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            ...resumeData.experience.map(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.company,
                    bold: true
                  }),
                  new TextRun(' | '),
                  new TextRun({
                    text: exp.position,
                    italics: true
                  })
                ],
                spacing: { before: 200 }
              }),
              new Paragraph({
                text: `${exp.startDate} - ${exp.endDate}`,
                spacing: { before: 100 }
              }),
              new Paragraph({
                text: exp.description || '',
                spacing: { before: 100 }
              })
            ]).flat()
          ] : []),
          
          // Education
          ...(resumeData.education?.length ? [
            new Paragraph({
              text: 'Education',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            ...resumeData.education.map(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.school,
                    bold: true
                  }),
                  new TextRun(' | '),
                  new TextRun({
                    text: edu.degree,
                    italics: true
                  })
                ],
                spacing: { before: 200 }
              }),
              new Paragraph({
                text: `${edu.startDate} - ${edu.endDate}`,
                spacing: { before: 100 }
              }),
              edu.description ? new Paragraph({
                text: edu.description,
                spacing: { before: 100 }
              }) : null
            ]).flat().filter(Boolean)
          ] : [])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.docx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw error;
  }
};

// Export to HTML
export const exportToHTML = (resumeData, templateId) => {
  try {
    const templateSettings = getTemplateSettings(templateId);
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resumeData.personal.firstName} ${resumeData.personal.lastName} - Resume</title>
        <style>
          body {
            font-family: ${templateSettings.font || 'Arial, sans-serif'};
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: ${templateSettings.textColor || '#333'};
            background-color: ${templateSettings.backgroundColor || '#fff'};
          }
          h1 { 
            color: ${templateSettings.primaryColor || '#2c3e50'}; 
            font-size: 24px;
            margin-bottom: 10px;
          }
          h2 { 
            color: ${templateSettings.secondaryColor || '#34495e'};
            font-size: 20px;
            border-bottom: 2px solid ${templateSettings.accentColor || '#eee'};
            padding-bottom: 5px;
            margin-top: 20px;
          }
          .contact-info {
            color: ${templateSettings.mutedColor || '#666'};
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 30px;
          }
          .experience-item, .education-item {
            margin-bottom: 20px;
          }
          .company, .school {
            font-weight: bold;
            color: ${templateSettings.primaryColor || '#2c3e50'};
          }
          .position, .degree {
            font-style: italic;
            color: ${templateSettings.secondaryColor || '#34495e'};
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          .skill {
            background: ${templateSettings.skillBgColor || '#f0f2f5'};
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h1>${resumeData.personal.firstName} ${resumeData.personal.lastName}</h1>
        <div class="contact-info">
          ${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location}
        </div>
        
        <div class="section">
          <h2>Professional Summary</h2>
          <p>${resumeData.personal.summary}</p>
        </div>
        
        <div class="section">
          <h2>Skills</h2>
          <div class="skills">
            ${(resumeData.skills || []).map(skill => `
              <span class="skill">${skill}</span>
            `).join('')}
          </div>
        </div>
        
        <div class="section">
          <h2>Experience</h2>
          ${(resumeData.experience || []).map(exp => `
            <div class="experience-item">
              <div class="company">${exp.company}</div>
              <div class="position">${exp.position}</div>
              <div class="dates">${exp.startDate} - ${exp.endDate}</div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>Education</h2>
          ${(resumeData.education || []).map(edu => `
            <div class="education-item">
              <div class="school">${edu.school}</div>
              <div class="degree">${edu.degree}</div>
              <div class="dates">${edu.startDate} - ${edu.endDate}</div>
              <p>${edu.description}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
    
    // Create a blob and download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const fileName = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.html`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
}; 