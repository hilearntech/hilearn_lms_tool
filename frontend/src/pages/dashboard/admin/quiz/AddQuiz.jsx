import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Save, Loader2, Edit3, X, Clock, BookOpen, HelpCircle } from "lucide-react";

const AddQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [quizData, setQuizData] = useState({
    title: "",
    course: "",
    duration: "15 min",
    questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/quizzes/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data.quizzes || res.data || []);
    } catch (err) { console.error("Fetch error", err); }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://hilearnlmstool-production.up.railway.app/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(data);
    } catch (err) {
      console.error("Course fetch error:", err);
      setCourses([]);
    }
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingId(quiz._id);
      setQuizData({
        title: quiz.title,
        course: quiz.course?._id || quiz.course || "",
        duration: quiz.duration,
        questions: quiz.questions
      });
    } else {
      setEditingId(null);
      setQuizData({
        title: "",
        course: "",
        duration: "15 min",
        questions: [{ questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
      });
    }
    setIsModalOpen(true);
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { questionText: "", options: ["", "", "", ""], correctAnswer: "" }]
    });
  };

  const removeQuestion = (index) => {
    const newQs = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: newQs });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://hilearnlmstool-production.up.railway.app/api/quizzes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuizzes();
    } catch (err) { alert("Delete failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `https://hilearnlmstool-production.up.railway.app/api/quizzes/update/${editingId}`
        : "https://hilearnlmstool-production.up.railway.app/api/quizzes/add";

      const res = await axios({
        method: editingId ? 'put' : 'post',
        url,
        data: quizData,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setIsModalOpen(false);
        fetchQuizzes();
      }
    } catch (err) {
      alert("Error saving quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#f8fafd] min-h-screen font-sans text-[#2d3748]">


      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-full">
            <HelpCircle className="text-[#059669]" size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">Quiz Dashboard</h1>
            <p className="text-[#059669] text-sm font-medium">View and manage your active quizzes</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#059669] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Quiz
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length > 0 ? quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-[#059669] bg-emerald-50 px-3 py-1 rounded-md uppercase tracking-widest">
                {quiz.course?.title || 'JAVA'}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(quiz)} className="text-slate-400 hover:text-emerald-600"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(quiz._id)} className="text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-[#2d3748] mb-6">{quiz.title}</h2>

            <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 border-t pt-4">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.duration}</span>
              <span className="flex items-center gap-1.5"><BookOpen size={14} /> {quiz.questions?.length} Questions</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No Quizzes Created Yet</p>
          </div>
        )}
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] rounded-xl overflow-hidden animate-in zoom-in-95">

            <div className="p-6 border-b border-slate-100 flex justify-between items-center px-10 bg-white">
              <h2 className="text-xl font-bold text-[#1a202c]">{editingId ? "Update Quiz" : "Create Quiz"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500"><X size={30} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto flex-1 bg-white">


              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quiz Title</label>
                  <input type="text" required className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.title} onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Course</label>
                  <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.course} onChange={(e) => setQuizData({ ...quizData, course: e.target.value })}>
                    <option value="">Choose Course</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</label>
                  <input type="text" className="w-full p-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:border-[#059669]" value={quizData.duration} onChange={(e) => setQuizData({ ...quizData, duration: e.target.value })} />
                </div>
              </div>


              <div className="space-y-8">
                <h3 className="text-xs font-bold text-[#059669] uppercase tracking-widest border-b pb-2">Questions</h3>

                {quizData.questions.map((q, qIdx) => (
                  <div key={qIdx} className="p-8 border border-slate-100 rounded-xl bg-slate-50/30 space-y-6 relative">
                    <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-6 right-6 text-red-300 hover:text-red-500"><Trash2 size={18} /></button>

                    <div className="space-y-2">
                      <input type="text" required placeholder={`Question ${qIdx + 1}`} className="w-full p-4 bg-white border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-emerald-500" value={q.questionText} onChange={(e) => {
                        const newQs = [...quizData.questions];
                        newQs[qIdx].questionText = e.target.value;
                        setQuizData({ ...quizData, questions: newQs });
                      }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <input key={oIdx} type="text" required placeholder={`Option ${oIdx + 1}`} className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-emerald-300 shadow-sm" value={opt} onChange={(e) => {
                          const newQs = [...quizData.questions];
                          newQs[qIdx].options[oIdx] = e.target.value;
                          setQuizData({ ...quizData, questions: newQs });
                        }} />
                      ))}
                    </div>

                    <select required className="w-full p-3 bg-white text-[#059669] border border-emerald-100 rounded-lg text-xs font-bold outline-none appearance-none cursor-pointer" value={q.correctAnswer} onChange={(e) => {
                      const newQs = [...quizData.questions];
                      newQs[qIdx].correctAnswer = e.target.value;
                      setQuizData({ ...quizData, questions: newQs });
                    }}>
                      <option value="">Set Correct Answer</option>
                      {q.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={addQuestion} className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-bold text-xs uppercase hover:text-[#059669] hover:border-[#059669] transition-all flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Question
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#059669] text-white rounded-xl font-bold text-xs uppercase hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {editingId ? "Update Quiz" : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuiz;