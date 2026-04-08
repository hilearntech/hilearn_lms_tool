// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen, HelpCircle } from "lucide-react";

// const AddQuiz = () => {
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
//       setQuizzes(res.data.quizzes || res.data || []);
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
//       console.error("Course fetch error:", err);
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
//     if (!window.confirm("Delete this quiz?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchQuizzes();
//     } catch (err) { alert("Delete failed"); }
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
//       alert("Error saving quiz.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-[#f8fafd] min-h-screen font-sans text-[#2d3748]">


//       <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-8 flex justify-between items-center">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-emerald-50 rounded-full">
//             <HelpCircle className="text-[#059669]" size={30} />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black text-slate-800">Quiz Dashboard</h1>
//             <p className="text-[#059669] text-sm font-medium">View and manage your active quizzes</p>
//           </div>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="bg-[#059669] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
//         >
//           <Plus size={20} /> Add New Quiz
//         </button>
//       </div>


//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {quizzes.length > 0 ? quizzes.map((quiz) => (
//           <div key={quiz._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
//             <div className="flex justify-between items-start mb-4">
//               <span className="text-[10px] font-bold text-[#059669] bg-emerald-50 px-3 py-1 rounded-md uppercase tracking-widest">
//                 {quiz.course?.title || 'JAVA'}
//               </span>
//               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button onClick={() => handleOpenModal(quiz)} className="text-slate-400 hover:text-emerald-600"><Edit3 size={18} /></button>
//                 <button onClick={() => handleDelete(quiz._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
//               </div>
//             </div>

//             <h2 className="text-lg font-bold text-[#2d3748] mb-6">{quiz.title}</h2>

//             <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 border-t pt-4">
//               <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.duration}</span>
//               <span className="flex items-center gap-1.5"><BookOpen size={14} /> {quiz.questions?.length} Questions</span>
//             </div>
//           </div>
//         )) : (
//           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
//             <p className="text-slate-400 font-bold uppercase tracking-widest">No Quizzes Created Yet</p>
//           </div>
//         )}
//       </div>


//       {isModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
//           <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] rounded-xl overflow-hidden animate-in zoom-in-95">

//             <div className="p-6 border-b border-slate-100 flex justify-between items-center px-10 bg-white">
//               <h2 className="text-xl font-bold text-[#1a202c]">{editingId ? "Update Quiz" : "Create Quiz"}</h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500"><X size={30} /></button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto flex-1 bg-white">


//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quiz Title</label>
//                   <input type="text" required className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Course</label>
//                   <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.course} onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}>
//                     <option value="">Choose Course</option>
//                     {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
//                   <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.duration} onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })} />
//                 </div>
//               </div>


//               <div className="space-y-8">
//                 <h3 className="text-xs font-bold text-[#059669] uppercase tracking-widest border-b pb-2">Questions</h3>

//                 {quizData.questions.map((q, qIdx) => (
//                   <div key={qIdx} className="p-8 border border-slate-100 rounded-xl bg-slate-50/30 space-y-6 relative">
//                     <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-6 right-6 text-red-300 hover:text-red-500"><Trash2 size={18} /></button>

//                     <div className="space-y-2">
//                       <input type="text" required placeholder={`Question ${qIdx + 1}`} className="w-full p-4 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-emerald-500" value={q.questionText} onChange={(e) => {
//                         const newQs = [...quizData.questions];
//                         newQs[qIdx].questionText = e.target.value;
//                         setQuizData({ ...quizData, questions: newQs });
//                       }} />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       {q.options.map((opt, oIdx) => (
//                         <input key={oIdx} type="text" required placeholder={`Option ${oIdx + 1}`} className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-300 shadow-sm" value={opt} onChange={(e) => {
//                           const newQs = [...quizData.questions];
//                           newQs[qIdx].options[oIdx] = e.target.value;
//                           setQuizData({ ...quizData, questions: newQs });
//                         }} />
//                       ))}
//                     </div>

//                     <select required className="w-full p-3 bg-white text-[#059669] border border-emerald-100 rounded-lg text-xs font-bold outline-none appearance-none cursor-pointer" value={q.correctAnswer} onChange={(e) => {
//                       const newQs = [...quizData.questions];
//                       newQs[qIdx].correctAnswer = e.target.value;
//                       setQuizData({ ...quizData, questions: newQs });
//                     }}>
//                       <option value="">Set Correct Answer</option>
//                       {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
//                     </select>
//                   </div>
//                 ))}
//               </div>

//               {/* Footer Actions */}
//               <div className="flex gap-4 pt-4">
//                 <button type="button" onClick={addQuestion} className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs uppercase hover:text-[#059669] hover:border-[#059669] transition-all flex items-center justify-center gap-2">
//                   <Plus size={18} /> Add Question
//                 </button>
//                 <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#059669] text-white rounded-xl font-bold text-xs uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md">
//                   {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//                   {editingId ? "Update Quiz" : "Create Quiz"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddQuiz;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen, HelpCircle } from "lucide-react";

