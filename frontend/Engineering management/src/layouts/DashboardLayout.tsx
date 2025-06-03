import { useAuthStore } from "@/features/auth/useAuthStore";
import { Navigate, Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // optional icon

export default function DashboardLayout() {
  const { token, user, fetchUser, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user && token) {
      fetchUser();
    }
  }, []);

  if (!token) return <Navigate to="/" />;

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden p-4 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <Button variant="outline" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`md:block ${
          menuOpen ? "block" : "hidden"
        } md:w-64 w-full border-r border-gray-700 p-4 bg-black`}
      >
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <nav className="space-y-2">
          {user?.role === "manager" ? (
            <>
              <Link
                to="/dashboard/manager/team"
                className="block text-lg hover:underline"
              >
                Team Overview
              </Link>
              <Link
                to="/dashboard/manager/assignments"
                className="block text-lg hover:underline"
              >
                Manage Assignment
              </Link>
              <Link
                to="/dashboard/manager/projects"
                className="block text-lg hover:underline"
              >
                Project Management
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard/engineer/assignments"
                className="block text-lg hover:underline"
              >
                My Assignments
              </Link>
              <Link
                to="/dashboard/engineer/profile"
                className="block text-lg hover:underline"
              >
                My Profile
              </Link>
            </>
          )}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="mt-4 w-full cursor-pointer"
          >
            Logout
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
