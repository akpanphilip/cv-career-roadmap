export interface CVAnalysis {
  currentRole: string;
  yearsOfExperience: number;
  skills: {
    technical: string[];
    soft: string[];
  };
  industries: string[];
  education: string[];
  summary: string;
}

export interface NextRole {
  title: string;
  description: string;
  requiredSkills: string[];
  timeToTransition: string;
  probabilityOfSuccess: number;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  learningTime: string;
}

export interface LearningResource {
  type: 'course' | 'book' | 'project' | 'certification';
  title: string;
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  url?: string;
}

export interface LearningPhase {
  month: number;
  focus: string;
  skills: string[];
  resources: LearningResource[];
  milestones: string[];
}

export interface JobListing {
  title: string;
  company: string;
  location: string;
  description: string;
  matchScore: number;
  skillsMatch: string[];
  skillsToLearn: string[];
  url?: string;
}

export interface CareerRoadmap {
  cvAnalysis: CVAnalysis;
  nextRoles: NextRole[];
  skillGaps: SkillGap[];
  learningPath: LearningPhase[];
  jobs: JobListing[];
  generatedAt: Date;
}