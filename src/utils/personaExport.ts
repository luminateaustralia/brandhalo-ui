import jsPDF from 'jspdf';
import { PersonaData } from '@/lib/dummyData';

// Helper function to convert image URL to base64
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    throw error;
  }
};

export const exportPersonaToPDF = async (persona: PersonaData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, currentY: number, maxWidth: number, fontSize: number = 10): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, currentY);
    return currentY + (lines.length * fontSize * 0.4);
  };

  // Header
  pdf.setFillColor(79, 70, 229); // Purple background
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('Brand Persona Profile', margin, 25);
  
  y = 50;

  // Try to load and add the persona image
  try {
    const imageBase64 = await getImageAsBase64(persona.image);
    const imageSize = 50; // 50x50 image
    const imageX = pageWidth - margin - imageSize;
    
    pdf.addImage(imageBase64, 'JPEG', imageX, y, imageSize, imageSize, undefined, 'FAST');
  } catch (error) {
    console.error('Could not load persona image:', error);
    // Continue without image if it fails to load
  }

  // Basic Information (adjusted layout to account for image)
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.text(persona.name, margin, y + 15);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${persona.occupation} • Age ${persona.age}`, margin, y + 25);
  pdf.text(`${persona.location} • ${persona.income}`, margin, y + 32);
  y += 60;

  // Description
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.text('Description', margin, y);
  y += 8;
  pdf.setFontSize(10);
  y = addWrappedText(persona.description, margin, y, contentWidth, 10);
  y += 15;

  // Goals
  pdf.setFontSize(14);
  pdf.text('Goals', margin, y);
  y += 8;
  pdf.setFontSize(10);
  persona.goals.forEach((goal) => {
    if (y > pageHeight - 30) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(`• ${goal}`, margin + 5, y);
    y += 6;
  });
  y += 10;

  // Pain Points
  if (y > pageHeight - 50) {
    pdf.addPage();
    y = margin;
  }
  pdf.setFontSize(14);
  pdf.text('Pain Points', margin, y);
  y += 8;
  pdf.setFontSize(10);
  persona.painPoints.forEach((pain) => {
    if (y > pageHeight - 30) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(`• ${pain}`, margin + 5, y);
    y += 6;
  });
  y += 10;

  // Preferred Channels
  if (y > pageHeight - 40) {
    pdf.addPage();
    y = margin;
  }
  pdf.setFontSize(14);
  pdf.text('Preferred Channels', margin, y);
  y += 8;
  pdf.setFontSize(10);
  const channelsText = persona.preferredChannels.join(', ');
  y = addWrappedText(channelsText, margin, y, contentWidth, 10);
  y += 15;

  // Buying Behavior
  if (y > pageHeight - 40) {
    pdf.addPage();
    y = margin;
  }
  pdf.setFontSize(14);
  pdf.text('Buying Behavior', margin, y);
  y += 8;
  pdf.setFontSize(10);
  y = addWrappedText(persona.buyingBehavior, margin, y, contentWidth, 10);

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
  }

  // Save the PDF
  pdf.save(`${persona.name.replace(/\s+/g, '_')}_Persona.pdf`);
};

export const copyPersonaToClipboard = async (persona: PersonaData) => {
  // Create a clean JSON object without the React component
  const cleanPersona = {
    id: persona.id,
    name: persona.name,
    age: persona.age,
    occupation: persona.occupation,
    location: persona.location,
    income: persona.income,
    image: persona.image,
    description: persona.description,
    goals: persona.goals,
    painPoints: persona.painPoints,
    preferredChannels: persona.preferredChannels,
    buyingBehavior: persona.buyingBehavior,
    color: persona.color
  };

  const jsonString = JSON.stringify(cleanPersona, null, 2);
  
  try {
    await navigator.clipboard.writeText(jsonString);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};