// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { 
//   Send, 
//   Image as ImageIcon, 
//   CheckCircle, 
//   Clock, 
//   MessageCircle, 
//   AlertCircle, 
//   GraduationCap, 
//   ExternalLink, 
//   Plus, 
//   Trash2, 
//   X 
// } from "lucide-react";

// const StudentDoubt = () => {
//   const [question, setQuestion] = useState("");
//   const [image, setImage] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [myDoubts, setMyDoubts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [showForm, setShowForm] = useState(false); 
//   const fetchUserData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/auth/me", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.data.success && res.data.user.enrolledCourses) {
//         setEnrolledCourses(res.data.user.enrolledCourses);
//       }
//     } catch (err) {
//       console.error("Failed to load enrolled courses:", err);
//       const localUser = JSON.parse(localStorage.getItem("user") || "{}");
//       setEnrolledCourses(localUser.enrolledCourses || []);
//     }
//   };

//   const fetchMyDoubts = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/doubts/my-doubts", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMyDoubts(res.data.doubts);
//     } catch (err) {
//       console.error("History fetch error:", err);
//     } finally {
//       setFetching(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/doubts/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMyDoubts(myDoubts.filter(d => d._id !== id));
//       alert("Success: Inquiry deleted successfully.");
//     } catch (err) {
//       alert("Error: Unable to process the deletion request.");
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//     fetchMyDoubts();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedCourse) return alert("Validation Error: Please select a course to continue.");
//     if (!question.trim()) return alert("Validation Error: Please provide a detailed description of your query.");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("question", question);
//     formData.append("courseId", selectedCourse);
//     if (image) formData.append("image", image);

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("https://hilearnlmstool-production.up.railway.app/api/doubts/create", formData, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data" 
//         }
//       });
//       setQuestion("");
//       setImage(null);
//       setSelectedCourse("");
//       setShowForm(false); 
//       alert("Success: Your query has been submitted successfully.");
//       fetchMyDoubts();
//     } catch (err) {
//       alert("Submission Failed: An error occurred while processing your request.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8 min-h-screen bg-white text-slate-800">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
//         <div className="flex items-center gap-4">
//           <div className="w-3 h-10 bg-emerald-600 rounded-full"></div>
//           <div>
//             <h1 className="text-3xl font-black uppercase tracking-tight">Doubt Portal</h1>
//             <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Student Support System</p>
//           </div>
//         </div>

//         <button 
//           onClick={() => setShowForm(!showForm)}
//           className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${
//             showForm ? "bg-slate-100 text-slate-600" : "bg-emerald-600 text-white hover:bg-emerald-700"
//           }`}
//         >
//           {showForm ? <><X size={18}/> Close</> : <><Plus size={18}/> Ask New Doubt</>}
//         </button>
//       </div>

//       {/* Form Card (Conditional Rendering) */}
//       {showForm && (
//         <div className="bg-emerald-50/40 rounded-[32px] p-8 border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="relative group">
//                 <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
//                 <select 
//                   className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 appearance-none cursor-pointer transition-all"
//                   value={selectedCourse}
//                   onChange={(e) => setSelectedCourse(e.target.value)}
//                 >
//                   <option value="">Select Enrolled Course</option>
//                   {enrolledCourses.map((course) => (
//                     <option key={course._id} value={course._id}>{course.title}</option>
//                   ))}
//                 </select>
//               </div>

//               <label className="flex items-center justify-between px-6 py-4 bg-white border-2 border-dashed border-emerald-200 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all group">
//                 <span className="text-sm font-bold text-slate-500 group-hover:text-emerald-600 truncate">
//                   {image ? image.name : "Attach Screenshot"}
//                 </span>
//                 <ImageIcon className="text-emerald-400 group-hover:text-emerald-600" size={20} />
//                 <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
//               </label>
//             </div>

//             <textarea
//               className="w-full p-6 bg-white border-2 border-emerald-50 rounded-[24px] focus:border-emerald-500 outline-none min-h-[140px] font-medium transition-all shadow-inner"
//               placeholder="Describe your doubt here..."
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full md:w-auto px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-200"
//             >
//               {loading ? "Processing..." : "Submit Doubt"} <Send size={18} />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* History / Doubts List */}
//       <div className="space-y-6">
//         <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
//            <Clock size={22} className="text-emerald-600" /> Recent Activity
//         </h2>

//         <div className="grid gap-6">
//           {myDoubts.length === 0 ? (
//             <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
//               <MessageCircle className="mx-auto text-slate-300 mb-4" size={48} />
//               <p className="text-slate-500 font-bold">No doubts found. Start by asking one!</p>
//             </div>
//           ) : (
//             myDoubts.map((d) => (
//               <div key={d._id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative">

//                 {/* Status Header */}
//                 <div className="flex justify-between items-center mb-5">
//                   <div className="flex items-center gap-2">
//                     <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full uppercase border border-emerald-100 tracking-wider">
//                       {d.courseId?.title || "Classroom"}
//                     </span>
//                     <span className={`text-[11px] font-black uppercase flex items-center gap-1.5 ${d.status === 'resolved' ? 'text-emerald-600' : 'text-amber-500'}`}>
//                       {d.status === 'resolved' ? <CheckCircle size={14}/> : <Clock size={14}/>} {d.status}
//                     </span>
//                   </div>

//                   {/* Delete Button */}
//                   <button 
//                     onClick={() => handleDelete(d._id)}
//                     className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
//                     title="Delete Doubt"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>

//                 {/* Question Section */}
//                 <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
//                   <div className="flex-1">
//                     <p className="text-slate-400 text-[10px] font-black uppercase mb-1.5 tracking-widest">Question</p>
//                     <p className="text-lg font-bold leading-snug">{d.question}</p>
//                   </div>

//                   {/* YOUR ATTACHMENT BOX (AS PER DBBB.PNG) */}
//                   {d.image && (
//                     <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-fit self-start md:self-center">
//                       <img 
//                         src={`https://hilearnlmstool-production.up.railway.app${d.image}`} 
//                         className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm" 
//                         alt="question" 
//                       />
//                       <div>
//                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Your Attachment</p>
//                         <a href={`https://hilearnlmstool-production.up.railway.app${d.image}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-0.5">
//                           View Image <ExternalLink size={11}/>
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Mentor Answer Section */}
//                 {d.answer ? (
//                   <div className="p-6 bg-emerald-50/40 rounded-[24px] border border-emerald-100">
//                     <p className="text-emerald-700 text-[11px] font-black uppercase mb-3 tracking-wider flex items-center gap-2">
//                       <MessageCircle size={14}/> Mentor's Response
//                     </p>
//                     <p className="text-slate-700 font-medium text-[15px] leading-relaxed mb-4">{d.answer}</p>

