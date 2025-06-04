import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, Packer, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { getTemplate } from '../templates/templateConfig';

// A4 dimensions in mm
const A4_DIMENSIONS = {
  WIDTH: 210,
  HEIGHT: 297,
};

// Margins in mm
const MARGINS = {
  TOP: 10,
  BOTTOM: 10,
  LEFT: 10,
  RIGHT: 10,
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
export const generatePDF = async (data, templateId, type = 'resume') => {
  try {
    // Get template settings
    const template = getTemplate(templateId);
    const settings = template.settings;

    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set default font
    doc.setFont('helvetica');
    
    // Define colors from template settings
    const colors = {
      primary: settings.colorScheme.primary || '#2563eb',
      secondary: settings.colorScheme.secondary || '#4b5563',
      accent: settings.colorScheme.accent || '#60a5fa'
    };

    // Set initial position
    let yPos = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const contentWidth = pageWidth - (margin * 2);

    if (type === 'coverLetter') {
      // Add personal information
      if (data.personal) {
        // Name
        doc.setFontSize(24);
        doc.setTextColor(colors.primary);
        const name = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
        if (name) {
          doc.text(name, pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }

        // Contact info
        doc.setFontSize(10);
        doc.setTextColor(colors.secondary);
        const contactInfo = [];
        if (data.personal.email) contactInfo.push(data.personal.email);
        if (data.personal.phone) contactInfo.push(data.personal.phone);
        if (data.personal.location) contactInfo.push(data.personal.location);
        
        if (contactInfo.length > 0) {
          doc.text(contactInfo.join(' | '), pageWidth / 2, yPos, { align: 'center' });
          yPos += 20;
        }
      }

      // Add cover letter content
      if (data.coverLetter) {
        // Date
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        if (data.coverLetter.letterDate) {
          doc.text(new Date(data.coverLetter.letterDate).toLocaleDateString(), margin, yPos);
          yPos += 10;
        }

        // Recipient info
        if (data.coverLetter.recipientName || data.coverLetter.recipientTitle || data.coverLetter.companyName || data.coverLetter.companyAddress) {
          doc.setFontSize(11);
          doc.setTextColor(colors.secondary);
          
          if (data.coverLetter.recipientName) {
            doc.text(data.coverLetter.recipientName, margin, yPos);
            yPos += 5;
          }
          if (data.coverLetter.recipientTitle) {
            doc.text(data.coverLetter.recipientTitle, margin, yPos);
            yPos += 5;
          }
          if (data.coverLetter.companyName) {
            doc.text(data.coverLetter.companyName, margin, yPos);
            yPos += 5;
          }
          if (data.coverLetter.companyAddress) {
            const addressLines = data.coverLetter.companyAddress.split('\n');
            addressLines.forEach(line => {
              doc.text(line.trim(), margin, yPos);
              yPos += 5;
            });
          }
          yPos += 10;
        }

        // Greeting
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(data.coverLetter.greeting || 'Dear Hiring Manager,', margin, yPos);
        yPos += 10;

        // Content
        if (data.coverLetter.content) {
          doc.setFontSize(11);
          doc.setTextColor(colors.secondary);
          const contentLines = doc.splitTextToSize(data.coverLetter.content, contentWidth);
          contentLines.forEach(line => {
            if (yPos > doc.internal.pageSize.height - 40) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += 6;
          });
          yPos += 10;
        }

        // Closing
        doc.setFontSize(11);
        doc.setTextColor(colors.secondary);
        doc.text(data.coverLetter.closing || 'Sincerely,', margin, yPos);
        yPos += 15;

        // Signature
        if (data.personal) {
          const signature = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
          if (signature) {
            doc.text(signature, margin, yPos);
          }
        }
      }
    } else {
      // Resume content
      // Add personal information
      if (data.personal) {
        // Name
        doc.setFontSize(24);
        doc.setTextColor(colors.primary);
        const name = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
        if (name) {
          doc.text(name, pageWidth / 2, yPos, { align: 'center' });
          yPos += 10;
        }

        // Contact info
        doc.setFontSize(10);
        doc.setTextColor(colors.secondary);
        const contactInfo = [];
        if (data.personal.email) contactInfo.push(data.personal.email);
        if (data.personal.phone) contactInfo.push(data.personal.phone);
        if (data.personal.location) contactInfo.push(data.personal.location);
        
        if (contactInfo.length > 0) {
          doc.text(contactInfo.join(' | '), pageWidth / 2, yPos, { align: 'center' });
          yPos += 15;
        }

        // Summary
        if (data.personal.summary) {
          yPos = addSection(doc, 'Professional Summary', yPos, colors, margin, contentWidth);
          const summaryLines = doc.splitTextToSize(data.personal.summary, contentWidth);
          summaryLines.forEach(line => {
            doc.text(line, margin, yPos);
            yPos += 6;
          });
          yPos += 10;
        }
      }

      // Experience section
      if (data.experience?.length > 0) {
        yPos = addSection(doc, 'Experience', yPos, colors, margin, contentWidth);
        
        data.experience.forEach((exp) => {
          if (yPos > doc.internal.pageSize.height - 40) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setTextColor(colors.primary);
          doc.text(exp.company || '', margin, yPos);
          
          doc.setFontSize(10);
          doc.setTextColor(colors.secondary);
          if (exp.position) {
            doc.text(exp.position, margin, yPos + 5);
          }
          
          yPos += 15;
          
          if (exp.description) {
            doc.setFontSize(10);
            doc.setTextColor(colors.secondary);
            const lines = doc.splitTextToSize(exp.description, contentWidth);
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 5) + 5;
          }

          if (exp.achievements?.length > 0) {
            exp.achievements.forEach(achievement => {
              if (yPos > doc.internal.pageSize.height - 40) {
                doc.addPage();
                yPos = 20;
              }
              const lines = doc.splitTextToSize(`• ${achievement}`, contentWidth - 5);
              doc.text(lines, margin + 5, yPos);
              yPos += (lines.length * 5) + 2;
            });
          }

          yPos += 10;
        });
      }

      // Education section
      if (data.education?.length > 0) {
        yPos = addSection(doc, 'Education', yPos, colors, margin, contentWidth);
        
        data.education.forEach((edu) => {
          if (yPos > doc.internal.pageSize.height - 40) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(12);
          doc.setTextColor(colors.primary);
          doc.text(edu.school || '', margin, yPos);
          
          doc.setFontSize(10);
          doc.setTextColor(colors.secondary);
          if (edu.degree) {
            doc.text(edu.degree, margin, yPos + 5);
          }
          
          yPos += 15;
          
          if (edu.description) {
            const lines = doc.splitTextToSize(edu.description, contentWidth);
            doc.text(lines, margin, yPos);
            yPos += (lines.length * 5) + 5;
          }

          yPos += 5;
        });
      }

      // Skills section
      if (data.skills?.length > 0) {
        yPos = addSection(doc, 'Skills', yPos, colors, margin, contentWidth);
        
        doc.setFontSize(10);
        doc.setTextColor(colors.secondary);
        const skillsText = data.skills.join(', ');
        const lines = doc.splitTextToSize(skillsText, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += (lines.length * 5) + 10;
      }

      // Languages Section
      if (data.languages?.length > 0) {
        yPos = addSection(doc, 'Languages', yPos, colors, margin, contentWidth);
        data.languages.forEach(lang => {
          doc.setFontSize(11);
          doc.setTextColor(colors.secondary);
          doc.text(`${lang.name} - ${lang.proficiency}`, margin, yPos);
          yPos += 5;
          if (lang.certification) {
            doc.setFontSize(10);
            doc.text(lang.certification, margin + 5, yPos);
            yPos += 5;
          }
          yPos += 3;
        });
      }

      // Certifications Section
      if (data.certifications?.length > 0) {
        yPos = addSection(doc, 'Certifications', yPos, colors, margin, contentWidth);
        data.certifications.forEach(cert => {
          doc.setFontSize(11);
          doc.setTextColor(colors.secondary);
          doc.text(cert.name, margin, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.text(cert.issuer, margin + 5, yPos);
          yPos += 5;
          if (cert.issueDate || cert.expiryDate) {
            const dateText = `Issued: ${formatDate(cert.issueDate)}${cert.expiryDate ? ` - Expires: ${formatDate(cert.expiryDate)}` : ''}`;
            doc.text(dateText, margin + 5, yPos);
            yPos += 5;
          }
          if (cert.credentialId) {
            doc.text(`Credential ID: ${cert.credentialId}`, margin + 5, yPos);
            yPos += 5;
          }
          yPos += 3;
        });
      }

      // Projects Section
      if (data.projects?.length > 0) {
        yPos = addSection(doc, 'Projects', yPos, colors, margin, contentWidth);
        data.projects.forEach(project => {
          doc.setFontSize(11);
          doc.setTextColor(colors.secondary);
          doc.text(project.name, margin, yPos);
          yPos += 5;
          if (project.startDate || project.endDate) {
            doc.setFontSize(10);
            const dateText = `${project.startDate}${project.endDate ? ` - ${project.endDate}` : ' - Present'}`;
            doc.text(dateText, margin + 5, yPos);
            yPos += 5;
          }
          if (project.description) {
            const descLines = doc.splitTextToSize(project.description, contentWidth - margin);
            descLines.forEach(line => {
              doc.text(line, margin + 5, yPos);
              yPos += 5;
            });
          }
          if (project.technologies?.length > 0) {
            doc.text(`Technologies: ${project.technologies.join(', ')}`, margin + 5, yPos);
            yPos += 5;
          }
          if (project.achievements?.length > 0) {
            project.achievements.forEach(achievement => {
              doc.text(`• ${achievement}`, margin + 10, yPos);
              yPos += 5;
            });
          }
          yPos += 3;
        });
      }
    }

    // Save the PDF
    const fileName = data.personal?.firstName && data.personal?.lastName
      ? `${data.personal.firstName.toLowerCase()}_${data.personal.lastName.toLowerCase()}_${type}.pdf`
      : `${type}.pdf`;
    
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper function to add a section header
function addSection(doc, title, yPos, colors, margin, contentWidth) {
  // Add page break if needed
  if (yPos > doc.internal.pageSize.height - 40) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(colors.primary);
  doc.text(title, margin, yPos);
  
  // Add underline
  const titleWidth = doc.getTextWidth(title);
  doc.setDrawColor(colors.accent);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 1, margin + titleWidth, yPos + 1);
  
  return yPos + 10;
}

// Export to DOCX
export const exportToDocx = async (data, templateId, type = 'resume') => {
  try {
    const fullName = data.personal ? `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim() : '';
    const fileName = fullName ? `${fullName.toLowerCase().replace(/\s+/g, '_')}_${type}.docx` : `${type}.docx`;

    const doc = new Document({
      sections: [{
        properties: {},
        children: type === 'coverLetter' ? generateCoverLetterDocx(data) : generateResumeDocx(data)
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw error;
  }
};

// Generate DOCX content for cover letter
function generateCoverLetterDocx(data) {
  const children = [];

  // Header with personal info
  if (data.personal) {
    const name = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
    if (name) {
      children.push(
        new Paragraph({
          text: name,
          heading: HeadingLevel.HEADING_1,
          alignment: 'center',
          spacing: { after: 200 }
        })
      );
    }

    const contactInfo = [];
    if (data.personal.email) contactInfo.push(data.personal.email);
    if (data.personal.phone) contactInfo.push(data.personal.phone);
    if (data.personal.location) contactInfo.push(data.personal.location);

    if (contactInfo.length > 0) {
      children.push(
        new Paragraph({
          children: contactInfo.map((info, index) => [
            new TextRun(info),
            index < contactInfo.length - 1 ? new TextRun(' | ') : new TextRun('')
          ]).flat(),
          alignment: 'center',
          spacing: { after: 400 }
        })
      );
    }
  }

  // Cover letter content
  if (data.coverLetter) {
    // Date
    if (data.coverLetter.letterDate) {
      children.push(
        new Paragraph({
          text: new Date(data.coverLetter.letterDate).toLocaleDateString(),
          spacing: { after: 200 }
        })
      );
    }

    // Recipient info
    if (data.coverLetter.recipientName) {
      children.push(new Paragraph({ text: data.coverLetter.recipientName }));
    }
    if (data.coverLetter.recipientTitle) {
      children.push(new Paragraph({ text: data.coverLetter.recipientTitle }));
    }
    if (data.coverLetter.companyName) {
      children.push(new Paragraph({ text: data.coverLetter.companyName }));
    }
    if (data.coverLetter.companyAddress) {
      data.coverLetter.companyAddress.split('\n').forEach(line => {
        children.push(new Paragraph({ text: line.trim() }));
      });
    }

    // Add some space
    children.push(new Paragraph({ text: '', spacing: { after: 200 } }));

    // Greeting
    children.push(
      new Paragraph({
        text: data.coverLetter.greeting || 'Dear Hiring Manager,',
        spacing: { after: 200 }
      })
    );

    // Content
    if (data.coverLetter.content) {
      const paragraphs = data.coverLetter.content.split('\n\n');
      paragraphs.forEach(para => {
        children.push(
          new Paragraph({
            text: para.trim(),
            spacing: { after: 200 }
          })
        );
      });
    }

    // Closing
    children.push(
      new Paragraph({
        text: data.coverLetter.closing || 'Sincerely,',
        spacing: { after: 200 }
      })
    );

    // Signature
    if (data.personal) {
      const signature = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
      if (signature) {
        children.push(new Paragraph({ text: signature }));
      }
    }
  }

  return children;
}

// Generate DOCX content for resume
function generateResumeDocx(data) {
  const sections = [];

  // Header with personal info
  if (data.personal) {
    const name = `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim();
    if (name) {
      sections.push(
        new Paragraph({
          text: name,
          heading: HeadingLevel.HEADING_1,
          alignment: 'center',
          spacing: { after: 200 }
        })
      );
    }

    const contactInfo = [];
    if (data.personal.email) contactInfo.push(data.personal.email);
    if (data.personal.phone) contactInfo.push(data.personal.phone);
    if (data.personal.location) contactInfo.push(data.personal.location);

    if (contactInfo.length > 0) {
      sections.push(
        new Paragraph({
          children: contactInfo.map((info, index) => [
            new TextRun(info),
            index < contactInfo.length - 1 ? new TextRun(' | ') : new TextRun('')
          ]).flat(),
          alignment: 'center',
          spacing: { after: 400 }
        })
      );
    }

    // Summary
    if (data.personal.summary) {
      sections.push(
        createHeading('Professional Summary'),
        new Paragraph({
          text: data.personal.summary,
          spacing: { after: 200 }
        })
      );
    }
  }

  // Experience section
  if (data.experience?.length > 0) {
    sections.push(createHeading('Experience'));
    
    data.experience.forEach(exp => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.company || '', bold: true }),
            new TextRun(' | '),
            new TextRun({ text: exp.position || '', italics: true })
          ],
          spacing: { before: 200 }
        }),
        new Paragraph({
          text: `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`,
          spacing: { before: 100 }
        })
      );

      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: { before: 100 }
          })
        );
      }

      if (exp.achievements?.length > 0) {
        exp.achievements.forEach(achievement => {
          sections.push(
            new Paragraph({
              text: `• ${achievement}`,
              spacing: { before: 100 }
            })
          );
        });
      }
    });
  }

  // Education section
  if (data.education?.length > 0) {
    sections.push(createHeading('Education'));
    
    data.education.forEach(edu => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school || '', bold: true }),
            new TextRun(' | '),
            new TextRun({ text: edu.degree || '', italics: true })
          ],
          spacing: { before: 200 }
        }),
        new Paragraph({
          text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
          spacing: { before: 100 }
        })
      );

      if (edu.description) {
        sections.push(
          new Paragraph({
            text: edu.description,
            spacing: { before: 100 }
          })
        );
      }
    });
  }

  // Skills section
  if (data.skills?.length > 0) {
    sections.push(
      createHeading('Skills'),
      new Table({
        rows: [
          new TableRow({
            children: data.skills.map(skill =>
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
    );
  }

  // Languages Section
  if (data.languages?.length > 0) {
    sections.push(createHeading('Languages'));
    const languageRows = data.languages.map(lang => {
      const cells = [
        new TableCell({
          children: [new Paragraph(lang.name)],
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph(lang.proficiency)],
          width: { size: 30, type: WidthType.PERCENTAGE }
        }),
        new TableCell({
          children: [new Paragraph(lang.certification || '')],
          width: { size: 40, type: WidthType.PERCENTAGE }
        })
      ];
      return new TableRow({ children: cells });
    });

    sections.push(
      new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph('Language')] }),
              new TableCell({ children: [new Paragraph('Proficiency')] }),
              new TableCell({ children: [new Paragraph('Certification')] })
            ]
          }),
          ...languageRows
        ]
      })
    );
  }

  // Certifications Section
  if (data.certifications?.length > 0) {
    sections.push(createHeading('Certifications'));
    data.certifications.forEach(cert => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true
            }),
            new TextRun({
              text: ` - ${cert.issuer}`,
              italics: true
            })
          ]
        })
      );

      if (cert.issueDate || cert.expiryDate) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Issued: ${formatDate(cert.issueDate)}${cert.expiryDate ? ` - Expires: ${formatDate(cert.expiryDate)}` : ''}`,
                size: 20
              })
            ]
          })
        );
      }

      if (cert.credentialId) {
        sections.push(
          new Paragraph({
            text: `Credential ID: ${cert.credentialId}`,
            size: 20
          })
        );
      }

      if (cert.credentialUrl) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'View Credential',
                underline: true,
                color: '0000FF',
                size: 20
              })
            ]
          })
        );
      }
    });
  }

  // Projects Section
  if (data.projects?.length > 0) {
    sections.push(createHeading('Projects'));
    data.projects.forEach(project => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: project.name,
              bold: true
            }),
            new TextRun({
              text: project.startDate ? ` (${project.startDate}${project.endDate ? ` - ${project.endDate}` : ' - Present'})` : '',
              italics: true
            })
          ]
        })
      );

      if (project.description) {
        sections.push(
          new Paragraph({
            text: project.description,
            size: 20
          })
        );
      }

      if (project.technologies?.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'Technologies: ',
                bold: true,
                size: 20
              }),
              new TextRun({
                text: project.technologies.join(', '),
                size: 20
              })
            ]
          })
        );
      }

      if (project.achievements?.length > 0) {
        project.achievements.forEach(achievement => {
          sections.push(
            new Paragraph({
              text: `• ${achievement}`,
              bullet: { level: 0 },
              size: 20
            })
          );
        });
      }

      if (project.url) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: 'View Project',
                underline: true,
                color: '0000FF',
                size: 20
              })
            ]
          })
        );
      }
    });
  }

  return sections;
}

// Export to HTML
export const exportToHTML = (data, templateId, type = 'resume') => {
  try {
    const template = getTemplate(templateId);
    const settings = template.settings;
    const colors = {
      primary: settings.colorScheme.primary || '#2563eb',
      secondary: settings.colorScheme.secondary || '#4b5563',
      accent: settings.colorScheme.accent || '#60a5fa'
    };

    const fullName = data.personal ? `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim() : '';
    const fileName = fullName ? `${fullName.toLowerCase().replace(/\s+/g, '_')}_${type}.html` : `${type}.html`;

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
            color: ${colors.primary};
            text-align: center;
            margin-bottom: 10px;
          }
          h2 { 
            color: ${colors.primary};
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 5px;
            margin-top: 30px;
          }
          .contact-info {
            color: ${colors.secondary};
            text-align: center;
            margin-bottom: 20px;
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
            color: ${colors.primary};
          }
          .subtitle {
            font-style: italic;
            color: ${colors.secondary};
          }
          .date {
            color: ${colors.secondary};
          }
          .description {
            margin: 10px 0;
            color: ${colors.secondary};
          }
          .achievements {
            list-style-type: none;
            padding-left: 20px;
          }
          .achievements li:before {
            content: "•";
            color: ${colors.accent};
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
            background: ${colors.accent}20;
            padding: 5px 15px;
            border-radius: 15px;
            font-size: 0.9em;
            color: ${colors.primary};
          }
          @media print {
            body {
              padding: 0;
              color: black;
            }
            .skill {
              border: 1px solid #ddd;
            }
          }
        </style>
      </head>
      <body>
        ${type === 'coverLetter' ? generateCoverLetterHTML(data) : generateResumeHTML(data)}
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

