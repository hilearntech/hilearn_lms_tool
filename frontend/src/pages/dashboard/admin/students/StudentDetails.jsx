import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStudentDetails } from "../../../../services/adminService";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getStudentDetails(id);
        setStudent(res.data.student);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  if (loading) return <p className="p-6 font-bold text-[#059669]">Loading...</p>;
  if (!student) return <p className="p-6 text-red-500">No student found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow border-t-4 border-[#059669]">
        <h2 className="text-xl font-bold mb-6">Student Information</h2>
        <div className="space-y-4">
          <p><b>Name:</b> {student.name}</p>
          <p><b>Email:</b> {student.email}</p>
          <p><b>Mobile:</b> {student.mobile || "N/A"}</p>
          <p><b>Role:</b> {student.role}</p>
          <p><b>Status:</b> <span className={student.isActive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{student.isActive ? "Active" : "Inactive"}</span></p>
        </div>
        <button onClick={() => navigate("/admin/students")} className="mt-8 w-full bg-gray-100 py-2 rounded font-bold hover:bg-gray-200 text-gray-700">Back to List</button>
      </div>
    </div>
  );
};
export default StudentDetails;