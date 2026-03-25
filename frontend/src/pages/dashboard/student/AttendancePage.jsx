import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const AttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [stats, setStats] = useState({ totalPresent: 0, totalLectures: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/my-attendance", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const list = Array.isArray(res.data.attendance) ? res.data.attendance : [];
          const activeRecords = list.filter(record => record.lecture !== null && record.lecture !== undefined);
          
          setAttendanceList(activeRecords);

          const presentCount = activeRecords.filter(r => r.status.toLowerCase() === "present").length;
          setStats({
            totalPresent: presentCount,
            totalLectures: activeRecords.length
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const percentage = stats.totalLectures > 0 
    ? Math.round((stats.totalPresent / stats.totalLectures) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#059669] mb-2" size={40} />
        <p className="text-slate-400 font-bold">Loading your records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-800">My Attendance Report</h2>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Score</p>
          <h3 className="text-4xl font-black text-[#059669]">{percentage}%</h3>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#059669] text-white">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Lecture Name</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attendanceList.length > 0 ? (
              attendanceList.map((record) => (
                <tr key={record._id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{record.lecture.title}</p>
                  </td>
                  <td className="px-8 py-6 text-center text-sm font-bold text-slate-500">
                    {new Date(record.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 border ${
                        record.status.toLowerCase() === "present" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                        : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {record.status.toLowerCase() === "present" ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                        {record.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-8 py-20 text-center">
                   <p className="text-slate-400 font-bold">No active attendance records found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;