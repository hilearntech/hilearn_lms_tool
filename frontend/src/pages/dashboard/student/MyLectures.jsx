// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import {
//   Play,
//   Loader2,
//   VideoOff,
//   X,
//   FileText,
//   Download,
//   CheckCircle,
//   Calendar,
// } from "lucide-react";

// const MyLectures = () => {
//   const [lectures, setLectures] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedVideo, setSelectedVideo] = useState("");
//   const [completedLectures, setCompletedLectures] = useState([]);

//   const [showMaterials, setShowMaterials] = useState(false);
//   const [currentMaterials, setCurrentMaterials] = useState([]);
//   const [activeLectureTitle, setActiveLectureTitle] = useState("");
//   const [fetchingFiles, setFetchingFiles] = useState(false);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchData();

//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       if (!token) return;

//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/lectures", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.success) {
//         setLectures(res.data.lectures.filter(l => l.lectureType?.toLowerCase() === "video"));
//       }

//       const dashRes = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/dashboard", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (dashRes.data.success) {
//         const completedFromBackend = dashRes.data.completedList || [];
//         setCompletedLectures(completedFromBackend.map(id => id.toString()));
//       }

//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkComplete = async (lectureId) => {
//     try {
//       const res = await axios.post(
//         "https://hilearnlmstool-production.up.railway.app/api/students/complete-lecture",
//         { lectureId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.success) {
//         setCompletedLectures(prev => [...prev, lectureId]);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleWatchNow = (lectureId, videoID, libraryID) => {
//     setSelectedVideo("");
//     const cleanVideoID = videoID ? videoID.trim() : null;
//     const cleanLibID = libraryID ? libraryID.toString().trim() : "592909";

//     if (!cleanVideoID) {
//       alert("Error: Video ID missing.");
//       return;
//     }

//     const finalUrl = `https://iframe.mediadelivery.net/embed/${cleanLibID}/${cleanVideoID}?autoplay=true`;
//     setSelectedVideo(finalUrl);

//     axios.post(
//       "https://hilearnlmstool-production.up.railway.app/api/students/update-access",
//       { lectureId },
//       { headers: { Authorization: `Bearer ${token}` } }
//     ).catch(e => console.error(e));
//   };

//   const handleOpenMaterials = async (lectureId, title) => {
//     setFetchingFiles(true);
//     setActiveLectureTitle(title);
//     setShowMaterials(true);
//     try {
//       const res = await axios.get(`https://hilearnlmstool-production.up.railway.app/api/materials/${lectureId}`);
//       setCurrentMaterials(res.data.success ? res.data.materials : []);
//     } catch (err) {
//       setCurrentMaterials([]);
//     } finally {
//       setFetchingFiles(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-white">
//         <Loader2 className="animate-spin text-emerald-600 mb-4" size={40} />
//         <p className="text-slate-500 font-bold">Loading lectures...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-slate-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">

//         {/* Header Section */}
//         <div className="flex items-center gap-4 mb-10 border-b border-slate-200 pb-6">
//           <div className="w-2 h-10 bg-emerald-600 rounded-full"></div>
//           <h2 className="text-3xl font-black text-slate-800">
//             My Lectures <span className="text-emerald-600">({lectures.length})</span>
//           </h2>
//         </div>

//         {lectures.length === 0 ? (
//           <div className="text-center py-32 bg-white rounded-[32px] border border-slate-200 shadow-sm">
//             <VideoOff size={64} className="mx-auto text-slate-200 mb-4" />
//             <p className="text-slate-500 text-xl font-bold">No lectures available.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {lectures.map((lecture) => {

//               const isCompleted = completedLectures.some(id => id.toString() === lecture._id.toString());
//               console.log(isCompleted)
//               return (
//                 <div
//                   key={lecture._id}
//                   className={`bg-white rounded-[32px] border border-slate-200 transition-all duration-300 overflow-hidden shadow-sm hover:-translate-y-1.5 hover:shadow-md group ${isCompleted ? "bg-emerald-50/10" : "bg-white"
//                     }`}
//                 >
//                   {/* Thumbnail Area */}
//                   <div
//                     onClick={() => handleWatchNow(lecture._id, lecture.videoID, lecture.libraryID)}
//                     className="aspect-video relative bg-slate-900 flex items-center justify-center cursor-pointer"
//                   >
//                     <Play size={44} className="text-white/30 z-10" />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//                   </div>

//                   <div className="p-6">
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase">
//                         <Calendar size={14} className="text-emerald-500" />
//                         {/* Always showing the Actual Date */}
//                         {lecture.createdAt || lecture.date
//                           ? new Date(lecture.createdAt || lecture.date).toLocaleDateString("en-GB")
//                           : "RECENT"}
//                       </div>
//                       {isCompleted && (
//                         <div className="bg-[#f0fdf4] text-[#16a34a] px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-[#bbf7d0] shadow-sm">
//                           <CheckCircle size={14} strokeWidth={3} className="text-[#16a34a]" />
//                           <span className="tracking-wider">COMPLETED</span>
//                         </div>
//                       )}
//                     </div>

//                     <h3 className="font-bold text-slate-800 text-lg mb-6 line-clamp-1">
//                       {lecture.title}
//                     </h3>

//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => handleWatchNow(lecture._id, lecture.videoID, lecture.libraryID)}
//                         className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-black text-xs transition-colors shadow-sm"
//                       >
//                         WATCH NOW
//                       </button>

//                       <button
//                         onClick={() => handleOpenMaterials(lecture._id, lecture.title)}
//                         className="p-3 bg-slate-100 text-slate-600 rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
//                       >
//                         <Download size={20} />
//                       </button>
//                     </div>

//                     {!isCompleted && (
//                       <button
//                         onClick={() => handleMarkComplete(lecture._id)}
//                         className="mt-4 w-full text-[10px] font-black text-slate-400 border border-slate-100 py-2 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-colors uppercase"
//                       >
//                         Mark Completed
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Materials Modal */}
//       {showMaterials && (
//         <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4 backdrop-blur-[2px]">
//           <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
//             <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
//               <h3 className="font-black text-xl">Study Materials</h3>
//               <button onClick={() => setShowMaterials(false)} className="hover:bg-white/20 p-1 rounded-lg">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto text-slate-800">
//               {fetchingFiles ? (
//                 <div className="text-center py-10 font-bold text-slate-400 italic">Fetching files...</div>
//               ) : currentMaterials.length === 0 ? (
//                 <p className="text-center text-slate-400 py-10 font-medium">No materials found for this lecture.</p>
//               ) : (
//                 currentMaterials.map(file => (
//                   <div key={file._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
//                     <div className="flex items-center gap-3">
//                       <FileText size={18} className="text-emerald-600" />
//                       <span className="text-sm font-bold text-slate-700">{file.title}</span>
//                     </div>
//                     <a
//                       href={`https://hilearnlmstool-production.up.railway.app/api/materials/download/${file._id}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 text-emerald-600 hover:bg-white rounded-xl transition-colors shadow-sm"
//                     >
//                       <Download size={18} />
//                     </a>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Video Modal */}
//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center">
//           <button
//             onClick={() => setSelectedVideo("")}
//             className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
//           >
//             <X size={36} />
//           </button>
//           <div className="w-full max-w-5xl aspect-video px-4">
//             <iframe
//               src={selectedVideo}
//               className="w-full h-full rounded-2xl bg-black"
//               allow="autoplay;encrypted-media;picture-in-picture;"
//               allowFullScreen
//               title="Player"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// 
     // {showTranscribe && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-blue-600 p-4 text-white flex justify-between"><h3 className="font-bold">Transcription</h3><button onClick={() => setShowTranscribe(false)}><X size={22} /></button></div><div className="p-4 space-y-4"><input type="text" className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="YouTube URL" value={transcribeUrl} onChange={(e) => setTranscribeUrl(e.target.value)} />{transcribeResult && (<div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm">{transcribeResult}</p></div>)}</div><div className="border-t p-4"><button onClick={handleTranscribe} disabled={isTranscribing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isTranscribing ? "Transcribing..." : "Transcribe"}</button></div></div></div>)}
      //{showSummary && selectedLectureForSummary && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-orange-600 p-4 text-white flex justify-between"><h3 className="font-bold">{selectedLectureForSummary.title}</h3><button onClick={() => setShowSummary(false)}><X size={22} /></button></div><div className="p-4">{isSummarizing ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : <div className="p-4 bg-orange-50"><p className="text-sm">{summaryResult}</p></div>}</div></div></div>)}


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
  Brain,
  Send,
  Zap,
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
  const [showQA, setShowQA] = useState(false);
  const [selectedLectureForQA, setSelectedLectureForQA] = useState(null);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [showTranscribe, setShowTranscribe] = useState(false);
  const [transcribeUrl, setTranscribeUrl] = useState("");
  const [transcribeResult, setTranscribeResult] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedLectureForSummary, setSelectedLectureForSummary] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) return;

      const res = await axios.get(
        "https://hilearnlmstool-production.up.railway.app/api/students/lectures",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setLectures(
          res.data.lectures.filter(
            (l) => l.lectureType?.toLowerCase() === "video",
          ),
        );
      }

      const dashRes = await axios.get(
        "https://hilearnlmstool-production.up.railway.app/api/students/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (dashRes.data.success) {
        const completedFromBackend = dashRes.data.completedList || [];
        setCompletedLectures(completedFromBackend.map((id) => id.toString()));
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
        "https://hilearnlmstool-production.up.railway.app/api/students/complete-lecture",
        { lectureId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setCompletedLectures((prev) => [...prev, lectureId]);
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

    axios
      .post(
        "https://hilearnlmstool-production.up.railway.app/api/students/update-access",
        { lectureId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .catch((e) => console.error(e));
  };

  const handleOpenMaterials = async (lectureId, title) => {
    setFetchingFiles(true);
    setActiveLectureTitle(title);
    setShowMaterials(true);
    try {
      const res = await axios.get(
        `https://hilearnlmstool-production.up.railway.app/api/materials/${lectureId}`,
      );
      setCurrentMaterials(res.data.success ? res.data.materials : []);
    } catch (err) {
      setCurrentMaterials([]);
    } finally {
      setFetchingFiles(false);
    }
  };
  const askQuestionAboutLecture = async () => {
    if (!qaQuestion.trim()) return;
    setIsAsking(true);
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RAG-Key": "rag-secret-key-change-in-prod",
        },
        body: JSON.stringify({
          lecture_id: selectedLectureForQA?._id,
          question: qaQuestion,
        }),
      });
      const data = await res.json();
      setQaAnswer(
        data.answer || "No answer found. Lecture may not be indexed yet.",
      );
    } catch (err) {
      setQaAnswer("Error getting answer. Please try again.");
    } finally {
      setIsAsking(false);
    }
  };


  const handleTranscribe = async () => {
    if (!transcribeUrl.trim()) return alert("Enter YouTube URL");
    setIsTranscribing(true);
    try {
      const res = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-RAG-Key": "rag-secret-key-change-in-prod" },
        body: JSON.stringify({ youtube_url: transcribeUrl })
      });
      const data = await res.json();
      setTranscribeResult(data.transcript || "Transcription failed");
    } catch (err) {
      setTranscribeResult("Error transcribing");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSummarize = async (lecture) => {
    setSelectedLectureForSummary(lecture);
    setShowSummary(true);
    setIsSummarizing(true);
    try {
      const res = await fetch("http://localhost:8000/summary/" + lecture._id, {
        method: "GET",
        headers: { "X-RAG-Key": "rag-secret-key-change-in-prod" }
      });
      const data = await res.json();
      setSummaryResult(data.summary || "No summary");
    } catch (err) {
      setSummaryResult("Error generating summary");
    } finally {
      setIsSummarizing(false);
    }
  };
  const openQAModal = (lecture) => {
    setSelectedLectureForQA(lecture);
    setQaQuestion("");
    setQaAnswer("");
    setShowQA(true);
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
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10 border-b border-slate-200 pb-4 sm:pb-6">
          <div className="w-2 h-8 sm:h-10 bg-emerald-600 rounded-full"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
            My Lectures
            <span className="text-emerald-600"> ({lectures.length})</span>
          </h2>
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 shadow-sm">
            <VideoOff
              size={48}
              className="mx-auto text-slate-200 mb-4 sm:w-16 sm:h-16"
            />
            <p className="text-slate-500 text-base sm:text-xl font-bold">
              No lectures available.
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {lectures.map((lecture) => {
              const isCompleted = completedLectures.some(
                (id) => id.toString() === lecture._id.toString(),
              );

              return (
                <div
                  key={lecture._id}
                  className={`bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 transition-all duration-300 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md group ${
                    isCompleted ? "bg-emerald-50/10" : "bg-white"
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() =>
                      handleWatchNow(
                        lecture._id,
                        lecture.videoID,
                        lecture.libraryID,
                      )
                    }
                    className="aspect-video relative bg-slate-900 flex items-center justify-center cursor-pointer"
                  >
                    <Play
                      size={36}
                      className="text-white/30 z-10 sm:w-11 sm:h-11"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Top Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 font-black uppercase">
                        <Calendar
                          size={12}
                          className="text-emerald-500 sm:w-3.5 sm:h-3.5"
                        />
                        {lecture.createdAt || lecture.date
                          ? new Date(
                              lecture.createdAt || lecture.date,
                            ).toLocaleDateString("en-GB")
                          : "RECENT"}
                      </div>

                      {isCompleted && (
                        <div className="bg-[#f0fdf4] text-[#16a34a] px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center gap-1 border border-[#bbf7d0] shadow-sm w-fit">
                          <CheckCircle size={12} />
                          <span>COMPLETED</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-2">
                      {lecture.title}
                    </h3>

                    {/* Buttons */}
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          handleWatchNow(
                            lecture._id,
                            lecture.videoID,
                            lecture.libraryID,
                          )
                        }
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs transition-colors shadow-sm"
                      >
                        WATCH NOW
                      </button>

                      <button
                        onClick={() =>
                          handleOpenMaterials(lecture._id, lecture.title)
                        }
                        className="p-2.5 sm:p-3 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      >
                        <Download size={16} className="sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => openQAModal(lecture)}
                        className="p-2.5 bg-purple-100 text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
                        title="Ask AI about this lecture"
                      >
                        <Brain size={16} />
                      </button>
                      <button
                        onClick={() => handleSummarize(lecture)}
                        className="p-2.5 bg-orange-100 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-50 transition-colors"
                        title="Summarize this lecture"
                      >
                        <Zap size={16} />
                      </button>
                    </div>

                    {/* Mark Complete */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleMarkComplete(lecture._id)}
                        className="mt-3 sm:mt-4 w-full text-[9px] sm:text-[10px] font-black text-slate-400 border border-slate-100 py-2 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-colors uppercase"
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
      {showQA && selectedLectureForQA && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain size={20} />
                <h3 className="font-bold text-lg">AI Q&A Assistant</h3>
              </div>
              <button onClick={() => setShowQA(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <textarea
                className="w-full p-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 outline-none resize-none text-sm"
                placeholder="Ask anything about this lecture..."
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                rows={3}
              />
              {qaAnswer && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {qaAnswer}
                  </p>
                </div>
              )}
            </div>
            <div className="border-t p-4">
              <button
                onClick={askQuestionAboutLecture}
                disabled={isAsking || !qaQuestion.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
              >
                {isAsking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Asking...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Ask AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MATERIAL MODAL */}
      {showMaterials && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center">
              <h3 className="font-black text-lg sm:text-xl">Study Materials</h3>
              <button onClick={() => setShowMaterials(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 max-h-[400px] overflow-y-auto text-slate-800">
              {/* same content */}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={() => setSelectedVideo("")}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white"
          >
            <X size={28} className="sm:w-9 sm:h-9" />
          </button>

          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-xl sm:rounded-2xl bg-black"
              allow="autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen
            />
          </div>
        </div>
      )}
        {/* TRANSCRIBE MODAL */}
      {showTranscribe && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-blue-600 p-4 text-white flex justify-between"><h3 className="font-bold">Transcription</h3><button onClick={() => setShowTranscribe(false)}><X size={22} /></button></div><div className="p-4 space-y-4"><input type="text" className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="YouTube URL" value={transcribeUrl} onChange={(e) => setTranscribeUrl(e.target.value)} />{transcribeResult && (<div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm">{transcribeResult}</p></div>)}</div><div className="border-t p-4"><button onClick={handleTranscribe} disabled={isTranscribing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isTranscribing ? "Transcribing..." : "Transcribe"}</button></div></div></div>)}

      {/* SUMMARY MODAL */}
      {showSummary && selectedLectureForSummary && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-orange-600 p-4 text-white flex justify-between"><h3 className="font-bold">{selectedLectureForSummary.title}</h3><button onClick={() => setShowSummary(false)}><X size={22} /></button></div><div className="p-4">{isSummarizing ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : <div className="p-4 bg-orange-50"><p className="text-sm">{summaryResult}</p></div>}</div></div></div>)}
    </div>
  );
};


    //  {showTranscribe && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-blue-600 p-4 text-white flex justify-between"><h3 className="font-bold">Transcription</h3><button onClick={() => setShowTranscribe(false)}><X size={22} /></button></div><div className="p-4 space-y-4"><input type="text" className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="YouTube URL" value={transcribeUrl} onChange={(e) => setTranscribeUrl(e.target.value)} />{transcribeResult && (<div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm">{transcribeResult}</p></div>)}</div><div className="border-t p-4"><button onClick={handleTranscribe} disabled={isTranscribing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isTranscribing ? "Transcribing..." : "Transcribe"}</button></div></div></div>)}
      //{showSummary && selectedLectureForSummary && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-orange-600 p-4 text-white flex justify-between"><h3 className="font-bold">{selectedLectureForSummary.title}</h3><button onClick={() => setShowSummary(false)}><X size={22} /></button></div><div className="p-4">{isSummarizing ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : <div className="p-4 bg-orange-50"><p className="text-sm">{summaryResult}</p></div>}</div></div></div>)}

export default MyLectures;
