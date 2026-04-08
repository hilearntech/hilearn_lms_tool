// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { User, BookOpen, ClipboardList, LogOut, PlayCircle, Trophy, LayoutGrid, FileText , MessageCircle } from "lucide-react"; // LayoutGrid add kiya

// const StudentLayout = () => {

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [unreadCount, setUnreadCount] = useState(0);
//   const getUserData = () => {
//     const userString = localStorage.getItem("user");
//     if (!userString) return null;
//     try {
//       return JSON.parse(userString);
//     } catch (e) {
//       localStorage.removeItem("user");
//       return null;
//     }
//   };

//   const user = getUserData();
//   const token = localStorage.getItem("token");

//   // --- Notification Fetch Logic ---
//   const fetchUnreadCount = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/notifications/unread-count", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.success) {
//         setUnreadCount(res.data.count);
//       }
//     } catch (err) {
//       console.error("Notification Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }


//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 60000);

//     if (user.isFirstLogin && location.pathname !== "/student/profile") {
//       navigate("/student/profile", {
//         state: { forcePasswordChange: true },
//         replace: true
//       });
//     }
//   }, [user?.isFirstLogin, location.pathname, navigate]);

//   return (
//     <div className="min-h-screen flex bg-slate-50">
//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       <aside className="w-64 bg-[#059669] text-white flex flex-col shadow-xl sticky top-0 h-screen overflow-hidden">
//         <div className="p-8 text-2xl font-black italic tracking-tighter flex-shrink-0">HiLearn</div>

//         <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar hideScrollbar" >
//           <SidebarNavItem
//             icon={<BookOpen size={19} />}
//             label="Dashboard"
//             active={location.pathname.includes("dashboard")}
             
//             onClick={() => !user?.isFirstLogin && navigate("/student/dashboard")}
//           />
          
//           <SidebarNavItem
//             icon={<LayoutGrid size={19} />}
//             label="Explore Courses"
//             active={location.pathname.includes("explore-courses")}
//             onClick={() => navigate("/student/explore-courses")}
//           />
//           <SidebarNavItem
//             icon={<LayoutGrid size={19} />}
//             label="My Courses"
//             active={location.pathname.includes("my-courses")}
//             onClick={() => navigate("/student/my-courses")}
//           />
//           <SidebarNavItem
//             icon={<PlayCircle size={19} />}
//             label="My Lectures"
//             active={location.pathname.includes("lectures")}
//             onClick={() => navigate("/student/lectures")}
//           />
          
//           <SidebarNavItem
//             icon={<ClipboardList size={19} />}
//             label="Attendance"
//             active={location.pathname.includes("attendance")}
//             onClick={() => navigate("/student/attendance")}
//           />
//           <SidebarNavItem
//             icon={<Trophy size={19} />}
//             label="My Quizzes"
//             active={location.pathname.includes("quizzes")}
//             onClick={() => navigate("/student/quizzes")}
//           />
//           <SidebarNavItem
//             icon={<User size={19} />}
//             label="Schedule"
//             active={location.pathname.includes("schedule")}
//             onClick={() => navigate("/student/schedule")}
//           />
//           <SidebarNavItem
//             icon={<FileText size={19} />}
//             label="Assignments"
//             active={location.pathname.includes("assignments")}
//             onClick={() => navigate("/student/assignments")}
//           />
//           <SidebarNavItem
//             icon={<MessageCircle size={19} />}
//             label="Doubt Support"
//             active={location.pathname.includes("doubts")}
//             onClick={() => navigate("/student/doubts")}
//           />
//           <SidebarNavItem
//             icon={
//               <div className="relative">
//                 <User size={19} />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#059669] animate-pulse">
//                     {unreadCount > 9 ? "9+" : unreadCount}
//                   </span>
//                 )}
//               </div>
//             }
//             label="My Profile"
//             active={location.pathname.includes("profile")}
//             onClick={() => navigate("/student/my-profile")}
//           />
//         </nav>

//         <div className="p-4 border-t border-white/20 bg-[#059669] flex-shrink-0">
//           <button
//             onClick={() => { localStorage.clear(); navigate("/"); }}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md"
//           >
//             <LogOut size={18} />
//             <span className="font-semibold text-sm">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       <div className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar hideScrollbar" >
//         <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
//             <h1 className="text-xl font-bold text-slate-700 tracking-tight">Student Portal</h1>
//           </div>

//           <div
//             className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1 rounded-xl transition-all"
//             onClick={() => navigate("/student/profile")}
//           >
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
//               <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">Active Member</p>
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


// const SidebarNavItem = ({ icon, label, active, onClick }) => (
//   <div
//     onClick={onClick}
//     className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${active ? "bg-white text-[#059669] shadow-lg font-bold" : "hover:bg-white/10 text-emerald-50"
//       }`}
//   >
//     <span className={active ? "text-[#059669]" : "group-hover:scale-110 transition-transform"}>
//       {icon}
//     </span>
//     <span className="text-sm font-medium">{label}</span>
//   </div>
// );


