"use client";

import { Target, TrendingUp } from "lucide-react";
import { NextRole } from "../types";

interface RoleSelectorProps {
  roles: NextRole[];
  selectedRole: NextRole | null;
  onSelectRole: (role: NextRole) => void;
}

export default function RoleSelector({
  roles,
  selectedRole,
  onSelectRole,
}: RoleSelectorProps) {
  return (
    <div className="mt-28">
      <h3 className="text-2xl text-gray-300 font-bold mb-6 flex items-center gap-2">
        <Target className="w-8 h-8 text-purple-500" />
        Recommended Next Roles
      </h3>

      <div className="grid gap-4">
        {roles.map((role, idx) => (
          <button
            key={idx}
            onClick={() => onSelectRole(role)}
            className={`
              text-left p-6 border-2 rounded-lg transition-all
              ${
                selectedRole?.title === role.title
                  ? "border-purple-300 bg-purple-50"
                  : "border-gray-100 hover:border-purple-300"
              }
            `}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-[12px] mt-1">{role.description}</p>
              </div>

              {role.salaryRange &&
                role.salaryRange.min &&
                role.salaryRange.max && (
                  <div className="ml-4 text-right">
                    <div className="px-4 py-2 text-[12px] bg-purple-100 text-purple-700 rounded-lg font-semibold">
                      ${role.salaryRange.min.toLocaleString()} - $
                      {role.salaryRange.max.toLocaleString()}
                    </div>
                  </div>
                )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-4">
              {role.timeToTransition && (
                <span className="flex items-center gap-1">
                  ⏱️ {role.timeToTransition}
                </span>
              )}
              {role.probabilityOfSuccess && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {role.probabilityOfSuccess}% match
                </span>
              )}
            </div>

            {role.requiredSkills && role.requiredSkills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Key Skills Required:
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.requiredSkills.slice(0, 5).map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                  {role.requiredSkills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{role.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
