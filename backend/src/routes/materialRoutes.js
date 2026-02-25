const express = require("express");
const router = express.Router();
const upload = require("../utils/upload");
const controller = require("../controllers/materialController");

router.post("/upload", upload.single("file"), controller.uploadMaterial);
router.get("/download/:id", controller.downloadMaterial);
router.get("/:lectureId", controller.getMaterialsByLecture);

module.exports = router;
