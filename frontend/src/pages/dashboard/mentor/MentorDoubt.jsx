// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   CheckCircle,
//   Clock,
//   Eye,
//   Send,
//   X,
//   Image as ImageIcon,
//   LayoutDashboard,
//   User,
//   Calendar,
//   ExternalLink,
//   AlertCircle
// } from "lucide-react";

// const MentorDoubt = () => {
//   const [doubts, setDoubts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedDoubt, setSelectedDoubt] = useState(null);
//   const [answer, setAnswer] = useState("");
//   const [answerImage, setAnswerImage] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   const fetchDoubts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/doubts/mentor-list", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDoubts(res.data.doubts);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching mentor doubts", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchDoubts(); }, []);

//   const handleResolve = async () => {
//     if (!answer.trim()) return alert("Please provide a detailed solution before submitting");
//     setSubmitting(true);
//     const formData = new FormData();
//     formData.append("doubtId", selectedDoubt._id);
//     formData.append("answer", answer);
//     if (answerImage) formData.append("image", answerImage);

//     try {
//       const token = localStorage.getItem("token");
//       await axios.put("https://hilearnlmstool-production.up.railway.app/api/doubts/resolve", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
//       alert("Doubt Resolved!");
//       setSelectedDoubt(null); setAnswer(""); setAnswerImage(null);
//       fetchDoubts();
//     } catch (err) {
//       alert("Unable to connect to the server.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Stats calculation
//   const totalDoubts = doubts.length;
//   const pendingDoubts = doubts.filter(d => d.status !== 'resolved').length;
//   const resolvedDoubts = doubts.filter(d => d.status === 'resolved').length;

//   return (
//     // <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen text-slate-800 font-sans">

//     //   {/* Dashboard Stats Header */}
//     //   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b pb-8">
//     //     <div>
//     //       <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
//     //         <LayoutDashboard className="text-emerald-600" /> Mentor Panel
//     //       </h1>
//     //       <p className="text-2x1 font-bold text-emerald-600  tracking-widest mt-1">Student Query Management System</p>
//     //     </div>

//     //     <div className="flex gap-3">
//     //       <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[110px]">
//     //         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Cases</p>
//     //         <p className="text-xl font-black text-slate-800">{totalDoubts}</p>
//     //       </div>
//     //       <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-center min-w-[110px]">
//     //         <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Pending</p>
//     //         <p className="text-xl font-black text-orange-600">{pendingDoubts}</p>
//     //       </div>
//     //       <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center min-w-[110px]">
//     //         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Resolved</p>
//     //         <p className="text-xl font-black text-emerald-700">{resolvedDoubts}</p>
//     //       </div>
//     //     </div>
//     //   </div>

//     //   {loading ? (
//     //     <div className="text-center py-20 font-bold text-slate-300 uppercase tracking-widest">Loading Inbox...</div>
//     //   ) : (
//     //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//     //       {doubts.map((d) => (
//     //         <div key={d._id} className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-md transition-all flex flex-col">
//     //           <div className="flex justify-between items-center mb-5">
//     //             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
//     //               d.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
//     //             }`}>
//     //               {d.status}
//     //             </span>
//     //             <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
//     //               <Calendar size={12}/> {new Date(d.createdAt).toLocaleDateString()}
//     //             </span>
//     //           </div>

//     //           <div className="mb-4">
//     //             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Student Name</p>
//     //             <h3 className="font-bold text-slate-800 text-lg">{d.studentId?.name || "Student"}</h3>
//     //           </div>

//     //           <p className="text-slate-500 text-sm line-clamp-2 font-medium mb-6 italic">"{d.question}"</p>

//     //           <button 
//     //             onClick={() => setSelectedDoubt(d)}
//     //             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[2px] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-auto"
//     //           >
//     //             <Eye size={16} /> Show Doubt
//     //           </button>
//     //         </div>
//     //       ))}
//     //     </div>
//     //   )}

//     //   {/* --- MODAL (Resolve Doubt) --- */}
//     //   {selectedDoubt && (
//     //     <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
//     //       <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

//     //         {/* Modal Header */}
//     //         <div className="p-6 border-b flex justify-between items-center px-8">
//     //           <h2 className="font-black text-slate-800 uppercase tracking-tight">Doubt Detail View</h2>
//     //           <button onClick={() => {setSelectedDoubt(null); setAnswer("");}} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
//     //         </div>

