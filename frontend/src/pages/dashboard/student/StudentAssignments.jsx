import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Send, CheckCircle, Clock, AlertCircle, Link as LinkIcon, Trophy, MessageSquare, Loader2, User, Timer, Eye } from "lucide-react";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionLink, setSubmissionLink] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const userStr = localStorage.getItem("user");
  const userData = userStr ? JSON.parse(userStr) : {};
  const studentId = userData._id || userData.id;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/student/my-assignments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setAssignments(res.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const completedCount = assignments.filter(assign => 
    assign.submissions?.some(s => (s.student?._id || s.student) === studentId)
  ).length;

  const handleSubmit = async (assignmentId) => {
    if (!submissionLink) return alert("Please paste a link first!");
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://hilearnlmstool-production.up.railway.app/api/student/submit-assignment", 
        { assignmentId, submissionLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Submitted successfully!");
      setSubmissionLink("");
      setSelectedId(null);
      fetchAssignments(); 
    } catch (err) {
      alert("Submission failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-[#059669]" size={32} />
        <div className="text-[#059669] font-bold">Syncing Assignments...</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#059669] rounded-xl text-white shadow-md">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Learning Dashboard</h1>
            <p className="text-slate-500 text-xs font-medium">Manage and track your project submissions</p>
          </div>
        </div>

        <div className="bg-[#f0fdf4] border border-[#dcfce7] py-2 px-6 rounded-2xl flex items-center gap-3 shadow-sm">
          <Trophy size={18} className="text-[#059669]" />
          <span className="text-sm font-black text-slate-700">
            {completedCount} <span className="text-slate-400 font-bold">/ {assignments.length} Tasks Done</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignments.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-slate-50">
            <AlertCircle className="mx-auto text-slate-300 mb-2" size={40} />
            <p className="text-slate-500 font-bold">No tasks assigned yet.</p>
          </div>
        ) : (
          assignments.map((assign) => {
            const userSubmission = assign.submissions?.find(s => (s.student?._id || s.student) === studentId);
            const isGraded = userSubmission?.grade && userSubmission.grade.trim() !== "" && userSubmission.grade !== "Not Graded";
            
            return (
              <div key={assign._id} className="bg-white rounded-[24px] border border-slate-200 p-6 flex flex-col lg:flex-row justify-between items-stretch lg:items-center hover:border-[#059669] transition-all hover:shadow-xl group">
                
                {/* LEFT INFO */}
                <div className="flex-1 lg:pr-8 border-slate-100 lg:border-r mb-6 lg:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-[#059669] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      {assign.course?.title || "General"}
                    </span>
                    {userSubmission && (
                      <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1 shadow-sm">
                        <CheckCircle size={10}/> Submitted
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-[#059669] transition-colors">{assign.title}</h3>
                  
                  {/* NEW: IMAGE PREVIEW ADDED HERE */}
                  {assign.image && (
                    <div className="relative mt-3 mb-4 w-48 h-28 rounded-xl overflow-hidden border border-slate-100 group/img cursor-pointer shadow-sm"
                         onClick={() => window.open(`https://hilearnlmstool-production.up.railway.app${assign.image}`, '_blank')}>
                      <img 
                        src={`https://hilearnlmstool-production.up.railway.app${assign.image}`} 
                        alt="Task Preview" 
                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                         <Eye className="text-white" size={20} />
                      </div>
                    </div>
                  )}

                  <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">{assign.description}</p>
                  
                  <div className="flex flex-wrap gap-5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Clock size={16} className="text-rose-400" />
                      <span>Deadline: {new Date(assign.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <User size={16} className="text-[#059669]" />
                      <span>Mentor: {assign.mentor?.name}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT STATUS SECTION */}
                <div className="lg:w-[400px] flex items-center justify-center lg:pl-8">
                  {userSubmission ? (
                    <div className="w-full space-y-4">
                      <div className={`rounded-3xl p-5 flex items-center gap-5 border transition-all ${isGraded ? 'bg-emerald-50/40 border-emerald-100 shadow-sm' : 'bg-amber-50/50 border-amber-200 border-dashed'}`}>
                        <div className="text-center min-w-[90px] border-r border-slate-200 pr-4">
                          <p className={`text-[10px] font-black uppercase mb-1 tracking-tight ${isGraded ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {isGraded ? "Final Grade" : "Current Status"}
                          </p>
                          {isGraded ? (
                            <p className="text-4xl font-black text-[#059669] leading-none drop-shadow-sm">{userSubmission.grade}</p>
                          ) : (
                            <div className="flex flex-col items-center gap-1 py-1">
                                <Timer size={24} className="text-amber-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-amber-700">Pending</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          {isGraded ? (
                            <div className="animate-in fade-in duration-500">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <MessageSquare size={12} className="text-emerald-600" />
                                <p className="text-[10px] font-black text-emerald-600 uppercase">Mentor Feedback</p>
                              </div>
                              <p className="text-xs font-bold text-slate-700 leading-snug italic line-clamp-3">
                                "{userSubmission.feedback}"
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-black text-amber-800 leading-tight">Under Evaluation</p>
                              <p className="text-[11px] font-bold text-amber-600/80 leading-tight">
                                Your mentor is reviewing your project.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <a 
                        href={userSubmission.submissionLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-400 hover:text-[#059669] hover:border-[#059669] transition-all flex items-center justify-center gap-2"
                      >
                        <LinkIcon size={14}/> View Your Submission
                      </a>
                    </div>
                  ) : (
                    <div className="w-full space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Submit Project Link</label>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl focus-within:border-[#059669] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50 transition-all shadow-inner">
                          <LinkIcon size={18} className="text-slate-300" />
                          <input 
                            className="text-sm font-bold outline-none w-full bg-transparent text-slate-700 placeholder:text-slate-300"
                            placeholder="Paste GitHub or Drive link..."
                            value={selectedId === assign._id ? submissionLink : ""}
                            onChange={(e) => { setSelectedId(assign._id); setSubmissionLink(e.target.value); }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSubmit(assign._id)}
                        className="w-full py-4 bg-[#059669] text-white rounded-2xl text-sm font-black hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95"
                      >
                        <Send size={16} /> Submit Project
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;