import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addStudent, updateStudent, getStudents, getCourses } from "../../../../services/adminService";

const AddEditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "", enrolledCourse: "" });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then(res => {

      if (res.data.success) setCourses(res.data.courses);
    }).catch(err => console.error("Error fetching courses", err));

    if (id) {
      getStudents().then(res => {
        const studentList = res.data.data || res.data;
        const student = studentList.find(s => s._id === id);
        if (student) setFormData({ name: student.name, email: student.email, mobile: student.mobile || "", password: "", enrolledCourse: student.enrolledCourses?.[0]?._id || student.enrolledCourses?.[0] || "" });
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) { await updateStudent(id, formData); }
      else { await addStudent(formData); }
      navigate("/admin/students");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save student");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#059669]">{id ? "Edit Student" : "Add Student"}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <input name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required />
        {/* --- Course Selection Dropdown --- */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Assign Course</label>
          <select
            value={formData.enrolledCourse}
            onChange={e => setFormData({ ...formData, enrolledCourse: e.target.value })}
            className="w-full border p-3 rounded focus:border-[#059669] outline-none bg-white cursor-pointer"
          >
            <option value="">Select a Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <input name="password" type="password" placeholder={id ? "New password (optional)" : "Password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full border p-3 rounded focus:border-[#059669] outline-none" required={!id} />
        <input name="mobile" placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="w-full border p-3 rounded focus:border-[#059669] outline-none" />
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-[#059669] text-white py-3 rounded font-semibold hover:bg-[#047857]">{id ? "Update" : "Add Student"}</button>
          <button type="button" onClick={() => navigate("/admin/students")} className="flex-1 border py-3 rounded font-semibold hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};
export default AddEditStudent;