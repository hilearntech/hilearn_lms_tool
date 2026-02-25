const express = require("express");
const router = express.Router();


const { protect } = require("../middleware/authMiddleware.js");
const { getAdminReports } = require("../controllers/adminReportController");

const {
    getAdminProfile,
    getDashboardStats,
    getAdmins,          
    addAdmin,           
    updateAdmin,        
    deleteAdmin,        
    toggleAdminStatus,
    getTransactions,
    submitContactForm,
    getAllContactLeads,
    getAllAssignmentsStatus,
    deleteAssignmentByAdmin,
    updateAssignmentByAdmin,
    createAnnouncement, 
    deleteAnnouncement,
    getAllAnnouncements,
    getAllStudentsForCert,
    issueCertificate,
    submitDemoRequest,
    updateRating,
    deleteLead,
    getSuperAdminStats
} = require("../controllers/adminController.js");

router.post("/contact/submit", submitContactForm);


router.get("/profile", protect, getAdminProfile);
router.get("/stats", protect, getDashboardStats);
router.get("/transactions", protect, getTransactions);

/* --- Assignment Monitoring --- */
router.get("/assignments-report", protect, getAllAssignmentsStatus);
router.delete("/delete-assignment/:id", protect, deleteAssignmentByAdmin);
router.put("/update-assignment/:id", protect, updateAssignmentByAdmin);

/* --- Enquiries/Leads --- */
router.get("/contact/leads", protect, getAllContactLeads);
router.post("/demo-request", submitDemoRequest);

/* --- Reports --- */
router.get("/reports-data", protect, getAdminReports);

/* --- Announcement System (FIXED) --- */

router.post('/announcement', protect, createAnnouncement);
router.get('/announcements', protect, getAllAnnouncements);
router.delete('/announcement/:id', protect, deleteAnnouncement);

/* --- Admin Management --- */
router.route("/manage-admins")
    .get(protect, getAdmins)
    .post(protect, addAdmin);

router.route("/manage-admins/:id")
    .put(protect, updateAdmin)
    .delete(protect, deleteAdmin);

router.post("/manage-admins/:id/status", protect, toggleAdminStatus);
router.get("/students-list", protect, getAllStudentsForCert); 
router.post("/issue-certificate", protect, issueCertificate); 

router.post("/update-rating", updateRating);
router.delete("/contact/delete/:id", protect, deleteLead);

router.get("/super-stats", protect, getSuperAdminStats);


module.exports = router;