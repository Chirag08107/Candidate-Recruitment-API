const Profile = require("../models/Profile");

//creating user profile
exports.createProfile = async (req, res) => {
  try {
    const {skills, experience, education, bio, resume, location} = req.body;

    const profile = await Profile.create({
      user: req.user.id, //comes from middleware
      skills,
      experience,
      education,
      bio,
      resume,
      location
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//accessing file if the user needs
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//updating the file 
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    const { skills, experience, education, bio, resume, location } = req.body;

    if (skills) profile.skills = skills;
    if (experience) profile.experience = experience;
    if (education) profile.education = education;
    if (bio) profile.bio = bio;
    if (resume) profile.resume = resume;
    if (location) profile.location = location;

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

