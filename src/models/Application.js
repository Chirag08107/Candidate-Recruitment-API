const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["APPLIED", "SCREENING", "INTERVIEW", "HIRED", "REJECTED"],
      default: "APPLIED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
