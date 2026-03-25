import React, { useEffect, useState } from 'react';
import { Video, Loader2 } from 'lucide-react';
import { ZoomMtg } from '@zoomus/websdk'; // Direct library use

const ZoomMeeting = ({ meetingDetails, user, onClose }) => {
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    window.ZoomMtg = ZoomMtg;


    ZoomMtg.setZoomJSLib('https://cdnjs.cloudflare.com/ajax/libs/zoomus-websdk/2.18.3/lib', '/av');
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
  }, []);

  const handleJoinViaSDK = async () => {
    setLoading(true);

    try {

      const response = await fetch('https://hilearnlmstool-production.up.railway.app/api/zoom/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingNumber: meetingDetails.number,
          role: user.role === 'mentor' ? 1 : 0
        })
      });

      const data = await response.json();
      const signature = data.signature;


      document.body.classList.add('showing-meeting');
      const zRoot = document.getElementById('zmmtg-root');
      if (zRoot) zRoot.style.display = 'block';


      ZoomMtg.init({
        leaveUrl: window.location.origin + '/student/schedule',
        patchJsMedia: true,
        success: () => {
          ZoomMtg.join({
            signature: signature,
            sdkKey: 'xbVTk8ArTnmjO0UVVqynqA',
            meetingNumber: meetingDetails.number,
            passWord: meetingDetails.password,
            userName: user.name,
            userEmail: user.email,
            success: () => {
              console.log("Meeting Joined!");
              setLoading(false);
            },
            error: (err) => {
              console.error("Join Error:", err);
              cleanupAndExit();
            }
          });
        },
        error: (err) => {
          console.error("Init Error:", err);
          cleanupAndExit();
        }
      });
    } catch (err) {
      console.error("System Error:", err);
      cleanupAndExit();
    }
  };

  const cleanupAndExit = () => {
    setLoading(false);
    document.body.classList.remove('showing-meeting');
    const zRoot = document.getElementById('zmmtg-root');
    if (zRoot) zRoot.style.display = 'none';
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/90 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto mb-6">
          <Video size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-1">Live Classroom</h2>
        <p className="text-slate-400 mb-8 text-sm font-bold uppercase">{meetingDetails.title}</p>

        <button
          disabled={loading}
          onClick={handleJoinViaSDK}
          className="w-full bg-[#059669] text-white py-4 rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Video size={20} />}
          {loading ? "Connecting..." : "Join Now"}
        </button>

        <button onClick={onClose} className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ZoomMeeting;