import { useEffect, useState } from "react";
import { Clock, Search, Plus, X, Play, FolderOpen, Edit3, Trash2, Video, Radio, FileText, HelpCircle, Layers, ExternalLink } from "lucide-react";
import AddEditLecture from "./AddEditLecture";
import AddMaterialModal from "./AddMaterialModal";

const API = "https://hilearnlmstool-production.up.railway.app/api/lectures";

const LectureList = () => {
  const [lectures, setLectures] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState("");

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setLectures(data.lectures || []);
      } else {
        console.error("Auth Failed:", data.message);
      }
    } catch (err) {
      console.error("Error fetching lectures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const deleteLecture = async (id) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          fetchLectures();
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleEdit = (lecture) => {
    setEditData(lecture);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === "" || l.course?._id === filterValue;
    return matchesSearch && matchesFilter;
  });

  const uniqueCourses = Array.from(new Set(lectures.map((l) => l.course?._id)))
    .map((id) => lectures.find((l) => l.course?._id === id)?.course)
    .filter(Boolean);

  const getLectureIcon = (type) => {
    const className = "text-[#059669]";
    switch (type) {
      case 'live': return <Radio size={22} className={className} />;
      case 'article': return <FileText size={22} className={className} />;
      case 'quiz': return <HelpCircle size={22} className={className} />;
      default: return <Video size={22} className={className} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen font-sans">

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Curriculum Management</h1>
          <p className="text-slate-500 text-sm font-medium">Organize your course content</p>
        </div>

        <button
          onClick={() => {
            if (isFormOpen) { setIsFormOpen(false); setEditData(null); }
            else { setIsFormOpen(true); }
          }}
          className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-sm text-sm ${isFormOpen ? "bg-white border border-slate-200 text-slate-600" : "bg-[#059669] text-white hover:bg-[#047857]"
            }`}
        >
          {isFormOpen ? <><X size={16} /> Close</> : <><Plus size={16} /> New Lecture</>}
        </button>
      </div>

      {/* --- Form Section --- */}
      {isFormOpen && (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <AddEditLecture
            refreshLectures={fetchLectures}
            editData={editData}
            clearEdit={() => { setIsFormOpen(false); setEditData(null); }}
          />
        </div>
      )}

      {/* --- Search & Filter Row --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow max-sm:w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search lectures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#059669] transition-all text-sm"
          />
        </div>

        <select
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none text-sm font-semibold text-slate-600 cursor-pointer focus:border-[#059669]"
        >
          <option value="">All Courses</option>
          {uniqueCourses.map((c) => (
            <option key={c._id} value={c._id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* --- Lecture Grid --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((l) => (
            <div
              key={l._id}
              className="group bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-emerald-50 border border-emerald-100">
                {getLectureIcon(l.lectureType)}
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-[#059669] transition-colors">
                  {l.title}
                </h3>

                <p className="text-slate-500 text-[13px] leading-relaxed mb-4 line-clamp-2">
                  {l.description || "Course module focusing on core concepts and practical implementation."}
                </p>

                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg">
                    <Clock size={12} className="text-[#059669]" /> {l.duration} Mins
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg">
                    <Layers size={12} className="text-[#059669]" /> {l.lectureType || 'video'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto pt-4 border-t border-slate-50">

                {/* BUNNY.NET VIDEO PREVIEW */}
                {l.lectureType === 'video' && (l.videoID || l.videoUrl) && (
                  <button
                    onClick={() => setSelectedVideo(`https://iframe.mediadelivery.net/embed/${l.libraryID || '592909'}/${l.videoID || l.videoUrl}?autoplay=true`)}
                    className="w-full py-2.5 bg-[#059669] text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-[#047857] transition-all flex items-center justify-center gap-2"
                  >
                    <Play size={14} fill="white" /> Preview Video
                  </button>
                )}

                {l.lectureType === 'live' && l.meetingLink && (
                  <button
                    onClick={() => window.open(l.meetingLink, "_blank")}
                    className="w-full py-2.5 bg-rose-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Radio size={14} /> Join Live Class
                  </button>
                )}

                {l.lectureType === 'article' && (
                  <button
                    className="w-full py-2.5 bg-amber-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={14} /> Read Article
                  </button>
                )}

                <button
                  onClick={() => setSelectedLecture(l)}
                  className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <FolderOpen size={14} /> Materials
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(l)}
                    className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => deleteLecture(l._id)}
                    className="flex-1 py-2 bg-white border border-slate-200 text-rose-500 rounded-lg font-bold text-[10px] uppercase hover:bg-rose-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- No Data Placeholder --- */}
      {!loading && filteredLectures.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Layers className="text-slate-200 mx-auto mb-3" size={40} />
          <p className="text-slate-400 text-sm font-medium">No lectures found.</p>
        </div>
      )}

      {/* --- VIDEO MODAL (BUNNY.NET) --- */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-[3000] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setSelectedVideo("")}
              className="absolute -top-12 right-0 text-white font-bold flex items-center gap-2 hover:text-rose-500 transition-colors"
            >
              <X size={24} /> CLOSE PREVIEW
            </button>
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-2xl shadow-2xl border-2 border-white/10"
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          </div>
        </div>
      )}

      {selectedLecture && (
        <AddMaterialModal
          lecture={selectedLecture}
          onClose={() => setSelectedLecture(null)}
        />
      )}
    </div>
  );
};

export default LectureList;