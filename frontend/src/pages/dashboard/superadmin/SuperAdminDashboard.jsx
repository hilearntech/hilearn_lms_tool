import React, { useEffect, useState } from 'react';
import { Users, BookOpen, IndianRupee, BarChart3 , Loader2 } from 'lucide-react';
import axios from 'axios';


const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: "₹0",
    totalStudents: 0,
    activeCourses: 0,
    totalInstructors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/admin/super-stats", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Super Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<IndianRupee />} title="Total Revenue" value={stats.totalRevenue} color="bg-green-500" />
        <StatCard icon={<Users />} title="Total Students" value={stats.totalStudents} color="bg-blue-500" />
        <StatCard icon={<BookOpen />} title="Active Courses" value={stats.activeCourses} color="bg-purple-500" />
        <StatCard icon={<BarChart3 />} title="Instructors" value={stats.totalInstructors} color="bg-orange-500" />
      </div>

      {/* Main Content Areas */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Course Management</h2>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm">Add New Course +</button>
          
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-500 text-sm italic">Tracking payments from Razorpay...</p>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
    <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default SuperAdminDashboard;