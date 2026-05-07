import React, { useState } from 'react';
import { Video, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const BBBMeeting = ({ lectureId, lectureTitle, user, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinClass = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(
        `/bbb/join/${lectureId}?role=${user?.role || 'student'}&name=${encodeURIComponent(user?.name || 'Student')}`
      );

      const data = response.data;

      if (data.success && data.join_url) {
        window.open(data.join_url, '_blank');
        setLoading(false);
      } else {
        setError(data.message || 'Failed to get meeting link');
        setLoading(false);
      }
    } catch (err) {
      console.error('BBB Join Error:', err);
      setError('Could not connect to the server. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto mb-6">
          <Video size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Live Classroom</h2>
        <p className="text-slate-400 mb-8 text-sm font-bold uppercase">{lectureTitle}</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-left">
            <AlertCircle className="text-red-500 shrink-0" size={20} />
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleJoinClass}
          className="w-full bg-[#059669] text-white py-4 rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Video size={20} />}
          {loading ? "Connecting..." : "Join Now"}
        </button>

        <p className="mt-3 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
          Opens in a new tab
        </p>

        <button
          onClick={onClose}
          className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BBBMeeting;
