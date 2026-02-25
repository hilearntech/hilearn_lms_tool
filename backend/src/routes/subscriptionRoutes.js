const express = require("express");
const router = express.Router();
const { getPlans } = require("../controllers/subscriptionController");

router.get("/", getPlans);

module.exports = router;