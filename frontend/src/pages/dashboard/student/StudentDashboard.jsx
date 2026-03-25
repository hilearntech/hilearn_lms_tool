import React, { useState, useEffect } from "react";
import { BookOpen, Video, Clock, PlayCircle, Calendar, Megaphone, Award, ArrowRight, Loader2, X, Download } from "lucide-react";
import axios from "axios";

import ZoomMeeting from "../../../component/ZoomMeeting";

const StudentDashboard = () => {
  const [data, setData] = useState({
    stats: {
      enrolledCourse: "Loading...",
      progress: 0,
      totalLectures: 0,
      attendanceRate: 0
    },
    continueWatching: null,
    upcomingLiveClasses: [],
    announcements: [],
    certificates: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [activeLiveLecture, setActiveLiveLecture] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/students/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setData({
            stats: {
              enrolledCourse: res.data.stats?.enrolledCourse || "No Course Enrolled",
              progress: res.data.stats?.progress ?? 0,
              totalLectures: res.data.stats?.totalLectures ?? 0,
              attendanceRate: res.data.stats?.attendanceRate ?? 0
            },
            continueWatching: res.data.continueWatching || null,
            upcomingLiveClasses: res.data.upcomingLiveClasses || [],
            announcements: res.data.announcements || [],
            certificates: res.data.certificates || []
          });
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);


  const handleDownloadCertificate = (url, title) => {
    if (!url) return alert("Error: Certificate source link is missing.");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("target", "_blank");
    link.setAttribute("download", `${title || "Completion_Certificate"}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResumeVideo = (videoID, libraryID, stoppedAt = 0) => {

    if (!videoID || !libraryID) {
      return alert("Video or Library ID missing!");
    }


    const startTime = stoppedAt > 0 ? `&t=${Math.floor(stoppedAt)}` : "";

    const bunnyUrl = `https://iframe.mediadelivery.net/embed/${libraryID}/${videoID}?autoplay=true${startTime}`;

    setSelectedVideo(bunnyUrl);
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://https://hilearnlmstool-production.up.railway.app/api/students/complete-lecture",
        { lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("Success! Your progress has been updated. 🎉");
        setSelectedVideo("");
        window.location.reload();
      }
    } catch (err) {
      console.error("Completion error", err);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
      <p className="text-emerald-600 font-bold tracking-tight">Syncing your learning progress...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500 bg-[#F8FAFC]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            Welcome back, {user?.name || 'Student'}! <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-md">
            {data.stats.progress > 0
              ? `You have completed ${data.stats.progress}% of your course. Keep it up!`
              : "Start your first lecture today to begin your journey!"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Course Progress */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-tight">Current Course</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-[#059669] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <BookOpen size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">{data.stats.enrolledCourse}</h4>
                <p className="text-sm text-[#059669] font-bold uppercase tracking-wider opacity-80">
                  Status: {data.stats.totalLectures > 0 ? 'Active' : 'Pending Enrollment'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500">Course Completion</span>
                <span className="text-2xl font-black text-[#059669]">{data.stats.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-[#059669] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(5,150,105,0.3)]"
                  style={{ width: `${data.stats.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-tight flex items-center gap-2">
              <PlayCircle className="text-[#059669]" /> Continue Watching
            </h3>


            {data.continueWatching && (Array.isArray(data.continueWatching) ? data.continueWatching.length > 0 : true) ? (
              <div className="space-y-4">
                {(Array.isArray(data.continueWatching) ? data.continueWatching : [data.continueWatching]).map((video, index) => (
                  <div
                    key={video.id || index}
                    className="flex flex-col md:flex-row gap-6 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all group"
                  >
                    {/* Thumbnail Container */}
                    <div
                      onClick={() => handleResumeVideo(video.videoUrl)}
                      className="relative w-full md:w-48 h-28 bg-slate-200 rounded-xl overflow-hidden shadow-inner cursor-pointer shrink-0"
                    >
                      <img
                        src={video.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt="lecture-thumbnail"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <PlayCircle className="text-white" size={40} />
                      </div>
                    </div>

                    {/* Text & Action */}
                    <div className="flex-1 w-full">
                      <h4 className="font-bold text-slate-800 text-base mb-1 group-hover:text-[#059669] transition-colors line-clamp-1">
                        {video.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mb-4 uppercase font-black tracking-widest italic">
                        {video.moduleName || "Recent Lecture"}
                      </p>

                      <button
                        onClick={() => {

                          handleResumeVideo(
                            video.videoID || video.id,
                            video.libraryID || "592909",
                            video.lastStoppedTime || 0
                          );
                        }}
                        className="px-5 py-2.5 bg-[#059669] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-95"
                      >
                        Resume Now <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="p-10 border-2 border-dashed border-slate-100 rounded-[24px] text-center bg-slate-50/30">
                <Video className="mx-auto text-slate-200 mb-3" size={32} />
                <p className="text-slate-400 text-sm font-medium">No recent activity. Head to 'My Lectures' to start!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="flex flex-col gap-6">
          <StatCard
            icon={<Video size={24} />}
            label="Total Lectures"
            value={data.stats.totalLectures}
            color="bg-emerald-50 text-[#059669]"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Attendance Rate"
            value={`${data.stats.attendanceRate}%`}
            color="bg-emerald-50 text-[#059669]"
          />

          {/* UPCOMING LIVE CLASSES SECTION (FIXED) */}
          <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              Upcoming Live Classes <Calendar size={14} />
            </h3>
            <div className="space-y-4">
              {data.upcomingLiveClasses.length > 0 ? (
                data.upcomingLiveClasses.map((live, idx) => (
                  <div key={idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-[#059669] mb-1">{live.time} • {live.date}</p>
                    <h5 className="font-bold text-slate-800 text-sm">{live.topic}</h5>


                    {live.zoomDetails?.meeting_id ? (
                      <button
                        onClick={() => setActiveLiveLecture(live)}
                        className="mt-3 block w-full py-2 text-center bg-[#059669] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-95"
                      >
                        Join Zoom Class
                      </button>
                    ) : live.meetingLink ? (
                      <a
                        href={live.meetingLink.startsWith('http') ? live.meetingLink : `https://${live.meetingLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block w-full py-2 text-center bg-white border border-emerald-200 rounded-xl text-xs font-bold text-[#059669] hover:bg-[#059669] hover:text-white transition-all shadow-sm"
                      >
                        Join via Link
                      </a>
                    ) : (
                      <button className="mt-3 block w-full py-2 text-center bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-bold cursor-not-allowed uppercase">
                        Link TBA
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-400 font-medium">No classes scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {activeLiveLecture && (
        <ZoomMeeting
          user={JSON.parse(localStorage.getItem("user"))}
          meetingDetails={{
            number: activeLiveLecture.zoomDetails?.meeting_id,
            password: activeLiveLecture.zoomDetails?.password,
            title: activeLiveLecture.topic,
            id: activeLiveLecture.id
          }}
          onClose={() => setActiveLiveLecture(null)}
        />
      )}

      {/* Footer Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Announcements Section */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-emerald-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Megaphone className="text-emerald-600" /> Latest Updates
            </h3>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
              {data.announcements.length} Notices
            </span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {data.announcements.length > 0 ? (
              data.announcements.map((msg, idx) => {
                const isNew = new Date(msg.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                return (
                  <div key={idx} className="flex gap-4 p-5 bg-emerald-50/30 rounded-2xl transition-all border border-emerald-50 hover:border-emerald-200 hover:bg-white group shadow-sm shadow-emerald-500/5">
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${isNew ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                        <Megaphone size={22} />
                      </div>
                      {isNew && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-md"></span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">
                          {msg.title}
                          {isNew && <span className="ml-2 text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full uppercase font-black">Latest</span>}
                        </h5>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3 font-medium">
                        {msg.description}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-emerald-50 rounded-[40px] bg-emerald-50/20">
                <Megaphone className="mx-auto text-emerald-100 mb-3" size={48} />
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No announcements today</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] shadow-sm text-white relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight flex items-center gap-2">
            <Award className="text-emerald-400" /> Certificates Earned
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {data.certificates && data.certificates.length > 0 ? (
              data.certificates.map((cert, idx) => (
                <div key={idx} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col items-start gap-3 hover:border-emerald-500 transition-all group">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Award className="text-emerald-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h5 className="text-xs font-black uppercase tracking-tight text-white mb-1 leading-tight">{cert.title || "Course Certificate"}</h5>
                    <p className="text-[10px] text-slate-400 font-bold italic">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate(cert.url, cert.title)}
                    className="w-full mt-2 py-2.5 bg-white/10 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/5"
                  >
                    Download <Download size={12} />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 opacity-40 border-2 border-dashed border-white/10 rounded-3xl">
                <Award size={48} className="mx-auto mb-3 text-slate-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Achievements Locked</p>
                <p className="text-[10px] mt-1 text-slate-400">Complete your course and clear the assessment to earn yours.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- VIDEO MODAL --- */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl bg-black rounded-[32px] overflow-hidden border-4 border-white/10 shadow-2xl">
            <button
              onClick={() => setSelectedVideo("")}
              className="absolute top-4 right-4 z-[10000] bg-white/20 hover:bg-red-500 text-white p-2 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <div className="aspect-video">
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
            <div className="p-5 bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <p className="text-white font-bold">{data.continueWatching?.title}</p>
                <p className="text-white/40 text-[10px] uppercase font-black">Video is playing from your last session</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelectedVideo("")} className="px-6 py-2.5 rounded-xl text-white bg-white/10 font-bold hover:bg-white/20 transition-all text-sm">Watch Later</button>
                <button
                  onClick={() => handleMarkComplete(data.continueWatching.id || data.continueWatching._id)}
                  className="px-6 py-2.5 rounded-xl text-white bg-emerald-600 font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all text-sm flex items-center gap-2"
                >
                  MARK AS COMPLETED ✅
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-[#059669]/30 transition-all hover:shadow-md">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);

export default StudentDashboard;