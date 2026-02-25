import { useEffect, useState } from "react";
import {
  getBatches,
  addBatch,
  deleteBatch,
  toggleBatchStatus,
  updateBatch,
  getCourses,
  getFaculties,
  getStudents,
  assignStudentsToBatch,
} from "../../../../services/adminService";

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");

  const [editBatch, setEditBatch] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [mentor, setMentor] = useState("");

  const [allStudents, setAllStudents] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const loadBatches = async () => {
    const res = await getBatches();
    setBatches(res.data.data);
  };

  const loadCourses = async () => {
    const res = await getCourses();
    setCourses(res.data.courses);
  };

  const loadMentors = async () => {

    const res = await getFaculties();
    setMentors(res.data);
  };

  const loadAllStudents = async () => {
    const res = await getStudents();
    setAllStudents(res.data);
  };

  useEffect(() => {
    loadBatches();
    loadCourses();
    loadMentors();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await addBatch({ name, course, mentor });
    setName("");
    setCourse("");
    setMentor("");
    loadBatches();
  };

  const handleUpdate = async () => {
    await updateBatch(editBatch._id, {
      name: editBatch.name,
      course: editBatch.course,
      mentor: editBatch.mentor,
    });
    setEditBatch(null);
    loadBatches();
  };

  const handleAssignStudents = async () => {
    try {

      await assignStudentsToBatch({
        batchId: selectedBatchId,
        studentIds: checkedStudents
      });

      alert("Students added successfully! 🚀");
      setShowStudentModal(false);
      setCheckedStudents([]);
      loadBatches();
    } catch (error) {
      alert("Kucch gadbad ho gayi!");
    }
  };

  const handleToggleStatus = async (batchItem) => {
    if (!batchItem || !batchItem._id) {
      console.error("Invalid batch", batchItem);
      return;
    }

    setBatches((prev) =>
      prev.map((b) =>
        b._id === batchItem._id
          ? { ...b, isActive: !b.isActive }
          : b
      )
    );

    try {
      await toggleBatchStatus(batchItem._id);
    } catch (error) {
      alert("Failed to update batch status");
      setBatches((prev) =>
        prev.map((b) =>
          b._id === batchItem._id ? batchItem : b
        )
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#059669] mb-6">
        Manage Batches
      </h1>

      {/* ADD BATCH */}
      <form onSubmit={handleAdd} className="flex gap-4 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Batch Name"
          className="border p-3 rounded w-64 focus:border-[#059669] outline-none"
          required
        />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className="border p-3 rounded w-64 focus:border-[#059669] outline-none"
          required
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          value={mentor}
          onChange={(e) => setMentor(e.target.value)}
          className="border p-3 rounded w-64 focus:border-[#059669] outline-none"
          required
        >
          <option value="">Select Mentor</option>
          {mentors.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>

        <button className="bg-[#059669] hover:bg-[#047857] text-white px-6 rounded transition-colors">
          Add Batch
        </button>
      </form>


      <div className="bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-[#059669] text-white">
            <tr>
              <th className="p-3 text-left">Batch</th>
              <th className="text-left">Course</th>
              <th className="text-left">Instructor</th>
              <th className="text-left">Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {batches.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.name}</td>
                <td>{b.course?.title}</td>
                <td>{b.mentor?.name || "Not Assigned"}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${b.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {b.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="flex gap-3 justify-center py-3 items-center">
                  <button
                    onClick={() => {
                      setSelectedBatchId(b._id);
                      setShowStudentModal(true);
                      loadAllStudents();
                    }}
                    className="text-indigo-600 font-semibold hover:text-indigo-900 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-50"
                  >
                    + Add Student
                  </button>
                  <button
                    onClick={() => setEditBatch(b)}
                    className="text-amber-600 font-semibold"
                  >
                    Edit
                  </button>

                  <div className="text-center flex items-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(b)}
                      className={`relative inline-flex h-7 w-14 items-center px-1 rounded-full 
                      transition-all duration-300 focus:outline-none
                      ${b.isActive
                          ? "bg-[#059669] justify-end shadow-[0_0_8px_rgba(5,150,105,0.4)]"
                          : "bg-gray-300 justify-start"
                        }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 rounded-full bg-white shadow-md
                        transition-all duration-300`}
                      />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      deleteBatch(b._id).then(loadBatches)
                    }
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBatch(b);
                      setShowViewModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span className="text-lg"></span> View
                  </button>
                </td>
              </tr>
            ))}

            {batches.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No batches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {showStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-4 border-b bg-emerald-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-emerald-800">Add Students to Batch</h2>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-white">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Student List */}
            <div className="flex-1 overflow-y-auto p-2">
              {allStudents
                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((student) => (
                  <label key={student._id} className="flex items-center p-3 hover:bg-emerald-50 rounded-xl cursor-pointer transition-colors border-b last:border-0">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-emerald-600 rounded"
                      checked={checkedStudents.includes(student._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCheckedStudents([...checkedStudents, student._id]);
                        } else {
                          setCheckedStudents(checkedStudents.filter(id => id !== student._id));
                        }
                      }}
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </label>
                ))}
              {allStudents.length === 0 && <p className="text-center py-10 text-gray-400">No students found.</p>}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowStudentModal(false)}
                className="flex-1 py-2 text-gray-600 font-semibold border rounded-lg hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignStudents}
                disabled={checkedStudents.length === 0}
                className={`flex-1 py-2 text-white font-semibold rounded-lg shadow-md transition-all ${checkedStudents.length > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
              >
                Assign ({checkedStudents.length})
              </button>
            </div>
          </div>
        </div>
      )}


      {showViewModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="p-5 border-b bg-blue-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">{selectedBatch.name}</h2>
                <p className="text-blue-600 font-medium">{selectedBatch.course?.title}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-red-500 text-3xl">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Mentor Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Instructor Details</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {selectedBatch.mentor?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">{selectedBatch.mentor?.name || "Not Assigned"}</p>
                    <p className="text-gray-500 text-sm">{selectedBatch.mentor?.email || "No email provided"}</p>
                  </div>
                </div>
              </div>

              {/* Enrolled Students List */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Enrolled Students ({selectedBatch.students?.length || 0})</h3>
                </div>

                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-3 text-left">Student Name</th>
                        <th className="p-3 text-left">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedBatch.students && selectedBatch.students.length > 0 ? (
                        selectedBatch.students.map((student, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 font-medium text-gray-700">{student.name}</td>
                            <td className="p-3 text-gray-500">{student.email}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="p-10 text-center text-gray-400">No students enrolled in this batch yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 text-right">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editBatch && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-4 text-slate-800">Edit Batch</h2>

            <input
              value={editBatch.name}
              onChange={(e) =>
                setEditBatch({ ...editBatch, name: e.target.value })
              }
              className="border p-3 rounded w-full mb-3 focus:border-[#059669] outline-none"
            />

            <select
              value={editBatch.course}
              onChange={(e) =>
                setEditBatch({
                  ...editBatch,
                  course: e.target.value,
                })
              }
              className="border p-3 rounded w-full mb-4 focus:border-[#059669] outline-none"
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <select
              value={editBatch.mentor?._id || editBatch.mentor}
              onChange={(e) =>
                setEditBatch({ ...editBatch, mentor: e.target.value })
              }
              className="border p-3 rounded w-full mb-4 focus:border-[#059669] outline-none"
            >
              <option value="">Select Mentor</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditBatch(null)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-[#059669] text-white rounded hover:bg-[#047857] transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchList;