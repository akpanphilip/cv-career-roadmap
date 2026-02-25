import { NextRequest, NextResponse } from 'next/server';
import { SKILL_GAP_PROMPT, LEARNING_ROADMAP_PROMPT } from '../../utils/prompts';
import { callAI } from '../../utils/aiClient';
import { validateSkillGaps, validateLearningPath } from '../../utils/validators';
import { retryWithBackoff } from '../../utils/retry';

export async function POST(request: NextRequest) {
  try {
    const { cvAnalysis, targetRole } = await request.json();

    if (!cvAnalysis || !targetRole) {
      return NextResponse.json(
        { error: 'CV analysis and target role required' },
        { status: 400 }
      );
    }

    console.log('Generating roadmap for role:', targetRole.title);

    // Generate skill gaps
    const skillGapPrompt = SKILL_GAP_PROMPT
      .replace('{currentProfile}', JSON.stringify(cvAnalysis, null, 2))
      .replace('{targetRole}', JSON.stringify(targetRole, null, 2));

    const rawSkillGaps = await retryWithBackoff(async () => {
      return await callAI(skillGapPrompt);
    });
    
    console.log('Raw skill gaps received:', rawSkillGaps);
    const skillGaps = validateSkillGaps(rawSkillGaps);
    console.log('Validated skill gaps:', skillGaps.length);

    // Generate learning path
    const rawLearningPath = await retryWithBackoff(async () => {
      return await callAI(
        LEARNING_ROADMAP_PROMPT + JSON.stringify(skillGaps, null, 2)
      );
    });
    
    console.log('Raw learning path received:', rawLearningPath);
    const learningPath = validateLearningPath(rawLearningPath);
    console.log('Validated learning path:', learningPath.length, 'months');

    return NextResponse.json({
      success: true,
      skillGaps,
      learningPath,
    });

  } catch (error) {
    console.error('Roadmap Generation Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate roadmap',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}