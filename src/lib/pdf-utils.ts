import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Polyfill for HTMLCanvasElement.prototype.toBlob
 * This helps ensure compatibility across different browsers
 */
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback: BlobCallback, type?: string, quality?: any) {
      const dataURL = this.toDataURL(type, quality);
      const binStr = atob(dataURL.split(',')[1]);
      const len = binStr.length;
      const arr = new Uint8Array(len);
      
      for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      
      callback(new Blob([arr], { type: type || 'image/png' }));
    }
  });
}

/**
 * Simple mapping of oklch lightness values to hex colors
 * This is a very simplified approach but should work for most cases
 */
const oklchToHexMap: Record<string, string> = {
  // Dark colors (low lightness)
  '0.1': '#111111',
  '0.2': '#222222',
  '0.3': '#333333',
  '0.4': '#444444',
  '0.5': '#555555',
  '0.6': '#666666',
  '0.7': '#777777',
  '0.8': '#888888',
  '0.9': '#999999',
  // Light colors (high lightness)
  '0.95': '#f0f0f0',
  '0.98': '#fafafa',
  '0.99': '#fdfdfd',
  '1.0': '#ffffff',
};

/**
 * Attempts to convert an oklch color string to a hex color
 * This is a very simplified approach but should work for most cases
 * @param oklchColor The oklch color string to convert
 * @returns A hex color string
 */
