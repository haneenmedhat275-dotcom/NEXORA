import Sidebar from "../components/Sidebar";

function DashboardLayout({ children, currentStep }) {
  return (
   <div className="flex min-h-screen bg-nexora-bg">
      <Sidebar currentStep={currentStep} />

      <main className="flex-1 overflow-y-auto px-16 py-10">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
