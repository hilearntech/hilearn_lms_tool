import React, { useEffect,状态 } from "react";
import { BookOpen, PlayCircle, Clock, GraduationCap, Users } from "lucide-react";

const MentorCourses = () => {
  const [assignedCourses, setAssignedCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchMentorCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch("http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-courses", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          setAssignedCourses(data.courses || []);
        }
      } catch (err) {
        console.error("Error fetching mentor courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentorCourses();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading assigned courses...</div>;

  return (
    <div className="max-w-7xl p-4 md:p-8 mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">My Assigned Courses</h1>
        <p className="text-[#059669] text-1xl font-medium">Manage and monitor the courses you teach</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedCourses.length > 0 ? (
          assignedCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {/* Theme color bar */}
              <div className="h-3 bg-[#059669]"></div> 
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#059669] group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    Faculty
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {course.description || "Teaching modules and managing students for this course."}
                </p>

                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-6">
                  <span className="flex items-center gap-1"><Clock size={14} /> {course.duration || "N/A"}</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {course.studentCount || "0"} Students</span>
                </div>

                <button 
                  onClick={() => window.location.href = `/mentor/lectures?courseId=${course._id}`}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  <PlayCircle size={18} /> View Lectures
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <BookOpen className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-bold">No courses assigned to you yet.</p>
            <p className="text-slate-400 text-sm mt-1">Contact admin to assign batches.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorCourses;