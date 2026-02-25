import { useEffect, useState } from "react";
import AddEditMaterial from "./AddEditMaterial";

const API = "http://localhost:5000/api/materials";

const MaterialList = ({ lectureId }) => {
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = async () => {
    const res = await fetch(`${API}/lecture/${lectureId}`);
    const data = await res.json();
    if (data.success) setMaterials(data.materials);
  };

  useEffect(() => {
    fetchMaterials();
  }, [lectureId]);

  const deleteMaterial = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchMaterials();
  };

  return (
    <div>
      <AddEditMaterial lectureId={lectureId} refresh={fetchMaterials} />

      {materials.map((m) => (
        <div key={m._id} className="bg-slate-800 p-3 mb-2 rounded">
          <b>{m.title}</b> ({m.type})
          <p>{m.description}</p>

          {m.fileUrl && (
            <a href={m.fileUrl} target="_blank" className="text-blue-400">
              Open File
            </a>
          )}

          <button
            onClick={() => deleteMaterial(m._id)}
            className="text-red-400 ml-4"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default MaterialList;
