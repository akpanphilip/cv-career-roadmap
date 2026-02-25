"use client";

import { useState, useEffect } from "react";
import CVUploader from "./components/CVUploader";
import ProfileSummary from "./components/ProfileSummary";
import RoleSelector from "./components/RoleSelector";
import SkillGapChart from "./components/SkillGapChart";
import LearningRoadmap from "./components/LearningRoadmap";
import JobRecommendations from "./components/JobRecommendations";
import LoadingSpinner from "./components/LoadingSpinner";
import ThemeToggle from "./components/ThemeToggle";
import {
  CVAnalysis,
  NextRole,
  SkillGap,
  LearningPhase,
  JobListing,
} from "./types";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [cvAnalysis, setCVAnalysis] = useState<CVAnalysis | null>(null);
  const [nextRoles, setNextRoles] = useState<NextRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<NextRole | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPhase[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [scrolled, setScrolled] = useState(false);

  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = "auto";
      } else if (showPanel) {
        document.body.style.overflow = "hidden";
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, [showPanel]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCVAnalysis = async (analysis: CVAnalysis) => {
    setCVAnalysis(analysis);
    setLoading(true);
    setLoadingMessage("Analyzing career opportunities...");

    try {
      const rolesResponse = await fetch("/api/suggest-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvAnalysis: analysis }),
      });
      const rolesData = await rolesResponse.json();

      if (rolesData.roles && rolesData.roles.length > 0) {
        setNextRoles(rolesData.roles);
      } else {
        console.error("No roles returned");
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role: NextRole) => {
    setSelectedRole(role);
    setLoading(true);
    setShowPanel(true);

    // Clear previous data
    setSkillGaps([]);
    setLearningPath([]);
    setJobs([]);

    try {
      // Step 1: Generate roadmap
      setLoadingMessage("Analyzing skill gaps...");
      const roadmapResponse = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvAnalysis,
          targetRole: role,
        }),
      });

      if (!roadmapResponse.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const roadmapData = await roadmapResponse.json();
      console.log("Roadmap data received:", roadmapData);

      if (roadmapData.skillGaps && roadmapData.skillGaps.length > 0) {
        setSkillGaps(roadmapData.skillGaps);
      }

      if (roadmapData.learningPath && roadmapData.learningPath.length > 0) {
        setLearningPath(roadmapData.learningPath);
      }

      // Step 2: Search for jobs
      setLoadingMessage("Finding matching jobs...");
      const jobsResponse = await fetch("/api/job-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: cvAnalysis?.skills.technical || [],
          targetRole: role.title,
        }),
      });

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        if (jobsData.jobs && jobsData.jobs.length > 0) {
          setJobs(jobsData.jobs);
        }
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      alert("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleReset = () => {
    setCVAnalysis(null);
    setNextRoles([]);
    setSelectedRole(null);
    setSkillGaps([]);
    setLearningPath([]);
    setJobs([]);
  };

  return (
    <>
      {/* <ThemeToggle /> */}

      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                  scrolled
                    ? "bg-white/90 backdrop-blur border-b border-gray-300 py-3"
                    : "bg-transparent border-b-0 py-6"
                }`}
              >
                <div className="container mx-auto px-4 flex items-center justify-center">
                  <h1
                    className={`text-purple-700 zeyada-regular font-semibold transition-all duration-300 ${
                      scrolled ? "text-3xl" : "text-6xl"
                    }`}
                  >
                    SkillBridge
                  </h1>
                </div>
              </header>
              {/* <h1 className="text-6xl font-semibold text-purple-700 zeyada-regular">SkillBridge</h1> */}
            </div>
            <p className="pt-10 text-sm text-gray-600 max-w-2xl mx-auto">
              Upload your CV and get AI-powered career guidance: role
              recommendations, skill analysis, learning paths, and job matches
            </p>

            {cvAnalysis && (
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </button>
            )}
          </div>

          {/* Upload Section */}
          {!cvAnalysis && <CVUploader onUploadComplete={handleCVAnalysis} />}

          {/* Results */}
          {cvAnalysis && (
            <div className="space-y-8">
              {/* Profile Summary */}
              <ProfileSummary analysis={cvAnalysis} />

              {/* Role Recommendations */}
              {nextRoles.length > 0 && (
                <div
                  className={`grid gap-6 transition-all duration-500 ${
                    selectedRole ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {/* LEFT SIDE — Roles */}
                  <div className="w-full transition-all duration-500">
                    <RoleSelector
                      roles={nextRoles}
                      selectedRole={selectedRole}
                      onSelectRole={handleRoleSelection}
                    />

                    {!selectedRole && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                        <p className="text-purple-800 text-sm">
                          <strong>Click on a role above</strong> to see your
                          personalized learning roadmap and job matches
                        </p>
                      </div>
                    )}
                  </div>
                
                  {/* RIGHT SIDE — Only appears when role selected */}
                  {selectedRole && (
                    <>
                      {/* Mobile / Tablet Overlay */}
                      <div
                        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
                          showPanel ? "translate-x-0" : "translate-x-full"
                        }`}
                      >
                        <div className="h-full overflow-y-auto p-6">
                          {/* Back Button */}
                          <button
                            onClick={() => setShowPanel(false)}
                            className="mb-8 px-2 py-2 bg-purple-100 rounded-lg text-gray-800 hover:bg-gray-300 transition"
                          >
                            <img
                              src="./images/back.gif"
                              className="w-8"
                              alt="upload gif"
                            />
                          </button>
                          <span></span>
                          {(skillGaps.length > 0 ||
                            learningPath.length > 0) && (
                            <div className="p-2">
                              <h2 className="text-2xl text-gray-700 font-bold mb-6">
                                {selectedRole.title}
                              </h2>

                              {skillGaps.length > 0 && (
                                <div className="mb-8">
                                  <SkillGapChart skillGaps={skillGaps} />
                                </div>
                              )}

                              {learningPath.length > 0 && (
                                <LearningRoadmap learningPath={learningPath} />
                              )}
                            </div>
                          )}

                          {jobs.length > 0 && (
                            <JobRecommendations jobs={jobs} />
                          )}
                        </div>
                      </div>

                      {/* Desktop Sticky Version */}
                      <div className="hidden lg:block w-full lg:sticky lg:top-6 lg:max-h-[90vh] lg:overflow-y-auto h-fit mt-28 p-2">
                        {(skillGaps.length > 0 || learningPath.length > 0) && (
                          <div className="p-2">
                            <h2 className="text-2xl text-gray-700 font-bold mb-6">
                              {selectedRole.title}
                            </h2>

                            {skillGaps.length > 0 && (
                              <div className="mb-8">
                                <SkillGapChart skillGaps={skillGaps} />
                              </div>
                            )}

                            {learningPath.length > 0 && (
                              <LearningRoadmap learningPath={learningPath} />
                            )}
                          </div>
                        )}

                        {jobs.length > 0 && <JobRecommendations jobs={jobs} />}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm">
                <LoadingSpinner message={loadingMessage} />
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 text-sm">
            <span>
              Your CV is analyzed securely. We don't store your personal
              information |{" "}
              <span className="font-semibold">Powered by Groq AI</span>
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}
