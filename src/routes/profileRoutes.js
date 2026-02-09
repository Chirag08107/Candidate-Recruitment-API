const express = require("express");
const router = express.Router();
const { createProfile, getMyProfile, updateProfile } = require("../controllers/profileController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  authorize("candidate"),
  createProfile
);

router.get(
  "/me",
  protect,
  authorize("candidate"),
  getMyProfile
);

router.put(
  "/",
  protect,
  authorize("candidate"),
  updateProfile
)

module.exports = router;
