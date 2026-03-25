import { useEffect, useState } from "react";
import { BookOpen, Clock, Tag, IndianRupee, FileText, XCircle, Send, Layers, Star, Users, CheckCircle } from "lucide-react";

const API_URL = "https://hilearnlmstool-production.up.railway.app/api/courses";

const AddEditCourse = ({ onCoursesChange, editData, clearEdit }) => {
  const initialState = {
    title: "",
    description: "",
    price: "",
    duration: "",
    category: "general",
    rating: "4.5",
    studentCount: "",
    features: ""
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        price: editData.price || "",
        duration: editData.duration || "",
        category: editData.category || "general",
        rating: editData.rating || "4.5",
        studentCount: editData.studentCount || "",
        features: editData.features ? editData.features.join(", ") : "",
      });

      document.body.style.overflow = 'hidden';
    } else {
      setForm(initialState);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedForm = {
      ...form,
      features: typeof form.features === 'string'
        ? form.features.split(",").map(item => item.trim()).filter(i => i !== "")
        : form.features
    };
    try {
      const token = localStorage.getItem("token");
      const url = editData ? `${API_URL}/${editData._id}` : API_URL;

      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        if (onCoursesChange) await onCoursesChange();
        if (!editData) setForm(initialState);
        if (editData) clearEdit();
        alert(editData ? "🎉 Course Updated!" : "🚀 Course Published!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const wrapperClass = editData
    ? "fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    : "relative mb-8";

  const containerClass = editData
    ? "bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
    : "bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 relative mb-8";

  return (
    <div className={wrapperClass}>
      <div className={containerClass}>

        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#059669]">
              {editData ? "Update Course" : "Add New Course"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {editData ? "Modify course details and save changes" : "Fill in the details to publish your course"}
            </p>
          </div>

          {editData && (
            <button
              onClick={clearEdit}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            >
              <XCircle size={28} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

          {/* Course Title */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <BookOpen size={14} className="text-[#059669]" /> Course Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Full Stack Web Development"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-[#059669]/10 focus:border-[#059669] outline-none transition-all font-medium text-sm"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-[#059669]" /> Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-[#059669]/10 focus:border-[#059669] outline-none transition-all cursor-pointer font-medium text-sm"
            >
              <option value="general">General</option>
              <option value="frontend">Frontend Development</option>
              <option value="backend">Backend Development</option>
              <option value="database">Database Systems</option>
              <option value="fullstack">Fullstack Development</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <IndianRupee size={14} className="text-[#059669]" /> Price (INR)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="999"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-[#059669]/10 focus:border-[#059669] outline-none transition-all font-medium text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2"><Star size={14} className="text-yellow-500" /> Rating</label>
            <input type="number" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.8" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2"><Users size={14} className="text-[#059669]" /> Student Count</label>
            <input type="text" value={form.studentCount} onChange={(e) => setForm({ ...form, studentCount: e.target.value })} placeholder="2,500+" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase flex items-center gap-2"><CheckCircle size={14} className="text-[#059669]" /> Key Features (Comma separated)</label>
            <input type="text" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Python, Machine Learning, Deep Learning" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} className="text-[#059669]" /> Duration
            </label>
            <input
              name="duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="e.g. 3 Months"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-[#059669]/10 focus:border-[#059669] outline-none transition-all font-medium text-sm"
            />
          </div>

          {/* Access Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <Tag size={14} className="text-[#059669]" /> Access Level
            </label>
            <select className="w-full bg-slate-100 border border-slate-200 text-slate-400 p-3.5 rounded-xl outline-none font-medium cursor-not-allowed text-sm" disabled>
              <option>Standard Access</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-[#059669]" /> Course Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Briefly explain what this course covers..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3.5 rounded-xl focus:ring-2 focus:ring-[#059669]/10 focus:border-[#059669] outline-none transition-all h-32 resize-none font-medium text-sm"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-[#059669] hover:bg-[#047857] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-50 active:scale-[0.98] disabled:bg-emerald-200 mt-2"
          >
            {loading ? (
              <span className="animate-pulse text-sm font-bold uppercase tracking-widest">Saving Changes...</span>
            ) : (
              <>
                <span className="text-sm font-bold uppercase tracking-widest">
                  {editData ? "Update Course Details" : "Publish Course"}
                </span>
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditCourse;