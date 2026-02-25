export const ANALYZE_CV_PROMPT = `Analyze this CV and return a JSON object with the candidate's information.

Return ONLY the JSON object below - no other text, no markdown, no explanations:

{
  "currentRole": "job title here",
  "yearsOfExperience": 5,
  "skills": {
    "technical": ["skill1", "skill2", "skill3"],
    "soft": ["skill1", "skill2"]
  },
  "industries": ["industry1"],
  "education": ["degree1"],
  "summary": "brief summary here"
}

CV Content:
`;

export const SUGGEST_ROLES_PROMPT = `Based on this candidate profile, suggest 3-5 next career roles.

Return ONLY a JSON array like this - no other text, no markdown, no explanations:

[
  {
    "title": "Job Title",
    "description": "Brief description",
    "requiredSkills": ["skill1", "skill2"],
    "timeToTransition": "3-6 months",
    "probabilityOfSuccess": 80,
    "salaryRange": {
      "min": 100000,
      "max": 150000,
      "currency": "USD"
    }
  }
]

IMPORTANT:
- Return 3-5 roles
- Use numbers for salaryRange (not strings)
- Use numbers for probabilityOfSuccess (0-100)

Candidate Profile:
`;

export const SKILL_GAP_PROMPT = `Compare current skills vs target role. Return skill gaps as JSON.

Return ONLY a JSON array like this - no other text, no markdown, no explanations:

[
  {
    "skill": "Skill Name",
    "currentLevel": 40,
    "requiredLevel": 80,
    "priority": "high",
    "learningTime": "3-4 months"
  }
]

IMPORTANT:
- Use numbers for currentLevel and requiredLevel (0-100)
- priority must be: "high", "medium", or "low"
- Include 5-8 gaps

Current Profile:
{currentProfile}

Target Role:
{targetRole}
`;

export const LEARNING_ROADMAP_PROMPT = `Create a 6-month learning roadmap.

Return ONLY a JSON array with exactly 6 months like this - no other text, no markdown, no explanations:

[
  {
    "month": 1,
    "focus": "Main topic",
    "skills": ["skill1", "skill2"],
    "resources": [
      {
        "type": "course",
        "title": "Course Name",
        "provider": "Provider",
        "duration": "4 weeks",
        "difficulty": "intermediate"
      }
    ],
    "milestones": ["milestone1", "milestone2"]
  }
]

IMPORTANT:
- Exactly 6 months (month 1-6)
- type must be: "course", "book", "project", or "certification"
- difficulty must be: "beginner", "intermediate", or "advanced"
- Prioritize FREE resources

Skill Gaps:
`;