// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Send, Image as ImageIcon, Type, Tag, AlignLeft, Trash2, RefreshCw, MessageSquare, User } from "lucide-react";

// const MarketingCMS = () => {
//     // Blog States
//     const [blogData, setBlogData] = useState({
//         title: "",
//         category: "",
//         excerpt: "",
//         content: "",
//         image: ""
//     });
//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(false);

//     // --- TESTIMONIAL STATES ADDED ---
//     const [testimonialData, setTestimonialData] = useState({
//         name: "",
//         role: "",
//         message: "",
//         image: ""
//     });
//     const [testimonials, setTestimonials] = useState([]);
//     const [testiLoading, setTestiLoading] = useState(false);

//     const fetchBlogs = async () => {
//         setFetching(true);
//         try {
//             const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/blogs");
//             if (res.data.success) {
//                 setBlogs(res.data.blogs);
//             }
//         } catch (err) {
//             console.error("Error fetching blogs:", err);
//         } finally {
//             setFetching(false);
//         }
//     };


//     const fetchTestimonials = async () => {
//         try {
//             const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/testimonials");
//             if (res.data.success) {
//                 setTestimonials(res.data.testimonials);
//             }
//         } catch (err) {
//             console.error("Error fetching testimonials:", err);
//         }
//     };

//     useEffect(() => {
//         fetchBlogs();
//         fetchTestimonials();
//     }, []);


//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this blog?")) {
//             try {
//                 const token = localStorage.getItem("token");
//                 const res = await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/blogs/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 if (res.data.success) {
//                     alert("🗑️ Blog Deleted!");
//                     fetchBlogs();
//                 }
//             } catch (err) {
//                 alert("Error deleting blog");
//             }
//         }
//     };


//     const handleDeleteTestimonial = async (id) => {
//         if (window.confirm("Delete this testimonial?")) {
//             try {
//                 const token = localStorage.getItem("token");
//                 await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/testimonials/${id}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 alert("🗑️ Testimonial Removed!");
//                 fetchTestimonials();
//             } catch (err) {
//                 alert("Error deleting testimonial");
//             }
//         }
//     };

//     // Blog Submit Logic
//     const handleBlogSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/blogs", blogData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (res.data.success) {
//                 alert("🎉 Blog Published Successfully!");
//                 setBlogData({ title: "", category: "", excerpt: "", content: "", image: "" });
//                 fetchBlogs();
//             }
//         } catch (err) {
//             console.error(err);
//             alert(err.response?.data?.error || "Error publishing blog");
//         } finally {
//             setLoading(false);
//         }
//     };


//     const handleTestimonialSubmit = async (e) => {
//         e.preventDefault();

//         // Check if fields are empty
//         if (!testimonialData.name || !testimonialData.role || !testimonialData.message) {
//             return alert("Please fill all required fields!");
//         }

//         setTestiLoading(true);
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/testimonials", testimonialData, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (res.data.success) {
//                 alert("🌟 Testimonial Added!");
//                 setTestimonialData({ name: "", role: "", message: "", image: "" });
//                 fetchTestimonials();
//             }
//         } catch (err) {
//             console.error("Submission Error Details:", err.response?.data);

//             alert(err.response?.data?.message || "Error adding testimonial");
//         } finally {
//             setTestiLoading(false);
//         }
//     };

//     return (
//         <div className="p-6 bg-slate-50 min-h-screen">
//             <h1 className="text-2xl font-bold text-[#059669] mb-6 flex items-center gap-2">
//                 <Tag /> Marketing & CMS Control
//             </h1>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* 1. Banner Management */}
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
//                     <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
//                         <ImageIcon size={18} /> Homepage Banners
//                     </h3>
//                     <div className="border-2 border-dashed border-emerald-100 p-8 text-center rounded-2xl hover:bg-emerald-50 transition-colors group">
//                         <label className="cursor-pointer text-[#059669] font-semibold flex flex-col items-center gap-2">
//                             <span className="bg-emerald-100 p-3 rounded-full group-hover:scale-110 transition-transform">+</span>
//                             Upload New Banner Image
//                         </label>
//                     </div>
//                 </div>

