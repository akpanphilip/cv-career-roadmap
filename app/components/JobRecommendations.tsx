"use client";

import { TrendingUp } from "lucide-react";
import { JobListing } from "../types";
import JobCard from "./JobCard";

interface JobRecommendationsProps {
  jobs: JobListing[];
}

export default function JobRecommendations({ jobs }: JobRecommendationsProps) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-600 flex items-center gap-2">
        {/* <TrendingUp className="w-6 h-6 text-green-500" /> */}
        Matching Job Opportunities
      </h2>

      <div className="space-y-4">
        {jobs.map((job, idx) => (
          <JobCard key={idx} job={job} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-[10px] text-purple-800">
          💡 <strong>Tip:</strong> Jobs are ranked by match score. Focus on
          high-match opportunities or use the learning roadmap to improve your
          match for aspirational roles.
        </p>
      </div>
    </div>
  );
}
