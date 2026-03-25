
import React, { useState, useEffect } from "react";
import { Megaphone, Send, Trash2, CheckCircle2, Loader2, Calendar, BellRing } from "lucide-react";
import axios from "axios";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const [isFetching, setIsFetching] = useState(true);

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Announcements</h1>
        <p className="text-slate-500 font-medium">Manage and broadcast important updates to your students.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Post Form (40% width) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 sticky top-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <BellRing size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">New Broadcast</h3>
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Send update to everyone</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Announcement Subject</label>
                <input
                  type="text"
                  required
                  className="w-full mt-2 p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold text-slate-700 placeholder:text-slate-400"
                  placeholder="e.g. New Batch Starting Monday"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Message Content</label>
                <textarea
                  required
                  rows="6"
                  className="w-full mt-2 p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-600 resize-none placeholder:text-slate-400"
                  placeholder="Describe the update in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {status.success && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 p-4 rounded-2xl text-sm font-bold animate-pulse">
                  <CheckCircle2 size={18} /> BROADCASTED SUCCESSFULLY!
                </div>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {status.loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Post Announcement</>}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: Management List (60% width) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">History</h3>
              <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">
                {announcements.length} TOTAL
              </span>
            </div>

            <div className="space-y-4">
              {isFetching ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-emerald-500 mb-2" size={40} />
                  <p className="text-slate-400 font-medium">Loading history...</p>
                </div>
              ) : announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div key={ann._id} className="p-6 border border-slate-50 bg-slate-50/50 rounded-[24px] group hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <h4 className="font-bold text-slate-800 text-base">{ann.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 font-bold mb-3">
                          <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(ann.createdAt).toLocaleDateString()}</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-slate-100">By Admin</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">{ann.description}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(ann._id)}
                        className="ml-4 p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-2xl transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 border-2 border-dashed border-emerald-50 rounded-[40px]">
                  <Megaphone className="mx-auto text-emerald-100 mb-4" size={64} />
                  <p className="text-slate-400 font-bold">No announcements posted yet.</p>
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
