import { useEffect, useState } from "react";
import { Clock, Users, Star, CheckCircle2, Search, Plus, X, IndianRupee, Trash2, Edit3 } from "lucide-react";
import AddEditCourse from "./AddEditCourse";

const API_URL = "http://localhost:5000/api/courses";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) setCourses(data.courses || []);
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleEdit = (course) => {
    setEditData(course);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchCourses();
    } catch (err) { alert("Delete failed"); }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-white min-h-screen font-sans">

      {/* --- Admin Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Control Center</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your professional catalog</p>
        </div>

        <button
          onClick={() => { setShowForm(!showForm); if (showForm) setEditData(null); }}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${showForm
            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
        >
          {showForm ? <><X size={18} /> Close Panel</> : <><Plus size={18} /> Create New Course</>}
        </button>
      </div>

      {/* --- Add/Edit Form Overlay --- */}
      {showForm && (
        <div className="mb-12 bg-gray-50 p-6 rounded-[2rem] border-2 border-dashed border-gray-200">
          <AddEditCourse
            onCoursesChange={() => { fetchCourses(); setShowForm(false); }}
            editData={editData}
            clearEdit={() => { setEditData(null); setShowForm(false); }}
          />
        </div>
      )}

      {/* --- Search Bar --- */}
      <div className="relative mb-10 max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by course name or technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-emerald-600 focus:bg-white transition-all text-gray-700"
        />
      </div>

      {/* --- Course Grid (2 Columns Layout) --- */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
          {filteredCourses.map((course) => {
            const rawFeatures = Array.isArray(course.features) ? course.features[0] : course.features;

            const featureList = typeof rawFeatures === 'string'
              ? rawFeatures.split(',').map(f => f.trim()).filter(f => f !== "")
              : Array.isArray(course.features) ? course.features : [];

            return (
              <div
                key={course._id}
                className="bg-white border-2 border-gray-200 rounded-[2.5rem] overflow-hidden hover:border-emerald-600 transition-all flex flex-col shadow-sm hover:shadow-md"
              >
                <div className="p-8 flex-1 flex flex-col">
                  {/* Icon Box */}
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                    <div className="font-bold text-xl">{"< >"}</div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 text-[15px] mb-6 line-clamp-2 leading-relaxed">
                    {course.description || "Comprehensive curriculum designed for industry excellence."}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-6 text-gray-500 text-sm font-semibold mb-6 pb-6 border-b border-gray-100">
                    <span className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-400" /> {course.duration || "6 Months"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users size={18} className="text-gray-400" /> {course.students || "2,500+"}
                    </span>
                  </div>

                  {/* Features List (Separated by comma) */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {featureList.length > 0 ? featureList.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[14.5px] text-gray-700 font-medium">
                        <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    )) : (
                      <li className="text-gray-400 italic text-sm">No features listed</li>
                    )}
                  </ul>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-3xl font-bold text-gray-900 flex items-center">
                      <span className="text-2xl mr-1">₹</span>{course.price}
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl text-amber-600 font-bold border border-amber-100">
                      <Star size={18} className="fill-amber-400 text-amber-400" />
                      <span>{course.rating || "4.8"}</span>
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => handleEdit(course)}
                      className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                    >
                      <Edit3 size={18} /> Edit Course
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="w-full py-3.5 border-2 border-gray-200 text-gray-500 font-bold rounded-2xl hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Delete From Catalog
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No courses found</h3>
          <p className="text-gray-500">Try searching with a different keyword</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;