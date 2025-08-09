import jsPDF from 'jspdf';
import { BrandProfile } from '@/types/brand';

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

export const exportBrandToPDF = async (brandProfile: BrandProfile) => {
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

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number): number => {
    if (y + requiredSpace > pageHeight - 30) {
      pdf.addPage();
      return margin;
    }
    return y;
  };

  // Header
  pdf.setFillColor(79, 70, 229); // Purple background
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('Brand Profile', margin, 25);
  // Version/Status chip on header
  const headerRightX = pageWidth - margin - 120;
  pdf.setFontSize(10);
  pdf.setTextColor(230, 230, 255);
  const version = brandProfile.version ?? 1;
  const statusLabel = (brandProfile.status ?? 'draft').replace('_', ' ');
  pdf.text(`v${version} • ${statusLabel}`, headerRightX, 25);
  
  y = 50;

  // Try to add logo if available
  if (brandProfile.brandVisuals.logoURL) {
    try {
      const logoBase64 = await getImageAsBase64(brandProfile.brandVisuals.logoURL);
      const logoSize = 40;
      const logoX = pageWidth - margin - logoSize;
      
      pdf.addImage(logoBase64, 'JPEG', logoX, y, logoSize, logoSize, undefined, 'FAST');
    } catch (error) {
      console.error('Could not load brand logo:', error);
    }
  }

  // Company Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.text(brandProfile.companyInfo.companyName, margin, y + 15);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`${brandProfile.companyInfo.industry} • ${brandProfile.companyInfo.country}`, margin, y + 25);
  if (brandProfile.companyInfo.website) {
    pdf.text(brandProfile.companyInfo.website, margin, y + 32);
  }
  y += 50;

  // Brand Essence Section
  y = checkNewPage(50);
  pdf.setTextColor(79, 70, 229);
  pdf.setFontSize(16);
  pdf.text('Brand Essence', margin, y);
  y += 10;

  pdf.setTextColor(0, 0, 0);
  if (brandProfile.brandEssence.tagline) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Tagline:', margin, y);
    pdf.setTextColor(0, 0, 0);
    y = addWrappedText(brandProfile.brandEssence.tagline, margin + 25, y, contentWidth - 25, 12);
    y += 5;
  }

  if (brandProfile.brandEssence.brandPurpose) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Brand Purpose:', margin, y);
    pdf.setTextColor(0, 0, 0);
    y = addWrappedText(brandProfile.brandEssence.brandPurpose, margin, y + 5, contentWidth, 10);
    y += 8;
  }

  if (brandProfile.brandEssence.mission) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Mission:', margin, y);
    pdf.setTextColor(0, 0, 0);
    y = addWrappedText(brandProfile.brandEssence.mission, margin, y + 5, contentWidth, 10);
    y += 8;
  }

  if (brandProfile.brandEssence.vision) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Vision:', margin, y);
    pdf.setTextColor(0, 0, 0);
    y = addWrappedText(brandProfile.brandEssence.vision, margin, y + 5, contentWidth, 10);
    y += 8;
  }

  // Values
  if (brandProfile.brandEssence.values.length > 0) {
    y = checkNewPage(30);
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Core Values:', margin, y);
    y += 5;
    pdf.setFontSize(10);
    brandProfile.brandEssence.values.forEach((value) => {
      if (value && value.trim()) {
        y = checkNewPage(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`• ${value}`, margin + 5, y);
        y += 6;
      }
    });
    y += 5;
  }

  // Brand Personality Section
  y = checkNewPage(40);
  pdf.setTextColor(79, 70, 229);
  pdf.setFontSize(16);
  pdf.text('Brand Personality', margin, y);
  y += 10;

  if (brandProfile.brandPersonality.archetype) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Archetype:', margin, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(brandProfile.brandPersonality.archetype, margin + 25, y);
    y += 8;
  }

  // Traits
  if (brandProfile.brandPersonality.traits.length > 0) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Brand Traits:', margin, y);
    y += 5;
    pdf.setFontSize(10);
    brandProfile.brandPersonality.traits.forEach((trait) => {
      if (trait && trait.trim()) {
        y = checkNewPage(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`• ${trait}`, margin + 5, y);
        y += 6;
      }
    });
    y += 5;
  }

  // Voice & Tone
  if (brandProfile.brandPersonality.voiceTone.primaryTone) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Voice & Tone:', margin, y);
    pdf.setTextColor(0, 0, 0);
    const toneText = brandProfile.brandPersonality.voiceTone.secondaryTone 
      ? `${brandProfile.brandPersonality.voiceTone.primaryTone}, ${brandProfile.brandPersonality.voiceTone.secondaryTone}`
      : brandProfile.brandPersonality.voiceTone.primaryTone;
    pdf.text(toneText, margin + 30, y);
    y += 12;
  }

  // Target Audience Section
  if (brandProfile.targetAudience.length > 0) {
    y = checkNewPage(40);
    pdf.setTextColor(79, 70, 229);
    pdf.setFontSize(16);
    pdf.text('Target Audience', margin, y);
    y += 10;

    brandProfile.targetAudience.forEach((audience) => {
      if (audience.name && audience.name.trim()) {
        y = checkNewPage(20);
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(audience.name, margin, y);
        y += 6;
        
        if (audience.description) {
          pdf.setFontSize(10);
          y = addWrappedText(audience.description, margin + 5, y, contentWidth - 5, 10);
          y += 3;
        }
        y += 5;
      }
    });
  }

  // Messaging Section
  y = checkNewPage(40);
  pdf.setTextColor(79, 70, 229);
  pdf.setFontSize(16);
  pdf.text('Messaging', margin, y);
  y += 10;

  if (brandProfile.messaging.elevatorPitch) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Elevator Pitch:', margin, y);
    y += 5;
    pdf.setTextColor(0, 0, 0);
    y = addWrappedText(brandProfile.messaging.elevatorPitch, margin, y, contentWidth, 10);
    y += 8;
  }

  // Key Messages
  if (brandProfile.messaging.keyMessages.length > 0) {
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Key Messages:', margin, y);
    y += 5;
    pdf.setFontSize(10);
    brandProfile.messaging.keyMessages.forEach((message) => {
      if (message && message.trim()) {
        y = checkNewPage(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`• ${message}`, margin + 5, y);
        y += 6;
      }
    });
  }

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
  const fileName = brandProfile.companyInfo.companyName 
    ? `${brandProfile.companyInfo.companyName.replace(/\s+/g, '_')}_Brand_Profile.pdf`
    : 'Brand_Profile.pdf';
  
  pdf.save(fileName);
};

