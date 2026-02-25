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
  AlertCircle
} from "lucide-react";

const MentorDoubt = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState(null); 
  const [answer, setAnswer] = useState("");
  const [answerImage, setAnswerImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDoubts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/doubts/mentor-list", {
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

  const handleResolve = async () => {
    if (!answer.trim()) return alert("Please provide a detailed solution before submitting");
    setSubmitting(true);
    const formData = new FormData();
    formData.append("doubtId", selectedDoubt._id);
    formData.append("answer", answer);
    if (answerImage) formData.append("image", answerImage);

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/doubts/resolve", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      alert("Doubt Resolved!");
      setSelectedDoubt(null); setAnswer(""); setAnswerImage(null);
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
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen text-slate-800 font-sans">
      
      {/* Dashboard Stats Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-emerald-600" /> Mentor Panel
          </h1>
          <p className="text-2x1 font-bold text-emerald-600  tracking-widest mt-1">Student Query Management System</p>
        </div>
        
        <div className="flex gap-3">
          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[110px]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Cases</p>
            <p className="text-xl font-black text-slate-800">{totalDoubts}</p>
          </div>
          <div className="px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 text-center min-w-[110px]">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Pending</p>
            <p className="text-xl font-black text-orange-600">{pendingDoubts}</p>
          </div>
          <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center min-w-[110px]">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Resolved</p>
            <p className="text-xl font-black text-emerald-700">{resolvedDoubts}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-slate-300 uppercase tracking-widest">Loading Inbox...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doubts.map((d) => (
            <div key={d._id} className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-center mb-5">
                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  d.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {d.status}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Calendar size={12}/> {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Student Name</p>
                <h3 className="font-bold text-slate-800 text-lg">{d.studentId?.name || "Student"}</h3>
              </div>

              <p className="text-slate-500 text-sm line-clamp-2 font-medium mb-6 italic">"{d.question}"</p>

              <button 
                onClick={() => setSelectedDoubt(d)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[2px] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 mt-auto"
              >
                <Eye size={16} /> Show Doubt
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL (Resolve Doubt) --- */}
      {selectedDoubt && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center px-8">
              <h2 className="font-black text-slate-800 uppercase tracking-tight">Doubt Detail View</h2>
              <button onClick={() => {setSelectedDoubt(null); setAnswer("");}} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto">
              {/* Question Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <AlertCircle size={18} />
                  <label className="text-[11px] font-black uppercase tracking-widest">Question Information</label>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                  <p className="text-slate-800 font-bold text-lg leading-relaxed mb-4">{selectedDoubt.question}</p>
                  
                  {/* ATTACHMENT BOX  */}
                  {selectedDoubt.image && (
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 w-fit">
                      <img 
                        src={`http://localhost:5000${selectedDoubt.image}`} 
                        className="w-16 h-16 object-cover rounded-xl border-2 border-slate-50 shadow-sm" 
                        alt="student-attachment" 
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Student Attachment</p>
                        <a 
                          href={`http://localhost:5000${selectedDoubt.image}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[11px] text-emerald-600 font-black uppercase hover:underline flex items-center gap-1 mt-1"
                        >
                          View Full Image <ExternalLink size={12}/>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Resolution Form */}
              <div className="space-y-4 pt-4 border-t border-dashed border-slate-200">
                <label className="text-[11px] font-black text-emerald-600 uppercase tracking-widest block">Write Your Solution</label>
                <textarea 
                  className="w-full p-6 bg-white border-2 border-slate-100 rounded-[24px] focus:border-emerald-500 outline-none transition-all font-medium min-h-[150px] text-slate-700 shadow-inner"
                  placeholder="Explain the solution clearly..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-center justify-between px-6 py-4 bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-2xl cursor-pointer hover:border-emerald-500 transition-all group">
                    <span className="text-sm font-bold text-emerald-700 truncate">
                      {answerImage ? answerImage.name : "Upload Solution Image (Optional)"}
                    </span>
                    <ImageIcon className="text-emerald-400 group-hover:text-emerald-600" size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAnswerImage(e.target.files[0])} />
                  </label>
                  
                  {answerImage && (
                    <button onClick={() => setAnswerImage(null)} className="px-4 py-2 text-[10px] font-black uppercase text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">Cancel Image</button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t bg-slate-50 flex gap-4">
               <button 
                onClick={handleResolve}
                disabled={submitting}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[2px] hover:bg-slate-900 shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {submitting ? "Processing..." : "Submit Solution"} <Send size={18} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDoubt;