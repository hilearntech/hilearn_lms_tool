import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircle, ClipboardList, ExternalLink, Trash2,
  Edit3, Eye, X, Image as ImageIcon, Calendar, CheckSquare, Clock
} from "lucide-react";

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", course: "", deadline: "" });
  const [assignmentImage, setAssignmentImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [evaluation, setEvaluation] = useState({});
  const [viewingAssignment, setViewingAssignment] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [assignRes, lectureRes] = await Promise.all([
        axios.get("http://https://hilearnlmstool-production.up.railway.app/api/mentor/assignments", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-lectures", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setAssignments(assignRes.data.data);
      const uniqueCourses = Array.from(new Set(lectureRes.data.lectures.map(l => JSON.stringify(l.course))));
      setCourses(uniqueCourses.map(c => JSON.parse(c)));
    } catch (err) { console.error(err); }
  };

  const totalTasks = assignments.length;

  const pendingReviews = assignments.reduce((acc, curr) => {
    const unreviewedCount = curr.submissions.filter(s => {

      if (!s.grade) return true;


      const gradeVal = s.grade.toString().trim().toLowerCase();


      return gradeVal === "" || gradeVal === "not graded";
    }).length;

    return acc + unreviewedCount;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("course", formData.course);
    data.append("deadline", formData.deadline);
    if (assignmentImage) data.append("image", assignmentImage);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await axios.put(`http://https://hilearnlmstool-production.up.railway.app/api/mentor/update-assignment/${editingId}`, data, config);
      } else {
        await axios.post("http://https://hilearnlmstool-production.up.railway.app/api/mentor/create-assignment", data, config);
      }

      resetForm();
      fetchData();
      alert("Success!");
    } catch (err) { alert("Error saving assignment"); }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({ title: "", description: "", course: "", deadline: "" });
    setAssignmentImage(null);
  };

  const startEdit = (assign) => {
    setEditingId(assign._id);
    setFormData({
      title: assign.title,
      description: assign.description,
      course: assign.course?._id || "",
      deadline: assign.deadline ? assign.deadline.split('T')[0] : ""
    });
    setShowForm(true);
  };

  const handleEvaluate = async (assignmentId, studentId) => {
    const key = `${assignmentId}-${studentId}`;
    const data = evaluation[key] || assignments.find(a => a._id === assignmentId)?.submissions.find(s => s.student?._id === studentId);
    if (!data?.grade) return alert("Enter grade");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://https://hilearnlmstool-production.up.railway.app/api/mentor/evaluate-assignment", {
        assignmentId, studentId, grade: data.grade, feedback: data.feedback || ""
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Saved!");
      fetchData();
    } catch (err) { alert("Error saving"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this assignment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://https://hilearnlmstool-production.up.railway.app/api/mentor/delete-assignment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) { alert("Error deleting"); }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen bg-white font-sans text-slate-900">

      {/* HEADER WITH STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Assignment Console</h1>
          <p className="text-2x1 font-bold text-emerald-600  tracking-widest mt-1">Manage Tasks & Evaluate Students</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="hidden sm:flex gap-3 mr-2">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
              <CheckSquare size={16} className="text-emerald-600" />
              <span className="text-sm font-bold text-emerald-900">{totalTasks} Tasks</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
              <Clock size={16} className="text-amber-600" />
              <span className="text-sm font-bold text-amber-900">{pendingReviews} Pending</span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex-1 md:flex-none bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <PlusCircle size={18} /> New Task
          </button>
        </div>
      </div>

      {/* ACTIVE ASSIGNMENTS LIST */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[3px] flex items-center gap-2">
          <ClipboardList size={16} /> Active Assignments
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {assignments.map((assign) => (
            <div key={assign._id} className="bg-white border-2 border-slate-50 rounded-[32px] overflow-hidden shadow-sm hover:border-emerald-100 transition-all">
              <div className="bg-slate-50/60 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 text-emerald-600 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-none">{assign.title}</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5">{assign.course?.title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewingAssignment(assign)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Eye size={18} /></button>
                  <button onClick={() => startEdit(assign)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(assign._id)} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {assign.submissions.map((sub) => {
                  const isGraded = sub.grade && sub.grade.trim() !== "";
                  const currentEval = evaluation[`${assign._id}-${sub.student?._id}`] || { grade: sub.grade || "", feedback: sub.feedback || "" };

                  return (
                    <div key={sub.student?._id} className="bg-slate-50/40 border border-slate-100 p-4 rounded-3xl flex flex-col lg:flex-row items-center gap-6 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 w-full lg:w-1/4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${isGraded ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{sub.student?.name?.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-slate-700 truncate text-sm">{sub.student?.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 tracking-wider">ID: {sub.student?._id?.slice(-6)}</p>
                        </div>
                      </div>

                      <a href={sub.submissionLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-[10px] uppercase hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                        <ExternalLink size={14} /> Open Work
                      </a>

                      <div className="flex-1 flex gap-3 w-full">
                        <input className="text-xs p-4 border border-slate-200 rounded-[18px] w-full outline-none focus:border-emerald-500 bg-white shadow-inner" placeholder="Mentor Feedback..." value={currentEval.feedback} onChange={(e) => setEvaluation({ ...evaluation, [`${assign._id}-${sub.student?._id}`]: { ...currentEval, feedback: e.target.value } })} />
                        <input className="text-xs p-4 border border-slate-200 rounded-[18px] w-24 text-center outline-none focus:border-emerald-500 font-bold uppercase bg-white shadow-inner" placeholder="Grade" value={currentEval.grade} onChange={(e) => setEvaluation({ ...evaluation, [`${assign._id}-${sub.student?._id}`]: { ...currentEval, grade: e.target.value } })} />
                      </div>

                      <button onClick={() => handleEvaluate(assign._id, sub.student?._id)} className={`w-full lg:w-auto px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm ${isGraded ? 'bg-slate-900 text-white hover:bg-black' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                        {isGraded ? "Update" : "Submit Grade"}
                      </button>
                    </div>
                  );
                })}
                {assign.submissions.length === 0 && (
                  <div className="py-12 flex flex-col items-center text-slate-300">
                    <ClipboardList size={40} className="mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest italic opacity-40">No submissions yet</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- CREATE / EDIT MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="font-extrabold text-slate-900 text-xl tracking-tight">{editingId ? "Edit Assignment" : "Create New Task"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
            </div>

            <div className="overflow-y-auto p-8 pt-4 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Task Title</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[20px] font-semibold text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Deadline Date</label>
                    <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[20px] font-semibold text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Associated Course</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[20px] font-semibold text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm appearance-none" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} required>
                    <option value="">Choose Course...</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Detailed Description</label>
                  <textarea rows="4" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[24px] font-medium text-sm outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-sm resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-2">Reference Image (Optional)</label>
                  <label className="flex items-center justify-between p-5 bg-emerald-50/30 border-2 border-dashed border-emerald-100 rounded-[24px] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                    <span className="text-xs font-semibold text-emerald-700 truncate">{assignmentImage ? assignmentImage.name : "Click to upload helper image..."}</span>
                    <ImageIcon size={20} className="text-emerald-500" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setAssignmentImage(e.target.files[0])} />
                  </label>
                </div>

                <div className="pt-4 pb-4">
                  <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-bold uppercase tracking-widest hover:bg-slate-900 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98]">
                    {editingId ? "Save Changes" : "Publish Assignment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW DETAILS MODAL --- */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{viewingAssignment.title}</h2>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1.5">{viewingAssignment.course?.title}</p>
              </div>
              <button onClick={() => setViewingAssignment(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[24px] text-sm text-slate-600 font-medium leading-relaxed border border-slate-100">
                {viewingAssignment.description}
              </div>

              {viewingAssignment.image && (
                <div className="rounded-[24px] overflow-hidden border-4 border-white shadow-lg">
                  <img src={`http://https://hilearnlmstool-production.up.railway.app${viewingAssignment.image}`} className="w-full h-auto max-h-72 object-contain bg-white" alt="reference" />
                </div>
              )}

              <button onClick={() => setViewingAssignment(null)} className="w-full py-4 bg-slate-900 text-white rounded-[20px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
};

export default AssignmentManager;