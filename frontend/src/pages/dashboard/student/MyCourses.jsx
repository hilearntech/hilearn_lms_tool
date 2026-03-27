// import React, { useEffect, useState } from "react";
// import { BookOpen, PlayCircle, Clock, GraduationCap } from "lucide-react";

// const MyCourses = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchMyCourses = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("https://hilearnlmstool-production.up.railway.app/api/students/dashboard", {
//         headers: { "Authorization": `Bearer ${token}` }
//       });
//       const data = await res.json();

//       if (data.success) {
//         setEnrolledCourses(data.enrolledCoursesList || []); 
//       }
//     } catch (err) {
//       console.error("Error fetching my courses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchMyCourses();
// }, []);

//   if (loading) return <div className="p-8 text-center">Loading your library...</div>;

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-2xl font-black text-slate-800">My Learning Library</h1>
//         <p className="text-slate-500">Continue where you left off</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {enrolledCourses.length > 0 ? (
//           enrolledCourses.map((course) => (
//             <div key={course._id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
//               <div className="h-3 bg-[#059669]"></div> 
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#059669]">
//                     <GraduationCap size={24} />
//                   </div>
//                   <span className="bg-emerald-100 text-[#059669] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
//                     Enrolled
//                   </span>
//                 </div>

//                 <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
//                 <p className="text-slate-500 text-sm mb-6 line-clamp-2">{course.description}</p>

//                 <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-6">
//                   <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
//                   <span className="flex items-center gap-1"><BookOpen size={14} /> All Modules</span>
//                 </div>

//                 <button className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
//                   <PlayCircle size={18} /> Continue Learning
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-span-full text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
//             <p className="text-slate-400 font-medium">You haven't enrolled in any courses yet.</p>
//             <button 
//               onClick={() => window.location.href = "/student/explore"}
//               className="mt-4 text-[#059669] font-bold hover:underline"
//             >
//               Browse Catalog
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyCourses;

import React, { useEffect, useState } from "react";
import { BookOpen, PlayCircle, Clock, GraduationCap } from "lucide-react";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://hilearnlmstool-production.up.railway.app/api/students/dashboard", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setEnrolledCourses(data.enrolledCoursesList || []); 
      }
    } catch (err) {
      console.error("Error fetching my courses:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchMyCourses();
}, []);

  if (loading) return <div className="p-8 text-center">Loading your library...</div>;

  return (
   <div className="max-w-7xl mx-auto p-4 sm:p-6">
  
  {/* Header */}
  <div className="mb-6 sm:mb-8 text-center sm:text-left">
    <h1 className="text-xl sm:text-2xl font-black text-slate-800">
      My Learning Library
    </h1>
    <p className="text-slate-500 text-sm">
      Continue where you left off
    </p>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    
    {enrolledCourses.length > 0 ? (
      enrolledCourses.map((course) => (
        <div 
          key={course._id} 
          className="bg-white rounded-[20px] sm:rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
        >
          
          <div className="h-2 sm:h-3 bg-[#059669]"></div>

          <div className="p-4 sm:p-6 flex flex-col flex-1">
            
            {/* Top */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#059669]">
                <GraduationCap size={20} className="sm:w-6 sm:h-6" />
              </div>

              <span className="bg-emerald-100 text-[#059669] text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full uppercase">
                Enrolled
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 line-clamp-1">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">
              {course.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 sm:gap-4 text-slate-400 text-[10px] sm:text-xs font-bold mb-4 sm:mb-6">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={12} /> All Modules
              </span>
            </div>

            {/* Button */}
            <button className="mt-auto w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all">
              <PlayCircle size={16} /> Continue Learning
            </button>

          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center py-14 sm:py-20 bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium text-sm">
          You haven't enrolled in any courses yet.
        </p>
        <button 
          onClick={() => window.location.href = "/student/explore"}
          className="mt-4 text-[#059669] font-bold hover:underline text-sm"
        >
          Browse Catalog
        </button>
      </div>
    )}

  </div>
</div>
  );
};

export default MyCourses;