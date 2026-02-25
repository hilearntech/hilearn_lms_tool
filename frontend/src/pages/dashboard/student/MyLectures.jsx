import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Play,
  Loader2,
  VideoOff,
  X,
  FileText,
  Download,
  CheckCircle,
  Calendar,
} from "lucide-react";

const MyLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [completedLectures, setCompletedLectures] = useState([]);

  const [showMaterials, setShowMaterials] = useState(false);
  const [currentMaterials, setCurrentMaterials] = useState([]);
  const [activeLectureTitle, setActiveLectureTitle] = useState("");
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) return;


      const res = await axios.get("http://localhost:5000/api/students/lectures", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLectures(res.data.lectures.filter(l => l.lectureType?.toLowerCase() === "video"));
      }


      const dashRes = await axios.get("http://localhost:5000/api/students/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (dashRes.data.success) {
        const completedFromBackend = dashRes.data.completedList || [];
        setCompletedLectures(completedFromBackend.map(id => id.toString()));
      }

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lectureId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/complete-lecture",
        { lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCompletedLectures(prev => [...prev, lectureId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWatchNow = (lectureId, videoID, libraryID) => {
    setSelectedVideo("");
    const cleanVideoID = videoID ? videoID.trim() : null;
    const cleanLibID = libraryID ? libraryID.toString().trim() : "592909";

    if (!cleanVideoID) {
      alert("Error: Video ID missing.");
      return;
    }

    const finalUrl = `https://iframe.mediadelivery.net/embed/${cleanLibID}/${cleanVideoID}?autoplay=true`;
    setSelectedVideo(finalUrl);

    axios.post(
      "http://localhost:5000/api/students/update-access",
      { lectureId },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch(e => console.error(e));
  };

  const handleOpenMaterials = async (lectureId, title) => {
    setFetchingFiles(true);
    setActiveLectureTitle(title);
    setShowMaterials(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/materials/${lectureId}`);
      setCurrentMaterials(res.data.success ? res.data.materials : []);
    } catch (err) {
      setCurrentMaterials([]);
    } finally {
      setFetchingFiles(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
        <p className="text-slate-500 font-bold">Loading lectures...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
          <div className="w-2 h-10 bg-emerald-600 rounded-full"></div>
          <h2 className="text-3xl font-black text-slate-800">
            My Lectures <span className="text-emerald-600">({lectures.length})</span>
          </h2>
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[32px] border border-slate-200 shadow-sm">
            <VideoOff size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 text-xl font-bold">No lectures available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lectures.map((lecture) => {

              const isCompleted = completedLectures.some(id => id.toString() === lecture._id.toString());
              console.log(isCompleted)
              return (
                <div
                  key={lecture._id}
                  className={`bg-white rounded-[32px] border border-slate-200 transition-all duration-300 overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-md group ${isCompleted ? "bg-emerald-50/10" : "bg-white"
                    }`}
                >
                  {/* Thumbnail Area */}
                  <div
                    onClick={() => handleWatchNow(lecture._id, lecture.videoID, lecture.libraryID)}
                    className="aspect-video relative bg-slate-900 flex items-center justify-center cursor-pointer"
                  >
                    <Play size={44} className="text-white/30 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase">
                        <Calendar size={14} className="text-emerald-500" />
                        {/* Always showing the Actual Date */}
                        {lecture.createdAt || lecture.date
                          ? new Date(lecture.createdAt || lecture.date).toLocaleDateString("en-GB")
                          : "RECENT"}
                      </div>
                      {isCompleted && (
                        <div className="bg-[#f0fdf4] text-[#16a34a] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-[#bbf7d0] shadow-sm">
                          <CheckCircle size={14} strokeWidth={3} className="text-[#16a34a]" />
                          <span className="tracking-wider">COMPLETED</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-6 line-clamp-1">
                      {lecture.title}
                    </h3>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleWatchNow(lecture._id, lecture.videoID, lecture.libraryID)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-xs transition-colors shadow-sm"
                      >
                        WATCH NOW
                      </button>

                      <button
                        onClick={() => handleOpenMaterials(lecture._id, lecture.title)}
                        className="p-3 bg-slate-100 text-slate-600 rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <Download size={20} />
                      </button>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => handleMarkComplete(lecture._id)}
                        className="mt-4 w-full text-[10px] font-black text-slate-400 border border-slate-100 py-2 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-colors uppercase"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Materials Modal */}
      {showMaterials && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <h3 className="font-black text-xl">Study Materials</h3>
              <button onClick={() => setShowMaterials(false)} className="hover:bg-white/20 p-1 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto text-slate-800">
              {fetchingFiles ? (
                <div className="text-center py-10 font-bold text-slate-400 italic">Fetching files...</div>
              ) : currentMaterials.length === 0 ? (
                <p className="text-center text-slate-400 py-10 font-medium">No materials found for this lecture.</p>
              ) : (
                currentMaterials.map(file => (
                  <div key={file._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-emerald-600" />
                      <span className="text-sm font-bold text-slate-700">{file.title}</span>
                    </div>
                    <a
                      href={`http://localhost:5000/api/materials/download/${file._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-emerald-600 hover:bg-white rounded-xl transition-colors shadow-sm"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center">
          <button
            onClick={() => setSelectedVideo("")}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X size={36} />
          </button>
          <div className="w-full max-w-5xl aspect-video px-4">
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-2xl bg-black"
              allow="autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen
              title="Player"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLectures;