// Generate HTML content for cover letter
function generateCoverLetterHTML(data) {
  const fullName = data.personal ? `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim() : '';
  
  return `
    <h1>${fullName}</h1>
    <div class="contact-info">
      ${[
        data.personal?.email,
        data.personal?.phone,
        data.personal?.location
      ].filter(Boolean).join(' • ')}
    </div>
    
    <div class="section">
      ${data.coverLetter?.letterDate ? `
        <p>${new Date(data.coverLetter.letterDate).toLocaleDateString()}</p>
      ` : ''}
      
      ${[
        data.coverLetter?.recipientName,
        data.coverLetter?.recipientTitle,
        data.coverLetter?.companyName,
        data.coverLetter?.companyAddress
      ].filter(Boolean).map(info => `<p>${info}</p>`).join('')}
      
      <p class="greeting">${data.coverLetter?.greeting || 'Dear Hiring Manager,'}</p>
      
      <div class="content">
        ${data.coverLetter?.content ? `
          <div style="white-space: pre-line">${data.coverLetter.content}</div>
        ` : ''}
      </div>
      
      <p class="closing">${data.coverLetter?.closing || 'Sincerely,'}</p>
      <p class="signature">${fullName}</p>
    </div>
  `;
}

// Generate HTML content for resume
function generateResumeHTML(data) {
  let html = '';
  const fullName = data.personal ? `${data.personal.firstName || ''} ${data.personal.lastName || ''}`.trim() : '';
  
  html += `
    <h1>${fullName}</h1>
    <div class="contact-info">
      ${[
        data.personal?.email,
        data.personal?.phone,
        data.personal?.location
      ].filter(Boolean).join(' • ')}
    </div>
    
    ${data.personal?.summary ? `
      <section class="section">
        <h2>Professional Summary</h2>
        <p>${data.personal.summary}</p>
      </section>
    ` : ''}
    
    ${data.experience?.length ? `
      <section class="section">
        <h2>Experience</h2>
        ${data.experience.map(exp => `
          <div class="item">
            <div class="item-header">
              <div>
                <span class="title">${exp.company || ''}</span>
                <span class="subtitle"> | ${exp.position || ''}</span>
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
    
    ${data.education?.length ? `
      <section class="section">
        <h2>Education</h2>
        ${data.education.map(edu => `
          <div class="item">
            <div class="item-header">
              <div>
                <span class="title">${edu.school || ''}</span>
                <span class="subtitle"> | ${edu.degree || ''}</span>
              </div>
              <span class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
            </div>
            ${edu.description ? `<p class="description">${edu.description}</p>` : ''}
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${data.skills?.length ? `
      <section class="section">
        <h2>Skills</h2>
        <div class="skills">
          ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
      </section>
    ` : ''}
  `;

  // Languages Section
  if (data.languages?.length > 0) {
    html += '<section class="mb-6">';
    html += '<h2 class="text-xl font-semibold text-gray-800 mb-2">Languages</h2>';
    html += '<div class="grid grid-cols-2 gap-4">';
    data.languages.forEach(lang => {
      html += `
        <div class="bg-gray-50 p-3 rounded">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-800">${lang.name}</span>
            <span class="text-sm text-gray-600">${lang.proficiency}</span>
          </div>
          ${lang.certification ? `<div class="text-sm text-gray-600 mt-1">${lang.certification}</div>` : ''}
        </div>
      `;
    });
    html += '</div></section>';
  }

  // Certifications Section
  if (data.certifications?.length > 0) {
    html += '<section class="mb-6">';
    html += '<h2 class="text-xl font-semibold text-gray-800 mb-2">Certifications</h2>';
    data.certifications.forEach(cert => {
      html += `
        <div class="mb-4">
          <div class="flex justify-between items-baseline">
            <h3 class="text-lg font-medium text-gray-800">${cert.name}</h3>
            <span class="text-gray-600 text-sm">
              ${cert.issueDate ? `Issued: ${formatDate(cert.issueDate)}` : ''}
              ${cert.expiryDate ? ` - Expires: ${formatDate(cert.expiryDate)}` : ''}
            </span>
          </div>
          <div class="text-gray-700 font-medium">${cert.issuer}</div>
          ${cert.credentialId ? `<div class="text-gray-600 text-sm mt-1">Credential ID: ${cert.credentialId}</div>` : ''}
          ${cert.credentialUrl ? `
            <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" 
               class="text-blue-600 hover:text-blue-800 text-sm mt-1 inline-block">
              View Credential →
            </a>
          ` : ''}
        </div>
      `;
    });
    html += '</section>';
  }

  // Projects Section
  if (data.projects?.length > 0) {
    html += '<section class="mb-6">';
    html += '<h2 class="text-xl font-semibold text-gray-800 mb-2">Projects</h2>';
    data.projects.forEach(project => {
      html += `
        <div class="mb-4">
          <div class="flex justify-between items-baseline">
            <h3 class="text-lg font-medium text-gray-800">${project.name}</h3>
            <span class="text-gray-600 text-sm">
              ${project.startDate ? project.startDate : ''}
              ${project.endDate ? ` - ${project.endDate}` : ' - Present'}
            </span>
          </div>
          <p class="text-gray-600 mt-1">${project.description}</p>
          ${project.technologies?.length ? `
            <div class="flex flex-wrap gap-2 mt-2">
              ${project.technologies.map(tech => `
                <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-sm">${tech}</span>
              `).join('')}
            </div>
          ` : ''}
          ${project.achievements?.length ? `
            <ul class="list-disc list-inside mt-2">
              ${project.achievements.map(achievement => `
                <li class="text-gray-600">${achievement}</li>
              `).join('')}
            </ul>
          ` : ''}
          ${project.url ? `
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" 
               class="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
              View Project →
            </a>
          ` : ''}
        </div>
      `;
    });
    html += '</section>';
  }

  return html;
} 