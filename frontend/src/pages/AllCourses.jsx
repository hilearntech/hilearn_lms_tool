import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnrollmentModal from "../component/EnrollmentModal";
import { useScrollFix } from "../services/useScrollFix";
import {
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  Menu,
  X,
  PlayCircle,
  BookOpen,
  Award,
  Clock,
  Star,
  Code,
  BarChart,
  Brain,
  Megaphone,
  Mail,
  Phone,
  MapPin,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  Database,
  Palette,
  Globe
} from "lucide-react";


export const allCourses = [
  {
    id: 1,
    icon: <Code className="w-6 h-6" />,
    title: "Data Science & AI",
    category: "Data Science",
    duration: "6 Months",
    students: "2,500+",
    price: "₹60,000",
    rating: "4.8",
    level: "Intermediate to Advanced",
    modules: 12,
    description: "Master Python, Machine Learning, Deep Learning, and AI with industry projects.",
    features: ["Python Programming", "ML Algorithms", "Deep Learning", "NLP & Computer Vision", "Capstone Projects"]
  },
  {
    id: 2,
    icon: <BarChart className="w-6 h-6" />,
    title: "Data Analytics",
    category: "Analytics",
    duration: "4 Months",
    students: "1,800+",
    price: "₹25,000",
    rating: "4.7",
    level: "Beginner to Intermediate",
    modules: 10,
    popular: true,
    description: "Learn SQL, Excel, Power BI, and Tableau for business intelligence and analytics.",
    features: ["SQL & Databases", "Advanced Excel", "Power BI", "Tableau", "Business Analytics"]
  },
  {
    id: 3,
    icon: <Brain className="w-6 h-6" />,
    title: "Agentic AI",
    category: "AI & ML",
    duration: "3 Months",
    students: "950+",
    price: "₹35,000",
    rating: "4.9",
    level: "Advanced",
    modules: 8,
    description: "Build autonomous AI agents using LangChain, AutoGen, and modern AI frameworks.",
    features: ["LLM Fundamentals", "LangChain", "AutoGen", "AI Agents", "Production Deployment"]
  },
  {
    id: 4,
    icon: <Megaphone className="w-6 h-6" />,
    title: "Digital Marketing",
    category: "Marketing",
    duration: "3 Months",
    students: "1,200+",
    price: "₹20,000",
    rating: "4.6",
    level: "Beginner to Intermediate",
    modules: 9,
    description: "Master SEO, Google Ads, Social Media Marketing, and Analytics.",
    features: ["SEO Optimization", "Google Ads", "Social Media Marketing", "Content Marketing", "Analytics"]
  },
  {
    id: 5,
    icon: <Database className="w-6 h-6" />,
    title: "Big Data Engineering",
    category: "Data Science",
    duration: "5 Months",
    students: "750+",
    price: "₹55,000",
    rating: "4.7",
    level: "Intermediate to Advanced",
    modules: 11,
    description: "Learn Hadoop, Spark, Kafka, and cloud-based big data technologies.",
    features: ["Hadoop Ecosystem", "Apache Spark", "Kafka Streaming", "Data Warehousing", "Cloud Platforms"]
  },
  {
    id: 6,
    icon: <Globe className="w-6 h-6" />,
    title: "Full Stack Web Development",
    category: "Technology",
    duration: "6 Months",
    students: "1,500+",
    price: "₹45,000",
    rating: "4.8",
    level: "Beginner to Advanced",
    modules: 14,
    description: "Build modern web applications with React, Node.js, and databases.",
    features: ["HTML/CSS/JavaScript", "React.js", "Node.js & Express", "MongoDB", "Deployment & DevOps"]
  },
  {
    id: 7,
    icon: <Brain className="w-6 h-6" />,
    title: "Machine Learning Mastery",
    category: "AI & ML",
    duration: "4 Months",
    students: "1,100+",
    price: "₹40,000",
    rating: "4.8",
    level: "Intermediate",
    modules: 10,
    description: "Deep dive into ML algorithms, model deployment, and MLOps practices.",
    features: ["Supervised Learning", "Unsupervised Learning", "Feature Engineering", "Model Deployment", "MLOps"]
  },
  {
    id: 8,
    icon: <Palette className="w-6 h-6" />,
    title: "UI/UX Design",
    category: "Technology",
    duration: "3 Months",
    students: "850+",
    price: "₹30,000",
    rating: "4.6",
    level: "Beginner to Intermediate",
    modules: 8,
    description: "Design beautiful user interfaces and experiences with Figma and design thinking.",
    features: ["Design Principles", "Figma Mastery", "User Research", "Prototyping", "Portfolio Projects"]
  }
];




const CoursesPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleEnrollSuccess = () => {
    setIsModalOpen(false);
    navigate("/student");
  };

  useScrollFix();
  const fetchCourses = async () => {

    try {
      const response = await fetch("http://localhost:5000/api/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);



  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Courses", path: "/courses" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "For Students", path: "/#for-students" },
    { name: "Career Support", path: "/#career" },
    { name: "About Us", path: "/about" }
  ];

  const categories = ["All", "Data Science", "AI & ML", "Analytics", "Marketing", "Technology"];
  const durations = ["All", "1-3 Months", "3-6 Months", "6+ Months"];


  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;


    const matchesDuration = selectedDuration === "All" ||
      (selectedDuration === "1-3 Months" && parseInt(course.duration) <= 3) ||
      (selectedDuration === "3-6 Months" && parseInt(course.duration) > 3 && parseInt(course.duration) <= 6) ||
      (selectedDuration === "6+ Months" && parseInt(course.duration) > 6);

    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDuration && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HILEARN</h1>
                <p className="text-[9px] tracking-widest text-emerald-600 font-semibold">ACADEMY</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* PAGE HEADER */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            All Courses
          </h1>
          <p className="text-lg text-emerald-50 max-w-2xl mx-auto">
            Explore our comprehensive range of industry-aligned programs designed to accelerate your career
          </p>
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <section className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">

            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Duration Filter */}
            <div className="relative">
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white cursor-pointer"
              >
                {durations.map(dur => (
                  <option key={dur} value={dur}>{dur}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>Showing {filteredCourses.length} of {allCourses.length} courses</span>
          </div>
        </div>
      </section>

      {/* COURSES GRID */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <CourseCard key={course._id} course={course} navigate={navigate} setSelectedCourse={setSelectedCourse} setIsModalOpen={setIsModalOpen} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL RENDER LOGIC - Ise Footer ke just upar rakho */}
      {isModalOpen && selectedCourse && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
      {/* CTA SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Not Sure Which Course to Choose?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Book a free consultation with our career counselor to find the perfect program for your goals
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Book Free Consultation
          </button>
        </div>
      </section>

      {/* FOOTER (Omitted for brevity, kept same) */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">HILEARN</h3>
                  <p className="text-[9px] tracking-widest text-emerald-400 font-semibold">ACADEMY</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6 max-w-sm leading-relaxed">
                Empowering careers through industry-aligned education in Data Science, AI, and Digital Marketing.
              </p>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-white font-semibold mb-4">Programs</h4>
              <ul className="space-y-2.5 text-sm">
                <FooterLink text="Data Science & AI" />
                <FooterLink text="Data Analytics" />
                <FooterLink text="Agentic AI" />
                <FooterLink text="Digital Marketing" />
                <FooterLink text="View All Courses" />
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <FooterLink text="About Us" />
                <FooterLink text="Career Support" />
                <FooterLink text="Success Stories" />
                <FooterLink text="Become an Instructor" />
                <FooterLink text="Contact Us" />
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>info@hilearnacademy.com</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>+91-6355030012</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Ahmedabad, Gujarat, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Hilearn Academy. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// UPDATED COMPONENT
const CourseCard = ({ course, navigate, setSelectedCourse, setIsModalOpen }) => (
  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-emerald-600 transition-all flex flex-col">
    {course.popular && (
      <div className="bg-emerald-600 text-white text-xs font-semibold py-1.5 px-3 text-center">
        Most Popular
      </div>
    )}
    <div className="p-6 flex-1 flex flex-col">
      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
        {course.icon}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {course.duration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {course.studentCount}
        </span>
      </div>


      <ul className="space-y-2 mb-4 flex-1">
        {course.features && course.features.length > 0 ? (
          (typeof course.features[0] === 'string'
            ? course.features[0].split(',')
            : course.features
          ).slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{feature.trim()}</span>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">Lifetime Access</li>
        )}
      </ul>

      <div className="flex items-center justify-between mb-4">

        <span className="text-2xl font-bold text-gray-900">
          ₹{Number(course.price).toLocaleString('en-IN')}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{course.rating}</span>
        </span>
      </div>

      <button onClick={() => {
        setSelectedCourse(course);
        setIsModalOpen(true);
      }} className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors mb-2">
        Enroll Now
      </button>

      <button
        onClick={() => navigate(`/course/${course._id}`)}
        className="w-full py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-emerald-600 hover:text-emerald-600 transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

const FooterLink = ({ text }) => (
  <li>
    <a href="#" className="hover:text-white transition-colors cursor-pointer text-sm">
      {text}
    </a>
  </li>
);

export default CoursesPage;