// export default StudentLayout;





// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { User, BookOpen, ClipboardList, LogOut, PlayCircle, Trophy, LayoutGrid, FileText, MessageCircle, Menu, X } from "lucide-react";

// const StudentLayout = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const getUserData = () => {
//     const userString = localStorage.getItem("user");
//     if (!userString) return null;
//     try {
//       return JSON.parse(userString);
//     } catch (e) {
//       localStorage.removeItem("user");
//       return null;
//     }
//   };

//   const user = getUserData();
//   const token = localStorage.getItem("token");

//   // --- Notification Fetch Logic ---
//   const fetchUnreadCount = async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/notifications/unread-count", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.success) {
//         setUnreadCount(res.data.count);
//       }
//     } catch (err) {
//       console.error("Notification Fetch Error:", err);
//     }
//   };

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 60000);

//     if (user.isFirstLogin && location.pathname !== "/student/profile") {
//       navigate("/student/profile", { state: { forcePasswordChange: true }, replace: true });
//     }

//     return () => clearInterval(interval);
//   }, [user?.isFirstLogin, location.pathname, navigate]);

//   // Hide scrollbar style
//   const hideScrollbar = { msOverflowStyle: "none", scrollbarWidth: "none" };

//   return (
//     <div className="h-screen flex bg-slate-50 overflow-hidden">

//       {/* MOBILE OVERLAY */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//           fixed lg:sticky top-0 h-screen z-50
//           bg-[#059669] text-white flex flex-col shadow-xl overflow-hidden
//           transition-all duration-300 ease-in-out
//           ${sidebarOpen ? "w-64" : "w-0 lg:w-64"}
//         `}
//       >
//         <div className="p-8 flex items-center justify-between flex-shrink-0 text-2xl font-black italic tracking-tighter">
//           <span>HiLearn</span>
//           <button className="lg:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
//             <X size={22} />
//           </button>
//         </div>

//         <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar" style={hideScrollbar}>
//           <SidebarNavItem
//             icon={<BookOpen size={19} />}
//             label="Dashboard"
//             active={location.pathname.includes("dashboard")}
//             onClick={() => !user?.isFirstLogin && navigate("/student/dashboard")}
//           />
//           <SidebarNavItem
//             icon={<LayoutGrid size={19} />}
//             label="Explore Courses"
//             active={location.pathname.includes("explore-courses")}
//             onClick={() => navigate("/student/explore-courses")}
//           />
//           <SidebarNavItem
//             icon={<LayoutGrid size={19} />}
//             label="My Courses"
//             active={location.pathname.includes("my-courses")}
//             onClick={() => navigate("/student/my-courses")}
//           />
//           <SidebarNavItem
//             icon={<PlayCircle size={19} />}
//             label="My Lectures"
//             active={location.pathname.includes("lectures")}
//             onClick={() => navigate("/student/lectures")}
//           />
//           <SidebarNavItem
//             icon={<ClipboardList size={19} />}
//             label="Attendance"
//             active={location.pathname.includes("attendance")}
//             onClick={() => navigate("/student/attendance")}
//           />
//           <SidebarNavItem
//             icon={<Trophy size={19} />}
//             label="My Quizzes"
//             active={location.pathname.includes("quizzes")}
//             onClick={() => navigate("/student/quizzes")}
//           />
//           <SidebarNavItem
//             icon={<User size={19} />}
//             label="Schedule"
//             active={location.pathname.includes("schedule")}
//             onClick={() => navigate("/student/schedule")}
//           />
//           <SidebarNavItem
//             icon={<FileText size={19} />}
//             label="Assignments"
//             active={location.pathname.includes("assignments")}
//             onClick={() => navigate("/student/assignments")}
//           />
//           <SidebarNavItem
//             icon={<MessageCircle size={19} />}
//             label="Doubt Support"
//             active={location.pathname.includes("doubts")}
//             onClick={() => navigate("/student/doubts")}
//           />
//           <SidebarNavItem
//             icon={
//               <div className="relative">
//                 <User size={19} />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#059669] animate-pulse">
//                     {unreadCount > 9 ? "9+" : unreadCount}
//                   </span>
//                 )}
//               </div>
//             }
//             label="My Profile"
//             active={location.pathname.includes("profile")}
//             onClick={() => navigate("/student/my-profile")}
//           />
//         </nav>

//         <div className="p-4 border-t border-white/20 flex-shrink-0">
//           <button
//             onClick={() => { localStorage.clear(); navigate("/"); }}
//             className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md"
//           >
//             <LogOut size={18} />
//             <span className="font-semibold text-sm">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <div className="flex-1 flex flex-col overflow-hidden min-w-0">

//         {/* HEADER */}
//         <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
//           <div className="flex items-center gap-3">
//             <button className="lg:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
//               <Menu size={24} />
//             </button>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
//               <h1 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">Student Portal</h1>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/student/profile")}>
//             <div className="text-right hidden sm:block">
//               <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
//               <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">Active Member</p>
//             </div>
//             <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black shadow-sm">
//               {user?.name?.charAt(0)}
//             </div>
//           </div>
//         </header>

