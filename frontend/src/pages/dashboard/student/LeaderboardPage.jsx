// import React from "react";
// import { Trophy, Medal, Star } from "lucide-react";

// const LeaderboardPage = () => {
//   const topStudents = [
//     { rank: 1, name: "Patel Harsh", points: 2450, avatar: "P" },
//     { rank: 2, name: "Rahul Sharma", points: 2300, avatar: "R" },
//     { rank: 3, name: "Anjali Gupta", points: 2150, avatar: "A" },
//     { rank: 4, name: "Smit Shah", points: 1900, avatar: "S" },
//   ];

//   return (
//     <div className="space-y-8 p-4">
//       {/* HEADER SECTION */}
//       <div className="text-center py-6">
//         <div className="relative inline-block">
//           <Trophy className="text-amber-500 mx-auto mb-4 drop-shadow-lg" size={54} />
//           <Star className="absolute -top-1 -right-4 text-emerald-400 animate-pulse" size={20} />
//         </div>
//         <h2 className="text-3xl font-black text-slate-800 tracking-tight">Global Leaderboard</h2>
//         <p className="text-slate-500 text-sm mt-2 font-medium">See where you stand among your peers.</p>
//       </div>

//       {/* LEADERBOARD LIST */}
//       <div className="max-w-2xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
//         {topStudents.map((s, index) => (
//           <div 
//             key={index} 
//             className={`flex items-center justify-between p-6 transition-colors hover:bg-slate-50 
//               ${index !== topStudents.length - 1 ? 'border-b border-slate-50' : ''} 
//               ${s.rank === 1 ? 'bg-amber-50/20' : ''}`}
//           >
//             <div className="flex items-center gap-6">
//               {/* RANK NUMBER */}
//               <span className={`w-8 text-lg font-black ${s.rank === 1 ? 'text-amber-500' : 'text-slate-400'}`}>
//                 #{s.rank}
//               </span>


//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border-2 
//                 ${s.rank === 1 ? 'bg-amber-500 text-white border-amber-200' : 'bg-[#059669] text-white border-emerald-100'}`}>
//                 {s.avatar}
//               </div>

//               {/* NAME AND BATCH */}
//               <div>
//                 <p className={`font-black text-lg ${s.rank === 1 ? 'text-slate-900' : 'text-slate-800'}`}>
//                   {s.name}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <div className={`w-1.5 h-1.5 rounded-full ${s.rank === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
//                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Batch B1</p>
//                 </div>
//               </div>
//             </div>

//             {/* POINTS SECTION */}
//             <div className="text-right">
//               <p className={`text-xl font-black ${s.rank === 1 ? 'text-amber-600' : 'text-[#059669]'}`}>
//                 {s.points.toLocaleString()}
//               </p>
//               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Points</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* FOOTER INFO (Optional) */}
//       <div className="text-center">
//         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 inline-block px-4 py-2 rounded-full">
//           Updated 5 minutes ago
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LeaderboardPage;


import React from "react";
import { Trophy, Medal, Star } from "lucide-react";

const LeaderboardPage = () => {
  const topStudents = [
    { rank: 1, name: "Patel Harsh", points: 2450, avatar: "P" },
    { rank: 2, name: "Rahul Sharma", points: 2300, avatar: "R" },
    { rank: 3, name: "Anjali Gupta", points: 2150, avatar: "A" },
    { rank: 4, name: "Smit Shah", points: 1900, avatar: "S" },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6">

      {/* HEADER SECTION */}
      <div className="text-center py-6">
        <div className="relative inline-block">
          <Trophy className="text-amber-500 mx-auto mb-4 drop-shadow-lg" size={44} />
          <Star className="absolute -top-1 -right-3 text-emerald-400 animate-pulse" size={16} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Global Leaderboard
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 font-medium px-2">
          See where you stand among your peers.
        </p>
      </div>

      {/* LEADERBOARD LIST */}
      <div className="max-w-2xl mx-auto bg-white rounded-[24px] sm:rounded-[32px] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">

        {topStudents.map((s, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 p-4 sm:p-6 transition-colors hover:bg-slate-50 
        ${index !== topStudents.length - 1 ? 'border-b border-slate-50' : ''} 
        ${s.rank === 1 ? 'bg-amber-50/20' : ''}`}
          >

            {/* LEFT SECTION */}
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">

              {/* RANK */}
              <span className={`w-6 sm:w-8 text-base sm:text-lg font-black ${s.rank === 1 ? 'text-amber-500' : 'text-slate-400'}`}>
                #{s.rank}
              </span>

              {/* AVATAR */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-sm border-2 
            ${s.rank === 1 ? 'bg-amber-500 text-white border-amber-200' : 'bg-[#059669] text-white border-emerald-100'}`}>
                {s.avatar}
              </div>

              {/* NAME */}
              <div className="min-w-0">
                <p className={`font-black text-base sm:text-lg truncate ${s.rank === 1 ? 'text-slate-900' : 'text-slate-800'}`}>
                  {s.name}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.rank === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Batch B1
                  </p>
                </div>
              </div>
            </div>

            {/* POINTS */}
            <div className="text-right sm:text-right w-full sm:w-auto">
              <p className={`text-lg sm:text-xl font-black ${s.rank === 1 ? 'text-amber-600' : 'text-[#059669]'}`}>
                {s.points.toLocaleString()}
              </p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Points
              </p>
            </div>

          </div>
        ))}

      </div>

      {/* FOOTER */}
      <div className="text-center">
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 inline-block px-4 py-2 rounded-full">
          Updated 5 minutes ago
        </p>
      </div>

    </div>
  );
};

export default LeaderboardPage;