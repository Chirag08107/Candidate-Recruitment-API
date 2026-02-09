const express = require("express");
const router = express.Router();

const {registerUser, loginUser} = require("../controllers/authController");
const {protect, authorize} = require("../middleware/authMiddleware");

router.post("/register",registerUser);
router.post("/login", loginUser);

router.get("/me",protect,(req,res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user
  });
});

router.get(
  "/recruiter-dashboard",
  protect,
  authorize("recruiter"),
  (req, res) => {
    res.json({
      message: "Welcome Recruiter"
    });
  }
);

module.exports = router;