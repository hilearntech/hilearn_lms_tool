// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { HelpCircle, Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen } from "lucide-react";

// const AddMentorQuize = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [quizData, setQuizData] = useState({
//     title: "",
//     course: "",
//     duration: "15 min",
//     questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
//   });

//   useEffect(() => {
//     fetchQuizzes();
//     fetchCourses();
//   }, []);

//   const fetchQuizzes = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/quizzes/all", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setQuizzes(res.data.quizzes || []);
//     } catch (err) { console.error("Fetch error", err); }
//   };


//   const fetchCourses = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/courses", {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
//       setCourses(data);
//     } catch (err) {
//       console.error("Course fetch error", err);
//       setCourses([]);
//     }
//   };
//   const handleOpenModal = (quiz = null) => {
//     if (quiz) {
//       setEditingId(quiz._id);
//       setQuizData({
//         title: quiz.title,
//         course: quiz.course?._id || quiz.course || "",
//         duration: quiz.duration,
//         questions: quiz.questions
//       });
//     } else {
//       setEditingId(null);
//       setQuizData({
//         title: "",
//         course: "",
//         duration: "15 min",
//         questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const addQuestion = () => {
//     setQuizData({
//       ...quizData,
//       questions: [...quizData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
//     });
//   };

//   const removeQuestion = (index) => {
//     const newQs = quizData.questions.filter((_, i) => i !== index);
//     setQuizData({ ...quizData, questions: newQs });
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this quiz?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchQuizzes();
//     } catch (err) { alert("Delete failed. Please try again."); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const url = editingId
//         ? `https://hilearnlmstool-production.up.railway.app/api/quizzes/update/${editingId}`
//         : "https://hilearnlmstool-production.up.railway.app/api/quizzes/add";

//       const res = await axios({
//         method: editingId ? 'put' : 'post',
//         url,
//         data: quizData,
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setIsModalOpen(false);
//         fetchQuizzes();
//       }
//     } catch (err) {
//       alert("Error saving quiz. Check if all fields are filled.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans bg-[#F8FAFC] min-h-screen text-slate-700">

//     //   {/* Header Section */}
//     //   <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 border border-slate-200 rounded-xl shadow-sm gap-4">
//     //     <div className="flex items-center gap-4">
//     //       <div className="p-3 bg-emerald-50 rounded-lg"><HelpCircle className="text-[#059669]" size={28} /></div>
//     //       <div>
//     //         <h1 className="text-3xl font-black text-slate-800">Mentor Quiz Panel</h1>
//     //         <p className="text-[#059669] text-sm font-medium">Manage assessments for your assigned courses</p>
//     //       </div>
//     //     </div>
//     //     <button onClick={() => handleOpenModal()} className="bg-[#059669] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2">
//     //       <Plus size={18} /> Create New Quiz
//     //     </button>
//     //   </div>

//     //   {/* Compact Quiz Cards */}
//     //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//     //     {quizzes.length > 0 ? quizzes.map((quiz) => (
//     //       <div key={quiz._id} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group">
//     //         <div className="flex justify-between items-start mb-3">
//     //           <span className="text-[9px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded uppercase">
//     //             {quiz.course?.title?.substring(0, 10) || 'General'}...
//     //           </span>
//     //           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//     //             <button onClick={() => handleOpenModal(quiz)} className="p-1 text-slate-400 hover:text-emerald-600"><Edit3 size={15} /></button>
//     //             <button onClick={() => handleDelete(quiz._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
//     //           </div>
//     //         </div>
//     //         <h3 className="text-sm font-bold text-slate-800 mb-4 line-clamp-1">{quiz.title}</h3>
//     //         <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-t pt-3">
//     //           <span className="flex items-center gap-1"><Clock size={12} /> {quiz.duration}</span>
//     //           <span className="flex items-center gap-1"><BookOpen size={12} /> {quiz.questions?.length} Qs</span>
//     //         </div>
//     //       </div>
//     //     )) : (
//     //       <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
//     //         <p className="text-slate-400 text-sm font-medium">No quizzes found for your courses.</p>
//     //       </div>
//     //     )}
//     //   </div>

//     //   {/* Choras (Square) Modal */}
//     //   {isModalOpen && (
//     //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//     //       <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] border-t-4 border-[#059669] rounded-none animate-in zoom-in-95">
//     //         <div className="p-5 border-b flex justify-between items-center bg-white px-8">
//     //           <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{editingId ? "Edit Quiz" : "Add New Quiz"}</h2>
//     //           <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X size={24} /></button>
//     //         </div>