// const AddQuiz = () => {
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
//       setQuizzes(res.data.quizzes || res.data || []);
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
//       console.error("Course fetch error:", err);
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
//     if (!window.confirm("Delete this quiz?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchQuizzes();
//     } catch (err) { alert("Delete failed"); }
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
//       alert("Error saving quiz.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//   <div className="p-3 sm:p-6 bg-[#f8fafd] min-h-screen font-sans text-[#2d3748]">

//   {/* HEADER */}
//   <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

//     <div className="flex items-start sm:items-center gap-3 sm:gap-4">
//       <div className="p-2 sm:p-3 bg-emerald-50 rounded-full">
//         <HelpCircle className="text-[#059669]" size={24} />
//       </div>
//       <div>
//         <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
//           Quiz Dashboard
//         </h1>
//         <p className="text-[#059669] text-xs sm:text-sm font-medium">
//           View and manage your active quizzes
//         </p>
//       </div>
//     </div>

//     <button
//       onClick={() => handleOpenModal()}
//       className="w-full sm:w-auto bg-[#059669] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
//     >
//       <Plus size={18} /> Add New Quiz
//     </button>
//   </div>

//   {/* CARDS */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//     {quizzes.length > 0 ? quizzes.map((quiz) => (
//       <div key={quiz._id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">

//         <div className="flex justify-between items-start mb-3 sm:mb-4">
//           <span className="text-[9px] sm:text-[10px] font-bold text-[#059669] bg-emerald-50 px-2 sm:px-3 py-1 rounded-md uppercase tracking-widest">
//             {quiz.course?.title || 'JAVA'}
//           </span>

//           <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
//             <button onClick={() => handleOpenModal(quiz)} className="text-slate-400 hover:text-emerald-600">
//               <Edit3 size={16} />
//             </button>
//             <button onClick={() => handleDelete(quiz._id)} className="text-slate-400 hover:text-red-500">
//               <Trash2 size={16} />
//             </button>
//           </div>
//         </div>

//         <h2 className="text-sm sm:text-lg font-bold text-[#2d3748] mb-4 sm:mb-6">
//           {quiz.title}
//         </h2>

//         <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-bold text-slate-400 border-t pt-3 sm:pt-4">
//           <span className="flex items-center gap-1.5">
//             <Clock size={12} /> {quiz.duration}
//           </span>
//           <span className="flex items-center gap-1.5">
//             <BookOpen size={12} /> {quiz.questions?.length} Questions
//           </span>
//         </div>
//       </div>
//     )) : (
//       <div className="col-span-full py-14 sm:py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
//         <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">
//           No Quizzes Created Yet
//         </p>
//       </div>
//     )}
//   </div>

//   {/* MODAL */}
//   {isModalOpen && (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">

//       <div className="bg-white w-full max-w-[95%] sm:max-w-4xl shadow-2xl flex flex-col max-h-[92vh] rounded-xl overflow-hidden">

//         {/* HEADER */}
//         <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center sm:px-10">
//           <h2 className="text-base sm:text-xl font-bold text-[#1a202c]">
//             {editingId ? "Update Quiz" : "Create Quiz"}
//           </h2>
//           <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500">
//             <X size={24} />
//           </button>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-10 overflow-y-auto flex-1">

//           {/* TOP FIELDS */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
//             <input
//               type="text"
//               required
//               placeholder="Quiz Title"
//               className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm"
//               value={quizData.title}
//               onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
//             />

//             <select
//               required
//               className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm"
//               value={quizData.course}
//               onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}
//             >
//               <option value="">Choose Course</option>
//               {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//             </select>

//             <input
//               type="text"
//               placeholder="Duration"
//               className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm"
//               value={quizData.duration}
//               onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })}
//             />
//           </div>

//           {/* QUESTIONS */}
//           <div className="space-y-6 sm:space-y-8">
//             {quizData.questions.map((q, qIdx) => (
//               <div key={qIdx} className="p-4 sm:p-8 border rounded-xl bg-slate-50/30 space-y-4 sm:space-y-6 relative">

//                 <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-3 sm:top-6 right-3 sm:right-6 text-red-300 hover:text-red-500">
//                   <Trash2 size={16} />
//                 </button>

