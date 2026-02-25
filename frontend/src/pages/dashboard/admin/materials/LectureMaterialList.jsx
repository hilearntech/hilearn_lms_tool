import { useEffect, useState } from "react";

export default function LectureMaterialList({ lectureId }) {
  const [materials, setMaterials] = useState([]);

  const load = () => {
    fetch(`http://localhost:5000/api/materials/lecture/${lectureId}`)
      .then(res => res.json())
      .then(data => setMaterials(data.materials || []));
  };

  useEffect(load, [lectureId]);

  const remove = async (id) => {
    await fetch(`http://localhost:5000/api/materials/${id}`, { method:"DELETE" });
    load();
  };

  return (
    <div>
      {materials.map(m => (
        <div key={m._id} className="border p-2 mb-2 flex justify-between">
          <span>{m.title} ({m.type})</span>
          <button onClick={() => remove(m._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