//     //         <div className="p-8 space-y-8 overflow-y-auto">
//     //           {/* Question Section */}
//     //           <div className="space-y-4">
//     //             <div className="flex items-center gap-2 text-emerald-600">
//     //               <AlertCircle size={18} />
//     //               <label className="text-[11px] font-black uppercase tracking-widest">Question Information</label>
//     //             </div>

//     //             <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
//     //               <p className="text-slate-800 font-bold text-lg leading-relaxed mb-4">{selectedDoubt.question}</p>

//     //               {/* ATTACHMENT BOX  */}
//     //               {selectedDoubt.image && (
//     //                 <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 w-fit">
//     //                   <img 
//     //                     src={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`} 
//     //                     className="w-16 h-16 object-cover rounded-xl border-2 border-slate-50 shadow-sm" 
//     //                     alt="student-attachment" 
//     //                   />
//     //                   <div>
//     //                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Student Attachment</p>
//     //                     <a 
//     //                       href={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`} 
//     //                       target="_blank" 
//     //                       rel="noreferrer" 
//     //                       className="text-[11px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-1"
//     //                     >
//     //                       View Full Image <ExternalLink size={12}/>
//     //                     </a>
//     //                   </div>
//     //                 </div>
//     //               )}
//     //             </div>
//     //           </div>

//     //           {/* Resolution Form */}
//     //           <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
//     //             <label className="text-[11px] font-black text-emerald-600 uppercase tracking-widest block">Write Your Solution</label>
//     //             <textarea 
//     //               className="w-full p-6 bg-white border-2 border-slate-100 rounded-[24px] focus:border-emerald-500 outline-none transition-all font-medium min-h-[150px] text-slate-700 shadow-inner"
//     //               placeholder="Explain the solution clearly..."
//     //               value={answer}
//     //               onChange={(e) => setAnswer(e.target.value)}
//     //             />

//     //             <div className="flex flex-col sm:flex-row gap-4">
//     //               <label className="flex-1 flex items-center justify-between px-6 py-4 bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all group">
//     //                 <span className="text-sm font-bold text-emerald-700 truncate">
//     //                   {answerImage ? answerImage.name : "Upload Solution Image (Optional)"}
//     //                 </span>
//     //                 <ImageIcon className="text-emerald-400 group-hover:text-emerald-600" size={20} />
//     //                 <input type="file" className="hidden" accept="image/*" onChange={(e) => setAnswerImage(e.target.files[0])} />
//     //               </label>

//     //               {answerImage && (
//     //                 <button onClick={() => setAnswerImage(null)} className="px-4 py-2 text-[10px] font-black uppercase text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">Cancel Image</button>
//     //               )}
//     //             </div>
//     //           </div>
//     //         </div>

//     //         {/* Modal Footer */}
//     //         <div className="p-8 border-t bg-slate-50 flex gap-4">
//     //            <button 
//     //             onClick={handleResolve}
//     //             disabled={submitting}
//     //             className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[2px] hover:bg-slate-900 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//     //            >
//     //              {submitting ? "Processing..." : "Submit Solution"} <Send size={18} />
//     //            </button>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>
//     <div className="max-w-6xl lg:max-w-7xl mx-auto p-4 sm:p-6 bg-white min-h-screen text-slate-800 font-sans">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-4 sm:gap-6 border-b pb-6 sm:pb-8">

//         <div>
//           <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
//             <LayoutDashboard className="text-emerald-600" size={24} />
//             Mentor Panel
//           </h1>
//           <p className="text-sm sm:text-base font-bold text-emerald-600 tracking-widest mt-1">
//             Student Query Management System
//           </p>
//         </div>

//         {/* STATS */}
//         <div className="flex flex-wrap gap-3 w-full md:w-auto">

//           <div className="flex-1 min-w-[100px] px-4 py-3 bg-slate-50 rounded-xl border text-center">
//             <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
//             <p className="text-lg sm:text-xl font-black">{totalDoubts}</p>
//           </div>

//           <div className="flex-1 min-w-[100px] px-4 py-3 bg-orange-50 rounded-xl border text-center">
//             <p className="text-[10px] font-black text-orange-500 uppercase">Pending</p>
//             <p className="text-lg sm:text-xl font-black text-orange-600">{pendingDoubts}</p>
//           </div>

