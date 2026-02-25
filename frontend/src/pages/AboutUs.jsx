import { useState } from "react";
import { useScrollFix } from "../services/useScrollFix";
import {
  GraduationCap,
  Users,
  Menu,
  X,
  Target,
  Eye,
  Heart,
  Award,
  TrendingUp,
  BookOpen,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter
} from "lucide-react";

const AboutUsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useScrollFix();
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Courses", path: "/courses" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "For Students", path: "/#for-students" },
    { name: "Career Support", path: "/#career" },
    { name: "About Us", path: "/about" }
  ];

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: "5,000+", label: "Active Students" },
    { icon: <Award className="w-8 h-8" />, value: "15+", label: "Expert Instructors" },
    { icon: <BookOpen className="w-8 h-8" />, value: "20+", label: "Courses" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "85%", label: "Career Growth" }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Excellence in Education",
      description: "We are committed to providing world-class education that meets global standards and prepares students for real-world challenges."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student-Centric Approach",
      description: "Every decision we make is centered around student success, ensuring personalized attention and comprehensive support."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Integrity & Trust",
      description: "We build lasting relationships through transparency, honesty, and delivering on our promises consistently."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Continuous Innovation",
      description: "We stay ahead of industry trends, constantly updating our curriculum to reflect the latest technologies and methodologies."
    }
  ];

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      qualification: "IIT Delhi, MBA IIM Ahmedabad",
      image: "RK",
      description: "20+ years of experience in EdTech and AI"
    },
    {
      name: "Priya Sharma",
      role: "Head of Curriculum",
      qualification: "PhD in Data Science, IIT Bombay",
      image: "PS",
      description: "Former Data Scientist at Google"
    },
    {
      name: "Amit Patel",
      role: "Director of Operations",
      qualification: "IIM Bangalore",
      image: "AP",
      description: "15+ years in Education Management"
    },
    {
      name: "Dr. Sneha Reddy",
      role: "Lead AI Instructor",
      qualification: "PhD in Machine Learning, MIT",
      image: "SR",
      description: "Published researcher and industry expert"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div
              onClick={() => window.location.href = "/"}
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
                onClick={() => window.location.href = "/login"}
                className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = "/register"}
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
                  onClick={() => window.location.href = "/login"}
                  className="w-full py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = "/register"}
                  className="w-full py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="bg-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            About Hilearn Academy
          </h1>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
            Empowering the next generation of tech professionals through industry-aligned education, expert mentorship, and comprehensive career support.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-lg text-emerald-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, Hilearn Academy emerged from a simple yet powerful vision: to bridge the gap between traditional education and industry demands in the rapidly evolving tech landscape.
                </p>
                <p>
                  Our founders, a group of IIT and IIM alumni with extensive experience in technology and education, recognized that many talented individuals were struggling to access quality, industry-relevant training that could truly transform their careers.
                </p>
                <p>
                  What started as a small initiative with just 50 students has grown into a thriving community of over 5,000+ learners. Today, we offer comprehensive programs in Data Science, AI, Analytics, and Digital Marketing, all designed and taught by industry experts.
                </p>
                <p>
                  Our success is measured not just in numbers, but in the stories of our students who have successfully transitioned into rewarding tech careers, launched their own ventures, or significantly advanced in their professional journeys.
                </p>
              </div>
            </div>
            <div className="bg-emerald-600 rounded-xl p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Industry-aligned curriculum updated quarterly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Live classes with IIT & IIM faculty</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Hands-on projects with real datasets</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Dedicated career support and placement assistance</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Lifetime access to course materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm mt-1 flex-shrink-0">✓</div>
                  <span>Active community of 5,000+ learners</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize quality tech education by making it accessible, affordable, and outcome-oriented. We strive to equip learners with the skills, knowledge, and confidence needed to excel in the digital economy and build fulfilling careers in technology.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's most trusted learning partner for tech professionals, recognized for our commitment to excellence, innovation, and student success. We envision a future where every aspiring tech professional has access to world-class education and career opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Hilearn Academy
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-emerald-600 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experienced professionals from IIT, IIM, and leading tech companies
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-xl overflow-hidden hover:border-emerald-600 transition-colors">
                <div className="bg-emerald-600 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold">
                    {member.image}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-emerald-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600 mb-3">{member.qualification}</p>
                  <p className="text-sm text-gray-700">{member.description}</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join thousands of students transforming their careers with Hilearn Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = "/courses"}
              className="px-8 py-3.5 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Explore Courses
            </button>
            <button
              onClick={() => window.location.href = "/contact"}
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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

const FooterLink = ({ text }) => (
  <li>
    <a href="#" className="hover:text-white transition-colors cursor-pointer">
      {text}
    </a>
  </li>
);

export default AboutUsPage;