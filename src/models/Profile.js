const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    skills: {
      type: [String],
      required:true
    },
    experience: {
      type: Number,
      required: true
    },
    education: {
      type: String
    },
    bio: {
      type: String
    },
    resume: {
      type: String
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);