//                 <input
//                   type="text"
//                   required
//                   placeholder={`Question ${qIdx + 1}`}
//                   className="w-full p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-bold"
//                   value={q.questionText}
//                   onChange={(e) => {
//                     const newQs = [...quizData.questions];
//                     newQs[qIdx].questionText = e.target.value;
//                     setQuizData({ ...quizData, questions: newQs });
//                   }}
//                 />

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {q.options.map((opt, oIdx) => (
//                     <input
//                       key={oIdx}
//                       type="text"
//                       required
//                       placeholder={`Option ${oIdx + 1}`}
//                       className="p-2.5 sm:p-3 border rounded-lg text-xs"
//                       value={opt}
//                       onChange={(e) => {
//                         const newQs = [...quizData.questions];
//                         newQs[qIdx].options[oIdx] = e.target.value;
//                         setQuizData({ ...quizData, questions: newQs });
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ACTIONS */}
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
//             <button
//               type="button"
//               onClick={addQuestion}
//               className="w-full py-3 sm:py-4 border-2 border-dashed rounded-xl text-xs font-bold flex justify-center gap-2"
//             >
//               <Plus size={16} /> Add Question
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 sm:py-4 bg-[#059669] text-white rounded-xl font-bold text-xs flex justify-center gap-2"
//             >
//               {editingId ? "Update Quiz" : "Create Quiz"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   )}
// </div>
//   );
// };

// export default AddQuiz;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen, HelpCircle, Sparkles } from "lucide-react";

const AddQuiz = () => {
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
      setQuizzes(res.data.quizzes || res.data || []);
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
      console.error("Course fetch error:", err);
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
  // const generateQuiz = async () => {
  //   if (!aiTopic.trim()) return alert("Please enter a topic first!");
  //   setIsGenerating(true);
  //   try {
  //     const res = await fetch("http://localhost:8000/generate-announcement", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-RAG-Key": "rag-secret-key-change-in-prod"
  //       },
  //       body: JSON.stringify({
  //         short_note: `Generate 5 MCQ quiz questions with 4 options and correct answers on ${aiTopic}`,
  //         audience: "students"
  //       })
  //     });
  //     const data = await res.json();
  //     const text = data.announcement || "";
  //     const parsed = parseQuiz(text);
  //     if (parsed.length > 0) {
  //       setQuizData(prev => ({ ...prev, questions: parsed }));
  //     } else {
  //       alert("AI response could not be parsed. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     alert("Could not connect to AI service. Make sure RAG service is running on port 8000.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };
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
    if (!window.confirm("Delete this quiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuizzes();
    } catch (err) { alert("Delete failed"); }
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
      alert("Error saving quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-[#f8fafd] min-h-screen font-sans text-[#2d3748]">

      {/* HEADER */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm mb-6 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-emerald-50 rounded-full">
            <HelpCircle className="text-[#059669]" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">Quiz Dashboard</h1>
            <p className="text-[#059669] text-xs sm:text-sm font-medium">View and manage your active quizzes</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto bg-[#059669] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add New Quiz
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {quizzes.length > 0 ? quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#059669] bg-emerald-50 px-2 sm:px-3 py-1 rounded-md uppercase tracking-widest">
                {quiz.course?.title || 'JAVA'}
              </span>
              <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(quiz)} className="text-slate-400 hover:text-emerald-600"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(quiz._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-[#2d3748] mb-4 sm:mb-6">{quiz.title}</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-bold text-slate-400 border-t pt-3 sm:pt-4">
              <span className="flex items-center gap-1.5"><Clock size={12} /> {quiz.duration}</span>
              <span className="flex items-center gap-1.5"><BookOpen size={12} /> {quiz.questions?.length} Questions</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-14 sm:py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-widest">No Quizzes Created Yet</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white w-full max-w-[95%] sm:max-w-4xl shadow-2xl flex flex-col max-h-[92vh] rounded-xl overflow-hidden">

            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center sm:px-10">
              <h2 className="text-base sm:text-xl font-bold text-[#1a202c]">{editingId ? "Update Quiz" : "Create Quiz"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 overflow-y-auto flex-1">

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <input type="text" required placeholder="Quiz Title" className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />
                <select required className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm" value={quizData.course} onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}>
                  <option value="">Choose Course</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                <input type="text" placeholder="Duration" className="w-full p-2.5 sm:p-3.5 border rounded-lg text-xs sm:text-sm" value={quizData.duration} onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })} />
              </div>

              {/* QUESTIONS */}
              <div className="space-y-6 sm:space-y-8">
                {quizData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 sm:p-8 border rounded-xl bg-slate-50/30 space-y-4 sm:space-y-6 relative">
                    <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-3 sm:top-6 right-3 sm:right-6 text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                    <input type="text" required placeholder={`Question ${qIdx + 1}`} className="w-full p-3 sm:p-4 border rounded-lg text-xs sm:text-sm font-bold" value={q.questionText}
                      onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].questionText = e.target.value; setQuizData({ ...quizData, questions: newQs }); }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {q.options.map((opt, oIdx) => (
                        <input key={oIdx} type="text" required placeholder={`Option ${oIdx + 1}`} className="p-2.5 sm:p-3 border rounded-lg text-xs" value={opt}
                          onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].options[oIdx] = e.target.value; setQuizData({ ...quizData, questions: newQs }); }} />
                      ))}
                    </div>
                    <select required className="w-full p-2.5 bg-emerald-50 text-[#059669] border border-emerald-100 rounded-lg text-xs font-bold" value={q.correctAnswer}
                      onChange={(e) => { const newQs = [...quizData.questions]; newQs[qIdx].correctAnswer = e.target.value; setQuizData({ ...quizData, questions: newQs }); }}>
                      <option value="">Set Correct Answer</option>
                      {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={addQuestion} className="w-full py-3 sm:py-4 border-2 border-dashed rounded-xl text-xs font-bold flex justify-center gap-2"><Plus size={16} /> Add Question</button>
                <button type="submit" disabled={loading} className="w-full py-3 sm:py-4 bg-[#059669] text-white rounded-xl font-bold text-xs flex justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  {editingId ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuiz;
