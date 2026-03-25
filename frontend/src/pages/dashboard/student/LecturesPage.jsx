import React, { useEffect, useState } from "react";
import { 
  PlayCircle, 
  Download, 
  Search, 
  Calendar, 
  Video, 
  X, 
  Loader2, 
  VideoOff 
} from "lucide-react";
import axios from "axios";

const LecturesPage = () => {
  const [lectures, setLectures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState("");


  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/students/lectures", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allLectures = res.data.lectures || [];
        const videoOnly = allLectures
          .filter(l => l.lectureType === 'video')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setLectures(videoOnly);
      } catch (err) { 
        console.error("Error", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchLectures();
  }, []);


  const getYouTubeId = (url) => {
    if (!url) return null;
    if (url.includes("v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1];
    return null;
  };


  const handleWatchNow = (videoUrl) => {
    const id = getYouTubeId(videoUrl);
    if (!id) {
      alert("Invalid or missing video URL");
      return;
    }
    setSelectedVideo(`https://www.youtube.com/embed/${id}?autoplay=1`);
  };


  const filteredLectures = lectures.filter((l) =>
    l.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600 mb-2" size={32} />
        <p className="text-slate-500 font-medium">Loading lectures...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      
 
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Video className="text-emerald-600" size={28} />
            My Lectures
            <span className="text-sm font-normal text-slate-400 ml-2">({filteredLectures.length} Videos)</span>
          </h2>
          <p className="text-slate-500 text-sm">Access your recorded video lectures anytime.</p>
        </div>

        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-colors text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

     
      {filteredLectures.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-xl">
          <VideoOff size={48} className="mx-auto text-slate-200 mb-3" />
          <p className="text-slate-500">No lectures found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLectures.map((lecture) => (
            <div
              key={lecture._id}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-all shadow-sm"
            >
             
              <div 
                className="aspect-video bg-slate-100 relative flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => handleWatchNow(lecture.videoUrl)}
              >
                <PlayCircle className="text-emerald-600 opacity-80 group-hover:scale-110 transition-transform" size={44} />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                  Video
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 uppercase font-semibold mb-2">
                  <Calendar size={13} className="text-emerald-500" />
                  {new Date(lecture.createdAt).toLocaleDateString("en-GB")}
                </div>

                <h3 className="font-bold text-slate-700 mb-4 line-clamp-2 min-h-[40px] text-sm leading-tight">
                  {lecture.title || "Untitled Lecture"}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleWatchNow(lecture.videoUrl)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    WATCH LECTURE
                  </button>
                  <button
                    title="Download Materials"
                    className="px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- SIMPLE VIDEO MODAL --- */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-slate-900/90 z-[1000] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo("")}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo("")}
              className="absolute top-3 right-3 z-20 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <iframe
              src={selectedVideo}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Lecture Player"
              style={{ border: 0 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturesPage;