const Material = require("../models/Material");
const path = require("path");

/**
 * Upload material for a lecture
 * @route POST /api/materials/upload
 * @access Protected
 */
exports.uploadMaterial = async (req, res) => {
  try {
    const { lectureId, type, title } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const material = await Material.create({
      lecture: lectureId,
      type,
      title,
      fileUrl: `/uploads/materials/${req.file.filename}`, 
    });

    res.json({ success: true, material });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Get materials by lecture ID
 * @route GET /api/materials/:lectureId
 * @access Public / Protected (as per middleware)
 */
exports.getMaterialsByLecture = async (req, res) => {
  const materials = await Material.find({ lecture: req.params.lectureId });
  res.json({ success: true, materials });
};

/**
 * Download a material file (forces download with proper headers)
 * @route GET /api/materials/download/:id
 * @access Public (or protected if you want)
 */
exports.downloadMaterial = async (req, res) => {
  try {
    const mat = await Material.findById(req.params.id);
    if (!mat) return res.status(404).json({ success: false, error: "Material not found" });

    // material.fileUrl is stored like: /uploads/materials/filename.ext
    const filename = path.basename(mat.fileUrl);
    const filePath = path.join(__dirname, "..", "..", "uploads", "materials", filename);

    
    return res.download(filePath, (mat.title ? `${mat.title}${path.extname(filename)}` : filename), err => {
      if (err) {
        console.error("Material download error:", err);
        if (!res.headersSent) return res.status(500).json({ success: false, error: "Failed to download file" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
