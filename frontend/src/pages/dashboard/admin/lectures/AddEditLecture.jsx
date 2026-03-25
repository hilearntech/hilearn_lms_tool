import { useEffect, useState } from "react";
import { Send, LayoutGrid, Type, Link, Clock, AlignLeft, Layers, Calendar, VideoIcon, User } from "lucide-react";

const API = "http://https://hilearnlmstool-production.up.railway.app/api";

const AddEditLecture = ({ refreshLectures, editData, clearEdit }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isMentor = user?.role === "mentor" || user?.role === "faculty";

  const [courses, setCourses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", duration: "", course: "",
    videoID: "", libraryID: "592909",
    lectureType: "video", date: "", startTime: "", meetingLink: "",
    isPreviewFree: false,
    mentor: isMentor ? (user?._id || user?.id || "") : ""
  });

  useEffect(() => {
    fetch(`${API}/courses`, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => setCourses(data.courses || []))
      .catch(err => console.error("Course fetch error:", err));

    const courseFetchUrl = isMentor
      ? `http://https://hilearnlmstool-production.up.railway.app/api/mentor/my-courses`
      : `${API}/courses`;

    fetch(courseFetchUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        const fetchedCourses = data.courses || data.data || [];
        setCourses(fetchedCourses);
      })
      .catch(err => console.error("Course fetch error:", err));

    if (!isMentor) {
      fetch(`${API}/admin/faculties`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.faculties) setMentors(data.faculties);
          else if (Array.isArray(data)) setMentors(data);
        })
        .catch(err => console.error("Mentor fetch error:", err));
    }
  }, [isMentor, token]);

  useEffect(() => {
    if (editData) {
      const formattedDate = editData.date ? new Date(editData.date).toISOString().split('T')[0] : "";
      setForm({
        ...editData,
        course: editData.course?._id || editData.course,
        mentor: editData.mentor?._id || editData.mentor || (isMentor ? (user?._id || user?.id) : ""),
        date: formattedDate,
        videoID: editData.videoID || "",
        libraryID: editData.libraryID || "592909",
        isPreviewFree: editData.isPreviewFree || false
      });
    }
  }, [editData, isMentor, user?._id, user?.id]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editData ? `${API}/lectures/${editData._id}` : `${API}/lectures`;
    const method = editData ? "PUT" : "POST";
    const finalMentorId = isMentor ? (user?._id || user?.id) : form.mentor;

    if (!finalMentorId) {
      alert("Mentor ID is missing!");
      setLoading(false);
      return;
    }

    const payload = { ...form, mentor: finalMentorId };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Lecture saved successfully!");
        refreshLectures();
        clearEdit();
        setForm({
          title: "", description: "", duration: "", course: "",
          videoID: "", libraryID: "592909",
          lectureType: "video", date: "", startTime: "", meetingLink: "",
          mentor: isMentor ? (user?._id || user?.id) : ""
        });
      } else {
        alert("Error: " + (data.error || data.message));
      }
    } catch (err) { alert("Error saving lecture"); }
    finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <div className="p-2 bg-[#059669] rounded-lg text-white"><LayoutGrid size={20} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{editData ? "Update Lecture" : "Create New Lecture"}</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Content Editor</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Lecture Format</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['video', 'live', 'article', 'quiz'].map((type) => (
              <button key={type} type="button" onClick={() => setForm({ ...form, lectureType: type })}
                className={`p-3 rounded-xl border font-bold text-xs uppercase transition-all ${form.lectureType === type ? "bg-[#059669] text-white border-[#059669]" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                {type === 'video' ? '🎥 Video' : type === 'live' ? '🔴 Live' : type === 'article' ? '📄 Text' : '📝 Quiz'}
              </button>
            ))}
          </div>
        </div>

        {/* --- MENTOR ASSIGNMENT FOR ADMIN --- */}
        {!isMentor && (
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase mb-2"><User size={14} /> Assign Mentor/Faculty</label>
            <select
              value={form.mentor}
              onChange={(e) => setForm({ ...form, mentor: e.target.value })}
              required
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm"
            >
              <option value="">Choose Mentor...</option>
              {mentors.map((m) => <option key={m._id} value={m._id}>{m.name || m.username}</option>)}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase mb-2"><Layers size={14} /> Parent Course</label>
          <select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm">
            <option value="">Choose Course...</option>
            {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        {form.lectureType === 'video' && (
          <>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase mb-2"><VideoIcon size={14} /> Bunny Video ID</label>
              <input value={form.videoID} onChange={(e) => setForm({ ...form, videoID: e.target.value })} placeholder="e.g. d6413e14-..." className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase mb-2"><Layers size={14} /> Library ID</label>
              <input value={form.libraryID} onChange={(e) => setForm({ ...form, libraryID: e.target.value })} placeholder="592909" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase mb-2"><Type size={14} /> Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Lecture Title" required className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
        </div>

        {form.lectureType === 'live' && (
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
            <input value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} placeholder="10:30 AM" className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl" />
            <input className="md:col-span-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} placeholder="Meeting Link" />
          </div>
        )}

        <div className="md:col-span-2">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description..." rows="3" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm resize-none" />
        </div>

        <div className="md:col-span-2">
          <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (Mins)" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none text-sm" />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-2">
          <input
            type="checkbox"
            id="isPreviewFree"
            checked={form.isPreviewFree}
            onChange={(e) => setForm({ ...form, isPreviewFree: e.target.checked })}
            className="w-5 h-5 accent-[#059669] cursor-pointer"
          />
          <label htmlFor="isPreviewFree" className="cursor-pointer">
            <span className="block text-sm font-bold text-emerald-900">Mark as Demo Video</span>
            <span className="block text-[11px] text-emerald-600 font-medium">
              If checked, this lecture will be available for free preview to non-enrolled students.
            </span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="md:col-span-2 bg-[#059669] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all">
          {loading ? "SAVING..." : editData ? "UPDATE LECTURE" : "PUBLISH LECTURE"}
        </button>
      </form>
    </div>
  );
};

export default AddEditLecture;