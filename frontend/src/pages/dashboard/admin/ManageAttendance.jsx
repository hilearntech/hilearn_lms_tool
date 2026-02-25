import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Users, RefreshCw, Loader2 } from "lucide-react";

const ManageAttendance = () => {
  const [students, setStudents] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [filtering, setFiltering] = useState(false); 

  
  const fetchInitialData = async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const resLectures = await axios.get("http://localhost:5000/api/lectures", config);

      let finalLectures = [];
      if (resLectures.data.success && resLectures.data.lectures) {
        finalLectures = resLectures.data.lectures;
      } else if (Array.isArray(resLectures.data)) {
        finalLectures = resLectures.data;
      }
      setLectures(finalLectures);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  
  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      if (!selectedLecture) {
        setStudents([]);
        return;
      }

      setFiltering(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        
        const res = await axios.get(`http://localhost:5000/api/attendance/filtered-students/${selectedLecture}`, config);
        
        if (res.data.success) {
          setStudents(res.data.students);
          setAttendance({});
        }
      } catch (err) {
        console.error("Filter Error:", err);
        setStudents([]);
      } finally {
        setFiltering(false);
      }
    };

    fetchEnrolledStudents();
  }, [selectedLecture]);

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status.toLowerCase() }));
  };

  const saveAttendance = async () => {
    if (!selectedLecture) return alert("Pehle session select karein!");
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const attendanceData = students.map(s => ({
        studentId: s._id,
        status: attendance[s._id] ? attendance[s._id].toLowerCase() : "absent"
      }));

      await axios.post("http://localhost:5000/api/attendance/bulk", {
        lectureId: selectedLecture,
        attendanceData: attendanceData
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("Attendance saved successfully! ✅");
      
      // Cleanup
      setAttendance({});
      setSelectedLecture("");
      fetchInitialData();

    } catch (err) {
      alert(`Error: ${err.response?.data?.message || "Attendance save nahi ho saki."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#059669] mb-1">Manage Attendance</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Filtered by Enrollment</p>
      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Active Session</label>
            <select 
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#059669] outline-none"
              value={selectedLecture}
              onChange={(e) => setSelectedLecture(e.target.value)}
            >
              <option value="">-- Choose a Lecture --</option>
              {lectures.map((l) => (
                <option key={l._id} value={l._id}>{l.title}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={fetchInitialData} 
                className="p-3 bg-white border border-slate-300 text-slate-500 hover:text-[#059669] rounded-lg transition-all"
            >
                <RefreshCw size={18} className={fetching ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={saveAttendance} 
              disabled={loading || !selectedLecture || students.length === 0}
              className={`flex-1 px-8 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                !selectedLecture 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-[#059669] text-white hover:bg-[#047857] shadow-lg shadow-emerald-100"
              }`}
            >
              <Save size={18} /> {loading ? "Saving..." : "Submit Records"}
            </button>
          </div>
        </div>
      </div>

      <div className={`overflow-hidden rounded-xl border border-slate-200 shadow-sm ${!selectedLecture ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}`}>
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#059669] text-white">
            <tr>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Current Status</th>
              <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {filtering ? (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-emerald-500" size={24} />
                    <p className="text-slate-400 text-sm font-bold">Filtering Enrolled Students...</p>
                  </div>
                </td>
              </tr>
            ) : students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-semibold capitalize">{student.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                      attendance[student._id] === "present" ? "bg-emerald-100 text-emerald-600" : 
                      attendance[student._id] === "absent" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      {attendance[student._id] || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleStatusChange(student._id, "present")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                          attendance[student._id] === "present" 
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-md" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-emerald-500 hover:text-emerald-500"
                        }`}
                      >PRESENT</button>
                      <button 
                        onClick={() => handleStatusChange(student._id, "absent")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                          attendance[student._id] === "absent" 
                          ? "bg-red-500 text-white border-red-500 shadow-md" 
                          : "bg-white text-slate-400 border-slate-200 hover:border-red-500 hover:text-red-500"
                        }`}
                      >ABSENT</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-10 text-center text-slate-400 font-medium">
                  {selectedLecture ? "No students found who bought this course." : "Select a lecture to view students."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageAttendance;