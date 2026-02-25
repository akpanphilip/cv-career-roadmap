"use client";

import { useState } from "react";
import { BookOpen, Calendar } from "lucide-react";
import { LearningPhase } from "../types";
import { motion } from "framer-motion";

interface LearningRoadmapProps {
  learningPath: LearningPhase[];
}

export default function LearningRoadmap({
  learningPath,
}: LearningRoadmapProps) {
  const [showPlan, setShowPlan] = useState(false);
  return (
    <div className="max-w-3xl mx-auto">
      {/* Toggle Button */}
      <button
        onClick={() => setShowPlan(!showPlan)}
        className="px-4 py-4 lg:py-2 w-full lg:w-auto text-center bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 text-[12px] transition-colors flex justify-center items-center gap-2 mb-6"
      >
        {showPlan ? "Hide Learning Plan" : "View Learning Plan"}
      </button>

      {/* Learning Plan Content */}
      {showPlan && (
        <div className="relative ml-1">
          {learningPath.map((phase, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="mb-8 ml-6 relative"
            >
              {/* Circle marker */}
              <div className="absolute -left-5 top-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                {phase.month}
              </div>

              <div className="border border-purple-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="font-semibold text-lg text-gray-900 mb-1">
                  Month {phase.month} - {phase.focus}
                </h4>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {phase.skills.map((skill, sidx) => (
                    <span
                      key={sidx}
                      className="px-3 py-1 bg-purple-500 text-white rounded-full text-[10px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Resources */}
                <div className="mb-4">
                  <p className="font-semibold text-sm text-gray-600 my-4 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Learning Resources
                  </p>
                  <ul className="space-y-2">
                    {phase.resources.map((res, ridx) => (
                      <li
                        key={ridx}
                        className="flex items-start gap-2 bg-gray-100 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <span className="text-lg">
                          {res.type === "course" && "📚"}
                          {res.type === "book" && "📖"}
                          {res.type === "project" && "🛠️"}
                          {res.type === "certification" && "🎓"}
                        </span>
                        <div>
                          <p className="font-medium text-[12px] text-gray-900">
                            {res.title}
                          </p>
                          <p className="text-gray-600 text-[10px] mt-1">
                            {res.provider} • {res.duration} • {res.difficulty}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones */}
                <div>
                  <p className="font-semibold text-sm text-gray-600 mb-2">
                    Milestones
                  </p>
                  <ul className="space-y-1">
                    {phase.milestones.map((ms, midx) => (
                      <li
                        key={midx}
                        className="flex items-start gap-2 text-gray-500 text-[10px]"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