//                 {/* 2. SEO Settings */}
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
//                     <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
//                         <Type size={18} /> SEO Metadata
//                     </h3>
//                     <div className="space-y-4">
//                         <input className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Site Meta Title" />
//                         <textarea className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Site Meta Description" rows="3" />
//                         <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-emerald-100 transition-all">
//                             Update SEO Settings
//                         </button>
//                     </div>
//                 </div>
//             </div>


//             <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
//                 <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-800 text-lg">
//                     <MessageSquare size={20} className="text-emerald-600" /> Manage Student Testimonials
//                 </h3>
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Testimonial Form */}
//                     <form onSubmit={handleTestimonialSubmit} className="lg:col-span-1 space-y-4">
//                         <input
//                             required
//                             className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-emerald-500"
//                             placeholder="Student Name"
//                             value={testimonialData.name}
//                             onChange={(e) => setTestimonialData({ ...testimonialData, name: e.target.value })}
//                         />
//                         <input
//                             required
//                             className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-emerald-500"
//                             placeholder="Role (e.g. Data Scientist)"
//                             value={testimonialData.role}
//                             onChange={(e) => setTestimonialData({ ...testimonialData, role: e.target.value })}
//                         />
//                         <input
//                             className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-emerald-500"
//                             placeholder="Student Image URL"
//                             value={testimonialData.image}
//                             onChange={(e) => setTestimonialData({ ...testimonialData, image: e.target.value })}
//                         />
//                         <textarea
//                             required
//                             className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:border-emerald-500"
//                             placeholder="Success Story / Message..."
//                             rows="3"
//                             value={testimonialData.message}
//                             onChange={(e) => setTestimonialData({ ...testimonialData, message: e.target.value })}
//                         />
//                         <button disabled={testiLoading} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-50 transition-all">
//                             {testiLoading ? "Adding..." : "Add Testimonial"}
//                         </button>
//                     </form>

//                     {/* Testimonial List View */}
//                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
//                         {testimonials.length === 0 ? (
//                             <p className="col-span-2 text-center text-gray-400 italic py-10">No testimonials yet.</p>
//                         ) : (
//                             testimonials.map((t) => (
//                                 <div key={t._id} className="p-4 bg-slate-50 rounded-xl border border-gray-100 relative group">
//                                     <button
//                                         onClick={() => handleDeleteTestimonial(t._id)}
//                                         className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                     <div className="flex items-center gap-3 mb-2">
//                                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
//                                             {t.image ? <img src={t.image} alt="" className="w-full h-full object-cover" /> : <User size={20} className="text-emerald-600" />}
//                                         </div>
//                                         <div>
//                                             <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
//                                             <p className="text-[10px] text-emerald-600 font-bold uppercase">{t.role}</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-xs text-gray-600 line-clamp-3 italic">"{t.message}"</p>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
//                 {/* 3. CREATE BLOG FORM (Left side) */}
//                 <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
//                     <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//                         <AlignLeft className="text-emerald-600" /> Create New Blog Post
//                     </h3>

//                     <form onSubmit={handleBlogSubmit} className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Blog Title</label>
//                                     <input
//                                         required
//                                         value={blogData.title}
//                                         onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
//                                         className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none"
//                                         placeholder="e.g. How to start Data Science"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Category</label>
//                                     <input
//                                         required
//                                         value={blogData.category}
//                                         onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
//                                         className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none"
//                                         placeholder="Career Guide / Tech Trends"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Image URL</label>
//                                     <input
//                                         required
//                                         value={blogData.image}
//                                         onChange={(e) => setBlogData({ ...blogData, image: e.target.value })}
//                                         className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none"
//                                         placeholder="https://images.unsplash.com/..."
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <div>
//                                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Short Excerpt (Intro)</label>
//                                     <textarea
//                                         required
//                                         value={blogData.excerpt}
//                                         onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
//                                         className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none"
//                                         placeholder="Brief summary..."
//                                         rows="2"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="text-sm font-semibold text-gray-600 mb-1 block">Full Content</label>
//                                     <textarea
//                                         required
//                                         value={blogData.content}
//                                         onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
//                                         className="w-full border border-gray-200 p-3 rounded-xl focus:border-emerald-500 outline-none"
//                                         placeholder="Full article content..."
//                                         rows="5"
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`w-full md:w-max px-10 py-4 ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all`}
//                         >
//                             {loading ? "Publishing..." : "Publish Blog Post"} <Send size={18} />
//                         </button>
//                     </form>
//                 </div>

