import React, { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, BookOpen, Calendar, MessageSquareText, Star, Trash2 } from "lucide-react";

const EnquiryList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:5000/api/admin/contact/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setLeads(leads.filter(lead => lead._id !== id));
          alert("Lead successfully deleted!");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete the lead. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/contact/leads", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setLeads(response.data.leads);
        }
      } catch (error) {
        console.error("Leads Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads()
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Student Enquiries</h2>
        <div className="bg-emerald-100 text-[#059669] px-4 py-2 rounded-2xl text-sm font-bold shadow-sm">
          {leads.length} Total Leads
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Student</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Course</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Message</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400 animate-pulse">Fetching enquiries...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-slate-400">Abhi tak koi inquiry nahi aayi hai.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-emerald-50/20 transition-all group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-700 text-base">{lead.name}</div>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail size={12} className="text-[#059669]" /> {lead.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone size={12} className="text-[#059669]" /> {lead.phone}
                        </span>
                        {lead.rating > 0 && (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit mt-1">
                            <Star size={12} fill="currentColor" /> {lead.rating} Stars
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold">
                        <BookOpen size={14} /> {lead.course}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MessageSquareText size={16} className="text-slate-300 mt-1 flex-shrink-0" />
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{lead.message}"</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Calendar size={14} />
                        {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    {/* --- ACTION COLUMN --- */}
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Lead"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryList;