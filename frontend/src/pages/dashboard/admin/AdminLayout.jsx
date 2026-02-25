import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Layers,
  LogOut,
  GraduationCap,
  UserCheck,
  HelpCircle,
  MessageSquare, 
  ClipboardList,
  BarChart3,
  Megaphone,
  Award,
} from "lucide-react";
import { getAdminProfile } from "../../../services/adminService";

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const hideScrollbar = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "Students", path: "/admin/students", icon: <Users size={19} /> },
    { name: "Certificates", path: "/admin/certificates", icon: <Award size={19} /> },
    { name: "Attendance", path: "/admin/attendance", icon: <UserCheck size={19} /> },
    { name: "Faculties", path: "/admin/faculties", icon: <GraduationCap size={19} /> },
    { name: "Courses", path: "/admin/courses", icon: <BookOpen size={19} /> },
    { name: "Lectures", path: "/admin/lectures", icon: <Video size={19} /> },
    { name: "Batches", path: "/admin/batches", icon: <Layers size={19} /> },
    { name: "Quizzes", path: "/admin/quizzes", icon: <HelpCircle size={19} /> }, 
    { name: "Enquiries", path: "/admin/enquiries", icon: <MessageSquare size={19} /> },
    { name: "Assignments", path: "/admin/assignments", icon: <ClipboardList size={19} /> },
    { name: "Reports", path: "/admin/reports", icon: <BarChart3 size={19} /> },
    { name: "Announcements", path: "/admin/announcements", icon: <Megaphone size={19} /> },
  ];

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getAdminProfile();
        setAdmin(data.admin);
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-[#059669] font-bold text-lg animate-pulse">
          Loading Admin Panel...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex bg-slate-50">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#059669] text-white flex flex-col shadow-xl sticky top-0 h-screen overflow-hidden z-50">
        <div className="p-8 text-2xl font-black italic tracking-tighter flex-shrink-0">
          HiLearn
        </div>

        <nav
          className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar"
          style={hideScrollbar}
        >
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-[#059669] shadow-lg font-bold"
                    : "hover:bg-white/10 text-emerald-50"
                }`
              }
            >
              <span className="group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 bg-[#059669] flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar"
        style={hideScrollbar}
      >
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
            <h1 className="text-xl font-bold text-slate-700 tracking-tight">
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-3 p-1 rounded-xl">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">
                {user?.name}
              </p>
              <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">
                Super Admin
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black shadow-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;