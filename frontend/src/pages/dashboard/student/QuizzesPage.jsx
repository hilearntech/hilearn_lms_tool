// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { HelpCircle, Clock, Award, ChevronRight, CheckCircle2, ArrowRight, Loader2, Trophy } from "lucide-react";

// const QuizzesPage = () => {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const fetchQuizzes = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/quizzes/all", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setQuizzes(res.data.quizzes || []);
//       }
//     } catch (err) {
//       console.error("Quiz Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuizzes();
//   }, []);

//   const startQuiz = (quiz) => {
//     if (quiz.isAttempted) return;
//     setActiveQuiz(quiz);
//     setCurrentQuestionIndex(0);
//     setScore(0);
//     setSelectedOption(null);
//     setAnswers([]);
//     setShowResult(false);
//   };

//   const handleNext = async () => {
//     const currentAnswer = { qIndex: currentQuestionIndex, selected: selectedOption };
//     const updatedAnswers = [...answers, currentAnswer];
//     setAnswers(updatedAnswers);

//     if (selectedOption === activeQuiz.questions[currentQuestionIndex].correctAnswer) {
//       setScore(prevScore => prevScore + 1);
//     }

//     if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOption(null);
//     } else {
//       await submitQuizToBackend(updatedAnswers);
//     }
//   };

//   const submitQuizToBackend = async (finalAnswers) => {
//     try {
//       setSubmitting(true);
//       const token = localStorage.getItem("token");
//       const courseId = activeQuiz.course?._id || activeQuiz.course;

//       const payload = {
//         quizId: activeQuiz._id,
//         courseId: courseId,
//         answers: finalAnswers
//       };

//       const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/quizzes/submit", payload, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (res.data.success) {
//         setShowResult(true);
//         fetchQuizzes();
//       }
//     } catch (err) {
//       console.error("Submission Error:", err);
//       setShowResult(true);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <Loader2 className="animate-spin text-[#059669] mb-2" size={40} />
//         <p className="text-slate-400 font-bold">Loading quizzes...</p>
//       </div>
//     );
//   }

//   if (showResult) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
//         <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center max-w-md w-full">
//           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
//             <Award size={40} />
//           </div>
//           <h2 className="text-3xl font-black text-slate-800">Quiz Result</h2>
//           <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">You Scored</p>
//           <div className="text-6xl font-black text-emerald-600 my-4">
//             {Math.round((score / activeQuiz.questions.length) * 100)}%
//           </div>
//           <p className="text-slate-600 font-bold mb-8">
//             You got {score} out of {activeQuiz.questions.length} correct!
//           </p>
//           <button
//             onClick={() => {
//               setActiveQuiz(null);
//               setShowResult(false);
//               navigate("/student/quizzes");
//             }}
//             className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg"
//           >
//             Back to Quizzes
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (activeQuiz) {
//     const currentQ = activeQuiz.questions[currentQuestionIndex];
//     return (
//       <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
//         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
//           <div>
//             <h3 className="font-black text-slate-800">{activeQuiz.title}</h3>
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//               Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
//             </p>
//           </div>
//           <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black">
//             {currentQuestionIndex + 1}
//           </div>
//         </div>

//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-800 mb-8">{currentQ.questionText}</h2>
//           <div className="grid grid-cols-1 gap-3">
//             {currentQ.options.map((opt, i) => (
//               <button
//                 key={i}
//                 onClick={() => setSelectedOption(opt)}
//                 className={`p-5 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center ${selectedOption === opt
//                     ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
//                     : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200"
//                   }`}
//               >
//                 {opt}
//                 {selectedOption === opt && <CheckCircle2 size={18} />}
//               </button>
//             ))}
//           </div>

//           <button
//             disabled={!selectedOption || submitting}
//             onClick={handleNext}
//             className="w-full mt-10 bg-[#059669] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
//           >
//             {submitting ? (
//               <Loader2 className="animate-spin" size={20} />
//             ) : (
//               <>
//                 {currentQuestionIndex + 1 === activeQuiz.questions.length ? "Finish & Submit" : "Next Question"}
//                 <ArrowRight size={18} />
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
//           <HelpCircle className="text-[#059669]" size={28} /> My Quizzes
//         </h2>
//         <p className="text-slate-500 text-sm font-medium">Test your knowledge and earn badges.</p>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         {quizzes.length > 0 ? quizzes.map((quiz) => (
//           <div key={quiz._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all group">
//             <div className="flex items-center gap-5">
//               <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-emerald-50 text-[#059669]">
//                 <Clock size={24} />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-slate-800">{quiz.title}</h3>
//                 <p className="text-xs text-slate-400 font-medium mt-1">
//                   {quiz.questions?.length} Questions • {quiz.duration || "15 min"}
//                 </p>
//               </div>
//             </div>


//             {quiz.isAttempted ? (
//               <div className="flex flex-col items-center justify-center gap-2 min-w-[140px]">
//                 {/* Score Badge */}
//                 <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 w-full justify-center">
//                   <Trophy size={14} className="animate-bounce" />
//                   <span className="text-xs font-black tracking-tight uppercase">
//                     Score: {quiz.userScore}%
//                   </span>
//                 </div>


//                 <div className="flex items-center gap-1.5 justify-center">
//                   <CheckCircle2 size={12} className="text-[#059669]" />
//                   <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest">
//                     Completed
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <button
//                 onClick={() => startQuiz(quiz)}
//                 className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg active:scale-95"
//               >
//                 Start Quiz <ChevronRight size={14} />
//               </button>
//             )}
//           </div>
//         )) : (
//           <p className="text-slate-400 font-bold text-center py-10">No quizzes available for your courses yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizzesPage;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HelpCircle, Clock, Award, ChevronRight, CheckCircle2, ArrowRight, Loader2, Trophy } from "lucide-react";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/quizzes/all", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setQuizzes(res.data.quizzes || []);
      }
    } catch (err) {
      console.error("Quiz Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const startQuiz = (quiz) => {
    if (quiz.isAttempted) return;
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setAnswers([]);
    setShowResult(false);
  };

  const handleNext = async () => {
    const currentAnswer = { qIndex: currentQuestionIndex, selected: selectedOption };
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);

    if (selectedOption === activeQuiz.questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      await submitQuizToBackend(updatedAnswers);
    }
  };

  const submitQuizToBackend = async (finalAnswers) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const courseId = activeQuiz.course?._id || activeQuiz.course;

      const payload = {
        quizId: activeQuiz._id,
        courseId: courseId,
        answers: finalAnswers
      };

      const res = await axios.post("https://hilearnlmstool-production.up.railway.app/api/quizzes/submit", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setShowResult(true);
        fetchQuizzes();
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setShowResult(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#059669] mb-2" size={40} />
        <p className="text-slate-400 font-bold">Loading quizzes...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Award size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Quiz Result</h2>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">You Scored</p>
          <div className="text-6xl font-black text-emerald-600 my-4">
            {Math.round((score / activeQuiz.questions.length) * 100)}%
          </div>
          <p className="text-slate-600 font-bold mb-8">
            You got {score} out of {activeQuiz.questions.length} correct!
          </p>
          <button
            onClick={() => {
              setActiveQuiz(null);
              setShowResult(false);
              navigate("/student/quizzes");
            }}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-lg"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const currentQ = activeQuiz.questions[currentQuestionIndex];
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-800">{activeQuiz.title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black">
            {currentQuestionIndex + 1}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-8">{currentQ.questionText}</h2>
          <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(opt)}
                className={`p-5 rounded-2xl text-left font-bold transition-all border-2 flex justify-between items-center ${selectedOption === opt
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
                  : "border-slate-50 bg-slate-50/50 text-slate-600 hover:border-slate-200"
                  }`}
              >
                {opt}
                {selectedOption === opt && <CheckCircle2 size={18} />}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedOption || submitting}
            onClick={handleNext}
            className="w-full mt-10 bg-[#059669] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-30 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                {currentQuestionIndex + 1 === activeQuiz.questions.length ? "Finish & Submit" : "Next Question"}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 md:px-6">

      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
          <HelpCircle className="text-[#059669]" size={24} />
          My Quizzes
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Test your knowledge and earn badges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quizzes.length > 0 ? quizzes.map((quiz) => (

          <div
            key={quiz._id}
            className="bg-white p-4 sm:p-6 rounded-[24px] border border-slate-100 shadow-sm 
        flex flex-col sm:flex-col md:flex-row md:items-center justify-between 
        gap-4 md:gap-0 hover:border-emerald-200 transition-all group"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-emerald-50 text-[#059669]">
                <Clock size={20} className="sm:w-6 sm:h-6" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {quiz.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">
                  {quiz.questions?.length} Questions • {quiz.duration || "15 min"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            {quiz.isAttempted ? (
              <div className="flex flex-col items-center justify-center gap-2 w-full md:w-auto md:min-w-[140px]">

                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 w-full justify-center">
                  <Trophy size={14} className="animate-bounce" />
                  <span className="text-[10px] sm:text-xs font-black tracking-tight uppercase">
                    Score: {quiz.userScore}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5 justify-center">
                  <CheckCircle2 size={12} className="text-[#059669]" />
                  <span className="text-[10px] font-bold text-[#059669] uppercase tracking-widest">
                    Completed
                  </span>
                </div>
              </div>

            ) : (
              <button
                onClick={() => startQuiz(quiz)}
                className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 md:py-2.5 rounded-xl text-[11px] md:text-xs font-black uppercase tracking-tight hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                Start Quiz <ChevronRight size={14} />
              </button>
            )}

          </div>

        )) : (
          <p className="text-slate-400 font-bold text-center py-10 text-sm">
            No quizzes available for your courses yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;