//           <div className="flex-1 min-w-[100px] px-4 py-3 bg-emerald-50 rounded-xl border text-center">
//             <p className="text-[10px] font-black text-emerald-600 uppercase">Resolved</p>
//             <p className="text-lg sm:text-xl font-black text-emerald-700">{resolvedDoubts}</p>
//           </div>

//         </div>
//       </div>

//       {/* LOADING */}
//       {loading ? (
//         <div className="text-center py-16 sm:py-20 font-bold text-slate-300 text-sm sm:text-base uppercase">
//           Loading Inbox...
//         </div>
//       ) : (

//         /* GRID */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//           {doubts.map((d) => (

//             <div key={d._id} className="bg-white border p-4 sm:p-6 rounded-2xl sm:rounded-[32px] flex flex-col">

//               {/* TOP */}
//               <div className="flex justify-between items-center mb-4 sm:mb-5">
//                 <span className={`px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${d.status === 'resolved'
//                     ? 'bg-emerald-100 text-emerald-700'
//                     : 'bg-amber-100 text-amber-700'
//                   }`}>
//                   {d.status}
//                 </span>

//                 <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold flex items-center gap-1">
//                   <Calendar size={10} />
//                   {new Date(d.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               {/* STUDENT */}
//               <div className="mb-3 sm:mb-4">
//                 <p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase mb-1">
//                   Student Name
//                 </p>
//                 <h3 className="font-bold text-slate-800 text-base sm:text-lg">
//                   {d.studentId?.name || "Student"}
//                 </h3>
//               </div>

//               {/* QUESTION */}
//               <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 italic mb-4 sm:mb-6">
//                 "{d.question}"
//               </p>

//               {/* BUTTON */}
//               <button
//                 onClick={() => setSelectedDoubt(d)}
//                 className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase flex items-center justify-center gap-2 mt-auto"
//               >
//                 <Eye size={14} /> Show Doubt
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* MODAL */}
//       {selectedDoubt && (
//         <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4">

//           <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-[40px] shadow-2xl flex flex-col max-h-[90vh]">

//             {/* HEADER */}
//             <div className="p-4 sm:p-6 border-b flex justify-between items-center">
//               <h2 className="text-sm sm:text-base font-black">Doubt Detail View</h2>
//               <button onClick={() => { setSelectedDoubt(null); setAnswer(""); }}>
//                 <X size={18} />
//               </button>
//             </div>

//             {/* BODY */}
//             <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">

//               {/* QUESTION */}
//               <div>
//                 <p className="font-bold text-sm sm:text-lg mb-3">
//                   {selectedDoubt.question}
//                 </p>

//                 {selectedDoubt.image && (
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl">
//                     <img
//                       src={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`}
//                       className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover"
//                       alt="attachment"
//                     />
//                     <a
//                       href={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-xs text-emerald-600 font-bold flex items-center gap-1"
//                     >
//                       View Image <ExternalLink size={12} />
//                     </a>
//                   </div>
//                 )}
//               </div>

//               {/* ANSWER */}
//               <textarea
//                 className="w-full p-4 sm:p-6 border rounded-xl min-h-[120px] sm:min-h-[150px] text-sm"
//                 placeholder="Explain the solution clearly..."
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//               />

//               {/* FILE */}
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <label className="flex-1 flex justify-between items-center p-3 border-2 border-dashed rounded-xl cursor-pointer">
//                   <span className="text-xs truncate">
//                     {answerImage ? answerImage.name : "Upload Image"}
//                   </span>
//                   <ImageIcon size={16} />
//                   <input type="file" className="hidden" onChange={(e) => setAnswerImage(e.target.files[0])} />
//                 </label>

//                 {answerImage && (
//                   <button onClick={() => setAnswerImage(null)} className="text-xs text-red-500">
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="p-4 sm:p-6 border-t">
//               <button
//                 onClick={handleResolve}
//                 disabled={submitting}
//                 className="w-full py-3 sm:py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"
//               >
//                 {submitting ? "Processing..." : "Submit"} <Send size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default MentorDoubt;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  Clock,
  Eye,
  Send,
  X,
  Image as ImageIcon,
  LayoutDashboard,
  User,
  Calendar,
  ExternalLink,
  AlertCircle,
  Brain,
  Loader2,
  Sparkles,
  Copy,
  Edit3
} from "lucide-react";

