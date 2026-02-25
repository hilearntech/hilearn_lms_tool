import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  UserCheck,
  LogOut,
  CalendarDays,
  HelpCircle,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  User,
} from "lucide-react";

const MentorLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

   
    if (user.isFirstLogin && location.pathname !== "/mentor/profile") {
      navigate("/mentor/profile", { 
        state: { forceSetup: true },
        replace: true 
      });
    }
  }, [user?.isFirstLogin, location.pathname, navigate]);

  const hideScrollbar = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  const menu = [
    { name: "Dashboard", path: "/mentor/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "My Courses", path: "/mentor/courses", icon: <BookOpen size={19} /> },
    { name: "My Lectures", path: "/mentor/lectures", icon: <Video size={19} /> },
    { name: "My Batches", path: "/mentor/batches", icon: <Video size={19} /> },
    { name: "Schedule", path: "/mentor/schedule", icon: <CalendarDays size={19} /> },
    { name: "Attendance", path: "/mentor/attendance", icon: <UserCheck size={19} /> },
    { name: "Quizzes", path: "/mentor/quizzes", icon: <HelpCircle size={19} /> },
{ name: "Performance", path: "/mentor/performance", icon: <TrendingUp size={19} /> },
    { name: "Assignments", path: "/mentor/assignments", icon: <ClipboardList size={19} /> },
    { name: "Doubt Inbox", path: "/mentor/doubts", icon: <MessageSquare size={19} /> },
    { name: "My Profile", path: "/mentor/myprofile", icon: <User size={19} /> },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">
      <style>
        {` .no-scrollbar::-webkit-scrollbar { display: none; } `}
      </style>

      <aside className="w-64 bg-[#059669] text-white flex flex-col shadow-xl sticky top-0 h-screen overflow-hidden">
        <div className="p-8 text-2xl font-black italic tracking-tighter flex-shrink-0">
          HiLearn
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar" style={hideScrollbar}>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md text-white"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden" >
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
            <h1 className="text-xl font-bold text-slate-700 tracking-tight">Mentor Portal</h1>
          </div>

          <div className="flex items-center gap-3 p-1 rounded-xl">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
              <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">Faculty Member</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black shadow-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar" 
          style={hideScrollbar}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorLayout;