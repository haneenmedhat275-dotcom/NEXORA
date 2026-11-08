import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Upload, Shield, ArrowLeft, Loader } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import useBlockBrowserNavigation from "../hooks/useBlockBrowserNavigation";
import api from "../api/axios";

function UploadCV() {
  const navigate = useNavigate();
  const { goBack } = useBlockBrowserNavigation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB.");
      return;
    }
    setError("");
    setSuccess("");
    setUploading(true);
    const formData = new FormData();
    formData.append("cv", file);
    try {
      const res = await api.post("/auth/upload-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.extractedInfo) {
        localStorage.setItem("nexora_cv_data", JSON.stringify(res.data.extractedInfo));
      }
      setSuccess("CV uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      navigate("/verify");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("nexora_cv_skipped", "true");
    navigate("/verify");
  };

  return (
    <DashboardLayout currentStep={1}>

      <div className="flex flex-col items-center justify-center h-full text-center">

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Upload your professional profile
        </h1>
        <p className="text-gray-500 mb-12 max-w-md">
          Let our AI do the heavy lifting. Upload your CV to automatically
          populate your career details with precision.
        </p>

        <div className="w-full max-w-2xl border-2 border-dashed border-nexora-purple-light bg-nexora-purple-light/30 rounded-2xl p-16 flex flex-col items-center">

          <div className="w-20 h-20 bg-nexora-purple-light rounded-2xl flex items-center justify-center mb-6 text-nexora-purple">
            <FileText size={36} />
          </div>

          <h2 className="font-bold text-gray-900 text-xl mb-2">
            {uploading ? "Processing your CV..." : "Drop your PDF here or click to browse"}
          </h2>
          <p className="text-gray-500 text-sm mb-1">
            AI-powered extraction will automatically fill your profile.
          </p>
          <p className="text-nexora-purple text-sm font-medium mb-6">
            Supports PDF files only. Max size: 2MB.
          </p>

          <label className={`${uploading ? "opacity-50 pointer-events-none" : ""} bg-gray-900 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 cursor-pointer`}>
            {uploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
            {uploading ? "Uploading..." : "Select File"}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFile(file);
              }}
            />
          </label>

          {error && (
            <p className="mt-4 text-sm text-red-500">{error}</p>
          )}
          {success && (
            <p className="mt-4 text-sm text-green-600">{success}</p>
          )}

          <p className="mt-4 text-xs text-gray-400">
            <Shield size={12} className="inline mr-1" /> Your data is encrypted and secure.
          </p>

        </div>

        <div className="w-full max-w-2xl flex justify-between mt-8">
          <button
            onClick={goBack}
            className="text-gray-500 text-sm flex items-center gap-1">
            <ArrowLeft size={14} /> Back
          </button>
          <button
            onClick={handleSkip}
            className="text-gray-400 text-sm">
            Skip for now
          </button>
        </div>

      </div>

    </DashboardLayout>
  );
}

export default UploadCV;
