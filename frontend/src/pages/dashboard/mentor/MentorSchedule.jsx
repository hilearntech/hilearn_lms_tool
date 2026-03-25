import { useEffect, useState } from "react";
import { Video, Loader2, Clock, VideoOff } from "lucide-react";
import axios from "axios";

const MentorSchedule = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-lectures", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.data.success) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

       
        const upcomingLive = res.data.lectures.filter(l => {
          const lecDate = new Date(l.date);
          return l.lectureType === 'live' && lecDate >= today;
        });

        
        upcomingLive.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLectures(upcomingLive);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-10 bg-[#059669] rounded-full"></div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Lecture Schedule</h1>
          <p className="text-[#059669] text-sm font-medium">Your upcoming live sessions and classes</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#059669]" size={40} />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#059669] text-white font-bold">
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em]">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em]">Topic</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-center">Time</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lectures.length > 0 ? (
                lectures.map((lecture) => (
                  <tr key={lecture._id} className="hover:bg-emerald-50/50 transition-colors">
                    {/* Date Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">
                          {new Date(lecture.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[10px] text-[#059669] font-bold uppercase">
                          {new Date(lecture.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                        </span>
                      </div>
                    </td>

                    {/* Topic Column */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 capitalize tracking-tight text-sm">
                          {lecture.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {lecture.course?.title || "Course"}
                        </span>
                      </div>
                    </td>

                    {/* Time Column */}
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#059669] px-3 py-1 rounded-full text-[10px] font-black">
                        <Clock size={12}/> {lecture.startTime || "9:30 AM"}
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-5 text-right">
                      {lecture.meetingLink ? (
                        <button 
                          onClick={() => window.open(lecture.meetingLink, "_blank")}
                          className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-lg active:scale-95 flex items-center gap-2 ml-auto"
                        >
                          <Video size={14}/> Join Class
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 italic uppercase">Link TBA</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <VideoOff size={40} className="text-[#059669]" />
                      <p className="font-black text-sm uppercase tracking-widest text-slate-900">
                        No upcoming live sessions
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MentorSchedule;