// Persona interface for type safety
export interface PersonaData {
  id: string;
  name: string;
  age: number;
  occupation: string;
  location: string;
  income: string;
  image: string;
  description: string;
  goals: string[];
  painPoints: string[];
  preferredChannels: string[];
  buyingBehavior: string;
  color: string;
}

export const copyBrandToClipboard = async (brandProfile: BrandProfile) => {
  // Create a clean JSON object without React components and functions
  const cleanBrandProfile = {
    companyInfo: {
      companyName: brandProfile.companyInfo.companyName,
      industry: brandProfile.companyInfo.industry,
      website: brandProfile.companyInfo.website,
      country: brandProfile.companyInfo.country,
      yearFounded: brandProfile.companyInfo.yearFounded,
      size: brandProfile.companyInfo.size
    },
    brandEssence: {
      tagline: brandProfile.brandEssence.tagline,
      brandPurpose: brandProfile.brandEssence.brandPurpose,
      mission: brandProfile.brandEssence.mission,
      vision: brandProfile.brandEssence.vision,
      values: brandProfile.brandEssence.values,
      brandPromise: brandProfile.brandEssence.brandPromise
    },
    brandPersonality: {
      archetype: brandProfile.brandPersonality.archetype,
      traits: brandProfile.brandPersonality.traits,
      voiceTone: brandProfile.brandPersonality.voiceTone
    },
    brandVisuals: {
      logoURL: brandProfile.brandVisuals.logoURL,
      primaryColors: brandProfile.brandVisuals.primaryColors,
      secondaryColors: brandProfile.brandVisuals.secondaryColors,
      typography: brandProfile.brandVisuals.typography,
      imageStyleDescription: brandProfile.brandVisuals.imageStyleDescription
    },
    targetAudience: brandProfile.targetAudience,
    competitiveLandscape: brandProfile.competitiveLandscape,
    messaging: brandProfile.messaging,
    compliance: brandProfile.compliance
  };

  const jsonString = JSON.stringify(cleanBrandProfile, null, 2);
  
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

export const copyBrandWithPersonasToClipboard = async (brandProfile: BrandProfile, personas: PersonaData[]) => {
  // Create a clean JSON object without React components and functions
  const cleanBrandProfile = {
    companyInfo: {
      companyName: brandProfile.companyInfo.companyName,
      industry: brandProfile.companyInfo.industry,
      website: brandProfile.companyInfo.website,
      country: brandProfile.companyInfo.country,
      yearFounded: brandProfile.companyInfo.yearFounded,
      size: brandProfile.companyInfo.size
    },
    brandEssence: {
      tagline: brandProfile.brandEssence.tagline,
      brandPurpose: brandProfile.brandEssence.brandPurpose,
      mission: brandProfile.brandEssence.mission,
      vision: brandProfile.brandEssence.vision,
      values: brandProfile.brandEssence.values,
      brandPromise: brandProfile.brandEssence.brandPromise
    },
    brandPersonality: {
      archetype: brandProfile.brandPersonality.archetype,
      traits: brandProfile.brandPersonality.traits,
      voiceTone: brandProfile.brandPersonality.voiceTone
    },
    brandVisuals: {
      logoURL: brandProfile.brandVisuals.logoURL,
      primaryColors: brandProfile.brandVisuals.primaryColors,
      secondaryColors: brandProfile.brandVisuals.secondaryColors,
      typography: brandProfile.brandVisuals.typography,
      imageStyleDescription: brandProfile.brandVisuals.imageStyleDescription
    },
    targetAudience: brandProfile.targetAudience,
    competitiveLandscape: brandProfile.competitiveLandscape,
    messaging: brandProfile.messaging,
    compliance: brandProfile.compliance,
    // Add personas array
    personas: personas.map(persona => ({
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
    }))
  };

  const jsonString = JSON.stringify(cleanBrandProfile, null, 2);
  
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