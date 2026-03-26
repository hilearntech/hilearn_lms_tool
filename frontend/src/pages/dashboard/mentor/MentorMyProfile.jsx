import React, { useState, useEffect } from "react";
import { User, Mail, Phone, ShieldCheck, Briefcase, BookOpen, Loader2 } from "lucide-react";
import axios from "axios";

const MentorMyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/mentor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setProfile(res.data.data);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-[#059669]" size={40} />
    </div>
  );

  return (
    // <div className="max-w-5xl mx-auto p-6">
    //   {/* Header Card */}
    //   <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
    //     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

    //     <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
    //       <div className="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-lg">
    //         <span className="text-4xl font-black text-emerald-600">
    //           {profile?.name?.charAt(0)}
    //         </span>
    //       </div>

    //       <div className="text-center md:text-left">
    //         <h1 className="text-3xl font-black text-slate-800 tracking-tight">{profile?.name}</h1>
    //         <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">{profile?.email}</p>
    //         <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
    //           <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
    //             Expert Mentor
    //           </span>
    //           <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">
    //             Active Member
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    //     {/* Account Information */}
    //     <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
    //       <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
    //         <User size={20} className="text-emerald-600" /> Personal Details
    //       </h2>

    //       <div className="space-y-6">
    //         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    //           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
    //           <div className="flex items-center gap-3 text-slate-700 font-bold">
    //             <User size={16} className="text-slate-400" /> {profile?.name}
    //           </div>
    //         </div>

    //         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    //           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
    //           <div className="flex items-center gap-3 text-slate-700 font-bold">
    //             <Mail size={16} className="text-slate-400" /> {profile?.email}
    //           </div>
    //         </div>

    //         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    //           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mobile Number</label>
    //           <div className="flex items-center gap-3 text-slate-700 font-bold">
    //             <Phone size={16} className="text-slate-400" /> {profile?.mobile || "Not Linked"}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Professional Details */}
    //     <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
    //       <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
    //         <ShieldCheck size={20} className="text-emerald-600" /> Account Status
    //       </h2>

    //       <div className="space-y-6">
    //         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    //           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Role</label>
    //           <div className="flex items-center gap-3 text-slate-700 font-bold uppercase text-sm">
    //             <Briefcase size={16} className="text-slate-400" /> {profile?.role}
    //           </div>
    //         </div>

    //         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    //           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Specialization</label>
    //           <div className="flex items-center gap-3 text-slate-700 font-bold">
    //             <BookOpen size={16} className="text-slate-400" /> Web Development & AI
    //           </div>
    //         </div>

    //         <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
    //           <div>
    //             <p className="text-emerald-800 font-black text-sm">Account Secure</p>
    //             <p className="text-emerald-600/70 text-[10px] font-bold">Your profile is verified</p>
    //           </div>
    //           <ShieldCheck className="text-emerald-500" size={32} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="max-w-5xl lg:max-w-6xl mx-auto p-4 sm:p-6">

      {/* Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 shadow-sm border border-slate-100 mb-6 sm:mb-8 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-50 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 opacity-50"></div>

        <div className="flex flex-col md:flex-row items-center gap-5 sm:gap-8 relative z-10">

          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-2xl sm:rounded-[2rem] flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600">
              {profile?.name?.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {profile?.name}
            </h1>

            <p className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider mt-1">
              {profile?.email}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 justify-center md:justify-start">
              <span className="px-3 sm:px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] sm:text-[10px] font-black uppercase">
                Expert Mentor
              </span>
              <span className="px-3 sm:px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] sm:text-[10px] font-black uppercase">
                Active Member
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">

        {/* Personal Details */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-slate-100">

          <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
            <User size={18} className="text-emerald-600" /> Personal Details
          </h2>

          <div className="space-y-4 sm:space-y-6">

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Full Name
              </label>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-bold text-sm sm:text-base">
                <User size={14} className="text-slate-400" /> {profile?.name}
              </div>
            </div>

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Email Address
              </label>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-bold text-sm sm:text-base">
                <Mail size={14} className="text-slate-400" /> {profile?.email}
              </div>
            </div>

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Mobile Number
              </label>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-bold text-sm sm:text-base">
                <Phone size={14} className="text-slate-400" /> {profile?.mobile || "Not Linked"}
              </div>
            </div>

          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 shadow-sm border border-slate-100">

          <h2 className="text-lg sm:text-xl font-black text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" /> Account Status
          </h2>

          <div className="space-y-4 sm:space-y-6">

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Role
              </label>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-bold uppercase text-sm">
                <Briefcase size={14} className="text-slate-400" /> {profile?.role}
              </div>
            </div>

            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border">
              <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase mb-1 block">
                Specialization
              </label>
              <div className="flex items-center gap-2 sm:gap-3 text-slate-700 font-bold text-sm sm:text-base">
                <BookOpen size={14} className="text-slate-400" /> Web Development & AI
              </div>
            </div>

            <div className="bg-emerald-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border flex items-center justify-between">
              <div>
                <p className="text-emerald-800 font-black text-xs sm:text-sm">Account Secure</p>
                <p className="text-emerald-600/70 text-[9px] sm:text-[10px] font-bold">
                  Your profile is verified
                </p>
              </div>
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MentorMyProfile;