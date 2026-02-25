import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getStudents,
    deleteStudent,
    toggleStudentStatus,
} from "../../../../services/adminService";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const res = await getStudents();
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await deleteStudent(id);
            fetchStudents();
        } catch (err) {
            alert("Failed to delete student");
        }
    };

    const handleStatusToggle = async (student) => {
        try {
            setStudents((prev) =>
                prev.map((s) => s._id === student._id ? { ...s, isActive: !s.isActive } : s)
            );
            await toggleStudentStatus(student._id);
        } catch (err) {
            alert("Failed to update status");
            fetchStudents();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#059669]">Manage Students</h1>
                <button onClick={() => navigate("/admin/students/add")} className="px-6 py-2 rounded-2xl font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-md transition-all">
                    ADD STUDENT
                </button>
            </div>

            {loading ? (
                <p className="text-[#059669] font-bold">Loading students...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="w-full text-sm">
                        <thead className="bg-[#059669] text-white">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="text-left">Email</th>
                                <th className="text-left">Status</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student._id} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {student.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="flex gap-4 justify-center py-4">
                                        <button onClick={() => navigate(`/admin/students/edit/${student._id}`)} className="text-[#059669] font-bold hover:underline">Edit</button>
                                        <button onClick={() => handleStatusToggle(student)} className={`relative w-10 h-5 flex items-center rounded-full transition-colors ${student.isActive ? "bg-green-500" : "bg-red-500"}`}>
                                            <span className="absolute h-3 w-3 rounded-full bg-white shadow transition-all" style={{ left: student.isActive ? "22px" : "5px" }} />
                                        </button>
                                        <button onClick={() => handleDelete(student._id)} className="text-red-600 font-bold hover:underline">Delete</button>
                                        <button onClick={() => navigate(`/admin/students/${student._id}`)} className="text-gray-600 font-bold hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentList;