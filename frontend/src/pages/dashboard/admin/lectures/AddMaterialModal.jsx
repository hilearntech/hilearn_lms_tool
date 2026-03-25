import { useState } from "react";
import { X, Upload, FileText } from "lucide-react";

const API = "http://https://hilearnlmstool-production.up.railway.app/api/materials/upload";

export default function AddMaterialModal({ lecture, onClose }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("notes");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadMaterial = async () => {
    if (!file || !title) return alert("Please fill all fields");
    setLoading(true);

    const form = new FormData();
    form.append("file", file);
    form.append("lectureId", lecture._id);
    form.append("type", type);
    form.append("title", title);

    try {
      const res = await fetch(API, { method: "POST", body: form });
      const data = await res.json();
      if (data.success) {
        alert("Uploaded successfully!");
        onClose();
      }
    } catch (err) { alert("Upload failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 text-[#059669]">
            <Upload size={20} />
            <h2 className="font-bold text-slate-800">Upload Resources</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Material Title</label>
            <input
              placeholder="e.g. Weekly Notes PDF"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-[#059669] text-sm"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase mb-2 block">Category</label>
            <select
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-[#059669] text-sm cursor-pointer"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="notes">Notes & PDF</option>
              <option value="quiz">Quiz Sheet</option>
              <option value="interview">Interview Questions</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#059669]/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="text-[#059669]" size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700">{file ? file.name : "Click to select file"}</p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, ZIP up to 10MB</p>
            </label>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex gap-3">
          <button
            onClick={uploadMaterial}
            disabled={loading}
            className="flex-1 bg-[#059669] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#047857] transition-all shadow-md active:scale-95 disabled:bg-emerald-200"
          >
            {loading ? "Uploading..." : "Confirm Upload"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-white transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}