//     //         <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
//     //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//     //             <div className="space-y-1">
//     //               <label className="text-[10px] font-bold text-slate-400 uppercase">Quiz Name</label>
//     //               <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-none text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />
//     //             </div>
//     //             <div className="space-y-1">
//     //               <label className="text-[10px] font-bold text-slate-400 uppercase">Target Course</label>
//     //               <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-none text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.course} onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}>
//     //                 <option value="">Select Course</option>
//     //                 {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//     //               </select>
//     //             </div>
//     //             <div className="space-y-1">
//     //               <label className="text-[10px] font-bold text-slate-400 uppercase">Time Limit</label>
//     //               <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-none text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.duration} onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })} />
//     //             </div>
//     //           </div>

//     //           <div className="space-y-6">
//     //             <p className="text-xs font-bold text-[#059669] border-l-4 border-[#059669] pl-3 uppercase tracking-widest">Question Bank</p>
//     //             {quizData.questions.map((q, qIdx) => (
//     //               <div key={qIdx} className="p-6 border border-slate-100 bg-slate-50/50 relative">
//     //                 <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
//     //                 <input type="text" required placeholder={`Enter Question ${qIdx + 1}`} className="w-full p-3 bg-white border border-slate-200 rounded-none text-sm font-bold mb-4 outline-none focus:border-[#059669]" value={q.questionText} onChange={(e) => {
//     //                   const newQs = [...quizData.questions];
//     //                   newQs[qIdx].questionText = e.target.value;
//     //                   setQuizData({ ...quizData, questions: newQs });
//     //                 }} />
//     //                 <div className="grid grid-cols-2 gap-3">
//     //                   {q.options.map((opt, oIdx) => (
//     //                     <input key={oIdx} type="text" required placeholder={`Option ${oIdx + 1}`} className="p-2.5 bg-white border border-slate-100 rounded-none text-xs outline-none focus:border-emerald-300" value={opt} onChange={(e) => {
//     //                       const newQs = [...quizData.questions];
//     //                       newQs[qIdx].options[oIdx] = e.target.value;
//     //                       setQuizData({ ...quizData, questions: newQs });
//     //                     }} />
//     //                   ))}
//     //                 </div>
//     //                 <select required className="w-full mt-4 p-2.5 bg-emerald-50 text-[#059669] border border-emerald-100 rounded-none text-xs font-bold" value={q.correctAnswer} onChange={(e) => {
//     //                   const newQs = [...quizData.questions];
//     //                   newQs[qIdx].correctAnswer = e.target.value;
//     //                   setQuizData({ ...quizData, questions: newQs });
//     //                 }}>
//     //                   <option value="">Set Correct Answer</option>
//     //                   {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
//     //                 </select>
//     //               </div>
//     //             ))}
//     //           </div>

//     //           <div className="flex gap-4 pt-4">
//     //             <button type="button" onClick={addQuestion} className="flex-1 py-3 border-2 border-dashed border-slate-200 rounded-none text-slate-400 font-bold text-xs uppercase hover:text-[#059669] hover:border-[#059669] flex items-center justify-center gap-2">
//     //               <Plus size={16} /> Add More
//     //             </button>
//     //             <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#059669] text-white rounded-none font-bold text-xs uppercase hover:bg-emerald-700 flex items-center justify-center gap-2">
//     //               {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
//     //               {editingId ? "Update Quiz" : "Publish Quiz"}
//     //             </button>
//     //           </div>
//     //         </form>
//     //       </div>
//     //     </div>
//     //   )}
//     // </div>
//     <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans bg-[#F8FAFC] min-h-screen text-slate-700">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 sm:p-6 border border-slate-200 rounded-xl shadow-sm gap-4">

//         <div className="flex items-center gap-3 sm:gap-4">
//           <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg">
//             <HelpCircle className="text-[#059669]" size={22} />
//           </div>
//           <div>
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
//               Mentor Quiz Panel
//             </h1>
//             <p className="text-[#059669] text-xs sm:text-sm font-medium">
//               Manage assessments for your assigned courses
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={() => handleOpenModal()}
//           className="w-full sm:w-auto bg-[#059669] text-white px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
//         >
//           <Plus size={16} /> Create New Quiz
//         </button>
//       </div>

