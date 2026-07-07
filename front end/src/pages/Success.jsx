import { useUser } from "../context/UserContext";
import logo from "../assets/LOGO.svg";
import bgImage from "../assets/Background Image from DATA placeholder.png";
import { useNavigate } from "react-router-dom";
import { Brain, Database, BadgeCheck, Check, ArrowRight } from "lucide-react";

const stats = [
  {
    icon: Brain,
    label: "VOICE MATCH",
    value: "98.4% Accuracy",
    iconBg: "#EFE9FE",
    iconColor: "#7C3AED",
  },
  {
    icon: Database,
    label: "KNOWLEDGE BASE",
    value: "12k Context Points",
    iconBg: "#E8ECFE",
    iconColor: "#4F46E5",
  },
  {
    icon: BadgeCheck,
    label: "READY FOR ROLE",
    value: "Senior Designer",
    iconBg: "#FDF0E1",
    iconColor: "#D97706",
  },
];

function Success() {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, #F1EBFC 0%, #F7F5FC 45%, #FFFFFF 100%)",
      }}
    >
      <div className="flex-1 flex flex-col items-center w-full px-6 pt-16">
        {/* اللوجو والـ Badge */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Nexora" className="h-9 mb-6" />
          <div
            className="rounded-full px-4 py-2 text-xs font-bold flex items-center gap-2 tracking-widest"
            style={{ backgroundColor: "#EEE8FD", color: "#6D28D9" }}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#6D28D9" }}
            >
              <Check size={11} strokeWidth={3} className="text-white" />
            </span>
            CONFIGURATION COMPLETE
          </div>
        </div>

        {/* الكارت الداكنة */}
        <div
          className="w-full mb-10 overflow-hidden relative"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#2A1560",
            maxWidth: "900px",
            borderRadius: "24px",
            padding: "64px 56px",
          }}
        >
          <h1
            className="text-white font-extrabold mb-4"
            style={{ fontSize: "2.75rem", lineHeight: "1.15" }}
          >
            Your AI Twin is Ready, {user?.name || "Salma"}!
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ maxWidth: "440px", color: "#D9D0F0" }}
          >
            We've processed your professional background and speech patterns.
            Your personalized AI coach is calibrated to help you land your
            dream role.
          </p>
        </div>

        {/* زرار */}
        <button
          onClick={() => navigate("/interview")}
          className="bg-gray-900 text-white font-semibold text-base flex items-center gap-2 mb-14 transition-all cursor-pointer hover:bg-black"
          style={{
            padding: "16px 40px",
            borderRadius: "16px",
          }}
        >
          Take Your First Mock Interview
          <ArrowRight size={16} />
        </button>

        {/* الـ 3 Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 w-full"
          style={{ maxWidth: "900px" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: stat.iconBg }}
              >
                <stat.icon size={20} style={{ color: stat.iconColor }} />
              </div>
              <p className="text-xs text-gray-400 font-semibold tracking-widest mb-2">
                {stat.label}
              </p>
              <p className="font-bold text-gray-900 text-xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* الـ Footer */}
      <footer className="w-full bg-white border-t border-gray-100 px-12 py-8 flex items-center justify-between">
        <div>
          <img src={logo} alt="Nexora" className="h-7 mb-2" />
          <p className="text-gray-400 text-xs">
            © 2024 NEXORA. Tactile Intelligence for the Modern Enterprise.
          </p>
        </div>
        <div className="flex gap-8 text-gray-500 text-sm">
          <a href="#" className="hover:text-gray-900 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            API Status
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Success;