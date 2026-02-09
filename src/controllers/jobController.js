const Job = require("../models/Job");

//job created by the recruiter
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

//job listing should be public 
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" });

    res.status(200).json(jobs);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
