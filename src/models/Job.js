const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    skillsRequired: {
      type: [String],
      required: true
    },
    experienceRequired: {
      type: Number,
      required: true
    },
    location: {
      type: String
    },
    salary: {
      type: Number
    },
    maxApplicants: {
      type: Number,
      required: true
    },
    currentApplicants: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
