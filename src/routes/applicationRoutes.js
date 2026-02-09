const express = require("express");
const router = express.Router();
const { applyToJob, updateApplicationStatus, getMyApplications, getApplicationsForJob } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("candidate"), applyToJob);

router.put(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

router.get(
  "/my",
  protect,
  authorize("candidate"),
  getMyApplications
);

router.get(
  "/job/:jobId",
  protect,
  authorize("recruiter"),
  getApplicationsForJob
);

module.exports = router;
