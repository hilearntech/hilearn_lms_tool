import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, User, Clock, CheckCircle, Search, Trash2, Edit3, Eye, X, BookOpen, Save } from "lucide-react";

const AdminAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssign, setSelectedAssign] = useState(null); 
  const [editAssign, setEditAssign] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/admin/assignments-report", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will delete the assignment!")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://https://hilearnlmstool-production.up.railway.app/api/admin/delete-assignment/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(); 
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://https://hilearnlmstool-production.up.railway.app/api/admin/update-assignment/${editAssign._id}`, 
        { title: editAssign.title, description: editAssign.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditAssign(null);
      fetchData();
      alert("Assignment updated successfully!");
    } catch (err) {
      alert("Update failed.");
    }
  };

  const filteredAssignments = searchTerm.trim() === "" 
    ? [] 
    : assignments.filter(a => 
        (a.title?.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (a.mentor?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  if (loading) return <div className="p-8 text-[#059669] font-black text-center animate-pulse">Loading Monitor...</div>;

  return (
    <div className="space-y-8 relative font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <ClipboardList className="text-[#059669]" /> Assignment Control
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage all assignments with Emerald precision.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Mentor..." 
            className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold w-full md:w-80 outline-none focus:ring-2 ring-emerald-100 transition-all text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-6">
        {searchTerm.trim() === "" ? (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-400 font-bold">
            <User className="mx-auto mb-4 opacity-20" size={48} />
            Type a Mentor's name to manage assignments
          </div>
        ) : filteredAssignments.map((assign) => (
          <div key={assign._id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#059669] group-hover:scale-110 transition-transform">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">{assign.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                    <p className="text-xs font-bold text-[#059669] uppercase tracking-wider">Mentor: {assign.mentor?.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setSelectedAssign(assign)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-[#059669] transition-all" title="View"><Eye size={20} /></button>
                <button onClick={() => setEditAssign(assign)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-[#059669] transition-all" title="Edit"><Edit3 size={20} /></button>
                <button onClick={() => handleDelete(assign._id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all" title="Delete"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      {editAssign && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden p-8 border border-emerald-50">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-[#059669] rounded-lg"><Edit3 size={20}/></div>
                <h2 className="text-xl font-black text-slate-800">Edit Assignment</h2>
              </div>
              <button onClick={() => setEditAssign(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-[#059669] uppercase tracking-widest ml-1">Assignment Title</label>
                <input 
                  type="text" 
                  className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 ring-emerald-100 transition-all"
                  value={editAssign.title}
                  onChange={(e) => setEditAssign({...editAssign, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-[#059669] uppercase tracking-widest ml-1">Description / Instructions</label>
                <textarea 
                  rows="5"
                  className="w-full mt-2 p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 ring-emerald-100 transition-all"
                  value={editAssign.description}
                  onChange={(e) => setEditAssign({...editAssign, description: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-4 bg-[#059669] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#047857] shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]">
                <Save size={20} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

     
      {selectedAssign && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-10 border border-emerald-50">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedAssign.title}</h2>
                   <p className="text-[#059669] text-xs font-black uppercase mt-1 tracking-wider italic">Review Mode</p>
                </div>
                <button onClick={() => setSelectedAssign(null)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} className="text-slate-400"/></button>
             </div>
             <div className="bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50 font-medium text-slate-600 leading-relaxed mb-8 min-h-[150px]">
                {selectedAssign.description || "No description provided for this assignment."}
             </div>
             <div className="flex gap-4">
                <button onClick={() => setSelectedAssign(null)} className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition-all">Close Viewer</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssignments;