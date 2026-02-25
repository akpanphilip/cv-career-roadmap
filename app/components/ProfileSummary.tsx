"use client";

import { BriefcaseBusiness } from "lucide-react";
import { CVAnalysis } from "../types";

interface ProfileSummaryProps {
  analysis: CVAnalysis;
}

export default function ProfileSummary({ analysis }: ProfileSummaryProps) {
  return (
    <div>
      <h3 className="text-2xl text-gray-300 font-bold mb-4 flex items-center gap-2">
        <BriefcaseBusiness className="w-8 h-8 text-purple-500" />
        Profile
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Current Role</h3>
          <p className="text-lg text-black">{analysis.currentRole}</p>
          <p className="text-gray-600 text-[10px] mt-1">
            {analysis.yearsOfExperience} years experience
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Industries</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.industries.map((industry, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-sm text-[10px]"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-700 mb-2">
          Top Technical Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {analysis.skills.technical.slice(0, 8).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-sm text-[10px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Education</h3>
        <ul className="space-y-1">
          {analysis.education.map((edu, idx) => (
            <li key={idx} className="text-gray-600 text-[12px]">
              • {edu}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
        <p className="text-gray-600 text-[12px]">{analysis.summary}</p>
      </div>
    </div>
  );
}