//                 {/* 4. LIVE BLOG LIST (Right side - MANAGE SECTION) */}
//                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="font-bold text-gray-800 flex items-center gap-2">
//                             <RefreshCw size={18} className={fetching ? "animate-spin" : ""} /> Live Blogs
//                         </h3>
//                         <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
//                             {blogs.length} Active
//                         </span>
//                     </div>

//                     <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
//                         {blogs.length === 0 ? (
//                             <p className="text-center text-gray-400 text-sm py-10 italic">No blogs in database.</p>
//                         ) : (
//                             blogs.map((blog) => (
//                                 <div key={blog._id} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group">
//                                     <div className="flex gap-3 mb-2">
//                                         <img src={blog.image} alt="" className="w-12 h-12 rounded-lg object-cover shadow-sm" />
//                                         <div className="flex-1 overflow-hidden">
//                                             <h4 className="text-sm font-bold text-gray-900 truncate">{blog.title}</h4>
//                                             <p className="text-[10px] text-emerald-600 font-bold uppercase">{blog.category}</p>
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-end pt-2 border-t border-gray-50">
//                                         <button
//                                             onClick={() => handleDelete(blog._id)}
//                                             className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs font-semibold transition-colors"
//                                         >
//                                             <Trash2 size={14} /> Delete
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MarketingCMS;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, Image as ImageIcon, Type, Tag, AlignLeft, Trash2, RefreshCw, MessageSquare, User } from "lucide-react";

