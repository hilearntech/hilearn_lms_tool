import React, { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, IndianRupee, Clock, Users, Star, CheckCircle2, Layers, Loader2 } from "lucide-react";

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const res = await fetch("https://hilearnlmstool-production.up.railway.app/api/courses", {
        method: "GET",
        headers: headers
      });

      if (res.status === 401) {
        const publicRes = await fetch("https://hilearnlmstool-production.up.railway.app/api/courses");
        const publicData = await publicRes.json();
        if (publicData.success) {
          setCourses(publicData.courses);
        }
        return;
      }

      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handlePayment = async (course) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to enroll in this course.");
        return;
      }

      setProcessingId(course._id);

      const res = await axios.post(
        "https://hilearnlmstool-production.up.railway.app/api/payments/free-enroll",
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("🎉 Success! You are now enrolled.");
        window.location.href = "/student/my-courses";
      }
    } catch (err) {
      console.error("Enrollment Error:", err);
      alert(err.response?.data?.message || "Error enrolling in course.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[#059669] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Available Courses</h1>
        <p className="text-slate-500 font-medium">Choose the best program to level up your skills</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const rawFeatures = Array.isArray(course.features) ? course.features[0] : course.features;

          const featureList = typeof rawFeatures === 'string'
            ? rawFeatures.split(',').map(f => f.trim()).filter(f => f !== "")
            : Array.isArray(course.features) ? course.features : [];

          return (
            <div key={course._id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">

              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-[#059669] border border-emerald-100 group-hover:bg-[#059669] group-hover:text-white transition-colors">
                <Layers size={28} />
              </div>

              <div className="flex-grow">
                <h3 className="text-2xl font-black text-slate-800 mb-3 leading-tight">{course.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-slate-400 text-[12px] font-black uppercase tracking-wider mb-6 border-b border-slate-50 pb-6">
                  <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#059669]" /> {course.duration || '3 Months'}</span>
                  <span className="flex items-center gap-1.5"><Users size={16} className="text-[#059669]" /> {course.studentCount || '500+'}</span>
                </div>

                {/* ACTUAL DATABASE FEATURES */}
                <div className="space-y-3 mb-8">
                  {featureList.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-slate-600 text-sm font-medium">
                      <CheckCircle2 size={18} className="text-[#059669]" /> {feat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center text-3xl font-black text-slate-900">
                  <IndianRupee size={24} strokeWidth={3} />
                  <span>{Number(course.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm">
                  <Star size={16} fill="currentColor" /> {course.rating || '4.8'}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handlePayment(course)}
                  disabled={processingId === course._id}
                  className="w-full bg-[#059669] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#047857] hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {processingId === course._id ? (
                    <><Loader2 className="animate-spin" size={18} /> Processing...</>
                  ) : (
                    "Enroll Now"
                  )}
                </button>
                <button className="w-full bg-white text-slate-600 py-4 rounded-2xl font-black text-sm border-2 border-slate-100 hover:bg-slate-50 transition-all">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
          <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-400">No courses available at the moment.</h3>
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;