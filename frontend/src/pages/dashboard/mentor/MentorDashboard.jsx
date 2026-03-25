import React, { useState, useEffect } from "react";
import axios from "axios";
import { Video, Users, Clock, Calendar, ExternalLink } from "lucide-react";

const MentorDashboard = () => {
  const [stats, setStats] = useState({ lectures: 0, students: 0 });
  const [upcomingLive, setUpcomingLive] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/mentor/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.stats);

        // Fetch lectures for dashboard preview
        const lecRes = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-lectures", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (lecRes.data.success) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Filter only LIVE and FUTURE lectures
          const live = lecRes.data.lectures.filter(l =>
            l.lectureType === 'live' && new Date(l.date || new Date()) >= today
          );
          setUpcomingLive(live.slice(0, 3));
        }
      } catch (err) { console.error(err); }
    };
    fetchMentorData();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return "No Time";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Hello, {user?.name}! 👋</h2>
      <p className="text-slate-500 mb-8 font-medium">Mentor Dashboard Overview</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Batches Card - NAYA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl"><Video size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">My Batches</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.batches || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Video size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">My Lectures</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.lectures}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Assigned Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.students}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Next Live Session</p>
            <h3 className="text-sm font-bold text-slate-800">

              {upcomingLive[0] ? (
                <span className="flex flex-col">

                  <span>{new Date(upcomingLive[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>

                  <span className="text-[#059669]">{upcomingLive[0].startTime}</span>
                </span>
              ) : (
                "No Sessions"
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule Preview */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-[#059669]" size={20} /> Upcoming Live Classes
          </h3>
        </div>

        {upcomingLive.length > 0 ? (
          <div className="space-y-4">
            {upcomingLive.map((live) => (
              <div key={live._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <Video size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{live.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{live.course?.title} • {live.date || 'TBD'}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(live.meetingLink, "_blank")}
                  className="px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-lg hover:bg-[#047857] transition-all flex items-center gap-2"
                >
                  Join <ExternalLink size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm italic">No live classes scheduled for today or tomorrow.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;