const MarketingCMS = () => {
    // Blog States
    const [blogData, setBlogData] = useState({
        title: "",
        category: "",
        excerpt: "",
        content: "",
        image: ""
    });
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // --- TESTIMONIAL STATES ADDED ---
    const [testimonialData, setTestimonialData] = useState({
        name: "",
        role: "",
        message: "",
        image: ""
    });
    const [testimonials, setTestimonials] = useState([]);
    const [testiLoading, setTestiLoading] = useState(false);

    const fetchBlogs = async () => {
        setFetching(true);
        try {
            const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/blogs");
            if (res.data.success) {
                setBlogs(res.data.blogs);
            }
        } catch (err) {
            console.error("Error fetching blogs:", err);
        } finally {
            setFetching(false);
        }
    };


    const fetchTestimonials = async () => {
        try {
            const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/testimonials");
            if (res.data.success) {
                setTestimonials(res.data.testimonials);
            }
        } catch (err) {
            console.error("Error fetching testimonials:", err);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchTestimonials();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/blogs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    alert("🗑️ Blog Deleted!");
                    fetchBlogs();
                }
            } catch (err) {
                alert("Error deleting blog");
            }
        }
    };


    const handleDeleteTestimonial = async (id) => {
        if (window.confirm("Delete this testimonial?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/testimonials/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🗑️ Testimonial Removed!");
                fetchTestimonials();
            } catch (err) {
                alert("Error deleting testimonial");
            }
        }
    };

    // Blog Submit Logic
    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/blogs", blogData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                alert("🎉 Blog Published Successfully!");
                setBlogData({ title: "", category: "", excerpt: "", content: "", image: "" });
                fetchBlogs();
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error publishing blog");
        } finally {
            setLoading(false);
        }
    };


    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();

        // Check if fields are empty
        if (!testimonialData.name || !testimonialData.role || !testimonialData.message) {
            return alert("Please fill all required fields!");
        }

        setTestiLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/testimonials", testimonialData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                alert("🌟 Testimonial Added!");
                setTestimonialData({ name: "", role: "", message: "", image: "" });
                fetchTestimonials();
            }
        } catch (err) {
            console.error("Submission Error Details:", err.response?.data);

            alert(err.response?.data?.message || "Error adding testimonial");
        } finally {
            setTestiLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-50 min-h-screen">

            <h1 className="text-xl sm:text-2xl font-bold text-[#059669] mb-6 flex items-center gap-2">
                <Tag /> Marketing & CMS Control
            </h1>

            {/* TOP GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* Banner */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-100">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
                        <ImageIcon size={18} /> Homepage Banners
                    </h3>

                    <div className="border-2 border-dashed border-emerald-100 p-6 sm:p-8 text-center rounded-2xl hover:bg-emerald-50 transition group">
                        <label className="cursor-pointer text-[#059669] font-semibold flex flex-col items-center gap-2">
                            <span className="bg-emerald-100 p-3 rounded-full group-hover:scale-110 transition">
                                +
                            </span>
                            Upload New Banner Image
                        </label>
                    </div>
                </div>

                {/* SEO */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-100">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
                        <Type size={18} /> SEO Metadata
                    </h3>

                    <div className="space-y-4">
                        <input className="w-full border p-3 rounded-xl" placeholder="Site Meta Title" />
                        <textarea className="w-full border p-3 rounded-xl" rows="3" placeholder="Site Meta Description" />
                        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                            Update SEO Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* TESTIMONIAL */}
            <div className="mt-8 bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-800 text-base sm:text-lg">
                    <MessageSquare size={20} className="text-emerald-600" />
                    Manage Student Testimonials
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* FORM */}
                    <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <input required className="w-full border p-3 rounded-xl" placeholder="Student Name"
                            value={testimonialData.name}
                            onChange={(e) => setTestimonialData({ ...testimonialData, name: e.target.value })}
                        />
                        <input required className="w-full border p-3 rounded-xl" placeholder="Role"
                            value={testimonialData.role}
                            onChange={(e) => setTestimonialData({ ...testimonialData, role: e.target.value })}
                        />
                        <input className="w-full border p-3 rounded-xl" placeholder="Image URL"
                            value={testimonialData.image}
                            onChange={(e) => setTestimonialData({ ...testimonialData, image: e.target.value })}
                        />
                        <textarea required className="w-full border p-3 rounded-xl" rows="3"
                            placeholder="Message"
                            value={testimonialData.message}
                            onChange={(e) => setTestimonialData({ ...testimonialData, message: e.target.value })}
                        />
                        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                            {testiLoading ? "Adding..." : "Add Testimonial"}
                        </button>
                    </form>

                    {/* LIST */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto">
                        {testimonials.length === 0 ? (
                            <p className="col-span-2 text-center text-gray-400 py-10">
                                No testimonials yet.
                            </p>
                        ) : (
                            testimonials.map((t) => (
                                <div key={t._id} className="p-4 bg-slate-50 rounded-xl border relative group">

                                    <button
                                        onClick={() => handleDeleteTestimonial(t._id)}
                                        className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="flex gap-3 mb-2">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
                                            {t.image
                                                ? <img src={t.image} className="w-full h-full object-cover" />
                                                : <User size={20} />}
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold">{t.name}</h4>
                                            <p className="text-[10px] text-emerald-600 font-bold">{t.role}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-600 italic line-clamp-3">
                                        "{t.message}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* BLOG SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">

                {/* FORM */}
                <div className="lg:col-span-2 bg-white p-5 sm:p-8 rounded-2xl shadow-sm border">
                    <h3 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                        <AlignLeft /> Create New Blog
                    </h3>

                    <form onSubmit={handleBlogSubmit} className="space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div className="space-y-4">
                                <input className="w-full border p-3 rounded-xl" placeholder="Title"
                                    value={blogData.title}
                                    onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                                />
                                <input className="w-full border p-3 rounded-xl" placeholder="Category"
                                    value={blogData.category}
                                    onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
                                />
                                <input className="w-full border p-3 rounded-xl" placeholder="Image URL"
                                    value={blogData.image}
                                    onChange={(e) => setBlogData({ ...blogData, image: e.target.value })}
                                />
                            </div>

                            <div className="space-y-4">
                                <textarea className="w-full border p-3 rounded-xl" rows="2"
                                    placeholder="Excerpt"
                                    value={blogData.excerpt}
                                    onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                                />
                                <textarea className="w-full border p-3 rounded-xl" rows="5"
                                    placeholder="Content"
                                    value={blogData.content}
                                    onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold">
                            {loading ? "Publishing..." : "Publish Blog"}
                        </button>

                    </form>
                </div>

                {/* BLOG LIST */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border">
                    <div className="flex justify-between mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <RefreshCw size={18} /> Blogs
                        </h3>
                        <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full">
                            {blogs.length}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="p-3 border rounded-xl">

                                <div className="flex gap-3">
                                    <img src={blog.image} className="w-12 h-12 rounded object-cover" />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold truncate">{blog.title}</h4>
                                        <p className="text-[10px] text-emerald-600">{blog.category}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="text-red-500 text-xs mt-2"
                                >
                                    Delete
                                </button>

                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MarketingCMS;