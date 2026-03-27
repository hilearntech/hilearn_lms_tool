

// import React, { useState, useEffect } from "react";
// import { Megaphone, Send, Trash2, CheckCircle2, Loader2, Calendar, BellRing } from "lucide-react";
// import axios from "axios";

// const AdminAnnouncements = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [formData, setFormData] = useState({ title: "", description: "" });
//   const [status, setStatus] = useState({ loading: false, success: false, error: "" });
//   const [isFetching, setIsFetching] = useState(true);

//   const fetchAnnouncements = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/admin/announcements", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setAnnouncements(res.data.announcements || []);
//     } catch (err) {
//       console.error("Fetch error", err);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   useEffect(() => { fetchAnnouncements(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus({ loading: true, success: false, error: "" });
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "https://hilearnlmstool-production.up.railway.app/api/admin/announcement",
//         formData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setStatus({ loading: false, success: true, error: "" });
//         setFormData({ title: "", description: "" });
//         fetchAnnouncements();
//         setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
//       }
//     } catch (err) {
//       setStatus({ loading: false, success: false, error: "Failed to post." });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/admin/announcement/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       fetchAnnouncements();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8">

//       {/* Header Section */}
//       <div className="max-w-7xl mx-auto mb-6 md:mb-8 px-1">
//         <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
//           Announcements
//         </h1>
//         <p className="text-slate-500 font-medium text-sm sm:text-base">
//           Manage and broadcast important updates to your students.
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

//         {/* LEFT */}
//         <div className="lg:col-span-5 order-1">
//           <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-100 md:sticky md:top-8">

//             <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
//                 <BellRing size={20} className="sm:hidden" />
//                 <BellRing size={24} className="hidden sm:block" />
//               </div>
//               <div>
//                 <h3 className="text-base sm:text-lg font-bold text-slate-800">
//                   New Broadcast
//                 </h3>
//                 <p className="text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-wider">
//                   Send update to everyone
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

//               <div>
//                 <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase ml-1">
//                   Announcement Subject
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full mt-2 p-3 sm:p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm sm:text-base text-slate-700"
//                   placeholder="e.g. New Batch Starting Monday"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase ml-1">
//                   Message Content
//                 </label>
//                 <textarea
//                   required
//                   rows="5"
//                   className="w-full mt-2 p-3 sm:p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm sm:text-base text-slate-600 resize-none"
//                   placeholder="Describe the update in detail..."
//                   value={formData.description}
//                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 />
//               </div>

//               {status.success && (
//                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold animate-pulse">
//                   <CheckCircle2 size={16} /> BROADCASTED SUCCESSFULLY!
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={status.loading}
//                 className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-[0.98]"
//               >
//                 {status.loading ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Post Announcement</>}
//               </button>

//             </form>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="lg:col-span-7 order-2">
//           <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px] md:min-h-[600px]">

//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
//               <h3 className="text-base sm:text-lg font-bold text-slate-800">History</h3>
//               <span className="px-3 sm:px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs font-black w-fit">
//                 {announcements.length} TOTAL
//               </span>
//             </div>

//             <div className="space-y-3 sm:space-y-4">

//               {isFetching ? (
//                 <div className="flex flex-col items-center justify-center py-16 sm:py-20">
//                   <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
//                   <p className="text-slate-400 text-sm">Loading history...</p>
//                 </div>
//               ) : announcements.length > 0 ? (
//                 announcements.map((ann) => (
//                   <div key={ann._id} className="p-4 sm:p-6 border border-slate-50 bg-slate-50/50 rounded-[20px] sm:rounded-[24px] group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">

//                     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
//                           <h4 className="font-bold text-slate-800 text-sm sm:text-base">
//                             {ann.title}
//                           </h4>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] text-slate-400 font-bold mb-2 sm:mb-3">
//                           <span className="flex items-center gap-1">
//                             <Calendar size={10} /> {new Date(ann.createdAt).toLocaleDateString()}
//                           </span>
//                           <span className="bg-white px-2 py-0.5 rounded border border-slate-100">
//                             By Admin
//                           </span>
//                         </div>

//                         <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
//                           {ann.description}
//                         </p>
//                       </div>

//                       <button
//                         onClick={() => handleDelete(ann._id)}
//                         className="self-end sm:self-start p-2 sm:p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
//                       >
//                         <Trash2 size={18} />
//                       </button>

//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-20 sm:py-32 border-2 border-dashed border-emerald-50 rounded-[30px] sm:rounded-[40px]">
//                   <Megaphone className="mx-auto text-emerald-100 mb-4" size={50} />
//                   <p className="text-slate-400 font-bold text-sm">
//                     No announcements posted yet.
//                   </p>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminAnnouncements;


