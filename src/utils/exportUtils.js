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
export const exportToPDF = async (resumeData, templateId, type = 'resume') => {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm',
    orientation: 'portrait',
    hotfixes: ['px_scaling']
  });

  // Get template settings
  const templateSettings = getTemplateSettings(templateId);
  
  // Standard font sizes in pt (converted to mm)
  const fontSize = {
    header: templateSettings.fontSize?.header || 16,
    subheader: templateSettings.fontSize?.subheader || 14,
    normal: templateSettings.fontSize?.normal || 12,
    small: templateSettings.fontSize?.small || 10
  };

  // Calculate standard text heights
  const textHeight = {
    header: fontSize.header * 0.3528,
    subheader: fontSize.subheader * 0.3528,
    normal: fontSize.normal * 0.3528,
    small: fontSize.small * 0.3528,
    lineSpacing: 2, // Additional space between lines
    paragraphSpacing: 4 // Additional space between paragraphs
  };

  // A4 dimensions and margins (in mm)
  const page = {
    width: 210,
    height: 297,
    margin: {
      top: templateSettings.margin?.top || 20,
      bottom: templateSettings.margin?.bottom || 20,
      left: templateSettings.margin?.left || 20,
      right: templateSettings.margin?.right || 20
    },
    lineHeight: templateSettings.lineHeight || 1.5
  };

  // Calculate usable width
  const contentWidth = page.width - (page.margin.left + page.margin.right);
  let yPos = page.margin.top;

  // Set default font and colors from template
  doc.setFont(templateSettings.font || 'Helvetica');
  const colors = {
    primary: templateSettings.colors?.primary || '#000000',
    secondary: templateSettings.colors?.secondary || '#666666',
    accent: templateSettings.colors?.accent || '#333333'
  };

  // Helper function to calculate text height with proper line height
  const calculateTextHeight = (text, fontSize) => {
    if (!text) return 0;
    const lines = doc.splitTextToSize(text, contentWidth);
    return lines.length * fontSize * page.lineHeight * 0.3528;
  };

  // Helper function to check page break
  const checkNewPage = (height, forceNewPage = false) => {
    const remainingSpace = page.height - page.margin.bottom - yPos;
    if (forceNewPage || remainingSpace < height || remainingSpace < 30) {
      doc.addPage();
      yPos = page.margin.top;
      return true;
    }
    return false;
  };

  // Helper function to add text
  const addText = (text, size = fontSize.normal, isBold = false, color = colors.primary, align = 'left') => {
    if (!text) return 0;

    doc.setFontSize(size);
    doc.setFont(templateSettings.font || 'Helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, contentWidth);
    const height = calculateTextHeight(text, size);

    // Calculate x position based on alignment
    let xPos = page.margin.left;
    if (align === 'center') {
      xPos = page.width / 2;
    } else if (align === 'right') {
      xPos = page.width - page.margin.right;
    }

    doc.text(lines, xPos, yPos, { align });
    yPos += height + textHeight.lineSpacing;
    return height;
  };

  // Helper function to add a section
  const addSection = (title, content, options = {}) => {
    const {
      forceNewPage = false,
      titleSize = fontSize.header,
      contentSize = fontSize.normal,
      spacing = textHeight.paragraphSpacing
    } = options;

    if (!content) return 0;

    let totalHeight = 0;
    
    // Add title if provided
    if (title) {
      if (forceNewPage) {
        doc.addPage();
        yPos = page.margin.top;
      }
      totalHeight += addText(title, titleSize, true, colors.primary);
      yPos += textHeight.lineSpacing;
    }

    // Add content
    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        if (item) {
          totalHeight += addText(item, contentSize, false, colors.primary);
          if (index < content.length - 1) {
            yPos += textHeight.lineSpacing;
          }
        }
      });
    } else {
      totalHeight += addText(content, contentSize, false, colors.primary);
    }

    yPos += spacing;
    return totalHeight;
  };

  if (type === 'cover-letter') {
    // Cover Letter Format with template support
    const fullName = `${resumeData.personal.firstName} ${resumeData.personal.lastName}`;
    addSection(fullName, null, { titleSize: fontSize.header * 1.2 });

    // Contact Information
    addSection(null, [
      resumeData.personal.email,
      resumeData.personal.phone,
      resumeData.personal.location
    ]);

    // Date
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    addSection(null, date);

    // Recipient
    if (resumeData.coverLetter?.recipient) {
      addSection(null, [
        resumeData.coverLetter.recipient.name,
        resumeData.coverLetter.recipient.title,
        resumeData.coverLetter.recipient.company,
        resumeData.coverLetter.recipient.address
      ]);
    }

    // Greeting
    addSection(null, resumeData.coverLetter?.greeting || 'Dear Hiring Manager,');

    // Content
    addSection(null, resumeData.coverLetter?.content || '');

    // Closing
    addSection(null, [
      resumeData.coverLetter?.closing || 'Sincerely,',
      fullName
    ]);
  } else {
    // Resume Format
    const fullName = `${resumeData.personal.firstName} ${resumeData.personal.lastName}`;
    addSection(fullName, null, { titleSize: fontSize.header * 1.2 });

    // Contact Information
    const contactInfo = [
      resumeData.personal.email,
      resumeData.personal.phone,
      resumeData.personal.location
    ].filter(Boolean).join(' | ');
    addSection(null, contactInfo, { contentSize: fontSize.normal });

    // Links
    const links = [
      resumeData.professionalLinks?.linkedin && `LinkedIn: ${resumeData.professionalLinks.linkedin}`,
      resumeData.professionalLinks?.github && `GitHub: ${resumeData.professionalLinks.github}`,
      resumeData.professionalLinks?.portfolio && `Portfolio: ${resumeData.professionalLinks.portfolio}`,
      resumeData.professionalLinks?.website && `Website: ${resumeData.professionalLinks.website}`,
      resumeData.professionalLinks?.twitter && `Twitter: ${resumeData.professionalLinks.twitter}`,
      resumeData.professionalLinks?.other && `${resumeData.professionalLinks.other}`
    ].filter(Boolean);
    
    if (links.length > 0) {
      addSection(null, links.join(' | '), { contentSize: fontSize.normal });
    }

    // Professional Summary
    if (resumeData.personal.summary) {
      const summary = doc.splitTextToSize(resumeData.personal.summary, contentWidth);
      if (summary.length > 5) summary.length = 5;
      addSection('Professional Summary', summary.join('\n'));
    }

    // Skills
    if (resumeData.skills?.length > 0) {
      addSection('Skills', resumeData.skills.join(' • '));
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      addSection('Experience', null);
      resumeData.experience.forEach(exp => {
        const content = [
          `${exp.position} - ${exp.company}`,
          `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
          exp.location,
          exp.description
        ].filter(Boolean);
        addSection(null, content, { spacing: textHeight.paragraphSpacing * 2 });
      });
    }

    // Education
    if (resumeData.education?.length > 0) {
      addSection('Education', null, { forceNewPage: true });
      resumeData.education.forEach(edu => {
        const content = [
          `${edu.degree} - ${edu.school}`,
          `${edu.startDate} - ${edu.currentlyStudying ? 'Present' : edu.endDate}`,
          edu.location,
          edu.description
        ].filter(Boolean);
        addSection(null, content, { spacing: textHeight.paragraphSpacing * 2 });
      });
    }

    // References
    if (resumeData.references?.length > 0) {
      addSection('References', null, { forceNewPage: true });
      resumeData.references.forEach(ref => {
        const content = [
          `${ref.name} - ${ref.position}`,
          ref.company,
          `Email: ${ref.email}`,
          ref.phone && `Phone: ${ref.phone}`,
          ref.relationship && `Relationship: ${ref.relationship}`
        ].filter(Boolean);
        addSection(null, content, { spacing: textHeight.paragraphSpacing * 2 });
      });
    }
  }

  // Save the PDF with appropriate name
  const fileName = type === 'cover-letter' 
    ? `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Cover_Letter.pdf`
    : `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Resume.pdf`;
  doc.save(fileName);
};

// Export to DOCX
export const exportToDOCX = async (resumeData, templateId, type = 'resume') => {
  try {
    const templateSettings = getTemplateSettings(templateId);
    
    if (type === 'cover-letter') {
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
                new TextRun(resumeData.personal.email),
                new TextRun('\n'),
                new TextRun(resumeData.personal.phone),
                new TextRun('\n'),
                new TextRun(resumeData.personal.location)
              ]
            }),
            
            // Date
            new Paragraph({
              text: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              spacing: { before: 400, after: 200 }
            }),

            // Recipient (if available)
            ...(resumeData.coverLetter?.recipient ? [
              new Paragraph({
                text: resumeData.coverLetter.recipient.name,
                spacing: { before: 200 }
              }),
              new Paragraph({
                text: resumeData.coverLetter.recipient.title
              }),
              new Paragraph({
                text: resumeData.coverLetter.recipient.company
              }),
              new Paragraph({
                text: resumeData.coverLetter.recipient.address,
                spacing: { after: 200 }
              })
            ] : []),

            // Greeting
            new Paragraph({
              text: resumeData.coverLetter?.greeting || 'Dear Hiring Manager,',
              spacing: { before: 200, after: 200 }
            }),

            // Content
            new Paragraph({
              text: resumeData.coverLetter?.content || '',
              spacing: { before: 200, after: 400 }
            }),

            // Closing
            new Paragraph({
              text: resumeData.coverLetter?.closing || 'Sincerely,',
              spacing: { before: 200 }
            }),
            new Paragraph({
              text: `${resumeData.personal.firstName} ${resumeData.personal.lastName}`,
              spacing: { before: 200 }
            })
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const fileName = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Cover_Letter.docx`;
      saveAs(blob, fileName);
      return;
    }

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
          
          // Contact Info
          new Paragraph({
            children: [
              new TextRun(resumeData.personal.email),
              new TextRun(' | '),
              new TextRun(resumeData.personal.phone),
              new TextRun(' | '),
              new TextRun(resumeData.personal.location)
            ]
          }),

          // Links (if available)
          ...(resumeData.professionalLinks?.linkedin || resumeData.professionalLinks?.github || resumeData.professionalLinks?.portfolio || resumeData.professionalLinks?.website || resumeData.professionalLinks?.twitter || resumeData.professionalLinks?.other ? [
            new Paragraph({
              children: [
                ...(resumeData.professionalLinks?.linkedin ? [
                  new TextRun('LinkedIn: '),
                  new TextRun({ text: resumeData.professionalLinks.linkedin, style: 'Hyperlink' }),
                  new TextRun(' | ')
                ] : []),
                ...(resumeData.professionalLinks?.github ? [
                  new TextRun('GitHub: '),
                  new TextRun({ text: resumeData.professionalLinks.github, style: 'Hyperlink' }),
                  new TextRun(' | ')
                ] : []),
                ...(resumeData.professionalLinks?.portfolio ? [
                  new TextRun('Portfolio: '),
                  new TextRun({ text: resumeData.professionalLinks.portfolio, style: 'Hyperlink' }),
                  new TextRun(' | ')
                ] : []),
                ...(resumeData.professionalLinks?.website ? [
                  new TextRun('Website: '),
                  new TextRun({ text: resumeData.professionalLinks.website, style: 'Hyperlink' }),
                  new TextRun(' | ')
                ] : []),
                ...(resumeData.professionalLinks?.twitter ? [
                  new TextRun('Twitter: '),
                  new TextRun({ text: resumeData.professionalLinks.twitter, style: 'Hyperlink' }),
                  new TextRun(' | ')
                ] : []),
                ...(resumeData.professionalLinks?.other ? [
                  new TextRun(`${resumeData.professionalLinks.other}`)
                ] : [])
              ].filter((_, index, array) => {
                // Remove the last " | " if it exists
                if (index === array.length - 1 && array[index].text === ' | ') {
                  return false;
                }
                return true;
              }),
              spacing: { after: 200 }
            })
          ] : []),
          
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
                text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
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
                text: `${edu.startDate} - ${edu.currentlyStudying ? 'Present' : edu.endDate}`,
                spacing: { before: 100 }
              }),
              edu.description ? new Paragraph({
                text: edu.description,
                spacing: { before: 100 }
              }) : null
            ]).flat().filter(Boolean)
          ] : []),

          // References
          ...(resumeData.references?.length ? [
            new Paragraph({
              text: 'References',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 }
            }),
            ...resumeData.references.map(ref => [
              new Paragraph({
                text: `${ref.name} - ${ref.position}`,
                spacing: { before: 200 },
                bold: true
              }),
              new Paragraph({
                text: ref.company
              }),
              new Paragraph({
                text: `Email: ${ref.email}`
              }),
              ...(ref.phone ? [
                new Paragraph({
                  text: `Phone: ${ref.phone}`
                })
              ] : []),
              ...(ref.relationship ? [
                new Paragraph({
                  text: `Relationship: ${ref.relationship}`,
                  spacing: { after: 200 }
                })
              ] : [])
            ]).flat()
          ] : [])
        ].filter(Boolean)
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
export const exportToHTML = (resumeData, templateId, type = 'resume') => {
  try {
    const templateSettings = getTemplateSettings(templateId);
    
    if (type === 'cover-letter') {
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resumeData.personal.firstName} ${resumeData.personal.lastName} - Cover Letter</title>
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
            .contact-info {
              color: ${templateSettings.mutedColor || '#666'};
              margin-bottom: 20px;
            }
            .date {
              margin: 20px 0;
            }
            .recipient {
              margin: 20px 0;
            }
            .content {
              margin: 20px 0;
              white-space: pre-line;
            }
            .closing {
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <h1>${resumeData.personal.firstName} ${resumeData.personal.lastName}</h1>
          <div class="contact-info">
            ${resumeData.personal.email}<br>
            ${resumeData.personal.phone}<br>
            ${resumeData.personal.location}
          </div>
          
          <div class="date">
            ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          ${resumeData.coverLetter?.recipient ? `
            <div class="recipient">
              ${resumeData.coverLetter.recipient.name}<br>
              ${resumeData.coverLetter.recipient.title}<br>
              ${resumeData.coverLetter.recipient.company}<br>
              ${resumeData.coverLetter.recipient.address}
            </div>
          ` : ''}
          
          <div class="content">
            <p>${resumeData.coverLetter?.greeting || 'Dear Hiring Manager,'}</p>
            
            ${resumeData.coverLetter?.content || ''}
            
            <div class="closing">
              <p>${resumeData.coverLetter?.closing || 'Sincerely,'}</p>
              <p>${resumeData.personal.firstName} ${resumeData.personal.lastName}</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const fileName = `${resumeData.personal.firstName}_${resumeData.personal.lastName}_Cover_Letter.html`;
      saveAs(blob, fileName);
      return;
    }
    
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
          .links {
            margin-bottom: 20px;
          }
          .links a {
            color: ${templateSettings.linkColor || '#3498db'};
            text-decoration: none;
          }
          .links a:hover {
            text-decoration: underline;
          }
          .section {
            margin-bottom: 30px;
          }
          .experience-item, .education-item, .reference-item {
            margin-bottom: 20px;
          }
          .company, .school, .reference-name {
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
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>${resumeData.personal.firstName} ${resumeData.personal.lastName}</h1>
        <div class="contact-info">
          ${resumeData.personal.email} | ${resumeData.personal.phone} | ${resumeData.personal.location}
        </div>
        
        ${(resumeData.professionalLinks?.linkedin || resumeData.professionalLinks?.github || resumeData.professionalLinks?.portfolio || resumeData.professionalLinks?.website || resumeData.professionalLinks?.twitter || resumeData.professionalLinks?.other) ? `
          <div class="links">
            ${resumeData.professionalLinks?.linkedin ? `<a href="${resumeData.professionalLinks.linkedin}">LinkedIn</a> | ` : ''}
            ${resumeData.professionalLinks?.github ? `<a href="${resumeData.professionalLinks.github}">GitHub</a> | ` : ''}
            ${resumeData.professionalLinks?.portfolio ? `<a href="${resumeData.professionalLinks.portfolio}">Portfolio</a> | ` : ''}
            ${resumeData.professionalLinks?.website ? `<a href="${resumeData.professionalLinks.website}">Website</a> | ` : ''}
            ${resumeData.professionalLinks?.twitter ? `<a href="${resumeData.professionalLinks.twitter}">Twitter</a> | ` : ''}
            ${resumeData.professionalLinks?.other ? `<a href="${resumeData.professionalLinks.other}">Other</a>` : ''}
          </div>
        ` : ''}
        
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
              <div class="dates">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
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
              <div class="dates">${edu.startDate} - ${edu.currentlyStudying ? 'Present' : edu.endDate}</div>
              ${edu.description ? `<p>${edu.description}</p>` : ''}
            </div>
          `).join('')}
        </div>

        ${resumeData.references?.length ? `
          <div class="section">
            <h2>References</h2>
            ${resumeData.references.map(ref => `
              <div class="reference-item">
                <div class="reference-name">${ref.name} - ${ref.position}</div>
                <div>${ref.company}</div>
                <div>Email: ${ref.email}</div>
                ${ref.phone ? `<div>Phone: ${ref.phone}</div>` : ''}
                ${ref.relationship ? `<div>Relationship: ${ref.relationship}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
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