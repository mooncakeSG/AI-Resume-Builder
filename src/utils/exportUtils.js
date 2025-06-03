import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, Packer, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
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
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

// Helper function to create a paragraph with spacing
const createParagraph = (text, options = {}) => {
  return new Paragraph({
    text,
    ...options,
  });
};

// Helper function to create a heading
const createHeading = (text, level = HeadingLevel.HEADING_2) => {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 400, after: 200 }
  });
};

// Export to PDF
export const exportToPDF = async (resumeData, templateId, type = 'resume') => {
  try {
    const doc = new jsPDF();
    const fullName = `${resumeData.personal.firstName} ${resumeData.personal.lastName}`.trim();
    const fileName = `${fullName.toLowerCase().replace(/\s+/g, '_')}_${type}.pdf`;

    // Get template settings
    const templateSettings = getTemplateSettings(templateId);
    const { margins, fonts, colors } = templateSettings;

    // Set document properties
    doc.setProperties({
      title: `${fullName} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      author: fullName,
      subject: type === 'resume' ? 'Resume' : 'Cover Letter',
      keywords: 'resume, cv, job application'
    });

    // Add content based on type
    if (type === 'resume') {
      // Header
      doc.setFontSize(24);
      doc.setTextColor(colors.primary);
      doc.text(fullName, margins.left, margins.top);

      // Contact Info
      doc.setFontSize(10);
      doc.setTextColor(colors.secondary);
      const contactInfo = [
        resumeData.personal.email,
        resumeData.personal.phone,
        resumeData.personal.location
      ].filter(Boolean).join(' • ');
      doc.text(contactInfo, margins.left, margins.top + 10);

      // Professional Links
      if (resumeData.personal.links) {
        const links = Object.entries(resumeData.personal.links)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' • ');
        if (links) {
          doc.text(links, margins.left, margins.top + 15);
        }
      }

      // Rest of the sections...
    }

    // Save the PDF
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Export to DOCX
export const exportToDOCX = async (resumeData, templateId, type = 'resume') => {
  try {
    const fullName = `${resumeData.personal.firstName} ${resumeData.personal.lastName}`.trim();
    const fileName = `${fullName.toLowerCase().replace(/\\s+/g, '_')}_${type}.docx`;

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header with contact info
          createHeading(fullName, HeadingLevel.HEADING_1),
          
          // Contact Info
          new Paragraph({
            children: [
              new TextRun(resumeData.personal.email || ''),
              new TextRun(' | '),
              new TextRun(resumeData.personal.phone || ''),
              new TextRun(' | '),
              new TextRun(resumeData.personal.location || '')
            ],
            spacing: { after: 200 }
          }),

          // Professional Links
          ...(resumeData.personal.links ? [
            new Paragraph({
              children: Object.entries(resumeData.personal.links)
                .filter(([_, value]) => value)
                .map(([key, value], index, arr) => [
                  new TextRun({ text: `${key}: `, bold: true }),
                  new TextRun(value),
                  index < arr.length - 1 ? new TextRun(' | ') : new TextRun('')
                ]).flat(),
              spacing: { after: 200 }
            })
          ] : []),

          // Summary
          ...(resumeData.personal.summary ? [
            createHeading('Professional Summary'),
            createParagraph(resumeData.personal.summary, { spacing: { after: 200 } })
          ] : []),

          // Experience
          ...(resumeData.experience?.length ? [
            createHeading('Experience'),
            ...resumeData.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.company, bold: true }),
                  new TextRun(' | '),
                  new TextRun({ text: exp.position, italics: true })
                ],
                spacing: { before: 200 }
              }),
              createParagraph(`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`, {
                spacing: { before: 100 }
              }),
              ...(exp.description ? [
                createParagraph(exp.description, { spacing: { before: 100 } })
              ] : []),
              ...(exp.achievements?.map(achievement =>
                createParagraph(`• ${achievement}`, { spacing: { before: 100 } })
              ) || [])
            ])
          ] : []),

          // Education
          ...(resumeData.education?.length ? [
            createHeading('Education'),
            ...resumeData.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({ text: edu.school, bold: true }),
                  new TextRun(' | '),
                  new TextRun({ text: edu.degree, italics: true })
                ],
                spacing: { before: 200 }
              }),
              createParagraph(`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`, {
                spacing: { before: 100 }
              }),
              ...(edu.field ? [
                createParagraph(`Field of Study: ${edu.field}`, { spacing: { before: 100 } })
              ] : []),
              ...(edu.gpa ? [
                createParagraph(`GPA: ${edu.gpa}`, { spacing: { before: 100 } })
              ] : []),
              ...(edu.description ? [
                createParagraph(edu.description, { spacing: { before: 100 } })
              ] : [])
            ])
          ] : []),

          // Skills
          ...(resumeData.skills?.length ? [
            createHeading('Skills'),
            new Table({
              rows: [
                new TableRow({
                  children: resumeData.skills.map(skill =>
                    new TableCell({
                      children: [createParagraph(skill)],
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE }
                      }
                    })
                  )
                })
              ],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              }
            })
          ] : [])
        ]
      }]
    });

    // Use Packer.toBlob() instead of toBuffer() for browser environment
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw error;
  }
};

// Export to HTML
export const exportToHTML = async (resumeData, templateId, type = 'resume') => {
  try {
    const fullName = `${resumeData.personal.firstName} ${resumeData.personal.lastName}`.trim();
    const fileName = `${fullName.toLowerCase().replace(/\s+/g, '_')}_${type}.html`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fullName} - ${type.charAt(0).toUpperCase() + type.slice(1)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          h1 { 
            color: #2c3e50;
            margin-bottom: 10px;
          }
          h2 { 
            color: #34495e;
            border-bottom: 2px solid #eee;
            padding-bottom: 5px;
            margin-top: 30px;
          }
          .contact-info {
            color: #7f8c8d;
            margin-bottom: 15px;
          }
          .links {
            margin-bottom: 20px;
          }
          .links a {
            color: #3498db;
            text-decoration: none;
            margin-right: 15px;
          }
          .links a:hover {
            text-decoration: underline;
          }
          .section {
            margin-bottom: 30px;
          }
          .item {
            margin-bottom: 20px;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
          }
          .title {
            font-weight: bold;
            color: #2c3e50;
          }
          .subtitle {
            font-style: italic;
            color: #7f8c8d;
          }
          .date {
            color: #95a5a6;
          }
          .description {
            margin: 10px 0;
          }
          .achievements {
            list-style-type: none;
            padding-left: 20px;
          }
          .achievements li:before {
            content: "•";
            color: #3498db;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }
          .skill {
            background: #f0f2f5;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.9em;
            color: #2c3e50;
          }
          @media print {
            body {
              padding: 0;
              color: black;
            }
            .links a {
              color: black;
              text-decoration: none;
            }
            .skill {
              border: 1px solid #ddd;
            }
          }
        </style>
      </head>
      <body>
        <h1>${fullName}</h1>
        <div class="contact-info">
          ${[
            resumeData.personal.email,
            resumeData.personal.phone,
            resumeData.personal.location
          ].filter(Boolean).join(' • ')}
        </div>
        
        ${resumeData.personal.links ? `
          <div class="links">
            ${Object.entries(resumeData.personal.links)
              .filter(([_, value]) => value)
              .map(([key, value]) => `<a href="${value}" target="_blank">${key}</a>`)
              .join('')}
          </div>
        ` : ''}
        
        ${resumeData.personal.summary ? `
          <section class="section">
            <h2>Professional Summary</h2>
            <p>${resumeData.personal.summary}</p>
          </section>
        ` : ''}
        
        ${resumeData.experience?.length ? `
          <section class="section">
            <h2>Experience</h2>
            ${resumeData.experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <span class="title">${exp.company}</span>
                    <span class="subtitle"> | ${exp.position}</span>
                  </div>
                  <span class="date">${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</span>
                </div>
                ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
                ${exp.achievements?.length ? `
                  <ul class="achievements">
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}
        
        ${resumeData.education?.length ? `
          <section class="section">
            <h2>Education</h2>
            ${resumeData.education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <div>
                    <span class="title">${edu.school}</span>
                    <span class="subtitle"> | ${edu.degree}</span>
                  </div>
                  <span class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
                </div>
                ${edu.field ? `<div>Field of Study: ${edu.field}</div>` : ''}
                ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ''}
        
        ${resumeData.skills?.length ? `
          <section class="section">
            <h2>Skills</h2>
            <div class="skills">
              ${resumeData.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
          </section>
        ` : ''}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating HTML:', error);
    throw error;
  }
}; 