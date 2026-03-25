import { useState } from "react";
import { X, Upload, Loader2, FileCheck } from "lucide-react";

const AddEditMaterial = ({ lecture, refresh, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("notes");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("lectureId", lecture?._id);
    formData.append("file", file); 

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://hilearnlmstool-production.up.railway.app/api/materials/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (typeof refresh === 'function') refresh();
        onClose();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="bg-[#059669] p-5 text-white flex justify-between">
          <h3 className="font-bold">Upload Local File</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input 
            placeholder="Title" 
            className="w-full p-3 bg-slate-50 rounded-xl border"
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* File Picker */}
          <div className="border-2 border-dashed border-emerald-100 rounded-2xl p-6 text-center bg-emerald-50/30">
            <input 
              type="file" 
              id="fileInput" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="text-emerald-500" size={32} />
              <span className="text-xs font-bold text-slate-500">
                {file ? file.name : "Click to select PDF/Doc"}
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#059669] text-white py-4 rounded-2xl font-bold">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "START UPLOAD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditMaterial;