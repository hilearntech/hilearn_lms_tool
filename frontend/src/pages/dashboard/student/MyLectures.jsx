
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
//   Brain,
//   Send,
//   Zap,
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
//   const [showQA, setShowQA] = useState(false);
//   const [selectedLectureForQA, setSelectedLectureForQA] = useState(null);
//   const [qaQuestion, setQaQuestion] = useState("");
//   const [qaAnswer, setQaAnswer] = useState("");
//   const [isAsking, setIsAsking] = useState(false);
//   const [showTranscribe, setShowTranscribe] = useState(false);
//   const [transcribeUrl, setTranscribeUrl] = useState("");
//   const [transcribeResult, setTranscribeResult] = useState("");
//   const [isTranscribing, setIsTranscribing] = useState(false);
//   const [showSummary, setShowSummary] = useState(false);
//   const [summaryResult, setSummaryResult] = useState("");
//   const [isSummarizing, setIsSummarizing] = useState(false);
//   const [selectedLectureForSummary, setSelectedLectureForSummary] = useState(null);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       if (!token) return;

//       const res = await axios.get(
//         "https://hilearnlmstool-production.up.railway.app/api/students/lectures",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       if (res.data.success) {
//         setLectures(
//           res.data.lectures.filter(
//             (l) => l.lectureType?.toLowerCase() === "video",
//           ),
//         );
//       }

//       const dashRes = await axios.get(
//         "https://hilearnlmstool-production.up.railway.app/api/students/dashboard",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       if (dashRes.data.success) {
//         const completedFromBackend = dashRes.data.completedList || [];
//         setCompletedLectures(completedFromBackend.map((id) => id.toString()));
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
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       if (res.data.success) {
//         setCompletedLectures((prev) => [...prev, lectureId]);
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

//     axios
//       .post(
//         "https://hilearnlmstool-production.up.railway.app/api/students/update-access",
//         { lectureId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       )
//       .catch((e) => console.error(e));
//   };

//   const handleOpenMaterials = async (lectureId, title) => {
//     setFetchingFiles(true);
//     setActiveLectureTitle(title);
//     setShowMaterials(true);
//     try {
//       const res = await axios.get(
//         `https://hilearnlmstool-production.up.railway.app/api/materials/${lectureId}`,
//       );
//       setCurrentMaterials(res.data.success ? res.data.materials : []);
//     } catch (err) {
//       setCurrentMaterials([]);
//     } finally {
//       setFetchingFiles(false);
//     }
//   };
//   const askQuestionAboutLecture = async () => {
//     if (!qaQuestion.trim()) return;
//     setIsAsking(true);
//     try {
//       const res = await fetch("http://localhost:8000/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-RAG-Key": "rag-secret-key-change-in-prod",
//         },
//         body: JSON.stringify({
//           lecture_id: selectedLectureForQA?._id,
//           question: qaQuestion,
//         }),
//       });
//       const data = await res.json();
//       setQaAnswer(
//         data.answer || "No answer found. Lecture may not be indexed yet.",
//       );
//     } catch (err) {
//       setQaAnswer("Error getting answer. Please try again.");
//     } finally {
//       setIsAsking(false);
//     }
//   };


//   const handleTranscribe = async () => {
//     if (!transcribeUrl.trim()) return alert("Enter YouTube URL");
//     setIsTranscribing(true);
//     try {
//       const res = await fetch("http://localhost:8000/transcribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "X-RAG-Key": "rag-secret-key-change-in-prod" },
//         body: JSON.stringify({ youtube_url: transcribeUrl })
//       });
//       const data = await res.json();
//       setTranscribeResult(data.transcript || "Transcription failed");
//     } catch (err) {
//       setTranscribeResult("Error transcribing");
//     } finally {
//       setIsTranscribing(false);
//     }
//   };

//   const handleSummarize = async (lecture) => {
//     setSelectedLectureForSummary(lecture);
//     setShowSummary(true);
//     setIsSummarizing(true);
//     try {
//       const res = await fetch("http://localhost:8000/summary/" + lecture._id, {
//         method: "GET",
//         headers: { "X-RAG-Key": "rag-secret-key-change-in-prod" }
//       });
//       const data = await res.json();
//       setSummaryResult(data.summary || "No summary");
//     } catch (err) {
//       setSummaryResult("Error generating summary");
//     } finally {
//       setIsSummarizing(false);
//     }
//   };
//   const openQAModal = (lecture) => {
//     setSelectedLectureForQA(lecture);
//     setQaQuestion("");
//     setQaAnswer("");
//     setShowQA(true);
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
//     <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10 border-b border-slate-200 pb-4 sm:pb-6">
//           <div className="w-2 h-8 sm:h-10 bg-emerald-600 rounded-full"></div>
//           <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
//             My Lectures
//             <span className="text-emerald-600"> ({lectures.length})</span>
//           </h2>
//         </div>

//         {lectures.length === 0 ? (
//           <div className="text-center py-20 sm:py-32 bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 shadow-sm">
//             <VideoOff
//               size={48}
//               className="mx-auto text-slate-200 mb-4 sm:w-16 sm:h-16"
//             />
//             <p className="text-slate-500 text-base sm:text-xl font-bold">
//               No lectures available.
//             </p>
//           </div>
//         ) : (
//           /* Grid */
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
//             {lectures.map((lecture) => {
//               const isCompleted = completedLectures.some(
//                 (id) => id.toString() === lecture._id.toString(),
//               );

//               return (
//                 <div
//                   key={lecture._id}
//                   className={`bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 transition-all duration-300 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md group ${
//                     isCompleted ? "bg-emerald-50/10" : "bg-white"
//                   }`}
//                 >
//                   {/* Thumbnail */}
//                   <div
//                     onClick={() =>
//                       handleWatchNow(
//                         lecture._id,
//                         lecture.videoID,
//                         lecture.libraryID,
//                       )
//                     }
//                     className="aspect-video relative bg-slate-900 flex items-center justify-center cursor-pointer"
//                   >
//                     <Play
//                       size={36}
//                       className="text-white/30 z-10 sm:w-11 sm:h-11"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//                   </div>

//                   <div className="p-4 sm:p-6">
//                     {/* Top Info */}
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
//                       <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 font-black uppercase">
//                         <Calendar
//                           size={12}
//                           className="text-emerald-500 sm:w-3.5 sm:h-3.5"
//                         />
//                         {lecture.createdAt || lecture.date
//                           ? new Date(
//                               lecture.createdAt || lecture.date,
//                             ).toLocaleDateString("en-GB")
//                           : "RECENT"}
//                       </div>

//                       {isCompleted && (
//                         <div className="bg-[#f0fdf4] text-[#16a34a] px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold flex items-center gap-1 border border-[#bbf7d0] shadow-sm w-fit">
//                           <CheckCircle size={12} />
//                           <span>COMPLETED</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Title */}
//                     <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-4 sm:mb-6 line-clamp-2">
//                       {lecture.title}
//                     </h3>

//                     {/* Buttons */}
//                     <div className="flex gap-2 sm:gap-3">
//                       <button
//                         onClick={() =>
//                           handleWatchNow(
//                             lecture._id,
//                             lecture.videoID,
//                             lecture.libraryID,
//                           )
//                         }
//                         className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs transition-colors shadow-sm"
//                       >
//                         WATCH NOW
//                       </button>

//                       <button
//                         onClick={() =>
//                           handleOpenMaterials(lecture._id, lecture.title)
//                         }
//                         className="p-2.5 sm:p-3 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
//                       >
//                         <Download size={16} className="sm:w-5 sm:h-5" />
//                       </button>
//                       <button
//                         onClick={() => openQAModal(lecture)}
//                         className="p-2.5 bg-purple-100 text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
//                         title="Ask AI about this lecture"
//                       >
//                         <Brain size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleSummarize(lecture)}
//                         className="p-2.5 bg-orange-100 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-50 transition-colors"
//                         title="Summarize this lecture"
//                       >
//                         <Zap size={16} />
//                       </button>
//                     </div>

//                     {/* Mark Complete */}
//                     {!isCompleted && (
//                       <button
//                         onClick={() => handleMarkComplete(lecture._id)}
//                         className="mt-3 sm:mt-4 w-full text-[9px] sm:text-[10px] font-black text-slate-400 border border-slate-100 py-2 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-colors uppercase"
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
//       {showQA && selectedLectureForQA && (
//         <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
//             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <Brain size={20} />
//                 <h3 className="font-bold text-lg">AI Q&A Assistant</h3>
//               </div>
//               <button onClick={() => setShowQA(false)}>
//                 <X size={22} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               <textarea
//                 className="w-full p-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 outline-none resize-none text-sm"
//                 placeholder="Ask anything about this lecture..."
//                 value={qaQuestion}
//                 onChange={(e) => setQaQuestion(e.target.value)}
//                 rows={3}
//               />
//               {qaAnswer && (
//                 <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
//                   <p className="text-slate-700 text-sm leading-relaxed">
//                     {qaAnswer}
//                   </p>
//                 </div>
//               )}
//             </div>
//             <div className="border-t p-4">
//               <button
//                 onClick={askQuestionAboutLecture}
//                 disabled={isAsking || !qaQuestion.trim()}
//                 className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm"
//               >
//                 {isAsking ? (
//                   <>
//                     <Loader2 size={16} className="animate-spin" />
//                     Asking...
//                   </>
//                 ) : (
//                   <>
//                     <Send size={16} />
//                     Ask AI
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MATERIAL MODAL */}
//       {showMaterials && (
//         <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
//           <div className="bg-white w-full max-w-md rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl">
//             <div className="bg-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center">
//               <h3 className="font-black text-lg sm:text-xl">Study Materials</h3>
//               <button onClick={() => setShowMaterials(false)}>
//                 <X size={22} />
//               </button>
//             </div>

//             <div className="p-4 sm:p-6 space-y-3 max-h-[400px] overflow-y-auto text-slate-800">
//               {/* same content */}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* VIDEO MODAL */}
//       {selectedVideo && (
//         <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 sm:p-4">
//           <button
//             onClick={() => setSelectedVideo("")}
//             className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white"
//           >
//             <X size={28} className="sm:w-9 sm:h-9" />
//           </button>

//           <div className="w-full max-w-5xl aspect-video">
//             <iframe
//               src={selectedVideo}
//               className="w-full h-full rounded-xl sm:rounded-2xl bg-black"
//               allow="autoplay;encrypted-media;picture-in-picture;"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       )}
//         {/* TRANSCRIBE MODAL */}
//       {showTranscribe && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-blue-600 p-4 text-white flex justify-between"><h3 className="font-bold">Transcription</h3><button onClick={() => setShowTranscribe(false)}><X size={22} /></button></div><div className="p-4 space-y-4"><input type="text" className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="YouTube URL" value={transcribeUrl} onChange={(e) => setTranscribeUrl(e.target.value)} />{transcribeResult && (<div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm">{transcribeResult}</p></div>)}</div><div className="border-t p-4"><button onClick={handleTranscribe} disabled={isTranscribing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isTranscribing ? "Transcribing..." : "Transcribe"}</button></div></div></div>)}

//       {/* SUMMARY MODAL */}
//       {showSummary && selectedLectureForSummary && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-orange-600 p-4 text-white flex justify-between"><h3 className="font-bold">{selectedLectureForSummary.title}</h3><button onClick={() => setShowSummary(false)}><X size={22} /></button></div><div className="p-4">{isSummarizing ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : <div className="p-4 bg-orange-50"><p className="text-sm">{summaryResult}</p></div>}</div></div></div>)}
//     </div>
//   );
// };


//     //  {showTranscribe && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-blue-600 p-4 text-white flex justify-between"><h3 className="font-bold">Transcription</h3><button onClick={() => setShowTranscribe(false)}><X size={22} /></button></div><div className="p-4 space-y-4"><input type="text" className="w-full p-3 border-2 border-blue-100 rounded-xl focus:border-blue-500 outline-none text-sm" placeholder="YouTube URL" value={transcribeUrl} onChange={(e) => setTranscribeUrl(e.target.value)} />{transcribeResult && (<div className="p-4 bg-blue-50 rounded-xl"><p className="text-sm">{transcribeResult}</p></div>)}</div><div className="border-t p-4"><button onClick={handleTranscribe} disabled={isTranscribing} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">{isTranscribing ? "Transcribing..." : "Transcribe"}</button></div></div></div>)}
//       //{showSummary && selectedLectureForSummary && (<div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"><div className="bg-orange-600 p-4 text-white flex justify-between"><h3 className="font-bold">{selectedLectureForSummary.title}</h3><button onClick={() => setShowSummary(false)}><X size={22} /></button></div><div className="p-4">{isSummarizing ? <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div> : <div className="p-4 bg-orange-50"><p className="text-sm">{summaryResult}</p></div>}</div></div></div>)}

// export default MyLectures;


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
  Database,
} from "lucide-react";

const RAG_BASE = import.meta.env.VITE_RAG_URL || "http://localhost:8000";
const RAG_KEY = "rag-secret-key-change-in-prod";

const ragHeaders = {
  "Content-Type": "application/json",
  "X-RAG-Key": RAG_KEY,
};

const MyLectures = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [completedLectures, setCompletedLectures] = useState([]);

  // Materials
  const [showMaterials, setShowMaterials] = useState(false);
  const [currentMaterials, setCurrentMaterials] = useState([]);
  const [activeLectureTitle, setActiveLectureTitle] = useState("");
  const [fetchingFiles, setFetchingFiles] = useState(false);

  // Q&A
  const [showQA, setShowQA] = useState(false);
  const [selectedLectureForQA, setSelectedLectureForQA] = useState(null);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

  // Summary
  const [showSummary, setShowSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [selectedLectureForSummary, setSelectedLectureForSummary] = useState(null);

  // Index
  const [indexingId, setIndexingId] = useState(null);
  const [indexedIds, setIndexedIds] = useState([]);

  // Transcribe (ADDED)
  const [showTranscribe, setShowTranscribe] = useState(false);
  const [transcribeUrl, setTranscribeUrl] = useState("");
  const [transcribeResult, setTranscribeResult] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

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
        { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (dashRes.data.success) {
        setCompletedLectures(
          (dashRes.data.completedList || []).map((id) => id.toString()),
        );
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
        setCompletedLectures((prev) => [...prev, lectureId.toString()]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWatchNow = (lectureId, videoID, libraryID) => {
    const cleanVideoID = videoID?.trim();
    const cleanLibID = libraryID?.toString().trim() || "592909";
    if (!cleanVideoID) {
      alert("Error: Video ID missing.");
      return;
    }
    setSelectedVideo(
      `https://iframe.mediadelivery.net/embed/${cleanLibID}/${cleanVideoID}?autoplay=true`,
    );
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
    } catch {
      setCurrentMaterials([]);
    } finally {
      setFetchingFiles(false);
    }
  };

  // ── INDEX ─────────────────────────────────────────────────────────────────
  const handleIndexLecture = async (lecture) => {
    const text =
      lecture.transcript ||
      lecture.transcription ||
      lecture.description ||
      lecture.content ||
      lecture.body ||
      lecture.notes ||
      lecture.summary ||
      "";

    setIndexingId(lecture._id);
    try {
      let finalText = text.trim();

      if (!finalText) {
        const seedRes = await fetch(`${RAG_BASE}/generate-seed`, {
          method: "POST",
          headers: ragHeaders,
          body: JSON.stringify({ title: lecture.title }),
        });

        if (seedRes.ok) {
          const seedData = await seedRes.json();
          finalText = seedData.content || "";
        }

        if (!finalText) {
          const groqRes = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY || "",
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 1024,
              messages: [
                {
                  role: "user",
                  content: `Generate detailed educational content about: "${lecture.title}". Cover key concepts, definitions, and examples in 3-4 paragraphs.`,
                },
              ],
            }),
          });
          if (groqRes.ok) {
            const groqData = await groqRes.json();
            finalText = groqData.content?.[0]?.text || "";
          }
        }
      }

      if (!finalText) {
        alert("Could not find or generate content for this lecture.");
        return;
      }

      const res = await fetch(`${RAG_BASE}/index-text`, {
        method: "POST",
        headers: ragHeaders,
        body: JSON.stringify({
          lecture_id: lecture._id,
          title: lecture.title,
          text: finalText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Index failed");
      setIndexedIds((prev) => [...prev, lecture._id]);
      alert(`✅ Indexed successfully. You can now Ask AI or Summarize.`);
    } catch (err) {
      console.error("Index error:", err);
      alert(`Index error: ${err.message}`);
    } finally {
      setIndexingId(null);
    }
  };

  // ── Q&A ───────────────────────────────────────────────────────────────────
  const openQAModal = (lecture) => {
    setSelectedLectureForQA(lecture);
    setQaQuestion("");
    setQaAnswer("");
    setShowQA(true);
  };

  const askQuestionAboutLecture = async () => {
    if (!qaQuestion.trim()) return;
    if (!selectedLectureForQA?._id) {
      setQaAnswer("Error: No lecture selected.");
      return;
    }
    setIsAsking(true);
    setQaAnswer("");
    try {
      const res = await fetch(`${RAG_BASE}/ask`, {
        method: "POST",
        headers: ragHeaders,
        body: JSON.stringify({
          lecture_id: selectedLectureForQA._id,
          question: qaQuestion,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setQaAnswer(`Error: ${data.detail || "Something went wrong."}`);
        return;
      }
      setQaAnswer(data.answer || "No answer found.");
    } catch (err) {
      console.error("RAG Q&A error:", err);
      setQaAnswer("Network error. Make sure RAG server is running.");
    } finally {
      setIsAsking(false);
    }
  };

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  const handleSummarize = async (lecture) => {
    setSelectedLectureForSummary(lecture);
    setSummaryResult("");
    setShowSummary(true);
    setIsSummarizing(true);
    try {
      const res = await fetch(`${RAG_BASE}/summary/${lecture._id}`, {
        method: "GET",
        headers: { "X-RAG-Key": RAG_KEY },
      });
      const data = await res.json();
      if (!res.ok) {
        setSummaryResult(`Error: ${data.detail || "Something went wrong."}`);
        return;
      }
      setSummaryResult(data.summary || "No summary available.");
    } catch (err) {
      console.error("Summary error:", err);
      setSummaryResult("Network error. Make sure RAG server is running.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // ── TRANSCRIBE (ADDED) ─────────────────────────────────────────────────────
  const handleTranscribe = async () => {
    if (!transcribeUrl.trim()) {
      alert("Please enter a YouTube URL");
      return;
    }
    if (!selectedLectureForQA?._id) {
      alert("Please select a lecture first");
      return;
    }
    setIsTranscribing(true);
    setTranscribeResult("");
    try {
      const res = await fetch(`${RAG_BASE}/transcribe`, {
        method: "POST",
        headers: ragHeaders,
        body: JSON.stringify({
          lecture_id: selectedLectureForQA._id,
          title: selectedLectureForQA.title,
          video_url: transcribeUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Transcription failed");
      setTranscribeResult(data.transcript || "Transcription completed!");
      if (data.summary) {
        setTranscribeResult(prev => prev + "\n\n📝 Summary generated: " + data.summary.substring(0, 200) + "...");
      }
    } catch (err) {
      console.error("Transcribe error:", err);
      setTranscribeResult(`Error: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
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
          <div className="w-2 h-8 sm:h-10 bg-emerald-600 rounded-full" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
            My Lectures
            <span className="text-emerald-600"> ({lectures.length})</span>
          </h2>
        </div>

        {lectures.length === 0 ? (
          <div className="text-center py-20 sm:py-32 bg-white rounded-[32px] border border-slate-200 shadow-sm">
            <VideoOff size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 text-base sm:text-xl font-bold">
              No lectures available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {lectures.map((lecture) => {
              const isCompleted = completedLectures.some(
                (id) => id.toString() === lecture._id.toString(),
              );
              const isIndexed = indexedIds.includes(lecture._id);
              const isIndexing = indexingId === lecture._id;

              return (
                <div
                  key={lecture._id}
                  className={`bg-white rounded-[32px] border border-slate-200 transition-all duration-300 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md ${isCompleted ? "bg-emerald-50/10" : ""}`}
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
                    <Play size={36} className="text-white/30 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Date + Completed badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase">
                        <Calendar size={12} className="text-emerald-500" />
                        {lecture.createdAt || lecture.date
                          ? new Date(
                              lecture.createdAt || lecture.date,
                            ).toLocaleDateString("en-GB")
                          : "RECENT"}
                      </div>
                      {isCompleted && (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 border border-emerald-200">
                          <CheckCircle size={10} /> COMPLETED
                        </div>
                      )}
                      {isIndexed && (
                        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 border border-blue-200">
                          <Database size={10} /> INDEXED
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg mb-4 line-clamp-2">
                      {lecture.title}
                    </h3>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      {/* Watch */}
                      <button
                        onClick={() =>
                          handleWatchNow(
                            lecture._id,
                            lecture.videoID,
                            lecture.libraryID,
                          )
                        }
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-2xl font-black text-[10px] transition-colors shadow-sm"
                      >
                        WATCH NOW
                      </button>

                      {/* Materials */}
                      <button
                        onClick={() =>
                          handleOpenMaterials(lecture._id, lecture.title)
                        }
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-2xl border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        title="Study Materials"
                      >
                        <Download size={16} />
                      </button>

                      {/* Index */}
                      <button
                        onClick={() => handleIndexLecture(lecture)}
                        disabled={isIndexing}
                        className="p-2.5 bg-blue-100 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        title="Index lecture for AI features"
                      >
                        {isIndexing ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Database size={16} />
                        )}
                      </button>

                      {/* Ask AI */}
                      <button
                        onClick={() => openQAModal(lecture)}
                        className="p-2.5 bg-purple-100 text-purple-600 rounded-xl border border-purple-200 hover:bg-purple-50 transition-colors"
                        title="Ask AI about this lecture"
                      >
                        <Brain size={16} />
                      </button>

                      {/* Summarize */}
                      <button
                        onClick={() => handleSummarize(lecture)}
                        className="p-2.5 bg-orange-100 text-orange-600 rounded-xl border border-orange-200 hover:bg-orange-50 transition-colors"
                        title="Summarize this lecture"
                      >
                        <Zap size={16} />
                      </button>

                      {/* Transcribe (ADDED) */}
                      <button
                        onClick={() => {
                          setSelectedLectureForQA(lecture);
                          setShowTranscribe(true);
                        }}
                        className="p-2.5 bg-green-100 text-green-600 rounded-xl border border-green-200 hover:bg-green-50 transition-colors"
                        title="Transcribe YouTube video"
                      >
                        <FileText size={16} />
                      </button>
                    </div>

                    {/* Mark Complete */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleMarkComplete(lecture._id)}
                        className="mt-3 w-full text-[9px] font-black text-slate-400 border border-slate-100 py-2 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-colors uppercase"
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

      {/* ── Q&A MODAL ──────────────────────────────────────────────────────── */}
      {showQA && selectedLectureForQA && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain size={20} />
                <div>
                  <h3 className="font-bold text-lg">AI Q&A Assistant</h3>
                  <p className="text-xs text-purple-200 truncate max-w-[220px]">
                    {selectedLectureForQA.title}
                  </p>
                </div>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askQuestionAboutLecture();
                  }
                }}
                rows={3}
              />
              {qaAnswer && (
                <div
                  className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${
                    qaAnswer.startsWith("Error:")
                      ? "bg-red-50 border-red-100 text-red-700"
                      : "bg-purple-50 border-purple-100 text-slate-700"
                  }`}
                >
                  {qaAnswer}
                  {qaAnswer.includes("not indexed") && (
                    <p className="mt-2 text-xs font-bold text-purple-600">
                      💡 Click the <Database size={10} className="inline" />{" "}
                      (Index) button on the lecture card first.
                    </p>
                  )}
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
                    <Loader2 size={16} className="animate-spin" /> Asking...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Ask AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MATERIALS MODAL ────────────────────────────────────────────────── */}
      {showMaterials && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-emerald-600 p-4 sm:p-6 text-white flex justify-between items-center">
              <h3 className="font-black text-lg">Study Materials</h3>
              <button onClick={() => setShowMaterials(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 max-h-[400px] overflow-y-auto">
              {fetchingFiles ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-emerald-600" />
                </div>
              ) : currentMaterials.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">
                  No materials available.
                </p>
              ) : (
                currentMaterials.map((mat, i) => (
                  <a
                    key={i}
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                  >
                    <FileText size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium text-slate-700 flex-1 truncate">
                      {mat.title || mat.name || `File ${i + 1}`}
                    </span>
                    <Download size={14} className="text-slate-400 shrink-0" />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO MODAL ────────────────────────────────────────────────────── */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-2 sm:p-4">
          <button
            onClick={() => setSelectedVideo("")}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white"
          >
            <X size={28} />
          </button>
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-2xl bg-black"
              allow="autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── SUMMARY MODAL ──────────────────────────────────────────────────── */}
      {showSummary && selectedLectureForSummary && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-orange-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Lecture Summary</h3>
                <p className="text-xs text-orange-200 truncate max-w-[280px]">
                  {selectedLectureForSummary.title}
                </p>
              </div>
              <button onClick={() => setShowSummary(false)}>
                <X size={22} />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {isSummarizing ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="animate-spin text-orange-500" size={28} />
                  <p className="text-slate-400 text-sm">
                    Generating summary...
                  </p>
                </div>
              ) : (
                <div
                  className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                    summaryResult.startsWith("Error:")
                      ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-orange-50 text-slate-700"
                  }`}
                >
                  {summaryResult}
                  {summaryResult.includes("No content") && (
                    <p className="mt-2 text-xs font-bold text-orange-600">
                      💡 Click the <Database size={10} className="inline" />{" "}
                      (Index) button on the lecture card first.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TRANSCRIBE MODAL (ADDED) ───────────────────────────────────────── */}
      {showTranscribe && selectedLectureForQA && (
        <div className="fixed inset-0 bg-slate-900/70 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-green-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Transcribe YouTube Video</h3>
                <p className="text-xs text-green-200 truncate max-w-[280px]">
                  {selectedLectureForQA.title}
                </p>
              </div>
              <button onClick={() => {
                setShowTranscribe(false);
                setTranscribeUrl("");
                setTranscribeResult("");
              }}>
                <X size={22} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="text"
                className="w-full p-3 border-2 border-green-100 rounded-xl focus:border-green-500 outline-none text-sm"
                placeholder="Paste YouTube URL here..."
                value={transcribeUrl}
                onChange={(e) => setTranscribeUrl(e.target.value)}
              />
              {transcribeResult && (
                <div className="p-4 bg-green-50 rounded-xl max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{transcribeResult}</p>
                </div>
              )}
            </div>
            <div className="border-t p-4">
              <button
                onClick={handleTranscribe}
                disabled={isTranscribing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Transcribing...
                  </>
                ) : (
                  <>
                    <FileText size={16} /> Transcribe & Index
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLectures;