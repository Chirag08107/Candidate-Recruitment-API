const express = require("express");
const router = express.Router();
const { createJob, getAllJobs } = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("recruiter"), createJob);

router.get("/", getAllJobs);

module.exports = router;
