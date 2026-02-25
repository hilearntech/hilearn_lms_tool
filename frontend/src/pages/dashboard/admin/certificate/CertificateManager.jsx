import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Search, Upload, CheckCircle, ExternalLink } from "lucide-react";

const CertificateManager = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [certData, setCertData] = useState({ title: "", url: "" });

    useEffect(() => { fetchStudentData(); }, []);

    const fetchStudentData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/admin/students-list", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data.data);
        } catch (err) { console.error("Error fetching students"); }
    };

    const handleIssueCert = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/admin/issue-certificate", {
                studentId: selectedStudent._id,
                courseId: selectedStudent.enrolledCourses[0]?._id,
                title: certData.title,
                url: certData.url
            }, { headers: { Authorization: `Bearer ${token}` } });

            alert("Success: Certificate has been issued!");
            setIsModalOpen(false);
            fetchStudentData();
        } catch (err) { alert("Error issuing certificate"); }
    };

    // Filter logic for 200-300 students
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#059669]">Certificate Console</h1>
                    <p className="text-slate-400 text-1x1 font-bold ">Manage and issue credentials to students</p>
                </div>

                {/* Search Bar for scalability */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500">
                            <th className="px-6 py-4 font-bold">Student</th>
                            <th className="px-6 py-4 font-bold">Enrolled Course</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredStudents.map(student => (
                            <tr key={student._id} className="hover:bg-slate-50/50 transition-all">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-700">{student.name}</p>
                                    <p className="text-xs text-slate-400">{student.email}</p>
                                </td>



                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
                                            student.enrolledCourses.map((course, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                                                    {course.title}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 italic text-xs">N/A</span>
                                        )}
                                    </div>
                                </td>



                                <td className="px-6 py-4">
                                    {student.certificates?.length > 0 ? (
                                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full w-fit">
                                            <CheckCircle size={12} /> Issued
                                        </span>
                                    ) : (
                                        <span className="text-amber-500 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => { setSelectedStudent(student); setIsModalOpen(true); }}
                                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-slate-200"
                                    >
                                        <Upload size={14} /> {student.certificates?.length > 0 ? "Re-issue" : "Issue Cert"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- UPLOAD MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-2">Issue Credential</h2>
                        <p className="text-sm text-slate-500 mb-6">Issuing for: <span className="font-bold text-slate-800">{selectedStudent?.name}</span></p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificate Title</label>
                                <input
                                    type="text"
                                    className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                    placeholder="e.g. Full Stack Web Development"
                                    onChange={(e) => setCertData({ ...certData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canva / Link URL</label>
                                <input
                                    type="text"
                                    className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-emerald-500 transition-all"
                                    placeholder="https://canva.com/design/..."
                                    onChange={(e) => setCertData({ ...certData, url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">Cancel</button>
                            <button onClick={handleIssueCert} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-emerald-100">Confirm & Issue</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateManager;