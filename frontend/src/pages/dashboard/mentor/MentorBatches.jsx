// import React, { useState, useEffect } from "react";
// import api from "../../../services/api";

// const MentorBatches = () => {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await api.get("/mentor/profile");

//         console.log("Mentor Profile Data:", res.data);


//         setBatches(res.data.data.enrolledBatches || []);
//       } catch (err) {
//         console.error("Error fetching batches:", err);
//       }
//     };
//     fetchBatches();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {batches.map(batch => (
//         <div key={batch._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-[#059669] transition-all">
//           <h3 className="text-xl font-bold text-slate-800">{batch.name}</h3>
//           <p className="text-slate-500 mb-4">{batch.course?.title}</p>
//           <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
//             <span className="text-sm font-medium text-slate-600">👥 {batch.students?.length} Students</span>
//             <button
//               onClick={() => {
//                 setSelectedBatch(batch);
//                 setShowModal(true);
//               }}
//               className="text-[#059669] font-bold text-sm hover:underline"
//             >
//               View Details
//             </button>
//             {/* BATCH DETAIL MODAL */}
//             {showModal && selectedBatch && (
//               <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                 <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

//                   {/* Header */}
//                   <div className="p-6 border-b bg-emerald-50 flex justify-between items-center">
//                     <div>
//                       <h2 className="text-2xl font-bold text-emerald-900">{selectedBatch.name}</h2>
//                       <p className="text-emerald-600 font-medium">Course: {selectedBatch.course?.title}</p>
//                     </div>
//                     <button
//                       onClick={() => setShowModal(false)}
//                       className="text-gray-400 hover:text-red-500 text-3xl transition-colors"
//                     >
//                       &times;
//                     </button>
//                   </div>

//                   <div className="p-6 overflow-y-auto space-y-6 no-scrollbar">
//                     {/* Quick Stats Section */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
//                         <p className="text-xl font-black text-slate-800">{selectedBatch.students?.length || 0}</p>
//                       </div>
//                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
//                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Batch Status</p>
//                         <p className={`text-xl font-black ${selectedBatch.isActive ? 'text-emerald-600' : 'text-red-500'}`}>
//                           {selectedBatch.isActive ? 'Active' : 'Inactive'}
//                         </p>
//                       </div>
//                     </div>

//                     {/* Students List Table */}
//                     <div>
//                       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
//                         <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
//                         Enrolled Students List
//                       </h3>

//                       <div className="border rounded-xl overflow-hidden shadow-sm">
//                         <table className="w-full text-sm">
//                           <thead className="bg-slate-100 text-slate-600">
//                             <tr>
//                               <th className="p-3 text-left font-semibold">Student Name</th>
//                               <th className="p-3 text-left font-semibold">Email Address</th>
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y divide-slate-100">
//                             {selectedBatch.students && selectedBatch.students.length > 0 ? (
//                               selectedBatch.students.map((student, index) => (
//                                 <tr key={index} className="hover:bg-emerald-50/30 transition-colors">
//                                   <td className="p-3 font-medium text-slate-700">{student.name}</td>
//                                   <td className="p-3 text-slate-500">{student.email}</td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="2" className="p-10 text-center text-slate-400 italic">
//                                   No students found in this batch.
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="p-4 border-t bg-slate-50 flex justify-end">
//                     <button
//                       onClick={() => setShowModal(false)}
//                       className="px-8 py-2.5 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#065f46] transition-all shadow-md active:scale-95"
//                     >
//                       Close Detail
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };



// export default MentorBatches;

import React, { useState, useEffect } from "react";
import api from "../../../services/api";

const MentorBatches = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get("/mentor/profile");
        // console.log("Mentor Profile Data:", res.data);
        setBatches(res.data.data.enrolledBatches || []);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchBatches();
  }, []);

  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-0">
        {batches.length > 0 ? (
          batches.map((batch) => (
            <div
              key={batch._id}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 hover:border-[#059669] transition-all"
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {batch.name}
              </h3>

              <p className="text-slate-500 text-sm sm:text-base mb-3 sm:mb-4">
                {batch.course?.title}
              </p>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 bg-slate-50 p-3 rounded-xl">
                
                <span className="text-xs sm:text-sm font-medium text-slate-600">
                  👥 {batch.students?.length} Students
                </span>

                <button
                  onClick={() => {
                    setSelectedBatch(batch);
                    setShowModal(true);
                  }}
                  className="text-[#059669] font-bold text-xs sm:text-sm hover:underline text-left sm:text-right"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-slate-400 italic py-10">
            No batches found.
          </p>
        )}
      </div>

      {/* ✅ MODAL (FIXED POSITION - OUTSIDE MAP) */}
      {showModal && selectedBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b bg-emerald-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-emerald-900">
                  {selectedBatch.name}
                </h2>
                <p className="text-emerald-600 text-xs sm:text-sm font-medium">
                  Course: {selectedBatch.course?.title}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-500 text-2xl sm:text-3xl"
              >
                &times;
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 no-scrollbar">
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                    Total Students
                  </p>
                  <p className="text-lg sm:text-xl font-black text-slate-800">
                    {selectedBatch.students?.length || 0}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">
                    Batch Status
                  </p>
                  <p
                    className={`text-lg sm:text-xl font-black ${
                      selectedBatch.isActive
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {selectedBatch.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              {/* Students List */}
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 uppercase mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
                  Enrolled Students List
                </h3>

                <div className="border rounded-xl overflow-x-auto sm:overflow-hidden shadow-sm">
                  <table className="w-full text-xs sm:text-sm min-w-[400px] sm:min-w-full">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="p-2 sm:p-3 text-left font-semibold">
                          Student Name
                        </th>
                        <th className="p-2 sm:p-3 text-left font-semibold">
                          Email Address
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {selectedBatch.students &&
                      selectedBatch.students.length > 0 ? (
                        selectedBatch.students.map((student, index) => (
                          <tr
                            key={index}
                            className="hover:bg-emerald-50/30 transition-colors"
                          >
                            <td className="p-2 sm:p-3 font-medium text-slate-700">
                              {student.name}
                            </td>
                            <td className="p-2 sm:p-3 text-slate-500">
                              {student.email}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="p-6 sm:p-10 text-center text-slate-400 italic"
                          >
                            No students found in this batch.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 bg-[#059669] text-white rounded-xl font-bold hover:bg-[#065f46] transition-all shadow-md active:scale-95 text-sm"
              >
                Close Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorBatches;