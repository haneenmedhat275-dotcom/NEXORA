import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, MessageCircle, Brain, Check, ArrowRight } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import useBlockBrowserNavigation from "../hooks/useBlockBrowserNavigation";

const focusAreas = [
  { id: "technical", label: "Technical Knowledge", icon: Settings },
  { id: "communication", label: "Communication Skills", icon: MessageCircle },
  { id: "scenario", label: "Scenario & Behavioral", icon: Brain },
];

const drillSkills = [
  { id: "ui", label: "Focus heavily on UI Design & Design Systems", desc: "Evaluates consistency, accessibility, and visual hierarchy." },
  { id: "algo", label: "Algorithmic Problem Solving", desc: "Focuses on Big O notation, data structures, and edge-case handling." },
  { id: "leadership", label: "Leadership & Teamwork", desc: "Assesses conflict resolution, mentoring, and strategic influence." },
];

function CareerPath() {
    const navigate = useNavigate();
    const { goBack } = useBlockBrowserNavigation();
  const [selectedFocus, setSelectedFocus] = useState("communication");
  const [checkedSkills, setCheckedSkills] = useState(["ui"]);

  function toggleSkill(id) {
    if (checkedSkills.includes(id)) {
      setCheckedSkills(checkedSkills.filter((s) => s !== id));
    } else {
      setCheckedSkills([...checkedSkills, id]);
    }
  }

  return (
    <DashboardLayout currentStep={3}>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        What do you want to build and improve?
      </h1>
      <p className="text-gray-500 mb-10">
        Define your assessment strategy. We'll calibrate your AI Twin to focus on these specific dimensions.
      </p>

      {/* Focus Areas */}
      <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
        Target Focus Areas
      </p>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {focusAreas.map((area) => (
          <button
            key={area.id}
            onClick={() => setSelectedFocus(area.id)}
            className={`p-5 rounded-xl border-2 text-left transition-all
              ${selectedFocus === area.id
  ? "border-nexora-purple bg-nexora-purple-light"
  : "border-gray-200 bg-white hover:border-nexora-purple-light"}`}
          >
            <area.icon size={28} className="mb-3 block text-nexora-purple" />
            <p className="font-semibold text-gray-800 text-sm">{area.label}</p>
          </button>
        ))}
      </div>

      {/* Drill-down Skills */}
      <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-5">
        Drill-Down Skills
      </p>
      <div className="flex flex-col gap-5">
        {drillSkills.map((skill) => (
          <div key={skill.id} className="flex items-start gap-4">
            <div
              onClick={() => toggleSkill(skill.id)}
              className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center cursor-pointer flex-shrink-0
                ${checkedSkills.includes(skill.id)
  ? "bg-nexora-purple border-nexora-purple"
  : "border-gray-300 bg-white"}`}
            >
              {checkedSkills.includes(skill.id) && (
                <Check size={14} className="text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{skill.label}</p>
              <p className="text-gray-500 text-sm">{skill.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next button */}
      <div className="flex justify-end mt-10">
        <button
  onClick={() => navigate("/success")}
  className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-1">
  Calibrate AI Twin <ArrowRight size={16} />
</button>
      </div>

    </DashboardLayout>
  );
}

export default CareerPath;
