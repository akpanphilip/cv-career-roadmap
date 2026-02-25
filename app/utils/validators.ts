import { CVAnalysis, NextRole, SkillGap, LearningPhase } from '../types';

export function validateCVAnalysis(data: any): CVAnalysis {
    return {
        currentRole: data.currentRole || 'Unknown',
        yearsOfExperience: Number(data.yearsOfExperience) || 0,
        skills: {
            technical: Array.isArray(data.skills?.technical) ? data.skills.technical : [],
            soft: Array.isArray(data.skills?.soft) ? data.skills.soft : [],
        },
        industries: Array.isArray(data.industries) ? data.industries : [],
        education: Array.isArray(data.education) ? data.education : [],
        summary: data.summary || '',
    };
}

export function validateNextRoles(data: any): NextRole[] {
    if (!Array.isArray(data)) {
        data = [data];
    }

    return data.map((role: any) => ({
        title: role.title || 'Unknown Role',
        description: role.description || '',
        requiredSkills: Array.isArray(role.requiredSkills) ? role.requiredSkills : [],
        timeToTransition: role.timeToTransition || '6-12 months',
        probabilityOfSuccess: Number(role.probabilityOfSuccess) || 50,
        salaryRange: {
            min: Number(role.salaryRange?.min) || 50000,
            max: Number(role.salaryRange?.max) || 100000,
            currency: role.salaryRange?.currency || 'USD',
        },
    }));
}

export function validateSkillGaps(data: any): SkillGap[] {
    if (!Array.isArray(data)) {
        data = [data];
    }

    return data.map((gap: any) => ({
        skill: gap.skill || 'Unknown Skill',
        currentLevel: Number(gap.currentLevel) || 0,
        requiredLevel: Number(gap.requiredLevel) || 100,
        priority: ['high', 'medium', 'low'].includes(gap.priority) ? gap.priority : 'medium',
        learningTime: gap.learningTime || '2-3 months',
    }));
}

export function validateLearningPath(data: any): LearningPhase[] {
    if (!Array.isArray(data)) {
        data = [data];
    }

    return data.map((phase: any) => ({
        month: Number(phase.month) || 1,
        focus: phase.focus || 'Learning',
        skills: Array.isArray(phase.skills) ? phase.skills : [],
        resources: Array.isArray(phase.resources) ? phase.resources.map((r: any) => ({
            type: ['course', 'book', 'project', 'certification'].includes(r.type) ? r.type : 'course',
            title: r.title || 'Unknown Resource',
            provider: r.provider || 'Online',
            duration: r.duration || '1 month',
            difficulty: ['beginner', 'intermediate', 'advanced'].includes(r.difficulty) ? r.difficulty : 'intermediate',
            url: r.url || '',
        })) : [],
        milestones: Array.isArray(phase.milestones) ? phase.milestones : [],
    }));
}