// import React, { useEffect, useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   BookOpen,
//   IndianRupee,
//   ShieldCheck,
//   TrendingUp,
//   LogOut,
//   Megaphone,
//   BarChart3,
//   GraduationCap
// } from "lucide-react";

// /**
//  * @desc Super Admin Layout - Matched with Admin Layout Style (Emerald Green Theme)
//  */
// const SuperAdminLayout = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [loading, setLoading] = useState(false);

//   const hideScrollbar = {
//     msOverflowStyle: "none",
//     scrollbarWidth: "none",
//   };

//   // Super Admin specific menu items
//   const menu = [
//     { name: "Overview", path: "/superadmin/dashboard", icon: <LayoutDashboard size={19} /> },
//     { name: "Global Courses", path: "/superadmin/courses", icon: <BookOpen size={19} /> },
//     { name: "Revenue & Sales", path: "/superadmin/revenue", icon: <IndianRupee size={19} /> },
//     { name: "Academy Admins", path: "/superadmin/admins", icon: <ShieldCheck size={19} /> },
//     { name: "Instructors", path: "/superadmin/faculties", icon: <GraduationCap size={19} /> },
//     { name: "Public Students", path: "/superadmin/students", icon: <TrendingUp size={19} /> },
//     { name: "Marketing / CMS", path: "/superadmin/cms", icon: <Megaphone size={19} /> },
//     { name: "System Analytics", path: "/superadmin/analytics", icon: <BarChart3 size={19} /> },
//   ];

//   const logout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <p className="text-[#059669] font-bold text-lg animate-pulse">
//           Loading Platform Control...
//         </p>
//       </div>
//     );

//   return (
//     <div className="min-h-screen flex bg-slate-50">
//       <style>
//         {`
//           .no-scrollbar::-webkit-scrollbar {
//             display: none;
//           }
//         `}
//       </style>

//       {/* ========== SIDEBAR (Emerald Green Theme - Matched with Admin) ========== */}
//       <aside className="w-64 bg-[#059669] text-white flex flex-col shadow-xl sticky top-0 h-screen overflow-hidden">
//         <div className="p-8 text-2xl font-black italic tracking-tighter flex-shrink-0">
//           HiLearn
//         </div>

//         {/* Scrollable Nav Area */}
//         <nav
//           className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar"
//           style={hideScrollbar}
//         >
//           {menu.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               end
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${
//                   isActive
//                     ? "bg-white text-[#059669] shadow-lg font-bold"
//                     : "hover:bg-white/10 text-emerald-50"
//                 }`
//               }
//             >
//               <span className="group-hover:scale-110 transition-transform">
//                 {item.icon}
//               </span>
//               <span className="text-sm font-medium">{item.name}</span>
//             </NavLink>
//           ))}
//         </nav>

//         {/* FIXED Logout at bottom */}
//         <div className="p-4 border-t border-white/20 bg-[#059669] flex-shrink-0">
//           <button
//             onClick={logout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md text-white"
//           >
//             <LogOut size={18} />
//             <span className="font-semibold text-sm">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* ========== CONTENT WRAPPER ========== */}
//       <div
//         className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar"
//         style={hideScrollbar}
//       >
//         {/* HEADER */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
//             <h1 className="text-xl font-bold text-slate-700 tracking-tight">
//               Platform Control Center
//             </h1>
//           </div>

//           <div className="flex items-center gap-3 p-1 rounded-xl">
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-bold text-slate-800 leading-none">
//                 {user?.name}
//               </p>
//               <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">
//                 Super Admin
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black shadow-sm">
//               {user?.name?.charAt(0)}
//             </div>
//           </div>
//         </header>

//         <main className="p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminLayout;


import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  IndianRupee,
  ShieldCheck,
  TrendingUp,
  LogOut,
  Megaphone,
  BarChart3,
  GraduationCap,
  Menu,
  X
} from "lucide-react";

/**
 * @desc Super Admin Layout - Responsive (Matched with Admin Layout)
 */
const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hideScrollbar = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  // Super Admin menu (UNCHANGED)
  const menu = [
    { name: "Overview", path: "/superadmin/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "Global Courses", path: "/superadmin/courses", icon: <BookOpen size={19} /> },
    { name: "Revenue & Sales", path: "/superadmin/revenue", icon: <IndianRupee size={19} /> },
    { name: "Academy Admins", path: "/superadmin/admins", icon: <ShieldCheck size={19} /> },
    { name: "Instructors", path: "/superadmin/faculties", icon: <GraduationCap size={19} /> },
    { name: "Public Students", path: "/superadmin/students", icon: <TrendingUp size={19} /> },
    { name: "Marketing / CMS", path: "/superadmin/cms", icon: <Megaphone size={19} /> },
    { name: "System Analytics", path: "/superadmin/analytics", icon: <BarChart3 size={19} /> },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-50
          bg-[#059669] text-white flex flex-col shadow-xl overflow-hidden
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 lg:w-64"}
        `}
      >
        {/* LOGO */}
        <div className="p-6 flex items-center justify-between flex-shrink-0">
          <span className="text-2xl font-black italic tracking-tighter">
            HiLearn
          </span>

          {/* CLOSE BUTTON (mobile) */}
          <button
            className="lg:hidden text-white/80 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav
          className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar"
          style={hideScrollbar}
        >
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${isActive
                  ? "bg-white text-[#059669] shadow-lg font-bold"
                  : "hover:bg-white/10 text-emerald-50"
                }`
              }
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* MENU BUTTON (mobile) */}
            <button
              className="lg:hidden text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-700">
                Platform Control Center
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">
                {user?.name}
              </p>
              <p className="text-[10px] text-[#059669] font-bold uppercase">
                Super Admin
              </p>
            </div>

            <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;