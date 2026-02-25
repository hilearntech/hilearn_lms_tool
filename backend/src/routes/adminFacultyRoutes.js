const express = require("express");
const controller = require("../controllers/adminFacultyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/faculties", controller.getFaculties);
router.post("/faculties", controller.addFaculty);
router.put("/faculties/:id", controller.updateFaculty);
router.post("/faculties/:id/status", controller.toggleFacultyStatus);
router.delete("/faculties/:id", controller.deleteFaculty);
router.post("/faculties/assign-course", controller.assignFacultyToCourse);

router.post("/faculties/complete-setup", protect, controller.completeFacultyProfileSetup);

module.exports = router;
