/**
 * Extracts text content from a PDF buffer
 * @param buffer - PDF file buffer
 * @returns Extracted text content
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const pdfParse = require('pdf-parse-fork');
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to parse PDF. Please ensure the file is a valid PDF document.');
    }
}

/**
 * Validates if the extracted CV text has minimum required content
 * @param text - Extracted CV text
 * @returns boolean indicating if CV is valid
 */
export function validateCVContent(text: string): boolean {
    const minLength = 100;
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasProfessionalWords = /experience|education|skills|work|project|degree/i.test(text);

    return text.length >= minLength && (hasEmail || hasProfessionalWords);
}

/**
 * Clean and normalize CV text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
export function cleanCVText(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}