import React, { useEffect, useState } from "react";
import { 
    getStudents, 
    deleteStudent, 
    toggleStudentStatus, 
    addStudent, 
    updateStudent, 
    getStudentDetails 
} from "../../../services/adminService"; 

const SuperAdminStudentManager = () => {
    // States for Navigation and Data
    const [view, setView] = useState("list"); 
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });

    
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await getStudents();
           
            setStudents(res.data.data || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (view === "list") fetchStudents();
    }, [view]);

    
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (view === "edit") {
                await updateStudent(selectedStudent._id, formData);
            } else {
                await addStudent(formData);
            }
            setView("list");
            setFormData({ name: "", email: "", mobile: "", password: "" });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save student");
        }
    };

    const openEdit = (student) => {
        setSelectedStudent(student);
        setFormData({ 
            name: student.name, 
            email: student.email, 
            mobile: student.mobile || "", 
            password: "" 
        });
        setView("edit");
    };

    const openDetails = async (id) => {
        setLoading(true);
        try {
            const res = await getStudentDetails(id);
            setSelectedStudent(res.data.student);
            setView("details");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

  
    const renderList = () => (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#059669]">Super Admin: Students List</h1>
                <button onClick={() => { setFormData({ name: "", email: "", mobile: "", password: "" }); setView("add"); }} className="px-6 py-2 rounded-2xl font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-md transition-all">
                    ADD STUDENT
                </button>
            </div>
            {loading ? <p className="text-[#059669] font-bold">Loading students...</p> : (
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
                                        <button onClick={() => openEdit(student)} className="text-[#059669] font-bold hover:underline">Edit</button>
                                        <button onClick={() => handleStatusToggle(student)} className={`relative w-10 h-5 flex items-center rounded-full transition-colors ${student.isActive ? "bg-green-500" : "bg-red-500"}`}>
                                            <span className="absolute h-3 w-3 rounded-full bg-white shadow transition-all" style={{ left: student.isActive ? "22px" : "5px" }} />
                                        </button>
                                        <button onClick={() => handleDelete(student._id)} className="text-red-600 font-bold hover:underline">Delete</button>
                                        <button onClick={() => openDetails(student._id)} className="text-gray-600 font-bold hover:underline">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    // --- ADD/EDIT VIEW ---
    const renderForm = () => (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-[#059669]">{view === "edit" ? "Edit Student" : "Add Student"}</h1>
            <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
                <input name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required />
                <input name="email" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required />
                <input name="password" type="password" placeholder={view === "edit" ? "New password (optional)" : "Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required={view === "add"} />
                <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border p-3 rounded focus:border-[#059669] outline-none" />
                <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-[#059669] text-white py-3 rounded font-semibold hover:bg-[#047857]">{view === "edit" ? "Update" : "Add Student"}</button>
                    <button type="button" onClick={() => setView("list")} className="flex-1 border py-3 rounded font-semibold hover:bg-gray-50">Cancel</button>
                </div>
            </form>
        </div>
    );

    // --- DETAILS VIEW ---
    const renderDetails = () => (
        <div className="p-6 max-w-xl mx-auto">
            {loading ? <p className="font-bold text-[#059669]">Loading...</p> : selectedStudent && (
                <div className="bg-white p-6 rounded-xl shadow border-t-4 border-[#059669]">
                    <h2 className="text-xl font-bold mb-6">Student Information</h2>
                    <div className="space-y-4">
                        <p><b>Name:</b> {selectedStudent.name}</p>
                        <p><b>Email:</b> {selectedStudent.email}</p>
                        <p><b>Mobile:</b> {selectedStudent.mobile || "N/A"}</p>
                        <p><b>Role:</b> {selectedStudent.role}</p>
                        <p><b>Status:</b> <span className={selectedStudent.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{selectedStudent.isActive ? "Active" : "Inactive"}</span></p>
                    </div>
                    <button onClick={() => setView("list")} className="mt-8 w-full bg-gray-100 py-2 rounded font-bold hover:bg-gray-200 text-gray-700">Back to List</button>
                </div>
            )}
        </div>
    );

   
    return (
        <div className="min-h-screen bg-gray-50">
            {view === "list" && renderList()}
            {(view === "add" || view === "edit") && renderForm()}
            {view === "details" && renderDetails()}
        </div>
    );
};

export default SuperAdminStudentManager;