const MentorDoubt = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answer, setAnswer] = useState("");
  const [answerImage, setAnswerImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // AI Suggestion States
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const fetchDoubts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/doubts/mentor-list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoubts(res.data.doubts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching mentor doubts", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoubts(); }, []);

  // AI Suggestion Function
  // const getAISuggestion = async (questionText) => {
  //   try {
  //     const res = await fetch("http://localhost:8000/ask", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-RAG-Key": "rag-secret-key-change-in-prod"
  //       },
  //       body: JSON.stringify({
  //         question: questionText
  //       })
  //     });

  //     const data = await res.json();

  //     if (!data.answer) {
  //       return "No AI suggestion available. Please check if lectures are indexed.";
  //     }

  //     return data.answer;

  //   } catch (err) {
  //     console.error("AI Suggestion Error:", err);
  //     return "⚠️ Unable to get AI suggestion. Please check your connection.";
  //   }
  // };
  const getAISuggestion = async (questionText, lectureId) => {
    try {
      const res = await fetch("http://localhost:8000/auto-answer-doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RAG-Key": "rag-secret-key-change-in-prod"
        },
        body: JSON.stringify({
          lecture_id: lectureId,   // ✅ IMPORTANT
          doubt: questionText,
          student_name: "Mentor"
        })
      });

      const data = await res.json();

      if (!data.answer) {
        return "⚠️ No AI suggestion found";
      }

      return data.answer;

    } catch (err) {
      console.error("AI Suggestion Error:", err);
      return "❌ Error getting AI suggestion";
    }
  };

  const handleGetSuggestion = async () => {
    if (!selectedDoubt) return;

    setIsLoadingSuggestion(true);
    setShowAISuggestion(true);
    // const suggestion = await getAISuggestion(selectedDoubt.question);
    const suggestion = await getAISuggestion(
      selectedDoubt.question,
      selectedDoubt.lectureId   // ⚠️ ye hona chahiye doubt object me
    );
    setAiSuggestion(suggestion);
    setIsLoadingSuggestion(false);
  };

  const handleUseSuggestion = () => {
    if (aiSuggestion) {
      setAnswer(aiSuggestion);
      setShowAISuggestion(false);
    }
  };

  const handleResolve = async () => {
    if (!answer.trim()) return alert("Please provide a detailed solution before submitting");
    setSubmitting(true);
    const formData = new FormData();
    formData.append("doubtId", selectedDoubt._id);
    formData.append("answer", answer);
    if (answerImage) formData.append("image", answerImage);

    try {
      const token = localStorage.getItem("token");
      await axios.put("https://hilearnlmstool-production.up.railway.app/api/doubts/resolve", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      alert("Doubt Resolved!");
      setSelectedDoubt(null);
      setAnswer("");
      setAnswerImage(null);
      setAiSuggestion("");
      setShowAISuggestion(false);
      fetchDoubts();
    } catch (err) {
      alert("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const totalDoubts = doubts.length;
  const pendingDoubts = doubts.filter(d => d.status !== 'resolved').length;
  const resolvedDoubts = doubts.filter(d => d.status === 'resolved').length;

  return (
    <div className="max-w-6xl lg:max-w-7xl mx-auto p-4 sm:p-6 bg-white min-h-screen text-slate-800 font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-10 gap-4 sm:gap-6 border-b pb-6 sm:pb-8">

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
            <LayoutDashboard className="text-emerald-600" size={24} />
            Mentor Panel
          </h1>
          <p className="text-sm sm:text-base font-bold text-emerald-600 tracking-widest mt-1">
            Student Query Management System
          </p>
        </div>

        {/* STATS */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">

          <div className="flex-1 min-w-[100px] px-4 py-3 bg-slate-50 rounded-xl border text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
            <p className="text-lg sm:text-xl font-black">{totalDoubts}</p>
          </div>

          <div className="flex-1 min-w-[100px] px-4 py-3 bg-orange-50 rounded-xl border text-center">
            <p className="text-[10px] font-black text-orange-500 uppercase">Pending</p>
            <p className="text-lg sm:text-xl font-black text-orange-600">{pendingDoubts}</p>
          </div>

          <div className="flex-1 min-w-[100px] px-4 py-3 bg-emerald-50 rounded-xl border text-center">
            <p className="text-[10px] font-black text-emerald-600 uppercase">Resolved</p>
            <p className="text-lg sm:text-xl font-black text-emerald-700">{resolvedDoubts}</p>
          </div>

        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-16 sm:py-20 font-bold text-slate-300 text-sm sm:text-base uppercase">
          Loading Inbox...
        </div>
      ) : (

        /* GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {doubts.map((d) => (

            <div key={d._id} className="bg-white border p-4 sm:p-6 rounded-2xl sm:rounded-[32px] flex flex-col hover:shadow-lg transition-all duration-300">

              {/* TOP */}
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <span className={`px-3 sm:px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${d.status === 'resolved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
                  }`}>
                  {d.status}
                </span>

                <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* STUDENT */}
              <div className="mb-3 sm:mb-4">
                <p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase mb-1">
                  Student Name
                </p>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  {d.studentId?.name || "Student"}
                </h3>
              </div>

              {/* QUESTION */}
              <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 italic mb-4 sm:mb-6">
                "{d.question}"
              </p>

              {/* BUTTON */}
              <button
                onClick={() => setSelectedDoubt(d)}
                className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase flex items-center justify-center gap-2 mt-auto hover:bg-emerald-600 transition-all duration-300"
              >
                <Eye size={14} /> Show Doubt
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedDoubt && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl sm:max-w-2xl rounded-2xl sm:rounded-[40px] shadow-2xl flex flex-col max-h-[90vh]">

            {/* HEADER */}
            <div className="p-4 sm:p-6 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-emerald-600" size={20} />
                <h2 className="text-sm sm:text-base font-black">Doubt Detail View</h2>
              </div>
              <button
                onClick={() => { setSelectedDoubt(null); setAnswer(""); setAiSuggestion(""); setShowAISuggestion(false); }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* BODY */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">

              {/* QUESTION */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                  <p className="text-[10px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-wider">
                    Student's Question
                  </p>
                </div>
                <p className="font-bold text-sm sm:text-lg leading-relaxed text-slate-800">
                  {selectedDoubt.question}
                </p>

                {selectedDoubt.image && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl mt-3">
                    <img
                      src={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                      alt="attachment"
                    />
                    <a
                      href={`https://hilearnlmstool-production.up.railway.app${selectedDoubt.image}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-600 font-bold flex items-center gap-1 hover:underline"
                    >
                      View Full Image <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* AI SUGGESTION SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Brain className="text-purple-600" size={18} />
                    <p className="text-[10px] sm:text-[11px] font-black text-purple-600 uppercase tracking-wider">
                      AI Assistant
                    </p>
                  </div>

                  <button
                    onClick={handleGetSuggestion}
                    disabled={isLoadingSuggestion}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoadingSuggestion ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Sparkles size={14} />
                    )}
                    {isLoadingSuggestion ? "Analyzing..." : "Get AI Suggestion"}
                  </button>
                </div>

                {showAISuggestion && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {isLoadingSuggestion ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={28} className="animate-spin text-purple-600" />
                        <span className="ml-2 text-sm text-purple-600 font-medium">Generating suggestion...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-2 mb-3">
                          <Sparkles size={16} className="text-purple-600 mt-0.5" />
                          <p className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                            AI Generated Suggestion
                          </p>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed mb-4">
                          {aiSuggestion}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={handleUseSuggestion}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-all"
                          >
                            <Copy size={14} />
                            Use This Suggestion
                          </button>
                          <button
                            onClick={() => setShowAISuggestion(false)}
                            className="px-4 py-2 border border-purple-300 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-50 transition-all"
                          >
                            Dismiss
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* ANSWER INPUT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="text-emerald-600" size={16} />
                  <p className="text-[10px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-wider">
                    Your Solution
                  </p>
                </div>

                <textarea
                  className="w-full p-4 sm:p-5 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all min-h-[120px] sm:min-h-[150px] text-sm font-medium"
                  placeholder="Write your solution here... (You can edit the AI suggestion or write your own)"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                {/* FILE UPLOAD */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex justify-between items-center p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 transition-all group">
                    <span className="text-xs truncate text-slate-600 group-hover:text-emerald-600">
                      {answerImage ? answerImage.name : "📎 Attach Image (Optional)"}
                    </span>
                    <ImageIcon size={16} className="text-slate-400 group-hover:text-emerald-500" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAnswerImage(e.target.files[0])} />
                  </label>

                  {answerImage && (
                    <button
                      onClick={() => setAnswerImage(null)}
                      className="px-4 py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 sm:p-6 border-t bg-slate-50 rounded-b-2xl sm:rounded-b-[40px]">
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="w-full py-3 sm:py-4 bg-emerald-600 text-white rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Solution
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

export default MentorDoubt;