import React, { useState, useEffect } from "react";
import { Megaphone, Send, Trash2, CheckCircle2, Loader2, Calendar, BellRing, Sparkles } from "lucide-react";
import axios from "axios";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const [isFetching, setIsFetching] = useState(true);
  const [shortNote, setShortNote] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/admin/announcements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data.announcements || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  // ─── AI Generate Announcement ─────────────────────────────────────────────
  const generateAnnouncement = async () => {
    if (!shortNote.trim()) return alert("Please enter a short note first!");
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/generate-announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RAG-Key": "rag-secret-key-change-in-prod"
        },
        body: JSON.stringify({
          short_note: shortNote,
          audience: "students"
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, description: data.announcement }));
      } else {
        alert("AI generation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to AI service. Make sure RAG service is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://hilearnlmstool-production.up.railway.app/api/admin/announcement",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStatus({ loading: false, success: true, error: "" });
        setFormData({ title: "", description: "" });
        setShortNote("");
        fetchAnnouncements();
        setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 3000);
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Failed to post." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/admin/announcement/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnouncements();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 md:mb-8 px-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Announcements
        </h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">
          Manage and broadcast important updates to your students.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

        {/* LEFT */}
        <div className="lg:col-span-5 order-1">
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-100 md:sticky md:top-8">

            <div className="flex items-center gap-3 sm:gap-4 mb-6 md:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <BellRing size={20} className="sm:hidden" />
                <BellRing size={24} className="hidden sm:block" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  New Broadcast
                </h3>
                <p className="text-[10px] sm:text-xs text-emerald-600 font-bold uppercase tracking-wider">
                  Send update to everyone
                </p>
              </div>
            </div>

            {/* ─── AI Generator Section ─────────────────────────────── */}
            <div className="mb-5 md:mb-6 p-4 bg-gradient-to-br from-violet-50 to-emerald-50 border border-violet-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-violet-500" />
                <span className="text-xs font-bold text-violet-600 uppercase tracking-wider">
                  AI Assistant
                </span>
              </div>
              <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase ml-1">
                Short Note
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 bg-white border border-violet-100 rounded-xl focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 transition-all text-sm text-slate-700"
                placeholder="e.g. kal class cancel hai"
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
              />
              <button
                type="button"
                onClick={generateAnnouncement}
                disabled={isGenerating}
                className="mt-3 w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-violet-200"
              >
                {isGenerating ? (
                  <><Loader2 size={14} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={14} /> Generate with AI</>
                )}
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                AI will fill the message content below automatically
              </p>
            </div>
            {/* ──────────────────────────────────────────────────────── */}

            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase ml-1">
                  Announcement Subject
                </label>
                <input
                  type="text"
                  required
                  className="w-full mt-2 p-3 sm:p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-sm sm:text-base text-slate-700"
                  placeholder="e.g. New Batch Starting Monday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase ml-1">
                  Message Content
                </label>
                <textarea
                  required
                  rows="5"
                  className="w-full mt-2 p-3 sm:p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm sm:text-base text-slate-600 resize-none"
                  placeholder="Describe the update in detail... or use AI to generate above ✨"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {status.success && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold animate-pulse">
                  <CheckCircle2 size={16} /> BROADCASTED SUCCESSFULLY!
                </div>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-[0.98]"
              >
                {status.loading ? <Loader2 className="animate-spin" /> : <><Send size={16} /> Post Announcement</>}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-7 order-2">
          <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[500px] md:min-h-[600px]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">History</h3>
              <span className="px-3 sm:px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs font-black w-fit">
                {announcements.length} TOTAL
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">

              {isFetching ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                  <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
                  <p className="text-slate-400 text-sm">Loading history...</p>
                </div>
              ) : announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann._id} className="p-4 sm:p-6 border border-slate-50 bg-slate-50/50 rounded-[20px] sm:rounded-[24px] group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                            {ann.title}
                          </h4>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-[11px] text-slate-400 font-bold mb-2 sm:mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {new Date(ann.createdAt).toLocaleDateString()}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-100">
                            By Admin
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                          {ann.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(ann._id)}
                        className="self-end sm:self-start p-2 sm:p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 sm:py-32 border-2 border-dashed border-emerald-50 rounded-[30px] sm:rounded-[40px]">
                  <Megaphone className="mx-auto text-emerald-100 mb-4" size={50} />
                  <p className="text-slate-400 font-bold text-sm">
                    No announcements posted yet.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnnouncements;
