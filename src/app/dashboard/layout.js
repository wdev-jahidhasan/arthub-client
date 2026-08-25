import DashboardSidebar from "@/components/dashboardComp/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <DashboardSidebar></DashboardSidebar>

        <div className="flex-1 overflow-y-auto">
          {/* Navbar */}
          <div className="border border-yellow-300 w-full">Navbar</div>
          <main className="p-5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}