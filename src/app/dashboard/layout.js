import DashboardNavbar from "@/components/dashboardComp/DashboardNavbar";
import DashboardSidebar from "@/components/dashboardComp/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <DashboardSidebar></DashboardSidebar>

        <div className="flex-1 overflow-y-auto">
          {/* Navbar */}
          <DashboardNavbar></DashboardNavbar>
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}