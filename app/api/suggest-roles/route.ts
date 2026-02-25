import { NextRequest, NextResponse } from 'next/server';
import { SUGGEST_ROLES_PROMPT } from '../../utils/prompts';
import { callAI } from '../../utils/aiClient';
import { validateNextRoles } from '../../utils/validators';
import { retryWithBackoff } from '../../utils/retry';

export async function POST(request: NextRequest) {
  try {
    const { cvAnalysis } = await request.json();

    if (!cvAnalysis) {
      return NextResponse.json(
        { error: 'CV analysis data required' },
        { status: 400 }
      );
    }

    // Retry up to 3 times if JSON parsing fails
    const rawRoles = await retryWithBackoff(async () => {
      return await callAI(
        SUGGEST_ROLES_PROMPT + JSON.stringify(cvAnalysis, null, 2)
      );
    });

    const roles = validateNextRoles(rawRoles);

    return NextResponse.json({
      success: true,
      roles,
    });

  } catch (error) {
    console.error('Role Suggestion Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to suggest roles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}