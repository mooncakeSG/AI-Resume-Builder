import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, Packer, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { getTemplateSettings, getTemplate, TEMPLATE_TYPES } from '../lib/templates/templateConfig';

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
    console.log("Processing resume data:", resumeData);

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set default font
    doc.setFont('helvetica');

    // Set initial position and constants
    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Helper function to ensure text is safe for jsPDF
    const safeText = (value) => {
      try {
        if (value === null || value === undefined) return '';
        return (typeof value === 'string' || typeof value === 'number') ? String(value).trim() : '';
      } catch (e) {
        console.error('Error in safeText:', e);
        return '';
      }
    };

    // Helper function to format dates
    const formatDate = (date) => {
      try {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      } catch (e) {
        console.error('Error formatting date:', e);
        return '';
      }
    };

    // Helper function to check page break
    const checkPageBreak = (requiredSpace = 20) => {
      if (yPos > doc.internal.pageSize.getHeight() - requiredSpace) {
        console.log("Adding new page at position:", yPos);
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Add personal information
    if (resumeData.personal) {
      console.log("Adding personal information");

      // Name
      const name = [
        safeText(resumeData.personal.firstName),
        safeText(resumeData.personal.lastName)
      ].filter(Boolean).join(' ');
      
      if (name) {
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        const nameWidth = doc.getStringUnitWidth(name) * doc.getFontSize() / doc.internal.scaleFactor;
        const nameX = (pageWidth - nameWidth) / 2;
        doc.text(name, nameX, yPos);
        yPos += 10;
      }

      // Contact info
      const contactInfo = [
        safeText(resumeData.personal.email),
        safeText(resumeData.personal.phone),
        safeText(resumeData.personal.location)
      ].filter(Boolean);
      
      if (contactInfo.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        const contactText = contactInfo.join(' | ');
        const contactWidth = doc.getStringUnitWidth(contactText) * doc.getFontSize() / doc.internal.scaleFactor;
        const contactX = (pageWidth - contactWidth) / 2;
        doc.text(contactText, contactX, yPos);
        yPos += 15;
      }

      // Summary
      if (resumeData.personal.summary) {
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const summaryLines = doc.splitTextToSize(safeText(resumeData.personal.summary), contentWidth);
        summaryLines.forEach(line => {
          checkPageBreak();
          doc.text(safeText(line), margin, yPos);
          yPos += 6;
        });
        yPos += 10;
      }
    }

    // Experience section
    if (Array.isArray(resumeData.experience) && resumeData.experience.length > 0) {
      checkPageBreak();
      
      // Section header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Experience', margin, yPos);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
      yPos += 10;

      resumeData.experience.forEach(exp => {
        console.log("Processing experience:", exp);
        checkPageBreak(40);

        // Company
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(safeText(exp.company), margin, yPos);
        yPos += 5;

        // Position
        if (exp.position) {
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(safeText(exp.position), margin, yPos);
          yPos += 5;
        }

        // Dates
        const startDate = safeText(formatDate(exp.startDate));
        const endDate = safeText(formatDate(exp.endDate)) || 'Present';
        if (startDate || endDate) {
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(`${startDate} - ${endDate}`, margin, yPos);
          yPos += 5;
        }

        // Description
        if (exp.description) {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          const descLines = doc.splitTextToSize(safeText(exp.description), contentWidth);
          descLines.forEach(line => {
            checkPageBreak();
            doc.text(safeText(line), margin, yPos);
            yPos += 5;
          });
        }

        // Achievements
        if (Array.isArray(exp.achievements)) {
          yPos += 3;
          exp.achievements.forEach(achievement => {
            if (!achievement) return;
            checkPageBreak();
            const achievementLines = doc.splitTextToSize(safeText(achievement), contentWidth - 10);
            achievementLines.forEach(line => {
              doc.text(`• ${safeText(line)}`, margin + 5, yPos);
              yPos += 5;
            });
          });
        }

        yPos += 10;
      });
    }

    // Certifications section
    if (Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0) {
      checkPageBreak();
      
      // Section header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Certifications', margin, yPos);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
      yPos += 10;

      resumeData.certifications.forEach(cert => {
        console.log("Processing certification:", cert);
        checkPageBreak(30);

        // Certificate name
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(safeText(cert.name), margin, yPos);
        yPos += 5;

        // Issuer
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(safeText(cert.issuer), margin + 5, yPos);
        yPos += 5;

        // Dates
        if (cert.issueDate || cert.expiryDate) {
          const issued = cert.issueDate ? `Issued: ${safeText(formatDate(cert.issueDate))}` : '';
          const expires = cert.expiryDate ? ` - Expires: ${safeText(formatDate(cert.expiryDate))}` : '';
          doc.text(`${issued}${expires}`, margin + 5, yPos);
          yPos += 5;
        }

        // Credential ID
        if (cert.credentialId) {
          doc.text(`Credential ID: ${safeText(cert.credentialId)}`, margin + 5, yPos);
          yPos += 5;
        }

        yPos += 3;
      });
    }

    // Education section
    if (Array.isArray(resumeData.education) && resumeData.education.length > 0) {
      checkPageBreak();
      
      // Section header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Education', margin, yPos);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
      yPos += 10;

      resumeData.education.forEach(edu => {
        console.log("Processing education:", edu);
        checkPageBreak(30);

        // School
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(safeText(edu.school), margin, yPos);
        yPos += 5;

        // Degree
        if (edu.degree) {
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          doc.text(safeText(edu.degree), margin, yPos);
          yPos += 5;
        }

        // Dates
        const startDate = safeText(formatDate(edu.startDate));
        const endDate = safeText(formatDate(edu.endDate)) || 'Present';
        if (startDate || endDate) {
          doc.text(`${startDate} - ${endDate}`, margin, yPos);
          yPos += 5;
        }

        yPos += 5;
      });
    }

    // Skills section
    if (Array.isArray(resumeData.skills) && resumeData.skills.length > 0) {
      checkPageBreak();
      
      // Section header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Skills', margin, yPos);
      doc.setLineWidth(0.5);
      doc.line(margin, yPos + 1, pageWidth - margin, yPos + 1);
      yPos += 10;

      // Skills list
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const skillsText = resumeData.skills.map(skill => safeText(skill)).filter(Boolean).join(' • ');
      const skillsLines = doc.splitTextToSize(skillsText, contentWidth);
      skillsLines.forEach(line => {
        checkPageBreak();
        doc.text(safeText(line), margin, yPos);
        yPos += 5;
      });
    }

    console.log("PDF generation completed successfully");
    
    // Save the PDF
    const fileName = resumeData.personal?.firstName && resumeData.personal?.lastName
      ? `${safeText(resumeData.personal.firstName).toLowerCase()}_${safeText(resumeData.personal.lastName).toLowerCase()}_${type}.pdf`
      : `${type}.pdf`;
    
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