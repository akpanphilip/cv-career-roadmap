import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const { skills, targetRole } = await request.json();

        const jobs = await searchJobsWithFreeAPI(targetRole, skills);

        return NextResponse.json({
            success: true,
            jobs,
        });

    } catch (error) {
        console.error('Job Search Error:', error);
        return NextResponse.json(
            { error: 'Failed to search jobs' },
            { status: 500 }
        );
    }
}

async function searchJobsWithJSearch(query: string, skills: string[]) {
    if (!process.env.RAPIDAPI_KEY) {
        return [];
    }

    try {
        const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
            params: {
                query: query,
                page: '1',
                num_pages: '1',
                date_posted: 'month',
            },
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        const jobs = response.data.data || [];

        return jobs.slice(0, 5).map((job: any) => ({
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city}, ${job.job_country}`,
            description: job.job_description?.substring(0, 300) + '...',
            matchScore: calculateMatchScore(job.job_description || '', skills),
            skillsMatch: extractMatchingSkills(job.job_description || '', skills),
            skillsToLearn: [],
            url: job.job_apply_link,
        }));
    } catch (error) {
        console.error('JSearch API error:', error);
        return [];
    }
}

async function searchJobsWithAdzuna(query: string, skills: string[]) {
    const APP_ID = process.env.ADZUNA_APP_ID;
    const APP_KEY = process.env.ADZUNA_APP_KEY;

    if (!APP_ID || !APP_KEY) {
        return [];
    }

    try {
        const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/us/search/1`,
            {
                params: {
                    app_id: APP_ID,
                    app_key: APP_KEY,
                    results_per_page: 5,
                    what: query,
                    'content-type': 'application/json'
                }
            }
        );

        const jobs = response.data.results || [];

        return jobs.map((job: any) => ({
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            description: job.description.substring(0, 300) + '...',
            matchScore: calculateMatchScore(job.description, skills),
            skillsMatch: extractMatchingSkills(job.description, skills),
            skillsToLearn: [],
            url: job.redirect_url,
        }));
    } catch (error) {
        console.error('Adzuna API error:', error);
        return [];
    }
}

function generateMockJobs(targetRole: string, skills: string[]) {
    const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudWorks', 'AgileTeam'];
    const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA'];

    return Array.from({ length: 5 }, (_, i) => ({
        title: targetRole,
        company: companies[i],
        location: locations[i],
        description: `Seeking a talented ${targetRole} to join our growing team. You'll work on exciting projects using ${skills.slice(0, 3).join(', ')}. Great benefits and competitive salary.`,
        matchScore: Math.floor(Math.random() * 30) + 70,
        skillsMatch: skills.slice(0, Math.floor(Math.random() * Math.min(skills.length, 5))),
        skillsToLearn: ['Leadership', 'Advanced Analytics', 'System Design'].slice(0, 2),
        url: `https://example.com/jobs/${i}`,
    }));
}

async function searchJobsWithFreeAPI(targetRole: string, skills: string[]) {
    try {
        if (process.env.RAPIDAPI_KEY) {
            const jobs = await searchJobsWithJSearch(targetRole, skills);
            if (jobs.length > 0) return jobs;
        }

        if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
            const jobs = await searchJobsWithAdzuna(targetRole, skills);
            if (jobs.length > 0) return jobs;
        }
    } catch (error) {
        console.error('API job search failed, using mock data:', error);
    }

    return generateMockJobs(targetRole, skills);
}

function calculateMatchScore(jobText: string, skills: string[]): number {
    if (!jobText) return 50;
    const jobLower = jobText.toLowerCase();
    const matches = skills.filter(skill =>
        jobLower.includes(skill.toLowerCase())
    );

    const baseScore = (matches.length / Math.max(skills.length, 1)) * 100;
    return Math.min(Math.round(baseScore), 100);
}

function extractMatchingSkills(jobText: string, skills: string[]): string[] {
    if (!jobText) return [];
    const jobLower = jobText.toLowerCase();
    return skills.filter(skill =>
        jobLower.includes(skill.toLowerCase())
    );
}