//       {/* QUIZ CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         {quizzes.length > 0 ? quizzes.map((quiz) => (
//           <div key={quiz._id} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group">

//             <div className="flex justify-between items-start mb-3">
//               <span className="text-[8px] sm:text-[9px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded uppercase">
//                 {quiz.course?.title?.substring(0, 10) || 'General'}...
//               </span>

//               <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
//                 <button onClick={() => handleOpenModal(quiz)} className="p-1 text-slate-400 hover:text-emerald-600">
//                   <Edit3 size={14} />
//                 </button>
//                 <button onClick={() => handleDelete(quiz._id)} className="p-1 text-slate-400 hover:text-red-500">
//                   <Trash2 size={14} />
//                 </button>
//               </div>
//             </div>

//             <h3 className="text-sm font-bold text-slate-800 mb-4 line-clamp-1">
//               {quiz.title}
//             </h3>

//             <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 border-t pt-3">
//               <span className="flex items-center gap-1">
//                 <Clock size={11} /> {quiz.duration}
//               </span>
//               <span className="flex items-center gap-1">
//                 <BookOpen size={11} /> {quiz.questions?.length} Qs
//               </span>
//             </div>
//           </div>
//         )) : (
//           <div className="col-span-full py-12 sm:py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
//             <p className="text-slate-400 text-sm font-medium">
//               No quizzes found for your courses.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">

//           <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border-t-4 border-[#059669] rounded-none animate-in zoom-in-95">

//             {/* HEADER */}
//             <div className="p-4 sm:p-5 border-b flex justify-between items-center bg-white px-4 sm:px-8">
//               <h2 className="text-sm sm:text-lg font-bold text-slate-800 uppercase tracking-tight">
//                 {editingId ? "Edit Quiz" : "Add New Quiz"}
//               </h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600">
//                 <X size={22} />
//               </button>
//             </div>

//             {/* FORM */}
//             <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 custom-scrollbar">

//               {/* TOP FIELDS */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

//                 <div className="space-y-1">
//                   <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
//                     Quiz Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]"
//                     value={quizData.title}
//                     onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
//                     Target Course
//                   </label>
//                   <select
//                     required
//                     className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]"
//                     value={quizData.course}
//                     onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}
//                   >
//                     <option value="">Select Course</option>
//                     {courses.map(c => (
//                       <option key={c._id} value={c._id}>{c.title}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">
//                     Time Limit
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]"
//                     value={quizData.duration}
//                     onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })}
//                   />
//                 </div>
//               </div>

//               {/* QUESTIONS */}
//               <div className="space-y-5 sm:space-y-6">
//                 <p className="text-[10px] sm:text-xs font-bold text-[#059669] border-l-4 border-[#059669] pl-3 uppercase tracking-widest">
//                   Question Bank
//                 </p>

//                 {quizData.questions.map((q, qIdx) => (
//                   <div key={qIdx} className="p-4 sm:p-6 border border-slate-100 bg-slate-50/50 relative">

//                     <button
//                       type="button"
//                       onClick={() => removeQuestion(qIdx)}
//                       className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-300 hover:text-red-500"
//                     >
//                       <Trash2 size={14} />
//                     </button>

//                     <input
//                       type="text"
//                       required
//                       placeholder={`Enter Question ${qIdx + 1}`}
//                       className="w-full p-3 bg-white border border-slate-200 text-sm font-bold mb-4 outline-none focus:border-[#059669]"
//                       value={q.questionText}
//                       onChange={(e) => {
//                         const newQs = [...quizData.questions];
//                         newQs[qIdx].questionText = e.target.value;
//                         setQuizData({ ...quizData, questions: newQs });
//                       }}
//                     />

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//                       {q.options.map((opt, oIdx) => (
//                         <input
//                           key={oIdx}
//                           type="text"
//                           required
//                           placeholder={`Option ${oIdx + 1}`}
//                           className="p-2.5 bg-white border border-slate-100 text-xs outline-none focus:border-emerald-300"
//                           value={opt}
//                           onChange={(e) => {
//                             const newQs = [...quizData.questions];
//                             newQs[qIdx].options[oIdx] = e.target.value;
//                             setQuizData({ ...quizData, questions: newQs });
//                           }}
//                         />
//                       ))}
//                     </div>

//                     <select
//                       required
//                       className="w-full mt-4 p-2.5 bg-emerald-50 text-[#059669] border border-emerald-100 text-xs font-bold"
//                       value={q.correctAnswer}
//                       onChange={(e) => {
//                         const newQs = [...quizData.questions];
//                         newQs[qIdx].correctAnswer = e.target.value;
//                         setQuizData({ ...quizData, questions: newQs });
//                       }}
//                     >
//                       <option value="">Set Correct Answer</option>
//                       {q.options.map((opt, i) => opt && (
//                         <option key={i} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   </div>
//                 ))}
//               </div>

//               {/* BUTTONS */}
//               <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">

//                 <button
//                   type="button"
//                   onClick={addQuestion}
//                   className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase hover:text-[#059669] hover:border-[#059669] flex items-center justify-center gap-2"
//                 >
//                   <Plus size={14} /> Add More
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3 bg-[#059669] text-white font-bold text-xs uppercase hover:bg-emerald-700 flex items-center justify-center gap-2"
//                 >
//                   {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
//                   {editingId ? "Update Quiz" : "Publish Quiz"}
//                 </button>

//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddMentorQuize;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { HelpCircle, Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen, Sparkles } from "lucide-react";

const AddMentorQuize = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [aiTopic, setAiTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [quizData, setQuizData] = useState({
    title: "",
    course: "",
    duration: "15 min",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/quizzes/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data.quizzes || []);
    } catch (err) { console.error("Fetch error", err); }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(data);
    } catch (err) {
      console.error("Course fetch error", err);
      setCourses([]);
    }
  };

  // ─── Rahil's Parse Logic ───────────────────────────────────────────────────
  const parseQuiz = (text) => {
    const questions = [];
    const blocks = text.split(/\d+\.\s/).filter(b => b.trim() !== "");
    blocks.forEach(block => {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      const question = lines[0];
      const options = lines
        .filter(l => l.match(/^[A-D]\)/))
        .map(l => l.replace(/^[A-D]\)\s*/, ""));
      const correctLine = lines.find(l => l.toLowerCase().includes("correct"));
      const correctAnswer = correctLine
        ? correctLine.split(":")[1]?.trim()
        : "";
      if (question && options.length > 0) {
        questions.push({
          questionText: question,
          options: [...options, ...Array(4 - options.length).fill("")].slice(0, 4),
          correctAnswer
        });
      }
    });
    return questions;
  };

  // ─── Rahil's Final Fix — /generate-announcement ───────────────────────────
  const generateQuiz = async () => {
    if (!aiTopic.trim()) return alert("Please enter a topic first!");

    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:8000/generate-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RAG-Key": "rag-secret-key-change-in-prod"
        },
        body: JSON.stringify({
          short_note: `Generate 5 MCQ quiz questions in this format:
1. Question
A) option
B) option
C) option
D) option
Correct Answer: option

Topic: ${aiTopic}`,
          audience: "students"
        })
      });

      const data = await res.json();
      const text = data?.announcement || "";

      console.log("AI RAW RESPONSE:", text); // debug ke liye

      const parsed = parseQuiz(text);

      if (parsed.length > 0) {
        setQuizData(prev => ({
          ...prev,
          questions: parsed
        }));
      } else {
        alert("AI response parse nahi hua — format issue");
      }

    } catch (err) {
      console.error(err);
      alert("AI service error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingId(quiz._id);
      setQuizData({
        title: quiz.title,
        course: quiz.course?._id || quiz.course || "",
        duration: quiz.duration,
        questions: quiz.questions
      });
    } else {
      setEditingId(null);
      setAiTopic("");
      setQuizData({
        title: "",
        course: "",
        duration: "15 min",
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
      });
    }
    setIsModalOpen(true);
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
    });
  };

  const removeQuestion = (index) => {
    const newQs = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQs });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuizzes();
    } catch (err) { alert("Delete failed. Please try again."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `https://hilearnlmstool-production.up.railway.app/api/quizzes/update/${editingId}`
        : "https://hilearnlmstool-production.up.railway.app/api/quizzes/add";

      const res = await axios({
        method: editingId ? 'put' : 'post',
        url,
        data: quizData,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsModalOpen(false);
        fetchQuizzes();
      }
    } catch (err) {
      alert("Error saving quiz. Check if all fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans bg-[#F8FAFC] min-h-screen text-slate-700">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 sm:p-6 border border-slate-200 rounded-xl shadow-sm gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg"><HelpCircle className="text-[#059669]" size={22} /></div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">Mentor Quiz Panel</h1>
            <p className="text-[#059669] text-xs sm:text-sm font-medium">Manage assessments for your assigned courses</p>
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="w-full sm:w-auto bg-[#059669] text-white px-4 sm:px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
          <Plus size={16} /> Create New Quiz
        </button>
      </div>

      {/* QUIZ CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quizzes.length > 0 ? quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#059669] bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {quiz.course?.title?.substring(0, 10) || 'General'}...
              </span>
              <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(quiz)} className="p-1 text-slate-400 hover:text-emerald-600"><Edit3 size={14} /></button>
                <button onClick={() => handleDelete(quiz._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 line-clamp-1">{quiz.title}</h3>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold text-slate-400 border-t pt-3">
              <span className="flex items-center gap-1"><Clock size={11} /> {quiz.duration}</span>
              <span className="flex items-center gap-1"><BookOpen size={11} /> {quiz.questions?.length} Qs</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 sm:py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
            <p className="text-slate-400 text-sm font-medium">No quizzes found for your courses.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] border-t-4 border-[#059669] rounded-none animate-in zoom-in-95">

            <div className="p-4 sm:p-5 border-b flex justify-between items-center bg-white px-4 sm:px-8">
              <h2 className="text-sm sm:text-lg font-bold text-slate-800 uppercase tracking-tight">{editingId ? "Edit Quiz" : "Add New Quiz"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-600"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-auto flex-1 custom-scrollbar">

              {/* ─── AI Generator ───────────────────────────────────── */}
              <div className="p-4 bg-gradient-to-br from-violet-50 to-emerald-50 border border-violet-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-violet-500" />
                  <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">AI Quiz Generator</span>
                </div>
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Topic / Lecture Name</label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all text-sm text-slate-700"
                  placeholder="e.g. Python Basics, React Hooks, Java OOP"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                />
                <button
                  type="button"
                  onClick={generateQuiz}
                  disabled={isGenerating}
                  className="mt-3 w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-violet-200"
                >
                  {isGenerating ? <><Loader2 size={14} className="animate-spin" /> Generating Questions...</> : <><Sparkles size={14} /> Generate with AI</>}
                </button>
                <p className="text-[10px] text-slate-400 mt-2 text-center">AI will auto-fill the questions below ✨</p>
              </div>

              {/* TOP FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Quiz Name</label>
                  <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Target Course</label>
                  <select required className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.course} onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}>
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase">Time Limit</label>
                  <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.duration} onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })} />
                </div>
              </div>

              {/* QUESTIONS */}
              <div className="space-y-5 sm:space-y-6">
                <p className="text-[10px] sm:text-xs font-bold text-[#059669] border-l-4 border-[#059669] pl-3 uppercase tracking-widest">Question Bank</p>
                {quizData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 sm:p-6 border border-slate-100 bg-slate-50/50 relative">
                    <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                    <input type="text" required placeholder={`Enter Question ${qIdx + 1}`} className="w-full p-3 bg-white border border-slate-200 text-sm font-bold mb-4 outline-none focus:border-[#059669]" value={q.questionText}
                      onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].questionText = e.target.value; setQuizData({ ...quizData, questions: newQs }); }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map((opt, oIdx) => (
                        <input key={oIdx} type="text" required placeholder={`Option ${oIdx + 1}`} className="p-2.5 bg-white border border-slate-100 text-xs outline-none focus:border-emerald-300" value={opt}
                          onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].options[oIdx] = e.target.value; setQuizData({ ...quizData, questions: newQs }); }} />
                      ))}
                    </div>
                    <select required className="w-full mt-4 p-2.5 bg-emerald-50 text-[#059669] border border-emerald-100 text-xs font-bold" value={q.correctAnswer}
                      onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].correctAnswer = e.target.value; setQuizData({ ...quizData, questions: newQs }); }}>
                      <option value="">Set Correct Answer</option>
                      {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase hover:text-[#059669] hover:border-[#059669] flex items-center justify-center gap-2">
                  <Plus size={14} /> Add More
                </button>
                <button type="submit" disabled={loading} className="w-full py-3 bg-[#059669] text-white font-bold text-xs uppercase hover:bg-emerald-700 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  {editingId ? "Update Quiz" : "Publish Quiz"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMentorQuize;
