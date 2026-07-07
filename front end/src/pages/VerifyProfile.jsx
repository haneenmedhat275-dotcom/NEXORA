import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, ArrowRight } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import useBlockBrowserNavigation from "../hooks/useBlockBrowserNavigation";
import api from "../api/axios";

function VerifyProfile() {
  const navigate = useNavigate();
  const { goBack } = useBlockBrowserNavigation();

  const [form, setForm] = useState({
    name: "",
    currentJobTitle: "",
    age: "",
    yearsOfExperience: "",
    jobRole: "",
    education: "",
    skills: [],
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nexora_cv_data");
      if (raw) {
        const cv = JSON.parse(raw);
        setForm((prev) => ({
          ...prev,
          name: cv.name || "",
          currentJobTitle: cv.currentJobTitle || "",
          age: cv.age || "",
          yearsOfExperience: cv.yearsOfExperience || "",
          jobRole: cv.jobRole || "",
          skills: cv.skills || [],
        }));
      }
    } catch {}
  }, []);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) {
      update("skills", [...form.skills, s]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    update("skills", form.skills.filter((s) => s !== skill));
  };

  const handleConfirm = async () => {
    try {
      await api.put("/auth/update-profile", {
        age: Number(form.age) || undefined,
        yearsOfExperience: Number(form.yearsOfExperience) || undefined,
        jobRole: form.jobRole || undefined,
        currentJobTitle: form.currentJobTitle || undefined,
        skills: form.skills.length > 0 ? form.skills : undefined,
      });
    } catch {}
    localStorage.removeItem("nexora_cv_data");
    navigate("/career-path");
  };

  return (
    <DashboardLayout currentStep={2}>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Verify your profile data
      </h1>
      <p className="text-gray-500 mb-10">
        Confirm the details our AI extracted from your resume to build your digital twin.
      </p>

      <div className="grid grid-cols-2 gap-6">

        <div className="flex flex-col gap-6">

          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Personal Info <Pencil size={14} className="inline" /></h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Full Name</p>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Current Title</p>
                <input
                  value={form.currentJobTitle}
                  onChange={(e) => update("currentJobTitle", e.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Age</p>
                <input
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Years of Experience</p>
                <input
                  value={form.yearsOfExperience}
                  onChange={(e) => update("yearsOfExperience", e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Job Role</p>
              <input
                value={form.jobRole}
                onChange={(e) => update("jobRole", e.target.value)}
                placeholder="e.g. Product Designer"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Extracted Skills <Pencil size={14} className="inline" /></h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {form.skills.map((skill) => (
                <span key={skill} className="bg-nexora-purple-light text-nexora-purple border border-nexora-purple-light rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="text-nexora-purple hover:text-red-500">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="+ Add Skill"
                className="flex-1 border border-dashed border-gray-300 rounded-full px-3 py-1 text-sm text-gray-400 outline-none focus:border-nexora-purple"
              />
            </div>
          </div>

        </div>

        <div className="border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Education <Pencil size={14} className="inline" /></h2>
          <input
            value={form.education}
            onChange={(e) => update("education", e.target.value)}
            placeholder="e.g. Stanford University • B.S. in Computer Science"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-nexora-purple"
          />
        </div>

      </div>

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
        <button onClick={goBack} className="text-gray-500 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Upload
        </button>
        <span className="text-xs text-gray-400">All changes are automatically saved</span>
        <button onClick={handleConfirm} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm flex items-center gap-1">
          Confirm & Continue <ArrowRight size={14} />
        </button>
      </div>
    </DashboardLayout>
  );
}

export default VerifyProfile;