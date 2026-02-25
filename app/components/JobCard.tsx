"use client";

import { ExternalLink, MapPin, Building } from "lucide-react";
import { JobListing } from "../types";

interface JobCardProps {
  job: JobListing;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="border rounded-lg p-6 bg-white hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-md lg:text-3xl font-bold text-green-600">
            {job.matchScore}%
          </div>
          <p className="text-xs text-gray-500">Match</p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 text-[12px] leading-relaxed">
        {job.description}
      </p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            ✅ You have:
          </p>
          <div className="flex flex-wrap gap-1">
            {job.skillsMatch.slice(0, 4).map((skill, sidx) => (
              <span
                key={sidx}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
              >
                {skill}
              </span>
            ))}
            {job.skillsMatch.length > 4 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                +{job.skillsMatch.length - 4}
              </span>
            )}
          </div>
        </div>

        {job.skillsToLearn.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              📚 To learn:
            </p>
            <div className="flex flex-wrap gap-1">
              {job.skillsToLearn.slice(0, 3).map((skill, sidx) => (
                <span
                  key={sidx}
                  className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors text-sm font-medium"
        >
          View Job
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
