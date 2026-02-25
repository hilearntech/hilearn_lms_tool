import { useEffect, useState } from "react";
import {
    getAdmins,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
} from "../../../services/adminService";

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
    });

    const loadAdmins = async () => {
        try {
            const res = await getAdmins();

            if (res.data && res.data.data) {
                setAdmins(res.data.data);
            } else {
                setAdmins([]);
            }
        } catch (err) {
            console.error("Error loading admins:", err);
            setAdmins([]);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateAdmin(editId, form);
            } else {
                await addAdmin(form);
            }
            setShowModal(false);
            setEditId(null);
            setForm({ name: "", email: "", password: "", mobile: "" });
            loadAdmins();
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (a) => {
        setEditId(a._id);
        setForm({
            name: a.name,
            email: a.email,
            mobile: a.mobile || "",
            password: "",
        });
        setShowModal(true);
    };


    const handleToggleStatus = async (admin) => {
        try {
            setTogglingId(admin._id);

            setAdmins((prev) =>
                prev.map((a) =>
                    a._id === admin._id ? { ...a, isActive: !a.isActive } : a
                )
            );
            await toggleAdminStatus(admin._id);
        } catch (err) {
            console.error(err);
            loadAdmins();
        } finally {
            setTogglingId(null);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this admin?")) return;
        await deleteAdmin(id);
        loadAdmins();
    };

    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                    Manage Admins
                </h2>
                <button
                    onClick={() => {
                        setEditId(null);
                        setForm({ name: "", email: "", password: "", mobile: "" });
                        setShowModal(true);
                    }}
                    className="px-5 py-2 bg-[#059669] text-white rounded-xl shadow hover:bg-[#047857]"
                >
                    + Add Admin
                </button>
            </div>


            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-[#059669] text-white">
                        <tr>
                            <th className="p-3 text-left">Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((a) => (
                            <tr key={a._id} className="border-t">
                                <td className="p-3">{a.name}</td>
                                <td>{a.email}</td>
                                <td>{a.mobile || "-"}</td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${a.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {a.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <button
                                            disabled={togglingId === a._id}
                                            onClick={() => handleToggleStatus(a)}
                                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${a.isActive ? "bg-green-500" : "bg-gray-300"} ${togglingId === a._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${a.isActive ? "translate-x-3" : "translate-x-0.5"}`} />
                                        </button>
                                    </div>
                                </td>
                                <td className="text-center space-x-4">
                                    <button onClick={() => handleEdit(a)} className="text-[#059669] hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(a._id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-6 text-gray-500">No admins found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl">
                        <h3 className="font-semibold text-lg">{editId ? "Edit Admin" : "Add Admin"}</h3>
                        <input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="border w-full p-3 rounded outline-none focus:border-[#059669]"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            className="border w-full p-3 rounded outline-none focus:border-[#059669]"
                        />
                        {!editId && (
                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="border w-full p-3 rounded outline-none focus:border-[#059669]"
                            />
                        )}
                        <input
                            placeholder="Mobile"
                            value={form.mobile}
                            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                            className="border w-full p-3 rounded outline-none focus:border-[#059669]"
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button className="bg-[#059669] text-white px-4 py-2 rounded">Save</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminList;