import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Users, BookOpen, ArrowLeft, Star, PlayCircle } from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/courses/${id}`);
      const data = await response.json();
      
      if (data.success && data.course) {
        setCourse(data.course);
      } else {
        console.error("Course nahi mila backend se");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (id) fetchCourseDetail();
}, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!course) return <div className="text-center py-20">Course not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-emerald-600">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-12">
        {/* Left Content */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{course.description}</p>
          
          <h2 className="text-2xl font-bold mb-4">What you will learn</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Database features handling */}
            {(typeof course.features[0] === 'string' ? course.features[0].split(',') : course.features).map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                <span>{f.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{Number(course.price).toLocaleString('en-IN')}</span>
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-yellow-700 font-bold">
                <Star className="w-4 h-4 fill-yellow-500 mr-1" /> {course.rating}
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-600"><Clock className="w-5 h-5 mr-3" /> {course.duration}</div>
              <div className="flex items-center text-gray-600"><Users className="w-5 h-5 mr-3" /> {course.studentCount} Students</div>
            </div>

            {/* Enroll Button */}
            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold mb-4 hover:bg-emerald-700 transition-all">
              Enroll Now
            </button>

            {/* DEMO VIDEO BUTTON */}
            <button 
              onClick={() => navigate(`/demo-request/${course._id}`)} 
              className="w-full py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all"
            >
              <PlayCircle className="w-5 h-5" /> Watch Demo Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;