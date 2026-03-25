import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Clock, Play, FolderOpen, Radio, Loader2, Calendar, X, Plus } from "lucide-react";
import AddEditLecture from "../admin/lectures/AddEditLecture";
import AddMaterialModal from "../admin/materials/AddEditMaterial";

const API = "http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-lectures";

const MentorLectures = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");

  const [lectures, setLectures] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");

  const fetchMentorLectures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const filterUrl = courseId ? `${API}?courseId=${courseId}` : API;
      const res = await fetch(filterUrl, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setLectures(data.lectures || []);
    } catch (err) {
      console.error("Error fetching mentor lectures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorLectures();
  }, [courseId]);

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditData(null);
  };

  const handleEdit = (lecture) => {
    setEditData(lecture);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartClass = async (lectureId) => {
    try {
      const response = await axios.post(`http://https://hilearnlmstool-production.up.railway.app/api/zoom/start-meeting/${lectureId}`);
      if (response.data.start_url) {
        window.open(response.data.start_url, "_blank");
        setLectures(prev => prev.map(l =>
          l._id === lectureId ? { ...l, meetingLink: response.data.join_url } : l
        ));
      }
    } catch (error) {
      console.error("Error starting class:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      const token = localStorage.getItem("token");
      await fetch(`http://https://hilearnlmstool-production.up.railway.app/api/lectures/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchMentorLectures();
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = lectures.filter(l => new Date(l.date || new Date()) >= today);
  const past = lectures.filter(l => new Date(l.date || new Date()) < today);

  const LectureCard = ({ l, isPast }) => (
    <div className={`group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isPast ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-[#059669]">
          <Radio size={22} />
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-[#059669] text-[10px] font-black uppercase rounded-lg">
          {l.course?.title || "General"}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-3">{l.title}</h3>
      <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase mb-6">
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
          <Calendar size={12} /> {new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{" • "}{l.startTime}
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-md">
          <Clock size={12} /> {l.duration}m
        </div>
      </div>
      <div className="mt-auto space-y-2">
        {l.lectureType === 'live' && (
          <button onClick={() => handleStartClass(l._id)} className="w-full py-2.5 bg-rose-600 text-white rounded-xl font-bold text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-rose-700">
            <Radio size={14} /> Start & Join Live
          </button>
        )}
        {l.lectureType === 'video' && (l.videoID || l.videoUrl) && (
          <button
            onClick={() => setSelectedVideo(`https://iframe.mediadelivery.net/embed/${l.libraryID || '592909'}/${l.videoID || l.videoUrl}?autoplay=true`)}
            className="w-full py-2.5 bg-[#059669] text-white rounded-xl font-bold text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-[#047857]"
          >
            <Play size={14} fill="white" /> Preview Video
          </button>
        )}
        <button onClick={() => setSelectedLecture(l)} className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-[11px] uppercase flex items-center justify-center gap-2">
          <FolderOpen size={14} /> Materials
        </button>
        <div className="flex gap-2">
          <button onClick={() => handleEdit(l)} className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase">Edit</button>
          <button onClick={() => handleDelete(l._id)} className="flex-1 py-2 bg-white border border-slate-200 text-rose-500 rounded-lg text-[10px] font-bold uppercase">Delete</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      {/* Back Button */}
      {courseId && (
        <button 
          onClick={() => navigate("/mentor/courses")}
          className="mb-6 group flex items-center gap-3 bg-[#059669] text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-[#047857] transition-all duration-300 shadow-lg shadow-emerald-200/50 border-2 border-[#059669]"
        >
          <div className="bg-white/20 rounded-lg p-1 group-hover:-translate-x-1 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </div>
          Back to All Courses
        </button>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Class Schedule</h1>
          <p className="text-[#059669] text-sm font-bold uppercase tracking-widest mt-1">Manage sessions & content</p>
        </div>
        
        {/* Toggle Button: Create / Close */}
        <button 
          onClick={() => isFormOpen ? handleCloseForm() : setIsFormOpen(true)} 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg active:scale-95 border-2 ${
            isFormOpen 
            ? "bg-white border-rose-500 text-rose-500 shadow-rose-100" 
            : "bg-[#059669] border-[#059669] text-white shadow-emerald-200/50"
          }`}
        >
          {isFormOpen ? <X size={18} /> : <Plus size={18} />}
          {isFormOpen ? "Close Editor" : "Create New Class"}
        </button>
      </div>

      {/* Form Section with Absolute Close Button */}
      {isFormOpen && (
        <div className="mb-10 relative">
          
          <button 
            onClick={handleCloseForm}
            className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-full transition-colors duration-200"
            title="Cancel and Close"
          >
            <X size={20} />
          </button>
          
          <AddEditLecture 
            refreshLectures={fetchMentorLectures} 
            editData={editData} 
            clearEdit={handleCloseForm} 
          />
        </div>
      )}

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center py-20"><Loader2 className="animate-spin text-[#059669]" size={40} /></div>
      ) : (
        <>
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-[#059669] rounded-full"></div> Upcoming Classes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.length > 0 ? upcoming.map(l => <LectureCard key={l._id} l={l} isPast={false} />) : <p className="text-slate-400 italic">No future classes found.</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-400 mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-slate-300 rounded-full"></div> Past History
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.length > 0 ? past.map(l => <LectureCard key={l._id} l={l} isPast={true} />) : <p className="text-slate-400 italic">No past classes.</p>}
            </div>
          </div>
        </>
      )}

      {/* BUNNY.NET PREVIEW MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-[3000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setSelectedVideo("")}
              className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <X size={24} /> CLOSE PREVIEW
            </button>
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-2xl shadow-2xl border-2 border-white/10"
              allowFullScreen
              allow="autoplay; encrypted-media"
            />
          </div>
        </div>
      )}

      {selectedLecture && <AddMaterialModal lecture={selectedLecture} onClose={() => setSelectedLecture(null)} />}
    </div>
  );
};

export default MentorLectures;