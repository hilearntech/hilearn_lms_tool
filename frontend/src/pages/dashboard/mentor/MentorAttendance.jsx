import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, RefreshCw, Loader2, CheckCircle, XCircle } from "lucide-react";

const ManageAttendance = () => {
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [filtering, setFiltering] = useState(false);

  
  const fetchMentorLectures = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/mentor/my-assigned-lectures", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setLectures(res.data.lectures);
    } catch (err) {
      console.error("Lecture Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchMentorLectures(); }, []);


  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedLecture) return setStudents([]);
      setFiltering(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/attendance/filtered-students/${selectedLecture}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStudents(res.data.students);
          setAttendance({});
        }
      } catch (err) {
        setStudents([]);
      } finally {
        setFiltering(false);
      }
    };
    fetchStudents();
  }, [selectedLecture]);

  const handleStatusChange = (id, status) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] || "absent"
      }));

      await axios.post("http://localhost:5000/api/attendance/bulk",
        { lectureId: selectedLecture, attendanceData: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );



      alert("Attendance records updated successfully! ✅");


      setSelectedLecture("");
      setStudents([]);
      setAttendance({});


    } catch (err) {
      alert("Error saving attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Attendance Desk</h2>
          <p className="text-slate-500 font-medium">Mark presence for your assigned sessions</p>
        </div>
        <button onClick={fetchMentorLectures} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
          <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-emerald-600 p-8 rounded-[32px] mb-8 shadow-xl shadow-emerald-100">
        <label className="text-emerald-100 text-[10px] font-black uppercase tracking-widest mb-3 block">Choose Lecture Session</label>
        <select
          className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-white font-bold outline-none focus:bg-white/20 transition-all cursor-pointer"
          value={selectedLecture}
          onChange={(e) => setSelectedLecture(e.target.value)}
        >
          <option className="text-slate-800" value="">Select a session from your list...</option>
          {lectures.map(l => <option className="text-slate-800" key={l._id} value={l._id}>{l.title}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-left text-[11px] font-black text-slate-400 uppercase">Student Profile</th>
              <th className="px-8 py-6 text-center text-[11px] font-black text-slate-400 uppercase">Current Status</th>
              <th className="px-8 py-6 text-right text-[11px] font-black text-slate-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtering ? (
              <tr><td colSpan="3" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
            ) : students.length > 0 ? (
              students.map(student => (
                <tr key={student._id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 font-bold text-slate-700">{student.name}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${attendance[student._id] === 'present' ? 'bg-emerald-100 text-emerald-600' :
                        attendance[student._id] === 'absent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {attendance[student._id] || "Marking Pending"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusChange(student._id, 'present')}
                        className={`p-2 rounded-xl border transition-all ${attendance[student._id] === 'present' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-500'}`}
                      ><CheckCircle size={20} /></button>
                      <button
                        onClick={() => handleStatusChange(student._id, 'absent')}
                        className={`p-2 rounded-xl border transition-all ${attendance[student._id] === 'absent' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-300 hover:border-red-500'}`}
                      ><XCircle size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="3" className="py-20 text-center text-slate-400 font-bold">No students found for this session.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveAttendance}
          disabled={!selectedLecture || loading || students.length === 0}
          className="bg-slate-900 text-white px-12 py-4 rounded-[20px] font-black text-sm flex items-center gap-3 hover:bg-[#059669] transition-all disabled:opacity-50 active:scale-95 shadow-2xl shadow-slate-200"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          SAVE ATTENDANCE RECORDS
        </button>
      </div>
    </div>
  );
};

export default ManageAttendance;