import { useEffect, useState } from "react";
import AddMaterialModal from "./AddMaterialModal";
import LectureMaterialList from "./LectureMaterialList";

export default function MaterialManager() {
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then(res => res.json())
      .then(data => setLectures(data.lectures || []));
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">Lecture Materials</h1>

      <select
        className="border p-2 mb-4"
        onChange={e => setSelectedLecture(e.target.value)}
      >
        <option>Select Lecture</option>
        {lectures.map(l => (
          <option key={l._id} value={l._id}>{l.title}</option>
        ))}
      </select>

      {selectedLecture && (
        <>
          <AddMaterialModal lectureId={selectedLecture} />
          <LectureMaterialList lectureId={selectedLecture} />
        </>
      )}

    </div>
  );
}
