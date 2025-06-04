import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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

export async function generatePDF(data, templateId, type = 'resume') {
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
}

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