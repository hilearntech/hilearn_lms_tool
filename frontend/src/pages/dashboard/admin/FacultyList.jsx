// import { useEffect, useState } from "react";
// import {
//     getFaculties,
//     addFaculty,
//     updateFaculty,
//     deleteFaculty,
//     toggleFacultyStatus,
// } from "../../../services/adminService";

// const FacultyList = () => {
//     const [faculties, setFaculties] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [editId, setEditId] = useState(null);
//     const [togglingId, setTogglingId] = useState(null);

//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//         mobile: "",
//     });

//     const loadFaculties = async () => {
//         try {
//             const res = await getFaculties();
//             setFaculties(res.data);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         loadFaculties();
//     }, []);


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             if (editId) {
//                 await updateFaculty(editId, form);
//             } else {
//                 await addFaculty(form);
//             }

//             setShowModal(false);
//             setEditId(null);
//             setForm({ name: "", email: "", password: "", mobile: "" });
//             loadFaculties();
//         } catch (err) {
//             alert(err.response?.data?.message || "Something went wrong");
//         }
//     };


//     const handleEdit = (f) => {
//         setEditId(f._id);
//         setForm({
//             name: f.name,
//             email: f.email,
//             mobile: f.mobile || "",
//             password: "",
//         });
//         setShowModal(true);
//     };


//     const handleToggleStatus = async (faculty) => {
//         try {
//             setTogglingId(faculty._id);


//             setFaculties((prev) =>
//                 prev.map((f) =>
//                     f._id === faculty._id
//                         ? { ...f, isActive: !f.isActive }
//                         : f
//                 )
//             );

//             await toggleFacultyStatus(faculty._id);
//         } catch (err) {
//             console.error(err);
//             loadFaculties();
//         } finally {
//             setTogglingId(null);
//         }
//     };


//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this faculty?")) return;
//         await deleteFaculty(id);
//         loadFaculties();
//     };

//     return (
//         <div className="p-6">


//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-slate-800">
//                     Manage Faculties
//                 </h2>

//                 <button
//                     onClick={() => {
//                         setEditId(null);
//                         setForm({ name: "", email: "", password: "", mobile: "" });
//                         setShowModal(true);
//                     }}
//                     className="px-5 py-2 bg-[#059669] text-white rounded-xl shadow hover:bg-[#047857]"
//                 >
//                     + Add Faculty
//                 </button>
//             </div>


//             <div className="bg-white rounded-xl shadow overflow-hidden">
//                 <table className="w-full text-sm">
//                     <thead className="bg-[#059669] text-white">
//                         <tr>
//                             <th className="p-3 text-left">Name</th>
//                             <th>Email</th>
//                             <th>Mobile</th>
//                             <th>Status</th>
//                             <th className="text-center">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {faculties.map((f) => (
//                             <tr key={f._id} className="border-t">
//                                 <td className="p-3">{f.name}</td>
//                                 <td>{f.email}</td>
//                                 <td>{f.mobile || "-"}</td>



//                                 <td className="p-3">
//                                     <div className="flex items-center justify-center gap-4">
//                                         <span
//                                             className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${f.isActive
//                                                 ? "bg-green-100 text-green-700"
//                                                 : "bg-red-100 text-red-700"
//                                                 }`}
//                                         >
//                                             {f.isActive ? "Active" : "Inactive"}
//                                         </span>

//                                         <button
//                                             disabled={togglingId === f._id}
//                                             onClick={() => handleToggleStatus(f)}
//                                             className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${f.isActive ? "bg-green-500" : "bg-gray-300"
//                                                 } ${togglingId === f._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                                         >
//                                             <span
//                                                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${f.isActive ? "translate-x-3" : "translate-x-0.5"
//                                                     }`}
//                                             />
//                                         </button>
//                                     </div>
//                                 </td>

//                                 {/* ACTIONS */}
//                                 <td className="text-center space-x-4">
//                                     <button
//                                         onClick={() => handleEdit(f)}
//                                         className="text-[#059669] hover:underline"
//                                     >
//                                         Edit
//                                     </button>

//                                     <button
//                                         onClick={() => handleDelete(f._id)}
//                                         className="text-red-600 hover:underline"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}

//                         {faculties.length === 0 && (
//                             <tr>
//                                 <td colSpan="5" className="text-center p-6 text-gray-500">
//                                     No faculties found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>


//             {showModal && (
//                 <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//                     <form
//                         onSubmit={handleSubmit}
//                         className="bg-white p-6 rounded-xl w-96 space-y-4 shadow-xl"
//                     >
//                         <h3 className="font-semibold text-lg">
//                             {editId ? "Edit Faculty" : "Add Faculty"}
//                         </h3>

//                         <input
//                             placeholder="Name"
//                             value={form.name}
//                             onChange={(e) =>
//                                 setForm({ ...form, name: e.target.value })
//                             }
//                             required
//                             className="border w-full p-3 rounded outline-none focus:border-[#059669]"
//                         />

//                         <input
//                             type="email"
//                             placeholder="Email"
//                             value={form.email}
//                             onChange={(e) =>
//                                 setForm({ ...form, email: e.target.value })
//                             }
//                             required
//                             className="border w-full p-3 rounded outline-none focus:border-[#059669]"
//                         />

//                         {!editId && (
//                             <input
//                                 type="password"
//                                 placeholder="Password"
//                                 value={form.password}
//                                 onChange={(e) =>
//                                     setForm({ ...form, password: e.target.value })
//                                 }
//                                 required
//                                 className="border w-full p-3 rounded outline-none focus:border-[#059669]"
//                             />
//                         )}

//                         <input
//                             placeholder="Mobile"
//                             value={form.mobile}
//                             onChange={(e) =>
//                                 setForm({ ...form, mobile: e.target.value })
//                             }
//                             className="border w-full p-3 rounded outline-none focus:border-[#059669]"
//                         />

//                         <div className="flex justify-end gap-3 pt-2">
//                             <button
//                                 type="button"
//                                 onClick={() => setShowModal(false)}
//                                 className="px-4 py-2 border rounded"
//                             >
//                                 Cancel
//                             </button>
//                             <button className="bg-[#059669] text-white px-4 py-2 rounded">
//                                 Save
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacultyList;


import { useEffect, useState } from "react";
import {
    getFaculties,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    toggleFacultyStatus,
} from "../../../services/adminService";

const FacultyList = () => {
    const [faculties, setFaculties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        mobile: "",
    });

    const loadFaculties = async () => {
        try {
            const res = await getFaculties();
            setFaculties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadFaculties();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editId) {
                await updateFaculty(editId, form);
            } else {
                await addFaculty(form);
            }

            setShowModal(false);
            setEditId(null);
            setForm({ name: "", email: "", password: "", mobile: "" });
            loadFaculties();
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleEdit = (f) => {
        setEditId(f._id);
        setForm({
            name: f.name,
            email: f.email,
            mobile: f.mobile || "",
            password: "",
        });
        setShowModal(true);
    };


    const handleToggleStatus = async (faculty) => {
        try {
            setTogglingId(faculty._id);


            setFaculties((prev) =>
                prev.map((f) =>
                    f._id === faculty._id
                        ? { ...f, isActive: !f.isActive }
                        : f
                )
            );

            await toggleFacultyStatus(faculty._id);
        } catch (err) {
            console.error(err);
            loadFaculties();
        } finally {
            setTogglingId(null);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this faculty?")) return;
        await deleteFaculty(id);
        loadFaculties();
    };

    return (
        <div className="p-4 sm:p-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Manage Faculties
                </h2>

                <button
                    onClick={() => {
                        setEditId(null);
                        setForm({ name: "", email: "", password: "", mobile: "" });
                        setShowModal(true);
                    }}
                    className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-[#059669] text-white rounded-xl shadow hover:bg-[#047857] text-sm sm:text-base"
                >
                    + Add Faculty
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-[650px] w-full text-sm sm:text-base">

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
                        {faculties.map((f) => (
                            <tr key={f._id} className="border-t hover:bg-gray-50 transition-colors">

                                <td className="p-3 font-medium whitespace-nowrap">
                                    {f.name}
                                </td>

                                <td className="break-words max-w-[200px]">
                                    {f.email}
                                </td>

                                <td>{f.mobile || "-"}</td>

                                <td className="p-3">
                                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">

                                        <span
                                            className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${f.isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {f.isActive ? "Active" : "Inactive"}
                                        </span>

                                        <button
                                            disabled={togglingId === f._id}
                                            onClick={() => handleToggleStatus(f)}
                                            className={`relative inline-flex h-5 sm:h-6 w-10 sm:w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${f.isActive ? "bg-green-500" : "bg-gray-300"
                                                } ${togglingId === f._id
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-3 sm:h-4 w-3 sm:w-4 transform rounded-full bg-white transition-transform duration-200 ${f.isActive ? "translate-x-3" : "translate-x-0.5"
                                                    }`}
                                            />
                                        </button>

                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="text-center py-3">
                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">

                                        <button
                                            onClick={() => handleEdit(f)}
                                            className="text-[#059669] hover:underline font-medium"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(f._id)}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}

                        {faculties.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-6 text-gray-500 text-sm">
                                    No faculties found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-5 sm:p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl"
                    >
                        <h3 className="font-semibold text-base sm:text-lg">
                            {editId ? "Edit Faculty" : "Add Faculty"}
                        </h3>

                        <input
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            required
                            className="border w-full p-2.5 sm:p-3 rounded outline-none focus:border-[#059669] text-sm"
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            required
                            className="border w-full p-2.5 sm:p-3 rounded outline-none focus:border-[#059669] text-sm"
                        />

                        {!editId && (
                            <input
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                                className="border w-full p-2.5 sm:p-3 rounded outline-none focus:border-[#059669] text-sm"
                            />
                        )}

                        <input
                            placeholder="Mobile"
                            value={form.mobile}
                            onChange={(e) =>
                                setForm({ ...form, mobile: e.target.value })
                            }
                            className="border w-full p-2.5 sm:p-3 rounded outline-none focus:border-[#059669] text-sm"
                        />

                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="w-full sm:w-auto px-4 py-2 border rounded text-sm"
                            >
                                Cancel
                            </button>

                            <button className="w-full sm:w-auto bg-[#059669] text-white px-4 py-2 rounded text-sm">
                                Save
                            </button>

                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FacultyList;