import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react"; 

const DemoRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [demoVideo, setDemoVideo] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [contactId, setContactId] = useState(null);
  
  
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/courses/${id}`)
      .then((res) => res.json())
      .then((data) => { if (data.success) setCourse(data.course); });

    fetch(`http://localhost:5000/api/students/course/${id}/demo`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.demoVideo) setDemoVideo(data.demoVideo);
      });
  }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/api/admin/demo-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, courseTitle: course?.title }),
            });
            
            const data = await response.json(); 
            
            if (data.success) {
            setContactId(data.contactId); 
            setShowVideo(true);
            }
        } catch (error) { 
            alert("Error submitting request"); 
        } finally { 
            setIsSubmitting(false); 
        }
};

  
const handleReviewSubmit = async () => {
  if (!contactId) {
    alert("Contact ID missing!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/admin/update-rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId, rating }), 
    });
    const data = await res.json();
    if(data.success) {
       alert("Feedback saved! Thank you.");
       navigate('/');
    }
  } catch (err) { 
    console.error("Update error:", err);
    navigate('/'); 
  }
};



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        
        {/* 1. FORM SECTION */}
        {!showVideo && !showReview && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-2">Watch Demo Video</h2>
             {/* ... (Wahi purana form code) ... */}
             <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Full Name" className="w-full px-4 py-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input required type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input required type="tel" placeholder="WhatsApp Number" className="w-full px-4 py-3 border rounded-xl" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <button disabled={isSubmitting || !demoVideo} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">
                  {isSubmitting ? "Submitting..." : "Watch Demo Now"}
                </button>
             </form>
          </div>
        )}

        {/* 2. VIDEO SECTION */}
        {showVideo && !showReview && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white">
              <h2 className="text-xl font-bold">Demo: {demoVideo?.title}</h2>
              <button 
                onClick={() => setShowReview(true)} 
                className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
              >
                Close Preview
              </button>
            </div>
            
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                src={`https://iframe.mediadelivery.net/embed/${demoVideo?.libraryID}/${demoVideo?.videoID}?autoplay=true`}
                className="absolute top-0 left-0 w-full h-full border-none"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>
        )}

        {/* 3. REVIEW SECTION (The Pop-up/Modal) */}
        {showReview && (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-10 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star size={40} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Rate the Demo</h2>
            <p className="text-gray-500 mb-8">How was your experience watching the preview?</p>

            {/* Star Rating System */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={`transition-colors duration-200 ${ratingValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star size={36} fill={ratingValue <= (hover || rating) ? "currentColor" : "none"} strokeWidth={2} />
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleReviewSubmit}
                disabled={rating === 0}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 disabled:bg-gray-300 transition-all"
              >
                Submit Review
              </button>
              <button 
                onClick={() => navigate(`/checkout/${id}`)}
                className="w-full py-4 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-50 transition-all"
              >
                Enroll in Full Course
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DemoRequest;