//                     {/* SOLUTION IMAGE ATTACHMENT */}
//                     {d.answerImage && (
//                       <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-emerald-100 w-fit">
//                           <img 
//                             src={`https://hilearnlmstool-production.up.railway.app${d.answerImage}`} 
//                             className="w-14 h-14 object-cover rounded-xl border-2 border-emerald-50 shadow-sm" 
//                             alt="solution" 
//                           />
//                           <div>
//                             <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Mentor Attachment</p>
//                             <a href={`https://hilearnlmstool-production.up.railway.app${d.answerImage}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-0.5">
//                               View Full Image <ExternalLink size={11}/>
//                             </a>
//                           </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2 text-slate-400 py-3 italic text-sm font-medium border-t border-dashed border-slate-100 mt-4">
//                       <AlertCircle size={16} /> Mentor is working on your solution...
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDoubt;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  MessageCircle,
  AlertCircle,
  GraduationCap,
  ExternalLink,
  Plus,
  Trash2,
  X
} from "lucide-react";

const StudentDoubt = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [myDoubts, setMyDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.user.enrolledCourses) {
        setEnrolledCourses(res.data.user.enrolledCourses);
      }
    } catch (err) {
      console.error("Failed to load enrolled courses:", err);
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      setEnrolledCourses(localUser.enrolledCourses || []);
    }
  };

  const fetchMyDoubts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/doubts/my-doubts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDoubts(res.data.doubts);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this inquiry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/doubts/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDoubts(myDoubts.filter(d => d._id !== id));
      alert("Success: Inquiry deleted successfully.");
    } catch (err) {
      alert("Error: Unable to process the deletion request.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchMyDoubts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Validation Error: Please select a course to continue.");
    if (!question.trim()) return alert("Validation Error: Please provide a detailed description of your query.");

    setLoading(true);
    const formData = new FormData();
    formData.append("question", question);
    formData.append("courseId", selectedCourse);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      await axios.post("https://hilearnlmstool-production.up.railway.app/api/doubts/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setQuestion("");
      setImage(null);
      setSelectedCourse("");
      setShowForm(false);
      alert("Success: Your query has been submitted successfully.");
      fetchMyDoubts();
    } catch (err) {
      alert("Submission Failed: An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-6 space-y-8 min-h-screen bg-white text-slate-800">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-3 h-10 bg-emerald-600 rounded-full"></div>
          <div>
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">Doubt Portal</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Student Support System</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-md ${showForm ? "bg-slate-100 text-slate-600" : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
        >
          {showForm ? <><X size={18} /> Close</> : <><Plus size={18} /> Ask New Doubt</>}
        </button>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="bg-emerald-50/40 rounded-[32px] p-6 sm:p-8 border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={20} />
                <select
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 appearance-none cursor-pointer transition-all"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="">Select Enrolled Course</option>
                  {enrolledCourses.map((course) => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center justify-between px-6 py-4 bg-white border-2 border-dashed border-emerald-200 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all group">
                <span className="text-sm font-bold text-slate-500 group-hover:text-emerald-600 truncate">
                  {image ? image.name : "Attach Screenshot"}
                </span>
                <ImageIcon className="text-emerald-400 group-hover:text-emerald-600" size={20} />
                <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
              </label>
            </div>

            <textarea
              className="w-full p-4 sm:p-6 bg-white border-2 border-emerald-50 rounded-[24px] focus:border-emerald-500 outline-none min-h-[140px] font-medium transition-all shadow-inner"
              placeholder="Describe your doubt here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-full md:w-auto px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-emerald-200"
            >
              {loading ? "Processing..." : "Submit Doubt"} <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* History / Doubts List */}
      <div className="space-y-6">
        <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
          <Clock size={22} className="text-emerald-600" /> Recent Activity
        </h2>

        <div className="grid gap-6">
          {myDoubts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
              <MessageCircle className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-bold">No doubts found. Start by asking one!</p>
            </div>
          ) : (
            myDoubts.map((d) => (
              <div key={d._id} className="bg-white p-6 sm:p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative">

                {/* Status Header */}
                <div className="flex flex-col sm:flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3 md:gap-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-black rounded-full uppercase border border-emerald-100 tracking-wider">
                      {d.courseId?.title || "Classroom"}
                    </span>
                    <span className={`text-[11px] font-black uppercase flex items-center gap-1.5 ${d.status === 'resolved' ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {d.status === 'resolved' ? <CheckCircle size={14} /> : <Clock size={14} />} {d.status}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(d._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Delete Doubt"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Question Section */}
                <div className="flex flex-col sm:flex-col md:flex-row justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1.5 tracking-widest">Question</p>
                    <p className="text-lg font-bold leading-snug">{d.question}</p>
                  </div>

                  {/* Attachment */}
                  {d.image && (
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 w-full sm:w-full md:w-fit self-start md:self-center">
                      <img
                        src={`https://hilearnlmstool-production.up.railway.app${d.image}`}
                        className="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-sm"
                        alt="question"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Your Attachment</p>
                        <a href={`https://hilearnlmstool-production.up.railway.app${d.image}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-0.5">
                          View Image <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mentor Answer Section */}
                {d.answer ? (
                  <div className="p-6 bg-emerald-50/40 rounded-[24px] border border-emerald-100">
                    <p className="text-emerald-700 text-[11px] font-black uppercase mb-3 tracking-wider flex items-center gap-2">
                      <MessageCircle size={14} /> Mentor's Response
                    </p>
                    <p className="text-slate-700 font-medium text-[15px] leading-relaxed mb-4">{d.answer}</p>

                    {d.answerImage && (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-emerald-100 w-full sm:w-full md:w-fit">
                        <img
                          src={`https://hilearnlmstool-production.up.railway.app${d.answerImage}`}
                          className="w-14 h-14 object-cover rounded-xl border-2 border-emerald-50 shadow-sm"
                          alt="solution"
                        />
                        <div>
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Mentor Attachment</p>
                          <a href={`https://hilearnlmstool-production.up.railway.app${d.answerImage}`} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-0.5">
                            View Full Image <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 py-3 italic text-sm font-medium border-t border-dashed border-slate-100 mt-4">
                    <AlertCircle size={16} /> Mentor is working on your solution...
                  </div>
                )}
              </div>
            )
            ))}
        </div>

      </div>
    </div>
  );
};

export default StudentDoubt;