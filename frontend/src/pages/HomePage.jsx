// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useScrollFix } from "../services/useScrollFix";
// import {
//   GraduationCap, Users, Calendar, BarChart3, ShieldCheck, Zap, CheckCircle2,
//   Menu, X, PlayCircle, BookOpen, Award, TrendingUp, Star, ArrowRight,
//   ChevronRight, Target, Briefcase, BarChart, Brain, Megaphone, Mail,
//   Phone, MapPin, Quote, Code, ArrowUpRight, ChevronDown, ChevronUp, Send, MessageCircle, HelpCircle
// } from "lucide-react";

// // --- FALLBACK DATA ---
// const fallbackBlogs = [
//   {
//     _id: "static-1",
//     title: "How to Start a Career in Data Science in 2026",
//     category: "Career Guide",
//     image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
//     excerpt: "The landscape of data science is evolving. Discover the essential tools and certifications you'll need to stand out this year..."
//   },
//   {
//     _id: "static-2",
//     title: "Top 5 AI Tools Every Analyst Needs to Master",
//     category: "Tech Trends",
//     image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
//     excerpt: "Move beyond standard spreadsheets. We explore the latest Agentic AI tools that are automating complex data workflows..."
//   },
//   {
//     _id: "static-3",
//     title: "Why Digital Marketing is Essential for Small Businesses",
//     category: "Marketing",
//     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
//     excerpt: "Scaling a business doesn't always require a massive budget. Learn the SEO and content strategies that drive organic growth..."
//   }
// ];

// const fallbackTestimonials = [
//   { _id: "st-1", name: "Rahul Sharma", role: "Data Scientist at Amazon", image: "https://randomuser.me/api/portraits/men/1.jpg", message: "HiLearn's Data Science course completely transformed my career path..", rating: 5 },
//   { _id: "st-2", name: "Priya Patel", role: "AI Engineer at Google", image: "https://randomuser.me/api/portraits/women/2.jpg", message: "The best learning platform with faculty from IITs and IIMs!", rating: 5 },
//   { _id: "st-3", name: "Ankit Verma", role: "Full Stack Developer", image: "https://randomuser.me/api/portraits/men/3.jpg", message: "I learned Web Development here, and today I am working in an MNC.", rating: 4 }
// ];

// const LoginLandingPage = () => {
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [openFaqIndex, setOpenFaqIndex] = useState(null); // FAQ State

//   const [blogs, setBlogs] = useState([]);
//   const [loadingBlogs, setLoadingBlogs] = useState(true);
//   const [dbTestimonials, setDbTestimonials] = useState([]);
//   const [loadingTestimonials, setLoadingTestimonials] = useState(true);

//   const [formData, setFormData] = useState({
//     name: "", email: "", phone: "", course: "", message: ""
//   });

//   const [loading, setLoading] = useState(false);

//   useScrollFix();

//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const blogRes = await axios.get("https://hilearnlmstool-production.up.railway.app/api/blogs");
//         if (blogRes.data.success && blogRes.data.blogs.length > 0) setBlogs(blogRes.data.blogs);
//       } catch (err) { console.error("Blog fallback used"); }
//       finally { setLoadingBlogs(false); }

//       try {
//         const testRes = await axios.get("https://hilearnlmstool-production.up.railway.app/api/testimonials");
//         if (testRes.data.success && testRes.data.testimonials.length > 0) setDbTestimonials(testRes.data.testimonials);
//       } catch (err) { console.error("Testimonial fallback used"); }
//       finally { setLoadingTestimonials(false); }
//     };
//     fetchContent();
//   }, []);

//   const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;
//   const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

//   // ENGLISH FAQ DATA
//   const faqs = [
//     {
//       question: "What makes Hilearn Academy different from other platforms?",
//       answer: "Unlike other platforms that provide only recorded videos, we offer Live Interactive classes with IIT & IIM faculty. This allows you to ask doubts in real-time and work on live industry projects with expert guidance."
//     },
//     {
//       question: "Can students from non-technical backgrounds join these courses?",
//       answer: "Absolutely! Our courses follow a 'Zero to Hero' approach. We start from the very basics, making it easy for students from Commerce, Arts, or any other background to build a successful career in tech."
//     },
//     {
//       question: "What kind of placement support do you provide?",
//       answer: "We provide comprehensive career support, including professional Resume Building, Mock Interview sessions, and direct referrals through our network of 50+ hiring partners to help you land your dream job."
//     },
//     {
//       question: "What happens if I miss a live class?",
//       answer: "Don't worry! Every live session is recorded and uploaded to your student dashboard within 24 hours. You get lifetime access to these recordings, so you can learn at your own pace."
//     },
//     {
//       question: "Is it worth learning Data Science in the era of AI and ChatGPT?",
//       answer: "AI tools like ChatGPT are designed to assist, not replace, skilled professionals. Our curriculum includes 'Agentic AI' and modern tools, ensuring you stay ahead of the curve and become a future-ready professional."
//     }
//   ];

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "All Courses", path: "/courses" },
//     { name: "How It Works", path: "#how-it-works" },
//     { name: "For Students", path: "#for-students" },
//     { name: "Blog", path: "#blog" },
//     { name: "Career Support", path: "#career" },
//     { name: "Contact Us", path: "#contact" },
//     { name: "About Us", path: "/about" }
//   ];

//   const handleNavClick = (e, path) => {
//     if (path.startsWith('#')) {
//       e.preventDefault();
//       const targetId = path.replace('#', '');
//       const element = document.getElementById(targetId);
//       if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     } else {
//       navigate(path);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("https://hilearnlmstool-production.up.railway.app/api/admin/contact/submit", formData);
//       if (response.data.success) {
//         alert("Success! Your message has been sent.");
//         setFormData({ name: "", email: "", phone: "", course: "", message: "" });
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* HEADER */}
//       <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer">
//               <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
//                 <GraduationCap className="text-white w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">HILEARN</h1>
//                 <p className="text-[9px] tracking-widest text-emerald-600 font-semibold">ACADEMY</p>
//               </div>
//             </div>

//             <nav className="hidden lg:flex items-center gap-8">
//               {menuItems.map((item) => (
//                 <a key={item.name} href={item.path} onClick={(e) => handleNavClick(e, item.path)}
//                   className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
//                 >
//                   {item.name}
//                 </a>
//               ))}
//             </nav>

//             <div className="hidden lg:flex items-center gap-4">
//               <button onClick={() => navigate("/login")} className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">Sign In</button>
//               <button onClick={() => navigate("/register")} className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Get Started</button>
//             </div>

//             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-700">
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {mobileMenuOpen && (
//           <div className="lg:hidden bg-white border-t border-gray-200">
//             <div className="px-4 py-4 space-y-1">
//               {menuItems.map((item) => (
//                 <a key={item.name} href={item.path} onClick={(e) => { handleNavClick(e, item.path); setMobileMenuOpen(false); }}
//                   className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
//                 >
//                   {item.name}
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </header>

//       {/* HERO SECTION */}
//       <section className="bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div>
//               <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mb-6">
//                 <Star className="w-4 h-4 text-emerald-600" />
//                 <span className="text-sm font-medium text-emerald-900">Trusted by 5,000+ Students</span>
//               </div>
//               <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
//                 Master In-Demand<br /><span className="text-emerald-600">Tech Skills</span>
//               </h1>
//               <p className="text-lg text-gray-600 leading-relaxed mb-8">
//                 Learn from IIT & IIM faculty through live classes, hands-on projects, and structured learning paths. Launch your career in Data Science, AI, and Digital Marketing.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 mb-10">
//                 <button onClick={() => navigate("/courses")} className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2">Browse Courses <ArrowRight className="w-5 h-5" /></button>
//                 <button onClick={() => navigate("/register")} className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-colors">Start Free Trial</button>
//               </div>
//               <div className="flex flex-wrap gap-6 text-sm text-gray-600">
//                 <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span>IIT & IIM Faculty</span></div>
//                 <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span>Live + Recorded Classes</span></div>
//                 <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><span>Career Support</span></div>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-6">
//               <StatCard icon={<Users className="w-8 h-8" />} value="5,000+" label="Active Students" />
//               <StatCard icon={<Award className="w-8 h-8" />} value="15+" label="Expert Instructors" />
//               <StatCard icon={<BookOpen className="w-8 h-8" />} value="20+" label="Courses" />
//               <StatCard icon={<TrendingUp className="w-8 h-8" />} value="85%" label="Career Growth" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS SECTION */}
//       <section id="how-it-works" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How Hilearn Academy Works</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">A complete learning ecosystem designed for career transformation</p>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             <ProcessStep number="01" title="Choose Your Course" description="Browse our catalog and select a program aligned with your career goals" icon={<Target className="w-7 h-7" />} />
//             <ProcessStep number="02" title="Learn from Experts" description="Attend live classes, access recordings, and learn from IIT/IIM faculty" icon={<PlayCircle className="w-7 h-7" />} />
//             <ProcessStep number="03" title="Build Real Projects" description="Work on industry projects, complete quizzes, and get hands-on experience" icon={<Code className="w-7 h-7" />} />
//             <ProcessStep number="04" title="Launch Your Career" description="Get internship support, career guidance, and placement assistance" icon={<Briefcase className="w-7 h-7" />} />
//           </div>
//         </div>
//       </section>

//       {/* FOR STUDENTS SECTION */}
//       <section id="for-students" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">Real stories from real students who transformed their careers</p>
//           </div>
//           <div className="grid md:grid-cols-3 gap-8">
//             {loadingTestimonials ? (
//               <p className="col-span-3 text-center text-gray-500">Loading reviews...</p>
//             ) : (
//               displayTestimonials.map((t) => (
//                 <div key={t._id || t.id} className="bg-white p-8 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100 relative hover:border-emerald-500 transition-all duration-300">
//                   <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-100" />
//                   <div className="flex items-center gap-1 mb-6">
//                     {[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />))}
//                   </div>
//                   <p className="text-gray-600 mb-8 leading-relaxed italic">"{t.message}"</p>
//                   <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
//                     <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100 shadow-sm" />
//                     <div><h4 className="font-bold text-gray-900">{t.name}</h4><p className="text-xs text-emerald-600 font-medium">{t.role}</p></div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>

//       {/* FEATURED COURSES */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Popular Career Programs</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">Industry-aligned courses designed to transform your career</p>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//             <CourseCard icon={<Code className="w-6 h-6" />} title="Data Science & AI" duration="6 Months" students="2,500+" price="₹60,000" rating="4.8" />
//             <CourseCard icon={<BarChart className="w-6 h-6" />} title="Data Analytics" duration="4 Months" students="1,800+" price="₹25,000" rating="4.7" popular />
//             <CourseCard icon={<Brain className="w-6 h-6" />} title="Agentic AI" duration="3 Months" students="950+" price="₹35,000" rating="4.9" />
//             <CourseCard icon={<Megaphone className="w-6 h-6" />} title="Digital Marketing" duration="3 Months" students="1,200+" price="₹20,000" rating="4.6" />
//           </div>
//           <div className="flex justify-center">
//             <button onClick={() => { navigate("/courses"); window.scrollTo(0, 0); }} className="group flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm">
//               View All Courses <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* BLOG SECTION */}
//       <section id="blog" className="py-24 bg-white border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-2xl text-left mb-16">
//             <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase mb-3 block">Knowledge Hub</span>
//             <h2 className="text-4xl lg:text-4xl font-bold text-gray-900 mb-4">Latest from <span className="text-emerald-600">Our Blog</span></h2>
//           </div>
//           <div className="grid md:grid-cols-3 gap-10">
//             {loadingBlogs ? (
//               <p className="col-span-3 text-center text-gray-500">Curating the best content for you...</p>
//             ) : (
//               displayBlogs.map((post) => (
//                 <div key={post._id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
//                   <div className="relative h-64 overflow-hidden">
//                     <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
//                   </div>
//                   <div className="p-8">
//                     <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">{post.category}</span>
//                     <h3 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h3>
//                     <p className="text-gray-600 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
//                     <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">Read More <ArrowUpRight className="w-4 h-4" /></div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>

//       {/* CAREER SUPPORT */}
//       <section id="career" className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-16 items-center">
//             <div>
//               <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">We Don't Just Teach,<br /><span className="text-emerald-600">We Build Careers</span></h2>
//               <div className="space-y-6">
//                 <BenefitItem icon={<Briefcase className="w-5 h-5" />} title="Internship Opportunities" description="Connect with partner companies for real-world experience" />
//                 <BenefitItem icon={<Users className="w-5 h-5" />} title="1-on-1 Mentorship" description="Get personalized career guidance from industry experts" />
//                 <BenefitItem icon={<ShieldCheck className="w-5 h-5" />} title="Resume & Interview Prep" description="Polish your profile and ace interviews with confidence" />
//               </div>
//             </div>
//             <div className="bg-emerald-600 rounded-xl p-10 text-white">
//               <h3 className="text-2xl font-bold mb-8">Success Stories</h3>
//               <div className="space-y-6">
//                 <TestimonialCard name="Priya Sharma" role="Data Analyst" text="Hilearn helped me transition from a non-tech background." />
//                 <TestimonialCard name="Rahul Patel" role="ML Engineer" text="Live projects were game-changers for my career." />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CONTACT US SECTION */}
//       <section id="contact" className="py-24 bg-white border-t border-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-3 gap-12">
//             <div>
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">Direct <span className="text-emerald-600">Support</span></h2>
//               <p className="text-gray-600 mb-10">Have questions about courses or placements? Reach out to us.</p>
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Phone className="w-5 h-5" /></div>
//                   <div><p className="text-sm font-bold text-gray-900">+91-6355030012</p><p className="text-xs text-gray-500">Mon-Sat, 10am - 7pm</p></div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><MessageCircle className="w-5 h-5" /></div>
//                   <div><p className="text-sm font-bold text-gray-900">WhatsApp Chat</p><p className="text-xs text-gray-500">Get instant response</p></div>
//                 </div>
//               </div>
//             </div>
//             <div className="lg:col-span-2 bg-gray-50 rounded-3xl p-8 lg:p-10 border border-gray-100">
//               <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
//                 <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500" />
//                 <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500" />
//                 <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Phone Number" required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500" />
//                 <select name="course" value={formData.course} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-white">
//                   <option value="">Select a Course</option>
//                   <option value="Data Science & AI">Data Science & AI</option>
//                   <option value="Data Analytics">Data Analytics</option>
//                   <option value="Digital Marketing">Digital Marketing</option>
//                 </select>
//                 <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Question" rows="3" required className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500"></textarea>
//                 <button type="submit" disabled={loading} className={`md:col-span-2 py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
//                   {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NEW FAQ SECTION (PLACED ABOVE CTA) */}
//       <section className="py-24 bg-white border-t border-gray-50">
//         <div className="max-w-3xl mx-auto px-4">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
//               <HelpCircle className="w-4 h-4" /> Have Questions?
//             </div>
//             <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
//           </div>

//           <div className="space-y-4">
//             {faqs.map((faq, index) => (
//               <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
//                 <button
//                   onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
//                   className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openFaqIndex === index ? 'bg-emerald-50' : 'bg-white hover:bg-gray-50'}`}
//                 >
//                   <span className={`font-bold ${openFaqIndex === index ? 'text-emerald-700' : 'text-gray-900'}`}>{faq.question}</span>
//                   {openFaqIndex === index ? <ChevronUp className="text-emerald-600 w-5 h-5" /> : <ChevronDown className="text-gray-400 w-5 h-5" />}
//                 </button>
//                 {openFaqIndex === index && (
//                   <div className="px-6 pb-6 bg-emerald-50 text-gray-600 animate-in slide-in-from-top-2 duration-300">
//                     <p className="pt-2 border-t border-emerald-100/50 leading-relaxed">{faq.answer}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA SECTION */}
//       <section className="py-20 bg-emerald-600">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
//           <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button onClick={() => navigate("/register")} className="px-8 py-3.5 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">Start Learning Today</button>
//             <button onClick={() => navigate("/courses")} className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Explore Courses</button>
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="bg-gray-900 text-gray-300">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//           <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
//             <div className="lg:col-span-2">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center"><GraduationCap className="text-white w-6 h-6" /></div>
//                 <div><h3 className="text-xl font-bold text-white">HILEARN</h3><p className="text-[9px] tracking-widest text-emerald-400 font-semibold">ACADEMY</p></div>
//               </div>
//               <p className="text-sm text-gray-400 max-w-sm">Empowering careers through industry-aligned education.</p>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Programs</h4>
//               <ul className="space-y-2.5 text-sm">
//                 <FooterLink text="Data Science & AI" /><FooterLink text="Data Analytics" /><FooterLink text="Digital Marketing" />
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Company</h4>
//               <ul className="space-y-2.5 text-sm">
//                 <FooterLink text="About Us" /><FooterLink text="Career Support" /><li onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="hover:text-white cursor-pointer">Contact Us</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold mb-4">Contact</h4>
//               <ul className="space-y-3 text-sm">
//                 <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> info@hilearnacademy.com</li>
//                 <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> +91-6355030012</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">© 2026 Hilearn Academy.</div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // HELPER COMPONENTS
// const StatCard = ({ icon, value, label }) => (
//   <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center shadow-sm">
//     <div className="flex justify-center mb-3 text-emerald-600">{icon}</div>
//     <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
//     <div className="text-sm text-gray-600">{label}</div>
//   </div>
// );

// const CourseCard = ({ icon, title, duration, students, price, rating, popular }) => (
//   <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-emerald-600 transition-colors">
//     {popular && <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-3 text-center">Most Popular</div>}
//     <div className="p-6">
//       <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">{icon}</div>
//       <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
//       <div className="flex items-center justify-between mb-4"><span className="text-2xl font-bold text-gray-900">{price}</span></div>
//       <button className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Enroll Now</button>
//     </div>
//   </div>
// );

// const BenefitItem = ({ icon, title, description }) => (
//   <div className="flex gap-4">
//     <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">{icon}</div>
//     <div><h4 className="font-bold text-gray-900 mb-1">{title}</h4><p className="text-sm text-gray-600">{description}</p></div>
//   </div>
// );

// const TestimonialCard = ({ name, role, text }) => (
//   <div className="bg-emerald-700 border border-emerald-500 rounded-lg p-6 mb-4">
//     <p className="text-white mb-4 italic">"{text}"</p>
//     <p className="font-bold text-white text-sm">{name} - {role}</p>
//   </div>
// );

// const ProcessStep = ({ number, title, description, icon }) => (
//   <div className="text-center">
//     <div className="relative inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-lg mb-6">
//       <span className="text-emerald-600">{icon}</span>
//       <span className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
//         {number}
//       </span>
//     </div>
//     <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
//     <p className="text-sm text-gray-600">{description}</p>
//   </div>
// );

// const FooterLink = ({ text }) => (
//   <li><a href="#" className="hover:text-white transition-colors cursor-pointer">{text}</a></li>
// );

// export default LoginLandingPage;






import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useScrollFix } from "../services/useScrollFix";
import {
  GraduationCap, Users, Calendar, BarChart3, ShieldCheck, Zap, CheckCircle2,
  Menu, X, PlayCircle, BookOpen, Award, TrendingUp, Star, ArrowRight,
  ChevronRight, Target, Briefcase, BarChart, Brain, Megaphone, Mail,
  Phone, MapPin, Quote, Code, ArrowUpRight, ChevronDown, ChevronUp, Send, MessageCircle, HelpCircle
} from "lucide-react";

// --- FALLBACK DATA ---
const fallbackBlogs = [
  {
    _id: "static-1",
    title: "How to Start a Career in Data Science in 2026",
    category: "Career Guide",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    excerpt: "The landscape of data science is evolving. Discover the essential tools and certifications you'll need to stand out this year..."
  },
  {
    _id: "static-2",
    title: "Top 5 AI Tools Every Analyst Needs to Master",
    category: "Tech Trends",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    excerpt: "Move beyond standard spreadsheets. We explore the latest Agentic AI tools that are automating complex data workflows..."
  },
  {
    _id: "static-3",
    title: "Why Digital Marketing is Essential for Small Businesses",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    excerpt: "Scaling a business doesn't always require a massive budget. Learn the SEO and content strategies that drive organic growth..."
  }
];

const fallbackTestimonials = [
  { _id: "st-1", name: "Rahul Sharma", role: "Data Scientist at Amazon", image: "https://randomuser.me/api/portraits/men/1.jpg", message: "HiLearn's Data Science course completely transformed my career path..", rating: 5 },
  { _id: "st-2", name: "Priya Patel", role: "AI Engineer at Google", image: "https://randomuser.me/api/portraits/women/2.jpg", message: "The best learning platform with faculty from IITs and IIMs!", rating: 5 },
  { _id: "st-3", name: "Ankit Verma", role: "Full Stack Developer", image: "https://randomuser.me/api/portraits/men/3.jpg", message: "I learned Web Development here, and today I am working in an MNC.", rating: 4 }
];

const LoginLandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", course: "", message: ""
  });

  const [loading, setLoading] = useState(false);

  useScrollFix();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const blogRes = await axios.get("https://hilearnlmstool-production.up.railway.app/api/blogs");
        if (blogRes.data.success && blogRes.data.blogs.length > 0) setBlogs(blogRes.data.blogs);
      } catch (err) { console.error("Blog fallback used"); }
      finally { setLoadingBlogs(false); }

      try {
        const testRes = await axios.get("https://hilearnlmstool-production.up.railway.app/api/testimonials");
        if (testRes.data.success && testRes.data.testimonials.length > 0) setDbTestimonials(testRes.data.testimonials);
      } catch (err) { console.error("Testimonial fallback used"); }
      finally { setLoadingTestimonials(false); }
    };
    fetchContent();
  }, []);

  const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;
  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  const faqs = [
    {
      question: "What makes Hilearn Academy different from other platforms?",
      answer: "Unlike other platforms that provide only recorded videos, we offer Live Interactive classes with IIT & IIM faculty. This allows you to ask doubts in real-time and work on live industry projects with expert guidance."
    },
    {
      question: "Can students from non-technical backgrounds join these courses?",
      answer: "Absolutely! Our courses follow a 'Zero to Hero' approach. We start from the very basics, making it easy for students from Commerce, Arts, or any other background to build a successful career in tech."
    },
    {
      question: "What kind of placement support do you provide?",
      answer: "We provide comprehensive career support, including professional Resume Building, Mock Interview sessions, and direct referrals through our network of 50+ hiring partners to help you land your dream job."
    },
    {
      question: "What happens if I miss a live class?",
      answer: "Don't worry! Every live session is recorded and uploaded to your student dashboard within 24 hours. You get lifetime access to these recordings, so you can learn at your own pace."
    },
    {
      question: "Is it worth learning Data Science in the era of AI and ChatGPT?",
      answer: "AI tools like ChatGPT are designed to assist, not replace, skilled professionals. Our curriculum includes 'Agentic AI' and modern tools, ensuring you stay ahead of the curve and become a future-ready professional."
    }
  ];

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Courses", path: "/courses" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "For Students", path: "#for-students" },
    { name: "Blog", path: "#blog" },
    { name: "Career Support", path: "#career" },
    { name: "Contact Us", path: "#contact" },
    { name: "About Us", path: "/about" }
  ];

  const handleNavClick = (e, path) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      const targetId = path.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(path);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://hilearnlmstool-production.up.railway.app/api/admin/contact/submit", formData);
      if (response.data.success) {
        alert("Success! Your message has been sent.");
        setFormData({ name: "", email: "", phone: "", course: "", message: "" });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* FIX: overflow-x-hidden on root wrapper prevents horizontal scroll on all breakpoints */
    <div className="min-h-screen bg-white overflow-x-hidden w-full pt-16">

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div onClick={() => navigate("/")} className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">HILEARN</h1>
                <p className="text-[9px] tracking-widest text-emerald-600 font-semibold">ACADEMY</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <a key={item.name} href={item.path} onClick={(e) => handleNavClick(e, item.path)}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <button onClick={() => navigate("/login")} className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors">Sign In</button>
              <button onClick={() => navigate("/register")} className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">Get Started</button>
            </div>

            {/* FIX: sm/md me Sign In button visible + hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={() => navigate("/login")} className="hidden sm:block px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:text-emerald-600 transition-colors">
                Sign In
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-700">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <a key={item.name} href={item.path}
                  onClick={(e) => { handleNavClick(e, item.path); setMobileMenuOpen(false); }}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                  {item.name}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">
                  Sign In
                </button>
                <button onClick={() => { navigate("/register"); setMobileMenuOpen(false); }}
                  className="w-full px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      {/* FIX: sm/md pe proper padding, flex-col on sm/md, lg pe grid */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-28">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="w-full">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-medium text-emerald-900">Trusted by 5,000+ Students</span>
              </div>
              {/* FIX: sm me text-3xl, md me text-4xl, lg me text-6xl */}
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                Master In-Demand<br /><span className="text-emerald-600">Tech Skills</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                Learn from IIT & IIM faculty through live classes, hands-on projects, and structured learning paths. Launch your career in Data Science, AI, and Digital Marketing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">

                <button
                  onClick={() => navigate("/courses")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 
               px-5 sm:px-8 py-3 sm:py-3.5 
               bg-emerald-600 text-white font-semibold 
               rounded-lg hover:bg-emerald-700 transition-colors 
               text-sm sm:text-base">
                  <span>Browse Courses</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto flex items-center justify-center 
               px-5 sm:px-8 py-3 sm:py-3.5 
               border-2 border-gray-300 text-gray-700 font-semibold 
               rounded-lg hover:border-emerald-600 hover:text-emerald-600 
               transition-colors text-sm sm:text-base">
                  Start Free Trial
                </button>

              </div>
              {/* FIX: sm/md pe wrap properly, gap thoda kam */}
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /><span>IIT & IIM Faculty</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /><span>Live + Recorded Classes</span></div>
                <div className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" /><span>Career Support</span></div>
              </div>
            </div>

            {/* FIX: sm/md pe 2x2 grid properly with controlled sizing */}
            <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-4">
              <StatCard icon={<Users className="w-6 h-6 sm:w-8 sm:h-8" />} value="5,000+" label="Active Students" />
              <StatCard icon={<Award className="w-6 h-6 sm:w-8 sm:h-8" />} value="15+" label="Expert Instructors" />
              <StatCard icon={<BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />} value="20+" label="Courses" />
              <StatCard icon={<TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" />} value="85%" label="Career Growth" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-12 sm:py-14 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How Hilearn Academy Works</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">A complete learning ecosystem designed for career transformation</p>
          </div>
          {/* FIX: sm me 2-col grid, md me 4-col, lg same */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <ProcessStep number="01" title="Choose Your Course" description="Browse our catalog and select a program aligned with your career goals" icon={<Target className="w-6 h-6 sm:w-7 sm:h-7" />} />
            <ProcessStep number="02" title="Learn from Experts" description="Attend live classes, access recordings, and learn from IIT/IIM faculty" icon={<PlayCircle className="w-6 h-6 sm:w-7 sm:h-7" />} />
            <ProcessStep number="03" title="Build Real Projects" description="Work on industry projects, complete quizzes, and get hands-on experience" icon={<Code className="w-6 h-6 sm:w-7 sm:h-7" />} />
            <ProcessStep number="04" title="Launch Your Career" description="Get internship support, career guidance, and placement assistance" icon={<Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />} />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="for-students" className="py-12 sm:py-14 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">What Our Students Say</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Real stories from real students who transformed their careers</p>
          </div>
          {/* FIX: sm me 1-col, md me 2-col, lg me 3-col */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {loadingTestimonials ? (
              <p className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">Loading reviews...</p>
            ) : (
              displayTestimonials.map((t) => (
                <div key={t._id || t.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-100 relative hover:border-emerald-500 transition-all duration-300">
                  <Quote className="absolute top-5 right-5 w-7 h-7 sm:w-8 sm:h-8 text-emerald-100" />
                  <div className="flex items-center gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < t.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-5 sm:mb-6 leading-relaxed italic text-sm sm:text-base">"{t.message}"</p>
                  <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-gray-100">
                    <img src={t.image} alt={t.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-emerald-100 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{t.name}</h4>
                      <p className="text-xs text-emerald-600 font-medium">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Popular Career Programs</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">Industry-aligned courses designed to transform your career</p>
          </div>
          {/* FIX: sm me 2-col, md me 2-col (not 4), lg same as before */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8 sm:mb-10">
            <CourseCard icon={<Code className="w-5 h-5 sm:w-6 sm:h-6" />} title="Data Science & AI" duration="6 Months" students="2,500+" price="&#8377;60,000" rating="4.8" />
            <CourseCard icon={<BarChart className="w-5 h-5 sm:w-6 sm:h-6" />} title="Data Analytics" duration="4 Months" students="1,800+" price="&#8377;25,000" rating="4.7" popular />
            <CourseCard icon={<Brain className="w-5 h-5 sm:w-6 sm:h-6" />} title="Agentic AI" duration="3 Months" students="950+" price="&#8377;35,000" rating="4.9" />
            <CourseCard icon={<Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />} title="Digital Marketing" duration="3 Months" students="1,200+" price="&#8377;20,000" rating="4.6" />
          </div>
          <div className="flex justify-center">
            <button onClick={() => { navigate("/courses"); window.scrollTo(0, 0); }}
              className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm text-sm sm:text-base">
              View All Courses <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <section id="blog" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-8 sm:mb-10 md:mb-16">
            <span className="text-emerald-600 font-bold tracking-widest text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">Knowledge Hub</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Latest from <span className="text-emerald-600">Our Blog</span></h2>
          </div>
          {/* FIX: sm me 1-col, md me 2-col, lg me 3-col */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {loadingBlogs ? (
              <p className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-gray-500">Curating the best content for you...</p>
            ) : (
              displayBlogs.map((post) => (
                <div key={post._id} className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-2 block">{post.category}</span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{post.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm">Read More <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CAREER SUPPORT */}
      <section id="career" className="py-12 sm:py-14 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          {/* FIX: sm/md me flex-col, lg me grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            <div className="w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">
                We Don't Just Teach,<br /><span className="text-emerald-600">We Build Careers</span>
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <BenefitItem icon={<Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />} title="Internship Opportunities" description="Connect with partner companies for real-world experience" />
                <BenefitItem icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} title="1-on-1 Mentorship" description="Get personalized career guidance from industry experts" />
                <BenefitItem icon={<ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />} title="Resume & Interview Prep" description="Polish your profile and ace interviews with confidence" />
              </div>
            </div>
            <div className="w-full bg-emerald-600 rounded-xl p-5 sm:p-6 md:p-8 lg:p-10 text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">Success Stories</h3>
              <div className="space-y-3 sm:space-y-4">
                <TestimonialCard name="Priya Sharma" role="Data Analyst" text="Hilearn helped me transition from a non-tech background." />
                <TestimonialCard name="Rahul Patel" role="ML Engineer" text="Live projects were game-changers for my career." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8">
          {/* FIX: sm/md me flex-col full-width, lg me 3-col grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 sm:gap-10 md:gap-10">
            <div className="w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Direct <span className="text-emerald-600">Support</span></h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Have questions about courses or placements? Reach out to us.</p>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">+91-6355030012</p>
                    <p className="text-xs text-gray-500">Mon-Sat, 10am - 7pm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">WhatsApp Chat</p>
                    <p className="text-xs text-gray-500">Get instant response</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:col-span-2 bg-gray-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="Full Name" required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-sm sm:text-base" />
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-sm sm:text-base" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Phone Number" required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-sm sm:text-base" />
                <select name="course" value={formData.course} onChange={handleInputChange} required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-white text-sm sm:text-base">
                  <option value="">Select a Course</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                </select>
                <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Question" rows="3" required
                  className="col-span-1 sm:col-span-2 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 text-sm sm:text-base"></textarea>
                <button type="submit" disabled={loading}
                  className={`col-span-1 sm:col-span-2 py-3 sm:py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                  {loading ? "Sending..." : "Send Message"} <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-4 md:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Have Questions?
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className={`w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors ${openFaqIndex === index ? 'bg-emerald-50' : 'bg-white hover:bg-gray-50'}`}>
                  <span className={`font-bold text-sm sm:text-base pr-3 sm:pr-4 ${openFaqIndex === index ? 'text-emerald-700' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  {openFaqIndex === index
                    ? <ChevronUp className="text-emerald-600 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    : <ChevronDown className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />}
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-emerald-50 text-gray-600">
                    <p className="pt-2 border-t border-emerald-100 leading-relaxed text-xs sm:text-sm md:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 sm:py-16 md:py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-5 sm:mb-6">Ready to Transform Your Career?</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
              Start Learning Today
            </button>
            <button onClick={() => navigate("/courses")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base">
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
          {/* FIX: sm me 2-col grid, md me 3-col, lg me 5-col */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">HILEARN</h3>
                  <p className="text-[9px] tracking-widest text-emerald-400 font-semibold">ACADEMY</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-sm">Empowering careers through industry-aligned education.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Programs</h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                <FooterLink text="Data Science & AI" />
                <FooterLink text="Data Analytics" />
                <FooterLink text="Digital Marketing" />
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
                <FooterLink text="About Us" />
                <FooterLink text="Career Support" />
                <li onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="hover:text-white cursor-pointer">Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="break-all">info@hilearnacademy.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" /> +91-6355030012
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            © 2026 Hilearn Academy.
          </div>
        </div>
      </footer>

    </div>
  );
};

// ─── HELPER COMPONENTS ───────────────────────────────────────────────

/* FIX: StatCard - sm me compact sizing */
const StatCard = ({ icon, value, label }) => (
  <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 text-center shadow-sm">
    <div className="flex justify-center mb-1.5 sm:mb-2 text-emerald-600">{icon}</div>
    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-1">{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

/* FIX: CourseCard - sm/md me compact padding and text */
const CourseCard = ({ icon, title, duration, students, price, rating, popular }) => (
  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-emerald-600 transition-colors">
    {popular && (
      <div className="bg-emerald-600 text-white text-xs font-semibold py-1 sm:py-1.5 px-2 sm:px-3 text-center">Most Popular</div>
    )}
    <div className="p-3 sm:p-4 md:p-5 lg:p-6">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-2 sm:mb-3">{icon}</div>
      <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">{title}</h3>
      <div className="mb-2 sm:mb-3">
        <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-900">{price}</span>
      </div>
      <button className="w-full py-1.5 sm:py-2 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
        Enroll Now
      </button>
    </div>
  </div>
);

const BenefitItem = ({ icon, title, description }) => (
  <div className="flex gap-3 sm:gap-4">
    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">{title}</h4>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="bg-emerald-700 border border-emerald-500 rounded-lg p-4 sm:p-5">
    <p className="text-white mb-2 sm:mb-3 italic text-xs sm:text-sm md:text-base">"{text}"</p>
    <p className="font-bold text-white text-xs sm:text-sm">{name} - {role}</p>
  </div>
);

/* FIX: ProcessStep - sm/md me description visible with smaller text */
const ProcessStep = ({ number, title, description, icon }) => (
  <div className="text-center px-1">
    <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-lg mb-3 sm:mb-4">
      <span className="text-emerald-600">{icon}</span>
      <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
        {number}
      </span>
    </div>
    <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1 sm:mb-2">{title}</h3>
    <p className="text-[11px] sm:text-xs md:text-sm text-gray-600">{description}</p>
  </div>
);

const FooterLink = ({ text }) => (
  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">{text}</a></li>
);

export default LoginLandingPage;
