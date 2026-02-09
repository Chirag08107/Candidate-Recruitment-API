const Application = require("../models/Application");
const Job = require("../models/Job");

//applying for the job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status === "closed") {
      return res.status(400).json({ message: "Job is closed" });
    }

    if (job.currentApplicants >= job.maxApplicants) {
      job.status = "closed";
      await job.save();
      return res.status(400).json({ message: "Job is full" });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id
    });

    job.currentApplicants += 1;

    if (job.currentApplicants >= job.maxApplicants) {
      job.status = "closed";
    }

    await job.save();

    res.status(201).json({
      message: "Applied successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//basic pipeline for the application 
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { newStatus } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const allowedTransitions = {
      APPLIED: ["SCREENING"],
      SCREENING: ["INTERVIEW"],
      INTERVIEW: ["HIRED", "REJECTED"],
      HIRED: [],
      REJECTED: []
    };

    const currentStatus = application.status;

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      return res.status(400).json({
        message: `Cannot move from ${currentStatus} to ${newStatus}`
      });
    }

    application.status = newStatus;
    await application.save();

    res.status(200).json({
      message: "Application status updated",
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get the current status of the candidate's application 
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id
    })
      .populate("job", "title description location salary")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get the list of all the jobs as per the recruiter id 
exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure recruiter owns this job
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to view applications for this job"
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
