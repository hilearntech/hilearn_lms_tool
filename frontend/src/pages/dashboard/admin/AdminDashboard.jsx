import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, BookOpen, Video, Layers, Clock } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, lectures: 0, batches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-[#059669] font-bold">Refreshing stats...</div>;

  const cards = [
    { label: "Total Students", value: stats.students, icon: <Users size={20} />, color: "text-[#059669]", bg: "bg-emerald-50" },
    { label: "Active Courses", value: stats.courses, icon: <BookOpen size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Lectures", value: stats.lectures, icon: <Video size={20} />, color: "text-slate-800", bg: "bg-slate-100" },
    { label: "Batches", value: stats.batches, icon: <Layers size={20} />, color: "text-[#059669]", bg: "bg-emerald-50" },
    { label: "Pending Reviews", value: stats.pendingAssignments || 0, icon: <Clock size={20} />, color: "text-orange-500", bg: "bg-orange-50" }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-800">Welcome back, Admin! 👋</h1>
          <p className="text-slate-500 font-medium mt-1">Everything looks good today. Here's your overview.</p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Layers size={120} className="text-[#059669]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-[24px] border border-slate-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
                <h2 className="text-2xl font-black text-slate-800">{card.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-12 bg-white rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-emerald-50 text-[#059669] rounded-full flex items-center justify-center mb-4">
          <Layers size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Operational Analytics</h3>
        <p className="text-slate-500 text-sm max-w-sm">Detailed student growth and lecture engagement metrics will be available as more data is collected.</p>
        <button className="mt-6 px-10 py-3 bg-[#059669] text-white rounded-full font-bold text-sm shadow-lg shadow-emerald-100 active:scale-95 transition-all">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;