function convertOklchToHex(oklchColor: string): string {
  try {
    // Extract the lightness value from the oklch color
    const lightnessMatch = oklchColor.match(/oklch\(\s*([0-9.]+)/);
    if (lightnessMatch && lightnessMatch[1]) {
      const lightness = parseFloat(lightnessMatch[1]);
      
      // Round to the nearest 0.1
      const roundedLightness = Math.round(lightness * 10) / 10;
      
      // Look up in the map
      const key = roundedLightness.toFixed(1);
      if (oklchToHexMap[key]) {
        return oklchToHexMap[key];
      }
      
      // Fallback for values not in the map
      if (lightness < 0.5) {
        return '#000000'; // Dark colors default to black
      } else {
        return '#ffffff'; // Light colors default to white
      }
    }
    
    // Default fallback
    return '#000000';
  } catch (error) {
    console.error('Error converting oklch to hex:', error);
    return '#000000';
  }
}

/**
 * Replaces all oklch colors in the document with hex equivalents
 * This should be called before PDF generation to avoid the oklch parsing error
 * @param element The element to process
 */
export function replaceOklchColors(element: HTMLElement): void {
  try {
    console.log('Replacing oklch colors in element');
    
    // Process all elements with computed styles
    const elements = element.querySelectorAll('*');
    elements.forEach(el => {
      try {
        const element = el as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        
        // Check for oklch in color
        const color = computedStyle.color;
        if (color && color.includes('oklch')) {
          element.style.color = convertOklchToHex(color);
        }
        
        // Check for oklch in background-color
        const backgroundColor = computedStyle.backgroundColor;
        if (backgroundColor && backgroundColor.includes('oklch')) {
          element.style.backgroundColor = convertOklchToHex(backgroundColor);
        }
        
        // Check for oklch in border-color
        const borderColor = computedStyle.borderColor;
        if (borderColor && borderColor.includes('oklch')) {
          element.style.borderColor = '#000000';
        }
      } catch (elementError) {
        console.error('Error processing element:', elementError);
      }
    });
    
    console.log('Finished replacing oklch colors');
  } catch (error) {
    console.error('Error replacing oklch colors:', error);
  }
}

/**
 * Prepares the document for PDF generation by adding temporary styles
 * to override problematic CSS like oklch color functions
 * @returns The created style element that should be removed after PDF generation
 */
export function prepareDocumentForPDF(): HTMLStyleElement {
  // Create a temporary style element to override problematic CSS
  const tempStyle = document.createElement('style');
  tempStyle.innerHTML = `
    * {
      color-scheme: light !important;
    }
    [data-theme] {
      background-color: white !important;
    }
    :root {
      --background: 0 0% 100%;
      --foreground: 222.2 84% 4.9%;
      --card: 0 0% 100%;
      --card-foreground: 222.2 84% 4.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 222.2 84% 4.9%;
      --primary: 221.2 83.2% 53.3%;
      --primary-foreground: 210 40% 98%;
      --secondary: 210 40% 96.1%;
      --secondary-foreground: 222.2 47.4% 11.2%;
      --muted: 210 40% 96.1%;
      --muted-foreground: 215.4 16.3% 46.9%;
      --accent: 210 40% 96.1%;
      --accent-foreground: 222.2 47.4% 11.2%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 210 40% 98%;
      --border: 214.3 31.8% 91.4%;
      --input: 214.3 31.8% 91.4%;
      --ring: 221.2 83.2% 53.3%;
    }
    
    /* Fix for oklch colors in UI elements outside the resume */
    body > *:not(.resume-template-wrapper) {
      color: #000000 !important;
    }
    
    /* Fix for all oklch colors */
    [style*="oklch"] {
      color: #000000 !important;
      background-color: transparent !important;
    }
    
    /* Classic template specific styles */
    .template-classic [style*="background: #003147"],
    .template-classic [style*="background:#003147"] {
      background-color: #003147 !important;
    }
    
    .template-classic [style*="color: #fff"],
    .template-classic [style*="color:#fff"],
    .template-classic [style*="color: #ffffff"],
    .template-classic [style*="color:#ffffff"] {
      color: #ffffff !important;
    }
    
    .template-classic [style*="color: #03a9f4"],
    .template-classic [style*="color:#03a9f4"] {
      color: #03a9f4 !important;
    }
    
    .template-classic [style*="background: #03a9f4"],
    .template-classic [style*="background:#03a9f4"] {
      background-color: #03a9f4 !important;
    }
    
    .template-classic [style*="color: #2a7da2"],
    .template-classic [style*="color:#2a7da2"] {
      color: #2a7da2 !important;
    }
    
    .template-classic [style*="color: #003147"],
    .template-classic [style*="color:#003147"] {
      color: #003147 !important;
    }
    
    /* Fix for classic template left side */
    .template-classic div[style*="grid-template-columns"] > div:first-child {
      background-color: #003147 !important;
    }
    
    /* Preserve white text in left side, but allow specific colored elements */
    .template-classic div[style*="grid-template-columns"] > div:first-child > * {
      color: #ffffff !important;
    }
    
    /* Specific color overrides for classic template */
    .template-classic div[style*="grid-template-columns"] > div:first-child h5[style*="color: #03a9f4"],
    .template-classic div[style*="grid-template-columns"] > div:first-child h5[style*="color:#03a9f4"] {
      color: #03a9f4 !important;
    }
    
    .template-classic div[style*="grid-template-columns"] > div:first-child span[style*="color: #03a9f4"],
    .template-classic div[style*="grid-template-columns"] > div:first-child span[style*="color:#03a9f4"] {
      color: #03a9f4 !important;
    }
    
    /* Fix for the initials in the circle */
    .template-classic div[style*="border-radius: 50%"] > div {
      color: #003147 !important;
    }
    
    /* Modern template fixes */
    .template-modern h1 {
      color: #000000 !important;
    }
    .template-modern h2 {
      color: #000000 !important;
    }
    .template-modern p {
      color: #000000 !important;
    }
    .template-modern div {
      color: #000000 !important;
    }
    .template-modern span {
      color: #000000 !important;
    }
    
    /* Minimal template fixes */
    .template-minimal h1 {
      color: #000000 !important;
    }
    .template-minimal h2 {
      color: #000000 !important;
    }
    .template-minimal p {
      color: #000000 !important;
    }
    .template-minimal div {
      color: #000000 !important;
    }
    .template-minimal span {
      color: #000000 !important;
    }
  `;
  document.head.appendChild(tempStyle);
  return tempStyle;
}

/**
 * Converts all oklch colors to hex in the document
 * @param doc The document to process
 */
function convertOklchColors(doc: Document): void {
  // Process all elements with inline styles
  const elements = doc.querySelectorAll('*');
  elements.forEach(el => {
    const element = el as HTMLElement;
    if (!element.style) return;
    
    // Convert color property
    if (element.style.color && element.style.color.includes('oklch')) {
      // Default to black text
      element.style.color = '#000000';
      
      // Special handling for template-specific elements
      if (element.closest('.template-classic')) {
        // Handle classic template specific colors
        if (element.closest('[style*="background: #003147"]') || 
            element.closest('[style*="background:#003147"]')) {
          element.style.color = '#ffffff';
        }
        
        // Handle specific elements in classic template
        if (element.tagName === 'H5' && element.textContent?.includes('-')) {
          element.style.color = '#03a9f4';
        } else if (element.tagName === 'H4') {
          element.style.color = '#2a7da2';
        } else if (element.tagName === 'H2') {
          element.style.color = '#003147';
        }
      }
    }
    
    // Convert background-color property
    if (element.style.backgroundColor && element.style.backgroundColor.includes('oklch')) {
      // Default to transparent background
      element.style.backgroundColor = 'transparent';
      
      // Special handling for template-specific elements
      if (element.closest('.template-classic')) {
        // Handle classic template specific backgrounds
        if (element.style.backgroundColor.includes('oklch(0.2')) {
          element.style.backgroundColor = '#003147';
        } else if (element.style.backgroundColor.includes('oklch(0.6')) {
          element.style.backgroundColor = '#03a9f4';
        }
      }
    }
    
    // Remove any other problematic styles
    if (element.style.boxShadow) {
      element.style.boxShadow = 'none';
    }
  });
}

/**
 * Generates a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param filename The filename for the PDF
 * @returns Promise that resolves when the PDF is generated and downloaded
 */
export async function generatePDF(element: HTMLElement, filename: string): Promise<void> {
  try {
    console.log('Starting PDF generation for element:', element);
    console.log('Element dimensions:', element.offsetWidth, 'x', element.offsetHeight);
    
    // Hide non-printable elements
    const printButtons = document.querySelectorAll('.no-print');
    printButtons.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Replace all oklch colors with hex equivalents
    console.log('Replacing oklch colors before PDF generation');
    replaceOklchColors(element);
    
    // Add temporary styles to handle problematic CSS
    const tempStyle = prepareDocumentForPDF();
    console.log('Temporary styles added for PDF generation');
    
    // Check if this is a classic template
    const isClassicTemplate = element.classList.contains('template-classic');
    console.log('Template type:', isClassicTemplate ? 'classic' : 'other');
    
    try {
      // Generate canvas from the element
      console.log('Generating canvas from element...');
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale to avoid memory issues
        useCORS: true,
        logging: true, // Enable logging for debugging
        allowTaint: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          console.log('Document cloned for PDF generation');
          
          // Convert all oklch colors in the cloned document
          convertOklchColors(clonedDoc);
          
          // Add additional template-specific handling
          if (isClassicTemplate) {
            // Find the left side of the classic template
            const leftSide = clonedDoc.querySelector('div[style*="grid-template-columns"] > div:first-child');
            if (leftSide) {
              (leftSide as HTMLElement).style.backgroundColor = '#003147';
              
              // Set all text in left side to white except specific elements
              const leftSideElements = leftSide.querySelectorAll('*');
              leftSideElements.forEach(el => {
                const element = el as HTMLElement;
                
                // Preserve blue dates
                if (element.tagName === 'H5' && element.style.fontWeight === '500') {
                  element.style.color = '#03a9f4';
                } 
                // Preserve blue icons
                else if (element.tagName === 'SPAN' && element.style.color.includes('#03a9f4')) {
                  element.style.color = '#03a9f4';
                }
                // Default white text for other elements
                else if (!element.style.color.includes('#03a9f4')) {
                  element.style.color = '#ffffff';
                }
              });
            }
            
            // Fix the initials in the circle
            const imgBx = clonedDoc.querySelector('div[style*="border-radius: 50%"]');
            if (imgBx) {
              const initialsDiv = imgBx.querySelector('div');
              if (initialsDiv) {
                (initialsDiv as HTMLElement).style.color = '#003147';
              }
            }
          }
        }
      });
      
      console.log('Canvas generated successfully, dimensions:', canvas.width, 'x', canvas.height);
      
      // Restore display of buttons and remove temporary style
      printButtons.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      document.head.removeChild(tempStyle);
      
      // Convert canvas to image
      console.log('Converting canvas to image data...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Use JPEG with compression for smaller file size
      console.log('Image data generated, length:', imgData.length);
      
      // Create PDF with proper dimensions
      console.log('Creating PDF document...');
      
      // Calculate PDF dimensions (A4 size in points: 595 x 842)
      const pdfWidth = 595;
      const pdfHeight = 842;
      const aspectRatio = canvas.width / canvas.height;
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / aspectRatio;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'pt',
        format: 'a4'
      });
      
      // Add the image to the PDF
      console.log('Adding image to PDF...');
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      // Save the PDF
      console.log('Saving PDF as:', filename);
      pdf.save(filename);
      
      console.log('PDF generation completed successfully');
      return Promise.resolve();
    } catch (canvasError) {
      console.error('Error during canvas or PDF creation:', canvasError);
      throw canvasError;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return Promise.reject(error);
  }
} 