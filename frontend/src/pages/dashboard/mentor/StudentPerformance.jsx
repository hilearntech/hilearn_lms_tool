import { useState, useEffect } from "react";
import { Search, Award, BarChart3, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";

const StudentPerformance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/mentor/student-performance", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching performance", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#059669]" size={40} /></div>
  );

  return (
    // <div className="max-w-7xl mx-auto p-4">
    //   {/* Search & Header (Same as before) */}
    //   <div className="mb-8">
    //     <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
    //       <BarChart3 className="text-[#059669]" /> Performance Tracking
    //     </h1>
    //     <input
    //       type="text"
    //       placeholder="Search student..."
    //       className="mt-4 p-2 border rounded-xl w-64"
    //       onChange={(e) => setSearchTerm(e.target.value)}
    //     />
    //   </div>

    //   <div className="grid grid-cols-1 gap-4">
    //     {filteredStudents.map((student) => (
    //       <div key={student.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
    //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    //           <div className="flex items-center gap-4">
    //             <div className="w-12 h-12 bg-emerald-50 text-[#059669] rounded-2xl flex items-center justify-center font-black">
    //               {student.name.charAt(0)}
    //             </div>
    //             <div>
    //               <h3 className="font-bold text-slate-800">{student.name}</h3>
    //               <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{student.email}</p>
    //             </div>
    //           </div>

    //           <div className="flex-1 max-w-xs">
    //             <div className="flex justify-between text-[10px] font-black mb-1 uppercase text-slate-500">
    //               <span>Course Progress</span>
    //               <span>{student.progress}%</span>
    //             </div>
    //             <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
    //               <div
    //                 className="h-full bg-[#059669] transition-all duration-500"
    //                 style={{ width: `${student.progress}%` }}
    //               ></div>
    //             </div>
    //           </div>

    //           <div className="flex items-center gap-3">
    //             <Award size={20} className="text-amber-500" />
    //             <div>
    //               <p className="text-[10px] font-black text-slate-400 uppercase">Avg Quiz</p>
    //               <p className="text-sm font-black text-slate-800">{student.avgQuiz}%</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="max-w-7xl mx-auto p-3 sm:p-4">

      {/* HEADER */}
      <div className="mb-6 sm:mb-8">

        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="text-[#059669]" size={20} />
          Performance Tracking
        </h1>

        <input
          type="text"
          placeholder="Search student..."
          className="mt-3 sm:mt-4 p-2 sm:p-3 border rounded-xl w-full sm:w-64 text-sm outline-none focus:border-[#059669]"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredStudents.map((student) => (

          <div
            key={student.id}
            className="bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm"
          >

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">

              {/* USER INFO */}
              <div className="flex items-center gap-3 sm:gap-4">

                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-[#059669] rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-sm sm:text-base">
                  {student.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                    {student.name}
                  </h3>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest truncate">
                    {student.email}
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="w-full md:flex-1 md:max-w-xs">
                <div className="flex justify-between text-[9px] sm:text-[10px] font-black mb-1 uppercase text-slate-500">
                  <span>Course Progress</span>
                  <span>{student.progress}%</span>
                </div>

                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669] transition-all duration-500"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* QUIZ SCORE */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Award size={18} className="text-amber-500" />

                <div>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">
                    Avg Quiz
                  </p>
                  <p className="text-sm sm:text-base font-black text-slate-800">
                    {student.avgQuiz}%
                  </p>
                </div>
              </div>

            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default StudentPerformance;