//         {/* SCROLLABLE MAIN */}
//         <main className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 lg:p-8">
//           <Outlet />
//         </main>

//       </div>
//     </div>
//   );
// };

// const SidebarNavItem = ({ icon, label, active, onClick }) => (
//   <div
//     onClick={onClick}
//     className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${active ? "bg-white text-[#059669] shadow-lg font-bold" : "hover:bg-white/10 text-emerald-50"}`}
//   >
//     <span className={active ? "text-[#059669]" : "group-hover:scale-110 transition-transform"}>{icon}</span>
//     <span className="text-sm font-medium">{label}</span>
//   </div>
// );

// export default StudentLayout;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { User, BookOpen, ClipboardList, LogOut, PlayCircle, Trophy, LayoutGrid, FileText, MessageCircle, Menu, X } from "lucide-react";

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const getUserData = () => {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  };

  const user = getUserData();
  const token = localStorage.getItem("token");

  // --- Notification Fetch Logic ---
  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/notifications/unread-count", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUnreadCount(res.data.count);
      }
    } catch (err) {
      console.error("Notification Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);

    if (user.isFirstLogin && location.pathname !== "/student/profile") {
      navigate("/student/profile", { state: { forcePasswordChange: true }, replace: true });
    }

    return () => clearInterval(interval);
  }, [user?.isFirstLogin, location.pathname, navigate]);

  // Hide scrollbar style
  const hideScrollbar = { msOverflowStyle: "none", scrollbarWidth: "none" };

  // Close sidebar after nav click
  const handleNavClick = (action) => {
    action();
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex bg-slate-50 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
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
        <div className="p-8 flex items-center justify-between flex-shrink-0 text-2xl font-black italic tracking-tighter">
          <span>HiLearn</span>
          <button className="lg:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar" style={hideScrollbar}>
          <SidebarNavItem
            icon={<BookOpen size={19} />}
            label="Dashboard"
            active={location.pathname.includes("dashboard")}
            onClick={() => handleNavClick(() => !user?.isFirstLogin && navigate("/student/dashboard"))}
          />
          <SidebarNavItem
            icon={<LayoutGrid size={19} />}
            label="Explore Courses"
            active={location.pathname.includes("explore-courses")}
            onClick={() => handleNavClick(() => navigate("/student/explore-courses"))}
          />
          <SidebarNavItem
            icon={<LayoutGrid size={19} />}
            label="My Courses"
            active={location.pathname.includes("my-courses")}
            onClick={() => handleNavClick(() => navigate("/student/my-courses"))}
          />
          <SidebarNavItem
            icon={<PlayCircle size={19} />}
            label="My Lectures"
            active={location.pathname.includes("lectures")}
            onClick={() => handleNavClick(() => navigate("/student/lectures"))}
          />
          <SidebarNavItem
            icon={<ClipboardList size={19} />}
            label="Attendance"
            active={location.pathname.includes("attendance")}
            onClick={() => handleNavClick(() => navigate("/student/attendance"))}
          />
          <SidebarNavItem
            icon={<Trophy size={19} />}
            label="My Quizzes"
            active={location.pathname.includes("quizzes")}
            onClick={() => handleNavClick(() => navigate("/student/quizzes"))}
          />
          <SidebarNavItem
            icon={<User size={19} />}
            label="Schedule"
            active={location.pathname.includes("schedule")}
            onClick={() => handleNavClick(() => navigate("/student/schedule"))}
          />
          <SidebarNavItem
            icon={<FileText size={19} />}
            label="Assignments"
            active={location.pathname.includes("assignments")}
            onClick={() => handleNavClick(() => navigate("/student/assignments"))}
          />
          <SidebarNavItem
            icon={<MessageCircle size={19} />}
            label="Doubt Support"
            active={location.pathname.includes("doubts")}
            onClick={() => handleNavClick(() => navigate("/student/doubts"))}
          />
          <SidebarNavItem
            icon={
              <div className="relative">
                <User size={19} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#059669] animate-pulse">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            }
            label="My Profile"
            active={location.pathname.includes("profile")}
            onClick={() => handleNavClick(() => navigate("/student/my-profile"))}
          />
        </nav>

        <div className="p-4 border-t border-white/20 flex-shrink-0">
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#065f46] hover:bg-red-500 transition-all duration-300 shadow-md"
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-[#059669] rounded-full"></div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">Student Portal</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/student/profile")}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{user?.name}</p>
              <p className="text-[10px] text-[#059669] font-bold uppercase tracking-widest mt-1">Active Member</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 border-2 border-[#059669] text-[#059669] rounded-xl flex items-center justify-center font-black shadow-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN */}
        <main className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

const SidebarNavItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${active ? "bg-white text-[#059669] shadow-lg font-bold" : "hover:bg-white/10 text-emerald-50"}`}
  >
    <span className={active ? "text-[#059669]" : "group-hover:scale-110 transition-transform"}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default StudentLayout;
