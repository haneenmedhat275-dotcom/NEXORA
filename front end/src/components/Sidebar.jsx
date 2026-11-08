import logo from "../assets/LOGO.svg";
import { FileSearch, FileCheck, Sparkles, Rocket, Check, Info } from "lucide-react";
import { useState } from "react";

const steps = [
  { num: 1, label: "Smart CV Parsing", icon: FileSearch },
  { num: 2, label: "Experience Details", icon: FileCheck },
  { num: 3, label: "Career Path", icon: Sparkles },
  { num: 4, label: "Review & Finalize", icon: Rocket },
];

function Sidebar({ currentStep }) {const [showHelp, setShowHelp] = useState(false);
  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col py-8 px-6">

      {/* Logo */}
      <div className="mb-16">
        <img src={logo} alt="Nexora" className="h-9" />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3 flex-1">
        {steps.map((step) => {
          const isActive = step.num === currentStep;
          const isDone = step.num < currentStep;
          return (
    <div
  key={step.num}
  className={`flex items-center gap-3 rounded-xl px-3 py-2.5
    ${isActive || isDone ? "bg-nexora-purple-light" : ""}`}
>
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
    ${isActive ? "bg-nexora-purple text-white" : isDone ? "bg-nexora-purple text-white" : "bg-gray-100 text-gray-400"}`}>
    {isDone ? <Check size={16} /> : <step.icon size={16} />}
  </div>
              <div>
                <p className="text-xs text-gray-400">Step {step.num}</p>
                <p className={`text-sm font-medium ${isActive || isDone ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Need Help */}
  <button
  onClick={() => setShowHelp(true)}
  className="flex items-center gap-2 border border-nexora-lavender bg-nexora-lavender rounded-xl px-4 py-2 text-sm text-nexora-purple w-full justify-center transition-all hover:bg-blue-100 hover:border-blue-200 cursor-pointer">
  <Info size={16} /> Need Help?
</button>

{/* Modal */}
{showHelp && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
      <h2 className="font-bold text-gray-900 text-lg mb-2">Need Help?</h2>
      <p className="text-gray-500 text-sm mb-6">
        Send us your question and we'll get back to you as soon as possible.
      </p>
      <textarea
        className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-800 resize-none mb-4"
        rows={4}
        placeholder="Type your question here..."
      />
      <div className="flex gap-3">
        <button
          onClick={() => setShowHelp(false)}
          className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-500 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={() => setShowHelp(false)}
          className="flex-1 bg-nexora-purple text-white rounded-xl py-2 text-sm font-medium">
          Send
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Sidebar;
