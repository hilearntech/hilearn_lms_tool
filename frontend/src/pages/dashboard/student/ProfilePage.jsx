import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Shield, Lock, Monitor, CreditCard, Bell, LogOut, Camera, PlayCircle, FileText, Award, Calendar } from "lucide-react";

const ProfilePage = () => {
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  
  const [activeTab, setActiveTab] = useState("personal");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "personal", label: "Personal Details", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "device", label: "Devices", icon: <Monitor size={18} /> },
    { id: "payment", label: "Payments", icon: <CreditCard size={18} /> },
    { id: "notifications", label: "Alerts", icon: <Bell size={18} /> },
  ];

  
  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/students/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    } finally {
      setLoading(false);
    }
  };

  
  const markAllAsRead = async () => {
    if (unreadCount === 0) return; 
    try {
      await axios.put("https://hilearnlmstool-production.up.railway.app/api/students/notifications/mark-as-read", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

 
  useEffect(() => {
    fetchNotifications();
  }, []);

  
  useEffect(() => {
    if (activeTab === "notifications") {
      markAllAsRead();
    }
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative group">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-xl">
            {user?.name?.charAt(0)}
          </div>
          <button className="absolute -bottom-2 -right-2 bg-[#059669] text-white p-2 rounded-xl border-4 border-white group-hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-800">{user?.name || "Student Name"}</h2>
          <p className="text-slate-500 font-medium">{user?.email}</p>
          <div className="flex gap-2 mt-3 justify-center md:justify-start">
            <span className="px-3 py-1 bg-emerald-50 text-[#059669] text-[10px] font-black uppercase rounded-lg border border-emerald-100">
              {user?.role || "Student"}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100">
              Batch: Morning A1
            </span>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
          className="md:ml-auto flex items-center gap-2 px-6 py-3 border-2 border-rose-50 text-rose-500 font-bold rounded-2xl hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id
                ? "bg-[#059669] text-white shadow-lg shadow-emerald-100"
                : "bg-white text-slate-500 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon} {tab.label}
              </div>

              {tab.id === "notifications" && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-3 bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 min-h-[400px]">
          
          {/* PERSONAL TAB */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold">
                    <User size={18} className="text-[#059669]" /> {user?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold">
                    <Mail size={18} className="text-[#059669]" /> {user?.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Mobile Number</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold">
                    <Phone size={18} className="text-[#059669]" /> {user?.mobile || "Not Linked"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Account Status</label>
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-bold">
                    <Shield size={18} className="text-[#059669]" /> Active
                  </div>
                </div>
              </div>
              <button className="mt-4 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                Update Details
              </button>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-800">Recent Alerts</h3>
                <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">
                  {notifications.length} Total
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-medium italic">No new alerts found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((note) => (
                    <div
                      key={note._id}
                      className={`p-4 rounded-2xl border flex gap-4 items-start transition-all duration-500 ${
                        note.isRead ? 'bg-white border-slate-100' : 'bg-emerald-50 border-emerald-100 shadow-sm'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${
                        note.type === 'lecture' ? 'bg-blue-100 text-blue-600' :
                        note.type === 'assignment' ? 'bg-orange-100 text-orange-600' :
                        note.type === 'live' ? 'bg-rose-100 text-rose-600' :
                        note.type === 'certificate' ? 'bg-purple-100 text-purple-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {note.type === 'lecture' && <PlayCircle size={22} />}
                        {note.type === 'assignment' && <FileText size={22} />}
                        {note.type === 'live' && <Monitor size={22} />}
                        {note.type === 'certificate' && <Award size={22} />}
                        {!['lecture', 'assignment', 'live', 'certificate'].includes(note.type) && <Bell size={22} />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-black uppercase tracking-wider ${
                            note.type === 'live' ? 'text-rose-500' :
                            note.type === 'certificate' ? 'text-purple-500' :
                            'text-slate-400'
                          }`}>
                            {note.type === 'lecture' && '🎥 New Upload'}
                            {note.type === 'assignment' && '📝 Assignment'}
                            {note.type === 'live' && '🔴 Live Class'}
                            {note.type === 'certificate' && '🎓 Certificate Issued'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <Calendar size={10} /> {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 mt-1">{note.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{note.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Password & Security</h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-500 font-medium">Change your password to keep your account secure.</p>
                <input type="password" placeholder="Current Password" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-[#059669]" />
                <input type="password" placeholder="New Password" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-[#059669]" />
                <button className="px-8 py-3 bg-[#059669] text-white font-bold rounded-xl">Change Password</button>
              </div>
            </div>
          )}

          {/* DEVICE TAB */}
          {activeTab === "device" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Active Sessions</h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Monitor className="text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Windows PC • Chrome Browser</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Current Device • Surat, India</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#059669] bg-emerald-50 px-2 py-1 rounded">ONLINE</span>
              </div>
            </div>
          )}

          {/* PAYMENTS TAB */}
          {activeTab === "payment" && (
             <div className="py-20 text-center animate-in fade-in duration-300">
               <CreditCard size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 italic">No transaction history found.</p>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;