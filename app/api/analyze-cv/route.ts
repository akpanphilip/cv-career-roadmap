import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, validateCVContent } from '../../utils/pdfParser';
import { ANALYZE_CV_PROMPT } from '../../utils/prompts';
import { callAI } from '../../utils/aiClient';
import { validateCVAnalysis } from '../../utils/validators';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('cv') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let cvText: string;

        if (file.type === 'application/pdf') {
            cvText = await extractTextFromPDF(buffer);
        } else if (file.type === 'text/plain') {
            cvText = buffer.toString('utf-8');
        } else {
            return NextResponse.json(
                { error: 'Unsupported file type. Please upload PDF or TXT' },
                { status: 400 }
            );
        }

        if (!validateCVContent(cvText)) {
            return NextResponse.json(
                { error: 'CV appears to be invalid or too short' },
                { status: 400 }
            );
        }

        const rawAnalysis = await callAI(ANALYZE_CV_PROMPT + cvText);
        const analysis = validateCVAnalysis(rawAnalysis);

        return NextResponse.json({
            success: true,
            analysis,
            rawText: cvText.substring(0, 500),
        });

    } catch (error) {
        console.error('CV Analysis Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to analyze CV',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}