import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Users, GraduationCap, TrendingUp, Search, Award, AlertCircle, ArrowUpRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportManagement = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://https://hilearnlmstool-production.up.railway.app/api/admin/reports-data", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();

      // 1. Header
      doc.setFontSize(22);
      doc.setTextColor(16, 185, 129); // Emerald color
      doc.text("HiLearn Academy - Report", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
      doc.line(14, 32, 196, 32);

      // 2. Summary Table (using autoTable function directly)
      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Total Students', data?.stats?.totalStudents || '0'],
          ['Active Batches', data?.stats?.activeBatches || '0'],
          ['Avg. Attendance', `${data?.stats?.avgAttendanceOverall || '0'}%`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
      });

      // 3. Top Performers
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.text("Top Performing Students", 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Rank', 'Name', 'Score']],
        body: data?.topStudents?.map((s, i) => [i + 1, s.name, `${s.score}%`]) || [],
        headStyles: { fillColor: [59, 130, 246] }
      });

      // 4. Full Batch Breakdown
      doc.text("Batch Attendance Breakdown", 14, doc.lastAutoTable.finalY + 15);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Batch Name', 'Attendance']],
        body: data?.batchWiseAttendance?.map(b => [b.name, `${b.attendance}%`]) || [],
        headStyles: { fillColor: [107, 114, 128] }
      });

      doc.save(`HiLearn_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("PDF download nahi ho pa rahi. Console check karein.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-emerald-600 font-bold animate-pulse">Generating Academy Insights...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h2>
          <p className="text-gray-500 text-sm font-medium">Data-driven insights for HiLearn Management</p>
        </div>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" /> Export PDF Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard icon={<Users />} label="Total Students" value={data?.stats?.totalStudents} color="bg-blue-600" bgColor="bg-blue-50" />
        <StatsCard icon={<GraduationCap />} label="Active Batches" value={data?.stats?.activeBatches} color="bg-emerald-600" bgColor="bg-emerald-50" />
        <StatsCard icon={<TrendingUp />} label="Avg. Attendance" value={`${data?.stats?.avgAttendanceOverall}%`} color="bg-purple-600" bgColor="bg-purple-50" />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartContainer title="Batch Attendance Status (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.batchWiseAttendance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="attendance" fill="#10b981" radius={[6, 6, 0, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Monthly Admission Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.admissionsTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* NEW: Top Performers & Low Attendance Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Performers */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="text-amber-500 w-6 h-6" />
              <h3 className="font-bold text-gray-800 text-lg">Top Performing Students</h3>
            </div>
            <ArrowUpRight className="text-gray-300 w-5 h-5" />
          </div>
          <div className="space-y-4">
            {data?.topStudents?.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center font-bold text-emerald-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 group-hover:text-emerald-700">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-black">{student.score}%</span>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Score</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Alerts */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="text-rose-500 w-6 h-6" />
            <h3 className="font-bold text-gray-800 text-lg">Attendance Alerts (Below 75%)</h3>
          </div>
          <div className="space-y-4">
            {data?.batchWiseAttendance?.filter(b => b.attendance < 75).length > 0 ? (
              data?.batchWiseAttendance?.filter(b => b.attendance < 75).map((batch, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <div>
                    <p className="font-bold text-rose-900">{batch.name}</p>
                    <p className="text-xs text-rose-600 font-medium">Critical Attendance level</p>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-xl text-rose-600 font-black shadow-sm border border-rose-100">
                    {batch.attendance}%
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 opacity-60">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 text-2xl">🎉</div>
                <p className="text-emerald-800 font-bold">All batches are doing great!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Table Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-black text-gray-800 text-lg tracking-tight">Detailed Batch Performance</h3>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search batch name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Batch Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Attendance Progress</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.batchWiseAttendance
                ?.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((batch, i) => (
                  <tr key={i} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-800">{batch.name}</p>
                      <p className="text-xs text-gray-400 font-medium">Standard Academic Batch</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100">Active</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden min-w-[120px]">
                          <div
                            className={`h-full transition-all duration-1000 ${batch.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                            style={{ width: `${batch.attendance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-black text-gray-700">{batch.attendance}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, label, value, color, bgColor }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:translate-y-[-4px] transition-all cursor-default">
    <div className={`w-16 h-16 ${bgColor} ${color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h4>
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col h-[450px]">
    <h3 className="font-bold text-gray-800 mb-8 text-lg flex items-center gap-2">
      <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
      {title}
    </h3>
    <div className="flex-1 w-full min-h-[300px] relative">
      {children}
    </div>
  </div>
);

export default ReportManagement;