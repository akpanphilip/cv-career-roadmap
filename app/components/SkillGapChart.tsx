"use client";

import { SkillGap } from "../types";

interface SkillGapChartProps {
  skillGaps: SkillGap[];
}

export default function SkillGapChart({ skillGaps }: SkillGapChartProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg text-gray-300 font-semibold mb-4">
        Skills to Develop
      </h3>

      {skillGaps.map((gap, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-[14px] text-gray-900">{gap.skill}</span>
            <span
              className={`px-3 py-1 rounded-[10px] text-[10px] font-semibold border ${getPriorityColor(gap.priority)}`}
            >
              {gap.priority} priority
            </span>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-purple-800 rounded-full transition-all duration-500"
              style={{ width: `${gap.currentLevel}%` }}
            ></div>
            <div
              className="absolute top-0 left-0 h-full border-2 border-purple-800 bg-transparent rounded-full"
              style={{ width: `${gap.requiredLevel}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <div className="flex gap-4">
              <span className="text-gray-600">
                Current:{" "}
                <span className="font-semibold text-purple-800">
                  {gap.currentLevel}%
                </span>
              </span>
              <span className="text-gray-600">
                Target:{" "}
                <span className="font-semibold text-purple-600">
                  {gap.requiredLevel}%
                </span>
              </span>
            </div>
            <span className="text-gray-500">📚 {gap.learningTime}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
